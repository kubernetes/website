---
title: 保存時に既に暗号化されている機密データを復号化する
content_type: task
weight: 215
---

<!-- overview -->

Kubernetesにおいて、永続的なAPIリソースデータの書き込みが可能なすべてのAPIは、保存時の暗号化をサポートしています。
例えば、{{< glossary_tooltip text="シークレット" term_id="secret" >}}に対して保存時の暗号化を有効にできます。
保存時暗号化は、etcdクラスターまたはkube-apiserverを実行しているホスト上のファイルシステムに対するシステムレベルの暗号化に加えて行われます。

このページでは、保存時のAPIデータの暗号化を無効にして、APIデータを暗号化せずに保存する方法を説明します。
パフォーマンス向上のためにこれが必要になる場合もありますが、通常は、暗号化する必要があると判断したデータは、暗号化したままにしておくことが適切です。

{{< note >}}
このタスクでは、{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}を使用して保存されたリソースデータの暗号化について説明します。
例えば、Secretオブジェクト(そこに含まれるキーと値のデータを含む)を暗号化できます。

コンテナにマウントされたファイルシステム内のデータ暗号化を管理する場合は、代わりに次のいずれかを実行してください。

- 暗号化された{{< glossary_tooltip text="ボリューム" term_id="volume" >}}を提供するストレージ統合を使用する
- アプリケーション側でデータを暗号化する
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* このタスクでは、各コントロールプレーンノードで、Kubernetes APIサーバーが{{< glossary_tooltip text="static Pod" term_id="static-pod" >}}として実行されていることを前提とします。

* クラスターのコントロールプレーンは、etcd v3.x(メジャーバージョン3、マイナーバージョンは任意)の使用が**必須**です。

* カスタムリソースを暗号化するには、クラスターがKubernetes v1.26以降を実行している必要があります。

* 既に暗号化されたAPIデータが存在している必要があります。

{{< version-check >}}

<!-- steps -->

## 保存時の暗号化が既に有効かどうかを確認する {#determine-whether-encryption-at-rest-is-already-enabled}

デフォルトでは、APIサーバーはリソースの平文表現を保存する`identity`プロバイダーを使用します。
**デフォルトの`identity`プロバイダーは、いかなる機密性保護も提供しません。**

`kube-apiserver`プロセスは、設定ファイルへのパスを指定する引数`--encryption-provider-config`を受け入れます。このファイルを指定すると、その内容に基づき、etcdでのKubernetes APIデータの暗号化方式が制御されます。
指定されていない場合、保存時の暗号化は有効になりません。

この設定ファイルはYAML形式で、[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-config.v1/)という種類の設定APIを表します。
設定の例は[Encryption at rest configuration](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)で確認できます。

`--encryption-provider-config`が指定されている場合は、どのリソース(例: `secrets`)が暗号化対象として設定されているか、またどのプロバイダーが利用されているかを確認してください。
そのリソースタイプで優先されているプロバイダーが`identity`**ではない**ことを確認します。
保存時の暗号化を無効にする場合のみ、`identity`(_暗号化なし_)をデフォルトとして設定します。

リソースで最初にリストされているプロバイダーが`identity`**以外**であることを確認してください。
もしそう設定されていれば、そのリソースに書き込まれる新しいデータはすべて、設定に従って暗号化されます。
もし最初にリストされているプロバイダーが`identity`である場合、そのリソースは暗号化されずにetcdへ書き込まれています。

## すべてのデータを復号化する {#decrypting-all-data}

この例では、保存時のSecret APIの暗号化を停止する方法を示します。
他の種類のAPIを暗号化している場合は、必要に応じて手順を調整してください。

### 暗号化設定ファイルを特定する {##locate-the-encryption-configuration-file}

まず、APIサーバーの設定ファイルを特定します。各コントロールプレーンノードでは、kube-apiserver用のstatic Podマニフェストが、コマンドライン引数`--encryption-provider-config`を指定しています。
このファイルは、[`hostPath`](/docs/concepts/storage/volumes/#hostpath)ボリュームマウントを使用してstatic Podにマウントされていることが多いです。
ボリュームの場所を確認し、ノードのファイルシステム上でファイルを見つけて内容を確認します。

### APIサーバーを設定してオブジェクトを復号化する {#configure-the-api-server-to-decrypt-objects}

保存時の暗号化を無効にするには、暗号化設定ファイルの最初のエントリとして`identity`プロバイダーを追加します。

以下が既存のEncryptionConfigurationファイルの例です。
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
次のように変更します。
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
各コントロールプレーンホストが同一の暗号化設定を使用していることを確認してください。
### 強制的に復号化する
次に、以下のコマンドを実行して、すべてのSecretを強制的に復号化します。
```shell
# If you are decrypting a different kind of object, change "secrets" to match.
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
```

既存の暗号化済みリソースを**すべて**、暗号化を使用しないデータとして書き換えたら、`kube-apiserver`から暗号化設定を削除できます。

削除するコマンドラインオプションは次のとおりです。

- `--encryption-provider-config`
- `--encryption-provider-config-automatic-reload`

変更を反映するには、kube-apiserver Podを再起動します。

### 他のコントロールプレーンホストを再設定する {#api-server-config-update-more-2}

クラスター内に複数のAPIサーバーがある場合は、各APIサーバーに順番に変更をデプロイする必要があります。

各コントロールプレーンホストで同じ暗号化設定を使用していることを確認してください。

## {{% heading "whatsnext" %}}

* [EncryptionConfiguration configuration API (v1)](/docs/reference/config-api/apiserver-config.v1/)について学ぶ.
