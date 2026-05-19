---
title: cgroupドライバーの設定
content_type: task
weight: 20
---

<!-- overview -->

このページでは、kubeadmクラスターのコンテナランタイムcgroupドライバーに合わせて、kubelet cgroupドライバーを設定する方法について説明します。

## {{% heading "prerequisites" %}}

Kubernetesの[コンテナランタイムの要件](/ja/docs/setup/production-environment/container-runtimes)を熟知している必要があります。

<!-- steps -->

## コンテナランタイムのcgroupドライバーの設定

[コンテナランタイム](/ja/docs/setup/production-environment/container-runtimes)ページでは、kubeadmベースのセットアップでは`cgroupfs`ドライバーではなく、`systemd`ドライバーが推奨されると説明されています。

このページでは、デフォルトの`systemd`ドライバーを使用して多くの異なるコンテナランタイムをセットアップする方法についての詳細も説明されています。

## kubelet cgroupドライバーの設定 {#configuring-the-kubelet-cgroup-driver}

kubeadmでは、`kubeadm init`の際に`KubeletConfiguration`構造体を渡すことができます。

この`KubeletConfiguration`には、kubeletのcgroupドライバーを制御する`cgroupDriver`フィールドを含めることができます。

{{< note >}}
v1.22では、ユーザーが`KubeletConfiguration`の`cgroupDriver`フィールドを設定していない場合、`kubeadm`はデフォルトで`systemd`を設定するようになりました。
{{< /note >}}

フィールドを明示的に設定する最小限の例です:

```yaml
# kubeadm-config.yaml
kind: ClusterConfiguration
apiVersion: kubeadm.k8s.io/v1beta3
kubernetesVersion: v1.21.0
---
kind: KubeletConfiguration
apiVersion: kubelet.config.k8s.io/v1beta1
cgroupDriver: systemd
```

このような設定ファイルは、kubeadmコマンドに渡すことができます:

```shell
kubeadm init --config kubeadm-config.yaml
```

{{< note >}}
Kubeadmはクラスター内の全ノードで同じ`KubeletConfiguration`を使用します。

`KubeletConfiguration`は`kube-system`名前空間下の[ConfigMap](/docs/concepts/configuration/configmap)オブジェクトに格納されます。

サブコマンド`init`、`join`、`upgrade`を実行すると、kubeadmが`KubeletConfiguration`を`/var/lib/kubelet/config.yaml`以下にファイルとして書き込み、ローカルノードのkubeletに渡します。
{{< /note >}}

##  cgroupfsドライバーの使用

このガイドで説明するように、`cgroupfs`ドライバーをkubeadmと一緒に使用することは推奨されません。
`cgroupfs`を使い続け、`kubeadm upgrade`が既存のセットアップで`KubeletConfiguration` cgroupドライバーを変更しないようにするには、その値を明示的に指定する必要があります。
これは、将来のバージョンのkubeadmに`systemd`ドライバーをデフォルトで適用させたくない場合に適用されます。
値を明示する方法については、後述の「kubelet ConfigMapの修正」の項を参照してください。
`cgroupfs`ドライバーを使用するようにコンテナランタイムを設定したい場合は、選択したコンテナランタイムのドキュメントを参照する必要があります。

## `systemd`ドライバーへの移行

既存のkubeadmクラスターのcgroupドライバーを`systemd`にインプレースで変更する場合は、kubeletのアップグレードと同様の手順が必要です。
これには、以下に示す両方の手順を含める必要があります。

{{< note >}}
あるいは、クラスター内の古いノードを`systemd`ドライバーを使用する新しいノードに置き換えることも可能です。
この場合、新しいノードに参加する前に以下の最初のステップのみを実行し、古いノードを削除する前にワークロードが新しいノードに安全に移動できることを確認する必要があります。
{{< /note >}}

### kubelet ConfigMapの修正

- `kubectl get cm -n kube-system | grep kubelet-config`で、kubelet ConfigMapの名前を探します。
- `kubectl edit cm kubelet-config-x.yy -n kube-system`を呼び出します(`x.yy`はKubernetesのバージョンに置き換えてください)。
- 既存の`cgroupDriver`の値を修正するか、以下のような新しいフィールドを追加します。

```yaml
  cgroupDriver: systemd
```

このフィールドは、ConfigMapの`kubelet:`セクションの下に存在する必要があります。

### 全ノードでcgroupドライバーを更新

クラスター内の各ノードについて:

- [Drain the node](/docs/tasks/administer-cluster/safely-drain-node)を`kubectl drain <node-name> --ignore-daemonsets`を使ってドレーンします。
- `systemctl stop kubelet`を使用して、kubeletを停止します。
- コンテナランタイムの停止。
- コンテナランタイムのcgroupドライバーを`systemd`に変更します。
- `var/lib/kubelet/config.yaml`に`cgroupDriver: systemd`を設定します。
- コンテナランタイムの開始。
- `systemctl start kubelet`でkubeletを起動します。
- [Drain the node](/docs/tasks/administer-cluster/safely-drain-node)を`kubectl uncordon <node-name>`を使って行います。

ワークロードが異なるノードでスケジュールするための十分な時間を確保するために、これらのステップを1つずつノード上で実行します。
プロセスが完了したら、すべてのノードとワークロードが健全であることを確認します。
