import React, { useEffect, useState } from "react";
import {
  Typography,
  Row,
  Input,
  Select,
  Col,
  Button,
  Card,
  message,
  Spin,
} from "antd";
import { ArrowDownOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { $get_exchange_result } from "helpers/bonded";
import { getOraclePrice } from "../../helpers/getOraclePrice";
import { generateLink } from "utils/generateLink";
import { addExchange } from "../../store/actions/settings/addExchange";
import config from "../../config";
import Decimal from "decimal.js";
const { Title, Text } = Typography;

export const BuyPage = () => {
  const { activeWallet, exchanges } = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.list);
  const [allCurrencies, setAllCurrencies] = useState([]);
  const [exchangeRates, setExchangeRates] = useState(undefined);
  const [activeCurrency, setActiveCurrency] = useState("gbyte");
  const [amountCurrency, setAmountCurrency] = useState(undefined);
  const [amountToken, setAmountToken] = useState("1");
  const [activeTokenAdr, setActiveTokenAdr] = useState(undefined);
  const [oraclePrice, setOraclePrice] = useState(undefined);
  const [ranges, setRanges] = useState(undefined);
  const [statusList, setStatusList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState({
    ranges: false,
    rate: false,
    amount: false,
  });

  const isLoadingExchange = loading.ranges && loading.rate && loading.amount;

  let tokens = [];
  useEffect(() => {
    if (Object.keys(data).length > 0) {
      setActiveTokenAdr(tokens[0].address);
      console.log("NEW ADRESS:  ", Object.keys(data)[0]);
    }
  }, [tokens]);
  const currentTokenData = activeTokenAdr ? data[activeTokenAdr] : undefined;

  for (let address in data) {
    if (
      data[address].params.reserve_asset === "base" &&
      data[address].reserve !== 0
    ) {
      tokens.push({
        asset: data[address].asset_2,
        symbol: data[address].symbol,
        interest_rate: data[address].params.interest_rate,
        reserve: data[address].reserve,
        address,
      });
    }
  }

  tokens = tokens.sort((a, b) => b.reserve - a.reserve);

  useEffect(() => {
    (async () => {
      if (currentTokenData) {
        const { stable_state, params } = currentTokenData;
        const price = await getOraclePrice(stable_state, params);
        setOraclePrice(price);
        console.log("price", price);
      }
    })();
  }, [currentTokenData, setOraclePrice]);

  useEffect(() => {
    (async () => {
      const allCurrencies = await axios.get(
        `https://api.simpleswap.io/v1/get_pairs?api_key=${config.SIMPLESWAP_API_KEY}&fixed=false&symbol=gbyte`
      );
      if ("data" in allCurrencies) {
        setAllCurrencies(allCurrencies.data);
      }

      console.log("allCurrencies", allCurrencies);
    })();
  }, []);

  // Get rate
  useEffect(() => {
    (async () => {
      setLoading((c) => ({ ...c, rate: true }));
      if (activeCurrency !== "gbyte") {
        if (ranges && ranges.min) {
          const min = Number(ranges.min);
          console.log("MIN MIN ", min);
          const rateData = await axios.get(
            `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=${min}`
          );
          const rate = Number(rateData.data) / min;
          setExchangeRates(rate);
          console.log("BTC RATE", rate, rateData, ranges, min);
        } else {
          const rateData = await axios.get(
            `https://api.simpleswap.io/v1/get_estimated?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte&amount=1`
          );
          setExchangeRates(Number(rateData.data));
        }
      }

      setLoading((c) => ({ ...c, rate: false }));
    })();
  }, [activeCurrency, ranges]);

  useEffect(() => {
    (async () => {
      setLoading((c) => ({ ...c, ranges: true }));
      const ranges = await axios.get(
        `https://api.simpleswap.io/v1/get_ranges?api_key=${config.SIMPLESWAP_API_KEY}&currency_from=${activeCurrency}&currency_to=gbyte`
      );

      if ("data" in ranges) {
        setRanges(ranges.data);
      } else {
        setRanges(undefined);
      }
      setLoading((c) => ({ ...c, ranges: false }));
    })();
  }, [activeCurrency]);

  const handleAmountCurrency = (ev) => {
    const value = ev.target.value;
    const reg = /^[0-9.]+$/;
    if (
      (~(value + "").indexOf(".") ? (value + "").split(".")[1].length : 0) <= 9
    ) {
      if (reg.test(String(value)) || value === "") {
        setAmountCurrency(value);
      }
    }
  };

  useEffect(() => {
    (async () => {
      if (!currentTokenData) return undefined;
      const { stable_state, params } = currentTokenData;

      const result =
        stable_state &&
        params &&
        oraclePrice &&
        $get_exchange_result({
          tokens1: 0,
          tokens2: amountToken * 10 ** params.decimals2,
          params: params,
          vars: stable_state,
          oracle_price: oraclePrice,
          timestamp: Math.floor(Date.now() / 1000),
        });

      if (result && activeCurrency === "gbyte") {
        setAmountCurrency((result.reserve_needed / 10 ** 9).toFixed(9));
      }
      // else if (result && activeCurrency !== undefined) {
      //   setAmountCurrency(
      //     (1 / Number(exchangeRates)) * (Number(result.reserve_delta) / 1e9)
      //   );
      // }
    })();
  }, [amountToken, currentTokenData, activeCurrency, exchangeRates]);

  useEffect(() => {
    if (!currentTokenData) return undefined;
    const { stable_state, params } = currentTokenData;

    const result =
      stable_state &&
      params &&
      oraclePrice &&
      activeCurrency !== "gbyte" &&
      $get_exchange_result({
        tokens1: 0,
        tokens2: 0,
        params: params,
        vars: stable_state,
        oracle_price: oraclePrice,
        timestamp: Math.floor(Date.now() / 1000),
      });

    if (result && activeCurrency !== "gbyte") {
      const expectT2 =
        (1 / result.target_p2) * Number(amountCurrency) * Number(exchangeRates);

      setAmountToken(expectT2.toFixed(params.decimals2));
    }
  }, [amountCurrency, currentTokenData, activeCurrency, exchangeRates]);

  // Создание обмена
  const handleClickExchange = async () => {
    setIsLoading(true);
    console.log("select,", activeCurrency);
    const { data } = await axios.get(
      `https://testnet.ostable.org/api/create_buffer?address=${activeWallet}&curve_aa=${activeTokenAdr}`
    );
    const buffer_address = data.data.buffer_address;
    const create = await axios.post(
      `https://api.simpleswap.io/v1/create_exchange?api_key=${config.SIMPLESWAP_API_KEY}`,
      {
        currency_to: "gbyte",
        currency_from: activeCurrency,
        amount: amountCurrency,
        address_to: buffer_address,
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    if (create && create.data) {
      await axios.post(
        `https://testnet.ostable.org/api/create_order`,
        {
          provider: "simpleswap",
          provider_id: create.data.id,
          buffer_address,
          currency_in: create.data.currency_from,
          expected_amount_out: create.data.amount_to,
          amount_in: Number(create.data.amount_from),
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(
        addExchange({
          buffer_address,
          id: create.data.id,
          address: activeWallet,
          currency_from: activeCurrency,
          asset: currentTokenData.asset_2,
          symbol: currentTokenData.symbol,
          address_from: create.data.address_from,
          amountCurrency,
          amountToken,
        })
      );
      message.success(
        "The exchange was successfully added to the list and is waiting for payment"
      );
      setIsLoading(false);
      setAmountCurrency(undefined);
      setAmountToken(undefined);
    }
  };

  // Загрузка курса
  useEffect(() => {
    (async () => {
      const primiseList = exchanges.map(async (e) =>
        axios
          .get(
            `https://api.simpleswap.io/v1/get_exchange?api_key=${config.SIMPLESWAP_API_KEY}&id=${e.id}`
          )
          .then((obj) => {
            const { data } = obj;
            return {
              id: data.id,
              status: data.status,
            };
          })
      );
      const exchangesStatus = await Promise.all(primiseList);
      const statusListArray = [];
      exchangesStatus.forEach((s) => {
        statusListArray[s.id] = s.status;
      });
      setStatusList(statusListArray);
    })();
  }, [exchanges]);

  return (
    <div>
      <Title level={2}>Buy interest tokens</Title>
      <Text type="secondary">This page uses simpleswap.io</Text>

      <Row style={{ marginBottom: 20, marginTop: 50 }}>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 5 }}>
          <div style={{ marginBottom: 5 }}>
            <Text type="secondary">
              You <b>send</b>
            </Text>
          </div>
          <Input.Group compact>
            <Input
              style={{ width: "50%" }}
              size="large"
              placeholder={`Amount ${
                ranges && ranges.min ? "Min. " + ranges.min : ""
              }  ${ranges && ranges.max ? " Max. " + ranges.max : ""}`}
              onChange={handleAmountCurrency}
              value={amountCurrency || undefined}
              disabled={activeCurrency === "gbyte"}
            />
            <Select
              style={{ width: "50%" }}
              size="large"
              showSearch
              placeholder="Currency to pay"
              onChange={(c) => setActiveCurrency(c)}
              value={activeCurrency}
            >
              <Select.Option value="gbyte">GBYTE</Select.Option>
              {allCurrencies.map((c) => (
                <Select.Option key={c} value={c}>
                  {c.toUpperCase()}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
          {activeCurrency && activeCurrency !== "gbyte" && (
            <span style={{ color: "red", fontSize: 10 }}>
              You get a better rate if you pay in GBYTE.
            </span>
          )}
        </Col>
      </Row>
      {/* <div
        style={{
          justifyContent: "center",
          padding: 15,
          display: "flex",
          alignItems: "center",
        }}
      >
        <ArrowDownOutlined style={{ fontSize: "1.5em" }} />
      </div> */}

      <Row style={{ marginBottom: 20 }}>
        <Col xs={{ span: 24, offset: 0 }} md={{ span: 14, offset: 5 }}>
          <div style={{ marginBottom: 5 }}>
            <Text type="secondary">
              You <b>get</b>
            </Text>
          </div>
          <Input.Group compact>
            <Input
              style={{ width: "50%" }}
              size="large"
              placeholder="Amount"
              prefix={activeCurrency !== "gbyte" ? "≈" : ""}
              value={isNaN(amountToken) ? undefined : amountToken}
              onChange={(ev) => setAmountToken(ev.target.value)}
              disabled={activeCurrency !== "gbyte"}
            />
            <Select
              style={{ width: "50%" }}
              size="large"
              showSearch
              placeholder="The token you will receive"
              onChange={(c) => setActiveTokenAdr(c)}
              value={activeTokenAdr}
            >
              {tokens.map((t) => (
                <Select.Option key={t.asset} value={t.address}>
                  {t.symbol || t.asset}{" "}
                  {" (" + Decimal.mul(t.interest_rate, 100).toNumber() + "%)"}
                </Select.Option>
              ))}
            </Select>
          </Input.Group>
        </Col>
      </Row>
      {activeCurrency === "gbyte" ? (
        <>
          <Row justify="center">
            <Button
              type="primary"
              size="large"
              disabled={
                !activeWallet ||
                !amountCurrency ||
                amountCurrency === "" ||
                Number(amountCurrency) === 0
              }
              href={
                currentTokenData &&
                amountCurrency &&
                generateLink(
                  Number(amountCurrency * 1.1).toFixed(9) * 1e9,
                  {
                    tokens2:
                      amountToken * 10 ** currentTokenData.params.decimals2,
                  },
                  undefined,
                  activeTokenAdr
                )
              }
            >
              Buy
            </Button>
          </Row>
          {amountCurrency &&
            amountCurrency !== "" &&
            Number(amountCurrency) !== 0 && (
              <div style={{ textAlign: "center" }}>
                <Text type="secondary" style={{ fontSize: 10 }}>
                  1% was added to protect against price volatility, you'll get
                  this amount back if the prices don't change.
                </Text>
              </div>
            )}
        </>
      ) : (
        <>
          <Row justify="center">
            <Button
              type="primary"
              size="large"
              loading={isLoadingExchange}
              disabled={
                !amountCurrency ||
                !activeWallet ||
                (ranges && ranges.min && ranges.min > amountCurrency)
              }
              onClick={handleClickExchange}
            >
              Buy
            </Button>
          </Row>
          {activeCurrency &&
            ranges &&
            ranges.min &&
            ranges.min > amountCurrency && (
              <div style={{ textAlign: "center" }}>
                <Text type="secondary" style={{ fontSize: 10, color: "red" }}>
                  Sorry, the minimum {String(activeCurrency).toUpperCase()}{" "}
                  amount is {ranges.min}. Please increase the number of interest
                  tokens
                </Text>
              </div>
            )}
        </>
      )}

      {exchanges.length > 0 && (
        <Title style={{ marginTop: 50, marginBottom: 20 }} level={2}>
          List of exchanges
        </Title>
      )}

      {Object.keys(statusList).length > 0 ? (
        <Row>
          <Col span="24">
            {exchanges.map((e) => {
              return (
                <Card bodyStyle={{ padding: 0 }} style={{ marginBottom: 20 }}>
                  <Row
                    gutter="10"
                    // justify="center"
                    style={{
                      paddingTop: 24,
                      paddingLeft: 24,
                      paddingRight: 24,
                    }}
                  >
                    <Col
                      lg={{ span: 6 }}
                      md={{ span: 12 }}
                      style={{ paddingBottom: 24, wordBreak: "break-all" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        Address of the interest tokens recipient
                      </div>
                      <div>{e.address}</div>
                    </Col>
                    <Col
                      lg={{ span: 6 }}
                      md={{ span: 12 }}
                      sm={{ span: 24 }}
                      xs={{ span: 24 }}
                      style={{ paddingBottom: 24, wordBreak: "break-all" }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        {e.currency_from.toUpperCase()} address
                      </div>
                      <div>{e.address_from}</div>
                    </Col>
                    <Col
                      lg={{ span: 5 }}
                      md={{ span: 12 }}
                      sm={{ span: 24 }}
                      xs={{ span: 24 }}
                      style={{ paddingBottom: 24 }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        Number of {e.symbol || e.asset.slice(0, 5) + "..."}
                      </div>
                      <div>≈ {e.amountToken}</div>
                    </Col>
                    <Col
                      lg={{ span: 5 }}
                      md={{ span: 12 }}
                      sm={{ span: 24 }}
                      xs={{ span: 24 }}
                      style={{ paddingBottom: 24 }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        Number of expected {e.currency_from.toUpperCase()}
                      </div>
                      <div>{e.amountCurrency}</div>
                    </Col>
                    <Col
                      lg={{ span: 2 }}
                      md={{ span: 12 }}
                      sm={{ span: 24 }}
                      xs={{ span: 24 }}
                      style={{ paddingBottom: 24 }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 600 }}>
                        Status
                      </div>
                      <div style={{ textTransform: "uppercase" }}>
                        {statusList[e.id]}
                      </div>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Col>
        </Row>
      ) : (
        <Row justify="center">
          {exchanges.length > 0 && (
            <Spin size="large" style={{ padding: 10 }} />
          )}
        </Row>
      )}
    </div>
  );
};
