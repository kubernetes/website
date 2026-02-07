---
layout: blog
title: 'Kubernetes v1.31 における削除および主な変更点'
date: 2024-07-19
slug: kubernetes-1-31-upcoming-changes
author: >
  Abigail McCarthy,
  Edith Puclla,
  Matteo Bianchi,
  Rashan Smith,
  Yigit Demirbas 
---

Kubernetes は継続的に進化・成熟しており、プロジェクト全体の健全性を維持するために、機能が非推奨（deprecated）となったり、削除されたり、より良いものに置き換えられることがあります。  
本記事では、Kubernetes v1.31 リリースに向けて予定されている変更点のうち、リリースチームが Kubernetes 環境の継続的な運用・保守の観点から把握しておくべきと考えている内容を紹介します。  
以下に記載されている情報は、v1.31 リリースの現時点での状況に基づいています。  
実際のリリース日までに変更される可能性があります。

## Kubernetes API の削除および非推奨プロセス

Kubernetes プロジェクトには、機能に関する十分に文書化された [非推奨ポリシー](/docs/reference/using-api/deprecation-policy/) があります。  
このポリシーでは、安定版 API は、それより新しい安定版 API が利用可能になった場合にのみ非推奨とできること、また API には安定性レベルごとに最低限の存続期間が定められていることが規定されています。

非推奨となった API は、将来の Kubernetes リリースで削除される予定としてマークされます。  
削除されるまでは（非推奨となってから少なくとも 1 年間）引き続き動作しますが、使用時には警告が表示されます。  
削除された API は現行バージョンでは利用できなくなるため、代替手段への移行が必要です。

* Generally Available（GA）または安定版の API バージョンは非推奨としてマークされることはありますが、Kubernetes のメジャーバージョン内で削除されることはありません。

* Beta またはプレリリースの API バージョンは、非推奨後 3 リリースの間サポートされる必要があります。

* Alpha または実験的な API バージョンは、事前の非推奨通知なしに、いずれのリリースでも削除される可能性があります。

機能がベータ版から安定版へ昇格した場合や、その API が採用されなかった場合など、API が削除される理由に関わらず、すべての削除はこの非推奨ポリシーに準拠しています。  
API が削除される際には、移行方法が [ドキュメント](/docs/reference/using-api/deprecation-guide/) にて案内されます。

## SHA-1 署名サポートに関する注意

[go1.18](https://go.dev/doc/go1.18#sha1)（2022 年 3 月リリース）以降、`crypto/x509` ライブラリは SHA-1 ハッシュ関数で署名された証明書を拒否するようになりました。  
SHA-1 は安全ではないことが知られており、公開信頼された認証局（CA）では 2015 年以降 SHA-1 証明書は発行されていません。

一方で、Kubernetes の文脈では、Aggregated API Servers や Webhook 用として、プライベート認証局により SHA-1 ハッシュ関数で署名されたユーザー提供の証明書が使用されているケースが依然として存在する可能性があります。  
SHA-1 ベースの証明書に依存している場合は、環境変数に `GODEBUG=x509sha1=1` を設定することで、明示的にサポートを有効化する必要があります。

Go の [GODEBUG に関する互換性ポリシー](https://go.dev/blog/compat) に基づき、`x509sha1` GODEBUG および SHA-1 証明書のサポートは、2025 年前半にリリース予定の [go1.24](https://tip.golang.org/doc/go1.23) で完全に削除される予定です。  
SHA-1 証明書を使用している場合は、早めに移行を開始してください。

SHA-1 サポート終了のタイムライン、Kubernetes が go1.24 を採用する計画、メトリクスや監査ログを用いた SHA-1 証明書利用状況の検出方法については、[Kubernetes issue #125689](https://github.com/kubernetes/kubernetes/issues/125689) を参照してください。

## Kubernetes 1.31 における非推奨および削除項目

### Node の `status.nodeInfo.kubeProxyVersion` フィールドの非推奨化（[KEP 4004](https://github.com/kubernetes/enhancements/issues/4004)）

Node の `.status.nodeInfo.kubeProxyVersion` フィールドは、Kubernetes v1.31 で非推奨となり、将来のリリースで削除される予定です。  
このフィールドの値は正確ではなかった（現在も正確ではない）ため、非推奨とされました。

このフィールドは kubelet によって設定されますが、kubelet は kube-proxy のバージョンや、kube-proxy が実行中かどうかを正確に把握できません。

`DisableNodeKubeProxyVersion` [フィーチャーゲート](/docs/reference/command-line-tools-reference/feature-gates/) は v1.31 ではデフォルトで `true` に設定され、kubelet は関連付けられた Node に対して `.status.kubeProxyVersion` フィールドを設定しなくなります。

### すべての in-tree クラウドプロバイダー統合の削除

[以前の記事](/blog/2024/05/20/completing-cloud-provider-migration/) でも紹介されたとおり、クラウドプロバイダー統合に関する最後の in-tree サポートは、v1.31 リリースの一環として削除されます。  
これはクラウドプロバイダーと統合できなくなることを意味するものではありませんが、今後は **必ず** 外部統合を利用する推奨アプローチを採用する必要があります。  
一部の統合は Kubernetes プロジェクトの一部として提供されており、その他はサードパーティ製ソフトウェアです。

このマイルストーンは、Kubernetes v1.26 から進められてきた、すべてのクラウドプロバイダー統合を Kubernetes コアから外部化するプロセスの完了を示すものです（[KEP-2395](https://github.com/kubernetes/enhancements/blob/master/keps/sig-cloud-provider/2395-removing-in-tree-cloud-providers/README.md)）。  
この変更により、Kubernetes はより真にベンダーニュートラルなプラットフォームへと近づきます。

クラウドプロバイダー統合の詳細については、[v1.29 Cloud Provider Integrations 機能ブログ](/blog/2023/12/14/cloud-provider-integration-changes/) を参照してください。  
また、in-tree コード削除の背景については、[v1.29 非推奨ブログ](/blog/2023/11/16/kubernetes-1-29-upcoming-changes/#removal-of-in-tree-integrations-with-cloud-providers-kep-2395-https-kep-k8s-io-2395) もあわせて確認してください。

### kubelet の `--keep-terminated-pod-volumes` コマンドラインフラグの削除

2017 年に非推奨となった kubelet フラグ `--keep-terminated-pod-volumes` は、v1.31 リリースの一環として削除されます。

詳細については、プルリクエスト [#122082](https://github.com/kubernetes/kubernetes/pull/122082) を参照してください。

### CephFS ボリュームプラグインの削除

[CephFS ボリュームプラグイン](/docs/concepts/storage/volumes/#cephfs) はこのリリースで削除され、`cephfs` ボリュームタイプは使用できなくなります。

代替として、サードパーティ製ストレージドライバーである [CephFS CSI ドライバー](https://github.com/ceph/ceph-csi/) の利用が推奨されます。  
v1.31 へのクラスタアップグレード前に CephFS ボリュームプラグインを使用していた場合は、新しいドライバーを使用するようアプリケーションを再デプロイする必要があります。

CephFS ボリュームプラグインは v1.28 で正式に非推奨となっていました。

### Ceph RBD ボリュームプラグインの削除

v1.31 リリースでは、[Ceph RBD ボリュームプラグイン](/docs/concepts/storage/volumes/#rbd) およびその CSI 移行サポートが削除され、`rbd` ボリュームタイプは使用できなくなります。

代替として、クラスタでは [RBD CSI ドライバー](https://github.com/ceph/ceph-csi/) の使用が推奨されます。  
v1.31 へのアップグレード前に Ceph RBD ボリュームプラグインを使用していた場合は、新しいドライバーを使用するようアプリケーションを再デプロイする必要があります。

Ceph RBD ボリュームプラグインは v1.28 で正式に非推奨となっていました。

### kube-scheduler における非 CSI ボリューム制限制御プラグインの非推奨化

v1.31 リリースでは、すべての非 CSI ボリューム制限制御スケジューラープラグインが非推奨となり、以下を含む一部の既に非推奨となっているプラグインが [デフォルトプラグイン](/docs/reference/scheduling/config/) から削除されます。

- `AzureDiskLimits`
- `CinderLimits`
- `EBSLimits`
- `GCEPDLimits`

これらのボリュームタイプはすでに CSI へ移行されているため、同等の機能を提供できる `NodeVolumeLimits` プラグインの使用が推奨されます。  
[scheduler config](/docs/reference/scheduling/config/) で明示的にこれらの非推奨プラグインを使用している場合は、`NodeVolumeLimits` プラグインへ置き換えてください。

`AzureDiskLimits`、`CinderLimits`、`EBSLimits`、`GCEPDLimits` プラグインは、将来のリリースで完全に削除される予定です。  
これらのプラグインは Kubernetes v1.14 以降非推奨となっているため、デフォルトのスケジューラープラグイン一覧から削除されます。

## 今後の予定

[Kubernetes v1.32](/docs/reference/using-api/deprecation-guide/#v1-32) で予定されている API 削除の公式一覧には、以下が含まれます。

* FlowSchema および PriorityLevelConfiguration の `flowcontrol.apiserver.k8s.io/v1beta3` API バージョンは削除されます。  
これに備えて、既存のマニフェストを編集し、クライアントソフトウェアを v1.29 以降で利用可能な `flowcontrol.apiserver.k8s.io/v1` API バージョンを使用するよう書き換えてください。  
既存の永続化されたオブジェクトはすべて、新しい API を通じて引き続き利用できます。

`flowcontrol.apiserver.k8s.io/v1beta3` における主な変更点として、PriorityLevelConfiguration の `spec.limited.nominalConcurrencyShares` フィールドは、未指定の場合のみデフォルトで 30 が設定され、明示的に 0 が指定された場合は 30 に変更されない点が挙げられます。

詳細については、[API 非推奨ガイド](/docs/reference/using-api/deprecation-guide/#v1-32) を参照してください。

## さらに詳しく知りたい方へ

Kubernetes のリリースノートでは、非推奨項目が随時アナウンスされます。  
Kubernetes v1.31 における非推奨項目についても、リリースの CHANGELOG の一部として正式に発表されます。

* [Kubernetes v1.30](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.30.md#deprecation)

* [Kubernetes v1.29](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.29.md#deprecation)

* [Kubernetes v1.28](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.28.md#deprecation)

* [Kubernetes v1.27](https://github.com/kubernetes/kubernetes/blob/master/CHANGELOG/CHANGELOG-1.27.md#deprecation)
