<!--
Generates the kube-apiserver static Pod manifest
-->
生成 kube-apiserver 静态 Pod 清单。

<!-- 
### Synopsis 
-->
### 概要

<!-- 
Generates the kube-apiserver static Pod manifest 
-->
生成 kube-apiserver 静态 Pod 清单。

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
<p>
API 服务器所公布的其正在监听的 IP 地址。如果未设置，将使用默认网络接口。
</p>
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
<p>
要绑定到 API 服务器的端口。
</p>
</td>
</tr>

<tr>
<td colspan="2">--apiserver-extra-args <!--&lt;comma-separated 'key=value' pairs&gt;-->&lt;逗号分隔的 'key=value' 对&gt;</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of extra flags to pass to the API Server or override default ones in form of &lt;flagname&gt;=&lt;value&gt;
-->
<p>
一组 &lt;flagname&gt;=&lt;value&gt; 形式的额外参数，用来传递给 API
服务器或者覆盖其默认参数配置。
</p>
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
<p>
保存和存储证书的路径。
</p>
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
<p>
kubeadm 配置文件的路径。
</p>
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
<p>
为控制平面指定一个稳定的 IP 地址或 DNS 名称。
</p>
</td>
</tr>
<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Don't apply any changes; just output what would be done.
-->
<p>
不做任何更改；只输出将要执行的操作。
</p>
</td>
 </tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
EtcdLearnerMode=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
<p>
一组键值对，用于描述各种功能特性的特性门控。选项是：<br/>
EtcdLearnerMode=true|false (BETA - 默认值=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - 默认值=false)<br/>
RootlessControlPlane=true|false (ALPHA - 默认值=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - 默认值=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - 默认值=false)
</p>
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
<p>
apiserver 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Choose a container registry to pull control plane images from
-->
<p>
选择要从中拉取控制平面镜像的容器仓库。
</p>
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
<p>
为控制平面选择特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
<p>
包含名为 &quot;target[suffix][+patchtype].extension&quot; 的文件的目录的路径。
例如，&quot;kube-apiserver0+merge.yaml&quot;或仅仅是 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
并且它们与 kubectl 支持的补丁格式相同。
默认的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必须是&quot;json&quot; 或&quot;yaml&quot;。
&quot;suffix&quot; 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。
</p>
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
<p>
指定服务 VIP 使用 IP 地址的其他范围。
</p>
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
<p>
[实验] 到 '真实' 主机根文件系统路径。
</p>
</td>
</tr>

</tbody>
</table>
