import React from 'react';
import '@testing-library/jest-dom';
import {
  render,
  cleanup,
  fireEvent,
  waitForElement,
  getByTestId
} from '@testing-library/react';
import App from './App';

describe('App component', () => {
  let component;
  let newUser;
  beforeEach(() => {
    component = render(<App />);
    newUser = {
      name: 'Test User',
      email: 'test@test.com',
      password: 'not123'
    };
  });

  afterEach(cleanup);

  it('renders Login page', () => {
    const { getByTestId } = component;
    const LoginHeading = getByTestId('login-heading');
    expect(LoginHeading).toHaveTextContent('Login');
  });

  it('renders Register page upon user click', () => {
    const { getByTestId } = component;
    const goToRegisterBtn = getByTestId('go-to-register');
    goToRegisterBtn.click();

    const RegisterHeading = getByTestId('register-heading');
    expect(RegisterHeading).toHaveTextContent('Register');
  });

  it('registers a new user', () => {
    const { getByPlaceholderText, getByTestId } = component;
    const goToRegisterBtn = getByTestId('go-to-register');
    goToRegisterBtn.click();

    const nameInput = getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: newUser.name } });
    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.change(emailInput, { target: { value: newUser.email } });
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: newUser.password } });

    const registerBtn = getByTestId('register-btn');
    registerBtn.click();

    const users = JSON.parse(localStorage.getItem('users'));
    const registeredUser = users.filter(user => user.email === newUser.email);

    expect(registeredUser).toBeTruthy();
  });

  it('logs in', () => {
    const { getByPlaceholderText, getByTestId } = component;

    const emailInput = getByPlaceholderText('E-mail');
    fireEvent.change(emailInput, { target: { value: newUser.email } });
    const passwordInput = getByPlaceholderText('Password');
    fireEvent.change(passwordInput, { target: { value: newUser.password } });

    const loginBtn = getByTestId('login-btn');
    loginBtn.click();

    const greeting = getByTestId('greeting');
    expect(greeting).toHaveTextContent(`Olá, ${newUser.name}`);
  });

  describe('is logged in', () => {
    let artist;
    beforeEach(() => {
      artist = 'Sinatra';

      const { getByPlaceholderText, getByTestId } = component;

      const emailInput = getByPlaceholderText('E-mail');
      fireEvent.change(emailInput, { target: { value: newUser.email } });
      const passwordInput = getByPlaceholderText('Password');
      fireEvent.change(passwordInput, { target: { value: newUser.password } });

      const loginBtn = getByTestId('login-btn');
      loginBtn.click();
    });

    it('renders artists on search', async () => {
      const { getByPlaceholderText, getByText, getAllByTestId } = component;
      const searchInput = getByPlaceholderText('type to search artists');
      const searchBtn = getByText('Search');

      fireEvent.change(searchInput, { target: { value: artist } });
      fireEvent.click(searchBtn);

      const artists = await waitForElement(() =>
        getAllByTestId('artist-container')
      );

      artists.forEach(el => expect(el).toHaveTextContent(artist));
    });

    it('saves searched query to localStorage', () => {
      const { getByPlaceholderText, getByText } = component;
      const searchInput = getByPlaceholderText('type to search artists');
      const searchBtn = getByText('Search');

      fireEvent.change(searchInput, { target: { value: artist } });
      fireEvent.click(searchBtn);

      const users = JSON.parse(localStorage.getItem('users'));
      const userHistory = users.filter(user => user.email === newUser.email)[0]
        .history;

      expect(userHistory).toContain(artist)
    });
  });
});
