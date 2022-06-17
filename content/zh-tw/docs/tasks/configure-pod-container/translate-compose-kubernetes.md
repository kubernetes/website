---
title: 將 Docker Compose 檔案轉換為 Kubernetes 資源
content_type: task
weight: 200
---
<!--
reviewers:
- cdrage
title: Translate a Docker Compose File to Kubernetes Resources
content_type: task
weight: 200
-->

<!-- overview -->

<!--
What's Kompose? It's a conversion tool for all things compose (namely Docker Compose) to container orchestrators (Kubernetes or OpenShift).
-->
Kompose 是什麼？它是個轉換工具，可將 compose（即 Docker Compose）所組裝的所有內容
轉換成容器編排器（Kubernetes 或 OpenShift）可識別的形式。

<!--
More information can be found on the Kompose website at [http://kompose.io](http://kompose.io).
-->
更多資訊請參考 Kompose 官網 [http://kompose.io](http://kompose.io)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Install Kompose

We have multiple ways to install Kompose. Our preferred method is downloading the binary from the latest GitHub release.
-->
## 安裝 Kompose    {#install-kompose}

我們有很多種方式安裝 Kompose。首選方式是從最新的 GitHub 釋出頁面下載二進位制檔案。

{{< tabs name="install_ways" >}}
{{% tab name="GitHub 下載" %}}

<!--
Kompose is released via GitHub on a three-week cycle, you can see all current releases on the [GitHub release page](https://github.com/kubernetes/kompose/releases).
-->
Kompose 透過 GitHub 釋出，釋出週期為三星期。
你可以在 [GitHub 釋出頁面](https://github.com/kubernetes/kompose/releases)
上看到所有當前版本。

```shell
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.24.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.24.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.24.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

<!--
Alternatively, you can download the [tarball](https://github.com/kubernetes/kompose/releases).
-->
或者，你可以下載 [tar 包](https://github.com/kubernetes/kompose/releases)。

{{% /tab %}}
{{% tab name="基於原始碼構建" %}}

<!--
Installing using `go get` pulls from the master branch with the latest development changes.
-->
用 `go get` 命令從主分支拉取最新的開發變更的方法安裝 Kompose。

```shell
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="CentOS 包" %}}

<!--
Kompose is in [EPEL](https://fedoraproject.org/wiki/EPEL) CentOS repository.
If you don't have [EPEL](https://fedoraproject.org/wiki/EPEL) repository already installed and enabled you can do it by running  `sudo yum install epel-release`
-->
Kompose 位於 [EPEL](https://fedoraproject.org/wiki/EPEL) CentOS 程式碼倉庫。
如果你還沒有安裝啟用 [EPEL](https://fedoraproject.org/wiki/EPEL) 程式碼倉庫，
請執行命令 `sudo yum install epel-release`。

<!--
If you have [EPEL](https://fedoraproject.org/wiki/EPEL) enabled in your system, you can install Kompose like any other package.
-->
如果你的系統中已經啟用了 [EPEL](https://fedoraproject.org/wiki/EPEL)，
你就可以像安裝其他軟體包一樣安裝 Kompose。

```shell
sudo yum -y install kompose
```

{{% /tab %}}
{{% tab name="Fedora package" %}}

<!--
Kompose is in Fedora 24, 25 and 26 repositories. You can install it like any other package.
-->
Kompose 位於 Fedora 24、25 和 26 的程式碼倉庫。你可以像安裝其他軟體包一樣安裝 Kompose。

```shell
sudo dnf -y install kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

<!--
On macOS you can install latest release via [Homebrew](https://brew.sh):
-->
在 macOS 上你可以透過 [Homebrew](https://brew.sh) 安裝 Kompose 的最新版本：

```shell
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
再需幾步，我們就把你從 Docker Compose 帶到 Kubernetes。
你只需要一個現有的 `docker-compose.yml` 檔案。

<!--
1. Go to the directory containing your `docker-compose.yml` file. If you don't have one, test using this one.
-->
1. 進入 `docker-compose.yml` 檔案所在的目錄。如果沒有，請使用下面這個進行測試。

   ```yaml
   version: "2"

   services:

     redis-master:
       image: k8s.gcr.io/redis:e2e
       ports:
         - "6379"

     redis-slave:
       image: gcr.io/google_samples/gb-redisslave:v3
       ports:
         - "6379"
       environment:
         - GET_HOSTS_FROM=dns

     frontend:
       image: gcr.io/google-samples/gb-frontend:v4
       ports:
         - "80:80"
       environment:
         - GET_HOSTS_FROM=dns
       labels:
         kompose.service.type: LoadBalancer
   ```

<!--
2. To convert the `docker-compose.yml` file to files that you can use with
   `kubectl`, run `kompose convert` and then `kubectl apply -f <output file>`.
-->
2. 要將 `docker-compose.yml` 轉換為 `kubectl` 可用的檔案，請執行 `kompose convert`
   命令進行轉換，然後執行 `kubectl apply -f <output file>` 進行建立。

   ```shell
   kompose convert                           
   ```

   ```none
   INFO Kubernetes file "frontend-service.yaml" created
      INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "frontend-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
      INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-master-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
      INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "redis-slave-service.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
      INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "frontend-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
      INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-master-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
      INFO Kubernetes file "redis-slave-deployment.yaml" created
   INFO Kubernetes file "redis-slave-deployment.yaml" created
   ```

   ```bash
   kubectl apply -f frontend-service.yaml,redis-master-service.yaml,redis-slave-service.yaml,frontend-deployment.yaml,
   ```

   <!--
   The output is similar to:
   -->
   輸出類似於：

   ```none
   service/frontend created
   service/redis-master created
   service/redis-slave created
   deployment.apps/frontend created
   deployment.apps/redis-master created
   deployment.apps/redis-slave created
   ```

   <!--
   Your deployments are running in Kubernetes.
   -->
   你部署的應用在 Kubernetes 中執行起來了。

<!--
3. Access your application.
-->
3. 訪問你的應用

   <!--
   If you're already using `minikube` for your development process:
   -->

   如果你在開發過程中使用 `minikube`，請執行：

   ```shell
   minikube service frontend
   ```

   <!--
   Otherwise, let's look up what IP your service is using!
   -->
   否則，我們要檢視一下你的服務使用了什麼 IP！

   ```shell
   kubectl describe svc frontend
   ```

   ```none
   Name:                   frontend
   Namespace:              default
   Labels:                 service=frontend
   Selector:               service=frontend
   Type:                   LoadBalancer
   IP:                     10.0.0.183
   LoadBalancer Ingress:   192.0.2.89
   Port:                   80      80/TCP
   NodePort:               80      31144/TCP
   Endpoints:              172.17.0.4:80
   Session Affinity:       None
   No events.
   ```

   <!--
   If you're using a cloud provider, your IP will be listed next to `LoadBalancer Ingress`.
   -->
   如果你使用的是雲提供商，你的 IP 將在 `LoadBalancer Ingress` 欄位給出。

   ```shell
   curl http://192.0.2.89
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

- 文件
  - [其他轉換方式](#其他轉換方式)
  - [標籤](#labels)
  - [重啟](#restart)
  - [Docker Compose 版本](#docker-compose-versions)

<!--
Kompose has support for two providers: OpenShift and Kubernetes.
You can choose a targeted provider using global option `--provider`. If no provider is specified, Kubernetes is set by default.
-->
Kompose 支援兩種驅動：OpenShift 和 Kubernetes。
你可以透過全域性選項 `--provider` 選擇驅動。如果沒有指定，
會將 Kubernetes 作為預設驅動。

## `kompose convert`

<!--
Kompose supports conversion of V1, V2, and V3 Docker Compose files into Kubernetes and OpenShift objects.
-->
Kompose 支援將 V1、V2 和 V3 版本的 Docker Compose 檔案轉換為 Kubernetes 和 OpenShift 資源物件。

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
你也可以同時提供多個 docker-compose 檔案進行轉換：

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

```
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml  
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

<!--
When multiple docker-compose files are provided the configuration is merged. Any configuration that is common will be over ridden by subsequent file.
-->
當提供多個 docker-compose 檔案時，配置將會合並。任何通用的配置都將被後續檔案覆蓋。

<!--
### OpenShift `kompose convert` example
-->
### OpenShift `kompose convert` 示例    {#openshift-kompose-convert-example}

```shell
kompose --provider openshift --file docker-voting.yml convert
```

```
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
kompose 還支援為服務中的構建指令建立 buildconfig。
預設情況下，它使用當前 git 分支的 remote 倉庫作為源倉庫，使用當前分支作為構建的源分支。
你可以分別使用 ``--build-repo`` 和 ``--build-branch`` 選項指定不同的源倉庫和分支。

```shell
kompose --provider openshift --file buildconfig/docker-compose.yml convert
```

```none
WARN [foo] Service cannot be created because of missing port.
INFO OpenShift Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO OpenShift file "foo-deploymentconfig.yaml" created     
INFO OpenShift file "foo-imagestream.yaml" created          
INFO OpenShift file "foo-buildconfig.yaml" created
```

<!--
If you are manually pushing the Openshift artifacts using ``oc create -f``, you need to ensure that you push the imagestream artifact before the buildconfig artifact, to workaround this Openshift issue: https://github.com/openshift/origin/issues/4518 .
-->
{{< note >}}
如果使用 ``oc create -f`` 手動推送 Openshift 工件，則需要確保在構建配置工件之前推送
imagestream 工件，以解決 Openshift 的這個問題： https://github.com/openshift/origin/issues/4518 。
{{< /note >}}

<!--
## Alternative Conversions

The default `kompose` transformation will generate Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) and [Services](/docs/concepts/services-networking/service/), in yaml format. You have alternative option to generate json with `-j`. Also, you can alternatively generate [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/) objects, [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), or [Helm](https://github.com/helm/helm) charts.
-->
## 其他轉換方式    {#alternative-conversions}

預設的 `kompose` 轉換會生成 yaml 格式的 Kubernetes
[Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/) 和
[Service](/zh-cn/docs/concepts/services-networking/service/) 物件。
你可以選擇透過 `-j` 引數生成 json 格式的物件。
你也可以替換生成 [Replication Controllers](/zh-cn/docs/concepts/workloads/controllers/replicationcontroller/) 物件、
[Daemon Sets](/zh-cn/docs/concepts/workloads/controllers/daemonset/) 或
[Helm](https://github.com/helm/helm) charts。

```shell
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
`*-deployment.json` 檔案中包含 Deployment 物件。

```shell
kompose convert --replication-controller
```

```none
INFO Kubernetes file "redis-svc.yaml" created
INFO Kubernetes file "web-svc.yaml" created
INFO Kubernetes file "redis-replicationcontroller.yaml" created
INFO Kubernetes file "web-replicationcontroller.yaml" created
```

<!--
The `*-replicationcontroller.yaml` files contain the Replication Controller objects. If you want to specify replicas (default is 1), use `--replicas` flag: `$ kompose convert --replication-controller --replicas 3`
-->
`*-replicationcontroller.yaml` 檔案包含 Replication Controller 物件。
如果你想指定副本數（預設為 1），可以使用 `--replicas` 引數：
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
The `*-daemonset.yaml` files contain the DaemonSet objects
If you want to generate a Chart to be used with [Helm](https://github.com/kubernetes/helm) simply do:
-->
`*-daemonset.yaml` 檔案包含 DaemonSet 物件。

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

```
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
這個 Chart 結構旨在為構建 Helm Chart 提供框架。

<!--
## Labels

`kompose` supports Kompose-specific labels within the `docker-compose.yml` file in order to explicitly define a service's behavior upon conversion.
- `kompose.service.type` defines the type of service to be created.

For example:
-->
## 標籤   {#labels}

`kompose` 支援 `docker-compose.yml` 檔案中用於 Kompose 的標籤，以便
在轉換時明確定義 Service 的行為。

- `kompose.service.type` 定義要建立的 Service 型別。例如：

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
- `kompose.service.expose` 定義是否允許從叢集外部訪問 Service。
  如果該值被設定為 "true"，提供程式將自動設定端點，
  對於任何其他值，該值將被設定為主機名。
  如果在 Service 中定義了多個埠，則選擇第一個埠作為公開埠。

  - 如果使用 Kubernetes 驅動，會有一個 Ingress 資源被建立，並且假定
    已經配置了相應的 Ingress 控制器。
  - 如果使用 OpenShift 驅動，則會有一個 route 被建立。

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
當前支援的選項有:

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
## 重啟   {#restart}

如果你想建立沒有控制器的普通 Pod，可以使用 docker-compose 的 `restart`
結構來指定這一行為。請參考下表瞭解 `restart` 的不同引數。

<!--
| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |
-->

| `docker-compose` `restart` | 建立的物件        | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | 控制器物件        | `Always`            |
| `always`                   | 控制器物件        | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |


<!--
The controller object could be `deployment` or `replicationcontroller`, etc.
-->
{{< note >}}
控制器物件可以是 `deployment` 或 `replicationcontroller` 等。
{{< /note >}}

<!--
For example, the `pival` service will become pod down here. This container calculated value of `pi`.
-->
例如，`pival` Service 將在這裡變成 Pod。這個容器計算 `pi` 的取值。

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

如果 Docker Compose 檔案中為服務聲明瞭卷，Deployment（Kubernetes）或
DeploymentConfig（OpenShift）策略會從 “RollingUpdate”（預設）變為 “Recreate”。
這樣做的目的是為了避免服務的多個例項同時訪問卷。

<!--
If the Docker Compose file has service name with `_` in it (eg.`web_service`), then it will be replaced by `-` and the service name will be renamed accordingly (eg.`web-service`). Kompose does this because "Kubernetes" doesn't allow `_` in object name.
Please note that changing service name might break some `docker-compose` files.
-->
如果 Docker Compose 檔案中的服務名包含 `_`（例如 `web_service`），
那麼將會被替換為 `-`，服務也相應的會重新命名（例如 `web-service`）。
Kompose 這樣做的原因是 “Kubernetes” 不允許物件名稱中包含 `_`。

請注意，更改服務名稱可能會破壞一些 `docker-compose` 檔案。

<!--
## Docker Compose Versions

Kompose supports Docker Compose versions: 1, 2 and 3. We have limited support on versions 2.1 and 3.2 due to their experimental nature.

A full list on compatibility between all three versions is listed in our [conversion document](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md) including a list of all incompatible Docker Compose keys.
-->
## Docker Compose 版本   {#docker-compose-versions}

Kompose 支援的 Docker Compose 版本包括：1、2 和 3。
對 2.1 和 3.2 版本的支援還有限，因為它們還在實驗階段。

所有三個版本的相容性列表請檢視我們的
[轉換文件](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md)，
文件中列出了所有不相容的 Docker Compose 關鍵字。
