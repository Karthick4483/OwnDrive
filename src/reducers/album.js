import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { STATUS, ActionTypes } from 'constants/index';

export const initState = {
  status: STATUS.IDLE,
  data: [],
};

export default {
  album: handleActions(
    {
      [ActionTypes.GET_ALBUMS]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.GET_ALBUMS_SUCCESS]: (state, response) =>
        immutable(state, {
          status: { $set: STATUS.READY },
          data: { $set: response.payload.data },
        }),
      [ActionTypes.GET_ALBUMS_FAILURE]: state =>
        immutable(state, {
          status: { $set: STATUS.IDLE },
        }),
    },
    initState,
  ),
};
