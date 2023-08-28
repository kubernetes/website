---
title: kubesprayを使ったKubernetesのインストール
content_type: concept
weight: 30
---

<!-- overview -->

このクイックスタートは、[Kubespray](https://github.com/kubernetes-sigs/kubespray)を使用して、GCE、Azure、OpenStack、AWS、vSphere、Equinix Metal(以前のPacket)、Oracle Cloud Infrastructure(実験的)またはベアメタルにホストされたKubernetesクラスターをインストールするためのものです。

Kubesprayは、汎用的なOSやKubernetesクラスターの構成管理タスクのための[Ansible](https://docs.ansible.com/)プレイブック、[インベントリー](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md#inventory)、プロビジョニングツール、ドメインナレッジをまとめたものです。

Kubesprayは次を提供します:

* 高可用性クラスター。
* 構成可能(例えばネットワークプラグインの選択)。
* 最もポピュラーなLinuxディストリビューションのサポート:
  - Flatcar Container Linux by Kinvolk
  - Debian Bullseye, Buster, Jessie, Stretch
  - Ubuntu 16.04, 18.04, 20.04, 22.04
  - CentOS/RHEL 7, 8, 9
  - Fedora 35, 36
  - Fedora CoreOS
  - openSUSE Leap 15.x/Tumbleweed
  - Oracle Linux 7, 8, 9
  - Alma Linux 8, 9
  - Rocky Linux 8, 9
  - Kylin Linux Advanced Server V10
  - Amazon Linux 2
* 継続的インテグレーションテスト。

あなたのユースケースに最適なツールの選択には、[kubeadm](/docs/reference/setup-tools/kubeadm/)や[kops](/docs/setup/production-environment/tools/kops/)と[比較したドキュメント](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md)を参照してください。



<!-- body -->

## クラスターの作成

### (1/5) 下地の要件の確認

次の[要件](https://github.com/kubernetes-sigs/kubespray#requirements)に従ってサーバーをプロビジョニングします:

* **Kubernetesの最低必要バージョンはv1.22**
* **Ansibleのコマンドを実行するマシン上にAnsible v2.11+、Jinja 2.11+とpython-netaddrがインストールされていること**
* ターゲットサーバーはdockerイメージをpullするために**インターネットにアクセスできる**必要があります。そうでは無い場合は追加の構成が必要です([オフライン環境](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md)を参照)
* ターゲットのサーバーは**IPv4フォワーディング**ができるように構成されていること。
* PodとServiceにIPv6を使用している場合は、ターゲットサーバーは**IPv6フォワーディング**ができるように構成されていること。
* **ファイアウォールは管理されないため**、従来のように独自のルールを実装しなければなりません。デプロイ中の問題を避けるためには、ファイアウォールを無効にすべきです
* root以外のユーザーアカウントでkubesprayを実行する場合は、ターゲットサーバー上で特権昇格の方法を正しく構成されている必要があります。そして、`ansible_become`フラグ、またはコマンドパラメーター`--become`、`-b`を指定する必要があります

Kubesprayは環境のプロビジョニングを支援するために次のユーティリティを提供します:

* 下記のクラウドプロバイダー用の[Terraform](https://www.terraform.io/)スクリプト:
  * [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/openstack)
  * [Equinix Metal](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/equinix)


### (2/5) インベントリーファイルの用意

サーバーをプロビジョニングした後、[Ansibleのインベントリーファイル](https://docs.ansible.com/ansible/latest/network/getting_started/first_inventory.html)を作成します。これは手動またはダイナミックインベントリースクリプトによって行うことができます。詳細については、"[独自のインベントリーを構築する](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory)"を参照してください。

### (3/5) クラスター作成の計画

Kubesprayは多くの点でデプロイメントをカスタマイズする機能を提供します:

* デプロイメントモードの選択: kubeadmまたはnon-kubeadm
* CNI(ネットワーク)プラグイン
* DNS設定
* コントロールプレーンの選択: ネイティブ/バイナリまたはコンテナ化
* コンポーネントバージョン
* Calicoルートリフレクター
* コンポーネントランタイムオプション
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* 証明書の生成方法

Kubesprayは[variableファイル](https://docs.ansible.com/ansible/latest/user_guide/playbooks_variables.html)によってカスタマイズできます。Kubesprayを使い始めたばかりであれば、Kubesprayのデフォルト設定を使用してクラスターをデプロイし、Kubernetesを探索することを検討してください。

### (4/5) クラスターのデプロイ

次にクラスターをデプロイします:

クラスターのデプロイメントには[ansible-playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)を使用します。

```shell
ansible-playbook -i your/inventory/inventory.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```

大規模なデプロイメント(100以上のノード)では、最適な結果を得るために[個別の調整](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md)が必要な場合があります。

### (5/5) デプロイの確認

Kubesprayは、[Netchecker](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/netcheck.md)によるPod間の接続とDNSの解決の検証を行う機能を提供します。Netcheckerは、netchecker-agents Podがdefault名前空間内でDNSリクエストを解決し、互いにpingを送信できることを確かめます。これらのPodは他のワークロードと同様の動作を再現し、クラスターの健全性を示す指標として機能します。

## クラスターの操作

Kubesprayはクラスターを管理する追加のプレイブックを提供します: _scale_ と _upgrade_。

### クラスターのスケール

scaleプレイブックを実行することで、クラスターにワーカーノードを追加することができます。詳細については、"[ノードの追加](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)"を参照してください。
remove-nodeプレイブックを実行することで、クラスターからワーカーノードを削除することができます。詳細については、"[ノードの削除](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)"を参照してください。

### クラスターのアップグレード

upgrade-clusterプレイブックを実行することで、クラスターのアップグレードができます。詳細については、"[アップグレード](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)"を参照してください。

## クリーンアップ


[resetプレイブック](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml)を使用して、ノードをリセットし、Kubesprayでインストールした全てのコンポーネントを消すことができます。

{{< caution >}}
resetプレイブックを実行する際は、誤ってプロダクションのクラスターを対象にしないように気をつけること!
{{< /caution >}}

## フィードバック

* Slackチャンネル: [#kubespray](https://kubernetes.slack.com/messages/kubespray/) ([ここ](https://slack.k8s.io/)から招待をもらうことができます)。
* [GitHub Issues](https://github.com/kubernetes-sigs/kubespray/issues)。



## {{% heading "whatsnext" %}}


* Kubesprayの[ロードマップ](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md)にある作業計画を確認してください。
* [Kubespray](https://github.com/kubernetes-sigs/kubespray)についてさらに学ぶ。
