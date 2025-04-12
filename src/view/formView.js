import onChange from 'on-change';
import i18next from 'i18next';

const updateForm = (form, message) => {
  const inputElement = form.getElementsByTagName('input')[0];
  const messageElement = form.getElementsByTagName('p')[0];

  if (message) {
    messageElement.innerText = i18next.t(message.textId);

    if (message.isError) {
      inputElement.classList.add('is-invalid');
      messageElement.classList.remove('text-success');
      messageElement.classList.add('text-danger');
    } else {
      inputElement.classList.remove('is-invalid');
      messageElement.classList.remove('text-danger');
      messageElement.classList.add('text-success');
    }
  } else {
    inputElement.classList.remove('is-invalid');
    messageElement.innerText = '';
  }
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

const initializeForm = (form, initialState) => onChange(initialState, (path, value) => {
  switch (path) {
    case 'message':
      updateForm(form, value);
      break;
    case 'isLoading':
      updateIsLoading(form, value);
      break;
    default:
      console.error(`Unexpected key ${path}`);
  }
});

export default initializeForm;
