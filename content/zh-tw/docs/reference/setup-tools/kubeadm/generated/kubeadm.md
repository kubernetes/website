
<!-- 
kubeadm: easily bootstrap a secure Kubernetes cluster

### Synopsis 
-->

kubeadm: 輕鬆建立一個安全的 Kubernetes 叢集
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
│ 輕鬆建立一個安全的 Kubernetes 叢集                       │
│                                                          │
│ 給我們反饋意見的地址：                                   │
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

建立一個有兩臺機器的叢集，包含一個主節點（用來控制叢集），和一個工作節點（執行你的工作負載，像 Pod 和 Deployment）。

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
│ 在第一臺機器上：                                         │
├──────────────────────────────────────────────────────────┤
│ control-plane# kubeadm init                              │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│ 在第二臺機器上：                                         │
├──────────────────────────────────────────────────────────┤
│ worker# kubeadm join &lt;arguments-returned-from-init&gt;│
└──────────────────────────────────────────────────────────┘
```

你可以重複第二步，向叢集新增更多機器。

<!-- 
### Options 
-->

### 選項

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
<p>kubeadm 操作的幫助資訊<p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 指向 '真實' 宿主機根檔案系統的路徑。<p>
</td>
</tr>

</tbody>
</table>

