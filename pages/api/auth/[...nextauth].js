// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../utils/db"; // Your Mongoose connection file
import User from "../../../models/User";

export const authOptions = {
  // Remove the MongoDBAdapter since you're using Mongoose
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials;
        try {
          await connectDB();
          const user = await User.findOne({ email }).lean();
          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (!passwordsMatch) return null;

          return {
            ...user,
            id: user._id.toString(), // Ensure MongoDB _id is used
          };
        } catch (error) {
          console.log("Error: ", error);
          return null;
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ account, profile, user }) {
      if (account?.provider === "google") {
        try {
          await connectDB();
          const existingUser = await User.findOne({
            $or: [{ google_id: profile.sub }, { email: profile.email }],
          }).lean();

          if (existingUser) {
            user.id = existingUser._id.toString(); // Set MongoDB _id
            return true;
          } else {
            const profileData = {
              google_id: profile.sub,
              first_name: profile.given_name || profile.name.split(" ")[0],
              last_name:
                profile.family_name ||
                profile.name.split(" ").slice(1).join(" "),
              email: profile.email,
              profile_picture: profile.picture,
            };
            return `/create_google_user?${encodeURIComponent(
              JSON.stringify(profileData)
            )}`;
          }
        } catch (error) {
          console.error("Error in Google sign-in:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id || user._id.toString(); // Use MongoDB _id
        token.email = user.email;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.role = user.role;
        token.schoolId = user.schoolId;
        token.profile_picture = user.profile_picture;
        token.admin = user.admin;
        token.associations = user.associations;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id, // MongoDB _id as string
          email: token.email,
          first_name: token.first_name,
          last_name: token.last_name,
          role: token.role,
          schoolId: token.schoolId,
          profile_picture: token.profile_picture,
          admin: token.admin,
          associations: token.associations,
        };
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 31 * 24 * 60 * 60, // 31 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
    newUser: "/create_google_user",
  },
};

export default NextAuth(authOptions);
