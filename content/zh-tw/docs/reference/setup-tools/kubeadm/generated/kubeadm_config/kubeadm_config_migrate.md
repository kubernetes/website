<!-- 
Read an older version of the kubeadm configuration API types from a file, and output the similar config object for the newer version 
-->
從文件中讀取舊版本的 kubeadm 設定的 API 類型，併爲新版本輸出類似的設定對象

<!--
### Synopsis
-->
### 概要

<!--
This command lets you convert configuration objects of older versions to the latest supported version,
locally in the CLI tool without ever touching anything in the cluster.
In this version of kubeadm, the following API versions are supported:
- kubeadm.k8s.io/v1beta3
-->
此命令允許你在 CLI 工具中將本地舊版本的設定對象轉換爲最新支持的版本，而無需變更叢集中的任何內容。
在此版本的 kubeadm 中，支持以下 API 版本：

- kubeadm.k8s.io/v1beta3

<!--
Further, kubeadm can only write out config of version "kubeadm.k8s.io/v1beta2", but read both types.
So regardless of what version you pass to the --old-config parameter here, the API object will be
read, deserialized, defaulted, converted, validated, and re-serialized when written to stdout or
--new-config if specified.
-->

因此，無論你在此處傳遞 --old-config 參數的版本是什麼，當寫入到 stdout 或 --new-config （如果已指定）時，
都會讀取、反序列化、默認、轉換、驗證和重新序列化 API 對象。

<!--
In other words, the output of this command is what kubeadm actually would read internally if you
submitted this file to "kubeadm init"
-->
換句話說，如果你將此文件傳遞給 "kubeadm init"，則該命令的輸出就是 kubeadm 實際上在內部讀取的內容。

```
kubeadm config migrate [flags]
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
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>help for migrate</p> 
-->
<p>migrate 操作的幫助信息。</p>
</td>
</tr>

<tr>
<td colspan="2">--new-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the resulting equivalent kubeadm config file using the new API version. Optional, if not specified output will be sent to STDOUT.</p>
-->
<p>使用新的 API 版本生成的 kubeadm 設定文件的路徑。這個路徑是可選的。如果沒有指定，輸出將被寫到 stdout。</p>
</td>
</tr>

<tr>
<td colspan="2">--old-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>Path to the kubeadm config file that is using an old API version and should be converted. This flag is mandatory.</p>
-->
<p>使用舊 API 版本且應轉換的 kubeadm 設定文件的路徑。此參數是必需的。</p>
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
<td colspan="2">
<!--
kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>用於和叢集通信的 kubeconfig 文件。如果未設置，那麼 kubeadm 將會搜索一個已經存在於標準路徑的 kubeconfig 文件。</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>[EXPERIMENTAL] The path to the 'real' host root filesystem.</p>  
-->
<p>[實驗] 到 '真實' 主機根文件系統的路徑。</p>
</td>
</tr>

</tbody>
</table>
