---
title: トポロジーを意識したルーティング
content_type: concept
weight: 100
description: >-
  *Topology Aware Routing*は、ネットワークトラフィックを発信元のゾーン内に留めておくのに役立つメカニズムを提供します。クラスター内のPod間で同じゾーンのトラフィックを優先することで、信頼性、パフォーマンス(ネットワークの待ち時間やスループット)の向上、またはコストの削減に役立ちます。
---


<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="beta" >}}

{{< note >}}
Kubernetes 1.27より前には、この機能は、*Topology Aware Hint*として知られていました。
{{</ note >}}

*Topology Aware Routing*は、トラフィックを発信元のゾーンに維持するようにルーティング動作を調整します。場合によっては、コストを削減したり、ネットワークパフォーマンスを向上させたりすることができます。

<!-- body -->

## 動機

Kubernetesクラスターは、マルチゾーン環境で展開されることが多くなっています。
*Topology Aware Routing*は、トラフィックを発信元のゾーン内に留めておくのに役立つメカニズムを提供します。EndpointSliceコントローラーは{{< glossary_tooltip term_id="Service" >}}のendpointを計算する際に、各endpointのトポロジー(リージョンとゾーン)を考慮し、ゾーンに割り当てるためのヒントフィールドに値を入力します。{{< glossary_tooltip term_id="kube-proxy" text="kube-proxy" >}}のようなクラスターコンポーネントは、次にこれらのヒントを消費し、それらを使用してトラフィックがルーティングされる方法に影響を与えることが可能です(トポロジー的に近いendpointを優先します)。

## Topology Aware Routingを有効にする

{{< note >}}
Kubernetes 1.27より前には、この動作は`service.kubernetes.io/topology-aware-hints`アノテーションを使用して制御されていました。
{{</ note >}}

`service.kubernetes.io/topology-mode`アノテーションを`auto`に設定すると、サービスに対してTopology Aware Routingを有効にすることができます。各ゾーンに十分なendpointがある場合、個々のendpointを特定のゾーンに割り当てるために、トポロジーヒントがEndpointSliceに入力され、その結果、トラフィックは発信元の近くにルーティングされます。

## 最も効果的なとき

この機能は、次の場合に最も効果的に動作します。

### 1. 受信トラフィックが均等に分散されている

トラフィックの大部分が単一のゾーンから発信されている場合、トラフィックはそのゾーンに割り当てられたendpointのサブセットに過負荷を与える可能性があります。受信トラフィックが単一のゾーンから発信されることが予想される場合、この機能は推奨されません。

### 2. 1つのゾーンに3つ以上のendpointを持つサービス {#three-or-more-endpoints-per-zone}

3つのゾーンからなるクラスターでは、これは9つ以上のendpointがあることを意味します。ゾーン毎のendpointが3つ未満の場合、EndpointSliceコントローラーはendpointを均等に割り当てることができず、代わりにデフォルトのクラスター全体のルーティングアプローチに戻る可能性が高く(約50%)なります。

## 使い方 {#how-it-works}

「Auto」ヒューリスティックは、各ゾーンに多数のendpointを比例的に割り当てようとします。このヒューリスティックは、非常に多くのendpointを持つサービスに最適です。

### EndpointSliceコントローラー {#implementation-control-plane}

このヒューリスティックが有効な場合、EndpointSliceコントローラーはEndpointSliceにヒントを設定する役割を担います。コントローラーは、各ゾーンに比例した量のendpointを割り当てます。この割合は、そのゾーンで実行されているノードの[割り当て可能な](/ja/docs/task/administer-cluster/reserve-compute-resources/#node-allocatable)CPUコアを基に決定されます。

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

* EndpointSliceコントローラーは、`node-role.kubernetes.io/control-plane`または`node-role.kubernetes.io/master`ラベルが設定されたノードを無視します。それらのノードでワークロードが実行されている場合、これは問題になる可能性があります。

* EndpointSliceコントローラーは、各ゾーンの比率を計算するデプロイ時に{{< glossary_tooltip text="toleration" term_id="toleration" >}}を考慮しません。サービスをバックアップするPodがクラスター内のノードのサブセットに制限されている場合、これは考慮されません。

* これはオートスケーリングと相性が悪いかもしれません。例えば、多くのトラフィックが1つのゾーンから発信されている場合、そのゾーンに割り当てられたendpointのみがそのトラフィックを処理することになります。その結果、{{< glossary_tooltip text="Horizontal Pod Autoscaler" term_id="horizontal-pod-autoscaler" >}}がこのイベントを拾えなくなったり、新しく追加されたPodが別のゾーンで開始されたりする可能性があります。

## カスタムヒューリスティック {#custom-heuristics}

Kubernetesは様々な方法でデブロイされ、endpointをゾーンに割り当てるための単独のヒューリスティックは、すべてのユースケースに通用するわけではありません。
この機能の主な目的は、内蔵のヒューリスティックがユースケースに合わない場合に、カスタムヒューリスティックを開発できるようにすることです。カスタムヒューリスティックを有効にするための最初のステップは、1.27リリースに含まれています。これは限定的な実装であり、関連する妥当と思われる状況をまだカバーしていない可能性があります。

## {{% heading "whatsnext" %}}

* [サービスとアプリケーションの接続](/ja/docs/concepts/services-networking/connect-applications-service/)を読む。
