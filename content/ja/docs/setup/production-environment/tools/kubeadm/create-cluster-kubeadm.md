---
title: kubeadmを使用したクラスターの作成
content_type: task
weight: 30
---

<!-- overview -->

<img src="/images/kubeadm-stacked-color.png" align="right" width="150px">ベストプラクティスに準拠した実用最小限のKubernetesクラスターを作成します。実際、`kubeadm`を使用すれば、[Kubernetes Conformance tests](https://kubernetes.io/blog/2017/10/software-conformance-certification)に通るクラスターをセットアップすることができます。`kubeadm`は、[ブートストラップトークン](/docs/reference/access-authn-authz/bootstrap-tokens/)やクラスターのアップグレードなどのその他のクラスターのライフサイクルの機能もサポートします。

`kubeadm`ツールは、次のようなときに適しています。

- 新しいユーザーが初めてKubernetesを試すためのシンプルな方法が必要なとき。
- 既存のユーザーがクラスターのセットアップを自動化し、アプリケーションをテストする方法が必要なとき。
- より大きなスコープで、他のエコシステムやインストーラーツールのビルディングブロックが必要なとき。

`kubeadm`は、ラップトップ、クラウドのサーバー群、Raspberry Piなどの様々なマシンにインストールして使えます。クラウドとオンプレミスのどちらにデプロイする場合でも、`kubeadm`はAnsibleやTerraformなどのプロビジョニングシステムに統合できます。

## {{% heading "prerequisites" %}}

このガイドを進めるには、以下の環境が必要です。

- UbuntuやCentOSなど、deb/rpmパッケージと互換性のあるLinux OSが動作している1台以上のマシンがあること。
- マシンごとに2GiB以上のRAMが搭載されていること。それ以下の場合、アプリ実行用のメモリーがほとんど残りません。
- コントロールプレーンノードとして使用するマシンには、最低でも2CPU以上あること。
- クラスター内の全マシン間に完全なネットワーク接続があること。パブリックネットワークとプライベートネットワークのいずれでも使えます。

また、新しいクラスターで使いたいKubernetesのバージョンをデプロイできるバージョンの`kubeadm`を使用する必要もあります。

[Kubernetesのバージョンとバージョンスキューポリシー](/ja/docs/setup/release/version-skew-policy/#supported-versions)は、`kubeadm`にもKubernetes全体と同じように当てはまります。Kubernetesと`kubeadm`がサポートするバージョンを理解するには、上記のポリシーを確認してください。このページは、Kubernetes {{< param "version" >}}向けに書かれています。

kubeadmツールの全体の機能の状態は、一般利用可能(GA)です。一部のサブ機能はまだ活発に開発が行われています。クラスター作成の実装は、ツールの進化に伴ってわずかに変わるかもしれませんが、全体の実装は非常に安定しているはずです。

{{< note >}}
`kubeadm alpha`以下のすべてのコマンドは、定義通り、アルファレベルでサポートされています。
{{< /note >}}



<!-- steps -->

## 目的

* シングルコントロールプレーンのKubernetesクラスターをインストールする
* クラスター上にPodネットワークをインストールして、Podがお互いに通信できるようにする

## 手順

### ホストへのkubeadmのインストール

「[kubeadmのインストール](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)」を読んでください。

{{< note >}}
すでにkubeadmがインストール済みである場合は、最新バージョンのkubeadmを取得するために`apt-get update && apt-get upgrade`や`yum update`を実行してください。

アップグレード中、kubeletが数秒ごとに再起動します。これは、kubeadmがkubeletにするべきことを伝えるまで、crashloopの状態で待機するためです。このcrashloopは期待通りの通常の動作です。コントロールプレーンの初期化が完了すれば、kubeletは正常に動作します。
{{< /note >}}

### コントロールプレーンノードの初期化

コントロールプレーンノードとは、{{< glossary_tooltip term_id="etcd" >}}(クラスターのデータベース)や{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}({{< glossary_tooltip text="kubectl" term_id="kubectl" >}}コマンドラインツールが通信する相手)などのコントロールプレーンのコンポーネントが実行されるマシンです。

1. (推奨)シングルコントロールプレーンの`kubeadm`クラスターを高可用性クラスターにアップグレードする予定がある場合、`--control-plane-endpoint`を指定して、すべてのコントロールプレーンノードとエンドポイントを共有する必要があります。エンドポイントにはDNSネームやロードバランサーのIPアドレスが使用できます。
1. Podネットワークアドオンを選んで、`kubeadm init`に引数を渡す必要があるかどうか確認してください。選んだサードパーティーのプロバイダーによっては、`--pod-network-cidr`をプロバイダー固有の値に設定する必要がある場合があります。詳しくは、[Podネットワークアドオンのインストール](#pod-network)を参照してください。
1. (オプション)バージョン1.14から、`kubeadm`はよく知られたドメインソケットのパスリストを用いて、Linux上のコンテナランタイムの検出を試みます。異なるコンテナランタイムを使用する場合やプロビジョニングするノードに2つ以上のランタイムがインストールされている場合、`kubeadm init`に`--cri-socket`引数を指定してください。詳しくは、[ランタイムのインストール](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-runtime)を読んでください。
1. (オプション)明示的に指定しない限り、`kubeadm`はデフォルトゲートウェイに関連付けられたネットワークインターフェースを使用して、この特定のコントロールプレーンノードのAPIサーバーのadvertise addressを設定します。異なるネットワークインターフェースを使用するには、`kubeadm init`に`--apiserver-advertise-address=<ip-address>`引数を指定してください。IPv6アドレスを使用するIPv6 Kubernetesクラスターをデプロイするには、たとえば`--apiserver-advertise-address=fd00::101`のように、IPv6アドレスを指定する必要があります。
1. (オプション)`kubeadm init`を実行する前に`kubeadm config images pull`を実行して、gcr.ioコンテナイメージレジストリに接続できるかどうかを確認します。

コントロールプレーンノードを初期化するには、次のコマンドを実行します。

```bash
kubeadm init <args>
```

### apiserver-advertise-addressとControlPlaneEndpointに関する検討

`--apiserver-advertise-address`は、この特定のコントロールプレーンノードのAPIサーバーへのadvertise addressを設定するために使えますが、`--control-plane-endpoint`は、すべてのコントロールプレーンノード共有のエンドポイントを設定するために使えます。

`--control-plane-endpoint`はIPアドレスと、IPアドレスへマッピングできるDNS名を使用できます。利用可能なソリューションをそうしたマッピングの観点から評価するには、ネットワーク管理者に相談してください。

以下にマッピングの例を示します。

```
192.168.0.102 cluster-endpoint
```

ここでは、`192.168.0.102`がこのノードのIPアドレスであり、`cluster-endpoint`がこのIPアドレスへとマッピングされるカスタムDNSネームです。このように設定することで、`--control-plane-endpoint=cluster-endpoint`を`kubeadm init`に渡せるようになり、`kubeadm join`にも同じDNSネームを渡せます。後で`cluster-endpoint`を修正して、高可用性が必要なシナリオでロードバランサーのアドレスを指すようにすることができます。

kubeadmでは、`--control-plane-endpoint`を渡さずに構築したシングルコントロールプレーンのクラスターを高可用性クラスターに切り替えることはサポートされていません。

### 詳細な情報

`kubeadm init`の引数のより詳細な情報は、[kubeadmリファレンスガイド](/docs/reference/setup-tools/kubeadm/kubeadm/)を参照してください。

設定オプションの全リストは、[設定ファイルのドキュメント](/docs/reference/setup-tools/kubeadm/kubeadm-init/#config-file)で確認できます。

コントロールプレーンコンポーネントやetcdサーバーのliveness probeへのオプションのIPv6の割り当てなど、コントロールプレーンのコンポーネントをカスタマイズしたい場合は、[カスタムの引数](/ja/docs/setup/production-environment/tools/kubeadm/control-plane-flags/)に示されている方法で各コンポーネントに追加の引数を与えてください。

`kubeadm init`を再び実行する場合は、初めに[クラスターの破壊](#tear-down)を行う必要があります。

もし異なるアーキテクチャのノードをクラスターにjoinさせたい場合は、デプロイしたDaemonSetがそのアーキテクチャ向けのコンテナイメージをサポートしているか確認してください。

初めに`kubeadm init`は、マシンがKubernetesを実行する準備ができているかを確認する、一連の事前チェックを行います。これらの事前チェックはエラー発生時には警告を表示して終了します。次に、`kubeadm init`はクラスターのコントロールプレーンのコンポーネントをダウンロードしてインストールします。これには数分掛かるかもしれません。出力は次のようになります。

```none
[init] Using Kubernetes version: vX.Y.Z
[preflight] Running pre-flight checks
[preflight] Pulling images required for setting up a Kubernetes cluster
[preflight] This might take a minute or two, depending on the speed of your internet connection
[preflight] You can also perform this action in beforehand using 'kubeadm config images pull'
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Activating the kubelet service
[certs] Using certificateDir folder "/etc/kubernetes/pki"
[certs] Generating "etcd/ca" certificate and key
[certs] Generating "etcd/server" certificate and key
[certs] etcd/server serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "etcd/healthcheck-client" certificate and key
[certs] Generating "etcd/peer" certificate and key
[certs] etcd/peer serving cert is signed for DNS names [kubeadm-cp localhost] and IPs [10.138.0.4 127.0.0.1 ::1]
[certs] Generating "apiserver-etcd-client" certificate and key
[certs] Generating "ca" certificate and key
[certs] Generating "apiserver" certificate and key
[certs] apiserver serving cert is signed for DNS names [kubeadm-cp kubernetes kubernetes.default kubernetes.default.svc kubernetes.default.svc.cluster.local] and IPs [10.96.0.1 10.138.0.4]
[certs] Generating "apiserver-kubelet-client" certificate and key
[certs] Generating "front-proxy-ca" certificate and key
[certs] Generating "front-proxy-client" certificate and key
[certs] Generating "sa" key and public key
[kubeconfig] Using kubeconfig folder "/etc/kubernetes"
[kubeconfig] Writing "admin.conf" kubeconfig file
[kubeconfig] Writing "kubelet.conf" kubeconfig file
[kubeconfig] Writing "controller-manager.conf" kubeconfig file
[kubeconfig] Writing "scheduler.conf" kubeconfig file
[control-plane] Using manifest folder "/etc/kubernetes/manifests"
[control-plane] Creating static Pod manifest for "kube-apiserver"
[control-plane] Creating static Pod manifest for "kube-controller-manager"
[control-plane] Creating static Pod manifest for "kube-scheduler"
[etcd] Creating static Pod manifest for local etcd in "/etc/kubernetes/manifests"
[wait-control-plane] Waiting for the kubelet to boot up the control plane as static Pods from directory "/etc/kubernetes/manifests". This can take up to 4m0s
[apiclient] All control plane components are healthy after 31.501735 seconds
[uploadconfig] storing the configuration used in ConfigMap "kubeadm-config" in the "kube-system" Namespace
[kubelet] Creating a ConfigMap "kubelet-config-X.Y" in namespace kube-system with the configuration for the kubelets in the cluster
[patchnode] Uploading the CRI Socket information "/var/run/dockershim.sock" to the Node API object "kubeadm-cp" as an annotation
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the label "node-role.kubernetes.io/master=''"
[mark-control-plane] Marking the node kubeadm-cp as control-plane by adding the taints [node-role.kubernetes.io/master:NoSchedule]
[bootstrap-token] Using token: <token>
[bootstrap-token] Configuring bootstrap tokens, cluster-info ConfigMap, RBAC Roles
[bootstraptoken] configured RBAC rules to allow Node Bootstrap tokens to post CSRs in order for nodes to get long term certificate credentials
[bootstraptoken] configured RBAC rules to allow the csrapprover controller automatically approve CSRs from a Node Bootstrap Token
[bootstraptoken] configured RBAC rules to allow certificate rotation for all node client certificates in the cluster
[bootstraptoken] creating the "cluster-info" ConfigMap in the "kube-public" namespace
[addons] Applied essential addon: CoreDNS
[addons] Applied essential addon: kube-proxy

Your Kubernetes control-plane has initialized successfully!

To start using your cluster, you need to run the following as a regular user:

  mkdir -p $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config

You should now deploy a Pod network to the cluster.
Run "kubectl apply -f [podnetwork].yaml" with one of the options listed at:
  /ja/docs/concepts/cluster-administration/addons/

You can now join any number of machines by running the following on each node
as root:

  kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>
```

kubectlをroot以外のユーザーでも実行できるようにするには、次のコマンドを実行します。これらのコマンドは、`kubectl init`の出力の中にも書かれています。

```bash
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

あなたが`root`ユーザーである場合は、代わりに次のコマンドを実行します。

```bash
export KUBECONFIG=/etc/kubernetes/admin.conf
```

`kubeadm init`が出力した`kubeadm join`コマンドをメモしておいてください。[クラスターにノードを追加する](#join-nodes)ために、このコマンドが必要になります。

トークンは、コントロールプレーンノードと追加ノードの間の相互認証に使用します。ここに含まれるトークンには秘密の情報が含まれます。このトークンを知っていれば、誰でもクラスターに認証済みノードを追加できてしまうため、取り扱いには注意してください。`kubeadm token`コマンドを使用すると、これらのトークンの一覧、作成、削除ができます。詳しくは[kubeadmリファレンスガイド](/docs/reference/setup-tools/kubeadm/kubeadm-token/)を読んでください。

### Podネットワークアドオンのインストール {#pod-network}

{{< caution >}}
このセクションには、ネットワークのセットアップとデプロイの順序に関する重要な情報が書かれています。先に進む前に以下のすべてのアドバイスを熟読してください。

**Pod同士が通信できるようにするには、{{< glossary_tooltip text="Container Network Interface" term_id="cni" >}}(CNI)をベースとするPodネットワークアドオンをデプロイしなければなりません。ネットワークアドオンをインストールする前には、Cluster DNS(CoreDNS)は起動しません。**

- Podネットワークがホストネットワークと決して重ならないように気をつけてください。もし重なると、様々な問題が起こってしまう可能性があります。(ネットワークプラグインが優先するPodネットワークとホストのネットワークの一部が衝突することが分かった場合、適切な代わりのCIDRを考える必要があります。そして、`kubeadm init`の実行時に`--pod-network-cidr`にそのCIDRを指定し、ネットワークプラグインのYAMLでは代わりにそのCIDRを使用してください)

- デフォルトでは、`kubeadm`は[RBAC](/docs/reference/access-authn-authz/rbac/)(role based access control)の使用を強制します。PodネットワークプラグインがRBACをサポートしていて、またそのデプロイに使用するマニフェストもRBACをサポートしていることを確認してください。

- クラスターでIPv6を使用したい場合、デュアルスタック、IPv6のみのシングルスタックのネットワークのいずれであっても、PodネットワークプラグインがIPv6をサポートしていることを確認してください。IPv6のサポートは、CNIの[v0.6.0](https://github.com/containernetworking/cni/releases/tag/v0.6.0)で追加されました。

{{< /caution >}}

{{< note >}}
現在、Calicoはkubeadmプロジェクトがe2eテストを実施している唯一のCNIプラグインです。
もしCNIプラグインに関する問題を見つけた場合、kubeadmやkubernetesではなく、そのCNIプラグインの課題管理システムへ問題を報告してください。
{{< /note >}}

CNIを使用するKubernetes Podネットワークを提供する外部のプロジェクトがいくつかあります。一部のプロジェクトでは、[ネットワークポリシー](/ja/docs/concepts/services-networking/network-policies/)もサポートしています。

[Kubernetesのネットワークモデル](/ja/docs/concepts/cluster-administration/networking/#how-to-implement-the-kubernetes-networking-model)を実装したアドオンの一覧も確認してください。

Podネットワークアドオンをインストールするには、コントロールプレーンノード上またはkubeconfigクレデンシャルを持っているノード上で、次のコマンドを実行します。

```bash
kubectl apply -f <add-on.yaml>
```

インストールできるPodネットワークは、クラスターごとに1つだけです。

Podネットワークがインストールされたら、`kubectl get pods --all-namespaces`の出力結果でCoreDNS Podが`Running`状態であることをチェックすることで、ネットワークが動作していることを確認できます。そして、一度CoreDNS Podが動作すれば、続けてノードを追加できます。

もしネットワークやCoreDNSが`Running`状態にならない場合は、`kubeadm`の[トラブルシューティングガイド](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)をチェックしてください。

### コントロールプレーンノードの隔離

デフォルトでは、セキュリティ上の理由により、クラスターはコントロールプレーンノードにPodをスケジューリングしません。たとえば、開発用のKubernetesシングルマシンのクラスターなどで、Podをコントロールプレーンノードにスケジューリングしたい場合は、次のコマンドを実行します。

```bash
kubectl taint nodes --all node-role.kubernetes.io/master-
```

出力は次のようになります。

```
node "test-01" untainted
taint "node-role.kubernetes.io/master:" not found
taint "node-role.kubernetes.io/master:" not found
```

このコマンドは、コントロールプレーンノードを含むすべてのノードから`node-role.kubernetes.io/master`taintを削除します。その結果、スケジューラーはどこにでもPodをスケジューリングできるようになります。

### ノードの追加 {#join-nodes}

ノードは、ワークロード(コンテナやPodなど)が実行される場所です。新しいノードをクラスターに追加するためには、各マシンに対して、以下の手順を実行してください。

* マシンへSSHする
* rootになる(例: `sudo su -`)
* `kubeadm init`実行時に出力されたコマンドを実行する。たとえば、次のようなコマンドです。

```bash
kubeadm join --token <token> <control-plane-host>:<control-plane-port> --discovery-token-ca-cert-hash sha256:<hash>
```

トークンがわからない場合は、コントロールプレーンノードで次のコマンドを実行すると取得できます。

```bash
kubeadm token list
```

出力は次のようになります。

```console
TOKEN                    TTL  EXPIRES              USAGES           DESCRIPTION            EXTRA GROUPS
8ewj1p.9r9hcjoqgajrj4gi  23h  2018-06-12T02:51:28Z authentication,  The default bootstrap  system:
                                                   signing          token generated by     bootstrappers:
                                                                    'kubeadm init'.        kubeadm:
                                                                                           default-node-token
```

デフォルトでは、トークンは24時間後に有効期限が切れます。もし現在のトークンの有効期限が切れた後にクラスターにノードを参加させたい場合は、コントロールプレーンノードで次のコマンドを実行することで、新しいトークンを生成できます。

```bash
kubeadm token create
```

このコマンドの出力は次のようになります。

```console
5didvk.d09sbcov8ph2amjw
```

もし`--discovery-token-ca-cert-hash`の値がわからない場合は、コントロールプレーンノード上で次のコマンドチェーンを実行することで取得できます。

```bash
openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | \
   openssl dgst -sha256 -hex | sed 's/^.* //'
```

出力は次のようになります。

```console
8cb2de97839780a412b93877f8507ad6c94f73add17d5d7058e91741c9d5ec78
```

{{< note >}}
IPv6タプルを`<control-plane-host>:<control-plane-port>`と指定するためには、IPv6アドレスを角括弧で囲みます。たとえば、`[fd00::101]:2073`のように書きます。
{{< /note >}}

出力は次のようになります。

```
[preflight] Running pre-flight checks

... (joinワークフローのログ出力) ...

Node join complete:
* Certificate signing request sent to control-plane and response
  received.
* Kubelet informed of new secure connection details.

Run 'kubectl get nodes' on control-plane to see this machine join.
```

数秒後、コントロールプレーンノード上で`kubectl get nodes`を実行すると、出力内にこのノードが表示されるはずです。

### (オプション)コントロールプレーンノード以外のマシンからのクラスター操作

他のコンピューター(例: ラップトップ)上のkubectlがクラスターと通信できるようにするためには、次のようにして、administratorのkubeconfigファイルをコントロールプレーンノードからそのコンピューター上にコピーする必要があります。

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf get nodes
```

{{< note >}}
上の例では、rootユーザーに対するSSH接続が有効であることを仮定しています。もしそうでない場合は、`admin.conf`ファイルを誰か他のユーザーからアクセスできるようにコピーした上で、代わりにそのユーザーを使って`scp`してください。

`admin.conf`ファイルはユーザーにクラスターに対する _特権ユーザー_ の権限を与えます。そのため、このファイルを使うのは控えめにしなければなりません。通常のユーザーには、明示的に許可した権限を持つユニークなクレデンシャルを生成することを推奨します。これには、`kubeadm kubeconfig user --client-name <CN>`コマンドが使えます。このコマンドを実行すると、KubeConfigファイルがSTDOUTに出力されるので、ファイルに保存してユーザーに配布します。その後、`kubectl create (cluster)rolebinding`コマンドを使って権限を付与します。
{{< /note >}}

### (オプション)APIサーバーをlocalhostへプロキシする

クラスターの外部からAPIサーバーに接続したいときは、次のように`kubectl proxy`コマンドが使えます。

```bash
scp root@<control-plane-host>:/etc/kubernetes/admin.conf .
kubectl --kubeconfig ./admin.conf proxy
```

これで、ローカルの`http://localhost:8001/api/v1`からAPIサーバーにアクセスできるようになります。

## クリーンアップ {#tear-down}

テストのためにクラスターに破棄可能なサーバーを使用した場合、サーバーのスイッチをオフにすれば、以降のクリーンアップの作業は必要ありません。クラスターのローカルの設定を削除するには、`kubectl config delete-cluster`を実行します。

しかし、もしよりきれいにクラスターのプロビジョンをもとに戻したい場合は、初めに[ノードのdrain](/docs/reference/generated/kubectl/kubectl-commands#drain)を行い、ノードが空になっていることを確認した後、ノードの設定を削除する必要があります。

### ノードの削除

適切なクレデンシャルを使用してコントロールプレーンノードに削除することを伝えます。次のコマンドを実行してください。

```bash
kubectl drain <node name> --delete-local-data --force --ignore-daemonsets
```

ノードが削除される前に、`kubeadm`によってインストールされた状態をリセットします。

```bash
kubeadm reset
```

リセットプロセスでは、iptablesのルールやIPVS tablesのリセットやクリーンアップは行われません。iptablesをリセットしたい場合は、次のように手動でコマンドを実行する必要があります。

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

<!-- discussion -->

## 次の手順 {#whats-next}

* [Sonobuoy](https://github.com/heptio/sonobuoy)を使用してクラスターが適切に動作しているか検証する。
* <a id="lifecycle" />`kubeadm`を使用したクラスターをアップグレードする方法について、[kubeadmクラスターをアップグレードする](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)を読む。
* `kubeadm`の高度な利用方法について[kubeadmリファレンスドキュメント](/docs/reference/setup-tools/kubeadm/kubeadm)で学ぶ。
* Kubernetesの[コンセプト](/ja/docs/concepts/)や[`kubectl`](/ja/docs/reference/kubectl/)についてもっと学ぶ。
* Podネットワークアドオンのより完全なリストを[クラスターのネットワーク](/ja/docs/concepts/cluster-administration/networking/)で確認する。
* <a id="other-addons" />ロギング、モニタリング、ネットワークポリシー、仮想化、Kubernetesクラスターの制御のためのツールなど、その他のアドオンについて、[アドオンのリスト](/ja/docs/concepts/cluster-administration/addons/)で確認する。
* クラスターイベントやPod内で実行中のアプリケーションから送られるログをクラスターがハンドリングする方法を設定する。関係する要素の概要を理解するために、[ロギングのアーキテクチャ](/docs/concepts/cluster-administration/logging/)を読んでください。

### フィードバック {#feedback}

* バグを見つけた場合は、[kubeadm GitHub issue tracker](https://github.com/kubernetes/kubeadm/issues)で報告してください。
* サポートを受けたい場合は、[#kubeadm](https://kubernetes.slack.com/messages/kubeadm/)Slackチャンネルを訪ねてください。
* General SIG Cluster Lifecycle development Slackチャンネル:
  [#sig-cluster-lifecycle](https://kubernetes.slack.com/messages/sig-cluster-lifecycle/)
* SIG Cluster Lifecycle [SIG information](https://github.com/kubernetes/community/tree/master/sig-cluster-lifecycle#readme)
* SIG Cluster Lifecycleメーリングリスト:
  [kubernetes-sig-cluster-lifecycle](https://groups.google.com/forum/#!forum/kubernetes-sig-cluster-lifecycle)

## バージョン互換ポリシー {#version-skew-policy}

バージョンv{{< skew latestVersion >}}の`kubeadm`ツールは、バージョンv{{< skew latestVersion >}}またはv{{< skew prevMinorVersion >}}のコントロールプレーンを持つクラスターをデプロイできます。また、バージョンv{{< skew latestVersion >}}の`kubeadm`は、バージョンv{{< skew prevMinorVersion >}}のkubeadmで構築されたクラスターをアップグレートできます。

未来を見ることはできないため、kubeadm CLI v{{< skew latestVersion >}}はv{{< skew nextMinorVersion >}}をデプロイできないかもしれません。

例: `kubeadm` v1.8は、v1.7とv1.8のクラスターをデプロイでき、v1.7のkubeadmで構築されたクラスターをv1.8にアップグレートできます。

kubeletとコントロールプレーンの間や、他のKubernetesコンポーネント間のバージョンの差異に関する詳しい情報は、以下の資料を確認してください。

* Kubernetes[バージョンスキューサポートポリシー](/ja/docs/setup/release/version-skew-policy/)
* Kubeadm特有の[インストールガイド](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#installing-kubeadm-kubelet-and-kubectl)

## 制限事項 {#limitations}

### クラスターのレジリエンス {#resilience}

ここで作られたクラスターは、1つのコントロールプレーンノードと、その上で動作する1つのetcdデータベースしか持ちません。つまり、コントロールプレーンノードが故障した場合、クラスターのデータは失われ、クラスターを最初から作り直す必要があるかもしれないということです。

対処方法:

* 定期的に[etcdをバックアップ](https://etcd.io/docs/v3.5/op-guide/recovery/)する。kubeadmが設定するetcdのデータディレクトリは、コントロールプレーンノードの`/var/lib/etcd`にあります。

* 複数のコントロールプレーンノードを使用する。[高可用性トポロジーのオプション](/ja/docs/setup/production-environment/tools/kubeadm/ha-topology/)では、[より高い可用性](/ja/docs/setup/production-environment/tools/kubeadm/high-availability/)を提供するクラスターのトポロジーの選択について説明してます。

### プラットフォームの互換性 {#multi-platform}

kubeadmのdeb/rpmパッケージおよびバイナリは、[multi-platform proposal](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/multi-platform.md)に従い、amd64、arm(32ビット)、arm64、ppc64le、およびs390x向けにビルドされています。

マルチプラットフォームのコントロールプレーンおよびアドオン用のコンテナイメージも、v1.12からサポートされています。

すべてのプラットフォーム向けのソリューションを提供しているネットワークプロバイダーは一部のみです。それぞれのプロバイダーが選択したプラットフォームをサポートしているかどうかを確認するには、前述のネットワークプロバイダーのリストを参照してください。

## トラブルシューティング {#troubleshooting}

kubeadmに関する問題が起きたときは、[トラブルシューティングドキュメント](/ja/docs/setup/production-environment/tools/kubeadm/troubleshooting-kubeadm/)を確認してください。
