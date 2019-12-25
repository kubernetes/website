
<!-- 
### Synopsis
-->
### 概要

<!--
This command is not meant to be run on its own. See list of available subcommands.
-->
此命令并非设计用来单独运行。请参阅可用子命令列表。

```
kubeadm init phase etcd [flags]
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
      help for etcd
      -->
       etcd 操作的帮助命令
      </td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 继承于父命令的选项

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
      [实验] 到 '真实' 主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>



<!-- 
SEE ALSO 
-->
查看其它

<!--
* [kubeadm init phase](kubeadm_init_phase.md)	 - Use this command to invoke single phase of the init workflow
* [kubeadm init phase etcd local](kubeadm_init_phase_etcd_local.md)	 - Generate the static Pod manifest file for a local, single-node local etcd instance
-->
* [kubeadm init phase](kubeadm_init_phase.md)	 - 使用此命令可以调用 `init` 工作流程的单个阶段
* [kubeadm init phase etcd local](kubeadm_init_phase_etcd_local.md)	 - 为本地单节点 etcd 实例生成静态 Pod 清单文件

