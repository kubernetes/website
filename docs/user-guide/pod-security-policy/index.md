---
assignees:
- pweil-
title: Pod Security Policies
---

Objects of type `podsecuritypolicy` govern the ability 
to make requests on a pod that affect the `SecurityContext` that will be 
applied to a pod and container.

See [PodSecurityPolicy proposal](https://github.com/kubernetes/kubernetes/blob/{{page.githubbranch}}/docs/proposals/security-context-constraints.md) for more information.

* TOC
{:toc}

## What is a Pod Security Policy?

A _Pod Security Policy_ is a cluster-level resource that controls the 
actions that a pod can perform and what it has the ability to access. The
`PodSecurityPolicy` objects define a set of conditions that a pod must 
run with in order to be accepted into the system. They allow an 
administrator to control the following:

1. Running of privileged containers.
1. Capabilities a container can request to be added.
1. The SELinux context of the container.
1. The user ID.
1. The use of host namespaces and networking.
1. Allocating an FSGroup that owns the pod's volumes
1. Configuring allowable supplemental groups
1. Requiring the use of a read only root file system
1. Controlling the usage of volume types

_Pod Security Policies_ are comprised of settings and strategies that 
control the security features a pod has access to. These settings fall 
into three categories:

- *Controlled by a boolean*: Fields of this type default to the most 
restrictive value. 
- *Controlled by an allowable set*: Fields of this type are checked 
against the set to ensure their value is allowed.
- *Controlled by a strategy*: Items that have a strategy to generate a value provide
a mechanism to generate the value and a mechanism to ensure that a 
specified value falls into the set of allowable values.


## Strategies

### RunAsUser

- *MustRunAs* - Requires a `*range*` to be configured. Uses the first value
of the range as the default. Validates against the configured range.
- *MustRunAsNonRoot* - Requires that the pod be submitted with a non-zero
`*runAsUser*` or have the `USER` directive defined in the image. No default
provided.
- *RunAsAny* - No default provided. Allows any `*runAsUser*` to be specified.

### SELinuxContext

- *MustRunAs* - Requires `*seLinuxOptions*` to be configured if not using
pre-allocated values. Uses `*seLinuxOptions*` as the default. Validates against
`*seLinuxOptions*`.
- *RunAsAny* - No default provided. Allows any `*seLinuxOptions*` to be
specified.

### SupplementalGroups

- *MustRunAs* - Requires at least one range to be specified. Uses the 
minimum value of the first range as the default. Validates against all ranges.
- *RunAsAny* - No default provided. Allows any `*supplementalGroups*` to be
specified.

### FSGroup

- *MustRunAs* - Requires at least one range to be specified. Uses the 
minimum value of the first range as the default. Validates against the 
first ID in the first range.
- *RunAsAny* - No default provided. Allows any `*fsGroup*` ID to be specified.

### Controlling Volumes

The usage of specific volume types can be controlled by setting the 
volumes field of the PSP. The allowable values of this field correspond 
to the volume sources that are defined when creating a volume:

1. azureFile
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
1. \* (allow all volumes)

The recommended minimum set of allowed volumes for new PSPs are 
configMap, downwardAPI, emptyDir, persistentVolumeClaim, and secret.

## Admission

_Admission control_ with `PodSecurityPolicy` allows for control over the creation of resources
based on the capabilities allowed in the cluster.

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

{% include code.html language="yaml" file="psp.yaml" ghlink="/docs/user-guide/pod-security-policy/psp.yaml" %}

Create the policy by downloading the example file and then running this command:

```shell
$ kubectl create -f ./psp.yaml
podsecuritypolicy "permissive" created
```

## Deleting a Pod Security Policy

Once you don't need a policy anymore, simply delete it with `kubectl`:

```shell
$ kubectl delete psp permissive
podsecuritypolicy "permissive" deleted
```

## Enabling Pod Security Policies

In order to use Pod Security Policies in your cluster you must ensure the 
following

1.  You have enabled the api type `extensions/v1beta1/podsecuritypolicy`
1.  You have enabled the admission controller `PodSecurityPolicy`
1.  You have defined your policies

## Working With RBAC

Use PodSecurityPolicy to control access to privileged containers based on role and groups.
(see [more details](https://github.com/kubernetes/kubernetes/blob/master/examples/podsecuritypolicy/rbac/README.md)).
