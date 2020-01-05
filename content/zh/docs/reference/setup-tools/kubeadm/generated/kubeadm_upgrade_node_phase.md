
<!--
### Synopsis
-->
### 概要

<!--
Use this command to invoke single phase of the node workflow
-->

使用此命令调用 node 工作流的某个阶段

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
* [kubeadm upgrade node](kubeadm_upgrade_node.md)	 - Upgrade commands for a node in the cluster
* [kubeadm upgrade node phase control-plane](kubeadm_upgrade_node_phase_control-plane.md)	 - Upgrade the control plane instance deployed on this node, if any
* [kubeadm upgrade node phase kubelet-config](kubeadm_upgrade_node_phase_kubelet-config.md)	 - Upgrade the kubelet configuration for this node
-->
* [kubeadm upgrade node](kubeadm_upgrade_node.md)	 - 集群中某个节点的升级命令
* [kubeadm upgrade node phase control-plane](kubeadm_upgrade_node_phase_control-plane.md)	 - 升级部署在此节点上的控制平面实例（如果有）
* [kubeadm upgrade node phase kubelet-config](kubeadm_upgrade_node_phase_kubelet-config.md)	 - 升级此节点的 kubelet 配置
