<!-- 
kubeadm: easily bootstrap a secure Kubernetes cluster

### Synopsis 
-->
kubeadm：轻松创建一个安全的 Kubernetes 集群

### 摘要

<!--
    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM                                                  │
    │ Easily bootstrap a secure Kubernetes cluster             │
    │                                                          │
    │ Please give us feedback at:                              │
    │ https://github.com/kubernetes/kubeadm/issues             │
    └──────────────────────────────────────────────────────────┘
-->
```
┌──────────────────────────────────────────────────────────┐
│ KUBEADM                                                  │
│ 轻松创建一个安全的 Kubernetes 集群                       │
│                                                          │
│ 给我们反馈意见的地址：                                   │
│ https://github.com/kubernetes/kubeadm/issues             │
└──────────────────────────────────────────────────────────┘
```

<!-- 
Example usage: 
-->
用途示例：

<!-- 
    Create a two-machine cluster with one control-plane node
    (which controls the cluster), and one worker node
    (where your workloads, like Pods and Deployments run).
-->
创建一个有两台机器的集群，包含一个控制平面节点（用来控制集群）
和一个工作节点（运行你的 Pod 和 Deployment 等工作负载）。

<!--
    ┌──────────────────────────────────────────────────────────┐
    │ On the first machine:                                    │
    ├──────────────────────────────────────────────────────────┤
    │ control-plane# kubeadm init                              │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ On the second machine:                                   │
    ├──────────────────────────────────────────────────────────┤
    │ worker# kubeadm join &lt;arguments-returned-from-init&gt;      │
    └──────────────────────────────────────────────────────────┘

    You can then repeat the second step on as many other machines as you like.
-->
```
┌──────────────────────────────────────────────────────────┐
│ 在第一台机器上：                                            │
├──────────────────────────────────────────────────────────┤
│ control-plane# kubeadm init                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 在第二台机器上：                                            │
├──────────────────────────────────────────────────────────┤
│ worker# kubeadm join &lt;arguments-returned-from-init&gt;│
└──────────────────────────────────────────────────────────┘
```

你可以重复第二步，向集群添加更多机器。

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for kubeadm</p>
-->
<p>kubeadm 操作的帮助信息。<p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真实”主机根文件系统的路径。设置此参数将导致 kubeadm 切换到所提供的路径。
<p>
</td>
</tr>

</tbody>
</table>
