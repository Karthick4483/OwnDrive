import { call, all, put, takeLatest } from 'redux-saga/effects';
import { ActionTypes } from 'constants/index';
import axios from 'axios';

/**
 * @module Sagas/Album
 * @desc Album
 */

function addFilesToAlbumReq(params) {
  return axios.post('/api/album/add/files', { ...params.payload });
}

function removeFilesFromAlbumReq(params) {
  return axios.delete('/api/album/remove/files', { data: params.payload });
}

function trashAlbumReq(params) {
  return axios.delete('/api/album/trash', { data: params.payload });
}

function deleteAlbumReq(params) {
  return axios.delete('/api/album/delete', { data: params.payload });
}

function createAlbumReq(params) {
  return axios.post('/api/album/create', { ...params.payload });
}

function getAlbumsReq(params) {
  return axios.get('/api/album/list', { params: params.payload });
}

function getAlbumsFilesReq(params) {
  return axios.get('/api/album/list/files', { params: params.payload });
}

export function* getAlbumFiles(params) {
  console.log(params);
  try {
    const response = yield call(getAlbumsFilesReq, params);
    yield put({
      type: ActionTypes.GET_ALBUM_FILES_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_ALBUM_FILES_FAILURE,
      payload: err,
    });
  }
}

export function* getAlbums(params) {
  try {
    const response = yield call(getAlbumsReq, params);
    yield put({
      type: ActionTypes.GET_ALBUMS_SUCCESS,
      payload: { data: response.data },
    });
  } catch (err) {
    yield put({
      type: ActionTypes.GET_ALBUMS_FAILURE,
      payload: err,
    });
  }
}

export function* removeFilesFromAlbum(params) {
  try {
    yield call(removeFilesFromAlbumReq, params);
    yield call(getAlbumFiles, { payload: { id: params.payload.albumId } });

    yield put({
      type: ActionTypes.REMOVE_FILES_FROM_ALBUM_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.REMOVE_FILES_FROM_ALBUM_FAILURE,
      payload: err,
    });
  }
}

export function* addFilesToAlbum(params) {
  try {
    yield call(addFilesToAlbumReq, params);
    yield call(getAlbumFiles, params);

    yield put({
      type: ActionTypes.ADD_FILES_TO_ALBUM_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.ADD_FILES_TO_ALBUM_FAILURE,
      payload: err,
    });
  }
}

export function* createAlbum(params) {
  try {
    yield call(createAlbumReq, params);
    yield call(getAlbums, params);

    yield put({
      type: ActionTypes.CREATE_ALBUM_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.CREATE_ALBUM_FAILURE,
      payload: err,
    });
  }
}

export function* trashAlbum(params) {
  try {
    yield call(trashAlbumReq, params);
    yield call(getAlbums, params);

    yield put({
      type: ActionTypes.DELETE_ALBUM_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.DELETE_ALBUM_FAILURE,
      payload: err,
    });
  }
}

export function* deleteAlbum(params) {
  try {
    yield call(deleteAlbumReq, params);
    yield call(getAlbums, params);

    yield put({
      type: ActionTypes.DELETE_ALBUM_SUCCESS,
    });
  } catch (err) {
    yield put({
      type: ActionTypes.DELETE_ALBUM_FAILURE,
      payload: err,
    });
  }
}

export default function* root() {
  yield all([
    takeLatest(ActionTypes.GET_ALBUM_FILES, getAlbumFiles),
    takeLatest(ActionTypes.GET_ALBUMS, getAlbums),
    takeLatest(ActionTypes.DELETE_ALBUM, deleteAlbum),
    takeLatest(ActionTypes.CREATE_ALBUM, createAlbum),
    takeLatest(ActionTypes.ADD_FILES_TO_ALBUM, addFilesToAlbum),
    takeLatest(ActionTypes.REMOVE_FILES_FROM_ALBUM, removeFilesFromAlbum),
  ]);
}
