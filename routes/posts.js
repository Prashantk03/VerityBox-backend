const express = require('express');
const router = express.Router();
const { createPost, getPostsBySession, getPublicPosts } = require('../controllers/postsController');

router.post('/', createPost);
router.get('/session/:id', getPostsBySession);
router.get('/public', getPublicPosts);

module.exports = router;