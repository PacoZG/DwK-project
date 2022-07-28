import axios from 'axios'
import moment from 'moment'

const url = 'https://picsum.photos/1200'
const baseurl = process.env.REACT_APP_SERVER_URL || window.location.origin

const getImage = async () => {
  const response = await axios.get(`${baseurl}/api/image`)
  return response.data
}

const postImage = async () => {
  console.log(`Posting image to ${baseurl}/api/image`)

  const getRandomURL = await axios.get(url)
  const newDate = moment().format('YYYY-MM-DD')

  const imageData = {
    date: newDate,
    imageURL: getRandomURL.request.responseURL,
  }
  await axios.post(`${baseurl}/api/image`, imageData)
  return imageData
}

export default { getImage, postImage }
