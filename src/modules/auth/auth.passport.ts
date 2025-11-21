import passport from "passport";
import { Strategy as GoogleStrategy, Profile } from "passport-google-oauth20";
import prisma from "../../config/prisma";
import { ENV } from "../../config/env";

// Only configure Google strategy if credentials exist
if (ENV.GOOGLE_CLIENT_ID && ENV.GOOGLE_CLIENT_SECRET) {
  const callbackPath =
    ENV.GOOGLE_CALLBACK_PATH || "/api/v1/auth/google/callback";
  const callbackURL = `${ENV.BACKEND_URL}${callbackPath}`;

  passport.use(
    new GoogleStrategy(
      {
        clientID: ENV.GOOGLE_CLIENT_ID,
        clientSecret: ENV.GOOGLE_CLIENT_SECRET,
        callbackURL: callbackURL,
      },
      async (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        done: (err: any, user?: any) => void
      ) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error("Google account has no email"));
          }

          // Upsert user (create or update googleId + name)
          const user = await prisma.user.upsert({
            where: { email },
            update: {
              googleId: profile.id,
            },
            create: {
              email,
              googleId: profile.id,
              name: profile.displayName || undefined,
            },
            select: {
              id: true,
              email: true,
              name: true,
              role: true,
            },
          });

          return done(null, user);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
}

export default passport;
