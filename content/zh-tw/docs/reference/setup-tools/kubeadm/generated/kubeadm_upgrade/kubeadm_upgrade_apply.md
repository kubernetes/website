<!--
Upgrade your Kubernetes cluster to the specified version
-->
將 Kubernetes 叢集升級到指定版本。

<!--
### Synopsis
-->
### 概要

<!--
Upgrade your Kubernetes cluster to the specified version
-->
將 Kubernetes 叢集升級到指定版本。

```shell
kubeadm upgrade apply [version]
```

<!--
The "apply [version]" command executes the following phases:
```
preflight        Run preflight checks before upgrade
control-plane    Upgrade the control plane
upload-config    Upload the kubeadm and kubelet configurations to ConfigMaps
  /kubeadm         Upload the kubeadm ClusterConfiguration to a ConfigMap
  /kubelet         Upload the kubelet configuration to a ConfigMap
kubelet-config   Upgrade the kubelet configuration for this node
bootstrap-token  Configures bootstrap token and cluster-info RBAC rules
addon            Upgrade the default kubeadm addons
  /coredns         Upgrade the CoreDNS addon
  /kube-proxy      Upgrade the kube-proxy addon
post-upgrade     Run post upgrade tasks
```
-->
`apply [version]` 命令執行以下階段：

```
preflight        在升級前運行預檢
control-plane    升級控制平面
upload-config    將 kubeadm 和 kubelet 配置上傳到 ConfigMap
  /kubeadm         將 kubeadm ClusterConfiguration 上傳到 ConfigMap
  /kubelet         將 kubelet 配置上傳到 ConfigMap
kubelet-config   升級此節點的 kubelet 配置
bootstrap-token  配置啓動引導令牌和 cluster-info RBAC 規則
addon            升級默認的 kubeadm 插件
  /coredns         升級 CoreDNS 插件
  /kube-proxy      升級 kube-proxy 插件
post-upgrade     運行升級後的任務
```

<!--
### Options
-->
### 選項

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-experimental-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Show unstable versions of Kubernetes as an upgrade alternative and allow upgrading to an alpha/beta/release candidate versions of Kubernetes.
-->
顯示 Kubernetes 的不穩定版本作爲升級替代方案，並允許升級到 Kubernetes 的 Alpha、Beta 或 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--allow-release-candidate-upgrades</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Show release candidate versions of Kubernetes as an upgrade alternative and allow upgrading to a release candidate versions of Kubernetes.
-->
顯示 Kubernetes 的候選版本作爲升級替代方案，並允許升級到 Kubernetes 的 RC 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the renewal of certificates used by component changed during upgrades.
-->
執行升級期間更改的組件所使用的證書的更新。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 設定檔案的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Do not change any state, just output what actions would be performed.
-->
不要更改任何狀態，只輸出要執行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: true
-->
--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值: true
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the upgrade of etcd.
-->
執行 etcd 的升級。
</p>
</td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of key=value pairs that describe feature gates for various features. Options are:<br/>
EtcdLearnerMode=true|false (BETA - default=true)<br/>
PublicKeysECDSA=true|false (DEPRECATED - default=false)<br/>
RootlessControlPlane=true|false (ALPHA - default=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - default=false)<br/>
WaitForAllControlPlaneComponents=true|false (ALPHA - default=false)
-->
一組鍵值對，用於描述各種功能。選項包括：<br/>
EtcdLearnerMode=true|false (ALPHA - 預設值=false)<br/>
PublicKeysECDSA=true|false (BETA - 預設值=true)<br/>
RootlessControlPlane=true|false (DEPRECATED - 預設值=false)<br/>
UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - 預設值=false)
WaitForAllControlPlaneComponents=true|false (ALPHA - 預設值=false)
</p>
</td>
</tr>

<tr>
<td colspan="2">-f, --force</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Force upgrading although some requirements might not be met. This also implies non-interactive mode.
-->
強制升級，但可能無法滿足某些要求。這也意味着非交互模式。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for apply
-->
apply 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">-ignore-preflight-errors strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A list of checks whose errors will be shown as warnings. Example: 'IsPrivilegedUser,Swap'. Value 'all' ignores errors from all checks.
-->
錯誤將顯示爲警告的檢查列表；例如：'IsPrivilegedUser,Swap'。取值爲 'all' 時將忽略檢查中的所有錯誤。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;預設值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
與叢集通信時使用的 kubeconfig 檔案。如果未設置標誌，則在相關目錄下搜索以查找現有 kubeconfig 檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a directory that contains files named &quot;target[suffix][+patchtype].extension&quot;. For example, &quot;kube-apiserver0+merge.yaml&quot; or just &quot;etcd.json&quot;. &quot;target&quot; can be one of &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;. &quot;patchtype&quot; can be one of &quot;strategic&quot;, &quot;merge&quot; or &quot;json&quot; and they match the patch formats supported by kubectl. The default &quot;patchtype&quot; is &quot;strategic&quot;. &quot;extension&quot; must be either &quot;json&quot; or &quot;yaml&quot;. &quot;suffix&quot; is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名爲 &quot;target[suffix][+patchtype].extension&quot; 的檔案的目錄的路徑。
例如，&quot;kube-apiserver0+merge.yaml&quot;或是簡單的 &quot;etcd.json&quot;。
&quot;target&quot; 可以是 &quot;kube-apiserver&quot;、&quot;kube-controller-manager&quot;、&quot;kube-scheduler&quot;、&quot;etcd&quot;、&quot;kubeletconfiguration&quot; 之一。
&quot;patchtype&quot; 可以是 &quot;strategic&quot;、&quot;merge&quot; 或者 &quot;json&quot; 之一，
並且它們與 kubectl 支持的補丁格式相同。
預設的 &quot;patchtype&quot; 是 &quot;strategic&quot;。
&quot;extension&quot; 必須是 &quot;json&quot; 或 &quot;yaml&quot;。
&quot;suffix&quot; 是一個可選字符串，可用於確定首先按字母順序應用哪些補丁。
</p>
</td>
</tr>

<tr>
<td colspan="2">--print-config</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specifies whether the configuration file that will be used in the upgrade should be printed or not.
-->
指定是否應打印將在升級中使用的設定檔案。
</p>
</td>
</tr>

<tr>
<td colspan="2">-y, --yes</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Perform the upgrade and do not prompt for confirmation (non-interactive mode).
-->
執行升級，不提示確認（非交互模式）。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承的選項

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
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 指向 '真實' 宿主機根檔案系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
