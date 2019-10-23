---
title: Initコンテナ(Init Containers)
content_template: templates/concept
weight: 40
---

{{% capture overview %}}
このページでは、Initコンテナについて概観します。Initコンテナとは、アプリケーションコンテナの前に実行され、アプリケーションコンテナのイメージに存在しないセットアップスクリプトやユーティリティーを含んだ特別なコンテナです。
{{% /capture %}}

この機能はKubernetes1.6からβ版の機能として存在しています。InitコンテナはPodSpec内で、アプリケーションの`containers`という配列と並べて指定されます。そのベータ版のアノテーション値はまだ扱われ、PodSpecのフィールド値を上書きします。しかしながら、それらはKubernetesバージョン1.6と1.7において廃止されました。Kubernetesバージョン1.8からはそのアノテーション値はサポートされず、PodSpecフィールドの値に変換する必要があります。

{{% capture body %}}
## Initコンテナを理解する

単一の[Pod](/docs/concepts/workloads/pods/pod-overview/)は、Pod内に複数のコンテナを稼働させることができますが、Initコンテナもまた、アプリケーションコンテナが稼働する前に1つまたは複数稼働できます。

Initコンテナは下記の項目をのぞいて、通常のコンテナと全く同じものとなります。

* Initコンテナは常に完了するまで稼働します。
* 各Initコンテナは、次のInitコンテナが稼働する前に正常に完了しなくてはなりません。

もしあるPodの単一のInitコンテナが失敗した場合、KubernetesはInitコンテナが成功するまで何度もそのPodを再起動します。しかし、もしそのPodの`restartPolicy`が`Never`の場合、再起動されません。

単一のコンテナをInitコンテナとして指定するためには、PodSpecにそのアプリケーションの`containers`配列と並べて、`initContainers`フィールドを[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)型のオブジェクトのJSON配列として指定してください。
Initコンテナのステータスは、`.status.initContainerStatuses`フィールドにコンテナのステータスの配列として返されます(`.status.containerStatuses`と同様)。

### 通常のコンテナとの違い

Initコンテナは、リソースリミット、ボリューム、セキュリティ設定などのアプリケーションコンテナの全てのフィールドと機能をサポートしています。しかし、Initコンテナに対するリソースリクエストやリソースリミットの扱いは微妙に異なり、下記の[Resources](#resources)にて説明します。また、InitコンテナはそのPodの準備ができ前に完了しなくてはならないため、`readinessProbe`をサポートしていません。

もし複数のInitコンテナが単一のPodに対して指定された場合、それらのInitコンテナは1つずつ順番に実行されます。各Initコンテナは次のコンテナが完了できる前に完了しなくてはなりません。全てのInitコンテナが実行完了した時、KubernetesはPodを初期化し、通常通りアプリケーションコンテナを稼働させます。

## Initコンテナは何に使用できるか?

Initコンテナはアプリケーションコンテナのイメージとは分離されているため、コンテナの起動に関連したコードにおいていくつかの利点があります。  

* セキュリティの理由からアプリケーションコンテナのイメージに含めたくないユーティリティーを含んだり実行できます。
* アプリケーションのイメージに存在していないセットアップ用のユーティリティーやカスタムコードを含むことができます。例えば、セットアップ中に`sed`、`awk`、`python`や、`dig`のようなツールを使うための他のイメージから、アプリケーションのイメージを作る必要がなくなります。
* アプリケーションイメージをひとまとめにしてビルドすることなく、アプリケーションのイメージ作成と、デプロイ処理を独立して行うことができます。
* アプリケーションコンテナと別のファイルシステムビューを持つために、Linuxの名前空間を使用します。その結果、アプリケーションコンテナがアクセスできない箇所へのシークレットなアクセス権限を得ることができます。
* Initコンテナはアプリケーションコンテナの実行の前に完了しますが、その一方で、複数のアプリケーションコンテナは並列に実行されます。そのためInitコンテナはいくつかの前提条件をセットされるまで、アプリケーションコンテナの起動をブロックしたり遅らせることができます。

### 使用例

ここではInitコンテナの使用例を挙げます。  

* シェルコマンドを使って単一のServiceが作成されるのを待機します。

      for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1

* コマンドを使って下位のAPIからこのPodをリモートサーバに登録します。

      `curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'`

* `sleep 60`のようなコマンドを使ってアプリケーションコンテナが起動する前に待機します。
* ボリュームにあるgitリポジトリをクローンします。
* メインのアプリケーションコンテナのための設定ファイルを動的に生成するために、いくつかの値を設定ファイルに移してテンプレートツールを稼働させます。例えば、設定ファイルにそのPodのPOD_IPを移して、Jinjaを使ってメインのアプリケーションコンテナの設定ファイルを生成します。

さらに詳細な使用例は、[StatefulSetsのドキュメント](/docs/concepts/workloads/controllers/statefulset/)と[Production Pods guide](/docs/tasks/configure-pod-container/configure-pod-initialization/)にまとまっています。

### Initコンテナの使用

下記のKubernetes1.5用のyamlファイルは、2つのInitコンテナを含む単一のシンプルなポッドの概要となります。
最初のInitコンテナの例は、`myservies`、2つ目のInitコンテナは`mydb`の起動をそれぞれ待ちます。2つのコンテナの実行が完了するとPodの起動が始まります。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
  annotations:
    pod.beta.kubernetes.io/init-containers: '[
        {
            "name": "init-myservice",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup myservice; do echo waiting for myservice; sleep 2; done;"]
        },
        {
            "name": "init-mydb",
            "image": "busybox:1.28",
            "command": ["sh", "-c", "until nslookup mydb; do echo waiting for mydb; sleep 2; done;"]
        }
    ]'
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

古いアノテーション構文がKubernetes1.6と1.7において有効ですが、1.6では新しい構文にも対応しています。Kubernetes1.8以降では新しい構文はを使用する必要があります。KubernetesではInitコンテナの宣言を`spec`に移行させました。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

Kubernetes1.5での構文は1.6においても稼働しますが、1.6の構文の使用を推奨します。Kubernetes1.6において、API内でInitコンテナのフィールド作成されます。ベータ版のアノテーションはKubernetes1.6と1.7において有効ですが、1.8以降ではサポートされません。

下記のyamlファイルは`mydb`と`myservice`というServiceの概要です。

```yaml
kind: Service
apiVersion: v1
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
kind: Service
apiVersion: v1
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

このPodは、下記のコマンドによって起動とデバッグすることが可能です。

```shell
kubectl apply -f myapp.yaml
```
```
pod/myapp-pod created
```

```shell
kubectl get -f myapp.yaml
```
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

```shell
kubectl describe -f myapp.yaml
```
```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
```
```shell
kubectl logs myapp-pod -c init-myservice # 1つ目のInitコンテナを調査する
kubectl logs myapp-pod -c init-mydb      # 2つ目のInitコンテナを調査する
```

一度`mydq`と`myservice` Serviceを起動させると、Initコンテナが完了して`myapp-pod`が作成されるのを確認できます。

```shell
kubectl apply -f services.yaml
```
```
service/myservice created
service/mydb created
```

```shell
kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

この例は非常にシンプルですが、ユーザー独自のInitコンテナを作成するためのインスピレーションを提供するでしょう。

## Initコンテナのふるまいに関する詳細

単一のPodが起動している間、ネットワークとボリュームが初期化されたのちに、Initコンテナは順番に起動されます。各Initコンテナは次のInitコンテナが起動する前に完了しなくてはなりません。もしあるInitコンテナがランタイムもしくはエラーにより起動失敗した場合、そのPodの`restartPolicy`の値をもとにリトライされます。しかし、もしPodの`retartPolicy`が`Always`に設定されていた場合、そのInitコンテナの`restartPolicy`は`OnFailure`となります。

Podは全てのInitコンテナが完了するまで`Ready`状態となりません。Initコンテナ上のポートはServiceによって集約されません。初期化中のPodのステータスは`Pending`となりますが、`Initializing`という値はtrueとなります。

もしそのPodが[再起動](#pod-restart-reasons)されたとき、全てのInitコンテナは再度実行されなくてはなりません。

Initコンテナのスペックに対する変更はコンテナのイメージフィールドのみに限定されます。
Initコンテナのイメージフィールド値の変更は、そのPodの再起動することと等しいです。

Initコンテナは何度も再起動、リトライ可能なため、べき等(Idempotent)である必要があります。特に、`EmptyDirs`にファイルを書き込むコードは、書き込み先のファイルがすでに存在している可能性を考慮に入れるべきです。

Initコンテナはアプリケーションコンテナの全てのフィールドを持っています。しかしKubernetesは、Initコンテナが完了と異なる状態を定義できないため`readinessProbe`が使用されることを禁止しています。これはバリデーションの際に強要されます。

Initコンテナがずっと失敗し続けたままの状態を防ぐために、Podに`activeDeadlineSeconds`、コンテナに`livenessProbe`の設定をそれぞれ使用してください。`activeDeadlineSeconds`の設定はInitコンテナにも適用されます。

あるPod内の各アプリケーションコンテナとInitコンテナの名前はユニークである必要があります。他のコンテナと同じ名前を共有していた場合、バリデーションエラーが返されます。

### リソース

Initコンテナの順序と実行を考えるとき、リソースの使用に関して下記のルールが適用されます。

* 全てのInitコンテナの中で定義された最も高いリソースリクエストとリソースリミットが、*有効なInitリクエストとリミット* になります。
* Podのリソースの*有効なリクエストとリミット* は、下記の2つの中のどちらか高い方となります。
  * そのリソースの全てのアプリケーションコンテナのリクエストとリミットの合計
  * そのリソースの有効なInitリクエストとリミット
* スケジューリングは有効なリクエストとリミットに基づいて実行されます。これはInitコンテナがそのPodの生存中に使われない初期化のためのリソースを保持することができることを意味しています。
* Podの*有効なQosティアー* は、Initコンテナとアプリケーションコンテナで同様です。

クォータとリミットは有効なPodリクエストとリミットに基づいて適用されます。

Podレベルのcgroupsは、スケジューラーと同様に、有効なPodリクエストとリミットに基づいています。

### Podの再起動の理由

単一のPodは再起動可能で、Initコンテナの再実行も引き起こします。それらは下記の理由によるものです。

* あるユーザーが、そのPodのInitコンテナのイメージを変更するようにPodSpecを更新する場合。アプリケーションコンテナのイメージの変更はそのアプリケーションコンテナの再起動のみ行われます。
* そのPodのインフラストラクチャーコンテナが再起動された場合。これはあまり起きるものでなく、Nodeに対するルート権限を持ったユーザーにより行われることがあります。
* `restartPolicy`が`Always`と設定されているとき、単一Pod内の全てのコンテナが停止され、再起動が行われた時と、ガーベージコレクションによりInitコンテナの完了記録が失われた場合。

## サポートと互換性

ApiServerのバージョン1.6.0かそれ以上のバージョンのクラスターは、`.spec.initContainers`フィールドを使ったInitコンテナの機能をサポートしています。  
それ以前のバージョンでは、α版かβ版のアノテーションを使ってInitコンテナを使用できます。また、`.spec.initContainers`フィールドは、Kubernetes1.3.0かそれ以上のバージョンでInitコンテナを使用できるようにするためと、ApiServerバージョン1.6において、1.5.xなどの古いバージョンにロールバックできるようにするために、α版かβ版のアノテーションにミラーされ、存在するPodのInitコンテナの機能が失われることが無いように安全にロールバックできるようにします。

ApiServerとKubeletバージョン1.8.0かそれ以上のバージョンでは、α版とβ版のアノテーションは削除されており、廃止されたアノテーションは`.spec.initContainers`フィールドへの移行が必須となります。

{{% /capture %}}


{{% capture whatsnext %}}

* [Initコンテナを持っているPodの作成](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)

{{% /capture %}}
