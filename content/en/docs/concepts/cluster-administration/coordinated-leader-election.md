---
reviewers:
- jpbetz
title: Coordinated Leader Election
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}} includes an alpha feature that allows {{<
glossary_tooltip text="control plane" term_id="control-plane" >}} components to
deterministically select a leader via _coordinated leader election_.
This is useful to satisfy Kubernetes version skew constraints during cluster upgrades.
Currently, the only builtin selection strategy is `OldestEmulationVersion`,
preferring the leader with the lowest emulation version, followed by binary
version, followed by creation timestamp.

## Enabling coordinated leader election

Ensure that `CoordinatedLeaderElection` [feature
gate](/docs/reference/command-line-tools-reference/feature-gates/) is enabled
when you start the {{< glossary_tooltip text="API Server"
term_id="kube-apiserver" >}}: and that the `coordination.k8s.io/v1alpha1` API group is
enabled.

This can be done by setting flags `--feature-gates="CoordinatedLeaderElection=true"` and
`--runtime-config="coordination.k8s.io/v1alpha1=true"`.

## Component configuration
Provided that you have enabled the `CoordinatedLeaderElection` feature gate _and_  
have the `coordination.k8s.io/v1alpha1` API group enabled, compatible control plane  
components automatically use the LeaseCandidate and Lease APIs to elect a leader  
as needed.  

For Kubernetes {{< skew currentVersion >}}, two control plane components  
(kube-controller-manager and kube-scheduler) automatically use coordinated  
leader election when the feature gate and API group are enabled.  