import { useQuery } from "@tanstack/react-query";
import { useOutletContext } from "react-router-dom";
import { fetchCoinHistory } from "../api";
import ApexChart from "react-apexcharts";

// interface
interface IHistorical {
  time_open: string;
  time_close: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}

interface OutletContextType {
  coinId: string;
}

// 코인 차트 컴포넌트
function Chart() {
  const { coinId } = useOutletContext<OutletContextType>();
  const { data, isLoading } = useQuery<IHistorical[]>({
    queryKey: ["ohlcv", coinId],
    queryFn: () => fetchCoinHistory(coinId),
  });

  const candlestickData =
    data?.map((price) => ({                                         // data가 존재 시, map 함수를 사용해서 데이터를 변환
      x: new Date(Number(price.time_close) * 1000).toISOString(),   // price.time_close를 ms단위로 바꾸고 Date 객체로 만든 후, 문자열 변환
      y: [price.open, price.high, price.low, price.close],          // 시가, 고가, 저가, 종가를 배열로 담아 캔들 형식의 y축 데이터로 사용
    })) || [];

  return (
    <>
      {isLoading ? (
        "Loading chart..."
      ) : (
        <ApexChart
          // 차트 타입
          type="candlestick"

          // 차트 데이터
          series={[
            {
              name: "Price",
              data: candlestickData,
            },
          ]}

          // 차트 옵션
          options={{
            theme: {
              mode: "dark",
            },
            chart: {
              height: 300,
              width: 500,
              toolbar: { show: false },
              background: "transparent",
            },
            plotOptions: {
              candlestick: {
                colors: {
                  upward: "#E1533F",
                  downward: "#4780EC",
                },
              },
            },
            grid: { show: false },
            xaxis: {
              axisBorder: { show: false },
              axisTicks: { show: false },
              labels: { show: true, rotate: 0 },
              type: "datetime",
            },
            yaxis: { show: true },
          }}
        />
      )}
    </>
  );
}

export default Chart;
