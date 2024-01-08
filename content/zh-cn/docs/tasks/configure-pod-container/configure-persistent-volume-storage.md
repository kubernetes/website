---
title: 配置 Pod 以使用 PersistentVolume 作为存储
content_type: task
weight: 90
---
<!--
title: Configure a Pod to Use a PersistentVolume for Storage
content_type: task
weight: 90
-->

<!-- overview -->

<!--
This page shows you how to configure a Pod to use a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
for storage.
Here is a summary of the process:

1. You, as cluster administrator, create a PersistentVolume backed by physical
   storage. You do not associate the volume with any Pod.

1. You, now taking the role of a developer / cluster user, create a
   PersistentVolumeClaim that is automatically bound to a suitable
   PersistentVolume.

1. You create a Pod that uses the above PersistentVolumeClaim for storage.
-->
本文将向你介绍如何配置 Pod 使用
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
作为存储。
以下是该过程的总结：

1. 你作为集群管理员创建由物理存储支持的 PersistentVolume。你不会将该卷与任何 Pod 关联。

1. 你现在以开发人员或者集群用户的角色创建一个 PersistentVolumeClaim，
   它将自动绑定到合适的 PersistentVolume。

1. 你创建一个使用以上 PersistentVolumeClaim 作为存储的 Pod。

## {{% heading "prerequisites" %}}

<!--
* You need to have a Kubernetes cluster that has only one Node, and the
  {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}
  command-line tool must be configured to communicate with your cluster. If you
  do not already have a single-node cluster, you can create one by using
  [Minikube](https://minikube.sigs.k8s.io/docs/).

* Familiarize yourself with the material in
  [Persistent Volumes](/docs/concepts/storage/persistent-volumes/).
-->
* 你需要一个包含单个节点的 Kubernetes 集群，并且必须配置
  {{< glossary_tooltip text="kubectl" term_id="kubectl" >}} 命令行工具以便与集群交互。
  如果还没有单节点集群，可以使用
  [Minikube](https://minikube.sigs.k8s.io/docs/) 创建一个。

* 熟悉[持久卷](/zh-cn/docs/concepts/storage/persistent-volumes/)文档。

<!-- steps -->

<!--
## Create an index.html file on your Node

Open a shell to the single Node in your cluster. How you open a shell depends
on how you set up your cluster. For example, if you are using Minikube, you
can open a shell to your Node by entering `minikube ssh`.

In your shell on that Node, create a `/mnt/data` directory:
-->
## 在你的节点上创建一个 index.html 文件  {#create-an-index-file-on-your-node}

打开集群中的某个节点的 Shell。
如何打开 Shell 取决于集群的设置。
例如，如果你正在使用 Minikube，那么可以通过输入 `minikube ssh` 来打开节点的 Shell。

在该节点的 Shell 中，创建一个 `/mnt/data` 目录：

<!--
# This assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 这里假定你的节点使用 "sudo" 来以超级用户角色执行命令
sudo mkdir /mnt/data
```

<!--
In the `/mnt/data` directory, create an `index.html` file:
-->
在 `/mnt/data` 目录中创建一个 index.html 文件：

<!--
# This again assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 这里再次假定你的节点使用 "sudo" 来以超级用户角色执行命令
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
<!--
If your Node uses a tool for superuser access other than `sudo`, you can
usually make this work if you replace `sudo` with the name of the other tool.
-->
如果你的节点使用某工具而不是 `sudo` 来完成超级用户访问，你可以将上述命令中的 `sudo` 替换为该工具的名称。
{{< /note >}}

<!--
Test that the `index.html` file exists:
-->
测试 `index.html` 文件确实存在：

```shell
cat /mnt/data/index.html
```

<!-- 
The output should be:
-->
输出应该是：

```
Hello from Kubernetes storage
```

<!--
You can now close the shell to your Node.
-->
现在你可以关闭节点的 Shell 了。

<!--
## Create a PersistentVolume

In this exercise, you create a *hostPath* PersistentVolume. Kubernetes supports
hostPath for development and testing on a single-node cluster. A hostPath
PersistentVolume uses a file or directory on the Node to emulate network-attached storage.
-->
## 创建 PersistentVolume   {#create-a-pv}

在本练习中，你将创建一个 **hostPath** 类型的 PersistentVolume。
Kubernetes 支持用于在单节点集群上开发和测试的 hostPath 类型的 PersistentVolume。
hostPath 类型的 PersistentVolume 使用节点上的文件或目录来模拟网络附加存储。

<!--
In a production cluster, you would not use hostPath. Instead a cluster administrator
would provision a network resource like a Google Compute Engine persistent disk,
an NFS share, or an Amazon Elastic Block Store volume. Cluster administrators can also
use [StorageClasses](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
to set up
[dynamic provisioning](/docs/concepts/storage/dynamic-provisioning/).

Here is the configuration file for the hostPath PersistentVolume:
-->
在生产集群中，你不会使用 hostPath。
集群管理员会提供网络存储资源，比如 Google Compute Engine 持久盘卷、NFS 共享卷或 Amazon Elastic Block Store 卷。
集群管理员还可以使用
[StorageClass](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
来设置[动态制备存储](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。

下面是 hostPath PersistentVolume 的配置文件：

{{% code_sample file="pods/storage/pv-volume.yaml" %}}

<!--
The configuration file specifies that the volume is at `/mnt/data` on the
cluster's Node. The configuration also specifies a size of 10 gibibytes and
an access mode of `ReadWriteOnce`, which means the volume can be mounted as
read-write by a single Node. It defines the [StorageClass name](/docs/concepts/storage/persistent-volumes/#class)
`manual` for the PersistentVolume, which will be used to bind
PersistentVolumeClaim requests to this PersistentVolume.
-->
此配置文件指定卷位于集群节点上的 `/mnt/data` 路径。
其配置还指定了卷的容量大小为 10 GB，访问模式为 `ReadWriteOnce`，
这意味着该卷可以被单个节点以读写方式安装。
此配置文件还在 PersistentVolume 中定义了
[StorageClass 的名称](/zh-cn/docs/concepts/storage/persistent-volumes/#class)为 `manual`。
它将用于将 PersistentVolumeClaim 的请求绑定到此 PersistentVolume。

{{< note >}}
<!--
This example uses the `ReadWriteOnce` access mode, for simplicity. For
production use, the Kubernetes project recommends using the `ReadWriteOncePod`
access mode instead.
-->
为了简化，本示例采用了 `ReadWriteOnce` 访问模式。然而对于生产环境，
Kubernetes 项目建议改用 `ReadWriteOncePod` 访问模式。
{{< /note >}}

<!--
Create the PersistentVolume:
-->
创建 PersistentVolume：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-volume.yaml
```

<!--
View information about the PersistentVolume:
-->
查看 PersistentVolume 的信息：

```shell
kubectl get pv task-pv-volume
```

<!--
The output shows that the PersistentVolume has a `STATUS` of `Available`. This
means it has not yet been bound to a PersistentVolumeClaim.
-->
输出结果显示该 PersistentVolume 的`状态（STATUS）`为 `Available`。
这意味着它还没有被绑定给 PersistentVolumeClaim。

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS      CLAIM     STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Available             manual                   4s
```

<!--
## Create a PersistentVolumeClaim

The next step is to create a PersistentVolumeClaim. Pods use PersistentVolumeClaims
to request physical storage. In this exercise, you create a PersistentVolumeClaim
that requests a volume of at least three gibibytes that can provide read-write
access for at most one Node at a time.

Here is the configuration file for the PersistentVolumeClaim:
-->
## 创建 PersistentVolumeClaim   {#create-a-pvc}

下一步是创建一个 PersistentVolumeClaim。
Pod 使用 PersistentVolumeClaim 来请求物理存储。
在本练习中，你将创建一个 PersistentVolumeClaim，它请求至少 3 GB 容量的卷，
该卷一次最多可以为一个节点提供读写访问。

下面是 PersistentVolumeClaim 的配置文件：

{{% code_sample file="pods/storage/pv-claim.yaml" %}}

<!--
Create the PersistentVolumeClaim:
-->
创建 PersistentVolumeClaim：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-claim.yaml
```

<!--
After you create the PersistentVolumeClaim, the Kubernetes control plane looks
for a PersistentVolume that satisfies the claim's requirements. If the control
plane finds a suitable PersistentVolume with the same StorageClass, it binds the
claim to the volume.

Look again at the PersistentVolume:
-->
创建 PersistentVolumeClaim 之后，Kubernetes 控制平面将查找满足申领要求的 PersistentVolume。
如果控制平面找到具有相同 StorageClass 的适当的 PersistentVolume，
则将 PersistentVolumeClaim 绑定到该 PersistentVolume 上。

再次查看 PersistentVolume 信息：

```shell
kubectl get pv task-pv-volume
```

<!--
Now the output shows a `STATUS` of `Bound`.
-->
现在输出的 `STATUS` 为 `Bound`。

```
NAME             CAPACITY   ACCESSMODES   RECLAIMPOLICY   STATUS    CLAIM                   STORAGECLASS   REASON    AGE
task-pv-volume   10Gi       RWO           Retain          Bound     default/task-pv-claim   manual                   2m
```

<!--
Look at the PersistentVolumeClaim:
-->
查看 PersistentVolumeClaim：

```shell
kubectl get pvc task-pv-claim
```

<!--
The output shows that the PersistentVolumeClaim is bound to your PersistentVolume,
`task-pv-volume`.
-->
输出结果表明该 PersistentVolumeClaim 绑定了你的 PersistentVolume `task-pv-volume`。

```
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

<!--
## Create a Pod

The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.

Here is the configuration file for the Pod:
-->
## 创建 Pod   {#create-a-pod}

下一步是创建一个使用你的 PersistentVolumeClaim 作为存储卷的 Pod。

下面是此 Pod 的配置文件：

{{% code_sample file="pods/storage/pv-pod.yaml" %}}

<!--
Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.

Create the Pod:
-->
注意 Pod 的配置文件指定了 PersistentVolumeClaim，但没有指定 PersistentVolume。
对 Pod 而言，PersistentVolumeClaim 就是一个存储卷。

创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

<!--
Verify that the container in the Pod is running;
-->
检查 Pod 中的容器是否运行正常：

```shell
kubectl get pod task-pv-pod
```

<!--
Get a shell to the container running in your Pod:
-->
打开一个 Shell 访问 Pod 中的容器：

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:
-->
在 Shell 中，验证 Nginx 是否正在从 hostPath 卷提供 `index.html` 文件：

<!--
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
-->
```shell
# 一定要在上一步 "kubectl exec" 所返回的 Shell 中执行下面三个命令
apt update
apt install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->
输出结果是你之前写到 hostPath 卷中的 `index.html` 文件中的内容：

```
Hello from Kubernetes storage
```

<!--
If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.
-->
如果你看到此消息，则证明你已经成功地配置了 Pod 使用 PersistentVolumeClaim
的存储。

<!--
## Clean up

Delete the Pod, the PersistentVolumeClaim and the PersistentVolume:
-->
## 清理    {#clean-up}

删除 Pod、PersistentVolumeClaim 和 PersistentVolume 对象：

```shell
kubectl delete pod task-pv-pod
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

<!--
If you don't already have a shell open to the Node in your cluster,
open a new shell the same way that you did earlier.

In the shell on your Node, remove the file and directory that you created:
-->
如果你还没有连接到集群中节点的 Shell，可以按之前所做操作，打开一个新的 Shell。

在节点的 Shell 上，删除你所创建的目录和文件：

<!--
# This assumes that your Node uses "sudo" to run commands
# as the superuser
-->
```shell
# 这里假定你使用 "sudo" 来以超级用户的角色执行命令
sudo rm /mnt/data/index.html
sudo rmdir /mnt/data
```

<!--
You can now close the shell to your Node.
-->
你现在可以关闭连接到节点的 Shell。

<!--
## Mounting the same persistentVolume in two places
-->
## 在两个地方挂载相同的 persistentVolume   {#mounting-the-same-pv-in-two-places}

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

<!--
You can perform 2 volume mounts on your nginx container:

- `/usr/share/nginx/html` for the static website
- `/etc/nginx/nginx.conf` for the default config
-->
你可以在 nginx 容器上执行两个卷挂载：

- `/usr/share/nginx/html` 用于静态网站
- `/etc/nginx/nginx.conf` 作为默认配置

<!-- discussion -->

<!--
## Access control

Storage configured with a group ID (GID) allows writing only by Pods using the same
GID. Mismatched or missing GIDs cause permission denied errors. To reduce the
need for coordination with users, an administrator can annotate a PersistentVolume
with a GID. Then the GID is automatically added to any Pod that uses the
PersistentVolume.

Use the `pv.beta.kubernetes.io/gid` annotation as follows:
-->
## 访问控制  {#access-control}

使用组 ID（GID）配置的存储仅允许 Pod 使用相同的 GID 进行写入。
GID 不匹配或缺失将会导致无权访问错误。
为了减少与用户的协调，管理员可以对 PersistentVolume 添加 GID 注解。
这样 GID 就能自动添加到使用 PersistentVolume 的任何 Pod 中。

使用 `pv.beta.kubernetes.io/gid` 注解的方法如下所示：

```yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv1
  annotations:
    pv.beta.kubernetes.io/gid: "1234"
```

<!--
When a Pod consumes a PersistentVolume that has a GID annotation, the annotated GID
is applied to all containers in the Pod in the same way that GIDs specified in the
Pod's security context are. Every GID, whether it originates from a PersistentVolume
annotation or the Pod's specification, is applied to the first process run in
each container.
-->
当 Pod 使用带有 GID 注解的 PersistentVolume 时，注解的 GID 会被应用于 Pod 中的所有容器，
应用的方法与 Pod 的安全上下文中指定的 GID 相同。
每个 GID，无论是来自 PersistentVolume 注解还是来自 Pod 规约，都会被应用于每个容器中运行的第一个进程。

{{< note >}}
<!--
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
-->
当 Pod 使用 PersistentVolume 时，与 PersistentVolume 关联的 GID 不会在 Pod
资源本身的对象上出现。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Read the [Persistent Storage design document](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).
-->
* 进一步了解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)
* 阅读[持久存储设计文档](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md)

<!--
### Reference
-->
### 参考   {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
