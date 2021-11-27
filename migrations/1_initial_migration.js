const Migrations = artifacts.require("Migrations");
const UserPosts = artifacts.require("UserPosts");
const Profiles = artifacts.require("Profiles");
const Likes = artifacts.require("Likes");
const Replies = artifacts.require("Replies");
const FollowProfiles = artifacts.require("FollowProfiles");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(UserPosts);
  deployer.deploy(Profiles);
  deployer.deploy(Likes);
  deployer.deploy(Replies);
  deployer.deploy(FollowProfiles);
};
