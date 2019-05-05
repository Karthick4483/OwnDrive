import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { STATUS, ActionTypes } from 'constants/index';

export const userState = {
  isAuthenticated: true,
  status: STATUS.IDLE,
  data: {},
};

export default {
  user: handleActions(
    {
      [ActionTypes.USER_LOGIN]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.USER_LOGIN_SUCCESS]: state =>
        immutable(state, {
          isAuthenticated: { $set: true },
          status: { $set: STATUS.READY },
        }),
      [ActionTypes.USER_LOGOUT]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.USER_LOGOUT_SUCCESS]: state =>
        immutable(state, {
          isAuthenticated: { $set: false },
          status: { $set: STATUS.IDLE },
        }),
      [ActionTypes.INIT_USER]: state =>
        immutable(state, {
          isAuthenticated: { $set: false },
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.INIT_USER_SUCCESS]: (state, response) =>
        immutable(state, {
          isAuthenticated: { $set: true },
          status: { $set: STATUS.READY },
          data: { $set: response.payload.data },
        }),
      [ActionTypes.INIT_USER_FAILURE]: state =>
        immutable(state, {
          isAuthenticated: { $set: false },
          status: { $set: STATUS.IDLE },
        }),
    },
    userState,
  ),
};
