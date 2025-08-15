---
title: kubeadmを使用したクラスターの作成
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px"></img>
ベストプラクティスに準拠した実用最小限のKubernetesクラスターを作成します。
実際、`kubeadm`を使用すれば、[Kubernetes Conformance tests](/blog/2017/10/software-conformance-certification/)に通るクラスターをセットアップすることができます。
`kubeadm`は、[ブートストラップトークン](/docs/reference/access-authn-authz/bootstrap-tokens/)やクラスターのアップグレードなどのその他のクラスターのライフサイクルの機能もサポートします。

`kubeadm`ツールは、次のようなときに適しています。

- 新しいユーザーが初めてKubernetesを試すためのシンプルな方法が必要なとき。
- 既存のユーザーがクラスターのセットアップを自動化し、アプリケーションをテストする方法が必要なとき。
- より大きなスコープで、他のエコシステムやインストーラーツールのビルディングブロックが必要なとき。

`kubeadm`は、ラップトップ、クラウドのサーバー群、Raspberry Piなどの様々なマシンにインストールして使えます。クラウドとオンプレミスのどちらにデプロイする場合でも、`kubeadm`はAnsibleやTerraformなどのプロビジョニングシステムに統合できます。

## {{% heading "prerequisites" %}}

このガイドを進めるには、以下の環境が必要です。

- UbuntuやCentOSなど、deb/rpmパッケージと互換性のあるLinux OSが動作している1台以上のマシンがあること。
- マシンごとに2GiB以上のRAMが搭載されていること。それ以下の場合、アプリ実行用のメモリがほとんど残りません。
- コントロールプレーンノードとして使用するマシンには、最低でも2CPU以上あること。
- クラスター内の全マシン間に完全なネットワーク接続があること。パブリックネットワークとプライベートネットワークのいずれでも使えます。

また、新しいクラスターで使いたいKubernetesのバージョンをデプロイできるバージョンの`kubeadm`を使用する必要もあります。

[Kubernetesのバージョンとバージョンスキューポリシー](/docs/setup/release/version-skew-policy/#supported-versions)は、`kubeadm`にもKubernetes全体と同じように当てはまります。
Kubernetesと`kubeadm`がサポートするバージョンを理解するには、上記のポリシーを確認してください。このページは、Kubernetes {{< param "version" >}}向けに書かれています。

kubeadmツールの全体の機能の状態は、一般利用可能(GA)です。一部のサブ機能はまだ活発に開発が行われています。クラスター作成の実装は、ツールの進化に伴ってわずかに変わるかもしれませんが、全体の実装は非常に安定しているはずです。

{{< note >}}
`kubeadm alpha`以下のすべてのコマンドは、定義通り、アルファレベルでサポートされています。
{{< /note >}}



<!-- steps -->

## 目的

* シングルコントロールプレーンのKubernetesクラスターをインストールします
* クラスター上にPodネットワークをインストールして、Podがお互いに通信できるようにします

## 手順

### ホストの準備

#### コンポーネントのインストール

{{< glossary_tooltip term_id="container-runtime" text="コンテナランタイム" >}}と、kubeadmを全てのホストにインストールしてください。
インストールの詳細やその他の準備については、[kubeadmのインストール](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)を読んでください。

{{< note >}}
すでにkubeadmがインストール済みである場合は、kubeadmのアップグレード手順については[Linuxノードのアップグレード](/docs/tasks/administer-cluster/kubeadm/upgrading-linux-nodes)の最初の2ステップを確認してください。

アップグレード中、kubeletはクラッシュループによってkubeadmの指示を待つため、数秒ごとに再起動します。
このクラッシュループは想定内の正常な動作です。
コントロールプレーンの初期化が完了すれば、kubeletは正常に動作します。
{{< /note >}}

#### ネットワークの設定

kubeadmは他のKubernetesコンポーネントと同様に、ホスト上のデフォルトゲートウェイとなっているネットワークインターフェースと関連づけられた利用可能なIPアドレスを探索します。
このIPアドレスは、コンポーネントによるアドバタイズや受信に使用されます。

Linuxのホスト上でこのIPを確認するには次のようにします:

```shell
ip route show # "default via"で始まる行を探してください。
```

{{< note >}}
2つ以上のデフォルトゲートウェイがホスト上に存在する場合、Kubernetesコンポーネントは、適切なグローバルユニキャストIPアドレスを持つ最初に検出したゲートウェイを使用しようとします。
この選択を行う際、ゲートウェイの正確な順序は、オペレーティングシステムやカーネルのバージョンにより異なる場合があります。
{{< /note >}}

Kubernetesコンポーネントはカスタムネットワークインターフェースをオプションとして受け入れないため、カスタム構成を必要とする全てのコンポーネントのインスタンスにカスタムIPアドレスをフラグとして渡す必要があります。

{{< note >}}
ホストにデフォルトゲートウェイが存在せず、カスタムIPがKubernetesコンポーネントに渡されない場合、コンポーネントはエラーで終了する可能性があります。
{{< /note >}}

`init`および`join`で作成されたコントロールプレーンに対してAPIサーバーのアドバタイズアドレスを設定するには、`--apiserver-advertise-address`フラグを使用します。
このオプションは、可能であれば[kubeadm API](/docs/reference/config-api/kubeadm-config.v1beta4)において`InitConfiguration.localAPIEndpoint`および`JoinConfiguration.controlPlane.localAPIEndpoint`として設定するのが望ましいです。

全てのノード上のkubeletに対して、`--node-ip`オプションはkubeadmの設定ファイル(`InitConfiguration`または`JoinConfiguration`)の`.nodeRegistration.kubeletExtraArgs`にて指定することができます。

デュアルスタックについては、[kubeadmによるデュアルスタックのサポート](/docs/setup/production-environment/tools/kubeadm/dual-stack-support)を参照してください。

コントロールプレーンのコンポーネントに割り当てたIPアドレスは、X.509証明書のSubject Alternative Nameフィールドの一部になります。
これらのIPアドレスを変更するには、新しい証明書に署名し、影響を受けるコンポーネントを再起動する必要があります。
これにより、証明書ファイルの変更が反映されます。
詳細は、[kubeadmによる証明書管理](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#manual-certificate-renewal)を参照してください。

{{< warning >}}
Kubernetesプロジェクトは、このアプローチ(全てのコンポーネントのインスタンスにカスタムIPアドレスを設定すること)を推奨していません。
代わりに、Kubernetesメンテナーはホストネットワークを設定することを推奨しています。
これにより、KubernetesコンポーネントがデフォルトゲートウェイのIPを自動検出し使用できるようになります。
Linuxノード上では、ネットワーク設定に`ip route`のようなコマンドを使用できます。
また、オペレーティングシステムによってはより高レベルなネットワーク管理ツールが提供される場合もあります。
ノードのデフォルトゲートウェイがパブリックアドレスの場合、ノードやクラスターを保護するためにパケットフィルタリングなどのセキュリティ対策を行う必要があります。
{{< /warning >}}

### 必要なコンテナイメージの準備

このステップは任意で、`kubeadm init`および`kubeadm join`実行時に`registry.k8s.io`に存在するデフォルトのコンテナイメージをダウンロードしない場合のみ行います。

kubeadmは、ノードにインターネット接続がない状態でクラスターを構築する際に、必要なイメージを事前に取得するのに役立つコマンドがあります。
詳細は、[インターネット接続無しでのkubeadmの稼働](/docs/reference/setup-tools/kubeadm/kubeadm-init#without-internet-connection)を参照してください。

kubeadmはカスタムイメージリポジトリから必要なイメージを使用することもできます。
詳細は[カスタムイメージの使用](/docs/reference/setup-tools/kubeadm/kubeadm-init#custom-images)を参照してください。

### コントロールプレーンノードの初期化

コントロールプレーンノードとは、{{< glossary_tooltip term_id="etcd" >}}(クラスターのデータベース)や{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}({{< glossary_tooltip text="kubectl" term_id="kubectl" >}}コマンドラインツールが通信する相手)などのコントロールプレーンのコンポーネントが実行されるマシンです。

1. (推奨)シングルコントロールプレーンの`kubeadm`クラスターを[高可用性クラスター](/docs/setup/production-environment/tools/kubeadm/high-availability/)にアップグレードする予定がある場合、`--control-plane-endpoint`を指定して、すべてのコントロールプレーンノードとエンドポイントを共有する必要があります。
    エンドポイントにはDNS名やロードバランサーのIPアドレスが使用できます。
1. Podネットワークアドオンを選んで、`kubeadm init`に引数を渡す必要があるかどうか確認してください。
    選んだサードパーティのプロバイダーによっては、`--pod-network-cidr`をプロバイダー固有の値に設定する必要がある場合があります。
    詳しくは、[Podネットワークアドオンのインストール](#pod-network)を参照してください。
1. (オプション)`kubeadm`は既知のエンドポイントの一覧を用いて、コンテナランタイムの検出を試みます。
    異なるコンテナランタイムを使用する場合やプロビジョニングするノードに2つ以上のランタイムがインストールされている場合、`kubeadm`に`--cri-socket`引数を指定してください。
    詳しくは、[ランタイムのインストール](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)を参照してください。

コントロールプレーンノードを初期化するには、次のコマンドを実行します。

```bash
kubeadm init <args>
```

### apiserver-advertise-addressとControlPlaneEndpointに関する検討

`--apiserver-advertise-address`は、特定のコントロールプレーンノードのAPIサーバーがアドバタイズするアドレスを設定するために使用できます。
一方`--control-plane-endpoint`は、すべてのコントロールプレーンノード共有のエンドポイントを設定するために使用できます。

`--control-plane-endpoint`はIPアドレスと、IPアドレスへマッピングできるDNS名を使用できます。利用可能なソリューションをそうしたマッピングの観点から評価するには、ネットワーク管理者に相談してください。

以下にマッピングの例を示します。

```
192.168.0.102 cluster-endpoint
```

ここでは、`192.168.0.102`がこのノードのIPアドレスであり、`cluster-endpoint`がこのIPアドレスへとマッピングされるカスタムDNS名です。
このように設定することで、`--control-plane-endpoint=cluster-endpoint`を`kubeadm init`に渡せるようになり、`kubeadm join`にも同じDNS名を渡せます。
後で`cluster-endpoint`を修正して、高可用性が必要なシナリオでロードバランサーのアドレスを指すようにすることができます。

kubeadmでは、`--control-plane-endpoint`を渡さずに構築したシングルコントロールプレーンのクラスターを高可用性クラスターに切り替えることはサポートされていません。

### 詳細な情報

`kubeadm init`の引数のより詳細な情報は、[kubeadmリファレンスガイド](/docs/reference/setup-tools/kubeadm/)を参照してください。

`kubeadm init`を設定ファイルにて設定するには、[設定ファイルのドキュメント](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)を参照してください。

コントロールプレーンコンポーネントやetcdサーバーのliveness probeへのオプションのIPv6の割り当てなど、コントロールプレーンのコンポーネントをカスタマイズしたい場合は、[カスタムの引数](/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)に示されている方法で各コンポーネントに追加の引数を与えてください。

既存のクラスターの再設定を行う場合は、[kubeadmクラスターの再設定](/docs/tasks/administer-cluster/kubeadm/kubeadm-reconfigure/)を参照してください。

`kubeadm init`を再び実行する場合は、初めに[クラスターの破棄](#tear-down)を行う必要があります。

もし異なるアーキテクチャのノードをクラスターにjoinさせたい場合は、デプロイしたDaemonSetがそのアーキテクチャ向けのコンテナイメージをサポートしているか確認してください。

初めに`kubeadm init`は、マシンがKubernetesを実行する準備ができているかを確認するための、一連の事前チェックを行います。
これらの事前チェックは、エラー発生時には警告を表示して終了します。
次に、`kubeadm init`はクラスターのコントロールプレーンのコンポーネントをダウンロードしてインストールします。
これには数分掛かるかもしれません。
これらが終了すると以下が出力されます。

```none
Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

kubectlをroot以外のユーザーでも実行できるようにするには、次のコマンドを実行します。これらのコマンドは、`kubeadm init`の出力の中にも書かれています。

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

`root`ユーザーの場合は、代わりに次のコマンドを実行します。

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

{{< warning >}}
`kubeadm init`によって生成されたkubeconfigファイルの`admin.conf`は、`Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`
の証明書を内包しています。
`kubeadm:cluster-admins`グループは、ビルトインのClusterRoleである`cluster-admin`と紐づいています。
`admin.conf`は誰とも共有しないでください。

`kubeadm init`は、別のkubeconfigファイルである`super-admin.conf`も生成します。 
これは、`Subject: O = system:masters, CN = kubernetes-super-admin`の証明書を内包しています。
`system:masters`は認可のレイヤー(例: RBAC)をバイパスする、緊急用のスーパーユーザーグループです。
`super-admin.conf`は誰とも共有しないでください。
このファイルは安全な場所に退避させることを推奨します。

追加ユーザーへkubeconfigファイルを生成するために`kubeadm kubeconfig user`を実行するには、[追加ユーザのためのkubeconfigファイルの生成](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs#kubeconfig-additional-users)を参照してください。
{{< /warning >}}

`kubeadm init`が出力した`kubeadm join`コマンドをメモしておいてください。[クラスターにノードを追加する](#join-nodes)ために、このコマンドが必要です。

トークンは、コントロールプレーンノードと追加ノードの間の相互認証に使用します。ここに含まれるトークンには秘密の情報が含まれます。
このトークンを知っていれば、誰でもクラスターに認証済みノードを追加できてしまうため、取り扱いには注意してください。
`kubeadm token`コマンドを使用すると、これらのトークンの一覧、作成、削除ができます。
詳しくは[kubeadmリファレンスガイド](/docs/reference/setup-tools/kubeadm/kubeadm-token/)を参照してください。

### Podネットワークアドオンのインストール {#pod-network}

{{< caution >}}
このセクションには、ネットワークのセットアップとデプロイの順序に関する重要な情報が書かれています。
先に進む前に以下のすべてのアドバイスを熟読してください。

**Pod同士が通信できるようにするには、{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}(CNI)をベースとするPodネットワークアドオンをデプロイしなければなりません。
ネットワークアドオンをインストールする前には、Cluster DNS(CoreDNS)は起動しません。**

- Podネットワークがホストネットワークと決して重ならないように気をつけてください。
  もし重なると、様々な問題が起こってしまう可能性があります(ネットワークプラグインが優先するPodネットワークとホストのネットワークの一部が衝突することが分かった場合、適切な代わりのCIDRを考える必要があります。そして、`kubeadm init`の実行時に`--pod-network-cidr`にそのCIDRを指定し、ネットワークプラグインのYAMLでは代わりにそのCIDRを使用してください)。
- デフォルトでは、`kubeadm`は[RBAC](/docs/reference/access-authn-authz/rbac/)(role based access control)の使用を強制します。
  PodネットワークプラグインがRBACをサポートしており、またそのデプロイに使用するマニフェストもRBACをサポートしていることを確認してください。
- クラスターでIPv6を使用したい場合、デュアルスタック、IPv6のみのシングルスタックのネットワークのいずれであっても、PodネットワークプラグインがIPv6をサポートしていることを確認してください。
  IPv6のサポートは、CNIの[v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0)で追加されました。

{{< /caution >}}

{{< note >}}
kubeadmはCNIに依存すべきではないため、CNIプロバイダーの検証は現在e2eテストの範囲外です。
CNIプラグインに関する問題を見つけた場合、kubeadmやKubernetesではなく、そのCNIプラグインの課題管理システムへ問題を報告してください。
{{< /note >}}

CNIを使用するKubernetes Podネットワークを提供する外部のプロジェクトがいくつかあります。一部のプロジェクトでは、[ネットワークポリシー](/docs/concepts/services-networking/network-policies/)もサポートしています。

[Kubernetesのネットワークモデル](/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)を実装したアドオンの一覧も確認してください。

Kubernetesでサポートされているネットワークアドオンの非網羅的な一覧については、[アドオンのインストール](/docs/concepts/cluster-administration/addons/#networking-and-network-policy)のページを参照してください。
Podネットワークアドオンをインストールするには、コントロールプレーンノード上またはkubeconfigクレデンシャルを持っているノード上で、次のコマンドを実行します。

```bash
kubectl apply -f <add-on.yaml>
```
{{< note >}}
WindowsをサポートするCNIプラグインは少数です。
詳細とセットアップ手順は、[Windowsワーカーノードの追加](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/#network-config)を参照してください。
{{< /note >}}

インストールできるPodネットワークは、クラスターごとに1つだけです。

Podネットワークがインストールされたら、`kubectl get pods --all-namespaces`の出力結果でCoreDNS Podが`Running`状態であることをチェックすることで、ネットワークが動作していることを確認できます。そして、一度CoreDNS Podが動作すれば、続けてノードを追加できます。

ネットワークやCoreDNSが`Running`状態にならない場合は、`kubeadm`の[トラブルシューティングガイド](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)をチェックしてください。

### 管理されたノードラベル

デフォルトでは、kubeadmは[NodeRestriction](/docs/reference/access-authn-authz/admission-controllers/#noderestriction)という、ノード登録時にkubeletが自己適用するラベルを制限するアドミッションコントローラーを有効化します。
このアドミッションコントローラーのドキュメントでは、kubeletの`--node-labels`オプションで使用できるラベルについて説明しています。
`node-role.kubernetes.io/control-plane`は上記のような制限されたラベルであり、ノード作成後に特権クライアントを使用してkubeadmがマニュアルで適用します。
これを手動で行うには、kubeadm管理の`/etc/kubernetes/admin.conf`のような特権kubeconfigを使用していることを確認し、`kubectl label`コマンドを使用してください。

### コントロールプレーンノードの隔離

デフォルトでは、セキュリティ上の理由により、クラスターはコントロールプレーンノードにPodをスケジューリングしません。
たとえば、開発用のKubernetesシングルマシンのクラスターなどで、Podをコントロールプレーンノードにスケジューリングしたい場合は、次のコマンドを実行します。

```bash
kubectl taint nodes --all node-role.kubernetes.io/control-plane-
```

出力は次のようになります。

```
node "test-01" untainted
...
```

このコマンドは、コントロールプレーンノードを含むすべてのノードから`node-role.kubernetes.io/control-plane:NoSchedule` taintを削除します。
その結果、スケジューラーはどこにでもPodをスケジューリングできるようになります。

さらに、以下のコマンドを実行することでコントロールプレーンノードから[`node.kubernetes.io/exclude-from-external-load-balancers`](/docs/reference/labels-annotations-taints/#node-kubernetes-io-exclude-from-external-load-balancers)ラベルを削除できます。
このラベルは、バックエンドサーバーの一覧からコントロールプレーンノードを除外するものです。

```bash
kubectl label nodes --all node.kubernetes.io/exclude-from-external-load-balancers-
```

### コントロールプレーンノードの追加

コントロールプレーンノードの追加によって高可用性kubeadmクラスターを構築する手順は、[kubeadmを使用した高可用性クラスターの作成](/docs/setup/production-environment/tools/kubeadm/high-availability/)を参照してください。

### ワーカーノードの追加 {#join-nodes}

ワーカーノードは、ワークロード(コンテナやPodなど)が実行される場所です。

`kubeadm join`コマンドを使用したLinux、Windowsワーカーノードの追加方法は、以下のページを参照してください。
* [Linuxワーカーノードの追加](/docs/tasks/administer-cluster/kubeadm/adding-linux-nodes/)
* [Windowsワーカーノードの追加](/docs/tasks/administer-cluster/kubeadm/adding-windows-nodes/)

### (オプション)コントロールプレーンノード以外のマシンからのクラスター操作

他のコンピューター(例: ラップトップ)上のkubectlがクラスターと通信できるようにするためには、次のようにして管理者のkubeconfigファイルをコントロールプレーンノードから対象のコンピューター上にコピーする必要があります。

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
上の例では、rootユーザーに対するSSH接続が有効であることを仮定しています。
そうでない場合は、`admin.conf`ファイルを他のユーザーからアクセスできるようにコピーした上で、代わりにそのユーザーを使って`scp`してください。

`admin.conf`ファイルはユーザーにクラスターに対する _スーパーユーザー_ の権限を与えます。
そのため、このファイルは慎重に使用しなければなりません。
通常のユーザーには、明示的に許可した権限を持つユニークなクレデンシャルを生成することを推奨します。
これには、`kubeadm kubeconfig user --client-name <CN>`コマンドが使えます。
このコマンドを実行すると、KubeConfigファイルがSTDOUTに出力されるため、ファイルに保存してユーザーに配布します。
その後、`kubectl create (cluster)rolebinding`コマンドを使って権限を付与します。
{{< /note >}}

### (オプション)APIサーバーをlocalhostへプロキシする

クラスターの外部からAPIサーバーに接続したいときは、次のように`kubectl proxy`コマンドが使えます。

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

これで、ローカルの`http://localhost:8001/api/v1`からAPIサーバーにアクセスできるようになります。

## クリーンアップ {#tear-down}

テストのためにクラスターに破棄可能なサーバーを使用した場合、サーバーのスイッチをオフにすれば、以降のクリーンアップの作業は必要ありません。
クラスターのローカルの設定を削除するには、`kubectl config delete-cluster`を実行します。

しかし、よりきれいにクラスターのプロビジョンをもとに戻したい場合は、初めに[ノードのdrain](/docs/reference/generated/kubectl/kubectl-commands#drain)を行い、ノードが空になっていることを確認した後、ノードの設定を削除する必要があります。

### ノードの削除

適切なクレデンシャルを使用してコントロールプレーンノードに指示を出します。次のコマンドを実行してください。

```bash
kubectl drain <node name> --delete-emptydir-data --force --ignore-daemonsets
```

ノードを削除する前に、`kubeadm`によってインストールされた状態をリセットします。

```bash
kubeadm reset
```

リセットプロセスでは、iptablesのルールやIPVS tablesのリセットやクリーンアップは行われません。
iptablesをリセットしたい場合は、次のように手動でコマンドを実行する必要があります。

```bash
iptables -F && iptables -t nat -F && iptables -t mangle -F && iptables -X
```

IPVS tablesをリセットしたい場合は、次のコマンドを実行する必要があります。

```bash
ipvsadm -C
```

ノードを削除します。

```bash
kubectl delete node <node name>
```

クラスターのセットアップを最初から始めたいときは、`kubeadm init`や`kubeadm join`を適切な引数を付けて実行すればいいだけです。

### コントロールプレーンのクリーンアップ

コントロールホスト上で`kubeadm reset`を実行すると、ベストエフォートでのクリーンアップが実行できます。

このサブコマンドとオプションに関するより詳しい情報は、[`kubeadm reset`](/docs/reference/setup-tools/kubeadm/kubeadm-reset/)リファレンスドキュメントを読んでください。

## バージョンスキューポリシー {#version-skew-policy}

kubeadmは、kubeadmが管理するコンポーネントに対してバージョンの差異を許容しますが、kubeadmのバージョンをコントロールプレーンのコンポーネント、kube-proxy、kubeletと一致させることを推奨します。

### Kubernetesのバージョンに対するkubeadmのバージョンの差異

kubeadmは、kubeadmと同じバージョンか、1つ前のバージョンのKubernetesコンポーネントで使用できます。
Kubernetesのバージョンは`kubeadm init`の`--kubernetes-version`、もしくは`--config`を使用する場合の[`ClusterConfiguration.kubernetesVersion`](/docs/reference/config-api/kubeadm-config.v1beta4/)フィールドで指定できます。 
このオプションはkube-apiserver、kube-controller-manager、kube-scheduler、kube-proxyのバージョンを制御します。

例:

* kubeadmのバージョン: {{< skew currentVersion >}}
* `kubernetesVersion`は、{{< skew currentVersion >}}または{{< skew currentVersionAddMinor -1 >}}でなければならない

### kubeletに対するkubeadmのバージョンの差異

Kubernetesのバージョンと同様に、kubeadmは、kubeadmと同じバージョン、もしくは3つ前までのバージョンをkubeletに使用できます。

例:

* kubeadmのバージョン: {{< skew currentVersion >}}
* ホスト上のkubeletのバージョンは、{{< skew currentVersion >}}、{{< skew currentVersionAddMinor -1 >}}、{{< skew currentVersionAddMinor -2 >}}、もしくは{{< skew currentVersionAddMinor -3 >}}でなければならない

### kubeadmに対するkubeadmのバージョンの差異

kubeadmによって管理されている既存のノードまたはクラスター全体を、kubeadmコマンドが操作するには一定の制限が存在します。

新たなノードをクラスターに参加させる場合、`kubeadm join`を実行するkubeadmのバイナリは、`kubeadm init`によるクラスター構築、もしくは`kubeadm upgrade`によるノードのアップグレードのいずれかに使用されたkubeadmの最新バージョンと一致している必要があります。
同様の制限は`kubeadm upgrade`を除く他のkubeadmのコマンドにも適用されます。

`kubeadm join`の例:

* `kubeadm init`によるクラスター構築で使用したkubeadmのバージョン: {{< skew currentVersion >}}
* 参加するノードは、{{< skew currentVersion >}}のバージョンのkubeadmバイナリを使用しなければならない

アップグレードするノードでは、そのノードの管理に使用しているkubeadmのバージョンと同じマイナーバージョン、もしくはマイナーバージョンが1つ新しいkubeadmを使用する必要があります。

`kubeadm upgrade`の例:

* クラスター構築またはノードのアップグレードに使用されたkubeadmのバージョン: {{< skew currentVersionAddMinor -1 >}}
* ノードのアップグレードで使用するkubeadmのバージョンは、{{< skew currentVersionAddMinor -1 >}}または{{< skew currentVersion >}}でなければならない

異なるKubernetesコンポーネント間のバージョン差異についてさらに学ぶには、[バージョンスキューポリシー](/ja/releases/version-skew-policy/)を参照してください。

## 制限事項 {#limitations}

### クラスターの弾力性 {#resilience}

ここで作られたクラスターは、1つのコントロールプレーンノードと、その上で動作する1つのetcdデータベースしか持ちません。
つまり、コントロールプレーンノードが故障した場合、クラスターのデータは失われ、クラスターを最初から作り直す必要がある可能性があります。

対処方法:

* 定期的に[etcdをバックアップ](https://etcd.io/docs/v3.5/op-guide/recovery/)する。
  kubeadmが設定するetcdのデータディレクトリは、コントロールプレーンノードの`/var/lib/etcd`にあります。

* 複数のコントロールプレーンノードを使用する。
  [高可用性トポロジーのオプション](/docs/setup/production-environment/tools/kubeadm/ha-topology/)では、[より高い可用性](/docs/setup/production-environment/tools/kubeadm/high-availability/)を提供するクラスターのトポロジーの選択について説明しています。

### プラットフォームの互換性 {#multi-platform}

kubeadmのdeb/rpmパッケージおよびバイナリは、[multi-platform proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md)に従い、amd64、arm(32ビット)、arm64、ppc64le、およびs390x向けにビルドされています。

マルチプラットフォームのコントロールプレーンおよびアドオン用のコンテナイメージも、v1.12からサポートされています。

すべてのプラットフォーム向けのソリューションを提供しているネットワークプロバイダーは一部のみです。それぞれのプロバイダーが選択したプラットフォームをサポートしているかどうかを確認するには、前述のネットワークプロバイダーのリストを参照してください。

## トラブルシューティング {#troubleshooting}

kubeadmに関する問題が起きたときは、[トラブルシューティングドキュメント](/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を確認してください。

<!-- discussion -->

## {{% heading "whatsnext" %}}

* [Sonobuoy](https://github.com/heptio/sonobuoy)を使用してクラスターが適切に動作しているか検証する。
* <a id="lifecycle" />`kubeadm`を使用したクラスターをアップグレードする方法について、[kubeadmクラスターをアップグレードする](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を参照する。
* `kubeadm`の高度な利用方法について[kubeadmリファレンスドキュメント](/docs/reference/setup-tools/kubeadm/)で学ぶ。
* Kubernetesの[コンセプト](/docs/concepts/)や[`kubectl`](/docs/reference/kubectl/)についてさらに学ぶ。
* Podネットワークアドオンのより完全なリストを[クラスターのネットワーク](/docs/concepts/cluster-administration/networking/)で確認する。
* <a id="other-addons" />ロギング、モニタリング、ネットワークポリシー、仮想化、Kubernetesクラスターの制御のためのツールなど、その他のアドオンについて、[アドオンのリスト](/docs/concepts/cluster-administration/addons/)で確認する。
* クラスターイベントやPod内で実行中のアプリケーションから送られるログをクラスターがハンドリングする方法を設定する。関係する要素の概要を理解するために、[ロギングのアーキテクチャ](/docs/concepts/cluster-administration/logging/)を読む。

### フィードバック {#feedback}

* バグを見つけた場合は、[kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)で報告してください。
* サポートを受けたい場合は、[#kubeadm](https://kubernetes.slack.com/messages/kubeadm/) Slackチャンネルを訪ねてください。
* General SIG Cluster Lifecycle development Slackチャンネル: [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycleメーリングリスト: [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)
