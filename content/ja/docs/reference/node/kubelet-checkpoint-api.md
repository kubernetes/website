---
content_type: "reference"
title: KubeletチェックポイントAPI
weight: 10
---

{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

コンテナのチェックポイントは実行中のコンテナのステートフルコピーを作成するための機能です。
コンテナのステートフルコピーがあると、デバックや類似の目的のために別のコンピューターに移動させることができます。

チェックポイントコンテナデータを復元可能なコンピューターに移動させる場合、その復元したコンテナは、チェックポイントが作成された正確に同じ地点で実行が再開されます。
保存したデータを検査することも可能です。
ただし、検査を行うための適したツールを保持している必要があります。

コンテナのチェックポイントを作成することで、セキュリティ影響が発生する場合があります。
通常、チェックポイントはチェックポイントされたコンテナ内のすべてのプロセスのすべてのメモリーページを含んでいます。
メモリー内で使用された全てがローカルディスク上で利用できるようになることを意味しています。
これはすべてのプライベートデータを含んでおり、もしかしたら暗号化に使用した鍵も含まれているかもしれません。
基礎となるCRI実装(そのノード上のコンテナランタイム)は、`root`ユーザーのみがアクセス可能なチェックポイントアーカイブを作成するべきです。
チェックポイントアーカイブが他のシステムに転送された場合、全てのメモリーページがチェックポイントアーカイブのオーナーによって読み取れるようになることを覚えておくことが重要です。

## 操作方法 {#operations}

### `post` 指定したコンテナのチェックポイント {#post-checkpoint}

指定したPodから指定したコンテナのチェックポイントを作成するようにkubeletに指示します。

kubeletチェックポイントインターフェースへのアクセスの制御方法についての詳細な情報は、[Kubelet authentication/authorization reference](/docs/reference/access-authn-authz/kubelet-authn-authz)を参照してください。

kubeletは基礎となる{{<glossary_tooltip term_id="cri" text="CRI">}}実装にチェックポイントをリクエストします。
チェックポイントリクエストでは、kubeletが`checkpoint-<podFullName>-<containerName>-<timestamp>.tar`のようなチェックポイントアーカイブの名前を指定します。
併せて、(`--root-dir`で定義される)rootディレクトリ配下の`checkpoints`ディレクトリに、チェックポイントアーカイブを保存することをリクエストします。
デフォルトは`/var/lib/kubelet/checkpoints`です。

チェックポイントアーカイブは _tar_ フォーマットであり、[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html)の実装を使用して一覧表示できます。
アーカイブの内容は、基礎となるCRI実装(ノード上のコンテナランタイム)に依存します。

#### HTTPリクエスト {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

#### パラメーター {#post-checkpoint-params}

- **namespace** (*パス内*): string, 必須項目

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (*パス内*): string, 必須項目

  {{< glossary_tooltip term_id="pod" >}}

- **container** (*パス内*): string, 必須項目

  {{< glossary_tooltip term_id="container" >}}

- **timeout** (*クエリ内*): integer

  チェックポイントの作成が終了するまで待機する秒単位のタイムアウト。
  ゼロまたはタイムアウトが指定されていない場合、デフォルトは{{<glossary_tooltip term_id="cri" text="CRI">}}タイムアウトの値が使用されます。
  チェックポイント作成時間はコンテナの使用メモリーに直接依存します。
  コンテナの使用メモリーが多いほど、対応するチェックポイントを作成するために必要な時間が長くなります。

#### レスポンス {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (`ContainerCheckpoint`フィーチャーゲートが無効の場合)

404: Not Found (指定した`namespace`や`pod`、`container`が見つからない場合)

500: Internal Server Error (CRI実装でチェックポイント中にエラーが発生した場合(詳細はエラーメッセージを参照))

500: Internal Server Error (CRI実装がチェックポイントCRI APIを実装していない場合(詳細はエラーメッセージを参照))

{{< comment >}}
TODO: CRI実装がチェックポイントや復元の機能を持つ場合のリターンコードについてさらなる情報を追加すること。
      このTODOは、CRI実装が新しいContainerCheckpoint CRI APIコールを実装するために、Kubernetesの変更をマージすることを必要とするため、リリース前には修正できません。
      これを修正するためには1.25リリースの後を待つ必要があります。
{{< /comment >}}
