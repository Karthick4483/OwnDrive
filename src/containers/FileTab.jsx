import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button, Dialog } from '@blueprintjs/core';
import { getFiles, trashFiles, moveFiles } from '../actions';
import CreateFolder from '../components/CreateFolder';
import FileUpload from '../components/FileUpload';
import Finder from './Finder';

const actions = {
  float: 'right',
  flex: 0.3,
};

const row = {
  display: 'flex',
  width: '100%',
  padding: 10,
};

const name = {
  flex: 0.7,
};

export class FileTab extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      folderName: '',
      isOpen: false,
      autoFocus: true,
      canEscapeKeyClose: true,
      canOutsideClickClose: true,
      enforceFocus: true,
      usePortal: true,
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
  };

  // componentWillMount() {
  // const { dispatch } = this.props;
  // dispatch(getFiles());
  // }

  handleOpen = () => this.setState({ isOpen: true });

  handleClose = () => this.setState({ isOpen: false });

  Finder;

  render() {
    const { file, dispatch } = this.props;
    const { itemToMove } = this.state;

    return (
      <div>
        <span>
          <h1>My Files</h1>
          <FileUpload />
          <CreateFolder />
        </span>
        {file &&
          _.map(file.data, (item, index) => (
            <div key={index} style={row}>
              <div style={name}>
                {item.type === 'file' && (item.displayName || item.name)}
                {item.type !== 'file' && (
                  <a
                    onClick={() => {
                      dispatch(getFiles({ folderPath: item.path }));
                    }}
                  >
                    {item.displayName || item.name}
                  </a>
                )}
              </div>
              <div style={actions}>
                {item.type !== 'drive' && (
                  <Button
                    onClick={() => {
                      dispatch(trashFiles(item._id, item.path));
                    }}
                  >
                    Trash
                  </Button>
                )}

                <Dialog
                  icon="folder-open"
                  onClose={this.handleClose}
                  title="Select Folder"
                  {...this.state}
                >
                  <Finder
                    onSelect={path => {
                      this.handleClose();
                      dispatch(
                        moveFiles({
                          id: itemToMove._id,
                          from: itemToMove.path,
                          to: `${path}/${itemToMove.name}${itemToMove.type === 'file' ? '' : '/'}`,
                        }),
                      );
                    }}
                  />
                </Dialog>
                <Button
                  onClick={() => {
                    this.setState({ itemToMove: item });
                    this.handleOpen();
                  }}
                >
                  Move
                </Button>
              </div>
            </div>
          ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    file: state.file,
  };
}

export default connect(mapStateToProps)(FileTab);
