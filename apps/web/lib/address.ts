export type PostalCodeValidationResult = {
  is_valid: boolean;
  postal_code?: string;
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  error?: string;
};

export async function validatePostalCode(
  code: string,
  country = 'US'
): Promise<PostalCodeValidationResult> {
  const trimmed = (code || '').trim();
  if (!trimmed) return { is_valid: false, error: 'Empty code' };

  try {
    const url = `/api/address?code=${encodeURIComponent(
      trimmed
    )}&country=${encodeURIComponent(country)}`;

    const resp = await fetch(url);

    if (!resp.ok) {
      return { is_valid: false };
    }

    const data = (await resp.json()) as PostalCodeValidationResult;

    if (typeof data?.is_valid !== 'boolean') {
      return { is_valid: false };
    }

    return data;
  } catch (err) {
    console.error('Error while validating postal code: ', err);
    return { is_valid: false };
  }
}
