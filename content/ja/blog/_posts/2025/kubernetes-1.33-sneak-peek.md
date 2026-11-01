---
layout: blog
title: 'Kubernetes v1.33の先行紹介'
date: 2025-03-26T10:30:00-08:00
slug: kubernetes-v1-33-upcoming-changes
author: >
  Agustina Barbetta,
  Aakanksha Bhende,
  Udi Hofesh,
  Ryota Sawada,
  Sneha Yadav
translator: >
  [Takuya Kitamura](https://github.com/kfess)
---

Kubernetes v1.33のリリースが近づく中で、Kubernetesプロジェクトは進化を続けています。
プロジェクト全体の健全性を高めるために、一部の機能が非推奨となったり、削除または置き換えられたりする可能性があります。
本ブログ記事では、v1.33リリースに向けて計画されている変更の一部を紹介します。
これらは、Kubernetes環境を安定して運用し、最新の開発動向を把握し続けるために、リリースチームが特に知っておくべきであると考えている情報です。
以下の情報は、v1.33リリースの現時点の状況に基づいており、正式リリースまでに変更される可能性があります。

## Kubernetes APIの削除および非推奨プロセス

Kubernetesプロジェクトでは、機能の[非推奨ポリシー](/ja/docs/reference/using-api/deprecation-policy/)が明確に文書化されています。
このポリシーでは、安定版のAPIを非推奨とするには同じAPIの新たな安定版が存在していることが条件とされています。
また、APIの安定性レベルごとに最低限のサポート期間が定められています。
非推奨となったAPIは、将来のKubernetesリリースで削除される予定であることを示しています。
削除までは引き続き動作しますが(非推奨から少なくとも1年間は利用可能です)、利用時には警告メッセージが表示されます。
削除されたAPIは現在のバージョンでは利用できなくなり、その時点で代替手段への移行が必須となります。

* 一般公開版(GA)または安定版のAPIバージョンが非推奨となる可能性はありますが、Kubernetesの同一のメジャーバージョン内で削除されてはなりません。

* ベータ版やプレリリースのAPIバージョンは、非推奨となってから3つのリリース分はサポートされなければなりません。

* アルファ版または実験的なAPIバージョンは、事前の非推奨通知なしに任意のリリースで削除される可能性があります。すでに同一の機能に対して別の実装が存在する場合、このプロセスは「撤回」と見なされることがあります。

機能がベータ版から安定版へ昇格した結果としてAPIが削除される場合でも、単にそのAPIが定着しなかった場合でも、すべての削除はこの非推奨ポリシーに準拠して実施されます。
APIが削除される際には、移行手段が[非推奨ガイド](/docs/reference/using-api/deprecation-guide/)内で案内されます。

## Kubernetes v1.33における非推奨と削除

### 安定版Endpoints APIの非推奨化

[EndpointSlices](/docs/concepts/services-networking/endpoint-slices/) APIはv1.21から安定版となっており、実質的に従来のEndpoints APIを置き換える存在となっています。
元のEndpoints APIはシンプルで分かりやすい設計でしたが、大規模なネットワークエンドポイントにスケールする際に課題がありました。
EndpointSlices APIはデュアルスタックネットワーク対応などの新機能を導入しており、これにより従来のEndpoints APIは非推奨とする準備が整いました。

今回の非推奨は、ワークロードやスクリプトからEndpoints APIを直接使用しているユーザーのみに影響します。
これらのユーザーは、代わりにEndpointSliceの使用へ移行する必要があります。
非推奨による影響と移行計画の詳細については、今後数週間以内に専用のブログ記事が公開される予定です。

詳細は[KEP-4974: Deprecate v1.Endpoints](https://kep.k8s.io/4974)をご覧ください。

### ノードステータスからのkube-proxyバージョン情報の削除

[リリースアナウンス](/blog/2024/07/19/kubernetes-1-31-upcoming-changes/#deprecation-of-status-nodeinfo-kubeproxyversion-field-for-nodes-kep-4004-https-github-com-kubernetes-enhancements-issues-4004)で示されたとおり、v1.31で非推奨となった`status.nodeInfo.kubeProxyVersion`フィールドは、v1.33で削除されます。
このフィールドはkubeletによって設定されていましたが、その値は一貫して正確とは限りませんでした。
v1.31以降、このフィールドはデフォルトで無効化されているため、v1.33では完全に削除されます。


詳細は[KEP-4004: Deprecate status.nodeInfo.kubeProxyVersion field](https://kep.k8s.io/4004)をご覧ください。


### Windows Podにおけるホストネットワーク対応の削除

Windows Podのネットワーク機能は、Linuxと同等の機能を提供し、コンテナがノードのネットワーク名前空間を使用できるようにすることで、クラスター密度の向上を目指していました。
この機能の初期実装はv1.26でアルファ版として導入されましたが、containerdに関する予期せぬ挙動が確認され、また代替手段も存在していたことから、Kubernetesプロジェクトは関連するKEPの撤回を決定しました。
v1.33において、この機能のサポートは完全に削除される見込みです。

詳細は[KEP-3503: Host network support for Windows pods](https://kep.k8s.io/3503)をご覧ください。


## Kubernetes v1.33の注目すべき変更点

本記事の執筆者として、私たちは特に注目すべき重要な改善点を1つ選びました！


### Linux Podにおけるユーザー名前空間のサポート

現在もオープンなKEPの中で最も古いものの一つが、[KEP-127](https://kep.k8s.io/127)「Podに対してLinux[ユーザー名前空間](/docs/concepts/workloads/pods/user-namespaces/)を使用することによるセキュリティの改善」です。このKEPは2016年後半に初めて提案され、複数回の改訂を経てv1.25でアルファ版として登場し、v1.30で初めてベータ版が提供されました(この時点ではデフォルトで無効)。そしてv1.33では、この機能がデフォルトで有効な状態で提供される予定です。

この機能は、明示的に`pod.spec.hostUsers`を指定して有効化しない限り、既存のPodには影響しません。
[Kubernetes v1.30をそっと覗く](/ja/blog/2024/03/12/kubernetes-1-30-upcoming-changes/)でも触れられているように、この機能は脆弱性の軽減に向けた重要なマイルストーンとなります。

詳細は[KEP-127: Support User Namespaces in pods](https://kep.k8s.io/127)をご覧ください。

## その他の注目すべきKubernetes v1.33の改善点

以下に挙げる改善項目は、今後リリース予定のv1.33に含まれる見込みのものです。
ただし、これらは確定事項ではなく、リリース内容は変更される可能性があります。

### Podの垂直スケーリングに対応したリソースの動的リサイズ

Podをプロビジョニングする際には、DeploymentやStatefulSetなど、さまざまなリソースを利用できます。
スケーラビリティの要件によっては、Podのレプリカ数を更新する水平スケーリング、あるいはPod内のコンテナに割り当てるリソースを更新する垂直スケーリングが必要になる場合があります。
この改善が導入される以前は、Podの`spec`に定義されたコンテナリソースは変更できず、Podテンプレート内のリソースを更新するとPodの置き換えが発生していました。

しかし、既存のPodを再起動せずに、動的にリソース設定を更新できたらどうでしょうか？

[KEP-1287](https://kep.k8s.io/1287)は、まさにこのようなPodのインプレース更新を可能にするためのものです。
これにより、ステートフルなプロセスに対してダウンタイムなしでの垂直スケールアップや、トラフィックが少ないときのシームレスなスケールダウン、さらには起動時に一時的に大きなリソースを割り当て、初期処理が完了した後にそれを縮小するといったことも可能になります。
この機能はv1.27でアルファ版としてリリースされており、v1.33ではベータ版として提供される予定です。

詳細は[KEP-1287: In-Place Update of Pod Resources](https://kep.k8s.io/1287)をご覧ください。

### DRAのResourceClaimにおけるデバイスステータスがベータに昇格

ResourceClaimの`status`内にある`devices`フィールドは、v1.32リリースで導入された機能であり、v1.33でベータに昇格する見込みです。
このフィールドは、ドライバーがデバイスの状態情報を報告できるようにするもので、可観測性とトラブルシューティング能力の向上に貢献します。

例えば、ResourceClaimのステータスにネットワークインターフェースの名前、MACアドレス、IPアドレスを報告することは、ネットワークサービスの設定や管理、ならびにネットワーク関連の問題のデバッグに大いに役立ちます。この機能の詳細は、[動的リソース割り当て](/ja/docs/concepts/scheduling-eviction/dynamic-resource-allocation/#resourceclaim-device-status)のドキュメントをご覧ください。

また、計画中の拡張については[KEP-4817: DRA: Resource Claim Status with possible standardized network interface data](https://kep.k8s.io/4817)に記載されています。

### 名前空間の順序付き削除

このKEPは、Kubernetesの名前空間に対して、より構造化された削除プロセスを導入することで、リソースの安全かつ決定論的な削除を実現することを目的としています。
現在の削除処理はほぼランダムな順序で行われるため、たとえばNetworkPolicyが先に削除されてPodが残るといった、セキュリティ上の問題や意図しない動作を引き起こす可能性があります。
論理的およびセキュリティ上の依存関係を考慮した構造化された削除順序を強制することで、このアプローチはPodが他のリソースより先に削除されることを保証します。
この設計は、非決定的な削除に関連するリスクを軽減することで、Kubernetesのセキュリティと信頼性を向上させます。

詳細は[KEP-5080: Ordered namespace deletion](https://kep.k8s.io/5080)をご覧ください。

### Indexed Job管理の強化

これら2つのKEPは、ジョブの処理、特にIndexed Jobの信頼性を向上させるためにGAに昇格する予定です。
[KEP-3850](https://kep.k8s.io/3850)では、Indexed Jobに対してインデックスごとのバックオフ制限を提供しており、各インデックスが他のインデックスと完全に独立して動作できるようになります。
また、[KEP-3998](https://kep.k8s.io/3998)はJob APIを拡張し、すべてのインデックスが成功していない場合でもIndexed Jobを成功と見なすための条件を定義できるようにします。

詳細は、[KEP-3850: Backoff Limit Per Index For Indexed Jobs](https://kep.k8s.io/3850)および[KEP-3998: Job success/completion policy](https://kep.k8s.io/3998)をご覧ください。

## さらに詳しく知りたい方へ

新機能や非推奨の項目については、Kubernetesのリリースノートでもアナウンスされています。
[Kubernetes v1.33](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.33.md)の新機能については、該当リリースのCHANGELOGにて正式に発表される予定です。

Kubernetes v1.33のリリースは **2025年4月23日(水)** を予定しています。
今後の更新情報にもぜひご注目ください！

以下のリリースノートでも、各バージョンにおける変更点のアナウンスを確認できます。

* [Kubernetes v1.32](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.32.md)

* [Kubernetes v1.31](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.31.md)

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md)

## コミュニティへの参加方法

Kubernetesに関わるための最も簡単な方法は、関心のある分野に関連する[Special Interest Groups](https://github.com/kubernetes/community/blob/master/sig-list.md)(SIGs)のいずれかに参加することです。
Kubernetesコミュニティに向けて発信したい内容がありますか？
もしあれば、毎週開催されている[コミュニティミーティング](https://github.com/kubernetes/community/tree/master/communication)や、下記の各種チャネルを通じて、ぜひ声を届けてください。
皆さまからの継続的なご意見とご支援に、心より感謝申し上げます。

- 最新情報はBlueskyの[@kubernetes.io](https://bsky.app/profile/kubernetes.io)でご確認ください
- [Discuss](https://discuss.kubernetes.io/)でコミュニティのディスカッションに参加しましょう
- [Slack](http://slack.k8s.io/)のコミュニティに参加しましょう
- [Server Fault](https://serverfault.com/questions/tagged/kubernetes)や[Stack Overflow](http://stackoverflow.com/questions/tagged/kubernetes)に質問を投稿したり、他の質問に回答したりしましょう
- あなたのKubernetes[ストーリー](https://docs.google.com/a/linuxfoundation.org/forms/d/e/1FAIpQLScuI7Ye3VQHQTwBASrgkjQDSS5TP0g3AXfFhwSM9YpHgxRKFA/viewform)を共有しましょう
- Kubernetesに関する最新情報は[ブログ](https://kubernetes.io/blog/)をご覧ください
- [Kubernetesリリースチーム](https://github.com/kubernetes/sig-release/tree/master/release-team)について学びましょう
