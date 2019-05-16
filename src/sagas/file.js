import { call, all, put, takeLatest } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
import { request } from 'modules/client';
import axios from 'axios';

/**
 * @module Sagas/File
 * @desc File
 */

export function* getUserFiles() {
  try {
    const response = yield call(request, '/api/user/files');
    yield put({
      type: ActionTypes.GET_USER_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.GET_USER_FILES_FAILURE,
      payload: err,
    });
  }
}

function deleteFile(params) {
  return axios.request({
    method: 'delete',
    url: '/api/user/files/',
    data: params.payload,
  });
}

function uploadFile(params) {
  return axios.request({
    method: 'post',
    url: '/api/user/upload/image',
    data: params.payload.formData,
  });
}

export function* deleteUserFiles(params) {
  try {
    const response = yield call(deleteFile, params);
    yield call(getUserFiles);

    yield put({
      type: ActionTypes.DELETE_USER_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_USER_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* uploadUserFiles(params) {
  try {
    const response = yield call(uploadFile, params);
    yield call(getUserFiles);

    yield put({
      type: ActionTypes.DELETE_USER_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_USER_FILES_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_USER_FILES, getUserFiles),
    takeLatest(ActionTypes.DELETE_USER_FILES, deleteUserFiles),
    takeLatest(ActionTypes.UPLOAD_USER_FILES, uploadUserFiles),
  ]);
}
