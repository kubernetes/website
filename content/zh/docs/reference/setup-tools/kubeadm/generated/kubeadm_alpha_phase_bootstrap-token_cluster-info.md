
从指定的 kubeconfig 文件上传集群信息 ConfigMap
<!--
Uploads the cluster-info ConfigMap from the given kubeconfig file
-->

<!--
### Synopsis
-->

### 概要

<!--
Uploads the "cluster-info" ConfigMap in the "kube-public" namespace, populating it with cluster information extracted from the given kubeconfig file. The ConfigMap is used for the node bootstrap process in its initial phases, before the client trusts the API server. 
-->
在 "kube-public" 命名空间中上传 "cluster-info" ConfigMap，使用指定的 kubeconfig 文件中提取的集群信息填充它。在客户端信任 API 服务器之前，ConfigMap 用于节点引导过程的初始阶段，即客户端能够信任 API 服务器之前。

<!--
See online documentation about Authenticating with Bootstrap Tokens for more details. 
-->
更多详细信息，请参阅有关使用 Bootstrap 令牌进行身份验证的联机文档

<!--
Alpha Disclaimer: this command is currently alpha.
-->
Alpha 免责声明：此命令目前属于 alpha。

```
kubeadm alpha phase bootstrap-token cluster-info [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">cluster-info 的帮助信息</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for cluster-info</td>
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
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值： "/etc/kubernetes/admin.conf"</td>
    </tr>
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
->

  </tbody>
</table>




