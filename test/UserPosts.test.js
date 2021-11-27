const UserPosts = artifacts.require("UserPosts");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UserPostsTests", function (/* accounts */) {

    let instance;

    let author;
    let postId;
    let postId2;
    let posts;

    before(async () => {
        instance = await UserPosts.deployed();
    });

    it("should add first post", async function () {
        await instance.addPost('title-1', 'desc-1');

        posts = await instance.getMyPosts.call(1, 0);
        author = posts[0].author;
        postId = posts[0].postId;
        assert.deepEqual(posts, [
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        posts = await instance.getUserPosts.call(author, 1, 0);
        assert.deepEqual(posts, [
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        // gas calculation
        let gasEstimate = await instance.addPost.estimateGas('title-1', 'desc-1');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for UserPosts.addPost is: ' + gasEstimate);
        assert(gasEstimate < 200000);

        // gas calculation
        gasEstimate = await instance.getUserPosts.estimateGas(author, 1, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should add second post", async function () {
        await instance.addPost('title-2', 'desc-2');

        posts = await instance.getUserPosts.call(author, 1, 0);
        postId2 = posts[0].postId;
        assert.deepEqual(posts, [[author, postId2, 'title-2', 'desc-2', '', '0', '0', '0', false]]);

        posts = await instance.getUserPosts.call(author, 2, 0);
        assert.deepEqual(posts, [
            [author, postId2, 'title-2', 'desc-2', '', '0', '0', '0', false],
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        posts = await instance.getUserPosts.call(author, 1, 1);
        assert.deepEqual(posts, [
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        posts = await instance.getMyPosts.call(1, 0);
        assert.deepEqual(posts, [
            [author, postId2, 'title-2', 'desc-2', '', '0', '0', '0', false],
        ]);

        // gas calculation
        let gasEstimate = await instance.addPost.estimateGas('title-2', 'desc-2');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for UserPosts.addPost is: ' + gasEstimate);
        assert(gasEstimate < 200000);

        // gas calculation
        gasEstimate = await instance.getUserPosts.estimateGas(author, 2, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        // gas calculation
        gasEstimate = await instance.getUserPosts.estimateGas(author, 1, 1);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        // gas calculation
        gasEstimate = await instance.getMyPosts.estimateGas(1, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });
});
