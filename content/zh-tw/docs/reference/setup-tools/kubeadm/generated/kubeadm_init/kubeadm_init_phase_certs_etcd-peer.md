<!-- 
### Synopsis
-->
### 概要

<!--
Generate the certificate for etcd nodes to communicate with each other, and save them into etcd/peer.crt and etcd/peer.key files.
-->
生成 etcd 節點相互通信的證書，並將其保存到 `etcd/peer.crt` 和
`etcd/peer.key` 文件中。

<!--
Default SANs are localhost, 127.0.0.1, 127.0.0.1, ::1
-->
默認 SAN 爲 localhost、127.0.0.1、127.0.0.1、::1

<!--
If both files already exist, kubeadm skips the generation step and existing files will be used.
-->
如果兩個文件都已存在，則 kubeadm 將跳過生成步驟，使用現有文件。

```shell
kubeadm init phase certs etcd-peer [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
The path where to save and store the certificates.
-->
保存和存儲證書的路徑。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!-- 
help for etcd-peer
-->
etcd-peer 操作的幫助命令。
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
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
