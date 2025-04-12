import onChange from 'on-change';
import { updateErrorStatus, updateFormMessage, updateIsLoading } from './formView.js';
import { updateFeedItems, updateRssChannels } from './newsBlockView.js';

export default (initialState, selectors) => {
  const form = document.getElementById(selectors.formId);
  const newsBlock = document.getElementById(selectors.newsBlockId);

  const state = onChange(initialState, (path, value) => {
    switch (path) {
      case 'isLoading':
        updateIsLoading(form, value);
        break;
      case 'isError':
        updateErrorStatus(form, value);
        break;
      case 'formMessage':
        updateFormMessage(form, value);
        break;
      case 'channels':
        updateRssChannels(newsBlock, value);
        break;
      case 'items':
        updateFeedItems(value);
        break;
      default:
        throw new Error(`Unknown state path ${path}`);
    }
  });

  return { form, newsBlock, state };
};
