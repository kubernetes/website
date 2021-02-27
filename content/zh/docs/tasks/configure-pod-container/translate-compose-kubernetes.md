---
reviewers:
- cdrage
title: 将 Docker Compose 文件转换为 Kubernetes 资源
content_type: task
weight: 200
---

<!--
title: Translate a Docker Compose File to Kubernetes Resources
content_type: task
weight: 170
-->

<!-- overview -->

<!--
What's Kompose? It's a conversion tool for all things compose (namely Docker Compose) to container orchestrators (Kubernetes or OpenShift).
-->
Kompose 是什么？它是个转换工具，可将 compose（即 Docker Compose）所组装的所有内容
转换成容器编排器（Kubernetes 或 OpenShift）可识别的形式。

<!--
More information can be found on the Kompose website at [http://kompose.io](http://kompose.io).
-->
更多信息请参考 Kompose 官网 [http://kompose.io](http://kompose.io)。

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

<!--
## Install Kompose

We have multiple ways to install Kompose. Our preferred method is downloading the binary from the latest GitHub release.
-->
## 安装 Kompose

我们有很多种方式安装 Kompose。首选方式是从最新的 GitHub 发布页面下载二进制文件。

{{< tabs name="install_ways" >}}
{{% tab name="GitHub 下载" %}}

<!--
Kompose is released via GitHub on a three-week cycle, you can see all current releases on the [GitHub release page](https://github.com/kubernetes/kompose/releases).
-->
Kompose 通过 GitHub 发布，发布周期为三星期。
你可以在 [GitHub 发布页面](https://github.com/kubernetes/kompose/releases)
上看到所有当前版本。

```shell
# Linux
curl -L https://github.com/kubernetes/kompose/releases/download/v1.22.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes/kompose/releases/download/v1.22.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes/kompose/releases/download/v1.22.0/kompose-windows-amd64.exe -o kompose.exe

chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

<!--
Alternatively, you can download the [tarball](https://github.com/kubernetes/kompose/releases).
-->
或者，你可以下载 [tar 包](https://github.com/kubernetes/kompose/releases)。

{{% /tab %}}
{{% tab name="基于源代码构建" %}}

<!--
Installing using `go get` pulls from the master branch with the latest development changes.
-->
用 `go get` 命令从主分支拉取最新的开发变更的方法安装 Kompose。

```shell
go get -u github.com/kubernetes/kompose
```

{{% /tab %}}
{{% tab name="CentOS 包" %}}

<!--
Kompose is in [EPEL](https://fedoraproject.org/wiki/EPEL) CentOS repository.
If you don't have [EPEL](https://fedoraproject.org/wiki/EPEL) repository already installed and enabled you can do it by running  `sudo yum install epel-release`
-->
Kompose 位于 [EPEL](https://fedoraproject.org/wiki/EPEL) CentOS 代码仓库。
如果你还没有安装启用 [EPEL](https://fedoraproject.org/wiki/EPEL) 代码仓库，
请运行命令 `sudo yum install epel-release`。

<!--
If you have [EPEL](https://fedoraproject.org/wiki/EPEL) enabled in your system, you can install Kompose like any other package.
-->
如果你的系统中已经启用了 [EPEL](https://fedoraproject.org/wiki/EPEL)，
你就可以像安装其他软件包一样安装 Kompose。

```shell
sudo yum -y install kompose
```

{{% /tab %}}
{{% tab name="Fedora package" %}}

<!--
Kompose is in Fedora 24, 25 and 26 repositories. You can install it just like any other package.
-->
Kompose 位于 Fedora 24、25 和 26 的代码仓库。你可以像安装其他软件包一样安装 Kompose。

```shell
sudo dnf -y install kompose
```

{{% /tab %}}
{{% tab name="Homebrew (macOS)" %}}

<!--
On macOS you can install latest release via [Homebrew](https://brew.sh):
-->
在 macOS 上你可以通过 [Homebrew](https://brew.sh) 安装 Kompose 的最新版本：

```shell
brew install kompose
```

{{% /tab %}}
{{< /tabs >}}

<!--
## Use Kompose
-->
## 使用 Kompose

<!--
In just a few steps, we'll take you from Docker Compose to Kubernetes. All
you need is an existing `docker-compose.yml` file.
-->
再需几步，我们就把你从 Docker Compose 带到 Kubernetes。
你只需要一个现有的 `docker-compose.yml` 文件。

1. <!--Go to the directory containing your `docker-compose.yml` file. If you don't
   have one, test using this one.-->
   进入 `docker-compose.yml` 文件所在的目录。如果没有，请使用下面这个进行测试。

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
   `kubectl`, run `kompose convert` and then `kubectl create -f <output file>`.
-->
2. 要将 `docker-compose.yml` 转换为 `kubectl` 可用的文件，请运行 `kompose convert`
   命令进行转换，然后运行 `kubectl create -f <output file>` 进行创建。

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
   输出类似于：

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
   你部署的应用在 Kubernetes 中运行起来了。

<!--
3. Access your application.
-->
3. 访问你的应用

   <!--
   If you're already using `minikube` for your development process:
   -->

   如果你在开发过程中使用 `minikube`，请执行：

   ```shell
   minikube service frontend
   ```

   <!--
   Otherwise, let's look up what IP your service is using!
   -->
   否则，我们要查看一下你的服务使用了什么 IP！

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
   如果你使用的是云提供商，你的 IP 将在 `LoadBalancer Ingress` 字段给出。

   ```shell
   curl http://192.0.2.89
   ```

<!-- discussion -->

<!--
## User Guide
-->
## 用户指南  {#user-guide}

<!--
- CLI
  - [`kompose convert`](#kompose-convert)
  - [`kompose up`](#kompose-up)
  - [`kompose down`](#kompose-down)
- Documentation
  - [Build and Push Docker Images](#build-and-push-docker-images)
  - [Alternative Conversions](#alternative-conversions)
  - [Labels](#labels)
  - [Restart](#restart)
  - [Docker Compose Versions](#docker-compose-versions)
-->
- CLI
  - [`kompose convert`](#kompose-convert)
  - [`kompose up`](#kompose-up)
  - [`kompose down`](#kompose-down)

- 文档
  - [构建和推送 Docker 镜像](#build-and-push-docker-images)
  - [其他转换方式](#其他转换方式)
  - [标签](#labels)
  - [重启](#restart)
  - [Docker Compose 版本](#docker-compose-versions)

<!--
Kompose has support for two providers: OpenShift and Kubernetes.
You can choose a targeted provider using global option `--provider`. If no provider is specified, Kubernetes is set by default.
-->
Kompose 支持两种驱动：OpenShift 和 Kubernetes。
你可以通过全局选项 `--provider` 选择驱动。如果没有指定，
会将 Kubernetes 作为默认驱动。

## `kompose convert`

<!--
Kompose supports conversion of V1, V2, and V3 Docker Compose files into Kubernetes and OpenShift objects.
-->
Kompose 支持将 V1、V2 和 V3 版本的 Docker Compose 文件转换为 Kubernetes 和 OpenShift 资源对象。

<!--
### Kubernetes `kompose convert` example
-->
### Kubernetes `kompose convert` 示例

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
你也可以同时提供多个 docker-compose 文件进行转换：

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
当提供多个 docker-compose 文件时，配置将会合并。任何通用的配置都将被后续文件覆盖。

<!--
### OpenShift `kompose convert` example
-->
### OpenShift `kompose convert` 示例

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
kompose 还支持为服务中的构建指令创建 buildconfig。
默认情况下，它使用当前 git 分支的 remote 仓库作为源仓库，使用当前分支作为构建的源分支。
你可以分别使用 ``--build-repo`` 和 ``--build-branch`` 选项指定不同的源仓库和分支。

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
如果使用 ``oc create -f`` 手动推送 Openshift 工件，则需要确保在构建配置工件之前推送
imagestream 工件，以解决 Openshift 的这个问题：https://github.com/openshift/origin/issues/4518 。
{{< /note >}}

## `kompose up`

<!--
Kompose supports a straightforward way to deploy your "composed" application to Kubernetes or OpenShift via `kompose up`.
-->
Kompose 支持通过 `kompose up` 直接将你的"复合的（composed）" 应用程序
部署到 Kubernetes 或 OpenShift。

<!--
### Kubernetes `kompose up` example
-->
### Kubernetes `kompose up` 示例

```shell
kompose --file ./examples/docker-guestbook.yml up
```

```none
We are going to create Kubernetes deployments and services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'kubectl create -f' commands instead.

INFO Successfully created service: redis-master   
INFO Successfully created service: redis-slave    
INFO Successfully created service: frontend       
INFO Successfully created deployment: redis-master
INFO Successfully created deployment: redis-slave
INFO Successfully created deployment: frontend    

Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods' for details.
```

```shell
kubectl get deployment,svc,pods
```

```
NAME                                              DESIRED       CURRENT       UP-TO-DATE   AVAILABLE   AGE
deployment.extensions/frontend                    1             1             1            1           4m
deployment.extensions/redis-master                1             1             1            1           4m
deployment.extensions/redis-slave                 1             1             1            1           4m

NAME                         TYPE               CLUSTER-IP    EXTERNAL-IP   PORT(S)      AGE
service/frontend             ClusterIP          10.0.174.12   <none>        80/TCP       4m
service/kubernetes           ClusterIP          10.0.0.1      <none>        443/TCP      13d
service/redis-master         ClusterIP          10.0.202.43   <none>        6379/TCP     4m
service/redis-slave          ClusterIP          10.0.1.85     <none>        6379/TCP     4m

NAME                                READY         STATUS        RESTARTS     AGE
pod/frontend-2768218532-cs5t5       1/1           Running       0            4m
pod/redis-master-1432129712-63jn8   1/1           Running       0            4m
pod/redis-slave-2504961300-nve7b    1/1           Running       0            4m
```


{{< note >}}
<!--
- You must have a running Kubernetes cluster with a pre-configured kubectl context.
- Only deployments and services are generated and deployed to Kubernetes. If you need different kind of resources, use the `kompose convert` and `kubectl create -f` commands instead.
-->
- 你必须有一个运行正常的 Kubernetes 集群，该集群具有预先配置的 kubectl 上下文。
- 此操作仅生成 Deployment 和 Service 对象并将其部署到 Kubernetes。
  如果需要部署其他不同类型的资源，请使用 `kompose convert` 和 `kubectl create -f` 命令。
{{< /note >}}

<!--
### OpenShift `kompose up` example
-->
### OpenShift `kompose up` 示例

```shell
kompose --file ./examples/docker-guestbook.yml --provider openshift up
```

```none
We are going to create OpenShift DeploymentConfigs and Services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'oc create -f' commands instead.

INFO Successfully created service: redis-slave    
INFO Successfully created service: frontend       
INFO Successfully created service: redis-master   
INFO Successfully created deployment: redis-slave
INFO Successfully created ImageStream: redis-slave
INFO Successfully created deployment: frontend    
INFO Successfully created ImageStream: frontend   
INFO Successfully created deployment: redis-master
INFO Successfully created ImageStream: redis-master

Your application has been deployed to OpenShift. You can run 'oc get dc,svc,is' for details.
```

```shell
oc get dc,svc,is
```

```none
NAME               REVISION                              DESIRED       CURRENT    TRIGGERED BY
dc/frontend        0                                     1             0          config,image(frontend:v4)
dc/redis-master    0                                     1             0          config,image(redis-master:e2e)
dc/redis-slave     0                                     1             0          config,image(redis-slave:v1)
NAME               CLUSTER-IP                            EXTERNAL-IP   PORT(S)    AGE
svc/frontend       172.30.46.64                          <none>        80/TCP     8s
svc/redis-master   172.30.144.56                         <none>        6379/TCP   8s
svc/redis-slave    172.30.75.245                         <none>        6379/TCP   8s
NAME               DOCKER REPO                           TAGS          UPDATED
is/frontend        172.30.12.200:5000/fff/frontend                     
is/redis-master    172.30.12.200:5000/fff/redis-master                 
is/redis-slave     172.30.12.200:5000/fff/redis-slave    v1  
```

{{< note >}}
<!--
You must have a running OpenShift cluster with a pre-configured `oc` context (`oc login`)
-->
你必须有一个运行正常的 OpenShift 集群，该集群具有预先配置的 `oc` 上下文 (`oc login`)。
{{< /note >}}

## `kompose down`

<!--
Once you have deployed "composed" application to Kubernetes, `$ kompose down` will help you to take the application out by deleting its deployments and services. If you need to remove other resources, use the 'kubectl' command.
-->
你一旦将"复合(composed)" 应用部署到 Kubernetes，`kompose down` 
命令将能帮你通过删除 Deployment 和 Service 对象来删除应用。
如果需要删除其他资源，请使用 'kubectl' 命令。

```shell
kompose --file docker-guestbook.yml down
```

```
INFO Successfully deleted service: redis-master   
INFO Successfully deleted deployment: redis-master
INFO Successfully deleted service: redis-slave    
INFO Successfully deleted deployment: redis-slave
INFO Successfully deleted service: frontend       
INFO Successfully deleted deployment: frontend
```

{{< note >}}
<!--
You must have a running Kubernetes cluster with a pre-configured kubectl context.
-->
- 你必须有一个运行正常的 Kubernetes 集群，该集群具有预先配置的 kubectl 上下文。
{{< /note >}}

<!--
## Build and Push Docker Images

Kompose supports both building and pushing Docker images. When using the `build` key within your Docker Compose file, your image will:

  - Automatically be built with Docker using the `image` key specified within your file
  - Be pushed to the correct Docker repository using local credentials (located at `.docker/config`)

Using an [example Docker Compose file](https://raw.githubusercontent.com/kubernetes/kompose/master/examples/buildconfig/docker-compose.yml):
-->
## 构建和推送 Docker 镜像   {#build-and-push-docker-images}

Kompose 支持构建和推送 Docker 镜像。如果 Docker Compose 文件中使用了 `build`
关键字，你的镜像将会：

- 使用文档中指定的 `image` 键自动构建 Docker 镜像
- 使用本地凭据推送到正确的 Docker 仓库

使用 [Docker Compose 文件示例](https://raw.githubusercontent.com/kubernetes/kompose/master/examples/buildconfig/docker-compose.yml)

```yaml
version: "2"

services:
    foo:
        build: "./build"
        image: docker.io/foo/bar
```

<!--
Using `kompose up` with a `build` key:
-->
使用带有 `build` 键的 `kompose up` 命令：

```shell
kompose up
```

```none
INFO Build key detected. Attempting to build and push image 'docker.io/foo/bar'
INFO Building image 'docker.io/foo/bar' from directory 'build'
INFO Image 'docker.io/foo/bar' from directory 'build' built successfully
INFO Pushing image 'foo/bar:latest' to registry 'docker.io'
INFO Attempting authentication credentials 'https://index.docker.io/v1/
INFO Successfully pushed image 'foo/bar:latest' to registry 'docker.io'
INFO We are going to create Kubernetes Deployments, Services and PersistentVolumeClaims for your Dockerized application. If you need different kind of resources, use the 'kompose convert' and 'kubectl create -f' commands instead.

INFO Deploying application in "default" namespace
INFO Successfully created Service: foo            
INFO Successfully created Deployment: foo         

Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods,pvc' for details.
```

<!--
In order to disable the functionality, or choose to use BuildConfig generation (with OpenShift) `--build (local|build-config|none)` can be passed.
-->
要想禁用该功能，或者使用 BuildConfig 中的版本（在 OpenShift 中），
可以通过传递 `--build (local|build-config|none)` 参数来实现。

```shell
# 禁止构造和推送 Docker 镜像
kompose up --build none

# 为 OpenShift 生成 Build Config 工件
kompose up --provider openshift --build build-config
```

<!--
## Alternative Conversions

The default `kompose` transformation will generate Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) and [Services](/docs/concepts/services-networking/service/), in yaml format. You have alternative option to generate json with `-j`. Also, you can alternatively generate [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/) objects, [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), or [Helm](https://github.com/helm/helm) charts.
-->
## 其他转换方式    {#alternative-conversions}

默认的 `kompose` 转换会生成 yaml 格式的 Kubernetes
[Deployment](/zh/docs/concepts/workloads/controllers/deployment/) 和
[Service](/zh/docs/concepts/services-networking/service/) 对象。
你可以选择通过 `-j` 参数生成 json 格式的对象。
你也可以替换生成 [Replication Controllers](/zh/docs/concepts/workloads/controllers/replicationcontroller/) 对象、
[Daemon Sets](/zh/docs/concepts/workloads/controllers/daemonset/) 或
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
`*-deployment.json` 文件中包含 Deployment 对象。

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
`*-replicationcontroller.yaml` 文件包含 Replication Controller 对象。
如果你想指定副本数（默认为 1），可以使用 `--replicas` 参数：
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
`*-daemonset.yaml` 文件包含 DaemonSet 对象。

如果你想生成 [Helm](https://github.com/kubernetes/helm) 可用的 Chart，
只需简单的执行下面的命令：

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
这个 Chart 结构旨在为构建 Helm Chart 提供框架。

<!--
## Labels

`kompose` supports Kompose-specific labels within the `docker-compose.yml` file in order to explicitly define a service's behavior upon conversion.
- `kompose.service.type` defines the type of service to be created.

For example:
-->
## 标签   {#labels}

`kompose` 支持 `docker-compose.yml` 文件中用于 Kompose 的标签，以便
在转换时明确定义 Service 的行为。

- `kompose.service.type` 定义要创建的 Service 类型。例如：

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
- `kompose.service.expose` 定义是否允许从集群外部访问 Service。
  如果该值被设置为 "true"，提供程序将自动设置端点，
  对于任何其他值，该值将被设置为主机名。
  如果在 Service 中定义了多个端口，则选择第一个端口作为公开端口。

  - 如果使用 Kubernetes 驱动，会有一个 Ingress 资源被创建，并且假定
    已经配置了相应的 Ingress 控制器。
  - 如果使用 OpenShift 驱动, 则会有一个 route 被创建。

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
当前支持的选项有:

| 键                     | 值                                  |
|------------------------|-------------------------------------|
| kompose.service.type   | nodeport / clusterip / loadbalancer |
| kompose.service.expose | true / hostname                     |

{{< note >}}
<!--
The `kompose.service.type` label should be defined with `ports` only, otherwise `kompose` will fail.
-->
`kompose.service.type` 标签应该只用 `ports` 来定义，否则 `kompose` 会失败。
{{< /note >}}

<!--
## Restart

If you want to create normal pods without controllers you can use `restart` construct of docker-compose to define that. Follow table below to see what happens on the `restart` value.
-->
## 重启   {#restart}

如果你想创建没有控制器的普通 Pod，可以使用 docker-compose 的 `restart`
结构来指定这一行为。请参考下表了解 `restart` 的不同参数。

<!--
| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |
-->

| `docker-compose` `restart` | 创建的对象        | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | 控制器对象        | `Always`            |
| `always`                   | 控制器对象        | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |


<!--
The controller object could be `deployment` or `replicationcontroller`, etc.
-->
{{< note >}}
控制器对象可以是 `deployment` 或 `replicationcontroller` 等。
{{< /note >}}

<!--
For example, the `pival` service will become pod down here. This container calculated value of `pi`.
-->
例如，`pival` Service 将在这里变成 Pod。这个容器计算 `pi` 的取值。

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
### 关于 Deployment Config 的提醒

如果 Docker Compose 文件中为服务声明了卷，Deployment (Kubernetes) 或
DeploymentConfig (OpenShift) 策略会从 "RollingUpdate" (默认) 变为 "Recreate"。
这样做的目的是为了避免服务的多个实例同时访问卷。

<!--
If the Docker Compose file has service name with `_` in it (eg.`web_service`), then it will be replaced by `-` and the service name will be renamed accordingly (eg.`web-service`). Kompose does this because "Kubernetes" doesn't allow `_` in object name.
Please note that changing service name might break some `docker-compose` files.
-->
如果 Docker Compose 文件中的服务名包含 `_`（例如 `web_service`），
那么将会被替换为 `-`，服务也相应的会重命名（例如 `web-service`）。
Kompose 这样做的原因是 "Kubernetes" 不允许对象名称中包含 `_`。 

请注意，更改服务名称可能会破坏一些 `docker-compose` 文件。

<!--
## Docker Compose Versions

Kompose supports Docker Compose versions: 1, 2 and 3. We have limited support on versions 2.1 and 3.2 due to their experimental nature.

A full list on compatibility between all three versions is listed in our [conversion document](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md) including a list of all incompatible Docker Compose keys.
-->
## Docker Compose 版本   {#docker-compose-versions}

Kompose 支持的 Docker Compose 版本包括：1、2 和 3。
对 2.1 和 3.2 版本的支持还有限，因为它们还在实验阶段。

所有三个版本的兼容性列表请查看我们的
[转换文档](https://github.com/kubernetes/kompose/blob/master/docs/conversion.md)，
文档中列出了所有不兼容的 Docker Compose 关键字。

