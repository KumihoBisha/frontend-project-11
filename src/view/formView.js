import i18next from 'i18next'

export const updateFormMessage = (form, message) => {
  const messageElement = form.querySelector('p')
  messageElement.innerText = message ? i18next.t(message) : ''
}

export const updateProcessState = (form, processState) => {
  const inputElement = form.querySelector('input')
  const messageElement = form.querySelector('p')
  const submitButton = form.querySelector('button')

  inputElement.classList.remove('is-invalid')
  messageElement.classList.remove('text-success', 'text-danger')
  submitButton.disabled = false
  submitButton.innerHTML = i18next.t('label.submit_button')

  switch (processState) {
    case 'loading':
      submitButton.disabled = true
      submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>'
      break
    case 'failed':
      inputElement.classList.add('is-invalid')
      messageElement.classList.add('text-danger')
      break
    case 'success':
      messageElement.classList.add('text-success')
      break
    case 'filling':
      break
    default:
      throw new Error(`Unknown process state: ${processState}`)
  }
}
