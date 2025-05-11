import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Outlet, Link, useNavigate, useLocation, useParams, useMatch } from "react-router-dom";
import styled from "styled-components";
import { fetchCoinInfo, fetchCoinTickers } from "../api";
import { Helmet } from 'react-helmet-async';
import GoBack from "../components/GoBack";


// styled-components 
const Title = styled.h1`
  display: block;
  margin: 30px auto;
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
  text-align: center;
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Container = styled.div`
  padding: 0px 20px;
  max-width:  480px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
`;

const Overview = styled.div`
  display: flex;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 20px;
  border-radius: 10px;
`;

const OverviewItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 33%;

  span:first-child {
    font-size: 10px;
    font-weight: 400;
    text-transform: uppercase;
    margin-bottom: 5px;
  }
`;

const Description = styled.p`
  margin: 20px 0px;
`;

const Tabs = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin: 25px 0px;
  gap: 10px;
`;

const Tab = styled.span<{ $isActive: boolean }>`
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: 400;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  color: ${(props) =>
    props.$isActive ? props.theme.accentColor : props.theme.textColor};
  a {
    padding: 7px 0px;
    display: block;
  }
`;

// interfaces
interface InfoData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  is_new: boolean;
  is_active: boolean;
  type: string;
  logo: string;
  description: string;
  message: string;
  open_source: boolean;
  started_at: string;
  development_status: string;
  hardware_wallet: boolean;
  proof_type: string;
  org_structure: string;
  hash_algorithm: string;
  first_data_at: string;
  last_data_at: string;
}

interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}

// 코인 정보 컴포넌트
function Coin() {
  const { coinId } = useParams() as { coinId: string };            // url에서 받은 코인ID 상태
  const { state } = useLocation() as { state: { name: string } };  // <Link> 즉 Router에서 받은 상태(코인정보)
  const priceMatch = useMatch("/:coinId/price");
  const chartMatch = useMatch("/:coinId/chart");

  // react-query 사용
  const { data: infoData, isLoading: infoLoading } = useQuery<InfoData>({
    queryKey: ["info", coinId],
    queryFn: () => fetchCoinInfo(coinId),
  });

  const { data: tickersData, isLoading: tickersLoading } = useQuery<PriceData>({
    queryKey: ["tickers", coinId],
    queryFn: () => fetchCoinTickers(coinId),
    refetchInterval: 3000,             // 3초마다 자동으로 리패치
    refetchOnWindowFocus: true,        // 창 포커스 시에도 리패치
  });

  const navigate = useNavigate();
  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때 /chart 으로 이동
    navigate("chart");
  }, [navigate]);

  /* react-query 사용 전 fetch 사용방식 */
  // const [loading, setLoading] = useState(true);                    // 로딩 상태
  // const [info, setInfo] = useState<InfoData>();                    // 선택된 코인 정보 상태
  // const [priceInfo, setPriceInfo] = useState<PriceData>();         // 코인 가격 정보 상태
  //
  // useEffect(() => {
  //   (async () => {
  //     const infoData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)    // 코인 정보 API
  //     ).json();
  //
  //     const priceData = await (
  //       await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)  // 코인 가격정보 API
  //     ).json();
  //
  //     setInfo(infoData);
  //     setPriceInfo(priceData);
  //
  //     setLoading(false);
  //   })();
  // }, [coinId])

  const loading = infoLoading || tickersLoading;

  return (
    <Container>
      <Helmet>
        <title>
          {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
        </title>
      </Helmet>
      <Header>
        <GoBack />
      </Header>
      <Title>
        {state?.name ? state.name : loading ? "Loading..." : infoData?.name}
      </Title>

      {loading
        ? (<Loader>Loading...</Loader>)
        : (
          <>
            <Overview>
              <OverviewItem>
                <span>Rank:</span>
                <span>{infoData?.rank}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Symbol:</span>
                <span>{infoData?.symbol}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Price:</span>
                <span>{tickersData?.quotes?.USD?.price?.toFixed(3)}</span>
              </OverviewItem>
            </Overview>

            {/* 코인 설명*/}
            <Description>{infoData?.description}</Description>

            <Overview>
              <OverviewItem>
                <span>Total Suply:</span>
                <span>{tickersData?.total_supply}</span>
              </OverviewItem>
              <OverviewItem>
                <span>Max Supply:</span>
                <span>{tickersData?.max_supply}</span>
              </OverviewItem>
            </Overview>

            <Tabs>
              <Tab $isActive={chartMatch !== null}>
                <Link to="chart">Chart</Link>
              </Tab>
              <Tab $isActive={priceMatch !== null}>
                <Link to="price">Price</Link>
              </Tab>
            </Tabs>

            <Outlet
              context={{
                coinId,
              }} />
          </>
        )}
    </Container>
  )
}

export default Coin;
