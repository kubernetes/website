---
assignees:
- pweil-
title: Pod Security Policies
redirect_from:
- "/docs/user-guide/pod-security-policy/"
- "/docs/user-guide/pod-security-policy/index.html"
---

Objects of type `PodSecurityPolicy` govern the ability
to make requests on a pod that affect the `SecurityContext` that will be 
applied to a pod and container.

See [PodSecurityPolicy proposal](https://git.k8s.io/community/contributors/design-proposals/security-context-constraints.md) for more information.

* TOC
{:toc}

## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls the 
actions that a pod can perform and what it has the ability to access. The
`PodSecurityPolicy` objects define a set of conditions that a pod must 
run with in order to be accepted into the system. They allow an 
administrator to control the following:

| Control Aspect                                                | Field Name                        |
| ------------------------------------------------------------- | --------------------------------- |
| Running of privileged containers                              | `privileged`                      |
| Default set of capabilities that will be added to a container | `defaultAddCapabilities`          |
| Capabilities that will be dropped from a container            | `requiredDropCapabilities`        |
| Capabilities a container can request to be added              | `allowedCapabilities`             |
| Controlling the usage of volume types                         | [`volumes`](#controlling-volumes) |
| The use of host networking                                    | [`hostNetwork`](#host-network)    |
| The use of host ports                                         | `hostPorts`                       |
| The use of host's PID namespace                               | `hostPID`                         |
| The use of host's IPC namespace                               | `hostIPC`                         |
| The use of host paths                                         | [`allowedHostPaths`](#allowed-host-paths)    |
| The SELinux context of the container                          | [`seLinux`](#selinux)             |
| The user ID                                                   | [`runAsUser`](#runasuser)         |
| Configuring allowable supplemental groups                     | [`supplementalGroups`](#supplementalgroups) |
| Allocating an FSGroup that owns the pod's volumes             | [`fsGroup`](#fsgroup)             |
| Requiring the use of a read only root file system             | `readOnlyRootFilesystem`          |

_Pod Security Policies_ are comprised of settings and strategies that 
control the security features a pod has access to. These settings fall 
into three categories:

- *Controlled by a boolean*: Fields of this type default to the most 
restrictive value. 
- *Controlled by an allowable set*: Fields of this type are checked 
against the set to ensure their value is allowed.
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

### Allowed Host Paths
 - *AllowedHostPaths* is a white list of allowed host path prefixes. Empty indicates that all host paths may be used.

## Admission

_Admission control_ with `PodSecurityPolicy` allows for control over the
creation and modification of resources based on the capabilities allowed in the cluster.

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

1.  You have enabled the api type `extensions/v1beta1/podsecuritypolicy` (only for versions prior 1.6)
1.  You have enabled the admission controller `PodSecurityPolicy`
1.  You have defined your policies

## Working With RBAC

In Kubernetes 1.5 and newer, you can use PodSecurityPolicy to control access to privileged containers based on user role and groups. Access to different PodSecurityPolicy objects can be controlled via authorization. To limit access to PodSecurityPolicy objects for pods created via a Deployment, ReplicaSet, etc, the [Controller Manager](/docs/admin/kube-controller-manager/) must be run against the secured API port, and must not have superuser permissions.

PodSecurityPolicy authorization uses the union of all policies available to the user creating the pod and the service account specified on the pod. When pods are created via a Deployment, ReplicaSet, etc, it is Controller Manager that creates the pod, so if it is running against the unsecured API port, all PodSecurityPolicy objects would be allowed, and you could not effectively subdivide access. Access to given PSP policies for a user will be effective only when deploying Pods directly. For more details, see the [PodSecurityPolicy RBAC example](https://git.k8s.io/kubernetes/examples/podsecuritypolicy/rbac/README.md) of applying PodSecurityPolicy to control access to privileged containers based on role and groups when deploying Pods directly.
