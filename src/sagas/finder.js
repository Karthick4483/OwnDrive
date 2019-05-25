import { call, all, put, takeLatest, select } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
import { getFilesReq } from './file';

/**
 * @module Sagas/Finder
 * @desc Finder
 */

export function* getFinderFiles(params) {
  const file = yield select(state => state.file);
  const payload = params && params.payload ? params.payload : { folderPath: file.folderPath };
  payload.type = 'all';

  try {
    const response = yield call(getFilesReq, payload);
    yield put({
      type: ActionTypes.GET_FINDER_FILES_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_FINDER_FILES_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([takeLatest(ActionTypes.GET_FINDER_FILES, getFinderFiles)]);
}
