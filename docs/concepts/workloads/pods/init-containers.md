---
assignees:
- erictune
title: Init 容器
redirect_from:
- "/docs/concepts/abstractions/init-containers/"
- "/docs/concepts/abstractions/init-containers.html"
- "/docs/user-guide/pods/init-container/"
- "/docs/user-guide/pods/init-container.html"
---

{% capture overview %}
<!--
This page provides an overview of Init Containers, which are specialized
Containers that run before app Containers and can contain utilities or setup
scripts not present in an app image.
-->
本页提供了 Init 容器的概览，它是一种专用的容器，在应用容器之前运行，并包括一些应用镜像中不存在的实用工具和安装脚本。
{% endcapture %}

{:toc}

<!--
This feature has exited beta in 1.6. Init Containers can be specified in the PodSpec
alongside the app `containers` array. The beta annotation value will still be respected
and overrides the PodSpec field value.
-->
这个特性在 1.6 版本已经退出 beta 版本。Init 容器可以在 PodSpec 中同应用的 `containers` 数组一起来指定。
beta 注解的值将仍然需要保留，并覆盖 PodSpec 字段值。

{% capture body %}
<!--
## Understanding Init Containers
-->

## 理解 Init 容器

<!--
A [Pod](/docs/concepts/abstractions/pod/) can have multiple Containers running
apps within it, but it can also have one or more Init Containers, which are run
before the app Containers are started.

Init Containers are exactly like regular Containers, except:
-->

[Pod](/docs/concepts/abstractions/pod/) 能够具有多个容器，应用运行在容器里面，但是它也可能有一个或多个先于应用容器启动的 Init 容器。

Init 容器与普通的容器非常像，除了如下两点：

<!--
* They always run to completion.
* Each one must complete successfully before the next one is started.
-->

* 它们总是运行到完成。
* 每个都必须在下一个启动之前成功完成。

<!--
If an Init Container fails for a Pod, Kubernetes restarts the Pod repeatedly until the Init
Container succeeds. However, if the Pod has a `restartPolicy` of Never, it is not restarted.

To specify a Container as an Init Container, add the `initContainers` field on the PodSpec as a JSON array of objects of type [v1.Container](/docs/api-reference/v1.6/#container-v1-core) alongside the app `containers` array.
The status of the init containers is returned in `status.initContainerStatuses`
field as an array of the container statuses (similar to the `status.containerStatuses`
field).
-->

如果 Pod 的 Init 容器失败，Kubernetes 会不断地重启该 Pod，直到 Init 容器成功为止。然而，如果 Pod 对应的 `restartPolicy` 为 Never，它不会重新启动。

指定容器为 Init 容器，在 PodSpec 中添加 `initContainers` 字段，以 [v1.Container](/docs/api-reference/v1.6/#container-v1-core) 类型对象的 JSON 数组的形式，还有 app 的 `containers` 数组。
Init 容器的状态在 `status.initContainerStatuses` 字段中以容器状态数组的格式返回（类似 `status.containerStatuses` 字段）。

<!--
### Differences from regular Containers

Init Containers support all the fields and features of app Containers,
including resource limits, volumes, and security settings. However, the
resource requests and limits for an Init Container are handled slightly
differently, which are documented in [Resources](#resources) below.  Also, Init Containers do not
support readiness probes because they must run to completion before the Pod can
be ready.

If multiple Init Containers are specified for a Pod, those Containers are run
one at a time in sequential order. Each must succeed before the next can run.
When all of the Init Containers have run to completion, Kubernetes initializes
the Pod and runs the application Containers as usual.
-->

### 与普通容器的不同之处

Init 容器支持应用容器的全部字段和特性，包括资源限制、数据卷和安全设置。
然而，Init 容器对资源请求和限制的处理稍有不同，在下面 [资源](#resources) 处有说明。
而且 Init 容器不支持 Readiness Probe，因为它们必须在 Pod 就绪之前运行完成。

如果为一个 Pod 指定了多个 Init 容器，那些容器会按顺序一次运行一个。
每个 Init 容器必须运行成功，下一个才能够运行。
当所有的 Init 容器运行完成时，Kubernetes 初始化 Pod 并像平常一样运行应用容器。

<!--
## What can Init Containers be used for?

Because Init Containers have separate images from app Containers, they
have some advantages for start-up related code:

* They can contain and run utilities that are not desirable to include in the
  app Container image for security reasons.
* They can contain utilities or custom code for setup that is not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, or `dig` during setup.
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
* They use Linux namespaces so that they have different filesystem views from app Containers.
  Consequently, they can be given access to Secrets that app Containers are not able to
  access.
* They run to completion before any app Containers start, whereas app
  Containers run in parallel, so Init Containers provide an easy way to block or
  delay the startup of app Containers until some set of preconditions are met.
-->

## Init 容器能做什么？

因为 Init 容器具有与应用容器分离的单独镜像，它们的启动相关代码具有如下优势：

* 它们可以包含并运行实用工具，处于安全考虑，是不建议在应用容器镜像中包含这些实用工具的。
* 它们可以包含使用工具和定制化代码来安装，但是不能出现在应用镜像中。例如，创建镜像没必要 `FROM` 另一个镜像，只需要在安装过程中使用类似 `sed`、 `awk`、 `python` 或 `dig` 这样的工具。
* 应用镜像可以分离出创建和部署的角色，而没有必要联合它们构建一个单独的镜像。
* 它们使用 Linux Namespace，所以对应用容器具有不同的文件系统视图。因此，它们能够具有访问 Secret 的权限，而应用容器不能够访问。
* 它们在应用容器启动之前运行完成，然而应用容器并行运行，所以 Init 容器提供了一种简单的方式来阻塞或延迟应用容器的启动，直到满足了一组先决条件。

<!--
### Examples
Here are some ideas for how to use Init Containers:

* Wait for a service to be created with a shell command like:

        for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1

* Register this Pod with a remote server from the downward API with a command like:

        curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'

* Wait for some time before starting the app Container with a command like `sleep 60`.
* Clone a git repository into a volume.
* Place values into a configuration file and run a template tool to dynamically
  generate a configuration file for the the main app Container. For example,
  place the POD_IP value in a configuration and generate the main app
  configuration file using Jinja.

More detailed usage examples can be found in the [StatefulSets documentation](/docs/concepts/abstractions/controllers/statefulsets/)
and the [Production Pods guide](/docs/user-guide/production-pods.md#handling-initialization).
-->

### 示例

下面是一些如何使用 Init 容器的想法：

* 等待一个 Service 完成创建，通过类似如下 shell 命令：

        for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1

* 注册这个 Pod 到远程服务器，通过在命令中调用 API，类似如下：

        curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'

* 在启动应用容器之前等一段时间，使用类似 `sleep 60` 的命令。
* 克隆 Git 仓库到数据卷。
* 将配置值放到配置文件中，运行模板工具为主应用容器动态地生成配置文件。例如，在配置文件中存放 POD_IP 值，并使用 Jinja 生成主应用配置文件。

更多详细用法示例，可以在 [StatefulSet 文档](/docs/concepts/abstractions/controllers/statefulsets/) 和 [生产环境 Pod 指南](/docs/user-guide/production-pods.md#handling-initialization)  中找到。

<!--
### Init Containers in use

The following yaml file for Kubernetes 1.5 outlines a simple Pod which has two Init Containers.
The first waits for `myservice` and the second waits for `mydb`. Once both
containers complete, the Pod will begin.
-->

### 使用 Init 容器

下面是 Kubernetes 1.5 版本 yaml 文件，展示了一个具有 2 个 Init 容器的简单 Pod。
第一个等待  `myservice` 启动，第二个等待 `mydb` 启动。
一旦这两个 Service 都启动完成，Pod 将开始启动。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
  annotations:
    pod.beta.kubernetes.io/init-containers: '[
        {
            "name": "init-myservice",
            "image": "busybox",
            "command": ["sh", "-c", "until nslookup myservice; do echo waiting for myservice; sleep 2; done;"]
        },
        {
            "name": "init-mydb",
            "image": "busybox",
            "command": ["sh", "-c", "until nslookup mydb; do echo waiting for mydb; sleep 2; done;"]
        }
    ]'
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
```

<!--
There is a new syntax in Kubernetes 1.6, although the old annotation syntax still works. We have moved the declaration of init containers to `spec`:
-->

这是 Kubernetes 1.6 版本的新语法，尽管老的 annotation 语法仍然可以使用。我们已经把 Init 容器的声明移到 `spec` 中：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app: myapp
spec:
  containers:
  - name: myapp-container
    image: busybox
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox
    command: ['sh', '-c', 'until nslookup myservice; do echo waiting for myservice; sleep 2; done;']
  - name: init-mydb
    image: busybox
    command: ['sh', '-c', 'until nslookup mydb; do echo waiting for mydb; sleep 2; done;']
```

<!--
1.5 syntax still works on 1.6, but we recommend using 1.6 syntax. In Kubernetes 1.6, Init Containers were made a field in the API. The beta annotation is still respected but will be deprecated in future releases.

Yaml file below outlines the `mydb` and `myservice` services:
-->

1.5 版本的语法在 1.6 版本仍然可以使用，但是我们推荐使用 1.6 版本的新语法。
在 Kubernetes 1.6 版本中，Init 容器在 API 中新建了一个字段。
虽然期望使用 beta 版本的 annotation，但在未来发行版将会被废弃掉。

下面的 yaml 文件展示了 `mydb` 和 `myservice` 两个 Service：

```
kind: Service
apiVersion: v1
metadata:
  name: myservice
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9376
---
kind: Service
apiVersion: v1
metadata:
  name: mydb
spec:
  ports:
    - protocol: TCP
      port: 80
      targetPort: 9377
```

<!--
This Pod can be started and debugged with the following commands:
-->

这个 Pod 可以使用下面的命令进行启动和调试：

```
$ kubectl create -f myapp.yaml
pod "myapp-pod" created
$ kubectl get -f myapp.yaml
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
$ kubectl describe -f myapp.yaml 
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app=myapp
Status:        Pending
[...]
Init Containers:
  init-myservice:
[...]
    State:         Running
[...]
  init-mydb:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Containers:
  myapp-container:
[...]
    State:         Waiting
      Reason:      PodInitializing
    Ready:         False
[...]
Events:
  FirstSeen    LastSeen    Count    From                      SubObjectPath                           Type          Reason        Message
  ---------    --------    -----    ----                      -------------                           --------      ------        -------
  16s          16s         1        {default-scheduler }                                              Normal        Scheduled     Successfully assigned myapp-pod to 172.17.4.201
  16s          16s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulling       pulling image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Pulled        Successfully pulled image "busybox"
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container with docker id 5ced34a04634; Security:[seccomp=unconfined]
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container with docker id 5ced34a04634
$ kubectl logs myapp-pod -c init-myservice # Inspect the first init container
$ kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```

<!--
Once we start the `mydb` and `myservice` services, we can see the Init Containers
complete and the `myapp-pod` is created:
-->

一旦我们启动了 `mydb` 和 `myservice` 这两个 Service，我们能够看到 Init 容器完成，并且 `myapp-pod` 被创建：

```
$ kubectl create -f services.yaml
service "myservice" created
service "mydb" created
$ kubectl get -f myapp.yaml
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

<!--
This example is very simple but should provide some inspiration for you to
create your own Init Containers.
-->

这个例子非常简单，但是应该能够为创建自己的 Init 容器提供一些启发。

<!--
## Detailed behavior

During the startup of a Pod, the Init Containers are started in order, after the
network and volumes are initialized. Each Container must exit successfully before
the next is started. If a Container fails to start due to the runtime or
exits with failure, it is retried according to the Pod `restartPolicy`. However,
if the Pod `restartPolicy` is set to Always, the Init Containers use
`RestartPolicy` OnFailure.
-->

## 具体行为

在 Pod 启动过程中，Init 容器会按顺序在网络和数据卷初始化之后启动。
每个容器必须在下一个容器启动之前成功退出。
如果由于运行时或失败退出，导致容器启动失败，它会根据 Pod 的 `restartPolicy` 指定的策略进行重试。
然而，如果 Pod 的 `restartPolicy` 设置为 Always，Init 容器失败时会使用 `RestartPolicy` 策略。

<!--
A Pod cannot be `Ready` until all Init Containers have succeeded. The ports on an
Init Container are not aggregated under a service. A Pod that is initializing
is in the `Pending` state but should have a condition `Initializing` set to true.

If the Pod is [restarted](#pod-restart-reasons), all Init Containers must
execute again.

Changes to the Init Container spec are limited to the container image field.
Altering an Init Container image field is equivalent to restarting the Pod.
-->

在所有的 Init 容器没有成功之前，Pod 将不会变成 `Ready` 状态。
Init 容器的端口将不会在 Service 中进行聚集。
正在初始化中的 Pod 处于 `Pending` 状态，但应该会将条件 `Initializing` 设置为 true。

如果 Pod [重启](#pod-restart-reasons)，所有 Init 容器必须重新执行。

对 Init 容器 spec 的修改，被限制在容器 image 字段中。
更改 Init 容器的 image 字段，等价于重启该 Pod。

<!--
Because Init Containers can be restarted, retried, or re-executed, Init Container
code should be idempotent. In particular, code that writes to files on `EmptyDirs`
should be prepared for the possibility that an output file already exists.

Init Containers have all of the fields of an app Container. However, Kubernetes
prohibits `readinessProbe` from being used because Init Containers cannot
define readiness distinct from completion. This is enforced during validation.
-->

因为 Init 容器可能会被重启、重试或者重新执行，所以 Init 容器的代码应该是幂等的。
特别地，被写到 `EmptyDirs` 中文件的代码，应该对输出文件可能已经存在做好准备。

Init 容器具有应用容器的所有字段。
然而 Kubernetes 禁止使用 `readinessProbe`，因为 Init 容器不能够定义不同于完成（completion）的就绪（readiness）。 
这会在验证过程中强制执行。

<!--
Use `activeDeadlineSeconds` on the Pod and `livenessProbe` on the Container to
prevent Init Containers from failing forever. The active deadline includes Init
Containers.

The name of each app and Init Container in a Pod must be unique; a
validation error is thrown for any Container sharing a name with another.
-->

在 Pod 上使用 `activeDeadlineSeconds`，在容器上使用 `livenessProbe`，这样能够避免 Init 容器一直失败。
这就为 Init 容器活跃设置了一个期限。

在 Pod 中的每个 app 和 Init 容器的名称必须唯一；与任何其它容器共享同一个名称，会在验证时抛出错误。

<!--
### Resources

Given the ordering and execution for Init Containers, the following rules
for resource usage apply:
-->

### 资源

为 Init 容器指定顺序和执行逻辑，下面对资源使用的规则将被应用：

<!--
* The highest of any particular resource request or limit defined on all Init
  Containers is the *effective init request/limit*
* The Pod's *effective request/limit* for a resource is the higher of:
  * the sum of all app Containers request/limit for a resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means
  Init Containers can reserve resources for initialization that are not used
  during the life of the Pod.
* QoS tier of the Pod's *effective QoS tier* is the QoS tier for Init Containers
  and app containers alike.
-->

* 在所有 Init 容器上定义的，任何特殊资源请求或限制的最大值，是 *有效初始请求/限制*
* Pod 对资源的 *有效请求/限制* 要高于：
  * 所有应用容器对某个资源的请求/限制之和
  * 对某个资源的有效初始请求/限制
* 基于有效请求/限制完成调度，这意味着 Init 容器能够为初始化预留资源，这些资源在 Pod 生命周期过程中并没有被使用。
* Pod 的 *有效 QoS 层*，是 Init 容器和应用容器相同的 QoS 层。

<!--
Quota and limits are applied based on the effective Pod request and
limit.

Pod level cgroups are based on the effective Pod request and limit, the
same as the scheduler.
-->

基于有效 Pod 请求和限制来应用配额和限制。
Pod 级别的 cgroups 是基于有效 Pod 请求和限制，和调度器相同。

<!--
### Pod restart reasons

A Pod can restart, causing re-execution of Init Containers, for the following
reasons:

* A user updates the PodSpec causing the Init Container image to change.
  App Container image changes only restart the app Container.
* The Pod infrastructure container is restarted. This is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always,
  forcing a restart, and the Init Container completion record has been lost due
  to garbage collection.
-->

### Pod 重启的原因

Pod 能够重启，会导致 Init 容器重新执行，主要有如下几个原因：

* 用户更新 PodSpec 导致 Init 容器镜像发生改变。应用容器镜像的变更只会重启应用容器。
* Pod 基础设施容器被重启。这不多见，但某些具有 root 权限可访问 Node 的人可能会这样做。
* 当 `restartPolicy` 设置为 Always，Pod 中所有容器会终止，强制重启，由于垃圾收集导致 Init 容器完成的记录丢失。

<!--
## Support and compatibility

A cluster with Apiserver version 1.6.0 or greater supports Init Containers
using the `spec.initContainers` field. Previous versions support Init Containers
using the alpha or beta annotations. The `spec.initContainers` field is also mirrored
into alpha and beta annotations so that Kubelets version 1.3.0 or greater can execute
Init Containers, and so that a version 1.6 apiserver can safely be rolled back to version
1.5.x without losing Init Container functionality for existing created pods.
-->

## 支持与兼容性

Apiserver 版本为 1.6 或更高版本的集群，通过使用 `spec.initContainers` 字段来支持 Init 容器。
之前的版本可以使用 alpha 和 beta 注解支持 Init 容器。
`spec.initContainers` 字段也被加入到 alpha 和 beta 注解中，所以 Kubernetes 1.3.0 版本或更高版本可以执行 Init 容器，并且 1.6 版本的 apiserver 能够安全的回退到 1.5.x 版本，而不会使存在的已创建 Pod 失去 Init 容器的功能。

{% endcapture %}


{% capture whatsnext %}

<!--
* [Creating a Pod that has an Init Container](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)
-->

* [创建具有 Init 容器的 Pod](/docs/tasks/configure-pod-container/configure-pod-initialization/#creating-a-pod-that-has-an-init-container)

{% endcapture %}


{% include templates/concept.md %}
