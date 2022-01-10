---
title: Liveness Probe、Readiness ProbeおよびStartup Probeを使用する
content_type: task
weight: 110
---

<!-- overview -->

このページでは、Liveness Probe、Readiness ProbeおよびStartup Probeの使用方法について説明します。

[kubelet](/docs/reference/command-line-tools-reference/kubelet/)は、Liveness Probeを使用して、コンテナをいつ再起動するかを認識します。
例えば、アプリケーション自体は起動しているが、処理を継続することができないデッドロック状態を検知することができます。
このような状態のコンテナを再起動することで、バグがある場合でもアプリケーションの可用性を高めることができます。

kubeletは、Readiness Probeを使用して、コンテナがトラフィックを受け入れられる状態であるかを認識します。
Podが準備ができていると見なされるのは、Pod内の全てのコンテナの準備が整ったときです。
一例として、このシグナルはServiceのバックエンドとして使用されるPodを制御するときに使用されます。
Podの準備ができていない場合、そのPodはServiceのロードバランシングから切り離されます。

kubeletは、Startup Probeを使用して、コンテナアプリケーションの起動が完了したかを認識します。
Startup Probeを使用している場合、Startup Probeが成功するまでは、Liveness Probeと
Readiness Probeによるチェックを無効にし、これらがアプリケーションの起動に干渉しないようにします。
例えば、これを起動が遅いコンテナの起動チェックとして使用することで、起動する前にkubeletによって
強制終了されることを防ぐことができます。


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->

## コマンド実行によるLiveness Probeを定義する {#define-a-liveness-command}

長期間実行されているアプリケーションの多くは、再起動されるまで回復できないような異常な状態になることがあります。
Kubernetesはこのような状況を検知し、回復するためのLiveness Probeを提供します。

この演習では、`k8s.gcr.io/busybox`イメージのコンテナを起動するPodを作成します。
Podの構成ファイルは次の通りです。

{{< codenew file="pods/probe/exec-liveness.yaml" >}}

この構成ファイルでは、Podは一つの`Container`を起動します。
`periodSeconds`フィールドは、kubeletがLiveness Probeを5秒おきに行うように指定しています。
`initialDelaySeconds`フィールドは、kubeletが最初のProbeを実行する前に5秒間待機するように指示しています。
Probeの動作としては、kubeletは`cat /tmp/healthy`を対象のコンテナ内で実行します。
このコマンドが成功し、リターンコード0が返ると、kubeletはコンテナが問題なく動いていると判断します。
リターンコードとして0以外の値が返ると、kubeletはコンテナを終了し、再起動を行います。

このコンテナは、起動すると次のコマンドを実行します:

```shell
/bin/sh -c "touch /tmp/healthy; sleep 30; rm -rf /tmp/healthy; sleep 600"
```

コンテナが起動してから初めの30秒間は`/tmp/healthy`ファイルがコンテナ内に存在します。
そのため初めの30秒間は`cat /tmp/healthy`コマンドは成功し、正常なリターンコードが返ります。
その後30秒が経過すると、`cat /tmp/healthy`コマンドは異常なリターンコードを返します。

このPodを起動してください:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/exec-liveness.yaml
```

30秒間以内に、Podのイベントを確認します。

```shell
kubectl describe pod liveness-exec
```

この出力結果は、Liveness Probeがまだ失敗していないことを示しています。

```
FirstSeen    LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
24s       24s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
23s       23s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
```

35秒後に、Podのイベントをもう一度確認します:

```shell
kubectl describe pod liveness-exec
```

出力結果の最後に、Liveness Probeが失敗していることを示すメッセージが表示されます。これによりコンテナは強制終了し、再作成されました。

```
FirstSeen LastSeen    Count   From            SubobjectPath           Type        Reason      Message
--------- --------    -----   ----            -------------           --------    ------      -------
37s       37s     1   {default-scheduler }                    Normal      Scheduled   Successfully assigned liveness-exec to worker0
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulling     pulling image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Pulled      Successfully pulled image "k8s.gcr.io/busybox"
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Created     Created container with docker id 86849c15382e; Security:[seccomp=unconfined]
36s       36s     1   {kubelet worker0}   spec.containers{liveness}   Normal      Started     Started container with docker id 86849c15382e
2s        2s      1   {kubelet worker0}   spec.containers{liveness}   Warning     Unhealthy   Liveness probe failed: cat: can't open '/tmp/healthy': No such file or directory
```

さらに30秒後、コンテナが再起動していることを確認します:

```shell
kubectl get pod liveness-exec
```

出力結果から、`RESTARTS`がインクリメントされていることを確認します:

```
NAME            READY     STATUS    RESTARTS   AGE
liveness-exec   1/1       Running   1          1m
```

## HTTPリクエストによるLiveness Probeを定義する {#define-a-liveness-http-request}

別の種類のLiveness Probeでは、HTTP GETリクエストを使用します。
次の構成ファイルは、`k8s.gcr.io/liveness`イメージを使用したコンテナを起動するPodを作成します。

{{< codenew file="pods/probe/http-liveness.yaml" >}}

この構成ファイルでは、Podは一つの`Container`を起動します。
`periodSeconds`フィールドは、kubeletがLiveness Probeを3秒おきに行うように指定しています。
`initialDelaySeconds`フィールドは、kubeletが最初のProbeを実行する前に3秒間待機するように指示しています。
Probeの動作としては、kubeletは8080ポートをリッスンしているコンテナ内のサーバーに対してHTTP GETリクエストを送ります。
サーバー内の`/healthz`パスに対するハンドラーが正常なリターンコードを応答した場合、
kubeletはコンテナが問題なく動いていると判断します。
異常なリターンコードを応答すると、kubeletはコンテナを終了し、再起動を行います。

200以上400未満のコードは成功とみなされ、その他のコードは失敗とみなされます。

[server.go](https://github.com/kubernetes/kubernetes/blob/{{< param "githubbranch" >}}/test/images/agnhost/liveness/server.go)
にてサーバーのソースコードを確認することができます。

コンテナが生きている初めの10秒間は、`/healthz`ハンドラーが200ステータスを返します。
その後、ハンドラーは500ステータスを返します。

```go
http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
    duration := time.Now().Sub(started)
    if duration.Seconds() > 10 {
        w.WriteHeader(500)
        w.Write([]byte(fmt.Sprintf("error: %v", duration.Seconds())))
    } else {
        w.WriteHeader(200)
        w.Write([]byte("ok"))
    }
})
```

kubeletは、コンテナが起動してから3秒後からヘルスチェックを行います。
そのため、初めのいくつかのヘルスチェックは成功します。しかし、10秒経過するとヘルスチェックは失敗し、kubeletはコンテナを終了し、再起動します。

HTTPリクエストのチェックによるLiveness Probeを試すには、以下のようにPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/http-liveness.yaml
```

10秒後、Podのイベントを表示して、Liveness Probeが失敗し、コンテナが再起動されていることを確認します。

```shell
kubectl describe pod liveness-http
```

v1.13以前(v1.13を含む)のリリースにおいては、Podが起動しているノードに環境変数`http_proxy`
(または `HTTP_PROXY`)が設定されている場合、HTTPリクエストのLiveness Probeは設定されたプロキシを使用します。
v1.13より後のリリースにおいては、ローカルHTTPプロキシ環境変数の設定はHTTPリクエストのLiveness Probeに影響しません。

## TCPによるLiveness Probeを定義する {#define-a-tcp-liveness-probe}

3つ目のLiveness ProbeはTCPソケットを使用するタイプです。
この構成においては、kubeletは指定したコンテナのソケットを開くことを試みます。
コネクションが確立できる場合はコンテナを正常とみなし、失敗する場合は異常とみなします。

{{< codenew file="pods/probe/tcp-liveness-readiness.yaml" >}}

見ての通り、TCPによるチェックの構成はHTTPによるチェックと非常に似ています。
この例では、Readiness ProbeとLiveness Probeを両方使用しています。
kubeletは、コンテナが起動してから5秒後に最初のReadiness Probeを開始します。
これは`goproxy`コンテナの8080ポートに対して接続を試みます。
このProbeが成功すると、Podは準備ができていると通知されます。kubeletはこのチェックを10秒ごとに行います。

この構成では、Readiness Probeに加えてLiveness Probeが含まれています。
kubeletは、コンテナが起動してから15秒後に最初のLiveness Probeを実行します。
Readiness Probeと同様に、これは`goproxy`コンテナの8080ポートに対して接続を試みます。
Liveness Probeが失敗した場合、コンテナは再起動されます。

TCPのチェックによるLiveness Probeを試すには、以下のようにPodを作成します:

```shell
kubectl apply -f https://k8s.io/examples/pods/probe/tcp-liveness-readiness.yaml
```

15秒後、Podのイベントを表示し、Liveness Probeが行われていることを確認します:

```shell
kubectl describe pod goproxy
```

## 名前付きポートを使用する {#use-a-named-port}

HTTPまたはTCPによるProbeにおいて、[ContainerPort](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#containerport-v1-core)
で定義した名前付きポートを使用することができます。

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
```

## Startup Probeを使用して、起動の遅いコンテナを保護する {#define-startup-probes}

場合によっては、最初の初期化において追加の起動時間が必要になるようなレガシーアプリケーションを扱う必要があります。
そのような場合、デッドロックに対する迅速な反応を損なうことなくLiveness Probeのパラメーターを設定することは難しい場合があります。

これに対する解決策の一つは、Liveness Probeと同じ構成のコマンドを用いるか、HTTPまたはTCPによるチェックを使用したStartup Probeをセットアップすることです。
その際、`failureThreshold * periodSeconds`で計算される時間を、起動時間として想定される最も遅いケースをカバーできる十分な長さに設定します。

上記の例は、次のようになります:

```yaml
ports:
- name: liveness-port
  containerPort: 8080
  hostPort: 8080

livenessProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 1
  periodSeconds: 10

startupProbe:
  httpGet:
    path: /healthz
    port: liveness-port
  failureThreshold: 30
  periodSeconds: 10
```

Startup Probeにより、アプリケーションは起動が完了するまでに最大5分間の猶予(30 * 10 = 300秒)が与えられます。
Startup Probeに一度成功すると、その後はLiveness Probeが引き継ぎ、コンテナのデッドロックに対して迅速に反応します。
Startup Probeが成功しない場合、コンテナは300秒後に終了し、その後はPodの`restartPolicy`に従います。

## Readiness Probeを定義する {#define-readiness-probes}

アプリケーションは一時的にトラフィックを処理できないことが起こり得ます。
例えば、アプリケーションは起動時に大きなデータまたは構成ファイルを読み込む必要がある場合や、起動後に外部サービスに依存している場合があります。
このような場合、アプリケーション自体を終了させたくはありませんが、このアプリケーションに対してリクエストも送信したくないと思います。
Kubernetesは、これらの状況を検知して緩和するための機能としてReadiness Probeを提供します。
これにより、準備ができていないことを報告するコンテナを含むPodは、KubernetesのServiceを通してトラフィックを受信しないようになります。

{{< note >}}
Readiness Probeは、コンテナの全てのライフサイクルにおいて実行されます。
{{< /note >}}

Readiness ProbeはLiveness Probeと同様に構成します。
唯一の違いは`readinessProbe`フィールドを`livenessProbe`フィールドの代わりに利用することだけです。

```yaml
readinessProbe:
  exec:
    command:
    - cat
    - /tmp/healthy
  initialDelaySeconds: 5
  periodSeconds: 5
```

HTTPおよびTCPによるReadiness Probeの構成もLiveness Probeと同じです。

Readiness ProbeとLiveness Probeは同じコンテナで同時に使用できます。
両方使用することで、準備できていないコンテナへのトラフィックが到達しないようにし、コンテナが失敗したときに再起動することができます。

## Probeの構成 {#configure-probes}

{{< comment >}}
Eventually, some of this section could be moved to a concept topic.
{{< /comment >}}

[Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core) には、
Liveness ProbeおよびReadiness Probeのチェック動作をより正確に制御するために使用できるフィールドがあります:

* `initialDelaySeconds`: コンテナが起動してから、Liveness ProbeまたはReadiness Probeが開始されるまでの秒数。デフォルトは0秒。最小値は0。
* `periodSeconds`: Probeが実行される頻度(秒数)。デフォルトは10秒。最小値は1。
* `timeoutSeconds`: Probeがタイムアウトになるまでの秒数。デフォルトは1秒。最小値は1。
* `successThreshold`: 一度Probeが失敗した後、次のProbeが成功したとみなされるための最小連続成功数。
デフォルトは1。Liveness Probeには1を設定する必要があります。最小値は1。
* `failureThreshold`: Probeが失敗した場合、Kubernetesは`failureThreshold`に設定した回数までProbeを試行します。
Liveness Probeにおいて、試行回数に到達することはコンテナを再起動することを意味します。
Readiness Probeの場合は、Podが準備できていない状態として通知されます。デフォルトは3。最小値は1。

[HTTPによるProbe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#httpgetaction-v1-core)
には、`httpGet`にて設定できる追加のフィールドがあります:

* `host`: 接続先ホスト名。デフォルトはPod IP。おそらくはこのフィールドの代わりに`httpHeaders`内の"Host"を代わりに使用することになります。
* `scheme`: ホストへの接続で使用するスキーマ（HTTP または HTTPS）。デフォルトは HTTP。
* `path`: HTTPサーバーへアクセスする際のパス
* `httpHeaders`: リクエスト内のカスタムヘッダー。HTTPでは重複したヘッダーが許可されています。
* `port`: コンテナにアクセスする際のポートの名前または番号。ポート番号の場合、1から65535の範囲内である必要があります。

HTTPによるProbeの場合、kubeletは指定したパスとポートに対するHTTPリクエストを送ることでチェックを行います。
`httpGet`のオプションである`host`フィールドでアドレスが上書きされない限り、kubeletはPodのIPアドレスに対してProbeを送ります。
`scheme`フィールドに`HTTPS`がセットされている場合、kubeletは証明書の検証を行わずにHTTPSリクエストを送ります。
ほとんどのシナリオにおいては、`host`フィールドを使用する必要はありません。次のシナリオは使用する場合の一例です。
仮にコンテナが127.0.0.1をリッスンしており、かつPodの`hostNetwork`フィールドがtrueだとします。
その場合においては、`httpGet`フィールド内の`host`には127.0.0.1をセットする必要があります。
より一般的なケースにおいてPodが仮想ホストに依存している場合は、おそらく`host`フィールドではなく、`httpHeaders`フィールド内の`Host`ヘッダーを使用する必要があります。

TCPによるProbeの場合、kubeletはPodの中ではなく、ノードに対してコネクションを確立するProbeを実行します。
kubeletはServiceの名前を解決できないため、`host`パラメーター内でServiceの名前を使用することはできません。


## {{% heading "whatsnext" %}}

* [Container Probes](/ja/docs/concepts/workloads/pods/pod-lifecycle/#container-probes)についてもっと学ぶ

また、次のAPIリファレンスも参考にしてください:

* [Pod](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)
* [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [Probe](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#probe-v1-core)

