import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Button } from '@blueprintjs/core';
import { getTrashFiles, deleteFiles, restoreFiles } from '../actions';

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

export class TrashTab extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    trash: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getTrashFiles());
  }

  render() {
    const { trash, dispatch } = this.props;
    return (
      <div>
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
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    trash: state.trash,
  };
}

export default connect(mapStateToProps)(TrashTab);
