const express = require('express');
const userModel = require("./users-model");
const postModel = require("../posts/posts-model");
const mw = require("../middleware/middleware");

// `users-model.js` ve `posts-model.js` sayfalarına ihtiyacınız var
// ara yazılım fonksiyonları da gereklidir

const router = express.Router();

router.get('/', async (req, res) => {
  // TÜM KULLANICILARI İÇEREN DİZİYİ DÖNDÜRÜN
  const users = await userModel.get();
  res.json(users);
});

router.get('/:id',mw.validateUserId, (req, res) => {
  // USER NESNESİNİ DÖNDÜRÜN
  // user id yi getirmek için bir ara yazılım gereklidir
  res.json(req.user);
});

router.post('/',mw.validateUser, async (req, res, next) => {
  // YENİ OLUŞTURULAN USER NESNESİNİ DÖNDÜRÜN
  // istek gövdesini doğrulamak için ara yazılım gereklidir.
  try {
    const user = await userModel.insert(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/:id',mw.validateUserId, mw.validateUser, async (req, res, next) => {
  // YENİ GÜNCELLENEN USER NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan ara yazılım gereklidir
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    const updated = await userModel.update(req.params.id, req.body);
    res.status(201).json(updated);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id',mw.validateUserId, async (req, res, next) => {
  // SON SİLİNEN USER NESNESİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  try {
    await userModel.remove(req.params.id);
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

router.get('/:id/posts',mw.validateUserId, async (req, res) => {
  // USER POSTLARINI İÇEREN BİR DİZİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  const posts = await userModel.getUserPosts(req.params.id);
  res.json(posts);
});

router.post('/:id/posts',mw.validateUserId,mw.validatePost, async (req, res, next) => {
  // YENİ OLUŞTURULAN post NESNESİNİ DÖNDÜRÜN
  // user id yi doğrulayan bir ara yazılım gereklidir.
  // ve istek gövdesini doğrulayan bir ara yazılım gereklidir.
  try {
    const createdPost = await postModel.insert({user_id: req.params.id, text: req.body.text});
    res.status(201).json(createdPost);
  } catch (error) {
    next(error);
  }

});

// routerı dışa aktarmayı unutmayın
module.exports = router;