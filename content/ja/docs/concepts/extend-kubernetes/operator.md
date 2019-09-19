---
title: Operatorパターン
content_template: templates/concept
weight: 30
---

{{% capture overview %}}

Operatorはサードパーティのアプリケーション、コンポーネントを管理するためのリソースを活用する、Kubernetesへのソフトウェア拡張です。
Operatorは明白に[制御ループ](/docs/concepts/#kubernetes-control-plane)のような、Kubernetesの原理に準拠しています。

{{% /capture %}}

{{% capture body %}}

## モチベーション

Operatorパターンはサービス、またはサービス群を管理している運用担当者の主な目的をキャプチャすることが目標です。
特定のアプリケーション、サービスの面倒を見ている運用担当者は、システムがどのように振る舞うべきか、どのようにデプロイをするか、何らかの問題があったときにどのように対応するかについて深い知識を持っています。

Kubernetes上でワークロードを稼働させている人は、しばしば繰り返し可能なタスクを自動化することを好みます。
Operatorパターンは、Kubernetes自身が提供している機能を超えて、あなたがタスクを自動化するために、どのようにコードを書くかをキャプチャします。

## KubernetesにおけるOperator

Kubernetesは自動化のために設計されています。追加の作業、設定無しに、Kubernetesのコア機能が多数のビルトインされた自動化機能を提供しています。
ワークロードをデプロイ、走らせるための自動化にKubernetesが使えます。*更に* Kubernetesがそれをどのように行うかの自動化も可能です。

Kubernetesの{{< glossary_tooltip text="Controller" term_id="controller" >}}コンセプトは、Kubernetesのソースコードを修正すること無く、クラスターの振る舞いを拡張することを可能にします。
OperatorはKubernetes APIのクライアントで、[Custom Resource](/docs/concepts/api-extension/custom-resources/)にとっての、コントローラーのように振る舞います。

## Operatorの例 {#example}

Operatorを使い自動化出来るいくつかのことは、下記のようなものがあります:

* 必要に応じてアプリケーションをデプロイします
* アプリケーションの状態のバックアップを取得、リストアします
* アプリケーションコードの更新と同時に、例えばデータベーススキーマ、追加の設定修正など必要な変更の対応を行います
* Kubernetes APIをサポートしていないアプリケーションに、サービスを公開してそれらを発見します
* クラスターの回復力をテストするために、全て、または一部分の障害をシミュレートします
* 内部のリーダー選出プロセス無しに、分散アプリケーションのリーダーを選択します

Operatorをもっと詳しく見るとどのように見えるでしょうか？より詳細な例を示します:

1. クラスターに設定可能なSampleDBという名前のカスタムリソース
2. Operatorの、コントローラー部分を含むPodが実行されていることを保証するDeployment
3. Operatorのコードを含んだコンテナイメージ
4. 設定されているSampleDBのリソースを見つけるために、コントロールプレーンに問い合わせるコントローラーのコード
5. Operatorのコアは、現実を、設定されているリソースにどのように合わせるかをAPIサーバーに伝えるコードです
   * もし新しいSampleDBを追加した場合、Operatorは永続化データベースストレージを提供するためにPersistentVolumeClaimsをセットアップし、StatefulSetがSampleDBの起動と、初期設定を担うJobを走らせます
   * もしそれを削除した場合、Operatorはスナップショットを取り、StatefulSetとVolumeも合わせて削除されたことを確認します
6. Operatorは定期的なデータベースのバックアップも管理します。それぞれのSampleDBリソースについて、Operatorはデータベースに接続可能な、バックアップを取得するPodをいつ作成するかを決定します。これらのPodはデータベース接続の詳細情報、クレデンシャルを保持するConfigMapとSecret、もしくはどちらかに依存するでしょう。
7. Operatorは、管理下のリソースの堅牢な自動化を提供することを目的としているため、補助的な追加コードが必要になるかもしれません。この例では、データベースが古いバージョンで動いているかどうかを確認するコードで、その場合、アップグレードを行うJobをあなたに変わり作成します。

## Operatorのデプロイ

Operatorをデプロイする最も一般的な方法は、Custom Resource Definitionと関連するControllerをクラスタに追加することです。
このコントローラーは通常、あなたがコンテナアプリケーションを動かすのと同じように、{{< glossary_tooltip text="コントロールプレーン" term_id="control-plane" >}}外で動作します。

例えば、コントローラーをDeploymentとしてクラスタ内で動かすことが出来ます。

## Operatorを利用する {#using-operators}

一度Operatorをデプロイすると、Operatorが使っているリソースを追加、更新そして削除することがあるでしょう。
上の例に従うと、OperatorそのもののためのDeploymentをセットアップし、そして:

```shell
kubectl get SampleDB                   # 設定したデータベースを発見します

kubectl edit SampleDB/example-database # 手動でいくつかの設定を変更します
```

...そして、それだけです！Operatorが変更の適用と、既存のサービスがうまく動き続けるように面倒を見ます。

## 自分でOperatorを書く {#writing-operator}

もし、あなたが欲しい振る舞いを実装したOperatorがエコシステム内に無い場合、自分で作成することが出来ます。
[次の項目](#what-s-next)で、自分でクラウドネイティブOperatorを作るときに利用できるライブラリやツールのリンクを見つけられます。

Operator（すなわち、Controller）はどの言語/ランタイムでも実装出来、[Kubernetes APIのクライアント](/docs/reference/using-api/client-libraries/)として機能させることが出来ます。

{{% /capture %}}

{{% capture whatsnext %}}

* [Custom Resources](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)をより深く学びます
* ユースケースに合わせた、既製のOperatorを[OperatorHub.io](https://operatorhub.io/)から見つけます
* 自前のOperatorを書くために既存のツールを使います、例:
  * [KUDO](https://kudo.dev/)（Kubernetes Universal Declarative Operator）を使います
  * [kubebuilder](https://book.kubebuilder.io/)を使います
  * [Metacontroller](https://metacontroller.app/)を自分で実装したWebHooksと一緒に使います
  * [Operator Framework](https://github.com/operator-framework/getting-started)を使います
* 自前のOperatorを他のユーザーのために[公開](https://operatorhub.io/)します
* Operatorパターンを紹介している[CoreOSオリジナル記事](https://coreos.com/blog/introducing-operators.html)を読みます
* Google Cloudが出したOperator作成のベストプラクティス[記事](https://cloud.google.com/blog/products/containers-kubernetes/best-practices-for-building-kubernetes-operators-and-stateful-apps)を読みます

{{% /capture %}}
