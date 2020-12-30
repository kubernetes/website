
<!--
### Synopsis
-->
### 概要

<!--
Generates the kube-controller-manager static Pod manifest
-->
生成 kube-controller-manager 静态 Pod 清单

```
kubeadm init phase control-plane controller-manager [flags]
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
<!-- td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"</td -->
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The path where to save and store the certificates.
-->
存储证书的路径。
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
<td colspan="2">--controller-manager-extra-args mapStringString</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
A set of extra flags to pass to the Controller Manager or override default ones in form of &lt;flagname&gt;=&lt;value&gt;
-->
一组 &lt;flagname&gt;=&lt; 形式的额外参数，传递给控制器管理器（Controller Manager）
或者覆盖其默认配置值
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for controller-manager
-->
controller-manager 操作的帮助命令
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
为控制平面选择特定的 Kubernetes 版本。
</td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
-->
指定 Pod 网络的 IP 地址范围。如果设置，控制平面将自动为每个节点分配 CIDR。
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
[实验] 到 '真实' 主机根文件系统的路径。
</td>
</tr>

</tbody>
</table>

