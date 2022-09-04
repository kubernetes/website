<!--
Write kubelet settings and (re)start the kubelet
-->
编写 kubelet 配置并（重新）启动 kubelet

<!-- 
### Synopsis
-->

### 概要

<!--
Write a file with KubeletConfiguration and an environment file with node specific kubelet settings, and then (re)start kubelet.
-->

使用 kubelet 配置文件编写一个文件，并使用特定节点的 kubelet 设置编写一个环境文件，然后（重新）启动 kubelet。

```
kubeadm join phase kubelet-start [api-server-endpoint] [flags]
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to kubeadm config file.
-->
<p>
kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if 
you have more than one CRI installed or if you have non-standard CRI socket.
-->
<p>
连接到 CRI 套接字的路径。如果为空，则 kubeadm 将尝试自动检测该值；仅当安装了多个 CRI 或具有非标准 CRI 套接字时，才使用此选项。
</p>
</td>
</tr>

<tr>
<td colspan="2">--discovery-file string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
For file-based discovery, a file or URL from which to load cluster information.
-->
文件或 URL, 用于从中加载集群信息，适用于基于文件的发现。
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
For token-based discovery, the token used to validate cluster information fetched from the API server.
-->
令牌，用于校验从 API 服务器获取到的集群信息，适用于基于令牌的发现。
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-ca-cert-hash strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
For token-based discovery, validate that the root CA public key matches this hash (format: &quot;&lt;type&gt;:&lt;value&gt;&quot;).
-->
校验根 CA 公钥是否匹配此哈希值（格式：&quot;&lt;type&gt;:&lt;value&gt;&quot;），适用于基于令牌的发现。
</p></td>
</tr>

<tr>
<td colspan="2">--discovery-token-unsafe-skip-ca-verification</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
For token-based discovery, allow joining without --discovery-token-ca-cert-hash pinning.
-->
允许在没有固定 --discovery-token-ca-cert-hash 的情况下接入，适用于基于令牌的发现。
</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet-start
-->
<p>
kubelet-start 操作的帮助命令
</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify the node name.
-->
<p>
指定节点名称。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
目录路径，指向包含名为 “target[suffix][+patchtype].extension” 的文件的目录。
例如，"kube-apiserver0+merge.yaml" 或仅仅是 "etcd.json"。
"target" 可以是 “kube-apiserver”、“kube-controller-manager”、“kube-scheduler”、“etcd”、“kubeletconfiguration” 之一，
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，并且它们与 kubectl 支持的补丁格式匹配。
默认的 "patchtype" 为 "strategic"。 "extension" 必须为 "json" 或 "yaml"。
默认的 "patchtype" 为 "strategic"。 "extension" 必须为 "json" 或 "yaml"。
"suffix" 是一个可选字符串，可用于确定首先按字母顺序应用哪些补丁。
</p></td>
</tr>

<tr>
<td colspan="2">--tls-bootstrap-token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Specify the token used to temporarily authenticate with the Kubernetes Control Plane while joining the node.
-->
指定令牌，用于接入节点时暂时通过 Kubernetes 控制平面的鉴权。
</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>
<!--
Use this token for both discovery-token and tls-bootstrap-token when those values are not provided.
-->
令牌，用作发现令牌和 tls 引导令牌没有提供相应值时使用的令牌。
</p></td>
</tr>


</tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

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
[实验] 到 '真实' 主机根文件系统的路径。
</p>
</td>
</tr>

</tbody>
</table>
