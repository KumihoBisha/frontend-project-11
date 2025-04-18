import i18next from 'i18next';
import onChange from 'on-change';

const visitedItemsState = onChange({}, (path, value) => {
  const itemElement = document.getElementById(path);
  const itemLinkElement = itemElement.getElementsByTagName('a')[0];

  if (value) {
    itemLinkElement.classList.remove('fw-bold');
    itemLinkElement.classList.add('fw-normal');
  }
});

const createChannelElement = (id, title, description) => {
  const channelElement = document.createElement('div');
  channelElement.id = id;
  channelElement.classList.add('container', 'py-4', 'px-3', 'mx-auto');

  channelElement.innerHTML = `
     <div class="row">
       <h4>${title}</h4>
       <p class="fw-light fst-italic">${description}</p>
       <div class="items"></div>
     </div>
   `;

  return channelElement;
};

export const updateModal = (item) => {
  const rssModalHeaderElement = document.getElementById('rssItemModalLabel');
  rssModalHeaderElement.innerText = item.title;

  const rssModalItemContent = document.getElementById('rssItemModalContent');
  rssModalItemContent.innerText = item.description;

  const rssModalItemOpenButton = document.getElementById('rssModalItemOpenButton');
  rssModalItemOpenButton.innerText = i18next.t('label.open_full');
  rssModalItemOpenButton.target = '_blank';
  rssModalItemOpenButton.rel = 'noopener noreferrer';
  rssModalItemOpenButton.href = item.link;
};

const createFeedItemElement = (item) => {
  const itemElement = document.createElement('div');
  itemElement.id = item.guid;
  itemElement.classList.add('item');

  const itemLinkElement = document.createElement('a');
  itemLinkElement.href = item.link;
  itemLinkElement.innerText = item.title;
  itemLinkElement.target = '_blank';
  itemLinkElement.rel = 'noopener noreferrer';
  itemLinkElement.classList.add('fw-bold');

  const previewButton = document.createElement('button');
  previewButton.classList.add('btn', 'btn-outline-primary');
  previewButton.innerText = i18next.t('label.preview_button');
  previewButton.setAttribute('data-bs-toggle', 'modal');
  previewButton.setAttribute('data-bs-target', '#rssItemModal');
  previewButton.addEventListener('click', () => {
    visitedItemsState[item.guid] = true;
    updateModal(item);
  });

  const itemLinkContainer = document.createElement('div');
  itemLinkContainer.classList.add('item-link-container');

  itemLinkContainer.appendChild(itemLinkElement);
  itemLinkContainer.appendChild(previewButton);

  itemElement.appendChild(itemLinkContainer);

  return itemElement;
};

export const updateFeedItems = (channelItems) => {
  channelItems.forEach((item) => {
    if (!document.getElementById(item.guid)) {
      const channelElement = document.getElementById(item.channelUrl);
      const itemElement = createFeedItemElement(item);

      channelElement.querySelector('.items').prepend(itemElement);
    }
  });
};

export const updateRssChannels = (newsBlock, channels) => {
  channels.forEach((channel) => {
    let channelElement = document.getElementById(channel.url);
    if (!channelElement) {
      channelElement = createChannelElement(channel.url, channel.title, channel.description);
      newsBlock.appendChild(channelElement);
    }
  });
};
