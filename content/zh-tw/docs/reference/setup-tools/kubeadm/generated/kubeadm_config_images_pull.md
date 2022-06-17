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
該檔案是使用通用[生成器](https://github.com/kubernetes-sigs/reference-docs/) 從元件的 Go 原始碼自動生成的。
要了解如何生成參考文件，請閱讀[參與參考文件](/docs/contribute/generate-ref-docs/)。
要更新參考內容，請按照[貢獻上游](/docs/contribute/generate-ref-docs/contribute-upstream/) 指導。
你可以針對[參考文獻](https://github.com/kubernetes-sigs/reference-docs/) 專案歸檔文件格式錯誤。
-->

<!--
Pull images used by kubeadm
-->
拉取 kubeadm 使用的映象。

<!--
### Synopsis
-->

### 概要

<!--
Pull images used by kubeadm.
-->

拉取 kubeadm 使用的映象。

```
kubeadm config images pull [flags]
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
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
<p>
要連線的 CRI 套接字的路徑。如果為空，則 kubeadm 將嘗試自動檢測此值；僅當安裝了多個 CRI 或具有非標準 CRI 插槽時，才使用此選項。
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
一系列鍵值對（key=value），用於描述各種特徵。可選項是：
<br/>PublicKeysECDSA=true|false (ALPHA - 預設值=false)
<br/>RootlessControlPlane=true|false (ALPHA - 預設值=false)
<br/>UnversionedKubeletConfigMap=true|false (BETA - 預設值=true)
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for pull
-->
<p>
pull 操作的幫助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："k8s.gcr.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a container registry to pull control plane images from
-->
<p>
選擇用於拉取控制平面鏡像的容器倉庫
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
<!--
Choose a specific Kubernetes version for the control plane.
-->
<p>
為控制平面選擇一個特定的 Kubernetes 版本。
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
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
用於和叢集通訊的 kubeconfig 檔案。如果它沒有被設定，那麼 kubeadm 將會搜尋一個已經存在於標準路徑的 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
<p>
[實驗] 到 '真實' 主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
