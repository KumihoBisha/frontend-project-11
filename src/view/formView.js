import i18next from 'i18next';

export const updateFormMessage = (form, message) => {
  const messageElement = form.querySelector('p');
  messageElement.innerText = message ? i18next.t(message) : '';
};

export const updateErrorStatus = (form, isError) => {
  const inputElement = form.querySelector('input');
  const messageElement = form.querySelector('p');

  if (isError) {
    inputElement.classList.add('is-invalid');
    messageElement.classList.remove('text-success');
    messageElement.classList.add('text-danger');
  } else {
    inputElement.classList.remove('is-invalid');
    messageElement.classList.remove('text-danger');
    messageElement.classList.add('text-success');
  }
};

export const updateIsLoading = (form, isLoading) => {
  const submitButton = form.querySelector('button');

  if (isLoading) {
    submitButton.disabled = true;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
  } else {
    submitButton.disabled = false;
    submitButton.innerHTML = i18next.t('label.submit_button');
  }
};
