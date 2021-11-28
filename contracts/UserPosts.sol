// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './FollowProfiles.sol';

contract UserPosts is FollowProfiles {

    uint SMALL_FRY_THRESHOLD = 500; // a small-fry is someone with less than 500 followers

    struct Post {
        address author; // the author of the post
        uint postId; // id of the psot
        string title; // title of the post
        string description; // description of the post
        string externalLink; // external link on the post, i.e an image, article, etc..
        uint likeCount; // number of likes the post has
        uint replyCount; // number of replies the post has
        uint shareCount; // number of shares the post has
        bool isReply; // true if the post is a reply, otherwise false
    }

    mapping(address => uint[]) userPostKeys; // mapping of addresses to list of corresponding user's post keys
    mapping(address => mapping(uint => Post)) userPosts; // mapping of postIds to list of corresponding post's po keys

    mapping(address => uint[]) smallFryFeedKeys; // mapping of addresses to the corresponding small-fry user's posts
    mapping(address => mapping(uint => Post)) smallFryFeeds; // mapping of postIds to the corresponding post's replies

    /**
     * @dev Add a post -- only to your user posts list if you're a large account, 
     * but to all your followers' small-fry feeds if you're a small-fry
     * @param description the title of the post
     * @param description the description of the post
     */
    function postToMyFeed(string memory title, string memory description) public {

        addPost(title, description);

        Profile memory profile = getMyProfile();

        if (profile.followerCount < SMALL_FRY_THRESHOLD) {
            sendPostToAllSmallFryFeeds(title, description);
        }
    }

    /**
     * @dev Add a post to all small-fry feeds of your followers
     * @param description the title of the post
     * @param description the description of the post
     */
    function sendPostToAllSmallFryFeeds(string memory title, string memory description) internal {
        Profile[] memory followers = getMyFollowers();
        for (uint x = 0; x < followers.length; x ++) {
            if (!followers[x].unfollowed) {
                addPostToSmallFryFeed(followers[x].adr, title, description);
            }
        }
    }

    /**
     * @dev Add a post to a single small-fry feed
     * @param adr the address of the user that follows you
     * @param description the title of the post
     * @param description the description of the post
     */
    function addPostToSmallFryFeed(address adr, string memory title, string memory description) internal {
        uint randomNum = uint(blockhash(block.number - 1));
        Post memory smallFryPost = Post(msg.sender, randomNum, title, description, "", 0, 0, 0, false);   
        smallFryFeeds[adr][randomNum] = smallFryPost;
        smallFryFeedKeys[adr].push(randomNum);
    }

    /**
     * @dev Add a post your own user post list
     * @param description the title of the post
     * @param description the description of the post
     */
    function addPost(string memory title, string memory description) internal {
        uint randomNum = uint(blockhash(block.number - 1));
        Post memory userPost = Post(msg.sender, randomNum, title, description, "", 0, 0, 0, false);   
        userPosts[msg.sender][randomNum] = userPost;
        userPostKeys[msg.sender].push(randomNum);
    }

    /**
     * @dev Get your own user posts
     * @param limit the max number of posts to fetch
     * @param offset the offset of the starting index of posts to fetch
     * @return user posts by msg.sender, bounded by limit and offset
     */
    function getMyPosts(uint limit, uint offset) public view returns (Post[] memory) {
        return getUserPosts(msg.sender, limit, offset);
    }

    /**
     * @dev Get a user's posts
     * @param limit the max number of posts to fetch
     * @param offset the offset of the starting index of posts to fetch
     * @return user posts by adr, bounded by limit and offset
     */
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

    /**
     * @dev Get your own small-fry feed, which is the list of posts made by small accounts you follow
     * @param limit the max number of posts to fetch
     * @param offset the offset of the starting index of posts to fetch
     * @return small-fry feed for msg.sender, bounded by limit and offset
     */
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