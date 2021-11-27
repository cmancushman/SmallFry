const FollowProfiles = artifacts.require("FollowProfiles");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("FollowProfiles", function (/* accounts */) {
    let instance;
    let profiles;

    before(async () => {
        instance = await FollowProfiles.deployed();
    });

    it("should follow profile", async () => {
        await instance.setName('chris');
        await instance.setProfilePictureUrl('profile pic');
        await instance.setBio('new bio');

        await instance.followUser('0x0000000000000000000000000000000000000123');

        const followers = await instance.getFollowers.call('0x0000000000000000000000000000000000000123');
        assert.deepEqual(followers, [
            ['0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        assert.deepEqual(following, [
            ['0x0000000000000000000000000000000000000123', '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas('0x0000000000000000000000000000000000000123');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getFollowers.estimateGas('0x0000000000000000000000000000000000000123');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.getFollowers is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.getFollowing.estimateGas('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.getFollowing is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it("should unfollow profile", async () => {
        await instance.unfollowUser('0x0000000000000000000000000000000000000123');
        const followers = await instance.getFollowers.call('0x0000000000000000000000000000000000000123');
        assert.deepEqual(followers, [
            ['0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 'chris', 'profile pic', 'new bio', '0', '0', true, false]
        ]);

        const following = await instance.getFollowing.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        assert.deepEqual(following, [
            ['0x0000000000000000000000000000000000000123', '', '', '', '0', '0', false, true]
        ]);

        // gas calculation
        let gasEstimate = await instance.unfollowUser.estimateGas('0x0000000000000000000000000000000000000123');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.unfollowUser is: ' + gasEstimate);
    });

    it("should re-follow profile", async () => {
        await instance.followUser('0x0000000000000000000000000000000000000123');
        const followers = await instance.getFollowers.call('0x0000000000000000000000000000000000000123');
        assert.deepEqual(followers, [
            ['0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        assert.deepEqual(following, [
            ['0x0000000000000000000000000000000000000123', '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas('0x0000000000000000000000000000000000000123');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser to re-follow is: ' + gasEstimate);
    });


    it("should do nothing for already-followed profile", async () => {
        await instance.followUser('0x0000000000000000000000000000000000000123');
        const followers = await instance.getFollowers.call('0x0000000000000000000000000000000000000123');
        assert.deepEqual(followers, [
            ['0x627306090abaB3A6e1400e9345bC60c78a8BEf57', 'chris', 'profile pic', 'new bio', '0', '0', false, false]
        ]);

        const following = await instance.getFollowing.call('0x627306090abaB3A6e1400e9345bC60c78a8BEf57');
        assert.deepEqual(following, [
            ['0x0000000000000000000000000000000000000123', '', '', '', '0', '0', false, false]
        ]);

        // gas calculation
        let gasEstimate = await instance.followUser.estimateGas('0x0000000000000000000000000000000000000123');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for FollowwProfiles.followUser for already-followed profile is: ' + gasEstimate);
    });
});
