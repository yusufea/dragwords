/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["default", "en", "tr"],
    defaultLocale: "default",
    localeDetection: false,
  },
};

export default nextConfig;
