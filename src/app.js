import { object, string } from 'yup';
import i18next from 'i18next';

import ru from './lang/ru.js';
import getRss from './api/getRss.js';
import initializeForm from './view/formView.js';
import initializeNewsBlock from './view/newsBlockView.js';

const launchUpdatingRss = (newsState) => {
  const updateAfterDelay = (promiseChain) => {
    let newPromiseChain = promiseChain;

    setTimeout(() => {
      Object.keys(newsState).forEach((feedUrl) => {
        newPromiseChain = newPromiseChain.then(() => getRss(feedUrl).then((newFeed) => {
          const currItems = newsState[feedUrl].items;
          const newItems = newFeed.items;

          newItems.forEach((newItem) => {
            if (!currItems.some((currItem) => currItem.guid === newItem.guid)) {
              currItems.push(newItem);
            }
          });
        }))
          .catch((e) => console.error(e));
      });

      newPromiseChain.then(() => updateAfterDelay(newPromiseChain));
    }, 5000);
  };

  updateAfterDelay(Promise.resolve());
};

const app = () => {
  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  });

  const form = document.getElementById('add_rss_form');
  const formInitialState = {
    message: {},
    isLoading: false,
  };
  const formState = initializeForm(form, formInitialState);

  const news = document.getElementById('news');
  const newsInitialState = {};
  const newsState = initializeNewsBlock(news, newsInitialState);

  launchUpdatingRss(newsState);

  const schema = object().shape({
    link: string()
      .url('error.invalid_url')
      .test('is-unique', () => 'error.rss_already_added', (value) => !newsState[value]),
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputField = event.target[0];
    formState.isLoading = true;

    schema.validate({ link: inputField.value })
      .then((result) => getRss(result.link).then((channel) => {
        if (channel) newsState[result.link] = channel;
        else throw new Error('error.no_valid_rss');
      }))
      .then(() => {
        formState.message = { isError: false, textId: 'success' };
        inputField.value = '';
      })
      .catch((error) => {
        formState.message = { isError: true, textId: error.message };
      })
      .finally(() => {
        formState.isLoading = false;
      });

    return false;
  });
};

export default app;
