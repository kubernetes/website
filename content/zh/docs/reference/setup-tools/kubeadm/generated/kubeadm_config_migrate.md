
从旧版本的文件中读取 kubeadm 配置 API的类型，并为新版本输出类似的配置对象。
<!--
Read an older version of the kubeadm configuration API types from a file, and output the similar config object for the newer version.
-->


### 概要

<!--
### Synopsis
-->


此命令允许您在 CLI 工具中将本地旧版本的配置对象转换为最新支持的版本，而无需触及群集中的任何内容。在此版本的 kubeadm 中，支持以下 API 版本：
<!--
This command lets you convert configuration objects of older versions to the latest supported version,
locally in the CLI tool without ever touching anything in the cluster.
In this version of kubeadm, the following API versions are supported:
-->

- kubeadm.k8s.io/v1alpha2
- kubeadm.k8s.io/v1alpha3

此外，kubeadm 只能写出版本"kubeadm.k8s.io/v1alpha3"的配置，但能够读取这两种类型，不管你传递给
--old-config 的参数是什么版本，在写入 stdout 或 --new-config(如果指定时)，API 对象都是
读取、反序列化、应用默认设置、执行版本转换与合法性验证，并在输出时重新序列化。

<!--
Further, kubeadm can only write out config of version "kubeadm.k8s.io/v1alpha3", but read both types.
So regardless of what version you pass to the --old-config parameter here, the API object will be
read, deserialized, defaulted, converted, validated, and re-serialized when written to stdout or
--new-config if specified.
-->

换句话说这个命令的输出就是 kubeadm 在内部读取的内容
提交这个文件到 "kubeadm init"
<!--
In other words, the output of this command is what kubeadm actually would read internally if you
submitted this file to "kubeadm init"
-->

```
kubeadm config migrate [flags]
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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">migrate 操作的帮助信息</td>
    </tr>

    <tr>
      <td colspan="2">--new-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用新的 API 版本生成的 kubeadm 配置文件的路径。这个路径是可选的。如果没有指定，输出将被写到 stdout。</td>
    </tr>

    <tr>
      <td colspan="2">--old-config string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">使用旧 API 版本的、需要进行转换的 kubeadm 配置文件路径。此参数是必需的。</td>
    </tr>

  </tbody>
</table>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for migrate</td>

 <td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the resulting equivalent kubeadm config file using the new API version. Optional, if not specified output will be sent to STDOUT.</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to the kubeadm config file that is using an old API version and should be converted. This flag is mandatory.</td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>

<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>

-->


