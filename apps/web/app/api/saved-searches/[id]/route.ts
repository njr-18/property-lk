import { getSessionUser } from "../../../../lib/auth";
import {
  handleDeleteSavedSearch,
  handleUpdateSavedSearch
} from "../handlers";

export async function PATCH(
  request: Request,
  context: Readonly<{ params: Promise<{ id: string }> }>
) {
  const user = await getSessionUser();
  const { id } = await context.params;

  return handleUpdateSavedSearch({
    userId: user?.id ?? null,
    savedSearchId: id,
    request
  });
}

export async function DELETE(
  _request: Request,
  context: Readonly<{ params: Promise<{ id: string }> }>
) {
  const user = await getSessionUser();
  const { id } = await context.params;

  return handleDeleteSavedSearch({
    userId: user?.id ?? null,
    savedSearchId: id
  });
}
