import express from "express"
import User from "./../models/User.js"
import bcrypt from "bcrypt"
import passport from "passport"

const router = express.Router()

router.get("/login", (req, res) => {
  res.render("login")
})

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })
)

router.get("/register", (req, res) => {
  res.render("register")
})

router.post("/register", (req, res) => {
  const { name, email, password, password1 } = req.body
  const errors = []
  //Check required fields
  if (!name || !email || !password || !password1) {
    errors.push({ msg: "Tous les champ sont requis." })
  }
  //Check passwords match
  if (password !== password1) {
    errors.push({ msg: "Les mot de passes doivent être identiques." })
  }
  //Check passwords Length
  if (password.length < 6) {
    errors.push({ msg: "Le mot de passe doit contenir au moins 6 carctères." })
  }

  if (errors.length > 0) {
    res.render("register", { errors, name, email, password, password1 })
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        //User exists
        errors.push({ msg: "Cette adresse email est déjà utilisée" })
        res.render("register", { errors, name, email, password, password1 })
      } else {
        ;(async () => {
          try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = new User({ name, email, password: hashedPassword })
            user
              .save()
              .then((user) => {
                req.flash("success_msg", "Votre compte a bien été créé.")
                res.redirect("/users/login")
              })
              .catch((err) => console.log(err))
          } catch (err) {
            res.status(500).send()
          }
        })()
      }
    })
  }
})

router.get("/logout", (req, res) => {
  req.logout()
  req.flash("message_msg", "Déconnexion éffectuée avec succes.")
  res.redirect("/")
})

export default router
