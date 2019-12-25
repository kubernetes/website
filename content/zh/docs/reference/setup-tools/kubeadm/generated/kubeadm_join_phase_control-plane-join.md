
<!--
### Synopsis
-->
### 概要


<!--
Join a machine as a control plane instance
-->
添加作为控制平面实例的机器

```
kubeadm join phase control-plane-join [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Joins a machine as a control plane instance
kubeadm join phase control-plane-join all
```
-->
```
# 将机器作为控制平面实例加入
kubeadm join phase control-plane-join all
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
      help for control-plane-join
      -->
       control-plane-join 操作的帮助命令
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
* [kubeadm join phase](kubeadm_join_phase.md)	 - Use this command to invoke single phase of the join workflow
* [kubeadm join phase control-plane-join all](kubeadm_join_phase_control-plane-join_all.md)	 - Join a machine as a control plane instance
* [kubeadm join phase control-plane-join etcd](kubeadm_join_phase_control-plane-join_etcd.md)	 - Add a new local etcd member
* [kubeadm join phase control-plane-join mark-control-plane](kubeadm_join_phase_control-plane-join_mark-control-plane.md)	 - Mark a node as a control-plane
* [kubeadm join phase control-plane-join update-status](kubeadm_join_phase_control-plane-join_update-status.md)	 - Register the new control-plane node into the ClusterStatus maintained in the kubeadm-config ConfigMap
-->
* [kubeadm join phase](kubeadm_join_phase.md)	 - 使用此命令来调用 `join` 工作流程的单阶段
* [kubeadm join phase control-plane-join all](kubeadm_join_phase_control-plane-join_all.md)	 - 添加作为控制平面实例的机器
* [kubeadm join phase control-plane-join etcd](kubeadm_join_phase_control-plane-join_etcd.md)	 - 添加新的本地 etcd 成员
* [kubeadm join phase control-plane-join mark-control-plane](kubeadm_join_phase_control-plane-join_mark-control-plane.md)	 - 将节点标记为控制平面节点
* [kubeadm join phase control-plane-join update-status](kubeadm_join_phase_control-plane-join_update-status.md)	 - 将新的控制平面节点注册到 kubeadm-config ConfigMap 维护的 ClusterStatus 中