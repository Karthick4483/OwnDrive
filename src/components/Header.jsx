import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import rgba from 'polished/lib/color/rgba';
import { appColor, headerHeight } from 'modules/theme';
import { connect } from 'react-redux';
import { Container, utils } from 'styled-minimal';
import Icon from 'components/Icon';
import Logo from 'components/Logo';
import Dropzone from 'react-dropzone';
import { userLogout, uploadFiles } from '../actions/user';

const { responsive, spacer } = utils;

const HeaderWrapper = styled.header`
  background-color: ${rgba(appColor, 0.9)};
  height: ${headerHeight}px;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 200;

  &:before {
    background-color: ${appColor};
    bottom: 0;
    content: '';
    height: 0.2rem;
    left: 0;
    position: absolute;
    right: 0;
  }
`;

const HeaderContainer = styled(Container)`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  height: 100%;
  justify-content: space-between;
  padding-bottom: ${spacer(2)};
  padding-top: ${spacer(2)};
`;

const Logout = styled.button`
  align-items: center;
  color: #333;
  display: flex;
  font-size: 1.3rem;
  padding: ${spacer(2)};

  ${responsive({ lg: 'font-size: 1.6rem;' })}; /* stylelint-disable-line */

  &.active {
    color: #000;
  }

  span {
    display: inline-block;
    margin-right: 0.4rem;
    text-transform: uppercase;
  }
`;

export class Header extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
  };

  handleClickLogout = () => {
    const { dispatch } = this.props;
    dispatch(userLogout());
  };

  onUploadStart(files) {
    const formData = new FormData();
    const { dispatch, file } = this.props;

    formData.append('folderPath', file.folderPath);
    formData.append('file', files[0]);

    dispatch(uploadFiles(formData));

    // fetch('/api/user/upload/image', {
    //   method: 'POST',
    //   body: formData,
    // });
  }

  render() {
    return (
      <HeaderWrapper>
        <HeaderContainer>
          <Logo />
          <Dropzone
            onDrop={acceptedFiles => console.log(acceptedFiles)}
            onDropAccepted={files => {
              this.onUploadStart(files);
            }}
          >
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              </section>
            )}
          </Dropzone>
          <Logout onClick={this.handleClickLogout}>
            <span>logout</span>
            <Icon name="sign-out" width={16} />
          </Logout>
        </HeaderContainer>
      </HeaderWrapper>
    );
  }
}

function mapStateToProps(state) {
  return {
    file: state.file,
  };
}

export default connect(mapStateToProps)(Header);
