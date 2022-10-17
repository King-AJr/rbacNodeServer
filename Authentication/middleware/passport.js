const Employee = require("../../Database/employee");
const { Strategy, ExtractJwt } = require("passport-jwt");
require('dotenv').config();

const opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.APP_SECRET

module.exports = passport => {
  passport.use(
    new Strategy(opts, async (payload, done) => {
      console.log(payload);
      await Employee.findOne(payload.name)
        .then(employee => {
          if (employee) {
            return done(null, employee);
          }
          return done(null, false);
        })
        .catch(err => {
          return done(null, false);
        });
    })
  );
};