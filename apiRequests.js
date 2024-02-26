import axios from 'axios';

const API_BASE_URL = 'https://api.valantis.store:41000';

function calculateAuthHeader(password) {
  const timestamp = new Date().toISOString().split('T')[0];
  const authValue = `md5(${password}_${timestamp})`;
  return { 'X-Auth': authValue };
}

const defaultConfig = {
  method: 'post',
  url: API_BASE_URL,
  headers: calculateAuthHeader('Valantis'),
};

export async function getIds({ offset = 0, limit = 50, config = {} } = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  mergedConfig.data = {
    action: 'get_ids',
    params: { offset, limit },
  };

  try {
    const response = await axios(mergedConfig);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching product IDs: ${error.message}`);
    return [];
  }
}

export async function getProducts(ids, config = {}) {
  const mergedConfig = { ...defaultConfig, ...config };
  mergedConfig.data = {
    action: 'get_items',
    params: { ids },
  };

  try {
    const response = await axios(mergedConfig);
    return response.data.result;
  } catch (error) {
    console.error(`Error fetching products: ${error.message}`);
    return [];
  }
}