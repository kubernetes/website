---
layout: blog
title: "Introducing COSI: Object Storage Management using Kubernetes APIs"
date: 2022-09-02
slug: cosi-kubernetes-object-storage-management
author: >
  Sidhartha Mani ([Minio, Inc](https://min.io))
---

This article introduces the Container Object Storage Interface (COSI), a standard for provisioning and consuming object storage in Kubernetes. It is an alpha feature in Kubernetes v1.25.

File and block storage are treated as first class citizens in the Kubernetes ecosystem via [Container Storage Interface](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/) (CSI). Workloads using CSI volumes enjoy the benefits of portability across vendors and across Kubernetes clusters without the need to change application manifests. An equivalent standard does not exist for Object storage.

Object storage has been rising in popularity in recent years as an alternative form of storage to filesystems and block devices. Object storage paradigm promotes disaggregation of compute and storage. This is done by making data available over the network, rather than locally. Disaggregated architectures allow compute workloads to be stateless, which consequently makes them easier to manage, scale and automate.

## COSI
 
COSI aims to standardize consumption of object storage to provide the following benefits:

* Kubernetes Native - Use the Kubernetes API to provision, configure and manage buckets
* Self Service - A clear delineation between administration and operations (DevOps) to enable self-service capability for DevOps personnel
* Portability - Vendor neutrality enabled through portability across Kubernetes Clusters and across Object Storage vendors

_Portability across vendors is only possible when both vendors support a common datapath-API. Eg. it is possible to port from AWS S3 to Ceph, or AWS S3 to MinIO and back as they all use S3 API. In contrast, it is not possible to port from AWS S3 and Google Cloud’s GCS or vice versa._

## Architecture

COSI is made up of three components:

* COSI Controller Manager
* COSI Sidecar
* COSI Driver

The COSI Controller Manager acts as the main controller that processes changes to COSI API objects. It is responsible for fielding requests for bucket creation, updates, deletion and access management. One instance of the controller manager is required per kubernetes cluster. Only one is needed even if multiple object storage providers are used in the cluster. 

The COSI Sidecar acts as a translator between COSI API requests and vendor-specific COSI Drivers. This component uses a standardized gRPC protocol that vendor drivers are expected to satisfy. 

The COSI Driver is the vendor specific component that receives requests from the sidecar and calls the appropriate vendor APIs to create buckets, manage their lifecycle and manage access to them. 

## API

The COSI API is centered around buckets, since bucket is the unit abstraction for object storage. COSI defines three Kubernetes APIs aimed at managing them

* Bucket
* BucketClass
* BucketClaim

In addition, two more APIs for managing access to buckets are also defined:

* BucketAccess
* BucketAccessClass

In a nutshell, Bucket and BucketClaim can be considered to be similar to PersistentVolume and PersistentVolumeClaim respectively. The BucketClass’ counterpart in the file/block device world is StorageClass. 

Since Object Storage is always authenticated, and over the network, access credentials are required to access buckets. The two APIs, namely, BucketAccess and BucketAccessClass are used to denote access credentials and policies for authentication. More info about these APIs can be found in the official COSI proposal - https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1979-object-storage-support

## Self-Service

Other than providing kubernetes-API driven bucket management, COSI also aims to empower DevOps personnel to provision and manage buckets on their own, without admin intervention. This, further enabling dev teams to realize faster turn-around times and faster time-to-market. 

COSI achieves this by dividing bucket provisioning steps among two different stakeholders, namely the administrator (admin), and the cluster operator. The administrator will be responsible for setting broad policies and limits on how buckets are provisioned, and how access is obtained for them. The cluster operator will be free to create and utilize buckets within the limits set by the admin. 

For example, a cluster operator could use an admin policy could be used to restrict maximum provisioned capacity to 100GB, and developers would be allowed to create buckets and store data upto that limit. Similarly for access credentials, admins would be able to restrict who can access which buckets, and developers would be able to access all the buckets available to them.

## Portability

The third goal of COSI is to achieve vendor neutrality for bucket management. COSI enables two kinds of portability:

* Cross Cluster
* Cross Provider

Cross Cluster portability is allowing buckets provisioned in one cluster to be available in another cluster. This is only valid when the object storage backend itself is accessible from both clusters.

Cross-provider portability is about allowing organizations or teams to move from one object storage provider to another seamlessly, and without requiring changes to application definitions (PodTemplates, StatefulSets, Deployment and so on). This is only possible if the source and destination providers use the same data. 

_COSI does not handle data migration as it is outside of its scope. In case porting between providers requires data to be migrated as well, then other measures need to be taken to ensure data availability._

## What’s next

The amazing sig-storage-cosi community has worked hard to bring the COSI standard to alpha status. We are looking forward to onboarding a lot of vendors to write COSI drivers and become COSI compatible! 

We want to add more authentication mechanisms for COSI buckets, we are designing advanced bucket sharing primitives, multi-cluster bucket management and much more. Lots of great ideas and opportunities ahead! 

Stay tuned for what comes next, and if you have any questions, comments or suggestions

* Chat with us on the Kubernetes [Slack:#sig-storage-cosi](https://kubernetes.slack.com/archives/C017EGC1C6N)
* Join our [Zoom meeting](https://zoom.us/j/614261834?pwd=Sk1USmtjR2t0MUdjTGVZeVVEV1BPQT09), every Thursday at 10:00 Pacific Time
* Participate in the [bucket API proposal PR](https://github.com/kubernetes/enhancements/pull/2813) to add your ideas, suggestions and more.

