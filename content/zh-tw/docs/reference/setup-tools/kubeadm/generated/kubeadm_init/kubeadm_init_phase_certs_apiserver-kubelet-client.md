<!-- 
### Synopsis
-->
### 概要

<!--
Generate the certificate for the API server to connect to kubelet, and save them into apiserver-kubelet-client.crt and apiserver-kubelet-client.key files.
-->
生成供 API 伺服器連接 kubelet 的證書，並將其保存到 `apiserver-kubelet-client.crt`
和 `apiserver-kubelet-client.key` 文件中。

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used.
-->
如果兩個文件都已存在，則 kubeadm 將跳過生成步驟，使用現有文件。

```shell
kubeadm init phase certs apiserver-kubelet-client [flags]
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
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save and store the certificates.
-->
存儲證書的路徑。
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
kubeadm 設定文件路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Don't apply any changes; just output what would be done.
-->
不做任何更改；只輸出將要執行的操作。
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
help for apiserver-kubelet-client
-->
apiserver-kubelet-client 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a specific Kubernetes version for the control plane.
-->
爲控制平面指定特定的 Kubernetes 版本。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 繼承於父命令的選項

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
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向宿主機上的 '實際' 根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
