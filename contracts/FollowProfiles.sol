// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import './Profiles.sol';

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract FollowProfiles is Profiles {

    mapping(address => mapping(address => uint)) followersIndexMapping; // an index mapping of each follower within a user's follower list
    mapping(address => Profile[]) followersMapping; // mapping of addresses to the corresponding user's follower list

    mapping(address => mapping(address => uint)) followingIndexMapping; // an index mapping of each follower within a user's following list
    mapping(address => Profile[]) followingMapping; // mapping of addresses to the corresponding user's following list

    /**
     * @dev Follow a user
     */
    function followUser(address adr) public {

        uint followerIndex = followersIndexMapping[adr][msg.sender];
        Profile[] storage followedProfiles = followersMapping[adr];
        Profile memory alreadyFollowedProfile;
        if (followedProfiles.length != 0) {
            alreadyFollowedProfile = followedProfiles[followerIndex];
        }    

        Profile memory ownProfile;
        Profile memory followProfile;

        // check if the mapping already exists, and if so re-follow the user that was unfollowed
        if (alreadyFollowedProfile.adr != address(0) && alreadyFollowedProfile.unfollowed) {

            ownProfile = retrieveMyProfile();
            followProfile = retrieveProfile(adr);

            uint followingIndex = followingIndexMapping[msg.sender][adr];

            followersMapping[adr][followerIndex].unfollowed = false;
            followingMapping[msg.sender][followingIndex].unfollowing = false;

            setFollowerCountForAddress(adr, followProfile.followerCount + 1);
            setFollowingCountForAddress(msg.sender, ownProfile.followingCount + 1);

            return;
        } else if (alreadyFollowedProfile.adr != address(0)) {
            return; // if the user is not unfollowed, do nothing
        }

        ownProfile = retrieveMyProfile();
        followProfile = retrieveProfile(adr);

        ownProfile.adr = msg.sender;
        followProfile.adr = adr;

        followersMapping[adr].push(ownProfile);
        followingMapping[msg.sender].push(followProfile);

        followersIndexMapping[adr][msg.sender] = followersMapping[adr].length - 1;
        followingIndexMapping[msg.sender][adr] = followingMapping[msg.sender].length - 1;

        setFollowerCountForAddress(adr, followProfile.followerCount + 1);
        setFollowingCountForAddress(msg.sender, ownProfile.followingCount + 1);
    }

    /**
     * @dev Follow a user
     * @param adr address of the user to follow
     */
    function unfollowUser(address adr) public {

        uint followerIndex = followersIndexMapping[adr][msg.sender];
        Profile storage alreadyFollowedProfile = followersMapping[adr][followerIndex];

        // if mapping already exists, unfollow the user that was followed
        if (alreadyFollowedProfile.adr != address(0) && !alreadyFollowedProfile.unfollowed) {

            Profile memory ownProfile = retrieveMyProfile();
            Profile memory followProfile = retrieveProfile(adr);

            uint followingIndex = followingIndexMapping[msg.sender][adr];

            followersMapping[adr][followerIndex].unfollowed = true;
            followingMapping[msg.sender][followingIndex].unfollowing = true;

            setFollowerCountForAddress(adr, followProfile.followerCount - 1);
            setFollowingCountForAddress(msg.sender, ownProfile.followingCount - 1);

            return;
        }
    }

    function getFollowers(address adr) public view returns (Profile[] memory) {
        return followersMapping[adr];
    }

    function getFollowing(address adr) public view returns (Profile[] memory) {
        return followingMapping[adr];
    }

}