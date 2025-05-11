const BASE_URL = `https://api.coinpaprika.com/v1`;

async function safeFetch(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch failed for ${url}:`, error);
    // 앱에서 사용할 수 있는 기본 값 반환 또는 null
    return null;
  }
}

export async function fetchCoins() {
  return safeFetch(`${BASE_URL}/coins`);
}

export async function fetchCoinInfo(coinId: string) {
  return safeFetch(`${BASE_URL}/coins/${coinId}`);
}

export async function fetchCoinTickers(coinId: string) {
  return safeFetch(`${BASE_URL}/tickers/${coinId}`);
}

/* 교육용 노마드 코더 코인 API*/
export async function fetchCoinHistory(coinId: string) {
  return safeFetch(
    `https://ohlcv-api.nomadcoders.workers.dev?coinId=${coinId}`
  );
}

/* coinpaprika API - 유료 전환으로 위의 노마드 코더 API로 대체
 * startDate와 endDate를 설정하여 기간을 정할 수 있음.
export function fetchCoinHistory(coinId: string) {
  const endDate = Math.floor(Date.now() / 1000);
  const startDate = endDate - 60 * 60 * 24 * 7 * 2;
  return fetch(
    `${BASE_URL}/coins/${coinId}/ohlcv/historical?start=${startDate}&end=${endDate}`
  ).then((response) => response.json());
}
*/
