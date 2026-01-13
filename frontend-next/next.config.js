/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permitir acesso de IPs na rede local durante desenvolvimento
  allowedDevOrigins: ['192.168.3.94', '192.168.3.70'],
  
  // Otimizações para produção
  poweredByHeader: false,
  compress: true,
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;

