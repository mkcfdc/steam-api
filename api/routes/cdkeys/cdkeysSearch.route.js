import express from 'express';
import axios from 'axios';

import { redis } from '../../middleware/cacheMiddleware.js';

const router = express.Router();

const CDKEYS_APPID = process.env.CDKEYS_API_APPID;
const CDKEYS_API_KEY = process.env.CDKEYS_API_KEY;

router.post('/cdkeys/search', async (req, res) => {
  const query = req.body.query;
  const searchQuery = encodeURI(query);

  const cache = await redis.get(`cdKeys:${query}`);
  if(cache) return res.json(JSON.parse(cache));

  let data = JSON.stringify({
    "requests": [
      {
        "indexName": "magento2_default_products",
        "params": `highlightPreTag=__ais-highlight__&highlightPostTag=__%2Fais-highlight__&page=0&ruleContexts=%5B%22magento_filters%22%5D&hitsPerPage=24&clickAnalytics=true&query=${searchQuery}&maxValuesPerFacet=10&facets=%5B%22restricted_countries%22%2C%22platforms%22%2C%22region%22%2C%22language%22%2C%22genres%22%2C%22price.CAD.default%22%5D&tagFilters=&facetFilters=%5B%22restricted_countries%3A-CA%22%5D&numericFilters=%5B%22visibility_search%3D1%22%2C%5B%22region_id%3D39%22%2C%22region_id%3D418%22%2C%22region_id%3D863%22%2C%22region_id%3D3505%22%5D%5D`
      }
    ]
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: `https://${CDKEYS_APPID}-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.13.1)%3B%20Browser%3B%20instantsearch.js%20(4.41.0)%3B%20Magento2%20integration%20(3.10.5)%3B%20JS%20Helper%20(3.8.2)`,
    headers: {
      'Content-Type': 'application/json',
      'x-algolia-api-key': CDKEYS_API_KEY,
      'x-algolia-application-id': CDKEYS_APPID
    },
    data: data
  };

  try {
    const response = await axios.request(config);
    const hits = response.data.results[0].hits;
  
    // Create an array to store the simplified hits
    const simplifiedHits = hits.map(hit => ({
      name: hit.name,
      url: hit.url,
      in_stock: hit.in_stock,
      price: {
        CAD: hit.price.CAD,
        USD: hit.price.USD
      },
      delivery_speed: hit.delivery_speed,
      platforms: hit.platforms,
      match_level: hit._highlightResult.name.matchLevel,
      dlc: hit.dlc,
      thumbnail_url: hit.thumbnail_url,
      image_url: hit.image_url
    }));
  
    // Get the current timestamp
    const lastUpdated = new Date();
  
    // Cache the data in Redis with the timestamp
    await redis.setex(`cdKeys:${query}`, 86400, JSON.stringify({
      data: simplifiedHits,
      last_updated: lastUpdated.toISOString() // Format the timestamp as ISO string
    }));
  
    res.json({
      data: simplifiedHits,
      last_updated: lastUpdated.toISOString() // Include the timestamp in the response
    });
  } catch (error) {
    console.error('Error during search:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;