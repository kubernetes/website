---
title: "Hardening Guide - Dynamic Resource Allocation"
description: >
  Information about hardening Dynamic Resource Allocation (DRA) authorization and access patterns.
content_type: concept
weight: 90
---

<!-- overview -->

Dynamic Resource Allocation (DRA) adds powerful scheduling and device management
capabilities. Because DRA components update `ResourceClaim` status, cluster
administrators should configure authorization for those updates with explicit,
least-privilege RBAC.

{{< feature-state feature_gate_name="DRAResourceClaimGranularStatusAuthorization" >}}

Starting in Kubernetes v1.36, DRA status updates use synthetic subresources and,
in some cases, specialized node-aware verbs.

<!-- body -->

## Harden DRA status update permissions

For DRA status updates,In addition to granting `update` permissions on the
`resourceclaims/status` subresource, cluster administrators must grant permissions on
specific "synthetic" subresources based on the exact fields a component needs to modify.
This enforces the principle of least privilege between the scheduler, custom controllers,
and DRA drivers.

The DRA authorization checks are divided into two synthetic subresources:

- **`resourceclaims/binding`**
  - Required to modify `status.allocation` and `status.reservedFor`.
  - Typically granted to the kube-scheduler and custom allocation controllers.
  - Uses standard `update` and `patch` verbs.
- **`resourceclaims/driver`**
  - Required to modify `status.devices`.
  - This check is performed per-driver to drivers from tampering with devices on different
  nodes and/or from other drivers.
  - Uses node-aware verbs for stricter scope.

## Node-aware DRA verbs

When authorizing updates to `resourceclaims/driver`, use the appropriate
specialized verb prefix:

- **`associated-node:<verb>`** (for example, `associated-node:update`)
  - For node-local drivers.
  - The API server verifies node association for the requesting driver.
- **`arbitrary-node:<verb>`** (for example, `arbitrary-node:patch`)
  - For control-plane or multi-node controllers that may update claims from
    any node.

## Example RBAC patterns

### Scheduler and allocation controller permissions

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-binding-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/binding"]
    verbs: ["patch", "update"]
```

### Node-local DRA driver permissions

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-node-driver-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["associated-node:patch", "associated-node:update"]
    resourceNames: ["dra.example.com"]
```

### Multi-node status controller permissions

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: dra-multinode-status-updater
rules:
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/status"]
    verbs: ["get", "patch", "update"]
  - apiGroups: ["resource.k8s.io"]
    resources: ["resourceclaims/driver"]
    verbs: ["arbitrary-node:patch", "arbitrary-node:update"]
    resourceNames: ["dra.example.com"]
```

## Related cluster administrator task

To apply these patterns in a running cluster, see
[Harden Dynamic Resource Allocation in Your Cluster](/docs/tasks/administer-cluster/hardening-dra/).

## {{% heading "whatsnext" %}}

- [Authorization](/docs/reference/access-authn-authz/authorization/)
- [Set Up DRA in a Cluster](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster/)
- [Dynamic Resource Allocation](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)
