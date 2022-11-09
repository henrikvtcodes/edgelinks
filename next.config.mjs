// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import { withPlausibleProxy } from "next-plausible";
import { withAxiom } from "next-axiom";

const plausibleProxy = withPlausibleProxy({
  subdirectory: "beep",
  scriptName: "boop",
  customDomain: "https://plausible.henriktech.com",
});

/**
 * @template {import('next').NextConfig} T
 * @param {T} config - A generic parameter that flows through to the return type
 * @constraint {{import('next').NextConfig}}
 */
function defineNextConfig(config) {
  return withAxiom(plausibleProxy(config));
}

export default defineNextConfig({
  reactStrictMode: true,
  swcMinify: true,
});
