

kubeadmが使用するイメージの一覧を出力します。
設定ファイルはイメージやイメージリポジトリをカスタマイズする際に使用されます。

### 概要


kubeadmが使用するイメージの一覧を出力します。
設定ファイルはイメージやイメージリポジトリをカスタマイズする際に使用されます。

```
kubeadm config images list [flags]
```

### オプション

   <table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: true</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueならば、テンプレートの中にフィールドやマップキーが見つからない場合に、テンプレート内のエラーを無視します。golangまたはjsonpathを出力フォーマットとした場合にのみ適用されます。</p></td>
</tr>

<tr>
<td colspan="2">--config string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubeadmの設定ファイルのパス。</p></td>
</tr>

<tr>
<td colspan="2">-o, --experimental-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "text"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>出力フォーマット。次のいずれか: text|json|yaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.</p></td>
</tr>

<tr>
<td colspan="2">--feature-gates string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>様々な機能に対するフィーチャーゲートを記述するkey=valueペアのセット。オプション:<br/>EtcdLearnerMode=true|false (BETA - デフォルト値=true)<br/>PublicKeysECDSA=true|false (DEPRECATED - デフォルト値=false)<br/>RootlessControlPlane=true|false (ALPHA - デフォルト値=false)<br/>UpgradeAddonsBeforeControlPlane=true|false (DEPRECATED - デフォルト値=false)<br/>WaitForAllControlPlaneComponents=true|false (ALPHA - デフォルト値=false)</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>listのヘルプ</p></td>
</tr>

<tr>
<td colspan="2">--image-repository string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "registry.k8s.io"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>コントロールプレーンのイメージをプルするコンテナレジストリを選択します。</p></td>
</tr>

<tr>
<td colspan="2">--kubernetes-version string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;デフォルト値: "stable-1"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>コントロールプレーンの特定のKubernetesバージョンを選択します。</p></td>
</tr>

<tr>
<td colspan="2">--show-managed-fields</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueならば、JSONまたはYAMLフォーマットでmanagedFieldsを省略せずにオブジェクトを出力します。</p></td>
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



