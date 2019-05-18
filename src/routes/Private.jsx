import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, Heading, Screen, utils } from 'styled-minimal';
import PropTypes from 'prop-types';
import { Button, InputGroup } from '@blueprintjs/core';

import _ from 'lodash';
import {
  deleteFiles,
  trashFiles,
  createFolder,
  // moveFiles,
  getFiles,
  restoreFiles,
} from '../actions/user';

const Header = styled.div`
  margin-bottom: ${utils.spacer(3)};
  text-align: center;
`;

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

export class Private extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      folderName: '',
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
    trash: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user, file, trash, dispatch } = this.props;
    const { folderName } = this.state;

    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container verticalPadding>
          <Header>
            <Heading>Welcome! {user.data && user.data.id}</Heading>
          </Header>
          <h1>My Files</h1>
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

          {file &&
            _.map(file.data, (item, index) => (
              <div key={index} style={row}>
                <div
                  onClick={() => {
                    dispatch(getFiles({ folderPath: item.path }));
                  }}
                  style={name}
                >
                  {item.name}
                </div>
                <div style={actions}>
                  <Button
                    onClick={() => {
                      dispatch(trashFiles(item._id, item.path));
                    }}
                  >
                    Trash
                  </Button>

                  {/* <Button
                    onClick={() => {
                      dispatch(
                        moveFiles({
                          id: item._id,
                          from: item.path,
                          to: `/new${item.path}`,
                        }),
                      );
                    }}
                  >
                    Move
                  </Button> */}
                </div>
              </div>
            ))}
          <hr />
          <h1>Trash</h1>
          {trash &&
            _.map(trash.data, (item, index) => (
              <div key={index} style={row}>
                <div style={name}>{item.name}</div>
                <div style={actions}>
                  <Button
                    onClick={() => {
                      dispatch(deleteFiles(item._id, item.path));
                    }}
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={() => {
                      dispatch(restoreFiles(item._id, item.path));
                    }}
                  >
                    Restore
                  </Button>
                </div>
              </div>
            ))}
        </Container>
      </Screen>
    );
  }
}
/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
    file: state.file,
    trash: state.trash,
  };
}

export default connect(mapStateToProps)(Private);
