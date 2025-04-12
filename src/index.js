import { object, string } from 'yup';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import './scss/styles.scss';
import en from './assets/lang/en.json';
import ru from './assets/lang/ru.json';
import getRss from './api/getRss.js';
import initializeForm from './view/formView.js';
import initializeNewsBlock from './view/newsBlockView.js';

const launchUpdatingRss = (newsState) => {
  const updateAfterDelay = (promiseChain) => {
    let newPromiseChain = promiseChain;

    setTimeout(() => {
      Object.keys(newsState).forEach((feedUrl) => {
        newPromiseChain = newPromiseChain
          .then(() => getRss(feedUrl).then((newFeed) => {
            const items = [...newFeed.items];
            newsState[feedUrl].items.forEach((item) => {
              if (!items.some((it) => it.guid === item.guid)) items.push(item);
            });

            newsState[feedUrl].items = items;
          }))
          .catch((e) => console.error(e));
      });

      newPromiseChain.then(() => updateAfterDelay(newPromiseChain));
    }, 5000);
  };

  updateAfterDelay(Promise.resolve());
};

const app = () => {
  i18next.use(LanguageDetector).init({
    supportedLngs: ['ru', 'en'],
    fallbackLng: 'ru',
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
    },
  });

  const form = document.getElementById('add_rss_form');
  const news = document.getElementById('news');

  const formState = initializeForm(form);
  const newsState = initializeNewsBlock(news);

  launchUpdatingRss(newsState);

  const schema = object().shape({
    link: string()
      .url('error.invalid_url')
      .test('is-unique', () => 'error.rss_already_added', (value) => !newsState[value]),
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputData = event.target[0].value;

    formState.isLoading = true;

    schema.validate({ link: inputData })
      .then((result) => {
        formState.error = '';
        return getRss(result.link).then((channel) => newsState[result.link] === channel);
      })
      .catch((error) => {
        formState.error = error.message;
      })
      .finally(() => formState.isLoading === false);

    return false;
  });
};

app();
