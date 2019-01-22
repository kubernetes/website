
查看存储在集群中的 kubeadm 配置
<!--
View the kubeadm configuration stored inside the cluster.
-->

### 概要

<!--
### Synopsis
-->

使用此命令，可以查看 kubeadm 配置的集群中的 ConfigMap。

该配置位于 "kube-system" 名称空间中的名为 "kubeadm-config" 的 ConfigMap 中。

<!--
Using this command, you can view the ConfigMap in the cluster where the configuration for kubeadm is located.

The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->


```
kubeadm config view [flags]
```

### 选项

<!--
### Options
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">view 操作的帮助信息</td>
    </tr>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for view</td>
-->

  </tbody>
</table>

### 继承于父命令的选项

<!--
### Options inherited from parent commands
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->
