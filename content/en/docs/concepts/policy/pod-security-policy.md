---
reviewers:
- pweil-
- tallclair
title: Pod Security Policies
---

{{< feature-state state="beta" >}}

Pod Security Policies enable fine-grained authorization of pod creation and
updates.

{{< toc >}}

## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls security
sensitive aspects of the pod specification. The `PodSecurityPolicy` objects
define a set of conditions that a pod must run with in order to be accepted into
the system, as well as defaults for the related fields. They allow an
administrator to control the following:

| Control Aspect                                      | Field Names                                 |
| ----------------------------------------------------| ------------------------------------------- |
| Running of privileged containers                    | [`privileged`](#privileged)                                |
| Usage of the root namespaces                        | [`hostPID`, `hostIPC`](#host-namespaces)    |
| Usage of host networking and ports                  | [`hostNetwork`, `hostPorts`](#host-namespaces) |
| Usage of volume types                               | [`volumes`](#volumes-and-file-systems)      |
| Usage of the host filesystem                        | [`allowedHostPaths`](#volumes-and-file-systems) |
| White list of FlexVolume drivers                    | [`allowedFlexVolumes`](#flexvolume-drivers) |
| Allocating an FSGroup that owns the pod's volumes   | [`fsGroup`](#volumes-and-file-systems)      |
| Requiring the use of a read only root file system   | [`readOnlyRootFilesystem`](#volumes-and-file-systems) |
| The user and group IDs of the container             | [`runAsUser`, `supplementalGroups`](#users-and-groups) |
| Restricting escalation to root privileges           | [`allowPrivilegeEscalation`, `defaultAllowPrivilegeEscalation`](#privilege-escalation) |
| Linux capabilities                                  | [`defaultAddCapabilities`, `requiredDropCapabilities`, `allowedCapabilities`](#capabilities) |
| The SELinux context of the container                | [`seLinux`](#selinux)                       |
| The AppArmor profile used by containers             | [annotations](#apparmor)                    |
| The seccomp profile used by containers              | [annotations](#seccomp)                     |
| The sysctl profile used by containers               | [annotations](#sysctl)                      |


## Enabling Pod Security Policies

Pod security policy control is implemented as an optional (but recommended)
[admission
controller](/docs/admin/admission-controllers/#podsecuritypolicy). PodSecurityPolicies
are enforced by [enabling the admission
controller](/docs/admin/admission-controllers/#how-do-i-turn-on-an-admission-control-plug-in),
but doing so without authorizing any policies **will prevent any pods from being
created** in the cluster.

Since the pod security policy API (`policy/v1beta1/podsecuritypolicy`) is
enabled independently of the admission controller, for existing clusters it is
recommended that policies are added and authorized before enabling the admission
controller.

## Authorizing Policies

When a PodSecurityPolicy resource is created, it does nothing. In order to use
it, the requesting user or target pod's [service
account](/docs/tasks/configure-pod-container/configure-service-account/) must be
authorized to use the policy, by allowing the `use` verb on the policy.

Most Kubernetes pods are not created directly by users. Instead, they are
typically created indirectly as part of a
[Deployment](/docs/concepts/workloads/controllers/deployment/),
[ReplicaSet](/docs/concepts/workloads/controllers/replicaset/), or other
templated controller via the controller manager. Granting the controller access
to the policy would grant access for *all* pods created by that the controller,
so the preferred method for authorizing policies is to grant access to the
pod's service account (see [example](#run-another-pod)).

### Via RBAC

[RBAC](/docs/admin/authorization/rbac/) is a standard Kubernetes authorization
mode, and can easily be used to authorize use of policies.

First, a `Role` or `ClusterRole` needs to grant access to `use` the desired
policies. The rules to grant access look like this:

```yaml
kind: ClusterRole
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: <role name>
rules:
- apiGroups: ['policy']
  resources: ['podsecuritypolicies']
  verbs:     ['use']
  resourceNames:
  - <list of policies to authorize>
```

Then the `(Cluster)Role` is bound to the authorized user(s):

```yaml
kind: ClusterRoleBinding
apiVersion: rbac.authorization.k8s.io/v1
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
Roles](/docs/admin/authorization/rbac/#controller-roles).

## Policy Order

In addition to restricting pod creation and update, pod security policies can
also be used to provide default values for many of the fields that it
controls. When multiple policies are available, the pod security policy
controller selects policies in the following order:

1. If any policies successfully validate the pod without altering it, they are
   used.
2. If it is a pod creation request, then the first valid policy in alphabetical
   order is used.
3. Otherwise, if it is a pod update request, an error is returned, because pod mutations
   are disallowed during update operations.

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

{{< code file="example-psp.yaml" >}}

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
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
EOF
Error from server (Forbidden): error when creating "STDIN": pods "pause" is forbidden: unable to validate against any pod security policy: []
```

**What happened?** Although the PodSecurityPolicy was created, neither the
pod's service account nor `fake-user` have permission to use the new policy:

```shell
$ kubectl-user auth can-i use podsecuritypolicy/example
no
```

Create the rolebinding to grant `fake-user` the `use` verb on the example
policy:

_Note: This is not the recommended way! See the [next section](#run-another-pod)
for the preferred approach._

```shell
$ kubectl-admin create role psp:unprivileged \
    --verb=use \
    --resource=podsecuritypolicy \
    --resource-name=example
role "psp:unprivileged" created
$ kubectl-admin create rolebinding fake-user:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:fake-user
rolebinding "fake-user:psp:unprivileged" created
$ kubectl-user auth can-i use podsecuritypolicy/example
yes
```

Now retry creating the pod:

```shell
$ kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      pause
spec:
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
EOF
pod "pause" created
```

It works as expected! But any attempts to create a privileged pod should still
be denied:

```shell
$ kubectl-user create -f- <<EOF
apiVersion: v1
kind: Pod
metadata:
  name:      privileged
spec:
  containers:
    - name:  pause
      image: k8s.gcr.io/pause
      securityContext:
        privileged: true
EOF
Error from server (Forbidden): error when creating "STDIN": pods "privileged" is forbidden: unable to validate against any pod security policy: [spec.containers[0].securityContext.privileged: Invalid value: true: Privileged containers are not allowed]
```

Delete the pod before moving on:

```shell
$ kubectl-user delete pod pause
```

### Run another pod

Let's try that again, slightly differently:

```shell
$ kubectl-user run pause --image=k8s.gcr.io/pause
deployment "pause" created
$ kubectl-user get pods
No resources found.
$ kubectl-user get events | head -n 2
LASTSEEN   FIRSTSEEN   COUNT     NAME              KIND         SUBOBJECT                TYPE      REASON                  SOURCE                                  MESSAGE
1m         2m          15        pause-7774d79b5   ReplicaSet                            Warning   FailedCreate            replicaset-controller                   Error creating: pods "pause-7774d79b5-" is forbidden: no providers available to validate pod request
```

**What happened?** We already bound the `psp:unprivileged` role for our `fake-user`,
why are we getting the error `Error creating: pods "pause-7774d79b5-" is
forbidden: no providers available to validate pod request`? The answer lies in
the source - `replicaset-controller`. Fake-user successfully created the
deployment (which successfully created a replicaset), but when the replicaset
went to create the pod it was not authorized to use the example
podsecuritypolicy.

In order to fix this, bind the `psp:unprivileged` role to the pod's service
account instead. In this case (since we didn't specify it) the service account
is `default`:

```shell
$ kubectl-admin create rolebinding default:psp:unprivileged \
    --role=psp:unprivileged \
    --serviceaccount=psp-example:default
rolebinding "default:psp:unprivileged" created
```

Now if you give it a minute to retry, the replicaset-controller should
eventually succeed in creating the pod:

```shell
$ kubectl-user get pods --watch
NAME                    READY     STATUS    RESTARTS   AGE
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       Pending   0         1s
pause-7774d79b5-qrgcb   0/1       ContainerCreating   0         1s
pause-7774d79b5-qrgcb   1/1       Running   0         2s
^C
```

### Clean up

Delete the namespace to clean up most of the example resources:

```shell
$ kubectl-admin delete ns psp-example
namespace "psp-example" deleted
```

Note that `PodSecurityPolicy` resources are not namespaced, and must be cleaned
up separately:

```shell
$ kubectl-admin delete psp example
podsecuritypolicy "example" deleted
```

### Example Policies

This is the least restricted policy you can create, equivalent to not using the
pod security policy admission controller:

{{< code file="privileged-psp.yaml" >}}

This is an example of a restrictive policy that requires users to run as an
unprivileged user, blocks possible escalations to root, and requires use of
several security mechanisms.

{{< code file="restricted-psp.yaml" >}}

## Policy Reference

### Privileged

**Privileged** - determines if any container in a pod can enable privileged mode.
By default a container is not allowed to access any devices on the host, but a 
"privileged" container is given access to all devices on the host. This allows
the container nearly all the same access as processes running on the host.
This is useful for containers that want to use linux capabilities like
manipulating the network stack and accessing devices.

### Host namespaces

**HostPID** - Controls whether the pod containers can share the host process ID
namespace. Note that when paired with ptrace this can be used to escalate
privileges outside of the container (ptrace is forbidden by default).

**HostIPC** - Controls whether the pod containers can share the host IPC
namespace.

**HostNetwork** - Controls whether the pod may use the node network
namespace. Doing so gives the pod access to the loopback device, services
listening on localhost, and could be used to snoop on network activity of other
pods on the same node.

**HostPorts** - Provides a whitelist of ranges of allowable ports in the host
network namespace. Defined as a list of `HostPortRange`, with `min`(inclusive)
and `max`(inclusive). Defaults to no allowed host ports.

**AllowedHostPaths** - See [Volumes and file systems](#volumes-and-file-systems).

### Volumes and file systems

**Volumes** - Provides a whitelist of allowed volume types. The allowable values
correspond to the volume sources that are defined when creating a volume. For
the complete list of volume types, see [Types of
Volumes](/docs/concepts/storage/volumes/#types-of-volumes). Additionally, `*`
may be used to allow all volume types.

The **recommended minimum set** of allowed volumes for new PSPs are:

- configMap
- downwardAPI
- emptyDir
- persistentVolumeClaim
- secret
- projected

**FSGroup** - Controls the supplemental group applied to some volumes.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *RunAsAny* - No default provided. Allows any `fsGroup` ID to be specified.

**AllowedHostPaths** - This specifies a whitelist of host paths that are allowed
to be used by hostPath volumes. An empty list means there is no restriction on
host paths used. This is defined as a list of objects with a single `pathPrefix`
field, which allows hostPath volumes to mount a path that begins with an
allowed prefix. For example:

```yaml
allowedHostPaths:
  # This allows "/foo", "/foo/", "/foo/bar" etc., but
  # disallows "/fool", "/etc/foo" etc.
  # "/foo/../" is never valid.
  - pathPrefix: "/foo"
```

_Note: There are many ways a container with unrestricted access to the host
filesystem can escalate privileges, including reading data from other
containers, and abusing the credentials of system services, such as Kubelet._

**ReadOnlyRootFilesystem** - Requires that containers must run with a read-only
root filesystem (i.e. no writeable layer).

### FlexVolume drivers

This specifies a whiltelist of flex volume drivers that are allowed to be used
by flexVolume. An empty list or nil means there is no restriction on the drivers.
Please make sure [`volumes`](#volumes-and-file-systems) field  contains the
`flexVolume` volume type, no FlexVolume driver is allowed otherwise.

For example:

```yaml
apiVersion: extensions/v1beta1
kind: PodSecurityPolicy
metadata:
  name: allow-flex-volumes
spec:
  # ... other spec fields
  volumes:
    - flexVolume
  allowedFlexVolumes: 
    - driver: example/lvm
    - driver: example/cifs
```

### Users and groups

**RunAsUser** - Controls the what user ID containers run as.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
`runAsUser` or have the `USER` directive defined (using a numeric UID) in the
image. No default provided. Setting `allowPrivilegeEscalation=false` is strongly
recommended with this strategy.
- *RunAsAny* - No default provided. Allows any `runAsUser` to be specified.

**SupplementalGroups** - Controls which group IDs containers add.

- *MustRunAs* - Requires at least one `range` to be specified. Uses the
minimum value of the first range as the default. Validates against all ranges.
- *RunAsAny* - No default provided. Allows any `supplementalGroups` to be
specified.

### Privilege Escalation

These options control the `allowPrivilegeEscalation` container option. This bool
directly controls whether the
[`no_new_privs`](https://www.kernel.org/doc/Documentation/prctl/no_new_privs.txt)
flag gets set on the container process. This flag will prevent `setuid` binaries
from changing the effective user ID, and prevent files from enabling extra
capabilities (e.g. it will prevent the use of the `ping` tool). This behavior is
required to effectively enforce `MustRunAsNonRoot`.

**AllowPrivilegeEscalation** - Gates whether or not a user is allowed to set the
security context of a container to `allowPrivilegeEscalation=true`. This
defaults to allowed so as to not break setuid binaries. Setting it to `false`
ensures that no child process of a container can gain more privileges than its parent.

**DefaultAllowPrivilegeEscalation** - Sets the default for the
`allowPrivilegeEscalation` option. The default behavior without this is to allow
privilege escalation so as to not break setuid binaries. If that behavior is not
desired, this field can be used to default to disallow, while still permitting
pods to request `allowPrivilegeEscalation` explicitly.

### Capabilities

Linux capabilities provide a finer grained breakdown of the privileges
traditionally associated with the superuser. Some of these capabilities can be
used to escalate privileges or for container breakout, and may be restricted by
the PodSecurityPolicy. For more details on Linux capabilities, see
[capabilities(7)](http://man7.org/linux/man-pages/man7/capabilities.7.html).

The following fields take a list of capabilities, specified as the capability
name in ALL_CAPS without the `CAP_` prefix.

**AllowedCapabilities** - Provides a whitelist of capabilities that may be added
to a container. The default set of capabilities are implicitly allowed. The
empty set means that no additional capabilities may be added beyond the default
set. `*` can be used to allow all capabilities.

**RequiredDropCapabilities** - The capabilities which must be dropped from
containers. These capabilities are removed from the default set, and must not be
added. Capabilities listed in `RequiredDropCapabilities` must not be included in
`AllowedCapabilities` or `DefaultAddCapabilities`.

**DefaultAddCapabilities** - The capabilities which are added to containers by
default, in addition to the runtime defaults. See the [Docker
documentation](https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities)
for the default list of capabilities when using the Docker runtime.

### SELinux

- *MustRunAs* - Requires `seLinuxOptions` to be configured. Uses
`seLinuxOptions` as the default. Validates against `seLinuxOptions`.
- *RunAsAny* - No default provided. Allows any `seLinuxOptions` to be
specified.

### AppArmor

Controlled via annotations on the PodSecurityPolicy. Refer to the [AppArmor
documentation](/docs/tutorials/clusters/apparmor/#podsecuritypolicy-annotations).

### Seccomp

The use of seccomp profiles in pods can be controlled via annotations on the
PodSecurityPolicy. Seccomp is an alpha feature in Kubernetes.

**seccomp.security.alpha.kubernetes.io/defaultProfileName** - Annotation that
specifies the default seccomp profile to apply to containers. Possible values
are:

- `unconfined` - Seccomp is not applied to the container processes (this is the
  default in Kubernetes), if no alternative is provided.
- `docker/default` - The Docker default seccomp profile is used.
- `localhost/<path>` - Specify a profile as a file on the node located at
  `<seccomp_root>/<path>`, where `<seccomp_root>` is defined via the
  `--seccomp-profile-root` flag on the Kubelet.

**seccomp.security.alpha.kubernetes.io/allowedProfileNames** - Annotation that
specifies which values are allowed for the pod seccomp annotations. Specified as
a comma-delimited list of allowed values. Possible values are those listed
above, plus `*` to allow all profiles. Absence of this annotation means that the
default cannot be changed.

### Sysctl

Controlled via annotations on the PodSecurityPolicy. Refer to the [Sysctl documentation](
/docs/concepts/cluster-administration/sysctl-cluster/#podsecuritypolicy-annotations).
