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
カスタマイズのアプローチには大きく分けて、フラグ、ローカル設定ファイル、またはAPIリソースの変更のみを含んだ *コンフィグレーション* と、稼働しているプログラムまたはサービスも含んだ *エクステンション* があります。このドキュメントでは、主にエクステンションについて説明します。
## コンフィグレーション

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
[ResourceQuota](/ja/docs/concepts/policy/resource-quotas/)、[PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)、[NetworkPolicy](/docs/concepts/services-networking/network-policies/)、そしてロールベースアクセス制御([RBAC](/docs/reference/access-authn-authz/rbac/))といった *ビルトインポリシーAPI* は、ビルトインのKubernetes APIです。APIは通常、ホスティングされたKubernetesサービスやマネージドなKubernetesで利用されます。これらは宣言的で、Podのような他のKubernetesリソースと同じ慣例に従っています。そのため、新しいクラスターの設定は繰り返し再利用することができ、アプリケーションと同じように管理することが可能です。さらに、安定版(stable)を利用している場合、他のKubernetes APIのような[定義済みのサポートポリシー](//docs/reference/using-api/deprecation-policy/)を利用することができます。これらの理由により、この方法は、適切な用途の場合、 *設定ファイル* や *フラグ* よりも好まれます。

## エクステンション

@@ -58,7 +58,7 @@ Kubernetes上でうまく動くクライアントプログラムを書くため

Webhookのモデルでは、Kubernetesは外部のサービスを呼び出します。
*バイナリプラグイン* モデルでは、Kubernetesはバイナリ(プログラム)を実行します。
バイナリプラグインはkubelet(例、[FlexVolumeプラグイン](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-storage/flexvolume.md)、[ネットワークプラグイン](/docs/concepts/cluster-administration/network-plugins/))、またkubectlで利用されています。
バイナリプラグインはkubelet(例、[FlexVolumeプラグイン](/docs/concepts/storage/volumes/#flexVolume)、[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/))、またkubectlで利用されています。

下図は、それぞれの拡張ポイントが、Kubernetesのコントロールプレーンとどのように関わっているかを示しています。

@@ -75,12 +75,12 @@ Webhookのモデルでは、Kubernetesは外部のサービスを呼び出しま
<!-- image source diagrams: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

1.   ユーザーは頻繁に`kubectl`を使って、Kubernetes APIとやり取りをします。[Kubectlプラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)は、kubectlのバイナリを拡張します。これは個別ユーザーのローカル環境のみに影響を及ぼすため、サイト全体にポリシーを強制することはできません。
2.   APIサーバーは全てのリクエストを処理します。APIサーバーのいくつかの拡張ポイントは、リクエストを認可する、コンテキストに基づいてブロックする、リクエストを編集する、そして削除を処理することを可能にします。これらは[APIアクセスエクステンション](/docs/concepts/overview/extending#api-access-extensions)セクションに記載されています。
3.   APIサーバーは様々な種類の *リソース* を扱います。`Pod`のような *ビルトインリソース* はKubernetesプロジェクトにより定義され、変更できません。ユーザーも、自身もしくは、他のプロジェクトで定義されたリソースを追加することができます。それは *カスタムリソース* と呼ばれ、[カスタムリソース](/docs/concepts/overview/extending#user-defined-types)セクションに記載されています。カスタムリソースは度々、APIアクセスエクステンションと一緒に使われます。
4.   KubernetesのスケジューラーはPodをどのノードに配置するかを決定します。スケジューリングを拡張するには、いくつかの方法があります。それらは[スケジューラーエクステンション](/docs/concepts/overview/extending#scheduler-extensions)セクションに記載されています。
2.   APIサーバーは全てのリクエストを処理します。APIサーバーのいくつかの拡張ポイントは、リクエストを認可する、コンテキストに基づいてブロックする、リクエストを編集する、そして削除を処理することを可能にします。これらは[APIアクセスエクステンション](/docs/concepts/extend-kubernetes/#api-access-extensions)セクションに記載されています。
3.   APIサーバーは様々な種類の *リソース* を扱います。`Pod`のような *ビルトインリソース* はKubernetesプロジェクトにより定義され、変更できません。ユーザーも、自身もしくは、他のプロジェクトで定義されたリソースを追加することができます。それは *カスタムリソース* と呼ばれ、[カスタムリソース](/docs/concepts/extend-kubernetes/#user-defined-types)セクションに記載されています。カスタムリソースは度々、APIアクセスエクステンションと一緒に使われます。
4.   KubernetesのスケジューラーはPodをどのノードに配置するかを決定します。スケジューリングを拡張するには、いくつかの方法があります。それらは[スケジューラーエクステンション](/docs/concepts/extend-kubernetes/#scheduler-extensions)セクションに記載されています。
5.   Kubernetesにおける多くの振る舞いは、APIサーバーのクライアントであるコントローラーと呼ばれるプログラムに実装されています。コントローラーは度々、カスタムリソースと共に使われます。
6.   kubeletはサーバー上で実行され、Podが仮想サーバーのようにクラスターネットワーク上にIPを持った状態で起動することをサポートします。[ネットワークプラグイン](/docs/concepts/overview/extending#network-plugins)がPodのネットワーキングにおける異なる実装を適用することを可能にします。
7.   kubeletはまた、コンテナのためにボリュームをマウント、アンマウントします。新しい種類のストレージは[ストレージプラグイン](/docs/concepts/overview/extending#storage-plugins)を通じてサポートされます。
6.   kubeletはサーバー上で実行され、Podが仮想サーバーのようにクラスターネットワーク上にIPを持った状態で起動することをサポートします。[ネットワークプラグイン](/docs/concepts/extend-kubernetes/#network-plugins)がPodのネットワーキングにおける異なる実装を適用することを可能にします。
7.   kubeletはまた、コンテナのためにボリュームをマウント、アンマウントします。新しい種類のストレージは[ストレージプラグイン](/docs/concepts/extend-kubernetes/#storage-plugins)を通じてサポートされます。

もしあなたがどこから始めるべきかわからない場合、このフローチャートが役立つでしょう。一部のソリューションは、いくつかの種類のエクステンションを含んでいることを留意してください。

@@ -95,11 +95,11 @@ Webhookのモデルでは、Kubernetesは外部のサービスを呼び出しま

カスタムリソースはアプリケーション、ユーザー、監視データのデータストレージとしては使わないで下さい。

カスタムリソースに関するさらなる情報は、[カスタムリソースコンセプトガイド](/docs/concepts/api-extension/custom-resources/)を参照して下さい。
カスタムリソースに関するさらなる情報は、[カスタムリソースコンセプトガイド](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)を参照して下さい。

### 新しいAPIと自動化機能の連携

カスタムリソースAPIと制御ループの組み合わせは[オペレーターパターン](/docs/concepts/extend-kubernetes/operator/)と呼ばれています。オペレーターパターンは、通常ステートフルな特定のアプリケーションを管理するために利用されます。これらのカスタムAPIと制御ループは、ストレージ、またはポリシーのような他のリソースを管理するためにも利用されます。
カスタムリソースAPIと制御ループの組み合わせは[オペレーターパターン](/ja/docs/concepts/extend-kubernetes/operator/)と呼ばれています。オペレーターパターンは、通常ステートフルな特定のアプリケーションを管理するために利用されます。これらのカスタムAPIと制御ループは、ストレージ、またはポリシーのような他のリソースを管理するためにも利用されます。

### ビルトインリソースの変更

@@ -111,11 +111,11 @@ Webhookのモデルでは、Kubernetesは外部のサービスを呼び出しま

これらの各ステップごとに拡張ポイントが用意されています。

Kubdernetesはいくつかのビルトイン認証方式をサポートしています。それは認証プロキシの後ろに配置することも可能で、認可ヘッダーを通じて(Webhookの)検証のために外部サービスにトークンを送ることもできます。全てのこれらの方法は[認証ドキュメント](/docs/reference/access-authn-authz/authentication/)でカバーされています。
Kubdernetesはいくつかのビルトイン認証方式をサポートしています。それは認証プロキシの後ろに配置することも可能で、認可ヘッダーを通じて(Webhookの)検証のために外部サービスにトークンを送ることもできます。全てのこれらの方法は[認証ドキュメント](/ja/docs/reference/access-authn-authz/authentication/)でカバーされています。

### 認証

[認証](/docs/reference/access-authn-authz/authentication/)は、全てのリクエストのヘッダーまたは証明書情報を、リクエストを投げたクライアントのユーザー名にマッピングします。
[認証](/ja/docs/reference/access-authn-authz/authentication/)は、全てのリクエストのヘッダーまたは証明書情報を、リクエストを投げたクライアントのユーザー名にマッピングします。

Kubernetesはいくつかのビルトイン認証方式と、それらが要件に合わない場合、[認証Webhook](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)を提供します。

@@ -134,19 +134,19 @@ Kubernetesはいくつかのビルトイン認証方式と、それらが要件

### ストレージプラグイン

[Flex Volumes](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/storage/flexvolume-deployment.md)は、Kubeletがバイナリプラグインを呼び出してボリュームをマウントすることにより、ユーザーはビルトインのサポートなしでボリュームタイプをマウントすることを可能にします。
[Flex Volumes](/docs/concepts/storage/volumes/#flexVolume)は、Kubeletがバイナリプラグインを呼び出してボリュームをマウントすることにより、ユーザーはビルトインのサポートなしでボリュームタイプをマウントすることを可能にします。

### デバイスプラグイン

[デバイスプラグイン](/docs/concepts/cluster-administration/device-plugins/)を通じて、ノードが新たなノードのリソース(CPU、メモリなどのビルトインのものに加え)を見つけることを可能にします。
[デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)を通じて、ノードが新たなノードのリソース(CPU、メモリなどのビルトインのものに加え)を見つけることを可能にします。

### ネットワークプラグイン

他のネットワークファブリックが[ネットワークプラグイン](/docs/admin/network-plugins/)を通じてサポートされます。
他のネットワークファブリックが[ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)を通じてサポートされます。

### スケジューラーエクステンション

スケジューラーは特別な種類のコントローラーで、Podを監視し、Podをノードに割り当てます。デフォルトのコントローラーを完全に置き換えることもできますが、他のKubernetesのコンポーネントの利用を継続する、または[複数のスケジューラー](/docs/tasks/administer-cluster/configure-multiple-schedulers/)を同時に動かすこともできます。
スケジューラーは特別な種類のコントローラーで、Podを監視し、Podをノードに割り当てます。デフォルトのコントローラーを完全に置き換えることもできますが、他のKubernetesのコンポーネントの利用を継続する、または[複数のスケジューラー](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/)を同時に動かすこともできます。

これはかなりの大きな作業で、ほとんど全てのKubernetesユーザーはスケジューラーを変更する必要はありません。

@@ -157,11 +157,11 @@ Kubernetesはいくつかのビルトイン認証方式と、それらが要件
## {{% heading "whatsnext" %}}


* [カスタムリソース](/docs/concepts/api-extension/custom-resources/)についてより深く学ぶ
* [カスタムリソース](/ja/docs/concepts/extend-kubernetes/api-extension/custom-resources/)についてより深く学ぶ
* [動的Admission control](/docs/reference/access-authn-authz/extensible-admission-controllers/)について学ぶ
* インフラストラクチャエクステンションについてより深く学ぶ
  * [ネットワークプラグイン](/docs/concepts/cluster-administration/network-plugins/)
  * [デバイスプラグイン](/docs/concepts/cluster-administration/device-plugins/)
  * [ネットワークプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [デバイスプラグイン](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
* [kubectlプラグイン](/docs/tasks/extend-kubectl/kubectl-plugins/)について学ぶ
* [オペレーターパターン](/docs/concepts/extend-kubernetes/operator/)について学ぶ
