const Replies = artifacts.require("Replies");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("RepliesTests", function (/* accounts */) {

    let instance;

    let author;
    let postId;
    let replyId;
    let replyId2;
    let replyToReplyId;

    before(async () => {
        instance = await Replies.deployed();
    });

    it("should add and reply to post", async () => {

        // add post
        await instance.postToMyFeed('title-1', 'desc-1');
        let posts = await instance.getMyPosts.call(1, 0);
        author = posts[0].author;
        postId = posts[0].postId;
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]]);

        // reply to post
        await instance.replyToPost(postId, author, 'reply-description-1');

        let replies = await instance.getRepliesToPost.call(postId, 1, 0);
        replyId = replies[0].postId;
        assert.deepEqual(replies, [[author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]]);

        replies = await instance.getRepliesFromUser.call(author, 1, 0);
        assert.deepEqual(replies, [[author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]]);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '1', '0', false]]);

        // gas calculation
        const gasEstimate = await instance.replyToPost.estimateGas(postId, author, 'reply-description-1');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for Replies.replyToPost is: ' + gasEstimate);
        assert(gasEstimate < 300000);
    });

    it('should reply to post again', async () => {

        // reply to post again
        await instance.replyToPost(postId, author, 'reply-description-2');

        replies = await instance.getRepliesToPost.call(postId, 2, 0);
        replyId2 = replies[0].postId;
        assert.deepEqual(replies, [
            [author, replyId2, '', 'reply-description-2', '', '0', '0', '0', true],
            [author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]
        ]);

        replies = await instance.getRepliesFromUser.call(author, 2, 0);
        assert.deepEqual(replies, [
            [author, replyId2, '', 'reply-description-2', '', '0', '0', '0', true],
            [author, replyId, '', 'reply-description-1', '', '0', '0', '0', true]
        ]);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '2', '0', false]]);

        // gas calculation
        const gasEstimate = await instance.replyToPost.estimateGas(postId, author, 'reply-description-2');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for Replies.replyToPost is: ' + gasEstimate);
        assert(gasEstimate < 300000);
    });

    it('should reply to reply', async () => {

        // reply to an existing reply
        await instance.replyToReply(replyId, author, 'reply-to-reply-1');

        replies = await instance.getRepliesToPost.call(replyId, 1, 0);
        replyToReplyId = replies[0].postId;
        assert.deepEqual(replies, [
            [author, replyToReplyId, '', 'reply-to-reply-1', '', '0', '0', '0', true],
        ]);

        replies = await instance.getRepliesFromUser.call(author, 3, 0);
        assert.deepEqual(replies, [
            [author, replyToReplyId, '', 'reply-to-reply-1', '', '0', '0', '0', true],
            [author, replyId2, '', 'reply-description-2', '', '0', '0', '0', true],
            [author, replyId, '', 'reply-description-1', '', '0', '1', '0', true],
        ]);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '2', '0', false]]);

        // gas calculation
        const gasEstimate = await instance.replyToReply.estimateGas(replyId, author, 'reply-to-reply-1');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for Replies.replyToReply is: ' + gasEstimate);
        assert(gasEstimate < 300000);
    });

    it('should reply to reply of a reply', async () => {

        // reply to an existing reply of a reply
        await instance.replyToReply(replyToReplyId, author, 'reply-to-reply-of-reply-1');

        replies = await instance.getRepliesToPost.call(replyToReplyId, 1, 0);
        const replyToReplyofReplyId = replies[0].postId;
        assert.deepEqual(replies, [
            [author, replyToReplyofReplyId, '', 'reply-to-reply-of-reply-1', '', '0', '0', '0', true],
        ]);

        replies = await instance.getRepliesFromUser.call(author, 4, 0);
        assert.deepEqual(replies, [
            [author, replyToReplyofReplyId, '', 'reply-to-reply-of-reply-1', '', '0', '0', '0', true],
            [author, replyToReplyId, '', 'reply-to-reply-1', '', '0', '1', '0', true],
            [author, replyId2, '', 'reply-description-2', '', '0', '0', '0', true],
            [author, replyId, '', 'reply-description-1', '', '0', '1', '0', true],
        ]);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [[author, postId, 'title-1', 'desc-1', '', '0', '2', '0', false]]);

        // gas calculation
        const gasEstimate = await instance.replyToReply.estimateGas(replyToReplyId, author, 'reply-to-reply-of-reply-1');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for Replies.replyToReply is: ' + gasEstimate);
        assert(gasEstimate < 300000);
    });
});
