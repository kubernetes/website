---
title: サービス内部トラフィックポリシー
content_type: concept
weight: 120
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="alpha" >}}

*サービス内部トラフィックポリシー*を使用すると、内部トラフィック制限により、トラフィックが発信されたノード内のエンドポイントにのみ内部トラフィックをルーティングできます。
ここでの「内部」トラフィックとは、現在のクラスターのPodから発信されたトラフィックを指します。これは、コストを削減し、パフォーマンスを向上させるのに役立ちます。

<!-- body -->

## ServiceInternalTrafficPolicyの使用

`ServiceInternalTrafficPolicy` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にすると、`.spec.internalTrafficPolicy`を`Local`に設定して、{{< glossary_tooltip text="Service" term_id="service" >}}内部のみのトラフィックポリシーを有効にすることができます。
これにより、kube-proxyは、クラスター内部トラフィックにノードローカルエンドポイントのみを使用するようになります。

{{< note >}}
特定のServiceのエンドポイントがないノード上のPodの場合、Serviceに他のノードのエンドポイントがある場合でも、Serviceは(このノード上のポッドの)エンドポイントがゼロであるかのように動作します。
{{< /note >}}

次の例は、`.spec.internalTrafficPolicy`を`Local`に設定した場合のServiceの様子を示しています：

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
spec:
  selector:
    app: MyApp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
  internalTrafficPolicy: Local
```

## 使い方

kube-proxyは、`spec.internalTrafficPolicy`の設定に基づいて、ルーティング先のエンドポイントをフィルタリングします。
`spec.internalTrafficPolicy`が`Local`であれば、ノードのローカルエンドポイントにのみルーティングできるようにします。`Cluster`または未設定であればすべてのエンドポイントにルーティングできるようにします。
`ServiceInternalTrafficPolicy`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)が有効な場合、`spec.internalTrafficPolicy`のデフォルトは`Cluster`です。

## 制約

* Serviceで`externalTrafficPolicy`が`Local`に設定されている場合、サービス内部トラフィックポリシーは使用されません。同じServiceだけではなく、同じクラスター内の異なるServiceで両方の機能を使用することができます。

## {{% heading "whatsnext" %}}

* [Topology Aware Hints](/docs/concepts/services-networking/topology-aware-hints)を読む
* [Service External Traffic Policy](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip)を読む
* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を読む
