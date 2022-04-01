---
title: トポロジーを意識したヒント
content_type: concept
weight: 45
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

*Topology Aware Hint*は、クライアントがendpointをどのように使用するかについての提案を含めることにより、トポロジーを考慮したルーティングを可能にします。このアプローチでは、EndpointSliceおよび/またはEndpointオブジェクトの消費者が、これらのネットワークエンドポイントへのトラフィックを、それが発生した場所の近くにルーティングできるように、メタデータを追加します。

たとえば、局所的にトラフィックをルーティングすることで、コストを削減したり、ネットワークパフォーマンスを向上させたりできます。

<!-- body -->

## 動機

Kubernetesクラスターは、マルチゾーン環境で展開されることが多くなっています。
*Topology Aware Hint*は、トラフィックを発信元のゾーン内に留めておくのに役立つメカニズムを提供します。このコンセプトは、一般に「Topology Aware Routing」と呼ばれています。EndpointSliceコントローラーは{{< glossary_tooltip term_id="Service" >}}のendpointを計算する際に、各endpointのトポロジー(リージョンとゾーン)を考慮し、ゾーンに割り当てるためのヒントフィールドに値を入力します。
EndpointSliceコントローラーは、各endpointのトポロジー(地域とゾーン)を考慮し、ゾーンに割り当てるためのヒントフィールドに入力します。
{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}のようなクラスターコンポーネントは、次にこれらのヒントを消費し、それらを使用してトラフィックがルーティングされる方法に影響を与えることが可能です(トポロジー的に近いendpointを優先します)。


## Topology Aware Hintを使う

`service.kubernetes.io/topology-aware-hints`アノテーションを`auto`に設定すると、サービスに対してTopology Aware Hintを有効にすることができます。これはEndpointSliceコントローラーが安全と判断した場合に、トポロジーヒントを設定するように指示します。
重要なのは、これはヒントが常に設定されることを保証するものではないことです。

## 使い方 {#implementation}

この機能を有効にする機能は、EndpointSliceコントローラーとkube-proxyの2つのコンポーネントに分かれています。このセクションでは、各コンポーネントがこの機能をどのように実装しているか、高レベルの概要を説明します。

### EndpointSliceコントローラー {#implementation-control-plane}

この機能が有効な場合、EndpointSliceコントローラーはEndpointSliceにヒントを設定する役割を担います。
コントローラーは、各ゾーンに比例した量のendpointを割り当てます。
この割合は、そのゾーンで実行されているノードの[割り当て可能な](/ja/docs/task/administer-cluster/reserve-compute-resources/#node-allocatable)CPUコアを基に決定されます。

たとえば、あるゾーンに2つのCPUコアがあり、別のゾーンに1つのCPUコアしかない場合、コントローラーは2つのCPUコアを持つゾーンに2倍のendpointを割り当てます。

次の例は、ヒントが入力されたときのEndpointSliceの様子を示しています。

```yaml
apiVersion: discovery.k8s.io/v1
kind: EndpointSlice
metadata:
  name: example-hints
  labels:
    kubernetes.io/service-name: example-svc
addressType: IPv4
ports:
  - name: http
    protocol: TCP
    port: 80
endpoints:
  - addresses:
      - "10.1.2.3"
    conditions:
      ready: true
    hostname: pod-1
    zone: zone-a
    hints:
      forZones:
        - name: "zone-a"
```

### kube-proxy {#implementation-kube-proxy}

kube-proxyは、EndpointSliceコントローラーによって設定されたヒントに基づいて、ルーティング先のendpointをフィルター処理します。ほとんどの場合、これはkube-proxyが同じゾーン内のendpointにトラフィックをルーティングできることを意味します。コントローラーが別のゾーンからendpointを割り当てて、ゾーン間でendpointがより均等に分散されるようにする場合があります。これにより、一部のトラフィックが他のゾーンにルーティングされます。

## セーフガード

各ノードのKubernetesコントロールプレーンとkube-proxyは、Topology Aware Hintを使用する前に、いくつかのセーフガードルールを適用します。これらがチェックアウトされない場合、kube-proxyは、ゾーンに関係なく、クラスター内のどこからでもendpointを選択します。

1. **endpointの数が不十分です:** クラスター内のゾーンよりもendpointが少ない場合、コントローラーはヒントを割り当てません。

2. **バランスの取れた割り当てを実現できません:** 場合によっては、ゾーン間でendpointのバランスの取れた割り当てを実現できないことがあります。たとえば、ゾーンaがゾーンbの2倍の大きさであるが、endpointが2つしかない場合、ゾーンaに割り当てられたendpointはゾーンbの2倍のトラフィックを受信する可能性があります。この「予想される過負荷」値が各ゾーンの許容しきい値を下回ることができない場合、コントローラーはヒントを割り当てません。重要なことに、これはリアルタイムのフィードバックに基づいていません。それでも、個々のendpointが過負荷になる可能性があります。

3. **1つ以上のノードの情報が不十分です:** ノードに`topology.kubernetes.io/zone`ラベルがないか、割り当て可能なCPUの値を報告していない場合、コントロールプレーンはtopology-aware endpoint hintsを設定しないため、kube-proxyはendpointをゾーンでフィルタリングしません。

4. **1つ以上のendpointにゾーンヒントが存在しません:** これが発生すると、kube-proxyはTopology Aware Hintから、またはTopology Aware Hintへの移行が進行中であると見なします。この状態のサービスに対してendpointをフィルタリングすることは危険であるため、kube-proxyはすべてのendpointを使用するようにフォールバックします。

5. **ゾーンはヒントで表されません:** kube-proxyが、実行中のゾーンをターゲットとするヒントを持つendpointを1つも見つけることができない場合、すべてのゾーンのendpointを使用することになります。これは既存のクラスターに新しいゾーンを追加するときに発生する可能性が最も高くなります。

## 制約事項

* Serviceで`externalTrafficPolicy`または`internalTrafficPolicy`が`Local`に設定されている場合、Topology Aware Hintは使用されません。同じServiceではなく、異なるServiceの同じクラスターで両方の機能を使用することができます。

* このアプローチは、ゾーンのサブセットから発信されるトラフィックの割合が高いサービスではうまく機能しません。代わりに、これは着信トラフィックが各ゾーンのノードの容量にほぼ比例することを前提としています。

* EndpointSliceコントローラーは、各ゾーンの比率を計算するときに、準備ができていないノードを無視します。ノードの大部分の準備ができていない場合、これは意図しない結果をもたらす可能性があります。

* EndpointSliceコントローラーは、各ゾーンの比率を計算するデプロイ時に{{< glossary_tooltip text="toleration" term_id="toleration" >}}を考慮しません。サービスをバックアップするPodがクラスター内のノードのサブセットに制限されている場合、これは考慮されません。

* これはオートスケーリングと相性が悪いかもしれません。例えば、多くのトラフィックが1つのゾーンから発信されている場合、そのゾーンに割り当てられたendpointのみがそのトラフィックを処理することになります。その結果、{{< glossary_tooltip text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}がこのイベントを拾えなくなったり、新しく追加されたPodが別のゾーンで開始されたりする可能性があります。

## {{% heading "whatsnext" %}}

* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を読む。
