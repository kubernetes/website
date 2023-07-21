---
layout: blog
title: "Kubernetes 的取证容器检查点"
date: 2022-12-05
slug: forensic-container-checkpointing-alpha
---

**作者:** [Adrian Reber](https://github.com/adrianreber) (Red Hat)
<!-- 
**Authors:** Adrian Reber (Red Hat)
-->

<!-- 
Forensic container checkpointing is based on [Checkpoint/Restore In
Userspace](https://criu.org/) (CRIU) and allows the creation of stateful copies
of a running container without the container knowing that it is being
checkpointed.  The copy of the container can be analyzed and restored in a
sandbox environment multiple times without the original container being aware
of it. Forensic container checkpointing was introduced as an alpha feature in
Kubernetes v1.25.
-->
取证容器检查点（Forensic container checkpointing）基于 [CRIU][criu]（Checkpoint/Restore In Userspace ，用户空间的检查点/恢复），
并允许创建正在运行的容器的有状态副本，而容器不知道它正在被检查。容器的副本，可以在沙箱环境中被多次分析和恢复，而原始容器并不知道。
取证容器检查点是作为一个 alpha 特性在 Kubernetes v1.25 中引入的。

<!-- 
## How does it work?
 -->
## 工作原理

<!-- 
With the help of CRIU it is possible to checkpoint and restore containers.
CRIU is integrated in runc, crun, CRI-O and containerd and forensic container
checkpointing as implemented in Kubernetes uses these existing CRIU
integrations.
 -->
在 CRIU 的帮助下，检查（checkpoint）和恢复容器成为可能。CRIU 集成在 runc、crun、CRI-O 和 containerd 中，
而在 Kubernetes 中实现的取证容器检查点使用这些现有的 CRIU 集成。

<!-- 
## Why is it important?
 -->
## 这一特性为何重要？

<!-- 
With the help of CRIU and the corresponding integrations it is possible to get
all information and state about a running container on disk for later forensic
analysis. Forensic analysis might be important to inspect a suspicious
container without stopping or influencing it. If the container is really under
attack, the attacker might detect attempts to inspect the container. Taking a
checkpoint and analysing the container in a sandboxed environment offers the
possibility to inspect the container without the original container and maybe
attacker being aware of the inspection.
 -->
借助 CRIU 和相应的集成，可以获得磁盘上正在运行的容器的所有信息和状态，供以后进行取证分析。
取证分析对于在不阻止或影响可疑容器的情况下，对其进行检查可能很重要。如果容器确实受到攻击，攻击者可能会检测到检查容器的企图。
获取检查点并在沙箱环境中分析容器，提供了在原始容器和可能的攻击者不知道检查的情况下检查容器的可能性。

<!-- 
In addition to the forensic container checkpointing use case, it is also
possible to migrate a container from one node to another node without loosing
the internal state. Especially for stateful containers with long initialization
times restoring from a checkpoint might save time after a reboot or enable much
faster startup times.
 -->
除了取证容器检查点用例，还可以在不丢失内部状态的情况下，将容器从一个节点迁移到另一个节点。
特别是对于初始化时间长的有状态容器，从检查点恢复，可能会节省重新启动后的时间，或者实现更快的启动时间。

<!-- 
## How do I use container checkpointing?
 -->
## 如何使用容器检查点？

<!-- 
The feature is behind a [feature gate][container-checkpoint-feature-gate], so
make sure to enable the `ContainerCheckpoint` gate before you can use the new
feature.
 -->
该功能在[特性门控][container-checkpoint-feature-gate]后面，因此在使用这个新功能之前，
请确保启用了 ContainerCheckpoint 特性门控。

<!-- 
The runtime must also support container checkpointing:

* containerd: support is currently under discussion. See containerd
  pull request [#6965][containerd-checkpoint-restore-pr] for more details.

* CRI-O: v1.25 has support for forensic container checkpointing.
 -->

运行时还必须支持容器检查点：

* containerd：相关支持目前正在讨论中。有关更多详细信息，请参见 [containerd pull request #6965][containerd-checkpoint-restore-pr]。
* CRI-O：v1.25 支持取证容器检查点。

<!-- 
### Usage example with CRI-O
 -->
## CRI-O 的使用示例

<!-- 
To use forensic container checkpointing in combination with CRI-O, the runtime
needs to be started with the command-line option `--enable-criu-support=true`.
For Kubernetes, you need to run your cluster with the `ContainerCheckpoint`
feature gate enabled. As the checkpointing functionality is provided by CRIU it
is also necessary to install CRIU.  Usually runc or crun depend on CRIU and
therefore it is installed automatically.
 -->
要将取证容器检查点与 CRI-O 结合使用，需要使用命令行选项--enable-criu-support=true 启动运行时。
Kubernetes 方面，你需要在启用 ContainerCheckpoint 特性门控的情况下运行你的集群。
由于检查点功能是由 CRIU 提供的，因此也有必要安装 CRIU。
通常 runc 或 crun 依赖于 CRIU，因此它是自动安装的。

<!-- 
It is also important to mention that at the time of writing the checkpointing functionality is
to be considered as an alpha level feature in CRI-O and Kubernetes and the
security implications are still under consideration.
 -->
值得一提的是，在编写本文时，检查点功能被认为是 CRI-O 和 Kubernetes 中的一个 alpha 级特性，其安全影响仍在评估之中。

<!-- 
Once containers and pods are running it is possible to create a checkpoint.
[Checkpointing](https://kubernetes.io/docs/reference/node/kubelet-checkpoint-api/)
is currently only exposed on the **kubelet** level. To checkpoint a container,
you can run `curl` on the node where that container is running, and trigger a
checkpoint:

```shell
curl -X POST "https://localhost:10250/checkpoint/namespace/podId/container"
```
 -->
一旦容器和 pod 开始运行，就可以创建一个检查点。[检查点][kubelet-checkpoint-api]目前只在 **kubelet** 级别暴露。
要检查一个容器，可以在运行该容器的节点上运行 curl，并触发一个检查点：

```shell
curl -X POST "https://localhost:10250/checkpoint/namespace/podId/container"
```

<!-- 
For a container named *counter* in a pod named *counters* in a namespace named
*default* the *kubelet* API endpoint is reachable at:

```shell
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```
-->
对于 **default** 命名空间中 **counters** Pod 中名为 **counter** 的容器，可通过以下方式访问 **kubelet** API 端点：

```shell
curl -X POST "https://localhost:10250/checkpoint/default/counters/counter"
```

<!-- 
For completeness the following `curl` command-line options are necessary to
have `curl` accept the *kubelet*'s self signed certificate and authorize the
use of the *kubelet* `checkpoint` API:

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```
-->
为了完整起见，以下 `curl` 命令行选项对于让 `curl` 接受 **kubelet** 的自签名证书并授权使用
**kubelet** 检查点 API 是必要的：

```shell
--insecure --cert /var/run/kubernetes/client-admin.crt --key /var/run/kubernetes/client-admin.key
```

<!--  
Triggering this **kubelet** API will request the creation of a checkpoint from
CRI-O. CRI-O requests a checkpoint from your low-level runtime (for example,
`runc`). Seeing that request, `runc` invokes the `criu` tool
to do the actual checkpointing.

Once the checkpointing has finished the checkpoint should be available at
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

You could then use that tar archive to restore the container somewhere else.
-->
触发这个 **kubelet** API 将从 CRI-O 请求创建一个检查点，CRI-O 从你的低级运行时（例如 `runc`）请求一个检查点。
看到这个请求，`runc` 调用 `criu` 工具来执行实际的检查点操作。

检查点操作完成后，检查点应该位于
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

然后，你可以使用 tar 归档文件在其他地方恢复容器。

<!-- 
### Restore a checkpointed container outside of Kubernetes (with CRI-O) {#restore-checkpointed-container-standalone}
-->
### 在 Kubernetes 外恢复检查点容器（使用 CRI-O）

<!--
With the checkpoint tar archive it is possible to restore the container outside
of Kubernetes in a sandboxed instance of CRI-O. For better user experience
during restore, I recommend that you use the latest version of CRI-O from the
*main* CRI-O GitHub branch. If you're using CRI-O v1.25, you'll need to
manually create certain directories Kubernetes would create before starting the
container.
-->
使用检查点 tar 归档文件，可以在 Kubernetes 之外的 CRI-O 沙箱实例中恢复容器。
为了在恢复过程中获得更好的用户体验，建议你使用 CRI-O GitHub 的 **main** 分支中最新版本的 CRI-O。
如果你使用的是 CRI-O v1.25，你需要在启动容器之前手动创建 Kubernetes 会创建的某些目录。
<!-- 
The first step to restore a container outside of Kubernetes is to create a pod sandbox
using *crictl*:

```shell
crictl runp pod-config.json
```
 -->
在 Kubernetes 外恢复容器的第一步是使用 **crictl** 创建一个 pod 沙箱：

```shell
crictl runp pod-config.json
```

<!-- 
Then you can restore the previously checkpointed container into the newly created pod sandbox:

```shell
crictl create <POD_ID> container-config.json pod-config.json
```
 -->
然后，你可以将之前的检查点容器恢复到新创建的 pod 沙箱中：

```shell
crictl create <POD_ID> container-config.json pod-config.json
```

<!--
Instead of specifying a container image in a registry in `container-config.json`
you need to specify the path to the checkpoint archive that you created earlier:

```json
{
  "metadata": {
      "name": "counter"
  },
  "image":{
      "image": "/var/lib/kubelet/checkpoints/<checkpoint-archive>.tar"
  }
}
```
-->
你不需要在 container-config.json 的注册表中指定容器镜像，而是需要指定你之前创建的检查点归档文件的路径：

```json
{
  "metadata": {
      "name": "counter"
  },
  "image":{
      "image": "/var/lib/kubelet/checkpoints/<checkpoint-archive>.tar"
  }
}
```

<!--
Next, run `crictl start <CONTAINER_ID>` to start that container, and then a
copy of the previously checkpointed container should be running.
-->
接下来，运行 crictl start <CONTAINER_ID>来启动该容器，然后应该会运行先前检查点容器的副本。

<!-- 
### Restore a checkpointed container within of Kubernetes {#restore-checkpointed-container-k8s}
 -->
### 在 Kubernetes 中恢复检查点容器

<!-- 
To restore the previously checkpointed container directly in Kubernetes it is
necessary to convert the checkpoint archive into an image that can be pushed to
a registry.
 -->
要在 Kubernetes 中直接恢复之前的检查点容器，需要将检查点归档文件转换成可以推送到注册中心的镜像。

<!-- 
One possible way to convert the local checkpoint archive consists of the
following steps with the help of [buildah](https://buildah.io/):

```shell
newcontainer=$(buildah from scratch)
buildah add $newcontainer /var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar /
buildah config --annotation=io.kubernetes.cri-o.annotations.checkpoint.name=<container-name> $newcontainer
buildah commit $newcontainer checkpoint-image:latest
buildah rm $newcontainer
```
 -->
转换本地检查点存档的一种方法包括在 [buildah][buildah] 的帮助下执行以下步骤：

```shell
newcontainer=$(buildah from scratch)
buildah add $newcontainer /var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar /
buildah config --annotation=io.kubernetes.cri-o.annotations.checkpoint.name=<container-name> $newcontainer
buildah commit $newcontainer checkpoint-image:latest
buildah rm $newcontainer
```

<!-- 
The resulting image is not standardized and only works in combination with
CRI-O.  Please consider this image format as pre-alpha. There are ongoing
[discussions][image-spec-discussion] to standardize the format of checkpoint
images like this. Important to remember is that this not yet standardized image
format only works if CRI-O has been started with `--enable-criu-support=true`.
The security implications of starting CRI-O with CRIU support are not yet clear
and therefore the functionality as well as the image format should be used with
care.
 -->
生成的镜像未经标准化，只能与 CRI-O 结合使用。请将此镜像格式视为 pre-alpha 格式。
社区正在[讨论][image-spec-discussion]如何标准化这样的检查点镜像格式。
重要的是要记住，这种尚未标准化的镜像格式只有在 CRI-O 已经用`--enable-criu-support=true` 启动时才有效。
在 CRIU 支持下启动 CRI-O 的安全影响尚不清楚，因此应谨慎使用功能和镜像格式。

<!-- 
Now, you'll need to push that image to a container image registry. For example:

```shell
buildah push localhost/checkpoint-image:latest container-image-registry.example/user/checkpoint-image:latest
```
 -->
现在，你需要将该镜像推送到容器镜像注册中心。例如：

```shell
buildah push localhost/checkpoint-image:latest container-image-registry.example/user/checkpoint-image:latest
```

<!-- 
To restore this checkpoint image (`container-image-registry.example/user/checkpoint-image:latest`), the
image needs to be listed in the specification for a Pod. Here's an example
manifest:

```yaml
apiVersion: v1
kind: Pod
metadata:
  namePrefix: example-
spec:
  containers:
  - name: <container-name>
    image: container-image-registry.example/user/checkpoint-image:latest
  nodeName: <destination-node>
```
 -->
要恢复此检查点镜像（container-image-registry.example/user/checkpoint-image:latest），
该镜像需要在 Pod 的规约中列出。下面是一个清单示例：

```yaml
apiVersion: v1
kind: Pod
metadata:
  namePrefix: example-
spec:
  containers:
  - name: <container-name>
    image: container-image-registry.example/user/checkpoint-image:latest
  nodeName: <destination-node>
```

<!-- 
Kubernetes schedules the new Pod onto a node. The kubelet on that node
instructs the container runtime (CRI-O in this example) to create and start a
container based on an image specified as `registry/user/checkpoint-image:latest`.
CRI-O detects that `registry/user/checkpoint-image:latest`
is a reference to checkpoint data rather than a container image. Then,
instead of the usual steps to create and start a container,
CRI-O fetches the checkpoint data and restores the container from that
specified checkpoint.
-->
Kubernetes 将新的 Pod 调度到一个节点上。该节点上的 kubelet 指示容器运行时（本例中为 CRI-O）
基于指定为 `registry/user/checkpoint-image:latest` 的镜像创建并启动容器。
CRI-O 检测到 `registry/user/checkpoint-image:latest` 是对检查点数据的引用，而不是容器镜像。
然后，与创建和启动容器的通常步骤不同，CRI-O 获取检查点数据，并从指定的检查点恢复容器。

<!-- 
The application in that Pod would continue running as if the checkpoint had not been taken;
within the container, the application looks and behaves like any other container that had been
started normally and not restored from a checkpoint.
-->
该 Pod 中的应用程序将继续运行，就像检查点未被获取一样；在该容器中，
应用程序的外观和行为，与正常启动且未从检查点恢复的任何其他容器相似。

<!-- 
With these steps, it is possible to replace a Pod running on one node
with a new equivalent Pod that is running on a different node,
and without losing the state of the containers in that Pod.
-->
通过这些步骤，可以用在不同节点上运行的新的等效 Pod，替换在一个节点上运行的 Pod，而不会丢失该 Pod中容器的状态。

<!--
## How do I get involved?
-->
## 如何参与？

<!-- 
You can reach SIG Node by several means:

* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
 -->
你可以通过多种方式参与 SIG Node：

* Slack: [#sig-node][sig-node]
* [Mailing list][Mailing list]

<!-- 
## Further reading
 -->
## 延伸阅读

<!-- 
Please see the follow-up article [Forensic container
analysis][forensic-container-analysis] for details on how a container checkpoint
can be analyzed.
-->
有关如何分析容器检查点的详细信息，请参阅后续文章[取证容器分析][forensic-container-analysis]。

[forensic-container-analysis]: /zh-cn/blog/2023/03/10/forensic-container-analysis/
[criu]: https://criu.org/
[containerd-checkpoint-restore-pr]: https://github.com/containerd/containerd/pull/6965
[container-checkpoint-feature-gate]: https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/
[image-spec-discussion]: <https://github.com/opencontainers/image-spec/issues/962>
[kubelet-checkpoint-api]: <https://kubernetes.io/docs/reference/node/kubelet-checkpoint-api/>
[buildah]: <https://buildah.io/>
[sig-node]: <https://kubernetes.slack.com/messages/sig-node>
[Mailing list]: <https://groups.google.com/forum/#!forum/kubernetes-sig-node>
