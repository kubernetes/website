---
title: "セキュリティ"
weight: 85
description: >
  クラウドネイティブなワークロードをセキュアに維持するためのコンセプト
simple_list: true
---

このセクションは、ワークロードをより安全に実行する方法やKubernetesクラスターのセキュリティを保つための重要な観点について学ぶのに役立ちます。

Kubernetesはクラウドネイティブアーキテクチャに基づいており、クラウドネイティブ情報セキュリティのグッドプラクティスについての{{< glossary_tooltip text="CNCF" term_id="cncf" >}} からのアドバイスを参考にしています。

クラスターとクラスター上で実行しているアプリケーションをどのように保護するかについての広い文脈を理解するために[クラウドネイティブセキュリティとKubernetes](/docs/concepts/security/cloud-native-security/)を参照してください。

## Kubernetesセキュリティメカニズム {#security-mechanisms}

KubernetesはいくつかのAPIとセキュリティコントロールを含んでいます。
Kubernetesには、情報セキュリティを管理する方法の一部を構成する[ポリシー](#policies)を定義する方法のほか、いくつかのAPIとセキュリティコントロールが含まれています。

## コントロールプレーンの保護

どのKubernetesのクラスターでも重要なセキュリティメカニズムは[Kubernetes APIへのアクセスコントロール](/ja/docs/concepts/security/controlling-access)です。

Kubernetesでは、コントロールプレーン内やコントロールプレーンとそのクライアント間で[データ転送中の暗号化](/docs/tasks/tls/managing-tls-in-a-cluster/)を提供するために、TLSを設定し使用することが求められます。また、Kubernetesコントロールプレーン内に保存されているデータに対して[保存データの暗号化](/docs/tasks/administer-cluster/encrypt-data/)を有効にすることもできます。これは、自身のワークロードのデータに対して保存データの暗号化を使用することとは別のもので、この方法もまた有効かもしれません。

### Secret

[Secret](/docs/concepts/configuration/secret/) APIは機密性が必要な設定値の基本的な保護を提供します。

### ワークロードの保護

[Podセキュリティ基準](/docs/concepts/security/pod-security-standards/)を順守して、Podやコンテナが適切に独立されるようにします。必要に応じてカスタムの分離を定義するために[RuntimeClass](/ja/docs/concepts/containers/runtime-class)を使用することもできます。

[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)を使用すると、Pod間やPodとクラスター外との通信のネットワークトラフィックを制御できます。

Podやそのコンテナ、それらで実行されるイメージに対して、予防的または検出的なコントロールを実装するために周辺のエコシステムからセキュリティコントロールを導入することができます。

### 監査

Kubernetesの[監査ログ](/ja/docs/tasks/debug/debug-cluster/audit/)はクラスター内でのアクションの一連の流れを時系列で記録し、セキュリティに関連する情報を提供します。クラスターはKubernetes APIを利用するユーザーやアプリケーション、コントロールプレーン自身によって生成されるアクティビティを監査します。

## クラウドプロバイダーのセキュリティ

{{% thirdparty-content vendor="true" %}} 

Kubernetesクラスターを自身のハードウェアや様々クラウドプロバイダーで実行している場合、セキュリティのベストプラクティスのドキュメントを参照してください。以下に、いくつかの主要なクラウドプロバイダーのセキュリティドキュメントへのリンクを示します。

{{< table caption="Cloud provider security" >}}

IaaSプロバイダー        | リンク |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
VMware vSphere | https://www.vmware.com/security/hardening-guides |

{{< /table >}} 

## ポリシー {#policies}

[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)(ネットワークパケットフィルタリングの宣言的制御)や[アドミッションポリシーの検証](/docs/reference/access-authn-authz/validating-admission-policy/) (Kubernetes APIを使用し誰が何を変更できるかの宣言的な制限)などのKubernetesネイティブメカニズムを使用し、セキュリティポリシーを定義することができます。

また、Kubernetesの周辺のエコシステムによるポリシーの実装に頼ることもできます。Kubernetesはエコシステムのプロジェクトに独自のポリシー制御を実装させるための拡張メカニズムを提供します。ソースコードレビューやコンテナイメージの承認、APIアクセスコントロール、ネットワーキングなどをポリシー制御に実装することができます。

## {{% heading "whatsnext" %}} 

関連するKubernetesセキュリティのトピックを学ぶためには:

* [クラスターのセキュリティ](/ja/docs/tasks/administer-cluster/securing-a-cluster/)
* Kubernetesの[既知の脆弱性](/docs/reference/issues-security/official-cve-feed/)(およびさらに詳しい情報へのリンク)
* コントロールプレーンの[データ転送中の暗号化](/docs/tasks/tls/managing-tls-in-a-cluster/)
* [保存データの暗号化](/docs/tasks/administer-cluster/encrypt-data/)
* [Kubernetes APIのアクセス制御](/ja/docs/concepts/security/controlling-access)
* Podのための[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)
* [KubernetesのSecret](/ja/docs/concepts/configuration/secret/)
* [Podセキュリティ基準](/ja/docs/concepts/security/pod-security-standards/)
* [RuntimeClass](/ja/docs/concepts/containers/runtime-class)

背景について学ぶためには:

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [クラウドネイティブセキュリティとKubernetes](/docs/concepts/security/cloud-native-security/)

認定を取得するためには:

* [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/ja/certification/certified-kubernetes-security-specialist/)の認定と公式トレーニングコース

このセクションのさらなる詳細については: 
