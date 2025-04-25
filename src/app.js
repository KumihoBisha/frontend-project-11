import i18next from 'i18next'
import ru from './lang/ru.js'
import getRss from './api.js'
import view from './view/index.js'
import parseRss from './parse.js'
import getValidation from './validation.js'

const launchUpdatingRss = (state) => {
  const updateFeeds = () => {
    const promises = state.channels.map(channel =>
      getRss(channel.url)
        .then((response) => {
          const rss = parseRss(response)
          rss.items.forEach((newItem) => {
            if (!state.items.some(currItem => currItem.id === newItem.id)) {
              const item = newItem
              item.channelUrl = channel.url
              state.items.push(item)
            }
          })
        })
        .catch(e => console.error(e)),
    )

    Promise.all(promises)
      .finally(() => {
        setTimeout(updateFeeds, 5000)
      })
  }

  updateFeeds()
}

const app = () => {
  const initialState = {
    processState: 'filling',
    error: null,
    channels: [],
    items: [],
    modalItem: null,
    visitedItems: {},
  }

  i18next.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: ru,
      },
    },
  }).then(() => {
    const { form, state } = view(initialState)
    window.appState = state

    const validation = getValidation(state)
    launchUpdatingRss(state)

    document.addEventListener('click', (e) => {
      const previewButton = e.target.closest('[data-bs-toggle="modal"]')
      if (previewButton) {
        const itemId = previewButton.dataset.itemId
        state.visitedItems = {
          ...state.visitedItems,
          [itemId]: true,
        }
        state.modalItem = state.items.find(i => i.id === itemId)
      }

      const itemLink = e.target.closest('a[target="_blank"]')
      if (itemLink) {
        const itemElement = itemLink.closest('.item')
        if (itemElement) {
          const itemId = itemElement.id
          state.visitedItems = {
            ...state.visitedItems,
            [itemId]: true,
          }
          state.visitedItems = { ...state.visitedItems }
        }
      }
    })

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const inputField = event.target[0]
      state.processState = 'loading'
      state.error = null

      validation.validate({ link: inputField.value })
        .then(result => getRss(result.link))
        .then((rawRss) => {
          try {
            const { channel, items } = parseRss(rawRss)

            channel.url = inputField.value
            const updatedItems = items.map(item => ({
              ...item,
              channelUrl: channel.url,
            }))

            state.channels.push(channel)
            state.items.push(...updatedItems.reverse())
            state.processState = 'success'
            inputField.value = ''
          }
          catch (e) {
            console.error(e)
            state.processState = 'failed'
            state.error = 'error.no_valid_rss'
          }
        })
        .catch((error) => {
          state.processState = 'failed'
          state.error = error.message
        })
    })
  })
}

export default app
