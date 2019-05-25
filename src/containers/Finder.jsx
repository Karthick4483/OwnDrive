import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Button } from '@blueprintjs/core';
import _ from 'lodash';
import { getFinderFiles } from '../actions';

const row = {
  display: 'flex',
  width: '100%',
  padding: 10,
};

const name = {
  flex: 0.7,
};

export class Finder extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    finder: PropTypes.object.isRequired,
    onSelect: PropTypes.func.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getFinderFiles());
  }

  render() {
    const { finder, dispatch, onSelect } = this.props;
    return (
      <div>
        <Button
          icon="circle-arrow-up"
          disabled={finder.folderPath === '/'}
          onClick={() => {
            const paths = finder.folderPath.split('/');
            paths.pop();
            paths.pop();
            dispatch(
              getFinderFiles({
                folderPath: `${paths.join('/')}/`,
              }),
            );
          }}
        >
          Up
        </Button>
        {_.map(finder.data, (item, index) => (
          <div key={index} style={row}>
            <div style={name}>
              {item.type === 'file' && (item.displayName || item.name)}
              {item.type !== 'file' && (
                <a
                  onClick={() => {
                    dispatch(getFinderFiles({ folderPath: item.path }));
                  }}
                >
                  {item.displayName || item.name}
                </a>
              )}
            </div>
            {/* {item.type !== 'file' && ( */}
            <Button
              icon="circle-arrow-up"
              onClick={() => {
                onSelect(item.path, item._id);
              }}
            >
              Select
            </Button>
            {/* )} */}
          </div>
        ))}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    finder: state.finder,
  };
}

export default connect(mapStateToProps)(Finder);
