<!-- 
Read an older version of the kubeadm configuration API types from a file, and output the similar config object for the newer version 
-->
从文件中读取旧版本的 kubeadm 配置的 API 类型，并为新版本输出类似的配置对象

<!--
### Synopsis
-->
### 概要

<!--
This command lets you convert configuration objects of older versions to the latest supported version,
locally in the CLI tool without ever touching anything in the cluster.
In this version of kubeadm, the following API versions are supported:
- kubeadm.k8s.io/v1beta3
-->
此命令允许你在 CLI 工具中将本地旧版本的配置对象转换为最新支持的版本，而无需变更集群中的任何内容。
在此版本的 kubeadm 中，支持以下 API 版本：

- kubeadm.k8s.io/v1beta3

<!--
Further, kubeadm can only write out config of version "kubeadm.k8s.io/v1beta2", but read both types.
So regardless of what version you pass to the --old-config parameter here, the API object will be
read, deserialized, defaulted, converted, validated, and re-serialized when written to stdout or
--new-config if specified.
-->

因此，无论你在此处传递 --old-config 参数的版本是什么，当写入到 stdout 或 --new-config （如果已指定）时，
都会读取、反序列化、默认、转换、验证和重新序列化 API 对象。

<!--
In other words, the output of this command is what kubeadm actually would read internally if you
submitted this file to "kubeadm init"
-->
换句话说，如果你将此文件传递给 "kubeadm init"，则该命令的输出就是 kubeadm 实际上在内部读取的内容。

```
kubeadm config migrate [flags]
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
<p>help for migrate</p> 
-->
<p>migrate 操作的帮助信息。</p>
</td>
</tr>

<tr>
<td colspan="2">--new-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the resulting equivalent kubeadm config file using the new API version. Optional, if not specified output will be sent to STDOUT.</p>
-->
<p>使用新的 API 版本生成的 kubeadm 配置文件的路径。这个路径是可选的。如果没有指定，输出将被写到 stdout。</p>
</td>
</tr>

<tr>
<td colspan="2">--old-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the kubeadm config file that is using an old API version and should be converted. This flag is mandatory.</p>
-->
<p>使用旧 API 版本且应转换的 kubeadm 配置文件的路径。此参数是必需的。</p>
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
<td colspan="2">
<!--
kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>用于和集群通信的 kubeconfig 文件。如果未设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 kubeconfig 文件。</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>  
-->
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
