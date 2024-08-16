---
title: クラスターのアップグレード
content_type: task
weight: 350
---

<!-- 概要 -->
このページでは、Kubernetesクラスターをアップグレードする際に従うべき手順の概要を提供します。

クラスターのアップグレード方法は、初期のデプロイ方法やその後の変更によって異なります。

大まかな手順は以下の通りです:

- {{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}のアップグレード
- クラスター内にあるノードのアップグレード
- {{< glossary_tooltip text="kubectl" term_id="kubectl" >}}など、クライアントのアップグレード
- 新しいKubernetesバージョンに伴うAPI変更に基づいたマニフェストやその他のリソースの調整

## {{% heading "prerequisites" %}}

既存のクラスターが必要です。このページではKubernetes {{< skew currentVersionAddMinor -1 >}}からKubernetes {{< skew currentVersion >}}へのアップグレードについて説明しています。現在のクラスターがKubernetes {{< skew currentVersionAddMinor -1 >}}を実行していない場合は、アップグレードしようとしているKubernetesバージョンのドキュメントを確認してください。

## アップグレード方法

### kubeadm {#upgrade-kubeadm}

クラスターが`kubeadm`ツールを使用してデプロイされた場合の詳細なアップグレード方法は、[kubeadmクラスターのアップグレード](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を参照してください。

クラスターをアップグレードしたら、忘れずに[最新バージョンの`kubectl`をインストール](/docs/tasks/tools/)してください。

### 手動デプロイ

{{< caution >}}
これらの手順は、ネットワークおよびストレージプラグインなどのサードパーティ製拡張機能には対応していません。
{{< /caution >}}

次の順序でコントロールプレーンを手動で更新する必要があります:

- etcd(すべてのインスタンス)
- kube-apiserver(すべてのコントロールプレーンホスト)
- kube-controller-manager
- kube-scheduler
- クラウドコントローラーマネージャー(使用している場合)

この時点で、[最新バージョンの`kubectl`をインストール](/docs/tasks/tools/)してください。

クラスター内の各ノードに対して、そのノードを[ドレイン](/docs/tasks/administer-cluster/safely-drain-node/)し、{{< skew currentVersion >}} kubeletを使用する新しいノードと置き換えるか、そのノードのkubeletをアップグレードして再稼働させます。

{{< caution >}}
kubeletをアップグレードする前にノードをドレインすることで、Podが再収容され、コンテナが再作成されるため、一部のセキュリティ問題や重要なバグの解決が必要な場合があります。
{{</ caution >}}

### その他のデプロイ {#upgrade-other}

クラスターデプロイメントツールのドキュメントを参照して、メンテナンスの推奨手順を確認してください。

## アップグレード後のタスク

### クラスターのストレージAPIバージョンを切り替える

クラスターの内部表現でアクティブなKubernetesリソースのためにetcdにシリアル化されるオブジェクトは、特定のAPIバージョンを使用して書き込まれます。

サポートされるAPIが変更されると、これらのオブジェクトは新しいAPIで再書き込みする必要があります。これを行わないと、最終的にはKubernetes APIサーバーによってデコードまたは使用できなくなるリソースが発生する可能性があります。

影響を受ける各オブジェクトについて、最新のサポートされるAPIを使用して取得し、最新のサポートされるAPIを使用して再書き込みします。

### マニフェストの更新

新しいKubernetesバージョンへのアップグレードにより、新しいAPIが提供されることがあります。

異なるAPIバージョン間でマニフェストを変換するために`kubectl convert`コマンドを使用できます。例えば:

```shell
kubectl convert -f pod.yaml --output-version v1
```

`kubectl`ツールは`pod.yaml`の内容を、`kind`がPod(変更なし)で、`apiVersion`が改訂されたマニフェストに置き換えます。

### デバイスプラグイン

クラスターがデバイスプラグインを実行しており、ノードを新しいデバイスプラグインAPIバージョンを含むKubernetesリリースにアップグレードする必要がある場合、デバイスプラグインをアップグレードして両方のバージョンをサポートする必要があります。これにより、アップグレード中にデバイスの割り当てが正常に完了し続けることが保証されます。

詳細については、[API互換性](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/#api-compatibility)および[kubeletのデバイスマネージャーAPIバージョン](/docs/reference/node/device-plugin-api-versions/)を参照してください。
