/**
 * Debugging Scraper for Miraculous.to
 */

function getStreams(tmdbId, mediaType, season, episode) {
  const s = parseInt(season, 10) || 1;
  const e = parseInt(episode, 10) || 1;
  const targetUrl = `https://miraculous.to/en/season-${s}/`;

  console.log(`[Miraculous Plugin] Fetching target: ${targetUrl}`);

  return fetch(targetUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Referer': 'https://miraculous.to/'
    }
  })
    .then(response => {
      console.log(`[Miraculous Plugin] HTTP Status: ${response.status}`);
      return response.text();
    })
    .then(html => {
      console.log(`[Miraculous Plugin] HTML Length Received: ${html.length}`);

      // Check for Cloudflare challenge response
      if (html.includes('Just a moment...') || html.includes('cf-challenge') || html.includes('enable JavaScript')) {
        console.error('[Miraculous Plugin] Blocked by Cloudflare protection.');
        return [];
      }

      const streams = [];
      const iframeRegex = /<iframe[^>]+src=["']([^"']+)["']/gi;
      let match;

      while ((match = iframeRegex.exec(html)) !== null) {
        let embedUrl = match[1];
        if (embedUrl.startsWith('//')) embedUrl = 'https:' + embedUrl;

        streams.push({
          name: "Miraculous.to",
          title: `Season ${s} Episode ${e} (Embed)`,
          url: embedUrl,
          quality: "720p",
          format: "mp4"
        });
      }

      console.log(`[Miraculous Plugin] Streams Found: ${streams.length}`);
      return streams;
    })
    .catch(error => {
      console.error('[Miraculous Plugin Error]:', error.message);
      return [];
    });
}

module.exports = { getStreams };
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
