import {withRouter, Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }
  return (
    <nav>
      <div className="nav-container">
        <Link to="/">
          <li>
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="website-logo"
            />
          </li>
        </Link>
        <ul className="nav-menu">
          <Link className="nav-link" to="/">
            <li>Home</li>
          </Link>
          <Link className="nav-link" to="/jobs">
            <li>Jobs</li>
          </Link>
        </ul>
        <button className="button" onClick={onClickLogout} type="button">
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
