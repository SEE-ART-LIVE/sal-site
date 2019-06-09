/* hocs/defaultPage.js */

import React from "react";
import Router from "next/router";
import axios from "axios";
import {
  getUserFromServerCookie,
  getUserFromLocalCookie,
  getIdFromLocalCookie,
  getIdFromServerCookie
} from "../lib/auth";

export default Page =>
  class DefaultPage extends React.Component {
    static async getInitialProps({ req }) {
      const loggedUser = process.browser
        ? getUserFromLocalCookie()
        : getUserFromServerCookie(req);
      const loggedId = process.browser
        ? getIdFromLocalCookie()
        : getIdFromServerCookie(req);
      const pageProps = Page.getInitialProps && Page.getInitialProps(req);
      /*       console.log("is authenticated");
      console.log(loggedUser);
      console.log(loggedId); */
      return {
        Router,
        ...pageProps,
        loggedId,
        loggedUser,
        isAuthenticated: !!loggedUser
      };
    }

    logout = eve => {
      if (eve.key === "logout") {
        Router.push(`/?logout=${eve.newValue}`);
      }
    };

    componentDidMount() {
      window.addEventListener("storage", this.logout, false);
    }

    componentWillUnmount() {
      window.removeEventListener("storage", this.logout, false);
    }

    render() {
      return <Page {...this.props} />;
    }
  };
