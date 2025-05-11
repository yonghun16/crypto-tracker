import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet-async';
import styled from "styled-components";
import { fetchCoins } from "../api";
import ToggleDark from "../components/ToggleDark";

// styled-components 
const Container = styled.div`
  padding: 0px 20px;
  max-width:  480px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: right;
  align-items: center;
  margin: 20px 0;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
  margin-bottom: 10px;
  border-radius: 15px;
  background-color: ${(props) => props.theme.textColor};
  color: ${(props) => props.theme.bgColor};
  a {
    display: flex;
    align-items: center;
    padding: 20px;
    color: ${(props) => props.theme.bgColor};
    transition: color 0.2s ease-in;
  }
  &:hover a {
    color: ${(props) => props.theme.accentColor};
  }
`;

const Title = styled.h1`
  display: block;
  margin: 30px auto;
  font-size: 40px;
  color: ${(props) => props.theme.accentColor};
  text-align: center;
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

  return (
    <Container>
      <Helmet>
        <title>CPYPTO-TRACKER</title>
      </Helmet>
      <Header>
        <ToggleDark />
      </Header>
      <Title>Crypto Currencies</Title>
      {isLoading ? (
        <Loader>Loading...</Loader>
      ) : !data ? (
        <Loader>서버에서 코인 정보를 가져오는데 실패하였습니다.</Loader>
      ) : (<CoinsList>
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
