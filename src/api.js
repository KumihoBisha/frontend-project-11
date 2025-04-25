import axios from 'axios'

const getRss = (url) => {
  const apiUrl = new URL('https://allorigins.hexlet.app/get')
  apiUrl.searchParams.set('disableCache', 'true')
  apiUrl.searchParams.set('url', url)

  return axios
    .get(apiUrl.toString())
    .then(response => response.data.contents)
    .catch(() => { throw new Error('error.network_error') })
}

export default getRss
