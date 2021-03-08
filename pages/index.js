import Layout from "../components/Layout";
import { isAuth } from "../helpers/auth";
import { useEffect } from "react";
import Router from "next/router";

const Home = () => {
  useEffect(() => {
    Router.push(isAuth() ? "/articles" : "/login");
  }, []);

  return <Layout></Layout>;
};

export default Home;
