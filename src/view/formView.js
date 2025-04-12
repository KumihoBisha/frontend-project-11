import onChange from 'on-change';
import i18next from 'i18next';

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

const initializeForm = (form) => {
  const initialState = {
    error: '',
    isLoading: false,
  };

  return onChange(initialState, (path, value) => {
    switch (path) {
      case 'error':
        updateForm(form, value);
        break;
      case 'isLoading':
        updateIsLoading(form, value);
        break;
      default:
        console.error(`Unexpected key ${path}`);
    }
  });
};

export default initializeForm;
