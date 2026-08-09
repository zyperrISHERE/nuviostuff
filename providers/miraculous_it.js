/**
 * Miraculous Ladybug IT Scraper Plugin for Nuvio
 * Pure Promise chain execution for React Native Hermes compatibility.
 */

function getStreams(tmdbId, mediaType, season, episode) {
  const s = parseInt(season, 10) || 1;
  const e = parseInt(episode, 10) || 1;
  const targetUrl = 'https://miraculousladybugseason6.it.com/';

  return fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Referer': 'https://miraculousladybugseason6.it.com/'
    }
  })
    .then(function(response) {
      if (!response.ok) throw new Error('HTTP Error ' + response.status);
      return response.text();
    })
    .then(function(html) {
      const streams = [];

      const streamRegex = /<source[^>]+src=["']([^"']+\.(?:m3u8|mp4))["']/gi;
      const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;

      let match;
      while ((match = streamRegex.exec(html)) !== null) {
        streams.push({
          name: "Miraculous IT",
          title: "S" + s + "E" + e + " - Direct Stream",
          url: match[1],
          quality: "1080p",
          format: "m3u8",
          headers: {
            "Referer": "https://miraculousladybugseason6.it.com/"
          }
        });
      }

      if (streams.length === 0) {
        while ((match = iframeRegex.exec(html)) !== null) {
          let embedUrl = match[1];
          if (embedUrl.startsWith('//')) embedUrl = 'https:' + embedUrl;

          streams.push({
            name: "Miraculous IT",
            title: "S" + s + "E" + e + " - Embed Player",
            url: embedUrl,
            quality: "720p",
            format: "mp4"
          });
        }
      }

      return streams;
    })
    .catch(function(error) {
      console.error('[Miraculous IT Error]:', error.message);
      return [];
    });
}

module.exports = { getStreams };
