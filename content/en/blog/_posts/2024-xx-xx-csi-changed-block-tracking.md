---
layout: blog
title: 'Kubernetes v1.33: Changed Block Tracking API support (alpha)'
date: 2025-05-14T18:30:00+05:30
draft: true
slug: kubernetes-v1-33-csi-changed-block-tracking
author: >
   Prasad Ghangal (Veeam Kasten)
   Carl Braganza (Veeam Kasten)
---

We're excited to announce that Kubernetes v1.33 introduced alpha support for a _changed block tracking_ mechanism. This enhances the Kubernetes storage ecosystem by providing an efficient way for storage drivers to identify changed blocks in PersistentVolume snapshots. With a driver that can use the feature, you could benefit from faster and more resource-efficient backup operations.

## What is changed block tracking?

The improvement is a change to the Container Storage Interface (CSI), and also to the storage snapshot support in Kubernetes itself.
With the alpha feature enabled, your cluster can:

- Identify allocated blocks within a CSI volume snapshot
- Determine changed blocks between two snapshots of the same volume

For Kubernetes users managing large datasets, this API enables significantly more efficient backup processes. Backup applications can now focus only on the blocks that have changed, rather than processing entire volumes.

{{< note >}}
As of now, the Changed Block Tracking API is supported only for block volumes and not for file volumes. CSI drivers that manage file-based storage systems will not be able to implement this capability.
{{< /note >}}

## Benefits of changed block tracking support in Kubernetes

As Kubernetes adoption grows for stateful workloads managing critical data, the need for efficient backup solutions becomes increasingly important. Traditional full backup approaches face challenges with:

- _Long backup windows_: Full volume backups can take hours for large datasets, making it difficult to complete within maintenance windows.
- _High resource utilization_: Backup operations consume substantial network bandwidth and I/O resources, especially for large data volumes and data-intensive applications.
- _Increased storage costs_: Repetitive full backups store redundant data, causing storage requirements to grow linearly even when only a small percentage of data actually changes between backups.

The Changed Block Tracking API addresses these challenges by providing native Kubernetes support for incremental backup capabilities through the CSI interface.

## Key components

The implementation consists of three primary components:

1. _CSI SnapshotMetadata Service API_: A gRPC service that provides information about volume snapshots, including changed block data
2. _SnapshotMetadataService Custom Resource_: Advertises the availability of a CSI driver's metadata service along with connection details
3. _External Snapshot Metadata Sidecar_: Implements the server-side of the API, bridging CSI drivers with backup applications

## Implementation requirements

### Storage provider responsibilities

Storage providers who want to support the changed block tracking feature must implement specific requirements:

1. _Implement CSI RPCs_: Storage providers need to implement the `SnapshotMetadata` service as defined in the [CSI specifications protobuf](https://github.com/container-storage-interface/spec/blob/master/csi.proto). This service requires server-side streaming implementations for the following RPCs:

   - `GetMetadataAllocated`: For identifying allocated blocks in a snapshot
   - `GetMetadataDelta`: For determining changed blocks between two snapshots

2. _Storage backend capabilities_: Ensure the storage backend has the capability to track and report block-level changes.

3. _Deploy external components_: Integrate with the `external-snapshot-metadata` sidecar to expose the snapshot metadata service.

4. _Register custom resource_: Create and maintain a `SnapshotMetadataService` custom resource that advertises the availability of their metadata service and provides connection details.

5. _Support error handling_: Implement proper error handling for these RPCs according to the CSI specification requirements.

### Backup client responsibilities

Backup clients looking to leverage this feature must:

1. _Set up authentication_: Configure proper authentication for clients accessing the storage system using Kubernetes ServiceAccount tokens.

2. _Implement streaming client-side code_: Develop clients that implement the streaming gRPC APIs defined in the [schema.proto](https://github.com/kubernetes-csi/external-snapshot-metadata/blob/main/proto/schema.proto) file. Specifically:
   - Implement streaming client code for `GetMetadataAllocated` and `GetMetadataDelta` methods
   - Handle server-side streaming responses efficiently as the metadata comes in chunks
   - Process the `SnapshotMetadataResponse` message format with proper error handling

3. _Handle large dataset streaming_: Design clients to efficiently handle large streams of block metadata that could be returned for volumes with significant changes.

4. _Optimize backup processes_: Modify backup workflows to use the changed block metadata to identify and only transfer changed blocks to make backups more efficient, reducing both backup duration and resource consumption.


## Getting started

To use changed block tracking in your cluster:

1. Ensure your CSI driver supports volume snapshots and implements the snapshot metadata capabilities with the required `external-snapshot-metadata` sidecar
2. Make sure the `SnapshotMetadataService` custom resource is registered using CRD
3. Verify the presence of a `SnapshotMetadataService` custom resource for your CSI driver
4. Create clients that can access the API using appropriate authentication (via Kubernetes ServiceAccount tokens)

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
