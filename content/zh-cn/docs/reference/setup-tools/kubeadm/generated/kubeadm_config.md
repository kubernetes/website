<!-- 
Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster 
-->
管理持久化在 ConfigMap 中的 kubeadm 集群的配置。

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
kube-system 命名空间里有一个名为 "kubeadm-config" 的 ConfigMap，kubeadm 用它来存储有关集群的内部配置。
kubeadm CLI v1.8.0+ 通过一个配置自动创建该 ConfigMap，这个配置是和 'kubeadm init' 共用的。
但是你如果使用 kubeadm v1.7.x 或更低的版本初始化集群，那么必须使用 'config upload' 命令创建此 ConfigMap。
这是必要的操作，目的是使 'kubeadm upgrade' 能够正确地配置升级后的集群。

```
kubeadm config [flags]
```

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
<p>help for config</p>
-->
<p>config 操作的帮助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>The kubeconfig file to use when talking to the cluster.
If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>用于和集群通信的 kubeconfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 kubeconfig 文件。</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

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
<p>[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>
