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
Generate the manifests for the new control plane components 
-->
为新的控制平面组件生成清单

<!--
### Synopsis
-->

### 概要

<!--
Generate the manifests for the new control plane components
-->

为新的控制平面组件生成清单（manifest）

```
kubeadm join phase control-plane-prepare control-plane [flags]
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
<p>If the node should host a new control plane instance, the IP address the API Server will advertise it's listening on. If not set the default network interface will be used.</p>
-->
<p>对于将要托管新的控制平面实例的节点，指定 API 服务器将公布的其正在侦听的 IP 地址。如果未设置，则使用默认网络接口。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 6443
-->
--apiserver-bind-port int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值：6443
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>If the node should host a new control plane instance, the port for the API Server to bind to.</p>
-->
<p>针对将要托管新的控制平面实例的节点，设置 API 服务器要绑定的端口。</p>
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
<td colspan="2">--control-plane</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Create a new control plane instance on this node</p>
-->
<p>在此节点上创建一个新的控制平面实例</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for control-plane</p>
-->
<p>control-plane 操作的帮助命令</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--  
<p>Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.</p>
-->
<p>包含名为 "target[suffix][+patchtype].extension" 的文件的目录的路径。
例如，"kube-apiserver0+merge.yaml" 或仅仅是 "etcd.json"。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，并且它们与 kubectl 支持的补丁格式匹配。
默认的 "patchtype" 为 "strategic"。 "extension" 必须为 "json" 或 "yaml"。 
"suffix" 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 从父命令中继承的选项

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
<p>[实验] 指向 '真实' 宿主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>

