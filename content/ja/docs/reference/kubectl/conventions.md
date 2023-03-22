---
title: kubectlの使用規則
content_type: concept
weight: 60
---

<!-- overview -->
`kubectl`の推奨される使用規則です。

<!-- body -->

## 再利用可能なスクリプトでの`kubectl`の使用

スクリプトでの安定した出力のために:

* `-o name`, `-o json`, `-o yaml`, `-o go-template`, `-o jsonpath` などの機械指向の出力形式のいずれかを必要します。
* バージョンを完全に指定します。例えば、`jobs.v1.batch/myjob`のようにします。これにより、kubectlが時間とともに変化する可能性のあるデフォルトのバージョンを使用しないようにします。
* コンテキストや設定、その他の暗黙的な状態に頼ってはいけません。

## ベストプラクティス

### `kubectl run`

`kubectl run`がインフラのコード化を満たすために:

* イメージにバージョン固有のタグを付けて、そのタグを新しいバージョンに移さない。例えば、`:latest`ではなく、`:v1234`、`v1.2.3`、`r03062016-1-4`を使用してください(詳細は、[Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images)を参照してください)。
* パラメーターが多用されているイメージをスクリプトでチェックします。
* `kubectl run` フラグでは表現できない機能を、ソースコントロールでチェックした設定ファイルに切り替えます。

`dry-run=client` フラグを使用すると、実際に送信することなく、クラスターに送信されるオブジェクトを確認することができます。

{{< note >}}
すべての`kubectl run`ジェネレーターは非推奨です。ジェネレーターの[リスト](https://v1-17.docs.kubernetes.io/docs/reference/kubectl/conventions/#generators)とその使用方法については、Kubernetes v1.17のドキュメントを参照してください。
{{< /note >}}

#### Generators
`kubectl create --dry-run=client -o yaml`というkubectlコマンドで以下のリソースを生成することができます。

* `clusterrole`: ClusterRoleを作成します。
* `clusterrolebinding`:  特定のClusterRoleに対するClusterRoleBindingを作成します。
* `configmap`: ローカルファイル、ディレクトリ、またはリテラル値からConfigMapを作成します。
* `cronjob`: 指定された名前のCronJobを作成します。
* `deployment`: 指定された名前でDeploymentを作成します。
* `job`: 指定された名前でJobを作成します。
* `namespace`: 指定された名前でNamespaceを作成します。
* `poddisruptionbudget`:  指定された名前でPodDisruptionBudgetを作成します。
* `priorityclass`: 指定された名前でPriorityClassを作成します。
* `quota`: 指定された名前でQuotaを作成します。
* `role`: 1つのルールでRoleを作成します。
* `rolebinding`: 特定のロールやClusterRoleに対するRoleBindingを作成します。
* `secret`: 指定されたサブコマンドを使用してSecretを作成します。
* `service`: 指定されたサブコマンドを使用してServiceを作成します。
* `ServiceAccount`: 指定された名前でServiceAccountを作成します。

### `kubectl apply`

* リソースの作成や更新には `kubectl apply` を使用できます。kubectl applyを使ったリソースの更新については、[Kubectl Book](https://kubectl.docs.kubernetes.io)を参照してください。


