import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Validate Google OAuth credentials
const hasValidGoogleCredentials =
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_ID !== 'your-google-client-id-here' &&
  process.env.GOOGLE_CLIENT_SECRET !== 'your-google-client-secret-here';

// Debug logging
if (process.env.NODE_ENV === 'development') {
  console.log('NextAuth Debug:');
  console.log('- Has valid credentials:', hasValidGoogleCredentials);
  console.log('- Client ID configured:', !!process.env.GOOGLE_CLIENT_ID);
  console.log('- Client Secret configured:', !!process.env.GOOGLE_CLIENT_SECRET);
  console.log('- NEXTAUTH_SECRET configured:', !!process.env.NEXTAUTH_SECRET);
  console.log('- NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
}

export const authOptions: NextAuthOptions = {
  providers: hasValidGoogleCredentials
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
      ]
    : [],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: '/',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
