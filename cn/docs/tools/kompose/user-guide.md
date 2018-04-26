---

approvers:
- cdrage

title: Translate a Docker Compose File to Kubernetes Resources
---

* TOC
{:toc}

<!--`kompose` is a tool to help users who are familiar with `docker-compose` move to **Kubernetes**. `kompose` takes a Docker Compose file and translates it into Kubernetes resources.
-->
`kompose` 是一个将`docker-compose`迁移到**kubernetes**的工具，`kompose`会把Docker Compose文件翻译成Kubernetes资源文件。

<!--More information about Kompose can be found on the official [http://kompose.io](http://kompose.io/) site. -->
更多关于Kompose信息，请访问官方网站[http://kompose.io](http://kompose.io/)。 

<!--`kompose` is a convenience tool to go from local Docker development to managing your application with Kubernetes. Transformation of the Docker Compose format to Kubernetes resources manifest may not be exact, but it helps tremendously when first deploying an application on Kubernetes. -->
`kompose` 是从本地Docker管理到使用Kubernetes管理您的应用程序的便利工具。 Docker的转换撰写格式到Kubernetes资源清单可能不是精确的，但会起到参考作用，尤其是初次在Kubernetes上部署应用程序。
## 用例说明

<!--If you have a Docker Compose `docker-compose.yml` or a Docker Distributed Application Bundle `docker-compose-bundle.dab` file, you can convert it into Kubernetes deployments and services like this:
-->
如果您有一个Docker Compose的`docker-compose.yml`文件或者一个Docker分布式应用捆绑包的`docker-compose-bundle.dab`文件，可以通过kompose命令将它们生成为Kubernetes的deployment、service的资源文件，如下所示：
```console
$ kompose -f docker-compose.yml convert
WARN: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created
```

## 安装说明

<!--We have multiple ways to install Kompose. Our preferred method is downloading the binary from the latest GitHub release.
-->
安装Kompose有多种方法，我们推荐的方法是从GitHub下载最新的二进制文件。
### GitHub版本

<!--Kompose is released via GitHub on a three-week cycle, you can see all current releases on the [GitHub release page](https://github.com/kubernetes-incubator/kompose/releases).-->
在GitHub上面，Kompose代码每三周更新出一个版本，您可以在[GitHub release page](https://github.com/kubernetes-incubator/kompose/releases)看到最新的版本。

<!--The current release we use is `0.5.0`. -->
当前我们用的版本是`0.5.0`。
```sh
# Linux
curl -L https://github.com/kubernetes-incubator/kompose/releases/download/v0.5.0/kompose-linux-amd64 -o kompose

# macOS
curl -L https://github.com/kubernetes-incubator/kompose/releases/download/v0.5.0/kompose-darwin-amd64 -o kompose

# Windows
curl -L https://github.com/kubernetes-incubator/kompose/releases/download/v0.5.0/kompose-windows-amd64.exe -o kompose.exe
```

<!--Make the binary executable and move it to your PATH (e.g. `/usr/local/bin`) -->
增加可执行权限并将它移动到您指定的路径(如 `/usr/local/bin`)。
```sh
chmod +x kompose
sudo mv ./kompose /usr/local/bin/kompose
```

## Kompose转换

<!--Currently Kompose supports to transform either Docker Compose file (both of v1 and v2) and [experimental Distributed Application Bundles](https://blog.docker.com/2016/06/docker-app-bundle/) into Kubernetes and OpenShift objects.
There is a couple of sample files in the `examples/` directory for testing.
You will convert the compose or dab file to Kubernetes or OpenShift objects with `kompose convert`. -->
目前，Kompose支持将Docker Compose文件（v1，v2版本）和[分布式应用捆绑包](https://blog.docker.com/2016/06/docker-app-bundle/)转换成Kubernetes对象和OpenShift对象。
以下是一个在`examples/`路径下的测试例子，这个例子讲会通过`kompose convert`把compose和dab文件转换成相应的Kubernetes和OpenShift对象。


### Kubernetes
```console
$ cd examples/

$ ls
docker-compose.yml  docker-compose-bundle.dab  docker-gitlab.yml  docker-voting.yml

$ kompose -f docker-gitlab.yml convert
file "redisio-svc.yaml" created
file "gitlab-svc.yaml" created
file "postgresql-svc.yaml" created
file "gitlab-deployment.yaml" created
file "postgresql-deployment.yaml" created
file "redisio-deployment.yaml" created

$ ls *.yaml
gitlab-deployment.yaml  postgresql-deployment.yaml  redis-deployment.yaml    redisio-svc.yaml  web-deployment.yaml
gitlab-svc.yaml         postgresql-svc.yaml         redisio-deployment.yaml  redis-svc.yaml    web-svc.yaml
```

<!--You can try with a Docker Compose version 2 like this:-->
您可以尝试转换一个v2版本Docker Compose,如下：

```console
$ kompose --file docker-voting.yml convert
WARN Unsupported key networks - ignoring
WARN Unsupported key build - ignoring
file "worker-svc.yaml" created
file "db-svc.yaml" created
file "redis-svc.yaml" created
file "result-svc.yaml" created
file "vote-svc.yaml" created
file "redis-deployment.yaml" created
file "result-deployment.yaml" created
file "vote-deployment.yaml" created
file "worker-deployment.yaml" created
file "db-deployment.yaml" created

$ ls
db-deployment.yaml  docker-compose.yml         docker-gitlab.yml  redis-deployment.yaml  result-deployment.yaml  vote-deployment.yaml  worker-deployment.yaml
db-svc.yaml         docker-compose-bundle.dab  docker-voting.yml  redis-svc.yaml         result-svc.yaml         vote-svc.yaml         worker-svc.yaml
```

<!--You can also provide multiple docker-compose files at the same time:-->
您也可以一次性同时转换多个docker-compose文件，如下所示：
```console
$ kompose -f docker-compose.yml -f docker-guestbook.yml convert
file "frontend-service.yaml" created
file "mlbparks-service.yaml" created
file "mongodb-service.yaml" created
file "redis-master-service.yaml" created
file "redis-slave-service.yaml" created
file "frontend-deployment.yaml" created
file "mlbparks-deployment.yaml" created
file "mongodb-deployment.yaml" created
file "mongodb-claim0-persistentvolumeclaim.yaml" created
file "redis-master-deployment.yaml" created
file "redis-slave-deployment.yaml" created

$ ls
mlbparks-deployment.yaml  mongodb-service.yaml                       redis-slave-service.jsonmlbparks-service.yaml
frontend-deployment.yaml  mongodb-claim0-persistentvolumeclaim.yaml  redis-master-service.yaml
frontend-service.yaml     mongodb-deployment.yaml                    redis-slave-deployment.yaml
redis-master-deployment.yaml
```

<!--When multiple docker-compose files are provided the configuration is merged. Any configuration that is common will be over ridden by subsequent file.-->
当提供多个docker-compose文件时，配置将被合并。任何常见的配置都将被后续文件覆盖。

<!--Using `--bundle, --dab` to specify a DAB file as below:-->
使用 `--bundle, --dab`去解析一个DAB文件，如下所示：
```console
$ kompose --bundle docker-compose-bundle.dab convert
WARN: Unsupported key networks - ignoring
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created
```

### OpenShift

```console
$ kompose --provider openshift --file docker-voting.yml convert
WARN [worker] Service cannot be created because of missing port.
INFO file "vote-service.yaml" created
INFO file "db-service.yaml" created
INFO file "redis-service.yaml" created
INFO file "result-service.yaml" created
INFO file "vote-deploymentconfig.yaml" created
INFO file "vote-imagestream.yaml" created
INFO file "worker-deploymentconfig.yaml" created
INFO file "worker-imagestream.yaml" created
INFO file "db-deploymentconfig.yaml" created
INFO file "db-imagestream.yaml" created
INFO file "redis-deploymentconfig.yaml" created
INFO file "redis-imagestream.yaml" created
INFO file "result-deploymentconfig.yaml" created
INFO file "result-imagestream.yaml" created
```

<!--In similar way you can convert DAB files to OpenShift.-->
同样的方式，您可以将DAB文件转换成OpenShift。
```console
$ kompose --bundle docker-compose-bundle.dab --provider openshift convert
WARN: Unsupported key networks - ignoring
INFO file "redis-svc.yaml" created
INFO file "web-svc.yaml" created
INFO file "web-deploymentconfig.yaml" created
INFO file "web-imagestream.yaml" created
INFO file "redis-deploymentconfig.yaml" created
INFO file "redis-imagestream.yaml" created
```

<!--It also supports creating buildconfig for build directive in a service. By default, it uses the remote repo for the current git branch as the source repo, and the current branch as the source branch for the build. You can specify a different source repo and branch using ``--build-repo`` and ``--build-branch`` options respectively.-->
Kompose还支持在服务中为build指令创建buildconfig。默认情况下，它使用远程仓库分作为源仓库并获得当前git分支，当前分支作为构建的源分支。您可以使用“--build-repo”和“--build-branch”选项分别指定不同的源代码和分支。

```console
$ kompose --provider openshift --file buildconfig/docker-compose.yml convert
WARN [foo] Service cannot be created because of missing port.
INFO Buildconfig using git@github.com:rtnpro/kompose.git::master as source.
INFO file "foo-deploymentconfig.yaml" created
INFO file "foo-imagestream.yaml" created
INFO file "foo-buildconfig.yaml" created
```

<!--**Note**: If you are manually pushing the Openshift artifacts using ``oc create -f``, you need to ensure that you push the imagestream artifact before the buildconfig artifact, to workaround this Openshift issue: https://github.com/openshift/origin/issues/4518 . -->

**注意**：如果您使用``oc create -f``手动推送Openshift组件，则需要确保在buildconfig工件之前推送镜像组件，以解决这个Openshift问题: https://github.com/openshift/origin/issues/4518 。

## Kompose安装

<!--Kompose supports a straightforward way to deploy your "composed" application to Kubernetes or OpenShift via `kompose -up`. -->
Kompose支持直接通过`kompose up` 命令完成 "composed" 应用部署。

### Kubernetes
```console
$ kompose --file ./examples/docker-guestbook.yml up
<!--We are going to create Kubernetes deployments and services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'kubectl create -f' commands instead.
-->
通过创建Kubernetes的deployment，service来容器化您的应用。
如果您需要多种类型的资源，使用 'kompose convert'命令和'kubectl create -f' 进行替换。

INFO Successfully created service: redis-master
INFO Successfully created service: redis-slave
INFO Successfully created service: frontend
INFO Successfully created deployment: redis-master
INFO Successfully created deployment: redis-slave
INFO Successfully created deployment: frontend

<!--Your application has been deployed to Kubernetes. You can run 'kubectl get deployment,svc,pods' for details. -->
您的应用将会在Kubernetes部署，您可以通过运行'kubectl get deployment,svc,pods' 获得更详细的信息。
$ kubectl get deployment,svc,pods
NAME                               DESIRED       CURRENT       UP-TO-DATE   AVAILABLE   AGE
deploy/frontend                    1             1             1            1           4m
deploy/redis-master                1             1             1            1           4m
deploy/redis-slave                 1             1             1            1           4m

NAME                               CLUSTER-IP    EXTERNAL-IP   PORT(S)      AGE
svc/frontend                       10.0.174.12   <none>        80/TCP       4m
svc/kubernetes                     10.0.0.1      <none>        443/TCP      13d
svc/redis-master                   10.0.202.43   <none>        6379/TCP     4m
svc/redis-slave                    10.0.1.85     <none>        6379/TCP     4m

NAME                               READY         STATUS        RESTARTS     AGE
po/frontend-2768218532-cs5t5       1/1           Running       0            4m
po/redis-master-1432129712-63jn8   1/1           Running       0            4m
po/redis-slave-2504961300-nve7b    1/1           Running       0            4m
```

<!--Note:
- You must have a running Kubernetes cluster with a pre-configured kubectl context.
- Only deployments and services are generated and deployed to Kubernetes. If you need different kind of resources, use the 'kompose convert' and 'kubectl create -f' commands instead.
-->
注意：
- 您必须有一个正在运行的Kubernetes集群，并具有预配置的kubectl上下文。
- 只有deployments和service这两种资源类型可以部署，如果您需要其他种类的资源，可通过'kompose convert'和'kubectl create -f' 命令进行替换。


### OpenShift
```console
$kompose --file ./examples/docker-guestbook.yml --provider openshift up
<!--We are going to create OpenShift DeploymentConfigs and Services for your Dockerized application.
If you need different kind of resources, use the 'kompose convert' and 'oc create -f' commands instead. -->
通过创建Openshift的deployment，service来容器化您的应用。
如果您需要多种类型的资源，使用 'kompose convert'命令和'kubectl create -f' 进行替换。

INFO Successfully created service: redis-slave
INFO Successfully created service: frontend
INFO Successfully created service: redis-master
INFO Successfully created deployment: redis-slave
INFO Successfully created ImageStream: redis-slave
INFO Successfully created deployment: frontend
INFO Successfully created ImageStream: frontend
INFO Successfully created deployment: redis-master
INFO Successfully created ImageStream: redis-master

<!--Your application has been deployed to OpenShift. You can run 'oc get dc,svc,is' for details.-->
您的应用将会在Kubernetes部署，您可以通过运行'oc get dc,svc,is' 获得更详细的信息

$ oc get dc,svc,is
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

<!--Note:
- You must have a running OpenShift cluster with a pre-configured `oc` context (`oc login`) -->
注意事项：
- 您必须具有运行的OpenShift集群，并具有预配置的“oc”上下文（“oc login”）

## Kompose 卸载

<!--Once you have deployed "composed" application to Kubernetes, `kompose down` will help you to take the application out by deleting its deployments and services. If you need to remove other resources, use the 'kubectl' command. -->
一经在Kubernetes部署 "composed"应用，`kompose down`将会帮您删除应用相关的deployments和services。如果您需要删除其他资源类型，可使用'kubectl'命令。

```console
$ kompose --file docker-guestbook.yml down
INFO Successfully deleted service: redis-master
INFO Successfully deleted deployment: redis-master
INFO Successfully deleted service: redis-slave
INFO Successfully deleted deployment: redis-slave
INFO Successfully deleted service: frontend
INFO Successfully deleted deployment: frontend
```
<!--Note:
- You must have a running Kubernetes cluster with a pre-configured kubectl context.-->
注意事项：
- 您必须具有运行的Kubernetes集群，并具有预配置的kubectl上下文。
## 转换

<!--The default `kompose` transformation will generate Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) and [Services](/docs/concepts/services-networking/service/), in yaml format. You have alternative option to generate json with `-j`. Also, you can alternatively generate [Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/) objects, [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), or [Helm](https://github.com/helm/helm) charts.
-->
默认的`kompose`转换将会生成Kubernetes [Deployments](/docs/concepts/workloads/controllers/deployment/) 和 [Services](/docs/concepts/services-networking/service/)的在yaml文件，只要加上`-j`即可生成json格式文件，您也可以选择生成[Replication Controllers](/docs/concepts/workloads/controllers/replicationcontroller/) 对象, [Daemon Sets](/docs/concepts/workloads/controllers/daemonset/), 或者 [Helm](https://github.com/helm/helm) charts。

```console
$ kompose convert -j
file "redis-svc.json" created
file "web-svc.json" created
file "redis-deployment.json" created
file "web-deployment.json" created
```
<!--The `*-deployment.json` files contain the Deployment objects. -->
`*-deployment.json`文件包含部署对象

```console
$ kompose convert --rc
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "redis-rc.yaml" created
file "web-rc.yaml" created
```

<!--The `*-rc.yaml` files contain the Replication Controller objects. If you want to specify replicas (default is 1), use `--replicas` flag: `$ kompose convert --rc --replicas 3` -->
`*-rc.yaml`文件包含Replication Controller对象。如果要指定副本（默认为1），请使用`--replicas`标志：`$ kompose convert --rc --replicas 3`

```console
$ kompose convert --ds
file "redis-svc.yaml" created
file "web-svc.yaml" created
file "redis-daemonset.yaml" created
file "web-daemonset.yaml" created
```

<!--The `*-daemonset.yaml` files contain the Daemon Set objects -->


<!--If you want to generate a Chart to be used with [Helm](https://github.com/kubernetes/helm) simply do:
`*-daemonset.yaml`  -->

`*-daemonset.yaml`文件包含Daemon Set对象。
如果要生成与[Helm]（https://github.com/kubernetes/helm）一起使用的图表，只需执行以下操作：
`*-daemonset.yaml`.

```console
$ kompose convert -c
file "web-svc.yaml" created
file "redis-svc.yaml" created
file "web-deployment.yaml" created
file "redis-deployment.yaml" created
chart created in "./docker-compose/"

$ tree docker-compose/
docker-compose
├── Chart.yaml
├── README.md
└── templates
    ├── redis-deployment.yaml
    ├── redis-svc.yaml
    ├── web-deployment.yaml
    └── web-svc.yaml
```

<!--The chart structure is aimed at providing a skeleton for building your Helm charts. -->
图表结构旨在提供构建您的Helm图表的骨架。
## 尚不支持的docker-compose配置注意事项

<!--Currently `kompose` does not support some Docker Compose options, which are listed on the [conversion](http://kompose.io/conversion/) document. -->
目前`kompose`不支持一些Docker Compose选项，它们在[conversion]（http://kompose.io/conversion/）文档中列出。
例如:

```console
$ cat nginx.yml
nginx:
  image: nginx
  dockerfile: foobar
  build: ./foobar
  cap_add:
    - ALL
  container_name: foobar

$ kompose -f nginx.yml convert
WARN Unsupported key build - ignoring
WARN Unsupported key cap_add - ignoring
WARN Unsupported key dockerfile - ignoring
```

## 标签

<!--`kompose` supports Kompose-specific labels within the `docker-compose.yml` file in order to explicitly define a service's behavior upon conversion. -->
`kompose`支持Kompose-specific,标签在docker-compose.yml文件中显式定义了在转换时的一个service的行为


<!--- kompose.service.type defines the type of service to be created. -->
- kompose.service.type定义要创建服务的类型。
例如:

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

<!--- kompose.service.expose defines if the service needs to be made accessible from outside the cluster or not. If the value is set to "true", the provider sets the endpoint automatically, and for any other value, the value is set as the hostname. If multiple ports are defined in a service, the first one is chosen to be the exposed.
    - For the Kubernetes provider, an ingress resource is created and it is assumed that an ingress controller has already been configured.
    - For the OpenShift provider, a route is created.

For example:
-->
- kompose.service.expose定义服务是否需要从集群外部访问。如果该值设置为“true”，provider将自动设置端点，包括其他的一些诸如hostname的value一样，都会被自动设置。如果在服务中定义多个端口，则第一个端口被选择为公开的。
    - 针对Kubernetes provider, 会创建一个ingress资源并初始化ingress controller。
    - 针对OpenShift provider, 会创建一个route。
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

<!--The currently supported options are: -->
目前支持的选项如下：

| Key                  | Value                               |
|----------------------|-------------------------------------|
| kompose.service.type | nodeport / clusterip / loadbalancer |
| kompose.service.expose| true / hostname |


## 重启

<!--If you want to create normal pods without controllers you can use `restart` construct of docker-compose to define that. Follow table below to see what heppens on the `restart` value.
-->
如果您想在没有控制器的情况下创建pods，您可以使用docker-compose的`restart`命令。`restart` 参数如下表所示：

| `docker-compose` `restart` | object created    | Pod `restartPolicy` |
|----------------------------|-------------------|---------------------|
| `""`                       | controller object | `Always`            |
| `always`                   | controller object | `Always`            |
| `on-failure`               | Pod               | `OnFailure`         |
| `no`                       | Pod               | `Never`             |

<!--**Note**: controller object could be `deployment` or `replicationcontroller`, etc. -->
**注意**: controller object可以是`Deployment` 或者 `ReplicationController`。

```yaml
version: '2'

services:
  pival:
    image: perl
    command: ["perl",  "-Mbignum=bpi", "-wle", "print bpi(2000)"]
    restart: "on-failure"
```

####DeploymentConfig注意事项
<!--If the Docker Compose file has a volume specified for a service, the Deployment (Kubernetes) or DeploymentConfig (OpenShift) strategy is changed to "Recreate" instead of "RollingUpdate" (default). This is done to avoid multiple instances of a service from accessing a volume at the same time. -->
如果Docker Compose文件有一个为服务指定的卷，那么部署(Kubernetes)或DeploymentConfig(OpenShift)策略将改为“重新创建”，而不是“RollingUpdate”(默认)。这样做是为了避免在同一时间访问卷的多个实例。
