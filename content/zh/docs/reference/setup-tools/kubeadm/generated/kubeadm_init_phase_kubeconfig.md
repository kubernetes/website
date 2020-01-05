
<!-- 
### Synopsis
-->
### 概要


<!-- 
This command is not meant to be run on its own. See list of available subcommands. 
-->
此命令并非设计用来单独运行。请阅读可用子命令列表。

```
kubeadm init phase kubeconfig [flags]
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
      help for kubeconfig
      -->
       kubeconfig 操作的帮助命令
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
查看其他

<!-- 
* [kubeadm init phase](kubeadm_init_phase.md)	 - Use this command to invoke single phase of the init workflow
* [kubeadm init phase kubeconfig admin](kubeadm_init_phase_kubeconfig_admin.md)	 - Generate a kubeconfig file for the admin to use and for kubeadm itself
* [kubeadm init phase kubeconfig all](kubeadm_init_phase_kubeconfig_all.md)	 - Generate all kubeconfig files
* [kubeadm init phase kubeconfig controller-manager](kubeadm_init_phase_kubeconfig_controller-manager.md)	 - Generate a kubeconfig file for the controller manager to use
* [kubeadm init phase kubeconfig kubelet](kubeadm_init_phase_kubeconfig_kubelet.md)	 - Generate a kubeconfig file for the kubelet to use *only* for cluster bootstrapping purposes
* [kubeadm init phase kubeconfig scheduler](kubeadm_init_phase_kubeconfig_scheduler.md)	 - Generate a kubeconfig file for the scheduler to use 
-->
* [kubeadm init phase](kubeadm_init_phase.md)	 - 使用此命令可以调用 `init` 工作流程的单个阶段
* [kubeadm init phase kubeconfig admin](kubeadm_init_phase_kubeconfig_admin.md)	 - 为管理员和 kubeadm 本身生成一个 kubeconfig 文件
* [kubeadm init phase kubeconfig all](kubeadm_init_phase_kubeconfig_all.md)	 - 生成所有 kubeconfig 文件
* [kubeadm init phase kubeconfig controller-manager](kubeadm_init_phase_kubeconfig_controller-manager.md)	 - 生成 kubeconfig 文件给控制器管理器使用
* [kubeadm init phase kubeconfig kubelet](kubeadm_init_phase_kubeconfig_kubelet.md)	 - 为 kubelet 生成 kubeconfig 文件，*仅*用于集群引导
* [kubeadm init phase kubeconfig scheduler](kubeadm_init_phase_kubeconfig_scheduler.md)	 - 生成 kubeconfig 文件给调度程序使用

