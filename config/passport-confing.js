import passportLocal from "passport-local"
import bcrypt from "bcrypt"
import User from "../models/User.js"

const LocalStrategy = passportLocal.Strategy

const intializePassport = (passport) => {
  const authenticateUser = async (email, password, done) => {
    //get the User by its email
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Identifiants incorrects" })
        }
        //Match Password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err
          }
          if (isMatch) {
            return done(null, user)
          } else {
            return done(null, false, { message: "Identifiants incorrects" })
          }
        })
      })
      .catch((err) => {
        console.log(err)
      })
  }

  passport.use(new LocalStrategy({ usernameField: "email" }, authenticateUser))

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}

export default intializePassport
