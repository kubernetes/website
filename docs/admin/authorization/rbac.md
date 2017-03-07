---
assignees:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
---

* TOC
{:toc}

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
though readers who wish to follow along should review the section on
bootstrapping first.

In the RBAC API Group, roles hold a logical grouping of permissions. These
permissions map very closely to ABAC policies, but only contain information
about requests being made. Permissions are purely additive, rules may only omit
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
usernames do not contain this prefix by accident.

Group information in Kubernetes is currently provided by the Authenticator
modules.  (In the future we may add a separate way for the RBAC Authorizer
to query group information for users.)  Groups, like users, are represented
by a string, and that string has no format requirements, other than that the
prefix `system:` is reserved.

Service Accounts have usernames with the `system:serviceaccount` prefix and belong
to groups with the `system:serviceaccounts` prefix.

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

For all authenticated users (1.5 and newer):

```yaml
subjects:
- kind: Group
  name: system:authenticated
```

For all unauthenticated users (1.5 and newer):

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
```

For all users (1.5 and newer):

```yaml
subjects:
- kind: Group
  name: system:authenticated
- kind: Group
  name: system:unauthenticated
```

## Default ClusterRoles and ClusterRoleBindings

API servers create a set of default ClusterRoles and ClusterRoleBindings.
Many of these are `system:` prefixed, which indicates that the resource is "owned" by the infrastructure.
Modifications to these resources can result in non-functional clusters. One example is the `system:node` ClusterRole.
This role defines permissions for kubelets. If the role is modified, it can prevent kubelets from working.

All of the default cluster roles and rolebindings are labeled with `kubernetes.io/bootstrapping=rbac-defaults`.

### Auto-reconciliation

At each start-up, the API server updates default cluster roles with any missing permissions,
and updates default cluster role bindings with any missing subjects.
This allows the cluster to repair accidental modifications,
and to keep roles and rolebindings up-to-date as permissions and subjects change in new releases.

To opt out of this reconciliation, set the `rbac.authorization.kubernetes.io/autoupdate` 
annotation on a default cluster role or rolebinding to `false`.
Be aware that missing default permissions and subjects can result in non-functional clusters.

Auto-reconciliation is enabled in Kubernetes version 1.6+.

### Discovery roles

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows a user read-only access to basic information about themselves.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows read-only access to API discovery endpoints needed to discover and negotiate an API level.</td>
</tr>
</table>

### User-facing roles

Some of the default roles are not `system:` prefixed. These are intended to be user-facing roles.
They include superuser roles (`cluster-admin`),
roles intended to be granted cluster-wide using ClusterRoleBindings (`cluster-status`),
and roles intended to be granted within particular namespaces using RoleBindings (`admin`, `edit`, `view`).

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>cluster-admin</b></td>
<td><b>system:masters</b> group</td>
<td>Allows super-user access to perform any action on any resource.
When used in a <b>ClusterRoleBinding</b>, it gives full control over every resource in the cluster and in all namespaces.
When used in a <b>RoleBinding</b>, it gives full control over every resource in the rolebinding's namespace, including the namespace itself.</td>
</tr>
<tr>
<td><b>cluster-status</b></td>
<td>None</td>
<td>Allows read-only access to basic cluster status information.</td>
</tr>
<tr>
<td><b>admin</b></td>
<td>None</td>
<td>Allows admin access, intended to be granted within a namespace using a <b>RoleBinding</b>.
If used in a <b>RoleBinding</b>, allows read/write access to most resources in a namespace,
including the ability to create roles and rolebindings within the namespace.
It does not allow write access to resource quota or to the namespace itself.</td>
</tr>
<tr>
<td><b>edit</b></td>
<td>None</td>
<td>Allows read/write access to most objects in a namespace.
It does not allow viewing or modifying roles or rolebindings.</td>
</tr>
<tr>
<td><b>view</b></td>
<td>None</td>
<td>Allows read-only access to see most objects in a namespace.
It does not allow viewing roles or rolebindings.
It does not allow viewing secrets, since those are escalating.</td>
</tr>
</table>

### Core component roles

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:kube-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the kube-controller-manager component.
The permissions required by individual control loops are contained in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td><b>system:nodes</b> group</td>
<td>Allows access to resources required by the kubelet component, <b>including read access to secrets, and write access to pods</b>.
In the future, read access to secrets and write access to pods will be restricted to objects scheduled to the node.
To maintain permissions in the future, Kubelets must identify themselves with the group <b>system:nodes</b> and a username in the form <b>system:node:&lt;node-name&gt;</b>.
See <a href="https://pr.k8s.io/40476">https://pr.k8s.io/40476</a> for details.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the kube-proxy component.</td>
</tr>
</table>

### Other component roles

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:auth-delegator</b></td>
<td>None</td>
<td>Allows delegated authentication and authorization checks.
This is commonly used by add-on API servers for unified authentication and authorization.</td>
</tr>
<tr>
<td><b>system:heapster</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/heapster">Heapster</a> component.</td>
</tr>
<tr>
<td><b>system:kube-aggregator</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/kube-aggregator">kube-aggregator</a> component.</td>
</tr>
<tr>
<td><b>system:kube-dns</b></td>
<td><b>kube-dns</b> service account in the <b>kube-system</b> namespace</td>
<td>Role for the <a href="/docs/admin/dns/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform <a href="/docs/admin/kubelet-tls-bootstrapping/">Kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/user-guide/persistent-volumes/#provisioner">dynamic volume provisioners</a>.</td>
</tr>
</table>

### Controller roles

The [Kubernetes controller manager](/docs/admin/kube-controller-manager/) runs core control loops.
When invoked with `--use-service-account-credentials`, each control loop is started using a separate service account.
Corresponding roles exist for each control loop, prefixed with `system:controller:`.
These roles include:

* system:controller:attachdetach-controller
* system:controller:certificate-controller
* system:controller:cronjob-controller
* system:controller:daemon-set-controller
* system:controller:deployment-controller
* system:controller:disruption-controller
* system:controller:endpoint-controller
* system:controller:generic-garbage-collector
* system:controller:horizontal-pod-autoscaler
* system:controller:job-controller
* system:controller:namespace-controller
* system:controller:node-controller
* system:controller:persistent-volume-binder
* system:controller:pod-garbage-collector
* system:controller:replicaset-controller
* system:controller:replication-controller
* system:controller:resourcequota-controller
* system:controller:route-controller
* system:controller:service-account-controller
* system:controller:service-controller
* system:controller:statefulset-controller
* system:controller:ttl-controller

## Privilege Escalation Prevention and Bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.

A user can only create/update a role if they already have all the permissions contained in the role,
at the same scope as the role (cluster-wide for `ClusterRole` objects, within the same namespace or cluster-wide for `Role` objects).
For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRole`
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update `Role` or `ClusterRole` objects, as desired.
2. Grant them roles containing the permissions you would want them to be able to set in a `Role` or `ClusterRole`. If they attempt to create or modify a `Role` or `ClusterRole` with permissions they themselves have not been granted, the API request will be forbidden.

A user can only create/update a role binding if they already have all the permissions contained in the referenced role 
(at the same scope as the role binding) *or* if they've been given explicit permission to perform the `bind` verb on the referenced role.
For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRoleBinding`
to a role that grants that permission. To allow a user to create/update role bindings:

1. Grant them a role that allows them to create/update `RoleBinding` or `ClusterRoleBinding` objects, as desired.
2. Grant them permissions needed to bind a particular role:
    * implicitly, by giving them the permissions contained in the role.
    * explicitly, by giving them permission to perform the `bind` verb on the particular role (or cluster role).

For example, this cluster role and role binding would allow "user-1" to grant other users the `admin`, `edit`, and `view` roles in the "user-1-namespace" namespace:

```yaml
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: ClusterRole
metadata:
  name: role-grantor
rules:
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["rolebindings"]
  verbs: ["create"]
- apiGroups: ["rbac.authorization.k8s.io"]
  resources: ["clusterroles"]
  verbs: ["bind"]
  resourceNames: ["admin","edit","view"]
---
apiVersion: rbac.authorization.k8s.io/v1beta1
kind: RoleBinding
metadata:
  name: role-grantor-binding
  namespace: user-1-namespace
roleRef:
  apiGroup: rbac.authorization.k8s.io
  kind: ClusterRole
  name: role-grantor
subjects:
- apiGroup: rbac.authorization.k8s.io
  kind: User
  name: user-1
```

When bootstrapping the first roles and role bindings, it is necessary for the initial user to grant permissions they do not yet have.
To bootstrap initial roles and role bindings:

* Use a credential with the `system:masters` group, which is bound to the `cluster-admin` superuser role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.

## Command-line utilities

Two `kubectl` commands exist to grant roles to users, within a namespace, or across the entire cluster.

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
(beyond discovery permissions given to all authenticated users).

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
