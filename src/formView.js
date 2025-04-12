import onChange from 'on-change';
import i18next from 'i18next';

const initializeFormState = (initialState, form) => {
  const input = form.getElementsByTagName('input')[0];
  const errorMessage = document.createElement('p');
  errorMessage.classList.add('text-danger');

  const state = onChange(initialState, () => {
    if (state.error) {
      input.classList.add('is-invalid');

      errorMessage.innerText = i18next.t(state.error);
      form.appendChild(errorMessage);
    } else {
      input.classList.remove('is-invalid');
      form.removeChild(errorMessage);
    }
  });

  return state;
};

export default initializeFormState;
