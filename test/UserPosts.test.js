const UserPosts = artifacts.require("UserPosts");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("UserPostsTests", function (accounts) {

    let instance;

    let author;
    let postId;
    let postId2;
    let postId3;
    let posts;

    before(async () => {
        instance = await UserPosts.deployed();
        author = accounts[0];
    });

    it("should add first post", async function () {
        await instance.postToMyFeed('title-1', 'desc-1');

        posts = await instance.getMyPosts.call(1, 0);
        postId = posts[0].postId;
        assert.deepEqual(posts, [
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        posts = await instance.getUserPosts.call(author, 1, 0);
        assert.deepEqual(posts, [
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        // gas calculation
        let gasEstimate = await instance.postToMyFeed.estimateGas('title-1', 'desc-1');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for UserPosts.postToMyFeed is: ' + gasEstimate);
        assert(gasEstimate < 200000);

        gasEstimate = await instance.getUserPosts.estimateGas(author, 1, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should add second post", async function () {
        await instance.postToMyFeed('title-2', 'desc-2');

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
        let gasEstimate = await instance.postToMyFeed.estimateGas('title-2', 'desc-2');
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for UserPosts.postToMyFeed is: ' + gasEstimate);
        assert(gasEstimate < 200000);

        gasEstimate = await instance.getUserPosts.estimateGas(author, 2, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getUserPosts.estimateGas(author, 1, 1);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getMyPosts.estimateGas(1, 0);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for UserPosts.getUserPosts is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should add posts for small fry followers", async function () {

        await instance.followUser(accounts[0], {from: accounts[1]});

        await instance.followUser(accounts[0], {from: accounts[2]});

        await instance.followUser(accounts[0], {from: accounts[3]});
        await instance.unfollowUser(accounts[0], {from: accounts[3]});

        await instance.followUser(accounts[0], {from: accounts[4]});

        await instance.postToMyFeed('title-3', 'desc-3', {from: accounts[0]});

        posts = await instance.getUserPosts.call(author, 3, 0, {from: accounts[0]});
        postId3 = posts[0].postId;
        assert.deepEqual(posts, [
            [author, postId3, 'title-3', 'desc-3', '', '0', '0', '0', false],
            [author, postId2, 'title-2', 'desc-2', '', '0', '0', '0', false],
            [author, postId, 'title-1', 'desc-1', '', '0', '0', '0', false]
        ]);

        posts = await instance.getMySmallFryFeed.call(1, 0, {from: accounts[1]});
        assert.deepEqual(posts, [
            [author, postId3, 'title-3', 'desc-3', '', '0', '0', '0', false],
        ]);

        posts = await instance.getMySmallFryFeed.call(1, 0, {from: accounts[2]});
        assert.deepEqual(posts, [
            [author, postId3, 'title-3', 'desc-3', '', '0', '0', '0', false],
        ]);

        posts = await instance.getMySmallFryFeed.call(1, 0, {from: accounts[3]});
        assert.deepEqual(posts, [
            ['0x0000000000000000000000000000000000000000', '0', '', '', '', '0', '0', '0', false],
        ]);

        posts = await instance.getMySmallFryFeed.call(1, 0, {from: accounts[4]});
        assert.deepEqual(posts, [
            [author, postId3, 'title-3', 'desc-3', '', '0', '0', '0', false],
        ]);

        // calculate gas
        gasEstimate = await instance.postToMyFeed.estimateGas('title-3', 'desc-3', {from: accounts[0]});
        console.log('\x1b[33m%s\x1b[0m', 'gas cost for UserPosts.postToMyFeed is: ' + gasEstimate);
        assert(gasEstimate < 1000000);
    });
});
