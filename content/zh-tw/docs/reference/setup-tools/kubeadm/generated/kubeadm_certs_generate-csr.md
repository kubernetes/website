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
Generate keys and certificate signing requests
-->
生成金鑰和證書籤名請求

<!-- ### Synopsis -->
### 概要

<!-- 
Generates keys and certificate signing requests (CSRs) for all the certificates required to run the control plane. This command also generates partial kubeconfig files with private key data in the  "users &gt; user &gt; client-key-data" field, and for each kubeconfig file an accompanying ".csr" file is created.
-->
為執行控制平面所需的所有證書生成金鑰和證書籤名請求（CSR）。該命令會生成部分 kubeconfig 檔案，
其中 "users &gt; user &gt; client-key-data" 欄位包含私鑰資料，併為每個 kubeconfig
檔案建立一個隨附的 ".csr" 檔案。

<!--  
This command is designed for use in [Kubeadm External CA Mode](https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). It generates CSRs which you can then submit to your external certificate authority for signing.
-->
此命令設計用於
[Kubeadm 外部 CA 模式](https://kubernetes.io/zh-cn/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode)。 
它生成你可以提交給外部證書頒發機構進行簽名的 CSR。

<!--  
The PEM encoded signed certificates should then be saved alongside the key files, using ".crt" as the file extension, or in the case of kubeconfig files, the PEM encoded signed certificate should be base64 encoded and added to the kubeconfig file in the "users &gt; user &gt; client-certificate-data" field.
-->
應使用 ".crt" 作為副檔名將 PEM 編碼的簽名證書與金鑰檔案一起儲存。
或者，對於 kubeconfig 檔案，PEM 編碼的簽名證書應使用 base64 編碼，
並新增到 "users &gt; user &gt; client-certificate-data" 欄位。

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
```
# 以下命令將為所有控制平面證書和 kubeconfig 檔案生成金鑰和 CSR :
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
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the certificates</td-->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>儲存證書的路徑</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadm 配置檔案的路徑。</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">help for generate-csr</td -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>generate-csr 命令的幫助</p></td>
</tr>

<tr>
<!-- td colspan="2">-kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"</td -->
<td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes"</td>
</tr>
<tr>
<!-- td></td><td style="line-height: 130%; word-wrap: break-word;">The path where to save the kubeconfig file.</td-->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>儲存 kubeconfig 檔案的路徑。</p></td>
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
<!-- <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td> -->
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[實驗] 到'真實'主機根檔案系統的路徑。</p></td>
</tr>

</tbody>
</table>
