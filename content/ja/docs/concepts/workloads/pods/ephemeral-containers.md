---
title: エフェメラルコンテナ
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="alpha" for_k8s_version="v1.16" >}}

このページでは、特別な種類のコンテナであるエフェメラルコンテナの概要を説明します。エフェメラルコンテナは、トラブルシューティングなどのユーザーが開始するアクションを実行するために、すでに存在する{{< glossary_tooltip term_id="pod" >}}内で一時的に実行するコンテナです。エフェメラルコンテナは、アプリケーションの構築ではなく、serviceの調査のために利用します。

{{< warning >}}
エフェメラルコンテナは初期のアルファ状態であり、本番クラスタには適しません。[Kubernetesの非推奨ポリシー](/docs/reference/using-api/deprecation-policy/)に従って、このアルファ機能は、将来大きく変更されたり、完全に削除される可能性があります。
{{< /warning >}}

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

## エフェメラルコンテナの用途

エフェメラルコンテナは、コンテナがクラッシュしてしまったり、コンテナイメージにデバッグ用ユーティリティが同梱されていない場合など、`kubectl exec`では不十分なときにインタラクティブなトラブルシューティングを行うために役立ちます。

特に、[distrolessイメージ](https://github.com/GoogleContainerTools/distroless)を利用すると、攻撃対象領域を減らし、バグや脆弱性を露出する可能性を減らせる最小のコンテナイメージをデプロイできるようになります。distrolessイメージにはシェルもデバッグ用のユーティリティも含まれないため、`kubectl exec`のみを使用してdistrolessイメージのトラブルシューティングを行うのは困難です。

エフェメラルコンテナを利用する場合には、他のコンテナ内のプロセスにアクセスできるように、[プロセス名前空間の共有](/ja/docs/tasks/configure-pod-container/share-process-namespace/)を有効にすると便利です。

エフェメラルコンテナを利用してトラブルシューティングを行う例については、[デバッグ用のエフェメラルコンテナを使用してデバッグする](/docs/tasks/debug-application-cluster/debug-running-pod/#ephemeral-container)を参照してください。

## Ephemeral containers API

{{< note >}}
このセクションの例を実行するには、`EphemeralContainers`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にして、Kubernetesクライアントとサーバーのバージョンをv1.16以上にする必要があります。
{{< /note >}}

このセクションの例では、API内でエフェメラルコンテナを表示する方法を示します。通常は、APIを直接呼び出すのではなく、`kubectl alpha debug`やその他の`kubectl`[プラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)を使用して、これらのステップを自動化します。

エフェメラルコンテナは、Podの`ephemeralcontainers`サブリソースを使用して作成されます。このサブリソースは、`kubectl --raw`を使用して確認できます。まずはじめに、以下に`EphemeralContainers`リストとして追加するためのエフェメラルコンテナを示します。

```json
{
    "apiVersion": "v1",
    "kind": "EphemeralContainers",
    "metadata": {
        "name": "example-pod"
    },
    "ephemeralContainers": [{
        "command": [
            "sh"
        ],
        "image": "busybox",
        "imagePullPolicy": "IfNotPresent",
        "name": "debugger",
        "stdin": true,
        "tty": true,
        "terminationMessagePolicy": "File"
    }]
}
```

すでに実行中の`example-pod`のエフェメラルコンテナを更新するには、次のコマンドを実行します。

```shell
kubectl replace --raw /api/v1/namespaces/default/pods/example-pod/ephemeralcontainers -f ec.json
```

このコマンドを実行すると、新しいエフェメラルコンテナのリストが返されます。

```json
{
   "kind":"EphemeralContainers",
   "apiVersion":"v1",
   "metadata":{
      "name":"example-pod",
      "namespace":"default",
      "selfLink":"/api/v1/namespaces/default/pods/example-pod/ephemeralcontainers",
      "uid":"a14a6d9b-62f2-4119-9d8e-e2ed6bc3a47c",
      "resourceVersion":"15886",
      "creationTimestamp":"2019-08-29T06:41:42Z"
   },
   "ephemeralContainers":[
      {
         "name":"debugger",
         "image":"busybox",
         "command":[
            "sh"
         ],
         "resources":{

         },
         "terminationMessagePolicy":"File",
         "imagePullPolicy":"IfNotPresent",
         "stdin":true,
         "tty":true
      }
   ]
}
```

新しく作成されたエフェメラルコンテナの状態を確認するには、`kubectl describe`を使用します。

```shell
kubectl describe pod example-pod
```

```
...
Ephemeral Containers:
  debugger:
    Container ID:  docker://cf81908f149e7e9213d3c3644eda55c72efaff67652a2685c1146f0ce151e80f
    Image:         busybox
    Image ID:      docker-pullable://busybox@sha256:9f1003c480699be56815db0f8146ad2e22efea85129b5b5983d0e0fb52d9ab70
    Port:          <none>
    Host Port:     <none>
    Command:
      sh
    State:          Running
      Started:      Thu, 29 Aug 2019 06:42:21 +0000
    Ready:          False
    Restart Count:  0
    Environment:    <none>
    Mounts:         <none>
...
```

新しいエフェメラルコンテナとやりとりをするには、他のコンテナと同じように、`kubectl attach`、`kubectl exec`、`kubectl logs`などのコマンドが利用できます。例えば、次のようなコマンドが実行できます。

```shell
kubectl attach -it example-pod -c debugger
```
