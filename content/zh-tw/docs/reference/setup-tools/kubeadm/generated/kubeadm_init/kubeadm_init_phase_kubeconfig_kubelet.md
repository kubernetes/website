<!-- 
Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
-->
爲 kubelet 生成一個 kubeconfig 文件，**僅僅**用於集羣引導目的。

<!--
### Synopsis
-->
### 概要

<!--
Generate the kubeconfig file for the kubelet to use and save it to kubelet.conf file.
-->
生成 kubelet 要使用的 kubeconfig 文件，並將其保存到 kubelet.conf 文件。

<!--
Please note that this should *only* be used for cluster bootstrapping purposes. After your control plane is up, you should request all kubelet credentials from the CSR API.
-->
請注意，該操作目的是**僅**用於引導集羣。在控制平面啓動之後，應該從 CSR API 請求所有 kubelet 憑據。

```
kubeadm init phase kubeconfig kubelet [flags]
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
<td colspan="2">--apiserver-advertise-address string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>API 服務器所公佈的其正在監聽的 IP 地址。如果未設置，則使用默認的網絡接口。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Port for the API Server to bind to.</p>
-->
<p>要綁定到 API 服務器的端口。</p>
</td>
</tr>

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
<!--
<p>The path where to save and store the certificates.</p>
-->
<p>保存和存儲證書的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to kubeadm configuration file.</p>
-->
<p>kubeadm 配置文件的路徑。</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify a stable IP address or DNS name for the control plane.</p>
-->
<p>爲控制平面指定一個穩定的 IP 地址或 DNS 名稱。</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Don't apply any changes; just output what would be done.</p>
-->
<p>不做任何更改；只輸出將要執行的操作。</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for kubelet</p>
-->
<p>kubelet 操作的幫助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes"
-->
--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The path where to save the kubeconfig file.</p>
-->
<p>kubeconfig 文件的保存路徑。</p>
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
<!--
<p>Choose a specific Kubernetes version for the control plane.</p>
-->
<p>爲控制平面選擇特定的 Kubernetes 版本。</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify the node name.</p>
-->
<p>指定節點的名稱。</p>
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
<!--
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[實驗] 到 '真實' 主機根文件系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
