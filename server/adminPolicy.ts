export const authorizedAdminEmails = [
  "roonakyadav1609@gmail.com",
  "elitetradersfcm@gmail.com",
] as const;

const authorizedAdminEmailSet = new Set(authorizedAdminEmails);

export function isAuthorizedAdminEmail(email: string | null | undefined) {
  return typeof email === "string" && authorizedAdminEmailSet.has(email.trim().toLowerCase() as (typeof authorizedAdminEmails)[number]);
}

export function roleForAuthenticatedEmail(email: string | null | undefined) {
  return isAuthorizedAdminEmail(email) ? "admin" : "user";
}
