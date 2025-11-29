---
title: 保存時に既に暗号化されている機密データを復号化する
content_type: task
weight: 215
---

<!-- overview -->

Kubernetes の永続的な API リソースデータを書き込むことができるすべての API は、保存時の暗号化をサポートしています。 例えば、
{{< glossary_tooltip text="Secrets" term_id="secret" >}}に対して保存時の暗号化を有効にできます.
この保存時暗号化は、etcdクラスターまたはkube-apiserverを実行しているホスト上のファイルシステムのシステムレベルの暗号化に加えて行われます。

このページでは、保存時のAPIデータの暗号化を切り替えて、APIデータを暗号化せずに保存する方法を説明します。パフォーマンスを向上させるためにこれを行う必要がある場合もありますが、通常は、一部のデータを暗号化することが適切である場合は、暗号化したままにするのも良いです。

{{< note >}}
このタスクでは、{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}} を使用して保存されたリソースデータの暗号化について説明します。たとえば、Secretオブジェクト（そこに含まれるキーと値のデータを含む）を暗号化できます。

コンテナにマウントされたファイルシステム内のデータ暗号化を管理する場合は、代わりに以下のいずれかを実行する必要があります：

- 暗号化された
  {{< glossary_tooltip text="volumes" term_id="volume" >}}を提供するストレージ統合を使用する
- アプリケーション内でデータを暗号化する
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* このタスクでは、Kubernetes API サーバーを各コントロールプレーンノードで {{< glossary_tooltip text="static pod" term_id="static-pod" >}} として実行していることを前提としています。

* クラスターのコントロールプレーンは、etcd v3.x (メジャーバージョン 3、マイナーバージョンは任意) の使用が**必須**です。

* カスタムリソースを暗号化するには、クラスターがKubernetes v1.26以降を実行している必要があります。

* 既に暗号化されているAPIデータがいくつか存在している必要があります。

{{< version-check >}}


<!-- steps -->

## 保存時の暗号化が既に有効かどうかを確認する

デフォルトでは、APIサーバーはリソースの平文表現を保存する`identity`プロバイダーを使用します。
**デフォルトの `identity` プロバイダーは、いかなる機密性保護も提供しません。**

`kube-apiserver` プロセスは、設定ファイルへのパスを指定する引数`--encryption-provider-config`を受け入れます。このファイルを指定すると、その内容によって、etcdでのKubernetes APIデータの暗号化方法が制御されます。
指定されていない場合は、保存時の暗号化は有効になりません。

この設定ファイルの形式はYAMLで、
[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-config.v1/) という名前の設定APIの種類を表します。
設定の例は[Encryption at rest configuration](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)で確認できます.

`--encryption-provider-config`が指定されている場合は、どのリソース（`secrets`など）が暗号化用に設定されているか、またどのプロバイダーが使用されているかを確認してください。
そのリソースタイプに対して優先されるプロバイダーが`identity`**ではない**ことを確認してください。保存時の暗号化を無効にする場合にのみ、`identity`(_暗号化なし_)をデフォルトとして設定してください。
リソースの最初にリストされているプロバイダーが`identity`**以外**のものであることを確認してください。これは、そのタイプのリソースに書き込まれる新しい情報はすべて、設定どおりに暗号化されることを意味します。
いずれかのリソースの最初にリストされているプロバイダーが`identity`である場合、
そのリソースは暗号化されずにetcdに書き込まれていることを意味します。

## すべてのデータを復号化する {#decrypting-all-data}

この例では、保存時のシークレットAPIの暗号化を停止する方法を示します。
他の種類のAPIを暗号化している場合は、手順をそれに合わせて調整してください。

### 暗号化設定ファイルを特定する

まず、APIサーバーの設定ファイルを見つけます。各コントロールプレーンノードでは、kube-apiserver用の静的Podマニフェストがコマンドライン引数`--encryption-provider-config`を指定しています。
このファイルは、[`hostPath`](/docs/concepts/storage/volumes/#hostpath) ボリュームマウントを使用して静的Podにマウントされている可能性が高いです。ボリュームを見つけたら、ノードのファイルシステム上でファイルを見つけて調査できます。

### APIサーバーを設定してオブジェクトを復号化する

保存時の暗号化を無効にするには、暗号化設定ファイルの最初のエントリとして`identity`プロバイダーを指定します。

たとえば、既存のEncryptionConfigurationファイルが下記の場合、
```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - aescbc:
          keys:
            # Do not use this (invalid) example key for encryption
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

下記に変更し、

```yaml
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {} # add this line
      - aescbc:
          keys:
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
```

このノードでkube-apiserver Podを再起動します。

### 他のコントロールプレーンホストを再設定する {#api-server-config-update-more-1}

クラスタ内に複数のAPIサーバーがある場合、変更は各APIサーバーに順番にデプロイする必要があります。

各コントロールプレーンホストで同一の暗号化設定を使用していることを確認してください。

### 強制的に復号化する

次に、以下のコマンドを実行して、すべてのシークレットを強制的に復号化します。:

```shell
# If you are decrypting a different kind of object, change "secrets" to match.
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

既存の暗号化されたリソースを**すべて**、暗号化を使用しないバックアップデータに置き換えたら、
`kube-apiserver` から暗号化設定を削除できます。

削除するコマンドラインオプションは下記です。

- `--encryption-provider-config`
- `--encryption-provider-config-automatic-reload`

新しい設定を適用するには、kube-apiserver Podを再起動します。

### 他のコントロールプレーンホストを再設定する {#api-server-config-update-more-2}

クラスター内に複数の API サーバーがある場合は、各 API サーバーに順番に変更をデプロイする必要があります。

各コントロールプレーンホストで同じ暗号化設定を使用していることを確認してください。

## {{% heading "whatsnext" %}}

* [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/)について学ぶ.
