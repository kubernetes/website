

ファイルから古いバージョンのAPIタイプのkubeadmの設定を読み込み、新しいバージョンの同等の設定オブジェクトを出力します。

### 概要



このコマンドは、古いバージョンの設定オブジェクトを、サポートされている最新のバージョンに変換します。
これはクラスターを何も触ることなく、CLIツール内に閉じています。
kubeadmのこのバージョンでは、次のAPIバージョンがサポートされています:
- kubeadm.k8s.io/v1beta3

さらに、kubeadmはバージョン"kubeadm.k8s.io/v1beta3"の設定しか出力できませんが、両方の種類を読むことができます。
このため、どのバージョンを--old-configパラメーターに渡したとしても、APIオブジェクトは読み込まれ、デシリアライズ、デフォルト化、変換、検証、再シリアライズされて、標準出力または--new-configで指定されたファイルに出力されます。

言い換えると、このコマンドの出力は、そのファイルを"kubeadm init"に渡した時にkubeadmが実際に内部で読むものとなります。


```
kubeadm config migrate [flags]
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
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>実験的な未リリースのAPIへの移行を許可します。</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>migrateのヘルプ</p></td>
</tr>

<tr>
<td colspan="2">--new-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>新しいAPIバージョンを使用して得られた同等の内容のkubeadm設定ファイルのパス。この設定はオプションで、指定しない場合は標準出力に出力されます。</p></td>
</tr>

<tr>
<td colspan="2">--old-config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>古いAPIバージョンを使用している、変換対象のkubeadm設定ファイルのパス。このフラグは必須です。</p></td>
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



