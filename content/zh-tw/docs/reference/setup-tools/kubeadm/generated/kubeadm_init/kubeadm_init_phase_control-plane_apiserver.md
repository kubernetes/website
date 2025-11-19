<!--
### Synopsis 
-->
### 概要

<!--
Generates the kube-apiserver static Pod manifest 
-->
生成 kube-apiserver 靜態 Pod 清單。

```shell
kubeadm init phase control-plane apiserver [flags]
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
-->
API 服務器所公佈的其正在監聽的 IP 地址。如果未設置，將使用默認網絡接口。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：6443
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Port for the API Server to bind to.
-->
要綁定到 API 服務器的端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--apiserver-extra-args <!--&lt;comma-separated 'key=value' pairs&gt;-->&lt;逗號分隔的 'key=value' 對&gt;</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of extra flags to pass to the API Server or override default ones in form of &lt;flagname&gt;=&lt;value&gt;
-->
一組 &lt;flagname&gt;=&lt;value&gt; 形式的額外參數，用來傳遞給 API
服務器或者覆蓋其默認參數配置。
</p>
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify a stable IP address or DNS name for the control plane.
-->
爲控制平面指定一個穩定的 IP 地址或 DNS 名稱。
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
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
ControlPlaneKubeletLocalMode=true|false (BETA - default=true)<br/>
NodeLocalCRISocket=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (default=true)
-->
一組鍵值對，用於描述各種功能特性的特性門控。選項是：<br/>
ControlPlaneKubeletLocalMode=true|false (BETA - 默認值=true)<br/>
NodeLocalCRISocket=true|false (BETA - 默認值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默認值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默認值=false)<br/>
WaitForAllControlPlaneComponents=true|false (默認值=true)
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
help for apiserver
-->
apiserver 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
選擇要從中拉取控制平面鏡像的容器倉庫。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a specific Kubernetes version for the control plane.
-->
爲控制平面選擇特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名爲 &quot;target[suffix][+patchtype].extension&quot; 的文件的目錄的路徑。
例如，&quot;kube-apiserver0+merge.yaml&quot;或僅僅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
並且它們與 kubectl 支持的補丁格式相同。
默認的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必須是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一個可選字符串，可用於確定首先按字母順序應用哪些補丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"
-->
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："10.96.0.0/12"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Use alternative range of IP address for service VIPs.
-->
指定 Service VIP 使用 IP 地址的其他範圍。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到'真實'主機根文件系統路徑。
</p>
</td>
</tr>

</tbody>
</table>
