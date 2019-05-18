import keyMirror from 'fbjs/lib/keyMirror';

/**
 * @namespace Constants
 * @desc App constants
 */

/**
 * @constant {Object} ActionTypes
 * @memberof Constants
 */
export const ActionTypes = keyMirror({
  SWITCH_MENU: undefined,

  INIT_USER: undefined,
  INIT_USER_SUCCESS: undefined,
  INIT_USER_FAILURE: undefined,

  GET_FILES: undefined,
  GET_FILES_SUCCESS: undefined,
  GET_FILES_FAILURE: undefined,

  GET_TRASH_FILES: undefined,
  GET_TRASH_FILES_SUCCESS: undefined,
  GET_TRASH_FILES_FAILURE: undefined,

  TRASH_FILES: undefined,
  TRASH_FILES_FAILURE: undefined,
  TRASH_FILES_SUCCESS: undefined,

  RESTORE_FILES: undefined,
  RESTORE_FILES_SUCCESS: undefined,
  RESTORE_FILES_FAILURE: undefined,

  CREATE_FOLDER: undefined,
  CREATE_FOLDER_SUCCESS: undefined,
  CREATE_FOLDER_FAILURE: undefined,

  UPLOAD_FILES: undefined,
  UPLOAD_USER_FILES_SUCCESS: undefined,
  UPLOAD_USER_FILES_FAILURE: undefined,

  DELETE_FILES: undefined,
  DELETE_FILES_SUCCESS: undefined,
  DELETE_FILES_FAILURE: undefined,

  MOVE_FILES: undefined,
  MOVE_FILES_FAILURE: undefined,
  MOVE_FILES_SUCCESS: undefined,

  EXCEPTION: undefined,
  USER_LOGIN: undefined,
  USER_LOGIN_SUCCESS: undefined,
  USER_LOGIN_FAILURE: undefined,
  USER_LOGOUT: undefined,
  USER_LOGOUT_SUCCESS: undefined,
  USER_LOGOUT_FAILURE: undefined,
  GITHUB_GET_REPOS: undefined,
  GITHUB_GET_REPOS_SUCCESS: undefined,
  GITHUB_GET_REPOS_FAILURE: undefined,
  SHOW_ALERT: undefined,
  HIDE_ALERT: undefined,
});

/**
 * @constant {Object} STATUS
 * @memberof Constants
 */
export const STATUS = {
  IDLE: 'idle',
  RUNNING: 'running',
  READY: 'ready',
  SUCCESS: 'success',
  ERROR: 'error',
};
