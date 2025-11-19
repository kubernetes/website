<!--
### Synopsis

Show what differences would be applied to existing static pod manifests. See also: kubeadm upgrade apply --dry-run
-->
### 概要

顯示哪些差異將被應用於現有的靜態 Pod 資源清單。另請參考：kubeadm upgrade apply --dry-run

```shell
kubeadm upgrade diff [version] [flags]
```

<!--
### Options

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">path to API server manifest</td>
</tr>
-->
### 選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--api-server-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/manifests/kube-apiserver.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>API 伺服器清單的路徑。</p></td>
</tr>

<!--
<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">Path to a kubeadm configuration file.</td>
</tr>
-->
<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadm 設定文件的路徑。</p></td>
</tr>

<!--
<tr>
<td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>How many lines of context in the diff</p></td>
</tr>
-->
<tr>
<td colspan="2">-c, --context-lines int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值：3</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">diff 涉及了多少行上下文。</td>
</tr>

<!--
<tr>
<td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">path to controller manifest</td>
</tr>
-->
<tr>
<td colspan="2">--controller-manager-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/manifests/kube-controller-manager.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>控制器清單的路徑。</p></td>
</tr>

<!--
<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">help for diff</td>
</tr>
-->
<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>diff 操作的幫助命令</p></td>
</tr>

<!--
<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p></td>
</tr>
-->
<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>與叢集通信時使用的 kubeconfig 文件，如果標誌是未設置，則可以在一組標準位置中搜索現有的 kubeconfig 文件。</p></td>
</tr>

<!--
<tr>
<td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>path to scheduler manifest</p></td>
</tr>
-->
<tr>
<td colspan="2">--scheduler-manifest string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/manifests/kube-scheduler.yaml"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>調度程序清單的路徑。</p></td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands

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
<td></td><td style="line-height: 130%; word-wrap: break-word;">[EXPERIMENTAL] The path to the 'real' host root filesystem.</td>
</tr>

</tbody>
</table>
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[實驗] 指向“真實”主機根文件系統的路徑。</p></td>
</tr>

</tbody>
</table>
