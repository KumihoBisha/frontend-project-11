import i18next from 'i18next';
import ru from './lang/ru.js';
import getRss from './api.js';
import view from './view/index.js';
import parseRss from './parse.js';
import getValidation from './validation.js';

const launchUpdatingRss = (state) => {
  const updateAfterDelay = (promiseChain) => {
    let newPromiseChain = promiseChain;

    setTimeout(() => {
      state.channels.forEach((channel) => {
        newPromiseChain = newPromiseChain.then(() => getRss(channel.url)
          .then((response) => parseRss(response))
          .then((rss) => rss.items.forEach((newItem) => {
            if (!state.items.some((currItem) => currItem.guid === newItem.guid)) {
              const item = newItem;
              item.channelUrl = channel.url;
              state.items.push(item);
            }
          }))
          .catch((e) => console.error(e)));
      });

      newPromiseChain.then(() => updateAfterDelay(newPromiseChain));
    }, 5000);
  };

  updateAfterDelay(Promise.resolve());
};

const app = () => {
  const initialState = {
    isLoading: false,
    isError: false,
    formMessage: '',
    channels: [],
    items: [],
  };

  const selectors = {
    formId: 'add_rss_form',
    newsBlockId: 'news',
  };

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const { form, state } = view(initialState, selectors);

    const validation = getValidation(state);
    launchUpdatingRss(state);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const inputField = event.target[0];
      state.isLoading = true;

      validation.validate({ link: inputField.value })
        .then((result) => getRss(result.link)
          .then((rawRss) => {
            try {
              const { channel, items } = parseRss(rawRss);

              channel.url = result.link;
              const eslintItems = items.map((item) => {
                const eslintItem = item;
                eslintItem.channelUrl = channel.url;
                return eslintItem;
              });

              state.channels.push(channel);
              state.items.push(...eslintItems.reverse());
            } catch (e) {
              console.error(e);
              throw new Error('error.no_valid_rss');
            }
          }))
        .then(() => {
          state.formMessage = 'success';
          state.isError = false;
          inputField.value = '';
        })
        .catch((error) => {
          state.formMessage = error.message;
          state.isError = true;
        })
        .finally(() => {
          state.isLoading = false;
        });

      return false;
    });
  });
};

export default app;
