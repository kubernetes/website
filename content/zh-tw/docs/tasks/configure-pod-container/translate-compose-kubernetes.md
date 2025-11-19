---
title: 將 Docker Compose 文件轉換爲 Kubernetes 資源
content_type: task
weight: 230
---
<!--
reviewers:
- cdrage
title: Translate a Docker Compose File to Kubernetes Resources
content_type: task
weight: 230
-->

<!-- overview -->

<!--
What's Kompose? It's a conversion tool for all things compose (namely Docker Compose) to container orchestrators (Kubernetes or OpenShift).
-->
Kompose 是什麼？它是一個轉換工具，可將 Compose
（即 Docker Compose）所組裝的所有內容轉換成容器編排器（Kubernetes 或 OpenShift）可識別的形式。

<!--
More information can be found on the Kompose website at [https://kompose.io/](https://kompose.io/).
-->
更多信息請參考 Kompose 官網 [https://kompose.io/](https://kompose.io/)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Install Kompose

We have multiple ways to install Kompose. Our preferred method is downloading the binary from the latest GitHub release.
-->
## 安裝 Kompose    {#install-kompose}

我們有很多種方式安裝 Kompose。首選方式是從最新的 GitHub 發佈頁面下載二進制文件。

{{< tabs name="install_ways" >}}
{{% tab name="GitHub 下載" %}}

<!--
Kompose is released via GitHub on a three-week cycle, you can see all current releases on the [GitHub release page](https://github.com/kubernetes/kompose/releases).
-->
Kompose 通過 GitHub 發佈，發佈週期爲三星期。
你可以在 [GitHub 發佈頁面](https://github.com/kubernetes/kompose/releases)上看到所有當前版本。

```shell
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.34.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

<!--
Alternatively, you can download the [tarball](https://github.com/kubernetes/kompose/releases).
-->
或者，你可以下載 [tar 包](https://github.com/kubernetes/kompose/releases)。

{{% /tab %}}
{{% tab name="基於源代碼構建" %}}

<!--
Installing using `go get` pulls from the master branch with the latest development changes.
-->
用 `go get` 命令從主分支拉取最新的開發變更的方法安裝 Kompose。

```shell
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

<!--
On macOS you can install the latest release via [Homebrew](https://brew.sh):
-->
在 macOS 上你可以通過 [Homebrew](https://brew.sh) 安裝 Kompose 的最新版本：

```bash
brew install kompose
```

{{% /tab %}}
{{< /tabs >}}

<!--
## Use Kompose
-->
## 使用 Kompose    {#use-kompose}

<!--
In a few steps, we'll take you from Docker Compose to Kubernetes. All
you need is an existing `docker-compose.yml` file.
-->
只需幾步，我們就把你從 Docker Compose 帶到 Kubernetes。
你只需要一個現有的 `docker-compose.yml` 文件。

<!--
1. Go to the directory containing your `docker-compose.yml` file. If you don't have one, test using this one.
-->
1. 進入 `docker-compose.yml` 文件所在的目錄。如果沒有，請使用下面這個進行測試。

   ```yaml
   services:

     redis-leader:
       container_name: redis-leader
       image: redis
       ports:
         - "6379"

     redis-replica:
       container_name: redis-replica
       image: redis
       ports:
         - "6379"
       command: redis-server --replicaof redis-leader 6379 --dir /tmp

     web:
       container_name: web
       image: quay.io/kompose/web
       ports:
         - "8080:8080"
       environment:
         - GET_HOSTS_FROM=dns
       labels:
         kompose.service.type: LoadBalancer
   ```

<!--
2. To convert the `docker-compose.yml` file to files that you can use with
   `kubectl`, run `kompose convert` and then `kubectl apply -f <output file>`.
-->
2. 要將 `docker-compose.yml` 轉換爲 `kubectl` 可用的文件，請運行 `kompose convert`
   命令進行轉換，然後運行 `kubectl apply -f <output file>` 進行創建。

   ```bash
   kompose convert                           
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```none
   INFO Kubernetes file "redis-leader-service.yaml" created
   INFO Kubernetes file "redis-replica-service.yaml" created
   INFO Kubernetes file "web-tcp-service.yaml" created
   INFO Kubernetes file "redis-leader-deployment.yaml" created
   INFO Kubernetes file "redis-replica-deployment.yaml" created
   INFO Kubernetes file "web-deployment.yaml" created
   ```

   ```bash
   kubectl apply -f web-tcp-service.yaml,redis-leader-service.yaml,redis-replica-service.yaml,web-deployment.yaml,redis-leader-deployment.yaml,redis-replica-deployment.yaml
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```none
   deployment.apps/redis-leader created
   deployment.apps/redis-replica created
   deployment.apps/web created
   service/redis-leader created
   service/redis-replica created
   service/web-tcp created
   ```

   <!--
   Your deployments are running in Kubernetes.
   -->
   你部署的應用在 Kubernetes 中運行起來了。

<!--
3. Access your application.
-->
3. 訪問你的應用。

   <!--
   If you're already using `minikube` for your development process:
   -->

   如果你在開發過程中使用 `minikube`，請執行：

   ```bash
   minikube service web-tcp
   ```

   <!--
   Otherwise, let's look up what IP your service is using!
   -->
   否則，我們要查看一下你的服務使用了什麼 IP！

   ```sh
   kubectl describe svc web-tcp
   ```

   ```none
   Name:                     web-tcp
   Namespace:                default
   Labels:                   io.kompose.service=web-tcp
   Annotations:              kompose.cmd: kompose convert
                             kompose.service.type: LoadBalancer
                             kompose.version: 1.33.0 (3ce457399)
   Selector:                 io.kompose.service=web
   Type:                     LoadBalancer
   IP Family Policy:         SingleStack
   IP Families:              IPv4
   IP:                       10.102.30.3
   IPs:                      10.102.30.3
   Port:                     8080  8080/TCP
   TargetPort:               8080/TCP
   NodePort:                 8080  31624/TCP
   Endpoints:                10.244.0.5:8080
   Session Affinity:         None
   External Traffic Policy:  Cluster
   Events:                   <none>
   ```

   <!--
   If you're using a cloud provider, your IP will be listed next to `LoadBalancer Ingress`.
   -->
   如果你使用的是雲驅動，你的 IP 將在 `LoadBalancer Ingress` 字段給出。

   ```sh
   curl http://192.0.2.89
   ```

<!--
4. Clean-up.
-->
4. 清理。

   <!--
   After you are finished testing out the example application deployment, simply run the following command in your shell to delete the
   resources used.
   -->
   你完成示例應用 Deployment 的測試之後，只需在 Shell 中運行以下命令，就能刪除用過的資源。

   ```sh
   kubectl delete -f web-tcp-service.yaml,redis-leader-service.yaml,redis-replica-service.yaml,web-deployment.yaml,redis-leader-deployment.yaml,redis-replica-deployment.yaml
   ```

<!-- discussion -->

<!--
## User Guide
-->
## 使用者指南  {#user-guide}

<!--
- CLI
  - [`kompose convert`](#kompose-convert)
- Documentation
  - [Alternative Conversions](#alternative-conversions)
  - [Labels](#labels)
  - [Restart](#restart)
  - [Docker Compose Versions](#docker-compose-versions)
-->
- CLI
  - [`kompose convert`](#kompose-convert)

- 文檔
  - [其他轉換方式](#alternative-conversions)
  - [標籤](#labels)
  - [重啓](#restart)
  - [Docker Compose 版本](#docker-compose-versions)

<!--
Kompose has support for two providers: OpenShift and Kubernetes.
You can choose a targeted provider using global option `--provider`. If no provider is specified, Kubernetes is set by default.
-->
Kompose 支持兩種驅動：OpenShift 和 Kubernetes。
你可以通過全局選項 `--provider` 選擇驅動。如果沒有指定，
會將 Kubernetes 作爲默認驅動。

## `kompose convert`

<!--
Kompose supports conversion of V1, V2, and V3 Docker Compose files into Kubernetes and OpenShift objects.
-->
Kompose 支持將 V1、V2 和 V3 版本的 Docker Compose 文件轉換爲 Kubernetes 和 OpenShift 資源對象。

<!--
### Kubernetes `kompose convert` example
-->
### Kubernetes `kompose convert` 示例    {#kubernetes-kompose-convert-example}

```shell
kompose --file docker-voting.yml convert
```

```none
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
INFO Kubernetes file "worker-svc.yaml" created
INFO Kubernetes file "db-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "result-svc.yaml" created
INFO Kubernetes file "vote-svc.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
INFO Kubernetes file "result-deployment.yaml" created
INFO Kubernetes file "vote-deployment.yaml" created
INFO Kubernetes file "worker-deployment.yaml" created
INFO Kubernetes file "db-deployment.yaml" created
```

```shell
ls
```

```none
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-voting.yml          redis-svc.yaml     result-svc.yaml        vote-svc.yaml           worker-svc.yaml
```

<!--
You can also provide multiple docker-compose files at the same time:
-->
你也可以同時提供多個 docker-compose 文件進行轉換：

```shell
kompose -f docker-compose.yml -f docker-guestbook.yml convert
```

```none
INFO Kubernetes file "frontend-service.yaml" created         
INFO Kubernetes file "mlbparks-service.yaml" created         
INFO Kubernetes file "mongodb-service.yaml" created          
INFO Kubernetes file "redis-master-service.yaml" created     
INFO Kubernetes file "redis-slave-service.yaml" created      
INFO Kubernetes file "frontend-deployment.yaml" created      
INFO Kubernetes file "mlbparks-deployment.yaml" created      
INFO Kubernetes file "mongodb-deployment.yaml" created       
INFO Kubernetes file "mongodb-claim0-persistentvolumeclaim.yaml" created
INFO Kubernetes file "redis-master-deployment.yaml" created  
INFO Kubernetes file "redis-slave-deployment.yaml" created   
```

```shell
ls
```

```none
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml  
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

<!--
When multiple docker-compose files are provided the configuration is merged. Any configuration that is common will be overridden by subsequent file.
-->
當提供多個 docker-compose 文件時，設定將會合並。任何通用的設定都將被後續文件覆蓋。

<!--
### OpenShift `kompose convert` example
-->
### OpenShift `kompose convert` 示例    {#openshift-kompose-convert-example}

```sh
kompose --provider openshift --file docker-voting.yml convert
```

```none
WARN [worker] Service cannot be created because of missing port.
INFO OpenShift file "vote-service.yaml" created             
INFO OpenShift file "db-service.yaml" created               
INFO OpenShift file "redis-service.yaml" created            
INFO OpenShift file "result-service.yaml" created           
INFO OpenShift file "vote-deploymentconfig.yaml" created    
INFO OpenShift file "vote-imagestream.yaml" created         
INFO OpenShift file "worker-deploymentconfig.yaml" created  
INFO OpenShift file "worker-imagestream.yaml" created       
INFO OpenShift file "db-deploymentconfig.yaml" created      
INFO OpenShift file "db-imagestream.yaml" created           
INFO OpenShift file "redis-deploymentconfig.yaml" created   
INFO OpenShift file "redis-imagestream.yaml" created        
INFO OpenShift file "result-deploymentconfig.yaml" created  
INFO OpenShift file "result-imagestream.yaml" created  
```

<!--
It also supports creating buildconfig for build directive in a service. By default, it uses the remote repo for the current git branch as the source repo, and the current branch as the source branch for the build. You can specify a different source repo and branch using ``--build-repo`` and ``--build-branch`` options respectively.
-->
Kompose 還支持爲服務中的構建指令創建 buildconfig。
默認情況下，它使用當前 git 分支的 remote 倉庫作爲源倉庫，使用當前分支作爲構建的源分支。
你可以分別使用 ``--build-repo`` 和 ``--build-branch`` 選項指定不同的源倉庫和分支。

```sh
kompose --provider openshift --file buildconfig/docker-compose.yml convert
```

```none
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created     
INFO OpenShift file "foo-imagestream.yaml" created          
INFO OpenShift file "foo-buildconfig.yaml" created
```

{{< note >}}
<!--
If you are manually pushing the Openshift artifacts using ``oc create -f``, you need to ensure that you push the imagestream artifact before the buildconfig artifact, to workaround this OpenShift issue: https://github.com/openshift/origin/issues/4518 .
-->
如果使用 ``oc create -f`` 手動推送 OpenShift 工件，則需要確保在構建配置工件之前推送
imagestream 工件，以解決 OpenShift 的這個問題：
https://github.com/openshift/origin/issues/4518。
{{< /note >}}

<!--
## Alternative Conversions

The default `kompose` transformation will generate Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) and [Services](/docs/concepts/services-networking/service/), in yaml format. You have alternative option to generate json with `-j`. Also, you can alternatively generate [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/) objects, [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), or [Helm](https://github.com/helm/helm) charts.
-->
## 其他轉換方式    {#alternative-conversions}

默認的 `kompose` 轉換會生成 yaml 格式的 Kubernetes
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 和
[Service](/zh-cn/docs/concepts/services-networking/service/) 對象。
你可以選擇通過 `-j` 參數生成 json 格式的對象。
你也可以替換生成 [ReplicationController](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/) 對象、
[DaemonSet](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 或
[Helm](https://github.com/helm/helm) Chart。

```sh
kompose convert -j
```

```none
INFO Kubernetes file "redis-svc.json" created
INFO Kubernetes file "web-svc.json" created
INFO Kubernetes file "redis-deployment.json" created
INFO Kubernetes file "web-deployment.json" created
```

<!--
The `*-deployment.json` files contain the Deployment objects.
-->
`*-deployment.json` 文件中包含 Deployment 對象。

```sh
kompose convert --replication-controller
```

```none
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

<!--
The `*-replicationcontroller.yaml` files contain the Replication Controller objects. If you want to specify replicas (default is 1), use `--replicas` flag: `kompose convert --replication-controller --replicas 3`.
-->
`*-replicationcontroller.yaml` 文件包含 ReplicationController 對象。
如果你想指定副本數（默認爲 1），可以使用 `--replicas` 參數：
`kompose convert --replication-controller --replicas 3`

```shell
kompose convert --daemon-set
```

```none
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-daemonset.yaml" created
INFO Kubernetes file "web-daemonset.yaml" created
```

<!--
The `*-daemonset.yaml` files contain the DaemonSet objects.

If you want to generate a Chart to be used with [Helm](https://github.com/kubernetes/helm) run:
-->
`*-daemonset.yaml` 文件包含 DaemonSet 對象。

如果你想生成 [Helm](https://github.com/kubernetes/helm) 可用的 Chart，
只需簡單的執行下面的命令：

```shell
kompose convert -c
```

```none
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-deployment.yaml" created
INFO Kubernetes file "redis-deployment.yaml" created
chart created in "./docker-compose/"
```

```shell
tree docker-compose/
```

```none
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

<!--
The chart structure is aimed at providing a skeleton for building your Helm charts.
-->
這個 Chart 結構旨在爲構建 Helm Chart 時提供框架。

<!--
## Labels

`kompose` supports Kompose-specific labels within the `docker-compose.yml` file in order to explicitly define a service's behavior upon conversion.

- `kompose.service.type` defines the type of service to be created.

For example:
-->
## 標籤   {#labels}

`kompose` 支持 `docker-compose.yml` 文件中用於 Kompose 的標籤，
以便在轉換時明確定義 Service 的行爲。

- `kompose.service.type` 定義要創建的 Service 類型。例如：

  ```yaml
  version: "2"
  services:
    nginx:
      image: nginx
      dockerfile: foobar
      build: ./foobar
      cap_add:
        - ALL
      container_name: foobar
      labels:
        kompose.service.type: nodeport
  ```

<!--
- `kompose.service.expose` defines if the service needs to be made accessible from outside the cluster or not. If the value is set to "true", the provider sets the endpoint automatically, and for any other value, the value is set as the hostname. If multiple ports are defined in a service, the first one is chosen to be the exposed.
  - For the Kubernetes provider, an ingress resource is created and it is assumed that an ingress controller has already been configured.
  - For the OpenShift provider, a route is created.

For example:
-->
- `kompose.service.expose` 定義是否允許從集羣外部訪問 Service。
  如果該值被設置爲 "true"，提供程序將自動設置端點，
  對於任何其他值，該值將被設置爲主機名。
  如果在 Service 中定義了多個端口，則選擇第一個端口作爲公開端口。

  - 如果使用 Kubernetes 驅動，會有一個 Ingress 資源被創建，並且假定已經配置了相應的 Ingress 控制器。
  - 如果使用 OpenShift 驅動，則會有一個 Route 被創建。

  例如：

  ```yaml
  version: "2"
  services:
    web:
      image: tuna/docker-counter23
      ports:
       - "5000:5000"
      links:
       - redis
      labels:
        kompose.service.expose: "counter.example.com"
    redis:
      image: redis:3.0
      ports:
       - "6379"
  ```

<!--
The currently supported options are:

| Key                  | Value                               |
|----------------------|-------------------------------------|
| kompose.service.type | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |
-->
當前支持的選項有：

| 鍵                     | 值                                  |
|------------------------|-------------------------------------|
| kompose.service.type   | nodeport / clusterip / loadbalancer |
| kompose.service.expose | true / hostname                     |

{{< note >}}
<!--
The `kompose.service.type` label should be defined with `ports` only, otherwise `kompose` will fail.
-->
`kompose.service.type` 標籤應該只用 `ports` 來定義，否則 `kompose` 會失敗。
{{< /note >}}

<!--
## Restart

If you want to create normal pods without controllers you can use `restart` construct of docker-compose to define that. Follow table below to see what happens on the `restart` value.
-->
## 重啓   {#restart}

如果你想創建沒有控制器的普通 Pod，可以使用 docker-compose 的 `restart`
結構來指定這一行爲。請參考下表瞭解 `restart` 的不同參數。

<!--
| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |
-->
| `docker-compose` `restart` | 創建的對象        | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | 控制器對象        | `Always`            |
| `always`                   | 控制器對象        | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |

{{< note >}}
<!--
The controller object could be `deployment` or `replicationcontroller`.
-->
控制器對象可以是 `deployment` 或 `replicationcontroller`。
{{< /note >}}

<!--
For example, the `pival` service will become pod down here. This container calculated value of `pi`.
-->
例如，`pival` Service 將在這裏變成 Pod。這個容器計算 `pi` 的取值。

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

<!--
### Warning about Deployment Configurations

If the Docker Compose file has a volume specified for a service, the Deployment (Kubernetes) or DeploymentConfig (OpenShift) strategy is changed to "Recreate" instead of "RollingUpdate" (default). This is done to avoid multiple instances of a service from accessing a volume at the same time.
-->
### 關於 Deployment Config 的提醒    {#warning-about-deployment-configurations}

如果 Docker Compose 文件中爲服務聲明瞭卷，Deployment（Kubernetes）或
DeploymentConfig（OpenShift）策略會從 “RollingUpdate”（默認）變爲 “Recreate”。
這樣做的目的是爲了避免服務的多個實例同時訪問卷。

<!--
If the Docker Compose file has service name with `_` in it (for example, `web_service`), then it will be replaced by `-` and the service name will be renamed accordingly (for example, `web-service`). Kompose does this because "Kubernetes" doesn't allow `_` in object name.

Please note that changing service name might break some `docker-compose` files.
-->
如果 Docker Compose 文件中的服務名包含 `_`（例如 `web_service`），
那麼將會被替換爲 `-`，服務也相應的會重命名（例如 `web-service`）。
Kompose 這樣做的原因是 “Kubernetes” 不允許對象名稱中包含 `_`。

請注意，更改服務名稱可能會破壞一些 `docker-compose` 文件。

<!--
## Docker Compose Versions

Kompose supports Docker Compose versions: 1, 2 and 3. We have limited support on versions 2.1 and 3.2 due to their experimental nature.

A full list on compatibility between all three versions is listed in our [conversion document](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md) including a list of all incompatible Docker Compose keys.
-->
## Docker Compose 版本   {#docker-compose-versions}

Kompose 支持的 Docker Compose 版本包括：1、2 和 3。
對 2.1 和 3.2 版本的支持還有限，因爲它們還在實驗階段。

所有三個版本的兼容性列表，
請查看我們的[轉換文檔](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md)，
文檔中列出了所有不兼容的 Docker Compose 關鍵字。
