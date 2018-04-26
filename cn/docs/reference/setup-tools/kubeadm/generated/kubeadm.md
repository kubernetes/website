
<!-- kubeadm: easily bootstrap a secure Kubernetes cluster -->

kubeadm: 轻松引导一个安全的kubernetes集群

<!-- ### Synopsis -->

### 概要

<!-- kubeadm: easily bootstrap a secure Kubernetes cluster. -->

kubeadm: 轻松引导一个安全的kubernetes集群
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
    │ KUBEADM 目前还处于测试阶段                                │
    │                                                          │
    │ 但是请试用它，并在以下地址给我们反馈:                       │
    │ https://github.com/kubernetes/kubeadm/issues             │
    │ 并抄送给 @kubernetes/sig-cluster-lifecycle-bugs 或者      │
    │ @kubernetes/sig-cluster-lifecycle-feature-requests       │
    └──────────────────────────────────────────────────────────┘

<!-- Example usage: -->

示例使用:

<!--     Create a two-machine cluster with one master (which controls the cluster),
    and one node (where your workloads, like Pods and Deployments run). -->

    创建一个两节点节点集群，其中一个master节点（用来控制集群），一个node节点（用来运行工作负载，比如 Pods 和 Deployments)。
<!-- 
    ┌──────────────────────────────────────────────────────────┐
    │ On the first machine:                                    │
    ├──────────────────────────────────────────────────────────┤
    │ master# kubeadm init                                     │
    └──────────────────────────────────────────────────────────┘
 -->
    ┌──────────────────────────────────────────────────────────┐
    │ 在第一个节点上:                                           │
    ├──────────────────────────────────────────────────────────┤
    │ master# kubeadm init                                     │
    └──────────────────────────────────────────────────────────┘
<!-- 
    ┌──────────────────────────────────────────────────────────┐
    │ On the second machine:                                   │
    ├──────────────────────────────────────────────────────────┤
    │ node# kubeadm join <arguments-returned-from-init>        │
    └──────────────────────────────────────────────────────────┘
 -->
    ┌──────────────────────────────────────────────────────────┐
    │ 在第二个节点上:                                           │
    ├──────────────────────────────────────────────────────────┤
    │ node# kubeadm join <init 返回的参数>                      │
    └──────────────────────────────────────────────────────────┘

<!--     You can then repeat the second step on as many other machines as you like.
 -->
    然后你可以在任意多个其它机器上重复第二个步骤。
