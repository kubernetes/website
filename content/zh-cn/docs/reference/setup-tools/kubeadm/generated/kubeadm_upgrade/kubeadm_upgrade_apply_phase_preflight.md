<!--
### Synopsis
-->
### 概要

<!--
Run preflight checks before upgrade
-->
执行升级前的预检。

```shell
kubeadm upgrade apply phase preflight [flags]
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
<p>
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
显示 Kubernetes 的不稳定版本作为升级替代方案，并允许升级到 Kubernetes
的 Alpha、Beta 或 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
-->
显示 Kubernetes 的发行候选版本作为升级选择，并允许升级到 Kubernetes 的 RC 版本。
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
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Do not change any state, just output the actions that would be performed.
-->
不改变任何状态，只输出将要执行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Force upgrading although some requirements might not be met. This also implies non-interactive mode.
-->
强制升级，但可能无法满足某些要求。这一选项也意味着升级过程是非交互式的。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for preflight
-->
preflight 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
其错误将显示为警告的检查列表。例如：'IsPrivilegedUser,Swap'。值 'all' 忽略所有检查错误。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm
将会搜索一个已经存在于标准路径的 KubeConfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">-y, --yes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the upgrade and do not prompt for confirmation (non-interactive mode).
-->
执行升级，不提示用户确认（非交互模式）。
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
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真实”主机根文件系统的路径。设置此参数将导致 kubeadm 切换到所提供的路径。
</p>
</td>
</tr>

</tbody>
</table>
