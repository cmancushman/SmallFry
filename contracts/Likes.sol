// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './UserPosts.sol';
import './Replies.sol';

contract Likes is Replies {

    mapping(address => mapping(uint => bool)) likedPosts; // posts that have been liked
    mapping(address => mapping(uint => bool)) likedReplies; // replies that have been liked

    /**
     * @dev Like a post
     * @param postId post id of the post to like
     */
    function likePost(uint postId) public {
          
        bool isLiked = !likedPosts[msg.sender][postId];
        likedPosts[msg.sender][postId] = isLiked;
        
        if (isLiked) {
            userPosts[msg.sender][postId].likeCount++;
        } else {
            userPosts[msg.sender][postId].likeCount--;
        }
    }

    /**
     * @dev Like a reply
     * @param replyId post id of the reply to like
     * @param postId post id of the post the reply is associated with
     * @param adr address of the author of the reply
     */
    function likeReply(uint replyId, uint postId, address adr) public {

        bool isLiked = !likedReplies[adr][replyId];
        likedReplies[adr][replyId] = isLiked;

        if (isLiked) {
            userReplies[adr][replyId].likeCount++;
            postReplies[postId][replyId].likeCount++;
        } else {
            userReplies[adr][replyId].likeCount--;
            postReplies[postId][replyId].likeCount--;
        }
    }

    /**
     * @dev Fetch if post is liked
     * @param postId post id of the post
     * @return true if the post has been liked by msg.sender, otherwise false
     */
    function getPostIsLiked(uint postId) public view returns (bool) {
        return likedPosts[msg.sender][postId];
    }

    /**
     * @dev Fetch if reply is liked
     * @param replyId post id of the reply
     * @return true if the reply has been liked by msg.sender, otherwise false
     */   
    function getReplyIsLiked(uint replyId) public view returns (bool) {
        return likedReplies[msg.sender][replyId];
    }
}