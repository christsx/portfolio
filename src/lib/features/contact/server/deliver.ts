type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export async function sendViaFormSubmit(
  fetchFn: typeof fetch,
  contactToEmail: string,
  input: ContactMessage,
): Promise<boolean> {
  const endpoint = `https://formsubmit.co/ajax/${encodeURIComponent(contactToEmail)}`;

  try {
    const response = await fetchFn(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        _replyto: input.email,
        _subject: `[Portfolio] ${input.subject}`,
        message: input.message,
      }),
    });

    if (!response.ok) {
      console.error("[contact] FormSubmit error:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[contact] FormSubmit request failed:", error);
    return false;
  }
}

export async function sendViaSlackWebhook(
  fetchFn: typeof fetch,
  webhookUrl: string,
  input: ContactMessage,
): Promise<boolean> {
  const text = [
    "*New portfolio contact*",
    `*From:* ${input.name} <${input.email}>`,
    `*Phone:* ${input.phone}`,
    `*Subject:* ${input.subject}`,
    "",
    input.message,
  ].join("\n");

  try {
    const response = await fetchFn(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      console.error("[contact] Slack webhook error:", response.status, await response.text());
      return false;
    }

    return true;
  } catch (error) {
    console.error("[contact] Slack webhook request failed:", error);
    return false;
  }
}
