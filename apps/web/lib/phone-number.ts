export type PhoneNumberValidationResult = {
  is_valid: boolean;
  error?: string;
};

export async function validatePhoneNumber(
  phone: string
): Promise<PhoneNumberValidationResult> {
  const trimmed = (phone || '').trim();
  if (!trimmed) return { is_valid: false, error: 'Empty phone' };

  const digits = trimmed.replace(/\D/g, '');

  try {
    const url = `/api/validators/phone?phone=${encodeURIComponent(digits)}`;

    const resp = await fetch(url);

    if (!resp.ok) {
      return { is_valid: false };
    }

    const data = (await resp.json()) as PhoneNumberValidationResult;

    if (typeof data?.is_valid !== 'boolean') {
      return { is_valid: false };
    }

    return data;
  } catch (err) {
    console.error('Error while validating phone number: ', err);
    return { is_valid: false };
  }
}
