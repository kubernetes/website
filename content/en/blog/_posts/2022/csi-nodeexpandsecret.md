---
layout: blog
title: >-
  Kubernetes 1.25: Use Secrets for Node-Driven Expansion of CSI Volumes
date: 2022-09-21
slug: kubernetes-1-25-use-secrets-while-expanding-csi-volumes-on-node-alpha
author: >
  Humble Chirammal (Red Hat),
  Louis Koo (deeproute.ai)
---

Kubernetes v1.25, released earlier this month, introduced a new feature
that lets your cluster expand storage volumes, even when access to those
volumes requires a secret (for example: a credential for accessing a SAN fabric)
to perform node expand operation. This new behavior is in alpha and you
must enable a feature gate (`CSINodeExpandSecret`) to make use of it.
You must also be using [CSI](https://kubernetes-csi.github.io/docs/)
storage; this change isn't relevant to storage drivers that are built in to Kubernetes.

To turn on this new, alpha feature, you enable the `CSINodeExpandSecret` feature
gate for the kube-apiserver and kubelet, which turns on a mechanism to send `secretRef`
configuration as part of NodeExpansion  by the CSI drivers thus make use of
the same to perform node side expansion operation with the underlying
storage system.

## What is this all about?

Before Kubernetes v1.24, you were able to define a cluster-level StorageClass
that made use of [StorageClass Secrets](https://kubernetes-csi.github.io/docs/secrets-and-credentials-storage-class.html),
but you didn't have any mechanism to specify the credentials that would be used for
operations that take place when the storage was mounted onto a node and when
the volume has to be expanded at node side.

The Kubernetes CSI already implemented a similar mechanism specific kinds of
volume resizes; namely, resizes of PersistentVolumes where the resizes take place
independently from any node referred as Controller Expansion. In that case, you
associate a PersistentVolume with a Secret that contains credentials for volume resize
actions, so that controller expansion can take place. CSI also supports a `nodeExpandVolume`
operation which CSI drivers can make use independent of Controller Expansion or along with
Controller Expansion on which, where the resize is driven from a node in your cluster where
the volume is attached. Please read [Kubernetes 1.24: Volume Expansion Now A Stable Feature](/blog/2022/05/05/volume-expansion-ga/)

- At times, the CSI driver needs to check the actual size of the backend block storage (or image)
  before proceeding with a node-level filesystem expand operation. This avoids false positive returns
  from the backend storage cluster during filesystem expands.

- When a PersistentVolume represents encrypted block storage (for example using LUKS)
  you need to provide a passphrase in order to expand the device, and also to make it possible
  to grow the filesystem on that device.

- For various validations at time of node expansion, the CSI driver has to be connected
  to the backend storage cluster. If the `nodeExpandVolume` request includes a `secretRef`
  then the CSI driver can make use of the same and connect to the storage cluster to
  perform the cluster operations.

## How does it work?

To enable this functionality from this version of Kubernetes, SIG Storage have introduced
a new feature gate called `CSINodeExpandSecret`. Once the feature gate is enabled
in the cluster, NodeExpandVolume requests can include a `secretRef` field. The NodeExpandVolume request
is part of CSI; for example, in a request which has been sent from the Kubernetes
control plane to the CSI driver.

As a cluster operator, you admin can specify these secrets as an opaque parameter in a StorageClass,
the same way that you can already specify other CSI secret data. The StorageClass needs to have some
CSI-specific parameters set. Here's an example of those parameters:

```
csi.storage.k8s.io/node-expand-secret-name: test-secret
csi.storage.k8s.io/node-expand-secret-namespace: default
```

If feature gates are enabled and storage class carries the above secret configuration,
the CSI provisioner receives the credentials from the Secret as part of the NodeExpansion request.

CSI volumes that require secrets for online expansion will have NodeExpandSecretRef
field set. If not set, the NodeExpandVolume CSI RPC call will be made without a secret.

## Trying it out

1. Enable the `CSINodeExpandSecret` feature gate (please refer to
   [Feature Gates](/docs/reference/command-line-tools-reference/feature-gates/)).

1. Create a Secret, and then a StorageClass that uses that Secret.

Here's an example manifest for a Secret that holds credentials:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: test-secret
  namespace: default
data:
stringData:
  username: admin
  password: t0p-Secret
```

Here's an example manifest for a StorageClass that refers to those credentials:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-blockstorage-sc
parameters:
  csi.storage.k8s.io/node-expand-secret-name: test-secret   # the name of the Secret
  csi.storage.k8s.io/node-expand-secret-namespace: default  # the namespace that the Secret is in
provisioner: blockstorage.cloudprovider.example
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```


## Example output

If the PersistentVolumeClaim (PVC) was created successfully, you can see that
configuration within the `spec.csi` field of the PersistentVolume (look for
`spec.csi.nodeExpandSecretRef`).
Check that it worked by running `kubectl get persistentvolume <pv_name> -o yaml`.
You should see something like.

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    pv.kubernetes.io/provisioned-by: blockstorage.cloudprovider.example
  creationTimestamp: "2022-08-26T15:14:07Z"
  finalizers:
  - kubernetes.io/pv-protection
  name: pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0
  resourceVersion: "420263"
  uid: 6fa824d7-8a06-4e0c-b722-d3f897dcbd65
spec:
  accessModes:
  - ReadWriteOnce
  capacity:
    storage: 6Gi
  claimRef:
    apiVersion: v1
    kind: PersistentVolumeClaim
    name: csi-pvc
    namespace: default
    resourceVersion: "419862"
    uid: 95eb531a-d675-49f6-940b-9bc3fde83eb0
  csi:
    driver: blockstorage.cloudprovider.example
    nodeExpandSecretRef:
      name: test-secret
      namespace: default
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1648042783218-8081-blockstorage.cloudprovider.example
    volumeHandle: e21c7809-aabb-11ec-917a-2e2e254eb4cf
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.hostpath.csi/node
          operator: In
          values:
          - racknode01
  persistentVolumeReclaimPolicy: Delete
  storageClassName: csi-blockstorage-sc
  volumeMode: Filesystem
status:
  phase: Bound
```

If you then trigger online storage expansion, the kubelet passes the appropriate credentials
to the CSI driver, by loading that Secret and passing the data to the storage driver.

Here's an example debug log:

```console
I0330 03:29:51.966241       1 server.go:101] GRPC call: /csi.v1.Node/NodeExpandVolume
I0330 03:29:51.966261       1 server.go:105] GRPC request: {"capacity_range":{"required_bytes":7516192768},"secrets":"***stripped***","staging_target_path":"/var/lib/kubelet/plugins/kubernetes.io/csi/blockstorage.cloudprovider.example/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount","volume_capability":{"AccessType":{"Mount":{}},"access_mode":{"mode":7}},"volume_id":"e21c7809-aabb-11ec-917a-2e2e254eb4cf","volume_path":"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount"}
I0330 03:29:51.966360       1 nodeserver.go:459] req:volume_id:"e21c7809-aabb-11ec-917a-2e2e254eb4cf" volume_path:"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount" capacity_range:<required_bytes:7516192768 > staging_target_path:"/var/lib/kubelet/plugins/kubernetes.io/csi/blockstorage.cloudprovider.example/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount" volume_capability:<mount:<> access_mode:<mode:SINGLE_NODE_MULTI_WRITER > > secrets:<key:"XXXXXX" value:"XXXXX" > secrets:<key:"XXXXX" value:"XXXXXX" >
```

## The future

As this feature is still in alpha, Kubernetes Storage SIG expect to update or get feedback from CSI driver
authors with more tests and implementation. The community plans to eventually
promote the feature to Beta in upcoming releases.

## Get involved or learn more?

The enhancement proposal includes lots of detail about the history and technical
implementation of this feature.

To learn more about StorageClass based dynamic provisioning in Kubernetes, please refer to
[Storage Classes](/docs/concepts/storage/storage-classes/) and
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).

Please get involved by joining the Kubernetes
[Storage SIG](https://github.com/kubernetes/community/blob/master/sig-storage/README.md)
(Special Interest Group) to help us enhance this feature.
There are a lot of good ideas already and we'd be thrilled to have more!
