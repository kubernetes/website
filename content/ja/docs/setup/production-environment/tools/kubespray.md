---
title: kubesprayを使ったKubernetesのインストール
content_type: concept
weight: 30
---

<!-- overview -->

このクイックスタートはGCE、Azure、OpenStack、AWS、vSphere、Packet(ベアメタル)、Oracle Cloud Infrastructure(実験段階)またはベアメタルに上にKubesprayを使ったKubernetesクラスターをインストールするのに役立ちます。

Kubesprayは、一般的なOS/Kubernetesクラスターの構成管理タスクのための[Ansible](http://docs.ansible.com/)プレイブック、[インベントリ](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/ansible.md)、プロビジョニングツール、ドメインナレッジで構成されています。

Kubesprayは以下を提供します:

* 高可用性クラスター
* Kubernetesクラスターの構成変更
* 最も人気なLinuxディストリビューションをサポート
  * Container Linux by CoreOS
  * Debian Buster, Jessie, Stretch, Wheezy
  * Ubuntu 16.04, 18.04
  * CentOS/RHEL/Oracle Linux 7
  * Fedora 28
  * openSUSE Leap 15
* 継続的インテグレーションテスト

あなたのユースケースに最も適したツールを選ぶには、[この比較](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/comparisons.md)と[kubeadm](/docs/admin/kubeadm/)と[kops](/docs/setup/production-environment/tools/kops/)を読んでください。



<!-- body -->

## クラスターの作成

### (1/5) 下地の要件の確認

プロビジョニングを行うサーバーには以下の[要件](https://github.com/kubernetes-sigs/kubespray#requirements)が求められます:

* **Ansible v2.7.8とpython-netaddrがAnsibleコマンドを実行するサーバーにインストールされている必要があります**
* **Ansible Playbooks実行のためにJinja 2.9 (またはそれ以上)が必要です**
* 対象のサーバーはdockerイメージをpullするためにインターネットにアクセスできる必要があります。それ以外の場合は追加の設定が必要です([オフライン環境を参照](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/offline-environment.md))。
* 対象のサーバーには**IPv4フォワーディング**の許可設定が必要です
* **SSHキー**がインベントリのすべてのサーバにコピーされている必要があります
* **ファイアウォールは管理されていない**ので、自分自身で管理する必要があります。デプロイ時の問題を避けるためには、ファイアウォールを無効にする必要があります
* kubesprayをroot以外のユーザアカウントから実行する場合は、対象のサーバで正しい権限昇格方法を設定しておく必要があります。その際 `ansible_become` フラグまたはコマンドパラメータ `--become` または `-b` を指定する必要があります

Kubespray は、環境のプロビジョニングに役立つ以下のユーティリティを提供しています。

* [Terraform](https://www.terraform.io/)の以下のクラウドプロバイダー用のスクリプト:
  * [AWS](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/aws)
  * [OpenStack](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/openstack)
  * [Packet](https://github.com/kubernetes-sigs/kubespray/tree/master/contrib/terraform/packet)

### (2/5) インベントリファイルの用意

サーバをプロビジョニングしたら、[Ansible用のインベントリファイル]((http://docs.ansible.com/ansible/intro_inventory.html))を作成します。これは、手動で行うことも、動的なインベントリスクリプトを使用して行うこともできます。詳細については、[独自のインベントリを作成する]((https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#building-your-own-inventory))を参照してください。

### (3/5) クラスター作成の計画

Kubesprayはデプロイの様々な設定をカスタマイズする機能を提供します:

* デプロイモードの選択: kubeadmまたはnon-kubeadm
* CNI (ネットワーキング)プラグイン
* DNS設定
* コントロールプレーンの選択: バイナリまたはコンテナ化されたコントロールプレーン
* コンポーネントのバージョン
* Calicoのルートリフレクタ
* コンポーネントのコンテナランタイムの選択
  * {{< glossary_tooltip term_id="docker" >}}
  * {{< glossary_tooltip term_id="containerd" >}}
  * {{< glossary_tooltip term_id="cri-o" >}}
* 証明書の生成方法

Kubesprayのカスタマイズは[変数ファイル](http://docs.ansible.com/ansible/playbooks_variables.html)で行うことができます。Kubesprayを使い始めたばかりの方は、Kubesprayのデフォルト設定を使ってクラスターをデプロイし、Kubernetes触ってみることを検討してみてください。

### (4/5) クラスターのデプロイ

次に、クラスターをデプロイします:
クラスターのデプロイには[ansible-playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#starting-custom-deployment)を使用します。

```shell
ansible-playbook -i your/inventory/inventory.ini cluster.yml -b -v \
  --private-key=~/.ssh/private_key
```

大規模なデプロイ（100ノード以上）ではデプロイ速度の最適化や大規模向けの構成のために[設定の調整]((https://github.com/kubernetes-sigs/kubespray/blob/master/docs/large-deployments.md))が必要な場合があります。

### (5/5) デプロイの確認

Kubesprayは、[Netchecker](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/netcheck.md)でポッド間の接続性とDNS解決を検証する方法を提供しています。Netcheckerはnetchecker-agentsポッドがDNSリクエストを解決し、デフォルトの名前空間内でそれぞれのポッドにpingできることを保証します。これらのポッドは、他のワークロードの類似した動作を模倣し、クラスターの健全性を示す指標として機能します。

## クラスターの操作

Kubesprayはクラスターを管理するための追加のplaybookを提供します: _scale_ と _upgrade_ です。

### クラスターのスケール

scale playbookを実行することで、クラスターへワーカーノードを追加することができます。詳細については[ノードの追加](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#adding-nodes)を参照してください。
remove-node playbookを実行することで、クラスターからワーカーノードを削除することができます。詳細については[ノードの削除](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/getting-started.md#remove-nodes)を参照してください。

### クラスターのアップグレード

Upgrade-cluster playbookを実行することで、クラスターをアップグレードすることができます。詳細については[アップグレード](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/upgrades.md)を参照してください。

## クリーンアップ

[reset playbook](https://github.com/kubernetes-sigs/kubespray/blob/master/reset.yml)によってノードをリセットし、Kubesprayでインストールしたコンポーネントを一掃することができます。


{{< caution >}}
reset playbookを実行する際には、誤って本番クラスターをターゲットにしないように注意してください。
{{< /caution >}}

## フィードバック

* Slackチャンネル: [#kubespray](https://kubernetes.slack.com/messages/kubespray/) ([ここ](http://slack.k8s.io/)から招待を受け取れます)
* [GitHub Issues](https://github.com/kubernetes-sigs/kubespray/issues)



## {{% heading "whatsnext" %}}


Kubesprayの[ロードマップ](https://github.com/kubernetes-sigs/kubespray/blob/master/docs/roadmap.md)で予定されている作業をチェックしてみてください。
