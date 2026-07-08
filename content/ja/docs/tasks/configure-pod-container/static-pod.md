---
title: static Podを作成する
weight: 220
content_type: task
---

<!-- overview -->


*Static Pod*とは、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}が監視せず、特定のノード上のkubeletデーモンによって直接管理されるPodです。
コントロールプレーンに管理されるPod(たとえば{{< glossary_tooltip text="Deployment" term_id="deployment" >}}など)とは異なり、kubeletがそれぞれのstatic Podを監視(および障害時には再起動)します。

Static Podは、常に特定のノード上の1つの{{< glossary_tooltip term_id="kubelet" >}}に紐付けられます。

kubeletは、各static Podに対して、自動的にKubernetes APIサーバー上に{{< glossary_tooltip text="ミラーPod" term_id="mirror-pod" >}}の作成を試みます。
つまり、ノード上で実行中のPodはAPIサーバーから検出されますが、APIサーバー自身から制御されることはないということです。
Pod名は、先頭にハイフンを付けたノードのホスト名がサフィックスとして追加されます。

{{< note >}}
複数ノードからなるKubernetesクラスターを実行していて、Podをすべてのノード上で実行するためにstatic Podを使用している場合、おそらくstatic Podの代わりに{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}を使用するべきでしょう。
{{< /note >}}

{{< note >}}
static Podの`spec`は、他のAPIオブジェクト(例: {{< glossary_tooltip text="ServiceAccount" term_id="service-account" >}}、{{< glossary_tooltip text="ConfigMap" term_id="configmap" >}}、{{< glossary_tooltip text="Secret" term_id="secret" >}}等)を参照することはできません。
{{< /note >}}

{{< note >}}
static Podは、[エフェメラルコンテナ](/docs/concepts/workloads/pods/ephemeral-containers/)をサポートしません。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

このページの説明では、Podを実行するために{{< glossary_tooltip term_id="cri-o" >}}を使用しており、ノード上のOSがFedoraであることを前提としています。
他のディストリビューションやKubernetesのインストール方法によっては、操作が異なる場合があります。

<!-- steps -->

## static Podを作成する {#static-pod-creation}

static Podは、[ファイルシステム上でホストされた設定ファイル](#configuration-files)または[ウェブ上でホストされた設定ファイル](#pods-created-via-http)を使用して設定できます。

### ファイルシステム上でホストされたstatic Podマニフェスト {#configuration-files}

マニフェストは、JSONまたはYAML形式の標準のPod定義で、特定のディレクトリに置きます。
[kubeletの設定ファイル](/docs/reference/config-api/kubelet-config.v1beta1/)の中で、`staticPodPath: <ディレクトリの場所>`というフィールドを使用すると、kubeletがこのディレクトリを定期的にスキャンして、YAML/JSONファイルが作成/削除されるたびに、static Podの作成/削除が行われるようになります。
指定したディレクトリをスキャンする際、kubeletはドットから始まる名前のファイルを無視することに注意してください。

{{< caution >}}
kubeletは、static Podディレクトリ内の**ドットで始まらないすべてのファイル**を処理します。
ファイルの拡張子によるフィルタリングは行われません。
例えば、`cp kube-apiserver.yaml kube-apiserver.yaml.backup`を実行してマニフェストのバックアップを作成した場合、kubeletは**両方の**ファイルを読み込み、それぞれからstatic Podを作成しようとします。
2つのファイルが同じ名前のPodを定義している場合、その結果の動作は未定義であり、バックアップの古いspecが現在のマニフェストの代わりに気づかないうちに有効になる可能性があります。
バックアップを作成する場合は、static Podディレクトリの**外**(例えば`/etc/kubernetes/backup/`)に保存してください。
{{< /caution >}}

例として、単純なウェブサーバーをstatic Podとして実行する方法を示します:

1. static Podを実行したいノードを選択します。
   この例では、`my-node1`です。

    ```shell
    ssh my-node1
    ```

1. ディレクトリを選び(ここでは`/etc/kubernetes/manifests`とします)、ここにウェブサーバーのPodの定義を置きます。
   たとえば、`/etc/kubernetes/manifests/static-web.yaml`に置きます:

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    mkdir -p /etc/kubernetes/manifests/
    cat <<EOF >/etc/kubernetes/manifests/static-web.yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    EOF
    ```

1. そのノードのkubeletで、[kubelet設定ファイル](/docs/reference/config-api/kubelet-config.v1beta1/)の`staticPodPath`の値を設定します。
    詳細については、[設定ファイルによるkubeletパラメーターの設定](/docs/tasks/administer-cluster/kubelet-config-file/)を参照してください。

    別の非推奨の方法として、コマンドライン引数を使用して、そのノードのkubeletがstatic Podマニフェストをローカルで検索するように設定する方法があります。
    非推奨のアプローチを使用するには、`--pod-manifest-path=/etc/kubernetes/manifests/`引数を指定してkubeletを起動します。

1. kubeletを再起動します。
   Fedoraの場合、次のコマンドを実行します:

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    systemctl restart kubelet
    ```

### ウェブ上でホストされたstatic Podマニフェスト {#pods-created-via-http}

kubeletは、`--manifest-url=<URL>`引数で指定されたファイルを定期的にダウンロードし、Podの定義が含まれたJSON/YAMLファイルとして解釈します。
kubeletは、[ファイルシステム上でホストされたマニフェスト](#configuration-files)での動作方法と同じように、定期的にマニフェストを再取得します。
static Podのリスト中に変更が見つかると、kubeletがその変更を適用します。

このアプローチを採用する場合、次のように設定します:

1. YAMLファイルを作成し、kubeletにファイルのURLを渡せるようにするために、ウェブサーバー上に保存します。

    ```yaml
    apiVersion: v1
    kind: Pod
    metadata:
      name: static-web
      labels:
        role: myrole
    spec:
      containers:
        - name: web
          image: nginx
          ports:
            - name: web
              containerPort: 80
              protocol: TCP
    ```

1. 選択したノード上のkubeletを`--manifest-url=<manifest-url>`を使用して実行することで、このウェブ上のマニフェストを使用するように設定します。
   Fedoraの場合、`/etc/kubernetes/kubelet`に次の行が含まれるように編集します:

    ```shell
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<マニフェストのURL>"
    ```

1. kubeletを再起動します。
   Fedoraの場合、次のコマンドを実行します:

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    systemctl restart kubelet
    ```

## static Podの動作を観察する {#behavior-of-static-pods}

kubeletが起動すると、定義されたすべてのstatic Podが自動的に起動されます。
static Podを設定してkubeletを再起動したため、すでに新しいstatic Podが実行中になっているはずです。

次のコマンドを(ノード上で)実行することで、(static Podを含む)実行中のコンテナを確認できます:
```shell
# このコマンドは、kubeletが実行中のノード上で実行してください
crictl ps
```

出力は次のようになります:

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
129fd7d382018   docker.io/library/nginx@sha256:...    11 minutes ago    Running    web     0          34533c6729106
```

{{< note >}}
`crictl`は、イメージのURIとSHA-256チェックサムを出力します。
`NAME`は次のような形式になります:
`docker.io/library/nginx@sha256:0d17b565c37bcbd895e9d92315a05c1c3c9a29f762b011a10c54a66cd53c9b31`
{{< /note >}}

APIサーバー上では、ミラーPodを確認できます:
```shell
kubectl get pods
```
```console
NAME                  READY   STATUS    RESTARTS        AGE
static-web-my-node1   1/1     Running   0               2m
```

{{< note >}}
kubeletにAPIサーバー上のミラーPodを作成する権限があることを確認してください。
もし権限がない場合、APIサーバーによって作成のリクエストが拒否されてしまいます。
{{< /note >}}


static Podに付けた{{< glossary_tooltip term_id="label" text="ラベル" >}}はミラーPodに伝播します。
ミラーPodに付けたラベルは、通常のPodと同じように{{< glossary_tooltip term_id="selector" text="セレクター" >}}などから利用できます。

もし`kubectl`を使用してAPIサーバーからミラーPodを削除しようとしても、kubeletはstatic Podを削除*しません*。

```shell
kubectl delete pod static-web-my-node1
```
```console
pod "static-web-my-node1" deleted
```

Podはまだ実行中であることがわかります。

```shell
kubectl get pods
```
```console
NAME                  READY   STATUS    RESTARTS   AGE
static-web-my-node1   1/1     Running   0          4s
```

kubeletが動いているノードに戻って、コンテナを手動で停止してみてください。
しばらくすると、kubeletがそれに気づき、Podを自動的に再起動します。

```shell
# このコマンドは、kubeletが実行中のノード上で実行してください
crictl stop 129fd7d382018 # 実際のコンテナIDと置き換えてください
sleep 20
crictl ps
```

```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
89db4553e1eeb   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
適切なコンテナを特定したら、`crictl`を使用してそのコンテナのログを取得できます:

```shell
# このコマンドは、コンテナが実行中のノード上で実行してください
crictl logs <container_id>
```

```console
10.240.0.48 - - [16/Nov/2022:12:45:49 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nov/2022:12:45:50 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
10.240.0.48 - - [16/Nove/2022:12:45:51 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.47.0" "-"
```

`crictl`を使ったデバッグの詳細については、[_crictlによるKubernetesノードのデバッグ_](/docs/tasks/debug/debug-cluster/crictl/)を参照してください。


## static Podの動的な追加と削除

実行中のkubeletは設定ディレクトリ(この例では`/etc/kubernetes/manifests`)の変更を定期的にスキャンし、このディレクトリ内にファイルが追加/削除されると、Podの追加/削除を行います。

```shell
# これは、ファイルシステムでホストされているstatic Podの設定を使用していることを前提としています
# このコマンドは、コンテナが実行中のノード上で実行してください
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
crictl ps
# nginxコンテナが実行されていないことを確認できます
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
crictl ps
```
```console
CONTAINER       IMAGE                                 CREATED           STATE      NAME    ATTEMPT    POD ID
f427638871c35   docker.io/library/nginx@sha256:...    19 seconds ago    Running    web     1          34533c6729106
```
## {{% heading "whatsnext" %}}

* [コントロールプレーンコンポーネント用のstatic Podマニフェストを生成する](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifests-for-control-plane-components)
* [ローカルetcd用のstatic Podマニフェストを生成する](/docs/reference/setup-tools/kubeadm/implementation-details/#generate-static-pod-manifest-for-local-etcd)
* [Kubernetesノードを`crictl`を使ってデバッグする](/docs/tasks/debug/debug-cluster/crictl/)
* [`crictl`についてさらに学ぶ](https://github.com/kubernetes-sigs/cri-tools)
* [kubeletが管理するstatic Podとしてetcdインスタンスをセットアップする](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
