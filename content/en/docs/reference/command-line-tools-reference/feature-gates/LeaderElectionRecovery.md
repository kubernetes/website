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
Allows the `kube-controller-manager` to keep running after it fails to renew its
leader election Lease, instead of exiting. Its controllers cannot write to the
API server until a later renewal succeeds. The `--leader-elect-recovery-deadline`
flag limits how long it keeps trying to renew before exiting.

For more details, see [leader election recovery](/docs/concepts/architecture/leases/#leader-election-recovery).
