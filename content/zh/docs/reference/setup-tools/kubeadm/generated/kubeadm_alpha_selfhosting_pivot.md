
<!--
### Synopsis
-->

### 概要

<!--
Convert static Pod files for control plane components into self-hosted DaemonSets configured via the Kubernetes API.
-->

将用于控制平面组件的静态 Pod 文件转换为通过 Kubernetes API 配置的自托管 DaemonSet。

<!--
See the documentation for self-hosting limitations.
-->

有关自托管的限制，请参阅相关文档。

<!--
Alpha Disclaimer: this command is currently alpha.
-->

Alpha 免责声明：此命令当前为 alpha 功能。


```
kubeadm alpha selfhosting pivot [flags]
```

<!--
### Examples
-->

### 示例

<!--
# Convert a static Pod-hosted control plane into a self-hosted one.
-->

```
# 将静态 Pod 托管的控制平面转换为自托管的控制平面。

kubeadm alpha phase self-hosting convert-from-staticpods
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
The path where certificates are stored
-->
证书存储的路径
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
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Pivot the cluster without prompting for confirmation
-->
在不提示确认的情况下转换集群
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for pivot
-->
pivot 操作的帮助命令
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
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。如果未设置该参数，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">-s, --store-certs-in-secrets</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Enable storing certs in secrets
-->
启用 secret 存储证书
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
