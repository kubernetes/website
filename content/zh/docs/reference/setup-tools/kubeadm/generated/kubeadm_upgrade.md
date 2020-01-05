
<!--
### Synopsis
-->
### 概要

<!--
Upgrade your cluster smoothly to a newer version with this command
-->
此命令能将集群平滑升级到新版本


```
kubeadm upgrade [flags]
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
      help for upgrade
      -->
       upgrade 操作的帮助命令
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
      [实验] 指向 '真实' 宿主机根文件系统的路径。
      </td>
    </tr>

  </tbody>
</table>

<!--
SEE ALSO

* [kubeadm](kubeadm.md)         - kubeadm: easily bootstrap a secure Kubernetes cluster
* [kubeadm upgrade apply](kubeadm_upgrade_apply.md)     - Upgrade your Kubernetes cluster to the specified version
* [kubeadm upgrade diff](kubeadm_upgrade_diff.md)       - Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
* [kubeadm upgrade node](kubeadm_upgrade_node.md)       - Upgrade commands for a node in the cluster
* [kubeadm upgrade plan](kubeadm_upgrade_plan.md)       - Check which versions are available to upgrade to and validate whether your current cluster is upgradeable. To skip the internet check, pass in the optional [version] parameter
-->

查看其他

* [kubeadm](kubeadm.md)         - kubeadm: 轻松引导一个安全的 Kubernetes 集群
* [kubeadm upgrade apply](kubeadm_upgrade_apply.md)     - 升级你的 Kubernetes 集群到指定的版本
* [kubeadm upgrade diff](kubeadm_upgrade_diff.md)       - 显示现有的静态 pod 清单有什么不同。查看其它: kubeadm upgrade apply --dry-run
* [kubeadm upgrade node](kubeadm_upgrade_node.md)       - 集群中某个节点的升级命令
* [kubeadm upgrade plan](kubeadm_upgrade_plan.md)       - 检查哪些版本可以升级，并验证当前集群是否可以升级。要跳过网络检查，请传入可选的 [version] 参数

