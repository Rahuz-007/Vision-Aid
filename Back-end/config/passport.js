const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Google Strategy Configuration
// Note: You must add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to your .env file
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/google/callback`
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user exists by googleId
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists by email
                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;
                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        // Link google account
                        user.googleId = profile.id;
                        // Update avatar if not present
                        if (!user.avatar && profile.photos && profile.photos[0]) {
                            user.avatar = profile.photos[0].value;
                        }
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create new user
                user = new User({
                    googleId: profile.id,
                    email: email,
                    name: profile.displayName,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    isVerified: true
                });
                await user.save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
}

// GitHub Strategy Configuration
// Note: You must add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to your .env file
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BACKEND_URL}/api/auth/github/callback`,
        scope: ['user:email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ githubId: profile.id });

                if (user) {
                    return done(null, user);
                }

                const email = profile.emails && profile.emails[0] ? profile.emails[0].value : null;

                if (email) {
                    user = await User.findOne({ email });
                    if (user) {
                        user.githubId = profile.id;
                        if (!user.avatar && profile.photos && profile.photos[0]) {
                            user.avatar = profile.photos[0].value;
                        }
                        await user.save();
                        return done(null, user);
                    }
                }

                user = new User({
                    githubId: profile.id,
                    email: email || `github-${profile.id}@no-email.com`, // Fallback if private
                    name: profile.displayName || profile.username,
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : null,
                    isVerified: true
                });
                await user.save();
                done(null, user);
            } catch (err) {
                done(err, null);
            }
        }));
}

module.exports = passport;
