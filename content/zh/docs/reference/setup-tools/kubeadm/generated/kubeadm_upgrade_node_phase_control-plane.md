<!--
### Synopsis
-->

### 概要

<!--
Upgrade the control plane instance deployed on this node, if any
-->

升级部署在此节点上的控制平面实例，如果有的话

```
kubeadm upgrade node phase control-plane [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">更新在升级期间变更的组件使用的证书。</td>
</tr>
<!-- 
<td></td><td style="line-height: 130%; word-wrap: break-word;">Perform the renewal of certificates used by component changed during upgrades.</td>
-->

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">不改变任何状态，只输出将要执行的动作。</td>
</tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Do not change any state, just output the actions that would be performed.</td>
-->

<tr>
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">执行 etcd 的升级。</td>
</tr>
<!--
<td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td> 
-->

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">Perform the upgrade of etcd.</td>
-->

<tr>
<td colspan="2">-k, --experimental-kustomize string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">用于存储 kustomize 为静态 pod 清单所提供的补丁的路径。</td>
</tr>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The path where kustomize patches for static pod manifests are stored.</td>
-->

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">control-plane 的帮助信息</td>
</tr>

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for control-plane</td>
-->

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">用于和集群通信的 KubeConfig 文件。如果它没有被设置，那么 kubeadm 将会搜索一个已经存在于标准路径的 KubeConfig 文件。</td>
</tr>

<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->

<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</td>
-->

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">[实验] 到'真实'主机根文件系统的路径。</td>
</tr>
<!--
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
-->

</tbody>
</table>



