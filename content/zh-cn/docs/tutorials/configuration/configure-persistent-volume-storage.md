---
title: 配置 Pod 以使用 PersistentVolume 作为存储
content_type: tutorial
weight: 90
---
<!--
title: Configure a Pod to Use a PersistentVolume for Storage
content_type: tutorial
weight: 90
-->

<!-- overview -->

<!--
This page shows you how to configure a Pod to use a
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
for storage.
Here is a summary of the process:
-->
本文将向你介绍如何配置 Pod 使用
{{< glossary_tooltip text="PersistentVolumeClaim" term_id="persistent-volume-claim" >}}
作为存储。以下是该过程的总结：

<!--
1. You, as cluster administrator, create a PersistentVolume backed by physical
   storage. You do not associate the volume with any Pod.

1. You, now taking the role of a developer / cluster user, create a
   PersistentVolumeClaim that is automatically bound to a suitable
   PersistentVolume.

1. You create a Pod that uses the above PersistentVolumeClaim for storage.
-->
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
-->
## 在你的节点上创建一个 index.html 文件   {#create-an-index-html-file-on-your-node}

打开集群中某个节点的 Shell。如何打开 Shell 取决于集群的设置。
例如，如果你正在使用 Minikube，那么可以通过输入 `minikube ssh` 来打开节点的 Shell。

<!--
In your shell on that Node, create a `/mnt/data` directory:

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo mkdir /mnt/data
```
-->
在该节点的 Shell 中，创建一个 `/mnt/data` 目录：

```shell
# 这里假定你的节点使用 "sudo" 来运行命令
# 即以超级用户身份运行
sudo mkdir /mnt/data
```

<!--
In the `/mnt/data` directory, create an `index.html` file:

```shell
# This again assumes that your Node uses "sudo" to run commands
# as the superuser
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```
-->
在 `/mnt/data` 目录中创建一个 `index.html` 文件：

```shell
# 这里再次假定你的节点使用 "sudo" 来运行命令
# 即以超级用户身份运行
sudo sh -c "echo 'Hello from Kubernetes storage' > /mnt/data/index.html"
```

{{< note >}}
<!--
If your Node uses a tool for superuser access other than `sudo`, you can
usually make this work if you replace `sudo` with the name of the other tool.
-->
如果你的节点使用 `sudo` 以外的工具来获得超级用户访问权限，
通常只要把上述命令中的 `sudo` 替换成该工具的名称即可。
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
现在你可以关闭连接到节点的 Shell 了。

<!--
## Create a PersistentVolume

In this exercise, you create a *hostPath* PersistentVolume. Kubernetes supports
hostPath for development and testing on a single-node cluster. A hostPath
PersistentVolume uses a file or directory on the Node to emulate network-attached storage.
-->
## 创建 PersistentVolume   {#create-a-persistentvolume}

在本练习中，你将创建一个 **hostPath** 类型的 PersistentVolume。
Kubernetes 在单节点集群上支持使用 hostPath 进行开发和测试。
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
在生产集群中，你不会使用 hostPath。集群管理员会提供网络存储资源，比如 Google Compute Engine
持久盘、NFS 共享卷或 Amazon Elastic Block Store 卷。集群管理员还可以使用
[StorageClass](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#storageclass-v1-storage-k8s-io)
来设置[动态制备](/zh-cn/docs/concepts/storage/dynamic-provisioning/)。

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
该配置还指定卷的容量为 10 GiB，访问模式为 `ReadWriteOnce`，
这意味着该卷可以被单个节点以读写方式挂载。它为 PersistentVolume 定义了
[StorageClass 名称](/zh-cn/docs/concepts/storage/persistent-volumes/#class)
`manual`，用于将 PersistentVolumeClaim 的请求绑定到此 PersistentVolume。

{{< note >}}
<!--
This example uses the `ReadWriteOnce` access mode, for simplicity. For
production use, the Kubernetes project recommends using the `ReadWriteOncePod`
access mode instead.
-->
为了简化，本示例采用了 `ReadWriteOnce` 访问模式。
然而对于生产环境，Kubernetes 项目建议改用 `ReadWriteOncePod` 访问模式。
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
输出结果显示该 PersistentVolume 的 `STATUS` 为 `Available`。
这意味着它尚未被绑定到任何 PersistentVolumeClaim。

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
-->
## 创建 PersistentVolumeClaim   {#create-a-persistentvolumeclaim}

下一步是创建一个 PersistentVolumeClaim。
Pod 使用 PersistentVolumeClaim 来请求物理存储。
在本练习中，你将创建一个 PersistentVolumeClaim，
它请求至少 3 GiB 容量的卷，该卷一次最多可以为一个节点提供读写访问。

<!--
Here is the configuration file for the PersistentVolumeClaim:
-->
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
-->
创建 PersistentVolumeClaim 之后，
Kubernetes 控制平面会查找满足该申领要求的 PersistentVolume。
如果控制平面找到具有相同 StorageClass 的合适的 PersistentVolume，
就会将该申领绑定到该卷上。

<!--
Look again at the PersistentVolume:
-->
再次查看 PersistentVolume：

```shell
kubectl get pv task-pv-volume
```

<!--
Now the output shows a `STATUS` of `Bound`.
-->
现在输出显示 `STATUS` 为 `Bound`。

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
输出结果表明该 PersistentVolumeClaim 已绑定到你的 PersistentVolume，
即 `task-pv-volume`。

```
NAME            STATUS    VOLUME           CAPACITY   ACCESSMODES   STORAGECLASS   AGE
task-pv-claim   Bound     task-pv-volume   10Gi       RWO           manual         30s
```

<!--
## Create a Pod

The next step is to create a Pod that uses your PersistentVolumeClaim as a volume.
-->
## 创建 Pod   {#create-a-pod}

下一步是创建一个使用你的 PersistentVolumeClaim 作为存储卷的 Pod。

<!--
Here is the configuration file for the Pod:
-->
下面是此 Pod 的配置文件：

{{% code_sample file="pods/storage/pv-pod.yaml" %}}

<!--
Notice that the Pod's configuration file specifies a PersistentVolumeClaim, but
it does not specify a PersistentVolume. From the Pod's point of view, the claim
is a volume.
-->
注意，Pod 的配置文件指定了 PersistentVolumeClaim，但没有指定 PersistentVolume。
对 Pod 而言，这个申领就是一个存储卷。

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-pod.yaml
```

<!--
Verify that the container in the Pod is running:
-->
验证 Pod 中的容器正在运行：

```shell
kubectl get pod task-pv-pod
```

<!--
Get a shell to the container running in your Pod:
-->
打开一个 Shell 访问 Pod 中运行的容器：

```shell
kubectl exec -it task-pv-pod -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:

```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```
-->
在 Shell 中，验证 nginx 是否正在从 hostPath 卷提供 `index.html` 文件：

```shell
# 请务必在上一步通过 "kubectl exec" 进入的 root Shell 中
# 运行以下 3 条命令
apt update
apt install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->
输出显示的是你写入 hostPath 卷中 `index.html` 文件里的文本：

```
Hello from Kubernetes storage
```

<!--
If you see that message, you have successfully configured a Pod to
use storage from a PersistentVolumeClaim.
-->
如果你看到了这条消息，说明你已经成功配置 Pod 使用来自 PersistentVolumeClaim 的存储。

<!--
## Clean up

Delete the Pod:
-->
## 清理   {#clean-up}

删除 Pod：

```shell
kubectl delete pod task-pv-pod
```

<!--
## Mounting the same PersistentVolume in two places

You have understood how to create a PersistentVolume & PersistentVolumeClaim, and how to mount
the volume to a single location in a container. Let's explore how you can mount the same PersistentVolume
at two different locations in a container. Below is an example:
-->
## 在两个位置挂载同一个 PersistentVolume   {#mounting-the-same-persistentvolume-in-two-places}

你已经了解了如何创建 PersistentVolume 和 PersistentVolumeClaim，也了解了如何将卷挂载到容器中的单个位置。
下面我们来看看如何在容器中的两个不同位置挂载同一个 PersistentVolume。以下是一个示例：

{{% code_sample file="pods/storage/pv-duplicate.yaml" %}}

<!--
Here:

- `subPath`: This field allows specific files or directories from the mounted PersistentVolume to be exposed at
  different locations within the container.  In this example:
  - `subPath: html` mounts the html directory.
  - `subPath: nginx.conf` mounts a specific file, nginx.conf.
-->
其中：

- `subPath`：此字段允许将所挂载 PersistentVolume 中的特定文件或目录暴露到容器内的不同位置。在本例中：
  - `subPath: html` 挂载 html 目录。
  - `subPath: nginx.conf` 挂载一个特定文件 nginx.conf。

<!--
Since the first subPath is `html`, an `html` directory has to be created within `/mnt/data/`
on the node.
-->
由于第一个 subPath 是 `html`，需要在节点上的 `/mnt/data/` 下创建一个 `html` 目录。

<!--
The second subPath `nginx.conf` means that a file within the `/mnt/data/` directory will be used. No other directory
needs to be created.
-->
第二个 subPath `nginx.conf` 表示将使用 `/mnt/data/` 目录下的一个文件。无需创建其他目录。

<!--
Two volume mounts will be made on your nginx container:

- `/usr/share/nginx/html` for the static website
- `/etc/nginx/nginx.conf` for the default config
-->
你的 nginx 容器中会做两个卷挂载：

- `/usr/share/nginx/html` 用于静态网站
- `/etc/nginx/nginx.conf` 用于默认配置

<!--
### Move the index.html file on your Node to a new folder

The `index.html` file mentioned here refers to the one created in the "[Create an index.html file on your Node](#create-an-index-html-file-on-your-node)" section.

Open a shell to the single Node in your cluster. How you open a shell depends on how you set up your cluster.
For example, if you are using Minikube, you can open a shell to your Node by entering `minikube ssh`.
-->
### 将节点上的 index.html 文件移动到新的文件夹   {#move-the-index-html-file-on-your-node-to-a-new-folder}

这里提到的 `index.html`
文件指的是在“[在你的节点上创建一个 index.html 文件](#create-an-index-html-file-on-your-node)”一节中创建的那个文件。

打开连接到集群中单个节点的 Shell。如何打开 Shell 取决于集群的设置方式。
例如，如果你使用 Minikube，可以输入 `minikube ssh` 打开节点的 Shell。

<!--
Create a `/mnt/data/html` directory:

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo mkdir /mnt/data/html
```
-->
创建 `/mnt/data/html` 目录：

```shell
# 这里假定你的节点使用 "sudo" 来运行命令
# 即以超级用户身份运行
sudo mkdir /mnt/data/html
```

<!--
Move index.html into the directory:

```shell
# Move index.html from its current location to the html sub-directory
sudo mv /mnt/data/index.html /mnt/data/html/index.html
```
-->
将 index.html 移动到该目录中：

```shell
# 将 index.html 从当前位置移动到 html 子目录
sudo mv /mnt/data/index.html /mnt/data/html/index.html
```

<!--
### Create a new nginx.conf file

-->
### 新建 nginx.conf 文件   {#create-a-new-nginx-conf-file}

{{% code_sample file="pods/storage/nginx.conf" %}}

<!--
This is a modified version of the default `nginx.conf` file. Here, the default `keepalive_timeout` has been
modified to `60`
-->
这是默认 `nginx.conf` 文件的修改版。这里将默认的 `keepalive_timeout` 修改为 `60`。

<!--
Create the nginx.conf file:
-->
创建 nginx.conf 文件：

```shell
cat <<EOF > /mnt/data/nginx.conf
user  nginx;
worker_processes  auto;
error_log  /var/log/nginx/error.log notice;
pid        /var/run/nginx.pid;

events {
    worker_connections  1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    log_format  main  '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                      '\$status \$body_bytes_sent "\$http_referer" '
                      '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    keepalive_timeout  60;

    #gzip  on;

    include /etc/nginx/conf.d/*.conf;
}
EOF
```

<!--
### Create a Pod

Here we will create a pod that uses the existing persistentVolume and persistentVolumeClaim.
However, the pod mounts only a specific file, `nginx.conf`, and directory, `html`, to the container.
-->
### 创建 Pod   {#create-a-pod-1}

这里我们将创建一个 Pod，使用已有的 PersistentVolume 和 PersistentVolumeClaim。
不过，该 Pod 只把特定文件 `nginx.conf` 和目录 `html` 挂载到容器中。

<!--
Create the Pod:
-->
创建 Pod：

```shell
kubectl apply -f https://k8s.io/examples/pods/storage/pv-duplicate.yaml
```

<!--
Verify that the container in the Pod is running:
-->
验证 Pod 中的容器正在运行：

```shell
kubectl get pod test
```

<!--
Get a shell to the container running in your Pod:
-->
打开一个 Shell 访问 Pod 中运行的容器：

```shell
kubectl exec -it test -- /bin/bash
```

<!--
In your shell, verify that nginx is serving the `index.html` file from the
hostPath volume:

```shell
# Be sure to run these 3 commands inside the root shell that comes from
# running "kubectl exec" in the previous step
apt update
apt install curl
curl http://localhost/
```
-->
在 Shell 中，验证 nginx 是否正在从 hostPath 卷提供 `index.html` 文件：

```shell
# 请务必在上一步通过 "kubectl exec" 进入的 root Shell 中
# 运行以下 3 条命令
apt update
apt install curl
curl http://localhost/
```

<!--
The output shows the text that you wrote to the `index.html` file on the
hostPath volume:
-->
输出显示的是你写入 hostPath 卷中 `index.html` 文件里的文本：

```
Hello from Kubernetes storage
```

<!--
In your shell, also verify that nginx is serving the `nginx.conf` file from the
hostPath volume:

```shell
# Be sure to run these commands inside the root shell that comes from
# running "kubectl exec" in the previous step
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```
-->
在 Shell 中，还要验证 nginx 是否正在从 hostPath 卷提供 `nginx.conf` 文件：

```shell
# 请务必在上一步通过 "kubectl exec" 进入的 root Shell 中
# 运行以下命令
cat /etc/nginx/nginx.conf | grep keepalive_timeout
```

<!--
The output shows the modified text that you wrote to the `nginx.conf` file on the
hostPath volume:
-->
输出显示的是你写入 hostPath 卷中 `nginx.conf` 文件里的修改后文本：

```
keepalive_timeout  60;
```

<!--
If you see these messages, you have successfully configured a Pod to
use a specific file and directory in a storage from a PersistentVolumeClaim.
-->
如果你看到了这些消息，说明你已经成功将 Pod 配置为使用 PersistentVolumeClaim 存储中的特定文件和目录。

<!--
## Clean up

Delete the Pod:
-->
## 清理   {#clean-up-1}

删除 Pod：

```shell
kubectl delete pod test
kubectl delete pvc task-pv-claim
kubectl delete pv task-pv-volume
```

<!--
If you don't already have a shell open to the Node in your cluster,
open a new shell the same way that you did earlier.
-->
如果你还没有打开连接到集群中节点的 Shell，
请按之前的方式新开一个 Shell。

<!--
In the shell on your Node, remove the file and directory that you created:

```shell
# This assumes that your Node uses "sudo" to run commands
# as the superuser
sudo rm /mnt/data/html/index.html
sudo rm /mnt/data/nginx.conf
sudo rmdir /mnt/data/html
sudo rmdir /mnt/data
```
-->
在节点上的 Shell 中，删除你创建的文件和目录：

```shell
# 这里假定你的节点使用 "sudo" 来运行命令
# 即以超级用户身份运行
sudo rm /mnt/data/html/index.html
sudo rm /mnt/data/nginx.conf
sudo rmdir /mnt/data/html
sudo rmdir /mnt/data
```

<!--
You can now close the shell to your Node.
-->
现在你可以关闭连接到节点的 Shell 了。

<!-- discussion -->

<!--
## Access control

Storage configured with a group ID (GID) allows writing only by Pods using the same
GID. Mismatched or missing GIDs cause permission denied errors. To reduce the
need for coordination with users, an administrator can annotate a PersistentVolume
with a GID. Then the GID is automatically added to any Pod that uses the
PersistentVolume.
-->
## 访问控制   {#access-control}

使用组 ID（GID）配置的存储仅允许使用相同 GID 的 Pod 写入。
GID 不匹配或缺失会导致权限拒绝错误。
为了减少与用户协调的需要，管理员可以为 PersistentVolume 添加 GID 注解。
之后，GID 会被自动添加到使用该 PersistentVolume 的任何 Pod 中。

<!--
Use the `pv.beta.kubernetes.io/gid` annotation as follows:
-->
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
当 Pod 使用带有 GID 注解的 PersistentVolume 时，
所注解的 GID 会以与 Pod 安全上下文中指定的 GID 相同的方式应用到 Pod 中的所有容器。
无论是来自 PersistentVolume 注解还是来自 Pod 规约，
每个 GID 都会被应用到每个容器中运行的第一个进程。

{{< note >}}
<!--
When a Pod consumes a PersistentVolume, the GIDs associated with the
PersistentVolume are not present on the Pod resource itself.
-->
当 Pod 使用 PersistentVolume 时，与 PersistentVolume 关联的 GID 不会出现在 Pod 资源本身中。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [PersistentVolumes](/docs/concepts/storage/persistent-volumes/).
* Read the [Persistent Storage design document](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md).
-->
* 进一步了解 [PersistentVolumes](/zh-cn/docs/concepts/storage/persistent-volumes/)。
* 阅读[持久存储设计文档](https://git.k8s.io/design-proposals-archive/storage/persistent-storage.md)。

<!--
### Reference
-->
### 参考   {#reference}

* [PersistentVolume](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolume-v1-core)
* [PersistentVolumeSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumespec-v1-core)
* [PersistentVolumeClaim](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaim-v1-core)
* [PersistentVolumeClaimSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#persistentvolumeclaimspec-v1-core)
