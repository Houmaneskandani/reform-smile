import { SITE_CONFIG } from "./constants";
import { trackEvent } from "./tracking";

export async function submitForm(
  data: Record<string, string>,
  formName: string
): Promise<{ success: boolean; message: string }> {
  const key = SITE_CONFIG.web3formsKey;

  // Track form submission
  const eventName = formName.toLowerCase().includes("consult")
    ? "consultation_booked" as const
    : "form_submitted" as const;
  trackEvent(eventName, { form: formName });

  if (!key) {
    return { success: true, message: "Form submitted (demo mode)" };
  }

  try {
    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        access_key: key,
        subject: `New ${formName} — ${SITE_CONFIG.name}`,
        from_name: SITE_CONFIG.name,
        ...data,
      }),
    });

    const result = await response.json();

    if (result.success) {
      return { success: true, message: "Form submitted successfully" };
    } else {
      return { success: false, message: "Something went wrong. Please try again." };
    }
  } catch {
    return { success: false, message: "Network error. Please try again." };
  }
}
