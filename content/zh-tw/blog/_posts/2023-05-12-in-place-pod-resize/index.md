---
layout: blog
title: "Kubernetes 1.27: 原地調整 Pod 資源 (alpha)"
date: 2023-05-12
slug: in-place-pod-resize-alpha
---
<!--
layout: blog
title: "Kubernetes 1.27: In-place Resource Resize for Kubernetes Pods (alpha)"
date: 2023-05-12
slug: in-place-pod-resize-alpha
-->

**作者:** Vinay Kulkarni (Kubescaler Labs)
<!--
**Author:** [Vinay Kulkarni](https://github.com/vinaykul) (Kubescaler Labs)
-->

**譯者**：[Paco Xu](https://github.com/pacoxu) (Daocloud)

<!--
If you have deployed Kubernetes pods with CPU and/or memory resources
specified, you may have noticed that changing the resource values involves
restarting the pod. This has been a disruptive operation for running
workloads... until now.
-->
如果你部署的 Pod 設置了 CPU 或內存資源，你就可能已經注意到更改資源值會導致 Pod 重新啓動。
以前，這對於運行的負載來說是一個破壞性的操作。

<!--
In Kubernetes v1.27, we have added a new alpha feature that allows users
to resize CPU/memory resources allocated to pods without restarting the
containers. To facilitate this, the `resources` field in a pod's containers
now allow mutation for `cpu` and `memory` resources. They can be changed
simply by patching the running pod spec.
-->
在 Kubernetes v1.27 中，我們添加了一個新的 alpha 特性，允許使用者調整分配給 Pod 的
CPU 和內存資源大小，而無需重新啓動容器。 首先，API 層面現在允許修改 Pod 容器中的
`resources` 字段下的 `cpu` 和 `memory` 資源。資源修改只需 patch 正在運行的 pod
規約即可。

<!--
This also means that `resources` field in the pod spec can no longer be
relied upon as an indicator of the pod's actual resources. Monitoring tools
and other such applications must now look at new fields in the pod's status.
Kubernetes queries the actual CPU and memory requests and limits enforced on
the running containers via a CRI (Container Runtime Interface) API call to the
runtime, such as containerd, which is responsible for running the containers.
The response from container runtime is reflected in the pod's status.
-->
這也意味着 Pod 定義中的 `resource` 字段不能再被視爲 Pod 實際資源的指標。監控程序必須
查看 Pod 狀態中的新字段來獲取實際資源狀況。Kubernetes 通過 CRI（Container Runtime
Interface，容器運行時接口）API 調用運行時（例如 containerd）來查詢實際的 CPU 和內存
的請求和限制。容器運行時的響應會反映在 Pod 的狀態中。

<!--
In addition, a new `restartPolicy` for resize has been added. It gives users
control over how their containers are handled when resources are resized.
-->
此外，Pod 中還添加了對應於資源調整的新字段 `restartPolicy`。這個字段使使用者可以控制在資
源調整時容器的行爲。

<!--
## What's new in v1.27?
-->
## 1.27 版本有什麼新內容?

<!--
Besides the addition of resize policy in the pod's spec, a new field named
`allocatedResources` has been added to `containerStatuses` in the pod's status.
This field reflects the node resources allocated to the pod's containers.
-->
除了在 Pod 規範中添加調整策略之外，還在 Pod 狀態中的 `containerStatuses` 中添加了一個名爲
`allocatedResources` 的新字段。該字段反映了分配給 Pod 容器的節點資源。

<!--
In addition, a new field called `resources` has been added to the container's
status. This field reflects the actual resource requests and limits configured
on the running containers as reported by the container runtime.
-->
此外，容器狀態中還添加了一個名爲 `resources` 的新字段。該字段反映的是如同容器運行時所報告的、
針對正運行的容器設定的實際資源 requests 和 limits。

<!--
此處使用了 https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/ 內容：
Lastly, a new field named `resize` has been added to the pod's status to show the
status of the last requested resize. A value of `Proposed` is an acknowledgement
of the requested resize and indicates that request was validated and recorded. A
value of `InProgress` indicates that the node has accepted the resize request
and is in the process of applying the resize request to the pod's containers.
A value of `Deferred` means that the requested resize cannot be granted at this
time, and the node will keep retrying. The resize may be granted when other pods
leave and free up node resources. A value of `Infeasible` is a signal that the
node cannot accommodate the requested resize. This can happen if the requested
resize exceeds the maximum resources the node can ever allocate for a pod.
-->
最後，Pod 狀態中添加了新字段 `resize`。`resize` 字段顯示上次請求待處理的調整狀態。
此字段可以具有以下值：

- Proposed：此值表示請求調整已被確認，並且請求已被驗證和記錄。
- InProgress：此值表示節點已接受調整請求，並正在將其應用於 Pod 的容器。
- Deferred：此值意味着在此時無法批准請求的調整，節點將繼續重試。 當其他 Pod 退出並釋放節點資源時，調整可能會被真正實施。
- Infeasible：此值是一種信號，表示節點無法承接所請求的調整值。 如果所請求的調整超過節點可分配給 Pod 的最大資源，則可能會發生這種情況。

<!--
## When to use this feature
-->
## 何時使用此功能？

<!--
Here are a few examples where this feature may be useful:

- Pod is running on node but with either too much or too little resources.
- Pods are not being scheduled do to lack of sufficient CPU or memory in a
cluster that is underutilized by running pods that were overprovisioned.
- Evicting certain stateful pods that need more resources to schedule them
on bigger nodes is an expensive or disruptive operation when other lower
priority pods in the node can be resized down or moved.
-->
以下是此功能可能有價值的一些示例：

- 正在運行的 Pod 資源限制或者請求過多或過少。
- 一些過度預配資源的 Pod 調度到某個節點，會導致資源利用率較低的叢集上因爲
  CPU 或內存不足而無法調度 Pod。
- 驅逐某些需要較多資源的有狀態 Pod 是一項成本較高或破壞性的操作。
  這種場景下，縮小節點中的其他優先級較低的 Pod 的資源，或者移走這些 Pod 的成本更低。

<!--
## How to use this feature
-->
## 如何使用這個功能

<!--
In order to use this feature in v1.27, the `InPlacePodVerticalScaling`
feature gate must be enabled. A local cluster with this feature enabled
can be started as shown below:
-->
在 v1.27 中使用此功能，必須啓用 `InPlacePodVerticalScaling` 特性門控。
可以如下所示啓動一個啓用了此特性的本地叢集：

<!--
```
root@vbuild:~/go/src/k8s.io/kubernetes# FEATURE_GATES=InPlacePodVerticalScaling=true ./hack/local-up-cluster.sh
go version go1.20.2 linux/arm64
+++ [0320 13:52:02] Building go targets for linux/arm64
    k8s.io/kubernetes/cmd/kubectl (static)
    k8s.io/kubernetes/cmd/kube-apiserver (static)
    k8s.io/kubernetes/cmd/kube-controller-manager (static)
    k8s.io/kubernetes/cmd/cloud-controller-manager (non-static)
    k8s.io/kubernetes/cmd/kubelet (non-static)
...
...
Logs:
  /tmp/etcd.log
  /tmp/kube-apiserver.log
  /tmp/kube-controller-manager.log

  /tmp/kube-proxy.log
  /tmp/kube-scheduler.log
  /tmp/kubelet.log

To start using your cluster, you can open up another terminal/tab and run:

  export KUBECONFIG=/var/run/kubernetes/admin.kubeconfig
  cluster/kubectl.sh

Alternatively, you can write to the default kubeconfig:

  export KUBERNETES_PROVIDER=local

  cluster/kubectl.sh config set-cluster local --server=https://localhost:6443 --certificate-authority=/var/run/kubernetes/server-ca.crt
  cluster/kubectl.sh config set-credentials myself --client-key=/var/run/kubernetes/client-admin.key --client-certificate=/var/run/kubernetes/client-admin.crt
  cluster/kubectl.sh config set-context local --cluster=local --user=myself
  cluster/kubectl.sh config use-context local
  cluster/kubectl.sh

```
-->
```
root@vbuild:~/go/src/k8s.io/kubernetes# FEATURE_GATES=InPlacePodVerticalScaling=true ./hack/local-up-cluster.sh
go version go1.20.2 linux/arm64
+++ [0320 13:52:02] Building go targets for linux/arm64
    k8s.io/kubernetes/cmd/kubectl (static)
    k8s.io/kubernetes/cmd/kube-apiserver (static)
    k8s.io/kubernetes/cmd/kube-controller-manager (static)
    k8s.io/kubernetes/cmd/cloud-controller-manager (non-static)
    k8s.io/kubernetes/cmd/kubelet (non-static)
...
...
Logs:
  /tmp/etcd.log
  /tmp/kube-apiserver.log
  /tmp/kube-controller-manager.log

  /tmp/kube-proxy.log
  /tmp/kube-scheduler.log
  /tmp/kubelet.log

To start using your cluster, you can open up another terminal/tab and run:

  export KUBECONFIG=/var/run/kubernetes/admin.kubeconfig
  cluster/kubectl.sh

# Alternatively, you can write to the default kubeconfig:

  export KUBERNETES_PROVIDER=local

  cluster/kubectl.sh config set-cluster local --server=https://localhost:6443 --certificate-authority=/var/run/kubernetes/server-ca.crt
  cluster/kubectl.sh config set-credentials myself --client-key=/var/run/kubernetes/client-admin.key --client-certificate=/var/run/kubernetes/client-admin.crt
  cluster/kubectl.sh config set-context local --cluster=local --user=myself
  cluster/kubectl.sh config use-context local
  cluster/kubectl.sh

```

<!--
Once the local cluster is up and running, Kubernetes users can schedule pods
with resources, and resize the pods via kubectl. An example of how to use this
feature is illustrated in the following demo video.
-->
一旦本地叢集啓動並運行，Kubernetes 使用者就可以調度帶有資源設定的 pod，並通過 kubectl 調整 pod
的資源。 以下演示視頻演示瞭如何使用此功能的示例。

<!--
{{< youtube id="1m2FOuB6Bh0" title="In-place resize of pod CPU and memory resources">}}
-->
{{< youtube id="1m2FOuB6Bh0" title="原地調整 Pod CPU 或內存資源">}}

<!--
## Example Use Cases
-->
## 示例用例

<!--
### Cloud-based Development Environment
-->
### 雲端開發環境

<!--
In this scenario, developers or development teams write their code locally
but build and test their code in Kubernetes pods with consistent configs
that reflect production use. Such pods need minimal resources when the
developers are writing code, but need significantly more CPU and memory
when they build their code or run a battery of tests. This use case can
leverage in-place pod resize feature (with a little help from eBPF) to
quickly resize the pod's resources and avoid kernel OOM (out of memory)
killer from terminating their processes.
-->
在這種場景下，開發人員或開發團隊在本地編寫代碼，但在和生產環境資源設定相同的 Kubernetes pod 中的
構建和測試代碼。當開發人員編寫代碼時，此類 Pod 需要最少的資源，但在構建代碼或運行一系列測試時需要
更多的 CPU 和內存。 這個用例可以利用原地調整 pod 資源的功能（在 eBPF 的一點幫助下）快速調整 pod
資源的大小，並避免內核 OOM（內存不足）Killer 終止其進程。

<!--
This [KubeCon North America 2022 conference talk](https://www.youtube.com/watch?v=jjfa1cVJLwc)
illustrates the use case.
-->
[KubeCon North America 2022 會議演講](https://www.youtube.com/watch?v=jjfa1cVJLwc)中詳細介紹了上述用例。

<!--
### Java processes initialization CPU requirements
-->
### Java進程初始化CPU要求

<!--
Some Java applications may need significantly more CPU during initialization
than what is needed during normal process operation time. If such applications
specify CPU requests and limits suited for normal operation, they may suffer
from very long startup times. Such pods can request higher CPU values at the
time of pod creation, and can be resized down to normal running needs once the
application has finished initializing.
-->
某些 Java 應用程序在初始化期間 CPU 資源使用量可能比正常進程操作期間所需的 CPU 資源多很多。
如果此類應用程序指定適合正常操作的 CPU 請求和限制，會導致程序啓動時間很長。這樣的 pod
可以在創建 pod 時請求更高的 CPU 值。在應用程序完成初始化後，降低資源設定仍然可以正常運行。

<!--
## Known Issues
-->
## 已知問題

<!--
This feature enters v1.27 at [alpha stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
Below are a few known issues users may encounter:
-->
該功能在 v1.27 中仍然是 [alpha 階段](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
以下是使用者可能會遇到的一些已知問題：

<!--
- containerd versions below v1.6.9 do not have the CRI support needed for full
  end-to-end operation of this feature. Attempts to resize pods will appear
  to be _stuck_ in the `InProgress` state, and `resources` field in the pod's
  status are never updated even though the new resources may have been enacted
  on the running containers.
- Pod resize may encounter a race condition with other pod updates, causing
  delayed enactment of pod resize.
- Reflecting the resized container resources in pod's status may take a while.
- Static CPU management policy is not supported with this feature.
-->
- containerd v1.6.9 以下的版本不具備此功能的所需的 CRI 支持，無法完成端到端的閉環。
嘗試調整 Pod 大小將顯示爲卡在 `InProgress` 狀態，並且 Pod 狀態中的 `resources`
字段永遠不會更新，即使新資源設定可能已經在正在運行的容器上生效了。
- Pod 資源調整可能會遇到與其他 Pod 更新的衝突，導致 pod 資源調整操作被推遲。
- 可能需要一段時間才能在 Pod 的狀態中反映出調整後的容器資源。
- 此特性與靜態 CPU 管理策略不兼容。

<!--
## Credits
-->
## 致謝

<!--
This feature is a result of the efforts of a very collaborative Kubernetes community.
Here's a little shoutout to just a few of the many many people that contributed
countless hours of their time and helped make this happen.
-->
此功能是 Kubernetes 社區高度協作努力的結果。這裏是對在這個功能實現過程中，貢獻了很多幫助的一部分人的一點點致意。

<!--
- [@thockin](https://github.com/thockin) for detail-oriented API design and air-tight code reviews.
- [@derekwaynecarr](https://github.com/derekwaynecarr) for simplifying the design and thorough API and node reviews.
- [@dchen1107](https://github.com/dchen1107) for bringing vast knowledge from Borg and helping us avoid pitfalls.
- [@ruiwen-zhao](https://github.com/ruiwen-zhao) for adding containerd support that enabled full E2E implementation.
- [@wangchen615](https://github.com/wangchen615) for implementing comprehensive E2E tests and driving scheduler fixes.
- [@bobbypage](https://github.com/bobbypage) for invaluable help getting CI ready and quickly investigating issues, covering for me on my vacation.
- [@Random-Liu](https://github.com/Random-Liu) for thorough kubelet reviews and identifying problematic race conditions.
- [@Huang-Wei](https://github.com/Huang-Wei), [@ahg-g](https://github.com/ahg-g), [@alculquicondor](https://github.com/alculquicondor) for helping get scheduler changes done.
- [@mikebrow](https://github.com/mikebrow) [@marosset](https://github.com/marosset) for reviews on short notice that helped CRI changes make it into v1.25.
- [@endocrimes](https://github.com/endocrimes), [@ehashman](https://github.com/ehashman) for helping ensure that the oft-overlooked tests are in good shape.
- [@mrunalp](https://github.com/mrunalp) for reviewing cgroupv2 changes and ensuring clean handling of v1 vs v2.
- [@liggitt](https://github.com/liggitt), [@gjkim42](https://github.com/gjkim42) for tracking down, root-causing important missed issues post-merge.
- [@SergeyKanzhelev](https://github.com/SergeyKanzhelev) for supporting and shepherding various issues during the home stretch.
- [@pdgetrf](https://github.com/pdgetrf) for making the first prototype a reality.
- [@dashpole](https://github.com/dashpole) for bringing me up to speed on 'the Kubernetes way' of doing things.
- [@bsalamat](https://github.com/bsalamat), [@kgolab](https://github.com/kgolab) for very thoughtful insights and suggestions in the early stages.
- [@sftim](https://github.com/sftim), [@tengqm](https://github.com/tengqm) for ensuring docs are easy to follow.
- [@dims](https://github.com/dims) for being omnipresent and helping make merges happen at critical hours.
- Release teams for ensuring that the project stayed healthy.
-->
- [@thockin](https://github.com/thockin) 如此細緻的 API 設計和嚴密的代碼審覈。
- [@derekwaynecarr](https://github.com/derekwaynecarr) 設計簡化和 API & Node 代碼審覈。
- [@dchen1107](https://github.com/dchen1107) 介紹了 Borg 的大量知識，幫助我們避免落入潛在的陷阱。
- [@ruiwen-zhao](https://github.com/ruiwen-zhao) 增加 containerd 支持，使得 E2E 能夠閉環。
- [@wangchen615](https://github.com/wangchen615) 實現完整的 E2E 測試並推進調度問題修復。
- [@bobbypage](https://github.com/bobbypage) 提供寶貴的幫助，讓 CI 準備就緒並快速排查問題，尤其是在我休假時。
- [@Random-Liu](https://github.com/Random-Liu) kubelet 代碼審查以及定位競態條件問題。
- [@Huang-Wei](https://github.com/Huang-Wei), [@ahg-g](https://github.com/ahg-g), [@alculquicondor](https://github.com/alculquicondor) 幫助完成調度部分的修改。
- [@mikebrow](https://github.com/mikebrow) [@marosset](https://github.com/marosset) 幫助我在 v1.25 代碼審查並最終合併 CRI 部分的修改。
- [@endocrimes](https://github.com/endocrimes), [@ehashman](https://github.com/ehashman) 幫助確保經常被忽視的測試處於良好狀態。
- [@mrunalp](https://github.com/mrunalp) cgroupv2 部分的代碼審查並保證了 v1 和 v2 的清晰處理。
- [@liggitt](https://github.com/liggitt), [@gjkim42](https://github.com/gjkim42) 在合併代碼後，幫助追蹤遺漏的重要問題的根因。
- [@SergeyKanzhelev](https://github.com/SergeyKanzhelev) 在衝刺階段支持和解決各種問題。
- [@pdgetrf](https://github.com/pdgetrf) 完成了第一個原型。
- [@dashpole](https://github.com/dashpole) 讓我快速瞭解 Kubernetes 的做事方式。
- [@bsalamat](https://github.com/bsalamat), [@kgolab](https://github.com/kgolab) 在早期階段提供非常周到的見解和建議。
- [@sftim](https://github.com/sftim), [@tengqm](https://github.com/tengqm) 確保文檔易於理解。
- [@dims](https://github.com/dims) 無所不在並幫助在關鍵時刻進行合併。
- 發佈團隊確保了項目保持健康。

<!--
And a big thanks to my very supportive management [Dr. Xiaoning Ding](https://www.linkedin.com/in/xiaoningding/)
and [Dr. Ying Xiong](https://www.linkedin.com/in/ying-xiong-59a2482/) for their patience and encouragement.
-->
非常感謝我非常支持的管理層 [Xiaoning Ding 博士](https://www.linkedin.com/in/xiaoningding/) 和
[Ying Xiong 博士](https://www.linkedin.com/in/ying-xiong-59a2482/)，感謝他們的耐心和鼓勵。

<!--
## References
-->
## 參考

<!--
### For app developers
-->
### 應用程序開發者參考

<!--
- [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
- [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
- [調整分配給容器的 CPU 和內存資源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
- [爲容器和 Pod 分配內存資源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
- [爲容器和 Pod 分配 CPU 資源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators
-->
### 叢集管理員參考

<!--
- [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
- [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
-->
- [爲命名空間設定默認的內存請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
- [爲命名空間設定默認的 CPU 請求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
