---
title: LeaderElectionRecovery
content_type: feature_gate
_build:
  list: never
  render: false

stages:
  - stage: alpha
    defaultValue: false
    fromVersion: "1.38"
---
Allows a controller manager to keep running after it fails to renew its leader
election Lease, instead of exiting. Write requests from its controllers are
blocked until a later renewal succeeds. When enabled, the `kube-controller-manager`
and `cloud-controller-manager` use this recovery mode. The
`--leader-elect-recovery-deadline` flag limits how long they keep trying to
renew before exiting.
