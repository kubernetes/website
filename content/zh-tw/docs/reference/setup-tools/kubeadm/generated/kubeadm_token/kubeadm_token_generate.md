<!-- 
Generate and print a bootstrap token, but do not create it on the server
-->
生成並打印一個引導令牌，但不要在服務器上創建它。

<!--
### Synopsis
-->
### 概要

<!--
This command will print out a randomly-generated bootstrap token that can be used with
the "init" and "join" commands.

You don't have to use this command in order to generate a token. You can do so
yourself as long as it is in the format "[a-z0-9]{6}.[a-z0-9]{16}". This
command is provided for convenience to generate tokens in the given format.

You can also use "kubeadm init" without specifying a token and it will
generate and print one for you.
-->
此命令將打印一個隨機生成的可以被 "init" 和 "join" 命令使用的引導令牌。

你不必使用此命令來生成令牌。你可以自己設定，只要格式符合 "[a-z0-9]{6}.[a-z0-9]{16}"。
之所以提供這個命令是爲了方便生成規定格式的令牌。

你也可以使用 "kubeadm init" 並且不指定令牌，該命令會生成一個令牌並打印出來。

```
kubeadm token generate [flags]
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
<p>help for generate</p>
-->
<p>generate 操作的幫助命令。</p>
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
<td colspan="2">--dry-run</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!-- 
<p>Whether to enable dry-run mode or not</p> 
-->
<p>是否啓用 `dry-run` 模式。</p>
</td>
</tr>

<tr>
<td colspan="2">
<!--
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"
-->
--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;默認值："/etc/kubernetes/admin.conf"
</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<!--
<p>The kubeconfig file to use when talking to the cluster. If the flag is not set, a set of standard locations can be searched for an existing kubeconfig file.</p>
-->
<p>用於和集羣通信的 kubeconfig 文件。如果它沒有被設置，那麼 kubeadm 將會搜索一個已經存在於標準路徑的 kubeconfig 文件。</p>
</td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;">
<p>
<!--
The path to the 'real' host root filesystem. This will cause kubeadm to chroot into the provided path.
-->
到“真實”主機根文件系統的路徑。這將導致 kubeadm 切換到所提供的路徑。
</p>
</td>
</tr>

</tbody>
</table>
