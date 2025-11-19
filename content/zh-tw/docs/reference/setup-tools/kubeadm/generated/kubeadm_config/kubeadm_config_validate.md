
<!--
Read a file containing the kubeadm configuration API and report any validation problems
-->
讀取包含 kubeadm 設定 API 的文件，並報告所有驗證問題。

<!--
### Synopsis
-->
### 概要

<!--
This command lets you validate a kubeadm configuration API file and report any warnings and errors.
If there are no errors the exit status will be zero, otherwise it will be non-zero.
Any unmarshaling problems such as unknown API fields will trigger errors. Unknown API versions and
fields with invalid values will also trigger errors. Any other errors or warnings may be reported
depending on contents of the input file.
-->
這個命令允許你驗證 kubeadm 設定 API 文件並報告所有警告和錯誤。
如果沒有錯誤，退出狀態將爲零；否則，將爲非零。
諸如未知 API 字段等任何解包問題都會觸發錯誤。
未知的 API 版本和具有無效值的字段也會觸發錯誤。
根據輸入文件的內容，可能會報告任何其他錯誤或警告。

<!--
In this version of kubeadm, the following API versions are supported:
-->
在這個版本的 kubeadm 中，支持以下 API 版本：

- kubeadm.k8s.io/v1beta3

```
kubeadm config validate [flags]
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
<td colspan="2">--allow-experimental-api</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
Allow validation of experimental, unreleased APIs.
-->
允許驗證試驗性的、未發佈的 API。
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
指向 kubeadm 設定文件的路徑。
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
help for validate
-->
validate 的幫助命令。
</p>
</td>
</tr>

</tbody>
</table>

<!--
### Options inherited from parent commands
-->
### 從父命令繼承而來的選項

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<!--
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
-->
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.
-->
在與叢集通信時要使用的 kubeconfig 文件。
如果此標誌未被設置，則會在一組標準位置中搜索現有的 kubeconfig 文件。
</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
[EXPERIMENTAL] The path to the 'real' host root filesystem.
-->
[試驗性] 指向“真實”主機根文件系統的路徑。
</p>
</td>
</tr>

</tbody>
</table>
