import onChange from 'on-change'
import { updateProcessState, updateFormMessage } from './formView.js'
import { updateFeedItems, updateRssChannels } from './newsBlockView.js'

const selectors = {
  formId: 'add_rss_form',
  newsBlockId: 'news',
}

export default (initialState) => {
  const form = document.getElementById(selectors.formId)
  const newsBlock = document.getElementById(selectors.newsBlockId)

  const state = onChange(initialState, (path, value) => {
    switch (path) {
      case 'processState':
        updateProcessState(form, value)
        break
      case 'error':
        updateFormMessage(form, value)
        break
      case 'channels':
        updateRssChannels(newsBlock, value)
        break
      case 'items':
        updateFeedItems(value)
        break
      default:
        throw new Error(`Unknown state path ${path}`)
    }
  })

  return { form, newsBlock, state }
}
