---
title: ネットワークプラグイン
content_type: concept
weight: 10
---


<!-- overview -->

Kubernetes {{< skew currentVersion >}}は、クラスターネットワーキングのために[Container Network Interface](https://github.com/containernetworking/cni) (CNI)プラグインをサポートしています。
クラスターと互換性があり、需要に合ったCNIプラグインを使用する必要があります。
様々なプラグイン(オープンソースあるいはクローズドソース)が幅広いKubernetesエコシステムで利用可能です。

[Kubernetesネットワークモデル](/ja/docs/concepts/services-networking/#the-kubernetes-network-model)を実装するには、CNIプラグインが必要です。

[v0.4.0](https://github.com/containernetworking/cni/blob/spec-v0.4.0/SPEC.md)以降のCNI仕様のリリースと互換性のあるCNIプラグインを使用する必要があります。
Kubernetesプロジェクトは、[v1.0.0](https://github.com/containernetworking/cni/blob/spec-v1.0.0/SPEC.md)のCNI仕様と互換性のあるプラグインの使用を推奨しています(プラグインは複数の仕様のバージョンに対応できます)。

<!-- body -->

## インストール

ネットワーキングの文脈におけるコンテナランタイムは、ノード上のデーモンであり、kubelet向けのCRIサービスを提供するように設定されています。
特に、コンテナランタイムは、Kubernetesネットワークモデルを実装するために必要なCNIプラグインを読み込むように設定する必要があります。

{{< note >}}
Kubernetes 1.24以前は、CNIプラグインは`cni-bin-dir`や`network-plugin`といったコマンドラインパラメーターを使用してkubeletによって管理することもできました。
これらのコマンドラインパラメーターはKubernetes 1.24で削除され、CNIの管理はkubeletの範囲外となりました。

dockershimの削除に伴う問題に直面している場合は、[CNIプラグイン関連のエラーのトラブルシューティング](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)を参照してください。
{{< /note >}}

コンテナランタイムがCNIプラグインをどのように管理しているかについての具体的な情報については、そのコンテナランタイムのドキュメントを参照してください。
例えば:

- [containerd](https://github.com/containerd/containerd/blob/main/script/setup/install-cni)
- [CRI-O](https://github.com/cri-o/cri-o/blob/main/contrib/cni/README.md)

CNIプラグインのインストールや管理方法についての具体的な情報については、そのプラグインまたは[ネットワーキングプロバイダー](/ja/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-network-model)のドキュメントを参照してください。

## ネットワークプラグインの要件


### ループバックCNI

Kubernetesネットワークモデルを実装するためにノードにインストールされたCNIプラグインに加えて、Kubernetesはコンテナランタイムにループバックインターフェース`lo`を提供することも要求します。
これは各サンドボックス(Podサンドボックス、VMサンドボックスなど)に使用されます。
ループバックインターフェースの実装は、[CNIループバックプラグイン](https://github.com/containernetworking/plugins/blob/master/plugins/main/loopback/loopback.go)を再利用するか、自分で実装することで達成できます(例: [CRI-Oを用いた例](https://github.com/cri-o/ocicni/blob/release-1.24/pkg/ocicni/util_linux.go#L91))。

### hostPortのサポート

CNIネットワーキングプラグインは`hostPort`をサポートしています。
CNIプラグインチームが提供する公式の[portmap](https://github.com/containernetworking/plugins/tree/master/plugins/meta/portmap)プラグインを使用するか、ポートマッピング(portMapping)機能を持つ独自のプラグインを使用できます。

`hostPort`サポートを有効にする場合、`cni-conf-dir`で`portMappings capability`を指定する必要があります。
例:

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "portmap",
      "capabilities": {"portMappings": true},
      "externalSetMarkChain": "KUBE-MARK-MASQ"
    }
  ]
}
```

### トラフィックシェーピングのサポート

**これは実験的な機能です**

CNIネットワーキングプラグインは、Podの入出力トラフィックシェーピングにも対応しています。
CNIプラグインチームが提供する公式の[bandwidth](https://github.com/containernetworking/plugins/tree/master/plugins/meta/bandwidth)プラグインを使用するか、帯域制御機能を持つ独自のプラグインを使用できます。

トラフィックシェーピングのサポートを有効にする場合、`bandwidth`プラグインをCNIの設定ファイル(デフォルトは`/etc/cni/net.d`)に追加し、バイナリがCNIのbinディレクトリ(デフォルトは`/opt/cni/bin`)に含まれていることを確認する必要があります。

```json
{
  "name": "k8s-pod-network",
  "cniVersion": "0.4.0",
  "plugins": [
    {
      "type": "calico",
      "log_level": "info",
      "datastore_type": "kubernetes",
      "nodename": "127.0.0.1",
      "ipam": {
        "type": "host-local",
        "subnet": "usePodCidr"
      },
      "policy": {
        "type": "k8s"
      },
      "kubernetes": {
        "kubeconfig": "/etc/cni/net.d/calico-kubeconfig"
      }
    },
    {
      "type": "bandwidth",
      "capabilities": {"bandwidth": true}
    }
  ]
}
```

これでPodに`kubernetes.io/ingress-bandwidth`と`kubernetes.io/egress-bandwidth`のアノテーションを追加できます。
例:

```yaml
apiVersion: v1
kind: Pod
metadata:
  annotations:
    kubernetes.io/ingress-bandwidth: 1M
    kubernetes.io/egress-bandwidth: 1M
...
```

## {{% heading "whatsnext" %}}

- [クラスターのネットワーク](/ja/docs/concepts/cluster-administration/networking/)についてさらに学ぶ
- [ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)についてさらに学ぶ
- [CNIプラグインに関連するエラーのトラブルシューティング](/docs/tasks/administer-cluster/migrating-from-dockershim/troubleshooting-cni-plugin-related-errors/)について学ぶ
