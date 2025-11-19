<!--
### Synopsis

Check which versions are available to upgrade to and validate whether your current cluster is upgradeable.
This command can only run on the control plane nodes where the kubeconfig file "admin.conf" exists.
To skip the internet check, pass in the optional [version] parameter.
-->
### 概述

檢查可升級到哪些版本，並驗證你當前的叢集是否可升級。
該命令只能在存在 kubeconfig 文件 `admin.conf` 的控制平面節點上運行。
要跳過互聯網檢查，請傳入可選參數 [version]。

```shell
kubeadm upgrade plan [version] [flags]
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
<td colspan="2">--allow-experimental-upgrades</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
顯示不穩定版本的 Kubernetes 作爲升級替代方案，並允許升級到 Kubernetes
的 Alpha、Beta 或 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果爲 true，則當模板中缺少字段或映射鍵時，忽略模板中的錯誤。僅適用於 golang 和
jsonpath 輸出格式。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
-->
顯示 Kubernetes 的發行候選版本作爲升級選擇，並允許升級到 Kubernetes 的 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
設定文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默認值：true</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the upgrade of etcd.
-->
執行 etcd 升級。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text"</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
輸出格式爲
text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file
其中一種。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
EtcdLearnerMode=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
一組描述各種特徵特性門控的鍵值對。選項有：<br/>
EtcdLearnerMode=true|false (BETA - 默認值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默認值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默認值=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - 默認值=false)
WaitForAllControlPlaneComponents=true|false (ALPHA - 默認值=false)
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for plan
-->
plan 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
其錯誤將顯示爲警告的檢查列表。例如：'IsPrivilegedUser,Swap'。
值 'all' 忽略所有檢查錯誤。
</p>
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 文件。如果標誌爲未設置，
則可以在一組標準位置中搜索現有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
<!--
Default: "text"
-->
默認值："text"
</td>
</tr>

<tr>
<td colspan="2">--print-config</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specifies whether the configuration file that will be used in the upgrade should be printed or not.
-->
指定是否打印將在升級中使用的設定文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果開啓，以 JSON 或 YAML 格式打印對象時會保留 managedField。
</p>
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向 “真實” 宿主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
