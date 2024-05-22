---
title: Hello Minikube
content_type: tutorial
weight: 5
card: 
  name: tutorials
  weight: 10
---

<!-- overview -->

このチュートリアルでは、[minikube](/ja/docs/setup/learning-environment/minikube)とKatacodaを使用して、Kubernetes上でサンプルアプリケーションを動かす方法を紹介します。Katacodaはブラウザで無償のKubernetes環境を提供します。

{{< note >}}
[minikubeをローカルにインストール](https://minikube.sigs.k8s.io/docs/start/)している場合もこのチュートリアルを進めることが可能です。
{{< /note >}}



## {{% heading "objectives" %}}


* minikubeへのサンプルアプリケーションのデプロイ
* アプリケーションの実行
* アプリケーションログの確認



## {{% heading "prerequisites" %}}


このチュートリアルはNGINXを利用してすべての要求をエコーバックするコンテナイメージを提供します。





<!-- lessoncontent -->

## minikubeクラスターの作成

1. **Launch Terminal** をクリックしてください

    {{< kat-button >}}

{{< note >}}
    minikubeをローカルにインストール済みの場合は、`minikube start`を実行してください。
{{< /note >}}

2. ブラウザーでKubernetesダッシュボードを開いてください:

    ```shell
    minikube dashboard
    ```

3. Katacoda環境のみ：ターミナルペーン上部の+ボタンをクリックしてから **Select port to view on Host 1** をクリックしてください。

4. Katacoda環境のみ：`30000`を入力し、**Display Port**をクリックしてください。

## Deploymentの作成

Kubernetesの[*Pod*](/ja/docs/concepts/workloads/pods/) は、コンテナの管理やネットワーキングの目的でまとめられた、1つ以上のコンテナのグループです。このチュートリアルのPodがもつコンテナは1つのみです。Kubernetesの [*Deployment*](/ja/docs/concepts/workloads/controllers/deployment/) はPodの状態を確認し、Podのコンテナが停止した場合には再起動します。DeploymentはPodの作成やスケールを管理するために推奨される方法(手段)です。

1. `kubectl create` コマンドを使用してPodを管理するDeploymentを作成してください。Podは提供されたDockerイメージを元にコンテナを実行します。

    ```shell
    kubectl create deployment hello-node --image=registry.k8s.io/echoserver:1.4
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

5. `kubectl` で設定を確認します:

    ```shell
    kubectl config view
    ```

{{< note >}}
`kubectl`コマンドの詳細な情報は[コマンドラインツール(kubectl)](/ja/docs/reference/kubectl/)を参照してください。
{{< /note >}}

## Serviceの作成

通常、PodはKubernetesクラスター内部のIPアドレスからのみアクセスすることができます。`hello-node`コンテナをKubernetesの仮想ネットワークの外部からアクセスするためには、Kubernetesの[*Service*](/ja/docs/concepts/services-networking/service/)としてPodを公開する必要があります。

1. `kubectl expose` コマンドを使用してPodをインターネットに公開します:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```

    `--type=LoadBalancer`フラグはServiceをクラスター外部に公開したいことを示しています。

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
    minikube では、`LoadBalancer`タイプは`minikube service`コマンドを使用した接続可能なServiceを作成します。    

3. 次のコマンドを実行します:

    ```shell
    minikube service hello-node
    ```

4. Katacoda環境のみ：ターミナル画面上部の+ボタンをクリックして **Select port to view on Host 1** をクリックしてください。

5. Katacoda環境のみ：`8080`の反対側のService出力に、5桁のポート番号が表示されます。このポート番号はランダムに生成されるため、ここで使用するポート番号と異なる場合があります。ポート番号テキストボックスに番号を入力し、ポートの表示をクリックしてください。前の例の場合は、`30369`と入力します。

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
    metrics-server was successfully enabled
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

4. `metrics-server`を無効化します:

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

(オプション)minikubeの仮想マシン(VM)を停止します:

```shell
minikube stop
```

(オプション)minikubeのVMを削除します:

```shell
minikube delete
```



## {{% heading "whatsnext" %}}


* [Deploymentオブジェクト](/ja/docs/concepts/workloads/controllers/deployment/)について学ぶ.
* [アプリケーションのデプロイ](/ja/docs/tasks/run-application/run-stateless-application-deployment/)について学ぶ.
* [Serviceオブジェクト](/ja/docs/concepts/services-networking/service/)について学ぶ.
