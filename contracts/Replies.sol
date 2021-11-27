// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './UserPosts.sol';

contract Replies is UserPosts {

  mapping(address => uint[]) userReplyKeys;
  mapping(address => mapping(uint => Post)) userReplies;

  mapping(uint => uint[]) postReplyKeys;
  mapping(uint => mapping(uint => Post)) postReplies;

    function replyToPost(uint postId, address author, string memory description) public {
        Post storage post = userPosts[author][postId];
        
        if (post.postId == 0) {
            // post does not exist
            return;
        }

        uint randomNum = uint(blockhash(block.number - 1));
        Post memory reply = Post(msg.sender, randomNum, "", description, "", 0, 0, 0, true); 

        userReplies[msg.sender][randomNum] = reply;
        userReplyKeys[msg.sender].push(randomNum);
        
        postReplyKeys[postId].push(randomNum);
        postReplies[postId][randomNum] = reply;
        
        userPosts[author][postId].replyCount++;
    }

    function replyToReply(uint replyId, address author, string memory description) public {
        Post storage sourceReply = userReplies[author][replyId];

        if (sourceReply.postId == 0) {
            // post does not exist
            return;
        }

        uint randomNum = uint(blockhash(block.number - 1));
        Post memory reply = Post(msg.sender, randomNum, "", description, "", 0, 0, 0, true); 

        userReplies[msg.sender][randomNum] = reply;
        userReplyKeys[msg.sender].push(randomNum);

        postReplyKeys[replyId].push(randomNum);
        postReplies[replyId][randomNum] = reply;

        userReplies[author][replyId].replyCount++;
    }

    function getRepliesToPost(uint postId, uint limit, uint offset) public view returns (Post[] memory) {
        Post[] memory repliesSubset = new Post[](limit);
        mapping(uint => Post) storage currentPostReplies = postReplies[postId];
        uint[] storage currentPostReplyKeys = postReplyKeys[postId];

        uint length = currentPostReplyKeys.length;
        for (uint x = 0; x < limit && (x + offset) < length; x++) {
            uint replyId = currentPostReplyKeys[length - (x + 1) - offset];
            repliesSubset[x] = currentPostReplies[replyId];
        }
        return repliesSubset;
    }

    function getRepliesFromUser(address adr, uint limit, uint offset) public view returns (Post[] memory) {
        Post[] memory repliesSubset = new Post[](limit);
        mapping(uint => Post) storage currentUserReplies = userReplies[adr];
        uint[] storage currentUserReplyKeys = userReplyKeys[adr];
        uint length = currentUserReplyKeys.length;
        for (uint x = 0; x < limit && (x + offset) < length; x++) {
            uint replyId = currentUserReplyKeys[length - (x + 1) - offset];
            repliesSubset[x] = currentUserReplies[replyId];
        }
        return repliesSubset;
    }
}