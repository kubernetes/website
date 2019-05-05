
打印 kubeadm 配置对象的默认值。
<!--
Print the default values for a kubeadm configuration object.
-->

### 概要

<!--
### Synopsis
-->


此命令打印用于 'kubeadm init' 和 'kubeadm upgrade' 的默认 InitConfiguration 对象，以及用于 'kubeadm join'  的默认 JoinConfiguration 对象。
<!--
This command prints the default InitConfiguration object that is used for 'kubeadm init' and 'kubeadm upgrade',
and the default JoinConfiguration object that is used for 'kubeadm join'.
-->

注意，如引导令牌字段这类敏感值会被替换为简单的值，如{"abcdef.0123456789abcdef" "" "nil" <nil> [] []}，目的是在通过合法性验证的同时避免执行创建令牌这类真实计算。没有为创建令牌执行真正的计算。
<!--
Note that sensitive values like the Bootstrap Token fields are replaced with silly values like {"abcdef.0123456789abcdef" "" "nil" <nil> [] []} in order to pass validation but
not perform the real computation for creating a token.
-->


```
kubeadm config print-default [flags]
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
      <td colspan="2">--api-objects stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">API 对象打印默认值的逗号分隔列表。可用值：[InitConfiguration ClusterConfiguration JoinConfiguration KubeProxyConfiguration KubeletConfiguration MasterConfiguration]。此参数未设置时表示“打印所有已知对象”</td>
    </tr>
    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">print-default 操作的帮助信息</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">A comma-separated list for API objects to print the default values for. Available values: [InitConfiguration ClusterConfiguration JoinConfiguration KubeProxyConfiguration KubeletConfiguration MasterConfiguration]. This flag unset means 'print all known objects'</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for print-default</td>
-->



### 从父命令继承的选项
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
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The KubeConfig file to use when talking to the cluster. If the flag is not set, a set of standard locations are searched for an existing KubeConfig file.</td>
-->
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->


