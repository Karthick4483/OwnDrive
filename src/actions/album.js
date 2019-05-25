// @flow
/**
 * @module Actions/Album
 * @desc Album Actions
 */
import { createActions } from 'redux-actions';

import { ActionTypes } from 'constants/index';

export const {
  getAlbums,
  deleteAlbum,
  trashAlbum,
  createAlbum,
  addFilesToAlbum,
  removeFilesFromAlbum,
  getAlbumFiles,
} = createActions({
  [ActionTypes.GET_ALBUMS]: params => params,
  [ActionTypes.DELETE_ALBUM]: params => params,
  [ActionTypes.TRASH_ALBUM]: params => params,
  [ActionTypes.CREATE_ALBUM]: params => params,
  [ActionTypes.GET_ALBUM_FILES]: params => params,
  [ActionTypes.REMOVE_ALBUM_FILES]: params => params,
  [ActionTypes.ADD_FILES_TO_ALBUM]: params => params,
  [ActionTypes.REMOVE_FILES_FROM_ALBUM]: params => params,
});
