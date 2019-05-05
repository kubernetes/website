
<!-- 
kubeadm: easily bootstrap a secure Kubernetes cluster 
-->
kubeadm：轻松创建一个安全的 Kubernetes 集群

<!-- 
### Synopsis 
-->
### 摘要



<!-- 
kubeadm: easily bootstrap a secure Kubernetes cluster. 
-->
kubeadm：轻松创建一个安全的 Kubernetes 集群

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
    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM 正处在 BETA 阶段                                  │
    │                                                          │
    │ 欢迎您踊跃试用，并通过以下网址提交反馈：                     │
    │ https://github.com/kubernetes/kubeadm/issues             │
    │ 同时标注 @kubernetes/sig-cluster-lifecycle-bugs           │
    │ 和 @kubernetes/sig-cluster-lifecycle-feature-requests    │
    └──────────────────────────────────────────────────────────┘ 


<!-- 
Example usage:

    Create a two-machine cluster with one master (which controls the cluster),
    and one node (where your workloads, like Pods and Deployments run). 
-->
用途示例:

    创建一个有两台机器的集群，包含一个主节点（用来控制集群），和一个节点（运行您的工作负载，像 Pod 和 Deployment）。

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
    ┌──────────────────────────────────────────────────────────┐
    │ 在第一台机器上：                                          │
    ├──────────────────────────────────────────────────────────┤
    │ master# kubeadm init                                     │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ 在第二台机器上：                                          │
    ├──────────────────────────────────────────────────────────┤
    │ node# kubeadm join <arguments-returned-from-init>        │
    └──────────────────────────────────────────────────────────┘ 

<!-- 
You can then repeat the second step on as many other machines as you like. 
-->
您可以重复第二步，向集群添加更多机器。


<!-- 
### Options 
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
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for kubeadm</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[试验阶段] 指向 '真实' 宿主机的根目录。</td>
    </tr>

  </tbody>
</table>


