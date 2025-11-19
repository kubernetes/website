<!-- 
### Synopsis
-->

### 概要

<!--
Write a file with KubeletConfiguration and an environment file with node specific kubelet settings, and then (re)start kubelet.
-->

使用 kubelet 配置文件編寫一個文件，並使用特定節點的 kubelet
設置編寫一個環境文件，然後（重新）啓動 kubelet。

```shell
kubeadm init phase kubelet-start [flags]
```

<!--
### Examples
-->
### 示例

<!--
```
# Writes a dynamic environment file with kubelet flags from a InitConfiguration file.
kubeadm init phase kubelet-start --config config.yaml
```
-->
```shell
# 將來自 InitConfiguration 文件中的 kubelet 參數寫入一個動態環境文件。
kubeadm init phase kubelet-start --config config.yaml
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
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to a kubeadm configuration file.
-->
kubeadm 配置文件的路徑。
</p>
</td>
</tr>

<tr>
<td colspan="2">--cri-socket string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Path to the CRI socket to connect. If empty kubeadm will try to auto-detect this value; use this option only if 
you have more than one CRI installed or if you have non-standard CRI socket.
-->
連接到 CRI 套接字的路徑。如果爲空，則 kubeadm 將嘗試自動檢測該值；
僅當安裝了多個 CRI 或具有非標準 CRI 套接字時，才使用此選項。
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
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
help for kubelet-start
-->
kubelet-start 操作的幫助命令。
</p>
</td>
</tr>

<tr>
<td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<!--Default:--> 默認值："registry.k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Choose a container registry to pull control plane images from
-->
選擇一個容器鏡像倉庫來從中拉取控制平面組件的鏡像。
</p>
</td>
</tr>

<tr>
<td colspan="2">--node-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Specify the node name.
-->
指定節點名稱。
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
目錄路徑，指向包含名爲 “target[suffix][+patchtype].extension” 的文件的目錄。
例如，"kube-apiserver0+merge.yaml" 或 "etcd.json" 這種簡單形式。
"target" 可以是 “kube-apiserver”、“kube-controller-manager”、“kube-scheduler”、“etcd”、“kubeletconfiguration” 之一，
"patchtype" 可以是 "strategic"、"merge" 或 "json" 之一，並且它們與 kubectl 支持的補丁格式匹配。
默認的 "patchtype" 爲 "strategic"。 "extension" 必須爲 "json" 或 "yaml"。
"suffix" 是一個可選字符串，可用於確定按字母順序首先應用哪些補丁。
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
[實驗] 到 '真實' 主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
