<!-- 
### Synopsis 
-->
### 概要

<!-- 
Generates the kube-apiserver static Pod manifest 
-->
生成 kube-apiserver 静态 Pod 清单

```
kubeadm init phase control-plane apiserver [flags]
```

<!-- 
### Options 
-->
### 选项

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
The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.
-->
API 服务器所公布的其正在监听的 IP 地址。如果未设置，将使用默认网络接口。
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Port for the API Server to bind to.
-->
要绑定到 API 服务器的端口。
</td>
</tr>

<tr>
<td colspan="2">--apiserver-extra-args mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of extra flags to pass to the API Server or override default ones in form of &lt;flagname&gt;=&lt;value&gt;
-->
一组 &lt;flagname&gt;=&lt;value&gt; 形式的额外参数，用来传递给 API 服务器
或者覆盖其默认参数配置
</td>
</tr>

<tr>
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save and store the certificates.
-->
保存和存储证书的路径。
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路径。
</td>
</tr>

<tr>
<td colspan="2">--control-plane-endpoint string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify a stable IP address or DNS name for the control plane.
-->
为控制平面指定一个稳定的 IP 地址或 DNS 名称。
</td>
</tr>

<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.-->
包含名为 "target[suffix][+patchtype].extension" 的文件的目录。
例如，"kube-apiserver0+merge.yaml" 或者 "etcd.json"。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，分别与 kubectl
所支持的 patch 格式相匹配。默认的 "patchtype" 是 "strategic"。
"extension" 必须是 "json" 或 "yaml"。
"suffix" 是一个可选的字符串，用来确定按字母顺序排序时首先应用哪些 patch。
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>IPv6DualStack=true|false (ALPHA - default=false)<br/>PublicKeysECDSA=true|false (ALPHA - default=false)
-->
一组键值对，用于描述各种功能特性的特性门控。选项是：
<br/>IPv6DualStack=true|false (ALPHA - 默认=false)
<br/>PublicKeysECDSA=true|false (ALPHA - 默认=false)
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for apiserver
-->
apiserver 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "k8s.gcr.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："k8s.gcr.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a container registry to pull control plane images from
-->
选择要从中拉取控制平面镜像的容器仓库
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a specific Kubernetes version for the control plane.
-->
为控制平面选择特定的 Kubernetes 版本
</td>
</tr>

<tr>
<td colspan="2">
<!--
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "10.96.0.0/12"
-->
--service-cidr string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："10.96.0.0/12"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Use alternative range of IP address for service VIPs.
-->
指定服务 VIP 使用 IP 地址的其他范围。
</td>
</tr>

</tbody>
</table>


<!-- 
### Options inherited from parent commands 
-->

### 继承于父命令的选项

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
[实验] 到 '真实' 主机根文件系统路径。
</td>
</tr>

</tbody>
</table>

