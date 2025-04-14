---
layout: blog
title: 'Announcing Changed Block Tracking API in Kubernetes v1.33'
date: 2025-XX-XX
draft: true
slug: csi-changed-block-tracking
author: >
   Prasad Ghangal (Veeam Kasten)
---

We're excited to announce that Kubernetes v1.33 introduces alpha support for the **Changed Block Tracking (CBT) API**. This new feature enhances the Kubernetes storage ecosystem by providing an efficient way to identify changed blocks in volume snapshots, enabling faster and more resource-efficient backup operations.

## What is changed block tracking?

The Changed Block Tracking API introduces a new Container Storage Interface (CSI) capability that allows you to:

- Identify allocated blocks within a CSI volume snapshot
- Determine changed blocks between two snapshots of the same volume

For Kubernetes users managing large datasets, this means significantly more efficient backup processes, as backup applications can now focus only on blocks that have actually changed rather than processing entire volumes.

## Why add changed block tracking API to Kubernetes

As Kubernetes adoption grows for stateful workloads managing critical data, the need for efficient backup solutions becomes increasingly important. Traditional full backup approaches face challenges with:

- Long backup windows
- High resource utilization
- Increased storage costs

The CBT API addresses these challenges by providing native Kubernetes support for incremental backup capabilities through the CSI interface.

## Key components

The implementation consists of three primary components:

1. **CSI SnapshotMetadata Service API**: A gRPC service that provides information about volume snapshots, including changed block data
2. **SnapshotMetadataService Custom Resource**: Advertises the availability of a CSI driver's metadata service along with connection details
3. **ExternalSnapshotMetadata Sidecar**: Implements the server-side of the API, bridging CSI drivers with backup applications

## Getting started

To use the Changed Block Tracking API in your cluster:

1. Ensure your CSI driver supports volume snapshots and implements the snapshot metadata capabilities with the required `external-snapshot-metadata` sidecar
2. Verify the presence of a SnapshotMetadataService Custom Resource for your CSI driver
3. Create clients that can access the API using appropriate authentication (via Kubernetes ServiceAccount tokens)

The API provides two main functions:

- `GetMetadataAllocated`: Lists blocks allocated in a single snapshot
- `GetMetadataDelta`: Lists blocks changed between two snapshots

## What’s next?

Depending on feedback and adoption, the Kubernetes developers hope to push the CSI Snapshot Metadata implementation to Beta in the future releases.

## Where can I learn more?

For those interested in trying out this new feature:

- Official Kubernetes CSI Developer [Documentation](https://kubernetes-csi.github.io/docs/external-snapshot-metadata.html)
- The [enhancement proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/3314-csi-changed-block-tracking) for the snapshot metadata feature.
- [GitHub repository](https://github.com/kubernetes-csi/external-snapshot-metadata) for implementation and release status of `external-snapshot-metadata`
- Complete gRPC protocol definitions for snapshot metadata API: [schema.proto](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto)
- Example snapshot metadata client implementation: [snapshot-metadata-lister](https://github.com/kubernetes-csi/external-snapshot-metadata/tree/main/examples/snapshot-metadata-lister)
- End-to-end example with csi-hostpath-driver: [example documentation](https://github.com/kubernetes-csi/csi-driver-host-path/blob/master/docs/example-ephemeral.md)


## How do I get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together. On behalf of SIG Storage, I would like to offer a huge thank you to the contributors who helped review the design and implementation of the project, including but not limited to the following:

- Ben Swartzlander ([bswartz](https://github.com/bswartz))
- Carl Braganza ([carlbraganza](https://github.com/carlbraganza))
- Daniil Fedotov ([hairyhum](https://github.com/hairyhum))
- Ivan Sim ([ihcsim](https://github.com/ihcsim))
- Nikhil Ladha ([Nikhil-Ladha](https://github.com/Nikhil-Ladha))
- Prasad Ghangal ([PrasadG193](https://github.com/PrasadG193))
- Praveen M ([iPraveenParihar](https://github.com/iPraveenParihar))
- Rakshith R ([Rakshith-R](https://github.com/Rakshith-R))
- Xing Yang ([xing-yang](https://github.com/xing-yang))

Thank also to everyone who has contributed to the project, including others who helped review the [KEP](https://github.com/kubernetes/enhancements/pull/4082) and the [CSI spec PR](https://github.com/container-storage-interface/spec/pull/551)

For those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage) (SIG). We always welcome new contributors.

The SIG also holds regular [Data Protection Working Group meetings](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit). New attendees are welcome to join our discussions.
