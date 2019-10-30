
<!-- 
### Synopsis
-->
### 概要


<!--
This command is not meant to be run on its own. See list of available subcommands.
-->
此命令并非设计用来单独运行。请参阅可用子命令列表。

```
kubeadm init phase control-plane [flags]
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
      help for control-plane
      -->
       control-plane 操作的帮助命令
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
* [kubeadm init phase control-plane all](kubeadm_init_phase_control-plane_all.md)	 - Generate all static Pod manifest files
* [kubeadm init phase control-plane apiserver](kubeadm_init_phase_control-plane_apiserver.md)	 - Generates the kube-apiserver static Pod manifest
* [kubeadm init phase control-plane controller-manager](kubeadm_init_phase_control-plane_controller-manager.md)	 - Generates the kube-controller-manager static Pod manifest
* [kubeadm init phase control-plane scheduler](kubeadm_init_phase_control-plane_scheduler.md)	 - Generates the kube-scheduler static Pod manifest
-->
* [kubeadm init phase](kubeadm_init_phase.md)	 - 使用此命令可以调用 `init` 工作流程的单个阶段
* [kubeadm init phase control-plane all](kubeadm_init_phase_control-plane_all.md)	 - 生成所有静态 Pod 清单文件
* [kubeadm init phase control-plane apiserver](kubeadm_init_phase_control-plane_apiserver.md)	 - 生成 kube-apiserver 静态 Pod 清单
* [kubeadm init phase control-plane controller-manager](kubeadm_init_phase_control-plane_controller-manager.md)	 - 生成 kube-controller-manager 静态 Pod 清单
* [kubeadm init phase control-plane scheduler](kubeadm_init_phase_control-plane_scheduler.md)	 - 生成 kube-scheduler 静态 Pod 清单

