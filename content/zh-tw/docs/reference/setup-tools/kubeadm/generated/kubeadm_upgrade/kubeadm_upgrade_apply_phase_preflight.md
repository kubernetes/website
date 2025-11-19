<!--
### Synopsis
-->
### 概要

<!--
Run preflight checks before upgrade
-->
執行升級前的預檢。

```shell
kubeadm upgrade apply phase preflight [flags]
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
<p>
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
顯示 Kubernetes 的不穩定版本作爲升級替代方案，並允許升級到 Kubernetes
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
顯示 Kubernetes 的發行候選版本作爲升級選擇，並允許升級到 Kubernetes 的 RC 版本。
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
kubeadm 設定文件的路徑。
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
不改變任何狀態，只輸出將要執行的操作。
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
強制升級，但可能無法滿足某些要求。這一選項也意味着升級過程是非交互式的。
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
preflight 操作的幫助命令。
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
其錯誤將顯示爲警告的檢查列表。例如：'IsPrivilegedUser,Swap'。值 'all' 忽略所有檢查錯誤。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值: "/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用於和叢集通信的 KubeConfig 文件。如果它沒有被設置，那麼 kubeadm
將會搜索一個已經存在於標準路徑的 KubeConfig 文件。
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
執行升級，不提示使用者確認（非交互模式）。
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
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。設置此參數將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
