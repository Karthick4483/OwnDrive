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

  GET_PHOTOS: undefined,
  GET_PHOTOS_SUCCESS: undefined,
  GET_PHOTOS_FAILURE: undefined,

  GET_TRASH_FILES: undefined,
  GET_TRASH_FILES_SUCCESS: undefined,
  GET_TRASH_FILES_FAILURE: undefined,

  GET_FINDER_FILES: undefined,
  GET_FINDER_FILES_SUCCESS: undefined,
  GET_FINDER_FILES_FAILURE: undefined,

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
  UPLOAD_FILES_SUCCESS: undefined,
  UPLOAD_FILES_FAILURE: undefined,

  DELETE_FILES: undefined,
  DELETE_FILES_SUCCESS: undefined,
  DELETE_FILES_FAILURE: undefined,

  MOVE_FILES: undefined,
  MOVE_FILES_FAILURE: undefined,
  MOVE_FILES_SUCCESS: undefined,

  GET_FILE_COMMENTS: undefined,
  GET_FILE_COMMENTS_SUCCESS: undefined,
  GET_FILE_COMMENTS_FAILURE: undefined,

  DELETE_FILE_COMMENT: undefined,
  DELETE_FILE_COMMENT_SUCCESS: undefined,
  DELETE_FILE_COMMENT_FAILURE: undefined,

  ADD_FILE_COMMENT: undefined,
  ADD_FILE_COMMENT_SUCCESS: undefined,
  ADD_FILE_COMMENT_FAILURE: undefined,

  GET_ALBUMS: undefined,
  GET_ALBUMS_SUCCESS: undefined,
  GET_ALBUMS_FAILURE: undefined,

  DELETE_ALBUM: undefined,
  DELETE_ALBUM_SUCCESS: undefined,
  DELETE_ALBUM_FAILURE: undefined,

  TRASH_ALBUM: undefined,
  TRASH_ALBUM_SUCCESS: undefined,
  TRASH_ALBUM_FAILURE: undefined,

  CREATE_ALBUM: undefined,
  CREATE_ALBUM_SUCCESS: undefined,
  CREATE_ALBUM_FAILURE: undefined,

  ADD_FILES_TO_ALBUM: undefined,
  ADD_FILES_TO_ALBUM_SUCCESS: undefined,
  ADD_FILES_TO_ALBUM_FAILURE: undefined,

  REMOVE_FILES_FROM_ALBUM: undefined,
  REMOVE_FILES_FROM_ALBUM_SUCCESS: undefined,
  REMOVE_FILES_FROM_ALBUM_FAILURE: undefined,

  GET_ALBUM_FILES: undefined,
  GET_ALBUM_FILES_SUCCESS: undefined,
  GET_ALBUM_FILES_FAILURE: undefined,

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
