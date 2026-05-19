---
title: kubeadmによるデュアルスタックのサポート
content_type: task
weight: 100
min-kubernetes-server-version: 1.21
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubernetesクラスターには[デュアルスタック](/ja/docs/concepts/services-networking/dual-stack/)ネットワークが含まれています。つまりクラスターネットワークではいずれかのアドレスファミリーを使用することができます。
クラスターでは、コントロールプレーンはIPv4アドレスとIPv6アドレスの両方を、単一の{{< glossary_tooltip text="Pod" term_id="pod" >}}または{{< glossary_tooltip text="Service" term_id="service" >}}に割り当てることができます。

<!-- body -->

## {{% heading "prerequisites" %}}

[kubeadmのインストール](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)の手順に従って、{{< glossary_tooltip text="kubeadm" term_id="kubeadm">}}ツールをインストールしておく必要があります。

{{< glossary_tooltip text="ノード" term_id="node">}}として使用したいサーバーごとに、IPv6フォワーディングが許可されていることを確認してください。
Linuxでは、各サーバーでrootユーザーとして`sysctl -w net.ipv6.conf.all.forwarding=1`を実行することで設定できます。

使用するにはIPv4およびIPv6アドレス範囲が必要です。
クラスター運用者は、通常はIPv4にはプライベートアドレス範囲を使用します。
IPv6では、通常は運用者が割り当てたアドレス範囲を使用して、`2000::/3`の範囲内からグローバルユニキャストアドレスブロックを選択します。
クラスターのIPアドレス範囲をパブリックインターネットにルーティングする必要はありません。

IPアドレス割り当てのサイズは、実行する予定のPodとServiceの数に適している必要があります。

{{< note >}}
`kubeadm upgrade`コマンドを使用して既存のクラスターをアップグレードする場合、`kubeadm`はPodのIPアドレス範囲("クラスターCIDR")やクラスターのServiceのアドレス範囲("Service CIDR")の変更をサポートしません。
{{< /note >}}

### デュアルスタッククラスターの作成

`kubeadm init`を使用してデュアルスタッククラスターを作成するには、以下の例のようにコマンドライン引数を渡します:

```shell
# これらのアドレス範囲は例です
kubeadm init --pod-network-cidr=10.244.0.0/16,2001:db8:42:0::/56 --service-cidr=10.96.0.0/16,2001:db8:42:1::/112
```

わかりやすいように、主要なデュアルスタックコントロールプレーンノードのkubeadm[構成ファイル](/docs/reference/config-api/kubeadm-config.v1beta4/)`kubeadm-config.yaml`の例を示します。

```yaml
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16,2001:db8:42:0::/56
  serviceSubnet: 10.96.0.0/16,2001:db8:42:1::/112
---
apiVersion: kubeadm.k8s.io/v1beta4
kind: InitConfiguration
localAPIEndpoint:
  advertiseAddress: "10.100.0.1"
  bindPort: 6443
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::2
```

InitConfigurationの`advertiseAddress`は、APIサーバーがリッスンしていることをアドバタイズするIPアドレスを指定します。
`advertiseAddress`の値は`kubeadm init`の`--apiserver-advertise-address`フラグに相当します。

`kubeadm`を実行してデュアルスタックコントロールプレーンノードを初期化します:

```shell
kubeadm init --config=kubeadm-config.yaml
```

kube-controller-managerフラグ`--node-cidr-mask-size-ipv4|--node-cidr-mask-size-ipv6`はデフォルト値で設定されます。
[IPv4/IPv6デュアルスタックの設定](/ja/docs/concepts/services-networking/dual-stack#configure-ipv4-ipv6-dual-stack)を参照してください。

{{< note >}}
`--apiserver-advertise-address`フラグはデュアルスタックをサポートしません。
{{< /note >}}

### デュアルスタッククラスターへのノード参加

ノードを参加させる前に、そのノードにIPv6ルーティングが可能なネットワークインターフェースがあり、IPv6フォワーディングが許可されていることを確認してください。

以下は、ワーカーノードをクラスターに参加させるためのkubeadm[構成ファイル](/docs/reference/config-api/kubeadm-config.v1beta4/)`kubeadm-config.yaml`の例です。

```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 上記の認証情報をクラスターの実際のトークンとCA証明書に一致するように変更
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::3"
```

また以下は、別のコントロールプレーンノードをクラスターに参加させるためのkubeadm[構成ファイル](/docs/reference/config-api/kubeadm-config.v1beta4/)`kubeadm-config.yaml`の例です。


```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: JoinConfiguration
controlPlane:
  localAPIEndpoint:
    advertiseAddress: "10.100.0.2"
    bindPort: 6443
discovery:
  bootstrapToken:
    apiServerEndpoint: 10.100.0.1:6443
    token: "clvldh.vjjwg16ucnhp94qr"
    caCertHashes:
    - "sha256:a4863cde706cfc580a439f842cc65d5ef112b7b2be31628513a9881cf0d9fe0e"
    # 上記の認証情報をクラスターの実際のトークンとCA証明書に一致するように変更
nodeRegistration:
  kubeletExtraArgs:
  - name: "node-ip"
    value: "10.100.0.2,fd00:1:2:3::4"

```

JoinConfiguration.controlPlaneの`advertiseAddress`は、APIサーバーがリッスンしていることをアドバタイズするIPアドレスを指定します。
`advertiseAddress`の値は`kubeadm join`の`--apiserver-advertise-address`フラグに相当します。

```shell
kubeadm join --config=kubeadm-config.yaml
```

### シングルスタッククラスターの作成

{{< note >}}
デュアルスタックのサポートは、デュアルスタックアドレスを使用する必要があるという意味ではありません。
デュアルスタックネットワーク機能が有効になっているシングルスタッククラスターをデプロイすることができます。
{{< /note >}}

よりわかりやすいように、シングルスタックコントロールプレーンノードのkubeadm[構成ファイル](/docs/reference/config-api/kubeadm-config.v1beta4/)`kubeadm-config.yaml`の例を示します。


```yaml
apiVersion: kubeadm.k8s.io/v1beta4
kind: ClusterConfiguration
networking:
  podSubnet: 10.244.0.0/16
  serviceSubnet: 10.96.0.0/16
```

## {{% heading "whatsnext" %}}

* [IPv4/IPv6デュアルスタックの検証](/ja/docs/tasks/network/validate-dual-stack)
* [デュアルスタック](/ja/docs/concepts/services-networking/dual-stack/)クラスターネットワークについて読む
* kubeadm[構成形式](/docs/reference/config-api/kubeadm-config.v1beta4/)についてもっと詳しく知る
