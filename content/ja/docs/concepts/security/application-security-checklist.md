---
title: アプリケーションセキュリティチェックリスト
description: >
  アプリケーション開発者を対象とした、Kubernetes上でのアプリケーションセキュリティを確保するための基準となるガイドライン
content_type: concept
weight: 110
---

<!-- overview -->

このチェックリストは、開発者の観点からKubernetes上で動作するアプリケーションのセキュリティ確保に関する基本的なガイドラインを提供することを目的としています。
このリストは包括的なものではなく、時間の経過とともに発展させていくことを意図しています。

<!-- 以下は、Kubernetes管理者向けに作成された既存のチェックリストから引用しています。https://kubernetes.io/docs/concepts/security/security-checklist/ -->

この文書の読み方と使い方について:

- トピックの順序は優先度の順序を反映していません。
- 一部のチェックリスト項目は、各セクションのリストの下の段落で詳しく説明されています。
- このチェックリストでは、`開発者`とはKubernetesクラスターのユーザーで、名前空間スコープのオブジェクトを操作する人を想定しています。

{{< caution >}}
チェックリストだけでは、優れたセキュリティ体制を構築するのに**十分ではありません**。
優れたセキュリティ体制には継続的な注意と改善が必要ですが、チェックリストはセキュリティ対応という終わりのない道のりにおける最初の一歩となり得ます。
このチェックリストの一部の推奨事項は、ユーザーの特定のセキュリティニーズに対して制限が厳しすぎる場合や、逆に緩すぎる場合があります。
Kubernetesセキュリティは「万能」ではないため、チェックリスト項目の各カテゴリはそのメリットに基づいて評価する必要があります。
{{< /caution >}}

<!-- body -->

## ベースセキュリティ強化 {#base-security-hardening}

以下のチェックリストは、Kubernetesにデプロイするほとんどのアプリケーションに適用されるベースセキュリティ強化の推奨事項を提供します。

### アプリケーション設計 {#application-design}

- [ ] アプリケーション設計時に適切な[セキュリティ原則](https://www.cncf.io/wp-content/uploads/2022/06/CNCF_cloud-native-security-whitepaper-May2022-v2.pdf)に従う。
- [ ] リソース要求とリソース制限を通じて適切な{{< glossary_tooltip text="QoSクラス" term_id="QoS-class" >}}でアプリケーションを設定する。
  - [ ] ワークロードにメモリ制限を設定し、制限はメモリ要求以上の値にする。
  - [ ] 機密性の高いワークロードにはCPU制限を設定してもよい。

### サービスアカウント {#service-account}

- [ ] `default` ServiceAccountの使用を避ける。代わりに、各ワークロードまたはマイクロサービス用にServiceAccountを作成する。
- [ ] Podの動作にKubernetes APIへのアクセスが特別に必要でない限り、`automountServiceAccountToken`を`false`に設定する。

### Podレベルの`securityContext`の推奨事項 {#security-context-pod}

- [ ] `runAsNonRoot: true`を設定する。
- [ ] より低い権限のユーザーでコンテナを実行するよう設定し(例えば、`runAsUser`と`runAsGroup`を使用する)、コンテナイメージ内のファイルやディレクトリに適切な権限を設定する。
- [ ] 永続ボリュームにアクセスする場合は、オプションで`fsGroup`を使用して補助グループを追加する。
- [ ] アプリケーションは、適切な[Podセキュリティの標準](/docs/concepts/security/pod-security-standards/)が適用された名前空間にデプロイする。アプリケーションをデプロイするクラスターでこの適用を制御できない場合は、ドキュメント化または追加の多層防御を通じてこれを考慮に入れる。

### コンテナレベルの`securityContext`の推奨事項 {#security-context-container}

- [ ] `allowPrivilegeEscalation: false`を使用して権限昇格を無効にする。
- [ ] `readOnlyRootFilesystem: true`でルートファイルシステムを読み取り専用に設定する。
- [ ] 特権コンテナの実行を避ける(`privileged: false`を設定)。
- [ ] コンテナから全てのケイパビリティを削除し、コンテナの動作に必要な特定のケイパビリティのみを追加し直す。

### ロールベースアクセス制御(RBAC) {#rbac}

- [ ] **create**、**patch**、**update**、**delete**などの権限は、必要な場合のみ付与する。
- [ ] [権限昇格](/docs/reference/access-authn-authz/rbac/#privilege-escalation-prevention-and-bootstrapping)につながる可能性があるロールを作成・更新するRBAC権限の作成を避ける。
- [ ] `system:unauthenticated`グループのバインディングを確認し、可能な限り削除する。これにより、ネットワークレベルでAPIサーバーに接続できる全ての人にアクセス権が与えられることを防ぐ。

**create**、**update**、**delete**の権限は慎重に許可する必要があります。
**patch**権限をNamespaceに対して許可すると、[ユーザーが名前空間やデプロイメントのラベルを更新できるようになり](/docs/concepts/security/rbac-good-practices/#namespace-modification)、攻撃対象領域が拡大する可能性があります。

機密性の高いワークロードについては、許可される書き込みアクションをさらに制限する推奨ValidatingAdmissionPolicyの提供を検討してください。

### イメージセキュリティ {#image-security}

- [ ] Kubernetesクラスターにコンテナをデプロイする前に、イメージスキャンツールを使用してイメージをスキャンする。
- [ ] Kubernetesクラスターにデプロイする前に、コンテナ署名を使用してコンテナイメージの署名を検証する。

### ネットワークポリシー {#network-policies}

- [ ] [NetworkPolicy](/docs/concepts/services-networking/network-policies/)を設定して、Podへの内向きのトラフィックとPodからの外向きのトラフィックで、予期されるもののみを許可する。

クラスターがNetworkPolicyを提供し、適用していることを確認してください。
ユーザーが異なるクラスターにデプロイするアプリケーションを作成している場合、NetworkPolicyが利用可能で適用されているとみなすことができるかどうかを確認してください。

## 高度なセキュリティ強化 {#advanced}

このガイドのこのセクションでは、Kubernetes環境の構成に応じて有用となる可能性があるいくつかの高度なセキュリティ強化ポイントについて説明します。

### Linuxコンテナセキュリティ {#linux-container-security}

Podとコンテナ用の{{< glossary_tooltip text="Security Context" term_id="Security-Context" >}}を設定する。

- [ ] [コンテナのSeccompプロファイルを設定する](/docs/tasks/configure-pod-container/security-context/#set-the-seccomp-profile-for-a-container)。
- [ ] [AppArmorを使用してコンテナのリソースアクセスを制限する](/docs/tutorials/security/apparmor/)。
- [ ] [コンテナにSELinuxラベルを割り当てる](/docs/tasks/configure-pod-container/security-context/#assign-selinux-labels-to-a-container)。

### ランタイムクラス {#runtime-classes}

- [ ] コンテナに適切なランタイムクラスを設定する。

{{% thirdparty-content %}}

一部のコンテナは、クラスターのデフォルトランタイムが提供するものとは異なる分離レベルを必要とする場合があります。
`runtimeClassName`をpodspecで使用して、異なるランタイムクラスを定義できます。

機密性の高いワークロードについては、[gVisor](https://gvisor.dev/docs/)などのカーネルエミュレーションツールや、[kata-containers](https://katacontainers.io/)などのメカニズムを使用した仮想化分離の使用を検討してください。

高い信頼性が要求される環境では、クラスターセキュリティをさらに向上させるために[機密仮想マシン](/blog/2023/07/06/confidential-kubernetes/)の使用を検討してください。
