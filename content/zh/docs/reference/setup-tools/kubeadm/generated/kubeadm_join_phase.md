
<!--
### Synopsis
-->
### 概要


<!--
Use this command to invoke single phase of the join workflow
-->
使用此命令来调用 `join` 工作流程的某个阶段

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
      help for phase
      -->
       phase 操作的帮助命令
      </td>
    </tr>

  </tbody>
</table>



<!--
### Options inherited from parent commands
-->
### 从父命令中继承的选项

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
      [实验] 指向 '真实' 宿主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>



<!--
SEE ALSO
-->
查看其他

<!--
* [kubeadm join](kubeadm_join.md)	 - Run this on any machine you wish to join an existing cluster
-->
* [kubeadm join](kubeadm_join.md)	 - 在要加入现有集群的任何计算机上运行此命令
<!--
* [kubeadm join phase control-plane-join](kubeadm_join_phase_control-plane-join.md)	 - Join a machine as a control plane instance
-->
* [kubeadm join phase control-plane-join](kubeadm_join_phase_control-plane-join.md)	 - 加入机器作为控制平面实例
<!--
* [kubeadm join phase control-plane-prepare](kubeadm_join_phase_control-plane-prepare.md)	 - Prepare the machine for serving a control plane
-->
* [kubeadm join phase control-plane-prepare](kubeadm_join_phase_control-plane-prepare.md)	 - 准备机器用于控制平面服务
<!--
* [kubeadm join phase kubelet-start](kubeadm_join_phase_kubelet-start.md)	 - Write kubelet settings, certificates and (re)start the kubelet
-->
* [kubeadm join phase kubelet-start](kubeadm_join_phase_kubelet-start.md)	 - 生成 kubelet 配置和证书并（重新）启动 kubelet
<!--
* [kubeadm join phase preflight](kubeadm_join_phase_preflight.md)	 - Run join pre-flight checks
-->
* [kubeadm join phase preflight](kubeadm_join_phase_preflight.md)	 - 运行加入节点操作前的预备检查

