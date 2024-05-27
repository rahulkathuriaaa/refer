import TwitterProvider from "next-auth/providers/twitter";


export const option = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_KEY2,
      clientSecret: process.env.TWITTER_Secret2,
      version: "2.0", // Use Twitter API v2.0
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        console.log("Profile Data:", profile); // Log profile data for debugging
        token.username = profile.data.username; // Twitter v2.0 provides username under `data`
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user.username = token.username; // Pass the Twitter handle to the session
      return session;
    },
  },
};
