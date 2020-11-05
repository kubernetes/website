---
title: アグリゲーションレイヤーを使ったKubernetes APIの拡張
content_type: concept
weight: 20
---

<!-- overview -->

アグリゲーションレイヤーを使用すると、KubernetesのコアAPIで提供されている機能を超えて、追加のAPIでKubernetesを拡張できます。追加のAPIは、[service-catalog](/docs/concepts/extend-kubernetes/service-catalog/)のような既製のソリューション、または自分で開発したAPIのいずれかです。

アグリゲーションレイヤーは、[カスタムリソース](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)とは異なり、{{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}}に新しい種類のオブジェクトを認識させる方法です。



<!-- body -->

## アグリゲーションレイヤー

アグリゲーションレイヤーは、kube-apiserverのプロセス内で動きます。拡張リソースが登録されるまでは、アグリゲーションレイヤーは何もしません。APIを登録するには、ユーザーはKubernetes APIで使われるURLのパスを"要求"した、_APIService_ オブジェクトを追加します。それを追加すると、アグリゲーションレイヤーはAPIパス(例、`/apis/myextension.mycompany.io/v1/…`)への全てのアクセスを、登録されたAPIServiceにプロキシーします。

APIServiceを実装する最も一般的な方法は、クラスター内で実行されるPodで*拡張APIサーバー* を実行することです。クラスター内のリソース管理に拡張APIサーバーを使用している場合、拡張APIサーバー("extension-apiserver"とも呼ばれます)は通常、1つ以上の{{< glossary_tooltip text="コントローラー" term_id="controller" >}}とペアになっています。apiserver-builderライブラリは、拡張APIサーバーと関連するコントローラーの両方にスケルトンを提供します。

### 応答遅延

拡張APIサーバーは、kube-apiserverとの間の低遅延ネットワーキングが必要です。
kube-apiserverとの間を5秒以内に往復するためには、ディスカバリーリクエストが必要です。

拡張APIサーバーがそのレイテンシ要件を達成できない場合は、その要件を満たすように変更することを検討してください。また、kube-apiserverで`EnableAggregatedDiscoveryTimeout=false` [フィーチャーゲート](/ja/docs/reference/command-line-tools-reference/feature-gates/)を設定することで、タイムアウト制限を無効にすることができます。この非推奨のフィーチャーゲートは将来のリリースで削除される予定です。



## {{% heading "whatsnext" %}}


* アグリゲーターをあなたの環境で動かすには、まず[アグリゲーションレイヤーを設定](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)します
* そして、アグリゲーションレイヤーと一緒に動作させるために[extension api-serverをセットアップ](/docs/tasks/extend-kubernetes/setup-extension-api-server/)します
* また、[Custom Resource Definitionを使いKubernetes APIを拡張する](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)方法を学んで下さい
* [APIService](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apiservice-v1-apiregistration-k8s-io)の仕様をお読み下さい



