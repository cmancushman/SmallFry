// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;
import './Profiles.sol';

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract FollowProfiles is Profiles {

    mapping(address => mapping(address => bool)) hasFollowedMapping; // a boolean mapping for follow history
    mapping(address => mapping(address => uint)) followersIndexMapping; // an index mapping of each follower within a user's follower list
    mapping(address => Profile[]) followersMapping; // mapping of addresses to the corresponding user's follower list

    mapping(address => mapping(address => uint)) followingIndexMapping; // an index mapping of each follower within a user's following list
    mapping(address => Profile[]) followingMapping; // mapping of addresses to the corresponding user's following list

    /**
     * @dev Follow a user
     * @param adr address of the user to follow
     */
    function followUser(address adr) public {

        bool hasFollowed = hasFollowedMapping[msg.sender][adr];
        uint followerIndex = followersIndexMapping[adr][msg.sender];
        Profile[] storage followedProfiles = followersMapping[adr];
        Profile memory alreadyFollowedProfile;
        if (followedProfiles.length != 0) {
            alreadyFollowedProfile = followedProfiles[followerIndex];
        }

        Profile memory ownProfile;
        Profile memory followProfile;

        // check if the mapping already exists, and if so re-follow the user that was unfollowed
        if (hasFollowed && alreadyFollowedProfile.unfollowed) {

            ownProfile = getMyProfile();
            followProfile = getProfile(adr);

            uint followingIndex = followingIndexMapping[msg.sender][adr];

            followersMapping[adr][followerIndex].unfollowed = false;
            followingMapping[msg.sender][followingIndex].unfollowing = false;

            setFollowerCountForAddress(adr, followProfile.followerCount + 1);
            setFollowingCountForAddress(msg.sender, ownProfile.followingCount + 1);

            return;
        } else if (hasFollowed) {
            return; // if the user is not unfollowed, do nothing
        }

        ownProfile = getMyProfile();
        followProfile = getProfile(adr);

        ownProfile.adr = msg.sender;
        followProfile.adr = adr;

        followersMapping[adr].push(ownProfile);
        followingMapping[msg.sender].push(followProfile);

        followersIndexMapping[adr][msg.sender] = followersMapping[adr].length - 1;
        followingIndexMapping[msg.sender][adr] = followingMapping[msg.sender].length - 1;

        hasFollowedMapping[msg.sender][adr] = true;

        setFollowerCountForAddress(adr, followProfile.followerCount + 1);
        setFollowingCountForAddress(msg.sender, ownProfile.followingCount + 1);
    }

    /**
     * @dev Follow a user
     * @param adr address of the user to unfollow
     */
    function unfollowUser(address adr) public {

        bool hasFollowed = hasFollowedMapping[msg.sender][adr];
        uint followerIndex = followersIndexMapping[adr][msg.sender];
        Profile storage alreadyFollowedProfile = followersMapping[adr][followerIndex];

        // if mapping already exists, unfollow the user that was followed
        if (hasFollowed && !alreadyFollowedProfile.unfollowed) {

            Profile memory ownProfile = getMyProfile();
            Profile memory followProfile = getProfile(adr);

            uint followingIndex = followingIndexMapping[msg.sender][adr];

            followersMapping[adr][followerIndex].unfollowed = true;
            followingMapping[msg.sender][followingIndex].unfollowing = true;

            setFollowerCountForAddress(adr, followProfile.followerCount - 1);
            setFollowingCountForAddress(msg.sender, ownProfile.followingCount - 1);

            return;
        }
    }

    /**
     * @dev Fetch profiles that follow a user
     * @param adr the address of the profile
     * @return profiles that follow a user
     */
    function getFollowers(address adr) public view returns (Profile[] memory) {
        return followersMapping[adr];
    }

    /**
     * @dev Fetch profiles that follow 'me'
     * @return profiles that follow msg.sender
     */
    function getMyFollowers() public view returns (Profile[] memory) {
        return followersMapping[msg.sender];
    }

    /**
     * @dev Fetch if a user is following 'me'
     * @param adr the address of the profile
     * @return true if user is following msg.sender, otherwise false
     */
    function getIsUserFollowingMe(address adr) public view returns (bool) {
        bool hasFollowed = hasFollowedMapping[adr][msg.sender];

        uint followerIndex = followersIndexMapping[adr][msg.sender];
        Profile storage profile = followersMapping[adr][followerIndex];
        return (hasFollowed && !profile.unfollowed);
    }

    /**
     * @dev Fetch profiles a user is following
     * @param adr the address of the profile
     * @return profiles the user is following
     */
    function getFollowing(address adr) public view returns (Profile[] memory) {
        return followingMapping[adr];
    }

}