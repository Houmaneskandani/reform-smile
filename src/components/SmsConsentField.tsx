"use client";

import type { UseFormRegisterReturn } from "react-hook-form";
import { SMS_CONSENT_TEXT } from "@/lib/leads";

/**
 * The optional text-message consent box (unticked by default) on the Contact, Book and Free
 * Consultation forms. Shown only while the lead forward to Marketing Ava is on: the forms get
 * a `leadForm` prop from their page then. The wording is fixed (see src/lib/leads.ts).
 */
export default function SmsConsentField({
  id,
  registration,
}: {
  id: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        {...registration}
        id={id}
        type="checkbox"
        defaultChecked={false}
        className="mt-0.5 h-4 w-4 flex-shrink-0 cursor-pointer accent-navy"
      />
      <label htmlFor={id} className="cursor-pointer text-gray text-xs leading-relaxed">
        {SMS_CONSENT_TEXT}
      </label>
    </div>
  );
}
