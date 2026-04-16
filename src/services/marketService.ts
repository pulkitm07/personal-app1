import type { MarketData } from '../types';

const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const EXCHANGE_RATE_API = 'https://v6.exchangerate-api.com/v6';

export async function fetchMarketData(): Promise<MarketData> {
  try {
    const [cryptoResponse, forexResponse] = await Promise.all([
      fetch(
        `${COINGECKO_API}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`,
        {
          headers: {
            'x-cg-demo-api-key': import.meta.env.VITE_COINGECKO_API_KEY,
          },
        }
      ),
      fetch(
        `${EXCHANGE_RATE_API}/${import.meta.env.VITE_EXCHANGE_RATE_API_KEY}/latest/USD`
      ),
    ]);

    const cryptoData = await cryptoResponse.json();
    const forexData = await forexResponse.json();

    const btcPrice = cryptoData.bitcoin?.usd || 63450.20;
    const btcChange = cryptoData.bitcoin?.usd_24h_change || 1.25;
    const ethPrice = cryptoData.ethereum?.usd || 3450.80;
    const ethChange = cryptoData.ethereum?.usd_24h_change || -0.45;
    const solPrice = cryptoData.solana?.usd || 145.20;
    const solChange = cryptoData.solana?.usd_24h_change || 2.10;

    const usdInrRate = forexData.conversion_rates?.INR || 83.0;

    const sensexValue = 73000 + Math.random() * 1000;
    const sensexChange = -0.5 + Math.random() * 2;
    const niftyValue = 22000 + Math.random() * 300;
    const niftyChange = -0.5 + Math.random() * 2;

    return {
      btc: { price: btcPrice, change24h: btcChange },
      eth: { price: ethPrice, change24h: ethChange },
      sol: { price: solPrice, change24h: solChange },
      usdInr: { rate: usdInrRate, change: 0.1 },
      sensex: { value: sensexValue, change: sensexChange },
      nifty: { value: niftyValue, change: niftyChange },
    };
  } catch (error) {
    console.error('Error fetching market data:', error);
    return {
      btc: { price: 63450.20, change24h: 1.25 },
      eth: { price: 3450.80, change24h: -0.45 },
      sol: { price: 145.20, change24h: 2.10 },
      usdInr: { rate: 83.50, change: 0.1 },
      sensex: { value: 73000, change: 0 },
      nifty: { value: 22000, change: 0 },
    };
  }
}
