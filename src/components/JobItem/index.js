import {Link} from 'react-router-dom'

import {BsStarFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'
import {FiShoppingBag} from 'react-icons/fi'

import './index.css'

const JobItem = props => {
  const {jobData} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = jobData
  return (
    <Link to={`/jobs/${id}`}>
      <li className="job-list-item">
        <div className="list-item-container-top">
          <div className="job-item-first-part">
            <img src={companyLogoUrl} className="logo-url" alt="company logo" />
            <div className="type-rating">
              <h1 className="employment-type-heading">{title}</h1>
              <div className="rating-container">
                <BsStarFill className="star" />
                <p className="rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details">
            <div className="location-type">
              <div>
                <MdLocationOn />
                <p className="description">{location}</p>
              </div>
              <div>
                <FiShoppingBag />
                <p className="description">{employmentType}</p>
              </div>
            </div>
            <p className="description-heading">{packagePerAnnum}</p>
          </div>
        </div>

        <hr className="horizontal-line" />
        <div className="description-container">
          <h1 className="description-heading">Description</h1>
          <p className="description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}

export default JobItem
