---
title: static Podを作成する
weight: 220
content_type: task
---

<!-- overview -->


*Static Pod*とは、{{< glossary_tooltip text="APIサーバー" term_id="kube-apiserver" >}}が監視せず、特定のノード上のkubeletデーモンによって直接管理されるPodです。コントロールプレーンに管理されるPod(たとえば{{< glossary_tooltip text="Deployment" term_id="deployment" >}}など)とは異なり、kubeletがそれぞれのstatic Podを監視(および障害時には再起動)します。

Static Podは、常に特定のノード上の1つの{{< glossary_tooltip term_id="kubelet" >}}に紐付けられます。

kubeletは、各static Podに対して、自動的にKubernetes APIサーバー上に{{< glossary_tooltip text="ミラーPod" term_id="mirror-pod" >}}の作成を試みます。つまり、ノード上で実行中のPodはAPIサーバーから検出されますが、APIサーバー自身から制御されることはないということです。

{{< note >}}
複数ノードからなるKubernetesクラスターを実行していて、Podをすべてのノード上で実行するためにstatic Podを使用している場合、おそらくstatic Podの代わりに{{< glossary_tooltip text="DaemonSet" term_id="daemonset" >}}を使用するべきでしょう。
{{< /note >}}

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

このページの説明では、Podを実行するために{{< glossary_tooltip term_id="docker" >}}を使用しており、ノード上のOSがFedoraであることを前提としています。他のディストリビューションやKubernetesのインストール方法によっては、操作が異なる場合があります。

<!-- steps -->

## static Podを作成する {#static-pod-creation}

static Podは、[ファイルシステム上でホストされた設定ファイル](#configuration-files)または[ウェブ上でホストされた設定ファイル](/#pods-created-via-http)を使用して設定できます。

### ファイルシステム上でホストされたstatic Podマニフェスト {#configuration-files}

マニフェストは、JSONまたはYAML形式の標準のPod定義で、特定のディレクトリに置きます。[kubeletの設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file)の中で、`staticPodPath: <ディレクトリの場所>`というフィールドを使用すると、kubeletがこのディレクトリを定期的にスキャンして、YAML/JSONファイルが作成/削除されるたびに、static Podの作成/削除が行われるようになります。指定したディレクトリをスキャンする際、kubeletはドットから始まる名前のファイルを無視することに注意してください。

例として、単純なウェブサーバーをstatic Podとして実行する方法を示します。

1. static Podを実行したいノードを選択します。この例では、`my-node1`です。

    ```shell
    ssh my-node1
    ```

2. ディレクトリを選び(ここでは`/etc/kubelet.d`とします)、ここにウェブサーバーのPodの定義を置きます。たとえば、`/etc/kubelet.d/static-web.yaml`に置きます。

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    mkdir /etc/kubelet.d/
    cat <<EOF >/etc/kubelet.d/static-web.yaml
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

3. ノード上のkubeletがこのディレクトリを使用するようにするために、`--pod-manifest-path=/etc/kubelet.d/`引数を付けてkubeletを実行するように設定します。Fedoraの場合、次の行が含まれるように`/etc/kubernetes/kubelet`を編集します。

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --pod-manifest-path=/etc/kubelet.d/"
    ```

    あるいは、[kubeletの設定ファイル](/docs/tasks/administer-cluster/kubelet-config-file)に、`staticPodPath: <ディレクトリの場所>`フィールドを追加することでも設定できます。

4. kubeletを再起動します。Fedoraの場合、次のコマンドを実行します。

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    systemctl restart kubelet
    ```

### ウェブ上でホストされたstatic Podマニフェスト {#pods-created-via-http}

kubeletは、`--manifest-url=<URL>`引数で指定されたファイルを定期的にダウンロードし、Podの定義が含まれたJSON/YAMLファイルとして解釈します。kubeletは、[ファイルシステム上でホストされたマニフェスト](#configuration-files)での動作方法と同じように、定期的にマニフェストを再取得します。static Podのリスト中に変更が見つかると、kubeletがその変更を適用します。

このアプローチを採用する場合、次のように設定します。

1. YAMLファイルを作成し、kubeletにファイルのURLを渡せるようにするために、ウェブサーバー上に保存する。

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

2. 選択したノード上のkubeletを`--manifest-url=<manifest-url>`を使用して実行することで、このウェブ上のマニフェストを使用するように設定する。Fedoraの場合、`/etc/kubernetes/kubelet`に次の行が含まれるように編集します。

    ```
    KUBELET_ARGS="--cluster-dns=10.254.0.10 --cluster-domain=kube.local --manifest-url=<マニフェストのURL"
    ```

3. kubeletを再起動する。Fedoraの場合、次のコマンドを実行します。

    ```shell
    # このコマンドは、kubeletが実行中のノード上で実行してください
    systemctl restart kubelet
    ```

## static Podの動作を観察する {#behavior-of-static-pods}

kubeletが起動すると、定義されたすべてのstatic Podを起動します。ここまででstatic Podを設定してkubeletを再起動したため、すでに新しいstatic Podが実行中になっているはずです。

次のコマンドを(ノード上で)実行することで、(static Podを含む)実行中のコンテナを確認できます。

```shell
# このコマンドは、kubeletが実行中のノード上で実行してください
docker ps
```

出力は次のようになります。

```
CONTAINER ID IMAGE         COMMAND  CREATED        STATUS         PORTS     NAMES
f6d05272b57e nginx:latest  "nginx"  8 minutes ago  Up 8 minutes             k8s_web.6f802af4_static-web-fk-node1_default_67e24ed9466ba55986d120c867395f3c_378e5f3c
```

APIサーバー上では、ミラーPodを確認できます。

```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          2m
```

{{< note >}}
kubeletにAPIサーバー上のミラーPodを作成する権限があることを確認してください。もし権限がない場合、APIサーバーによって作成のリクエストが拒否されてしまいます。詳しくは、[PodSecurityPolicy](/docs/concepts/policy/pod-security-policy/)を参照してください。
{{< /note >}}


static Podに付けた{{< glossary_tooltip term_id="label" text="ラベル" >}}はミラーPodに伝搬します。ミラーPodに付けたラベルは、通常のPodと同じように{{< glossary_tooltip term_id="selector" text="セレクター" >}}などから利用できます。

もし`kubectl`を使用してAPIサーバーからミラーPodを削除しようとしても、kubeletはstatic Podを削除*しません*。

```shell
kubectl delete pod static-web-my-node1
```
```
pod "static-web-my-node1" deleted
```

Podはまだ実行中であることがわかります。

```shell
kubectl get pods
```
```
NAME                       READY     STATUS    RESTARTS   AGE
static-web-my-node1        1/1       Running   0          12s
```

kubeletが実行中のノードに戻り、Dockerコンテナを手動で停止してみることができます。しばらくすると、kubeletが変化に気づき、Podを自動的に再起動することがわかります。

```shell
# このコマンドは、kubeletが実行中のノード上で実行してください
docker stop f6d05272b57e # 実際のコンテナIDと置き換えてください
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED       ...
5b920cbaf8b1        nginx:latest  "nginx -g 'daemon of   2 seconds ago ...
```

## static Podの動的な追加と削除

実行中のkubeletは設定ディレクトリ(この例では`/etc/kubelet.d`)の変更を定期的にスキャンし、このディレクトリ内にファイルが追加/削除されると、Podの追加/削除を行います。

```shell
# This assumes you are using filesystem-hosted static Pod configuration
# このコマンドは、kubeletが実行中のノード上で実行してください
#
mv /etc/kubernetes/manifests/static-web.yaml /tmp
sleep 20
docker ps
# You see that no nginx container is running
mv /tmp/static-web.yaml  /etc/kubernetes/manifests/
sleep 20
docker ps
```
```
CONTAINER ID        IMAGE         COMMAND                CREATED           ...
e7a62e3427f1        nginx:latest  "nginx -g 'daemon of   27 seconds ago
```
