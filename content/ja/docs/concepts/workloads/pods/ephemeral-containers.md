---
title: エフェメラルコンテナ
content_type: concept
weight: 60
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

このページでは、特別な種類のコンテナであるエフェメラルコンテナの概要を説明します。エフェメラルコンテナは、トラブルシューティングなどのユーザーが開始するアクションを実行するために、すでに存在する{{< glossary_tooltip term_id="pod" >}}内で一時的に実行するコンテナです。エフェメラルコンテナは、アプリケーションの構築ではなく、serviceの調査のために利用します。

<!-- body -->

## エフェメラルコンテナを理解する

{{< glossary_tooltip text="Pod" term_id="pod" >}}は、Kubernetesのアプリケーションの基本的なビルディングブロックです。Podは破棄可能かつ置き換え可能であることが想定されているため、一度Podが作成されると新しいコンテナを追加することはできません。その代わりに、通常は{{< glossary_tooltip text="Deployment" term_id="deployment" >}}を使用してPodを削除して置き換えます。

たとえば、再現困難なバグのトラブルシューティングなどのために、すでに存在するPodの状態を調査する必要が出てくることがあります。このような場合、既存のPod内でエフェメラルコンテナを実行することで、Podの状態を調査したり、任意のコマンドを実行したりできます。

### エフェメラルコンテナとは何か？

エフェメラルコンテナは、他のコンテナと異なり、リソースや実行が保証されず、自動的に再起動されることも決してないため、アプリケーションを構築する目的には適しません。エフェメラルコンテナは、通常のコンテナと同じ`ContainerSpec`で記述されますが、多くのフィールドに互換性がなかったり、使用できなくなっています。

- エフェメラルコンテナはポートを持つことができないため、`ports`、`livenessProbe`、`readinessProbe`などは使えなくなっています。
- Podリソースの割り当てはイミュータブルであるため、`resources`の設定が禁止されています。
- 利用が許可されているフィールドの一覧については、[EphemeralContainerのリファレンスドキュメント](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)を参照してください。

エフェメラルコンテナは、直接`pod.spec`に追加するのではなく、API内の特別な`ephemeralcontainers`ハンドラを使用して作成します。そのため、エフェメラルコンテナを`kubectl edit`を使用して追加することはできません。

エフェメラルコンテナをPodに追加した後は、通常のコンテナのようにエフェメラルコンテナを変更または削除することはできません。  

{{< note >}}
エフェメラルコンテナは、[static Pod](/ja/docs/tasks/configure-pod-container/static-pod/)ではサポートされていません。  
{{< /note >}} 

## エフェメラルコンテナの用途

エフェメラルコンテナは、コンテナがクラッシュしてしまったり、コンテナイメージにデバッグ用ユーティリティが同梱されていない場合など、`kubectl exec`では不十分なときにインタラクティブなトラブルシューティングを行うために役立ちます。

特に、[distrolessイメージ](https://github.com/GoogleContainerTools/distroless)を利用すると、攻撃対象領域を減らし、バグや脆弱性を露出する可能性を減らせる最小のコンテナイメージをデプロイできるようになります。distrolessイメージにはシェルもデバッグ用のユーティリティも含まれないため、`kubectl exec`のみを使用してdistrolessイメージのトラブルシューティングを行うのは困難です。

エフェメラルコンテナを利用する場合には、他のコンテナ内のプロセスにアクセスできるように、[プロセス名前空間の共有](/ja/docs/tasks/configure-pod-container/share-process-namespace/)を有効にすると便利です。

## {{% heading "whatsnext" %}}

* [デバッグ用のエフェメラルコンテナを使用してデバッグする](/ja/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)方法について学ぶ。
