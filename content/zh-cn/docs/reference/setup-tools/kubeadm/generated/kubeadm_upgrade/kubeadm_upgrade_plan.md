<!--
Check which versions are available to upgrade to and validate whether your current cluster is upgradeable.
-->
检查可升级到哪些版本，并验证你当前的集群是否可升级。

<!--
### Synopsis

Check which versions are available to upgrade to and validate whether your current cluster is upgradeable.
This command can only run on the control plane nodes where the kubeconfig file "admin.conf" exists.
To skip the internet check, pass in the optional [version] parameter.
-->
### 概述

检查可升级到哪些版本，并验证你当前的集群是否可升级。
该命令只能在存在 kubeconfig 文件 `admin.conf` 的控制平面节点上运行。
要跳过互联网检查，请传入可选参数 [version]。

```
kubeadm upgrade plan [version] [flags]
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
<p>
显示不稳定版本的 Kubernetes 作为升级替代方案，并允许升级到 Kubernetes 的 Alpha、Beta 或 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果为 true，则当模板中缺少字段或映射键时，忽略模板中的错误。仅适用于 golang 和
jsonpath 输出格式。
</p>
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
<p>
显示 Kubernetes 的发行候选版本作为升级选择，并允许升级到 Kubernetes 的 RC 版本。
</p>
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
<p>
配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
输出格式为
text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file
其中一种。
</p>
</td>
</tr>


<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
EtcdLearnerMode=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
<p>
一组描述各种特征特性门控的键值对。选项有：<br/>
EtcdLearnerMode=true|false (BETA - 默认值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默认值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默认值=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - 默认值=false)
WaitForAllControlPlaneComponents=true|false (ALPHA - 默认值=false)
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for plan
-->
<p>
plan 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
<p>
其错误将显示为警告的检查列表。例如：'IsPrivilegedUser,Swap'。值 'all' 忽略所有检查错误。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
与集群通信时使用的 kubeconfig 文件。如果标志为未设置，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--
Default: "text"
-->
默认值："text"
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
<p>
指定是否打印将在升级中使用的配置文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果开启，以 JSON 或 YAML 格式打印对象时会保留 managedField。
</p></td>
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
[实验] 指向 “真实” 宿主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
