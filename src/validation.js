import { object, string } from 'yup';

const getValidation = (state) => object().shape({
  link: string()
    .url('error.invalid_url')
    .test(
      'is-unique',
      () => 'error.rss_already_added',
      (value) => !state.channels.some((channel) => channel.url === value),
    ),
});

export default getValidation;
