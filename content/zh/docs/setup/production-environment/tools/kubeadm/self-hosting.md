---
title: 配置您的 kubernetes 集群以自托管控制平台
content_type: concept
weight: 100
---
<!--
title: Configuring your kubernetes cluster to self-host the control plane
content_type: concept
weight: 100
-->

<!-- overview -->

<!--
### Self-hosting the Kubernetes control plane {#self-hosting}
-->
### 自托管 Kubernetes 控制平台 {#self-hosting}

<!--
kubeadm allows you to experimentally create a _self-hosted_ Kubernetes control
plane. This means that key components such as the API server, controller
manager, and scheduler run as [DaemonSet pods](/docs/concepts/workloads/controllers/daemonset/)
configured via the Kubernetes API instead of [static pods](/docs/tasks/administer-cluster/static-pod/)
configured in the kubelet via static files.
-->
kubeadm 允许您实验性地创建 _self-hosted_ Kubernetes 控制平面。
这意味着 API 服务器，控制管理器和调度程序之类的关键组件将通过配置 Kubernetes API 以
[DaemonSet Pods](/zh/docs/concepts/workloads/controllers/daemonset/) 的身份运行，
而不是通过静态文件在 kubelet 中配置[静态 Pods](/zh/docs/tasks/configure-pod-container/static-pod/)。

<!--
To create a self-hosted cluster see the
[kubeadm alpha selfhosting pivot](/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-selfhosting) command.
-->
要创建自托管集群，请参见
[kubeadm alpha selfhosting pivot](/zh/docs/reference/setup-tools/kubeadm/kubeadm-alpha/#cmd-selfhosting)
命令。

<!-- body -->

<!--
#### Caveats
-->
#### 警告

<!--
This feature pivots your cluster into an unsupported state, rendering kubeadm unable
to manage you cluster any longer. This includes `kubeadm upgrade`.
-->
{{< caution >}}
此功能将您的集群设置为不受支持的状态，从而使 kubeadm 无法再管理您的集群。
这包括 `kubeadm 升级` 。
{{< /caution >}}

<!--
1. Self-hosting in 1.8 and later has some important limitations. In particular, a
  self-hosted cluster _cannot recover from a reboot of the control-plane node_
  without manual intervention.
-->
1. 1.8及更高版本中的自托管功能有一些重要限制。
   特别是，自托管集群在没有人工干预的情况下_无法从控制平面节点的重新启动中恢复_ 。

<!--
1. By default, self-hosted control plane Pods rely on credentials loaded from
  [`hostPath`](/docs/concepts/storage/volumes/#hostpath)
  volumes. Except for initial creation, these credentials are not managed by
  kubeadm.
-->
2. 默认情况下，自托管的控制平面 Pod 依赖于从
   [`hostPath`](/zh/docs/concepts/storage/volumes/#hostpath) 卷加载的凭据。
   除初始创建外，这些凭据不由 kubeadm 管理。

<!--
1. The self-hosted portion of the control plane does not include etcd,
  which still runs as a static Pod.
-->
3. 控制平面的自托管部分不包括 etcd，后者仍作为静态 Pod 运行。

<!--
#### Process

The self-hosting bootstrap process is documented in the [kubeadm design
document](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting).
-->
#### 过程

自托管引导过程描述于 [kubeadm 设计文档](https://github.com/kubernetes/kubeadm/blob/master/docs/design/design_v1.9.md#optional-self-hosting) 中。

<!--
In summary, `kubeadm alpha selfhosting` works as follows:
-->
总体而言，`kubeadm alpha 自托管` 的工作原理如下：

<!--
  1. Waits for this bootstrap static control plane to be running and
    healthy. This is identical to the `kubeadm init` process without self-hosting.
-->
  1. 等待此引导静态控制平面运行且良好。
     这与没有自我托管的 `kubeadm init` 过程相同。
<!--
  1. Uses the static control plane Pod manifests to construct a set of
    DaemonSet manifests that will run the self-hosted control plane.
    It also modifies these manifests where necessary, for example adding new volumes
    for secrets.
-->
  2. 使用静态控制平面 Pod 清单来构造一组 DaemonSet 清单，这些清单将运行自托管的控制平面。
     它还会在必要时修改这些清单，例如添加新的 secrets 卷。

<!--
  1. Creates DaemonSets in the `kube-system` namespace and waits for the
     resulting Pods to be running.
-->
  3. 在 `kube-system` 名称空间中创建 DaemonSets ，并等待生成的 Pod 运行。

<!--
  1. Once self-hosted Pods are operational, their associated static Pods are deleted
     and kubeadm moves on to install the next component. This triggers kubelet to
     stop those static Pods.
-->
  4. 自托管 Pod 运行后，将删除其关联的静态 Pod，然后 kubeadm 继续安装下一个组件。
     这将触发 kubelet 停止那些静态 Pod 。

<!--
  1. When the original static control plane stops, the new self-hosted control
    plane is able to bind to listening ports and become active.
-->
  5. 当原始静态控制平面停止时，新的自托管控制平面能够绑定到侦听端口并变为活动状态。


