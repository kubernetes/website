---
title: データ暗号化にKMSプロバイダーを使用する
content_type: task
weight: 370
---
<!-- overview -->
このページでは、機密データの暗号化を有効にするために、Key Management Service(KMS)プロバイダーとプラグインを設定する方法について説明します。
Kubernetes {{< skew currentVersion >}}では、KMSによる保存時暗号化はv1とv2の2つのバージョンが利用できます。
KMS v1は(Kubernetes v1.28以降で)非推奨であり、(Kubernetes v1.29以降では)デフォルトで無効化されているため、特段の理由がない限りKMS v2を使用すべきです。
KMS v2は、KMS v1よりも大幅に優れたパフォーマンス特性を提供します。

{{< caution >}}
このドキュメントは、KMS v2のGAな実装(および非推奨のv1の実装)について記載しています。
Kubernetes v1.29より古いコントロールプレーンコンポーネントを使用している場合は、クラスターが実行しているKubernetesのバージョンに対応するドキュメントの同等のページを確認してください。
以前のKubernetesのリリースでは、情報セキュリティに影響する可能性のある異なる挙動が存在します。
{{< /caution >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

必要なKubernetesのバージョンは、選択したKMS APIバージョンによって異なります。
KubernetesではKMS v2の使用を推奨しています。

- バージョンv1.27より前のクラスターをサポートするためにKMS API v1を選択した場合、またはKMS v1のみをサポートするレガシーKMSプラグインを使用している場合、KMS v1をサポートする全てのKubernetesバージョンが動作します。
このAPIはKubernetes v1.28時点で非推奨です。
KubernetesではこのAPIの使用を推奨していません。

{{< version-check >}}

### KMS v1
{{< feature-state for_k8s_version="v1.28" state="deprecated" >}}

* Kubernetesバージョン1.10.0以降が必要です

* バージョン1.29以降では、KMSのv1実装はデフォルトで無効になっています。
この機能を有効化するには、`--feature-gates=KMSv1=true`を設定してKMS v1プロバイダーを構成してください。

* クラスターはetcd v3以降を使用する必要があります

### KMS v2
{{< feature-state for_k8s_version="v1.29" state="stable" >}}

* クラスターはetcd v3以降を使用する必要があります

<!-- steps -->

## KMS暗号化とオブジェクトごとの暗号化キー

KMSプロバイダーは、etcd内のデータを暗号化するためにエンベロープ暗号化方式を使用します。
データはデータ暗号化鍵(DEK)を使用して暗号化されます。
DEKは、リモートKMSで保存・管理される鍵暗号化鍵(KEK)で暗号化されます。

(非推奨の)KMSのv1実装を使用する場合、各暗号化に対して新しいDEKが生成されます。

KMS v2では、**暗号化ごと**に新しいDEKが生成されます: APIサーバーは _鍵導出関数_ を使用して、シークレットシード(暗号鍵生成の種)とランダムデータを組み合わせて単一用途のデータ暗号化鍵を生成します。
シードは、KEKがローテーションされるたびにローテーションされます(詳細については、以下の「key_idと鍵ローテーションの理解」セクションを参照してください)。

KMSプロバイダーは、UNIXドメインソケット経由で特定のKMSプラグインと通信するためにgRPCを使用します。
KMSプラグインは、gRPCサーバーとして実装され、Kubernetesコントロールプレーンと同じホストにデプロイされ、リモートKMSとのすべての通信を担当します。

## KMSプロバイダーの設定

APIサーバーでKMSプロバイダーを設定するには、暗号化設定ファイルの`providers`配列に`kms`タイプのプロバイダーを含め、以下のプロパティを設定してください:

### KMS v1 {#configuring-the-kms-provider-kms-v1}

* `apiVersion`: KMSプロバイダーのAPIバージョン。
この値を空のままにするか、`v1`に設定してください。
* `name`: KMSプラグインの表示名。
一度設定すると変更できません。
* `endpoint`: gRPCサーバー(KMSプラグイン)のリッスンアドレス。
このエンドポイントはUNIXドメインソケットです。
* `cachesize`: 平文でキャッシュするデータ暗号化鍵(DEK)の数。
キャッシュする場合、DEKはKMSへの追加の呼び出しなしで使用できますが、キャッシュしない場合はKMSを呼び出して鍵を取り出す必要があります。
* `timeout`: `kube-apiserver`がエラーを返す前にkms-pluginの応答を待つ時間(デフォルトは3秒)。

### KMS v2 {#configuring-the-kms-provider-kms-v2}

* `apiVersion`: KMSプロバイダーのAPIバージョン。
これを`v2`に設定してください。
* `name`: KMSプラグインの表示名。
一度設定すると変更できません。
* `endpoint`: gRPCサーバー(KMSプラグイン)のリッスンアドレス。
このエンドポイントはUNIXドメインソケットです。
* `timeout`: `kube-apiserver`がエラーを返す前にkms-pluginの応答を待つ時間(デフォルトは3秒)。

KMS v2は`cachesize`プロパティをサポートしていません。
KMSを呼び出してサーバーが取り出した全てのデータ暗号化鍵(DEK)は、平文でキャッシュされます。
いったんキャッシュされたDEKは、KMSを呼び出すことなく無期限で復号に使用できます。

[保存時暗号化設定の理解](/docs/tasks/administer-cluster/encrypt-data)を参照してください。

## KMSプラグインの実装

KMSプラグインを実装するには、新しいプラグインgRPCサーバーを開発するか、クラウドプロバイダーによって既に提供されているKMSプラグインを有効にすることができます。
その後、プラグインをリモートKMSと統合し、Kubernetesコントロールプレーンにデプロイします。

### クラウドプロバイダーがサポートするKMSの有効化

クラウドプロバイダー固有のKMSプラグインを有効にする手順については、お使いのクラウドプロバイダーを参照してください。

### KMSプラグインgRPCサーバーの開発

Go用に利用可能なスタブファイルを使用してKMSプラグインgRPCサーバーを開発できます。
他の言語については、protoファイルを使用してgRPCサーバーコードの開発に使用できるスタブファイルを作成します。

#### KMS v1 {#developing-a-kms-plugin-gRPC-server-kms-v1}

* Goを使用する場合:
  gRPCサーバーコードを開発するには、スタブファイル内の関数とデータ構造を使用してください:
  [api.pb.go](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v1beta1/api.pb.go)

* Go以外の言語を使用する場合:
  個別言語向けのスタブファイルを生成するには、protocコンパイラーとprotoファイルを使用してください:
  [api.proto](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v1beta1/api.proto)

#### KMS v2 {#developing-a-kms-plugin-gRPC-server-kms-v2}

* Goを使用する場合: 
  gRPCサーバーコードの開発を簡単にするために[高レベルライブラリ](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/pkg/service/interface.go)が提供されています。
  低レベルの実装では、スタブファイル内の関数とデータ構造を使用できます:
  [api.pb.go](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.pb.go)

* Go以外の言語を使用する場合:
  個別言語向けのスタブファイルを生成するには、protocコンパイラーとprotoファイルを使用してください:
  [api.proto](https://github.com/kubernetes/kms/blob/release-{{< skew currentVersion >}}/apis/v2/api.proto)

その後、スタブファイル内の関数とデータ構造を使用してサーバーコードを開発してください。

#### 注意事項

##### KMS v1 {#developing-a-kms-plugin-gRPC-server-notes-kms-v1}

* KMSプラグインバージョン: `v1beta1`

  Versionプロシージャコールへの応答で、互換性のあるKMSプラグインは`VersionResponse.version`として`v1beta1`を返す必要があります。

* メッセージバージョン: `v1beta1`

  KMSプロバイダーからのすべてのメッセージには、バージョンフィールドが`v1beta1`に設定されています。

* プロトコル: UNIXドメインソケット(`unix`)

  プラグインは、UNIXドメインソケットでリッスンするgRPCサーバーとして実装されます。
  稼働中のプラグインは、UNIXドメインソケットでgRPC接続を待受するために、ファイルシステム上にファイルを作成する必要があります。
  APIサーバー(gRPCクライアント)は、KMSプロバイダー(gRPCサーバー)とUNIXドメインソケットを通じて通信するためにエンドポイントを設定します。
  `unix:///@foo`のように、`/@`から始まるエンドポイントを指定すると、抽象化したLinuxソケットを利用できます。
  従来のファイルベースのソケットとは異なり、このタイプのソケットにはACLの概念がないため、使用する際は注意が必要です。
  ただし、これらのソケットはLinuxネットワーク名前空間で制御されるため、ホストネットワーキングが使用されていない限りは、同じPod内のコンテナからのみアクセスできます。

##### KMS v2 {#developing-a-kms-plugin-gRPC-server-notes-kms-v2}

* KMSプラグインバージョン: `v2`

  `Status`リモートプロシージャコールへの応答の際、KMS v2に互換なKMSプラグインは`StatusResponse.version`としてKMS互換性バージョンを返す必要があります。
  また、ステータス応答には`StatusResponse.healthz`として「ok」、`StatusResponse.key_id`として`key_id`(リモートKMSのKEK ID)を含める必要があります。
  Kubernetesプロジェクトでは、プラグインを安定した`v2` KMS APIと互換性があるようにすることを推奨します。
Kubernetes {{< skew currentVersion >}}はKMS用の`v2beta1` APIもサポートしており、将来のKubernetesリリースでもそのベータバージョンのサポートが継続される可能性があります。

  APIサーバーは、すべてが正常な場合は約1分ごとに`Status`プロシージャコールをポーリングし、プラグインが正常でない場合は10秒ごとにポーリングします。
  プラグインは、常にこの呼び出し負荷がかかることを考慮して最適化する必要があります。

* 暗号化

  `EncryptRequest`プロシージャコールは、平文に加えて、ログ目的のUIDフィールドを提供します。
  応答には暗号文と使用するKEKの`key_id`を含める必要があり、KMSプラグインが将来の`DecryptRequest`呼び出しを(`annotations`フィールド経由で)支援するために必要とする、任意のメタデータを含めることもできます。
  プラグインは、異なる任意の平文が異なる応答`(ciphertext, key_id, annotations)`を与えることを保証しなければなりません(MUST)。

  プラグインが空でない`annotations`マップを返す場合、すべてのマップキーは`example.com`のような完全修飾ドメイン名である必要があります。
`annotation`の使用例は`{"kms.example.io/remote-kms-auditid":"<audit ID used by the remote KMS>"}`です。

  APIサーバーは高頻度で`EncryptRequest`プロシージャコールを実行しませんが、プラグインの実装では各リクエストのレイテンシーを100ミリ秒未満に保つことを目指す必要があります。

* 復号

  `DecryptRequest`プロシージャコールでは、`EncryptRequest`から得た`(ciphertext, key_id, annotations)`とログ目的のUIDを提供します。
  期待される通り、これは`EncryptRequest`呼び出しの逆です。
  プラグインは`key_id`が既知のものかどうかを検証しなければなりません(MUST)。
  また、以前にプラグイン自身が暗号化したデータであることを確証できない限り、データの復号を試みてはいけません(MUST NOT)。

  APIサーバーは、Watchキャッシュを満たすために起動時に何千もの`DecryptRequest`プロシージャコールを実行する可能性があります。
  したがって、プラグインの実装はこれらの呼び出しを可能な限り迅速に実行する必要があり、各リクエストのレイテンシーを10ミリ秒未満に保つことを目指す必要があります。

* `key_id`と鍵ローテーションの理解

  `key_id`は、現在使用中のリモートKMS KEKの公開された非機密の名前です。
APIサーバーの通常の動作中にログに記録される可能性があるため、プライベートデータを含んではいけません。
プラグインの実装では、データの漏洩を避けるためにハッシュの使用が推奨されます。
KMS v2メトリクスは、`/metrics`エンドポイント経由で公開する前にこの値をハッシュ化するよう注意しています。

  APIサーバーは、`Status`プロシージャコールから返される`key_id`を信頼できるものと見なします。
したがって、この値の変更は、リモートKEKが変更されたことをAPIサーバーに通知し、古いKEKで暗号化されたデータはno-op書き込みが実行されたときに古いものとしてマークされる必要があります(以下で説明)。
`EncryptRequest`プロシージャコールが`Status`とは異なる`key_id`を返す場合、応答は破棄され、プラグインは正常でないと見なされます。
したがって、実装は`Status`から返される`key_id`が`EncryptRequest`によって返されるものと同じであることを保証する必要があります。
さらに、プラグインは`key_id`が安定しており、値間で変動しないことを確保する必要があります(つまり、リモートKEKローテーション中)。

  プラグインは、以前に使用されたリモートKEKが復元された状況でも、`key_id`を再利用してはいけません。
  プラグインが`key_id=A`を使用していて、`key_id=B`に切り替え、その後`key_id=A`に戻った場合、`key_id=A`を報告する代わりに、プラグインは`key_id=A_001`のような派生値を報告するか、`key_id=C`のような新しい値を使用する必要があります。

  APIサーバーは約1分ごとに`Status`をポーリングするため、`key_id`ローテーションは即座には行われません。
さらに、APIサーバーは約3分間最後の有効な状態で継続します。
したがって、ユーザーがストレージ移行に対して受動的な(つまり、待機による)アプローチを取りたい場合、リモートKEKがローテーションされた後の`3 + N + M`分でマイグレーションを予定する必要があります(`N`はプラグインが`key_id`の変更を検知するのにかかる時間、`M`は設定変更が処理されることを許可するための望ましいバッファです。`M`の最小値は5分が推奨されます)。
KEKローテーションを実行するためにAPIサーバーの再起動は必要ないことに注意してください。

  {{< caution >}}
  DEKで実行される書き込み数を制御できないため、Kubernetesプロジェクトでは、KEKを少なくとも90日ごとにローテーションすることを推奨します。
  {{< /caution >}}

* プロトコル: UNIXドメインソケット(`unix`)

  プラグインは、UNIXドメインソケットでリッスンするgRPCサーバーとして実装されます。
  稼働中のプラグインは、UNIXドメインソケットでgRPC接続を待受するために、ファイルシステム上にファイルを作成する必要があります。
  APIサーバー(gRPCクライアント)は、KMSプロバイダー(gRPCサーバー)とUNIXドメインソケットを通じて通信するためにエンドポイントを設定します。
  `unix:///@foo`のように、`/@`から始まるエンドポイントを指定すると、抽象化したLinuxソケットを利用できます。
  従来のファイルベースのソケットとは異なり、このタイプのソケットにはACLの概念がないため、使用する際は注意が必要です。
  ただし、これらのソケットはLinuxネットワーク名前空間で制御されるため、ホストネットワーキングが使用されていない限りは、同じPod内のコンテナからのみアクセスできます。

### KMSプラグインとリモートKMSの統合

KMSプラグインは、KMSがサポートする任意のプロトコルを使用してリモートKMSと通信できます。
KMSプラグインがリモートKMSとの通信に使用する認証資格情報を含むすべての設定データは、KMSプラグインによって独立して保存・管理されます。
KMSプラグインは、復号のためにKMSに送信する前に必要な追加のメタデータで暗号文をエンコードできます(KMS v2は専用の`annotations`フィールドを提供することでこのプロセスを簡単にします)。

### KMSプラグインのデプロイ

KMSプラグインがKubernetes APIサーバーと同じホストで実行されることを確認してください。

## KMSプロバイダーでデータを暗号化する

データを暗号化するには:

1. SecretやConfigMapなどのリソースを暗号化するために、`kms`プロバイダーの適切なプロパティを使用して新しい`EncryptionConfiguration`ファイルを作成します。
CustomResourceDefinitionで定義された拡張APIを暗号化したい場合、クラスターはKubernetes v1.26以降を実行している必要があります。

1. kube-apiserverの`--encryption-provider-config`フラグを、設定ファイルの場所を指すように設定します。

1. `--encryption-provider-config-automatic-reload`ブール引数は、`--encryption-provider-config`で設定されたファイルがディスクの内容が変更された場合に[自動的にリロード](/docs/tasks/administer-cluster/encrypt-data/#configure-automatic-reloading)されるかどうかを決定します。

1. APIサーバーを再起動します。

### KMS v1 {#encrypting-your-data-with-the-kms-provider-kms-v1}

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
         - configmaps
         - pandas.awesome.bears.example
       providers:
         - kms:
             name: myKmsPluginFoo
             endpoint: unix:///tmp/socketfile-foo.sock
             cachesize: 100
             timeout: 3s
         - kms:
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile-bar.sock
             cachesize: 100
             timeout: 3s
   ```

### KMS v2 {#encrypting-your-data-with-the-kms-provider-kms-v2}

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
         - configmaps
         - pandas.awesome.bears.example
       providers:
         - kms:
             apiVersion: v2
             name: myKmsPluginFoo
             endpoint: unix:///tmp/socketfile-foo.sock
             timeout: 3s
         - kms:
             apiVersion: v2
             name: myKmsPluginBar
             endpoint: unix:///tmp/socketfile-bar.sock
             timeout: 3s
   ```

`--encryption-provider-config-automatic-reload`を`true`に設定すると、すべてのヘルスチェックが単一のヘルスチェックエンドポイントに統合されます。
個別のヘルスチェックは、KMS v1プロバイダーが使用されており、暗号化設定が自動リロードされない場合にのみ利用できます。

以下の表は、各KMSバージョンのヘルスチェックエンドポイントをまとめています:

| KMS設定 | 自動リロードなし | 自動リロードあり |
| ------------------ | ------------------------ | --------------------- |
| KMS v1のみ        | 個別ヘルスチェック  | 単一ヘルスチェック    |
| KMS v2のみ        | 単一ヘルスチェック       | 単一ヘルスチェック    |
| KMS v1とv2の両方 | 個別ヘルスチェック  | 単一ヘルスチェック    |
| KMSなし             | なし                     | 単一ヘルスチェック    |

`単一ヘルスチェック`は、唯一のヘルスチェックエンドポイントが`/healthz/kms-providers`であることを意味します。

`個別ヘルスチェック`は、各KMSプラグインが暗号化設定での位置に基づいて関連するヘルスチェックエンドポイントを持つことを意味します: `/healthz/kms-provider-0`、`/healthz/kms-provider-1`など。

これらのヘルスチェックエンドポイントパスはハードコードされており、サーバーによって生成/制御されます。
個別ヘルスチェックのインデックスは、KMS暗号化設定が処理される順序に対応します。

[すべてのシークレットが暗号化されていることを確認する](#ensuring-all-secrets-are-encrypted)で定義された手順が実行されるまで、`providers`リストは暗号化されていないデータの読み取りを許可するために`identity: {}`プロバイダーで終わる必要があります。
すべてのリソースが暗号化されたら、APIサーバーが暗号化されていないデータを受け入れることを防ぐために`identity`プロバイダーを削除する必要があります。

`EncryptionConfiguration`形式の詳細については、[APIサーバー暗号化APIリファレンス](/docs/reference/config-api/apiserver-config.v1/)を確認してください。

## データが暗号化されていることを確認する

保存時暗号化が正しく設定されている場合、リソースは書き込み時に暗号化されます。
`kube-apiserver`を再起動した後、新しく作成または更新されたSecretや`EncryptionConfiguration`で設定されたその他のリソースタイプは、保存時に暗号化される必要があります。
確認するには、`etcdctl`コマンドラインプログラムを使用して機密データの内容を取得できます。

1. `default`名前空間に`secret1`という新しいシークレットを作成します:

   ```shell
   kubectl create secret generic secret1 -n default --from-literal=mykey=mydata
   ```

1. `etcdctl`コマンドラインを使用して、etcdからそのシークレットを読み取ります:

   ```shell
   ETCDCTL_API=3 etcdctl get /kubernetes.io/secrets/default/secret1 [...] | hexdump -C
   ```

   ここで`[...]`にはetcdサーバーに接続するための追加の引数が含まれます。

1. 保存されたシークレットがKMS v1の場合は`k8s:enc:kms:v1:`で始まり、KMS v2の場合は`k8s:enc:kms:v2:`で始まることを確認します。
これは`kms`プロバイダーが結果データを暗号化したことを示します。

1. API経由で取得されたときに、シークレットが正しく復号されることを確認します:

   ```shell
   kubectl describe secret secret1 -n default
   ```

   Secretには`mykey: mydata`が含まれている必要があります

## すべてのシークレットが暗号化されていることを確認する {#ensuring-all-secrets-are-encrypted}

保存時暗号化が正しく設定されている場合、リソースは書き込み時に暗号化されます。
したがって、データが暗号化されることを確保するために、インプレースでno-op更新を実行できます。

以下のコマンドは、すべてのシークレットを読み取り、その後サーバーサイド暗号化を適用するために更新します。
競合する書き込みによるエラーが発生した場合は、コマンドを再試行してください。
大規模なクラスターの場合、名前空間によってシークレットを細分化するか、更新をスクリプト化することをお勧めします。

```shell
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

## ローカル暗号化プロバイダーからKMSプロバイダーへの切り替え

ローカル暗号化プロバイダーから`kms`プロバイダーに切り替えて、すべてのシークレットを再暗号化するには:

1. 以下の例に示すように、`kms`プロバイダーを設定ファイルの最初のエントリとして追加します。

   ```yaml
   apiVersion: apiserver.config.k8s.io/v1
   kind: EncryptionConfiguration
   resources:
     - resources:
         - secrets
       providers:
         - kms:
             apiVersion: v2
             name : myKmsPlugin
             endpoint: unix:///tmp/socketfile.sock
         - aescbc:
             keys:
               - name: key1
                 secret: <BASE64エンコード済みシークレット>
   ```

1. すべての`kube-apiserver`プロセスを再起動します。

1. 以下のコマンドを実行して、`kms`プロバイダーを使用してすべてのシークレットを強制的に再暗号化します。

   ```shell
   kubectl get secrets --all-namespaces -o json | kubectl replace -f -
   ```

## {{% heading "whatsnext" %}}

<!-- no need to preserve legacy hyperlinks -->

Kubernetes APIに永続化されたデータの暗号化をもう使用したくない場合は、[既に保存時に保存されているデータの復号](/docs/tasks/administer-cluster/decrypt-data/)を読んでください。
