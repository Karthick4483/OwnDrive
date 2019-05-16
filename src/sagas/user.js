/**
 * @module Sagas/User
 * @desc User
 */

import { all, delay, call, put, takeLatest } from 'redux-saga/effects';
import { request } from 'modules/client';

import { ActionTypes } from 'constants/index';
import { getFiles, getTrashFiles } from './file';

/**
 * Login
 */
export function* login() {
  try {
    yield delay(400);

    yield put({
      type: ActionTypes.USER_LOGIN_SUCCESS,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGIN_FAILURE,
      payload: err,
    });
  }
}

/**
 * Logout
 */
export function* logout() {
  try {
    yield call(request, '/api/auth/logout');
    window.location.reload();
    yield put({
      type: ActionTypes.USER_LOGOUT_SUCCESS,
    });
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.USER_LOGOUT_FAILURE,
      payload: err,
    });
  }
}

export function* initUser() {
  try {
    const response = yield call(request, '/api/user/me');
    yield put({
      type: ActionTypes.INIT_USER_SUCCESS,
      payload: { data: response },
    });
    yield call(getFiles);
    yield call(getTrashFiles);
  } catch (err) {
    /* istanbul ignore next */
    yield put({
      type: ActionTypes.INIT_USER_FAILURE,
      payload: err,
    });
  }
}

/**
 * User Sagas
 */
export default function* root() {
  yield all([
    takeLatest(ActionTypes.INIT_USER, initUser),
    takeLatest(ActionTypes.USER_LOGOUT, logout),
  ]);
}
