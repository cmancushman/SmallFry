// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './UserPosts.sol';

contract Replies is UserPosts {

  mapping(address => uint[]) userReplyKeys; // mapping of addresses to list of corresponding user's reply keys
  mapping(address => mapping(uint => Post)) userReplies; // mapping of addresses to the corresponding user's replies

  mapping(uint => uint[]) postReplyKeys; // mapping of postIds to list of corresponding post's reply keys
  mapping(uint => mapping(uint => Post)) postReplies; // mapping of postIds to the corresponding post's replies

    /**
     * @dev Reply to a post
     * @param postId the id of the post to be replied to
     * @param author the address of the author of the post to be replied to
     * @param description the description of the reply
     */
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

    /**
     * @dev Reply to a reply
     * @param replyId the id of the reply to be replied to
     * @param author the address of the author of the reply to be replied to
     * @param description the description of the reply
     */
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

    /**
     * @dev Get replies to a post
     * @param postId the id of the post to be replied to
     * @param limit the max number of replies to fetch
     * @param offset the offset of the starting index of replies to fetch
     * @return list of replies to a post, bound by the limit and offset
     */
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

    /**
     * @dev Get replies a user has made
     * @param adr the address of the user
     * @param limit the max number of replies to fetch
     * @param offset the offset of the starting index of replies to fetch
     * @return list of replies a user has made, bound by the limit and offset
     */
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