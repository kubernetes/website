<!--
Upgrade your Kubernetes cluster to the specified version
-->
將 Kubernetes 叢集升級到指定版本

<!--
### Synopsis
-->

### 概要

<!--
Upgrade your Kubernetes cluster to the specified version
-->

將 Kubernetes 叢集升級到指定版本

```
kubeadm upgrade apply [version]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
<p>
顯示 Kubernetes 的不穩定版本作為升級替代方案，並允許升級到 Kubernetes 的 alpha/beta 或 RC 版本。
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
顯示 Kubernetes 的候選版本作為升級替代方案，並允許升級到 Kubernetes 的 RC 版本。
</p>
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
<p>
執行升級期間更改的元件所使用的證書的更新。
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
kubeadm 配置檔案的路徑。
</p>
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
<p>
不要更改任何狀態，只輸出要執行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the upgrade of etcd.
-->
<p>
執行 etcd 的升級。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>PublicKeysECDSA=true|false (ALPHA - default=false)<br/>RootlessControlPlane=true|false (ALPHA - default=false)<br/>UnversionedKubeletConfigMap=true|false (BETA - default=true)
-->
<p>
一組鍵值對，用於描述各種功能。選項包括：
<br/>PublicKeysECDSA=true|false (ALPHA - 預設值=false
<br/>RootlessControlPlane=true|false (ALPHA - 預設值=false)
<br/>UnversionedKubeletConfigMap=true|false (BETA - 預設值=true)
</p>
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
<p>
強制升級，但可能無法滿足某些要求。這也意味著非互動模式。
</p>
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
<p>
apply 操作的幫助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">-ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
<p>
錯誤將顯示為警告的檢查列表；例如：'IsPrivilegedUser,Swap'。取值為 'all' 時將忽略檢查中的所有錯誤。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
與叢集通訊時使用的 kubeconfig 檔案。如果未設定標誌，則在相關目錄下搜尋以查詢現有 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
<p>
包含名為 &quot;target[suffix][+patchtype].extension&quot; 的檔案的目錄的路徑。
例如，&quot;kube-apiserver0+merge.yaml&quot;或僅僅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
並且它們與 kubectl 支援的補丁格式相同。
預設的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必須是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一個可選字串，可用於確定首先按字母順序應用哪些補丁。
</p>
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
指定是否應列印將在升級中使用的配置檔案。
</p>
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
<p>
執行升級，不提示確認（非互動模式）。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[實驗] 指向 '真實' 宿主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>

