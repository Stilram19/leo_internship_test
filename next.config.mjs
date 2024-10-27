/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return ([
            {
                source: '/socket.io/:path*',
                destination: '/api/socket'
            }
        ])
    }
};

export default nextConfig;
