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
  getUserFiles,
  deleteUserFiles,
  uploadUserFiles,
} = createActions({
  [ActionTypes.USER_LOGIN]: () => ({}),
  [ActionTypes.USER_LOGOUT]: () => ({}),
  [ActionTypes.GET_USER_FILES]: () => ({}),
  [ActionTypes.DELETE_USER_FILES]: id => ({ id }),
  [ActionTypes.UPLOAD_USER_FILES]: formData => ({ formData }),
});
