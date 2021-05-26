---
title: ネットワークポリシー
content_type: concept
weight: 50
---

<!-- overview -->

ネットワークポリシーは、{{< glossary_tooltip text="Pod" term_id="pod">}}のグループが、Pod相互や他のネットワークエンドポイントと通信する場合に許可を与える方法を指定するための仕様です。

NetworkPolicyリソースは、{{< glossary_tooltip text="ラベル" term_id="label">}}を使用してPodを選択し、選択したPodに対してどんなトラフィックを許可するかを指定するルールを定義します。

<!-- body -->
## 前提条件

ネットワークポリシーは、[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)により実装されます。ネットワークポリシーを使用するには、NetworkPolicyをサポートするネットワークソリューションを使用しなければなりません。ネットワークポリシーを実装したコントローラーを使用せずにNetworkPolicyリソースを作成した場合は、何も効果はありません。

## 分離されたPodと分離されていないPod

デフォルトでは、Podは分離されていない状態(non-isolated)となるため、すべてのソースからのトラフィックを受信します。

Podを選択するNetworkPolicyが存在すると、Podは分離されるようになります。名前空間内に特定のPodを選択するNetworkPolicyが1つでも存在すると、そのPodはいずれかのNetworkPolicyで許可されていないすべての接続を拒否するようになります。(同じ名前空間内のPodでも、どのNetworkPolicyにも選択されなかった他のPodは、引き続きすべてのトラフィックを許可します。)

ネットワークポリシーは追加式であるため、競合することはありません。複数のポリシーがPodを選択する場合、そのPodに許可されるトラフィックは、それらのポリシーのingress/egressルールの和集合で制限されます。したがって、評価の順序はポリシーの結果には影響がありません。

## NetworkPolicyリソース {#networkpolicy-resource}

リソースの完全な定義については、リファレンスの[NetworkPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#networkpolicy-v1-networking-k8s-io)のセクションを参照してください。

以下は、NetworkPolicyの一例です。

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: test-network-policy
  namespace: default
spec:
  podSelector:
    matchLabels:
      role: db
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - ipBlock:
        cidr: 172.17.0.0/16
        except:
        - 172.17.1.0/24
    - namespaceSelector:
        matchLabels:
          project: myproject
    - podSelector:
        matchLabels:
          role: frontend
    ports:
    - protocol: TCP
      port: 6379
  egress:
  - to:
    - ipBlock:
        cidr: 10.0.0.0/24
    ports:
    - protocol: TCP
      port: 5978
```

{{< note >}}
選択したネットワークソリューションがネットワークポリシーをサポートしていない場合には、これをクラスターのAPIサーバーにPOSTしても効果はありません。
{{< /note >}}

__必須フィールド__: 他のKubernetesの設定と同様に、NetworkPolicyにも`apiVersion`、`kind`、`metadata`フィールドが必須です。設定ファイルの扱い方に関する一般的な情報については、[ConfigMapを使用してコンテナを構成する](/ja/docs/tasks/configure-pod-container/configure-pod-configmap/)と[オブジェクト管理](/ja/docs/concepts/overview/working-with-objects/object-management)を参照してください。

__spec__: NetworkPolicyの[spec](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api-conventions.md#spec-and-status)を見ると、指定した名前空間内で特定のネットワークポリシーを定義するのに必要なすべての情報が確認できます。

__podSelector__: 各NetworkPolicyには、ポリシーを適用するPodのグループを選択する`podSelector`が含まれます。ポリシーの例では、ラベル"role=db"を持つPodを選択しています。`podSelector`を空にすると、名前空間内のすべてのPodが選択されます。

__policyTypes__: 各NetworkPolicyには、`policyTypes`として、`Ingress`、`Egress`、またはその両方からなるリストが含まれます。`policyTypes`フィールドでは、指定したポリシーがどの種類のトラフィックに適用されるかを定めます。トラフィックの種類としては、選択したPodへの内向きのトラフィック(Ingress)、選択したPodからの外向きのトラフィック(Egress)、またはその両方を指定します。`policyTypes`を指定しなかった場合、デフォルトで常に
`Ingress`が指定され、NetworkPolicyにegressルールが1つでもあれば`Egress`も設定されます。

__ingress__: 各NetworkPolicyには、許可する`ingress`ルールのリストを指定できます。各ルールは、`from`および`ports`セクションの両方に一致するトラフィックを許可します。ポリシーの例には1つのルールが含まれ、このルールは、3つのソースのいずれかから送信された1つのポート上のトラフィックに一致します。1つ目のソースは`ipBlock`で、2つ目のソースは`namespaceSelector`で、3つ目のソースは`podSelector`でそれぞれ定められます。

__egress__: 各NetworkPolicyには、許可する`egress`ルールのリストを指定できます。各ルールは、`to`および`ports`セクションの両方に一致するトラフィックを許可します。ポリシーの例には1つのルールが含まれ、このルールは、1つのポート上で`10.0.0.0/24`の範囲内の任意の送信先へ送られるトラフィックに一致します。

したがって、上のNetworkPolicyの例では、次のようにネットワークポリシーを適用します。

1. "default"名前空間内にある"role=db"のPodを、内向きと外向きのトラフィックに対して分離する(まだ分離されていない場合)
2. (Ingressルール) "default"名前空間内の"role=db"ラベルが付いたすべてのPodのTCPの6379番ポートへの接続のうち、次の送信元からのものを許可する
   * "default"名前空間内のラベル"role=frontend"が付いたすべてのPod
   * ラベル"project=myproject"が付いた名前空間内のすべてのPod
   * 172.17.0.0–172.17.0.255および172.17.2.0–172.17.255.255(言い換えれば、172.17.1.0/24の範囲を除く172.17.0.0/16)の範囲内のすべてのIPアドレス
3. (Egressルール) "role=db"というラベルが付いた"default"名前空間内のすべてのPodからの、TCPの5978番ポート上でのCIDR 10.0.0.0/24への接続を許可する

追加の例については、[ネットワークポリシーを宣言する](/ja/docs/tasks/administer-cluster/declare-network-policy/)の説明を参照してください。

## `to`と`from`のセレクターの振る舞い

`ingress`の`from`セクションまたは`egress`の`to`セクションに指定できるセレクターは4種類あります。

__podSelector__: NetworkPolicyと同じ名前空間内の特定のPodを選択して、ingressの送信元またはegressの送信先を許可します。

__namespaceSelector__: 特定の名前空間を選択して、その名前空間内のすべてのPodについて、ingressの送信元またはegressの送信先を許可します。

__namespaceSelector__ *および* __podSelector__: 1つの`to`または`from`エントリーで`namespaceSelector`と`podSelector`の両方を指定して、特定の名前空間内の特定のPodを選択します。正しいYAMLの構文を使うように気をつけてください。このポリシーの例を以下に示します。

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
      podSelector:
        matchLabels:
          role: client
  ...
```

このポリシーには、1つの`from`要素があり、ラベル`user=alice`の付いた名前空間内にある、ラベル`role=client`の付いたPodからの接続を許可します。しかし、*以下の*ポリシーには注意が必要です。

```yaml
  ...
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          user: alice
    - podSelector:
        matchLabels:
          role: client
  ...
```

このポリシーには、`from`配列の中に2つの要素があります。そのため、ラベル`role=client`の付いた名前空間内にあるすべてのPodからの接続、*または*、任意の名前空間内にあるラベル`user=alice`の付いたすべてのPodからの接続を許可します。

正しいルールになっているか自信がないときは、`kubectl describe`を使用すると、Kubernetesがどのようにポリシーを解釈したのかを確認できます。

__ipBlock__: 特定のIPのCIDRの範囲を選択して、ingressの送信元またはegressの送信先を許可します。PodのIPは一時的なもので予測できないため、ここにはクラスター外のIPを指定するべきです。

クラスターのingressとegressの仕組みはパケットの送信元IPや送信先IPの書き換えを必要とすることがよくあります。その場合、NetworkPolicyの処理がIPの書き換えの前後どちらで行われるのかは定義されていません。そのため、ネットワークプラグイン、クラウドプロバイダー、`Service`の実装などの組み合わせによっては、動作が異なる可能性があります。

内向きのトラフィックの場合は、実際のオリジナルの送信元IPに基づいてパケットをフィルタリングできる可能性もあれば、NetworkPolicyが対象とする「送信元IP」が`LoadBalancer`やPodのノードなどのIPになってしまっている可能性もあることになります。

外向きのトラフィックの場合は、クラスター外のIPに書き換えられたPodから`Service`のIPへの接続は、`ipBlock`ベースのポリシーの対象になる場合とならない場合があることになります。

## デフォルトのポリシー

デフォルトでは、名前空間にポリシーが存在しない場合、その名前空間内のPodの内向きと外向きのトラフィックはすべて許可されます。以下の例を利用すると、その名前空間内でのデフォルトの振る舞いを変更できます。

### デフォルトですべての内向きのトラフィックを拒否する

すべてのPodを選択して、そのPodへのすべての内向きのトラフィックを許可しないNetworkPolicyを作成すると、その名前空間に対する「デフォルト」の分離ポリシーを作成できます。

{{< codenew file="service/networking/network-policy-default-deny-ingress.yaml" >}}

このポリシーを利用すれば、他のいかなるNetworkPolicyにも選択されなかったPodでも分離されることを保証できます。このポリシーは、デフォルトの外向きの分離の振る舞いを変更しません。

### デフォルトで内向きのすべてのトラフィックを許可する

(たとえPodを「分離されたもの」として扱うポリシーが追加された場合でも)名前空間内のすべてのPodへのすべてのトラフィックを許可したい場合には、その名前空間内のすべてのトラフィックを明示的に許可するポリシーを作成できます。

{{< codenew file="service/networking/network-policy-allow-all-ingress.yaml" >}}

### デフォルトで外向きのすべてのトラフィックを拒否する

すべてのPodを選択して、そのPodからのすべての外向きのトラフィックを許可しないNetworkPolicyを作成すると、その名前空間に対する「デフォルト」の外向きの分離ポリシーを作成できます。

{{< codenew file="service/networking/network-policy-default-deny-egress.yaml" >}}

このポリシーを利用すれば、他のいかなるNetworkPolicyにも選択されなかったPodでも、外向きのトラフィックが許可されないことを保証できます。このポリシーは、デフォルトの内向きの分離の振る舞いを変更しません。

### デフォルトで外向きのすべてのトラフィックを許可する

(たとえPodを「分離されたもの」として扱うポリシーが追加された場合でも)名前空間内のすべてのPodからのすべてのトラフィックを許可したい場合には、その名前空間内のすべての外向きのトラフィックを明示的に許可するポリシーを作成できます。

{{< codenew file="service/networking/network-policy-allow-all-egress.yaml" >}}

### デフォルトで内向きと外向きのすべてのトラフィックを拒否する

名前空間内に以下のNetworkPolicyを作成すると、その名前空間で内向きと外向きのすべてのトラフィックを拒否する「デフォルト」のポリシーを作成できます。

{{< codenew file="service/networking/network-policy-default-deny-all.yaml" >}}

このポリシーを利用すれば、他のいかなるNetworkPolicyにも選択されなかったPodでも、内向きと外向きのトラフィックが許可されないことを保証できます。

## SCTPのサポート

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

この機能を利用するには、クラスター管理者がAPIサーバーで`--feature-gates=SCTPSupport=true,…`と指定して、`SCTPSupport`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にする必要があります。フィーチャーゲートが有効になれば、NetworkPolicyの`protocol`フィールドに`SCTP`が指定できるようになります。

{{< note >}}
SCTPプロトコルのネットワークポリシーをサポートする{{< glossary_tooltip text="CNI" term_id="cni" >}}プラグインを使用している必要があります。
{{< /note >}}

## {{% heading "whatsnext" %}}

- [ネットワークポリシーを宣言する](/ja/docs/tasks/administer-cluster/declare-network-policy/)で追加の例の説明を読む。
- NetworkPolicyリソースで実現できるよくあるシナリオのためのさまざまな[レシピ](https://github.com/ahmetb/kubernetes-network-policy-recipes)を確認する。
