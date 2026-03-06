---
layout: blog
title: "Kubernetes 1.27: 原地调整 Pod 资源 (alpha)"
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

**译者**：[Paco Xu](https://github.com/pacoxu) (Daocloud)

<!--
If you have deployed Kubernetes pods with CPU and/or memory resources
specified, you may have noticed that changing the resource values involves
restarting the pod. This has been a disruptive operation for running
workloads... until now.
-->
如果你部署的 Pod 设置了 CPU 或内存资源，你就可能已经注意到更改资源值会导致 Pod 重新启动。
以前，这对于运行的负载来说是一个破坏性的操作。

<!--
In Kubernetes v1.27, we have added a new alpha feature that allows users
to resize CPU/memory resources allocated to pods without restarting the
containers. To facilitate this, the `resources` field in a pod's containers
now allow mutation for `cpu` and `memory` resources. They can be changed
simply by patching the running pod spec.
-->
在 Kubernetes v1.27 中，我们添加了一个新的 alpha 特性，允许用户调整分配给 Pod 的
CPU 和内存资源大小，而无需重新启动容器。 首先，API 层面现在允许修改 Pod 容器中的
`resources` 字段下的 `cpu` 和 `memory` 资源。资源修改只需 patch 正在运行的 pod
规约即可。

<!--
This also means that `resources` field in the pod spec can no longer be
relied upon as an indicator of the pod's actual resources. Monitoring tools
and other such applications must now look at new fields in the pod's status.
Kubernetes queries the actual CPU and memory requests and limits enforced on
the running containers via a CRI (Container Runtime Interface) API call to the
runtime, such as containerd, which is responsible for running the containers.
The response from container runtime is reflected in the pod's status.
-->
这也意味着 Pod 定义中的 `resource` 字段不能再被视为 Pod 实际资源的指标。监控程序必须
查看 Pod 状态中的新字段来获取实际资源状况。Kubernetes 通过 CRI（Container Runtime
Interface，容器运行时接口）API 调用运行时（例如 containerd）来查询实际的 CPU 和内存
的请求和限制。容器运行时的响应会反映在 Pod 的状态中。

<!--
In addition, a new `restartPolicy` for resize has been added. It gives users
control over how their containers are handled when resources are resized.
-->
此外，Pod 中还添加了对应于资源调整的新字段 `restartPolicy`。这个字段使用户可以控制在资
源调整时容器的行为。

<!--
## What's new in v1.27?
-->
## 1.27 版本有什么新内容?

<!--
Besides the addition of resize policy in the pod's spec, a new field named
`allocatedResources` has been added to `containerStatuses` in the pod's status.
This field reflects the node resources allocated to the pod's containers.
-->
除了在 Pod 规范中添加调整策略之外，还在 Pod 状态中的 `containerStatuses` 中添加了一个名为
`allocatedResources` 的新字段。该字段反映了分配给 Pod 容器的节点资源。

<!--
In addition, a new field called `resources` has been added to the container's
status. This field reflects the actual resource requests and limits configured
on the running containers as reported by the container runtime.
-->
此外，容器状态中还添加了一个名为 `resources` 的新字段。该字段反映的是如同容器运行时所报告的、
针对正运行的容器配置的实际资源 requests 和 limits。

<!--
此处使用了 https://kubernetes.io/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/ 内容：
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
最后，Pod 状态中添加了新字段 `resize`。`resize` 字段显示上次请求待处理的调整状态。
此字段可以具有以下值：

- Proposed：此值表示请求调整已被确认，并且请求已被验证和记录。
- InProgress：此值表示节点已接受调整请求，并正在将其应用于 Pod 的容器。
- Deferred：此值意味着在此时无法批准请求的调整，节点将继续重试。 当其他 Pod 退出并释放节点资源时，调整可能会被真正实施。
- Infeasible：此值是一种信号，表示节点无法承接所请求的调整值。 如果所请求的调整超过节点可分配给 Pod 的最大资源，则可能会发生这种情况。

<!--
## When to use this feature
-->
## 何时使用此功能？

<!--
Here are a few examples where this feature may be useful:

- Pod is running on node but with either too much or too little resources.
- Pods are not being scheduled do to lack of sufficient CPU or memory in a
cluster that is underutilized by running pods that were overprovisioned.
- Evicting certain stateful pods that need more resources to schedule them
on bigger nodes is an expensive or disruptive operation when other lower
priority pods in the node can be resized down or moved.
-->
以下是此功能可能有价值的一些示例：

- 正在运行的 Pod 资源限制或者请求过多或过少。
- 一些过度预配资源的 Pod 调度到某个节点，会导致资源利用率较低的集群上因为
  CPU 或内存不足而无法调度 Pod。
- 驱逐某些需要较多资源的有状态 Pod 是一项成本较高或破坏性的操作。
  这种场景下，缩小节点中的其他优先级较低的 Pod 的资源，或者移走这些 Pod 的成本更低。

<!--
## How to use this feature
-->
## 如何使用这个功能

<!--
In order to use this feature in v1.27, the `InPlacePodVerticalScaling`
feature gate must be enabled. A local cluster with this feature enabled
can be started as shown below:
-->
在 v1.27 中使用此功能，必须启用 `InPlacePodVerticalScaling` 特性门控。
可以如下所示启动一个启用了此特性的本地集群：

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
一旦本地集群启动并运行，Kubernetes 用户就可以调度带有资源配置的 pod，并通过 kubectl 调整 pod
的资源。 以下演示视频演示了如何使用此功能的示例。

<!--
{{< youtube id="1m2FOuB6Bh0" title="In-place resize of pod CPU and memory resources">}}
-->
{{< youtube id="1m2FOuB6Bh0" title="原地调整 Pod CPU 或内存资源">}}

<!--
## Example Use Cases
-->
## 示例用例

<!--
### Cloud-based Development Environment
-->
### 云端开发环境

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
在这种场景下，开发人员或开发团队在本地编写代码，但在和生产环境资源配置相同的 Kubernetes pod 中的
构建和测试代码。当开发人员编写代码时，此类 Pod 需要最少的资源，但在构建代码或运行一系列测试时需要
更多的 CPU 和内存。 这个用例可以利用原地调整 pod 资源的功能（在 eBPF 的一点帮助下）快速调整 pod
资源的大小，并避免内核 OOM（内存不足）Killer 终止其进程。

<!--
This [KubeCon North America 2022 conference talk](https://www.youtube.com/watch?v=jjfa1cVJLwc)
illustrates the use case.
-->
[KubeCon North America 2022 会议演讲](https://www.youtube.com/watch?v=jjfa1cVJLwc)中详细介绍了上述用例。

<!--
### Java processes initialization CPU requirements
-->
### Java进程初始化CPU要求

<!--
Some Java applications may need significantly more CPU during initialization
than what is needed during normal process operation time. If such applications
specify CPU requests and limits suited for normal operation, they may suffer
from very long startup times. Such pods can request higher CPU values at the
time of pod creation, and can be resized down to normal running needs once the
application has finished initializing.
-->
某些 Java 应用程序在初始化期间 CPU 资源使用量可能比正常进程操作期间所需的 CPU 资源多很多。
如果此类应用程序指定适合正常操作的 CPU 请求和限制，会导致程序启动时间很长。这样的 pod
可以在创建 pod 时请求更高的 CPU 值。在应用程序完成初始化后，降低资源配置仍然可以正常运行。

<!--
## Known Issues
-->
## 已知问题

<!--
This feature enters v1.27 at [alpha stage](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
Below are a few known issues users may encounter:
-->
该功能在 v1.27 中仍然是 [alpha 阶段](/docs/reference/command-line-tools-reference/feature-gates/#feature-stages).
以下是用户可能会遇到的一些已知问题：

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
- containerd v1.6.9 以下的版本不具备此功能的所需的 CRI 支持，无法完成端到端的闭环。
尝试调整 Pod 大小将显示为卡在 `InProgress` 状态，并且 Pod 状态中的 `resources`
字段永远不会更新，即使新资源配置可能已经在正在运行的容器上生效了。
- Pod 资源调整可能会遇到与其他 Pod 更新的冲突，导致 pod 资源调整操作被推迟。
- 可能需要一段时间才能在 Pod 的状态中反映出调整后的容器资源。
- 此特性与静态 CPU 管理策略不兼容。

<!--
## Credits
-->
## 致谢

<!--
This feature is a result of the efforts of a very collaborative Kubernetes community.
Here's a little shoutout to just a few of the many many people that contributed
countless hours of their time and helped make this happen.
-->
此功能是 Kubernetes 社区高度协作努力的结果。这里是对在这个功能实现过程中，贡献了很多帮助的一部分人的一点点致意。

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
- [@thockin](https://github.com/thockin) 如此细致的 API 设计和严密的代码审核。
- [@derekwaynecarr](https://github.com/derekwaynecarr) 设计简化和 API & Node 代码审核。
- [@dchen1107](https://github.com/dchen1107) 介绍了 Borg 的大量知识，帮助我们避免落入潜在的陷阱。
- [@ruiwen-zhao](https://github.com/ruiwen-zhao) 增加 containerd 支持，使得 E2E 能够闭环。
- [@wangchen615](https://github.com/wangchen615) 实现完整的 E2E 测试并推进调度问题修复。
- [@bobbypage](https://github.com/bobbypage) 提供宝贵的帮助，让 CI 准备就绪并快速排查问题，尤其是在我休假时。
- [@Random-Liu](https://github.com/Random-Liu) kubelet 代码审查以及定位竞态条件问题。
- [@Huang-Wei](https://github.com/Huang-Wei), [@ahg-g](https://github.com/ahg-g), [@alculquicondor](https://github.com/alculquicondor) 帮助完成调度部分的修改。
- [@mikebrow](https://github.com/mikebrow) [@marosset](https://github.com/marosset) 帮助我在 v1.25 代码审查并最终合并 CRI 部分的修改。
- [@endocrimes](https://github.com/endocrimes), [@ehashman](https://github.com/ehashman) 帮助确保经常被忽视的测试处于良好状态。
- [@mrunalp](https://github.com/mrunalp) cgroupv2 部分的代码审查并保证了 v1 和 v2 的清晰处理。
- [@liggitt](https://github.com/liggitt), [@gjkim42](https://github.com/gjkim42) 在合并代码后，帮助追踪遗漏的重要问题的根因。
- [@SergeyKanzhelev](https://github.com/SergeyKanzhelev) 在冲刺阶段支持和解决各种问题。
- [@pdgetrf](https://github.com/pdgetrf) 完成了第一个原型。
- [@dashpole](https://github.com/dashpole) 让我快速了解 Kubernetes 的做事方式。
- [@bsalamat](https://github.com/bsalamat), [@kgolab](https://github.com/kgolab) 在早期阶段提供非常周到的见解和建议。
- [@sftim](https://github.com/sftim), [@tengqm](https://github.com/tengqm) 确保文档易于理解。
- [@dims](https://github.com/dims) 无所不在并帮助在关键时刻进行合并。
- 发布团队确保了项目保持健康。

<!--
And a big thanks to my very supportive management [Dr. Xiaoning Ding](https://www.linkedin.com/in/xiaoningding/)
and [Dr. Ying Xiong](https://www.linkedin.com/in/ying-xiong-59a2482/) for their patience and encouragement.
-->
非常感谢我非常支持的管理层 [Xiaoning Ding 博士](https://www.linkedin.com/in/xiaoningding/) 和
[Ying Xiong 博士](https://www.linkedin.com/in/ying-xiong-59a2482/)，感谢他们的耐心和鼓励。

<!--
## References
-->
## 参考

<!--
### For app developers
-->
### 应用程序开发者参考

<!--
- [Resize CPU and Memory Resources assigned to Containers](/docs/tasks/configure-pod-container/resize-container-resources/)
- [Assign Memory Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-memory-resource/)
- [Assign CPU Resources to Containers and Pods](/docs/tasks/configure-pod-container/assign-cpu-resource/)
-->
- [调整分配给容器的 CPU 和内存资源](/zh-cn/docs/tasks/configure-pod-container/resize-container-resources/)
- [为容器和 Pod 分配内存资源](/zh-cn/docs/tasks/configure-pod-container/assign-memory-resource/)
- [为容器和 Pod 分配 CPU 资源](/zh-cn/docs/tasks/configure-pod-container/assign-cpu-resource/)

<!--
### For cluster administrators
-->
### 集群管理员参考

<!--
- [Configure Default Memory Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
- [Configure Default CPU Requests and Limits for a Namespace](/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
-->
- [为命名空间配置默认的内存请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/memory-default-namespace/)
- [为命名空间配置默认的 CPU 请求和限制](/zh-cn/docs/tasks/administer-cluster/manage-resources/cpu-default-namespace/)
