<!--
### Synopsis
-->
### 概要

<!--
Generates the kube-controller-manager static Pod manifest
-->
生成 kube-controller-manager 靜態 Pod 清單。

```shell
kubeadm init phase control-plane controller-manager [flags]
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
<td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default: "/etc/kubernetes/pki"-->默認值："/etc/kubernetes/pki"</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path where to save and store the certificates.
-->
存儲證書的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--controller-manager-extra-args &lt;comma-separated 'key=value' pairs&gt;</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
A set of extra flags to pass to the Controller Manager or override default ones in form of &lt;flagname&gt;=&lt;value&gt;
-->
一組 &lt;flagname&gt;=&lt; 形式的額外參數，傳遞給控制器管理器（Controller Manager）
或者覆蓋其默認配置值
</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;"><p>
<!-- 
Don't apply any changes; just output what would be done. 
-->
不做任何更改；只輸出將要執行的操作。
</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for controller-manager</p>
-->
controller-manager 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.ioo"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："registry.k8s.ioo"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
選擇要從中拉取控制平面鏡像的容器倉庫。
</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："stable-1"
</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a specific Kubernetes version for the control plane.
-->
爲控制平面選擇特定的 Kubernetes 版本。
</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "target" can be one of "kube-apiserver", "kube-controller-manager", "kube-scheduler", "etcd", "kubeletconfiguration". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.
-->
包含名爲 "target[suffix][+patchtype].extension" 的文件的目錄。
例如，"kube-apiserver0+merge.yaml" 或者 "etcd.json"。
"target" 可以是 "kube-apiserver"、"kube-controller-manager"、"kube-scheduler"、"etcd"、"kubeletconfiguration" 之一。
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，分別與 kubectl
所支持的 patch 格式相匹配。默認的 "patchtype" 是 "strategic"。
"extension" 必須是 "json" 或 "yaml"。
"suffix" 是一個可選的字符串，用來確定按字母順序排序時首先應用哪些 patch。
</p>
</td>
</tr>

<tr>
<td colspan="2">--pod-network-cidr string</td>
</tr>
<tr>
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify range of IP addresses for the pod network. If set, the control plane will automatically allocate CIDRs for every node.
-->
指定 Pod 網絡的 IP 地址範圍。如果設置，控制平面將自動爲每個節點分配 CIDR。
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
<td></td>
<td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
