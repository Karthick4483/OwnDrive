import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Container, Heading, Screen, utils } from 'styled-minimal';
import PropTypes from 'prop-types';

const Header = styled.div`
  margin-bottom: ${utils.spacer(3)};
  text-align: center;
`;

export class Private extends React.PureComponent {
  static propTypes = {
    user: PropTypes.object.isRequired,
  };

  render() {
    const { user } = this.props;
    window.console.log(user);

    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container verticalPadding>
          <Header>
            <Heading>Welcome! {user.data && user.data.id}</Heading>
          </Header>
        </Container>
      </Screen>
    );
  }
}
/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    user: state.user,
  };
}

export default connect(mapStateToProps)(Private);
