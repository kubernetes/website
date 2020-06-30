
<!--
### Synopsis
-->

### 概要

<!--
Upgrade your Kubernetes cluster to the specified version
-->

将 Kubernetes 集群升级到指定版本

```
kubeadm upgrade apply [version]
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
<td colspan="2">--allow-experimental-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
显示 Kubernetes 的不稳定版本作为升级替代方案，并允许升级到 Kubernetes 的 alpha/beta 或 RC 版本。
</td>
</tr>

<tr>
<td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
-->
显示 Kubernetes 的候选版本作为升级替代方案，并允许升级到 Kubernetes 的 RC 版本。
</td>
</tr>

<tr>
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
执行升级期间更改的组件所使用的证书的更新。
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Do not change any state, just output what actions would be performed.
-->
不要更改任何状态，只输出要执行的操作。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: true
</td>
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
<td colspan="2">-k, --experimental-kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where kustomize patches for static pod manifests are stored.
-->
用于存储 kustomize 为静态 pod 清单所提供的补丁的路径。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>IPv6DualStack=true|false (ALPHA - default=false)
-->
一组键值对，用于描述各种功能。选项包括：<br/>IPv6DualStack=true|false (ALPHA - 默认值=false)
</td>
</tr>

<tr>
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Force upgrading although some requirements might not be met. This also implies non-interactive mode.
-->
强制升级，但可能无法满足某些要求。这也意味着非交互模式。
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for apply
-->
apply 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors stringSlice</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
错误将显示为警告的检查列表；例如：'IsPrivilegedUser,Swap'。取值为 'all' 时将忽略检查中的所有错误。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-pull-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 15m0s
-->
--image-pull-timeout duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：15m0s
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The maximum amount of time to wait for the control plane pods to be downloaded.
-->
等待控制面板 pod 下载的最长时间。
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
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。如果未设置标志，则在相关目录下搜索以查找现有 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--print-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specifies whether the configuration file that will be used in the upgrade should be printed or not.
-->
指定是否应打印将在升级中使用的配置文件。
</td>
</tr>

<tr>
<td colspan="2">-y, --yes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the upgrade and do not prompt for confirmation (non-interactive mode).
-->
执行升级，不提示确认（非交互模式）。
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

