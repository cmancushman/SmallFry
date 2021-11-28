// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Profiles
 * @dev Mutate & retrieve user profiles
 */
contract Profiles {

    struct Profile {
        address adr; // the user's wallet address
        string name; // the user's name or nickname
        string profilePictureUrl; // the url of the user's profile picture
        string bio; // the user's bio
        uint followerCount; // the user's follower count
        uint followingCount; // the number of people the user follows
        bool unfollowed;
        bool unfollowing;
    }

    mapping(address => Profile) profiles; // a mapping of addresses to their corresponding profiles

    /**
     * @dev Set name on own profile
     * @param name the name to be set
     */
    function setName(string memory name) public {
       profiles[msg.sender].name = name;
    }
    
    /**
     * @dev Set profile picture url on own profile
     * @param profilePictureUrl the profile picture url to be set
     */
    function setProfilePictureUrl(string memory profilePictureUrl) public {
       profiles[msg.sender].profilePictureUrl = profilePictureUrl;
    }
    
    /**
     * @dev Set bio on own profile
     * @param bio the bio to be set
     */
    function setBio(string memory bio) public {
       profiles[msg.sender].bio = bio;
    }

    /**
     * @dev Set name, profile picture url, & bio on profile
     * @param name the name to be set
     * @param profilePictureUrl the profile picture url to be set
     * @param bio the bio to be set
     */
    function setProfileInfo(string memory name, string memory profilePictureUrl, string memory bio) public {
       profiles[msg.sender].name = name;
       profiles[msg.sender].profilePictureUrl = profilePictureUrl;
       profiles[msg.sender].bio = bio;
    }

    /**
     * @dev Set the follower count of own profile
     * @param followerCount the follower count to be set
     */
    function setFollowerCount(uint followerCount) public {
       profiles[msg.sender].followerCount = followerCount;
    }

    /**
     * @dev Set the following count of own profile
     * @param followingCount the following count to be set
     */
    function setFollowingCount(uint followingCount) public {
       profiles[msg.sender].followingCount = followingCount;
    }

    /**
     * @dev Set the follower count of a profile
     * @param adr the address of the profile
     * @param followerCount the follower count to be set
     */
    function setFollowerCountForAddress(address adr, uint followerCount) public {
       profiles[adr].followerCount = followerCount;
    }

    /**
     * @dev Set the following count of a profile
     * @param adr the address of the profile
     * @param followingCount the following count to be set
     */
    function setFollowingCountForAddress(address adr, uint followingCount) public {
       profiles[adr].followingCount = followingCount;
    }

    /**
     * @dev Fetch own profile
     * @return profile
     */
    function getMyProfile() public view returns (Profile memory){
        return profiles[msg.sender];
    }

    /**
     * @dev Fetch user's profile
     * @return profile
     */
    function getProfile(address adr) public view returns (Profile memory){
        return profiles[adr];
    }
}