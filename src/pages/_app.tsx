import { type AppType } from "next/app";
import PlausibleProvider from "next-plausible";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <PlausibleProvider domain="hvt.ski" trackOutboundLinks>
      <Component {...pageProps} />
    </PlausibleProvider>
  );
};

export default trpc.withTRPC(MyApp);

export { reportWebVitals } from "next-axiom";
