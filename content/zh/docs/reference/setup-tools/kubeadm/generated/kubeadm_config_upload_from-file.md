
将配置文件上传到集群内的 ConfigMap 以进行 kubeadm 配置。

<!--
Upload a configuration file to the in-cluster ConfigMap for kubeadm configuration.
-->

### 概要

<!--
### Synopsis
-->



使用此命令，您可以使用与 ‘kubeadm init’ 相同的配置文件将配置上传到集群中的 ConfigMap。
如果您使用的是 v1.7.x 或更低版本的 kubeadm 客户端初始化集群并且使用了 --config 选项，那么在使用 'kubeadm upgrade' 升级到 v1.8 之前，您需要使用相同的配置文件运行此命令。
<!--
Using this command, you can upload configuration to the ConfigMap in the cluster using the same config file you gave to 'kubeadm init'.
If you initialized your cluster using a v1.7.x or lower kubeadm client and used the --config option, you need to run this command with the
same config file before upgrading to v1.8 using 'kubeadm upgrade'.
-->

该配置位于 "kube-system" 名称空间中的名为 "kubeadm-config" 的 ConfigMap 中。
<!--
The configuration is located in the "kube-system" namespace in the "kubeadm-config" ConfigMap.
-->


```
kubeadm config upload from-file [flags]
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
      <td colspan="2">--config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">指向 kubeadm 配置文件的路径。警告：配置文件的使用是实验性的。</td>

    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">帮助文件</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm config file. WARNING: Usage of a configuration file is experimental.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for from-file</td>
-->

### 继承于父命令的选项 

<!--
### Options inherited from parent commands
-->
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
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




