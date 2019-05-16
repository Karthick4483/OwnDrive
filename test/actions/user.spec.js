import { userLogin, userLogout } from 'actions/user';

describe('App', () => {
  it('login should return an action', () => {
    expect(userLogin()).toMatchSnapshot();
  });

  it('logOut should return an action', () => {
    expect(userLogout()).toMatchSnapshot();
  });
});
