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
  uploadFiles,
  trashFiles,
} = createActions({
  [ActionTypes.USER_LOGIN]: () => ({}),
  [ActionTypes.USER_LOGOUT]: () => ({}),
  [ActionTypes.GET_FILES]: () => ({}),
  [ActionTypes.GET_TRASH_FILES]: () => ({}),
  [ActionTypes.DELETE_FILES]: id => ({ id }),
  [ActionTypes.TRASH_FILES]: id => ({ id }),
  [ActionTypes.UPLOAD_FILES]: formData => ({ formData }),
});
