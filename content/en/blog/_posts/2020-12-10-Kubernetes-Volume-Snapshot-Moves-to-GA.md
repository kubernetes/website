---
layout: blog
title: 'Kubernetes 1.20: Kubernetes Volume Snapshot Moves to GA'
date: 2020-12-10
slug: kubernetes-1.20-volume-snapshot-moves-to-ga
author: >
  Xing Yang (VMware),
  Xiangqian Yu (Google) 
---

The Kubernetes Volume Snapshot feature is now GA in Kubernetes v1.20. It was introduced as [alpha](https://kubernetes.io/blog/2018/10/09/introducing-volume-snapshot-alpha-for-kubernetes/) in Kubernetes v1.12, followed by a [second alpha](https://kubernetes.io/blog/2019/01/17/update-on-volume-snapshot-alpha-for-kubernetes/) with breaking changes in Kubernetes v1.13, and promotion to [beta](https://kubernetes.io/blog/2019/12/09/kubernetes-1-17-feature-cis-volume-snapshot-beta/) in Kubernetes 1.17. This blog post summarizes the changes releasing the feature from beta to GA.

## What is a volume snapshot?

Many storage systems (like Google Cloud Persistent Disks, Amazon Elastic Block Storage, and many on-premise storage systems) provide the ability to create a “snapshot” of a persistent volume. A snapshot represents a point-in-time copy of a volume. A snapshot can be used either to rehydrate a new volume (pre-populated with the snapshot data) or to restore an existing volume to a previous state (represented by the snapshot).

## Why add volume snapshots to Kubernetes?

Kubernetes aims to create an abstraction layer between distributed applications and underlying clusters so that applications can be agnostic to the specifics of the cluster they run on and application deployment requires no “cluster-specific” knowledge.

The Kubernetes Storage SIG identified snapshot operations as critical functionality for many stateful workloads. For example, a database administrator may want to snapshot a database’s volumes before starting a database operation.

By providing a standard way to trigger volume snapshot operations in Kubernetes, this feature allows Kubernetes users to incorporate snapshot operations in a portable manner on any Kubernetes environment regardless of the underlying storage.

Additionally, these Kubernetes snapshot primitives act as basic building blocks that unlock the ability to develop advanced enterprise-grade storage administration features for Kubernetes,  including application or cluster level backup solutions.

## What’s new since beta?

With the promotion of Volume Snapshot to GA, the feature is enabled by default on standard Kubernetes deployments and cannot be turned off.

Many enhancements have been made to improve the quality of this feature and to make it production-grade.

- The Volume Snapshot APIs and client library were moved to a separate Go module.

- A snapshot validation webhook has been added to perform necessary validation on volume snapshot objects. More details can be found in the [Volume Snapshot Validation Webhook Kubernetes Enhancement Proposal](https://github.com/kubernetes/enhancements/tree/master/keps/sig-storage/1900-volume-snapshot-validation-webhook).

- Along with the validation webhook, the volume snapshot controller will start labeling invalid snapshot objects that already existed. This allows users to identify, remove any invalid objects, and correct their workflows. Once the API is switched to the v1 type, those invalid objects will not be deletable from the system.

- To provide better insights into how the snapshot feature is performing, an initial set of operation metrics has been added to the volume snapshot controller.

- There are more end-to-end tests, running on GCP, that validate the feature in a real Kubernetes cluster. Stress tests (based on Google Persistent Disk and `hostPath` CSI Drivers) have been introduced to test the robustness of the system.

Other than introducing tightening validation, there is no difference between the v1beta1 and v1 Kubernetes volume snapshot API. In this release (with Kubernetes 1.20), both v1 and v1beta1 are served while the stored API version is still v1beta1. Future releases will switch the stored version to v1 and gradually remove v1beta1 support.

## Which CSI drivers support volume snapshots?

Snapshots are only supported for CSI drivers, not for in-tree or FlexVolume drivers. Ensure the deployed CSI driver on your cluster has implemented the snapshot interfaces. For more information, see [Container Storage Interface (CSI) for Kubernetes GA](https://kubernetes.io/blog/2019/01/15/container-storage-interface-ga/).

Currently more than [50 CSI drivers](https://kubernetes-csi.github.io/docs/drivers.html) support the Volume Snapshot feature. The [GCE Persistent Disk CSI Driver](https://github.com/kubernetes-sigs/gcp-compute-persistent-disk-csi-driver) has gone through the tests for upgrading from volume snapshots beta to GA. GA level support for other CSI drivers should be available soon.

## Who builds products using volume snapshots?

As of the publishing of this blog, the following participants from the [Kubernetes Data Protection Working Group](https://github.com/kubernetes/community/tree/master/wg-data-protection) are building products or have already built products using Kubernetes volume snapshots.

- [Dell-EMC: PowerProtect](https://www.delltechnologies.com/en-us/data-protection/powerprotect-data-manager.htm)
- [Druva](https://www.druva.com/)
- [Kasten K10](https://www.kasten.io/)
- [NetApp: Project Astra](https://cloud.netapp.com/project-astra)
- [Portworx (PX-Backup)](https://portworx.com/products/px-backup/)
- [Pure Storage (Pure Service Orchestrator)](https://github.com/purestorage/pso-csi)
- [Red Hat OpenShift Container Storage](https://www.redhat.com/en/technologies/cloud-computing/openshift-container-storage)
- [Robin Cloud Native Storage](https://robin.io/storage/)
- [TrilioVault for Kubernetes](https://docs.trilio.io/kubernetes/)
- [Velero plugin for CSI](https://github.com/vmware-tanzu/velero-plugin-for-csi)

## How to deploy volume snapshots?

Volume Snapshot feature contains the following components:

- [Kubernetes Volume Snapshot CRDs](https://github.com/kubernetes-csi/external-snapshotter/tree/master/client/config/crd)
- [Volume snapshot controller](https://github.com/kubernetes-csi/external-snapshotter/tree/master/pkg/common-controller)
- [Snapshot validation webhook](https://github.com/kubernetes-csi/external-snapshotter/tree/master/pkg/validation-webhook)
- CSI Driver along with [CSI Snapshotter sidecar](https://github.com/kubernetes-csi/external-snapshotter/tree/master/pkg/sidecar-controller)

It is strongly recommended that Kubernetes distributors bundle and deploy the volume snapshot controller, CRDs, and validation webhook as part of their Kubernetes cluster management process (independent of any CSI Driver).

{{< warning >}}

The snapshot validation webhook serves as a critical component to transition smoothly from using v1beta1 to v1 API. Not installing the snapshot validation webhook makes prevention of invalid volume snapshot objects from creation/updating impossible, which in turn will block deletion of invalid volume snapshot objects in coming upgrades.

{{< /warning >}}

If your cluster does not come pre-installed with the correct components, you may manually install them. See the [CSI Snapshotter](https://github.com/kubernetes-csi/external-snapshotter#readme) README for details.

## How to use volume snapshots?

Assuming all the required components (including CSI driver) have been already deployed and running on your cluster, you can create volume snapshots using the `VolumeSnapshot` API object, or use an existing `VolumeSnapshot` to restore a PVC by specifying the VolumeSnapshot data source on it. For more details, see the [volume snapshot documentation](/docs/concepts/storage/volume-snapshots/).

{{< note >}} The Kubernetes Snapshot API does not provide any application consistency guarantees. You have to prepare your application (pause application, freeze filesystem etc.) before taking the snapshot for data consistency either manually or using higher level APIs/controllers. {{< /note >}}

### Dynamically provision a volume snapshot

To dynamically provision a volume snapshot, create a `VolumeSnapshotClass` API object first.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotClass
metadata:
  name: test-snapclass
driver: testdriver.csi.k8s.io
deletionPolicy: Delete
parameters:
  csi.storage.k8s.io/snapshotter-secret-name: mysecret
  csi.storage.k8s.io/snapshotter-secret-namespace: mysecretnamespace
```  

Then create a `VolumeSnapshot` API object from a PVC by specifying the volume snapshot class.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
  namespace: ns1
spec:
  volumeSnapshotClassName: test-snapclass
  source:
    persistentVolumeClaimName: test-pvc
```

### Importing an existing volume snapshot with Kubernetes

To import a pre-existing volume snapshot into Kubernetes, manually create a `VolumeSnapshotContent` object first.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshotContent
metadata:
  name: test-content
spec:
  deletionPolicy: Delete
  driver: testdriver.csi.k8s.io
  source:
    snapshotHandle: 7bdd0de3-xxx
  volumeSnapshotRef:
    name: test-snapshot
    namespace: default
```

Then create a `VolumeSnapshot` object pointing to the `VolumeSnapshotContent` object.

```yaml
apiVersion: snapshot.storage.k8s.io/v1
kind: VolumeSnapshot
metadata:
  name: test-snapshot
spec:
  source:
        volumeSnapshotContentName: test-content
```

### Rehydrate volume from snapshot

A bound and ready `VolumeSnapshot` object can be used to rehydrate a new volume with data pre-populated from snapshotted data as shown here:

```yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-restore
  namespace: demo-namespace
spec:
  storageClassName: test-storageclass
  dataSource:
    name: test-snapshot
    kind: VolumeSnapshot
    apiGroup: snapshot.storage.k8s.io
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

## How to add support for snapshots in a CSI driver?

See the [CSI spec](https://github.com/container-storage-interface/spec/blob/master/spec.md) and the [Kubernetes-CSI Driver Developer Guide](https://kubernetes-csi.github.io/docs/snapshot-restore-feature.html) for more details on how to implement the snapshot feature in a CSI driver.

## What are the limitations?

The GA implementation of volume snapshots for Kubernetes has the following limitations:

- Does not support reverting an existing PVC to an earlier state represented by a snapshot (only supports provisioning a new volume from a snapshot).

### How to learn more?

The code repository for snapshot APIs and controller is here: https://github.com/kubernetes-csi/external-snapshotter

Check out additional documentation on the snapshot feature here: http://k8s.io/docs/concepts/storage/volume-snapshots and https://kubernetes-csi.github.io/docs/

## How to get involved?

This project, like all of Kubernetes, is the result of hard work by many contributors from diverse backgrounds working together.

We offer a huge thank you to the contributors who stepped up these last few quarters to help the project reach GA. We want to thank Saad Ali, Michelle Au, Tim Hockin, and Jordan Liggitt for their insightful reviews and thorough consideration with the design, thank Andi Li for his work on adding the support of the snapshot validation webhook, thank Grant Griffiths on implementing metrics support in the snapshot controller and handling password rotation in the validation webhook, thank Chris Henzie, Raunak Shah, and Manohar Reddy for writing critical e2e tests to meet the scalability and stability requirements for graduation, thank Kartik Sharma for moving snapshot APIs and client lib to a separate go module, and thank Raunak Shah and Prafull Ladha for their help with upgrade testing from beta to GA.

There are many more people who have helped to move the snapshot feature from beta to GA. We want to thank everyone who has contributed to this effort:
- [Andi Li](https://github.com/AndiLi99)
- [Ben Swartzlander](https://github.com/bswartz)
- [Chris Henzie](https://github.com/chrishenzie)
- [Christian Huffman](https://github.com/huffmanca)
- [Grant Griffiths](https://github.com/ggriffiths)
- [Humble Devassy Chirammal](https://github.com/humblec)
- [Jan Šafránek](https://github.com/jsafrane)
- [Jiawei Wang](https://github.com/Jiawei0227)
- [Jing Xu](https://github.com/jingxu97)
- [Jordan Liggitt](https://github.com/liggitt)
- [Kartik Sharma](https://github.com/Kartik494)
- [Madhu Rajanna](https://github.com/Madhu-1)
- [Manohar Reddy](https://github.com/boddumanohar)
- [Michelle Au](https://github.com/msau42)
- [Patrick Ohly](https://github.com/pohly)
- [Prafull Ladha](https://github.com/prafull01)
- [Prateek Pandey](https://github.com/prateekpandey14)
- [Raunak Shah](https://github.com/RaunakShah)
- [Saad Ali](https://github.com/saad-ali)
- [Saikat Roychowdhury](https://github.com/saikat-royc)
- [Tim Hockin](https://github.com/thockin)
- [Xiangqian Yu](https://github.com/yuxiangqian)
- [Xing Yang](https://github.com/xing-yang)
- [Zhu Can](https://github.com/zhucan)

For those interested in getting involved with the design and development of CSI or any part of the Kubernetes Storage system, join the [Kubernetes Storage Special Interest Group](https://github.com/kubernetes/community/tree/master/sig-storage)  (SIG). We’re rapidly growing and always welcome new contributors.

We also hold regular [Data Protection Working Group meetings](https://docs.google.com/document/d/15tLCV3csvjHbKb16DVk-mfUmFry_Rlwo-2uG6KNGsfw/edit#). New attendees are welcome to join in discussions.
