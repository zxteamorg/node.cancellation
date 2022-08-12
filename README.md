# DEPRECATED

The project has been moved to https://github.com/freemework/common/tree/src-typescript

# ZXTeam's Cancellation Sources
[![npm version badge](https://img.shields.io/npm/v/@zxteam/cancellation.svg)](https://www.npmjs.com/package/@zxteam/cancellation)
[![downloads badge](https://img.shields.io/npm/dm/@zxteam/cancellation.svg)](https://www.npmjs.org/package/@zxteam/cancellation)
[![commit activity badge](https://img.shields.io/github/commit-activity/m/zxteamorg/node.cancellation)](https://github.com/zxteamorg/node.cancellation/pulse)
[![last commit badge](https://img.shields.io/github/last-commit/zxteamorg/node.cancellation)](https://github.com/zxteamorg/node.cancellation/graphs/commit-activity)
[![twitter badge](https://img.shields.io/twitter/follow/zxteamorg?style=social&logo=twitter)](https://twitter.com/zxteamorg)

## Interfaces
### CancellationTokenSource

## Classes
### AggregatedCancellationToken
Allows to watch several `CancellationToken` as single token.
```mermaid
graph LR
  CancellationToken1(CancellationToken 1)
  CancellationToken2(CancellationToken 2)
  CancellationTokenN(CancellationToken N)
  CancellationToken1 --> AggregatedCancellationToken
  CancellationToken2 --> AggregatedCancellationToken
  CancellationTokenN --> AggregatedCancellationToken
  AggregatedCancellationToken --> Action
```
The Action will be cancelled if any of CancellationToken fire to active state.
### SimpleCancellationTokenSource
### TimeoutCancellationTokenSource

## Functions
### sleep
```typescript
await sleep(DUMMY_CANCELLATION_TOKEN, 25); // Suspend execution for 25 milliseconds
```
```typescript
const cancellationTokenSource = new ManualCancellationTokenSource();
...
await sleep(cancellationTokenSource.token, 25); // Suspend execution for 25 milliseconds or cancel if cancellationTokenSource activates
```
```typescript
const cancellationTokenSource = new ManualCancellationTokenSource();
...
await sleep(cancellationTokenSource.token); // Suspend infinitely while cancellationTokenSource activates
```
