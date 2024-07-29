<!--
Upgrade commands for a node in the cluster
-->
升级集群中某个节点的命令。

<!--
### Synopsis
-->
### 概要

<!--
Upgrade commands for a node in the cluster
-->
升级集群中某个节点的命令。

<!--
The "node" command executes the following phases:
-->
"node" 命令执行以下阶段：

<!--
```
preflight       Run upgrade node pre-flight checks
control-plane   Upgrade the control plane instance deployed on this node, if any
kubelet-config  Upgrade the kubelet configuration for this node
```
-->
```
preflight       执行节点升级前检查
control-plane   如果存在的话，升级部署在该节点上的管理面实例
kubelet-config  更新该节点上的 kubelet 配置
```

```
kubeadm upgrade node [flags]
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
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default-->默认值: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
<p>
对升级期间变化的组件所使用的证书执行续订。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
到 kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Do not change any state, just output the actions that would be performed.
-->
<p>
不更改任何状态，只输出将要执行的操作。
</p>
</td>
</tr>

<tr>
<!-- 
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
-->
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the upgrade of etcd.
-->
<p>
执行 etcd 的升级。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for node
-->
<p>
node 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks. -->
其错误将显示为警告的检查列表。示例：'IsPrivilegedUser,Swap'。值 'all' 忽略所有检查中的错误。
</p></td>
</tr>

<tr>
<!-- 
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用于与集群交互的 kubeconfig 文件。如果参数未指定，将从一系列标准位置检索存在的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名为 &quot;target[suffix][+patchtype].extension&quot; 的文件的目录的路径。
例如，&quot;kube-apiserver0+merge.yaml&quot;或仅仅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
并且它们与 kubectl 支持的补丁格式相同。
默认的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必须是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。
</p></td>
</tr>
</tr>

<tr>
<td colspan="2">--skip-phases strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of phases to be skipped
-->
<p>
要跳过的阶段的列表。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[实验] 指向 '真实' 宿主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
