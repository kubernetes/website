---
layout: blog
title: "Spotlight on SIG Storage"
slug: sig-storage-spotlight
date: 2022-08-22
canonicalUrl: https://www.kubernetes.dev/blog/2022/08/22/sig-storage-spotlight-2022/
author: >
  Frederico Muñoz (SAS)
---

Since the very beginning of Kubernetes, the topic of persistent data and how to address the requirement of stateful applications has been an important topic. Support for stateless deployments was natural, present from the start, and garnered attention, becoming very well-known. Work on better support for stateful applications was also present from early on, with each release increasing the scope of what could be run on Kubernetes.

Message queues, databases, clustered filesystems: these are some examples of the solutions that have different storage requirements and that are, today, increasingly deployed in Kubernetes. Dealing with ephemeral and persistent storage, local or remote, file or block, from many different vendors, while considering how to provide the needed resiliency and data consistency that users expect, all of this is under SIG Storage's umbrella.

In this SIG Storage spotlight, [Frederico Muñoz](https://twitter.com/fredericomunoz) (Cloud & Architecture Lead at SAS) talked with [Xing Yang](https://twitter.com/2000xyang), Tech Lead at VMware and co-chair of SIG Storage, on how the SIG is organized, what are the current challenges and how anyone can get involved and contribute.

## About SIG Storage

**Frederico (FSM)**: Hello, thank you for the opportunity of learning more about SIG Storage. Could you tell us a bit about yourself, your role, and how you got involved in SIG Storage.

**Xing Yang (XY)**: I am a Tech Lead at VMware, working on Cloud Native Storage. I am also a Co-Chair of SIG Storage. I started to get involved in K8s SIG Storage at the end of 2017, starting with contributing to the [VolumeSnapshot](/docs/concepts/storage/volume-snapshots/) project. At that time, the VolumeSnapshot project was still in an experimental, pre-alpha stage. It needed contributors. So I volunteered to help. Then I worked with other community members to bring VolumeSnapshot to Alpha in K8s 1.12 release in 2018, Beta in K8s 1.17 in 2019, and eventually GA in 1.20 in 2020.

**FSM**: Reading the [SIG Storage charter](https://github.com/kubernetes/community/blob/master/sig-storage/charter.md) alone it’s clear that SIG Storage covers a lot of ground, could you describe how the SIG is organised?

**XY**: In SIG Storage, there are two Co-Chairs and two Tech Leads. Saad Ali from Google and myself are Co-Chairs. Michelle Au from Google and Jan Šafránek from Red Hat are Tech Leads.

We have bi-weekly meetings where we go through features we are working on for each particular release, getting the statuses, making sure each feature has dev owners and reviewers working on it, and reminding people about the release deadlines, etc. More information on the SIG is on the [community page](https://github.com/kubernetes/community/tree/master/sig-storage). People can also add PRs that need attention, design proposals that need discussion, and other topics to the meeting agenda doc. We will go over them after project tracking is done.

We also have other regular meetings, i.e., CSI Implementation meeting, Object Bucket API design meeting, and one-off meetings for specific topics if needed. There is also a [K8s Data Protection Workgroup](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md) that is sponsored by SIG Storage and SIG Apps. SIG Storage owns or co-owns features that are being discussed at the Data Protection WG.

## Storage and Kubernetes

**FSM**: Storage is such a foundational component in so many things, not least in Kubernetes: what do you think are the Kubernetes-specific challenges in terms of storage management?

**XY**: In Kubernetes, there are multiple components involved for a volume operation. For example, creating a Pod to use a PVC has multiple components involved. There are the Attach Detach Controller and the external-attacher working on attaching the PVC to the pod. There’s the Kubelet that works on mounting the PVC to the pod. Of course the CSI driver is involved as well. There could be race conditions sometimes when coordinating between multiple components.

Another challenge is regarding core vs [Custom Resource Definitions](/docs/concepts/extend-kubernetes/api-extension/custom-resources/) (CRD), not really storage specific. CRD is a great way to extend Kubernetes capabilities while not adding too much code to the Kubernetes core itself. However, this also means there are many external components that are needed when running a Kubernetes cluster.

From the SIG Storage side, one most notable example is Volume Snapshot. Volume Snapshot APIs are defined as CRDs. API definitions and controllers are out-of-tree. There is a common snapshot controller and a snapshot validation webhook that should be deployed on the control plane, similar to how kube-controller-manager is deployed. Although Volume Snapshot is a CRD, it is a core feature of SIG Storage.  It is recommended for the K8s cluster distros to deploy Volume Snapshot CRDs, the snapshot controller, and the snapshot validation webhook, however, most of the time we don’t see distros deploy them. So this becomes a problem for the storage vendors: now it becomes their responsibility to deploy these non-driver specific common components. This could cause conflicts if a customer wants to use more than one storage system and deploy more than one CSI driver.

**FSM**: Not only the complexity of a single storage system, you have to consider how they will be used together in Kubernetes?

**XY**: Yes, there are many different storage systems that can provide storage to containers in Kubernetes. They don’t work the same way. It is challenging to find a solution that works for everyone.

**FSM**: Storage in Kubernetes also involves interacting with external solutions, perhaps more so than other parts of Kubernetes. Is this interaction with vendors and external providers challenging? Has it evolved with time in any way?

**XY**: Yes, it is definitely challenging. Initially Kubernetes storage had in-tree volume plugin interfaces. Multiple storage vendors implemented in-tree interfaces and have volume plugins in the Kubernetes core code base.  This caused lots of problems.  If there is a bug in a volume plugin, it affects the entire Kubernetes code base.  All volume plugins must be released together with Kubernetes. There was no flexibility if storage vendors need to fix a bug in their plugin or want to align with their own product release.

**FSM**: That’s where CSI enters the game?

**XY**: Exactly, then there comes [Container Storage Interface](https://kubernetes-csi.github.io/docs/) (CSI). This is an industry standard trying to design common storage interfaces so that a storage vendor can write one plugin and have it work across a range of container orchestration systems (CO). Now Kubernetes is the main CO, but back when CSI just started, there were Docker, Mesos, Cloud Foundry, in addition to Kubernetes. CSI drivers are out-of-tree so bug fixes and releases can happen at their own pace.

CSI is definitely a big improvement compared to in-tree volume plugins. Kubernetes implementation of CSI has been GA [since the 1.13 release](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/).  It has come a long way.  SIG Storage has been working on moving in-tree volume plugins to out-of-tree CSI drivers for several releases now.

**FSM**: Moving drivers away from the Kubernetes main tree and into CSI was an important improvement.

**XY**: CSI interface is an improvement over the in-tree volume plugin interface, however, there are still challenges. There are lots of storage systems. Currently [there are more than 100 CSI drivers listed in CSI driver docs](https://kubernetes-csi.github.io/docs/drivers.html). These storage systems are also very diverse.  So it is difficult to design a common API that works for all.  We introduced capabilities at CSI driver level, but we also have challenges when volumes provisioned by the same driver have different behaviors.  The other day we just had a meeting discussing Per Volume CSI Driver Capabilities. We have a problem differentiating some CSI driver capabilities when the same driver supports both block and file volumes.  We are going to have follow up meetings to discuss this problem.

## Ongoing challenges

**FSM**: Specifically for the [1.25 release](https://github.com/kubernetes/sig-release/tree/master/releases/release-1.25) we can see that there are a relevant number of storage-related [KEPs](https://bit.ly/k8s125-enhancements) in the pipeline, would you say that this release is particularly important for the SIG?

**XY**: I wouldn’t say one release is more important than other releases. In any given release, we are working on a few very important things.

**FSM**: Indeed, but are there any 1.25 specific specificities and highlights you would like to point out though?

**XY**: Yes. For the 1.25 release, I want to highlight the following:

* [CSI Migration](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/625-csi-migration) is an on-going effort that SIG Storage has been working on for a few releases now. The goal is to move in-tree volume plugins to out-of-tree CSI drivers and eventually remove the in-tree volume plugins.  There are 7 KEPs that we are targeting in 1.25 are related to CSI migration. There is one core KEP for the general CSI Migration feature. That is targeting GA in 1.25. CSI Migration for GCE PD and AWS EBS are targeting GA. CSI Migration for vSphere is targeting to have the feature gate on by default while staying in 1.25 that are in Beta. Ceph RBD and PortWorx are targeting Beta, with feature gate off by default. Ceph FS is targeting Alpha.
* The second one I want to highlight is [COSI, the Container Object Storage Interface](https://github.com/kubernetes-sigs/container-object-storage-interface-spec). This is a sub-project under SIG Storage. COSI proposes object storage Kubernetes APIs to support orchestration of object store operations for Kubernetes workloads. It also introduces gRPC interfaces for object storage providers to write drivers to provision buckets. The COSI team has been working on this project for more than two years now. The COSI feature is targeting Alpha in 1.25. The KEP just got merged. The COSI team is working on updating the implementation based on the updated KEP.
* Another feature I want to mention is [CSI Ephemeral Volume](https://github.com/kubernetes/enhancements/issues/596) support. This feature allows CSI volumes to be specified directly in the pod specification for ephemeral use cases. They can be used to inject arbitrary states, such as configuration, secrets, identity, variables or similar information, directly inside pods using a mounted volume.  This was initially introduced in 1.15 as an alpha feature, and it is now targeting GA in 1.25.

**FSM**: If you had to single something out, what would be the most pressing areas the SIG is working on?

**XY**: CSI migration is definitely one area that the SIG has put in lots of effort and it has been on-going for multiple releases now. It involves work from multiple cloud providers and storage vendors as well.


## Community involvement

**FSM**: Kubernetes is a community-driven project. Any recommendation for anyone looking into getting involved in SIG Storage work? Where should they start?

**XY**: Take a look at the [SIG Storage community page](https://github.com/kubernetes/community/tree/master/sig-storage), it has lots of information on how to get started. There are [SIG annual reports](https://github.com/kubernetes/community/blob/master/sig-storage/annual-report-2021.md) that tell you what we did each year. Take a look at the Contributing guide. It has links to presentations that can help you get familiar with Kubernetes storage concepts.

Join our [bi-weekly meetings on Thursdays](https://github.com/kubernetes/community/tree/master/sig-storage#meetings). Learn how the SIG operates and what we are working on for each release. Find a project that you are interested in and help out. As I mentioned earlier, I got started in SIG Storage by contributing to the Volume Snapshot project.

**FSM**: Any closing thoughts you would like to add?

**XY**: SIG Storage always welcomes new contributors. We need contributors to help with building new features, fixing bugs, doing code reviews, writing tests, monitoring test grid health, and improving documentation, etc.

**FSM**: Thank you so much for your time and insights into the workings of SIG Storage!
