---
title: kubeadmを使用したクラスター内の各kubeletの設定
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="1.11" state="stable" >}}

kubeadm CLIツールのライフサイクルは、Kubernetesクラスター内の各ノード上で稼働するデーモンである[kubelet](/docs/reference/command-line-tools-reference/kubelet)から分離しています。kubeadm CLIツールはKubernetesを初期化またはアップグレードする際にユーザーによって実行されます。一方で、kubeletは常にバックグラウンドで稼働しています。

kubeletはデーモンのため、何らかのinitシステムやサービスマネージャーで管理する必要があります。DEBパッケージやRPMパッケージからkubeletをインストールすると、systemdはkubeletを管理するように設定されます。代わりに別のサービスマネージャーを使用することもできますが、手動で設定する必要があります。

いくつかのkubeletの設定は、クラスターに含まれる全てのkubeletで同一である必要があります。一方で、特定のマシンの異なる特性(OS、ストレージ、ネットワークなど)に対応するために、kubeletごとに設定が必要なものもあります。手動で設定を管理することも可能ですが、kubeadmは[一元的な設定管理](#configure-kubelets-using-kubeadm)のための`KubeletConfiguration`APIを提供しています。



<!-- body -->

## Kubeletの設定パターン

以下のセクションでは、kubeadmを使用したkubeletの設定パターンについて説明します。これは手動で各Nodeの設定を管理するよりも簡易に行うことができます。

### 各kubeletにクラスターレベルの設定を配布 {#propagating-cluster-level-configuration-to-each-kubelet}

`kubeadm init`および`kubeadm join`コマンドを使用すると、kubeletにデフォルト値を設定することができます。興味深い例として、異なるCRIランタイムを使用したり、Serviceが使用するデフォルトのサブネットを設定したりすることができます。

Serviceが使用するデフォルトのサブネットとして`10.96.0.0/12`を設定する必要がある場合は、`--service-cidr`パラメーターを渡します。

```bash
kubeadm init --service-cidr 10.96.0.0/12
```

これによってServiceの仮想IPはこのサブネットから割り当てられるようになりました。また、`--cluster-dns`フラグを使用し、kubeletが用いるDNSアドレスを設定する必要もあります。この設定はクラスター内の全てのマネージャーとNode上で同一である必要があります。kubeletは、**kubeletのComponentConfig**と呼ばれる、バージョン管理と構造化されたAPIオブジェクトを提供します。これはkubelet内のほとんどのパラメーターを設定し、その設定をクラスター内で稼働中の各kubeletへ適用することを可能にします。以下の例のように、キャメルケースのキーに値のリストとしてクラスターDNS IPアドレスなどのフラグを指定することができます。

```yaml
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
clusterDNS:
- 10.96.0.10
```

ComponentConfigの詳細については、[このセクション](#configure-kubelets-using-kubeadm)をご覧ください

### インスタンス固有の設定内容を適用 {#providing-instance-specific-configuration-details}

いくつかのホストでは、ハードウェア、オペレーティングシステム、ネットワーク、その他ホスト固有のパラメータの違いのため、特定のkubeletの設定を必要とします。以下にいくつかの例を示します。

- DNS解決ファイルへのパスは`--resolv-conf`フラグで指定することができますが、オペレーティングシステムや`systemd-resolved`を使用するかどうかによって異なる場合があります。このパスに誤りがある場合、そのNode上でのDNS解決は失敗します。
- クラウドプロバイダーを使用していない場合、Node APIオブジェクト`.metadata.name`はデフォルトでマシンのホスト名に設定されます。異なるNode名を指定する必要がある場合には、`--hostname-override`フラグによってこの挙動を書き換えることができます。
- 現在のところ、kubletはCRIランタイムが使用するcgroupドライバを自動で検知することができませんが、kubeletの稼働を保証するためには、`--cgroup-driver`の値はCRIランタイムが使用するcgroupドライバに一致していなければなりません。
- クラスターが使用するCRIランタイムによっては、異なるフラグを指定する必要があるかもしれません。例えば、Dockerを使用している場合には、`--network-plugin=cni`のようなフラグを指定する必要があります。外部のランタイムを使用している場合には、`--container-runtime=remote`と指定し、`--container-runtime-endpoint=<path>`のようにCRIエンドポイントを指定する必要があります。

これらのフラグは、systemdなどのサービスマネージャー内のkubeletの設定によって指定することができます。

## kubeadmを使用したkubeletの設定 {#configure-kubelets-using-kubeadm}

`kubeadm ... --config some-config-file.yaml`のように、カスタムの`KubeletConfiguration`APIオブジェクトを設定ファイルを介して渡すことで、kubeadmによって起動されるkubeletに設定を反映することができます。

`kubeadm config print init-defaults --component-configs KubeletConfiguration`を実行することによって、この構造体の全てのデフォルト値を確認することができます。

また、各フィールドの詳細については、[kubelet ComponentConfigに関するAPIリファレンス](https://godoc.org/k8s.io/kubernetes/pkg/kubelet/apis/config#KubeletConfiguration)を参照してください。

### `kubeadm init`実行時の流れ

`kubeadm init`を実行した場合、kubeletの設定は`/var/lib/kubelet/config.yaml`に格納され、クラスターのConfigMapにもアップロードされます。ConfigMapは`kubelet-config-1.X`という名前で、`X`は初期化するKubernetesのマイナーバージョンを表します。またこの設定ファイルは、クラスタ内の全てのkubeletのために、クラスター全体設定の基準と共に`/etc/kubernetes/kubelet.conf`にも書き込まれます。この設定ファイルは、kubeletがAPIサーバと通信するためのクライアント証明書を指し示します。これは、[各kubeletにクラスターレベルの設定を配布](#propagating-cluster-level-configuration-to-each-kubelet)することの必要性を示しています。

二つ目のパターンである、[インスタンス固有の設定内容を適用](#providing-instance-specific-configuration-details)するために、kubeadmは環境ファイルを`/var/lib/kubelet/kubeadm-flags.env`へ書き出します。このファイルは以下のように、kubelet起動時に渡されるフラグのリストを含んでいます。

```bash
KUBELET_KUBEADM_ARGS="--flag1=value1 --flag2=value2 ..."
```

kubelet起動時に渡されるフラグに加えて、このファイルはcgroupドライバーや異なるCRIランタイムソケットを使用するかどうか(`--cri-socket`)といった動的なパラメータも含みます。

これら二つのファイルがディスク上に格納されると、systemdを使用している場合、kubeadmは以下の二つのコマンドを実行します。

```bash
systemctl daemon-reload && systemctl restart kubelet
```

リロードと再起動に成功すると、通常の`kubeadm init`のワークフローが続きます。

### `kubeadm join`実行時の流れ

`kubeadm join`を実行した場合、kubeadmはBootstrap Token証明書を使用してTLS bootstrapを行い、ConfigMap`kubelet-config-1.X`をダウンロードするために必要なクレデンシャルを取得し、`/var/lib/kubelet/config.yaml`へ書き込みます。動的な環境ファイルは、`kubeadm init`の場合と全く同様の方法で生成されます。

次に、`kubeadm`は、kubeletに新たな設定を読み込むために、以下の二つのコマンドを実行します。

```bash
systemctl daemon-reload && systemctl restart kubelet
```

kubeletが新たな設定を読み込むと、kubeadmは、KubeConfigファイル`/etc/kubernetes/bootstrap-kubelet.conf`を書き込みます。これは、CA証明書とBootstrap Tokenを含みます。これらはkubeletがTLS Bootstrapを行い`/etc/kubernetes/kubelet.conf`に格納されるユニークなクレデンシャルを取得するために使用されます。ファイルが書き込まれると、kubeletはTLS Bootstrapを終了します。

## kubelet用のsystemdファイル {#the-kubelet-drop-in-file-for-systemd}

`kubeadm`には、systemdがどのようにkubeletを実行するかを指定した設定ファイルが同梱されています。
kubeadm CLIコマンドは決してこのsystemdファイルには触れないことに注意してください。

kubeadmの[DEBパッケージ](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubeadm/10-kubeadm.conf)または[RPMパッケージ](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubeadm/10-kubeadm.conf)によってインストールされたこの設定ファイルは、`/etc/systemd/system/kubelet.service.d/10-kubeadm.conf`に書き込まれ、systemdで使用されます。基本的な`kubelet.service`([RPM用](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/rpm/kubelet/kubelet.service)または、 [DEB用](https://github.com/kubernetes/release/blob/master/cmd/kubepkg/templates/latest/deb/kubelet/lib/systemd/system/kubelet.service))を拡張します。

```none
[Service]
Environment="KUBELET_KUBECONFIG_ARGS=--bootstrap-kubeconfig=/etc/kubernetes/bootstrap-kubelet.conf
--kubeconfig=/etc/kubernetes/kubelet.conf"
Environment="KUBELET_CONFIG_ARGS=--config=/var/lib/kubelet/config.yaml"
# This is a file that "kubeadm init" and "kubeadm join" generate at runtime, populating
the KUBELET_KUBEADM_ARGS variable dynamically
EnvironmentFile=-/var/lib/kubelet/kubeadm-flags.env
# This is a file that the user can use for overrides of the kubelet args as a last resort. Preferably,
# the user should use the .NodeRegistration.KubeletExtraArgs object in the configuration files instead.
# KUBELET_EXTRA_ARGS should be sourced from this file.
EnvironmentFile=-/etc/default/kubelet
ExecStart=
ExecStart=/usr/bin/kubelet $KUBELET_KUBECONFIG_ARGS $KUBELET_CONFIG_ARGS $KUBELET_KUBEADM_ARGS $KUBELET_EXTRA_ARGS
```

このファイルは、kubeadmがkubelet用に管理する全ファイルが置かれるデフォルトの場所を指定します。

- TLS Bootstrapに使用するKubeConfigファイルは`/etc/kubernetes/bootstrap-kubelet.conf`ですが、`/etc/kubernetes/kubelet.conf`が存在しない場合にのみ使用します。
- ユニークなkublet識別子を含むKubeConfigファイルは`/etc/kubernetes/kubelet.conf`です。
- kubeletのComponentConfigを含むファイルは`/var/lib/kubelet/config.yaml`です。
- `KUBELET_KUBEADM_ARGS`を含む動的な環境ファイルは`/var/lib/kubelet/kubeadm-flags.env`から取得します。
- `KUBELET_EXTRA_ARGS`によるユーザー定義のフラグの上書きを格納できるファイルは`/etc/default/kubelet`(DEBの場合)、または`/etc/sysconfig/kubelet`(RPMの場合)から取得します。`KUBELET_EXTRA_ARGS`はフラグの連なりの最後に位置し、優先度が最も高いです。

## Kubernetesバイナリとパッケージの内容

Kubernetesに同梱されるDEB、RPMのパッケージは以下の通りです。

| パッケージ名 | 説明        |
|--------------|-------------|
| `kubeadm`    | `/usr/bin/kubeadm`CLIツールと、[kubelet用のsystemdファイル](#the-kubelet-drop-in-file-for-systemd)をインストールします。 |
| `kubelet`    | kubeletバイナリを`/usr/bin`に、CNIバイナリを`/opt/cni/bin`にインストールします。 |
| `kubectl`    | `/usr/bin/kubectl`バイナリをインストールします。 |
| `cri-tools` | `/usr/bin/crictl`バイナリを[cri-tools gitリポジトリ](https://github.com/kubernetes-incubator/cri-tools)からインストールします。 |

