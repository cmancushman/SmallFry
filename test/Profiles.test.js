const Profiles = artifacts.require("Profiles");

/*
 * uncomment accounts to access the test accounts made available by the
 * Ethereum client
 * See docs: https://www.trufflesuite.com/docs/truffle/testing/writing-tests-in-javascript
 */
contract("ProfilesTests", function (/* accounts */) {
    let instance;
    let profile;

    before(async () => {
        instance = await Profiles.deployed();
    });

    it("should set name", async () => {
        await instance.setName('chris');
        profile = await instance.retrieveMyProfile.call();
        assert.deepEqual(
            profile,
            ['0x0000000000000000000000000000000000000000', 'chris', '', '', '0', '0', false, false],
            'name should be set'
        );

        // gas calculation
        let gasEstimate = await instance.retrieveMyProfile.estimateGas();
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Profiles.retrieveMyProfile is: ' + gasEstimate);
        assert(gasEstimate < 100000);

        gasEstimate = await instance.setName.estimateGas('chris');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Profiles.setName is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });

    it('should set profile pic', async () => {
        await instance.setProfilePictureUrl('profile pic');
        profile = await instance.retrieveMyProfile.call();
        assert.deepEqual(
            profile,
            ['0x0000000000000000000000000000000000000000', 'chris', 'profile pic', '', '0', '0', false, false],
            'profile pic should be set'
        );

        // gas calculation
        let gasEstimate = await instance.setProfilePictureUrl.estimateGas('profile pic');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Profiles.retrieveMyProfile is: ' + gasEstimate);
        assert(gasEstimate < 100000);

    });

    it('should set bio', async () => {
        await instance.setBio('new bio');
        profile = await instance.retrieveMyProfile.call();
        assert.deepEqual(
            profile,
            ['0x0000000000000000000000000000000000000000', 'chris', 'profile pic', 'new bio', '0', '0', false, false],
            'bio should be set'
        );

        // gas calculation
        let gasEstimate = await instance.setBio.estimateGas('new bio');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Profiles.setBio is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });


    it('should set profile info', async () => {
        await instance.setProfileInfo('johnny', 'different profile pic', 'changed bio');
        profile = await instance.retrieveMyProfile.call();
        assert.deepEqual(
            profile,
            ['0x0000000000000000000000000000000000000000', 'johnny', 'different profile pic', 'changed bio', '0', '0', false, false],
            'bio should be set'
        );

        // gas calculation
        let gasEstimate = await instance.setProfileInfo.estimateGas('johnny', 'different profile pic', 'changed bio');
        console.log('\x1b[36m%s\x1b[0m', 'gas cost for Profiles.setProfileInfo is: ' + gasEstimate);
        assert(gasEstimate < 100000);
    });
});
