const DOM_PARSER = new DOMParser();

const parseRss = (data) => {
  const dom = DOM_PARSER.parseFromString(data, 'text/xml');

  const parseError = dom.querySelector('parsererror');
  if (parseError) {
    throw new Error(parseError.textContent);
  }

  const rssElement = dom.querySelector('rss');
  const channelElement = rssElement.querySelector('channel');

  const channel = {
    title: channelElement.querySelector('title').textContent,
    description: channelElement.querySelector('description').textContent,
  };

  const items = Array.from(channelElement.getElementsByTagName('item')).map((item) => {
    const itemGuid = item.querySelector('guid').textContent;
    const itemTitle = item.querySelector('title').textContent;
    const itemDescription = item.querySelector('description').textContent;
    const itemLink = item.querySelector('link').textContent;
    const pubDate = Date.parse(item.querySelector('pubDate').textContent);

    return {
      guid: itemGuid,
      title: itemTitle,
      description: itemDescription,
      link: itemLink,
      pubDate,
    };
  });

  return { channel, items };
};

export default parseRss;
