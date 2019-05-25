import app from './app';
import user from './user';
import file from './file';
import finder from './finder';
import trash from './trash';
import photo from './photo';
import comment from './comment';
import album from './album';
import albumFiles from './albumFiles';

export default {
  ...app,
  ...user,
  ...file,
  ...trash,
  ...finder,
  ...photo,
  ...comment,
  ...album,
  ...albumFiles,
};
