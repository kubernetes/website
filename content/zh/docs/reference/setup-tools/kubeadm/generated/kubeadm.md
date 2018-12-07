
<!--
kubeadm: easily bootstrap a secure Kubernetes cluster
-->
kubeadm：轻松引导一个安全的 Kubernetes 集群

<!--
### Synopsis
-->

### 概要


<!--
kubeadm: easily bootstrap a secure Kubernetes cluster.
-->
<!--
┌──────────────────────────────────────────────────────────┐
│ KUBEADM IS CURRENTLY IN BETA                             │
│                                                          │
│ But please, try it out and give us feedback at:          │
│ https://github.com/kubernetes/kubeadm/issues             │
│ and at-mention @kubernetes/sig-cluster-lifecycle-bugs    │
│ or @kubernetes/sig-cluster-lifecycle-feature-requests    │
└──────────────────────────────────────────────────────────┘
-->

 kubeadm：轻松引导一个安全的 Kubernetes 集群

    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM 目前处于 BETA                                    │
    │                                                          │
    │ 但请尝试一下并给我们反馈：                               │
    │ https://github.com/kubernetes/kubeadm/issues             │
    │ 和 at-mention @kubernetes/sig-cluster-lifecycle-bugs     │
    │ 或 @kubernetes/sig-cluster-lifecycle-feature-requests    │
    └──────────────────────────────────────────────────────────┘

<!--
Example usage:
-->
<!--
Create a two-machine cluster with one master (which controls the cluster),
and one node (where your workloads, like Pods and Deployments run).
-->
<!--
┌──────────────────────────────────────────────────────────┐
│ On the first machine:                                    │
├──────────────────────────────────────────────────────────┤
│ master# kubeadm init                                     │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ On the second machine:                                   │
├──────────────────────────────────────────────────────────┤
│ node# kubeadm join <arguments-returned-from-init>        │
└──────────────────────────────────────────────────────────┘
-->

用法实例：

    创建具有一个主服务器(控制集群)的两台机器集群，
    还有一个节点(工作负载，比如 pod 和部署都在这里运行)。

    ┌──────────────────────────────────────────────────────────┐
    │ 在第一台机器上：                                         │
    ├──────────────────────────────────────────────────────────┤
    │ master# kubeadm init                                     │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ 在第二台机器上：                                         │
    ├──────────────────────────────────────────────────────────┤
    │ node# kubeadm join <arguments-returned-from-init>        │
    └──────────────────────────────────────────────────────────┘

<!--
    You can then repeat the second step on as many other machines as you like.
-->
    然后，您可以在任意多的其他机器上重复第二步。


<!--
### Options
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubeadm</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

### 选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>




