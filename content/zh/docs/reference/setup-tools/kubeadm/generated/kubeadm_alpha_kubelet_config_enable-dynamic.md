
<!--
### Synopsis
-->
### 概要


<!--
Enable or update dynamic kubelet configuration for a Node, against the kubelet-config-1.X ConfigMap in the cluster, where X is the minor version of the desired kubelet version.
-->
针对集群中的 kubelet-config-1.X ConfigMap 启用或更新节点的动态 kubelet 配置，其中 X 是所需 kubelet 版本的次要版本。

<!--
WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it may have surprising side-effects at this stage.
-->
警告：此功能仍处于试验阶段，默认情况下处于禁用状态。仅当知道自己在做什么时才启用它，因为在此阶段它可能会产生令人惊讶的副作用。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令当前为 Alpha 功能。

```
kubeadm alpha kubelet config enable-dynamic [flags]
```

<!--
### Examples  # Enable dynamic kubelet configuration for a Node.
-->
### 示例

```
  # 为节点启用动态 kubelet 配置。
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version 1.16.0

  WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it
  may have surprising side-effects at this stage.
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
help for enable-dynamic
-->
enable-dynamic 操作的帮助命令
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
与集群通信时使用的 kubeconfig 文件。如果未设置该标志，则可以在一组标准位置中搜索现有的 kubeconfig 文件。
</td>
</tr>

<tr>
<td colspan="2">--kubelet-version string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
The desired version for the kubelet
-->
kubelet 所需版本
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
Name of the node that should enable the dynamic kubelet configuration
-->
应该启用动态 kubelet 配置节点的名称
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
[实验] 指向 '真实' 宿主机的根目录。
</td>
</tr>

</tbody>
</table>
