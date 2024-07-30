---
reviewers:
- jpbetz
title: Coordinated Leader Election
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}} includes an alpha feature that allows
components to deterministically select a leader via Coordinated Leader Election.
This is useful to satisfy Kubernetes version skew constraints during cluster upgrades.
Currently, the only builtin selection strategy is `OldestEmulationVersion`,
preferring the leader with the lowest emulation version, followed by binary
version, followed by creation timestamp.

## Enabling Coordinated Leader Election

Ensure that `CoordinatedLeaderElection` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
when you start the {{< glossary_tooltip text="API Server"
term_id="kube-apiserver" >}}: and that the `coordination.k8s.io/v1alpha1` API is
enabled.

This can be done by setting flags `--feature-gates="CoordinatedLeaderElection=true"` and
`--runtime-config="coordination.k8s.io/v1alpha1=true"`.

## Component Configuration

With Coordinated Leader Election, components need to both run a LeaseCandidate
and Lease goroutine (both found in client-go/pkg/leaderelection). Two components
(kube-controller-manager and kube-scheduler) will automatically use coordinated
leader election if enabled. Please refer to the example found in
[k8s.io/kubernetes/cmd/kube-scheduler/app/server.go](https://github.com/kubernetes/kubernetes/blob/master/cmd/kube-scheduler/app/server.go) on set up.

The created LeaseCandidate object looks similar to below:

```
apiVersion: coordination.k8s.io/v1alpha1
kind: LeaseCandidate
metadata:
  name: hostname_uuid
  namespace: kube-system
spec:
  binaryVersion: 1.31.0
  emulationVersion: 1.31.0
  leaseName: kube-scheduler
  preferredStrategies:
  - OldestEmulationVersion
  renewTime: "2024-07-30T03:45:18.325483Z"
```

Please refer to the [documentation](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.31/#leasecandidate-v1alpha1-coordination-k8s-io) for LeaseCandidate for the full API details.