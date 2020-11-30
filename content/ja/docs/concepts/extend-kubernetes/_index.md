---
title: Kubernetesを拡張する
weight: 110
description: Kubernetesクラスターの挙動を変えるいろいろな方法
content_type: concept
no_list: true
---

<!-- overview -->
Kubernetesは柔軟な設定が可能で、高い拡張性を持っています。
結果として、Kubernetesのプロジェクトソースコードをフォークしたり、パッチを当てて利用することは滅多にありません。
このガイドは、Kubernetesクラスターをカスタマイズするための選択肢を記載します。
管理しているKubernetesクラスターを、動作環境の要件にどのように適合させるべきかを理解したい{{< glossary_tooltip text="クラスター管理者" term_id="cluster-operator" >}}を対象にしています。
将来の {{< glossary_tooltip text="プラットフォーム開発者" term_id="platform-developer" >}} 、またはKubernetesプロジェクトの{{< glossary_tooltip text="コントリビューター" term_id="contributor" >}}にとっても、どのような拡張のポイントやパターンが存在するのか、また、それぞれのトレードオフや制限事項を学ぶための導入として役立つでしょう。
<!-- body -->
## 概要
カスタマイズのアプローチには大きく分けて、フラグ、ローカル設定ファイル、またはAPIリソースの変更のみを含んだ *設定* と、稼働しているプログラムまたはサービスも含んだ *拡張* があります。このドキュメントでは、主に拡張について説明します。
## 設定

*設定ファイル* と *フラグ* はオンラインドキュメントのリファレンスセクションの中の、各項目に記載されています:

* [kubelet](/docs/admin/kubelet/)
* [kube-apiserver](/docs/admin/kube-apiserver/)
* [kube-controller-manager](/docs/admin/kube-controller-manager/)
* [kube-scheduler](/docs/admin/kube-scheduler/)
* [kubelet](/docs/reference/command-line-tools-reference/kubelet/)
* [kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)

ホスティングされたKubernetesサービスやマネージドなKubernetesでは、フラグと設定ファイルが常に変更できるとは限りません。変更可能な場合でも、通常はクラスターの管理者のみが変更できます。また、それらは将来のKubernetesバージョンで変更される可能性があり、設定変更にはプロセスの再起動が必要になるかもしれません。これらの理由により、この方法は他の選択肢が無いときにのみ利用するべきです。

[ResourceQuota](/docs/concepts/policy/resource-quotas/)、[PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)、[NetworkPolicy](/docs/concepts/services-networking/network-policies/)、そしてロールベースアクセス制御([RBAC](/docs/reference/access-authn-authz/rbac/))といった *ビルトインポリシーAPI* は、ビルトインのKubernetes APIです。APIは通常、ホスティングされたKubernetesサービスやマネージドなKubernetesで利用されます。これらは宣言的で、Podのような他のKubernetesリソースと同じ慣例に従っています。そのため、新しいクラスターの設定は繰り返し再利用することができ、アプリケーションと同じように管理することが可能です。さらに、安定版(stable)を利用している場合、他のKubernetes APIのような[定義済みのサポートポリシー](/docs/reference/deprecation-policy/)を利用することができます。これらの理由により、この方法は、適切な用途の場合、 *設定ファイル* や *フラグ* よりも好まれます。

## 拡張

拡張はKubernetesを拡張し、深く統合されたソフトウェアの構成要素です。
これは新しいタイプと、新しい種類のハードウェアをサポートするために利用されます。

ほとんどのクラスター管理者は、ホスティングされている、またはディストリビューションとしてのKubernetesを使っているでしょう。
結果として、ほとんどのKubernetesユーザーは既存の拡張を使えばよいため、新しい拡張を書く必要は無いと言えます。

## 拡張パターン {#extension-patterns}

Kubernetesは、クライアントのプログラムを書くことで自動化ができるようにデザインされています。
Kubernetes APIに読み書きをするどのようなプログラムも、役に立つ自動化機能を提供することができます。
*自動化機能* はクラスター上、またはクラスター外で実行できます。
このドキュメントに後述のガイダンスに従うことで、高い可用性を持つ頑強な自動化機能を書くことができます。
自動化機能は通常、ホスティングされているクラスター、マネージドな環境など、どのKubernetesクラスター上でも動きます。

Kubernetes上でうまく動くクライアントプログラムを書くために、*コントローラー* パターンという明確なパターンがあります。
コントローラーは通常、オブジェクトの `.spec` を読み取り、何らかの処理をして、オブジェクトの `.status` を更新します。

コントローラーはKubernetesのクライアントです。Kubernetesがクライアントとして動き、外部のサービスを呼び出す場合、それは *Webhook* と呼ばれます。
呼び出されるサービスは *Webhookバックエンド* と呼ばれます。コントローラーのように、Webhookも障害点を追加します。

Webhookのモデルでは、Kubernetesは外部のサービスを呼び出します。
*バイナリプラグイン* モデルでは、Kubernetesはバイナリ(プログラム)を実行します。
バイナリプラグインはkubelet(例、[FlexVolumeプラグイン](/docs/concepts/storage/volumes/#flexVolume)、[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/))、またkubectlで利用されています。

下図は、それぞれの拡張ポイントが、Kubernetesのコントロールプレーンとどのように関わっているかを示しています。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vQBRWyXLVUlQPlp7BvxvV9S1mxyXSM6rAc_cbLANvKlu6kCCf-kGTporTMIeG5GZtUdxXz1xowN7RmL/pub?w=960&h=720">

<!-- image source drawing https://docs.google.com/drawings/d/1muJ7Oxuj_7Gtv7HV9-2zJbOnkQJnjxq-v1ym_kZfB-4/edit?ts=5a01e054 -->

## 拡張ポイント

この図は、Kubernetesにおける拡張ポイントを示しています。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vSH5ZWUO2jH9f34YHenhnCd14baEb4vT-pzfxeFC7NzdNqRDgdz4DDAVqArtH4onOGqh0bhwMX0zGBb/pub?w=425&h=809">

<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

1.   ユーザーは頻繁に`kubectl`を使って、Kubernetes APIとやり取りをします。[Kubectlプラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)は、kubectlのバイナリを拡張します。これは個別ユーザーのローカル環境のみに影響を及ぼすため、サイト全体にポリシーを強制することはできません。
2.   APIサーバーは全てのリクエストを処理します。APIサーバーのいくつかの拡張ポイントは、リクエストを認可する、コンテキストに基づいてブロックする、リクエストを編集する、そして削除を処理することを可能にします。これらは[APIアクセス拡張](/docs/concepts/extend-kubernetes/#api-access-extensions)セクションに記載されています。
3.   APIサーバーは様々な種類の *リソース* を扱います。`Pod`のような *ビルトインリソース* はKubernetesプロジェクトにより定義され、変更できません。ユーザーも、自身もしくは、他のプロジェクトで定義されたリソースを追加することができます。それは *カスタムリソース* と呼ばれ、[カスタムリソース](/docs/concepts/extend-kubernetes/#user-defined-types)セクションに記載されています。カスタムリソースは度々、APIアクセス拡張と一緒に使われます。
4.   KubernetesのスケジューラーはPodをどのノードに配置するかを決定します。スケジューリングを拡張するには、いくつかの方法があります。それらは[スケジューラー拡張](/docs/concepts/extend-kubernetes/#scheduler-extensions)セクションに記載されています。
5.   Kubernetesにおける多くの振る舞いは、APIサーバーのクライアントであるコントローラーと呼ばれるプログラムに実装されています。コントローラーは度々、カスタムリソースと共に使われます。
6.   kubeletはサーバー上で実行され、Podが仮想サーバーのようにクラスターネットワーク上にIPを持った状態で起動することをサポートします。[ネットワークプラグイン](/docs/concepts/extend-kubernetes/#network-plugins)がPodのネットワーキングにおける異なる実装を適用することを可能にします。
7.   kubeletはまた、コンテナのためにボリュームをマウント、アンマウントします。新しい種類のストレージは[ストレージプラグイン](/docs/concepts/extend-kubernetes/#storage-plugins)を通じてサポートされます。

もしあなたがどこから始めるべきかわからない場合、このフローチャートが役立つでしょう。一部のソリューションは、いくつかの種類の拡張を含んでいることを留意してください。

<img src="https://docs.google.com/drawings/d/e/2PACX-1vRWXNNIVWFDqzDY0CsKZJY3AR8sDeFDXItdc5awYxVH8s0OLherMlEPVUpxPIB1CSUu7GPk7B2fEnzM/pub?w=1440&h=1080">

<!-- image source drawing: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

## API拡張
### ユーザー定義タイプ

新しいコントローラー、アプリケーションの設定に関するオブジェクト、また宣言型APIを定義し、それらを`kubectl`のようなKubernetesのツールから管理したい場合、Kubernetesにカスタムリソースを追加することを検討して下さい。

カスタムリソースはアプリケーション、ユーザー、監視データのデータストレージとしては使わないで下さい。

カスタムリソースに関するさらなる情報は、[カスタムリソースコンセプトガイド](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)を参照して下さい。

### 新しいAPIと自動化機能の連携

カスタムリソースAPIと制御ループの組み合わせは[オペレーターパターン](/ja/docs/concepts/extend-kubernetes/operator/)と呼ばれています。オペレーターパターンは、通常ステートフルな特定のアプリケーションを管理するために利用されます。これらのカスタムAPIと制御ループは、ストレージ、またはポリシーのような他のリソースを管理するためにも利用されます。

### ビルトインリソースの変更

カスタムリソースを追加し、KubernetesAPIを拡張する場合、新たに追加されたリソースは常に新しいAPIグループに分類されます。既存のAPIグループを置き換えたり、変更することはできません。APIを追加することは直接、既存のAPI(例、Pod)の振る舞いに影響を与えることは無いですが、APIアクセス拡張の場合、その可能性があります。

### APIアクセス拡張 {#api-access-extensions}

リクエストがKubernetes APIサーバーに到達すると、まず最初に認証が行われ、次に認可、その後、様々なAdmission Controlの対象になります。このフローの詳細は[Kubernetes APIへのアクセスをコントロールする](/docs/reference/access-authn-authz/controlling-access/)を参照して下さい。

これらの各ステップごとに拡張ポイントが用意されています。

Kubdernetesはいくつかのビルトイン認証方式をサポートしています。それは認証プロキシの後ろに配置することも可能で、認可ヘッダーを通じて(Webhookの)検証のために外部サービスにトークンを送ることもできます。全てのこれらの方法は[認証ドキュメント](/ja/docs/reference/access-authn-authz/authentication/)でカバーされています。

### 認証

[認証](/ja/docs/reference/access-authn-authz/authentication/)は、全てのリクエストのヘッダーまたは証明書情報を、リクエストを投げたクライアントのユーザー名にマッピングします。

Kubernetesはいくつかのビルトイン認証方式と、それらが要件に合わない場合、[認証Webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)を提供します。

### 認可

[認可](/docs/reference/access-authn-authz/webhook/)は特定のユーザーがAPIリソースに対して、読み込み、書き込み、そしてその他の操作が可能かどうかを決定します。それはオブジェクト全体のレベルで機能し、任意のオブジェクトフィールドに基づいての区別は行いません。もしビルトインの認可メカニズムが要件に合わない場合、[認可Webhook](/docs/reference/access-authn-authz/webhook/)が、ユーザー提供のコードを呼び出し認可の決定を行うことを可能にします。

### 動的Admission Control

リクエストが認可された後、もしそれが書き込み操作だった場合、リクエストは[Admission Control](/docs/reference/access-authn-authz/admission-controllers/)のステップを通ります。ビルトインのステップに加え、いくつかの拡張が存在します:

*   [イメージポリシーWebhook](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook)は、コンテナでどのイメージを実行することができるかを制限する
*   任意のAdmission Controlの決定を行うには、一般的な[Admission webhook](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks)が利用できる。Admission Webhookは作成、更新を拒絶できる

## インフラストラクチャ拡張

### ストレージプラグイン

[Flex Volumes](/docs/concepts/storage/volumes/#flexVolume)は、Kubeletがバイナリプラグインを呼び出してボリュームをマウントすることにより、ユーザーはビルトインのサポートなしでボリュームタイプをマウントすることを可能にします。

### デバイスプラグイン

[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)を通じて、ノードが新たなノードのリソース(CPU、メモリなどのビルトインのものに加え)を見つけることを可能にします。

### ネットワークプラグイン

他のネットワークファブリックが[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)を通じてサポートされます。

### スケジューラー拡張

スケジューラーは特別な種類のコントローラーで、Podを監視し、Podをノードに割り当てます。デフォルトのコントローラーを完全に置き換えることもできますが、他のKubernetesのコンポーネントの利用を継続する、または[複数のスケジューラー](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)を同時に動かすこともできます。

これはかなりの大きな作業で、ほとんど全てのKubernetesユーザーはスケジューラーを変更する必要はありません。

スケジューラは[Webhook](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/scheduling/scheduler_extender.md)もサポートしており、Webhookバックエンド(スケジューラー拡張)を通じてPodを配置するために選択されたノードをフィルタリング、優先度付けすることが可能です。



## {{% heading "whatsnext" %}}


* [カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)についてより深く学ぶ
* [動的Admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)について学ぶ
* インフラストラクチャ拡張についてより深く学ぶ
  * [ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [kubectlプラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)について学ぶ
* [オペレーターパターン](/docs/concepts/extend-kubernetes/operator/)について学ぶ
