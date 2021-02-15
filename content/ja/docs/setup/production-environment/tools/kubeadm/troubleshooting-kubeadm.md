---
title: kubeadmのトラブルシューティング
content_type: concept
weight: 20
---

<!-- overview -->

どのプログラムでもそうですが、kubeadmのインストールや実行でエラーが発生することがあります。このページでは、一般的な失敗例をいくつか挙げ、問題を理解して解決するための手順を示しています。

本ページに問題が記載されていない場合は、以下の手順を行ってください。:

- 問題がkubeadmのバグによるものと思った場合:
  - [github.com/kubernetes/kubeadm](https://github.com/kubernetes/kubeadm/issues)にアクセスして、既存のイシューを探してください。
  - イシューがない場合は、テンプレートにしたがって[新しくイシューを立ててください](https://github.com/kubernetes/kubeadm/issues/new)。

- kubeadm がどのように動作するかわからない場合は、[Slack](http://slack.k8s.io/)の #kubeadm チャンネルで質問するか、[StackOverflow](https://stackoverflow.com/questions/tagged/kubernetes)で質問をあげてください。その際は、他の方が助けを出しやすいように`#kubernetes`や`#kubeadm`といったタグをつけてください。

<!-- body -->

## インストール中に`ebtables`もしくは他の似たような実行プログラムが見つからない

`kubeadm init`の実行中に以下のような警告が表示された場合は、以降に記載するやり方を行ってください。

```sh
[preflight] WARNING: ebtables not found in system path
[preflight] WARNING: ethtool not found in system path
```

このような場合、ノード上に `ebtables`, `ethtool` などの実行ファイルがない可能性があります。これらをインストールするには、以下のコマンドを実行します。

- Ubuntu/Debianユーザーは、`apt install ebtables ethtool`を実行してください。
- CentOS/Fedoraユーザーは、`yum install ebtables ethtool`を実行してください。

## インストール中にkubeadmがコントロールプレーンを待ち続けて止まる

以下のを出力した後に `kubeadm init` が止まること場合は、`kubeadm init` を実行してください:

```sh
[apiclient] Created API client, waiting for the control plane to become ready
```

これはいくつかの問題が原因となっている可能性があります。最も一般的なのは:

- ネットワーク接続の問題が挙げられます。続行する前に、お使いのマシンがネットワークに完全に接続されていることを確認してください。
- kubeletのデフォルトのcgroupドライバの設定がDockerで使用されているものとは異なっている場合も考えられます。
  システムログファイル(例: `/var/log/message`)をチェックするか、`journalctl -u kubelet` の出力を調べてください:

  ```shell
  error: failed to run Kubelet: failed to create kubelet:
  misconfiguration: kubelet cgroup driver: "systemd" is different from docker cgroup driver: "cgroupfs"
  ```

  以上のようなエラーが現れていた場合、cgroupドライバの問題を解決するには、以下の2つの方法があります:

 1. [ここ](/ja/docs/setup/independent/install-kubeadm/#installing-docker)の指示に従ってDockerを再度インストールします。

 1. Dockerのcgroupドライバに合わせてkubeletの設定を手動で変更します。その際は、[マスターノード上でkubeletが使用するcgroupドライバを設定する](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#configure-cgroup-driver-used-by-kubelet-on-master-node)を参照してください。

- control plane Docker コンテナがクラッシュループしたり、ハングしたりしています。これは `docker ps` を実行し、`docker logs` を実行して各コンテナを調査することで確認できます。

## 管理コンテナを削除する時にkubeadmが止まる

Dockerが停止して、Kubernetesで管理されているコンテナを削除しないと、以下のようなことが起こる可能性があります。:

```bash
sudo kubeadm reset
[preflight] Running pre-flight checks
[reset] Stopping the kubelet service
[reset] Unmounting mounted directories in "/var/lib/kubelet"
[reset] Removing kubernetes-managed containers
(block)
```

考えられる解決策は、Dockerサービスを再起動してから `kubeadm reset` を再実行することです:

```bash
sudo systemctl restart docker.service
sudo kubeadm reset
```

dockerのログを調べるのも有効である場合があります:

```sh
journalctl -ul docker
```

## Podの状態が`RunContainerError`、`CrashLoopBackOff`、または`Error`となる

`kubeadm init` の直後には、これらの状態ではポッドは存在しないはずです。

- `kubeadm init`の_直後_にこれらの状態のいずれかにポッドがある場合は、kubeadmのリポジトリにイシューを立ててください。ネットワークソリューションをデプロイするまでは `coredns` (または `kube-dns`)は `Pending`状態でなければなりません。
- ネットワークソリューションをデプロイしても `coredns` (または `kube-dns`) に何も起こらない場合にRunContainerError`、`CrashLoopBackOff`、`Error` の状態でPodが表示された場合は、インストールしたPod Networkソリューションが壊れている可能性が高いです。より多くのRBACの特権を付与するか、新しいバージョンを使用する必要があるかもしれません。Pod Networkプロバイダのイシュートラッカーにイシューを出して、そこで問題をトリアージしてください。
- 1.12.1よりも古いバージョンのDockerをインストールした場合は、`systemd` で `dockerd` を起動する際に `MountFlags=slave` オプションを削除して `docker` を再起動してください。マウントフラグは `/usr/lib/systemd/system/docker.service` で確認できます。MountFlagsはKubernetesがマウントしたボリュームに干渉し、Podsを`CrashLoopBackOff`状態にすることがあります。このエラーは、Kubernetesが `var/run/secrets/kubernetes.io/serviceaccount` ファイルを見つけられない場合に発生します。

## `coredns`(もしくは`kube-dns`)が`Pending`状態でスタックする

kubeadm はネットワークプロバイダに依存しないので、管理者は選択した [ポッドネットワークソリューションをインストール](/docs/concepts/cluster-administration/addons/) をする必要があります。CoreDNS を完全にデプロイする前に Pod ネットワークをインストールする必要があります。したがって、ネットワークがセットアップされる前の `Pending` 状態になります。

## `HostPort`サービスが動かない

`HostPort`と`HostIP`の機能は、ご使用のPod Networkプロバイダによって利用可能です。Pod Networkソリューションの作者に連絡して、`HostPort` と `HostIP` 機能が利用可能かどうかを確認してください。

Calico、Canal、FlannelのCNIプロバイダは、HostPortをサポートしていることが確認されています。

詳細については、[CNI portmap documentation] (https://github.com/containernetworking/plugins/blob/master/plugins/meta/portmap/README.md) を参照してください。

ネットワークプロバイダが portmap CNI プラグインをサポートしていない場合は、[services](/ja/docs/concepts/services-networking/service/#nodeport)を使用するか、`HostNetwork=true`を使用してください。

## サービスIP経由でPodにアクセスすることができない

- 多くのネットワークアドオンは、ポッドがサービス IP を介して自分自身にアクセスできるようにする [ヘアピンモード](/docs/tasks/debug-application-cluster/debug-service/#a-pod-cannot-reach-itself-via-service-ip)を有効にしていません。これは[CNI](https://github.com/containernetworking/cni/issues/476)に関連する問題です。ヘアピンモードのサポート状況については、ネットワークアドオンプロバイダにお問い合わせください。

- VirtualBoxを使用している場合(直接またはVagrant経由)は、`hostname -i`がルーティング可能なIPアドレスを返すことを確認する必要があります。デフォルトでは、最初のインターフェースはルーティング可能でないホスト専用のネットワークに接続されています。これを回避するには `/etc/hosts` を修正する必要があります。例としてはこの [Vagrantfile](https://github.com/errordeveloper/k8s-playground/blob/22dd39dfc06111235620e6c4404a96ae146f26fd/Vagrantfile#L11) を参照してください。

## TLS証明書のエラー

以下のエラーは、証明書の不一致の可能性を示しています。

```none
# kubectl get pods
Unable to connect to the server: x509: certificate signed by unknown authority (possibly because of "crypto/rsa: verification error" while trying to verify candidate authority certificate "kubernetes")
```

- `HOME/.kube/config` ファイルに有効な証明書が含まれていることを確認し、必要に応じて証明書を再生成します。kubeconfigファイル内の証明書はbase64でエンコードされています。証明書をデコードするには `base64 --decode` コマンドを、証明書情報を表示するには `openssl x509 -text -noout` コマンドを用いてください。
- 環境変数 `KUBECONFIG` の設定を解除するには以下のコマンドを実行するか:

  ```sh
  unset KUBECONFIG
  ```

  設定をデフォルトの `KUBECONFIG` の場所に設定します:

  ```sh
  export KUBECONFIG=/etc/kubernetes/admin.conf
  ```

- もう一つの回避策は、既存の `kubeconfig` を "admin" ユーザに上書きすることです:

  ```sh
  mv  $HOME/.kube $HOME/.kube.bak
  mkdir $HOME/.kube
  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
  sudo chown $(id -u):$(id -g) $HOME/.kube/config
  ```

## Vagrant内でPodネットワークとしてflannelを使用する時のデフォルトNIC

以下のエラーは、ポッドネットワークに何か問題があったことを示している可能性を示しています:

```sh
Error from server (NotFound): the server could not find the requested resource
```

- Vagrant内のポッドネットワークとしてflannelを使用している場合は、flannelのデフォルトのインターフェース名を指定する必要があります。

  Vagrantは通常、2つのインターフェースを全てのVMに割り当てます。1つ目は全てのホストに IP アドレス `10.0.2.15` が割り当てられており、NATされる外部トラフィックのためのものです。

  これは、ホストの最初のインターフェイスをデフォルトにしているフランネルの問題につながるかもしれません。これは、すべてのホストが同じパブリック IP アドレスを持っていると考えることになります。これを防ぐには、2 番目のインターフェイスが選択されるように `--iface eth1` フラグを flannel に渡してください。

## 公開されていないIPがコンテナに使われている

状況によっては、`kubectl logs` や `kubectl run` コマンドが以下のようなエラーを返すことがあります:

```sh
Error from server: Get https://10.19.0.41:10250/containerLogs/default/mysql-ddc65b868-glc5m/mysql: dial tcp 10.19.0.41:10250: getsockopt: no route to host
```

- これには、おそらくマシンプロバイダのポリシーによって、一見同じサブネット上の他のIPと通信できないIPをKubernetesが使用している可能性があります。
- DigitalOceanはパブリックIPとプライベートIPを`eth0`に割り当てていますが、`kubelet`はパブリックIPではなく、ノードの`InternalIP`として後者を選択します。

  `ifconfig`ではエイリアスIPアドレスが表示されないので、`ifconfig`の代わりに`ip addr show`を使用してこのシナリオをチェックしてください。あるいは、DigitalOcean専用のAPIエンドポイントを使用して、ドロップレットからアンカーIPを取得することもできます。:

  ```sh
  curl http://169.254.169.254/metadata/v1/interfaces/public/0/anchor_ipv4/address
  ```

  回避策としては、`--node-ip`を使ってどのIPを使うかを `kubelet` に伝えることです。DigitalOceanを使用する場合、オプションのプライベートネットワークを使用したい場合は、パブリックIP（`eth0`に割り当てられている）かプライベートIP（`eth1`に割り当てられている）のどちらかを指定します。これにはkubeadm `NodeRegistrationOptions` 構造体の [`KubeletExtraArgs` セクション](https://github.com/kubernetes/kubernetes/blob/release-1.13/cmd/kubeadm/app/apis/kubeadm/v1beta1/types.go) が利用できます。

  `kubelet`をリスタートしてください:

  ```sh
  systemctl daemon-reload
  systemctl restart kubelet
  ```

## `coredns`のPodが`CrashLoopBackOff`もしくは`Error`状態になる

SELinux を実行しているノードで古いバージョンの Docker を使用している場合、`coredns` ポッドが起動しないということが起きるかもしれません。この問題を解決するには、以下のオプションのいずれかを試してみてください。:

- [新しいDockerのバージョン](/ja/docs/setup/independent/install-kubeadm/#installing-docker)にアップグレードする。

- [SELinuxを無効化する](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/security-enhanced_linux/sect-security-enhanced_linux-enabling_and_disabling_selinux-disabling_selinux)。
- `coredns`を変更して、`allowPrivilegeEscalation` を `true` に設定:

```bash
kubectl -n kube-system get deployment coredns -o yaml | \
  sed 's/allowPrivilegeEscalation: false/allowPrivilegeEscalation: true/g' | \
  kubectl apply -f -
```

CoreDNSに `CrashLoopBackOff` が発生する別の原因は、KubernetesにデプロイされたCoreDNSポッドがループを検出したときに発生します。CoreDNS がループを検出して終了するたびに、Kubernetes が CoreDNS ポッドを再起動しようとするのを避けるために、[いくつかの回避策](https://github.com/coredns/coredns/tree/master/plugin/loop#troubleshooting-loops-in-kubernetes-clusters) が用意されています。

{{< warning >}}
SELinuxを無効にするか `allowPrivilegeEscalation` を `true` に設定すると、クラスタのセキュリティが損なわれる可能性があります。
{{< /warning >}}

## etcdのpodが継続的に再起動する

以下のエラーが発生した場合は:

```
rpc error: code = 2 desc = oci runtime error: exec failed: container_linux.go:247: starting container process caused "process_linux.go:110: decoding init error from pipe caused \"read parent: connection reset by peer\""
```

この問題は、CentOS 7 を Docker 1.13.1.84 で実行した場合に表示されます。このバージョンの Docker では、kubelet が etcd コンテナに実行されないようにすることができます。

この問題を回避するには、以下のいずれかのオプションを選択します:

- 1.13.1-75のような以前のバージョンのDockerにロールバックする
```
yum downgrade docker-1.13.1-75.git8633870.el7.centos.x86_64 docker-client-1.13.1-75.git8633870.el7.centos.x86_64 docker-common-1.13.1-75.git8633870.el7.centos.x86_64
```

- 18.06 のような最新の推奨バージョンをインストールする:
```bash
sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce-18.06.1.ce-3.el7.x86_64
```

## コンマで区切られた値のリストを `--component-extra-args` フラグ内の引数に渡すことができない

`-component-extra-args` のような `kubeadm init` フラグを使うと、kube-apiserver のようなコントロールプレーンコンポーネントにカスタム引数を渡すことができます。しかし、このメカニズムは値の解析に使われる基本的な型 (`mapStringString`) のために制限されています。

もし、`--apiserver-extra-args "enable-admission plugins=LimitRanger,NamespaceExists"`のようにカンマで区切られた複数の値をサポートする引数を渡した場合、このフラグは `flag: malformed pair, expect string=string` で失敗します。これは `--apiserver-extra-args` の引数リストが `key=value` のペアを期待しており、この場合 `NamespacesExists` は値を欠いたキーとみなされるからです。

別の方法として、`key=value` のペアを以下のように分離してみることもできます:
`--apiserver-extra-args "enable-admission-plugins=LimitRanger,enable-admission-plugins=NamespaceExists"` しかし、この場合は、キー `enable-admission-plugins` は `NamespaceExists` の値しか持たないことになります。既知の回避策としては、kubeadm [設定ファイル](/ja/docs/setup/production-environment/tools/kubeadm/control-plane-flags/#apiserver-flags)を使用することが挙げられます。

## cloud-controller-manager によってノードが初期化される前に kube-proxy がスケジューリングされる

クラウドプロバイダのシナリオでは、クラウドコントローラマネージャがノードアドレスを初期化する前に、kube-proxyが新しいワーカーノードでスケジューリングされてしまうことがあります。これにより、kube-proxyがノードのIPアドレスを正しく拾えず、ロードバランサを管理するプロキシ機能に悪影響を及ぼします。

kube-proxy Podsでは以下のようなエラーが発生します:
```
server.go:610] Failed to retrieve node IP: host IP unknown; known addresses: []
proxier.go:340] invalid nodeIP, initializing kube-proxy with 127.0.0.1 as nodeIP
```

既知の解決策は、初期のガード条件が緩和されるまで他のノードから離しておき、条件に関係なくコントロールプレーンノード上でスケジューリングできるように、キューブプロキシDaemonSetにパッチを当てることです。:

```
kubectl -n kube-system patch ds kube-proxy -p='{ "spec": { "template": { "spec": { "tolerations": [ { "key": "CriticalAddonsOnly", "operator": "Exists" }, { "effect": "NoSchedule", "key": "node-role.kubernetes.io/master" } ] } } } }'
```

Tこの問題のトラッキング問題は[こちら](https://github.com/kubernetes/kubeadm/issues/1027)。

## kubeadmの設定をマーシャリングする際、NodeRegistration.Taintsフィールドが省略される

*注意: この [イシュー](https://github.com/kubernetes/kubeadm/issues/1358) は、kubeadm タイプをマーシャルするツール(YAML 設定ファイルなど)にのみ適用されます。これはkubeadm API v1beta2で修正される予定です。*

デフォルトでは、kubeadmはコントロールプレーンノードに `node-role.kubernetes.io/master:NoSchedule` のテイントを適用します。kubeadmがコントロールプレーンノードに影響を与えないようにし、`InitConfiguration.NodeRegistration.Taints`を空のスライスに設定すると、マーシャリング時にこのフィールドは省略されます。フィールドが省略された場合、kubeadmはデフォルトのテイントを適用します。

少なくとも2つの回避策があります:

1. 空のスライスの代わりに `node-role.kubernetes.io/master:PreferNoSchedule` テイントを使用します。他のノードに容量がない限り、[Podsはマスター上でスケジュールされます](/docs/concepts/configuration/taint-and-toleration/)。

2. kubeadm init終了後のテイントの除去:
```bash
kubectl taint nodes NODE_NAME node-role.kubernetes.io/master:NoSchedule-
 ```

## ノード{#usr-mounted-read-only}に `/usr` が読み取り専用でマウントされる

Fedora CoreOSなどのLinuxディストリビューションでは、ディレクトリ `/usr` が読み取り専用のファイルシステムとしてマウントされます。 [flex-volume サポート](https://github.com/kubernetes/community/blob/ab55d85/contributors/devel/sig-storage/flexvolume.md) では、kubelet や kube-controller-manager のような Kubernetes コンポーネントはデフォルトで`/usr/libexec/kubernetes/kubelet-plugins/volume/exec/`のパスを使用していますが、この機能を動作させるためには flex-volume ディレクトリは _書き込み可能_な状態でなければなりません。

この問題を回避するには、kubeadm[設定ファイル](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)を使用してflex-volumeディレクトリを設定します。

プライマリコントロールプレーンノード（`kubeadm init`で作成されたもの）上で、`--config`で以下のファイルを渡します:

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    volume-plugin-dir: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
controllerManager:
  extraArgs:
    flex-volume-plugin-dir: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

ノードをジョインするには:

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: JoinConfiguration
nodeRegistration:
  kubeletExtraArgs:
    volume-plugin-dir: "/opt/libexec/kubernetes/kubelet-plugins/volume/exec/"
```

あるいは、`/usr` マウントを書き込み可能にするために `/etc/fstab` を変更することもできますが、これは Linux ディストリビューションの設計原理を変更していることに注意してください。
