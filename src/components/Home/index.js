import {Link} from 'react-router-dom'

import Header from '../Header'

import './index.css'

const Home = props => {
  const redirectToJobs = () => {
    const {history} = props
    history.replace('/jobs')
  }
  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs, salary information, company
          reviews.
          <br />
          Find the job that fits your abilities and potential.
        </p>
        <Link to="/jobs">
          <button type="button" className="button" onClick={redirectToJobs}>
            Find Jobs
          </button>
        </Link>
      </div>
    </>
  )
}
export default Home
