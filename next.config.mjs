/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',

    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
        images: {
            remotePatterns: [
              {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '/v0/b/docu-team.appspot.com/o/',
              },
            ],
          },
        },

};

export default nextConfig;





