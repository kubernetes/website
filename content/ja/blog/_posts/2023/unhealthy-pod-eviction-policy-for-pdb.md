---
layout: blog
title: "Kubernetes 1.26: PodDisruptionBudgetによって保護された不健全なPodに対する退避ポリシー"
date: 2023-01-06
slug: "unhealthy-pod-eviction-policy-for-pdbs"
author: >
  Filip Křepinský (Red Hat),
  Morten Torkildsen (Google),
  Ravi Gudimetla (Apple)
---

アプリケーションの中断がその可用性に影響を与えないようにすることは、簡単な作業ではありません。
先月リリースされたKubernetes v1.26では、[PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets) (PDB) に
_不健全なPodの退避ポリシー_ を指定して、ノード管理操作中に可用性を維持できるようになりました。
この記事では、アプリケーション所有者が中断をより柔軟に管理できるようにするために、PDBにどのような変更が導入されたのかを詳しく説明します。

## これはどのような問題を解決しますか？{#what-problem-does-this-solve}

APIによって開始されるPodの退避では、PodDisruptionBudget(PDB)が考慮されます。
これは、退避によるPodへの[自発的な中断](/ja/docs/concepts/scheduling-eviction/#pod-disruption)の要求は保護されたアプリケーションを中断してはならず、
PDBの`.status.currentHealthy`が`.status.desiredHealthy`を下回ってはいけないことを意味します。
[Unhealthy](/docs/tasks/run-application/configure-pdb/#healthiness-of-a-pod)な実行中のPodはPDBステータスにはカウントされませんが、
これらの退避はアプリケーションが中断されない場合にのみ可能です。
これにより、中断されたアプリケーションやまだ開始されていないアプリケーションが、退避によって追加のダウンタイムが発生することなく、できるだけ早く可用性を達成できるようになります。

残念ながら、これは手動の介入なしでノードをドレインしたいクラスター管理者にとって問題を引き起こします。
(バグまたは構成ミスにより)Podが`CrashLoopBackOff`状態になっているアプリケーション、または単に準備ができていないPodがあるアプリケーションが誤動作している場合、このタスクはさらに困難になります。
アプリケーションのすべてのPodが正常でない場合、PDBの違反により退避リクエストは失敗します。その場合、ノードのドレインは進行できません。

一方で、次の目的で従来の動作に依存するユーザーもいます。

- 基盤となるリソースまたはストレージを保護しているPodの削除によって引き起こされるデータ損失を防止する
- アプリケーションに対して可能な限り最高の可用性を実現する

Kubernetes 1.26では、PodDisruptionBudget APIに新しい実験的フィールド`.spec.unhealthyPodEvictionPolicy`が導入されました。
このフィールドを有効にすると、これらの要件の両方をサポートできるようになります。

## どのように機能しますか？{#how-does-it-work}

APIによって開始される退避は、Podの安全な終了をトリガーするプロセスです。
このプロセスは、APIを直接呼び出すか、`kubectl drain`コマンドを使用するか、クラスター内の他のアクターを使用して開始できます。
このプロセス中に、十分な数のPodが常にクラスター内で実行されていることを確認するために、すべてのPodの削除が適切なPDBと照合されます。

次のポリシーにより、PDBの作成者は、プロセスが不健全なPodを処理する方法をより詳細に制御できるようになります。

`IfHealthyBudget`と`AlwaysAllow`の2つのポリシーから選択できます。

前者の`IfHealthyBudget`は、従来の動作に従って、デフォルトで得られる最高の可用性を実現します。
不健全なPodは、アプリケーションが利用可能な最小数の`.status.desiredHealthy`だけPodがある場合にのみ中断できます。

PDBの`spec.unhealthyPodEvictionPolicy`フィールドを`AlwaysAllow`に設定することにより、アプリケーションにとってベストエフォートの可用性を選択することになります。
このポリシーを使用すると、不健全なPodをいつでも削除できます。これにより、クラスターの保守とアップグレードが容易になります。

多くの場合、`AlwaysAllow`がより良い選択であると考えられますが、一部の重要なワークロードでは、
不健全なPodであってもノードドレインやAPIによって開始される他の形式の退避から保護する方が望ましい場合もあります。

## どのように利用できますか？{#how-do-i-use-it}

これはアルファ機能であるため、kube-apiserverに対してコマンドライン引数`--feature-gates=PDBUnhealthyPodEvictionPolicy=true`を指定して
`PDBUnhealthyPodEvictionPolicy`[フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を有効にする必要があります。

ここに例を示します。クラスターでフィーチャーゲートを有効にし、プレーンなWebサーバーを実行するDeploymentをすでに定義していると仮定します。
そのDeploymentのPodに`app: nginx`というラベルを付けました。
回避可能な中断を制限したいと考えており、このアプリにはベストエフォートの可用性で十分であることがわかっています。
WebサーバーのPodが不健全な場合でも、退避を許可することにしました。
不健全なPodを排除するための`AlwaysAllow`ポリシーを使用して、このアプリケーションを保護するPDBを作成します。

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: nginx-pdb
spec:
  selector:
    matchLabels:
      app: nginx
  maxUnavailable: 1
  unhealthyPodEvictionPolicy: AlwaysAllow
```


## もっと学ぶには？{#how-can-i-learn-more}


- KEPを読んでください: [Unhealthy Pod Eviction Policy for PDBs](https://github.com/kubernetes/enhancements/tree/master/keps/sig-apps/3017-pod-healthy-policy-for-pdb)
- PodDisruptionBudgetについてのドキュメントを読んでください: [Unhealthy Pod Eviction Policy](/docs/tasks/run-application/configure-pdb/#unhealthy-pod-eviction-policy)
- [PodDisruptionBudget](/docs/concepts/workloads/pods/disruptions/#pod-disruption-budgets)、[draining of Nodes](/docs/tasks/administer-cluster/safely-drain-node/)および[evictions](/ja/docs/concepts/scheduling-eviction/api-eviction/)についてKubernetesドキュメントを確認してください


## どうすれば参加できますか？{#how-do-i-get-involved}

フィードバックがある場合は、Slackの[#sig-apps](https://kubernetes.slack.com/archives/C18NZM5K9) チャンネル(必要な場合は https://slack.k8s.io/ にアクセスして招待を受けてください)、またはSIG Appsメーリングリストにご連絡ください。kubernetes-sig-apps@googlegroups.com
