
<!--
### Synopsis
-->

### 概要

<!--
Download the kubelet configuration from a ConfigMap of the form "kubelet-config-1.X" in the cluster, where X is the minor version of the kubelet. Either kubeadm autodetects the kubelet version by exec-ing "kubelet --version" or respects the --kubelet-version parameter.
-->

从集群中形式为 "kubelet-config-1.X" 的 ConfigMap 中下载 kubelet 配置，其中 X 是 kubelet 的次要版本。
kubeadm 要么通过执行 "kubelet --version" 自动检测 kubelet 版本，要么传递 --kubelet-version 参数。

<!--
Alpha Disclaimer: this command is currently alpha.
-->

Alpha 免责声明：此命令当前为 Alpha 功能。

```
kubeadm alpha kubelet config download [flags]
```

<!--
### Examples
-->

### 示例

<!--
  # Download the kubelet configuration from the ConfigMap in the cluster. Autodetect the kubelet version.
  kubeadm alpha phase kubelet config download

  # Download the kubelet configuration from the ConfigMap in the cluster. Use a specific desired kubelet version.
  kubeadm alpha phase kubelet config download kubelet-version 1.16.0
-->

```
# 从集群中的 ConfigMap 下载 kubelet 配置。自动检测 kubelet 版本。
kubeadm alpha phase kubelet config download

# 从集群中的 ConfigMap 下载 kubelet 配置。使用特定的所需 kubelet 版本。
kubeadm alpha phase kubelet config download --kubelet-version 1.16.0
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
help for download
-->
download 的帮助命令
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
If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。如果未设置该标志，可以在一组标准位置中搜索现有的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- The desired version for the kubelet. Defaults to being autodetected from 'kubelet -version'.  -->
kubelet 所需版本。默认为从 'kubelet --version' 中自动检测到。
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

