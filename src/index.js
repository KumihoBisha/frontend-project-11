import { object, string, setLocale } from 'yup';
import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import initializeFormState from './formView.js';
import './scss/styles.scss';
import en from './assets/lang/en.json';
import ru from './assets/lang/ru.json';

const app = () => {
  const appState = {
    feedList: [],
  };

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

  setLocale({
    string: {
      url: () => 'invalid_url',
    },
  });

  const schema = object().shape({
    link: string()
      .url()
      .test('is-unique', () => 'rss_already_added', (value) => !appState.feedList.includes(value)),
  });

  const form = document.getElementById('add_rss_form');
  const formState = initializeFormState({ error: '' }, form);

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputData = event.target[0].value;

    schema.validate({ link: inputData })
      .then((result) => {
        formState.error = '';
        appState.feedList.push(result.link);

        console.log(appState.feedList);
      })
      .catch((error) => { formState.error = error.message; });

    return false;
  });
};

app();
