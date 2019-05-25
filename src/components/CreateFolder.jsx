import React from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createFolder, getFiles } from '../actions/file';

export class CreateFolder extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      folderName: '',
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
  };

  render() {
    const { folderName } = this.state;
    const { dispatch, file } = this.props;

    return (
      <div>
        <InputGroup
          style={{ width: 200, float: 'left', height: 30 }}
          onChange={data => {
            this.setState({ folderName: data.target.value });
          }}
          placeholder="Folder name"
          value={folderName}
        />

        <Button
          icon="folder-new"
          disabled={folderName.length === 0}
          onClick={() => {
            dispatch(createFolder({ name: folderName, folderPath: file.folderPath }));
            this.setState({ folderName: '' });
          }}
        >
          Create Folder
        </Button>

        <Button
          icon="circle-arrow-up"
          disabled={file.folderPath === '/'}
          onClick={() => {
            const paths = file.folderPath.split('/');
            paths.pop();
            paths.pop();
            dispatch(
              getFiles({
                folderPath: `${paths.join('/')}/`,
              }),
            );
          }}
        >
          Up
        </Button>
      </div>
    );
  }
}
/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    file: state.file,
  };
}

export default connect(mapStateToProps)(CreateFolder);
