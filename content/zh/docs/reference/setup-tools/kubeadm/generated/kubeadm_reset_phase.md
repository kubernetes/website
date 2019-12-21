
<!--
### Synopsis
-->
### 概要


<!--
Use this command to invoke single phase of the reset workflow
-->
使用此命令来调用 `reset` 工作流程的某个阶段

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
* [kubeadm reset](kubeadm_reset.md)	 - Performs a best effort revert of changes made to this host by 'kubeadm init' or 'kubeadm join'
-->
* [kubeadm reset](kubeadm_reset.md)	 - 尽最大努力还原通过 “kubeadm init” 或 “kubeadm join” 操作对主机所做的更改
<!--
* [kubeadm reset phase cleanup-node](kubeadm_reset_phase_cleanup-node.md)	 - Run cleanup node.
-->
* [kubeadm reset phase cleanup-node](kubeadm_reset_phase_cleanup-node.md)	 - 执行 cleanup node（清理节点）操作。
<!--
* [kubeadm reset phase preflight](kubeadm_reset_phase_preflight.md)	 - Run reset pre-flight checks
-->
* [kubeadm reset phase preflight](kubeadm_reset_phase_preflight.md)	 - 运行 reset 命令启动前检查
<!--
* [kubeadm reset phase remove-etcd-member](kubeadm_reset_phase_remove-etcd-member.md)	 - Remove a local etcd member.
-->
* [kubeadm reset phase remove-etcd-member](kubeadm_reset_phase_remove-etcd-member.md)	 - 删除某个本地 etcd 成员。
<!--
* [kubeadm reset phase update-cluster-status](kubeadm_reset_phase_update-cluster-status.md)	 - Remove this node from the ClusterStatus object.
-->
* [kubeadm reset phase update-cluster-status](kubeadm_reset_phase_update-cluster-status.md)	 - 从 ClusterStatus 对象中删除该节点。

