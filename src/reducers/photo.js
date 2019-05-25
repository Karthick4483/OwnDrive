import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { STATUS, ActionTypes } from 'constants/index';

export const initState = {
  status: STATUS.IDLE,
  data: [],
  folderPath: '/',
};

export default {
  photo: handleActions(
    {
      [ActionTypes.GET_PHOTOS]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.GET_PHOTOS_SUCCESS]: (state, response) =>
        immutable(state, {
          status: { $set: STATUS.READY },
          data: { $set: response.payload.data.collection },
        }),
      [ActionTypes.GET_PHOTOS_FAILURE]: state =>
        immutable(state, {
          status: { $set: STATUS.IDLE },
        }),
    },
    initState,
  ),
};
