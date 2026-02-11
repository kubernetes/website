---
title: Node Declared Features
weight: 160
---

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

Kubernetesノードは _Declared Features_ を使用して、新規機能やフィーチャーゲート制御された特定の機能が利用可能かどうかを報告します。
コントロールプレーンコンポーネントは、この情報を利用してより適切な判断を行います。
kube-schedulerは、`NodeDeclaredFeatures`プラグインを介して、Podが必要とする機能を明示的にサポートするノードにのみPodを配置します。
さらに、`NodeDeclaredFeatureValidator`アドミッションコントローラーは、Pod更新時にノードが必要な機能を宣言しているかを検証します。

このメカニズムにより、バージョンスキューを管理でき、クラスターの安定性が向上します。
特に、クラスターのアップグレード時や、すべてのノードで同じ機能が有効になっていない可能性がある混合バージョン環境で有効です。
これは、新しいノードレベルの機能を導入するKubernetes機能開発者向けのもので、バックグラウンドで動作します。
Podをデプロイするアプリケーション開発者は、このフレームワークと直接やり取りする必要はありません。

## 動作の仕組み {#how-it-works}

1.  **Kubeletによる機能報告:** 起動時に、各ノード上のkubeletは、現在有効になっている管理対象のKubernetes機能を検出し、Nodeオブジェクトの`.status.declaredFeatures`フィールドで報告します。
    このフィールドには、アクティブに開発中の機能のみが含まれます。
2.  **スケジューラーによるフィルタリング:** デフォルトのkube-schedulerは`NodeDeclaredFeatures`プラグインを使用します。
    このプラグインは:
    * `PreFilter`ステージで、`PodSpec`をチェックして、Podが必要とするノード機能のセットを推測します。
    * `Filter`ステージで、ノードの`.status.declaredFeatures`にリストされている機能が、Podに対して推測された要件を満たすかどうかをチェックします。
      必要な機能を持たないノードにはPodはスケジュールされません。
      カスタムスケジューラーも`.status.declaredFeatures`フィールドを利用して、同様の制約を適用できます。
3.  **アドミッションコントロール:** `nodedeclaredfeaturevalidator`アドミッションコントローラーは、バインド先のノードで宣言されていない機能を必要とするPodを拒否でき、Pod更新時の問題を防ぎます。

## Node Declared Featuresの有効化 {#enabling-node-declared-features}

Node Declared Featuresを使用するには、`kube-apiserver`、`kube-scheduler`、および`kubelet`コンポーネントで`NodeDeclaredFeatures`[フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)を有効にする必要があります。

## {{% heading "whatsnext" %}}

* 詳細については、KEPを参照してください:
    [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
* [`NodeDeclaredFeatureValidator`アドミッションコントローラー](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator)について読む。
