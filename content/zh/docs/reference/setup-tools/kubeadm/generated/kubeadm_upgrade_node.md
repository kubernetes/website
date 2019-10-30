
<!--
### Synopsis
-->

### 概要

<!--
Upgrade commands for a node in the cluster
-->
升级集群中某个节点的命令

<!--
The "node" command executes the following phases:
-->
"node"命令执行以下阶段：

<!--
```
control-plane   Upgrade the control plane instance deployed on this node, if any
kubelet-config  Upgrade the kubelet configuration for this node
```
-->
```
control-plane   如果存在的话，升级部署在该节点上的管理面实例
kubelet-config  更新该节点上的kubelet配置
```

```
kubeadm upgrade node [flags]
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
      <td colspan="2">--certificate-renewal</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Perform the renewal of certificates used by component changed during upgrades.
      -->
      对升级期间变化的组件所使用的证书执行更新。
      </td>
    </tr>

    <tr>
      <td colspan="2">--dry-run</td>
    </tr>

    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Do not change any state, just output the actions that would be performed.
       -->
      不更改任何状态，只输出将要执行的操作。
      </td>
    </tr>

    <tr>
      <td colspan="2">--etcd-upgrade</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      Perform the upgrade of etcd.
      -->
      执行etcd的升级。
      </td>
    </tr>

    <tr>
      <td colspan="2">-k, --experimental-kustomize string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The path where kustomize patches for static pod manifests are stored.
      -->
      静态 pod 的 kustomize 补丁的存储路径。
      </td>
    </tr>

    <tr>
      <td colspan="2">-h, --help</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      help for node
      -->
      节点的帮助
      </td>
    </tr>

    <tr>
      <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
      -->
      用于与集群交互的 kubeconfig 文件。如果参数未指定， 将从一系列标准位置检索存在的 kubeconfig 文件。
      </td>
    </tr>

    <tr>
      <td colspan="2">--kubelet-version string</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      The *desired* version for the kubelet config after the upgrade. If not specified, the KubernetesVersion from the kubeadm-config ConfigMap will be used
      -->
      升级后 *期望的* kubelet 配置版本。如未指定，将使用 kubeadm-config ConfigMap 中的 KubernetesVersion
      </td>
    </tr>

    <tr>
      <td colspan="2">--skip-phases stringSlice</td>
    </tr>
    <tr>
      <td></td><td style="line-height: 130%; word-wrap: break-word;">
      <!--
      List of phases to be skipped
      -->
      要跳过的阶段的列表
      </td>
    </tr>

  </tbody>
</table>

<!--
### Options inherited from parent commands
-->

### 从父命令继承的选项

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

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
      <td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
    </tr>

  </tbody>
</table>

<!--
SEE ALSO

* [kubeadm upgrade](kubeadm_upgrade.md)	 - Upgrade your cluster smoothly to a newer version with this command
* [kubeadm upgrade node phase](kubeadm_upgrade_node_phase.md)	 - Use this command to invoke single phase of the node workflow
-->

参见

* [kubeadm upgrade](kubeadm_upgrade.md)	 - 使用此命令将集群平滑升级到新版本
* [kubeadm upgrade node phase](kubeadm_upgrade_node_phase.md)	 - 使用此命令来调用节点升级流程的某个阶段

