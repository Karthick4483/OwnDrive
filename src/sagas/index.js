import { all, fork } from 'redux-saga/effects';

import user from './user';
import file from './file';
import finder from './finder';
import comment from './comment';
import album from './album';
/**
 * rootSaga
 */
export default function* root() {
  yield all([fork(comment), fork(user), fork(file), fork(finder), fork(album)]);
}
