/* /pages/_app.js */

import Layout from "../components/Layout";
// import withData from "../lib/apollo";
import withApolloClient from '../lib/with-apollo-client'
import { ApolloProvider } from 'react-apollo'
import App, { Container } from "next/app";
import React from "react";

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    return { pageProps };
  }

  render() {
    const { Component, pageProps, isAuthenticated, ctx, apolloClient } = this.props;
    return (
      <Container>
        <ApolloProvider client={apolloClient}>
          <Layout isAuthenticated={isAuthenticated} {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </ApolloProvider>
      </Container>
    );
  }
}
export default withApolloClient(MyApp);