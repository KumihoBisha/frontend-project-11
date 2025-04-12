import axios from 'axios';

const getRss = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .then((response) => response.data.contents)
  .catch(() => { throw new Error('error.network_error'); });

export default getRss;
