import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import MediaView from './MediaView';
import { getPhotos } from '../actions';

export class PhotoTab extends React.PureComponent {
  constructor() {
    super();
    this.state = { isMediaOpen: false, selectedFile: null };
  }

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    photo: PropTypes.object.isRequired,
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getPhotos());
  }

  render() {
    const { photo } = this.props;
    const { isMediaOpen, selectedFile } = this.state;
    return (
      <div>
        <h1>Photos</h1>
        {photo &&
          _.map(photo.data, (item, index) => (
            <div
              key={index}
              style={{ float: 'left', margin: 5, border: '1px solid #dbdbdb' }}
              onClick={() => {
                this.setState({ isMediaOpen: true, selectedFile: item });
              }}
            >
              {/* <div>{item.name}</div> */}
              <div
                style={{
                  backgroundImage: `url(/api/file/list/photo?fileId=${item._id})`,
                  backgroundSize: '100%',
                  width: 300,
                  height: 300,
                }}
              />
            </div>
          ))}
        <MediaView
          isOpen={isMediaOpen}
          file={selectedFile}
          onClose={() => {
            this.setState({ isMediaOpen: false });
          }}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    photo: state.photo,
  };
}

export default connect(mapStateToProps)(PhotoTab);
