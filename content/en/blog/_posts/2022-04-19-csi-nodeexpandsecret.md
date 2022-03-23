---
layout: blog
title: "Kubernetes 1.24: Use secrets while expanding csi volumes on Node"
date: 2022-04-19T10:00:00-08:00
slug: kubernetes-1-24-use-secrets-while-expanding-csivolumes-on-node-alpha
---

**Author:** Humble Chirammal (Red Hat), Louis Koo (deeproute.ai)

Kubernetes v1.24, released earlier this month, introduced a new feature
that lets your cluster expand storage volumes, even when access to those
volumes requires a secret (for example: a credential for accessing a SAN fabric)
to perform node expand operation. This new behavior is in alpha and you
must enable a feature gate (`CSINodeExpandSecret`) to make use of it.
you must also be using [CSI](https://kubernetes-csi.github.io/docs/)
storage; this change isn't relevant to storage drivers that are built in to Kubernetes.

under the feature gate  (CSINodeExpandSecret) which once enabled in the
kube api server and kubelet, provide a mechanism to receive secretRef
configuration as part of NodeExpansion  by the CSI drivers thus make use of
the same to perform node side expansion operation with the underlying
storage system.

## What is this all about?

Before Kubernetes v1.24, you were able to define a cluster-level StorageClass
that made use of [secrets for volume access](https://kubernetes-csi.github.io/docs/secrets-and-credentials-storage-class.html),
but you didn't have any mechanism to specify the secret that was used for
operations that take place when the storage was mounted onto a node and when
when the volume has to be expanded at node side.
Even-though Kubernetes CSI have implemented similar mechanism for Controller
side operations, ie secretRef field available in the csi PV source and making
use of it while controllerExpand request has been sent to the CSI driver, similar
field was missing in the nodeExpandVolume request.  This was causing some trouble
for different CSI drivers to fulfill below scenarios while it perform NodeExpansion
operation.

- At times, the CSI driver need to check the actual size of the backend volume/image
  before proceeding on node side FS resize operation to avoid false positive returns
  from the  backend storage cluster on fs resize operation.

- Encrypted device with LUKs, which need the passphrase in order to resize
  the device on the node.

- For various validations at time of node expansion the CSI driver has to be connected
  to the backend storage cluster, if the secretRef is part of the
  nodeExpandVolume request the CSI driver can make use of the same and connect to
  the storage cluster  to perform the cluster operations.

## How does it work?

To enable this functionality from this version of Kubernetes, we have introduced
a new feature gate called CSINodeExpandSecret. Once the feature gate is enabled
in the cluster, the secretRef field will be added to the NodeExpandVolume request
which has been sent from the kubernetes orchestrator to the CSI driver.
The admin can specify these secrets as an opaque parameter in storage class as
he/she specifies other CSI secrets today.  The secrets mention in the storage class
has to carry the key name as shown below

 `csi.storage.k8s.io/node-expand-secret-name: test-secret
  csi.storage.k8s.io/node-expand-secret-namespace: default`

If feature gates are enabled and storage class carries the above secret configuration,
the subject CSI provisioner will receive the secrets as part of the NodeExpansion request.

CSI volumes that require secrets for online expansion will have NodeExpandSecretRef
field set. If not set, the NodeExpandVolume CSI RPC call will be made without a secret.



## Trying it out


Step 1: enable CSINodeExpandSecret feature gates ( Refer featuregate
documentation (https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/))

Step 2: Secret and storage class creation

Ex: secret.yaml:

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: test-secret
data:
  username: bXktYXBw
  password: Mzk1MjgkdmRnN0pi
```

Ex: sc.yaml:

```yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: csi-hostpath-sc
parameters:
  csi.storage.k8s.io/node-expand-secret-name: test-secret
  csi.storage.k8s.io/node-expand-secret-namespace: default
provisioner: hostpath.csi.k8s.io
reclaimPolicy: Delete
volumeBindingMode: Immediate
allowVolumeExpansion: true
```


## Example output:

If the pvc was created successfully, we can see it in the pv.spec.csi with cmd `kubectl get pv <pv_name> -o yaml`

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  annotations:
    pv.kubernetes.io/provisioned-by: hostpath.csi.k8s.io
  creationTimestamp: "2022-03-23T15:14:07Z"
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
    driver: hostpath.csi.k8s.io
    nodeExpandSecretRef:
      name: test-secret
      namespace: default
    volumeAttributes:
      storage.kubernetes.io/csiProvisionerIdentity: 1648042783218-8081-hostpath.csi.k8s.io
    volumeHandle: e21c7809-aabb-11ec-917a-2e2e254eb4cf
  nodeAffinity:
    required:
      nodeSelectorTerms:
      - matchExpressions:
        - key: topology.hostpath.csi/node
          operator: In
          values:
          - rook-node01
  persistentVolumeReclaimPolicy: Delete
  storageClassName: csi-hostpath-sc
  volumeMode: Filesystem
status:
  phase: Bound
```

Expand the volume online, the secret will be pass to the csi driver, like this,
the logs in host path csi driver:

```yaml
I0330 03:29:51.966241       1 server.go:101] GRPC call: /csi.v1.Node/NodeExpandVolume
I0330 03:29:51.966261       1 server.go:105] GRPC request: {"capacity_range":{"required_bytes":7516192768},"secrets":"***stripped***","staging_target_path":"/var/lib/kubelet/plugins/kubernetes.io/csi/hostpath.csi.k8s.io/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount","volume_capability":{"AccessType":{"Mount":{}},"access_mode":{"mode":7}},"volume_id":"e21c7809-aabb-11ec-917a-2e2e254eb4cf","volume_path":"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount"}
I0330 03:29:51.966360       1 nodeserver.go:459] req:volume_id:"e21c7809-aabb-11ec-917a-2e2e254eb4cf" volume_path:"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount" capacity_range:<required_bytes:7516192768 > staging_target_path:"/var/lib/kubelet/plugins/kubernetes.io/csi/hostpath.csi.k8s.io/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount" volume_capability:<mount:<> access_mode:<mode:SINGLE_NODE_MULTI_WRITER > > secrets:<key:"XXXXXX" value:"XXXXX" > secrets:<key:"XXXXX" value:"XXXXXX" >
```

## The future

As this feature is still in alpha, we expect to update or get feedback from CSI driver
authors with more tests and implementation. The community plans to eventually
promote the feature to Beta in upcoming releases.

## How can I learn more?

The enhancement proposal includes lots of detail about the history and technical
implementation of this feature.

To know more about Storage Class based dynamic provisioning in Kubernetes please refer:
[Storage class](https://kubernetes.io/docs/concepts/storage/storage-classes/)
[Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/)

Please get involved by joining the Kubernetes storage SIG (https://github.com/kubernetes/community/blob/master/sig-storage/README.md) to help us enhance this feature. There are a lot of good ideas already and we'd be thrilled to have more!
