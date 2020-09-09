import React, { useState } from "react";
import { Header } from "./components/Header/Header";
import { Tokens } from "./components/Tokens/Tokens";
// import { HowItWork } from "./components/HowItWork/HowItWork";
import { Reasons } from "./components/Reasons/Reasons";
import { Faq } from "./components/Faq/Faq";
import { Footer } from "./components/Footer/Footer";

import styles from "./HomePage.module.css";

export const HomePage = () => {
  const [type, setType] = useState("USD");
  return (
    <div className={styles.container}>
      <Header setType={setType} type={type} />
      <Tokens />
      {/* <HowItWork /> */}
      <Reasons />
      {/* <Faq /> */}
      <Footer />
    </div>
  );
};
