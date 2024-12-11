import {Component} from 'react'

import Loader from 'react-loader-spinner'
import {AiOutlineSearch} from 'react-icons/ai'
import Cookies from 'js-cookie'

import './index.css'

import Header from '../Header'
import JobItem from '../JobItem'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiProfileStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const apiJobStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    status: apiProfileStatusConstants.initial,
    jobStatus: apiJobStatusConstants.initial,
    profileData: [],
    jobsData: [],
    searchInput: '',
    radioInput: '',
    checkboxInputs: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobDetails()
  }

  getProfileDetails = async () => {
    this.setState({status: apiProfileStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const profileOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const profileResponse = await fetch(profileApiUrl, profileOptions)

    if (profileResponse.ok === true) {
      const fetchedProfileData = await profileResponse.json()
      const updatedProfileData = {
        name: fetchedProfileData.profile_details.name,
        profileImageUrl: fetchedProfileData.profile_details.profile_image_url,
        shortBio: fetchedProfileData.profile_details.short_bio,
      }
      this.setState({
        profileData: updatedProfileData,
        status: apiProfileStatusConstants.success,
        responseSuccess: true,
      })
    } else {
      this.setState({status: apiProfileStatusConstants.failure})
    }
  }

  getJobDetails = async () => {
    this.setState({jobStatus: apiJobStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, radioInput, checkboxInputs} = this.state
    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${checkboxInputs}&minimum_package=${radioInput}&search=${searchInput}`
    const optionsJobs = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const responseJobs = await fetch(jobsApiUrl, optionsJobs)
    if (responseJobs.ok === true) {
      const fetchedJobsData = await responseJobs.json()
      const updatedDataJobs = fetchedJobsData.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))
      this.setState({
        jobStatus: apiJobStatusConstants.success,
        jobsData: updatedDataJobs,
      })
    } else {
      this.setState({jobStatus: apiJobStatusConstants.failure})
    }
  }

  renderProfileView = () => {
    const {profileData, responseSuccess} = this.state
    if (responseSuccess) {
      const {name, profileImageUrl, shortBio} = profileData
      return (
        <div className="profile-container">
          <img src={profileImageUrl} className="profile-image" alt="profile" />
          <h1 className="profile-name">{name}</h1>
          <p className="profile-bio">{shortBio}</p>
        </div>
      )
    }
    return null
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryProfile = () => {
    this.getProfileDetails()
  }

  renderFailureView = () => (
    <div className="button-container">
      <button className="button" type="button" onClick={this.onRetryProfile}>
        Retry
      </button>
    </div>
  )

  renderProfileStatus = () => {
    const {status} = this.state

    switch (status) {
      case apiProfileStatusConstants.success:
        return this.renderProfileView()
      case apiProfileStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiProfileStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  onChangeCheckbox = event => {
    const {checkboxInputs} = this.state
    const inputNotInList = checkboxInputs.filter(
      eachItem => eachItem === event.target.id,
    )
    if (inputNotInList.length === 0) {
      this.setState(
        prevState => ({
          checkboxInputs: [...prevState.checkboxInputs, event.target.id],
        }),
        this.getJobDetails,
      )
    } else {
      const filteredData = checkboxInputs.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState({checkboxInputs: filteredData}, this.getJobDetails)
    }
  }

  renderCheckboxView = () => (
    <ul className="check-boxes-container">
      {employmentTypesList.map(eachItem => (
        <li
          className="list-item-container"
          key={eachItem.employmentTypeId}
          onChange={this.onChangeCheckbox}
        >
          <input
            type="checkbox"
            className="input"
            id={eachItem.employmentTypeId}
          />
          <label htmlFor={eachItem.employmentTypeId} className="label-text">
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onChangeRadioOption = event =>
    this.setState({radioInput: event.target.id}, this.getJobDetails)

  renderRadioInputs = () => (
    <ul className="check-boxes-container">
      {salaryRangesList.map(eachItem => (
        <li
          className="list-item-container"
          key={eachItem.salaryRangeId}
          onChange={this.onChangeRadioOption}
        >
          <input
            type="radio"
            className="input"
            id={eachItem.salaryRangeId}
            name="option"
          />
          <label className="label-text" htmlFor={eachItem.salaryRangeId}>
            {eachItem.label}
          </label>
        </li>
      ))}
    </ul>
  )

  onGetSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobDetails()
    }
  }

  onSubmitSearchInput = () => {
    this.getJobDetails()
  }

  renderJobSuccessView = () => {
    const {jobsData} = this.state
    const noJobs = jobsData.length === 0
    return noJobs ? (
      <div className="no-jobs-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-image"
          alt="no jobs"
        />
        <h1 className="no-jobs-head">No Jobs Found</h1>
        <p className="no-jobs-text">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    ) : (
      <ul>
        {jobsData.map(eachItem => (
          <JobItem jobData={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderJobLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobs = () => {
    this.getJobDetails()
  }

  renderJobFailureView = () => (
    <div className="job-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-image"
      />
      <h1 className="no-jobs-head">Oops! Something Went Wrong</h1>
      <p className="no-jobs-text">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="button" onClick={this.onRetryJobs}>
        Retry
      </button>
    </div>
  )

  onRenderJobStatus = () => {
    const {jobStatus} = this.state

    switch (jobStatus) {
      case apiJobStatusConstants.success:
        return this.renderJobSuccessView()
      case apiJobStatusConstants.failure:
        return this.renderJobFailureView()
      case apiJobStatusConstants.inProgress:
        return this.renderJobLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
        <Header />
        <div className="jobs-bg-container">
          <div className="side-bar-container">
            {this.renderProfileStatus()}
            <hr className="jobs-hr-line" />
            <h1 className="job-heading">Type of Employment</h1>
            {this.renderCheckboxView()}
            <hr className="jobs-hr-line" />
            <h1 className="job-heading">Salary Range</h1>
            {this.renderRadioInputs()}
          </div>
          <div className="jobs-container">
            <div className="serach-input-container">
              <input
                type="search"
                className="search-input"
                placeholder="Search"
                value={searchInput}
                onChange={this.onGetSearchInput}
                onKeyDown={this.onEnterSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onSubmitSearchInput}
              >
                <AiOutlineSearch className="search-icon" aria-label="close" />
              </button>
            </div>
            {this.onRenderJobStatus()}
          </div>
        </div>
      </>
    )
  }
}
export default Jobs
