import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import { uploadFiles } from '../actions/file';

export class FileUpload extends React.PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    file: PropTypes.object.isRequired,
  };

  onUploadStart(files) {
    const formData = new FormData();
    const { dispatch, file } = this.props;

    formData.append('folderPath', file.folderPath);
    formData.append('file', files[0]);

    dispatch(uploadFiles(formData));
  }

  render() {
    return (
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
    );
  }
}

function mapStateToProps(state) {
  return {
    file: state.file,
  };
}

export default connect(mapStateToProps)(FileUpload);
