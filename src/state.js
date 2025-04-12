import onChange from 'on-change';

const input = document.getElementById('rssLinkInput');
const form = document.getElementById('add_rss_form');

const errorMessage = document.createElement('p');
errorMessage.classList.add('text-danger');

const formState = onChange(
  { error: '' },
  () => {
    if (formState.error) {
      input.classList.add('is-invalid');
      errorMessage.innerText = formState.error;
      form.appendChild(errorMessage);
    } else {
      input.classList.remove('is-invalid');
      form.removeChild(errorMessage);
    }
  },
);

export default formState;
