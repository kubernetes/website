<!--
### Synopsis

Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter
-->
### 概述

检查可升级到哪些版本，并验证您当前的集群是否可升级。 要跳过互联网检查，请传递可选的 [version] 参数

```
kubeadm upgrade plan [version] [flags]
```
<!--
### Options
-->
### 选项

```
<tr>
  <td colspan="2">--allow-experimental-upgrades</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">显示不稳定版本的 Kubernetes 作为升级替代方案，并允许升级到 Kubernetes 的 Alpha/Beta/发行候选版本。</td>
</tr>

<tr>
  <td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">显示 Kubernetes 的发行候选版本作为升级选择，并允许升级到 Kubernetes 的发行候选版本。</td>
</tr>

<tr>
  <td colspan="2">--config string</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">kubeadm 配置文件的路径。</td>
</tr>

<tr>
  <td colspan="2">--feature-gates string</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">一组描述各种特征特性门控的键值对。选项有：<br/>IPv6DualStack=true|false (ALPHA - default=false)</td>
</tr>

<tr>
  <td colspan="2">-h, --help</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">帮助</td>
</tr>

<tr>
  <td colspan="2">--ignore-preflight-errors stringSlice</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">检查清单，其错误将显示为警告。 例如：“IsPrivilegedUser，Swap”。 值 “all” 忽略所有检查的错误。</td>
</tr>

<tr>
  <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">与集群通信时使用的 kubeconfig 文件。 如果标志为未设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。</td>
</tr>

<tr>
  <td colspan="2">--print-config</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">指定是否打印将在升级中使用的配置文件。</td>
</tr>
```
<!--
### Options inherited from parent commands
-->
### 从父命令继承的选项

```
<tr>
  <td colspan="2">--rootfs string</td>
</tr>
<tr>
  <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] “真实”主机根文件系统的路径。</td>
</tr>
```
<!--
SEE ALSO
-->
参考

- [kubeadm upgrade](https://github.com/kubernetes/website/blob/release-1.16/content/en/docs/reference/setup-tools/kubeadm/generated/kubeadm_upgrade.md) - 使用此命令将集群平滑升级到新版本
