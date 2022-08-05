import axios from 'axios'

const baseurl = process.env.REACT_APP_SERVER_URL || window.location.origin

const healthCheck = async () => {
  const response = await axios.get(`${baseurl}/healthz`)
  console.log(response)
  return response
}

export default { healthCheck }
