---
assignees:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
---

Role-Based Access Control ("RBAC") uses the "rbac.authorization.k8s.io" API group 
to drive authorization decisions, allowing admins to dynamically configure policies
through the Kubernetes API.

As of 1.6 RBAC mode is in beta.

To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.

## Roles, RolesBindings, ClusterRoles, and ClusterRoleBindings

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
apiVersion: rbac.authorization.k8s.io/v1beta1
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
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced.
  name: secret-reader
rules:
  - apiGroups: [""]
    resources: ["secrets"]
    verbs: ["get", "watch", "list"]
```

`RoleBindings` perform the task of granting the permission to a user or set of
users. They hold a list of subjects which they apply to, and a reference to the
`Role` being assigned.

The following `RoleBinding` assigns the "pod-reader" role to the user "jane"
within the "default" namespace, and allows jane to read pods.

```yaml
# This role binding allows "jane" to read pods in the namespace "default"
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1beta1
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
apiVersion: rbac.authorization.k8s.io/v1beta1
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
apiVersion: rbac.authorization.k8s.io/v1beta1
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

## Referring to Resources

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
apiVersion: rbac.authorization.k8s.io/v1beta1
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
  - apiGroups: [""]
    resources: ["pods", "pods/log"]
    verbs: ["get", "list"]
```

## Referring to Subjects

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

Group information in Kubernetes is currently provided by the Authenticator
modules.  (In the future we may add a separate way for the RBAC Authorizer
to query groups information for users.)  Groups, like users, are represented
by a string, and that string has no format requirements, other than that the
prefix `system:` is reserved.

Service Accounts have usernames with the `system:` prefix and belong
to groups with the `system:` prefix.

### Role Binding Examples

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

## `system:*` prefixed RBAC resources

If an RBAC resource (`ClusterRole`, `ClusterRoleBinding`, etc) is prefixed with `system:*`, that indicates that
the resource is "owned" by the infrastructure.  Modifications to these resources can result in non-functional clusters.

One example is the `clusterrole/system:nodes`.  This role is used to provide limited permissions to kubelets.  If the
role is modified, it's possible to prevent your kubelet from working.

## Default ClusterRoles and ClusterRoleBindings

When starting an API server without any ClusterRoles or ClusterRoleBindings, the API server will bootstrap itself
with a set of default ClusterRoles and ClusterRoleBindings.  Most of these are `system:*` prefixed, but some are not.
They are all labeled with `kubernetes.io/bootstrapping=rbac-defaults`.  These are the most commonly used:

<table>
<colgroup><col width="25%"><col width="25%"><col>
<tr>
<th>Default ClusterRole
<th>Default ClusterRoleBinding
<th>Description

<tr>
<td>*cluster-admin*
<td>`system:masters` group
<td>A super-user role that allows performing any action on any resource.
When used in a `ClusterRoleBinding`, it gives full control over every resource in the cluster and in all namespaces.
When used in a `RoleBinding`, if gives full control over every resource in the rolebinding's namespace.

<tr>
<td>*cluster-status*
<td>None
<td>A role that allows read-only access to basic cluster status information.

<tr>
<td>*admin*
<td>None
<td>A role for a namespace manager, intended to be granted within a namespace using a `RoleBinding`.
If used in a `RoleBinding`, allows read/write access to most resources in a namespace,
including the ability to create roles and rolebindings within the namespace.
It does not allow write access to resource quota.

<tr>
<td>*edit*
<td>None
<td>A role that allows read/write access to most objects in a namespace.
It does not allow viewing or modifying roles or rolebindings.

<tr>
<td>*view*
<td>None
<td>A role that allows read-only access to see most objects in a namespace.
It does not allow viewing roles or rolebindings.
It does not allow viewing secrets, since those are escalating.

<tr>
<td>*system:basic-user*
<td>`system:authenticated` and `system:unauthenticated` groups
<td>A role that allows a user read-only access to basic information about themselves.

<tr>
<td>*system:discovery*
<td>`system:authenticated` and `system:unauthenticated` groups
<td>A role that allows read-only access to API discovery endpoints needed to discover
and negotiate an API level.

<tr>
<td>*system:auth-delegator*
<td>None
<td>A role which allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.

</table>

## Privilege Escalation Prevention and Bootstrapping

The `rbac.authorization.k8s.io` API inherently prevents users
from escalating privileges by editing roles or role bindings.
Simply put, __a user can't grant permissions they
don't already have even when the RBAC authorizer it disabled__. If "user-1"
does not have the ability to read secrets in "namespace-a", they cannot create
a binding that would grant that permission to themselves or any other user.

For bootstrapping the first roles, it becomes necessary for someone to get around these limitations.
To bootstrap initial roles and role bindings:

* Use a credential with the `system:masters` group, which is bound to the `cluster-admin` superuser role by the default bootstrap bindings.
* If your API server serves with the insecure port enabled (--insecure-port), you can also make API calls via that port, which does not enforce authentication or authorization.

To allow a user to create/modify roles:

1. Grant them a role that allows them to create/update `Role` or `ClusterRole` resources, as desired.
2. Grant them a role that includes all the permissions you would want them to be able to include in a `Role` or `ClusterRole`. If they attempt to create or modify a `Role` or `ClusterRole` to include permissions they themselves have not been granted, they will be rejected.

To allow a user to create/modify role bindings:

1. Grant them a role that allows them to create/update `RoleBinding` or `ClusterRoleBinding` resources, as desired.
2. Grant them permissions needed to bind particular roles:
    * implicitly, by giving them the permissions contained in the roles
    * explicitly, by giving them permission to perform the "bind" verb on the particular roles or clusterroles desired.

## CLI helpers

In order to ease the binding of `ClusterRoles`, two CLI helpers exist:

### `kubectl create rolebinding`

Grants a role or clusterrole within a specific namespace. Examples:

* Grant the `admin` `ClusterRole` to a user named `bob` in the namespace `acme`:

    `kubectl create rolebinding my-role-binding --clusterrole=admin --user=bob --namespace=acme`

* Grant the `view` `ClusterRole` to a service account named `myapp` in the namespace `acme`:

    `kubectl create rolebinding my-role-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme`

### `kubectl create clusterrolebinding`

Grants a `ClusterRole` across the entire cluster, including all namespaces. Examples:

* Grant the `cluster-admin` `ClusterRole` to a user named `root`:

    `kubectl create clusterrolebinding my-root-binding --clusterrole=cluster-admin --user=root`

* Grant the `system:node` `ClusterRole` to a user named `kubelet`:

    `kubectl create clusterrolebinding my-kubelet-binding --clusterrole=system:node --user=kubelet`

See the CLI help for detailed usage

## Upgrading from 1.5

Prior to Kubernetes 1.6, many deployments used very permissive ABAC policies,
including granting full API access to all service accounts.

The default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, and grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond those given to unauthenticated users).

This allows the cluster administrator to grant particular roles to particular service accounts as needed.

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:

### Parallel authorizers

Run both the RBAC and ABAC authorizers, and include the legacy ABAC policy:

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.jsonl
```

The RBAC authorizer will attempt to authorize requests first. If it denies an API request,
the ABAC authorizer is then run. This means that any request allowed by *either* the RBAC
or ABAC policies is allowed.

When run with a log level of 2 or higher (`--v=2`), you can see RBAC denials in the apiserver log.
You can use that information to determine which roles need to be granted to which users or service accounts.
Once normal workloads are running with no RBAC denial messages in the server logs, the ABAC authorizer can be removed.

### Permissive RBAC permissions

You can replicate a permissive policy using RBAC role bindings.

**WARNING: The following policy allows ALL service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.**

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
