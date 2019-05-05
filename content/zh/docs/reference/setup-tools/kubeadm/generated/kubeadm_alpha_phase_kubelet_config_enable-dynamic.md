
实验：启用或更新节点的动态 kubelet 配置
<!--
EXPERIMENTAL: Enables or updates dynamic kubelet configuration for a Node
-->

<!--
### Synopsis
-->

### 概要

<!--
Enables or updates dynamic kubelet configuration for a Node, against the kubelet-config-1.X ConfigMap in the cluster, where X is the minor version of the desired kubelet version. 
-->
针对集群中的 kubelet-config-1.X ConfigMap 启用或更新节点的动态 kubelet 配置，其中 X 是 kubelet 的次要版本。

<!--
WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it may have surprising side-effects at this stage. 
-->
警告：此功能仍处于试验阶段，默认情况下禁用。只有当您知道自己在做什么时才启用它，在这个阶段它可能有意想不到的效果。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha 阶段。

```
kubeadm alpha phase kubelet config enable-dynamic [flags]
```

<!--
### Examples
-->

### 例子

<!--
  # Enables dynamic kubelet configuration for a Node.
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version v1.12.0
  
  WARNING: This feature is still experimental, and disabled by default. Enable only if you know what you are doing, as it
  may have surprising side-effects at this stage.
-->

```
  # 为节点启用动态 kubelet 配置。
  kubeadm alpha phase kubelet enable-dynamic-config --node-name node-1 --kubelet-version v1.12.0
  
  警告：此功能仍处于试验阶段，默认情况下禁用。只有当你清楚你在做什么时，才启用它。
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">enable-dynamic 的帮助信息</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for enable-dynamic</td>
-->

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
    </tr>
<!--
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">与集群交互时使用的 KubeConfig 文件。如果未设置，将搜索一组标准路径来查找现有的 KubeConfig 文件。</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">kubelet 的期望版本</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The desired version for the kubelet</td>
-->

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">启用动态 kubelet 配置的节点的名称</td>
    </tr>
<!--
      <td></td><td style="line-height: 130%; word-wrap: break-word;">Name of the node that should enable the dynamic kubelet configuration</td>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>
<!--
     <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

  </tbody>
</table>



