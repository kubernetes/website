---
layout: blog
title: "Container Object Storage Interface (COSI) Updates in v1alpha2"
slug: eviction-request-api
canonicalUrl: https://www.kubernetes.dev/blog/2026/XX/XX/container-object-storage-interface-v1alpha2
date: 2026-XX-XX
draft: true
author: >
  [Blaine Gardner](https://github.com/BlaineEXE) (IBM)
---

We're excited to announce that Container Object Storage Interface (COSI) is moving forward with a v1alpha2 release alongside Kubernetes v1.36.
COSI is a standard for provisioning and consuming object storage in Kubernetes. It was [introduced](https://kubernetes.io/blog/2022/09/02/cosi-kubernetes-object-storage-management/) as an alpha feature alongside Kubernetes v1.25.

File and block storage first class citizens in the Kubernetes ecosystem via Persistent Volumes and [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI). Workloads using CSI volumes enjoy the benefits of portability across vendors and across Kubernetes clusters without the need to change application manifests. COSI is the equivalent standard for object storage.

Object storage has been rising in popularity in recent years as an alternative form of storage to filesystems and block devices. Object storage promotes disaggregation of compute and storage by making data available over the network, rather than locally. Disaggregated architectures allow compute workloads to be stateless, making them easier to manage, scale, and automate. It is especially important today to support the huge, unstructured data stores used by AI/ML workloads.

## What is COSI

COSI aims to standardize consumption of object storage to provide the following benefits:

* Kubernetes Nativeness - Use the Kubernetes API to provision, configure, and manage buckets and bucket access
* Self Service - A clear delineation between administration and operations (DevOps) to enable self-service capability for DevOps personnel
* Portability - Vendor neutrality enabled through portability across Kubernetes clusters and across object storage vendors

_Portability across vendors is only possible when both vendors support a common object storage protocol. E.g., it is possible to port a spec from one S3-compatible vendor to another, but it is not possible to port from an S3-compatible vendor to a Googl-Cloud-Storage-compatible or Azure-compatible vendor._

### COSI as an End User

The COSI APIs exposed to cluster administrators and application developers (DevOps) will be familiar to anyone who has used StorageClasses and Persistent Volume Claims. For the object storage paradigm, data and data access credentials are managed independently, and COSI exposes this separation through its custom resource kinds.

Buckets (Azure Blob calls them containers) are the unit of abstraction for object storage data. COSI defines three Kubernetes APIs for managing them:

* **Buckets** - analogous to Persistent Volumes - These are managed automatically by COSI for dynamic provisioning or manually by storage administrators for static provisioning.
* **BucketClaims** - analogous to Persistent Volume Claims - These are created by application developers to request access to object storage.
* **BucketClasses** - analogous to Storage Classes - These are created by storage administrators to configure how backend buckets are created in response to BucketClaims that reference the class.

COSI defines two additional types for managing access to buckets:

* **BucketAccesses** - somewhat analogous to Persistent Volume Claims - These are created by application developers to request access to one or more BucketClaims. Because access does not affect data persistence, all BucketAccesses are provisioned dynamically.
* **BucketAccessClasses** - analogous to Storage Classes - These are created by storage administrators to configure backend accounts created in response to BucketAccesses that reference the class.

Object storage clients, even those working with the same protocol, are highly varied in their configuration. Because of this variance, there is no COSI analogue for mounting BucketClaims to application Pods. Instead, when a BucketAccess is provisioned, COSI generates a Secret for each accessed BucketClaim that contains necessary information for developers to find the bucket and access its data. Users can consume the Secrets in the way that best fits their applications's needs. Most commonly, we anticipate Secrets will be mounted as environment variables or volumes in a Pod.

The [official COSI website](https://container-object-storage-interface.sigs.k8s.io/) should be the main source of documentation for administrators and developers using COSI.

#### Example Scenarios

COSI's API allows for flexibility that is critical for many applications that consume object storage.

COSI allows developers to request a single Bucket Access that works with multiple Bucket Claims. This could be used to provision object storage for self-hosting an application like GitLab which stores various kinds of artifacts in separate buckets and which expects a single account to be able to access all buckets.

COSI also allows developers to request multiple Bucket Accesses that work with a single Bucket Claim. This is useful for many scenarios including A/B testing an application change. If auditing becomes necessary, it may be important for application version A to have separate credentials from B, even while they access the same underlying data.

The above 1-to-many and many-to-one BucketAccess-to-BucketClaim relationships exemplified above can also be used in conjunction. COSI allows the flexibility to migrate from GitLab instance A (with BucketAccess A) to GitLab instance B (with BucketAccess B) while both GitLab instances are able to read and write artifacts to the same set of BucketClaims.

### COSI as a Vendor Driver Developer

COSI's vendor experience is modeled after Container Storage Interface (CSI). Indeed, it's no mistake that Container **Object** Storage Interface has reuses the same naming structure. CSI maintainers and developers have had a big hand in helping ensure the COSI project meets the needs and expectations of CSI users, as well as helping improve on a few details from lessons learned in CSI.

As with CSI, COSI is designed such that drivers interface with a gRPC client which runs via an official COSI sidecar. In the case of COSI, there is a single sidecar, reflecting COSI's smaller set of RPC APIs.

As a driver developer, the COSI [KEP](https://github.com/kubernetes/enhancements/blob/ee22fae0f678e184400bcd4fd3281c2743be296b/keps/sig-storage/1979-object-storage-support/README.md#cosi-driver-grpc-api) should be used as a supplementary source of documentation for understanding COSI at a high level. The COSI repo additionally codifies additional nuances about [gRPC calls](https://github.com/kubernetes-sigs/container-object-storage-interface/blob/main/proto/spec.md), parameters, returns, and error handling. And finally, the [official COSI website](https://container-object-storage-interface.sigs.k8s.io/) also contains additional information for driver developers getting started.

## What's new in v1alpha2

* Bucket Accesses can now request access to multiple Bucket Claims, COSI's most-requested feature from early feedback.
* Bucket Access Secrets now encode bucket info and credentials into separate data fields instead of a single JSON blob. The JSON blob was an irreconcilable pain point for several v1alpha1 users.
* Bucket Accesses can request ReadOnly, WriteOnly, or ReadWrite access to Bucket Claims. Read/Write configuration has been a common request.
* Read/Write access is split into 3 categories: object data, object metadata, and bucket metadata. Administrators can limit access modes via Bucket Access Classes.
* COSI modified its internal architecture to remove some RBAC requirements from the COSI Sidecar and therefore from vendor drivers.

There are many other smaller [changes outlined in the v1alpha2 KEP](https://github.com/kubernetes/enhancements/blob/ee22fae0f678e184400bcd4fd3281c2743be296b/keps/sig-storage/1979-object-storage-support/README.md#v1alpha1-to-v1alpha2)

## Get involved

After v1alpha2, COSI maintainers's hope to target v1beta1. User and vendor engagement is critical for helping us get it right, and we hope to hear from you.

Stay tuned for what comes next, and if you have questions or feedback, or want to help out:

* Chat with us on the [Kubernetes Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* File a [GitHub issue](https://github.com/kubernetes-sigs/container-object-storage-interface/issues)
* Join our [Zoom meeting](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09), every Thursday at 10:30 Pacific Time
