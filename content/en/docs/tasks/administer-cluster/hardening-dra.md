---
title: Harden Dynamic Resource Allocation in Your Cluster
content_type: task
weight: 330
---

<!-- overview -->

This page shows cluster administrators how to harden authorization for
Dynamic Resource Allocation (DRA), with a focus on least-privilege access for
`ResourceClaim` status updates.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

- {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}
- Dynamic Resource Allocation is configured in your cluster.
- You can edit RBAC resources and restart or roll out DRA components.

<!-- steps -->

## Identify DRA components that write status

Document which identities (usually ServiceAccounts) update ResourceClaim
status in your cluster. Typical writers are:

- kube-scheduler or a custom allocation controller
- node-local DRA drivers
- multi-node DRA status controllers

## Grant least-privilege permissions for synthetic subresources

Starting in Kubernetes v1.36, DRA status updates require synthetic subresource
permissions in addition to `resourceclaims/status`.

### Grant scheduler and allocation-controller permissions

Apply a role that allows binding-related updates:

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

### Grant node-local driver permissions

Use node-aware verbs for node-local drivers:

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

### Grant multi-node controller permissions only when needed

Use `arbitrary-node:*` only for components that must update from any node:

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

## Bind roles to explicit identities

Create `ClusterRoleBinding` objects for each component identity, and avoid
sharing a broad role across unrelated DRA components.

Restrict `resourceclaims/driver` rules with `resourceNames` where possible so
an identity can only write status for the specific DRA driver it operates.

## Validate and monitor

1. Verify each identity has only the required verbs and subresources.
1. Confirm DRA status updates work after rollout.
1. Watch API server audit events for denied `resourceclaims/binding` and
   `resourceclaims/driver` requests.

## {{% heading "whatsnext" %}}

- [Hardening Guide - Dynamic Resource Allocation](/docs/concepts/security/hardening-guide/dynamic-resource-allocation/)
- [Securing a Cluster](/docs/tasks/administer-cluster/securing-a-cluster/)
- [Authorization](/docs/reference/access-authn-authz/authorization/)
