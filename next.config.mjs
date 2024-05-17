/** @type {import('next').NextConfig} */
const nextConfig = {
    images:{
        remotePatterns:[{
            protocol: 'https',
            hostname: '*.cricapi.com'
        },
        {
            protocol: 'http',
            hostname: '*.purecatamphetamine.github.io'
        }]
    }
};

export default nextConfig;
