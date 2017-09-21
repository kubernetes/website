---
approvers:
- janetkuo
title: 基于Replication Controller执行滚动升级
---

* TOC
{:toc}

## 概述

**注**: 创建副本应用的首选方法是使用[Deployment](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps)，Deployment使用[ReplicaSet](/docs/api-reference/{{page.version}}/#replicaset-v1beta1-extensions)来进行副本控制。
更多信息, 查看[使用Deployment运行一个无状态应用](/docs/tasks/run-application/run-stateless-application-deployment/)。

为了在更新服务的同时不中断业务， `kubectl` 支持['滚动更新'](/docs/user-guide/kubectl/v1.6/#rolling-update)，它一次更新一个pod，而不是同时停止整个服务。 有关更多信息，请参阅 [滚动更新设计文档](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) 和 [滚动更新示例](/docs/tasks/run-application/rolling-update-replication-controller/)。

请注意， `kubectl rolling-update` 仅支持Replication Controllers。 但是，如果使用Replication Controllers部署应用，请考虑将其切换到[Deployments](/docs/concepts/workloads/controllers/deployment/). Deployment是一种被推荐使用的更高级别的控制器，它可以对应用进行声明性的自动滚动更新。 如果您仍然希望保留您的Replication Controllers并使用 `kubectl rolling-update`进行滚动更新， 请继续往下阅读：

滚动更新可以对replication controller所管理的Pod的配置进行变更，变更可以通过一个新的配置文件来进行，或者，如果只更新镜像，则可以直接指定新的容器镜像。

滚动更新的工作流程：

1. 通过新的配置创建一个replication controller
2. 在新的控制器上增加副本数，在旧的上面减少副本数，直到副本数达到期望值
3. 删除之前的replication controller

使用`kubectl rolling-update`命令来进行滚动更新：

    $ kubectl rolling-update NAME \
        ([NEW_NAME] --image=IMAGE | -f FILE)

## 通过配置文件更新

通过配置文件来进行滚动更新，需要在`kubectl rolling-update`命令后面带上新的配置文件：

    $ kubectl rolling-update NAME -f FILE

这个配置文件必须满足以下条件：

* 指定不同的`metadata.name`值

* 至少要修改`spec.selector`中的一个标签值

* `metadata.namespace`字段必须相同

Replication Controllers的配置文件详细介绍见[创建Replication Controllers](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/).

### 示例

    // 通过新的配置文件frontend-v2.json来更新frontend-v1的pods
    $ kubectl rolling-update frontend-v1 -f frontend-v2.json

    // 将frontend-v2.json数据传到标准输入来更新frontend-v1的pods
    $ cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -

## 更新容器镜像

仅更新容器镜像的话，可通过如下命令，该命令可以指定一个新的控制器名称（可选），通过`--image`参数来指定新的镜像名称和标签。

    $ kubectl rolling-update NAME [NEW_NAME] --image=IMAGE:TAG

`--image`参数仅支持单容器pod，多容器pod使用`--image`参数会返回错误。

如果没有指定 `NEW_NAME` ，新的replication controller创建后会使用一个临时名称，当更新完成，旧的controller被删除后，新的controller名称会被更新成旧的controller名称。

如果`IMAGE:TAG` 和当前值相同，更新就会失败。 因此，我们建议使用版本号来作为标签，而不是使用 `:latest`。从一个 `image:latest`镜像升级到一个新的 `image:latest` 镜像将会失败，即使这两个镜像不是相同的。
所以，我们不建议使用 `:latest` 来作为标签，详细信息见[最佳配置实践](/docs/concepts/configuration/overview/#container-images) 。

### 示例

    // 更新frontend-v1的pod到frontend-v2
    $ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

    // 更新frontend的pods，不更改replication controller的名称
    $ kubectl rolling-update frontend --image=image:v2

## 必选和可选字段

必选字段：

* `NAME`: 需要进行滚动更新的replication controller名称

下面两个字段选其一：

* `-f FILE`: 新的replication controller的配置文件，JSON或者YAML格式均可。配置文件必须指定一个新的顶层`id`值，且至少包含一个现有`spec.selector`中的键值对。
  详细信息见[通过Replication Controller运行无状态应用](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/#replication-controller-configuration-file)。
<br>
<br>
    或者：
<br>
<br>
* `--image IMAGE:TAG`: 更新后的镜像的名称和标签。必须和当前的image:tag不同。

可选字段包括：

* `NEW_NAME`: 只和 `--image` 一起使用，不和 `-f FILE` 一起使用。标识新的replication controller的名称。
* `--poll-interval DURATION`: 在更新后轮询控制器状态的间隔时间。有效单位有 `ns` （纳秒），`us` 或 `µs`（微秒），`ms`（毫秒），`s`（秒），`m`（分钟）或 `h`（小时）。 单位可以自由组合（例如 `1m30s`）。 默认值为 `3s`。
* `--timeout DURATION`: 退出更新之前，等待控制器更新一个pod的最大时间。默认是`5m0s`。有效单位如`--poll-interval`所述。
* `--update-period DURATION`: 更新两个pod之间等待的时间，默认值是`1m0s`。有效单位如`--poll-interval`所述。

有关`kubectl rolling-update`命令的更多信息见[`kubectl`参考](/docs/user-guide/kubectl/v1.6/#rolling-update).

## 实践

现在你运行了一个1.7.9版本的nginx应用：

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: my-nginx
spec:
  replicas: 5
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.7.9
        ports:
        - containerPort: 80
```

要更新到1.9.1版本，你可以使用[`kubectl rolling-update --image`](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md)来指定一个新的镜像：

```shell
$ kubectl rolling-update my-nginx --image=nginx:1.9.1
Created my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
```

在终端上打开另一个窗口 ，你可以看到`kubectl` 给每个pod都增加了一个值为配置文件哈希值的 `deployment` 标签，用来区分新旧pod：

```shell
$ kubectl get pods -l app=nginx -L deployment
NAME                                              READY     STATUS    RESTARTS   AGE       DEPLOYMENT
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-k156z   1/1       Running   0          1m        ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-v95yh   1/1       Running   0          35s       ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-divi2                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-o0ef1                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-q6all                                    1/1       Running   0          8m        2d1d7a8f682934a254002b56404b813e
```

使用`kubectl rolling-update`可以实时看到更新的进度： 

```
Scaling up my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 from 0 to 3, scaling down my-nginx from 3 to 0 (keep 3 pods available, don't exceed 4 pods)
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 1
Scaling my-nginx down to 2
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 2
Scaling my-nginx down to 1
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 up to 3
Scaling my-nginx down to 0
Update succeeded. Deleting old controller: my-nginx
Renaming my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 to my-nginx
replicationcontroller "my-nginx" rolling updated
```

如果遇到问题，你可以中途停止滚动更新，并且使用 `--rollback` 来回滚到以前的版本:

```shell
$ kubectl rolling-update my-nginx --rollback
Setting "my-nginx" replicas to 1
Continuing update with existing controller my-nginx.
Scaling up nginx from 1 to 1, scaling down my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 from 1 to 0 (keep 1 pods available, don't exceed 2 pods)
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 down to 0
Update succeeded. Deleting my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
replicationcontroller "my-nginx" rolling updated
```

这个例子说明容器的不变性是个巨大的优点。

如果你不仅仅是需要更新镜像，(例如，更新命令参数，环境变量等)，你可以创建一个新的replication controller配置文件，包含一个新的名称和不同的标签值，例如：

```yaml
apiVersion: v1
kind: ReplicationController
metadata:
  name: my-nginx-v4
spec:
  replicas: 5
  selector:
    app: nginx
    deployment: v4
  template:
    metadata:
      labels:
        app: nginx
        deployment: v4
    spec:
      containers:
      - name: nginx
        image: nginx:1.9.2
        args: ["nginx", "-T"]
        ports:
        - containerPort: 80
```

然后使用它来进行更新：

```shell
$ kubectl rolling-update my-nginx -f ./nginx-rc.yaml
Created my-nginx-v4
Scaling up my-nginx-v4 from 0 to 5, scaling down my-nginx from 4 to 0 (keep 4 pods available, don't exceed 5 pods)
Scaling my-nginx-v4 up to 1
Scaling my-nginx down to 3
Scaling my-nginx-v4 up to 2
Scaling my-nginx down to 2
Scaling my-nginx-v4 up to 3
Scaling my-nginx down to 1
Scaling my-nginx-v4 up to 4
Scaling my-nginx down to 0
Scaling my-nginx-v4 up to 5
Update succeeded. Deleting old controller: my-nginx
replicationcontroller "my-nginx-v4" rolling updated
```

## 故障分析

如果更新过程中，达到超时时长`timeout`后还没更新完成，则更新会失败。这时，一些pod会属于新的replication controller，一些会属于旧的。

如果更新失败，可以尝试使用同样的命令来继续更新过程。

在尝试更新之前如果需要回滚到之前的状态，可在之前的命令后面添加`--rollback=true`参数，这将回退所有的更改。
