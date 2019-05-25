// @flow
/**
 * @module Actions/File
 * @desc File Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const {
  getFiles,
  getPhotos,
  getTrashFiles,
  deleteFiles,
  moveFiles,
  uploadFiles,
  trashFiles,
  createFolder,
  restoreFiles,
} = createActions({
  [ActionTypes.GET_FILES]: params => params,
  [ActionTypes.GET_PHOTOS]: params => params,
  [ActionTypes.GET_TRASH_FILES]: () => ({}),
  [ActionTypes.DELETE_FILES]: (id, path) => ({ id, path }),
  [ActionTypes.MOVE_FILES]: data => data,
  [ActionTypes.TRASH_FILES]: (id, path) => ({ id, path }),
  [ActionTypes.RESTORE_FILES]: (id, path) => ({ id, path }),
  [ActionTypes.UPLOAD_FILES]: formData => ({ formData }),
  [ActionTypes.CREATE_FOLDER]: data => data,
});
