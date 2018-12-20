
<!--
Mark a node as master
-->
将节点标记为主节点

<!--
### Synopsis
-->

### 概要

<!--
Applies a label that specifies that a node is a master and a taint that forces workloads to be deployed accordingly. 
-->
为某节点添加标签表明该节点是主节点，并为之添加污点以迫使工作负载在部署时考虑该污点的存在。

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha。

```
kubeadm alpha phase mark-master [flags]
```

<!--
### Examples
-->

### 例子

<!--
# Applies master label and taint to the current node, functionally equivalent to what executed by kubeadm init.

# Applies master label and taint to a specific node
-->

```
  # 将主节点标签和污点应用到当前节点上，在功能上等同于 kubeadm init 执行的操作。
  kubeadm alpha phase mark-master
  
  # 将主节点标签和污点应用到当前节点上
  kubeadm alpha phase mark-master --node-name myNode
```

<!--
### Options
-->

### 选项

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to kubeadm config file. WARNING: Usage of a configuration file is experimental</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">help for mark-master</td>

<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">The node name to which label and taints should apply</td>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指向 kubeadm 配置文件的路径。警告：配置文件的使用是实验性的。</td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">mark-master 操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>

    <tr>
      <td colspan="2">--node-name string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">应该使用标签和污点的节点名</td>
    </tr>

  </tbody>
</table>


<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

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

  </tbody>
</table>




