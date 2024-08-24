import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class Login extends Component {
  state = {username: '', password: '', errorMsg: '', showErrMsg: false}

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  renderUsernameInput = () => {
    const {username} = this.state

    return (
      <div className="input-container">
        <label className="label-text" htmlFor="username">
          USERNAME
        </label>
        <input
          type="text"
          className="input-text"
          placeholder="Username"
          id="username"
          value={username}
          onChange={this.onChangeUserName}
        />
      </div>
    )
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  renderPasswordInput = () => {
    const {password} = this.state

    return (
      <div className="input-container">
        <label className="label-text" htmlFor="password">
          PASSWORD
        </label>
        <input
          type="password"
          className="input-text"
          placeholder="Password"
          id="password"
          value={password}
          onChange={this.onChangePassword}
        />
      </div>
    )
  }

  onSuccess = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    const {history} = this.props
    history.replace('/')
  }

  onFailure = errorMsg => {
    this.setState({errorMsg, showErrMsg: true})
  }

  submitForm = async event => {
    event.preventDefault()

    const {username, password} = this.state
    const userDetails = {username, password}

    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }

    const response = await fetch(url, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccess(data.jwt_token)
    } else {
      this.onFailure(data.error_msg)
    }
  }

  render() {
    const {errorMsg, showErrMsg} = this.state
    const token = Cookies.get('jwt_token')
    if (token !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="bg-container">
        <form className="app-container" onSubmit={this.submitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          {this.renderUsernameInput()}
          {this.renderPasswordInput()}
          <button type="submit" className="button">
            Login
          </button>
          {showErrMsg && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default Login
