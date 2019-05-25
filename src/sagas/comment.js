import { call, all, put, takeLatest } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
// import { request } from 'modules/client';
import axios from 'axios';

/**
 * @module Sagas/Comment
 * @desc Comment
 */

function deleteCommentReq(params) {
  return axios.delete('/api/comment/delete', { data: params.payload });
}

function addFileCommentReq(params) {
  return axios.post('/api/comment/add', { ...params.payload });
}

export function getFileCommentsReq(params) {
  return axios.get('/api/comment/list', { params: params.payload });
}

export function* getFileComments(params) {
  // const file = yield select(state => state.file);
  // const payload = params ? params.payload : { fileId: file.fileId };
  // payload.type = 'all';

  try {
    const response = yield call(getFileCommentsReq, params);
    yield put({
      type: ActionTypes.GET_FILE_COMMENTS_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_FILE_COMMENTS_FAILURE,
      payload: err,
    });
  }
}

export function* addFileComment(params) {
  try {
    yield call(addFileCommentReq, params);
    yield call(getFileComments, params);

    yield put({
      type: ActionTypes.ADD_FILE_COMMENT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.ADD_FILE_COMMENT_FAILURE,
      payload: err,
    });
  }
}

export function* deleteFileComment(params) {
  try {
    yield call(deleteCommentReq, params);
    yield call(getFileComments, params);

    yield put({
      type: ActionTypes.DELETE_FILE_COMMENT_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.DELETE_FILE_COMMENT_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_FILE_COMMENTS, getFileComments),
    takeLatest(ActionTypes.DELETE_FILE_COMMENT, deleteFileComment),
    takeLatest(ActionTypes.ADD_FILE_COMMENT, addFileComment),
  ]);
}
