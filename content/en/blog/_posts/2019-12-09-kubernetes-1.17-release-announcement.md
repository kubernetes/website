---
layout: blog
title: "Kubernetes 1.17: Stability"
date: 2019-12-09T13:00:00-08:00
slug: kubernetes-1-17-release-announcement
---

**Authors:** [Kubernetes 1.17 Release Team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md)

We’re pleased to announce the delivery of Kubernetes 1.17, our fourth and final release of 2019! Kubernetes v1.17 consists of 22 enhancements: 14 enhancements have graduated to stable, 4 enhancements are moving to beta, and 4 enhancements are entering alpha.

## Major Themes

### Cloud Provider Labels reach General Availability

Added as a beta feature way back in v1.2, v1.17 sees the general availability of cloud provider labels.

### Volume Snapshot Moves to Beta

The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced as alpha in Kubernetes v1.12, with a second alpha with breaking changes in Kubernetes v1.13.

### CSI Migration Beta

The Kubernetes in-tree storage plugin to Container Storage Interface (CSI) migration infrastructure is now beta in Kubernetes v1.17. CSI migration was introduced as alpha in Kubernetes v1.14.

## Cloud Provider Labels reach General Availability

When nodes and volumes are created, a set of standard labels are applied based on the underlying cloud provider of the Kubernetes cluster. Nodes get a label for the instance type. Both nodes and volumes get two labels describing the location of the resource in the cloud provider topology, usually organized in zones and regions.

Standard labels are used by Kubernetes components to support some features. For example, the scheduler would ensure that pods are placed on the same zone as the volumes they claim; and when scheduling pods belonging to a deployment, the scheduler would prioritize spreading them across zones. You can also use the labels in your pod specs to configure things as such node affinity. Standard labels allow you to write pod specs that are portable among different cloud providers.

The labels are reaching general availability in this release. Kubernetes components have been updated to populate the GA and beta labels and to react to both. However, if you are using the beta labels in your pod specs for features such as node affinity, or in your custom controllers, we recommend that you start migrating them to the new GA labels. You can find the documentation for the new labels here:

- [node.kubernetes.io/instance-type](/docs/reference/labels-annotations-taints/#nodekubernetesioinstance-type)
- [topology.kubernetes.io/region](/docs/reference/labels-annotations-taints/#topologykubernetesioregion)
- [topology.kubernetes.io/zone](/docs/reference/labels-annotations-taints/#topologykubernetesiozone)

## Volume Snapshot Moves to Beta

The Kubernetes Volume Snapshot feature is now beta in Kubernetes v1.17. It was introduced as alpha in Kubernetes v1.12, with a second alpha with breaking changes in Kubernetes v1.13.  This post summarizes the changes in the beta release.

### What is a Volume Snapshot?

Many storage systems (like Google Cloud Persistent Disks, Amazon Elastic Block Storage, and many on-premise storage systems) provide the ability to create a “snapshot” of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to provision a new volume (pre-populated with the snapshot data) or to restore an existing volume to a previous state (represented by the snapshot).

### Why add Volume Snapshots to Kubernetes?

The Kubernetes volume plugin system already provides a powerful abstraction that automates the provisioning, attaching, and mounting of block and file storage.

Underpinning all these features is the Kubernetes goal of workload portability: Kubernetes aims to create an abstraction layer between distributed systems applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster specific” knowledge.

The Kubernetes Storage SIG identified snapshot operations as critical functionality for many stateful workloads. For example, a database administrator may want to snapshot a database volume before starting a database operation.

By providing a standard way to trigger snapshot operations in the Kubernetes API, Kubernetes users can now handle use cases like this without having to go around the Kubernetes API (and manually executing storage system specific operations).

Instead, Kubernetes users are now empowered to incorporate snapshot operations in a cluster agnostic way into their tooling and policy with the comfort of knowing that it will work against arbitrary Kubernetes clusters regardless of the underlying storage.

Additionally these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced, enterprise grade, storage administration features for Kubernetes: including application or cluster level backup solutions.

You can read more in the blog entry about [releasing CSI volume snapshots to beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-cis-volume-snapshot-beta/).

## CSI Migration Beta

### Why are we migrating in-tree plugins to CSI?

Prior to CSI, Kubernetes provided a powerful volume plugin system. These volume plugins were “in-tree” meaning their code was part of the core Kubernetes code and shipped with the core Kubernetes binaries. However, adding support for new volume plugins to Kubernetes was challenging. Vendors that wanted to add support for their storage system to Kubernetes (or even fix a bug in an existing volume plugin) were forced to align with the Kubernetes release process. In addition, third-party storage code caused reliability and security issues in core Kubernetes binaries and the code was often difficult (and in some cases impossible) for Kubernetes maintainers to test and maintain. Using the Container Storage Interface in Kubernetes resolves these major issues.

As more CSI Drivers were created and became production ready, we wanted all Kubernetes users to reap the benefits of the CSI model. However, we did not want to force users into making workload/configuration changes by breaking the existing generally available storage APIs. The way forward was clear - we would have to replace the backend of the “in-tree plugin” APIs with CSI.
What is CSI migration?

The CSI migration effort enables the replacement of existing in-tree storage plugins such as `kubernetes.io/gce-pd` or `kubernetes.io/aws-ebs` with a corresponding CSI driver. If CSI Migration is working properly, Kubernetes end users shouldn’t notice a difference. After migration, Kubernetes users may continue to rely on all the functionality of in-tree storage plugins using the existing interface.

When a Kubernetes cluster administrator updates a cluster to enable CSI migration, existing stateful deployments and workloads continue to function as they always have; however, behind the scenes Kubernetes hands control of all storage management operations (previously targeting in-tree drivers) to CSI drivers.

The Kubernetes team has worked hard to ensure the stability of storage APIs and for the promise of a smooth upgrade experience. This involves meticulous accounting of all existing features and behaviors to ensure backwards compatibility and API stability. You can think of it like changing the wheels on a racecar while it’s speeding down the straightaway.

You can read more in the blog entry about [CSI migration going to beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-csi-migration-beta/).

## Other Updates

### Graduated to Stable 💯

- [Taint Node by Condition](https://github.com/kubernetes/enhancements/issues/382)
- [Configurable Pod Process Namespace Sharing](https://github.com/kubernetes/enhancements/issues/495)
- [Schedule DaemonSet Pods by kube-scheduler](https://github.com/kubernetes/enhancements/issues/548)
- [Dynamic Maximum Volume Count](https://github.com/kubernetes/enhancements/issues/554)
- [Kubernetes CSI Topology Support](https://github.com/kubernetes/enhancements/issues/557)
- [Provide Environment Variables Expansion in SubPath Mount](https://github.com/kubernetes/enhancements/issues/559)
- [Defaulting of Custom Resources](https://github.com/kubernetes/enhancements/issues/575)
- [Move Frequent Kubelet Heartbeats To Lease Api](https://github.com/kubernetes/enhancements/issues/589)
- [Break Apart The Kubernetes Test Tarball](https://github.com/kubernetes/enhancements/issues/714)
- [Add Watch Bookmarks Support](https://github.com/kubernetes/enhancements/issues/956)
- [Behavior-Driven Conformance Testing](https://github.com/kubernetes/enhancements/issues/960)
- [Finalizer Protection For Service Loadbalancers](https://github.com/kubernetes/enhancements/issues/980)
- [Avoid Serializing The Same Object Independently For Every Watcher](https://github.com/kubernetes/enhancements/issues/1152)

### Major Changes

- [Add IPv4/IPv6 Dual Stack Support](https://github.com/kubernetes/enhancements/issues/563)

### Other Notable Features

- [Topology Aware Routing of Services (Alpha)](https://github.com/kubernetes/enhancements/issues/536)
- [RunAsUserName for Windows](https://github.com/kubernetes/enhancements/issues/1043)

### Availability

Kubernetes 1.17 is available for [download on GitHub](https://github.com/kubernetes/kubernetes/releases/tag/v1.17.0). To get started with Kubernetes, check out these [interactive tutorials](https://kubernetes.io/docs/tutorials/). You can also easily install 1.17 using [kubeadm](https://kubernetes.io/docs/setup/independent/create-cluster-kubeadm/).

### Release Team

This release is made possible through the efforts of hundreds of individuals who contributed both technical and non-technical content. Special thanks to the [release team](https://github.com/kubernetes/sig-release/blob/master/releases/release-1.17/release_team.md) led by Guinevere Saenger. The 35 individuals on the release team coordinated many aspects of the release, from documentation to testing, validation, and feature completeness.

As the Kubernetes community has grown, our release process represents an amazing demonstration of collaboration in open source software development. Kubernetes continues to gain new users at a rapid pace. This growth creates a positive feedback cycle where more contributors commit code creating a more vibrant ecosystem. Kubernetes has had over [39,000 individual contributors](https://k8s.devstats.cncf.io/d/24/overall-project-statistics?orgId=1) to date and an active community of more than 66,000 people.


### Webinar

Join members of the Kubernetes 1.17 release team on Jan 7th, 2020 to learn about the major features in this release. Register [here](https://zoom.us/webinar/register/9315759188139/WN_kPOZA_6RTjeGdXTG7YFO3A).

### Get Involved

The simplest way to get involved with Kubernetes is by joining one of the many [Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md) (SIGs) that align with your interests. Have something you’d like to broadcast to the Kubernetes community? Share your voice at our weekly [community meeting](https://github.com/kubernetes/community/tree/master/communication), and through the channels below. Thank you for your continued feedback and support.

- Follow us on Twitter [@Kubernetesio](https://twitter.com/kubernetesio) for latest updates
- Join the community discussion on [Discuss](https://discuss.kubernetes.io/)
- Join the community on [Slack](http://slack.k8s.io/)
- Post questions (or answer questions) on [Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)
- Share your Kubernetes [story](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)
