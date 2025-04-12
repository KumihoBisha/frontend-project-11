import onChange from 'on-change';
import i18next from 'i18next';

const createFeedItemElement = (item) => {
  const itemElement = document.createElement('div');
  itemElement.id = item.guid;

  itemElement.innerHTML = `
    <a target="_blank" rel="noopener noreferrer" class="fw-bold" href="${item.link}">${item.title}</a>
    <p class="fw-lighter fst-italic">${item.description}</p>
  `;

  return itemElement;
};

const createFeedElement = (id, title, description) => {
  const feedElement = document.createElement('div');
  feedElement.id = id;
  feedElement.classList.add('container', 'py-4', 'px-3', 'mx-auto');

  feedElement.innerHTML = `
    <div class="row">
      <h4>${title}</h4>
      <p class="fw-light fst-italic">${description}</p>
    </div>
  `;

  return feedElement;
};

const updateForm = (form, error) => {
  const input = form.getElementsByTagName('input')[0];
  const errorMessage = form.getElementsByClassName('error')[0];

  if (error) {
    input.classList.add('is-invalid');
    errorMessage.innerText = i18next.t(error);
  } else {
    input.classList.remove('is-invalid');
    errorMessage.innerText = '';
  }
};

const updateFeed = (feed, channel, newsBlock) => {
  console.log(`${feed} : ${JSON.stringify(channel)}`);

  let feedElement = document.getElementById(feed);
  if (!feedElement) {
    feedElement = createFeedElement(feed, channel.title, channel.description);
    newsBlock.appendChild(feedElement);
  }

  channel.items.forEach((item) => {
    const itemElement = createFeedItemElement(item);
    feedElement.appendChild(itemElement);
  });
};

const updateIsLoading = (form, isLoading) => {
  const submitButton = form.getElementsByTagName('button')[0];

  if (isLoading) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  } else {
    submitButton.disabled = false;
    submitButton.innerHTML = i18next.t('label.submit_button');
  }
};

const initializeState = (initialState, form, newsBlock) => {
  const state = onChange(initialState, (path, value) => {
    switch (path.split('.')[0]) {
      case 'form':
        updateForm(form, value);
        break;
      case 'feeds':
        updateFeed(path.substring(path.indexOf('.') + 1), value, newsBlock);
        break;
      case 'isLoading':
        updateIsLoading(form, value);
        break;
      default:
        console.log(`Unknown key: ${path}`);
    }
  });

  return state;
};

export default initializeState;
