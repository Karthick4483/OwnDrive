import React from 'react';
import { connect } from 'react-redux';
import { Container, Screen } from 'styled-minimal';
import { Tab, Tabs } from '@blueprintjs/core';
import PhotoTab from '../containers/PhotoTab';
import TrashTab from '../containers/TrashTab';
import FileTab from '../containers/FileTab';
import AlbumTab from '../containers/AlbumTab';

export class Private extends React.PureComponent {
  constructor() {
    super();
    this.state = {};
  }

  static propTypes = {};

  render() {
    return (
      <Screen key="Private" data-testid="PrivateWrapper">
        <Container>
          <Tabs animate={true} renderActiveTabPanelOnly={true} vertical={false} onChange={() => {}}>
            <Tab id="files" title="All Files" panel={<FileTab />} onClick={() => {}} />
            <Tab id="trash" title="Trash" panel={<TrashTab />} />
            <Tab id="photo" title="Photos" panel={<PhotoTab />} />
            <Tab id="album" title="Albums" panel={<AlbumTab />} />
          </Tabs>
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
    photo: state.photo,
  };
}

export default connect(mapStateToProps)(Private);
