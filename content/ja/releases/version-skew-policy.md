---
title: バージョンスキューポリシー
type: docs
description: >
  さまざまなKubernetesコンポーネント間でサポートされる最大のバージョンスキュー。
---

<!-- overview -->
このドキュメントでは、さまざまなKubernetesコンポーネント間でサポートされる最大のバージョンの差異(バージョンスキュー)について説明します。
特定のクラスターデプロイツールは、バージョンスキューに追加の制限を加える場合があります。

<!-- body -->

## サポートされるバージョン {#supported-versions}

Kubernetesのバージョンは**x.y.z**の形式で表現され、**x**はメジャーバージョン、**y**はマイナーバージョン、**z**はパッチバージョンを指します。
これは[セマンティックバージョニング](https://semver.org/)に従っています。
詳細は、[Kubernetesのリリースバージョニング](https://git.k8s.io/sig-release/release-engineering/versioning.md#kubernetes-release-versioning)を参照してください。

Kubernetesプロジェクトでは、最新の3つのマイナーリリース({{< skew latestVersion >}}、{{< skew prevMinorVersion >}}、{{< skew oldestMinorVersion >}})についてリリースブランチを管理しています。
Kubernetes 1.19以降では、パッチリリースに対して[約1年間のサポート](/releases/patch-releases/#support-period)が提供されます。
Kubernetes 1.18以前のバージョンは約9ヶ月間のパッチサポートが提供されていました。

セキュリティフィックスを含む適用可能な修正は、重大度や実行可能性によってはこれら3つのリリースブランチにバックポートされることもあります。
パッチリリースは、これらのブランチから[定期的に](/releases/patch-releases/#cadence)切り出され、必要に応じて追加の緊急リリースも行われます。

[リリースマネージャー](/releases/release-managers/)グループがこれを決定しています。

詳細は、Kubernetes[パッチリリース](/releases/patch-releases/)ページを参照してください。


## サポートされるバージョンスキュー {#supported-version-skew}

### kube-apiserver

[高可用性(HA)クラスター](/docs/setup/production-environment/tools/kubeadm/high-availability/)では、最新および最古の`kube-apiserver`インスタンスは1つのマイナーバージョン以内でなければなりません。

例:

* 最新の`kube-apiserver`が**{{< skew currentVersion >}}**であるとします
* ほかの`kube-apiserver`インスタンスは**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**がサポートされます

### kubelet

* `kubelet`は`kube-apiserver`より新しいバージョンであってはなりません。
* `kubelet`は`kube-apiserver`より最大で3つ前のマイナーバージョンまでサポートされます(`kubelet` < 1.25の場合は最大2つ前のマイナーバージョンまで)。

例:

* `kube-apiserver`が**{{< skew currentVersion >}}**であるとします
* `kubelet`は**{{< skew currentVersion >}}**、**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}**、および**{{< skew currentVersionAddMinor -3 >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンスキューがある場合、有効な`kubelet`のバージョンは少なくなります。
{{</ note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**であるとします
* `kubelet`は**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}**、および**{{< skew currentVersionAddMinor -3 >}}**がサポートされます(**{{< skew currentVersion >}}**はバージョン**{{< skew currentVersionAddMinor -1 >}}**の`kube-apiserver`よりも新しくなるためサポートされません)

### kube-proxy

* `kube-proxy`は`kube-apiserver`よりも新しいバージョンであってはなりません。
* `kube-proxy`は`kube-apiserver`より最大で3つ前のマイナーバージョンまでサポートされます(`kube-proxy` < 1.25の場合は最大2つ前のマイナーバージョンまで)。
* `kube-proxy`は同一ノードで動作している`kubelet`より最大3マイナーバージョン古くても新しくてもサポートされます(`kube-proxy` < 1.25の場合は2バージョンまで)。

例:

* `kube-apiserver`のバージョンが**{{< skew currentVersion >}}**であるとします
* `kube-proxy`は**{{< skew currentVersion >}}**、**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}**および**{{< skew currentVersionAddMinor -3 >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンスキューがある場合、有効な`kube-proxy`のバージョンは少なくなります。
{{</ note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**であるとします
* `kube-proxy`は**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}**、**{{< skew currentVersionAddMinor -3 >}}**がサポートされます(**{{< skew currentVersion >}}**は、**{{< skew currentVersionAddMinor -1 >}}**の`kube-apiserver`インスタンスよりも新しいためサポートされません)

### kube-controller-manager、kube-scheduler、およびcloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager}

`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は、通信する`kube-apiserver`インスタンスよりも新しいバージョンであってはなりません。
`kube-apiserver`のマイナーバージョンと一致することが期待されますが、1つ古いマイナーバージョンでも可能です(ライブアップグレードを可能にするため)。

例:

* `kube-apiserver`が**{{< skew currentVersion >}}**であるとします
* `kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンスキューがあり、これらのコンポーネントがクラスター内のいずれかの`kube-apiserver`と通信する場合(たとえばロードバランサーを経由して)、コンポーネントの有効なバージョンは少なくなります。
{{< /note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**であるとします
* いずれかの`kube-apiserver`インスタンスへ配信するロードバランサーと通信する`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`は**{{< skew currentVersionAddMinor -1 >}}**がサポートされます(**{{< skew currentVersion >}}**はバージョン**{{< skew currentVersionAddMinor -1 >}}**の`kube-apiserver`よりも新しくなるためサポートされません)

### kubectl

`kubectl`は`kube-apiserver`の1つ以内のバージョン(古い、または新しいバージョン)をサポートします。

例:

* `kube-apiserver`が**{{< skew currentVersion >}}**であるとします
* `kubectl`は**{{< skew currentVersionAddMinor 1 >}}**、**{{< skew currentVersion >}}**、および**{{< skew currentVersionAddMinor -1 >}}**がサポートされます

{{< note >}}
HAクラスター内の`kube-apiserver`間にバージョンスキューがある場合、有効な`kubectl`バージョンは少なくなります。
{{< /note >}}

例:

* `kube-apiserver`インスタンスが**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**であるとします
* `kubectl`は**{{< skew currentVersion >}}**および**{{< skew currentVersionAddMinor -1 >}}**がサポートされます(ほかのバージョンでは、ある`kube-apiserver`コンポーネントからマイナーバージョンが2つ以上離れる可能性があります)

## サポートされるコンポーネントのアップグレード順序 {#supported-component-upgrade-order}

コンポーネント間でサポートされるバージョンスキューは、コンポーネントをアップグレードする順序に影響されます。
このセクションでは、既存のクラスターをバージョン**{{< skew currentVersionAddMinor -1 >}}**からバージョン**{{< skew currentVersion >}}**へ移行するために、コンポーネントをアップグレードする順序を説明します。

任意ですが、アップグレードを準備する際は、アップグレード中にできるだけ多くのリグレッション修正やバグ修正の恩恵を受けられるよう、以下を実施することをKubernetesプロジェクトでは推奨しています:

* コンポーネントが現在のマイナーバージョンの最新のパッチバージョンにあることを確認する。
* コンポーネントを対象のマイナーバージョンの最新のパッチバージョンにアップグレードする。

例えば、{{<skew currentVersionAddMinor -1>}}を実行している場合は、最新のパッチバージョンにあることを確認してください。
その後、{{<skew currentVersion>}}の最新のパッチバージョンにアップグレードしてください。

### kube-apiserver

前提条件:

* シングルインスタンスのクラスターにおいて、既存の`kube-apiserver`インスタンスは**{{< skew currentVersionAddMinor -1 >}}**とします
* HAクラスターにおいて、既存の`kube-apiserver`は**{{< skew currentVersionAddMinor -1 >}}**または**{{< skew currentVersion >}}**とします(最新と最古の間で、最大で1つのマイナーバージョンスキューとなります)
* サーバーと通信する`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`はバージョン**{{< skew currentVersionAddMinor -1 >}}**とします(必ず既存のAPIサーバーのバージョンよりも新しいバージョンでなく、かつ新しいAPIサーバーのバージョンの1つ以内のマイナーバージョンとなります)
* すべてのノードの`kubelet`インスタンスはバージョン**{{< skew currentVersionAddMinor -1 >}}**または**{{< skew currentVersionAddMinor -2 >}}**とします(必ず既存のAPIサーバーよりも新しいバージョンでなく、かつ新しいAPIサーバーのバージョンの2つ以内のマイナーバージョンとなります)
* 登録されたAdmission webhookは、新しい`kube-apiserver`インスタンスが送信するこれらのデータを扱うことができます:
  * `ValidatingWebhookConfiguration`および`MutatingWebhookConfiguration`オブジェクトは、**{{< skew currentVersion >}}**で追加されたRESTリソースの新しいバージョンを含んで更新されます(または、v1.15から利用可能な[`matchPolicy: Equivalent`オプション](/docs/reference/access-authn-authz/extensible-admission-controllers/#matching-requests-matchpolicy)を使用してください)
  * Webhookは送信されたRESTリソースの新しいバージョン、および**{{< skew currentVersion >}}**のバージョンで追加された新しいフィールドを扱うことができます

`kube-apiserver`を**{{< skew currentVersion >}}**にアップグレードしてください。

{{< note >}}
[非推奨API](/docs/reference/using-api/deprecation-policy/)および[APIの変更ガイドライン](https://github.com/kubernetes/community/blob/master/contributors/devel/sig-architecture/api_changes.md)のプロジェクトポリシーにおいては、シングルインスタンスの場合でも`kube-apiserver`のアップグレードの際にマイナーバージョンをスキップしてはなりません。
{{< /note >}}

### kube-controller-manager、kube-scheduler、およびcloud-controller-manager {#kube-controller-manager-kube-scheduler-and-cloud-controller-manager-1}

前提条件:

* これらのコンポーネントと通信する`kube-apiserver`インスタンスが**{{< skew currentVersion >}}**であること(これらのコントロールプレーンコンポーネントが、クラスター内の`kube-apiserver`インスタンスと通信できるHAクラスターでは、これらのコンポーネントをアップグレードする前にすべての`kube-apiserver`インスタンスをアップグレードしなければなりません)

`kube-controller-manager`、`kube-scheduler`および`cloud-controller-manager`を**{{< skew currentVersion >}}**にアップグレードしてください。
`kube-controller-manager`、`kube-scheduler`、`cloud-controller-manager`の間にアップグレードの順序はありません。
これらのコンポーネントはいずれの順序でも、同時にでもアップグレードできます。

### kubelet

前提条件:

* `kubelet`と通信する`kube-apiserver`が**{{< skew currentVersion >}}**であること

必要に応じて、`kubelet`インスタンスを**{{< skew currentVersion >}}**にアップグレードしてください(**{{< skew currentVersionAddMinor -1 >}}**、**{{< skew currentVersionAddMinor -2 >}}**、または**{{< skew currentVersionAddMinor -3 >}}**のままにすることもできます)。

{{< note >}}
マイナーバージョンの`kubelet`をアップグレードする前に、そのノードからPodを[ドレイン](/docs/tasks/administer-cluster/safely-drain-node/)してください。
`kubelet`のマイナーバージョンのインプレースアップグレードはサポートされていません。
{{</ note >}}

{{< warning >}}
`kube-apiserver`より常に3つ前のマイナーバージョンの`kubelet`インスタンスでクラスターを実行する場合、コントロールプレーンをアップグレードする前に`kubelet`をアップグレードしなければなりません。
{{</ warning >}}

### kube-proxy

前提条件:

* `kube-proxy`と通信する`kube-apiserver`インスタンスが**{{< skew currentVersion >}}**であること

必要に応じて、`kube-proxy`インスタンスを**{{< skew currentVersion >}}**にアップグレードしてください(**{{< skew currentVersionAddMinor -1 >}}**や**{{< skew currentVersionAddMinor -2 >}}**、**{{< skew currentVersionAddMinor -3 >}}**のままにすることもできます)。

{{< warning >}}
`kube-apiserver`より常に3つ前のマイナーバージョンで動作している`kube-proxy`インスタンスは、コントロールプレーンをアップグレードする前にアップグレードしなければなりません。
{{</ warning >}}

