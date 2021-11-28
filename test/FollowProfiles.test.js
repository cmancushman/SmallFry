const FollowProfiles = artifacts.require("FollowProfiles");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FollowProfiles", function (accounts) {
    let instance;
    let profiles;

    const testAccount = '0x0000000000000000000000000000000000000123';

    before(async () => {
        instance = await FollowProfiles.deployed();
    });

    it("should follow profile", async () => {
        await instance.setName('chris');
        await instance.setProfilePictureUrl('profile pic');
        await instance.setBio('new bio');

        await instance.followUser(testAccount);

        const followers = await instance.getFollowers.call(testAccount);
        assert.deepEqual(followers, [
            [accounts[0], 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call(accounts[0]);
        assert.deepEqual(following, [
            [testAccount, '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas(testAccount);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getFollowers.estimateGas(testAccount);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.getFollowers is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getFollowing.estimateGas(accounts[0]);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.getFollowing is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should unfollow profile", async () => {
        await instance.unfollowUser(testAccount);
        const followers = await instance.getFollowers.call(testAccount);
        assert.deepEqual(followers, [
            [accounts[0], 'chris', 'profile pic', 'new bio', '0', '0', true, false]
        ]);

        const following = await instance.getFollowing.call(accounts[0]);
        assert.deepEqual(following, [
            [testAccount, '', '', '', '0', '0', false, true]
        ]);

        // gas calculation
        let gasEstimate = await instance.unfollowUser.estimateGas(testAccount);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.unfollowUser is: ' + gasEstimate);
    });

    it("should re-follow profile", async () => {
        await instance.followUser(testAccount);
        const followers = await instance.getFollowers.call(testAccount);
        assert.deepEqual(followers, [
            [accounts[0], 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call(accounts[0]);
        assert.deepEqual(following, [
            [testAccount, '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas(testAccount);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser to re-follow is: ' + gasEstimate);
    });


    it("should do nothing for already-followed profile", async () => {
        await instance.followUser(testAccount);
        const followers = await instance.getFollowers.call(testAccount);
        assert.deepEqual(followers, [
            [accounts[0], 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call(accounts[0]);
        assert.deepEqual(following, [
            [testAccount, '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas(testAccount);
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser for already-followed profile is: ' + gasEstimate);
    });

    it("should follow profile from other account", async () => {
        await instance.followUser(testAccount, {from: accounts[1]});
        const followers = await instance.getFollowers.call(testAccount);
        assert.deepEqual(followers, [
            [accounts[0], 'chris', 'profile pic', 'new bio', '0', '0', false, false],
            [accounts[1], '', '', '', '0', '0', false, false],
        ]);

        const following = await instance.getFollowing.call(accounts[1]);
        assert.deepEqual(following, [
            [testAccount, '', '', '', '1', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas(testAccount, {from: accounts[1]});
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser for already-followed profile is: ' + gasEstimate);
    });
});
