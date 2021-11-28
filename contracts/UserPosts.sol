// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './FollowProfiles.sol';

contract UserPosts is FollowProfiles {

    uint FOLLOWER_THRESHOLD = 500;

    struct Post {
        address author;
        uint postId;
        string title;
        string description;
        string externalLink;
        uint likeCount;
        uint replyCount;
        uint shareCount;
        bool isReply;
    }

    mapping(address => uint[]) userPostKeys;
    mapping(address => uint[]) smallFryFeedKeys;
    mapping(address => mapping(uint => Post)) userPosts;
    mapping(address => mapping(uint => Post)) smallFryFeeds;

    function postToMyFeed(string memory title, string memory description) public {

        addPost(title, description);

        Profile memory profile = getMyProfile();

        if (profile.followerCount < FOLLOWER_THRESHOLD) {
            sendPostToUsersIFollow(title, description);
        }
    }

    function sendPostToUsersIFollow(string memory title, string memory description) internal {
        Profile[] memory followers = getMyFollowers();
        for (uint x = 0; x < followers.length; x ++) {
            if (!followers[x].unfollowed) {
                addPostToSmallFryFeed(followers[x].adr, title, description);
            }
        }
    }

    function addPostToSmallFryFeed(address adr, string memory title, string memory description) internal {
        uint randomNum = uint(blockhash(block.number - 1));
        Post memory smallFryPost = Post(msg.sender, randomNum, title, description, "", 0, 0, 0, false);   
        smallFryFeeds[adr][randomNum] = smallFryPost;
        smallFryFeedKeys[adr].push(randomNum);
    }

    function addPost(string memory title, string memory description) internal {
        uint randomNum = uint(blockhash(block.number - 1));
        Post memory userPost = Post(msg.sender, randomNum, title, description, "", 0, 0, 0, false);   
        userPosts[msg.sender][randomNum] = userPost;
        userPostKeys[msg.sender].push(randomNum);
    }

    function getMyPosts(uint limit, uint offset) public view returns (Post[] memory) {
        return getUserPosts(msg.sender, limit, offset);
    }

    function getUserPosts(address adr, uint limit, uint offset) public view returns (Post[] memory) {
        Post[] memory postsSubset = new Post[](limit);
        mapping(uint => Post) storage currentUserPosts = userPosts[adr];
        uint[] storage currentUserPostKeys = userPostKeys[adr];
        uint length = currentUserPostKeys.length;
        for (uint x = 0; x < limit && (x + offset) < length; x++) {
            uint postId = currentUserPostKeys[length - (x + 1) - offset];
            postsSubset[x] = currentUserPosts[postId];
        }

        return postsSubset;
    }

    function getMySmallFryFeed(uint limit, uint offset) public view returns (Post[] memory) {
        Post[] memory postsSubset = new Post[](limit);
        mapping(uint => Post) storage currentUserPosts = smallFryFeeds[msg.sender];
        uint[] storage currentUserPostKeys = smallFryFeedKeys[msg.sender];
        uint length = currentUserPostKeys.length;
        for (uint x = 0; x < limit && (x + offset) < length; x++) {
            uint postId = currentUserPostKeys[length - (x + 1) - offset];
            postsSubset[x] = currentUserPosts[postId];
        }

        return postsSubset;
    }
}