import { formatPhoneNumberIntl } from "react-phone-number-input";

/**
 * Display format for stored phone numbers — international grouping
 * (e.g. "+972 50 123 4567"), falling back to the raw string when the number
 * can't be parsed. Single source of truth for every surface that shows a
 * phone number (admin dialogs, profile cards, requests, visit history).
 */
export function formatPhone(phoneNumber: string): string {
  return formatPhoneNumberIntl(phoneNumber) || phoneNumber;
}
