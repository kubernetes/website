---
title: Constrained Impersonation
content_type: reference
weight: 50
---

<!-- overview -->

{{< feature-state feature_gate_name="ConstrainedImpersonation" >}}

Constrained impersonation provides additional access control over the existing
[impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation) mechanism.
With constrained impersonation, an impersonator can be limited to impersonate another user only for
specific actions on specific resources, rather than being able to perform all actions that the
impersonated user can perform.

This feature is enabled by setting the `ConstrainedImpersonation`
[feature gate](/docs/reference/command-line-tools-reference/feature-gates/#ConstrainedImpersonation).

<!-- body -->

## Understanding constrained impersonation

Traditional [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
in Kubernetes is an all-or-nothing mechanism. Once granted permission to impersonate a user, you can
perform any action that user can perform across all resources and namespaces. Constrained
impersonation requires **two separate permissions** instead:

1. **Permission to impersonate a specific identity** (user, group, UID, service account or node)
2. **Permission to perform specific actions when impersonating** (for example, only `list` and `watch` pods)

This means an impersonator can be limited to impersonate another user only for specific operations.

### Impersonation modes

Constrained impersonation defines three distinct modes, each with its own set of verbs:

#### user-info mode

Use this mode to impersonate generic users (not service accounts or nodes). This mode applies when
the `Impersonate-User` header value:
- Does **not** start with `system:serviceaccount:`
- Does **not** start with `system:node:`

**Verbs:**
- `impersonate:user-info` - Permission to impersonate a specific user, group, UID, or extra field
- `impersonate-on:user-info:<action>` - Permission to perform `<action>` when impersonating a generic user

#### serviceaccount mode

Use this mode to impersonate service accounts. This mode applies when the `Impersonate-User`
header value starts with `system:serviceaccount:`.

**Verbs:**
- `impersonate:serviceaccount` - Permission to impersonate a specific service account
- `impersonate-on:serviceaccount:<action>` - Permission to perform `<action>` when impersonating a service account

#### arbitrary-node and associated-node modes

Use these modes to impersonate nodes. This mode applies when the `Impersonate-User` header value
starts with `system:node:`.

**Verbs:**
- `impersonate:arbitrary-node` - Permission to impersonate any specified node
- `impersonate:associated-node` - Permission to impersonate only the node where the impersonator is running
- `impersonate-on:arbitrary-node:<action>` - Permission to perform `<action>` when impersonating any node
- `impersonate-on:associated-node:<action>` - Permission to perform `<action>` when impersonating the associated node

{{< note >}}
The `impersonate:associated-node` verb only applies when the impersonator is running on the same
node it's trying to impersonate. This is determined by checking if the impersonator's user info
contains an extra field with key `authentication.kubernetes.io/node-name` that matches the node
being impersonated.
{{< /note >}}

## Configuring constrained impersonation with RBAC

All constrained impersonation permissions use the `authentication.k8s.io` API group. Here's how to
configure the different modes.

### Example: Impersonate a user for specific actions

This example shows how to allow a service account to impersonate a user named `jane.doe@example.com`,
but only to `list` and `watch` pods in the `default` namespace.

**Step 1: Grant permission to impersonate the user identity**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-jane-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["users"]
  resourceNames: ["jane.doe@example.com"]
  verbs: ["impersonate:user-info"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-jane-identity
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-jane-identity
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

**Step 2: Grant permission to perform specific actions when impersonating**

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-list-watch-pods
  namespace: default
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:user-info:list"
  - "impersonate-on:user-info:watch"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-list-watch-pods
  namespace: default
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-list-watch-pods
subjects:
- kind: ServiceAccount
  name: my-controller
  namespace: default
```

Now the `my-controller` service account can impersonate `jane.doe@example.com` to list and watch
pods in the `default` namespace, but **cannot** perform other actions like deleting pods or
accessing resources in other namespaces.

### Example: Impersonate a service account

To allow impersonating a service account named `app-sa` in the `production` namespace to create
and update deployments:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-app-sa
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["serviceaccounts"]
  resourceNames: ["app-sa"]
  # For service accounts, you must specify the namespace in the RoleBinding
  verbs: ["impersonate:serviceaccount"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: impersonate-manage-deployments
  namespace: production
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs:
  - "impersonate-on:serviceaccount:create"
  - "impersonate-on:serviceaccount:update"
  - "impersonate-on:serviceaccount:patch"
---
# You need both a ClusterRoleBinding for the identity permission
# and a RoleBinding for the action permission
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: impersonate-app-sa
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-app-sa
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: impersonate-manage-deployments
  namespace: production
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: Role
  name: impersonate-manage-deployments
subjects:
- kind: ServiceAccount
  name: deputy-controller
  namespace: default
```

### Example: Node agent impersonating the associated node

This is a common pattern for node agents (like CNI plugins) that need to read pods on their node
without having cluster-wide pod access.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-associated-node-identity
rules:
- apiGroups: ["authentication.k8s.io"]
  resources: ["nodes"]
  verbs: ["impersonate:associated-node"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: impersonate-list-pods-on-node
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs:
  - "impersonate-on:associated-node:list"
  - "impersonate-on:associated-node:get"
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-node
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-associated-node-identity
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: node-agent-impersonate-list-pods
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: impersonate-list-pods-on-node
subjects:
- kind: ServiceAccount
  name: node-agent
  namespace: kube-system
```

The controller would get the node name using the downward API:

```yaml
env:
- name: MY_NODE_NAME
  valueFrom:
    fieldRef:
      fieldPath: spec.nodeName
```

Then configure the kubeconfig to impersonate:

```go
kubeConfig, _ := clientcmd.BuildConfigFromFlags("", "")
kubeConfig.Impersonate = rest.ImpersonationConfig{
    UserName: "system:node:" + os.Getenv("MY_NODE_NAME"),
}
```

## Using constrained impersonation

From a client perspective, using constrained impersonation is identical to using traditional
impersonation. You use the same impersonation headers:

```http
Impersonate-User: jane.doe@example.com
```

Or with kubectl:

```bash
kubectl get pods -n default --as=jane.doe@example.com
```

The difference is entirely in the authorization checks performed by the API server.

## Backward compatibility

Constrained impersonation is fully backward compatible with existing impersonation:

- If you have existing RBAC rules using the legacy `impersonate` verb, they continue
  to function when the feature gate is enabled.

- When an impersonation request is made, the API server first checks for
  constrained impersonation permissions. If those checks fail, it falls back to checking the
  legacy `impersonate` permission.

- You can gradually migrate to constrained impersonation by adding the new
   rules while keeping the old ones, then removing the old rules once you're confident.

## Auditing

Constrained impersonation adds additional audit information to help track how impersonation is used.

When a request uses constrained impersonation, the audit event includes a new `authenticationMetadata`
object with an `impersonationConstraint` field that indicates which constrained impersonation verb
was used to authorize the request.

Example audit event:

```json
{
  "kind": "Event",
  "apiVersion": "audit.k8s.io/v1",
  "user": {
    "username": "system:serviceaccount:default:my-controller"
  },
  "impersonatedUser": {
    "username": "jane.doe@example.com"
  },
  "authenticationMetadata": {
    "impersonationConstraint": "impersonate:user-info"
  },
  "verb": "list",
  "objectRef": {
    "resource": "pods",
    "namespace": "default"
  }
}
```

The `impersonationConstraint` value indicates which mode was used (for example, `impersonate:user-info`,
`impersonate:associated-node`). The specific action (for example, `list`) can be determined from the
`verb` field in the audit event.

{{< note >}}
When legacy impersonation is used (not constrained impersonation), the `authenticationMetadata`
object is omitted entirely, keeping audit events unchanged for existing workflows.
{{< /note >}}

## Migration strategy

When migrating from legacy impersonation to constrained impersonation:

1. Add the new constrained impersonation rules alongside existing legacy rules
2. Monitor audit logs to verify the constrained rules are working as expected
3. Remove the legacy `impersonate` permissions once you're confident
4. Review and tighten the constrained permissions as needed

## {{% heading "whatsnext" %}}

- Learn about [user impersonation](/docs/reference/access-authn-authz/authentication/#user-impersonation)
- Read about [RBAC authorization](/docs/reference/access-authn-authz/rbac/)
- Understand [Kubernetes authentication](/docs/reference/access-authn-authz/authentication/)
