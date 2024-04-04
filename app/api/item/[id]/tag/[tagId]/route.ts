import { ClientError, ServerError, Success } from '@/lib/Response';
import { linkTag, unlinkTag } from '@/lib/database/listItem';
import { getUser } from '@/lib/session';

export async function POST(_: Request, { params }: { params: { id: string, tagId: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await linkTag(params.id, params.tagId);

  if(!result)
    return ServerError.Internal('Could not add tag');
  return Success.OK('Tag added');
}

export async function DELETE(_: Request, { params }: { params: { id: string, tagId: string } }) {
  const session = await getUser();
  if(!session)
    return ClientError.Unauthenticated('Not logged in');

  const result = await unlinkTag(params.id, params.tagId);

  if(!result)
    return ServerError.Internal('Could not remove tag');
  return Success.OK('Tag removed');
}