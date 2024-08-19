import passport from "passport";
import jwt from "passport-jwt";

const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initalizePassport = () => {
    const cookieExtractor = (req) => {
        let token = null;
        if (req && req.cookies) {
            token = req.cookies["coderCookieToken"];
        }
        return token;
    };
    passport.use("jwt", new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: "codersecret",
    }, async (jwtPayload, done) => {
        try {
            return done(null, jwtPayload);
        } catch (error) {
            return done(error, false);
        }
    }));
};

export default initalizePassport;
