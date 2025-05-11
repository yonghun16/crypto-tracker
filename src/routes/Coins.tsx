import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import styled from "styled-components";
import { fetchCoins } from "../api";

// styled-components 
const Container = styled.div`
  padding: 0px 20px;
  max-width:  480px;
  margin: 0 auto;
`;

const Header = styled.header`
  height: 10vh;
  margin: 10px 0;
  display:  flex;
  justify-content: center;
  align-items: center;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  background-color: white;
  color: ${props => props.theme.bgColor};
  border-radius: 15px;
  margin-bottom: 10px;
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    transition: color 0.2s ease-in;
  }
  &:hover {
    a {
      color: ${props => props.theme.accentColor}
    }
  }
`;

const Title = styled.h1`
  font-size: 48px;
  color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
  text-align: center;
  display: block;
`;

const Img = styled.img`
  width: 35px;
  height: 35px;
  margin-right: 10px;
`;

// interfaces
interface ICoin {
  "id": string,
  "name": string,
  "symbol": string,
  "rank": number,
  "is_new": boolean,
  "is_active": boolean,
  "type": string,
}

// 코인들 정보 메인 페이지 컴포넌트
function Coins() {
  const { data, isLoading } = useQuery<ICoin[]>({
    queryKey: ["allCoins"],
    queryFn: fetchCoins,
  });
  
  /* react-query 사용 전 fetch 사용방식 */
  // const [coins, setCoins] = useState<CoinInterface[]>([]);  // 코인 상태
  // const [loading, setLoading] = useState(true);  // 로딩 바
  // useEffect(() => {
  //   (async () => {
  //     const response = await fetch("https://api.coinpaprika.com/v1/coins");   // API 데이터 받아오기
  //     const json = await response.json();                                     // JSON 변환
  //     setCoins(json.slice(0, 100));                                           // 100까지 자르기
  //     setLoading(false);                                                      // 로딩 완료
  //   })();
  // }, [])

  return (
    <Container>
      <Helmet>
        <title>CPYPTO-TRACKER</title>
      </Helmet>
      <Header>
        <Title>Coins</Title>
      </Header>
      {isLoading
        ? (<Loader>Loading...</Loader>)
        : (<CoinsList>
          {data?.slice(0, 100).map(coin =>
            <Coin key={coin.id}>
              <Link
                to={{
                  pathname: `/${coin.id}`,
                }}
                state={{
                  name: coin.name       // state를 따로 전달
                }}
              >
                <Img
                  src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/128/color/${coin.symbol.toLowerCase()}.png`}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/fallback.png";
                  }}
                />
                {coin.name} &rarr;
              </Link>
            </Coin>)
          }
        </CoinsList>
        )}
    </Container>
  );
}

export default Coins;
