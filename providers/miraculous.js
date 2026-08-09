/**
 * Nuvio Provider for Miraculous.to
 * Pure Promise implementation for direct Hermes engine compatibility.
 */

function getStreams(tmdbId, mediaType, season, episode) {
  if (mediaType !== 'tv' && mediaType !== 'series') {
    return Promise.resolve([]);
  }

  const s = parseInt(season, 10);
  const e = parseInt(episode, 10);
  
  // Endpoint formatting for season & episode directory
  const targetUrl = `https://miraculous.to/en/season-${s}/`;

  return fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'text/html'
    }
  })
    .then(response => {
      if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
      return response.text();
    })
    .then(html => {
      const streams = [];

      // Extract direct HLS / video stream URLs
      const streamRegex = /<source[^>]+src=["']([^"']+\.(?:m3u8|mp4))["']/gi;
      const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;

      let match;

      while ((match = streamRegex.exec(html)) !== null) {
        streams.push({
          name: "Miraculous.to",
          title: `S${s}E${e} - Direct Stream (HLS/MP4)`,
          url: match[1],
          quality: "1080p",
          behaviorHints: {
            proxyHeaders: {
              "Referer": "https://miraculous.to/"
            }
          }
        });
      }

      // Fallback: extract iframe embeds if no direct streams are found
      if (streams.length === 0) {
        while ((match = iframeRegex.exec(html)) !== null) {
          streams.push({
            name: "Miraculous.to",
            title: `S${s}E${e} - Embedded Player`,
            url: match[1],
            quality: "720p"
          });
        }
      }

      return streams;
    })
    .catch(error => {
      console.error('[Miraculous Provider] Error:', error.message);
      return [];
    });
}

module.exports = { getStreams };
