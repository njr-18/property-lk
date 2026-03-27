import { getSessionUser } from "../../../lib/auth";
import { handleCreateSavedSearch, handleListSavedSearches } from "./handlers";

export async function GET() {
  const user = await getSessionUser();

  return handleListSavedSearches({
    userId: user?.id ?? null
  });
}

export async function POST(request: Request) {
  const user = await getSessionUser();

  return handleCreateSavedSearch({
    userId: user?.id ?? null,
    request
  });
}
