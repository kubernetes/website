---
title: kubeadmを使用した高可用性クラスターの作成
content_type: task
weight: 60
---

<!-- overview -->

このページでは、kubeadmを使用して、高可用性クラスターを作成する、2つの異なるアプローチを説明します:

- 積層コントロールプレーンノードを使う方法。こちらのアプローチは、必要なインフラストラクチャーが少ないです。etcdのメンバーと、コントロールプレーンノードは同じ場所に置かれます。
- 外部のetcdクラスターを使う方法。こちらのアプローチには、より多くのインフラストラクチャーが必要です。コントロールプレーンノードと、etcdのメンバーは分離されます。

先へ進む前に、どちらのアプローチがアプリケーションの要件と、環境に適合するか、慎重に検討してください。[こちらの比較](/ja/docs/setup/production-environment/tools/kubeadm/ha-topology/)が、それぞれの利点/欠点について概説しています。

高可用性クラスターの作成で問題が発生した場合は、kueadmの[issue tracker](https://github.com/kubernetes/kubeadm/issues/new)でフィードバックを提供してください。

[高可用性クラスターのアップグレード](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/)も参照してください。

{{< caution >}}
このページはクラウド上でクラスターを構築することには対応していません。ここで説明されているどちらのアプローチも、クラウド上で、LoadBalancerタイプのServiceオブジェクトや、動的なPersistentVolumeを利用して動かすことはできません。
{{< /caution >}}



## {{% heading "prerequisites" %}}


どちらの方法でも、以下のインフラストラクチャーが必要です:

- master用に、[kubeadmの最小要件](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#始める前に)を満たす3台のマシン
- worker用に、[kubeadmの最小要件](/ja/docs/setup/production-environment/tools/kubeadm/install-kubeadm/#始める前に)を満たす3台のマシン
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

    - ロードバランサーのアドレスは、常にkubeadmの`ControlPlaneEndpoint`のアドレスと一致することを確認してください。

    - 詳細は[Options for Software Load Balancing](https://github.com/kubernetes/kubeadm/blob/master/docs/ha-considerations.md#options-for-software-load-balancing)をご覧ください。

1.  ロードバランサーに、最初のコントロールプレーンノードを追加し、接続をテストする:

    ```sh
    nc -v LOAD_BALANCER_IP PORT
    ```

    - apiserverはまだ動いていないので、接続の拒否は想定通りです。しかし、タイムアウトしたのであれば、ロードバランサーはコントロールプレーンノードと通信できなかったことを意味します。もし、タイムアウトが起きたら、コントロールプレーンノードと通信できるように、ロードバランサーを再設定してください。

1.  残りのコントロールプレーンノードを、ロードバランサーのターゲットグループに追加します。

## 積層コントロールプレーンとetcdノード

### 最初のコントロールプレーンノードの手順

1.  最初のコントロールプレーンノードを初期化します:

    ```sh
    sudo kubeadm init --control-plane-endpoint "LOAD_BALANCER_DNS:LOAD_BALANCER_PORT" --upload-certs
    ```

    - `--kubernetes-version`フラグで使用するKubernetesのバージョンを設定できます。kubeadm、kubelet、kubectl、Kubernetesのバージョンを一致させることが推奨されます。
    - `--control-plane-endpoint`フラグは、ロードバランサーのIPアドレスまたはDNS名と、ポートが設定される必要があります。
    - `--upload-certs`フラグは全てのコントロールプレーンノードで共有する必要がある証明書をクラスターにアップロードするために使用されます。代わりに、コントロールプレーンノード間で手動あるいは自動化ツールを使用して証明書をコピーしたい場合は、このフラグを削除し、以下の[証明書の手動配布](#manual-certs)のセクションを参照してください。

    {{< note >}}`kubeadm init`の`--config`フラグと`--certificate-key`フラグは混在させることはできないため、[kubeadm configuration](https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2)を使用する場合は`certificateKey`フィールドを適切な場所に追加する必要があります(`InitConfiguration`と`JoinConfiguration: controlPlane`の配下)。{{< /note >}}

    {{< note >}}いくつかのCNIネットワークプラグインはPodのIPのCIDRの指定など追加の設定を必要としますが、必要としないプラグインもあります。[CNIネットワークドキュメント](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)を参照してください。PodにCIDRを設定するには、`ClusterConfiguration`の`networking`オブジェクトに`podSubnet: 192.168.0.0/16`フィールドを設定してください。{{< /note >}}  

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

    - この出力をテキストファイルにコピーします。あとで、他のコントロールプレーンノードとワーカーノードをクラスターに参加させる際に必要です。

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

1.  使用するCNIプラグインを適用します:  
    [こちらの手順に従い](/ja/docs/setup/production-environment/tools/kubeadm/create-cluster-kubeadm/#pod-network)CNIプロバイダーをインストールします。該当する場合は、kubeadmの設定で指定されたPodのCIDRに対応していることを確認してください。

    Weave Netを使用する場合の例:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

1.  以下のコマンドを入力し、コンポーネントのPodが起動するのを確認します:

    ```sh
    kubectl get pod -n kube-system -w
    ```

### 残りのコントロールプレーンノードの手順

{{< note >}}
kubeadmバージョン1.15以降、複数のコントロールプレーンノードを並行してクラスターに参加させることができます。
このバージョンの前は、最初のノードの初期化が完了した後でのみ、新しいコントロールプレーンノードを順番にクラスターに参加させる必要があります。
{{< /note >}}

追加のコントロールプレーンノード毎に、以下の手順を行います。

1.  `kubeadm init`を最初のノードで実行した際に取得したjoinコマンドを使って、新しく追加するコントロールプレーンノードで`kubeadm join`を開始します。このようなコマンドになるはずです:

    ```sh
    sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866 --control-plane --certificate-key f8902e114ef118304e561c3ecd4d0b543adc226b7a07f675f56564185ffe0c07
    ```

    - `--control-plane`フラグによって、`kubeadm join`の実行は新しいコントロールプレーンを作成します。
    - `-certificate-key ...`を指定したキーを使って、クラスターの`kubeadm-certs` Secretからダウンロードされたコントロールプレーンの証明書が復号されます。

## 外部のetcdノード

外部のetcdノードを使ったクラスターの設定は、積層etcdの場合と似ていますが、最初にetcdを設定し、kubeadmの設定ファイルにetcdの情報を渡す必要があります。

### etcdクラスターの構築

1. [こちらの手順](/ja/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)にしたがって、etcdクラスターを構築してください。

1. [こちらの手順](#manual-certs)にしたがって、SSHを構築してください。

1. 以下のファイルをクラスター内の任意のetcdノードから最初のコントロールプレーンノードにコピーしてください:

    ```sh
    export CONTROL_PLANE="ubuntu@10.0.0.7"
    scp /etc/kubernetes/pki/etcd/ca.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.crt "${CONTROL_PLANE}":
    scp /etc/kubernetes/pki/apiserver-etcd-client.key "${CONTROL_PLANE}":
    ```

    - `CONTROL_PLANE`の値を、最初のコントロールプレーンノードの`user@host`で置き換えます。

### 最初のコントロールプレーンノードの構築

1.  以下の内容で、`kubeadm-config.yaml`という名前の設定ファイルを作成します:

        apiVersion: kubeadm.k8s.io/v1beta2
        kind: ClusterConfiguration
        kubernetesVersion: stable
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

    {{< note >}}
    ここで、積層etcdと外部etcdの違いは、外部etcdの構成では`etcd`の`external`オブジェクトにetcdのエンドポイントが記述された設定ファイルが必要です。積層etcdトポロジーの場合、これは自動で管理されます。
    {{< /note >}}

    -  テンプレート内の以下の変数を、クラスターに合わせて適切な値に置き換えます:

        - `LOAD_BALANCER_DNS`
        - `LOAD_BALANCER_PORT`
        - `ETCD_0_IP`
        - `ETCD_1_IP`
        - `ETCD_2_IP`

以下の手順は、積層etcdの構築と同様です。

1.  `sudo kubeadm init --config kubeadm-config.yaml --upload-certs`をこのノードで実行します。

1.  表示されたjoinコマンドを、あとで使うためにテキストファイルに書き込みます。

1.  使用するCNIプラグインを適用します。以下はWeave CNIの場合です:

    ```sh
    kubectl apply -f "https://cloud.weave.works/k8s/net?k8s-version=$(kubectl version | base64 | tr -d '\n')"
    ```

### 残りのコントロールプレーンノードの手順

手順は、積層etcd構築の場合と同じです:

- 最初のコントロールプレーンノードが完全に初期化されているのを確認します。
- テキストファイルに保存したjoinコマンドを使って、それぞれのコントロールプレーンノードをクラスターへ参加させます。コントロールプレーンノードは1台ずつクラスターへ参加させるのを推奨します。
- `--certificate-key`で指定する復号キーは、デフォルトで2時間で期限切れになることを忘れないでください。

## コントロールプレーン起動後の共通タスク

### workerのインストール

`kubeadm init`コマンドから返されたコマンドを利用して、workerノードをクラスターに参加させることが可能です。

```sh
sudo kubeadm join 192.168.0.200:6443 --token 9vr73a.a8uxyaju799qwdjv --discovery-token-ca-cert-hash sha256:7c2e69131a36ae2a042a339b33381c6d0d43887e2de83720eff5359e26aec866
```

## 証明書の手動配布 {#manual-certs}

`--upload-certs`フラグを指定して`kubeadm init`を実行しない場合、プライマリコントロールプレーンノードから他のコントロールプレーンノードへ証明書を手動でコピーする必要があります。

コピーを行うには多くの方法があります。次の例では`ssh`と`scp`を使用しています。

1台のマシンから全てのノードをコントロールしたいのであれば、SSHが必要です。

1.  システム内の全ての他のノードにアクセスできるメインデバイスで、ssh-agentを有効にします

    ```
    eval $(ssh-agent)
    ```

1.  SSHの秘密鍵を、セッションに追加します:

    ```
    ssh-add ~/.ssh/path_to_private_key
    ```

1.  正常に接続できることを確認するために、ノード間でSSHします。

    - ノードにSSHする際は、必ず`-A`フラグをつけます:

        ```
        ssh -A 10.0.0.7
        ```

    - ノードでsudoするときは、SSHフォワーディングが動くように、環境変数を引き継ぎます:

        ```
        sudo -E -s
        ```

1.  全てのノードでSSHを設定したら、`kubeadm init`を実行した後、最初のコントロールノードプレーンノードで次のスクリプトを実行します。このスクリプトは、最初のコントロールプレーンノードから残りのコントロールプレーンノードへ証明書ファイルをコピーします:

    次の例の、`CONTROL_PLANE_IPS`を他のコントロールプレーンノードのIPアドレスに置き換えます。

    ```sh
    USER=ubuntu # 環境に合わせる
    CONTROL_PLANE_IPS="10.0.0.7 10.0.0.8"
    for host in ${CONTROL_PLANE_IPS}; do
        scp /etc/kubernetes/pki/ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.key "${USER}"@$host:
        scp /etc/kubernetes/pki/sa.pub "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.crt "${USER}"@$host:
        scp /etc/kubernetes/pki/front-proxy-ca.key "${USER}"@$host:
        scp /etc/kubernetes/pki/etcd/ca.crt "${USER}"@$host:etcd-ca.crt
        # 外部のetcdノード使用時はこちらのコマンドを実行
        scp /etc/kubernetes/pki/etcd/ca.key "${USER}"@$host:etcd-ca.key
    done
    ```

    {{< caution >}}
    上のリストにある証明書だけをコピーしてください。kubeadmが、参加するコントロールプレーンノード用に、残りの証明書と必要なSANの生成を行います。間違って全ての証明書をコピーしてしまったら、必要なSANがないため、追加ノードの作成は失敗するかもしれません。
    {{< /caution >}}

1.  次に、クラスターに参加させる残りの各コントロールプレーンノードで`kubeadm join`を実行する前に次のスクリプトを実行する必要があります。このスクリプトは、前の手順でコピーした証明書をホームディレクトリから`/etc/kubernetes/pki`へ移動します:

    ```sh
    USER=ubuntu # 環境に合わせる
    mkdir -p /etc/kubernetes/pki/etcd
    mv /home/${USER}/ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/ca.key /etc/kubernetes/pki/
    mv /home/${USER}/sa.pub /etc/kubernetes/pki/
    mv /home/${USER}/sa.key /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.crt /etc/kubernetes/pki/
    mv /home/${USER}/front-proxy-ca.key /etc/kubernetes/pki/
    mv /home/${USER}/etcd-ca.crt /etc/kubernetes/pki/etcd/ca.crt
    # 外部のetcdノード使用時はこちらのコマンドを実行
    mv /home/${USER}/etcd-ca.key /etc/kubernetes/pki/etcd/ca.key
    ```
