import {BsStarFill, BsBagFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

import './index.css'

const SimilarJobs = props => {
  const {similarJobsData, employmentType} = props
  const {
    companyLogoUrl,
    jobDescription,
    location,
    rating,
    title,
  } = similarJobsData
  return (
    <li>
      <div className="similar-jobs-container">
        <div className="head-part">
          <img
            src={companyLogoUrl}
            className="company-logo"
            alt="similar job company logo"
          />
          <div className="type-and-rating-container">
            <h1 className="employment-type">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star" />
              <p className="rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <h1 className="employment-type">Description</h1>
        <p className="description">{jobDescription}</p>
        <div className="location-and-title">
          <div>
            <MdLocationOn />
            <p className="decsription">{location}</p>
          </div>
          <div>
            <BsBagFill />
            <p className="decsription">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobs
