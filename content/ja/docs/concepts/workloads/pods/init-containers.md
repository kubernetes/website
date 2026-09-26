---
title: Initコンテナ
content_type: concept
weight: 40
---

<!-- overview -->

このページでは、Initコンテナの概要について説明します。
Initコンテナとは、{{< glossary_tooltip text="Pod" term_id="pod" >}}内でアプリケーションコンテナの前に実行される特別なコンテナです。
Initコンテナには、アプリケーションコンテナのイメージに存在しないユーティリティやセットアップスクリプトを含めることができます。

Podの仕様では、アプリケーションコンテナを記述する`containers`配列と同じ階層に並べて、Initコンテナを指定できます。

Kubernetesでは、[サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers/)は、メインのアプリケーションコンテナよりも前に起動し、_実行し続ける_ コンテナです。
このドキュメントでは、Podの初期化中に実行が完了するコンテナであるInitコンテナについて説明します。

<!-- body -->

## Initコンテナを理解する {#understanding-init-containers}

{{< glossary_tooltip text="Pod" term_id="pod" >}}は、内部で実行される複数のアプリケーションコンテナを持つことができますが、アプリケーションコンテナが起動する前に実行される1つ以上のInitコンテナを持つこともできます。

Initコンテナは下記の項目をのぞいて、通常のコンテナと全く同じです:

* Initコンテナは常に完了するまで稼働します。
* 各Initコンテナは、次のInitコンテナが稼働する前に正常に完了しなくてはなりません。

Pod内のInitコンテナが失敗した場合、kubeletは成功するまで、Initコンテナの再起動を繰り返します。
しかし、Podの`restartPolicy`がNeverに設定されていて、Podの起動時にInitコンテナが失敗した場合、KubernetesはPod全体を失敗として扱います。

PodにInitコンテナを指定するためには、[Podの仕様](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)に`initContainers`フィールドを`container`項目の配列として追加してください(アプリケーションの`containers`フィールドとそのコンテンツと同様です)。
詳細については、APIリファレンスの[コンテナ](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)を参照してください。

Initコンテナのステータスは、`.status.initContainerStatuses`フィールドにコンテナのステータスの配列として返されます(`.status.containerStatuses`と同様です)。

### 通常のコンテナとの違い {#differences-from-regular-containers}

Initコンテナは、リソース制限、[ボリューム](/docs/concepts/storage/volumes/)、セキュリティ設定などのアプリケーションコンテナの全てのフィールドと機能をサポートしています。
ただし、Initコンテナのリソース要求と制限は、[コンテナ間のリソース共有](#resource-sharing-within-containers)に記載されているように、異なる方法で処理されます。

通常のInitコンテナ(つまり、サイドカーコンテナを除く)は、`lifecycle`、`livenessProbe`、`readinessProbe`、`startupProbe`フィールドをサポートしていません。
InitコンテナはPodの準備が完了する前に実行を完了する必要があります。
一方、サイドカーコンテナはPodのライフタイム中は常に実行され続け、一部のProbeを _サポートしています_。
サイドカーコンテナの詳細については、[サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers/)を参照してください。

単一のPodに対して複数のInitコンテナを指定した場合、kubeletはそれらのInitコンテナを順次実行します。
各Initコンテナは、次のInitコンテナが実行される前に正常に終了する必要があります。
全てのInitコンテナの実行が完了すると、kubeletはPodのアプリケーションコンテナを初期化し、通常通り実行します。

### サイドカーコンテナとの違い {#differences-from-sidecar-containers}

Initコンテナは、メインのアプリケーションコンテナが起動する前にタスクを実行して完了します。
[サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers/)とは異なり、Initコンテナはメインコンテナと並行して継続的に実行されることはありません。

Initコンテナは順次実行され完了します。
すべてのInitコンテナが正常に完了するまで、メインコンテナは起動しません。

Initコンテナは`lifecycle`、`livenessProbe`、`readinessProbe`、`startupProbe`をサポートしていませんが、サイドカーコンテナはこれらすべての[Probe](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe)をサポートしてライフサイクルを制御します。

Initコンテナは、メインのアプリケーションコンテナとリソース(CPU、メモリ、ネットワーク)を共有しますが、直接やり取りすることはありません。
ただし、共有ボリュームを使用してデータの交換を行うことは可能です。

## Initコンテナを使用する {#using-init-containers}

Initコンテナはアプリケーションコンテナのイメージとは分離されているため、コンテナの起動に関連したコードにおいていくつかの利点があります:

* Initコンテナには、アプリケーションイメージに含まれないセットアップ用のユーティリティやカスタムコードを含めることができます。
  たとえば、セットアップ時に`sed`、`awk`、`python`、`dig`などのツールを使用するためだけに、別のイメージを`FROM`してイメージを作成する必要はありません。
* アプリケーションイメージをビルドする役割とデプロイする役割は、共同で単一のアプリケーションイメージをビルドする必要がないため、それぞれ独立して実施することができます。
* Initコンテナは、同じPod内のアプリケーションコンテナとは異なる方法でファイルシステムにアクセスできます。
  その結果、アプリケーションコンテナがアクセスできない{{< glossary_tooltip text="Secret" term_id="secret" >}}に対するアクセス権限を得ることができます。
* Initコンテナはアプリケーションコンテナが開始する前に完了するまで実行されるため、Initコンテナを使用することで、特定の前提条件が満たされるまでアプリケーションコンテナの起動をブロックしたり遅らせることができます。
  前提条件が満たされると、Pod内の全てのアプリケーションコンテナを並行して起動することができます。
* Initコンテナは、アプリケーションコンテナイメージのセキュリティを低下させる可能性のあるユーティリティやカスタムコードを安全に実行できます。
  不要なツールを分離することで、アプリケーションコンテナイメージの攻撃対象領域を制限できます。

### 例 {#examples}

Initコンテナを活用する方法について、いくつかのアイデアを次に示します:

* シェルのワンライナーコマンドを使って{{< glossary_tooltip text="Service" term_id="service">}}が作成されるのを待機する:

  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

* 以下のようなコマンドを使って、Downward APIを介してこのPodをリモートサーバーに登録する:

  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

* 以下のようなコマンドを使ってアプリケーションコンテナの起動を待機する:

  ```shell
  sleep 60
  ```

* Gitリポジトリを{{< glossary_tooltip text="ボリューム" term_id="volume" >}}にクローンする。

* いくつかの値を設定ファイルに配置し、メインのアプリケーションコンテナのための設定ファイルを動的に生成するためのテンプレートツールを実行する。
  例えば、そのPodの`POD_IP`の値を設定ファイルに配置し、Jinjaを使ってメインのアプリケーションコンテナの設定ファイルを生成する。

#### Initコンテナの具体的な使用方法 {#init-containers-in-use}

下記の例は、2つのInitコンテナを含むシンプルなPodを定義しています。
1つ目のInitコンテナは`myservice`の起動を、2つ目のInitコンテナは`mydb`の起動をそれぞれ待ちます。
両方のInitコンテナの実行が完了すると、Podは`spec`セクションにあるアプリケーションコンテナを実行します。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
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

次のコマンドを実行して、このPodを開始します:

```shell
kubectl apply -f myapp.yaml
```

実行結果は下記のようになります:

```
pod/myapp-pod created
```

そして次のコマンドでステータスを確認します:

```shell
kubectl get -f myapp.yaml
```

実行結果は下記のようになります:

```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

より詳細な情報は次のコマンドで確認します:

```shell
kubectl describe -f myapp.yaml

```

実行結果は下記のようになります:

```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
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
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container init-myservice
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container init-myservice
```

このPod内のInitコンテナのログを確認するためには、次のコマンドを実行します:

```shell
kubectl logs myapp-pod -c init-myservice # 1つ目のInitコンテナを調査する
kubectl logs myapp-pod -c init-mydb      # 2つ目のInitコンテナを調査する
```

この時点で、これらのInitコンテナは`mydb`と`myservice`という名前の{{< glossary_tooltip text="Service" term_id="service" >}}の検出を待機しています。

これらのServiceを検出するための設定は以下の通りです:

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

`mydb`および`myservice`というServiceを作成するために、以下のコマンドを実行します:

```shell
kubectl apply -f services.yaml
```

実行結果は下記のようになります:

```
service/myservice created
service/mydb created
```

Initコンテナが完了し、`myapp-pod`というPodが実行状態に移行したことを確認できます:

```shell
kubectl get -f myapp.yaml
```

実行結果は下記のようになります:

```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

この簡単な例は、独自のinitコンテナを作成する際のヒントになるはずです。
[次の項目](#what-s-next)には、さらに詳細な使用例に関するリンクがあります。

## Initコンテナのふるまいに関する詳細 {#detailed-behavior}

Podの起動時に、kubeletはネットワークおよびストレージの準備が整うまで、Initコンテナを実行可能な状態にしません。
また、kubeletはPodのspecに定義された順番に従って、PodのInitコンテナを起動します。

各Initコンテナは次のInitコンテナが起動する前に正常に終了しなくてはなりません。
もし、あるInitコンテナがランタイムにより起動失敗した場合、もしくはエラーで終了した場合、そのPodの`restartPolicy`の値に従ってリトライされます。
しかし、Podの`restartPolicy`がAlwaysに設定されていた場合は、Initコンテナの`restartPolicy`はOnFailureとして適用されます。

すべてのInitコンテナが成功するまで、Podは`Ready`になりません。
InitコンテナのポートはService配下に集約されません。
初期化中のPodは`Pending`状態ですが、条件`Initialized`はfalseに設定されているはずです。

Podを[再起動](#pod-restart-reasons)するとき、またはPodが再起動されたとき、全てのInitコンテナは必ず再度実行されます。

Initコンテナのspecに対する変更は、コンテナイメージフィールドに制限されています。
Initコンテナの`image`フィールドを直接変更しても、Podの再起動や再作成はトリガー _されません_。
ただし、Podがまだ起動していない場合、その変更はPodの起動方法に影響を与える可能性があります。

[Podテンプレート](/docs/concepts/workloads/pods/#pod-templates)の場合、通常はInitコンテナの任意のフィールドを変更できます。
その変更の影響は、Podテンプレートがどこで使用されているかによって異なります。

Initコンテナは何度も再起動、リトライおよび再実行可能であるため、べき等(Idempotent)である必要があります。
特に、`emptyDir`にファイルを書き込むコードは、書き込み先のファイルがすでに存在している可能性を考慮に入れなければいけません。

Initコンテナは、アプリケーションコンテナが持つすべてのフィールドを持っています。
ただし、Kubernetesでは`readinessProbe`の使用が禁止されています。
これは、Initコンテナでは完了とは別にreadiness状態を定義することができないためです。
この制約は、バリデーション時に強制されます。

Initコンテナが永久に失敗し続けることを防ぐために、Pod上で`activeDeadlineSeconds`を使用してください。
`activeDeadlineSeconds`の設定はInitコンテナが実行中の時間にも適用されます。
ただし、`activeDeadlineSeconds`はInitコンテナが完了した後にも影響が及ぶため、アプリケーションをJobとしてデプロイする場合にのみ使用することを推奨します。
すでに正しく動作しているPodは、`activeDeadlineSeconds`を設定すると強制終了されます。

Pod内の各アプリケーションコンテナとInitコンテナの名前はユニークである必要があります。
他のコンテナと同じ名前を共有していた場合、バリデーションエラーが返されます。

### コンテナ間のリソース共有 {#resource-sharing-within-containers}

Initコンテナ、サイドカーコンテナ、アプリケーションコンテナの実行順序を考慮すると、リソース使用に関して以下のルールが適用されます:

* すべてのInitコンテナで定義された特定のリソースの要求または制限のうち、最も高い値が*実効Init要求/制限*となります。
  リソース制限が指定されていない場合、これが最も高い制限であるとみなされます。
* リソースに対するPodの*実効要求/制限*は、以下のうち高い方になります。
  * すべてのアプリケーションコンテナのリソース要求/制限の合計
  * リソースに対する実効Init要求/制限
* スケジューリングは実効要求/制限に基づいて行われます。
  つまり、Initコンテナは初期化のためにリソースを予約できますが、これらはPodのライフタイム中は使用されません。
* Podの*実効QoS tier*は、Initコンテナとアプリケーションコンテナの両方に適用されるQoS(サービス品質) tierです。

クォータと制限は、実効的なPodの要求と制限に基づいて適用されます。

### InitコンテナとLinux cgroups {#cgroups}

Linuxでは、Podレベルのコントロールグループ(cgroups)に対するリソース割り当ては、スケジューラーと同様に、実効的なPodの要求と制限に基づいています。

{{< comment >}}
このセクションは[サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers/)のページにも存在します。
このセクションを編集する場合は、両方の場所を変更してください。
{{< /comment >}}

### Podの再起動の理由 {#pod-restart-reasons}

以下の理由によりPodは再起動し、Initコンテナの再実行を引き起こす可能性があります:

* Podインフラストラクチャコンテナが再起動された場合。
  これは稀なケースであり、ノードへのルートアクセス権を持つ人が実行する必要があります。
* `restartPolicy`がAlwaysに設定されている状態でPod内のすべてのコンテナが終了し、再起動が強制され、かつInitコンテナの完了記録が{{< glossary_tooltip text="ガベージコレクション" term_id="garbage-collection" >}}により失われた場合。

Initコンテナイメージが変更された場合、またはガベージコレクションによりInitコンテナの完了記録が失われた場合、Podは再起動されません。
これはKubernetes v1.20以降に適用されます。
それ以前のバージョンのKubernetesを使用している場合は、使用しているバージョンのドキュメントを参照してください。

## {{% heading "whatsnext" %}} {#what-s-next}

詳しく学ぶには、以下を参照してください:
* [Initコンテナを持つPodの作成](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* [Initコンテナのデバッグ](/docs/tasks/debug/debug-application/debug-init-containers/)
* [kubelet](/docs/reference/command-line-tools-reference/kubelet/)と[kubectl](/docs/reference/kubectl/)の概要
* [Probeの種類](/docs/concepts/workloads/pods/pod-lifecycle/#types-of-probe): Liveness、Readiness、Startup Probe 
* [サイドカーコンテナ](/docs/concepts/workloads/pods/sidecar-containers)
