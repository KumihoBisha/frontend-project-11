import { object, string, url } from 'yup';
import './scss/styles.scss';
import * as bootstrap from 'bootstrap';
import formState from './state.js';

const feedList = [];

const schema = object({
  link: string().url('Некорректный URL').test('is-unique', (d) => `${d.value} уже есть в списке источников`, (value) => !feedList.includes(value)),
});

const applyRss = (event) => {
  event.preventDefault();
  const inputData = document.getElementById('rssLinkInput').value;
  schema.validate({ link: inputData })
    .then((result) => {
      formState.error = '';
      feedList.push(result.link);

      console.log(feedList);
    })
    .catch((error) => { formState.error = error.message; });

  return false;
};

const form = document.getElementById('add_rss_form');
form.addEventListener('submit', applyRss);
