import axios from 'axios';

const DOM_PARSER = new DOMParser();

const getTextFromTag = (tag) => tag.innerHTML.replace('<![CDATA[', '').replace(']]>', '');

const parseRss = (data) => {
  const rss = DOM_PARSER.parseFromString(data, 'application/xml')
    .getElementsByTagName('rss')[0];
  if (!rss) throw new Error('error.no_valid_rss');

  const channel = rss.getElementsByTagName('channel')[0];
  if (!channel) throw new Error('error.no_valid_rss');

  const channelTitle = getTextFromTag(channel.getElementsByTagName('title')[0]);
  const channelDescription = getTextFromTag(channel.getElementsByTagName('description')[0]);

  const items = Array.from(channel.getElementsByTagName('item')).map((item) => {
    const itemGuid = getTextFromTag(item.getElementsByTagName('guid')[0]);
    const itemTitle = getTextFromTag(item.getElementsByTagName('title')[0]);
    const itemDescription = getTextFromTag(item.getElementsByTagName('description')[0]);
    const itemLink = getTextFromTag(item.getElementsByTagName('link')[0]);
    const pubDate = Date.parse(getTextFromTag(item.getElementsByTagName('pubDate')[0]));

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
  .then((response) => {
    if (response.status !== 200) throw new Error('error.error_connecting_to_rss');
    return parseRss(response.data.contents);
  });

export default getRss;
