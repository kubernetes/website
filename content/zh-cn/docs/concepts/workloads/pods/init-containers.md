---
title: Init 容器
content_type: concept
weight: 40
---
<!---
reviewers:
- erictune
title: Init Containers
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
This page provides an overview of init containers: specialized containers that run
before app containers in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Init containers can contain utilities or setup scripts not present in an app image.
-->
本页提供了 Init 容器的概览。Init 容器是一种特殊容器，在 {{< glossary_tooltip text="Pod" term_id="pod" >}}
内的应用容器启动之前运行。Init 容器可以包括一些应用镜像中不存在的实用工具和安装脚本。

<!--
You can specify init containers in the Pod specification alongside the `containers`
array (which describes app containers).
-->
你可以在 Pod 的规约中与用来描述应用容器的 `containers` 数组平行的位置指定
Init 容器。

<!--
In Kubernetes, a [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/) is a container that
starts before the main application container and _continues to run_. This document is about init containers:
containers that run to completion during Pod initialization.
-->
在 Kubernetes 中，[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)
是在主应用容器之前启动并**持续运行**的容器。本文介绍 Init 容器：在 Pod 初始化期间完成运行的容器。

<!-- body -->

<!--
## Understanding init containers

A {{< glossary_tooltip text="Pod" term_id="pod" >}} can have multiple containers
running apps within it, but it can also have one or more init containers, which are run
before the app containers are started.
-->
## 理解 Init 容器   {#understanding-init-containers}

每个 {{< glossary_tooltip text="Pod" term_id="pod" >}} 中可以包含多个容器，
应用运行在这些容器里面，同时 Pod 也可以有一个或多个先于应用容器启动的 Init 容器。

<!--
Init containers are exactly like regular containers, except:

* Init containers always run to completion.
* Each init container must complete successfully before the next one starts.
-->
Init 容器与普通的容器非常像，除了如下两点：

* 它们总是运行到完成。
* 每个都必须在下一个启动之前成功完成。

<!--
If a Pod's init container fails, the kubelet repeatedly restarts that init container until it succeeds.
However, if the Pod has a `restartPolicy` of Never, and an init container fails during startup of that Pod, Kubernetes treats the overall Pod as failed.
-->
如果 Pod 的 Init 容器失败，kubelet 会不断地重启该 Init 容器直到该容器成功为止。
然而，如果 Pod 对应的 `restartPolicy` 值为 "Never"，并且 Pod 的 Init 容器失败，
则 Kubernetes 会将整个 Pod 状态设置为失败。

<!--
To specify an init container for a Pod, add the `initContainers` field into
the [Pod specification](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec),
as an array of `container` items (similar to the app `containers` field and its contents).
See [Container](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container) in the
API reference for more details.

The status of the init containers is returned in `.status.initContainerStatuses`
field as an array of the container statuses (similar to the `.status.containerStatuses`
field).
-->
为 Pod 设置 Init 容器需要在
[Pod 规约](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)中添加 `initContainers` 字段，
该字段以 [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
类型对象数组的形式组织，和应用的 `containers` 数组同级相邻。
参阅 API 参考的[容器](/zh-cn/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)章节了解详情。

Init 容器的状态在 `status.initContainerStatuses` 字段中以容器状态数组的格式返回
（类似 `status.containerStatuses` 字段）。

<!--
### Differences from regular containers

Init containers support all the fields and features of app containers,
including resource limits, [volumes](/docs/concepts/storage/volumes/), and security settings. However, the
resource requests and limits for an init container are handled differently,
as documented in [Resource requests and limits](#resource-sharing-within-containers).
-->
### 与普通容器的不同之处   {#differences-from-regular-containers}

Init 容器支持应用容器的全部字段和特性，包括资源限制、
[数据卷](/zh-cn/docs/concepts/storage/volumes/)和安全设置。
然而，Init 容器对资源请求和限制的处理稍有不同，
在下面[资源请求和限制](#resource-sharing-within-containers)节有说明。

<!--
Regular init containers (in other words: excluding sidecar containers) do not support the
`lifecycle`, `livenessProbe`, `readinessProbe`, or `startupProbe` fields. Init containers
must run to completion before the Pod can be ready; sidecar containers continue running
during a Pod's lifetime, and _do_ support some probes. See [sidecar container](/docs/concepts/workloads/pods/sidecar-containers/)
for further details about sidecar containers.
-->
常规的 Init 容器（即不包括边车容器）不支持 `lifecycle`、`livenessProbe`、`readinessProbe` 或
`startupProbe` 字段。Init 容器必须在 Pod 准备就绪之前完成运行；而边车容器在 Pod 的生命周期内继续运行，
它支持一些探针。有关边车容器的细节请参阅[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers/)。

<!--
If you specify multiple init containers for a Pod, kubelet runs each init
container sequentially. Each init container must succeed before the next can run.
When all of the init containers have run to completion, kubelet initializes
the application containers for the Pod and runs them as usual.
-->
如果为一个 Pod 指定了多个 Init 容器，这些容器会按顺序逐个运行。
每个 Init 容器必须运行成功，下一个才能够运行。当所有的 Init 容器运行完成时，
Kubernetes 才会为 Pod 初始化应用容器并像平常一样运行。

<!--
### Differences from sidecar containers

Init containers run and complete their tasks before the main application container starts.
Unlike [sidecar containers](/docs/concepts/workloads/pods/sidecar-containers),
init containers are not continuously running alongside the main containers.
-->
### 与边车容器的不同之处   {#differences-from-sidecar-containers}

Init 容器在主应用容器启动之前运行并完成其任务。
与[边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers)不同，
Init 容器不会持续与主容器一起运行。

<!--
Init containers run to completion sequentially, and the main container does not start
until all the init containers have successfully completed.

init containers do not support `lifecycle`, `livenessProbe`, `readinessProbe`, or
`startupProbe` whereas sidecar containers support all these [probes](/docs/concepts/workloads/pods/probes/#types-of-probe) to control their lifecycle.
-->
Init 容器按顺序完成运行，等到所有 Init 容器成功完成之后，主容器才会启动。

Init 容器不支持 `lifecycle`、`livenessProbe`、`readinessProbe` 或 `startupProbe`，
而边车容器支持所有这些[探针](/zh-cn/docs/concepts/workloads/pods/probes/#types-of-probe)以控制其生命周期。

<!--
Init containers share the same resources (CPU, memory, network) with the main application
containers but do not interact directly with them. They can, however, use shared volumes
for data exchange.
-->
Init 容器与主应用容器共享资源（CPU、内存、网络），但不直接与主应用容器进行交互。
不过这些容器可以使用共享卷进行数据交换。

<!--
## Using init containers

Because init containers have separate images from app containers, they
have some advantages for start-up related code:

* Init containers can contain utilities or custom code for setup that are not present in an app
  image. For example, there is no need to make an image `FROM` another image just to use a tool like
  `sed`, `awk`, `python`, or `dig` during setup.
* The application image builder and deployer roles can work independently without
  the need to jointly build a single app image.
-->
## 使用 Init 容器   {#using-init-containers}

因为 Init 容器具有与应用容器分离的单独镜像，其启动相关代码具有如下优势：

* Init 容器可以包含一些安装过程中应用容器中不存在的实用工具或个性化代码。
  例如，没有必要仅为了在安装过程中使用类似 `sed`、`awk`、`python` 或 `dig`
  这样的工具而去 `FROM` 一个镜像来生成一个新的镜像。

* 应用镜像的创建者和部署者可以各自独立工作，而没有必要联合构建一个单独的应用镜像。

<!--
* Init containers can run with a different view of the filesystem than app containers in the
  same Pod. Consequently, they can be given access to
  {{< glossary_tooltip text="Secrets" term_id="secret" >}} that app containers cannot access.
* Because init containers run to completion before any app containers start, init containers offer
  a mechanism to block or delay app container startup until a set of preconditions are met. Once
  preconditions are met, all of the app containers in a Pod can start in parallel.
* Init containers can securely run utilities or custom code that would otherwise make an app
  container image less secure. By keeping unnecessary tools separate you can limit the attack
  surface of your app container image.
-->
* 与同一 Pod 中的多个应用容器相比，Init 容器能以不同的文件系统视图运行。因此，Init
  容器可以被赋予访问应用容器不能访问的 {{< glossary_tooltip text="Secret" term_id="secret" >}} 的权限。

* 由于 Init 容器必须在应用容器启动之前运行完成，因此 Init
  容器提供了一种机制来阻塞或延迟应用容器的启动，直到满足了一组先决条件。
  一旦前置条件满足，Pod 内的所有的应用容器会并行启动。

* Init 容器可以安全地运行实用程序或自定义代码，而在其他方式下运行这些实用程序或自定义代码可能会降低应用容器镜像的安全性。
  通过将不必要的工具分开，你可以限制应用容器镜像的被攻击范围。

<!--
### Examples

Here are some ideas for how to use init containers:

* Wait for a {{< glossary_tooltip text="Service" term_id="service">}} to
  be created, using a shell one-line command like:
-->
### 示例  {#examples}

下面是一些如何使用 Init 容器的想法：

* 使用类似如下一行 Shell 命令，等待
  {{< glossary_tooltip text="Service" term_id="service">}} 完成创建：

  ```shell
  for i in {1..100}; do sleep 1; if nslookup myservice; then exit 0; fi; done; exit 1
  ```

<!--
* Register this Pod with a remote server from the downward API with a command like:
-->
* 使用类似如下的命令，从 Downward API 注册此 Pod 到远程服务器：

  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```

<!--
* Wait for some time before starting the app container with a command like
-->
* 使用类似命令，在启动应用容器之前等一段时间：

  ```shell
  sleep 60
  ```

<!--
* Clone a Git repository into a {{< glossary_tooltip text="Volume" term_id="volume" >}}

* Place values into a configuration file and run a template tool to dynamically
  generate a configuration file for the main app container. For example,
  place the `POD_IP` value in a configuration and generate the main app
  configuration file using Jinja.
-->
* 克隆 Git 仓库到{{< glossary_tooltip text="卷" term_id="volume" >}}中。

* 将配置值放到配置文件中，运行模板工具为主应用容器动态地生成配置文件。
  例如，在配置文件中存放 `POD_IP` 值，并使用 Jinja 生成主应用配置文件。

<!--
#### Init containers in use

This example defines a simple Pod that has two init containers.
The first waits for `myservice`, and the second waits for `mydb`. Once both
init containers complete, the Pod runs the app container from its `spec` section.
-->
#### 使用 Init 容器的情况   {#init-containers-in-use}

下面的例子定义了一个具有 2 个 Init 容器的简单 Pod。 第一个等待 `myservice` 启动，
第二个等待 `mydb` 启动。 一旦这两个 Init 容器都启动完成，Pod 将启动 `spec` 节中的应用容器。

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-pod
  labels:
    app.kubernetes.io/name: MyApp
spec:
  containers:
  - name: myapp-container
    image: busybox:1.28
    command: ['sh', '-c', 'echo The app is running! && sleep 3600']
  initContainers:
  - name: init-myservice
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup myservice.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for myservice; sleep 2; done"]
  - name: init-mydb
    image: busybox:1.28
    command: ['sh', '-c', "until nslookup mydb.$(cat /var/run/secrets/kubernetes.io/serviceaccount/namespace).svc.cluster.local; do echo waiting for mydb; sleep 2; done"]
```

<!--
You can start this Pod by running:
-->
你可以运行下面的命令启动 Pod：

```shell
kubectl apply -f myapp.yaml
```
<!--
The output is similar to this:
-->
输出类似于：

```
pod/myapp-pod created
```

<!--
And check on its status with:
-->
使用下面的命令检查其状态：

```shell
kubectl get -f myapp.yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

<!--
or for more details:
-->
或者查看更多详细信息：

```shell
kubectl describe -f myapp.yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```
Name:          myapp-pod
Namespace:     default
[...]
Labels:        app.kubernetes.io/name=MyApp
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
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Created       Created container init-myservice
  13s          13s         1        {kubelet 172.17.4.201}    spec.initContainers{init-myservice}     Normal        Started       Started container init-myservice
```

<!--
To see logs for the init containers in this Pod, run:
-->
如需查看 Pod 内 Init 容器的日志，请执行：

```shell
kubectl logs myapp-pod -c init-myservice # 查看第一个 Init 容器
kubectl logs myapp-pod -c init-mydb      # 查看第二个 Init 容器
```

<!--
At this point, those init containers will be waiting to discover {{< glossary_tooltip text="Services" term_id="service" >}} named
`mydb` and `myservice`.

Here's a configuration you can use to make those Services appear:
-->
在这一刻，Init 容器将会等待至发现名称为 `mydb` 和 `myservice`
的{{< glossary_tooltip text="服务" term_id="service" >}}。

如下为创建这些 Service 所需的配置文件：

```yaml
---
apiVersion: v1
kind: Service
metadata:
  name: myservice
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9376
---
apiVersion: v1
kind: Service
metadata:
  name: mydb
spec:
  ports:
  - protocol: TCP
    port: 80
    targetPort: 9377
```

<!--
To create the `mydb` and `myservice` services:
-->
创建 `mydb` 和 `myservice` 服务：

```shell
kubectl apply -f services.yaml
```

<!--
The output is similar to this:
-->
输出类似于：

```
service/myservice created
service/mydb created
```

<!--
You'll then see that those init containers complete, and that the `myapp-pod`
Pod moves into the Running state:
-->
这样你将能看到这些 Init 容器执行完毕，随后 `myapp-pod` 进入 `Running` 状态：

```shell
kubectl get -f myapp.yaml
```
<!--
The output is similar to this:
-->
输出类似于：

```
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

<!--
This simple example should provide some inspiration for you to create your own
init containers. [What's next](#what-s-next) contains a link to a more detailed example.
-->
这个简单例子应该能为你创建自己的 Init 容器提供一些启发。
[接下来](#what-s-next)一节提供了更详细例子的链接。

<!--
## Detailed behavior

During Pod startup, the kubelet delays running init containers until the networking
and storage are ready. Then the kubelet runs the Pod's init containers in the order
they appear in the Pod's spec.
-->
## 具体行为 {#detailed-behavior}

在 Pod 启动过程中，每个 Init 容器会在网络和数据卷初始化之后按顺序启动。
kubelet 运行依据 Init 容器在 Pod 规约中的出现顺序依次运行之。

<!--
Each init container must exit successfully before
the next container starts. If a container fails to start due to the runtime or
exits with failure, it is retried according to the Pod `restartPolicy`. However,
if the Pod `restartPolicy` is set to Always, the init containers use
`restartPolicy` OnFailure.
-->
每个 Init 容器成功退出后才会启动下一个 Init 容器。
如果某容器因为容器运行时的原因无法启动，或以错误状态退出，kubelet 会根据
Pod 的 `restartPolicy` 策略进行重试。
然而，如果 Pod 的 `restartPolicy` 设置为 "Always"，Init 容器失败时会使用
`restartPolicy` 的 "OnFailure" 策略。

<!--
A Pod cannot be `Ready` until all init containers have succeeded. The ports on an
init container are not aggregated under a Service. A Pod that is initializing
is in the `Pending` state but should have a condition `Initialized` set to false.

If the Pod [restarts](#pod-restart-reasons), or is restarted, all init containers
must execute again.
-->
在所有的 Init 容器没有成功之前，Pod 将不会变成 `Ready` 状态。
Init 容器的端口将不会在 Service 中进行聚集。正在初始化中的 Pod 处于 `Pending` 状态，
但会将状况 `Initialized` 设置为 false。

如果 Pod [重启](#pod-restart-reasons)，所有 Init 容器必须重新执行。

<!--
Changes to the init container spec are limited to the container image field.
Directly altering the `image` field of  an init container does _not_ restart the
Pod or trigger its recreation. If the Pod has yet to start, that change may
have an effect on how the Pod boots up.

For a [pod template](/docs/concepts/workloads/pods/#pod-templates)
you can typically change any field for an init container; the impact of making
that change depends on where the pod template is used.
-->
对 Init 容器规约的修改仅限于容器的 `image` 字段。
直接更改 Init 容器的 `image` 字段**不会**重启该 Pod 或触发其重新创建。
如果该 Pod 尚未启动，则该更改可能会影响 Pod 的启动方式。

对于 [Pod 模板](/zh-cn/docs/concepts/workloads/pods/#pod-templates)，你通常可以更改
Init 容器的任何字段；更改的影响取决于 Pod 模板的使用位置。

<!--
Because init containers can be restarted, retried, or re-executed, init container
code should be idempotent. In particular, code that writes into any `emptyDir` volume
should be prepared for the possibility that an output file already exists.
-->
因为 Init 容器可能会被重启、重试或者重新执行，所以 Init 容器的代码应该是幂等的。
特别地，向任何 `emptyDir` 卷写入数据的代码应该对输出文件可能已经存在做好准备。

<!--
Init containers have all of the fields of an app container. However, Kubernetes
prohibits `readinessProbe` from being used because init containers cannot
define readiness distinct from completion. This is enforced during validation.
-->
Init 容器具有应用容器的所有字段。然而 Kubernetes 禁止使用 `readinessProbe`，
因为 Init 容器不能定义不同于完成态（Completion）的就绪态（Readiness）。
Kubernetes 会在校验时强制执行此检查。

<!--
Use `activeDeadlineSeconds` on the Pod to prevent init containers from failing forever.
The active deadline includes init containers.
However it is recommended to use `activeDeadlineSeconds` only if teams deploy their application
as a Job, because `activeDeadlineSeconds` has an effect even after initContainer finished.
The Pod which is already running correctly would be killed by `activeDeadlineSeconds` if you set.

The name of each app and init container in a Pod must be unique; a
validation error is thrown for any container sharing a name with another.
-->
在 Pod 上使用 `activeDeadlineSeconds` 可以避免 Init 容器一直重复失败。
`activeDeadlineSeconds` 时间包含了 Init 容器启动的时间。
但建议仅在团队将其应用部署为 Job 时才使用 `activeDeadlineSeconds`，
因为 `activeDeadlineSeconds` 在 Init 容器结束后仍有效果。
如果你设置了 `activeDeadlineSeconds`，已经在正常运行的 Pod 会被杀死。

在 Pod 中的每个应用容器和 Init 容器的名称必须唯一；
与任何其它容器共享同一个名称，会在校验时抛出错误。

<!--
### Resource requests and limits {#resource-sharing-within-containers}

The scheduler places a Pod on a node based on how much of each resource the Pod
requests as a whole, so the requests that you set on init containers can affect
whether and where the Pod can be scheduled.
-->
### 资源请求和限制   {#resource-sharing-within-containers}

调度器根据 Pod 整体请求的每种资源的数量来决定把 Pod 放置到哪个节点上，
因此你在 Init 容器上设置的请求会影响到 Pod 能否被调度以及被调度到何处。

<!--
Init containers run one at a time and finish before the app containers start,
so Kubernetes does not add their requests to each other or to those of the app containers.
Instead, the Pod requests enough resources to run its largest init container.
If the largest init container request is more than the sum of the requests of the
containers that run after initialization, the request of the Pod is based on that
init container request.
The node keeps this larger request reserved for the Pod even after initialization finishes.
-->
Init 容器逐个运行，并在应用容器启动之前结束，
因此 Kubernetes 不会把它们的请求相互累加，也不会累加到应用容器的请求上。
相反，Pod 会请求足以运行其中最大 Init 容器的资源量。
如果最大的 Init 容器的请求量超过了初始化之后运行的各个容器的请求量之和，
则 Pod 的请求量以该 Init 容器的请求量为准。
即使初始化已经完成，节点仍会为这个 Pod 保留这一较大的请求量。

<!--
See [Effective Pod requests and limits](/docs/concepts/resource-management/effective-pod-requests-limits/)
to learn how Kubernetes calculates the requests and limits of a Pod, with examples.
-->
参阅[有效的 Pod 请求和限制](/docs/concepts/resource-management/effective-pod-requests-limits/)，
了解 Kubernetes 如何计算 Pod 的请求和限制，其中附有示例。

<!--
### Pod restart reasons

A Pod can restart, causing re-execution of init containers, for the following
reasons:
-->
### Pod 重启的原因  {#pod-restart-reasons}

Pod 重启会导致 Init 容器重新执行，主要有如下几个原因：

<!--
* The Pod infrastructure container is restarted. This is uncommon and would
  have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always,
  forcing a restart, and the init container completion record has been lost due
  to {{< glossary_tooltip text="garbage collection" term_id="garbage-collection" >}}.
-->
* Pod 的基础设施容器 (译者注：如 `pause` 容器) 被重启。这种情况不多见，
  必须由具备 root 权限访问节点的人员来完成。

* 当 `restartPolicy` 设置为 `Always`，Pod 中所有容器会终止而强制重启。
  由于{{< glossary_tooltip text="垃圾回收" term_id="garbage-collection" >}}机制的原因，
  Init 容器的完成记录将会丢失。

<!--
The Pod will not be restarted when the init container image is changed, or the
init container completion record has been lost due to garbage collection. This
applies for Kubernetes v1.20 and later. If you are using an earlier version of
Kubernetes, consult the documentation for the version you are using.
-->
当 Init 容器的镜像发生改变或者 Init 容器的完成记录因为垃圾收集等原因被丢失时，
Pod 不会被重启。这一行为适用于 Kubernetes v1.20 及更新版本。
如果你在使用较早版本的 Kubernetes，可查阅你所使用的版本对应的文档。

## {{% heading "whatsnext" %}}

<!--
Learn more about the following:
* [Creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container).
* [Debug init containers](/docs/tasks/debug/debug-application/debug-init-containers/).
* Overview of [kubelet](/docs/reference/command-line-tools-reference/kubelet/) and [kubectl](/docs/reference/kubectl/).
* [Types of probes](/docs/concepts/workloads/pods/probes/#types-of-probe): liveness, readiness, startup probe.
* [Sidecar containers](/docs/concepts/workloads/pods/sidecar-containers).
-->
进一步了解以下内容：

* [创建包含 Init 容器的 Pod](/zh-cn/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* [调试 Init 容器](/zh-cn/docs/tasks/debug/debug-application/debug-init-containers/)
* [kubelet](/zh-cn/docs/reference/command-line-tools-reference/kubelet/) 和
  [kubectl](/zh-cn/docs/reference/kubectl/) 的概述。
* [探针类型](/zh-cn/docs/concepts/workloads/pods/probes/#types-of-probe)：
  存活态探针、就绪态探针、启动探针。
* [边车容器](/zh-cn/docs/concepts/workloads/pods/sidecar-containers)。
