---
reviewers:
- sig-api-machinery
- sig-architecture
- sig-cli
- sig-cluster-lifecycle
- sig-node
- sig-release
title: Kubernetes Version and Version Skew Support Policy
content_template: templates/concept
weight: 70
---

{{% capture overview %}}
This document describes the maximum version skew supported between various Kubernetes components.
Specific cluster deployment tools may place additional restrictions on version skew.
{{% /capture %}}

{{% capture body %}}

## Supported versions

Kubernetes versions are expressed as **x.y.z**,
where **x** is the major version, **y** is the minor version, and **z** is the patch version, following [Semantic Versioning](http://semver.org/) terminology.
For more information, see [Kubernetes Release Versioning](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/release/versioning.md#kubernetes-release-versioning).

The Kubernetes project maintains release branches for the most recent three minor releases,
and expects users to be running those versions in production.

Applicable bug and security fixes may be backported to those three release branches, depending on severity and feasibility.
Patch releases are cut from those branches at a regular cadence,
or on an as-needed basis as determined by the [patch release manager](https://github.com/kubernetes/sig-release/blob/master/release-team/role-handbooks/patch-release-manager/README.md#release-timing).
The patch release manager is listed in the [release team for each release](https://github.com/kubernetes/sig-release/tree/master/releases/).

With minor releases happening approximately every three months,
that means each minor release is maintained for approximately nine months.

## Supported version skew

### `kube-apiserver`

In multi-server clusters, the newest and oldest `kube-apiserver` instances must be within one minor version.

Example:

* newest `kube-apiserver` is at **1.13**
* other `kube-apiserver` instances are supported at **1.13** and **1.12**

### `kubelet`

`kubelet` must not be newer than `kube-apiserver`, and may be up to two minor versions older.

Example:

* `kube-apiserver` is at **1.13**
* `kubelet` is supported at **1.13**, **1.12**, and **1.11**

Note that if version skew exists between `kube-apiserver` instances in a multi-server cluster, this narrows the allowed `kubelet` versions.

Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kubelet` is supported at **1.12**, and **1.11** (**1.13** is not supported because that would be newer than the `kube-apiserver` instance at version **1.12**)

### `kube-controller-manager` and `kube-scheduler`

`kube-controller-manager` and `kube-scheduler` must not be newer than the `kube-apiserver` instances they communicate with. They are expected to match the `kube-apiserver` minor version, but may be up to one minor version older (to allow live upgrades).

Example:

* `kube-apiserver` is at **1.13**
* `kube-controller-manager` and `kube-scheduler` are supported at **1.13** and **1.12**

Note that if version skew exists between `kube-apiserver` instances in a multi-server cluster, and `kube-controller-manager` or `kube-scheduler` can communicate with any `kube-apiserver` instance in the cluster (for example, via a load balancer), this narrows the allowed `kube-controller-manager` or `kube-scheduler` versions.

Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kube-controller-manager` and `kube-scheduler` communicate with a load balancer that can route to any `kube-apiserver` instance
* `kube-controller-manager` and `kube-scheduler` are supported at **1.12** (**1.13** is not supported because that would be newer than the `kube-apiserver` instance at version **1.12**)

### `kubectl`

`kubectl` is supported within one minor version (older or newer) of `kube-apiserver`.

Example:

* `kube-apiserver` is at **1.13**
* `kubectl` is supported at **1.14**, **1.13**, and **1.12**

Note that if version skew exists between `kube-apiserver` instances in a multi-server cluster, this narrows the supported `kubectl` versions.

Example:

* `kube-apiserver` instances are at **1.13** and **1.12**
* `kubectl` is supported at **1.13** and **1.12** (other versions would be more than one minor version skewed from one of the `kube-apiserver` components)

## Supported component upgrade order

The supported version skew between components has implications on the order in which components must be upgraded.
This section describes the order in which components must be upgraded to transition an existing cluster from version **1.n** to version **1.(n+1)**.

### `kube-apiserver`

Pre-requisites:

* In a multi-server cluster, other `kube-apiserver` instances are at **1.n** or **1.(n+1)** (this ensures maximum skew of 1 minor version between the oldest and newest `kube-apiserver` instance)
* The `kube-controller-manager` and `kube-scheduler` instances that communicate with this server are at version **1.n** (this ensures they are not newer than the existing API server version, and are within 1 minor version of the new API server version)
* `kubelet` instances on all nodes are at version **1.n** or **1.(n-1)** (this ensures they are not newer than the existing API server version, and are within 2 minor versions of the new API server version)
* Registered admission webhooks are capable of understanding all the versions of REST resources they are registered for (including any new versions available in **1.(n+1)**)

Upgrade `kube-apiserver` to **1.(n+1)**

### `kube-controller-manager` and `kube-scheduler`

Pre-requisites:

* The `kube-apiserver` instances these components communicate with are at **1.(n+1)** (in multi-server clusters in which these control plane components communicate with any `kube-apiserver` instance in the cluster, all `kube-apiserver` instances must be upgraded before upgrading these components)

Upgrade `kube-controller-manager` and `kube-scheduler` to **1.(n+1)**

### `kubelet`

Pre-requisites:

* The `kube-apiserver` instances the `kubelet` communicates with are at **1.(n+1)**

Optionally upgrade `kubelet` instances to **1.(n+1)** (or they can be left at **1.n** or **1.(n-1)**)
