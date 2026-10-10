

kubeadm設定APIを含むファイルを読み込み、検証に問題があれば報告します。

### 概要



このコマンドはkubeadm設定APIファイルを検証して、警告やエラーがあれば報告します。
エラーが無い場合は終了ステータスはゼロ、それ以外の場合はゼロ以外の値となります。
不明なAPIフィールドのようなデータ変換できない問題については、エラーが発生します。
不明なAPIバージョンや不正な値を持つフィールドについてもエラーとなります。
入力ファイルの内容によっては、その他のエラーや警告が報告されることもあります。

このバージョンのkubeadmでは、次のAPIバージョンがサポートされています:
- kubeadm.k8s.io/v1beta3


```
kubeadm config validate [flags]
```

### オプション

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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>実験的な未リリースのAPIの検証を許可する。</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadm設定ファイルへのパス。</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>validateのヘルプ</p></td>
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
<td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "/etc/kubernetes/admin.conf"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>クラスターと通信する時に使用するkubeconfigファイル。フラグが設定されていない場合は、標準的な場所の中から既存のkubeconfigファイルが検索されます。</p></td>
</tr>

<tr>
<td colspan="2">--rootfs string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>[実験的]'実際の'ホストのルートファイルシステムのパス。</p></td>
</tr>

</tbody>
</table>



