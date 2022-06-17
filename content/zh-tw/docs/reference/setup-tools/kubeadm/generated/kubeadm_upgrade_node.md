<!--
The file is auto-generated from the Go source code of the component using a generic
[generator](https://github.com/kubernetes-sigs/reference-docs/). To learn how
to generate the reference documentation, please read
[Contributing to the reference documentation](/docs/contribute/generate-ref-docs/).
To update the reference conent, please follow the 
[Contributing upstream](/docs/contribute/generate-ref-docs/contribute-upstream/)
guide. You can file document formatting bugs against the
[reference-docs](https://github.com/kubernetes-sigs/reference-docs/) project.
-->

<!--
Upgrade commands for a node in the cluster
-->
升級叢集中某個節點的命令

<!--
### Synopsis
-->

### 概要

<!--
Upgrade commands for a node in the cluster
-->
升級叢集中某個節點的命令

<!--
The "node" command executes the following phases:
-->

"node" 命令執行以下階段：

<!--
```
preflight       Run upgrade node pre-flight checks
control-plane   Upgrade the control plane instance deployed on this node, if any
kubelet-config  Upgrade the kubelet configuration for this node
```
-->

```
preflight       執行節點升級前檢查
control-plane   如果存在的話，升級部署在該節點上的管理面例項
kubelet-config  更新該節點上的 kubelet 配置
```

```
kubeadm upgrade node [flags]
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
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default-->預設值: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
<p>
對升級期間變化的元件所使用的證書執行更新。
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
不更改任何狀態，只輸出將要執行的操作。
</p>
</td>
</tr>

<tr>
<!-- 
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
-->
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: true</td>
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for node
-->
<p>
node 操作的幫助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">--ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks. -->
其錯誤將顯示為警告的檢查列表。示例：'IsPrivilegedUser,Swap'。 值 'all' 忽略所有檢查中的錯誤。
</p></td>
</tr>


<tr>
<!-- 
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用於與叢集互動的 kubeconfig 檔案。如果引數未指定，將從一系列標準位置檢索存在的 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically. -->
包含名為 &quot;target[suffix][+patchtype].extension&quot; 的檔案的目錄的路徑。
例如，&quot;kube-apiserver0+merge.yaml&quot;或僅僅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
並且它們與 kubectl 支援的補丁格式相同。
預設的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必須是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一個可選字串，可用於確定首先按字母順序應用哪些補丁。
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
要跳過的階段的列表
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
