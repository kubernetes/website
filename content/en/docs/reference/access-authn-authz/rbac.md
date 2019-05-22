---
reviewers:
- erictune
- deads2k
- liggitt
title: Using RBAC Authorization
content_template: templates/concept
weight: 70
---

{{% capture overview %}}
Role-based access control (RBAC) is a method of regulating access to computer or network resources based on the roles of individual users within an enterprise.
{{% /capture %}}

{{% capture body %}}
`RBAC` uses the `rbac.authorization.k8s.io` API group
to drive authorization decisions, allowing admins to dynamically configure policies
through the Kubernetes API.

As of 1.8, RBAC mode is stable and backed by the rbac.authorization.k8s.io/v1 API.

To enable RBAC, start the apiserver with `--authorization-mode=RBAC`.

## API Overview

The RBAC API declares four top-level types which will be covered in this
section. Users can interact with these resources as they would with any other
API resource (via `kubectl`, API calls, etc.). For instance,
`kubectl apply -f (resource).yml` can be used with any of these examples,
though readers who wish to follow along should review the section on
bootstrapping first.

### Role and ClusterRole

In the RBAC API, a role contains rules that represent a set of permissions.
Permissions are purely additive (there are no "deny" rules).
A role can be defined within a namespace with a `Role`, or cluster-wide with a `ClusterRole`.

A `Role` can only be used to grant access to resources within a single namespace.
Here's an example `Role` in the "default" namespace that can be used to grant read access to pods:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-reader
rules:
- apiGroups: [""] # "" indicates the core API group
  resources: ["pods"]
  verbs: ["get", "watch", "list"]
```

A `ClusterRole` can be used to grant the same permissions as a `Role`,
but because they are cluster-scoped, they can also be used to grant access to:

* cluster-scoped resources (like nodes)
* non-resource endpoints (like "/healthz")
* namespaced resources (like pods) across all namespaces (needed to run `kubectl get pods --all-namespaces`, for example)

The following `ClusterRole` can be used to grant read access to secrets in any particular namespace,
or across all namespaces (depending on how it is [bound](#rolebinding-and-clusterrolebinding)):

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  # "namespace" omitted since ClusterRoles are not namespaced
  name: secret-reader
rules:
- apiGroups: [""]
  resources: ["secrets"]
  verbs: ["get", "watch", "list"]
```

### RoleBinding and ClusterRoleBinding

A role binding grants the permissions defined in a role to a user or set of users.
It holds a list of subjects (users, groups, or service accounts), and a reference to the role being granted.
Permissions can be granted within a namespace with a `RoleBinding`, or cluster-wide with a `ClusterRoleBinding`.

A `RoleBinding` may reference a `Role` in the same namespace.
The following `RoleBinding` grants the "pod-reader" role to the user "jane" within the "default" namespace.
This allows "jane" to read pods in the "default" namespace.

`roleRef` is how you will actually create the binding.  The `kind` will be either `Role` or `ClusterRole`, and the `name` will reference the name of the specific `Role` or `ClusterRole` you want. In the example below, this RoleBinding is using `roleRef` to bind the user "jane" to the `Role` created above named `pod-reader`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "jane" to read pods in the "default" namespace.
kind: RoleBinding
metadata:
  name: read-pods
  namespace: default
subjects:
- kind: User
  name: jane # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role #this must be Role or ClusterRole
  name: pod-reader # this must match the name of the Role or ClusterRole you wish to bind to
  apiGroup: rbac.authorization.k8s.io
```

A `RoleBinding` may also reference a `ClusterRole` to grant the permissions to namespaced
resources defined in the `ClusterRole` within the `RoleBinding`'s namespace.
This allows administrators to define a set of common roles for the entire cluster,
then reuse them within multiple namespaces.

For instance, even though the following `RoleBinding` refers to a `ClusterRole`,
"dave" (the subject, case sensitive) will only be able to read secrets in the "development"
namespace (the namespace of the `RoleBinding`).

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This role binding allows "dave" to read secrets in the "development" namespace.
kind: RoleBinding
metadata:
  name: read-secrets
  namespace: development # This only grants permissions within the "development" namespace.
subjects:
- kind: User
  name: dave # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

Finally, a `ClusterRoleBinding` may be used to grant permission at the cluster level and in all
namespaces. The following `ClusterRoleBinding` allows any user in the group "manager" to read 
secrets in any namespace.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
# This cluster role binding allows anyone in the "manager" group to read secrets in any namespace.
kind: ClusterRoleBinding
metadata:
  name: read-secrets-global
subjects:
- kind: Group
  name: manager # Name is case sensitive
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: ClusterRole
  name: secret-reader
  apiGroup: rbac.authorization.k8s.io
```

You cannot modify which `Role` or `ClusterRole` a binding object refers to.
Attempts to change the `roleRef` field of a binding object will result in a validation error.
To change the `roleRef` field on an existing binding object, the binding object must be deleted and recreated.
There are two primary reasons for this restriction:

1. A binding to a different role is a fundamentally different binding.
Requiring a binding to be deleted/recreated in order to change the `roleRef`
ensures the full list of subjects in the binding is intended to be granted
the new role (as opposed to enabling accidentally modifying just the roleRef 
without verifying all of the existing subjects should be given the new role's permissions).
2. Making `roleRef` immutable allows giving `update` permission on an existing binding object
to a user, which lets them manage the list of subjects, without being able to change the 
role that is granted to those subjects.

The `kubectl auth reconcile` command-line utility creates or updates a manifest file containing RBAC objects,
and handles deleting and recreating binding objects if required to change the role they refer to.
See [command usage and examples](#kubectl-auth-reconcile) for more information.

### Referring to Resources

Most resources are represented by a string representation of their name, such as "pods", just as it
appears in the URL for the relevant API endpoint. However, some Kubernetes APIs involve a
"subresource", such as the logs for a pod. The URL for the pods logs endpoint is:

```http
GET /api/v1/namespaces/{namespace}/pods/{name}/log
```

In this case, "pods" is the namespaced resource, and "log" is a subresource of pods. To represent
this in an RBAC role, use a slash to delimit the resource and subresource. To allow a subject
to read both pods and pod logs, you would write:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: pod-and-pod-logs-reader
rules:
- apiGroups: [""]
  resources: ["pods", "pods/log"]
  verbs: ["get", "list"]
```

Resources can also be referred to by name for certain requests through the `resourceNames` list.
When specified, requests can be restricted to individual instances of a resource. To restrict a
subject to only "get" and "update" a single configmap, you would write:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  namespace: default
  name: configmap-updater
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-configmap"]
  verbs: ["update", "get"]
```

Note that `create` requests cannot be restricted by resourceName, as the object name is not known at
authorization time. The other exception is `deletecollection`.

### Aggregated ClusterRoles

As of 1.9, ClusterRoles can be created by combining other ClusterRoles using an `aggregationRule`. The
permissions of aggregated ClusterRoles are controller-managed, and filled in by unioning the rules of any
ClusterRole that matches the provided label selector. An example aggregated ClusterRole:

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring
aggregationRule:
  clusterRoleSelectors:
  - matchLabels:
      rbac.example.com/aggregate-to-monitoring: "true"
rules: [] # Rules are automatically filled in by the controller manager.
```

Creating a ClusterRole that matches the label selector will add rules to the aggregated ClusterRole. In this case
rules can be added to the "monitoring" ClusterRole by creating another ClusterRole that has the label
`rbac.example.com/aggregate-to-monitoring: true`.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: monitoring-endpoints
  labels:
    rbac.example.com/aggregate-to-monitoring: "true"
# These rules will be added to the "monitoring" role.
rules:
- apiGroups: [""]
  resources: ["services", "endpoints", "pods"]
  verbs: ["get", "list", "watch"]
```

The default user-facing roles (described below) use ClusterRole aggregation. This lets admins include rules
for custom resources, such as those served by CustomResourceDefinitions or Aggregated API servers, on the
default roles.

For example, the following ClusterRoles let the "admin" and "edit" default roles manage the custom resource
"CronTabs" and the "view" role perform read-only actions on the resource.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: aggregate-cron-tabs-edit
  labels:
    # Add these permissions to the "admin" and "edit" default roles.
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
---
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: aggregate-cron-tabs-view
  labels:
    # Add these permissions to the "view" default role.
    rbac.authorization.k8s.io/aggregate-to-view: "true"
rules:
- apiGroups: ["stable.example.com"]
  resources: ["crontabs"]
  verbs: ["get", "list", "watch"]
```

#### Role Examples

Only the `rules` section is shown in the following examples.

Allow reading the resource "pods" in the core API group:

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
```

Allow reading/writing "deployments" in both the "extensions" and "apps" API groups:

```yaml
rules:
- apiGroups: ["extensions", "apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Allow reading "pods" and reading/writing "jobs":

```yaml
rules:
- apiGroups: [""]
  resources: ["pods"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["batch", "extensions"]
  resources: ["jobs"]
  verbs: ["get", "list", "watch", "create", "update", "patch", "delete"]
```

Allow reading a `ConfigMap` named "my-config" (must be bound with a `RoleBinding` to limit to a single `ConfigMap` in a single namespace):

```yaml
rules:
- apiGroups: [""]
  resources: ["configmaps"]
  resourceNames: ["my-config"]
  verbs: ["get"]
```

Allow reading the resource "nodes" in the core group (because a `Node` is cluster-scoped, this must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):

```yaml
rules:
- apiGroups: [""]
  resources: ["nodes"]
  verbs: ["get", "list", "watch"]
```

Allow "GET" and "POST" requests to the non-resource endpoint "/healthz" and all subpaths (must be in a `ClusterRole` bound with a `ClusterRoleBinding` to be effective):

```yaml
rules:
- nonResourceURLs: ["/healthz", "/healthz/*"] # '*' in a nonResourceURL is a suffix glob match
  verbs: ["get", "post"]
```

### Referring to Subjects

A `RoleBinding` or `ClusterRoleBinding` binds a role to *subjects*.
Subjects can be groups, users or service accounts.

Users are represented by strings.  These can be plain usernames, like
"alice", email-style names, like "bob@example.com", or numeric IDs
represented as a string.  It is up to the Kubernetes admin to configure
the [authentication modules](/docs/reference/access-authn-authz/authentication/) to produce
usernames in the desired format.  The RBAC authorization system does
not require any particular format.  However, the prefix `system:` is
reserved for Kubernetes system use, and so the admin should ensure
usernames do not contain this prefix by accident.

Group information in Kubernetes is currently provided by the Authenticator
modules. Groups, like users, are represented as strings, and that string 
has no format requirements, other than that the prefix `system:` is reserved.

[Service Accounts](/docs/tasks/configure-pod-container/configure-service-account/) have usernames with the `system:serviceaccount:` prefix and belong
to groups with the `system:serviceaccounts:` prefix.

#### Role Binding Examples

Only the `subjects` section of a `RoleBinding` is shown in the following examples.

For a user named "alice@example.com":

```yaml
subjects:
- kind: User
  name: "alice@example.com"
  apiGroup: rbac.authorization.k8s.io
```

For a group named "frontend-admins":

```yaml
subjects:
- kind: Group
  name: "frontend-admins"
  apiGroup: rbac.authorization.k8s.io
```

For the default service account in the kube-system namespace:

```yaml
subjects:
- kind: ServiceAccount
  name: default
  namespace: kube-system
```

For all service accounts in the "qa" namespace:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts:qa
  apiGroup: rbac.authorization.k8s.io
```

For all service accounts everywhere:

```yaml
subjects:
- kind: Group
  name: system:serviceaccounts
  apiGroup: rbac.authorization.k8s.io
```

For all authenticated users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
```

For all unauthenticated users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

For all users (version 1.5+):

```yaml
subjects:
- kind: Group
  name: system:authenticated
  apiGroup: rbac.authorization.k8s.io
- kind: Group
  name: system:unauthenticated
  apiGroup: rbac.authorization.k8s.io
```

## Default Roles and Role Bindings

API servers create a set of default `ClusterRole` and `ClusterRoleBinding` objects.
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

Auto-reconciliation is enabled in Kubernetes version 1.6+ when the RBAC authorizer is active.

### Discovery Roles

Default role bindings authorize unauthenticated and authenticated users to read API information that is deemed safe to be publicly accessible (including CustomResourceDefinitions). To disable anonymous unauthenticated access add `--anonymous-auth=false` to the API server configuration.

To view the configuration of these roles via `kubectl` run:

```
kubectl get clusterroles system:discovery -o yaml
```

NOTE: editing the role is not recommended as changes will be overwritten on API server restart via auto-reconciliation (see above).

<table>
<colgroup><col width="25%"><col width="25%"><col></colgroup>
<tr>
<th>Default ClusterRole</th>
<th>Default ClusterRoleBinding</th>
<th>Description</th>
</tr>
<tr>
<td><b>system:basic-user</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows a user read-only access to basic information about themselves. Prior to 1.14, this role was also bound to `system:unauthenticated` by default.</td>
</tr>
<tr>
<td><b>system:discovery</b></td>
<td><b>system:authenticated</b> group</td>
<td>Allows read-only access to API discovery endpoints needed to discover and negotiate an API level. Prior to 1.14, this role was also bound to `system:unauthenticated` by default.</td>
</tr>
<tr>
<td><b>system:public-info-viewer</b></td>
<td><b>system:authenticated</b> and <b>system:unauthenticated</b> groups</td>
<td>Allows read-only access to non-sensitive information about the cluster. Introduced in 1.14.</td>
</tr>
</table>

### User-facing Roles

Some of the default roles are not `system:` prefixed. These are intended to be user-facing roles.
They include super-user roles (`cluster-admin`),
roles intended to be granted cluster-wide using ClusterRoleBindings (`cluster-status`),
and roles intended to be granted within particular namespaces using RoleBindings (`admin`, `edit`, `view`).

As of 1.9, user-facing roles use [ClusterRole Aggregation](#aggregated-clusterroles) to allow admins to include
rules for custom resources on these roles. To add rules to the "admin", "edit", or "view" role, create a
ClusterRole with one or more of the following labels:

```yaml
metadata:
  labels:
    rbac.authorization.k8s.io/aggregate-to-admin: "true"
    rbac.authorization.k8s.io/aggregate-to-edit: "true"
    rbac.authorization.k8s.io/aggregate-to-view: "true"
```

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

### Core Component Roles

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
<td><b>system:volume-scheduler</b></td>
<td><b>system:kube-scheduler</b> user</td>
<td>Allows access to the volume resources required by the kube-scheduler component.</td>
</tr>
<tr>
<td><b>system:kube-controller-manager</b></td>
<td><b>system:kube-controller-manager</b> user</td>
<td>Allows access to the resources required by the kube-controller-manager component.
The permissions required by individual control loops are contained in the <a href="#controller-roles">controller roles</a>.</td>
</tr>
<tr>
<td><b>system:node</b></td>
<td>None in 1.8+</td>
<td>Allows access to resources required by the kubelet component, <b>including read access to all secrets, and write access to all pod status objects</b>.

As of 1.7, use of the <a href="/docs/reference/access-authn-authz/node/">Node authorizer</a> and <a href="/docs/reference/access-authn-authz/admission-controllers/#noderestriction">NodeRestriction admission plugin</a> is recommended instead of this role, and allow granting API access to kubelets based on the pods scheduled to run on them.
Prior to 1.7, this role was automatically bound to the `system:nodes` group.
In 1.7, this role was automatically bound to the `system:nodes` group if the `Node` authorization mode is not enabled.
In 1.8+, no binding is automatically created.
</td>
</tr>
<tr>
<td><b>system:node-proxier</b></td>
<td><b>system:kube-proxy</b> user</td>
<td>Allows access to the resources required by the kube-proxy component.</td>
</tr>
</table>

### Other Component Roles

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
<td>Role for the <a href="/docs/concepts/services-networking/dns-pod-service/">kube-dns</a> component.</td>
</tr>
<tr>
<td><b>system:kubelet-api-admin</b></td>
<td>None</td>
<td>Allows full access to the kubelet API.</td>
</tr>  
<tr>
<td><b>system:node-bootstrapper</b></td>
<td>None</td>
<td>Allows access to the resources required to perform
<a href="/docs/reference/command-line-tools-reference/kubelet-tls-bootstrapping/">Kubelet TLS bootstrapping</a>.</td>
</tr>
<tr>
<td><b>system:node-problem-detector</b></td>
<td>None</td>
<td>Role for the <a href="https://github.com/kubernetes/node-problem-detector">node-problem-detector</a> component.</td>
</tr>
<tr>
<td><b>system:persistent-volume-provisioner</b></td>
<td>None</td>
<td>Allows access to the resources required by most <a href="/docs/concepts/storage/persistent-volumes/#provisioner">dynamic volume provisioners</a>.</td>
</tr>
</table>

### Controller Roles

The [Kubernetes controller manager](/docs/admin/kube-controller-manager/) runs core control loops.
When invoked with `--use-service-account-credentials`, each control loop is started using a separate service account.
Corresponding roles exist for each control loop, prefixed with `system:controller:`.
If the controller manager is not started with `--use-service-account-credentials`, 
it runs all control loops using its own credential, which must be granted all the relevant roles.
These roles include:

* system:controller:attachdetach-controller
* system:controller:certificate-controller
* system:controller:clusterrole-aggregation-controller
* system:controller:cronjob-controller
* system:controller:daemon-set-controller
* system:controller:deployment-controller
* system:controller:disruption-controller
* system:controller:endpoint-controller
* system:controller:expand-controller
* system:controller:generic-garbage-collector
* system:controller:horizontal-pod-autoscaler
* system:controller:job-controller
* system:controller:namespace-controller
* system:controller:node-controller
* system:controller:persistent-volume-binder
* system:controller:pod-garbage-collector
* system:controller:pv-protection-controller
* system:controller:pvc-protection-controller
* system:controller:replicaset-controller
* system:controller:replication-controller
* system:controller:resourcequota-controller
* system:controller:root-ca-cert-publisher
* system:controller:route-controller
* system:controller:service-account-controller
* system:controller:service-controller
* system:controller:statefulset-controller
* system:controller:ttl-controller

## Privilege Escalation Prevention and Bootstrapping

The RBAC API prevents users from escalating privileges by editing roles or role bindings.
Because this is enforced at the API level, it applies even when the RBAC authorizer is not in use.

A user can only create/update a role if at least one of the following things is true:

1. They already have all the permissions contained in the role, at the same scope as the object being modified
(cluster-wide for a `ClusterRole`, within the same namespace or cluster-wide for a `Role`)
2. They are given explicit permission to perform the `escalate` verb on the `roles` or `clusterroles` resource in the `rbac.authorization.k8s.io` API group (Kubernetes 1.12 and newer)

For example, if "user-1" does not have the ability to list secrets cluster-wide, they cannot create a `ClusterRole`
containing that permission. To allow a user to create/update roles:

1. Grant them a role that allows them to create/update `Role` or `ClusterRole` objects, as desired.
2. Grant them permission to include specific permissions in the roles the create/update:
    * implicitly, by giving them those permissions (if they attempt to create or modify a `Role` or `ClusterRole` with permissions they themselves have not been granted, the API request will be forbidden)
    * or explicitly allow specifying any permission in a `Role` or `ClusterRole` by giving them permission to perform the `escalate` verb on `roles` or `clusterroles` resources in the `rbac.authorization.k8s.io` API group (Kubernetes 1.12 and newer)

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
apiVersion: rbac.authorization.k8s.io/v1
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
apiVersion: rbac.authorization.k8s.io/v1
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

* Use a credential with the `system:masters` group, which is bound to the `cluster-admin` super-user role by the default bindings.
* If your API server runs with the insecure port enabled (`--insecure-port`), you can also make API calls via that port, which does not enforce authentication or authorization.

## Command-line Utilities

### `kubectl create role`

Creates a `Role` object defining permissions within a single namespace. Examples:

* Create a `Role` named "pod-reader" that allows user to perform "get", "watch" and "list" on pods:

    ```
    kubectl create role pod-reader --verb=get --verb=list --verb=watch --resource=pods
    ```

* Create a `Role` named "pod-reader" with resourceNames specified:

    ```
    kubectl create role pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a `Role` named "foo" with apiGroups specified:

    ```
    kubectl create role foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a `Role` named "foo" with subresource permissions:

    ```
    kubectl create role foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a `Role` named "my-component-lease-holder" with permissions to get/update a resource with a specific name:

    ```
    kubectl create role my-component-lease-holder --verb=get,list,watch,update --resource=lease --resource-name=my-component
    ```

### `kubectl create clusterrole`

Creates a `ClusterRole` object. Examples:

* Create a `ClusterRole` named "pod-reader" that allows user to perform "get", "watch" and "list" on pods:

    ```
    kubectl create clusterrole pod-reader --verb=get,list,watch --resource=pods
    ```

* Create a `ClusterRole` named "pod-reader" with resourceNames specified:

    ```
    kubectl create clusterrole pod-reader --verb=get --resource=pods --resource-name=readablepod --resource-name=anotherpod
    ```

* Create a `ClusterRole` named "foo" with apiGroups specified:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=replicasets.apps
    ```

* Create a `ClusterRole` named "foo" with subresource permissions:

    ```
    kubectl create clusterrole foo --verb=get,list,watch --resource=pods,pods/status
    ```

* Create a `ClusterRole` name "foo" with nonResourceURL specified:

    ```
    kubectl create clusterrole "foo" --verb=get --non-resource-url=/logs/*
    ```

* Create a `ClusterRole` name "monitoring" with aggregationRule specified:

    ```
    kubectl create clusterrole monitoring --aggregation-rule="rbac.example.com/aggregate-to-monitoring=true"
    ```

### `kubectl create rolebinding`

Grants a `Role` or `ClusterRole` within a specific namespace. Examples:

* Within the namespace "acme", grant the permissions in the `admin` `ClusterRole` to a user named "bob":

    ```
    kubectl create rolebinding bob-admin-binding --clusterrole=admin --user=bob --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the `view` `ClusterRole` to the service account in the namespace "acme" named "myapp" :

    ```
    kubectl create rolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp --namespace=acme
    ```

* Within the namespace "acme", grant the permissions in the `view` `ClusterRole` to a service account in the namespace "myappnamespace" named "myapp":

    ```
    kubectl create rolebinding myappnamespace-myapp-view-binding --clusterrole=view --serviceaccount=myappnamespace:myapp --namespace=acme
    ```

### `kubectl create clusterrolebinding`

Grants a `ClusterRole` across the entire cluster, including all namespaces. Examples:

* Across the entire cluster, grant the permissions in the `cluster-admin` `ClusterRole` to a user named "root":

    ```
    kubectl create clusterrolebinding root-cluster-admin-binding --clusterrole=cluster-admin --user=root
    ```

* Across the entire cluster, grant the permissions in the `system:node-proxier	` `ClusterRole` to a user named "system:kube-proxy":

    ```
    kubectl create clusterrolebinding kube-proxy-binding --clusterrole=system:node-proxier --user=system:kube-proxy
    ```

* Across the entire cluster, grant the permissions in the `view` `ClusterRole` to a service account named "myapp" in the namespace "acme":

    ```
    kubectl create clusterrolebinding myapp-view-binding --clusterrole=view --serviceaccount=acme:myapp
    ```

### `kubectl auth reconcile` {#kubectl-auth-reconcile}

Creates or updates `rbac.authorization.k8s.io/v1` API objects from a manifest file.

Missing objects are created, and the containing namespace is created for namespaced objects, if required.

Existing roles are updated to include the permissions in the input objects,
and remove extra permissions if `--remove-extra-permissions` is specified.

Existing bindings are updated to include the subjects in the input objects,
and remove extra subjects if `--remove-extra-subjects` is specified.

Examples:

* Test applying a manifest file of RBAC objects, displaying changes that would be made:

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --dry-run
    ```

* Apply a manifest file of RBAC objects, preserving any extra permissions (in roles) and any extra subjects (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml
    ```

* Apply a manifest file of RBAC objects, removing any extra permissions (in roles) and any extra subjects (in bindings):

    ```
    kubectl auth reconcile -f my-rbac-rules.yaml --remove-extra-subjects --remove-extra-permissions
    ```

See the CLI help for detailed usage.

## Service Account Permissions

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

This allows you to grant particular roles to particular service accounts as needed.
Fine-grained role bindings provide greater security, but require more effort to administrate.
Broader grants can give unnecessary (and potentially escalating) API access to service accounts, but are easier to administrate.

In order from most secure to least secure, the approaches are:

1. Grant a role to an application-specific service account (best practice)

    This requires the application to specify a `serviceAccountName` in its pod spec,
    and for the service account to be created (via the API, application manifest, `kubectl create serviceaccount`, etc.).

    For example, grant read-only permission within "my-namespace" to the "my-sa" service account:

    ```shell
    kubectl create rolebinding my-sa-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:my-sa \
      --namespace=my-namespace
    ```

2. Grant a role to the "default" service account in a namespace

    If an application does not specify a `serviceAccountName`, it uses the "default" service account.

    {{< note >}}Permissions given to the "default" service
    account are available to any pod in the namespace that does not
    specify a `serviceAccountName`.{{< /note >}}

    For example, grant read-only permission within "my-namespace" to the "default" service account:

    ```shell
    kubectl create rolebinding default-view \
      --clusterrole=view \
      --serviceaccount=my-namespace:default \
      --namespace=my-namespace
    ```

    Many [add-ons](/docs/concepts/cluster-administration/addons/) currently run as the "default" service account in the `kube-system` namespace.
    To allow those add-ons to run with super-user access, grant cluster-admin permissions to the "default" service account in the `kube-system` namespace.

    {{< note >}}Enabling this means the `kube-system`
    namespace contains secrets that grant super-user access to the
    API.{{< /note >}}

    ```shell
    kubectl create clusterrolebinding add-on-cluster-admin \
      --clusterrole=cluster-admin \
      --serviceaccount=kube-system:default
    ```

3. Grant a role to all service accounts in a namespace

    If you want all applications in a namespace to have a role, no matter what service account they use,
    you can grant a role to the service account group for that namespace.

    For example, grant read-only permission within "my-namespace" to all service accounts in that namespace:

    ```shell
    kubectl create rolebinding serviceaccounts-view \
      --clusterrole=view \
      --group=system:serviceaccounts:my-namespace \
      --namespace=my-namespace
    ```

4. Grant a limited role to all service accounts cluster-wide (discouraged)

    If you don't want to manage permissions per-namespace, you can grant a cluster-wide role to all service accounts.

    For example, grant read-only permission across all namespaces to all service accounts in the cluster:

    ```shell
    kubectl create clusterrolebinding serviceaccounts-view \
      --clusterrole=view \
     --group=system:serviceaccounts
    ```

5. Grant super-user access to all service accounts cluster-wide (strongly discouraged)

    If you don't care about partitioning permissions at all, you can grant super-user access to all service accounts.

    {{< warning >}}
    This allows any user with read access
    to secrets or the ability to create a pod to access super-user
    credentials.
    {{< /warning >}}

    ```shell
    kubectl create clusterrolebinding serviceaccounts-cluster-admin \
      --clusterrole=cluster-admin \
      --group=system:serviceaccounts
    ```

## Upgrading from 1.5

Prior to Kubernetes 1.6, many deployments used very permissive ABAC policies,
including granting full API access to all service accounts.

Default RBAC policies grant scoped permissions to control-plane components, nodes,
and controllers, but grant *no permissions* to service accounts outside the `kube-system` namespace
(beyond discovery permissions given to all authenticated users).

While far more secure, this can be disruptive to existing workloads expecting to automatically receive API permissions.
Here are two approaches for managing this transition:

### Parallel Authorizers

Run both the RBAC and ABAC authorizers, and specify a policy file that contains
[the legacy ABAC policy](/docs/reference/access-authn-authz/abac/#policy-file-format):

```
--authorization-mode=RBAC,ABAC --authorization-policy-file=mypolicy.json
```

The RBAC authorizer will attempt to authorize requests first. If it denies an API request,
the ABAC authorizer is then run. This means that any request allowed by *either* the RBAC
or ABAC policies is allowed.

When the apiserver is run with a log level of 5 or higher for the RBAC component (`--vmodule=rbac*=5` or `--v=5`),
you can see RBAC denials in the apiserver log (prefixed with `RBAC DENY:`).
You can use that information to determine which roles need to be granted to which users, groups, or service accounts.
Once you have [granted roles to service accounts](#service-account-permissions) and workloads are running with no RBAC denial messages
in the server logs, you can remove the ABAC authorizer.

## Permissive RBAC Permissions

You can replicate a permissive policy using RBAC role bindings.

{{< warning >}}
The following policy allows **ALL** service accounts to act as cluster administrators.
Any application running in a container receives service account credentials automatically,
and could perform any action against the API, including viewing secrets and modifying permissions.
This is not a recommended policy.

```
kubectl create clusterrolebinding permissive-binding \
  --clusterrole=cluster-admin \
  --user=admin \
  --user=kubelet \
  --group=system:serviceaccounts
```
{{< /warning >}}

{{% /capture %}}
