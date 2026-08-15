import { describe, expect, it } from "vitest";
import { authorizedAdminEmails, isAuthorizedAdminEmail, roleForAuthenticatedEmail } from "./adminPolicy";

describe("Elite Traders administrator policy", () => {
  it("grants the only two approved email addresses the admin role", () => {
    expect(authorizedAdminEmails).toEqual(["roonakyadav1609@gmail.com", "elitetradersfcm@gmail.com"]);
    expect(roleForAuthenticatedEmail("roonakyadav1609@gmail.com")).toBe("admin");
    expect(roleForAuthenticatedEmail("ELITETRADERSFCM@GMAIL.COM")).toBe("admin");
  });

  it("keeps every other identity out of the administrator policy", () => {
    expect(isAuthorizedAdminEmail("labumarnus7@gmail.com")).toBe(false);
    expect(roleForAuthenticatedEmail(null)).toBe("user");
    expect(roleForAuthenticatedEmail("other@example.com")).toBe("user");
  });
});
