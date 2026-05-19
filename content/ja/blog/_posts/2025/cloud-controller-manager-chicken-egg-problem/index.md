---
layout: blog
title: "クラウドコントローラーマネージャーに関する「鶏が先か卵が先か」問題"
date: 2025-02-14
slug: cloud-controller-manager-chicken-egg-problem
author: >
  Antonio Ojea,
  Michael McCune
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

Kubernetes 1.31において、[Kubernetes史上最大の移行作業を完了][migration-blog]し、in-treeのクラウドプロバイダーが削除されました。
コンポーネントの移行自体は完了したものの、ユーザーやインストーラープロジェクト(例えば、kOpsやCluster API)にとっては、いくつかの追加的な複雑さが残ることになりました。
これらの追加手順や障害ポイントについて説明し、クラスター管理者向けに推奨事項を示します。
この移行作業は非常に複雑で、いくつかのロジックはコアコンポーネントから分離する必要があり、4つの新しいサブシステムが構築されました。

1. **クラウドコントローラーマネージャー**([KEP-2392][kep2392])
2. **APIサーバーネットワークプロキシ**([KEP-1281][kep1281])
3. **kubeletクレデンシャルプロバイダープラグイン**([KEP-2133][kep2133])
4. **[CSI][csi]を使用するストレージの移行**([KEP-625][kep625])

[クラウドコントローラーマネージャーはコントロールプレーンの一部です][ccm]。
kube-controller-managerやkubeletに従来存在していた機能の一部を置き換える重要なコンポーネントです。

{{< figure
    src="/images/docs/components-of-kubernetes.svg"
    alt="Kubernetesのコンポーネント"
    caption="Kubernetesのコンポーネント"
>}}

クラウドコントローラーマネージャーの中でも最も重要な機能のひとつがノードコントローラーで、ノードの初期化を担当しています。

以下の図に示すように、**kubelet**が起動すると、NodeオブジェクトをAPIサーバーに登録し、そのノードにTaintを付与することで、最初にcloud-controller-managerによって処理されるようにします。
初期状態のNodeには、ノードアドレスや、ノード、リージョン、インスタンスタイプなどのクラウドプロバイダー固有の情報を含むラベルといった、クラウドプロバイダー固有の情報が欠けています。

{{< figure
    src="ccm-chicken-egg-problem-sequence-diagram.svg"
    alt="「鶏が先か卵が先か」問題のシーケンス図"
    caption="「鶏が先か卵が先か」問題のシーケンス図"
    class="diagram-medium"
>}}

この新しい初期化プロセスにより、ノードが準備完了となるまでに若干の遅延が発生します。
従来は、kubeletがノードを作成する際、同時にノードの初期化を行うことも可能でした。
しかし、その処理がcloud-controller-managerに移行されたことで、クラスターのブートストラップ時に[「鶏が先か卵が先か」問題][chicken-and-egg]が発生する可能性があります。
これは、cloud-controller-managerを他のコントロールプレーンコンポーネントと同様にデプロイしていないKubernetesアーキテクチャ(たとえば、static Pod、スタンドアロンバイナリ、またはTaintを許容し`hostNetwork`を使用するDaemonSetやDeploymentなど)において特に問題となります(この点については後述します)。

## 依存関係の問題の具体例

前述のとおり、ブートストラップ時にcloud-controller-managerがスケジューリング不可となり、クラスターが正常に初期化されない可能性があります。
以下に、この問題がどのように表面化するか、またその原因となり得る根本的な要因の具体例を示します。

これらの例では、cloud-controller-managerをKubernetesリソース(たとえば、DeploymentやDaemonSetなど)として実行し、そのライフサイクルを管理していることを前提としています。
これらの方法では、cloud-controller-managerのスケジューリングがKubernetesに依存するため、確実にスケジューリングされるように注意が必要です。

### 例: 未初期化のTaintによりクラウドコントローラーマネージャーがスケジューリングされない

[Kubernetesのドキュメントに記載][kubedocs0]されているとおり、`--cloud-provider=external`フラグを付けてkubeletを起動した場合、対応する`Node`オブジェクトには`node.cloudprovider.kubernetes.io/uninitialized`というNo Schedule Taintが追加されます。
そのNo Schedule Taintを除去するのはcloud-controller-managerの責任であるため、cloud-controller-managerを`Deployment`や`DaemonSet`などのKubernetesリソースで管理している場合、cloud-controller-manager自身がスケジューリングできないという状況が発生する可能性があります。

コントロールプレーンの初期化中にcloud-controller-managerがスケジューリングできないと、結果として作成されるすべての`Node`オブジェクトに`node.cloudprovider.kubernetes.io/uninitialized`というNo Schedule Taintが付与されたままとなります。
また、このTaintの削除はcloud-controller-managerの責務であるため、cloud-controller-managerが実行されなければTaintは削除されません。
このNo Schedule Taintが除去されないと、コンテナネットワークインターフェースのコントローラーなどの重要なワークロードがスケジューリングされず、クラスターは正常な状態になりません。

### 例: Not-Ready Taintによりクラウドコントローラーマネージャーがスケジューリングされない

次の例は、コンテナネットワークインターフェース(CNI)がcloud-controller-manager(CCM)からのIPアドレス情報を待ち受けており、かつCCMがCNIによって除去されるはずのTaintを許容していない状況で発生する可能性があります。

[Kubernetesのドキュメント][kubedocs1]では、`node.kubernetes.io/not-ready` Taintについて次のように説明されています。

> 「Nodeコントローラーは、ノードの正常性を監視することでその状態を判断し、それに応じてこのTaintを追加または削除します。」

このTaintがNodeリソースに付与される条件の一つは、そのノード上でコンテナネットワークがまだ初期化されていない場合です。
cloud-controller-managerはNodeリソースにIPアドレスを追加する責任があり、コンテナネットワークコントローラーはコンテナネットワークを適切に構成するためにIPアドレスを必要とします。
したがって、場合によってはノードがNot Readyのまま初期化されず、恒久的にその状態にとどまることがあります。

この状況は最初の例と同様の理由で発生しますが、この場合は`node.kubernetes.io/not-ready` TaintがNo Executeの効果とともに使用されているため、cloud-controller-managerはこのTaintが付与されたノード上で実行されません。
cloud-controller-managerが実行できない場合、ノードは初期化されません。
これはコンテナネットワークコントローラーが正常に動作できないことへと連鎖し、ノードは`node.cloudprovider.kubernetes.io/uninitialized`と`node.kubernetes.io/not-ready`の両方のTaintを保持することになり、クラスターは正常な状態ではなくなります。

## 推奨事項

cloud-controller-managerの実行方法に「これが正解」という唯一の方法はありません。
詳細はクラスター管理者およびユーザーの具体的なニーズに依存します。
クラスターおよびcloud-controller-managerのライフサイクルを計画する際には、以下のガイダンスを考慮してください。

cloud-controller-managerが管理対象と同じクラスター内で実行されている場合は、下記の推奨事項を考慮してください。

1. Podネットワークではなく、ホストネットワークモードを使用してください。多くの場合、クラウドコントローラーマネージャーはインフラストラクチャに関連付けられたAPIサービスエンドポイントと通信する必要があります。"hostNetwork"をtrueに設定することで、クラウドコントローラーはコンテナネットワークではなくホストのネットワークを使用するようになり、ホストオペレーティングシステムと同じネットワークアクセスを持つことが保証されます。また、ネットワークプラグインへの依存もなくなります。これにより、クラウドコントローラーがインフラストラクチャのエンドポイントへアクセスできるようになります(ネットワーク構成がインフラストラクチャプロバイダーの指示と一致しているか必ず確認してください)。
2. スケーラブルなリソースタイプを使用してください。`Deployment`や`DaemonSet`は、クラウドコントローラーのライフサイクルを管理するのに有用です。これらを使用することで、冗長性のために複数のインスタンスを実行したり、Kubernetesのスケジューリング機能によってクラスター内で適切に配置したりすることが容易になります。これらのプリミティブを使ってクラウドコントローラーのライフサイクルを管理し、複数のレプリカを実行する場合は、リーダー選出を有効にすることを忘れないでください。そうしないと、各コントローラーが互いに干渉し、クラスター内のノードが初期化されない可能性があります。
3. コントローラーマネージャーのコンテナをコントロールプレーンに配置してください。他のコントローラー(たとえばAzureのノードマネージャーコントローラーなど)がコントロールプレーン外で実行される必要がある場合もありますが、コントローラーマネージャー自体はコントロールプレーンにデプロイするべきです。クラウドコントローラーをコントロールプレーン上で実行するように、nodeSelectorやaffinityスタンザを使用してスケジューリングを制御してください。これにより、クラウドコントローラーを保護された領域で実行できるようになります。クラウドコントローラーはKubernetesと物理インフラストラクチャとの間の接続を担い、クラスターへのノードの追加・削除に不可欠です。これらをコントロールプレーン上で実行することで、他のコアのクラスターコントローラーと同等の優先度で実行され、非特権ユーザーのワークロードとは分離されることが確保されます。
    1. クラウドコントローラーが同一のホスト上で実行されないようにするためのanti-affinityスタンザも、単一ノードの障害によってクラウドコントローラーのパフォーマンスが低下するのを防ぐうえで非常に有用であることは注目に値します。
4. 運用が可能となるように、適切なTolerationを設定してください。クラウドコントローラーコンテナのマニフェストには、適切なノードにスケジューリングされるよう、またノードが初期化中であっても実行できるようにするためのTolerationを記述する必要があります。これは、クラウドコントローラーが`node.cloudprovider.kubernetes.io/uninitialized` Taintを許容すべきであることを意味します。また、コントロールプレーンに関連付けられたTaint(たとえば`node-role.kubernetes.io/control-plane`や`node-role.kubernetes.io/master`)も許容すべきです。さらに、ノードがまだ正常性監視の利用ができない状態でもクラウドコントローラーが実行できるよう、`node.kubernetes.io/not-ready` Taintを許容することも有用です。

cloud-controller-managerを、管理対象のクラスター上ではなく、別のクラスター(たとえば、ホスト型コントロールプレーンを用いた構成)で実行する場合、その運用はcloud-controller-managerを実行しているクラスターの環境に依存するため、より厳しい制約を受けることになります。
自己管理型クラスター上での運用に関する推奨事項は、競合の種類やネットワーク制約が異なるため、適切でない場合があります。
このようなシナリオにおいては、ご利用のトポロジーに応じたアーキテクチャと要件を確認してください。

### 例

以下は、上記のガイダンスを反映したKubernetesのDeploymentの例です。
これはあくまでデモンストレーション用のものであり、実運用で使用する場合は必ずクラウドプロバイダーのドキュメントを参照してください。

```
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app.kubernetes.io/name: cloud-controller-manager
  name: cloud-controller-manager
  namespace: kube-system
spec:
  replicas: 2
  selector:
    matchLabels:
      app.kubernetes.io/name: cloud-controller-manager
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app.kubernetes.io/name: cloud-controller-manager
      annotations:
        kubernetes.io/description: Cloud controller manager for my infrastructure
    spec:
      containers: # コンテナの詳細は使用するクラウドコントローラーマネージャーに依存します
      - name: cloud-controller-manager
        command:
        - /bin/my-infrastructure-cloud-controller-manager
        - --leader-elect=true
        - -v=1
        image: registry/my-infrastructure-cloud-controller-manager@latest
        resources:
          requests:
            cpu: 200m
            memory: 50Mi
      hostNetwork: true # これらのPodはコントロールプレーンの一部です
      nodeSelector:
        node-role.kubernetes.io/control-plane: ""
      affinity:
        podAntiAffinity:
          requiredDuringSchedulingIgnoredDuringExecution:
          - topologyKey: "kubernetes.io/hostname"
            labelSelector:
              matchLabels:
                app.kubernetes.io/name: cloud-controller-manager
      tolerations:
      - effect: NoSchedule
        key: node-role.kubernetes.io/master
        operator: Exists
      - effect: NoExecute
        key: node.kubernetes.io/unreachable
        operator: Exists
        tolerationSeconds: 120
      - effect: NoExecute
        key: node.kubernetes.io/not-ready
        operator: Exists
        tolerationSeconds: 120
      - effect: NoSchedule
        key: node.cloudprovider.kubernetes.io/uninitialized
        operator: Exists
      - effect: NoSchedule
        key: node.kubernetes.io/not-ready
        operator: Exists
```

クラウドコントローラーマネージャーのデプロイ方法を決定する際には、クラスターの規模やリソースに応じたPodのオートスケーリングは推奨されないことに注意してください。
クラウドコントローラーマネージャーのレプリカを複数実行することは、高可用性や冗長性を確保する上で有効な手法ですが、パフォーマンスの向上にはつながりません。
一般に、任意の時点でクラスターの整合性を保つ処理を行うのはクラウドコントローラーマネージャーのインスタンスのうち1つだけです。

[migration-blog]: /ja/blog/2024/05/20/completing-cloud-provider-migration/
[kep2392]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2392-cloud-controller-manager/README.md
[kep1281]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-api-machinery/1281-network-proxy
[kep2133]: https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/2133-kubelet-credential-providers
[csi]: https://github.com/container-storage-interface/spec?tab=readme-ov-file#container-storage-interface-csi-specification-
[kep625]: https://github.com/kubernetes/enhancements/blob/master/keps/sig-storage/625-csi-migration/README.md
[ccm]: /ja/docs/concepts/architecture/cloud-controller/
[chicken-and-egg]: /ja/docs/tasks/administer-cluster/running-cloud-controller/#chicken-and-egg
[kubedocs0]: /ja/docs/tasks/administer-cluster/running-cloud-controller/#running-cloud-controller-manager
[kubedocs1]: /docs/reference/labels-annotations-taints/#node-kubernetes-io-not-ready
