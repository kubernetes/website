
<!--
### Synopsis
-->

### 概要

<!--
Upgrade commands for a node in the cluster
-->

升级集群中某个节点的命令

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
<td colspan="2">--certificate-renewal</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
对升级期间变化的组件所使用的证书执行更新。
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
不更改任何状态，只输出将要执行的操作。
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
执行 etcd 的升级。
</td>
</tr>

<tr>
<td colspan="2">--experimental-patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名为 "target[suffix][+patchtype].extension" 的文件的目录的路径。
例如，"kube-apiserver0+merge.yaml" 或仅仅是 "etcd.json"。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，并且它们与 kubectl 支持的补丁格式匹配。
默认的 "patchtype" 为 "strategic"。 "extension" 必须为 "json" 或 "yaml"。 
"suffix" 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。
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
node 操作的帮助命令
</td>
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
用于与集群交互的 kubeconfig 文件。如果参数未指定，将从一系列标准位置检索存在的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The *desired* version for the kubelet config after the upgrade. If not specified, the KubernetesVersion from the kubeadm-config ConfigMap will be used
-->
升级后 *期望的* kubelet 配置版本。如未指定，将使用 kubeadm-config ConfigMap 中的 KubernetesVersion
</td>
</tr>

<tr>
<td colspan="2">--skip-phases stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
List of phases to be skipped
-->
要跳过的阶段的列表
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
[实验] 指向 '真实' 宿主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

