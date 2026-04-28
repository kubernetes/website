---
title: ControllerManagerReleaseLeaderElectionLockOnExit
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.36"
---

<!--
Enables the `kube-controller-manager` to actively release its leader election lock
during leader transitions, rather than waiting for the lock's TTL to expire.
This allows a new leader to be elected more quickly.
-->
启用 `kube-controller-manager` 在领导者转换期间主动释放其领导者选举锁，
而不是等待锁的 TTL 过期。
这允许更快地选举新的领导者。
