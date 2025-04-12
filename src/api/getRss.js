import axios from 'axios';

const DOM_PARSER = new DOMParser();

const parseRss = (data) => {
  const dom = DOM_PARSER.parseFromString(data, 'text/xml');

  const rss = dom.getElementsByTagName('rss')[0];
  if (!rss) return null;

  const channel = rss.getElementsByTagName('channel')[0];
  if (!channel) return null;

  const channelTitle = channel.getElementsByTagName('title')[0].childNodes[0].nodeValue;
  const channelDescription = channel.getElementsByTagName('description')[0].childNodes[0].nodeValue;

  const items = Array.from(channel.getElementsByTagName('item')).map((item) => {
    const itemGuid = item.getElementsByTagName('guid')[0].childNodes[0].nodeValue;
    const itemTitle = item.getElementsByTagName('title')[0].childNodes[0].nodeValue;
    const itemDescription = item.getElementsByTagName('description')[0].childNodes[0].nodeValue;
    const itemLink = item.getElementsByTagName('link')[0].childNodes[0].nodeValue;
    const pubDate = Date.parse(item.getElementsByTagName('pubDate')[0].childNodes[0].nodeValue);

    return {
      guid: itemGuid,
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
      pubDate,
    };
  });

  return {
    title: channelTitle,
    description: channelDescription,
    items,
  };
};

const getRss = (url) => axios
  .get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`)
  .catch((err) => {
    console.error(err);
    throw new Error('error.network_error');
  })
  .then((response) => parseRss(response.data.contents));

export default getRss;
