import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { STATUS, ActionTypes } from 'constants/index';

export const initState = {
  status: STATUS.IDLE,
  data: [],
};

export default {
  file: handleActions(
    {
      [ActionTypes.GET_USER_FILES]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.GET_USER_FILES_SUCCESS]: (state, response) =>
        immutable(state, {
          status: { $set: STATUS.READY },
          data: { $set: JSON.parse(response.payload.data) },
        }),
      [ActionTypes.GET_USER_FILES_FAILURE]: state =>
        immutable(state, {
          status: { $set: STATUS.IDLE },
        }),
      [ActionTypes.DELETE_USER_FILES]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.DELETE_USER_FILES_SUCCESS]: state =>
        immutable(state, {
          status: { $set: STATUS.READY },
        }),
      [ActionTypes.DELETE_USER_FILES_FAILURE]: state =>
        immutable(state, {
          status: { $set: STATUS.IDLE },
        }),
    },
    initState,
  ),
};
