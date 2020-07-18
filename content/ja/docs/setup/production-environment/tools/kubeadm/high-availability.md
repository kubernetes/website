---
title: kubeadmを使用した高可用性クラスターの作成
content_type: task
weight: 60
---

<!-- overview -->

このページでは、kubeadmを使用して、高可用性クラスターを作成する、2つの異なるアプローチを説明します:

- 積み重なったコントロールプレーンノードを使う方法。こちらのアプローチは、必要なインフラストラクチャーが少ないです。etcdのメンバーと、コントロールプレーンノードは同じ場所に置かれます。
- 外部のetcdクラスターを使う方法。こちらのアプローチには、より多くのインフラストラクチャーが必要です。コントロールプレーンノードと、etcdのメンバーは分離されます。

先へ進む前に、どちらのアプローチがアプリケーションの要件と、環境に適合するか、慎重に検討してください。[こちらの比較](/ja/docs/setup/independent/ha-topology/)が、それぞれの利点/欠点について概説しています。

高可用性クラスターの作成で問題が発生した場合は、kueadmの[issue tracker](https://github.com/kubernetes/kubeadm/issues/new)でフィードバックを提供してください。

[高可用性クラスターのアップグレード](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade-ha-1-13)も参照してください。

{{< caution >}}
このページはクラウド上でクラスターを構築することには対応していません。ここで説明されているどちらのアプローチも、クラウド上で、LoadBalancerタイプのServiceオブジェクトや、動的なPersistentVolumeを利用して動かすことはできません。
{{< /caution >}}



## {{% heading "prerequisites" %}}


どちらの方法でも、以下のインフラストラクチャーが必要です:

- master用に、[kubeadmの最小要件](/ja/docs/setup/independent/install-kubeadm/#before-you-begin)を満たす3台のマシン
- worker用に、[kubeadmの最小要件](/ja/docs/setup/independent/install-kubeadm/#before-you-begin)を満たす3台のマシン
- クラスター内のすべてのマシン間がフルにネットワーク接続可能であること(パブリック、もしくはプライベートネットワーク)
- すべてのマシンにおいて、sudo権限
- あるデバイスから、システム内のすべてのノードに対しSSH接続できること
- `kubeadm`と`kubelet`がすべてのマシンにインストールされていること。 `kubectl`は任意です。

外部etcdクラスターには、以下も必要です:

- etcdメンバー用に、追加で3台のマシン


<!-- steps -->

## 両手順における最初のステップ

### kube-apiserver用にロードバランサーを作成

{{< note >}}
ロードバランサーには多くの設定項目があります。以下の例は、一選択肢に過ぎません。あなたのクラスター要件には、異なった設定が必要かもしれません。
{{< /note >}}

1.  DNSで解決される名前で、kube-apiserver用ロードバランサーを作成する。
    - クラウド環境では、コントロールプレーンノードをTCPフォワーディングロードバランサーの後ろに置かなければなりません。このロードバランサーはターゲットリストに含まれる、すべての健全なコントロールプレーンノードにトラフィックを分配します。apiserverへのヘルスチェックはkube-apiserverがリッスンするポート(デフォルト値: `:6443`)に対する、TCPチェックです。

    - クラウド環境では、IPアドレスを直接使うことは推奨されません。

    - ロードバランサーは、apiserverポートで、全てのコントロールプレーンノードと通信できなければなりません。また、リスニングポートに対する流入トラフィックも許可されていなければなりません。

    - [HAProxy](http://www.haproxy.org/)をロードバランサーとして使用することができます。

    - ロードバランサーのアドレスは、常にkubeadmの`ControlPlaneEndpoint`のアドレスと一致することを確認してください。

1.  ロードバランサーに、最初のコントロールプレーンノードを追加し、接続をテストする:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - apiserverはまだ動いていないので、接続の拒否は想定通りです。しかし、タイムアウトしたのであれば、ロードバランサーはコントロールプレーンノードと通信できなかったことを意味します。もし、タイムアウトが起きたら、コントロールプレーンノードと通信できるように、ロードバランサーを再設定してください。

1.  残りのコントロールプレーンノードを、ロードバランサーのターゲットグループに追加します。

## 積み重なったコントロールプレーンとetcdノード

### 最初のコントロールプレーンノードの手順

1.  最初のコントロールプレーンノードを初期化します:

    ```sh
    sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
    ```

    - `--kubernetes-version`フラグを使用して、使用するKubernetesのバージョンを設定できます。kubeadm、kubelet、kubectl、Kubernetesのバージョンを一致させることが推奨されます。
    - `--control-plane-endpoint`フラグはロードバランサーのアドレスかDNSと、ポートに一致する必要があります。
    - `--upload-certs`フラグは全てのコントロールプレーンノードで共有する必要がある証明書をクラスターにアップロードするために使用されます。代わりに、コントロールプレーンノード間で手動あるいは自動化ツールを使用して証明書をコピーしたい場合は、このフラグを削除し、以下の[手動による証明書の配布](#manual-certs)のセクションを参照してください。

    {{< note >}}`kubeadm init`の`--config`フラグと`--certificate-key`フラグは混在させることはできないため、[kubeadm configuration](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)を使用する場合は`certificateKey`フィールドを適切な場所に追加する必要があります(`InitConfiguration`と`JoinConfiguration: controlPlane`の配下)。{{< /note >}}

    {{< note >}}CalicoなどのいくつかのCNIネットワークプラグインは`192.168.0.0/16`のようなCIDRを必要としますが、Weaveなどは必要としません。[CNIネットワークドキュメント](/ja/docs/setup/independent/create-cluster-kubeadm/#pod-network)を参照してください。PodにCIDRを設定するには、`ClusterConfiguration`の`networking`オブジェクトに`podSubnet: 192.168.0.0/16`フィールドを設定してください。{{< /note >}}

    - このような出力がされます:

    ```sh
    ...
    You can now join any number of control-plane node by running the following command on each as a root:
        kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    
    Please note that the certificate-key gives access to cluster sensitive data, keep it secret!
    As a safeguard, uploaded-certs will be deleted in two hours; If necessary, you can use kubeadm init phase upload-certs to reload certs afterward.
    
    Then you can join any number of worker nodes by running the following on each as root:
        kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
    ```

    - この出力をテキストファイルにコピーします。あとで、他のコントロールプレーンノードとワーカーノードをクラスターに参加させる際に必要になります。

    - `--upload-certs`フラグを`kubeadm init`で使用すると、プライマリコントロールプレーンの証明書が暗号化されて、`kubeadm-certs` Secretにアップロードされます。

    - 証明書を再アップロードして新しい復号キーを生成するには、すでにクラスターに参加しているコントロールプレーンノードで次のコマンドを使用します:

    ```sh
    sudo kubeadm init phase upload-certs --upload-certs
    ```

    - また、後で`join`で使用できるように、`init`中にカスタムした`--certificate-key`を指定することもできます。このようなキーを生成するには、次のコマンドを使用します:

    ```sh
    kubeadm alpha certs certificate-key
    ```

    {{< note >}}
    `kubeadm-certs`のSecretと復号キーは2時間で期限切れとなります。
    {{< /note >}}

    {{< caution >}}
    コマンド出力に記載されているように、証明書キーはクラスターの機密データへのアクセスを提供します。秘密にしてください！
    {{< /caution >}}

1.  Weave CNIプラグインをapplyします:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  以下のコマンドを入力し、コンポーネントのPodが起動するのを確認します:

    ```sh
    kubectl get pod -n kube-system -w
    ```

    - 最初のコントロールプレーンノードが初期化を完了してから、新しいノードを参加させることが推奨されます。

1.  証明書ファイルを最初のコントロールプレーンノードから残りのノードにコピーします:

    以下の例では、`CONTROL_PLANE_IPS`を他のコントロールプレーンノードのIPアドレスで置き換えます。
    ```sh
    USER=ubuntu # 変更可能
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
        scp /etc/kubernetes/admin.conf "${USER}"@$host:
    done
    ```

{{< caution >}}
上のリストにある証明書だけをコピーしてください。kubeadmが、参加するコントロールプレーンノード用に、残りの証明書と必要なSANの生成を行います。間違って全ての証明書をコピーしてしまったら、必要なSANがないため、追加ノードの作成は失敗するかもしれません。
{{< /caution >}}

### 残りのコントロールプレーンノードの手順

1.  `scp`を使用する手順で作成したファイルを移動します:

    ```sh
    USER=ubuntu # 変更可能
    mkdir -p /etc/kubernetes/pki/etcd
    mv /home/${USER}/ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/ca.key /etc/kubernetes/pki/
    mv /home/${USER}/sa.pub /etc/kubernetes/pki/
    mv /home/${USER}/sa.key /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
    mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    mv /home/${USER}/admin.conf /etc/kubernetes/admin.conf
    ```

    この手順で、`/etc/kubernetes`フォルダーに必要な全てのファイルが書き込まれます。

1.  `kubeadm init`を最初のノードで実行した際に取得したjoinコマンドを使って、このノードで`kubeadm join`を開始します。このようなコマンドになるはずです:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token j04n3m.octy8zely83cy2ts --discovery-token-ca-cert-hash sha256:84938d2a22203a8e56a787ec0c6ddad7bc7dbd52ebabc62fd5f4dbea72b14d1f --experimental-control-plane
    ```
    - `--experimental-control-plane`フラグが追加されています。このフラグは、コントロールプレーンノードのクラスターへの参加を自動化します。

1.  以下のコマンドをタイプし、コンポーネントのPodが起動するのを確認します:

    ```sh
    kubectl get pod -n kube-system -w
    ```

1.  これらのステップを、残りのコントロールプレーンノードに対して繰り返します。

## 外部のetcdノード

### etcdクラスターの構築

- [こちらの手順](/ja/docs/setup/independent/setup-ha-etcd-with-kubeadm/)にしたがって、etcdクラスターを構築してください。

### 最初のコントロールプレーンノードの構築

1.  以下のファイルをetcdクラスターのどれかのノードからこのノードへコピーしてください:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    +scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    +scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - `CONTROL_PLANE`の値を、このマシンの`user@host`で置き換えます。

1.  以下の内容で、`kubeadm-config.yaml`という名前の設定ファイルを作成します:

        apiVersion: kubeadm.k8s.io/v1beta1
        kind: ClusterConfiguration
        kubernetesVersion: stable
        apiServer:
          certSANs:
          - "LOAD_BALANCER_DNS"
        controlPlaneEndpoint: "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT"
        etcd:
            external:
                endpoints:
                - https://ETCD_0_IP:2379
                - https://ETCD_1_IP:2379
                - https://ETCD_2_IP:2379
                caFile: /etc/kubernetes/pki/etcd/ca.crt
                certFile: /etc/kubernetes/pki/apiserver-etcd-client.crt
                keyFile: /etc/kubernetes/pki/apiserver-etcd-client.key

    - ここで、積み重なったetcdと外部etcdの違いは、kubeadmコンフィグの`etcd`に`external`フィールドを使用していることです。積み重なったetcdトポロジーの場合、これは自動で管理されます。

    -  テンプレート内の以下の変数を、クラスターに合わせて適切な値に置き換えます:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

1.  `kubeadm init --config kubeadm-config.yaml`をこのノードで実行します。

1.  表示されたjoinコマンドを、あとで使うためにテキストファイルに書き込みます。

1.  Weave CNIプラグインをapplyします:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### 残りのコントロールプレーンノードの手順

残りのコントロールプレーンノードを参加させるために、[こちらの手順](#残りのコントロールプレーンノードの手順)に従います。ローカルetcdメンバーが作られないことを除いて、積み重なったetcdの構築と同じ手順です。

まとめると:

- 最初のコントロールプレーンノードが完全に初期化されているのを確認します。
- 証明書を、最初のコントロールプレーンノードから他のコントロールプレーンノードへコピーします。
- テキストファイルに保存したjoinコマンドに`--experimental-control-plane` フラグを加えたものを使って、それぞれのコントロールプレーンノードを参加させます。

## コントロールプレーン起動後の共通タスク

### Podネットワークのインストール

Podネットワークをインストールするには、[こちらの手順に従ってください](/ja/docs/setup/independent/create-cluster-kubeadm/#pod-network)。master設定ファイルで提供したPod CIDRのどれかに一致することを確認します。

### workerのインストール

`kubeadm init`コマンドから返されたコマンドを利用して、workerノードをクラスターに参加させることが可能です。workerノードには、`--experimental-control-plane`フラグを追加する必要はありません。


