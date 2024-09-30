<!-- 
Generates the kube-scheduler static Pod manifest
-->
生成 kube-scheduler 静态 Pod 清单。

<!-- 
### Synopsis
-->
### 概要

<!--
Generates the kube-scheduler static Pod manifest
-->
生成 kube-scheduler 静态 Pod 清单。

```
kubeadm init phase control-plane scheduler [flags]
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
<td colspan="2">
<!--
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/pki"
-->
--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："/etc/kubernetes/pki"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The path where to save and store the certificates.</p>
-->
<p>存储证书的路径。</p>
</td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to a kubeadm configuration file.</p>
-->
<p>kubeadm 配置文件的路径。</p>
</td>
</tr>

<tr>
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Don't apply any changes; just output what would be done.</p>
-->
<p>不做任何更改；只输出将要执行的操作。</p>
</td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>help for scheduler</p>
-->
<p>scheduler 操作的帮助命令。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "registry.k8s.io"
-->
--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值:"registry.k8s.io"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Choose a container registry to pull control plane images from</p>
-->
<p>选择要从中拉取控制平面镜像的容器仓库。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stable-1"
-->
--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默认值："stable-1"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Choose a specific Kubernetes version for the control plane.</p>
-->
<p>为控制平面选择特定的 Kubernetes 版本。</p>
</td>
</tr>

<tr>
<td colspan="2">--patches string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--Path to a directory that contains files named "target[suffix][+patchtype].extension". For example, "kube-apiserver0+merge.yaml" or just "etcd.json". "target" can be one of "kube-apiserver", "kube-controller-manager", "kube-scheduler", "etcd", "kubeletconfiguration". "patchtype" can be one of "strategic", "merge" or "json" and they match the patch formats supported by kubectl. The default "patchtype" is "strategic". "extension" must be either "json" or "yaml". "suffix" is an optional string that can be used to determine which patches are applied first alpha-numerically.-->
包含名为 "target[suffix][+patchtype].extension" 的文件的目录。
例如，"kube-apiserver0+merge.yaml" 或者 "etcd.json"。
"target" 可以是 "kube-apiserver"、"kube-controller-manager"、"kube-scheduler"、"etcd"、"kubeletconfiguration" 之一。
"patchtype" 可以是 "strategic"、"merge"、"json" 之一，分别与 kubectl
所支持的 patch 格式相匹配。默认的 "patchtype" 是 "strategic"。
"extension" 必须是 "json" 或 "yaml"。
"suffix" 是一个可选的字符串，用来确定按字母顺序排序时首先应用哪些 patch。
</td>
</tr>

<tr>
<td colspan="2">
<!-- 
--scheduler-extra-args &lt;comma-separated 'key=value' pairs&gt; 
-->
--scheduler-extra-args &lt;逗号分隔的 'key=value' 键值对&gt;
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>A set of extra flags to pass to the Scheduler or override default ones in form of &lt;flagname&gt;=&lt;value&gt;</p>
-->
<p>一组 &lt;flagname&gt;=&lt;value&gt; 形式的额外参数，用来传递给调度器或者覆盖其默认参数配置。</p>
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
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>
-->
<p>[实验] 到 '真实' 主机根文件系统的路径。</p>
</td>
</tr>

</tbody>
</table>
