---
layout: blog
title: "kube-scheduler-simulatorの紹介"
date: 2025-04-07
slug: introducing-kube-scheduler-simulator
author: Kensei Nakada (Tetrate)
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

Kubernetesスケジューラーは、Podがどのノードで実行されるかを決定する、非常に重要なコントロールプレーンコンポーネントです。
そのため、Kubernetesを利用するすべてのユーザーは、スケジューラーに依存しています。

[kube-scheduler-simulator](https://github.com/kubernetes-sigs/kube-scheduler-simulator)は、Kubernetesスケジューラーの _シミュレーター_ であり、[Google Summer of Code 2021](https://summerofcode.withgoogle.com/)において私(Kensei Nakada)が開発を開始し、その後多くのコントリビューションを受けてきたプロジェクトです。
このツールを使用すると、スケジューラーの動作や意思決定を詳細に観察することができます。

このシミュレーターは、スケジューリング制約(たとえば、[Pod間のアフィニティ](/ja/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity/#affinity-and-anti-affinity))を利用する一般ユーザーにとっても有用ですし、カスタムプラグインによってスケジューラーを拡張するエキスパートにとっても有用です。

## 動機

スケジューラーは、多くのプラグインで構成されており、それぞれが独自の観点でスケジューリングの意思決定に寄与しているため、しばしばブラックボックスのように見えます。
その動作を理解することは、考慮される要素が非常に多いため困難です。

たとえシンプルなテストクラスターにおいてPodが正しくスケジューリングされているように見えても、想定とは異なる計算に基づいてスケジューリングされている可能性があります。
このようなずれは、本番の大規模な環境において、予期しないスケジューリング結果を引き起こすことにつながりかねません。

また、スケジューラーをテストすることは非常に複雑な課題です。
実際のクラスター内では無数の操作パターンが存在し、有限な数のテストであらゆるシナリオを予測することは現実的ではありません。
多くの場合、スケジューラーを実際のクラスターにデプロイして初めてバグが発見されます。
実際、アップストリームのkube-schedulerであっても、リリース後にユーザーによって多くのバグが発見されています。

スケジューラー、あるいはどんなKubernetesコントローラーであっても、それらをテストするための開発環境やサンドボックス環境を用意することは、一般的なプラクティスです。
しかし、この方法では、本番クラスターで発生し得るすべてのシナリオを網羅するには不十分です。
というのも、開発クラスターは通常、本番に比べてはるかに小規模であり、ワークロードの規模やスケーリングの特性にも大きな違いがあるためです。
開発クラスターは本番環境とまったく同じ使われ方をすることはなく、同じ挙動を示すこともありません。

kube-scheduler-simulatorは、これらの問題を解決することを目的としています。
ユーザーは、このツールを用いてスケジューリング制約やスケジューラーの設定、カスタムプラグインをテストしつつ、スケジューリングの意思決定におけるあらゆる詳細な部分を確認することができます。
また、ユーザーは本番クラスターと同じリソースを使いながら、実際のワークロードに影響を与えることなく、スケジューラーをテストできるシミュレートされたクラスター環境を作成することも可能です。

## kube-scheduler-simulatorの機能

kube-scheduler-simulatorのコア機能は、スケジューラーの内部的な意思決定を可視化できる点にあります。
スケジューラーは[スケジューリングフレームワーク](/ja/docs/concepts/scheduling-eviction/scheduling-framework/)に基づいて動作しており、さまざまな拡張ポイントで複数のプラグインを利用し、ノードのフィルタリング(Filterフェーズ)、スコア付け(Scoreフェーズ)を経て、最終的にPodに最適なノードを決定します。

このシミュレーターを用いることで、ユーザーはKubernetesリソースを作成し、各プラグインがPodのスケジューリングにどのように影響を与えているかを観察できます。
これにより、スケジューラーの仕組みを理解し、適切なスケジューリング制約を定義する助けとなります。

{{< figure src="/images/blog/2025-04-07-kube-scheduler-simulator/simulator.png" alt="ノードごとおよび拡張ポイントごとの詳細なスケジューリング結果を表示する、シミュレーターのWebフロントエンドのスクリーンショット" title="シミュレーターのwebフロントエンド" >}}

このシミュレーターの内部では、通常のスケジューラー(vanilla scheduler)ではなく、Debuggable Schedulerと呼ばれるデバッグを容易にするスケジューラーが動作します。
このDebuggable Schedulerは、各拡張ポイントにおける各スケジューラープラグインの結果を、以下のマニフェストに示すようにPodのアノテーションとして出力します。
webフロントエンドはこれらのアノテーションに基づいてスケジューリング結果を整形・可視化します。

```yaml
kind: Pod
apiVersion: v1
metadata:
  # このブログ投稿では、アノテーション内のJSONは見やすさのために手動で整形されています。
  annotations:
    kube-scheduler-simulator.sigs.k8s.io/bind-result: '{"DefaultBinder":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/filter-result: >-
      {
        "node-jjfg5":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        },
        "node-mtb5x":{
            "NodeName":"passed",
            "NodeResourcesFit":"passed",
            "NodeUnschedulable":"passed",
            "TaintToleration":"passed"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/finalscore-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"300",
            "VolumeBinding":"0"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/permit-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout: '{}'
    kube-scheduler-simulator.sigs.k8s.io/postfilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prebind-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result: '{}'
    kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status: >-
      {
        "AzureDiskLimits":"",
        "EBSLimits":"",
        "GCEPDLimits":"",
        "InterPodAffinity":"",
        "NodeAffinity":"",
        "NodePorts":"",
        "NodeResourcesFit":"success",
        "NodeVolumeLimits":"",
        "PodTopologySpread":"",
        "VolumeBinding":"",
        "VolumeRestrictions":"",
        "VolumeZone":""
      }
    kube-scheduler-simulator.sigs.k8s.io/prescore-result: >-
      {
        "InterPodAffinity":"",
        "NodeAffinity":"success",
        "NodeResourcesBalancedAllocation":"success",
        "NodeResourcesFit":"success",
        "PodTopologySpread":"",
        "TaintToleration":"success"
      }
    kube-scheduler-simulator.sigs.k8s.io/reserve-result: '{"VolumeBinding":"success"}'
    kube-scheduler-simulator.sigs.k8s.io/result-history: >-
      [
        {
            "kube-scheduler-simulator.sigs.k8s.io/bind-result":"{\"DefaultBinder\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/filter-result":"{\"node-jjfg5\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"},\"node-mtb5x\":{\"NodeName\":\"passed\",\"NodeResourcesFit\":\"passed\",\"NodeUnschedulable\":\"passed\",\"TaintToleration\":\"passed\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/finalscore-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"300\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/permit-result-timeout":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/postfilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prebind-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result":"{}",
            "kube-scheduler-simulator.sigs.k8s.io/prefilter-result-status":"{\"AzureDiskLimits\":\"\",\"EBSLimits\":\"\",\"GCEPDLimits\":\"\",\"InterPodAffinity\":\"\",\"NodeAffinity\":\"\",\"NodePorts\":\"\",\"NodeResourcesFit\":\"success\",\"NodeVolumeLimits\":\"\",\"PodTopologySpread\":\"\",\"VolumeBinding\":\"\",\"VolumeRestrictions\":\"\",\"VolumeZone\":\"\"}",
            "kube-scheduler-simulator.sigs.k8s.io/prescore-result":"{\"InterPodAffinity\":\"\",\"NodeAffinity\":\"success\",\"NodeResourcesBalancedAllocation\":\"success\",\"NodeResourcesFit\":\"success\",\"PodTopologySpread\":\"\",\"TaintToleration\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/reserve-result":"{\"VolumeBinding\":\"success\"}",
            "kube-scheduler-simulator.sigs.k8s.io/score-result":"{\"node-jjfg5\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"52\",\"NodeResourcesFit\":\"47\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"},\"node-mtb5x\":{\"ImageLocality\":\"0\",\"NodeAffinity\":\"0\",\"NodeResourcesBalancedAllocation\":\"76\",\"NodeResourcesFit\":\"73\",\"TaintToleration\":\"0\",\"VolumeBinding\":\"0\"}}",
            "kube-scheduler-simulator.sigs.k8s.io/selected-node":"node-mtb5x"
        }
      ]
    kube-scheduler-simulator.sigs.k8s.io/score-result: >-
      {
        "node-jjfg5":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"52",
            "NodeResourcesFit":"47",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        },
        "node-mtb5x":{
            "ImageLocality":"0",
            "NodeAffinity":"0",
            "NodeResourcesBalancedAllocation":"76",
            "NodeResourcesFit":"73",
            "TaintToleration":"0",
            "VolumeBinding":"0"
        }
      }
    kube-scheduler-simulator.sigs.k8s.io/selected-node: node-mtb5x
```

ユーザーはまた、[自身のカスタムプラグイン](/ja/docs/concepts/scheduling-eviction/scheduling-framework/)や[extender](https://github.com/kubernetes/design-proposals-archive/blob/main/scheduling/scheduler_extender.md)をこのDebuggable Schedulerに統合し、その結果を可視化することもできます。

このDebuggable Schedulerは、たとえば任意のKubernetesクラスター上や統合テスト内など、スタンドアローンで実行することも可能です。これは、自身のプラグインをテストしたり、実クラスター上でカスタムスケジューラーをよりデバッグしやすくしたいと考えるカスタムプラグイン開発者にとって有用です。

## より優れた開発クラスターとしてのシミュレーター

前述のとおり、限られたテストだけでは実世界のクラスターで起こり得るすべてのシナリオを予測することは不可能です。
ユーザーはスケジューラーを本番環境にデプロイする前に、小規模な開発クラスターでテストし、問題が発生しないことを願うことしかできません。

そこで、[シミュレーターのインポート機能](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/master/simulator/docs/import-cluster-resources.md)を使うことで、本番環境に近い環境で、稼働中のワークロードに影響を与えることなくスケジューラーのシミュレーションをすることができます。

本番クラスターとシミュレーターの間で継続的に同期を行うことで、ユーザーは本番クラスターが対応するリソースと同じリソースを用いて、新しいバージョンのスケジューラーを安全にテストすることができます。
その動作に確信が持てた段階で本番環境へのデプロイに進むことができ、予期しない問題のリスクを低減できます。

## ユースケースは？

1. **クラスターユーザー**: スケジューリング制約(たとえば、PodAffinityやPodTopologySpreadなど)が意図した通りに機能しているかを検証する。
2. **クラスター管理者**: スケジューラーの設定を変更した場合に、クラスターがどのように動作するかを評価する。
3. **スケジューラープラグイン開発者**: カスタムスケジューラープラグインやスケジューラー拡張をテストする。Debuggable Schedulerを統合テストや開発クラスターで使用したり、本番環境に近い環境でのテストのために[同期](https://github.com/kubernetes-sigs/kube-scheduler-simulator/blob/simulator/v0.3.0/simulator/docs/import-cluster-resources.md)機能を活用したりする。

## 利用開始の手順

このシミュレーターを使用するには、マシンにDockerがインストールされていれば十分で、Kubernetesクラスターは必要ありません。

```
git clone git@github.com:kubernetes-sigs/kube-scheduler-simulator.git
cd kube-scheduler-simulator
make docker_up
```

`http://localhost:3000`でシミュレーターのweb UIにアクセスできます。

詳しくは、[kube-scheduler-simulatorのリポジトリ](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator)をご覧ください！

## 貢献するには

このシミュレーターは、[Kubernetes SIG Scheduling](https://github.com/kubernetes/community/blob/master/sig-scheduling/README.md#kube-scheduler-simulator)によって開発されています。
フィードバックやコントリビューションは大歓迎です！

問題の報告やプルリクエストは、[kube-scheduler-simulatorのリポジトリ](https://sigs.k8s.io/kube-scheduler-simulator)で行ってください。
また、Slackの[#sig-scheduling](https://kubernetes.slack.com/messages/sig-scheduling)チャンネルにもぜひご参加ください。

## 謝辞

このシミュレーターのプロジェクトは、熱意あるボランティアのエンジニアたちによってメンテナンスされ、多くの課題を乗り越えて現在の形に至りました。

[素晴らしいコントリビューターの皆さん](https://github.com/kubernetes-sigs/kube-scheduler-simulator/graphs/contributors)に心より感謝いたします！
