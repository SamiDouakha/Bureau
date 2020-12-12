const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash("error_msg", "Veuilliez vous connecter")
  res.redirect("/users/login")
}

export default ensureAuthenticated
