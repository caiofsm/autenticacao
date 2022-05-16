function verifyAuth(req, res, next) {
  if (req?.user?.username) {
    next();
    return;
  }

  res.redirect("/login");
}

function teste()
{
  
}

module.exports.verifyAuth = verifyAuth
module.exports.teste = teste

