import i18next from 'i18next'

const createChannelElement = (id, title, description) => {
  const channelElement = document.createElement('div')
  channelElement.id = id
  channelElement.classList.add('container', 'py-4', 'px-3', 'mx-auto')

  const rowDiv = document.createElement('div')
  rowDiv.classList.add('row')

  const h4 = document.createElement('h4')
  h4.textContent = title

  const descriptionP = document.createElement('p')
  descriptionP.classList.add('fw-light', 'fst-italic')
  descriptionP.textContent = description

  const itemsDiv = document.createElement('div')
  itemsDiv.classList.add('items')

  rowDiv.appendChild(h4)
  rowDiv.appendChild(descriptionP)
  rowDiv.appendChild(itemsDiv)
  channelElement.appendChild(rowDiv)

  return channelElement
}

export const renderModalContent = (item) => {
  if (!item) return

  const rssModalHeaderElement = document.getElementById('rssItemModalLabel')
  rssModalHeaderElement.textContent = item.title

  const rssModalItemContent = document.getElementById('rssItemModalContent')
  rssModalItemContent.textContent = item.description

  const rssModalItemOpenButton = document.getElementById('rssModalItemOpenButton')
  rssModalItemOpenButton.textContent = i18next.t('label.open_full')
  rssModalItemOpenButton.target = '_blank'
  rssModalItemOpenButton.rel = 'noopener noreferrer'
  rssModalItemOpenButton.href = item.link
}

const createFeedItemElement = (item) => {
  const itemElement = document.createElement('div')
  itemElement.id = item.id
  itemElement.classList.add('item')

  const itemLinkElement = document.createElement('a')
  itemLinkElement.href = item.link
  itemLinkElement.textContent = item.title
  itemLinkElement.target = '_blank'
  itemLinkElement.rel = 'noopener noreferrer'
  const isVisited = window.appState?.visitedItems?.[item.id]
  itemLinkElement.classList.add(isVisited ? 'fw-normal' : 'fw-bold')

  const previewButton = document.createElement('button')
  previewButton.classList.add('btn', 'btn-outline-primary')
  previewButton.textContent = i18next.t('label.preview_button')
  previewButton.setAttribute('data-bs-toggle', 'modal')
  previewButton.setAttribute('data-bs-target', '#rssItemModal')
  previewButton.dataset.itemId = item.id

  const itemLinkContainer = document.createElement('div')
  itemLinkContainer.classList.add('item-link-container')

  itemLinkContainer.appendChild(itemLinkElement)
  itemLinkContainer.appendChild(previewButton)

  itemElement.appendChild(itemLinkContainer)

  return itemElement
}

export const updateFeedItems = (items) => {
  items.forEach((item) => {
    if (!document.getElementById(item.id)) {
      const channelElement = document.getElementById(item.channelUrl)
      if (!channelElement) return

      const itemElement = createFeedItemElement(item)

      if (window.appState?.visitedItems?.[item.id]) {
        const link = itemElement.querySelector('a')
        link.classList.replace('fw-bold', 'fw-normal')
      }

      channelElement.querySelector('.items').prepend(itemElement)
    }
  })
}

export const updateRssChannels = (newsBlock, channels) => {
  channels.forEach((channel) => {
    let channelElement = document.getElementById(channel.url)
    if (!channelElement) {
      channelElement = createChannelElement(channel.url, channel.title, channel.description)
      newsBlock.appendChild(channelElement)
    }
  })
}

export const updateVisitedItems = (state, value) => {
  const changedIds = typeof value === 'object' ? Object.keys(value) : [value.split('.')[1]]

  changedIds.forEach((itemId) => {
    const itemElement = document.getElementById(itemId)
    if (itemElement) {
      const link = itemElement.querySelector('a')
      if (link) {
        const isVisited = state.visitedItems[itemId]
        link.classList.toggle('fw-bold', !isVisited)
        link.classList.toggle('fw-normal', isVisited)
      }
    }
  })
}
