---
title: すでに保管時に暗号化されている機密データを復号する
content_type: task
weight: 215
---

永続的なAPIリソースデータを書き込むことができるKubernetesのすべてのAPIは、保管時の暗号化(at-rest encryption)をサポートしています。たとえば、{{< glossary_tooltip text="Secret" term_id="secret" >}}に対して保管時の暗号化を有効にすることができます。この保管時の暗号化は、etcdクラスターやkube-apiserverを実行しているホストのファイルシステムに対するシステムレベルの暗号化に追加されるものです。

このページでは、APIデータの保管時の暗号化を切り替えて、APIデータが暗号化されずに保存されるようにする方法を説明します。パフォーマンスを向上させるためにこれを行いたい場合があるかもしれませんが、通常は、一部のデータを暗号化するのが良いアイデアであったなら、それを暗号化されたままにしておくことも良いアイデアです。

{{< note >}}
このタスクでは、{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}を使用して保存されるリソースデータの暗号化について説明します。たとえば、キーとバリューのデータを含むSecretオブジェクトを暗号化できます。

コンテナにマウントされたファイルシステム内のデータの暗号化を管理したい場合は、代わりに以下のいずれかを行う必要があります。

- 暗号化された{{< glossary_tooltip text="ボリューム" term_id="volume" >}}を提供するストレージインテグレーションを使用する
- 独自のアプリケーション内でデータを暗号化する
{{< /note >}}

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* このタスクは、各コントロールプレーンノードでKubernetes APIサーバーを{{< glossary_tooltip text="静的Pod" term_id="static-pod" >}}として実行していることを前提としています。

* クラスターのコントロールプレーンは、etcd v3.x（メジャーバージョン3、マイナーバージョンは問わず）を使用している**必要があります**。

* カスタムリソースを暗号化するには、クラスターでKubernetes v1.26以降を実行している必要があります。

* すでに暗号化されているAPIデータがいくつか存在している必要があります。

{{< version-check >}}

## 保管時の暗号化がすでに有効になっているかどうかを判断する

デフォルトでは、APIサーバーはリソースのプレーンテキスト表現を保存する`identity`プロバイダーを使用します。
**デフォルトの`identity`プロバイダーは、機密性の保護を提供しません。**

`kube-apiserver`プロセスは、設定ファイルへのパスを指定する`--encryption-provider-config`引数を受け入れます。設定ファイルを指定した場合、そのファイルの内容により、Kubernetes APIデータがetcdでどのように暗号化されるかが制御されます。
指定されていない場合、保管時の暗号化は有効になっていません。

その設定ファイルのフォーマットはYAMLであり、[`EncryptionConfiguration`](/docs/reference/config-api/apiserver-config.v1/)という名前の構成APIカインドを表します。
設定例は、[保管時の暗号化の構成](/docs/tasks/administer-cluster/encrypt-data/#understanding-the-encryption-at-rest-configuration)で確認できます。

`--encryption-provider-config`が設定されている場合は、どのリソース（`secrets`など）が暗号化用に構成されているか、およびどのプロバイダーが使用されているかを確認してください。
そのリソースタイプの優先プロバイダーが`identity`では**ない**ことを確認してください。保管時の暗号化を無効にしたい場合にのみ、`identity`（*暗号化なし*）をデフォルトとして設定します。
リソースの最初にリストされているプロバイダーが`identity`**以外**のものであることを確認します。これは、そのタイプのリソースに書き込まれる新しい情報が、構成どおりに暗号化されることを意味します。リソースの最初にリストされているプロバイダーとして`identity`が表示されている場合、それはそれらのリソースが暗号化されずにetcdに書き込まれていることを意味します。

## すべてのデータを復号する {#decrypting-all-data}

この例では、Secret APIの保管時の暗号化を停止する方法を示します。他のAPIカインドを暗号化している場合は、必要に応じて手順を調整してください。

### 暗号化設定ファイルを見つける

まず、APIサーバーの設定ファイルを見つけます。各コントロールプレーンノードで、kube-apiserverの静的Podマニフェストにはコマンドライン引数`--encryption-provider-config`が指定されています。
このファイルは、[`hostPath`](/docs/concepts/storage/volumes/#hostpath)ボリュームマウントを使用して静的Podにマウントされていることが多いです。ボリュームを見つけたら、ノードのファイルシステム上でファイルを見つけて内容を確認できます。

### オブジェクトを復号するようにAPIサーバーを構成する

保管時の暗号化を無効にするには、暗号化構成ファイルの最初のエントリとして`identity`プロバイダーを配置します。

たとえば、既存のEncryptionConfigurationファイルが次のようになっている場合：
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
            # 暗号化にこの（無効な）サンプルキーを使用しないでください
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
これを次のように変更します：

YAML
---
apiVersion: apiserver.config.k8s.io/v1
kind: EncryptionConfiguration
resources:
  - resources:
      - secrets
    providers:
      - identity: {} # この行を追加します
      - aescbc:
          keys:
            - name: example
              secret: 2KfZgdiq2K0g2YrYpyDYs9mF2LPZhQ==
そして、このノードでkube-apiserver Podを再起動します。

他のコントロールプレーンホストを再構成する {#api-server-config-update-more-1}
クラスターに複数のAPIサーバーがある場合は、各APIサーバーに順番に変更をデプロイする必要があります。

各コントロールプレーンホストで同じ暗号化構成を使用していることを確認してください。

強制的に復号する
次に、以下のコマンドを実行して、すべてのSecretの復号を強制します。

Shell
# 別の種類のオブジェクトを復号している場合は、"secrets"を一致するように変更してください。
kubectl get secrets --all-namespaces -o json | kubectl replace -f -
既存のすべての暗号化されたリソースを、暗号化を使用しないバックエンドデータに置き換えたら、kube-apiserverから暗号化設定を削除できます。

削除するコマンドラインオプションは次のとおりです。

--encryption-provider-config

--encryption-provider-config-automatic-reload

新しい構成を適用するために、kube-apiserver Podを再度再起動します。

他のコントロールプレーンホストを再構成する {#api-server-config-update-more-2}
クラスターに複数のAPIサーバーがある場合は、各APIサーバーに順番に変更を再度デプロイする必要があります。

各コントロールプレーンホストで同じ暗号化構成を使用していることを確認してください。

{{% heading "whatsnext" %}}
EncryptionConfiguration 構成API (v1)についてさらに学ぶ。
