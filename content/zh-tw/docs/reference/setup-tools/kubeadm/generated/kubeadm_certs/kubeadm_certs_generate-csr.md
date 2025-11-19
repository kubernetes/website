<!--
Generate keys and certificate signing requests
-->
生成密鑰和證書籤名請求。

<!--
### Synopsis
-->
### 概要

<!-- 
Generates keys and certificate signing requests (CSRs) for all the certificates required to run the control plane. This command also generates partial kubeconfig files with private key data in the  "users &gt; user &gt; client-key-data" field, and for each kubeconfig file an accompanying ".csr" file is created.
-->
爲運行控制平面所需的所有證書生成密鑰和證書籤名請求（CSR）。該命令會生成部分 kubeconfig 文件，
其中 "users &gt; user &gt; client-key-data" 字段包含私鑰數據，併爲每個 kubeconfig
文件創建一個隨附的 ".csr" 文件。

<!--  
This command is designed for use in [Kubeadm External CA Mode](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). It generates CSRs which you can then submit to your external certificate authority for signing.
-->
此命令設計用於 [Kubeadm 外部 CA 模式](/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode)。
它生成你可以提交給外部證書頒發機構進行簽名的 CSR。

<!--  
The PEM encoded signed certificates should then be saved alongside the key files, using ".crt" as the file extension, or in the case of kubeconfig files, the PEM encoded signed certificate should be base64 encoded and added to the kubeconfig file in the "users &gt; user &gt; client-certificate-data" field.
-->
你需要使用 ".crt" 作爲文件擴展名將 PEM 編碼的簽名證書與密鑰文件一起保存。
或者，對於 kubeconfig 文件，PEM 編碼的簽名證書應使用 base64 編碼，
並添加到 "users &gt; user &gt; client-certificate-data" 字段。

```
kubeadm certs generate-csr [flags]
```

<!--
### Examples
-->
### 示例

<!-- 
```
  # The following command will generate keys and CSRs for all control-plane certificates and kubeconfig files:
  kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
```
-->
```shell
# 以下命令將爲所有控制平面證書和 kubeconfig 文件生成密鑰和 CSR：
kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
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
<td colspan="2">--cert-dir string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save the certificates
-->
保存證書的路徑。
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
到 kubeadm 設定文件的路徑。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for generate-csr
-->
generate-csr 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
-kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"
-->
--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save the kubeconfig file.
-->
保存 kubeconfig 文件的路徑。
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
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到'真實'主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
