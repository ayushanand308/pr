import React from 'react';

const LoginForm = () => {
  return (
    <div>
      <link
        href="https://cdn.jsdelivr.net/npm/gotham-fonts@1.0.3/css/gotham-rounded.min.css"
        rel="stylesheet"
      />
      <input type="radio" name="optionScreen" id="SignIn" hidden checked />
      <input type="radio" name="optionScreen" id="SignUp" hidden />

      <section>
        <div id="logo">
          <img
            src="https://www.freepnglogos.com/uploads/spotify-logo-png/spotify-icon-marilyn-scott-0.png"
            alt="Spotify-Logo"
            width="50"
          />
          <h1>Spotify</h1>
        </div>

        <nav>
          <label htmlFor="SignIn">Sign In</label>
          <label htmlFor="SignUp">Sign Up</label>
        </nav>

        <form action="" id="SignInFormData">
          <input type="text" id="username" placeholder="Username" />
          <input type="password" id="password" placeholder="Password" />
          <span>
            <input type="checkbox" id="staySingedIn" checked />
            <label htmlFor="staySingedIn">stay Signed In</label>
          </span>
          <button type="button" title="Sign In">Sign In</button>

          <a id="forgotPassword">Forgot Password?</a>
        </form>

        <form action="" id="SignUpFormData">
          <input type="text" id="name" placeholder="Name Complete" />
          <input type="email" id="email" placeholder="E-mail" />
          <input type="password" id="password" placeholder="New Password" />
          <span>
            <input type="checkbox" id="staySingedUp" />
            <label htmlFor="staySingedUp">stay Signed In</label>
          </span>
          <button type="button" title="Sign Up">Sign Up</button>
        </form>
      </section>

      <style>
        {`
          /* Your CSS styles here */

          html {
            color: #eee;
          }

          * {
            font-family: "Gotham Rounded Book", "sans-serif";
            padding: 0;
            margin: 0;
            box-sizing: border-box;
          }

          body {
            width: 100%;
            min-height: 560px;
            height: 100vh;
            display: grid;
            place-content: center;
            background: #eee;
          }

          section {
            min-width: 450px;
            min-height: 520px;
            padding: 15px;
            box-shadow: rgb(38, 57, 77) 0px 20px 30px -10px;
            border-radius: 10px;
            background: #2c2d31;
          }

          #logo {
            justify-content: center;
            display: flex;
            align-items: center;
            margin: 30px;
          }

          nav {
            margin: 20px;
            display: flex;
            justify-content: center;
          }

          nav label {
            text-transform: uppercase;
            cursor: pointer;
          }

          nav label:first-child {
            margin-right: 20px;
          }

          form {
            padding-inline: 60px;
            display: none;
            flex-direction: column;
          }

          #SignIn:checked ~ section #SignInFormData {
            display: flex;
          }

          #SignIn:checked ~ section nav label:first-child {
            margin-bottom: -2px;
            border-bottom: 2px solid #1ed760;
          }

          #SignUp:checked ~ section #SignUpFormData {
            display: flex;
          }

          #SignUp:checked ~ section nav label:last-child {
            margin-bottom: -2px;
            border-bottom: 2px solid #1ed760;
          }

          input,
          button {
            border-radius: 50px;
            padding: 15px 20px;
            margin-bottom: 15px;
            border: none;
            outline: none;
            font-size: 16px;
            box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
          }

          button {
            background: #1ed760;
            text-transform: uppercase;
            font-weight: bold;
            color: #fff;
            cursor: pointer;
            margin-top: 5px;
          }

          form span {
            margin-left: 20px;
          }

          form span label {
            font-size: 14px;
            text-transform: lowercase;
          }

          input[type="checkbox"] {
            cursor: pointer;
            accent-color: #3498db;
          }

          a {
            color: #797a7e;
            font-weight: bold;
            text-decoration: none;
            margin-top: 30px;
            display: flex;
            justify-content: center;
            cursor: pointer;
          }

          /* Rest of your CSS styles */
        `}
      </style>
    </div>
  );
};

export default LoginForm;
