---
approvers:
- janetkuo
cn-approvers:
- pigletfly
title: 使用 Replication Controller 进行滚动升级
---
<!--
---
approvers:
- janetkuo
title: Perform Rolling Update Using a Replication Controller
---
-->

* TOC
{:toc}

<!--
## Overview
-->
## 概览

<!--
**Note**: The preferred way to create a replicated application is to use a
[Deployment](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps),
which in turn uses a
[ReplicaSet](/docs/api-reference/{{page.version}}/#replicaset-v1beta1-extensions).
For more information, see
[Running a Stateless Application Using a Deployment](/docs/tasks/run-application/run-stateless-application-deployment/).
-->
**注意**: 创建应用副本的首选方法是使用 [Deployment](/docs/api-reference/{{page.version}}/#deployment-v1beta1-apps)，Deployment 反过来使用 [ReplicaSet](/docs/api-reference/{{page.version}}/#replicaset-v1beta1-extensions)。想要获取更多信息，请查看 [使用 Deployment 运行无状态应用程序](/docs/tasks/run-application/run-stateless-application-deployment/)。

<!--
To update a service without an outage, `kubectl` supports what is called [rolling update](/docs/user-guide/kubectl/{{page.version}}/#rolling-update), which updates one pod at a time, rather than taking down the entire service at the same time. See the [rolling update design document](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) and the [example of rolling update](/docs/tasks/run-application/rolling-update-replication-controller/) for more information.
-->
为了不中断地更新服务，`kubectl` 支持所谓的 [滚动升级](/docs/user-guide/kubectl/{{page.version}}/#rolling-update)，滚动升级一次只更新一个 pod，而且不是同时停掉整个服务。查看 [滚动升级设计文档](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) 和 [滚动升级示例](/docs/tasks/run-application/rolling-update-replication-controller/) 获取更多信息。


<!--
Note that `kubectl rolling-update` only supports Replication Controllers. However, if you deploy applications with Replication Controllers,
consider switching them to [Deployments](/docs/concepts/workloads/controllers/deployment/). A Deployment is a higher-level controller that automates rolling updates
of applications declaratively, and therefore is recommended. If you still want to keep your Replication Controllers and use `kubectl rolling-update`, keep reading:
-->
需要注意的是，`kubectl rolling-update` 只支持 Replication Controller 。但是，如果您在使用 Replication Controller 部署应用程序，可以考虑将它们切换到 [Deployment](/docs/concepts/workloads/controllers/deployment/)。Deployment 是可以实现应用程序自动滚动升级的更高级别的声明式控制器，所以推荐使用 Deployment 。如果您想继续使用 Replication Controller 和 `kubectl rolling-update`，请继续阅读：

<!--
A rolling update applies changes to the configuration of pods being managed by
a replication controller. The changes can be passed as a new replication
controller configuration file; or, if only updating the image, a new container
image can be specified directly.
-->
滚动升级会对 replication controller 管理的 pod 的配置应用变更。变更可以作为 replication
controller 的配置文件传递；或者，如果只是更新了镜像，可以直接指定新的容器镜像。

<!--
A rolling update works by:

1. Creating a new replication controller with the updated configuration.
2. Increasing/decreasing the replica count on the new and old controllers until
   the correct number of replicas is reached.
3. Deleting the original replication controller.

Rolling updates are initiated with the `kubectl rolling-update` command:

    $ kubectl rolling-update NAME \
        ([NEW_NAME] --image=IMAGE | -f FILE)
-->
滚动升级通过下面步骤进行工作：

1. 使用更新后的配置创建一个新的 replication controller。
2. 增加新的 replication controller 的 replica 数量，减少老的 replication controller 的 replica 数量，直到达到正确的 replica 数量。
3. 删除原来的 replication controller。

滚动升级是通过 `kubectl rolling-update` 命令来初始化的：

    $ kubectl rolling-update NAME \
        ([NEW_NAME] --image=IMAGE | -f FILE)


<!--
## Passing a configuration file

To initiate a rolling update using a configuration file, pass the new file to
`kubectl rolling-update`:

    $ kubectl rolling-update NAME -f FILE

The configuration file must:

* Specify a different `metadata.name` value.

* Overwrite at least one common label in its `spec.selector` field.

* Use the same `metadata.namespace`.

Replication controller configuration files are described in
[Creating Replication Controllers](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/).
-->
## 传递配置文件

要通过使用配置文件初始化滚动升级，需要传递新文件给 `kubectl rolling-update` 命令：


    $ kubectl rolling-update NAME -f FILE
  
这个配置文件必须是：

* 指定了不同的 `metadata.name` 的值。
* 在 `spec.selector` 字段里至少重写了一个常见 label。
* 使用相同的 `metadata.namespace`。

在 [创建 Replication Controllers](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/) 文档里描述了 Replication controller 的配置文件。

<!--
### Examples

    // Update pods of frontend-v1 using new replication controller data in frontend-v2.json.
    $ kubectl rolling-update frontend-v1 -f frontend-v2.json

    // Update pods of frontend-v1 using JSON data passed into stdin.
    $ cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -
-->
### 示例

    // Update pods of frontend-v1 using new replication controller data in frontend-v2.json.
    $ kubectl rolling-update frontend-v1 -f frontend-v2.json

    // Update pods of frontend-v1 using JSON data passed into stdin.
    $ cat frontend-v2.json | kubectl rolling-update frontend-v1 -f -

<!--
## Updating the container image

To update only the container image, pass a new image name and tag with the
`--image` flag and (optionally) a new controller name:

    $ kubectl rolling-update NAME [NEW_NAME] --image=IMAGE:TAG

The `--image` flag is only supported for single-container pods. Specifying
`--image` with multi-container pods returns an error.

If no `NEW_NAME` is specified, a new replication controller is created with
a temporary name. Once the rollout is complete, the old controller is deleted,
and the new controller is updated to use the original name.

The update will fail if `IMAGE:TAG` is identical to the
current value. For this reason, we recommend the use of versioned tags as
opposed to values such as `:latest`. Doing a rolling update from `image:latest`
to a new `image:latest` will fail, even if the image at that tag has changed.
Moreover, the use of `:latest` is not recommended, see
[Best Practices for Configuration](/docs/concepts/configuration/overview/#container-images) for more information.
--->
## 更新容器镜像

如果只是为了更新容器镜像，需要传递新的镜像名和新的 controller 名称，镜像名要使用 `--image` 参数来标记：

    $ kubectl rolling-update NAME [NEW_NAME] --image=IMAGE:TAG

`--image` 参数值只支持单个容器的 pod。在多容器的 pod 上使用 `--image` 指定镜像名会返回错误。

如果没有指定 `NEW_NAME` ，新的 replication controller 会使用临时的名称来创建。一旦 rollout 完成，老的 controller 会被删除，并且新的 controller 会更新为原来的的名称。

如果 `IMAGE:TAG` 的值和当前的值是完全一样的，更新会失败。出于这个原因，我们建议使用特定版本的镜像 tag，而不是使用例如 `:latest` 这样的 tag 。从 `image:latest` 镜像到新的 `image:latest` 镜像进行滚动升级会失败，即使
`image:latest` tag 里的镜像已经更改过。而且，使用 `:latest` 是不推荐的，查看 [配置最佳实践](/docs/concepts/configuration/overview/#container-images) 获取更多信息。

<!--
### Examples

    // Update the pods of frontend-v1 to frontend-v2
    $ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

    // Update the pods of frontend, keeping the replication controller name
    $ kubectl rolling-update frontend --image=image:v2
-->
### 示例


    // Update the pods of frontend-v1 to frontend-v2
    $ kubectl rolling-update frontend-v1 frontend-v2 --image=image:v2

    // Update the pods of frontend, keeping the replication controller name
    $ kubectl rolling-update frontend --image=image:v2

<!--
## Required and optional fields

Required fields are:

* `NAME`: The name of the replication controller to update.

as well as either:

* `-f FILE`: A replication controller configuration file, in either JSON or
  YAML format. The configuration file must specify a new top-level `id` value
  and include at least one of the existing `spec.selector` key:value pairs.
  See the
  [Run Stateless AP Replication Controller](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/#replication-controller-configuration-file)
  page for details.
<br>
<br>
    or:
<br>
<br>
* `--image IMAGE:TAG`: The name and tag of the image to update to. Must be
  different than the current image:tag currently specified.

Optional fields are:

* `NEW_NAME`: Only used in conjunction with `--image` (not with `-f FILE`). The
  name to assign to the new replication controller.
* `--poll-interval DURATION`: The time between polling the controller status
  after update. Valid units are `ns` (nanoseconds), `us` or `µs` (microseconds),
  `ms` (milliseconds), `s` (seconds), `m` (minutes), or `h` (hours). Units can
  be combined (e.g. `1m30s`). The default is `3s`.
* `--timeout DURATION`: The maximum time to wait for the controller to update a
  pod before exiting. Default is `5m0s`. Valid units are as described for
  `--poll-interval` above.
* `--update-period DURATION`: The time to wait between updating pods. Default
  is `1m0s`. Valid units are as described for `--poll-interval` above.

Additional information about the `kubectl rolling-update` command is available
from the [`kubectl` reference](/docs/user-guide/kubectl/{{page.version}}/#rolling-update).
-->
## 必选和可选字段

必选的字段有：

* `NAME`: 要更新的 replication controller 的名称

还有：

* `-f FILE`: 一个 replication controller 的配置文件，无论是 JSON 或者 YAML 文件格式。这个配置文件必须指定一个新的顶级的 `id` 值，并且至少包含了一个已经存在的 `spec.selector` 键值对。
查看 [运行无状态应用 Replication Controller](/docs/tutorials/stateless-application/run-stateless-ap-replication-controller/#replication-controller-configuration-file) 页面获取详细信息。
<br>
<br>
    或者:
<br>
<br>
* `--image IMAGE:TAG`: 要更新的镜像的名称和 tag。必须和当前指定的 image:tag 不同。

可选字段有：

* `NEW_NAME`: 只有和 `--image` 参数配合一起使用(不和 `-f FILE` 一起使用)。分配给新的 replication controller 的名称。
* `--poll-interval DURATION`: 滚动升级后轮询 controller 状态的间隔时间。有效的单位有 `ns` (纳秒)、`us` 或者 `µs` (微秒)、`ms` (毫秒)、 `s` (秒) 、`m` (分钟) 或者 `h` (小时)。单位可以组合使用，比如 `1m30s` 。默认值是 `3s` 。
* `--timeout DURATION`: controller 更新 pod 时等待其退出的最大时间。默认值是 `5m0s` 。有效的单位在上面的 `--poll-interval` 中描述过。
* `--update-period DURATION`: 更新 pods 的等待间隔时间。默认值是 `1m0s` 。有效的单位在上面的 `--poll-interval` 中描述过。

更多的有关 `kubectl rolling-update` 命令的信息可以查看 [`kubectl` reference](/docs/user-guide/kubectl/{{page.version}}/#rolling-update)。


<!--
## Walkthrough

Let's say you were running version 1.7.9 of nginx:
-->
## 演练

假设您运行了 1.7.9 版本的 nginx：

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

<!--
To update to version 1.9.1, you can use [`kubectl rolling-update --image`](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) to specify the new image:
-->
要更新到 1.9.1 版本，您可以使用 [`kubectl rolling-update --image`](https://git.k8s.io/community/contributors/design-proposals/cli/simple-rolling-update.md) 指定新的镜像：

```shell
$ kubectl rolling-update my-nginx --image=nginx:1.9.1
Created my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
```
<!--
In another window, you can see that `kubectl` added a `deployment` label to the pods, whose value is a hash of the configuration, to distinguish the new pods from the old:
-->
在另外一个窗口，您可以看到 `kubectl` 在这些 pod 上 添加了一个 `deployment` label，label 的值是配置文件的哈希，为了区分新的和老的 pod。

```shell
$ kubectl get pods -l app=nginx -L deployment
NAME                                              READY     STATUS    RESTARTS   AGE       DEPLOYMENT
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-k156z   1/1       Running   0          1m        ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-ccba8fbd8cc8160970f63f9a2696fc46-v95yh   1/1       Running   0          35s       ccba8fbd8cc8160970f63f9a2696fc46
my-nginx-divi2                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-o0ef1                                    1/1       Running   0          2h        2d1d7a8f682934a254002b56404b813e
my-nginx-q6all                                    1/1       Running   0          8m        2d1d7a8f682934a254002b56404b813e
```

<!--
`kubectl rolling-update` reports progress as it progresses:
-->
`kubectl rolling-update` 在执行的过程会显示进度：

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

<!--
If you encounter a problem, you can stop the rolling update midway and revert to the previous version using `--rollback`:
-->
如果您遇到了问题，您可以在中途停止滚动升级并且可以使用 `--rollback` 回滚到上个版本。

```shell
$ kubectl rolling-update my-nginx --rollback
Setting "my-nginx" replicas to 1
Continuing update with existing controller my-nginx.
Scaling up nginx from 1 to 1, scaling down my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 from 1 to 0 (keep 1 pods available, don't exceed 2 pods)
Scaling my-nginx-ccba8fbd8cc8160970f63f9a2696fc46 down to 0
Update succeeded. Deleting my-nginx-ccba8fbd8cc8160970f63f9a2696fc46
replicationcontroller "my-nginx" rolling updated
```

<!--
This is one example where the immutability of containers is a huge asset.

If you need to update more than just the image (e.g., command arguments, environment variables), you can create a new replication controller, with a new name and distinguishing label value, such as:
-->
这是容器不变性是巨大财富的一个例子。

如果您需要更新的不仅仅是镜像（例如命令参数，环境变量），您可以用一个新的名称和不同的 label 来创建一个新的 replication controller ，例如：


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

<!--
and roll it out:
-->
然后进行发布：

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

<!--
## Troubleshooting

If the `timeout` duration is reached during a rolling update, the operation will
fail with some pods belonging to the new replication controller, and some to the
original controller.

To continue the update from where it failed, retry using the same command.

To roll back to the original state before the attempted update, append the
`--rollback=true` flag to the original command. This will revert all changes.
-->

## 故障排除

如果在滚动升级过程中达到了 `timeout` 时间，这个操作会失败，造成一些 pod 属于新的 replication controller ，一些属于原来的 replication controller。

要从失败的地方继续进行，可以使用相同的命令重试。

如果在尝试更新前回滚到原来的状态，在原来的命令后面加上 `--rollback=true`。这样就会回滚所有的变更。