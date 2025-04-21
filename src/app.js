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
          .then((response) => {
            const rss = parseRss(response);
            rss.items.forEach((newItem) => {
              if (!state.items.some((currItem) => currItem.id === newItem.id)) {
                const item = newItem;
                item.channelUrl = channel.url;
                state.items.push(item);
              }
            });
          })
          .catch((e) => console.error(e)));
      });

      newPromiseChain.then(() => updateAfterDelay(newPromiseChain));
    }, 5000);
  };

  updateAfterDelay(Promise.resolve());
};

const app = () => {
  const initialState = {
    processState: 'filling', // Состояния: 'filling', 'loading', 'failed', 'success'
    formMessage: '',
    channels: [],
    items: [],
  };

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const { form, state } = view(initialState);

    const validation = getValidation(state);
    launchUpdatingRss(state);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const inputField = event.target[0];
      state.processState = 'loading';

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
              state.processState = 'success';
              state.formMessage = 'success';
              inputField.value = '';
            } catch (e) {
              console.error(e);
              state.processState = 'failed';
              state.formMessage = 'error.no_valid_rss';
            }
          }))
        .catch((error) => {
          state.processState = 'failed';
          state.formMessage = error.message;
        });
    });
  });
};

export default app;
