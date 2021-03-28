import { useState, useEffect } from "react";
import Link from "next/link";
import Router from "next/router";
import Head from "next/head";

import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { isAuth, logout } from "../helpers/auth";

Router.events.on("routeChangeStart", (url) => NProgress.start());
Router.events.on("routeChangeComplete", (url) => NProgress.done());
Router.events.on("routeChangeError", (url) => NProgress.done());

const Layout = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [child, setChild] = useState();
  const [header, setHeader] = useState();
  const [navigation, setNavigation] = useState();

  const head = () => (
    <Head>
      <title>MZZPK</title>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
        integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
        crossOrigin="anonymous"
      />

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css"
      />
      <link rel="stylesheet" href="/static/css/style.css" />
      <link rel="icon" href="favicon.ico" />
    </Head>
  );

  const nav = () => (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href={isAuth() ? "/articles" : "/login"}>
        <a className="navbar-brand">
          <img src="/logo.png" alt="MZZPK logo" height="60" />
        </a>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={() => {
          expandNavbar();
        }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className={`collapse navbar-collapse justify-content-end ${
          isExpanded ? "show" : ""
        }`}
        id="navbarNavAltMarkup"
      >
        <div className="navbar-nav">
          {!isAuth() && (
            <Link href="/login">
              <a className="nav-item nav-link mt-1">Login</a>
            </Link>
          )}

          {isAuth() && isAuth()?.role === "admin" && (
            <Link href="/admin">
              <a className="nav-item nav-link mt-1" suppressHydrationWarning>
                {isAuth().name}
              </a>
            </Link>
          )}

          {isAuth() && isAuth()?.role !== "admin" && (
            <Link href="/user">
              <a className="nav-item nav-link mt-1" suppressHydrationWarning>
                {isAuth().name}
              </a>
            </Link>
          )}

          {isAuth() ? (
            <div className="nav-item nav-link">
              <div
                className="btn btn-danger btn-sm ml-2"
                onClick={() => {
                  handleLogout();
                }}
              >
                Wyloguj
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );

  const expandNavbar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLogout = () => {
    logout(() => {
      Router.push("/");
    });
  };

  useEffect(() => {
    setHeader(head());
    setNavigation(nav());
    setChild(children);
  }, []);

  return (
    <>
      {header}
      {navigation}
      <div className="container pt-5 pb-5">{child}</div>
    </>
  );
};

export default Layout;
