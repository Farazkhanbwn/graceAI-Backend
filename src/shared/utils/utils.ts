export function normalizeEmail(email: string): string {
  if (!email) return email;

  const trimmedEmail = email.trim().toLowerCase();

  // Check if it's a Gmail address
  if (trimmedEmail.includes('@gmail.com')) {
    const [localPart, domain] = trimmedEmail.split('@');

    // Remove everything after '+' in the local part for Gmail
    const normalizedLocalPart = localPart.split('+')[0];

    return `${normalizedLocalPart}@${domain}`;
  }

  // For non-Gmail addresses, just return lowercase trimmed version
  return trimmedEmail;
}
