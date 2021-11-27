// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

import './UserPosts.sol';
import './Replies.sol';

contract Likes is UserPosts, Replies {

    mapping(address => mapping(uint => bool) ) likedPosts;
    mapping(address => mapping(uint => bool) ) likedReplies;

    function likePost(uint postId) public {
          
        bool isLiked = !likedPosts[msg.sender][postId];
        likedPosts[msg.sender][postId] = isLiked;
        
        if (isLiked) {
            userPosts[msg.sender][postId].likeCount++;
        } else {
            userPosts[msg.sender][postId].likeCount--;
        }
    }
    
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

    function getPostIsLiked(uint postId) public view returns (bool) {
        return likedPosts[msg.sender][postId];
    }
    
    function getReplyIsLiked(uint replyId) public view returns (bool) {
        return likedReplies[msg.sender][replyId];
    }
}