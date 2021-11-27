// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

contract UserPosts {

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
    mapping(address => mapping(uint => Post)) userPosts;

    function addPost(string memory title, string memory description) public {
        uint randomNum = uint(blockhash(block.number - 1));
        Post memory post = Post(msg.sender, randomNum, title, description, "", 0, 0, 0, false);   
        userPosts[msg.sender][randomNum] = post;
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
}