---
title: kubeadmクラスターのアップグレード
content_type: task
weight: 30
---

<!-- overview -->

このページでは、kubeadmで作成したKubernetesクラスターをバージョン{{< skew currentVersionAddMinor -1 >}}.xから{{< skew currentVersion >}}.xに、または{{< skew currentVersion >}}.xから{{< skew currentVersion >}}.y (y > x)にアップグレードする方法を説明します。マイナーバージョンを飛ばしてのアップグレードはサポートされていません。詳細は[Version Skew Policy](/releases/version-skew-policy/)を参照してください。

古いバージョンのkubeadmで作成したクラスターのアップグレードについては、次のページを参照してください。

- [{{< skew currentVersionAddMinor -1 >}}から{{< skew currentVersion >}}へのkubeadmクラスターのアップグレード](https://v{{< skew currentVersionAddMinor -1 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [{{< skew currentVersionAddMinor -2 >}}から{{< skew currentVersionAddMinor -1 >}}へのkubeadmクラスターのアップグレード](https://v{{< skew currentVersionAddMinor -2 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [{{< skew currentVersionAddMinor -3 >}}から{{< skew currentVersionAddMinor -2 >}}へのkubeadmクラスターのアップグレード](https://v{{< skew currentVersionAddMinor -3 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)
- [{{< skew currentVersionAddMinor -4 >}}から{{< skew currentVersionAddMinor -3 >}}へのkubeadmクラスターのアップグレード](https://v{{< skew currentVersionAddMinor -4 "-" >}}.docs.kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)

Kubernetesプロジェクトでは最新のパッチリリースへの早めのアップグレードと、サポート対象のマイナーリリースを実行することを推奨しています。これによりセキュリティを維持できます。

アップグレードの大まかなワークフローは次の通りです。

1. プライマリコントロールプレーンノードをアップグレードする。
1. 追加のコントロールプレーンノードをアップグレードする。
1. ワーカーノードをアップグレードする。

## 前提条件{#prerequisites}

- [リリースノート](https://git.k8s.io/kubernetes/CHANGELOG)をよく確認してください。
- クラスターは静的コントロールプレーンとetcd Pod、または外部etcdを使用している必要があります。
- データベースに保存されたアプリケーションレベルの状態など、重要なコンポーネントのバックアップを取ってください。`kubeadm upgrade`はワークロードには触れず、Kubernetes内部のコンポーネントのみを対象としますが、バックアップは常に推奨されます。
- [Swapを無効にする必要があります](https://serverfault.com/questions/684771/best-way-to-disable-swap-in-linux)。

### 追加情報

- 以下の手順は、アップグレード中にいつノードをドレインするかの目安を示しています。kubeletの**マイナー**バージョンアップグレードを行う場合、対象ノードは事前にドレインする必要があります。コントロールプレーンノードの場合、CoreDNS Podや他の重要なワークロードが実行されている可能性があります。詳しくは[ノードのドレイン](/docs/tasks/administer-cluster/safely-drain-node/)を参照してください。
- Kubernetesプロジェクトではkubeletとkubeadmのバージョンを合わせることを推奨しています。kubeadmより古いkubeletを使うことは可能ですが、サポートされているバージョン範囲内である必要があります。詳細は[kubeletに対するkubeadmのバージョンの差異](/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#kubeletに対するkubeadmのバージョンの差異)を参照してください。
- アップグレード後はすべてのコンテナが再起動されます。これはコンテナのハッシュ値が変わるためです。
- kubeletのアップグレード後にkubeletサービスが正常に再起動したことを確認するには、`systemctl status kubelet`を実行するか、`journalctl -xeu kubelet`でサービスログを確認できます。
- `kubeadm upgrade`は`--config`フラグで[`UpgradeConfiguration` API type](/docs/reference/config-api/kubeadm-config.v1beta4)を受け付けます。これによりアップグレードプロセスを構成できます。
- `kubeadm upgrade`は既存クラスターの再構成をサポートしません。既存クラスターの再構成については[Reconfiguring a kubeadm cluster](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure)の手順に従ってください。

### etcdのアップグレードに関する考慮事項

`kube-apiserver`のStatic Podは(ノードをドレインしていても)常に実行されているため、etcdのアップグレードを含むkubeadmアップグレードを実行すると、新しいetcd Static Podが再起動している間にサーバーへの処理中のリクエストが停滞する可能性があります。回避策として、`kubeadm upgrade apply`コマンドを開始する数秒前に`kube-apiserver`プロセスを一時的に停止することが可能です。こうすることで処理中のリクエストを完了させ、既存接続をクローズでき、etcdのダウンタイムの影響を最小限にできます。コントロールプレーンノードでは次のように行います。

```shell
killall -s SIGTERM kube-apiserver # kube-apiserverのグレースフルシャットダウンをトリガーする
sleep 20 # 処理中のリクエストの完了まで少し待つ
kubeadm upgrade ... # kubeadm upgradeコマンドを実行
```

<!-- steps -->

## パッケージリポジトリの変更

- コミュニティが運営するパッケージリポジトリ(`pkgs.k8s.io`)を使用している場合、目的のKubernetesマイナーリリース向けにパッケージリポジトリを有効にする必要があります。詳しくは[Changing The Kubernetes Package Repository](/docs/tasks/administer-cluster/kubeadm/change-package-repository/)を参照してください。

{{% legacy-repos-deprecation %}}

## アップグレード先バージョンを決定する

OSのパッケージマネージャーを使って、Kubernetes {{< skew currentVersion >}}の最新パッチを見つけます。

{{< tabs name="k8s_install_versions" >}}
{{% tab name="Ubuntu、DebianまたはHypriotOS" %}}

```shell
# リスト内の最新の{{< skew currentVersion >}}バージョンを探します。
# 形式は{{< skew currentVersion >}}.x-*のようになります。
sudo apt update
sudo apt-cache madison kubeadm
```

{{% /tab %}}
{{% tab name="CentOS、RHELまたはFedora" %}}

DNFを使うシステム:

```shell
# リスト内の最新の{{< skew currentVersion >}}バージョンを探します。
# 形式は{{< skew currentVersion >}}.x-*のようになります。
sudo yum list --showduplicates kubeadm --disableexcludes=kubernetes
```

DNF5を使うシステム:

```shell
# リスト内の最新の{{< skew currentVersion >}}バージョンを探します。
# 形式は{{< skew currentVersion >}}.x-*のようになります。
sudo yum list --showduplicates kubeadm --setopt=disable_excludes=kubernetes
```

{{% /tab %}}
{{< /tabs >}}

期待するバージョンが表示されない場合は、[Kubernetesパッケージリポジトリが利用されているか確認してください](/docs/tasks/administer-cluster/kubeadm/change-package-repository/#verifying-if-the-kubernetes-package-repositories-are-used)

## コントロールプレーンノードのアップグレード

コントロールプレーンノードのアップグレードはノードごとに順に実行する必要があります。まずアップグレードするコントロールプレーンノードを選んでください。そのノードには`/etc/kubernetes/admin.conf`ファイルが存在する必要があります。

### `kubeadm upgrade`の実行

**最初のコントロールプレーンノードの場合**

1. kubeadmをアップグレードします。

   {{< tabs name="k8s_install_kubeadm_first_cp" >}}
   {{% tab name="Ubuntu、DebianまたはHypriotOS" %}}

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo apt-mark unhold kubeadm && \
   sudo apt-get update && sudo apt-get install -y kubeadm='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubeadm
   ```

   {{% /tab %}}
   {{% tab name="CentOS、RHELまたはFedora" %}}

   DNFを使うシステム:

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   DNF5を使うシステム:

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo yum install -y kubeadm-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. ダウンロードが期待したバージョンであることを確認します。

   ```shell
   kubeadm version
   ```

1. アップグレードプランを確認します。

   ```shell
   sudo kubeadm upgrade plan
   ```

   このコマンドはクラスターがアップグレード可能かどうかをチェックし、アップグレードできるバージョンを取得します。また、コンポーネント設定のバージョン状態を示すテーブルも表示します。

   {{< note >}}
   `kubeadm upgrade`はこのノードで管理している証明書の更新も自動で行います。証明書更新を無効にするには`--certificate-renewal=false`フラグを使用できます。証明書管理の詳細は[kubeadmによる証明書管理](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs)を参照してください。
   {{</ note >}}

1. アップグレードするバージョンを選び、適切なコマンドを実行します。例えば:

   ```shell
   # 今回選んだパッチバージョンでxを置き換えてください
   sudo kubeadm upgrade apply v{{< skew currentVersion >}}.x
   ```

   コマンドが終了すると、次のようなメッセージが表示されます。

   ```
   [upgrade/successful] SUCCESS! Your cluster was upgraded to "v{{< skew currentVersion >}}.x". Enjoy!

   [upgrade/kubelet] Now that your control plane is upgraded, please proceed with upgrading your kubelets if you haven't already done so.
   ```

   {{< note >}}
   v1.28より前のバージョンでは、kubeadmは他のコントロールプレーンインスタンスがアップグレードされていない場合でも、`kubeadm upgrade apply`実行中にアドオン(CoreDNSやkube-proxyを含む)を直ちにアップグレードするモードがデフォルトでした。これは互換性の問題を引き起こす可能性があります。v1.28以降、kubeadmは全てのコントロールプレーンインスタンスがアップグレードされているかを確認してからアドオンのアップグレードを開始するモードをデフォルトにしています。コントロールプレーンインスタンスは順次アップグレードするか、最後のインスタンスのアップグレードを他のインスタンスの完了まで開始しないようにしてください。アドオンのアップグレードは最後のコントロールプレーンインスタンスがアップグレードされた後に行われます。
   {{</ note >}}

1. CNIプロバイダーのプラグインを手動でアップグレードします。

   コンテナネットワークインターフェース(CNI)プロバイダーはそれ自体のアップグレード手順を持つ場合があります。[アドオン](/docs/concepts/cluster-administration/addons/)のページで使用しているCNIプロバイダーを確認し、追加のアップグレード手順が必要かどうかを確認してください。

   なお、CNIプラグインがDaemonSetで動作している場合、追加のコントロールプレーンノードではこの手順は不要です。

**他のコントロールプレーンノードの場合**

最初のコントロールプレーンノードと同様の手順ですが、

```shell
sudo kubeadm upgrade apply
```

の代わりに、

```shell
sudo kubeadm upgrade node
```

を使用します。

また、`kubeadm upgrade plan`の実行やCNIプラグインのアップグレードは不要です。

### ノードのドレイン

メンテナンス準備として、ノードをスケジューリング不可にしてワークロードを退避させます。

```shell
# <node-to-drain>をドレインするノード名に置き換えてください
kubectl drain <node-to-drain> --ignore-daemonsets
```

### kubeletとkubectlのアップグレード

1. kubeletとkubectlをアップグレードします。

   {{< tabs name="k8s_install_kubelet" >}}
   {{% tab name="Ubuntu、DebianまたはHypriotOS" %}}

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo apt-mark unhold kubelet kubectl && \
   sudo apt-get update && sudo apt-get install -y kubelet='{{< skew currentVersion >}}.x-*' kubectl='{{< skew currentVersion >}}.x-*' && \
   sudo apt-mark hold kubelet kubectl
   ```

   {{% /tab %}}
   {{% tab name="CentOS、RHELまたはFedora" %}}

   DNFを使うシステム:

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --disableexcludes=kubernetes
   ```

   DNF5を使うシステム:

   ```shell
   # {{< skew currentVersion >}}.x-*のxを、今回のアップグレードで選んだ最新パッチに置き換えてください
   sudo yum install -y kubelet-'{{< skew currentVersion >}}.x-*' kubectl-'{{< skew currentVersion >}}.x-*' --setopt=disable_excludes=kubernetes
   ```

   {{% /tab %}}
   {{< /tabs >}}

1. kubeletを再起動します。

   ```shell
   sudo systemctl daemon-reload
   sudo systemctl restart kubelet
   ```

### ノードのuncordon(スケジュール可能化)

ノードを再びスケジュール可能にしてオンラインにします。

```shell
# <node-to-uncordon>を対象ノード名に置き換えてください
kubectl uncordon <node-to-uncordon>
```

## ワーカーノードのアップグレード

ワーカーノードのアップグレードは、ワークロードを実行するための必要最小限の容量を損なわない範囲で、ノードを1台ずつまたは複数台ずつ順に実行してください。

LinuxとWindowsのワーカーノードのアップグレード方法については次のページを参照してください。

- [Linuxノードのアップグレード](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes/)
- [Windowsノードのアップグレード](/docs/tasks/administer-cluster/kubeadm/upgrading-windows-nodes/)

## クラスターの状態を確認する

kubeletをすべてのノードでアップグレードした後、kubectlがクラスターにアクセス可能な場所から以下のコマンドを実行し、すべてのノードが再び利用可能であることを確認してください。

```shell
kubectl get nodes
```

`STATUS`列にはすべてのノードで`Ready`が表示され、バージョン番号が更新されているはずです。

## 障害状態からの復旧

`kubeadm upgrade`が失敗してロールバックしない場合（例えば実行中の予期しないシャットダウンなど）、再度`kubeadm upgrade`を実行することで回復できます。`kubeadm upgrade`は冪等性があり、最終的に実際の状態が宣言した望ましい状態であることを保証します。

悪い状態から回復するため、クラスターが実行しているバージョンを変更せずに`sudo kubeadm upgrade apply --force`を実行することもできます。

アップグレード中、kubeadmは`/etc/kubernetes/tmp`の下に次のバックアップフォルダを書き込みます。

- `kubeadm-backup-etcd-<date>-<time>`
- `kubeadm-backup-manifests-<date>-<time>`

`kubeadm-backup-etcd`にはこのコントロールプレーンノードのローカルetcdメンバーデータのバックアップが含まれます。etcdのアップグレードに失敗し、自動ロールバックが機能しない場合、このフォルダの内容を`/var/lib/etcd`に手動で復元できます。外部etcdを使用している場合、このバックアップフォルダは空になります。

`kubeadm-backup-manifests`にはこのコントロールプレーンノードのStatic Podマニフェストファイルのバックアップが含まれます。アップグレードの失敗や自動ロールバックが機能しない場合、このフォルダの内容を`/etc/kubernetes/manifests`に手動で復元できます。何らかの理由で特定のコンポーネントのアップグレード前とアップグレード後のマニフェストに差分がない場合、そのコンポーネントのバックアップファイルは書き込まれません。

{{< note >}}
kubeadmを使ったクラスターのアップグレード後、バックアップディレクトリ`/etc/kubernetes/tmp`は残り、これらのバックアップファイルは手動で削除する必要があります。
{{</ note >}}

## 動作の仕組み

`kubeadm upgrade apply`は次のことを行います。

- クラスターがアップグレード可能な状態であることをチェックする。
  - APIサーバーに到達可能であること
  - すべてのノードが`Ready`状態であること
  - コントロールプレーンが健全であること
- バージョンスキューポリシーを適用する。
- コントロールプレーンのイメージが利用可能であるか、あるいはマシンにプル可能であることを確認する。
- コンポーネント設定がバージョンアップを必要とする場合、代替を生成し、および／またはユーザー提供の上書きを使用する。
- コントロールプレーンコンポーネントをアップグレードするか、いずれかが起動しない場合はロールバックする。
- 新しい`CoreDNS`と`kube-proxy`マニフェストを適用し、必要なRBACルールが作成されていることを確認する。
- APIサーバーの新しい証明書とキーを作成し、期限が180日以内に切れる場合は古いファイルをバックアップする。

`kubeadm upgrade node`は追加のコントロールプレーンノードで次のことを行います。

- kubeadmの`ClusterConfiguration`をクラスターから取得する。
- オプションでkube-apiserverの証明書をバックアップする。
- コントロールプレーンコンポーネントのStatic Podマニフェストをアップグレードする。
- このノードのkubelet設定をアップグレードする。

`kubeadm upgrade node`はワーカーノードで次のことを行います。

- kubeadmの`ClusterConfiguration`をクラスターから取得する。
- このノードのkubelet設定をアップグレードする。
