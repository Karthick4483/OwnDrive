// @flow
/**
 * @module Actions/Finder
 * @desc Finder Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { getFinderFiles } = createActions({
  [ActionTypes.GET_FINDER_FILES]: params => params,
});
