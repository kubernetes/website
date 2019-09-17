---
title: Hello Minikube
content_template: templates/tutorial
weight: 5
menu:
  main:
    title: "Get Started"
    weight: 10
    post: >
      <p>手を動かす準備はできていますか？本チュートリアルでは、Node.jsを使った簡単な"Hello World"を実行するKubernetesクラスタをビルドします。</p>
card: 
  name: tutorials
  weight: 10
---

{{% capture overview %}}

このチュートリアルでは、[Minikube](/docs/getting-started-guides/minikube)とKatacodaを使用して、Kubernetes上でシンプルなHello WorldのNode.jsアプリケーションを動かす方法を紹介します。Katacodaはブラウザで無償のKubernetes環境を提供します。

{{< note >}}
[Minikubeをローカルにインストール](/docs/tasks/tools/install-minikube/)している場合もこのチュートリアルを進めることが可能です。
{{< /note >}}

{{% /capture %}}

{{% capture objectives %}}

* Minikubeへのhello worldアプリケーションのデプロイ
* アプリケーションの実行
* アプリケーションログの確認

{{% /capture %}}

{{% capture prerequisites %}}

このチュートリアルは下記のファイルからビルドされるコンテナーイメージを提供します:

{{< codenew language="js" file="minikube/server.js" >}}

{{< codenew language="conf" file="minikube/Dockerfile" >}}

`docker build`コマンドについての詳細な情報は、[Dockerのドキュメント](https://docs.docker.com/engine/reference/commandline/build/)を参照してください。

{{% /capture %}}

{{% capture lessoncontent %}}

## Minikubeクラスタの作成

1. **Launch Terminal** をクリックしてください

    {{< kat-button >}}

    {{< note >}}Minikubeをローカルにインストール済みの場合は、`minikube start`を実行してください。{{< /note >}}

2. ブラウザーでKubernetesダッシュボードを開いてください:

    ```shell
    minikube dashboard
    ```

3. Katacoda環境のみ：ターミナルペーン上部の+ボタンをクリックしてから **Select port to view on Host 1** をクリックしてください。

4. Katacoda環境のみ：`30000`を入力し、**Display Port**をクリックしてください。 

## Deploymentの作成

Kubernetesの[*Pod*](/docs/concepts/workloads/pods/pod/) は、コンテナの管理やネットワーキングの目的でまとめられた、1つ以上のコンテナのグループです。このチュートリアルのPodがもつコンテナは1つのみです。Kubernetesの [*Deployment*](/docs/concepts/workloads/controllers/deployment/) はPodの状態を確認し、Podのコンテナが停止した場合には再起動します。DeploymentはPodの作成やスケールを管理するために推奨される方法(手段)です。

1. `kubectl create` コマンドを使用してPodを管理するDeploymentを作成してください。Podは提供されたDockerイメージを元にコンテナを実行します。

    ```shell
    kubectl create deployment hello-node --image=gcr.io/hello-minikube-zero-install/hello-node
    ```

2. Deploymentを確認します:

    ```shell
    kubectl get deployments
    ```

    出力:

    ```shell
    NAME         DESIRED   CURRENT   UP-TO-DATE   AVAILABLE   AGE
    hello-node   1         1         1            1           1m
    ```

3. Podを確認します:

    ```shell
    kubectl get pods
    ```
    出力:

    ```shell
    NAME                          READY     STATUS    RESTARTS   AGE
    hello-node-5f76cf6ccf-br9b5   1/1       Running   0          1m
    ```

4. クラスタイベントを確認します:

    ```shell
    kubectl get events
    ```

5. `kubectl` で設定を確認します:

    ```shell
    kubectl config view
    ```
  
    {{< note >}} `kubectl`コマンドの詳細な情報は[kubectl overview](/docs/user-guide/kubectl-overview/)を参照してください。{{< /note >}}

## Serviceの作成

通常、PodはKubernetesクラスタ内部のIPアドレスからのみアクセスすることができます。`hello-node`コンテナをKubernetesの仮想ネットワークの外部からアクセスするためには、Kubernetesの[*Service*](/docs/concepts/services-networking/service/)としてポッドを公開する必要があります。

1. `kubectl expose` コマンドを使用してPodをインターネットに公開します:

    ```shell
    kubectl expose deployment hello-node --type=LoadBalancer --port=8080
    ```
    
    `--type=LoadBalancer`フラグはServiceをクラスタ外部に公開したいことを示しています。

2. 作成したServiceを確認します:

    ```shell
    kubectl get services
    ```

    出力:

    ```shell
    NAME         TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)          AGE
    hello-node   LoadBalancer   10.108.144.78   <pending>     8080:30369/TCP   21s
    kubernetes   ClusterIP      10.96.0.1       <none>        443/TCP          23m
    ```

    ロードバランサーをサポートするクラウドプロバイダーでは、Serviceにアクセスするための外部IPアドレスが提供されます。
    Minikube では、`LoadBalancer`タイプは`minikube service`コマンドを使用した接続可能なServiceを作成します。    

3. 次のコマンドを実行します:

    ```shell
    minikube service hello-node
    ```

4. Katacoda環境のみ：ターミナル画面上部の+ボタンをクリックして **Select port to view on Host 1** をクリックしてください。

5. Katacoda環境のみ：`30369`(Service出力に表示されている`8080`の反対側のポートを参照)を入力し、クリックしてください。

    "Hello World"メッセージが表示されるアプリケーションのブラウザウィンドウが開きます。

## アドオンの有効化

Minikubeはビルトインのアドオンがあり、有効化、無効化、あるいはローカルのKubernetes環境に公開することができます。

1. サポートされているアドオンをリストアップします:

    ```shell
    minikube addons list
    ```

    出力:

    ```shell
    addon-manager: enabled
    coredns: disabled
    dashboard: enabled
    default-storageclass: enabled
    efk: disabled
    freshpod: disabled
    heapster: disabled
    ingress: disabled
    kube-dns: enabled
    metrics-server: disabled
    nvidia-driver-installer: disabled
    nvidia-gpu-device-plugin: disabled
    registry: disabled
    registry-creds: disabled
    storage-provisioner: enabled
    ```
   
2. ここでは例として`heapster`のアドオンを有効化します:

    ```shell
    minikube addons enable heapster
    ```
  
    出力:

    ```shell
    heapster was successfully enabled
    ```

3. 作成されたポッドとサービスを確認します:

    ```shell
    kubectl get pod,svc -n kube-system
    ```

    出力:

    ```shell
    NAME                                        READY     STATUS    RESTARTS   AGE
    pod/heapster-9jttx                          1/1       Running   0          26s
    pod/influxdb-grafana-b29w8                  2/2       Running   0          26s
    pod/kube-addon-manager-minikube             1/1       Running   0          34m
    pod/kube-dns-6dcb57bcc8-gv7mw               3/3       Running   0          34m
    pod/kubernetes-dashboard-5498ccf677-cgspw   1/1       Running   0          34m
    pod/storage-provisioner                     1/1       Running   0          34m

    NAME                           TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)             AGE
    service/heapster               ClusterIP   10.96.241.45    <none>        80/TCP              26s
    service/kube-dns               ClusterIP   10.96.0.10      <none>        53/UDP,53/TCP       34m
    service/kubernetes-dashboard   NodePort    10.109.29.1     <none>        80:30000/TCP        34m
    service/monitoring-grafana     NodePort    10.99.24.54     <none>        80:30002/TCP        26s
    service/monitoring-influxdb    ClusterIP   10.111.169.94   <none>        8083/TCP,8086/TCP   26s
    ```

4. `heapster`を無効化します:

    ```shell
    minikube addons disable heapster
    ```

    出力:

    ```shell
    heapster was successfully disabled
    ```

## クリーンアップ

クラスタに作成したリソースをクリーンアップします:

```shell
kubectl delete service hello-node
kubectl delete deployment hello-node
```

(オプション)Minikubeの仮想マシン(VM)を停止します:

```shell
minikube stop
```

(オプション)MinikubeのVMを削除します:

```shell
minikube delete
```

{{% /capture %}}

{{% capture whatsnext %}}

* [Deploymentオブジェクト](/docs/concepts/workloads/controllers/deployment/)について学ぶ.
* [アプリケーションのデプロイ](/docs/user-guide/deploying-applications/)について学ぶ.
* [Serviceオブジェクト](/docs/concepts/services-networking/service/)について学ぶ.

{{% /capture %}}
