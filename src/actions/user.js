// @flow
/**
 * @module Actions/User
 * @desc User Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { userLogin: login } = createActions({
  [ActionTypes.USER_LOGIN]: () => ({}),
});

export function logOut() {
  window.location.href = '/login';
}
