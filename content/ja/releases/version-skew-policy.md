---
title: バージョンスキューポリシー
type: docs
description: >
  さまざまなKubernetesコンポーネント間でサポートされる最大のバージョンスキュー。
---

<!-- overview -->
このドキュメントでは、さまざまなKubernetesコンポーネント間でサポートされる最大のバージョンの差異(バージョンスキュー)について説明します。特定のクラスターデプロイツールは、バージョンの差異に追加の制限を加える場合があります。


<!-- body -->

## サポートされるバージョン {#supported-versions}

Kubernetesのバージョンは**x.y.z**の形式で表現され、**x**はメジャーバージョン、**y**はマイナーバージョン、**z**はパッチバージョンを指します。これは[セマンティック バージョニング](https://semver.org/)に従っています。詳細は、[Kubernetesのリリースバージョニング](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)を参照してください。

Kubernetesプロジェクトでは、最新の3つのマイナーリリースについてリリースブランチを管理しています ({{< skew latestVersion >}}, {{< skew prevMinorVersion >}}, {{< skew oldestMinorVersion >}})。

セキュリティフィックスを含む適用可能な修正は、重大度や実行可能性によってはこれら3つのリリースブランチにバックポートされることもあります。パッチリリースは、これらのブランチから [定期的に](https://kubernetes.io/releases/patch-releases/#cadence) 切り出され、必要に応じて追加の緊急リリースも行われます。

 [リリースマネージャー](https://git.k8s.io/sig-release/release-managers.md)グループがこれを決定しています。

詳細は、[Kubernetesパッチリリース](https://github.com/kubernetes/sig-release/blob/master/releases/patch-releases.md)ページを参照してください。


## サポートされるバージョンの差異

### kube-apiserver

[高可用性 (HA) クラスター](/ja/docs/setup/production-environment/tools/independent/high-availability/)では、最新および最古の`kube-apiserver`インスタンスがそれぞれ1つのマイナーバージョン内でなければなりません。

例:

* 最新の`kube-apiserver`が**{{< skew latestVersion >}}**であるとします
* ほかの`kube-apiserver`インスタンスは**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**がサポートされます

### kubelet

`kubelet`は`kube-apiserver`より新しいものであってはならず、2つの古いマイナーバージョンまで有効です。

例:

* `kube-apiserver`が**{{< skew latestVersion >}}**であるとします
* `kubelet`は**{{< skew latestVersion >}}**、**{{< skew prevMinorVersion >}}**および**{{< skew oldestMinorVersion >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンの差異がある場合、有効な`kubelet`のバージョンは少なくなります。
{{</ note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew latestVersion >}}**および**1.12**であるとします
* `kubelet`は**{{< skew prevMinorVersion >}}**および**{{< skew oldestMinorVersion >}}**がサポートされます（**{{< skew latestVersion >}}**はバージョン**{{< skew prevMinorVersion >}}**の`kube-apiserver`よりも新しくなるためサポートされません)

### kube-controller-manager、kube-scheduler、およびcloud-controller-manager

`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は、通信する`kube-apiserver`インスタンスよりも新しいバージョンであってはなりません。`kube-apiserver`のマイナーバージョンと一致することが期待されますが、1つ古いマイナーバージョンでも可能です(ライブアップグレードを可能にするため)。

例:

* `kube-apiserver`が**{{< skew latestVersion >}}**であるとします
* `kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンの差異があり、これらのコンポーネントがクラスター内のいずれかの`kube-apiserver`と通信する場合(たとえばロードバランサーを経由して)、コンポーネントの有効なバージョンは少なくなります。
{{< /note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**であるとします
* いずれかの`kube-apiserver`インスタンスへ配信するロードバランサーと通信する`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は**{{< skew prevMinorVersion >}}**がサポートされます(**{{< skew latestVersion >}}**はバージョン**{{< skew prevMinorVersion >}}**の`kube-apiserver`よりも新しくなるためサポートされません)

### kubectl

`kubectl`は`kube-apiserver`の1つ以内のバージョン(古い、または新しいもの)をサポートします。

例:

* `kube-apiserver`が**{{< skew latestVersion >}}**であるとします
* `kubectl`は**{{< skew nextMinorVersion >}}**、**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンの差異がある場合、有効な`kubectl`バージョンは少なくなります。
{{< /note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**であるとします
* `kubectl`は**{{< skew latestVersion >}}**および**{{< skew prevMinorVersion >}}**がサポートされます(ほかのバージョンでは、ある`kube-apiserver`コンポーネントからマイナーバージョンが2つ以上離れる可能性があります)

## サポートされるコンポーネントのアップグレード順序

コンポーネント間でサポートされるバージョンの差異は、コンポーネントをアップグレードする順序に影響されます。このセクションでは、既存のクラスターをバージョン**{{< skew prevMinorVersion >}}**から**{{< skew latestVersion >}}** へ移行するために、コンポーネントをアップグレードする順序を説明します。

### kube-apiserver

前提条件:

* シングルインスタンスのクラスターにおいて、既存の`kube-apiserver`インスタンスは**{{< skew prevMinorVersion >}}**とします
* HAクラスターにおいて、既存の`kube-apiserver`は**{{< skew prevMinorVersion >}}**または**{{< skew latestVersion >}}** とします(最新と最古の間で、最大で1つのマイナーバージョンの差異となります)
* サーバーと通信する`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`はバージョン**{{< skew prevMinorVersion >}}**とします(必ず既存のAPIサーバーのバージョンよりも新しいものでなく、かつ新しいAPIサーバーのバージョンの1つ以内のマイナーバージョンとなります)
* すべてのノードの`kubelet`インスタンスはバージョン**{{< skew prevMinorVersion >}}**または**{{< skew oldestMinorVersion >}}** とします(必ず既存のAPIサーバーよりも新しいバージョンでなく、かつ新しいAPIサーバーのバージョンの2つ以内のマイナーバージョンとなります)
* 登録されたAdmission webhookは、新しい`kube-apiserver`インスタンスが送信するこれらのデータを扱うことができます:
  * `ValidatingWebhookConfiguration`および`MutatingWebhookConfiguration`オブジェクトは、**{{< skew latestVersion >}}** で追加されたRESTリソースの新しいバージョンを含んで更新されます(または、v1.15から利用可能な[`matchPolicy: Equivalent`オプション](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)を使用してください)
  * Webhookは送信されたRESTリソースの新しいバージョン、および**{{< skew latestVersion >}}** のバージョンで追加された新しいフィールドを扱うことができます

`kube-apiserver`を**{{< skew latestVersion >}}** にアップグレードしてください。

{{< note >}}
[非推奨API](/docs/reference/using-api/deprecation-policy/)および[APIの変更ガイドライン](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)のプロジェクトポリシーにおいては、シングルインスタンスの場合でも`kube-apiserver`のアップグレードの際にマイナーバージョンをスキップしてはなりません。
{{< /note >}}

### kube-controller-manager、kube-scheduler、およびcloud-controller-manager

前提条件:

* これらのコンポーネントと通信する`kube-apiserver`インスタンスが**{{< skew latestVersion >}}** であること(これらのコントロールプレーンコンポーネントが、クラスター内の`kube-apiserver`インスタンスと通信できるHAクラスターでは、これらのコンポーネントをアップグレードする前にすべての`kube-apiserver`インスタンスをアップグレードしなければなりません)

`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`を**{{< skew latestVersion >}}** にアップグレードしてください。

### kubelet

前提条件:

* `kubelet`と通信する`kube-apiserver`が**{{< skew latestVersion >}}** であること

必要に応じて、`kubelet`インスタンスを**{{< skew latestVersion >}}** にアップグレードしてください(**{{< skew prevMinorVersion >}}**や**{{< skew oldestMinorVersion >}}** のままにすることもできます)。

{{< warning >}}
`kube-apiserver`と2つのマイナーバージョンの`kubelet`インスタンスを使用してクラスターを実行させることは推奨されません:

* コントロールプレーンをアップグレードする前に、インスタンスを`kube-apiserver`の1つのマイナーバージョン内にアップグレードさせる必要があります
* メンテナンスされている3つのマイナーリリースよりも古いバージョンの`kubelet`を実行する可能性が高まります
{{</ warning >}}



### kube-proxy

* `kube-proxy`のマイナーバージョンはノード上の`kubelet`と同じマイナーバージョンでなければなりません
* `kube-proxy`は`kube-apiserver`よりも新しいものであってはなりません
* `kube-proxy`のマイナーバージョンは`kube-apiserver`のマイナーバージョンよりも2つ以上古いものでなければなりません

例:

`kube-proxy`のバージョンが**{{< skew oldestMinorVersion >}}**の場合:

* `kubelet`のバージョンは**{{< skew oldestMinorVersion >}}**でなければなりません
* `kube-apiserver`のバージョンは**{{< skew oldestMinorVersion >}}**と**{{< skew latestVersion >}}**の間でなければなりません
