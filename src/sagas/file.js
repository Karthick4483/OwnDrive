import { call, all, put, takeLatest } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
import { request } from 'modules/client';
import axios from 'axios';

/**
 * @module Sagas/File
 * @desc File
 */

export function* getFiles() {
  try {
    const response = yield call(request, '/api/user/files');
    yield put({
      type: ActionTypes.GET_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* getTrashFiles() {
  try {
    const response = yield call(request, '/api/user/trash');
    yield put({
      type: ActionTypes.GET_TRASH_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_TRASH_FILES_FAILURE,
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

function trashFile(params) {
  return axios.request({
    method: 'delete',
    url: '/api/user/files/trash',
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

export function* trashFiles(params) {
  try {
    yield call(trashFile, params);
    yield call(getTrashFiles);

    yield put({
      type: ActionTypes.TRASH_FILES_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.TRASH_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* deleteFiles(params) {
  try {
    yield call(deleteFile, params);
    yield call(getFiles);
    yield call(getTrashFiles);

    yield put({
      type: ActionTypes.DELETE_FILES_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.DELETE_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* uploadFiles(params) {
  try {
    const response = yield call(uploadFile, params);
    yield call(getFiles);

    yield put({
      type: ActionTypes.DELETE_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_FILES_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_FILES, getFiles),
    takeLatest(ActionTypes.GET_TRASH_FILES, getTrashFiles),
    takeLatest(ActionTypes.DELETE_FILES, deleteFiles),
    takeLatest(ActionTypes.TRASH_FILES, trashFiles),
    takeLatest(ActionTypes.UPLOAD_FILES, uploadFiles),
  ]);
}
