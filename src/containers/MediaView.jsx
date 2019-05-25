import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Dialog, Card, InputGroup, Button } from '@blueprintjs/core';
import _ from 'lodash';
import { addFileComment, deleteFileComment, getFileComments } from '../actions';

export class MediaView extends React.PureComponent {
  constructor() {
    super();
    this.state = { newComment: '' };
  }

  static propTypes = {
    comment: PropTypes.object,
    dispatch: PropTypes.func,
    file: PropTypes.object,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  componentWillMount() {}

  render() {
    const { comment, file, isOpen, onClose, dispatch } = this.props;
    const { newComment } = this.state;
    return (
      <Dialog
        onOpened={() => {
          dispatch(getFileComments({ fileId: file._id }));
        }}
        onClose={onClose}
        title={`${file && file.name}`}
        isOpen={isOpen}
        style={{ width: 1000, height: 600 }}
      >
        <div style={{ display: 'flex' }}>
          {file && (
            <div
              style={{
                backgroundImage: `url(/api/file/list/photo?fileName=${file.fileName})`,
                backgroundSize: '100%',
                width: 600,
                height: 600,
              }}
            />
          )}
          {file && (
            <Card style={{ position: 'relative', width: 400, height: 600 }}>
              <div
                style={{ padding: 20, position: 'absolute', bottom: 30, top: 0, left: 0, right: 0 }}
              >
                {_.map(comment.data, item => (
                  <div>
                    <div>{item.comment}</div>
                    <div
                      onClick={() => {
                        dispatch(deleteFileComment({ fileId: file._id, comment: newComment }));
                      }}
                    >
                      X
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: 20, position: 'absolute', bottom: 30, left: 0, right: 0 }}>
                <InputGroup
                  placeholder="Enter your comment."
                  type="text"
                  value={newComment}
                  onChange={event => {
                    this.setState({ newComment: event.target.value });
                  }}
                  rightElement={
                    <Button
                      icon="add"
                      onClick={() => {
                        dispatch(addFileComment({ fileId: file._id, comment: newComment }));
                      }}
                    >
                      Add
                    </Button>
                  }
                />
              </div>
            </Card>
          )}
        </div>
      </Dialog>
    );
  }
}

function mapStateToProps(state) {
  return {
    comment: state.comment,
  };
}

export default connect(mapStateToProps)(MediaView);
