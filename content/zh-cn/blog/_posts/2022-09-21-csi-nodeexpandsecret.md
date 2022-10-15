---
layout: blog
title: 
Kubernetes 1.25: CSI 卷的节点驱动扩展的密钥使用
date: 2022-09-21
slug: kubernetes-1-25-use-secrets-while-expanding-csi-volumes-on-node-alpha
---

<!--
layout: blog
title: >-
Kubernetes 1.25: Use Secrets for Node-Driven Expansion of CSI Volumes
date: 2022-09-21
slug: kubernetes-1-25-use-secrets-while-expanding-csi-volumes-on-node-alpha
-->

<!--
**Author:** Humble Chirammal (Red Hat), Louis Koo (deeproute.ai)
-->
**作者：**
Humble Chirammal (Red Hat), Louis Koo (deeproute.ai)


<!--
Kubernetes v1.25, released earlier this month, introduced a new feature
that lets your cluster expand storage volumes, even when access to those
volumes requires a secret (for example: a credential for accessing a SAN fabric)
to perform node expand operation. This new behavior is in alpha and you
must enable a feature gate (`CSINodeExpandSecret`) to make use of it.
You must also be using [CSI](https://kubernetes-csi.github.io/docs/)
storage; this change isn't relevant to storage drivers that are built in to Kubernetes.
-->

本月初发布的 Kubernetes v1.25 引入了一项新功能让你的集群可以扩展存储卷，即使访问这些卷需要一个秘钥（例如：访问 SAN 结构的证书），也可以让你的集群扩展存储卷。
来执行节点扩展操作。这个新的行为还处于 Alpha 阶段，你必须启用一个功能开关（`CSINodeExpandSecret`）才能使用它。
你还必须使用 [CSI](https://kubernetes-csi.github.io/docs/) 存储；这一变化与 Kubernetes 内置的存储驱动无关。

<!--
To turn on this new, alpha feature, you enable the `CSINodeExpandSecret` feature
gate for the kube-apiserver and kubelet, which turns on a mechanism to send `secretRef`
configuration as part of NodeExpansion  by the CSI drivers thus make use of
the same to perform node side expansion operation with the underlying
storage system.
-->

要打开这个新的 Alpha 功能，你需要启用 `CSINodeExpandSecret` 功能启用 kube-apiserver 和 kubelet，该功能开启了发送 "secretRef " 配置的机制。
作为 NodeExpansion 的一部分由 CSI 驱动发送，从而利用这些配置来执行节点侧的扩展操作与底层的存储系统。

<!--
## What is this all about?

Before Kubernetes v1.24, you were able to define a cluster-level StorageClass
that made use of [StorageClass Secrets](https://kubernetes-csi.github.io/docs/secrets-and-credentials-storage-class.html),
but you didn't have any mechanism to specify the credentials that would be used for
operations that take place when the storage was mounted onto a node and when
the volume has to be expanded at node side.
-->

### 这究竟是怎么回事？

在 Kubernetes v1.24 之前，你可以定义一个集群级的 StorageClass 使用 [StorageClass Secrets](https://kubernetes-csi.github.io/docs/secrets-and-credentials-storage-class.html)。
但你没有任何机制来指定在存储空间被挂载时发生的操作所使用的证书。
当存储被挂载到一个节点上时，以及当卷需要在节点上扩展时，发生的操作将使用任何机制。卷必须在节点上进行扩展时的操作。


<!--
The Kubernetes CSI already implemented a similar mechanism specific kinds of
volume resizes; namely, resizes of PersistentVolumes where the resizes take place
independently from any node referred as Controller Expansion. In that case, you
associate a PersistentVolume with a Secret that contains credentials for volume resize
actions, so that controller expansion can take place. CSI also supports a `nodeExpandVolume`
operation which CSI drivers can make use independent of Controller Expansion or along with
Controller Expansion on which, where the resize is driven from a node in your cluster where
the volume is attached. Please read [Kubernetes 1.24: Volume Expansion Now A Stable Feature](/blog/2022/05/05/volume-expansion-ga/)
-->

Kubernetes CSI 已经实现了一个类似的机制，即是可以调整那些独立于任何节点的扩展控制器上的 PersistentVolumes 大小。
在这种情况下，你将一个 PersistentVolume 与一个含有卷大小调整的证书的 Secret 关联起来，以便控制器可以进行扩展。
CSI 还支持一个 `nodeExpandVolume` 的操作。
CSI 驱动可以独立于控制器扩展或与控制器扩展一起使用。
调整扩展控制器的大小是由集群中连接卷的节点驱动的。
请阅读 [Kubernetes 1.24：卷扩展现在是一个稳定的功能](/blog/2022/05/05/volume-expansion-ga/)

<!--
- At times, the CSI driver needs to check the actual size of the backend block storage (or image)
  before proceeding with a node-level filesystem expand operation. This avoids false positive returns
  from the backend storage cluster during filesystem expands.
-->

- 有时，CSI 驱动需要检查后端块存储（或镜像）的实际大小。
  在进行节点级文件系统扩展操作之前。这可以避免在文件系统扩展过程中来自后端存储集群的假阳性返回。
  这可以避免在文件系统扩展过程中从后端存储集群中获得错误的肯定返回。

<!--
- When a PersistentVolume represents encrypted block storage (for example using LUKS)
  you need to provide a passphrase in order to expand the device, and also to make it possible
  to grow the filesystem on that device.
-->

- 当一个 PersistentVolume 代表加密的块存储（例如使用 LUKS）时
  你需要提供一个口令，以便扩展设备，并使其能够扩大该设备上的文件系统。


<!--
- For various validations at time of node expansion, the CSI driver has to be connected
  to the backend storage cluster. If the `nodeExpandVolume` request includes a `secretRef`
  then the CSI driver can make use of the same and connect to the storage cluster to
  perform the cluster operations.
-->

- 为了在节点扩展时进行各种验证，CSI 驱动必须连接到后端存储集群。
  到后端存储集群。如果 "nodeExpandVolume " 请求包括一个 "secretRef"，那么 CSI 驱动就可以使用这个 "secretRef"。
  那么 CSI 驱动就可以利用这一信息并连接到存储集群来执行集群操作。执行集群操作。

  
<!--
## How does it work?

To enable this functionality from this version of Kubernetes, SIG Storage have introduced
a new feature gate called `CSINodeExpandSecret`. Once the feature gate is enabled
in the cluster, NodeExpandVolume requests can include a `secretRef` field. The NodeExpandVolume request
is part of CSI; for example, in a request which has been sent from the Kubernetes
control plane to the CSI driver.

As a cluster operator, you admin can specify these secrets as an opaque parameter in a StorageClass,
the same way that you can already specify other CSI secret data. The StorageClass needs to have some
CSI-specific parameters set. Here's an example of those parameters:
-->

### 它是如何工作的？

为了在这个版本的 Kubernetes 中实现这一功能，SIG Storage 引入了一个名为 "CSINodeExpandSecret " 的新功能开关。
一旦该功能开关被启用在集群中，NodeExpandVolume 请求可以包括一个 `secretRef' 字段。NodeExpandVolume 请求是CSI的一部分；例如，在一个从Kubernetes
控制平面发送到 CSI 驱动的请求中。

作为集群操作员，管理员可以在 StorageClass 中指定这些密钥作为不透明的参数。就像你已经可以指定其他 CSI 密钥一样。该 StorageClass 需要有一些
CSI 特定的参数设置。下面是这些参数的一个例子。

<!--
```
csi.storage.k8s.io/node-expand-secret-name: test-secret
csi.storage.k8s.io/node-expand-secret-namespace: default
```

If feature gates are enabled and storage class carries the above secret configuration,
the CSI provisioner receives the credentials from the Secret as part of the NodeExpansion request.
-->

```
csi.storage.k8s.io/node-expand-secret-name: test-secret
csi.storage.k8s.io/node-expand-secret-namespace: default
```

如果功能开关被启用，并且 StorageClass 携带上述密钥配置。
CSI 供应者从密钥中接收证书，作为 NodeExpansion 请求的一部分。

<!--
CSI volumes that require secrets for online expansion will have NodeExpandSecretRef
field set. If not set, the NodeExpandVolume CSI RPC call will be made without a secret.
-->


需要密钥进行在线扩展的 CSI 卷将有 NodeExpandSecretRef 字段设置。
如果没有设置，NodeExpandVolume CSI RPC 调用将在没有密钥的情况下进行。

<!--
## Trying it out

1. Enable the `CSINodeExpandSecret` feature gate (please refer to
   [Feature Gates](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)).

1. Create a Secret, and then a StorageClass that uses that Secret.

Here's an example manifest for a Secret that holds credentials:
-->
## 试用

1. 启用 "CSINodeExpandSecret "功能（请参考[功能开关](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)）。

1. 创建一个 Secret，然后创建一个使用该 Secret 的 StorageClass。

下面是一个持有证书的密钥的清单示例:
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
<!--
Here's an example manifest for a StorageClass that refers to those credentials:
-->

下面是一个 StorageClass 的清单示例，它引用了这些证书:
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

<!--
## Example output

If the PersistentVolumeClaim (PVC) was created successfully, you can see that
configuration within the `spec.csi` field of the PersistentVolume (look for
`spec.csi.nodeExpandSecretRef`).
Check that it worked by running `kubectl get persistentvolume <pv_name> -o yaml`.
You should see something like.
-->

## 输出示例

如果 PersistentVolumeClaim（PVC）被成功创建，你可以看到配置在 PersistentVolume 的 `spec.csi` 字段中（寻找 `spec.csi.nodeExpandSecretRef`）。
通过运行 `kubectl get persistentvolume <pv_name> -o yaml` 来检查是否成功。你应该看到类似的东西。

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

<!--
If you then trigger online storage expansion, the kubelet passes the appropriate credentials
to the CSI driver, by loading that Secret and passing the data to the storage driver.

Here's an example debug log:
-->

如果你随后触发了在线存储扩展，kubelet 会通过加载该密钥并将数据传递给存储驱动，将适当的证书传递给 CSI 驱动。
通过加载该 Secret 并将数据传递给存储驱动。

下面是一个调试日志的例子:
```console
I0330 03:29:51.966241       1 server.go:101] GRPC call: /csi.v1.Node/NodeExpandVolume
I0330 03:29:51.966261       1 server.go:105] GRPC request: {"capacity_range":{"required_bytes":7516192768},"secrets":"***stripped***","staging_target_path":"/var/lib/kubelet/plugins/kubernetes.io/csi/blockstorage.cloudprovider.example/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount","volume_capability":{"AccessType":{"Mount":{}},"access_mode":{"mode":7}},"volume_id":"e21c7809-aabb-11ec-917a-2e2e254eb4cf","volume_path":"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount"}
I0330 03:29:51.966360       1 nodeserver.go:459] req:volume_id:"e21c7809-aabb-11ec-917a-2e2e254eb4cf" volume_path:"/var/lib/kubelet/pods/bcb1b2c4-5793-425c-acf1-47163a81b4d7/volumes/kubernetes.io~csi/pvc-95eb531a-d675-49f6-940b-9bc3fde83eb0/mount" capacity_range:<required_bytes:7516192768 > staging_target_path:"/var/lib/kubelet/plugins/kubernetes.io/csi/blockstorage.cloudprovider.example/f7c62e6e08ce21e9b2a95c841df315ed4c25a15e91d8fcaf20e1c2305e5300ab/globalmount" volume_capability:<mount:<> access_mode:<mode:SINGLE_NODE_MULTI_WRITER > > secrets:<key:"XXXXXX" value:"XXXXX" > secrets:<key:"XXXXX" value:"XXXXXX" >
```

<!--
## The future

As this feature is still in alpha, Kubernetes Storage SIG expect to update or get feedback from CSI driver
authors with more tests and implementation. The community plans to eventually
promote the feature to Beta in upcoming releases.
-->

## 未来

由于该功能仍处于 Alpha 阶段，Kubernetes Storage SIG 希望通过更多的测试和实施来更新或获得来自 CSI 驱动作者的反馈。
该社区计划最终在即将发布的版本中将该功能提升为 Beta 版。

<!--
## Get involved or learn more?

The enhancement proposal includes lots of detail about the history and technical
implementation of this feature.
-->
## 参与或了解更多？

增强建议包括很多关于这个功能的历史和技术的细节该功能的技术实现。


-->
To learn more about StorageClass based dynamic provisioning in Kubernetes, please refer to
[Storage Classes](/docs/concepts/storage/storage-classes/) and
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).

Please get involved by joining the Kubernetes
[Storage SIG](https://github.com/kubernetes/community/blob/master/sig-storage/README.md)
(Special Interest Group) to help us enhance this feature.
There are a lot of good ideas already and we'd be thrilled to have more!
-->

要了解更多关于 Kubernetes 中基于 StorageClass 的动态配置，请参考 [Storage Classes](/docs/concepts/storage/storage-classes/) 
和 [Persistent Volumes](/docs/concepts/storage/persistent-volumes/)。

请通过加入Kubernetes [Special Interest Group](https://github.com/kubernetes/community/blob/master/sig-storage/README.md) （特别兴趣小组）来帮助我们增强这一功能。
已经有很多好的想法了，我们会很高兴的如果有更多的想法！