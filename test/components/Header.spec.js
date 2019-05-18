import React from 'react';
import Header from 'components/Header';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

const mockDispatch = jest.fn();
const mockStore = configureMockStore();
const store = mockStore({});
function setup() {
  const props = {
    app: {},
    dispatch: mockDispatch,
    location: {
      pathname: '/',
    },
  };

  return mount(
    <Provider store={store}>
      <Header suppressClassNameWarning {...props} />
    </Provider>,
  );
}

describe('Header', () => {
  const wrapper = setup();

  it('should render properly', () => {
    expect(wrapper).toMatchSnapshot();
  });

  // it('should handle clicks', () => {
  //   wrapper.find('Logout').simulate('click');

  //   expect(mockDispatch).toHaveBeenCalledWith({
  //     type: 'USER_LOGOUT',
  //     payload: {},
  //   });
  // });
});
