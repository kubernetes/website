<!--
Upload the kubelet component config to a ConfigMap
-->
将 kubelet 组件配置上传到 ConfigMap。

<!--
### Synopsis
-->
### 概要

<!--
Upload the kubelet configuration extracted from the kubeadm InitConfiguration object to a kubelet-config ConfigMap in the cluster
-->
将从 kubeadm InitConfiguration 对象提取的 kubelet 配置上传到集群中的
`kubelet-config` ConfigMap。

```
kubeadm init phase upload-config kubelet [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
  # Upload the kubelet configuration from the kubeadm Config file to a ConfigMap in the cluster.
  kubeadm init phase upload-config kubelet --config kubeadm.yaml
```
-->
```
# 将 kubelet 配置从 kubeadm 配置文件上传到集群中的 ConfigMap。
kubeadm init phase upload-config kubelet --config kubeadm.yaml
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
Path to a kubeadm configuration file.
-->
<p>
到 kubeadm 配置文件的路径。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if you have more than one CRI installed or if you have non-standard CRI socket.
-->
要连接的 CRI 套接字的路径。如果该值为空，kubeadm 将尝试自动检测；
仅当你安装了多个 CRI 或使用非标准的 CRI 套接字时才应使用此选项。
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for kubelet
-->
<p>
kubelet 操作的帮助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">-- kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:-->默认值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
<p>
与集群通信时使用的 kubeconfig 文件。如果未设置该标签，
则可以通过一组标准路径来寻找已有的 kubeconfig 文件。
</p>
</td>
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
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
