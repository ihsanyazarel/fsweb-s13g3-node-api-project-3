const userModel = require("../users/users-model");

function logger(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  console.log(`Request created at ${new Date().toLocaleString()}, request method is ${req.method}, request url is ${req.originalUrl}`);
  next();
}

async function validateUserId(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try {
    const user = await userModel.getById(req.params.id);
    if(user){
      req.user = user;
      next();
    } else{
      res.status(404).json({ mesaj: "user not found" });
    }
  } catch (error) {
    next(error);
  }
}

function validateUser(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try {
    const {name} = req.body;
    name ? next() : res.status(400).json({ mesaj: "gerekli name alanı eksik" });
  } catch (error) {
    next(error)
  }
}

function validatePost(req, res, next) {
  // SİHRİNİZİ GÖRELİM
  try {
    const {text} = req.body;
    text ? next() : res.status(400).json({ mesaj: "gerekli text alanı eksik" });
  } catch (error) {
    next(error)
  }
}

// bu işlevleri diğer modüllere değdirmeyi unutmayın
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost
};