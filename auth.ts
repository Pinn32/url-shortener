import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { clientPromise, DB_NAME } from "@/lib/db/db";

export const { handlers, auth, signIn, signOut } = NextAuth({
    adapter: MongoDBAdapter(clientPromise, { databaseName: DB_NAME }),
    providers: [Google({
        profile(profile) {
            return {
                id: profile.sub,
                name: profile.email.replace(/@gmail\.com$/i, "").slice(0, 40),
                email: profile.email,
                image: profile.picture,
            };
        },
    })],
    pages: { signIn: "/login" },
    callbacks: {
        session({ session, user }) {
            session.user.id = user.id;
            return session;
        },
    },
});
