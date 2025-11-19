---
layout: blog
title: "Kubernetes 的取證容器檢查點"
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
取證容器檢查點（Forensic container checkpointing）基於 [CRIU][criu]（Checkpoint/Restore In Userspace ，用戶空間的檢查點/恢復），
並允許創建正在運行的容器的有狀態副本，而容器不知道它正在被檢查。容器的副本，可以在沙箱環境中被多次分析和恢復，而原始容器並不知道。
取證容器檢查點是作爲一個 alpha 特性在 Kubernetes v1.25 中引入的。

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
在 CRIU 的幫助下，檢查（checkpoint）和恢復容器成爲可能。CRIU 集成在 runc、crun、CRI-O 和 containerd 中，
而在 Kubernetes 中實現的取證容器檢查點使用這些現有的 CRIU 集成。

<!-- 
## Why is it important?
 -->
## 這一特性爲何重要？

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
藉助 CRIU 和相應的集成，可以獲得磁盤上正在運行的容器的所有信息和狀態，供以後進行取證分析。
取證分析對於在不阻止或影響可疑容器的情況下，對其進行檢查可能很重要。如果容器確實受到攻擊，攻擊者可能會檢測到檢查容器的企圖。
獲取檢查點並在沙箱環境中分析容器，提供了在原始容器和可能的攻擊者不知道檢查的情況下檢查容器的可能性。

<!-- 
In addition to the forensic container checkpointing use case, it is also
possible to migrate a container from one node to another node without loosing
the internal state. Especially for stateful containers with long initialization
times restoring from a checkpoint might save time after a reboot or enable much
faster startup times.
 -->
除了取證容器檢查點用例，還可以在不丟失內部狀態的情況下，將容器從一個節點遷移到另一個節點。
特別是對於初始化時間長的有狀態容器，從檢查點恢復，可能會節省重新啓動後的時間，或者實現更快的啓動時間。

<!-- 
## How do I use container checkpointing?
 -->
## 如何使用容器檢查點？

<!-- 
The feature is behind a [feature gate][container-checkpoint-feature-gate], so
make sure to enable the `ContainerCheckpoint` gate before you can use the new
feature.
 -->
該功能在[特性門控][container-checkpoint-feature-gate]後面，因此在使用這個新功能之前，
請確保啓用了 ContainerCheckpoint 特性門控。

<!-- 
The runtime must also support container checkpointing:

* containerd: support is currently under discussion. See containerd
  pull request [#6965][containerd-checkpoint-restore-pr] for more details.

* CRI-O: v1.25 has support for forensic container checkpointing.
 -->

運行時還必須支持容器檢查點：

* containerd：相關支持目前正在討論中。有關更多詳細信息，請參見 [containerd pull request #6965][containerd-checkpoint-restore-pr]。
* CRI-O：v1.25 支持取證容器檢查點。

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
要將取證容器檢查點與 CRI-O 結合使用，需要使用命令行選項--enable-criu-support=true 啓動運行時。
Kubernetes 方面，你需要在啓用 ContainerCheckpoint 特性門控的情況下運行你的集羣。
由於檢查點功能是由 CRIU 提供的，因此也有必要安裝 CRIU。
通常 runc 或 crun 依賴於 CRIU，因此它是自動安裝的。

<!-- 
It is also important to mention that at the time of writing the checkpointing functionality is
to be considered as an alpha level feature in CRI-O and Kubernetes and the
security implications are still under consideration.
 -->
值得一提的是，在編寫本文時，檢查點功能被認爲是 CRI-O 和 Kubernetes 中的一個 alpha 級特性，其安全影響仍在評估之中。

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
一旦容器和 pod 開始運行，就可以創建一個檢查點。[檢查點][kubelet-checkpoint-api]目前只在 **kubelet** 級別暴露。
要檢查一個容器，可以在運行該容器的節點上運行 curl，並觸發一個檢查點：

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
對於 **default** 命名空間中 **counters** Pod 中名爲 **counter** 的容器，可通過以下方式訪問 **kubelet** API 端點：

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
爲了完整起見，以下 `curl` 命令行選項對於讓 `curl` 接受 **kubelet** 的自簽名證書並授權使用
**kubelet** 檢查點 API 是必要的：

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
觸發這個 **kubelet** API 將從 CRI-O 請求創建一個檢查點，CRI-O 從你的低級運行時（例如 `runc`）請求一個檢查點。
看到這個請求，`runc` 調用 `criu` 工具來執行實際的檢查點操作。

檢查點操作完成後，檢查點應該位於
`/var/lib/kubelet/checkpoints/checkpoint-<pod-name>_<namespace-name>-<container-name>-<timestamp>.tar`

然後，你可以使用 tar 歸檔文件在其他地方恢復容器。

<!-- 
### Restore a checkpointed container outside of Kubernetes (with CRI-O) {#restore-checkpointed-container-standalone}
-->
### 在 Kubernetes 外恢復檢查點容器（使用 CRI-O）

<!--
With the checkpoint tar archive it is possible to restore the container outside
of Kubernetes in a sandboxed instance of CRI-O. For better user experience
during restore, I recommend that you use the latest version of CRI-O from the
*main* CRI-O GitHub branch. If you're using CRI-O v1.25, you'll need to
manually create certain directories Kubernetes would create before starting the
container.
-->
使用檢查點 tar 歸檔文件，可以在 Kubernetes 之外的 CRI-O 沙箱實例中恢復容器。
爲了在恢復過程中獲得更好的用戶體驗，建議你使用 CRI-O GitHub 的 **main** 分支中最新版本的 CRI-O。
如果你使用的是 CRI-O v1.25，你需要在啓動容器之前手動創建 Kubernetes 會創建的某些目錄。
<!-- 
The first step to restore a container outside of Kubernetes is to create a pod sandbox
using *crictl*:

```shell
crictl runp pod-config.json
```
 -->
在 Kubernetes 外恢復容器的第一步是使用 **crictl** 創建一個 pod 沙箱：

```shell
crictl runp pod-config.json
```

<!-- 
Then you can restore the previously checkpointed container into the newly created pod sandbox:

```shell
crictl create <POD_ID> container-config.json pod-config.json
```
 -->
然後，你可以將之前的檢查點容器恢復到新創建的 pod 沙箱中：

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
你不需要在 container-config.json 的註冊表中指定容器鏡像，而是需要指定你之前創建的檢查點歸檔文件的路徑：

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
接下來，運行 crictl start <CONTAINER_ID>來啓動該容器，然後應該會運行先前檢查點容器的副本。

<!-- 
### Restore a checkpointed container within of Kubernetes {#restore-checkpointed-container-k8s}
 -->
### 在 Kubernetes 中恢復檢查點容器

<!-- 
To restore the previously checkpointed container directly in Kubernetes it is
necessary to convert the checkpoint archive into an image that can be pushed to
a registry.
 -->
要在 Kubernetes 中直接恢復之前的檢查點容器，需要將檢查點歸檔文件轉換成可以推送到註冊中心的鏡像。

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
轉換本地檢查點存檔的一種方法包括在 [buildah][buildah] 的幫助下執行以下步驟：

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
生成的鏡像未經標準化，只能與 CRI-O 結合使用。請將此鏡像格式視爲 pre-alpha 格式。
社區正在[討論][image-spec-discussion]如何標準化這樣的檢查點鏡像格式。
重要的是要記住，這種尚未標準化的鏡像格式只有在 CRI-O 已經用`--enable-criu-support=true` 啓動時纔有效。
在 CRIU 支持下啓動 CRI-O 的安全影響尚不清楚，因此應謹慎使用功能和鏡像格式。

<!-- 
Now, you'll need to push that image to a container image registry. For example:

```shell
buildah push localhost/checkpoint-image:latest container-image-registry.example/user/checkpoint-image:latest
```
 -->
現在，你需要將該鏡像推送到容器鏡像註冊中心。例如：

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
要恢復此檢查點鏡像（container-image-registry.example/user/checkpoint-image:latest），
該鏡像需要在 Pod 的規約中列出。下面是一個清單示例：

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
Kubernetes 將新的 Pod 調度到一個節點上。該節點上的 kubelet 指示容器運行時（本例中爲 CRI-O）
基於指定爲 `registry/user/checkpoint-image:latest` 的鏡像創建並啓動容器。
CRI-O 檢測到 `registry/user/checkpoint-image:latest` 是對檢查點數據的引用，而不是容器鏡像。
然後，與創建和啓動容器的通常步驟不同，CRI-O 獲取檢查點數據，並從指定的檢查點恢復容器。

<!-- 
The application in that Pod would continue running as if the checkpoint had not been taken;
within the container, the application looks and behaves like any other container that had been
started normally and not restored from a checkpoint.
-->
該 Pod 中的應用程序將繼續運行，就像檢查點未被獲取一樣；在該容器中，
應用程序的外觀和行爲，與正常啓動且未從檢查點恢復的任何其他容器相似。

<!-- 
With these steps, it is possible to replace a Pod running on one node
with a new equivalent Pod that is running on a different node,
and without losing the state of the containers in that Pod.
-->
通過這些步驟，可以用在不同節點上運行的新的等效 Pod，替換在一個節點上運行的 Pod，而不會丟失該 Pod中容器的狀態。

<!--
## How do I get involved?
-->
## 如何參與？

<!-- 
You can reach SIG Node by several means:

* Slack: [#sig-node](https://kubernetes.slack.com/messages/sig-node)
* [Mailing list](https://groups.google.com/forum/#!forum/kubernetes-sig-node)
 -->
你可以通過多種方式參與 SIG Node：

* Slack: [#sig-node][sig-node]
* [Mailing list][Mailing list]

<!-- 
## Further reading
 -->
## 延伸閱讀

<!-- 
Please see the follow-up article [Forensic container
analysis][forensic-container-analysis] for details on how a container checkpoint
can be analyzed.
-->
有關如何分析容器檢查點的詳細信息，請參閱後續文章[取證容器分析][forensic-container-analysis]。

[forensic-container-analysis]: /zh-cn/blog/2023/03/10/forensic-container-analysis/
[criu]: https://criu.org/
[containerd-checkpoint-restore-pr]: https://github.com/containerd/containerd/pull/6965
[container-checkpoint-feature-gate]: https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/
[image-spec-discussion]: <https://github.com/opencontainers/image-spec/issues/962>
[kubelet-checkpoint-api]: <https://kubernetes.io/docs/reference/node/kubelet-checkpoint-api/>
[buildah]: <https://buildah.io/>
[sig-node]: <https://kubernetes.slack.com/messages/sig-node>
[Mailing list]: <https://groups.google.com/forum/#!forum/kubernetes-sig-node>
