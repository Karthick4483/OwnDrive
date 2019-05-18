import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, Heading, Screen, utils } from 'styled-minimal';
import PropTypes from 'prop-types';
import _ from 'lodash';
import {
  deleteFiles,
  trashFiles,
  createFolder,
  moveFiles,
  getFiles,
  restoreFiles,
} from '../actions/user';

const Header = styled.div`
  margin-bottom: ${utils.spacer(3)};
  text-align: center;
`;

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
          <input
            type="text"
            value={folderName}
            onChange={data => {
              this.setState({ folderName: data.target.value });
            }}
          />

          <input
            type="button"
            value="Create Folder"
            onClick={() => {
              dispatch(createFolder({ name: folderName, folderPath: file.folderPath }));
            }}
          />

          <input
            type="button"
            value="Up"
            onClick={() => {
              dispatch(
                getFiles({
                  folderPath: file.folderPath.substring(0, file.folderPath.lastIndexOf('/')),
                }),
              );
            }}
          />

          {file &&
            _.map(file.data, (item, index) => (
              <div key={index}>
                <div
                  onClick={() => {
                    dispatch(getFiles({ folderPath: item.path }));
                  }}
                >
                  {item.name}
                </div>
                <span
                  onClick={() => {
                    dispatch(trashFiles(item._id));
                  }}
                >
                  Trash File{' '}
                </span>
                <span
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
                  Move File
                </span>
              </div>
            ))}
          <hr />
          <h1>Trash</h1>
          {trash &&
            _.map(trash.data, (item, index) => (
              <div key={index}>
                <div>{item.name}</div>
                <span
                  onClick={() => {
                    dispatch(deleteFiles(item._id));
                  }}
                >
                  Delete File{' '}
                </span>
                <span
                  onClick={() => {
                    dispatch(restoreFiles(item._id));
                  }}
                >
                  Restore File
                </span>
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
