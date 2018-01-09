---
approvers:
- pweil-
title: Pod Security Policies
---

Objects of type `PodSecurityPolicy` govern the ability
to make requests on a pod that affect the `SecurityContext` that will be
applied to a pod and container.

See [PodSecurityPolicy proposal](https://git.k8s.io/community/contributors/design-proposals/auth/pod-security-policy.md) for more information.

* TOC
{:toc}

## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls the
actions that a pod can perform and what it has the ability to access. The
`PodSecurityPolicy` objects define a set of conditions that a pod must
run with in order to be accepted into the system. They allow an
administrator to control the following:

| Control Aspect                                                         | Field Name                                  |
| ---------------------------------------------------------------------- | ------------------------------------------- |
| Running of privileged containers                                       | `privileged`                                |
| Default set of capabilities that will be added to a container          | `defaultAddCapabilities`                    |
| Capabilities that will be dropped from a container                     | `requiredDropCapabilities`                  |
| Capabilities a container can request to be added                       | `allowedCapabilities`                       |
| Controlling the usage of volume types                                  | [`volumes`](#controlling-volumes)           |
| The use of host networking                                             | [`hostNetwork`](#host-network)              |
| The use of host ports                                                  | `hostPorts`                                 |
| The use of host's PID namespace                                        | `hostPID`                                   |
| The use of host's IPC namespace                                        | `hostIPC`                                   |
| The SELinux context of the container                                   | [`seLinux`](#selinux)                       |
| The user ID                                                            | [`runAsUser`](#runasuser)                   |
| Configuring allowable supplemental groups                              | [`supplementalGroups`](#supplementalgroups) |
| Allocating an FSGroup that owns the pod's volumes                      | [`fsGroup`](#fsgroup)                       |
| Requiring the use of a read only root file system                      | `readOnlyRootFilesystem`                    |
| Running of a container that allow privilege escalation from its parent | [`allowPrivilegeEscalation`](#allowprivilegeescalation) |
| Control whether a process can gain more privileges than its parent process | [`defaultAllowPrivilegeEscalation`](#defaultallowprivilegeescalation) |
| Whitelist of allowed host paths                                        | [`allowedHostPaths`](#allowedhostpaths)     |

_Pod Security Policies_ are comprised of settings and strategies that
control the security features a pod has access to. These settings fall
into three categories:

- *Controlled by a Boolean*: Fields of this type default to the most
restrictive value.
- *Controlled by an allowable set*: Fields of this type are checked
against the set to ensure their values are allowed.
- *Controlled by a strategy*: Items that have a strategy to provide
a mechanism to generate the value and a mechanism to ensure that a
specified value falls into the set of allowable values.


## Strategies

### RunAsUser

- *MustRunAs* - Requires a `range` to be configured. Uses the first value
of the range as the default. Validates against the configured range.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
`runAsUser` or have the `USER` directive defined in the image. No default
provided.
- *RunAsAny* - No default provided. Allows any `runAsUser` to be specified.

### SELinux

- *MustRunAs* - Requires `seLinuxOptions` to be configured if not using
pre-allocated values. Uses `seLinuxOptions` as the default. Validates against
`seLinuxOptions`.
- *RunAsAny* - No default provided. Allows any `seLinuxOptions` to be
specified.

### SupplementalGroups

- *MustRunAs* - Requires at least one range to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *RunAsAny* - No default provided. Allows any `supplementalGroups` to be
specified.

### FSGroup

- *MustRunAs* - Requires at least one range to be specified. Uses the
minimum value of the first range as the default. Validates against the
first ID in the first range.
- *RunAsAny* - No default provided. Allows any `fsGroup` ID to be specified.

### Controlling Volumes

The usage of specific volume types can be controlled by setting the
volumes field of the PSP. The allowable values of this field correspond
to the volume sources that are defined when creating a volume:

1. azureFile
1. azureDisk
1. flocker
1. flexVolume
1. hostPath
1. emptyDir
1. gcePersistentDisk
1. awsElasticBlockStore
1. gitRepo
1. secret
1. nfs
1. iscsi
1. glusterfs
1. persistentVolumeClaim
1. rbd
1. cinder
1. cephFS
1. downwardAPI
1. fc
1. configMap
1. vsphereVolume
1. quobyte
1. photonPersistentDisk
1. projected
1. portworxVolume
1. scaleIO
1. storageos
1. \* (allow all volumes)

The recommended minimum set of allowed volumes for new PSPs are
configMap, downwardAPI, emptyDir, persistentVolumeClaim, secret, and projected.

### Host Network
 - *HostPorts*, default `empty`. List of `HostPortRange`, defined by `min`(inclusive) and `max`(inclusive), which define the allowed host ports.

### AllowPrivilegeEscalation

Gates whether or not a user is allowed to set the security context of a container
to `allowPrivilegeEscalation=true`. This field defaults to `false`.

### DefaultAllowPrivilegeEscalation

Sets the default for the security context `AllowPrivilegeEscalation` of a container.
This bool directly controls whether the `no_new_privs` flag gets set on the
container process. It defaults to `nil`. The default behavior of `nil`
allows privilege escalation so as to not break setuid binaries. Setting it to `false`
ensures that no child process of a container can gain more privileges than
its parent.

### AllowedHostPaths

This specifies a whitelist of host paths that are allowed to be used by Pods.
An empty list means there is no restriction on host paths used.
Each item in the list must specify a string value named `pathPrefix` that
defines a host path to match. The value cannot be "`*`" though.
An example is shown below:

```yaml
apiVersion: extensions/v1beta1
kind: PodSecurityPolicy
metadata:
  name: <binding name>
roleRef:
  kind: ClusterRole
  name: <role name>
  apiGroup: rbac.authorization.k8s.io
subjects:
# Authorize specific service accounts:
- kind: ServiceAccount
  name: <authorized service account name>
  namespace: <authorized pod namespace>
# Authorize specific users (not recommended):
- kind: User
  apiGroup: rbac.authorization.k8s.io
  name: <authorized user name>
```

If a `RoleBinding` (not a `ClusterRoleBinding`) is used, it will only grant
usage for pods being run in the same namespace as the binding. This can be
paired with system groups to grant access to all pods run in the namespace:
```yaml
# Authorize all service accounts in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:serviceaccounts
# Or equivalently, all authenticated users in a namespace:
- kind: Group
  apiGroup: rbac.authorization.k8s.io
  name: system:authenticated
```

For more examples of RBAC bindings, see [Role Binding
Examples](/docs/admin/authorization/rbac#role-binding-examples). For a complete
example of authorizing a PodSecurityPolicy, see
[below](#example).


### Troubleshooting

- The [Controller Manager](/docs/admin/kube-controller-manager/) must be run
against [the secured API port](/docs/admin/accessing-the-api/), and must not
have superuser permissions. Otherwise requests would bypass authentication and
authorization modules, all PodSecurityPolicy objects would be allowed, and users
would be able to create privileged containers. For more details on configuring
Controller Manager authorization, see [Controller
Roles](docs/admin/authorization/rbac/#controller-roles).

## Policy Order

In addition to restricting pod creation and update, pod security policies can
also be used to provide default values for many of the fields that it
controls. When multiple policies are available, the pod security policy
controller selects policies in the following order:

1. If any policies successfully validate the pod without altering it, they are
   used.
2. Otherwise, the first valid policy in alphabetical order is used.

## Example

_This example assumes you have a running cluster with the PodSecurityPolicy
admission controller enabled and you have cluster admin privileges._

### Set up

Set up a namespace and a service account to act as for this example. We'll use
this service account to mock a non-admin user.

```shell
$ kubectl create namespace psp-example
$ kubectl create serviceaccount -n psp-example fake-user
$ kubectl create rolebinding -n psp-example fake-editor --clusterrole=edit --serviceaccount=psp-example:fake-user
```

To make it clear which user we're acting as and save some typing, create 2
aliases:

```shell
$ alias kubectl-admin='kubectl -n psp-example'
$ alias kubectl-user='kubectl --as=system:serviceaccount:psp-example:fake-user -n psp-example'
```

### Create a policy and a pod

Define the example PodSecurityPolicy object in a file. This is a policy that
simply prevents the creation of privileged pods.

{% include code.html language="yaml" file="example-psp.yaml" ghlink="/docs/concepts/policy/example-psp.yaml" %}

And create it with kubectl:

```shell
$ kubectl-admin create -f example-psp.yaml
```

Now, as the unprivileged user, try to create a simple pod:

```shell
$ kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  allowedHostPaths:
    # This allows "/foo", "/foo/", "/foo/bar" etc., but
    # disallows "/fool", "/etc/foo" etc.
    - pathPrefix: "/foo"
```

## Admission

[_Admission control_ with `PodSecurityPolicy`](/docs/admin/admission-controllers/#podsecuritypolicy)
allows for control over the creation and modification of resources based on the
capabilities allowed in the cluster.

Admission uses the following approach to create the final security context for
the pod:

1. Retrieve all PSPs available for use.
1. Generate field values for security context settings that were not specified
on the request.
1. Validate the final settings against the available policies.

If a matching policy is found, then the pod is accepted. If the
request cannot be matched to a PSP, the pod is rejected.

A pod must validate every field against the PSP.

## Creating a Pod Security Policy

Here is an example Pod Security Policy. It has permissive settings for
all fields

{% include code.html language="yaml" file="psp.yaml" ghlink="/docs/concepts/policy/psp.yaml" %}

Create the policy by downloading the example file and then running this command:

```shell
$ kubectl create -f ./psp.yaml
podsecuritypolicy "permissive" created
```

## Getting a list of Pod Security Policies

To get a list of existing policies, use `kubectl get`:

```shell
$ kubectl get psp
NAME        PRIV   CAPS  SELINUX   RUNASUSER         FSGROUP   SUPGROUP  READONLYROOTFS  VOLUMES
permissive  false  []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
privileged  true   []    RunAsAny  RunAsAny          RunAsAny  RunAsAny  false           [*]
restricted  false  []    RunAsAny  MustRunAsNonRoot  RunAsAny  RunAsAny  false           [emptyDir secret downwardAPI configMap persistentVolumeClaim projected]
```

## Editing a Pod Security Policy

To modify policy interactively, use `kubectl edit`:

```shell
$ kubectl edit psp permissive
```

This command will open a default text editor where you will be able to modify policy.

## Deleting a Pod Security Policy

Once you don't need a policy anymore, simply delete it with `kubectl`:

```shell
$ kubectl delete psp permissive
podsecuritypolicy "permissive" deleted
```

## Enabling Pod Security Policies

In order to use Pod Security Policies in your cluster you must ensure the
following

1.  You have enabled the API type `extensions/v1beta1/podsecuritypolicy` (only for versions prior 1.6)
1.  [You have enabled the admission control plug-in `PodSecurityPolicy`](/docs/admin/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in)
1.  You have defined your policies

## Working With RBAC

In Kubernetes 1.5 and newer, you can use PodSecurityPolicy to control access to
privileged containers based on user role and groups. Access to different
PodSecurityPolicy objects can be controlled via authorization.

Note that [Controller Manager](/docs/admin/kube-controller-manager/) must be run
against [the secured API port](/docs/admin/accessing-the-api/), and must not
have superuser permissions. Otherwise requests would bypass authentication and
authorization modules, all PodSecurityPolicy objects would be allowed,
and user will be able to create privileged containers.

PodSecurityPolicy authorization uses the union of all policies available to the
user creating the pod and
[the service account specified on the pod](/docs/tasks/configure-pod-container/configure-service-account/).

Access to given PSP policies for a user will be effective only when creating
Pods directly.

For pods created on behalf of a user, in most cases by Controller Manager,
access should be given to the service account specified on the pod spec
template. Examples of resources that create pods on behalf of a user are
Deployments, ReplicaSets, etc.

For more details, see the
[PodSecurityPolicy RBAC example](https://git.k8s.io/examples/staging/podsecuritypolicy/rbac/README.md)
of applying PodSecurityPolicy to control access to privileged containers based
on role and groups when deploying Pods directly.
