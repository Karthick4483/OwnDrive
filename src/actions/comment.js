// @flow
/**
 * @module Actions/Comment
 * @desc Comment Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const { getFileComments, deleteFileComment, addFileComment } = createActions({
  [ActionTypes.GET_FILE_COMMENTS]: params => params,
  [ActionTypes.DELETE_FILE_COMMENT]: params => params,
  [ActionTypes.ADD_FILE_COMMENT]: params => params,
});
