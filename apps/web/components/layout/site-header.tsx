import Link from "next/link";
import { buttonClassName } from "@property-lk/ui";
import { LogoutButton } from "../auth/logout-button";
import { getSessionUser } from "../../lib/auth";
import { SiteNavigation } from "./site-navigation";

export async function SiteHeader() {
  const user = await getSessionUser();

  return (
    <header className="header site-shell">
      <Link className="brand" href="/">
        <span className="brand-mark" aria-hidden="true" />
        <span>Property LK</span>
      </Link>
      <SiteNavigation />
      <div className="toolbar toolbar--actions">
        {user ? (
          <>
            <Link className={buttonClassName({ size: "sm", variant: "secondary" })} href="/saved/listings">
              Saved
            </Link>
            <Link className={buttonClassName({ size: "sm", variant: "secondary" })} href="/account">
              {user.name ?? "Account"}
            </Link>
            <LogoutButton />
          </>
        ) : (
          <>
            <Link className={buttonClassName({ size: "sm", variant: "ghost" })} href="/login">
              Log in
            </Link>
            <Link className={buttonClassName({ size: "sm", variant: "primary" })} href="/signup">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
