import React from 'react';
import { Button, InputGroup } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createAlbum } from '../actions';

export class CreateAlbum extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      name: '',
    };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
  };

  render() {
    const { name } = this.state;
    const { dispatch } = this.props;

    return (
      <div>
        <InputGroup
          style={{ width: 200, float: 'left', height: 30 }}
          onChange={data => {
            this.setState({ name: data.target.value });
          }}
          placeholder="name"
          value={name}
        />

        <Button
          icon="folder-new"
          disabled={name.length === 0}
          onClick={() => {
            dispatch(createAlbum({ name }));
            this.setState({ name: '' });
          }}
        >
          Create
        </Button>
      </div>
    );
  }
}
/* istanbul ignore next */
function mapStateToProps(state) {
  return {
    album: state.album,
  };
}

export default connect(mapStateToProps)(CreateAlbum);
