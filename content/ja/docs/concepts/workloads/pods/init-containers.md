---
title: Initコンテナ
content_type: concept
weight: 40
---

<!-- overview -->
このページでは、Initコンテナについて概観します。Initコンテナとは、{{< glossary_tooltip text="Pod" term_id="pod" >}}内でアプリケーションコンテナの前に実行される特別なコンテナです。
Initコンテナにはアプリケーションコンテナのイメージに存在しないセットアップスクリプトやユーティリティーを含めることができます。

Initコンテナは、Podの仕様のうち`containers`という配列(これがアプリケーションコンテナを示します)と並べて指定します。

<!-- body -->
## Initコンテナを理解する {#understanding-init-containers}

単一の{{< glossary_tooltip text="Pod" term_id="pod" >}}は、Pod内にアプリケーションを実行している複数のコンテナを持つことができますが、同様に、アプリケーションコンテナが起動する前に実行されるInitコンテナも1つ以上持つことができます。

Initコンテナは下記の項目をのぞいて、通常のコンテナと全く同じものとなります。

* Initコンテナは常に完了するまで稼働します。
* 各Initコンテナは、次のInitコンテナが稼働する前に正常に完了しなくてはなりません。

もしあるPodの単一のInitコンテナが失敗した場合、Kubeletは成功するまで何度もそのInitコンテナを再起動します。しかし、もしそのPodの`restartPolicy`がNeverで、そのPodの起動時にInitコンテナが失敗した場合、KubernetesはそのPod全体を失敗として扱います。

PodにInitコンテナを指定するためには、Podの仕様にそのアプリケーションの`containers`配列と並べて、`initContainers`フィールドを[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)型のオブジェクトの配列として指定してください。
Initコンテナのステータスは、`.status.initContainerStatuses`フィールドにコンテナのステータスの配列として返されます(`.status.containerStatuses`と同様)。

### 通常のコンテナとの違い {#differences-from-regular-containers}

Initコンテナは、リソースリミット、ボリューム、セキュリティ設定などのアプリケーションコンテナの全てのフィールドと機能をサポートしています。しかし、Initコンテナに対するリソースリクエストやリソースリミットの扱いは異なります。[リソース](#resources)にて説明します。

また、InitコンテナはそのPodの準備ができる前に完了しなくてはならないため、`lifecycle`、`livenessProbe`、`readinessProbe`および`startupProbe`をサポートしていません。

複数のInitコンテナを単一のPodに対して指定した場合、KubeletはそれらのInitコンテナを1つずつ順番に実行します。各Initコンテナは、次のInitコンテナが稼働する前に正常終了しなくてはなりません。全てのInitコンテナの実行が完了すると、KubeletはPodのアプリケーションコンテナを初期化し、通常通り実行します。

## Initコンテナを使用する {#using-init-containers}

Initコンテナはアプリケーションコンテナのイメージとは分離されているため、コンテナの起動に関連したコードにおいていくつかの利点があります。

* Initコンテナはアプリケーションのイメージに存在しないセットアップ用のユーティリティーやカスタムコードを含むことができます。例えば、セットアップ中に`sed`、`awk`、`python`や、`dig`のようなツールを使うためだけに、別のイメージを元にしてアプリケーションイメージを作る必要がなくなります。
* アプリケーションイメージをビルドする役割とデプロイする役割は、共同で単一のアプリケーションイメージをビルドする必要がないため、それぞれ独立して実施することができます。
* Initコンテナは同一Pod内のアプリケーションコンテナと別のファイルシステムビューで稼働することができます。その結果、アプリケーションコンテナがアクセスできない{{< glossary_tooltip text="Secret" term_id="secret" >}}に対するアクセス権限を得ることができます。
* Initコンテナはアプリケーションコンテナが開始する前に完了するまで実行されるため、Initコンテナを使用することで、特定の前提条件が満たされるまでアプリケーションコンテナの起動をブロックしたり遅らせることができます。前提条件が満たされると、Pod内の全てのアプリケーションコンテナを並行して起動することができます。
* Initコンテナはアプリケーションコンテナイメージの安全性を低下させるようなユーティリティーやカスタムコードを安全に実行することができます。不必要なツールを分離しておくことで、アプリケーションコンテナイメージのアタックサーフィスを制限することができます。

### 例 {#examples}

Initコンテナを活用する方法について、いくつかのアイデアを次に示します。

* シェルコマンドを使って単一の{{< glossary_tooltip text="Service" term_id="service">}}が作成されるのを待機する。
  ```shell
  for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1
  ```

* 以下のようなコマンドを使って下位のAPIからPodの情報をリモートサーバに登録する。
  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* 以下のようなコマンドを使ってアプリケーションコンテナの起動を待機する。
  ```shell
  sleep 60
  ```

* gitリポジトリを{{< glossary_tooltip text="Volume" term_id="volume" >}}にクローンする。

* いくつかの値を設定ファイルに配置し、メインのアプリケーションコンテナのための設定ファイルを動的に生成するためのテンプレートツールを実行する。例えば、そのPodの`POD_IP`の値を設定ファイルに配置し、Jinjaを使ってメインのアプリケーションコンテナの設定ファイルを生成する。

#### Initコンテナの具体的な使用方法 {#init-containers-in-use}

下記の例は2つのInitコンテナを含むシンプルなPodを定義しています。
1つ目のInitコンテナは`myservies`の起動を、2つ目のInitコンテナは`mydb`の起動をそれぞれ待ちます。両方のInitコンテナの実行が完了すると、Podは`spec`セクションにあるアプリケーションコンテナを実行します。

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
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

次のコマンドを実行して、このPodを開始できます。

```shell
kubectl apply -f myapp.yaml
```
```
pod/myapp-pod created
```

そして次のコマンドでステータスを確認します。
```shell
kubectl get -f myapp.yaml
```
```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

より詳細な情報は次のコマンドで確認します。
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

このPod内のInitコンテナのログを確認するためには、次のコマンドを実行します。
```shell
kubectl logs myapp-pod -c init-myservice # 1つ目のInitコンテナを調査する
kubectl logs myapp-pod -c init-mydb      # 2つ目のInitコンテナを調査する
```

この時点で、これらのInitコンテナは`mydb`と`myservice`という名前のServiceの検出を待機しています。

これらのServiceを検出させるための構成は以下の通りです。

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

`mydb`および`myservice`というServiceを作成するために、以下のコマンドを実行します。

```shell
kubectl apply -f services.yaml
```
```
service/myservice created
service/mydb created
```

Initコンテナが完了し、`myapp-pod`というPodがRunning状態に移行したことが確認できます。

```shell
kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

このシンプルな例を独自のInitコンテナを作成する際の参考にしてください。[次の項目](#whats-next)にさらに詳細な使用例に関するリンクがあります。

## Initコンテナのふるまいに関する詳細 {#detailed-behavior}

Podの起動時は各Initコンテナが起動状態となるまで、kubeletはネットワーキングおよびストレージを利用可能な状態にしません。また、kubeletはPodのspecに定義された順番に従ってPodのInitコンテナを起動します。各Initコンテナは次のInitコンテナが起動する前に正常に終了しなくてはなりません。もしあるInitコンテナがランタイムもしくはエラーにより起動失敗した場合、そのPodの`restartPolicy`の値に従ってリトライされます。しかし、もしPodの`restartPolicy`が`Always`に設定されていた場合、Initコンテナの`restartPolicy`は`OnFailure`が適用されます。

Podは全てのInitコンテナが完了するまで`Ready`状態となりません。Initコンテナ上のポートはServiceによって集約されません。初期化中のPodのステータスは`Pending`となりますが、`Initialized`という値はtrueとなります。

もしそのPodが[再起動](#pod-restart-reasons)されたとき、全てのInitコンテナは必ず再度実行されます。

Initコンテナの仕様の変更は、コンテナイメージのフィールドのみに制限されています。
Initコンテナのイメージフィールド値を変更すると、そのPodは再起動されます。

Initコンテナは何度も再起動およびリトライ可能なため、べき等(Idempotent)である必要があります。特に、`EmptyDirs`にファイルを書き込むコードは、書き込み先のファイルがすでに存在している可能性を考慮に入れる必要があります。

Initコンテナはアプリケーションコンテナの全てのフィールドを持っています。しかしKubernetesは、Initコンテナが完了と異なる状態を定義できないため`readinessProbe`が使用されることを禁止しています。これはバリデーションの際に適用されます。

Initコンテナがずっと失敗し続けたままの状態を防ぐために、Podに`activeDeadlineSeconds`を、コンテナに`livenessProbe`をそれぞれ設定してください。`activeDeadlineSeconds`の設定はInitコンテナが実行中の時間にも適用されます。

Pod内の各アプリケーションコンテナとInitコンテナの名前はユニークである必要があります。他のコンテナと同じ名前を共有していた場合、バリデーションエラーが返されます。

### リソース {#resources}

Initコンテナの順序と実行を考えるとき、リソースの使用に関して下記のルールが適用されます。

* 全てのInitコンテナの中で定義された最も高いリソースリクエストとリソースリミットが、*有効なinitリクエスト／リミット* になります。
* Podのリソースの*有効なリクエスト／リミット* は、下記の2つの中のどちらか高い方となります。
  * リソースに対する全てのアプリケーションコンテナのリクエスト／リミットの合計
  * リソースに対する有効なinitリクエスト／リミット
* スケジューリングは有効なリクエスト／リミットに基づいて実行されます。つまり、InitコンテナはPodの生存中には使用されない初期化用のリソースを確保することができます。
* Podの*有効なQoS(quality of service)ティアー* は、Initコンテナとアプリケーションコンテナで同様です。

クォータとリミットは有効なPodリクエストとリミットに基づいて適用されます。

Podレベルのコントロールグループ(cgroups)は、スケジューラーと同様に、有効なPodリクエストとリミットに基づいています。

### Podの再起動の理由 {#pod-restart-reasons}

以下の理由によりPodは再起動し、Initコンテナの再実行も引き起こす可能性があります。

* ユーザーが、そのPodのInitコンテナのイメージを変更するようにPodの仕様を更新する場合。アプリケーションコンテナのイメージの変更はそのアプリケーションコンテナの再起動のみ行われます。
* そのPodのインフラストラクチャーコンテナが再起動された場合。これはあまり起きるものでなく、Nodeに対するルート権限を持ったユーザーにより行われることがあります。
* `restartPolicy`が`Always`と設定されているPod内の全てのコンテナが停止され、再起動が行われた場合。およびガーベージコレクションによりInitコンテナの完了記録が失われた場合。


## {{% heading "whatsnext" %}}

* [Initコンテナを含むPodの作成](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)方法について学ぶ。
* [Initコンテナのデバッグ](/ja/docs/tasks/debug-application-cluster/debug-init-containers/)を行う方法について学ぶ。

