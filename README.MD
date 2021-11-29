# SmallFry Contract
SmallFRy is a fully on-chain social feed/follow/react/reply protocol.

## Getting Started
- [Install truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation)
- [Install ganache](https://www.trufflesuite.com/docs/ganache/quickstart)
- Testing the code: `truffle compile` -> `truffle migrate` -> `truffle test`

## About the Codebase
- All operations are O(1).
- All gas costs of operations can be seen by running `truffle test`, curently nothing goes over 1000 kwei.
- This protocol uses ETH, no native token besides ETH is involved.
- This protocl is not yet deployd to any L1 or L2, or testnet.
- This code is not production-ready.

## TODOs
- Implement VRF/incremental post ids rather than exploitable on-chain random numbers.
- Write frontend to connect to smart contract.





