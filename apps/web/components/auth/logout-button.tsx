import { Button } from "@property-lk/ui";
import { logoutAction } from "../../lib/auth";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <Button size="sm" type="submit" variant="ghost">
        Log out
      </Button>
    </form>
  );
}
