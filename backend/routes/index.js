const express = require('express');
const router = express.Router();

const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const categoryRoute = require('./category.route');
const postRoute = require('./post.route');
const reactionRoute = require('./reaction.route');
const savePostRoute = require('./savePost.route');
const commentRoute = require('./comment.route');
const notificationRoute = require('./notification.route');
const reportRoute = require('./report.route');
const ruleRoute = require('./rule.route');
const searchRoute = require('./search.route');
const friendsRoute = require('./friends.route');
const socketRoute = require('./socket.route');
const chatRoute = require('./chat.route');
const messageRoute = require('./message.route');
const badWordRoute = require('./badword.route');
const zalopayRoute = require('./zalopay.route');
const transactionRoute = require('./transaction.route');

// Define your routes here
router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/category', categoryRoute);
router.use('/post', postRoute);
router.use('/reaction', reactionRoute);
router.use('/save-post', savePostRoute);
router.use('/comment', commentRoute);
router.use('/notification', notificationRoute);
router.use('/report', reportRoute);
router.use('/rule', ruleRoute);
router.use('/search', searchRoute);
router.use('/friend', friendsRoute);
router.use('/socket', socketRoute);
router.use('/chat', chatRoute);
router.use('/message', messageRoute);
router.use('/bad-word', badWordRoute);

// Add ZaloPay routes
router.use('/zalopay', zalopayRoute);
router.use('/transaction', transactionRoute);

module.exports = router;
