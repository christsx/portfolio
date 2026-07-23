import { json } from "@sveltejs/kit";
import { contactFormSchema } from "$lib/validation/contact";
import { TURNSTILE_ACTION, uniqueNonEmptyMessages } from "$lib/features/contact/shared";
import { resolvePrivateValue } from "$lib/features/contact/server/env";
import { sendContactEmail } from "$lib/features/contact/server/email";
import { sendViaFormSubmit, sendViaSlackWebhook } from "$lib/features/contact/server/deliver";
import { extractWebsiteField } from "$lib/features/contact/server/honeypot";
import { resolveIp } from "$lib/features/contact/server/ip";
import { hasRecentSubmission } from "$lib/features/contact/server/rate-limit";
import { verifyTurnstileToken } from "$lib/features/contact/server/turnstile";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request, fetch, platform, getClientAddress }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ success: false, message: "Invalid request payload." }, { status: 400 });
  }

  const websiteField = extractWebsiteField(body);
  if (websiteField.length > 0) {
    return json({ success: true }, { status: 200 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    const errors = uniqueNonEmptyMessages(parsed.error.issues.map((issue) => issue.message));

    return json(
      {
        success: false,
        message: errors[0] ?? "Invalid contact form values.",
        errors,
      },
      { status: 400 },
    );
  }

  const { name, email, phone, subject, message, turnstileToken } = parsed.data;
  const contactMessage = { name, email, phone, subject, message };

  const ip = resolveIp(request.headers, getClientAddress);
  if (hasRecentSubmission(ip)) {
    return json(
      {
        success: false,
        message: "You're sending messages too quickly. Please wait a moment and try again.",
      },
      { status: 429 },
    );
  }

  const resendApiKey = resolvePrivateValue(platform?.env, "RESEND_API_KEY");
  const contactToEmail = resolvePrivateValue(platform?.env, "CONTACT_TO_EMAIL");
  const contactFromEmail =
    resolvePrivateValue(platform?.env, "CONTACT_FROM_EMAIL") ?? "Portfolio Contact <onboarding@resend.dev>";
  const turnstileSecretKey = resolvePrivateValue(platform?.env, "TURNSTILE_SECRET_KEY");
  const slackWebhookUrl = resolvePrivateValue(platform?.env, "SLACK_WEBHOOK_URL");

  if (!contactToEmail && !slackWebhookUrl) {
    return json(
      {
        success: false,
        message: "Contact delivery is not configured.",
      },
      { status: 503 },
    );
  }

  if (turnstileSecretKey) {
    if (!turnstileToken || turnstileToken.length === 0) {
      return json(
        {
          success: false,
          message: "Please complete the anti-bot verification and try again.",
        },
        { status: 400 },
      );
    }

    const turnstileVerification = await verifyTurnstileToken(fetch, turnstileSecretKey, turnstileToken, ip);
    if (!turnstileVerification.success || turnstileVerification.action !== TURNSTILE_ACTION) {
      console.error("Turnstile rejected contact request:", turnstileVerification.errorCodes);
      return json(
        {
          success: false,
          message: "Please complete the anti-bot verification and try again.",
        },
        { status: 400 },
      );
    }
  }

  const deliveries: Promise<boolean>[] = [];

  if (contactToEmail) {
    if (resendApiKey) {
      deliveries.push(
        sendContactEmail(fetch, {
          resendApiKey,
          contactFromEmail,
          contactToEmail,
          ...contactMessage,
        }),
      );
    } else {
      deliveries.push(sendViaFormSubmit(fetch, contactToEmail, contactMessage));
    }
  }

  if (slackWebhookUrl) {
    deliveries.push(sendViaSlackWebhook(fetch, slackWebhookUrl, contactMessage));
  }

  const results = await Promise.all(deliveries);
  if (!results.some(Boolean)) {
    return json({ success: false, message: "Failed to deliver your message." }, { status: 502 });
  }

  return json({ success: true }, { status: 200 });
};
