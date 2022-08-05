import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import health from '../services/health'

const HealthCheck = () => {
  const [HealthStatus, setHealthStatus] = useState()
  const [error, setError] = useState()
  useEffect(async () => {
    try {
      const healthCheck = await health.healthCheck()
      setHealthStatus(healthCheck)
      console.log(healthCheck.status)
    } catch (err) {
      setError(err)
      console.log(err.message)
    }
  }, [])

  if (!HealthStatus && !error) {
    return null
  }

  if (!HealthStatus) {
    return (
      <div>
        <h3>{`Request made to: ${error.config.url}`}</h3>
        <label>Server is not ready</label>
        <p>Status code: 500</p>
        <Link to="/">Back</Link>
      </div>
    )
  }

  return (
    <div>
      <h3>{`Request made to: ${HealthStatus.config.url}`}</h3>
      <label>{HealthStatus.data}</label>
      <p>
        With status code: <b>{HealthStatus.status}</b> {`${HealthStatus.statusText}!`}
      </p>
      <Link to="/">Back</Link>
    </div>
  )
}

export default HealthCheck
