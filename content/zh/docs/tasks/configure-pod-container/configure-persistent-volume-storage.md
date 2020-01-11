---
title: 配置 Pod 以使用 PersistentVolume 作为存储
content_template: templates/task
weight: 60
---

<!--
---
title: Configure a Pod to Use a PersistentVolume for Storage
content_template: templates/task
weight: 60
---
-->

{{% capture overview %}}

<!--
This page shows how to configure a Pod to use a PersistentVolumeClaim for storage.
Here is a summary of the process:

1. A cluster administrator creates a PersistentVolume that is backed by physical
storage. The administrator does not associate the volume with any Pod.

1. A cluster user creates a PersistentVolumeClaim, which gets automatically
bound to a suitable PersistentVolume.

1. The user creates a Pod that uses the PersistentVolumeClaim as storage.
-->

本文介绍如何配置 Pod 使用 PersistentVolumeClaim 作为存储。
以下是该过程的总结：

1. 集群管理员创建由物理存储支持的 PersistentVolume。管理员不将卷与任何 Pod 关联。

1. 群集用户创建一个 PersistentVolumeClaim，它将自动绑定到合适的 PersistentVolume。

1. 用户创建一个使用 PersistentVolumeClaim 作为存储的 Pod。

{{% /capture %}}

{{% capture prerequisites %}}

<!--
* You need to have a Kubernetes cluster that has only one Node, and the kubectl
command-line tool must be configured to communicate with your cluster. If you
do not already have a single-node cluster, you can create one by using
[Minikube](/docs/getting-started-guides/minikube).

* Familiarize yourself with the material in
[Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
-->

* 您需要一个包含单个节点的 Kubernetes 集群，并且必须配置 kubectl 命令行工具以便与集群交互。
如果还没有单节点集群，可以使用 [Minikube](/docs/getting-started-guides/minikube) 创建一个。

* 熟悉[持久卷](/docs/concepts/storage/persistent-volumes/)中的材料。

{{% /capture %}}

{{% capture steps %}}

<!--
## Create an index.html file on your Node

Open a shell to the Node in your cluster. How you open a shell depends on how
you set up your cluster. For example, if you are using Minikube, you can open a
shell to your Node by entering `minikube ssh`.

In your shell, create a `/mnt/data` directory:
-->

## 在你的节点上创建一个 index.html 文件

打开集群中节点的一个 shell。
如何打开 shell 取决于集群的设置。
例如，如果您正在使用 Minikube，那么可以通过输入 `minikube ssh` 来打开节点的 shell。

在 shell 中，创建一个 `/mnt/data` 目录：

    mkdir /mnt/data

<!--
In the `/mnt/data` directory, create an `index.html` file:
-->

在 `/mnt/data` 目录中创建一个 index.html 文件：

    echo 'Hello from Kubernetes storage' > /mnt/data/index.html

<!--
## Create a PersistentVolume

In this exercise, you create a *hostPath* PersistentVolume. Kubernetes supports
hostPath for development and testing on a single-node cluster. A hostPath
PersistentVolume uses a file or directory on the Node to emulate network-attached storage.
-->

## 创建 PersistentVolume

在本练习中，您将创建一个 *hostPath* 类型的 PersistentVolume。
Kubernetes 支持用于在单节点集群上开发和测试的 hostPath 类型的 PersistentVolume。
hostPath 类型的 PersistentVolume 使用节点上的文件或目录来模拟附带网络的存储。

<!--
In a production cluster, you would not use hostPath. Instead a cluster administrator
would provision a network resource like a Google Compute Engine persistent disk,
an NFS share, or an Amazon Elastic Block Store volume. Cluster administrators can also
use [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage)
to set up
[dynamic provisioning](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes).

Here is the configuration file for the hostPath PersistentVolume:
-->

在生产集群中，您不会使用 hostPath。集群管理员会提供网络存储资源，比如 Google Compute Engine 持久盘卷、NFS 共享卷或 Amazon Elastic Block Store 卷。
集群管理员还可以使用 [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage) 来设置[动态提供存储](https://kubernetes.io/blog/2016/10/dynamic-provisioning-and-storage-in-kubernetes)。

下面是 hostPath PersistentVolume 的配置文件：

{{< codenew file="pods/storage/pv-volume.yaml" >}}

<!--
The configuration file specifies that the volume is at `/mnt/data` on the
cluster's Node. The configuration also specifies a size of 10 gibibytes and
an access mode of `ReadWriteOnce`, which means the volume can be mounted as
read-write by a single Node. It defines the [StorageClass name](/docs/concepts/storage/persistent-volumes/#class)
`manual` for the PersistentVolume, which will be used to bind
PersistentVolumeClaim requests to this PersistentVolume.

Create the PersistentVolume:
-->

配置文件指定了该卷位于集群节点上的 `/mnt/data` 目录。
该配置还指定了 10 吉比特的卷大小和 `ReadWriteOnce` 的访问模式，这意味着该卷可以在单个节点上以读写方式挂载。
它为 PersistentVolume 定义了 [StorageClass 名称](/docs/concepts/storage/persistent-volumes/#class) 为 `manual`，StorageClass 名称用来将 PersistentVolumeClaim 请求绑定到该 PersistentVolume。

创建 PersistentVolume：

    kubectl create -f https://k8s.io/examples/pods/storage/pv-volume.yaml

<!--
View information about the PersistentVolume:
-->

查看 PersistentVolume 的信息：

    kubectl get pv task-pv-volume

<!--
The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.
-->

输出结果显示该 PersistentVolume 的`状态（STATUS）` 为 `Available`。
这意味着它还没有被绑定给 PersistentVolumeClaim。

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s

<!--
## Create a PersistentVolumeClaim

The next step is to create a PersistentVolumeClaim. Pods use PersistentVolumeClaims
to request physical storage. In this exercise, you create a PersistentVolumeClaim
that requests a volume of at least three gibibytes that can provide read-write
access for at least one Node.

Here is the configuration file for the PersistentVolumeClaim:
-->

## 创建 PersistentVolumeClaim

下一步是创建一个 PersistentVolumeClaim。
Pod 使用 PersistentVolumeClaim 来请求物理存储。
在本练习中，您将创建一个 PersistentVolumeClaim，它请求至少 3 吉比特容量的卷，该卷至少可以为一个节点提供读写访问。

下面是 PersistentVolumeClaim 的配置文件：

{{< codenew file="pods/storage/pv-claim.yaml" >}}

<!--
Create the PersistentVolumeClaim:
-->

创建 PersistentVolumeClaim：

    kubectl create -f https://k8s.io/examples/pods/storage/pv-claim.yaml

<!--
After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:
-->

创建 PersistentVolumeClaim 之后，Kubernetes 控制平面将查找满足申领要求的 PersistentVolume。
如果控制平面找到具有相同 StorageClass 的适当的 PersistentVolume，则将 PersistentVolumeClaim 绑定到该 PersistentVolume 上。

再次查看 PersistentVolume 信息：

    kubectl get pv task-pv-volume

<!--
Now the output shows a `STATUS` of `Bound`.
-->
现在输出的 `STATUS` 为 `Bound`。

    NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
    task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m

<!--
Look at the PersistentVolumeClaim:
-->
查看 PersistentVolumeClaim：

    kubectl get pvc task-pv-claim

<!--
The output shows that the PersistentVolumeClaim is bound to your PersistentVolume,
`task-pv-volume`.
-->

输出结果表明该 PersistentVolumeClaim 绑定了你的 PersistentVolume `task-pv-volume`。

    NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
    task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s

<!--
## Create a Pod

The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.

Here is the configuration file for the Pod:
-->

## 创建 Pod

下一步是创建一个 Pod， 该 Pod 使用你的 PersistentVolumeClaim 作为存储卷。

下面是 Pod 的 配置文件：

{{< codenew file="pods/storage/pv-pod.yaml" >}}

<!--
Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Create the Pod:
-->

注意 Pod 的配置文件指定了 PersistentVolumeClaim，但没有指定 PersistentVolume。对 Pod 而言，PersistentVolumeClaim 就是一个存储卷。

创建 Pod：

    kubectl create -f https://k8s.io/examples/pods/storage/pv-pod.yaml

<!--
Verify that the Container in the Pod is running;
-->

检查 Pod 中的容器是否运行正常：

    kubectl get pod task-pv-pod

<!--
Get a shell to the Container running in your Pod:
-->

打开一个 shell 访问 Pod 中的容器：

    kubectl exec -it task-pv-pod -- /bin/bash

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:
-->

在 shell 中，验证 nginx 是否正在从 hostPath 卷提供 `index.html` 文件：

    root@task-pv-pod:/# apt-get update
    root@task-pv-pod:/# apt-get install curl
    root@task-pv-pod:/# curl localhost

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->

输出结果是你之前写到 hostPath 卷中的 `index.html` 文件中的内容：

    Hello from Kubernetes storage

{{% /capture %}}


{{% capture discussion %}}

<!--
## Access control

Storage configured with a group ID (GID) allows writing only by Pods using the same
GID. Mismatched or missing GIDs cause permission denied errors. To reduce the
need for coordination with users, an administrator can annotate a PersistentVolume
with a GID. Then the GID is automatically added to any Pod that uses the
PersistentVolume.

Use the `pv.beta.kubernetes.io/gid` annotation as follows:
-->

## 访问控制

使用 group ID（GID）配置的存储仅允许 Pod 使用相同的 GID 进行写入。
GID 不匹配或缺少将会导致许可被拒绝的错误。
为了减少与用户的协调，管理员可以使用 GID 对 PersistentVolume 进行注解。
这样 GID 就能自动的添加到使用 PersistentVolume 的任何 Pod 中。

使用 `pv.beta.kubernetes.io/gid` 注解的方法如下所示：

```yaml
kind: PersistentVolume
apiVersion: v1
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

<!--
When a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID
is applied to all Containers in the Pod in the same way that GIDs specified in the
Pod’s security context are. Every GID, whether it originates from a PersistentVolume
annotation or the Pod’s specification, is applied to the first process run in
each Container.
-->

当 Pod 使用带有 GID 注解的 PersistentVolume 时，注解的 GID 会被应用于 Pod 中的所有容器，应用的方法与 Pod 的安全上下文中指定的 GID 相同。
每个 GID，无论是来自 PersistentVolume 注解还是来自 Pod 的规范，都应用于每个容器中运行的第一个进程。

{{< note >}}
<!--
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
-->
当 Pod 使用 PersistentVolume 时，与 PersistentVolume 关联的 GID 不会在 Pod 本身的资源对象上出现。
{{< /note >}}

{{% /capture %}}


{{% capture whatsnext %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Read the [Persistent Storage design document](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md).
-->

* 进一步了解 [PersistentVolumes](/docs/concepts/storage/persistent-volumes/)。
* 阅读[持久存储设计文档](https://git.k8s.io/community/contributors/design-proposals/storage/persistent-storage.md)。

<!--
### Reference
-->

### 参考

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)


{{% /capture %}}
