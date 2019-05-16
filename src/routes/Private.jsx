import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, Heading, Screen, utils } from 'styled-minimal';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { deleteUserFiles } from '../actions/user';

const Header = styled.div`
  margin-bottom: ${utils.spacer(3)};
  text-align: center;
`;

export class Private extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user, file, dispatch } = this.props;
    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container verticalPadding>
          <Header>
            <Heading>Welcome! {user.data && user.data.id}</Heading>
          </Header>
          {file &&
            _.map(file.data, (item, index) => (
              <div key={index}>
                <span>{item.name}</span>
                <span
                  onClick={() => {
                    dispatch(deleteUserFiles(item._id));
                  }}
                >
                  X
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
  };
}

export default connect(mapStateToProps)(Private);
