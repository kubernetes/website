<!--
### Synopsis

Upgrade the kube-proxy addon
-->
### 概要

升级 kube-proxy 插件。

```shell
kubeadm upgrade node phase addon kube-proxy [flags]
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Do not change any state, just output the actions that would be performed.
-->
不改变任何状态，只输出将要执行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for kube-proxy
-->
kube-proxy 操作的帮助命令。
</p>
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
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用于和集群通信的 kubeconfig 文件。如果它没有被设置，那么 kubeadm
将会搜索一个已经存在于标准路径的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--  
Path to a directory that contains files named &quot;target[suffix][+patchtype].xtension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;ube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;orednsdeployment&quot;, &quot;kubeproxydaemonset&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;son&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&uot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches re applied first alpha-numerically.
-->
指向一个目录的路径，目录中包含名为 &quot;target[suffix][+patchtype].extension&quot; 的文件。
例如 &quot;kube-apiserver0+merge.yaml&quot; 或 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、
&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、
&quot;kubeletconfiguration&quot;、&quot;corednsdeployment&quot;、
&quot;kubeproxydaemonset&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 
或 &quot;json&quot;，对应 kubectl 所支持的补丁格式。
默认 &quot;patchtype&quot; 为 &quot;strategic&quot;。
&quot;extension&quot; 必须是 &quot;json&quot; 或 &quot;yaml&quot;。
&quot;suffix&quot; 是一个可选字符串，可用于按字母与数字顺序确定哪些补丁优先应用。
</p>
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
<td>
</td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真实”主机根文件系统的路径。指定此参数将导致 kubeadm 切换到所提供的路径。
</p>
</td>
</tr>

</tbody>
</table>
