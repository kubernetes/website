---
title: kubeadmを使用した高可用性etcdクラスターの作成
content_type: task
weight: 70
---

<!-- overview -->


kubeadmはデフォルトで、各コントロールプレーンノード上でローカルのetcdインスタンスを実行します。
また、コントロールプレーンノードとは別のホスト上にetcdインスタンスを構築し、外部etcdクラスターとして扱うこともできます。
これら2つのアプローチの違いについては[高可用性トポロジーのためのオプション](/docs/setup/production-environment/tools/kubeadm/ha-topology)を参照してください。

このタスクでは、kubeadmによるKubernetesクラスター作成時に使用できる、3メンバー構成の高可用性外部etcdクラスターを構築する手順を説明します。

## {{% heading "prerequisites" %}}

- 3台のホストが、TCPポート2379および2380を介して相互に通信できる必要があります。このドキュメントでは、これらがデフォルトポートであることを前提としていますが、kubeadmの設定ファイルで変更することもできます。
- 各ホストには、systemdおよびbash互換シェルがインストールされている必要があります。
- 各ホストに、[コンテナランタイム、kubelet、およびkubeadmをインストールしておく必要があります](/docs/setup/production-environment/tools/kubeadm/install-kubeadm/)。
- 各ホストはKubernetesコンテナイメージレジストリ(`registry.k8s.io`)にアクセスできるか、`kubeadm config images list/pull`を使用して必要なetcdイメージを一覧表示または取得できる必要があります。このガイドでは、kubeletによって管理される[Static Pod](/docs/tasks/configure-pod-container/static-pod/)としてetcdインスタンスを構築します。
- ホスト間でファイルをコピーするための仕組みが必要です。たとえば、`ssh`や`scp`を利用できます。


<!-- steps -->

## クラスターの構築

一般的な方法では、1つのノードですべての証明書を生成し、他のノードには必要なファイルだけを配布します。

{{< note >}}
kubeadmには、以下で説明する証明書の生成に必要な暗号処理機能がすべて備わっています。この例では、他の暗号化ツールは必要ありません。
{{< /note >}}

{{< note >}}
以下の例ではIPv4アドレスを使用していますが、kubeadm、kubelet、etcdでIPv6アドレスを使用するように設定することもできます。
デュアルスタックはKubernetesの一部の機能ではサポートされていますが、etcdではサポートされていません。
Kubernetesのデュアルスタックのサポートについて詳しくは、[kubeadmによるデュアルスタックのサポート](/docs/setup/production-environment/tools/kubeadm/dual-stack-support/)を参照してください。
{{< /note >}}

1. etcdのサービスマネージャーとしてkubeletを設定します。

   {{< note >}}etcdを実行するすべてのホストでこの設定を行う必要があります。{{< /note >}}
   etcdを先に作成するため、kubeadmが提供するkubeletユニットファイルよりも優先順位の高い新しいユニットファイルを作成し、サービスの優先順位を上書きする必要があります。

   ```sh
   cat << EOF > /etc/systemd/system/kubelet.service.d/kubelet.conf
   # "systemd"をコンテナランタイムのcgroupドライバーに置き換えます。kubeletのデフォルト値は"cgroupfs"です。
   # 別のコンテナランタイムを使用する場合は、必要に応じて"containerRuntimeEndpoint"の値を置き換えます。
   #
   apiVersion: kubelet.config.k8s.io/v1beta1
   kind: KubeletConfiguration
   authentication:
     anonymous:
       enabled: false
     webhook:
       enabled: false
   authorization:
     mode: AlwaysAllow
   cgroupDriver: systemd
   address: 127.0.0.1
   containerRuntimeEndpoint: unix:///var/run/containerd/containerd.sock
   staticPodPath: /etc/kubernetes/manifests
   EOF

   cat << EOF > /etc/systemd/system/kubelet.service.d/20-etcd-service-manager.conf
   [Service]
   ExecStart=
   ExecStart=/usr/bin/kubelet --config=/etc/systemd/system/kubelet.service.d/kubelet.conf
   Restart=always
   EOF

   systemctl daemon-reload
   systemctl restart kubelet
   ```

   kubeletのステータスを確認し、実行中であることを確かめます。

   ```sh
   systemctl status kubelet
   ```

1. kubeadmの設定ファイルを作成します。

   以下のスクリプトを使用して、etcdメンバーを実行する各ホスト用にkubeadm設定ファイルを1つずつ生成します。

   ```sh
   # HOST0、HOST1、HOST2を各ホストのIPアドレスに変更します
   export HOST0=10.0.0.6
   export HOST1=10.0.0.7
   export HOST2=10.0.0.8

   # NAME0、NAME1、NAME2を各ホストのホスト名に変更します
   export NAME0="infra0"
   export NAME1="infra1"
   export NAME2="infra2"

   # 他のホストに配置するファイルを格納する一時ディレクトリを作成します
   mkdir -p /tmp/${HOST0}/ /tmp/${HOST1}/ /tmp/${HOST2}/

   HOSTS=(${HOST0} ${HOST1} ${HOST2})
   NAMES=(${NAME0} ${NAME1} ${NAME2})

   for i in "${!HOSTS[@]}"; do
   HOST=${HOSTS[$i]}
   NAME=${NAMES[$i]}
   cat << EOF > /tmp/${HOST}/kubeadmcfg.yaml
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: InitConfiguration
   nodeRegistration:
       name: ${NAME}
   localAPIEndpoint:
       advertiseAddress: ${HOST}
   ---
   apiVersion: "kubeadm.k8s.io/v1beta4"
   kind: ClusterConfiguration
   etcd:
       local:
           serverCertSANs:
           - "${HOST}"
           peerCertSANs:
           - "${HOST}"
           extraArgs:
           - name: initial-cluster
             value: ${NAMES[0]}=https://${HOSTS[0]}:2380,${NAMES[1]}=https://${HOSTS[1]}:2380,${NAMES[2]}=https://${HOSTS[2]}:2380
           - name: initial-cluster-state
             value: new
           - name: name
             value: ${NAME}
           - name: listen-peer-urls
             value: https://${HOST}:2380
           - name: listen-client-urls
             value: https://${HOST}:2379
           - name: advertise-client-urls
             value: https://${HOST}:2379
           - name: initial-advertise-peer-urls
             value: https://${HOST}:2380
   EOF
   done
   ```

1. 認証局を生成します。

   すでにCAがある場合は、そのCAの`crt`ファイルと`key`ファイルを`/etc/kubernetes/pki/etcd/ca.crt`と`/etc/kubernetes/pki/etcd/ca.key`にコピーするだけです。
   これらのファイルをコピーしたら、次の手順「各メンバーの証明書を作成します」に進みます。

   まだCAがない場合は、kubeadmの設定ファイルを生成した`$HOST0`上で次のコマンドを実行します。

   ```
   kubeadm init phase certs etcd-ca
   ```

   これにより、次の2つのファイルが作成されます。

   - `/etc/kubernetes/pki/etcd/ca.crt`
   - `/etc/kubernetes/pki/etcd/ca.key`

1. 各メンバーの証明書を作成します。

   ```sh
   kubeadm init phase certs etcd-server --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST2}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST2}/
   # 再利用できない証明書を削除します
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST1}/kubeadmcfg.yaml
   cp -R /etc/kubernetes/pki /tmp/${HOST1}/
   find /etc/kubernetes/pki -not -name ca.crt -not -name ca.key -type f -delete

   kubeadm init phase certs etcd-server --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-peer --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs etcd-healthcheck-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   kubeadm init phase certs apiserver-etcd-client --config=/tmp/${HOST0}/kubeadmcfg.yaml
   # HOST0用の証明書のため、移動する必要はありません

   # このホストの外部にコピーすべきでない証明書を削除します
   find /tmp/${HOST2} -name ca.key -type f -delete
   find /tmp/${HOST1} -name ca.key -type f -delete
   ```

1. 証明書とkubeadmの設定ファイルをコピーします。

   生成した証明書を、それぞれのホストへ移動します。

   ```sh
   USER=ubuntu
   HOST=${HOST1}
   scp -r /tmp/${HOST}/* ${USER}@${HOST}:
   ssh ${USER}@${HOST}
   USER@HOST $ sudo -Es
   root@HOST $ chown -R root:root pki
   root@HOST $ mv pki /etc/kubernetes/
   ```

1. 必要なファイルがすべて存在することを確認します。

   `$HOST0`上に必要なファイルの完全な一覧は次のとおりです。

   ```
   /tmp/${HOST0}
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── ca.key
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST1`上では次のとおりです。

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

   `$HOST2`上では次のとおりです。

   ```
   $HOME
   └── kubeadmcfg.yaml
   ---
   /etc/kubernetes/pki
   ├── apiserver-etcd-client.crt
   ├── apiserver-etcd-client.key
   └── etcd
       ├── ca.crt
       ├── healthcheck-client.crt
       ├── healthcheck-client.key
       ├── peer.crt
       ├── peer.key
       ├── server.crt
       └── server.key
   ```

1. Static Podマニフェストを作成します。

   証明書と設定ファイルの準備が整ったため、マニフェストを作成します。
   各ホストで`kubeadm`コマンドを実行し、etcd用のStatic Podマニフェストを生成します。

   ```sh
   root@HOST0 $ kubeadm init phase etcd local --config=/tmp/${HOST0}/kubeadmcfg.yaml
   root@HOST1 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   root@HOST2 $ kubeadm init phase etcd local --config=$HOME/kubeadmcfg.yaml
   ```

1. オプション: クラスターの健全性を確認します。

    `etcdctl`を利用できない場合は、コンテナイメージ内でこのツールを実行できます。
    その場合はKubernetes経由ではなく、`crictl run`などのツールを使用してコンテナランタイムから直接実行します。

    ```sh
    ETCDCTL_API=3 etcdctl \
    --cert /etc/kubernetes/pki/etcd/peer.crt \
    --key /etc/kubernetes/pki/etcd/peer.key \
    --cacert /etc/kubernetes/pki/etcd/ca.crt \
    --endpoints https://${HOST0}:2379 endpoint health
    ...
    https://[HOST0 IP]:2379 is healthy: successfully committed proposal: took = 16.283339ms
    https://[HOST1 IP]:2379 is healthy: successfully committed proposal: took = 19.44402ms
    https://[HOST2 IP]:2379 is healthy: successfully committed proposal: took = 35.926451ms
    ```

    - `${HOST0}`を、確認対象ホストのIPアドレスに設定します。


## {{% heading "whatsnext" %}}

稼働中の3つのメンバーで構成されるetcdクラスターを用意できたら、[kubeadmで外部etcdを使用する方法](/docs/setup/production-environment/tools/kubeadm/high-availability/)による高可用性コントロールプレーンの構築に進むことができます。
