<!--
### Synopsis
-->
### 概要

<!--
Print a list of images kubeadm will use. The configuration file is used in case any images or image repositories are customized
-->
打印 kubeadm 要使用的映像檔列表。設定檔案用於自定義映像檔或映像檔儲存庫。

```shell
kubeadm config images list [flags]
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
<td colspan="2">
<!-- --allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true -->
--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值：true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
If true, ignore any errors in templates when a field or map key is missing in the template. Only applies to golang and jsonpath output formats.
-->
如果設置爲 true，則在模板中缺少字段或哈希表的鍵時忽略模板中的任何錯誤。
僅適用於 golang 和 jsonpath 輸出格式。
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
kubeadm 設定檔案的路徑。
</p>
</td>
</tr>
<tr>
<td colspan="2">
<!-- -o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "text" -->
-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："text"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
Output format. One of: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.
-->
<p>
輸出格式：text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file 其中之一。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
ControlPlaneKubeletLocalMode=true|false (BETA - default=true)<br/>
NodeLocalCRISocket=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (default=true)
-->
一組鍵值對（key=value），用於描述各種特性。這些選項是：<br/>
ControlPlaneKubeletLocalMode=true|false (BETA - 預設值=true)<br/>
NodeLocalCRISocket=true|false (BETA - 預設值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 預設值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 預設值=false)<br/>
WaitForAllControlPlaneComponents=true|false (預設值=true)
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
help for list
-->
list 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
選擇要從中拉取控制平面映像檔的容器倉庫。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a specific Kubernetes version for the control plane.
-->
爲控制平面選擇一個特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--show-managed-fields
-->
--show-managed-fields
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
If true, keep the managedFields when printing objects in JSON or YAML format.
-->
如果爲 true，則在以 JSON 或 YAML 格式打印對象時保留 managedFields。
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
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
用於和叢集通信的 kubeconfig 檔案。如果它沒有被設置，那麼 kubeadm
將會搜索一個已經存在於標準路徑的 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到“真實”主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
