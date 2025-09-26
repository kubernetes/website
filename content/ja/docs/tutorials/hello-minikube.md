---
title: Hello Minikube
content_type: tutorial
weight: 5
card:
  name: tutorials
  weight: 10
---

<!-- overview -->

このチュートリアルでは、minikubeを使用して、Kubernetes上でサンプルアプリケーションを動かす方法を紹介します。
このチュートリアルはNGINXを利用してすべての要求をエコーバックするコンテナイメージを提供します。

## {{% heading "objectives" %}}

* minikubeへのサンプルアプリケーションのデプロイ
* アプリケーションの実行
* アプリケーションログの確認

## {{% heading "prerequisites" %}}


このチュートリアルは、`minikube`がセットアップ済みであることを前提としています。
インストール手順は[minikube start](https://minikube.sigs.k8s.io/docs/start/)の __Step 1__ を参照してください。
{{< note >}}
 __Step 1, Installation__ の手順のみ実行してください。それ以降の手順はこのページで説明します。
{{< /note >}}

また、`kubectl`をインストールする必要があります。
インストール手順は[ツールのインストール](/docs/tasks/tools/#kubectl)を参照してください。


<!-- lessoncontent -->

## minikubeクラスターの作成

```shell
minikube start
```

## ダッシュボードを開く

Kubernetesダッシュボードを開きます。これには二通りの方法があります:

{{< tabs name="dashboard" >}}
{{% tab name="ブラウザーを起動" %}}
**新しい**ターミナルを開き、次のコマンドを実行します:
```shell
# 新しいターミナルを起動し、以下を実行したままにします
minikube dashboard
```

`minikube start`を実行したターミナルに戻ります。

{{< note >}}
`dashboard`コマンドは、ダッシュボードアドオンを有効にし、デフォルトのWebブラウザーでプロキシを開きます。
ダッシュボード上で、DeploymentやServiceなどのKubernetesリソースを作成できます。

ターミナルから直接ブラウザーを起動させずに、WebダッシュボードのURLを取得する方法については、「URLをコピー&ペースト」タブを参照してください。

デフォルトでは、ダッシュボードはKubernetesの仮想ネットワーク内部からのみアクセス可能です。
`dashboard`コマンドは、Kubernetes仮想ネットワークの外部からダッシュボードにアクセス可能にするための一時的なプロキシを作成します。

プロキシを停止するには、`Ctrl+C`を実行してプロセスを終了します。
`dashboard`コマンドが終了した後も、ダッシュボードはKubernetesクラスター内で実行を続けます。
再度`dashboard`コマンドを実行すれば、新しい別のプロキシを作成してダッシュボードにアクセスできます。
{{< /note >}}

{{% /tab %}}
{{% tab name="URLをコピー&ペースト" %}}

minikubeが自動的にWebブラウザーを開くことを望まない場合、`dashboard`サブコマンドを`--url`フラグと共に実行します。
`minikube`は、お好みのブラウザーで開くことができるURLを出力します。

**新しい**ターミナルを開き、次のコマンドを実行します:
```shell
# 新しいターミナルを起動し、以下を実行したままにします
minikube dashboard --url
```

URLをコピー&ペーストし、ブラウザーで開きます。
`minikube start`を実行したターミナルに戻ります。

{{% /tab %}}
{{< /tabs >}}

## Deploymentの作成

Kubernetesの[*Pod*](/docs/concepts/workloads/pods/)は、コンテナの管理やネットワーキングの目的でまとめられた、1つ以上のコンテナのグループです。このチュートリアルのPodがもつコンテナは1つのみです。Kubernetesの[*Deployment*](/docs/concepts/workloads/controllers/deployment/)はPodの状態を確認し、Podのコンテナが停止した場合には再起動します。DeploymentはPodの作成やスケールを管理するために推奨される方法(手段)です。

1. `kubectl create`コマンドを使用してPodを管理するDeploymentを作成してください。Podは提供されたDockerイメージを元にコンテナを実行します。

    ```shell
    # Webサーバーを含むテストコンテナイメージを実行する
    kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.53 -- /agnhost netexec --http-port=8080
    ```

2. Deploymentを確認します:

    ```shell
    kubectl get deployments
    ```

    出力は下記のようになります:

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1/1     1            1           1m
    ```

    (Podが利用可能になるまで時間がかかる場合があります。"0/1"と表示された場合は、数秒後にもう一度確認してみてください。)

3. Podを確認します:

    ```shell
    kubectl get pods
    ```

    出力は下記のようになります:

    ```
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. クラスターイベントを確認します:

    ```shell
    kubectl get events
    ```

5. `kubectl`で設定を確認します:

    ```shell
    kubectl config view
    ```

6. Podで実行されているコンテナのアプリケーションログを確認します(Podの名前は`kubectl get pods`で取得したものに置き換えてください)。

   {{< note >}}
   `kubectl logs`コマンドの引数`hello-node-5f76cf6ccf-br9b5`は、`kubectl get pods`コマンドで取得したPodの名前に置き換えてください。
   {{< /note >}}

   ```shell
   kubectl logs hello-node-5f76cf6ccf-br9b5
   ```

   出力は下記のようになります:

   ```
   I0911 09:19:26.677397       1 log.go:195] Started HTTP server on port 8080
   I0911 09:19:26.677586       1 log.go:195] Started UDP server on port  8081
   ```

{{< note >}}
`kubectl`コマンドの詳細な情報は[コマンドラインツール(kubectl)](/docs/reference/kubectl/)を参照してください。
{{< /note >}}

## Serviceの作成

通常、PodはKubernetesクラスター内部のIPアドレスからのみアクセスすることができます。`hello-node`コンテナをKubernetesの仮想ネットワークの外部からアクセスするためには、Kubernetesの[*Service*](/docs/concepts/services-networking/service/)としてPodを公開する必要があります。

{{< warning >}}
agnhostコンテナには`/shell`エンドポイントがあり、デバッグには便利ですが、インターネットに公開するのは危険です。
インターネットに接続されたクラスターや、プロダクション環境のクラスターで実行しないでください。
{{< /warning >}}

1. `kubectl expose`コマンドを使用してPodをインターネットに公開します:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer`フラグはServiceをクラスター外部に公開したいことを示しています。

    テストイメージ内のアプリケーションコードはTCPの8080番ポートのみを待ち受けます。
    `kubectl expose`で8080番ポート以外を公開した場合、クライアントはそのポートに接続できません。

2. 作成したServiceを確認します:

    ```shell
    kubectl get services
    ```

    出力は下記のようになります:

    ```
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    ロードバランサーをサポートするクラウドプロバイダーでは、Serviceにアクセスするための外部IPアドレスが提供されます。
    minikubeでは、`LoadBalancer`タイプは`minikube service`コマンドを使用した接続可能なServiceを作成します。

3. 次のコマンドを実行します:

    ```shell
    minikube service hello-node
    ```

    アプリケーションとその応答が表示されるブラウザーウィンドウが開きます。

## アドオンの有効化

minikubeはビルトインの{{< glossary_tooltip text="アドオン" term_id="addons" >}}があり、有効化、無効化、あるいはローカルのKubernetes環境に公開することができます。

1. サポートされているアドオンをリストアップします:

    ```shell
    minikube addons list
    ```

    出力は下記のようになります:

    ```
    addon-manager: enabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    gvisor: disabled
    helm-tiller: disabled
    ingress: disabled
    ingress-dns: disabled
    logviewer: disabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    storage-provisioner-gluster: disabled
    ```

2. ここでは例として`metrics-server`のアドオンを有効化します:

    ```shell
    minikube addons enable metrics-server
    ```

    出力は下記のようになります:

    ```
    The 'metrics-server' addon is enabled
    ```

3. 作成されたPodとサービスを確認します:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    出力:

    ```
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/coredns-5644d7b6d9-mh9ll                1/1       Running   0          34m
    pod/coredns-5644d7b6d9-pqd2t                1/1       Running   0          34m
    pod/metrics-server-67fb648c5                1/1       Running   0          26s
    pod/etcd-minikube                           1/1       Running   0          34m
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-apiserver-minikube                 1/1       Running   0          34m
    pod/kube-controller-manager-minikube        1/1       Running   0          34m
    pod/kube-proxy-rnlps                        1/1       Running   0          34m
    pod/kube-scheduler-minikube                 1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/metrics-server         ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. `metrics-server`の出力を確認します:

    ```shell
    kubectl top pods
    ```

    出力は下記のようになります:

    ```
    NAME                         CPU(cores)   MEMORY(bytes)
    hello-node-ccf4b9788-4jn97   1m           6Mi
    ```

    次のメッセージが表示された場合は、しばらく待ってから再度実行してください:

    ```
    error: Metrics API not available
    ```

5. `metrics-server`を無効化します:

    ```shell
    minikube addons disable metrics-server
    ```

    出力は下記のようになります:

    ```
    metrics-server was successfully disabled
    ```

## クリーンアップ

クラスターに作成したリソースをクリーンアップします:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

minikubeクラスターを停止します

```shell
minikube stop
```

(オプション)minikubeのVMを削除します:

```shell
# オプション
minikube delete
```

Kubernetesの学習で再度minikubeを使用したい場合、minikubeのVMを削除する必要はありません。

## まとめ
このページでは、minikubeクラスターを立ち上げて実行するための基本的な部分を説明しました。
これでアプリケーションをデプロイする準備が整いました。

## {{% heading "whatsnext" %}}


* _[kubectlで初めてのアプリケーションをKubernetesにデプロイする](/docs/tutorials/kubernetes-basics/deploy-app/deploy-intro/)_。
* [Deploymentオブジェクト](/docs/concepts/workloads/controllers/deployment/)について学ぶ。
* [アプリケーションのデプロイ](/docs/tasks/run-application/run-stateless-application-deployment/)について学ぶ。
* [Serviceオブジェクト](/docs/concepts/services-networking/service/)について学ぶ。
