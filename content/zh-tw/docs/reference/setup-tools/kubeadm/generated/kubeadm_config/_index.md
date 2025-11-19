<!-- 
Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster 
-->
管理持久化在 ConfigMap 中的 kubeadm 集羣的配置。

<!--
### Synopsis
-->
### 概要

<!--
There is a ConfigMap in the kube-system namespace called "kubeadm-config" that kubeadm
uses to store internal configuration about the cluster. kubeadm CLI v1.8.0+ automatically
creates this ConfigMap with the config used with 'kubeadm init', but if you
initialized your cluster using kubeadm v1.7.x or lower, you must use the 'config upload'
command to create this ConfigMap. This is required so that 'kubeadm upgrade' can configure
your upgraded cluster correctly.
-->
kube-system 命名空間裏有一個名爲 "kubeadm-config" 的 ConfigMap，kubeadm 用它來存儲有關集羣的內部配置。
kubeadm CLI v1.8.0+ 通過一個配置自動創建該 ConfigMap，這個配置是和 'kubeadm init' 共用的。
但是你如果使用 kubeadm v1.7.x 或更低的版本初始化集羣，那麼必須使用 'config upload' 命令創建此 ConfigMap。
這是必要的操作，目的是使 'kubeadm upgrade' 能夠正確地配置升級後的集羣。

```
kubeadm config [flags]
```

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
<p>help for config</p>
-->
<p>config 操作的幫助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The kubeconfig file to use when talking to the cluster.
If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>用於和集羣通信的 kubeconfig 文件。如果它沒有被設置，那麼 kubeadm 將會搜索一個已經存在於標準路徑的 kubeconfig 文件。</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承的選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>  
-->
<p>[實驗] 到 '真實' 主機根文件系統的路徑。
</td>
</tr>

</tbody>
</table>
