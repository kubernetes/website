---
assignees:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
---

## RBAC Mode

When specified "RBAC" (Role-Based Access Control) uses the
"rbac.authorization.k8s.io" API group to drive authorization decisions,
allowing admins to dynamically configure permission policies through the
Kubernetes API.

As of 1.3 RBAC mode is in alpha and considered experimental.

To use RBAC, you must both enable the authorization module with `--authorization-mode=RBAC`,
and [enable the API version](
/docs/admin/cluster-management/#turn-on-or-off-an-api-version-for-your-cluster),
with a `--runtime-config=` that includes `rbac.authorization.k8s.io/v1alpha1`.

### Privilege Escalation Prevention and Bootstrapping

The `rbac.authorization.k8s.io` API group inherently attempts to prevent users
from escalating privileges. Simply put, __a user can't grant permissions they
don't already have even when the RBAC authorizer it disabled__. If "user-1"
does not have the ability to read secrets in "namespace-a", they cannot create
a binding that would grant that permission to themselves or any other user.

When bootstrapping, superuser credentials should include the `system:masters`
group, for example by creating a client cert with `/O=system:masters`. This
gives those credentials full access to the API and allows an admin to then set
up bindings for other users.

In Kubernetes versions 1.4 and 1.5, there was a similar flag that gave a user
full access:

```
--authorization-rbac-super-user=admin
```

__This flag will be removed in 1.6__. Admins should prefer the `system:masters`
group when setting up clusters.

### Roles, RolesBindings, ClusterRoles, and ClusterRoleBindings

The RBAC API Group declares four top level types which will be covered in this
section. Users can interact with these resources as they would with any other
API resource. Through `kubectl`, direct calls to the API, etc. For instance,
`kubectl create -f (resource).yml` can be used with any of these examples,
though readers who wish to follow along should review the following section on
bootstrapping first.

In the RBAC API Group, roles hold a logical grouping of permissions. These
permissions map very closely to ABAC policies, but only contain information
about requests being made. Permission are purely additive, rules may only omit
permissions they do not wish to grant.

Here's an example of a role which grants read access to pods within the
"default" namespace.

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  namespace: default
  name: pod-reader
rules:
  - apiGroups: [""] # The API group "" indicates the core API Group.
    resources: ["pods"]
    verbs: ["get", "watch", "list"]
```

`ClusterRoles` hold the same information as a `Role` but can apply to any
namespace as well as non-namespaced resources (such as `Nodes`,
`PersistentVolume`, etc.). The following `ClusterRole` can grant permissions to
read secrets in any namespace.

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced.
  name: secret-reader
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "watch", "list"]
    nonResourceURLs: []
```

`RoleBindings` perform the task of granting the permission to a user or set of
users. They hold a list of subjects which they apply to, and a reference to the
`Role` being assigned.

The following `RoleBinding` assigns the "pod-reader" role to the user "jane"
within the "default" namespace, and allows jane to read pods.

```yaml
# This role binding allows "jane" to read pods in the namespace "default"
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-pods
  namespace: default
subjects:
  - kind: User # May be "User", "Group" or "ServiceAccount"
    name: jane
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

`RoleBindings` may also refer to a `ClusterRole`. However, a `RoleBinding` that
refers to a `ClusterRole` only applies in the `RoleBinding`'s namespace, not at
the cluster level. This allows admins to define a set of common roles for the
entire cluster, then reuse them in multiple namespaces.

For instance, even though the following `RoleBinding` refers to a `ClusterRole`,
"dave" (the subject) will only be able read secrets in the "development"
namespace, the namespace of the `RoleBinding`.

```yaml
# This role binding allows "dave" to read secrets in the namespace "development"
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-secrets
  namespace: development # This binding only applies in the "development" namespace
subjects:
  - kind: User # May be "User", "Group" or "ServiceAccount"
    name: dave
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

Finally a `ClusterRoleBinding` may be used to grant permissions in all
namespaces. The following `ClusterRoleBinding` allows any user in the group
"manager" to read secrets in any namespace.

```yaml
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  name: read-secrets-global
subjects:
  - kind: Group # May be "User", "Group" or "ServiceAccount"
    name: manager
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

### Referring to Resources

Most resources are represented by a string representation of their name, such as "pods", just as it
appears in the URL for the relevant API endpoint. However, some Kubernetes APIs involve a
"subresource" such as the logs for a pod. The URL for the pods logs endpoint is:

```
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

In this case, "pods" is the namespaced resource, and "log" is a subresource of pods. To represent
this in an RBAC role, use a slash to delimit the resource and subresource names. To allow a subject
to read both pods and pod logs, you would write:

```yaml
kind: Role
apiVersion: rbac.authorization.k8s.io/v1alpha1
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list"]
```

### Referring to Subjects

RoleBindings and ClusterRoleBindings bind "subjects" to "roles".
Subjects can be groups, users or service accounts.

Users are represented by strings.  These can be plain usernames, like
"alice", or email style names, like "bob@example.com", or numeric ids
as string.  It is up to the Kubernetes admin to configure
the [authentication modules](/docs/admin/authentication/) to produce
usernames in the desired format.  The RBAC authorization system does
not require any particular format.  However, the prefix `system:` is
reserved for Kubernetes system use, and so the admin should ensure
usernames should not contain this prefix by accident.

Groups information in Kubernetes is currently provided by the Authenticator
modules.  (In the future we may add a separate way for the RBAC Authorizer
to query groups information for users.)  Groups, like users, are represented
by a string, and that string has no format requirements, other than that the
prefix `system:` is reserved.

Service Accounts have usernames with the `system:` prefix and belong
to groups with the `system:` prefix.

#### Role Binding Examples

Only the `subjects` section of a RoleBinding object shown in the following examples.

For a user called `alice@example.com`, specify

```yaml
subjects:
  - kind: User
    name: "alice@example.com"
```

For a group called `frontend-admins`, specify:

```yaml
subjects:
  - kind: Group
    name: "frontend-admins"
```

For the default service account in the kube-system namespace:

```yaml
subjects:
 - kind: ServiceAccount
   name: default
   namespace: kube-system
```

For all service accounts in the `qa` namespace:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
```

For all service accounts everywhere:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
```

For all authenticated users:

```yaml
subjects:
- kind: Group
  name: system:authenticated
```

For all unauthenticated users:

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
```

For all users:

```yaml
subjects:
- kind: Group
  name: system:authenticated
- kind: Group
  name: system:unauthenticated
```

### `system:*` prefixed RBAC resources

If an RBAC resource (`ClusterRole`, `ClusterRoleBinding`, etc) is prefixed with `system:*`, that indicates that
the resource is "owned" by the infrastructure.  Modifications to these resources can result in non-functional clusters.

One example is the `clusterrole/system:nodes`.  This role is used to provide limited permissions to kubelets.  If the
role is modified, its possible to prevent your kubelet from working.

### Default ClusterRoles and ClusterRoleBindings

When starting up an API server without any ClusterRoles or ClusterRoleBindings, the API server will bootstrap itself
with a set of default ClusterRoles and ClusterRoleBindings.  Most of these are `system:*` prefixed, but some are not.
They are all labeled with `kubernetes.io/bootstrapping=rbac-defaults`.  These are the most commonly used:

|Default Role |Description

|*admin* |A project manager. If used in a `RoleBinding`, an *admin* user will have
rights to view any Kubernetes resource in the project and modify any resource in the
project except for quota.

|*cluster-admin* |A super-user role that can perform any action in any project. When
granted to a user within a local policy, they have full control over quota and
roles and every action on every resource in the project.

|*cluster-status* |A role that can get basic cluster status information.

|*edit* |A role that can modify most objects in a project, but does not have the
power to view or modify roles or bindings.

|*view* |A role who cannot make any modifications, but can see most objects in a
project. They cannot view or modify roles or bindings. They cannot view secrets,
since those are escalating.

|*system:auth-delegator*|A role which allows delegated authentication and authorization
checks.  This is commonly used by add-on API servers for a unified authentication and
authorization experience.

|*system:basic-user* |A role that can get basic information about himself.

|*system:discovery*|A role which provides just enough power to access discovery and 
negotiate an API level. 

### CLI helpers

In order to ease the binding of `ClusterRoles`, two CLI helpers were created.  `kubectl create rolebinding` and
`kubectl create clusterrolebinding`.  See the CLI help for detailed usage, but they allow for usage like
`kubectl create clusterrolebinding cluster-admins --clusterrole=cluster-admin --user=root` and 
`kubectl create rolebinding -n my-namespace viewers --clusterrole=view --user=collaborator --serviceaccount=other-ns:default`.
