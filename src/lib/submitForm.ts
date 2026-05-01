import { SITE_CONFIG } from "./constants";

export async function submitForm(
  data: Record<string, string>,
  formName: string
): Promise<{ success: boolean; message: string }> {
  const key = SITE_CONFIG.web3formsKey;

  if (!key) {
    // No API key configured — log locally and show success
    // Remove this fallback once the key is added
    console.warn(`[${formName}] No Web3Forms key configured. Form data:`, data);
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
