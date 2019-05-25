import { handleActions } from 'redux-actions';
import immutable from 'immutability-helper';

import { STATUS, ActionTypes } from 'constants/index';

export const initState = {
  status: STATUS.IDLE,
  data: [],
  folderPath: '/',
};

export default {
  finder: handleActions(
    {
      [ActionTypes.GET_FINDER_FILES]: state =>
        immutable(state, {
          status: { $set: STATUS.RUNNING },
        }),
      [ActionTypes.GET_FINDER_FILES_SUCCESS]: (state, response) =>
        immutable(state, {
          status: { $set: STATUS.READY },
          data: { $set: response.payload.data.collection },
          folderPath: { $set: response.payload.data.folderPath },
        }),
      [ActionTypes.GET_FINDER_FILES_FAILURE]: state =>
        immutable(state, {
          status: { $set: STATUS.IDLE },
        }),
    },
    initState,
  ),
};
