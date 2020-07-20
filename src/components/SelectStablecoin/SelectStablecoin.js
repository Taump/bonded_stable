import React from "react";
import { Select, Row } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { changeActive } from "store/actions/active/changeActive";

export const SelectStablecoin = () => {
  const { data, liading, loaded } = useSelector((state) => state.list);
  const activeAddress = useSelector((state) => state.active.address);
  const dispatch = useDispatch();
  const optionList = [];
  for (const stable in data) {
    const { feed_name, interest_rate } = data[stable].params;
    const { asset_2 } = data[stable];

    optionList.push(
      <Select.Option value={stable} key={stable}>
        {feed_name} {interest_rate}% : {asset_2} ({stable})
      </Select.Option>
    );
  }

  return (
    <div
      style={{
        background: "#fff",
        padding: 10,
        marginBottom: 20,
      }}
    >
      <Row>
        <Select
          size="large"
          placeholder="Please, select stablecoin"
          style={{ width: "100%" }}
          showSearch={true}
          value={activeAddress || undefined}
          loading={liading}
          onChange={(address) => {
            dispatch(changeActive(address));
          }}
        >
          {optionList}
        </Select>
      </Row>
    </div>
  );
};
