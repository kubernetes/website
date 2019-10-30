
<!--
### Synopsis
-->
### 概要


<!--
Use this command to invoke single phase of the init workflow
-->
使用此命令可以调用 init 工作流程的单个阶段

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
### 继承于父命令的选择项

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
* [kubeadm init](kubeadm_init.md)	 - Run this command in order to set up the Kubernetes control plane
* [kubeadm init phase addon](kubeadm_init_phase_addon.md)	 - Install required addons for passing Conformance tests
* [kubeadm init phase bootstrap-token](kubeadm_init_phase_bootstrap-token.md)	 - Generates bootstrap tokens used to join a node to a cluster
* [kubeadm init phase certs](kubeadm_init_phase_certs.md)	 - Certificate generation
* [kubeadm init phase control-plane](kubeadm_init_phase_control-plane.md)	 - Generate all static Pod manifest files necessary to establish the control plane
* [kubeadm init phase etcd](kubeadm_init_phase_etcd.md)	 - Generate static Pod manifest file for local etcd
* [kubeadm init phase kubeconfig](kubeadm_init_phase_kubeconfig.md)	 - Generate all kubeconfig files necessary to establish the control plane and the admin kubeconfig file
* [kubeadm init phase kubelet-start](kubeadm_init_phase_kubelet-start.md)	 - Write kubelet settings and (re)start the kubelet
* [kubeadm init phase mark-control-plane](kubeadm_init_phase_mark-control-plane.md)	 - Mark a node as a control-plane
* [kubeadm init phase preflight](kubeadm_init_phase_preflight.md)	 - Run pre-flight checks
* [kubeadm init phase upload-certs](kubeadm_init_phase_upload-certs.md)	 - Upload certificates to kubeadm-certs
* [kubeadm init phase upload-config](kubeadm_init_phase_upload-config.md)	 - Upload the kubeadm and kubelet configuration to a ConfigMap
-->
* [kubeadm init](kubeadm_init.md)	 - 运行此命令以设置 Kubernetes 控制平面
* [kubeadm init phase addon](kubeadm_init_phase_addon.md)	 - 安装通过一致性测试所需的插件
* [kubeadm init phase bootstrap-token](kubeadm_init_phase_bootstrap-token.md)	 - 生成用于将节点加入集群的引导令牌
* [kubeadm init phase certs](kubeadm_init_phase_certs.md)	 - 生成证书
* [kubeadm init phase control-plane](kubeadm_init_phase_control-plane.md)	 - 生成建立控制平面所需的所有静态 Pod 清单文件
* [kubeadm init phase etcd](kubeadm_init_phase_etcd.md)	 - 为本地 etcd 生成静态 Pod 清单文件
* [kubeadm init phase kubeconfig](kubeadm_init_phase_kubeconfig.md)	 - 生成建立控制平面所需的 kubeconfig 文件和管理员用的 kubeconfig 文件
* [kubeadm init phase kubelet-start](kubeadm_init_phase_kubelet-start.md)	 - 编写 kubelet 设置并（重新）启动 kubelet
* [kubeadm init phase mark-control-plane](kubeadm_init_phase_mark-control-plane.md)	 - 将节点标记为控制平面
* [kubeadm init phase preflight](kubeadm_init_phase_preflight.md)	 - 运行 pre-flight（启动） 检查
* [kubeadm init phase upload-certs](kubeadm_init_phase_upload-certs.md)	 - 将证书上传到 kubeadm-certs
* [kubeadm init phase upload-config](kubeadm_init_phase_upload-config.md)	 - 将 kubeadm 和 kubelet 配置上传到 ConfigMap

