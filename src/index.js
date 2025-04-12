import { object, string } from 'yup';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import initializeState from './state.js';
import './scss/styles.scss';
import en from './assets/lang/en.json';
import ru from './assets/lang/ru.json';
import getRss from './api.js';

const app = () => {
  i18next.use(LanguageDetector).init({
    supportedLngs: ['ru', 'en'],
    fallbackLng: 'en',
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

  const initialState = {
    feeds: {},
    form: {
      error: '',
    },
    isLoading: false,
  };

  const appState = initializeState(initialState, form, news);

  const schema = object().shape({
    link: string()
      .url('error.invalid_url')
      .test('is-unique', () => 'error.rss_already_added', (value) => !appState.feeds[value]),
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputData = event.target[0].value;

    appState.isLoading = true;

    schema.validate({ link: inputData })
      .then((result) => {
        appState.form.error = '';
        return getRss(result.link).then((channel) => appState.feeds[result.link] === channel);
      })
      .catch((error) => {
        appState.form.error = error.message;
      })
      .finally(() => appState.isLoading === false);

    return false;
  });
};

app();
