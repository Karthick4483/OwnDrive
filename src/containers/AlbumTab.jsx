import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Dialog } from '@blueprintjs/core';
import MediaView from './MediaView';
import {
  getAlbums,
  deleteAlbum,
  addFilesToAlbum,
  getAlbumFiles,
  removeFilesFromAlbum,
} from '../actions';
import CreateAlbum from '../components/CreateAlbum';
import Finder from './Finder';

export class AlbumTab extends React.PureComponent {
  constructor() {
    super();
    this.state = { isMediaOpen: false, selectedAlbum: null };
  }

  static propTypes = {
    album: PropTypes.object.isRequired,
    albumFiles: PropTypes.object.isRequired,
    canEscapeKeyClose: true,
    canOutsideClickClose: true,
    dispatch: PropTypes.func.isRequired,
    enforceFocus: true,
    isOpen: false,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getAlbums());
  }

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  render() {
    const { album, albumFiles, dispatch } = this.props;
    const { isMediaOpen, selectedAlbum } = this.state;
    return (
      <div>
        <h1>My Albums</h1>
        <CreateAlbum />
        {album &&
          !selectedAlbum &&
          _.map(album.data, (item, index) => (
            <div
              key={index}
              style={{ float: 'left', margin: 5, border: '1px solid #dbdbdb' }}
              onClick={() => {
                this.setState({ selectedAlbum: item });
                dispatch(getAlbumFiles({ id: item._id }));
              }}
            >
              <div
                style={{
                  // backgroundImage: `url(/api/file/list/album?fileName=${item.fileName})`,
                  background: '#dbdbdb',
                  backgroundSize: '100%',
                  width: 300,
                  height: 300,
                }}
              >
                {item.name}
              </div>
              <Button
                onClick={() => {
                  dispatch(deleteAlbum({ id: item._id }));
                }}
              >
                Trash
              </Button>
            </div>
          ))}
        {selectedAlbum && (
          <div style={{ margin: 10 }}>
            <a
              onClick={() => {
                this.setState({ selectedAlbum: null });
              }}
            >
              Back To Albums{' '}
            </a>
            <a
              onClick={() => {
                this.handleOpen();
              }}
            >
              Add Photos
            </a>
          </div>
        )}
        {selectedAlbum &&
          _.map(albumFiles.data, (item, index) => (
            <div
              key={index}
              style={{ float: 'left', margin: 5, border: '1px solid #dbdbdb' }}
              onClick={() => {
                // this.setState({ isMediaOpen: true, selectedAlbum: item });
              }}
            >
              <div
                style={{
                  // backgroundImage: `url(/api/file/list/album?fileName=${item.fileName})`,
                  background: '#dbdbdb',
                  backgroundSize: '100%',
                  width: 300,
                  height: 300,
                }}
              >
                {item.name}
              </div>
              <Button
                onClick={() => {
                  dispatch(removeFilesFromAlbum({ albumId: selectedAlbum._id, id: item._id }));
                }}
              >
                Remove
              </Button>
            </div>
          ))}
        <MediaView
          isOpen={isMediaOpen}
          file={selectedAlbum}
          onClose={() => {
            this.setState({ isMediaOpen: false });
          }}
        />

        <Dialog icon="folder-open" onClose={this.handleClose} title="Select Files" {...this.state}>
          <Finder
            onSelect={(path, id) => {
              this.handleClose();
              dispatch(
                addFilesToAlbum({
                  id: selectedAlbum._id,
                  fileId: id,
                }),
              );
            }}
          />
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    album: state.album,
    albumFiles: state.albumFiles,
  };
}

export default connect(mapStateToProps)(AlbumTab);
