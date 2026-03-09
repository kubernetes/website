---
reviewers:
- jpbetz
title: Coordinated Leader Election
content_type: concept
weight: 200
---

<!-- overview -->

{{< feature-state feature_gate_name="CoordinatedLeaderElection" >}}

Kubernetes {{< skew currentVersion >}} includes a beta feature that allows {{<
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
term_id="kube-apiserver" >}}: and that the `coordination.k8s.io/v1beta1` API group is
enabled.

This can be done by setting flags `--feature-gates="CoordinatedLeaderElection=true"` and
`--runtime-config="coordination.k8s.io/v1beta1=true"`.

## Component configuration

Provided that you have enabled the `CoordinatedLeaderElection` feature gate _and_  
have the `coordination.k8s.io/v1beta1` API group enabled, compatible control plane  
components automatically use the LeaseCandidate and Lease APIs to elect a leader  
as needed.  

For Kubernetes {{< skew currentVersion >}}, two control plane components  
(kube-controller-manager and kube-scheduler) automatically use coordinated  
leader election when the feature gate and API group are enabled.

## Leader selection for Kubernetes components

Kubernetes uses the [Lease API](/docs/concepts/architecture/leases/) to perform leader election among multiple instances of the same control-plane component in a high-availability cluster, such as `kube-controller-manager` or `kube-scheduler`.

A [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) object in the `coordination.k8s.io/v1` API group acts as a lightweight distributed lock stored in the [Kubernetes API server](/docs/reference/command-line-tools-reference/kube-apiserver/). All running instances of a component watch or periodically read the same Lease object to determine which instance is currently acting as the leader.

The [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) contains important fields such as:

- `holderIdentity`: the identity (e.g., pod name or hostname-based string) of the current leader.
- `acquireTime`: timestamp when leadership was acquired.
- `renewTime`: timestamp of the most recent renewal by the leader.
- `leaseDurationSeconds`: the validity period of the lease (candidates must wait this long + a small grace period before attempting to acquire an expired lease).
- `leaseTransitions`: counter of how many times leadership has changed hands.

These fields indicate which instance holds leadership and how long that leadership remains valid.

When the Lease does not exist or has expired (current time > `renewTime` + `leaseDurationSeconds`), candidate instances attempt to update the Lease with their identity. Kubernetes relies on **optimistic concurrency control** via the object's `resourceVersion`: only one update succeeds due to version mismatch on concurrent attempts. The instance whose update is accepted becomes the **leader**.

Once elected, the leader periodically renews the [Lease](/docs/reference/kubernetes-api/cluster-resources/lease-v1/) by updating the `renewTime` field (typically every `leaseDurationSeconds` to avoid conflicts when the lease is about to expire). As long as renewals occur before the lease expires, the instance retains leadership. If the leader crashes, becomes unreachable, or stops renewing the Lease, it expires. Other instances detect the expired Lease and attempt a new election.

This mechanism ensures that even though multiple replicas of a component may be running for stability and recovery, **only one instance actively performs control tasks at a time**, while the others remain on standby, watching the Lease and ready to take over quickly if needed.