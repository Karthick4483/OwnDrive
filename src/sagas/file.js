import { call, all, put, takeLatest, select } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
import { request } from 'modules/client';
import axios from 'axios';

/**
 * @module Sagas/File
 * @desc File
 */

function deleteFileReq(params) {
  return axios.delete('/api/file/delete', { data: params.payload });
}

function trashFileReq(params) {
  return axios.delete('/api/file/trash', { data: params.payload });
}

function restoreFileReq(params) {
  return axios.post('/api/file/restore', params.payload);
}

function uploadFile(params) {
  return axios.post('/api/file/upload/image', params.payload.formData);
}

function createFolderReq(params) {
  return axios.post('/api/file/create/folder', params.payload);
}

function moveFilesReq(params) {
  return axios.request({
    method: 'post',
    url: '/api/file/move',
    data: params.payload,
  });
}

export function getFilesReq(params) {
  return axios.get(`/api/file/list/${params.type}`, { params });
}

export function* getFiles(params) {
  const file = yield select(state => state.file);
  const payload = params ? params.payload : { folderPath: file.folderPath };
  payload.type = 'all';
  try {
    const response = yield call(getFilesReq, payload);
    yield put({
      type: ActionTypes.GET_FILES_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* getPhotos(params) {
  const payload = params && params.payload ? params.payload : {};
  payload.type = 'photos';
  try {
    const response = yield call(getFilesReq, payload);
    yield put({
      type: ActionTypes.GET_PHOTOS_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_PHOTOS_FAILURE,
      payload: err,
    });
  }
}

export function* getTrashFiles() {
  try {
    const response = yield call(request, '/api/file/list/trash');
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

export function* restoreFiles(params) {
  try {
    yield call(restoreFileReq, params);
    yield call(getTrashFiles);
    yield call(getFiles);

    yield put({
      type: ActionTypes.RESTORE_FILES_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.RESTORE_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* trashFiles(params) {
  try {
    yield call(trashFileReq, params);
    yield call(getTrashFiles);
    yield call(getFiles);

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

export function* moveFiles(params) {
  try {
    yield call(moveFilesReq, params);
    yield call(getFiles);

    yield put({
      type: ActionTypes.MOVE_FILES_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.MOVE_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* deleteFiles(params) {
  try {
    yield call(deleteFileReq, params);
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
      type: ActionTypes.UPLOAD_FILES_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.UPLOAD_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* createFolder(params) {
  try {
    const response = yield call(createFolderReq, params);
    yield call(getFiles);

    yield put({
      type: ActionTypes.CREATE_FOLDER_SUCCESS,
      payload: { data: response },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.CREATE_FOLDER_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_FILES, getFiles),
    takeLatest(ActionTypes.GET_PHOTOS, getPhotos),
    takeLatest(ActionTypes.GET_TRASH_FILES, getTrashFiles),
    takeLatest(ActionTypes.DELETE_FILES, deleteFiles),
    takeLatest(ActionTypes.MOVE_FILES, moveFiles),
    takeLatest(ActionTypes.TRASH_FILES, trashFiles),
    takeLatest(ActionTypes.RESTORE_FILES, restoreFiles),
    takeLatest(ActionTypes.UPLOAD_FILES, uploadFiles),
    takeLatest(ActionTypes.CREATE_FOLDER, createFolder),
  ]);
}
