
<!-- 
### Synopsis 
-->
### 摘要



<!--
    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM                                                  │
    │ Easily bootstrap a secure Kubernetes cluster             │
    │                                                          │
    │ Please give us feedback at:                              │
    │ https://github.com/kubernetes/kubeadm/issues             │
    └──────────────────────────────────────────────────────────┘
-->
    ┌──────────────────────────────────────────────────────────┐
    │ KUBEADM                                                  │
    │ 轻松创建一个安全的 Kubernetes 集群                           │
    │                                                          │
    │ 给我们反馈意见的地址：                                       │
    │ https://github.com/kubernetes/kubeadm/issues             │
    └──────────────────────────────────────────────────────────┘

<!-- 
Example usage: 
-->
用途示例：

<!-- 
    Create a two-machine cluster with one control-plane node
    (which controls the cluster), and one worker node
    (where your workloads, like Pods and Deployments run). 
-->
    创建一个有两台机器的集群，包含一个主节点（用来控制集群），和一个工作节点（运行您的工作负载，像 Pod 和 Deployment）。

<!--
    ┌──────────────────────────────────────────────────────────┐
    │ On the first machine:                                    │
    ├──────────────────────────────────────────────────────────┤
    │ control-plane# kubeadm init                              │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ On the second machine:                                   │
    ├──────────────────────────────────────────────────────────┤
    │ worker# kubeadm join &lt;arguments-returned-from-init&gt;      │
    └──────────────────────────────────────────────────────────┘

    You can then repeat the second step on as many other machines as you like.
-->
    ┌──────────────────────────────────────────────────────────┐
    │ 在第一台机器上：                                            │
    ├──────────────────────────────────────────────────────────┤
    │ control-plane# kubeadm init                              │
    └──────────────────────────────────────────────────────────┘

    ┌──────────────────────────────────────────────────────────┐
    │ 在第二台机器上：                                            │
    ├──────────────────────────────────────────────────────────┤
    │ worker# kubeadm join &lt;arguments-returned-from-init&gt;      │
    └──────────────────────────────────────────────────────────┘

    您可以重复第二步，向集群添加更多机器。

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
      help for kubeadm
      -->
       kubeadm 操作的帮助信息 
      </td>
    </tr>

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
参考其他

<!-- 
* [kubeadm alpha](kubeadm_alpha.md)	 - Kubeadm experimental sub-commands
* [kubeadm completion](kubeadm_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubeadm config](kubeadm_config.md)	 - Manage configuration for a kubeadm cluster persisted in a ConfigMap in the cluster
* [kubeadm init](kubeadm_init.md)	 - Run this command in order to set up the Kubernetes control plane
* [kubeadm join](kubeadm_join.md)	 - Run this on any machine you wish to join an existing cluster
* [kubeadm reset](kubeadm_reset.md)	 - Performs a best effort revert of changes made to this host by 'kubeadm init' or 'kubeadm join'
* [kubeadm token](kubeadm_token.md)	 - Manage bootstrap tokens
* [kubeadm upgrade](kubeadm_upgrade.md)	 - Upgrade your cluster smoothly to a newer version with this command
* [kubeadm version](kubeadm_version.md)	 - Print the version of kubeadm 
-->
* [kubeadm alpha](kubeadm_alpha.md)	 - kubeadm 实验子命令
* [kubeadm completion](kubeadm_completion.md)	 - 对于特定 shell (bash 或者 zsh) 脚本输出 shell completion 代码 
* [kubeadm config](kubeadm_config.md)	 - 管理 kubeadm 集群的配置，该配置保留在集群的 ConfigMap 中
* [kubeadm init](kubeadm_init.md)	 - 运行此命令以设置 Kubernetes 控制平面
* [kubeadm join](kubeadm_join.md)	 - 在要加入现有集群的任何计算机上运行此命令
* [kubeadm reset](kubeadm_reset.md)	 - 尽最大努力还原通过 'kubeadm init' 或者 'kubeadm join' 操作对主机所做的更改
* [kubeadm token](kubeadm_token.md)	 - 管理引导令牌（bootstrap token）
* [kubeadm upgrade](kubeadm_upgrade.md)	 - 使用此命令将集群平稳地升级到新版本
* [kubeadm version](kubeadm_version.md)	 - 打印 kubeadm 的版本

