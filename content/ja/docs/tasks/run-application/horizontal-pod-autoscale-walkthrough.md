---
title: Horizontal Pod Autoscalerウォークスルー
content_type: task
weight: 100
---

<!-- overview -->

Horizontal Pod Autoscalerは、Deployment、ReplicaSetまたはStatefulSetといったレプリケーションコントローラ内のPodの数を、観測されたCPU使用率（もしくはベータサポートの、アプリケーションによって提供されるその他のメトリクス）に基づいて自動的にスケールさせます。

このドキュメントはphp-apacheサーバーに対しHorizontal Pod Autoscalerを有効化するという例に沿ってウォークスルーで説明していきます。Horizontal Pod Autoscalerの動作についてのより詳細な情報を知りたい場合は、[Horizontal Pod Autoscalerユーザーガイド](/docs/tasks/run-application/horizontal-pod-autoscale/)をご覧ください。

## {{% heading "前提条件" %}}

この例ではバージョン1.2以上の動作するKubernetesクラスターおよびkubectlが必要です。
[Metrics API](https://github.com/kubernetes/metrics)を介してメトリクスを提供するために、[Metrics server](https://github.com/kubernetes-sigs/metrics-server)によるモニタリングがクラスター内にデプロイされている必要があります。
Horizontal Pod Autoscalerはメトリクスを収集するためにこのAPIを利用します。metrics-serverをデプロイする方法を知りたい場合は[metrics-server ドキュメント](https://github.com/kubernetes-sigs/metrics-server#deployment)をご覧ください。

Horizontal Pod Autoscalerで複数のリソースメトリクスを利用するためには、バージョン1.6以上のKubernetesクラスターおよびkubectlが必要です。カスタムメトリクスを使えるようにするためには、あなたのクラスターがカスタムメトリクスAPIを提供するAPIサーバーと通信できる必要があります。
最後に、Kubernetesオブジェクトと関係のないメトリクスを使うにはバージョン1.10以上のKubernetesクラスターおよびkubectlが必要で、さらにあなたのクラスターが外部メトリクスAPIを提供するAPIサーバーと通信できる必要があります。
詳細については[Horizontal Pod Autoscaler user guide](/docs/tasks/run-application/horizontal-pod-autoscale/#support-for-custom-metrics)をご覧ください。

<!-- steps -->

## php-apacheの起動と公開

Horizontal Pod Autoscalerのデモンストレーションのために、php-apacheイメージをもとにしたカスタムのDockerイメージを使います。
このDockerfileは下記のようになっています。

```dockerfile
FROM php:5-apache
COPY index.php /var/www/html/index.php
RUN chmod a+rx index.php
```

これはCPU負荷の高い演算を行うindex.phpを定義しています。

```php
<?php
  $x = 0.0001;
  for ($i = 0; $i <= 1000000; $i++) {
    $x += sqrt($x);
  }
  echo "OK!";
?>
```

まず最初に、イメージを動かすDeploymentを起動し、Serviceとして公開しましょう。
下記の設定を使います。

{{< codenew file="application/php-apache.yaml" >}}

以下のコマンドを実行してください。

```shell
kubectl apply -f https://k8s.io/examples/application/php-apache.yaml
```

```
deployment.apps/php-apache created
service/php-apache created
```

## Horizontal Pod Autoscalerを作成する

サーバーが起動したら、[kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands#autoscale)を使ってautoscalerを作成しましょう。以下のコマンドで、最初のステップで作成したphp-apache deploymentによって制御されるPodレプリカ数を1から10の間に維持するHorizontal Pod Autoscalerを作成します。
簡単に言うと、HPAは（Deploymentを通じて）レプリカ数を増減させ、すべてのPodにおける平均CPU使用率を50%（それぞれのPodは`kubectl run`で200 milli-coresを要求しているため、平均CPU使用率100 milli-coresを意味します）に保とうとします。
このアルゴリズムについての詳細は[こちら](/docs/tasks/run-application/horizontal-pod-autoscale/#algorithm-details)をご覧ください。

```shell
kubectl autoscale deployment php-apache --cpu-percent=50 --min=1 --max=10
```

```
horizontalpodautoscaler.autoscaling/php-apache autoscaled
```

以下を実行して現在のAutoscalerの状況を確認できます。

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET    MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%  1         10        1          18s
```

現在はサーバーにリクエストを送っていないため、CPU使用率が0%になっていることに注意してください（`TARGET`カラムは対応するDeploymentによって制御される全てのPodの平均値を示しています。）。

## 負荷の増加

Autoscalerがどのように負荷の増加に反応するか見てみましょう。
コンテナを作成し、クエリの無限ループをphp-apacheサーバーに送ってみます（これは別のターミナルで実行してください）。

```shell
kubectl run -i --tty load-generator --rm --image=busybox --restart=Never -- /bin/sh -c "while sleep 0.01; do wget -q -O- http://php-apache; done"
```

数分以内に、下記を実行することでCPU負荷が高まっていることを確認できます。

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET      MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   305% / 50%  1         10        1          3m
```

ここでは、CPU使用率はrequestの305%にまで高まっています。
結果として、Deploymentはレプリカ数7にリサイズされました。

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   7/7      7           7           19m
```

{{< note >}}
レプリカ数が安定するまでは数分かかることがあります。負荷量は何らかの方法で制御されているわけではないので、最終的なレプリカ数はこの例とは異なる場合があります。
{{< /note >}}

## 負荷の停止

ユーザー負荷を止めてこの例を終わらせましょう。

私たちが`busybox`イメージを使って作成したコンテナ内のターミナルで、`<Ctrl> + C`を入力して負荷生成を終了させます。

そして結果の状態を確認します（数分後）。

```shell
kubectl get hpa
```

```
NAME         REFERENCE                     TARGET       MINPODS   MAXPODS   REPLICAS   AGE
php-apache   Deployment/php-apache/scale   0% / 50%     1         10        1          11m
```

```shell
kubectl get deployment php-apache
```

```
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
php-apache   1/1     1            1           27m
```

ここでCPU使用率は0に下がり、HPAによってオートスケールされたレプリカ数は1に戻ります。

{{< note >}}
レプリカのオートスケールには数分かかることがあります。
{{< /note >}}

<!-- discussion -->

## 複数のメトリクスやカスタムメトリクスを基にオートスケーリングする

`autoscaling/v2beta2` APIバージョンと使うと、`php-apache` Deploymentをオートスケーリングする際に使う追加のメトリクスを導入することが出来ます。

まず、`autoscaling/v2beta2`内のHorizontalPodAutoscalerのYAMLファイルを入手します。

```shell
kubectl get hpa.v2beta2.autoscaling -o yaml > /tmp/hpa-v2.yaml
```

`/tmp/hpa-v2.yaml`ファイルをエディタで開くと、以下のようなYAMLファイルが見えるはずです。

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
      current:
        averageUtilization: 0
        averageValue: 0
```

`targetCPUUtilizationPercentage`フィールドは`metrics`と呼ばれる配列に置換されています。
CPU使用率メトリクスは、Podコンテナで定められたリソースの割合として表されるため、*リソースメトリクス*です。CPU以外のリソースメトリクスを指定することもできます。デフォルトでは、他にメモリだけがリソースメトリクスとしてサポートされています。これらのリソースはクラスター間で名前が変わることはなく、そして`metrics.k8s.io` APIが利用可能である限り常に利用可能です。

さらに`target.type`において`Utilization`の代わりに`AverageValue`を使い、`target.averageUtilization`フィールドの代わりに対応する`target.averageValue`フィールドを設定することで、リソースメトリクスをrequest値に対する割合に代わり、直接的な値に設定することも可能です。

PodメトリクスとObjectメトリクスという2つの異なる種類のメトリクスが存在し、どちらも*カスタムメトリクス*とみなされます。これらのメトリクスはクラスター特有の名前を持ち、利用するにはより発展的なクラスター監視設定が必要となります。

これらの代替メトリクスタイプのうち、最初のものが*Podメトリクス*です。これらのメトリクスはPodを説明し、Podを渡って平均され、レプリカ数を決定するためにターゲット値と比較されます。
これらはほとんどリソースメトリクス同様に機能しますが、`target`の種類としては`AverageValue`*のみ*をサポートしている点が異なります。

Podメトリクスはmetricブロックを使って以下のように指定されます。

```yaml
type: Pods
pods:
  metric:
    name: packets-per-second
  target:
    type: AverageValue
    averageValue: 1k
```

2つ目のメトリクスタイプは*Objectメトリクス*です。これらのメトリクスはPodを説明するかわりに、同一Namespace内の異なったオブジェクトを説明します。このメトリクスはオブジェクトから取得される必要はありません。単に説明するだけです。Objectメトリクスは`target`の種類として`Value`と`AverageValue`をサポートします。`Value`では、ターゲットはAPIから返ってきたメトリクスと直接比較されます。`AverageValue`では、カスタムメトリクスAPIから返ってきた値はターゲットと比較される前にPodの数で除算されます。以下の例は`requests-per-second`メトリクスのYAML表現です。

```yaml
type: Object
object:
  metric:
    name: requests-per-second
  describedObject:
    apiVersion: networking.k8s.io/v1beta1
    kind: Ingress
    name: main-route
  target:
    type: Value
    value: 2k
```

もしこのようなmetricブロックを複数提供した場合、HorizontalPodAutoscalerはこれらのメトリクスを順番に処理します。
HorizontalPodAutoscalerはそれぞれのメトリクスについて推奨レプリカ数を算出し、その中で最も多いレプリカ数を採用します。

例えば、もしあなたがネットワークトラフィックについてのメトリクスを収集する監視システムを持っているなら、`kubectl edit`を使って指定を次のように更新することができます。

```yaml
apiVersion: autoscaling/v2beta2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Pods
    pods:
      metric:
        name: packets-per-second
      target:
        type: AverageValue
        averageValue: 1k
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1beta1
        kind: Ingress
        name: main-route
      target:
        type: Value
        value: 10k
status:
  observedGeneration: 1
  lastScaleTime: <some-time>
  currentReplicas: 1
  desiredReplicas: 1
  currentMetrics:
  - type: Resource
    resource:
      name: cpu
    current:
      averageUtilization: 0
      averageValue: 0
  - type: Object
    object:
      metric:
        name: requests-per-second
      describedObject:
        apiVersion: networking.k8s.io/v1beta1
        kind: Ingress
        name: main-route
      current:
        value: 10k
```

この時、HorizontalPodAutoscalerはそれぞれのPodがCPU requestの50%を使い、1秒当たり1000パケットを送信し、そしてmain-route
Ingressの裏にあるすべてのPodが合計で1秒当たり10000パケットを送信する状態を保持しようとします。

### より詳細なメトリクスをもとにオートスケーリングする

多くのメトリクスパイプラインは、名前もしくは _labels_ と呼ばれる追加の記述子の組み合わせによって説明することができます。全てのリソースメトリクス以外のメトリクスタイプ（Pod、Object、そして下で説明されている外部メトリクス）において、メトリクスパイプラインに渡す追加のラベルセレクターを指定することができます。例えば、もしあなたが`http_requests`メトリクスを`verb`ラベルとともに収集しているなら、下記のmetricブロックを指定してGETリクエストにのみ基づいてスケールさせることができます。

```yaml
type: Object
object:
  metric:
    name: http_requests
    selector: {matchLabels: {verb: GET}}
```

このセレクターは完全なKubernetesラベルセレクターと同じ文法を利用します。もし名前とセレクターが複数の系列に一致した場合、この監視パイプラインはどのようにして複数の系列を一つの値にまとめるかを決定します。このセレクターは付加的なもので、ターゲットオブジェクト（`Pods`タイプの場合は対象Pod、`Object`タイプの場合は説明されるオブジェクト）では**ない**オブジェクトを説明するメトリクスを選択することは出来ません。

### Kubernetesオブジェクトと関係ないメトリクスに基づいたオートスケーリング

Kubernetes上で動いているアプリケーションを、Kubernetes Namespaceと直接的な関係がないサービスを説明するメトリクスのような、Kubernetesクラスター内のオブジェクトと明確な関係が無いメトリクスを基にオートスケールする必要があるかもしれません。Kubernetes 1.10以降では、このようなユースケースを*外部メトリクス*によって解決できます。

外部メトリクスを使うにはあなたの監視システムについての知識が必要となります。この設定はカスタムメトリクスを使うときのものに似ています。外部メトリクスを使うとあなたの監視システムのあらゆる利用可能なメトリクスに基づいてクラスターをオートスケールできるようになります。上記のように`metric`ブロックで`name`と`selector`を設定し、`Object`のかわりに`External`メトリクスタイプを使います。
もし複数の時系列が`metricSelector`により一致した場合は、それらの値の合計がHorizontalPodAutoscalerに使われます。
外部メトリクスは`Value`と`AverageValue`の両方のターゲットタイプをサポートしています。これらの機能は`Object`タイプを利用するときとまったく同じです。

例えばもしあなたのアプリケーションがホストされたキューサービスからのタスクを処理している場合、あなたは下記のセクションをHorizontalPodAutoscalerマニフェストに追記し、未処理のタスク30個あたり1つのワーカーを必要とすることを指定します。

```yaml
- type: External
  external:
    metric:
      name: queue_messages_ready
      selector: "queue=worker_tasks"
    target:
      type: AverageValue
      averageValue: 30
```

可能なら、クラスター管理者がカスタムメトリクスAPIを保護することを簡単にするため、外部メトリクスのかわりにカスタムメトリクスを用いることが望ましいです。外部メトリクスAPIは潜在的に全てのメトリクスへのアクセスを許可するため、クラスター管理者はこれを公開する際には注意が必要です。

## 付録: Horizontal Pod Autoscaler status conditions

`autoscaling/v2beta2`形式のHorizontalPodAutoscalerを使っている場合は、KubernetesによるHorizontalPodAutoscaler上の*status conditions*セットを見ることができます。status conditionsはHorizontalPodAutoscalerがスケール可能かどうか、そして現時点でそれが何らかの方法で制限されているかどうかを示しています。

このconditionsは`status.conditions`フィールドに現れます。HorizontalPodAutoscalerに影響しているconditionsを確認するために、`kubectl describe hpa`を利用できます。

```shell
kubectl describe hpa cm-test
```

```
Name:                           cm-test
Namespace:                      prom
Labels:                         <none>
Annotations:                    <none>
CreationTimestamp:              Fri, 16 Jun 2017 18:09:22 +0000
Reference:                      ReplicationController/cm-test
Metrics:                        ( current / target )
  "http_requests" on pods:      66m / 500m
Min replicas:                   1
Max replicas:                   4
ReplicationController pods:     1 current / 1 desired
Conditions:
  Type                  Status  Reason                  Message
  ----                  ------  ------                  -------
  AbleToScale           True    ReadyForNewScale        the last scale time was sufficiently old as to warrant a new scale
  ScalingActive         True    ValidMetricFound        the HPA was able to successfully calculate a replica count from pods metric http_requests
  ScalingLimited        False   DesiredWithinRange      the desired replica count is within the acceptable range
Events:
```

このHorizontalPodAutoscalerにおいて、いくつかの正常な状態のconditionsを見ることができます。まず最初に、`AbleToScale`は、HPAがスケール状況を取得し、更新させることが出来るかどうかだけでなく、何らかのbackoffに関連した状況がスケーリングを妨げていないかを示しています。2番目に、`ScalingActive`は、HPAが有効化されているかどうか（例えば、レプリカ数のターゲットがゼロでないこと）や、望ましいスケールを算出できるかどうかを示します。もしこれが`False`の場合、大体はメトリクスの取得において問題があることを示しています。最後に、一番最後の状況である`ScalingLimited`は、HorizontalPodAutoscalerの最大値や最小値によって望ましいスケールがキャップされていることを示しています。この指標を見てHorizontalPodAutoscaler上の最大・最小レプリカ数制限を増やす、もしくは減らす検討ができます。

## 付録: 数量

全てのHorizontalPodAutoscalerおよびメトリクスAPIにおけるメトリクスは{{< glossary_tooltip term_id="quantity" text="quantity">}}として知られる特殊な整数表記によって指定されます。例えば、`10500m`という数量は10進数表記で`10.5`と書くことができます。メトリクスAPIは可能であれば接尾辞を用いない整数を返し、そうでない場合は基本的にミリ単位での数量を返します。これはメトリクス値が`1`と`1500m`の間で、もしくは10進法表記で書かれた場合は`1`と`1.5`の間で変動するということを意味します。

## 付録: その他の起きうるシナリオ

### Autoscalerを宣言的に作成する

`kubectl autoscale`コマンドを使って命令的にHorizontalPodAutoscalerを作るかわりに、下記のファイルを使って宣言的に作成することができます。

{{< codenew file="application/hpa/php-apache.yaml" >}}

下記のコマンドを実行してAutoscalerを作成します。

```shell
kubectl create -f https://k8s.io/examples/application/hpa/php-apache.yaml
```

```
horizontalpodautoscaler.autoscaling/php-apache created
```
