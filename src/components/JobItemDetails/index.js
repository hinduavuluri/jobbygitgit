import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {AiFillStar} from 'react-icons/ai'
import {MdLocationOn} from 'react-icons/md'
import {IoBagHandleOutline} from 'react-icons/io5'
import {FaExternalLinkAlt} from 'react-icons/fa'

import Header from '../Header'
import SimilarJobs from '../SimilarJobs'

import './index.css'

const apiJobDetailsStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class JobItemDetails extends Component {
  state = {
    jobDataDetails: [],
    similarJobsData: [],
    status: apiJobDetailsStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobDetailsData()
  }

  getJobDetailsData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({status: apiJobDetailsStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const jobsUrl = `https://apis.ccbp.in/jobs/${id}`
    const jobOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(jobsUrl, jobOptions)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedJobData = {
        companyLogoUrl: fetchedData.job_details.company_logo_url,
        companyWebsiteUrl: fetchedData.job_details.company_website_url,
        employmentType: fetchedData.job_details.employment_type,
        id: fetchedData.job_details.id,
        jobDescription: fetchedData.job_details.job_description,
        title: fetchedData.job_details.title,
        skills: fetchedData.job_details.skills.map(eachSkill => ({
          imageUrl: eachSkill.image_url,
          name: eachSkill.name,
        })),
        lifeAtCompany: {
          description: fetchedData.job_details.life_at_company.description,
          imageUrl: fetchedData.job_details.life_at_company.image_url,
        },
        location: fetchedData.job_details.location,
        packagePerAnnum: fetchedData.job_details.package_per_annum,
        rating: fetchedData.job_details.rating,
      }

      const updatedSimilarJobsData = fetchedData.similar_jobs.map(eachItem => ({
        employmentType: eachItem.employment_type,
        companyLogoUrl: eachItem.company_logo_url,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobDataDetails: updatedJobData,
        similarJobsData: updatedSimilarJobsData,
        status: apiJobDetailsStatusConstants.success,
      })
    } else {
      this.setState({status: apiJobDetailsStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onRetryJobDetails = () => {
    this.getJobDetailsData()
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="text">
        We cannot seem to find the page you are looking for.
      </p>
      <button className="button" type="button" onClick={this.onRetryJobDetails}>
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {jobDataDetails, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      lifeAtCompany,
      location,
      packagePerAnnum,
      rating,
      skills,
      title,
    } = jobDataDetails
    return (
      <>
        <div className="job-details-container">
          <div className="first-part">
            <div className="image-item">
              <img
                src={companyLogoUrl}
                className="company-logo"
                alt="job details company logo"
              />
              <div className="type-rating">
                <h1 className="title">{title}</h1>
                <div className="rating-star">
                  <AiFillStar className="star" />
                  <p className="rating">{rating}</p>
                </div>
              </div>
            </div>
            <div className="location-type">
              <div className="start-part">
                <div>
                  <MdLocationOn />
                  <p className="text">{location}</p>
                </div>
                <div>
                  <IoBagHandleOutline />
                  <p className="text">{employmentType}</p>
                </div>
              </div>
              <p className="rating">{packagePerAnnum}</p>
            </div>
          </div>
          <hr className="hr-line" />
          <div className="second-part">
            <div className="link">
              <h1 className="description-head">Description</h1>
              <a href={companyWebsiteUrl} className="visit-anchor">
                Visit <FaExternalLinkAlt />
              </a>
            </div>
            <p className="job-description">{jobDescription}</p>
            <h1>Skills</h1>
            <ul className="skills-list">
              {skills.map(eachItem => (
                <li key={eachItem.name} className="li-job-details-container">
                  <img
                    alt={eachItem.name}
                    src={eachItem.imageUrl}
                    className="skills-image"
                  />
                  <p className="job-description">{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <h1>Life at Company</h1>
            <div className="life-at-company-container">
              <p className="job-description">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.imageUrl}
                alt="life at company"
                className="life-at-company"
              />
            </div>
          </div>
        </div>
        <h1>Similar Jobs</h1>
        <ul className="similar-jobs-list-container">
          {similarJobsData.map(eachItem => (
            <SimilarJobs
              key={eachItem.id}
              similarJobsData={eachItem}
              employmentType={employmentType}
            />
          ))}
        </ul>
      </>
    )
  }

  renderJobDetailsView = () => {
    const {status} = this.state

    switch (status) {
      case apiJobDetailsStatusConstants.success:
        return this.renderSuccessView()
      case apiJobDetailsStatusConstants.failure:
        return this.renderFailureView()
      case apiJobDetailsStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobDetailsView()}</div>
      </>
    )
  }
}

export default JobItemDetails
