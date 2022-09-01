const formatDate = () => {
  const date = new Date()
  const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  const hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  const minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  const seconds = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  const time = hours + ':' + minutes + ':' + seconds
  const formatedDate = day + '.' + date.getMonth() + '.' + date.getFullYear() + ' @' + time
  return formatedDate
}

module.exports = { formatDate }
