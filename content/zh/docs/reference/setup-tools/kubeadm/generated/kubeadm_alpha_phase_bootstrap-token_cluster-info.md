<!--
Uploads the cluster-info ConfigMap from the given kubeconfig file

### Synopsis


Uploads the "cluster-info" ConfigMap in the "kube-public" namespace, populating it with cluster information extracted from the given kubeconfig file. The ConfigMap is used for the node bootstrap process in its initial phases, before the client trusts the API server. 
-->

根据给定的 kubeconfig 文件中的内容，上传 "cluster-info" ConfigMap。

### 摘要


在 "kube-public" 命名空间中上传 "cluster-info" ConfigMap，从给定的 kubeconfig 文件中提取集群信息然后填充到该 ConfigMap 中。在客户端信任 API 服务器之前，ConfigMap 在节点的初始阶段用于节点引导过程。

<!--
See online documentation about Authenticating with Bootstrap Tokens for more details. 

Alpha Disclaimer: this command is currently alpha.
-->

更多详细信息，请参阅使用引导令牌进行身份验证的相关联机文档。

Alpha 免责声明：该命令当前为 alpha 阶段。

```
kubeadm alpha phase bootstrap-token cluster-info [flags]
```

<!--
### Options

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">help for cluster-info</td>
    </tr>

  </tbody>
</table>
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

  </tbody>
</table>



<!--
### Options inherited from parent commands

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
    </tr>

  </tbody>
</table>
-->

### 从父命令继承的选项

<table style="width: 100%; table-layout: fixed;">
  <colgroup>
    <col span="1" style="width: 10px;" />
    <col span="1" />
  </colgroup>
  <tbody>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">与集群交互时使用的 KubeConfig 文件。如果没有设置该参数，将会搜索一组标准位置来查找现有的 KubeConfig 文件.</td>
    </tr>

    <tr>
      <td colspan="2">--rootfs string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验]通往'真正的'主机 root 文件系统的路径。</td>
    </tr>

  </tbody>
</table>
