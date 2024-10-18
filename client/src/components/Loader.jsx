import React from "react";
import ReactDOM from "react-dom";
import { Grid } from "react-loader-spinner";

export const Loader = () => {
  return (
    <div className=" p-9 flex justify-center my-40">
      <Grid
        visible={true}
        height="180"
        width="180"
        color="#4fa94d"
        ariaLabel="grid-loading"
        radius="12.5"
        wrapperStyle={{}}
        wrapperClass="grid-wrapper"
      />
    </div>
  );
};

export default Loader;
