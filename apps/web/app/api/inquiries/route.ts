import { getSessionUser } from "../../../lib/auth";
import { handleCreateInquiry } from "./handlers";

export async function POST(request: Request) {
  const user = await getSessionUser();

  return handleCreateInquiry({
    request,
    userId: user?.id ?? null
  });
}
