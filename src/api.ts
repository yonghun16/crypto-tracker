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
