const express = require('express');
const router = express.Router();
const { createPost, getPostsBySession, getPublicPosts, toggleLike } = require('../controllers/postsController');

router.post('/', createPost);
router.get('/session/:id', getPostsBySession);
router.get('/public', getPublicPosts);
router.post('/:postId/toggle-like', toggleLike);

module.exports = router;