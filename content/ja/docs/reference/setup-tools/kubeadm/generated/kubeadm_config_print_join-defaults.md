

`kubeadm join`で使用可能な既定の参加の設定を出力します。

### 概要



このコマンドは`kubeadm join`で使用可能な既定の参加の設定のオブジェクトを出力します。

Bootstrap Tokenフィールドのような機密性が高い値は、検証はパスしますが、実際にトークンを生成する計算は実行されないように、"abcdef.0123456789abcdef"のようなプレースホルダーの値に置き換えられることに注意してください。


```
kubeadm config print join-defaults [flags]
```

### オプション

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>join-defaultsのヘルプ</p></td>
</tr>

</tbody>
</table>



### 親コマンドから継承されたオプション

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;既定値: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>クラスターと対話する時に使用するkubeconfigファイル。フラグが設定されていない場合は、標準的な場所の中から既存のkubeconfigファイルが検索されます。</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[実験的]'実際の'ホストのルートファイルシステムのパス。</p></td>
</tr>

</tbody>
</table>



