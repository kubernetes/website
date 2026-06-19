---
layout: blog
title: "Spotlight on SIG Storage"
date: 2026-06-15
canonical_url: https://www.kubernetes.dev/blog/2026/06/15/sig-storage-spotlight-2026
slug: sig-storage-spotlight-2026
author: "Darshan Murthy (Apple)"
---

In our ongoing SIG Spotlight series, we shine a light on the groups that keep the Kubernetes project
moving forward. This time, we catch up with **[SIG
Storage](https://github.com/kubernetes/community/tree/master/sig-storage)**, the group responsible
for persistent data, volume management, and the interfaces that connect Kubernetes workloads to the
storage systems beneath them.

We spoke with [Xing Yang](https://github.com/xing-yang), Co-Chair of SIG Storage and Software
Engineer at VMware by Broadcom, about the SIG's history, the features shipping in recent Kubernetes
releases, and where storage in Kubernetes is headed as AI workloads become the norm.

## Introductions

**Could you introduce yourself and share your role(s) within SIG Storage?**

My name is [Xing Yang](https://github.com/xing-yang), a software engineer at VMware by Broadcom. I'm a co-chair in SIG Storage,
alongside another co-chair [Saad Ali](https://github.com/saad-ali) from Google. There are also two Tech Leads in SIG Storage:
[Michelle Au](https://github.com/msau42) from Google and [Jan Šafránek](https://github.com/jsafrane) from Red Hat.

**What first drew you to storage in Kubernetes, and how did you start contributing?**

I have always been working in the storage domain, so SIG Storage was a natural place for me to get
started when I began to learn Kubernetes. I started attending [SIG Storage meetings](https://github.com/kubernetes/community/blob/main/sig-storage/README.md#meetings), trying to figure
out what I could do to help. This was before the first [Container Storage Interface](https://github.com/container-storage-interface/spec/blob/master/spec.md) (CSI) release —
lots of things were still evolving. It was a very exciting time.

**What subprojects or areas do you actively maintain or review today?**

I'm a maintainer in Kubernetes CSI. There are multiple CSI sidecars — such as `csi-provisioner`,
`csi-attacher`, `csi-resizer`, and `csi-snapshotter` — that we need to release following every
Kubernetes release. I'm also a co-chair for a [Data Protection Working Group](https://github.com/kubernetes/community/blob/main/wg-data-protection/README.md) co-sponsored by SIG
Storage and [SIG Apps](https://github.com/kubernetes/community/tree/main/sig-apps). Several features have come out of that WG aimed at filling gaps in data
protection support within Kubernetes. One is [Volume Group
Snapshot](https://kubernetes.io/docs/concepts/storage/volume-group-snapshots/), which provides
crash-consistent group snapshots for multiple volumes used by an application. [Changed Block
Tracking](https://github.com/kubernetes/enhancements/issues/3314) (CBT) is another critical feature
from the DP WG designed to support efficient backups.

## About SIG Storage

**For folks who are new: what is SIG Storage, in your own words? What problems in Kubernetes are
you trying to solve?**

SIG Storage is a [Special Interest Group](https://github.com/kubernetes/community/blob/main/governance.md) focused on how to provide storage to containers running in
your Kubernetes cluster. We define standard interfaces so that a storage vendor can write a driver
and have its underlying storage system consumed by containers in Kubernetes.

**Why does Kubernetes need a dedicated storage SIG? What makes storage hard in a distributed
system?**

When Kubernetes was first introduced, it was meant for stateless workloads only. Container
applications were regarded as ephemeral and therefore did not need to persist data. However, that
changed drastically. Stateful workloads started running in Kubernetes, and we needed a dedicated
SIG to tackle the associated storage challenges. PersistentVolumeClaims, PersistentVolumes, and
StorageClasses were all introduced to provision data volumes for applications running in Kubernetes.

**How did SIG Storage originally form, and how has its mission changed over time?**

SIG Storage was formed to address the challenges of handling persistent data within Kubernetes.
Initially, PersistentVolumes were implemented as in-tree plugins, and the SIG managed those plugins
while developing core storage primitives like PersistentVolumes and PersistentVolumeClaims.

Container Storage Interface (CSI) was introduced later and played a crucial role in simplifying
storage integration, enabling third-party storage providers to develop and maintain their own
out-of-tree plugins without modifying Kubernetes core code.

With basic integration addressed by CSI, the SIG's mission expanded to include advanced storage
features that leverage the new interface. The SIG has also expanded its scope to support object
storage through the [Container Object Storage Interface](https://github.com/kubernetes-sigs/container-object-storage-interface) (COSI).

## Current work and roadmap

**What are the top features SIG Storage is actively working on right now?**

The Data Protection WG has been working on a couple of exciting features:

- **VolumeGroupSnapshot** is a Kubernetes feature enabling a crash-consistent, point-in-time
  snapshot of multiple PersistentVolumes simultaneously. This ensures data integrity for
  applications — like databases — that rely on multiple volumes by capturing all volumes in the
  group atomically, at the exact same point in time. It just moved to GA in Kubernetes v1.36.

- **CSI Changed Block Tracking (CBT)** enables efficient, incremental backups. By allowing storage
  systems to report only the blocks that have changed since the last snapshot, it significantly
  reduces the amount of data that needs to be transferred. It just moved to Beta in Kubernetes v1.36.

Another feature worth highlighting is **Container Object Storage Interface (COSI)**. COSI provides
a standard interface for provisioning and consuming object storage buckets in Kubernetes —
standardizing object storage for containerized applications much like CSI did for block and file
storage. COSI is now transitioning to `v1alpha2`, with plans for promotion to Beta in a future
release.

**What recent work from SIG Storage do you consider a "win" for users?**

The graduation of [VolumeAttributesClass](https://kubernetes.io/docs/concepts/storage/volume-attributes-classes/)
to GA in Kubernetes v1.34 is a major win for users managing stateful workloads. Previously,
changing volume attributes like IOPS or throughput required out-of-band actions or disruptive
operations. Now, users can dynamically tune storage properties such as IOPS or throughput directly
through the Kubernetes API — scaling up for peak loads or down to optimize costs — without external
processes or downtime.

VolumeAttributesClass enables dynamic modification of storage characteristics without recreating
the volume. This completes the picture by allowing users to tune both capacity and other storage
properties dynamically, just as they can now tune both CPU and memory for compute.

**Looking ahead one or two releases, what's on the roadmap that people should watch for?**

I'd like to draw attention to the [Volume Health](https://github.com/kubernetes/enhancements/issues/1432) feature. This feature is designed to offer
critical visibility into the operational status and integrity of persistent volumes. By enabling
storage drivers and the Kubernetes control plane to report issues, it allows for proactive
monitoring and identification of volume-related problems.

Currently, volume health information is reported via non-persistent events. We are actively
investigating enhancements to this feature with the goal of supporting automated remediation
capabilities in the future.

**Are there areas where you'd really like more discussion or help from the community?**

We always need help from the community to fix bugs, add tests, and help with reviews.

We'd also like to get feedback on the Alpha feature [Mutable PV
Affinity](https://github.com/kubernetes/enhancements/issues/4762), which was introduced in
Kubernetes v1.35. Use cases include migrating volumes from zonal to regional storage or migrating
from one disk type to another.

Another topic is **volume replication**. It was raised at [KubeCon Atlanta](https://www.cncf.io/reports/kubecon-cloudnativecon-north-america-2025/) and has been discussed
in the Data Protection WG. Community members interested in this topic are encouraged to join the DP
WG meetings.

**What are the biggest challenges users face today when running stateful workloads on Kubernetes?**

While Kubernetes has moved stateful workloads — like databases and AI pipelines — into the
mainstream, managing "state" in a system designed for ephemerality remains difficult:

- **Data Gravity and Storage Locality**: Pods move in seconds, but data has gravity. If a node
  fails, a pod using local storage is stuck. Operators must decide whether the failure is transient
  or permanent — a high-stakes call. This is why we are enhancing the Volume Health feature to
  provide the visibility needed to automate recovery choices.

- **Day 2 Complexity**: Setting up a database is easy; maintaining its health over time is the real
  challenge. Standard Kubernetes objects like StatefulSets offer a baseline, but they lack the
  operational logic needed for tasks such as schema upgrades, engine patching, or cluster-wide
  Kubernetes upgrades.

- **Data Mobility**: Moving persistent data remains a significant hurdle — whether migrating between
  storage tiers, shifting workloads across availability zones, or moving to a different cluster.
  This challenge includes ongoing synchronization and replication for high availability and disaster
  recovery across a distributed system.

## Storage and AI

**How do you see storage evolving in Kubernetes over the next few years, especially as AI/ML
workloads grow?**

I see several trends shaping storage in Kubernetes as it evolves from a container orchestrator into
the "Operating System" for AI:

- **More Intelligent Data Management**: We'll see a shift toward smarter CSI drivers and data
  management tools offering advanced features like automatic tiering, snapshots, migration, and
  replication — optimized specifically for high-performance AI/ML workflows and large data
  platforms.

- **Object Storage as a First-Class Citizen**: AI datasets now frequently reach exabyte scale,
  making object storage the preferred choice for AI workloads. COSI is standardizing bucket
  management just as CSI did for disks, allowing data scientists to use a BucketClaim to
  provision S3-compatible storage natively and unifying object, file, and block storage into a
  single workflow.

- **Performance and Low Latency**: For AI/ML, storage needs to keep up with GPU processing speeds.
  This will accelerate adoption of high-performance parallel file systems and NVMe-over-Fabrics
  (NVMe-oF) technologies managed natively via Kubernetes. The line between traditional block/file
  and memory-speed storage will continue to blur.

- **Data-Aware Scheduling**: Instead of just considering CPU and RAM, the Kubernetes scheduler will
  increasingly prioritize placing Pods based on data locality — calculating the cost of moving data
  versus moving compute to keep massive data platforms performant.

---

SIG Storage continues to tackle some of the hardest problems in Kubernetes: keeping stateful
applications running reliably, making storage operations transparent and composable, and now
scaling up to meet the demands of AI-era workloads. Whether you're a user managing databases in
production or a developer curious about storage internals, there's a place for you in SIG Storage.

If you'd like to get involved, check out the [SIG Storage community
page](https://www.kubernetes.dev/community/community-groups/sigs/storage/) and join the [bi-weekly
meetings](https://github.com/kubernetes/community/tree/master/sig-storage#meetings). You can also
find the SIG on Slack at
[#sig-storage](https://kubernetes.slack.com/messages/sig-storage).

- [SIG Storage Mailing List](https://groups.google.com/a/kubernetes.io/g/sig-storage)
- [SIG Storage on Slack](https://kubernetes.slack.com/messages/sig-storage)
- [Data Protection WG](https://github.com/kubernetes/community/blob/master/wg-data-protection/README.md)