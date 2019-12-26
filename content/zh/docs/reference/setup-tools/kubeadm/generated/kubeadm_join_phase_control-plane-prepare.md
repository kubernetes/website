
<!--
### Synopsis
-->
### 概要

<!--
Prepare the machine for serving a control plane
-->
准备为控制平面服务的机器

```
kubeadm join phase control-plane-prepare [flags]
```

<!--
### Examples
-->
<!--
# Prepares the machine for serving a control plane
-->
### 示例

```
# 准备为控制平面服务的机器
kubeadm join phase control-plane-prepare all
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
      help for control-plane-prepare
      -->
       control-plane-prepare 操作的帮助命令
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
* [kubeadm join phase](kubeadm_join_phase.md)	 - Use this command to invoke single phase of the join workflow
* [kubeadm join phase control-plane-prepare all](kubeadm_join_phase_control-plane-prepare_all.md)	 - Prepare the machine for serving a control plane
* [kubeadm join phase control-plane-prepare certs](kubeadm_join_phase_control-plane-prepare_certs.md)	 - Generate the certificates for the new control plane components
* [kubeadm join phase control-plane-prepare control-plane](kubeadm_join_phase_control-plane-prepare_control-plane.md)	 - Generate the manifests for the new control plane components
* [kubeadm join phase control-plane-prepare download-certs](kubeadm_join_phase_control-plane-prepare_download-certs.md)	 - [EXPERIMENTAL] Download certificates shared among control-plane nodes from the kubeadm-certs Secret
* [kubeadm join phase control-plane-prepare kubeconfig](kubeadm_join_phase_control-plane-prepare_kubeconfig.md)	 - Generate the kubeconfig for the new control plane components
-->
* [kubeadm join phase](kubeadm_join_phase.md)	 - 使用此命令可以调用 `init` 工作流程的单个阶段
* [kubeadm join phase control-plane-prepare all](kubeadm_join_phase_control-plane-prepare_all.md)	 - 准备为控制平面服务的机器
* [kubeadm join phase control-plane-prepare certs](kubeadm_join_phase_control-plane-prepare_certs.md)	 - 为新的控制平面组件生成证书
* [kubeadm join phase control-plane-prepare control-plane](kubeadm_join_phase_control-plane-prepare_control-plane.md)	 - 为新的控制平面组件生成清单
* [kubeadm join phase control-plane-prepare download-certs](kubeadm_join_phase_control-plane-prepare_download-certs.md)	 - [实验]从 kubeadm-certs Secret 下载控制平面节点之间共享的证书
* [kubeadm join phase control-plane-prepare kubeconfig](kubeadm_join_phase_control-plane-prepare_kubeconfig.md)	 - 为新的控制平面组件生成 kubeconfig

