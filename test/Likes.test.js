const Likes = artifacts.require("Likes");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("LikesTests", function (/* accounts */) {
    it("should like post", async function () {
        const instance = await Likes.deployed();

        // should add post
        await instance.postToMyFeed('title-1', 'desc-1');
        let posts = await instance.getMyPosts.call(1, 0);
        const author = posts[0].author;
        const postId = posts[0].postId;
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]]);

        // should like post
        await instance.likePost(postId);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '1', '0', '0', false]]);
        let postIsLiked = await instance.getPostIsLiked.call(postId);
        assert.equal(postIsLiked, true);

        // should unlike post
        await instance.likePost(postId);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]]);
        postIsLiked = await instance.getPostIsLiked.call(postId);
        assert.equal(postIsLiked, false);

        // gas calculation
        const gasEstimate = await instance.likePost.estimateGas(postId);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Likes.likePost is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should like reply", async function () {
        const instance = await Likes.deployed();

        // should add post
        await instance.postToMyFeed('title-1', 'desc-1');
        let posts = await instance.getMyPosts.call(1, 0);
        const author = posts[0].author;
        const postId = posts[0].postId;
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]]);

        // should add reply
        await instance.replyToPost(postId, author, 'reply-description-1');

        let replies = await instance.getRepliesToPost.call(postId, 1, 0);
        const replyId = replies[0].postId;
        assert.deepEqual(replies, [[author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]]);

        // should like reply
        await instance.likeReply(replyId, postId, author);
        replies = await instance.getRepliesFromUser.call(author, 1, 0);
        assert.deepEqual(replies, [[author, replyId, '', 'reply-description-1', '', '1', '0', '0', true]]);
        let replyIsLiked = await instance.getReplyIsLiked.call(replyId);
        assert.equal(replyIsLiked, true);

        // should unlike reply
        await instance.likeReply(replyId, postId, author);
        replies = await instance.getRepliesFromUser.call(author, 1, 0);
        assert.deepEqual(replies, [[author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]]);
        replyIsLiked = await instance.getReplyIsLiked.call(replyId);
        assert.equal(replyIsLiked, false);

        // gas calculation
        const gasEstimate = await instance.likeReply.estimateGas(replyId, postId, author);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Likes.likeReply is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });
});
