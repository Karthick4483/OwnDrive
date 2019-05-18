// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const {
  userLogin,
  userLogout,
  getFiles,
  getTrashFiles,
  deleteFiles,
  moveFiles,
  uploadFiles,
  trashFiles,
  createFolder,
  restoreFiles,
} = createActions({
  [ActionTypes.USER_LOGIN]: () => ({}),
  [ActionTypes.USER_LOGOUT]: () => ({}),
  [ActionTypes.GET_FILES]: params => params,
  [ActionTypes.GET_TRASH_FILES]: () => ({}),
  [ActionTypes.DELETE_FILES]: id => ({ id }),
  [ActionTypes.MOVE_FILES]: data => data,
  [ActionTypes.TRASH_FILES]: id => ({ id }),
  [ActionTypes.RESTORE_FILES]: id => ({ id }),
  [ActionTypes.UPLOAD_FILES]: formData => ({ formData }),
  [ActionTypes.CREATE_FOLDER]: data => data,
});
