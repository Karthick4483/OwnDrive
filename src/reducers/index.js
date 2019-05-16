import app from './app';
import user from './user';
import file from './file';
import trash from './trash';

export default {
  ...app,
  ...user,
  ...file,
  ...trash,
};
