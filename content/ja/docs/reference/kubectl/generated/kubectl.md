---
title: kubectl
content_type: tool-reference
weight: 30
---


## {{% heading "synopsis" %}}


kubectlは、Kubernetesクラスターマネージャーを制御するコマンドラインツールです。

詳細は以下をご覧ください:
https://kubernetes.io/ja/docs/reference/kubectl/

```
kubectl [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
<colgroup>
<col span="1" style="width: 10px;" />
<col span="1" />
</colgroup>
<tbody>

<tr>
<td colspan="2">--as string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>この操作を実行する際に偽装するユーザー名を指定します。ユーザーには、通常のユーザーまたは名前空間内のサービスアカウントを指定できます。</p></td>
</tr>

<tr>
<td colspan="2">--as-group strings</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>この操作で偽装するグループを指定します。複数のグループを指定する場合は、このフラグを繰り返し使用できます。</p></td>
</tr>

<tr>
<td colspan="2">--as-uid string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>この操作で偽装するUIDを指定します。</p></td>
</tr>

<tr>
<td colspan="2">--cache-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "$HOME/.kube/cache"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>デフォルトのキャッシュディレクトリ</p></td>
</tr>

<tr>
<td colspan="2">--certificate-authority string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>証明書の検証に使用する証明機関の証明書ファイルへのパス</p></td>
</tr>

<tr>
<td colspan="2">--client-certificate string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>TLSで使用するクライアント証明書ファイルへのパス</p></td>
</tr>

<tr>
<td colspan="2">--client-key string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>TLSで使用するクライアントキーのファイルへのパス</p></td>
</tr>

<tr>
<td colspan="2">--cluster string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>使用するkubeconfigのクラスター名</p></td>
</tr>

<tr>
<td colspan="2">--context string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>使用するkubeconfigのコンテキスト名</p></td>
</tr>

<tr>
<td colspan="2">--disable-compression</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueにすると、サーバーへのすべてのリクエストに対するレスポンス圧縮を無効にします</p></td>
</tr>

<tr>
<td colspan="2">-h, --help</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>kubectlのヘルプを表示します</p></td>
</tr>

<tr>
<td colspan="2">--insecure-skip-tls-verify</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>trueにすると、サーバー証明書の有効性を検証しません。この設定により、HTTPS接続の安全性は損なわれます</p></td>
</tr>

<tr>
<td colspan="2">--kubeconfig string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>CLIリクエストで使用するkubeconfigファイルのパス</p></td>
</tr>

<tr>
<td colspan="2">--kuberc string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>設定に使用するkubercファイルへのパス。この機能は、KUBECTL_KUBERC=false、またはKUBERC=offの環境変数を設定し、エクスポートすることで無効化できます。</p></td>
</tr>

<tr>
<td colspan="2">--match-server-version</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>クライアントバージョンとサーバーバージョンが一致することを要求します</p></td>
</tr>

<tr>
<td colspan="2">-n, --namespace string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>このCLIリクエストの名前空間スコープ(指定されている場合)</p></td>
</tr>

<tr>
<td colspan="2">--password string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>APIサーバーへのBasic認証に使用するパスワード</p></td>
</tr>

<tr>
<td colspan="2">--profile string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "none"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>取得対象のプロファイル名(none|cpu|heap|goroutine|threadcreate|block|mutex)のいずれか</p></td>
</tr>

<tr>
<td colspan="2">--profile-output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "profile.pprof"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>プロファイルの出力先ファイル名</p></td>
</tr>

<tr>
<td colspan="2">--request-timeout string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "0"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>単一のサーバーリクエストに対して待機する最大時間。0以外の値には時間単位(例: 1s、2m、3h)を含める必要があります。0を指定した場合はタイムアウトしません。</p></td>
</tr>

<tr>
<td colspan="2">-s, --server string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Kubernetes APIサーバーのアドレスとポート</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-buffer-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: 1m0s</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>ストレージドライバーへの書き込みはこの期間バッファリングされ、メモリ以外のバックエンドへは単一トランザクションとしてコミットされます</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-db string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "cadvisor"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>データベース名</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-host string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "localhost:8086"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>データベースのホスト名とポート(host:port)</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-password string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>データベースのパスワード</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-secure</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>データベースとの接続でセキュア接続を使用します</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-table string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "stats"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>テーブル名</p></td>
</tr>

<tr>
<td colspan="2">--storage-driver-user string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "root"</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>データベースのユーザー名</p></td>
</tr>

<tr>
<td colspan="2">--tls-server-name string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>サーバー証明書の検証に使用するサーバー名。指定しない場合は、接続先のホスト名が使用されます</p></td>
</tr>

<tr>
<td colspan="2">--token string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>APIサーバーへの認証に使用するBearerトークン</p></td>
</tr>

<tr>
<td colspan="2">--user string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>使用するkubeconfigのユーザー名</p></td>
</tr>

<tr>
<td colspan="2">--username string</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>APIサーバーへのBasic認証に使用するユーザー名</p></td>
</tr>

<tr>
<td colspan="2">--version version[=true]</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>--versionまたは--version=rawを指定すると、バージョン情報を表示して終了します。--version=vX.Y.Z...の形式で指定すると、出力されるバージョンを設定できます</p></td>
</tr>

<tr>
<td colspan="2">--warnings-as-errors</td>
</tr>
<tr>
<td></td><td style="line-height: 130%; word-wrap: break-word;"><p>サーバーから受信した警告をエラーとして扱い、非ゼロの終了コードで終了します</p></td>
</tr>

</tbody>
</table>



## {{% heading "seealso" %}}

* [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/)	 - リソースのアノテーションを更新します
* [kubectl api-resources](/docs/reference/kubectl/generated/kubectl_api-resources/)	 - サーバーでサポートされているAPIリソースを表示します
* [kubectl api-versions](/docs/reference/kubectl/generated/kubectl_api-versions/)	 - サーバーでサポートされているAPIバージョンを"group/version"形式で表示します
* [kubectl apply](/docs/reference/kubectl/generated/kubectl_apply/)	 - ファイル名または標準入力からリソースに構成を適用します
* [kubectl attach](/docs/reference/kubectl/generated/kubectl_attach/)	 - 実行中のコンテナにアタッチします
* [kubectl auth](/docs/reference/kubectl/generated/kubectl_auth/)	 - 認可情報を確認します
* [kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/)	 - Deployment、ReplicaSet、StatefulSet、またはReplicationControllerを自動スケーリングします
* [kubectl certificate](/docs/reference/kubectl/generated/kubectl_certificate/)	 - 証明書リソースを変更します
* [kubectl cluster-info](/docs/reference/kubectl/generated/kubectl_cluster-info/)	 - クラスター情報を表示します
* [kubectl completion](/docs/reference/kubectl/generated/kubectl_completion/)	 - 指定したシェル(bash、zsh、fish、powershell)の補完コードを出力します
* [kubectl config](/docs/reference/kubectl/generated/kubectl_config/)	 - kubeconfigファイルを変更します
* [kubectl cordon](/docs/reference/kubectl/generated/kubectl_cordon/)	 - ノードをスケジューリング不可に設定します
* [kubectl cp](/docs/reference/kubectl/generated/kubectl_cp/)	 - コンテナとの間でファイルやディレクトリをコピーします
* [kubectl create](/docs/reference/kubectl/generated/kubectl_create/)	 - ファイルまたは標準入力からリソースを作成します
* [kubectl debug](/docs/reference/kubectl/generated/kubectl_debug/)	 - ワークロードやノードのトラブルシューティングのためのデバッグセッションを作成します
* [kubectl delete](/docs/reference/kubectl/generated/kubectl_delete/)	 - ファイル名、標準入力、リソースと名前、またはリソースとラベルセレクターでリソースを削除します
* [kubectl describe](/docs/reference/kubectl/generated/kubectl_describe/)	 - 特定のリソースまたはリソースのグループの詳細を表示します
* [kubectl diff](/docs/reference/kubectl/generated/kubectl_diff/)	 - 適用される予定の構成と現在の構成の差分を表示します
* [kubectl drain](/docs/reference/kubectl/generated/kubectl_drain/)	 - メンテナンスのためにノードをドレインします
* [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/)	 - サーバー上のリソースを編集します
* [kubectl events](/docs/reference/kubectl/generated/kubectl_events/)	 - イベントを一覧表示します
* [kubectl exec](/docs/reference/kubectl/generated/kubectl_exec/)	 - コンテナ内でコマンドを実行します
* [kubectl explain](/docs/reference/kubectl/generated/kubectl_explain/)	 - リソースのドキュメントを表示します
* [kubectl expose](/docs/reference/kubectl/generated/kubectl_expose/)	 - ReplicationController、Service、Deployment、またはPodを新しいServiceとして公開します
* [kubectl get](/docs/reference/kubectl/generated/kubectl_get/)	 - 1つまたは複数のリソースを表示します
* [kubectl kustomize](/docs/reference/kubectl/generated/kubectl_kustomize/)	 - ディレクトリまたはURLからkustomization対象をビルドします
* [kubectl label](/docs/reference/kubectl/generated/kubectl_label/)	 - リソースのラベルを更新します
* [kubectl logs](/docs/reference/kubectl/generated/kubectl_logs/)	 - Pod内のコンテナのログを表示します
* [kubectl options](/docs/reference/kubectl/generated/kubectl_options/)	 - すべてのコマンドで共通して使用されるフラグの一覧を表示します
* [kubectl patch](/docs/reference/kubectl/generated/kubectl_patch/)	 - リソースのフィールドを更新します
* [kubectl plugin](/docs/reference/kubectl/generated/kubectl_plugin/)	 - プラグインとのやり取りを行うユーティリティを提供します
* [kubectl port-forward](/docs/reference/kubectl/generated/kubectl_port-forward/)	 - 1つ以上のローカルポートをPodにフォワードします
* [kubectl proxy](/docs/reference/kubectl/generated/kubectl_proxy/)	 - Kubernetes APIサーバーへのプロキシを起動します
* [kubectl replace](/docs/reference/kubectl/generated/kubectl_replace/)	 - ファイル名または標準入力からリソースを置き換えます
* [kubectl rollout](/docs/reference/kubectl/generated/kubectl_rollout/)	 - リソースのロールアウトを管理します
* [kubectl run](/docs/reference/kubectl/generated/kubectl_run/)	 - クラスター上で特定のイメージを実行します
* [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/)	 - Deployment、ReplicaSet、またはReplicationControllerのスケール数を設定します
* [kubectl set](/docs/reference/kubectl/generated/kubectl_set/)	 - オブジェクトに特定の機能を設定します
* [kubectl taint](/docs/reference/kubectl/generated/kubectl_taint/)	 - 1つ以上のノードに対してTaintを更新します
* [kubectl top](/docs/reference/kubectl/generated/kubectl_top/)	 - リソース(CPU/メモリ)の使用状況を表示します
* [kubectl uncordon](/docs/reference/kubectl/generated/kubectl_uncordon/)	 - ノードをスケジューリング可能に設定します
* [kubectl version](/docs/reference/kubectl/generated/kubectl_version/)	 - クライアントおよびサーバーのバージョン情報を表示します
* [kubectl wait](/docs/reference/kubectl/generated/kubectl_wait/)	 - 実験的: 1つまたは複数のリソースに対して、特定の条件を満たすまで待機します

