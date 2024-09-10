<!-- 
Install the kube-proxy addon to a Kubernetes cluster 
-->
将 kube-proxy 插件安装到 Kubernetes 集群

<!--
### Synopsis
-->
### 概要

<!--
Install the kube-proxy addon components via the API server.
-->
通过 API 服务器安装 kube-proxy 附加组件。

```
kubeadm init phase addon kube-proxy [flags]
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
<p>The IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>API 服务器所公布的其正在监听的 IP 地址。如果未设置，则将使用默认网络接口。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: 6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Port for the API Server to bind to.</p>
-->
<p>API 服务器绑定的端口。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to kubeadm config file.</p>
-->
<p>kubeadm 配置文件的路径。</p>
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
<p>为控制平面指定一个稳定的 IP 地址或 DNS 名称。</p>
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
<p>不做任何更改；只输出将要执行的操作。</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for kube-proxy</p>
-->
<p>kube-proxy 操作的帮助命令。</p>
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
<p>Choose a container registry to pull control plane images from</p>
-->
<p>选择用于拉取控制平面镜像的容器仓库。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>与集群通信时使用的 kubeconfig 文件。如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。</p>
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
<p>Choose a specific Kubernetes version for the control plane.</p>
-->
<p>为控制平面选择特定的 Kubernetes 版本。</p>
</td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.</p>
-->
<p>指定 Pod 网络的 IP 地址范围。如果已设置，控制平面将自动为每个节点分配 CIDR。</p>
</td>
</tr>

<tr>
<td colspan="2">--print-manifest</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--Print the addon manifests to STDOUT instead of installing them
-->
向 STDOUT 打印插件清单，而非安装这些插件。
</p></td>
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
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
