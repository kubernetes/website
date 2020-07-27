---
approvers:
- erictune
title: Init 容器
content_type: concept
---

<!-- overview -->

<!--
This page provides an overview of init containers: specialized containers that run before app containers in a {{< glossary_tooltip text="Pod" term_id="pod" >}}.
Init containers can contain utilities or setup scripts not present in an app image.
-->

本页提供了 Init 容器的概览，它是一种专用的容器，在{{< glossary_tooltip text="Pod" term_id="pod" >}}内的应用容器启动之前运行，并包括一些应用镜像中不存在的实用工具和安装脚本。



<!--
  You can specify init containers in the Pod specification alongside the `containers` array (which describes app containers).
-->
你可以在Pod的规格信息中与containers数组同级的位置指定 Init 容器。
<!-- body -->


<!--
## Understanding init containers

A {{< glossary_tooltip text="Pod" term_id="pod" >}} can have multiple containers running apps within it, but it can also have one or more init containers, which are run before the app containers are started.

-->

## 理解 Init 容器



{{< glossary_tooltip text="Pod" term_id="pod" >}} 可以包含多个容器，应用运行在这些容器里面，同时 Pod 也可以有一个或多个先于应用容器启动的 Init 容器。


<!--
Init containers are exactly like regular containers, except:
* Init containers always run to completion.
* Each init container must complete successfully before the next one starts.
-->
Init 容器与普通的容器非常像，除了如下两点：

* 它们总是运行到完成。
* 每个都必须在下一个启动之前成功完成。


<!--
If a Pod's init container fails, Kubernetes repeatedly restarts the Pod until the init container succeeds. However, if the Pod has a `restartPolicy` of Never, Kubernetes does not restart the Pod.
-->
如果 Pod 的 Init 容器失败，Kubernetes 会不断地重启该 Pod，直到 Init 容器成功为止。然而，如果 Pod 对应的 `restartPolicy` 值为 Never，它不会重新启动。


<!--
To specify an init container for a Pod, add the `initContainers` field into the Pod specification, as an array of objects of type [Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core), alongside the app `containers` array.

The status of the init containers is returned in `.status.initContainerStatuses` field as an array of the container statuses (similar to the `.status.containerStatuses` field).
-->
指定容器为 Init 容器，需要在 Pod 的 spec 中添加 `initContainers` 字段， 该字段內以[Container](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core) 类型对象数组的形式组织，和应用的 `containers` 数组同级相邻。
Init 容器的状态在 `status.initContainerStatuses` 字段中以容器状态数组的格式返回（类似 `status.containerStatuses` 字段）。


<!--
### Differences from regular containers
Init containers support all the fields and features of app containers, including resource limits, volumes, and security settings. However, the resource requests and limits for an init container are handled differently, as documented in [Resources](#resources).
Also, init containers do not support `lifecycle`, `livenessProbe`, `readinessProbe`, or `startupProbe` because they must run to completion before the Pod can be ready.
If you specify multiple init containers for a Pod, Kubelet runs each init container sequentially. Each init container must succeed before the next can run. When all of the init containers have run to completion, Kubelet initializes the application containers for the Pod and runs them as usual.
-->

### 与普通容器的不同之处

Init 容器支持应用容器的全部字段和特性，包括资源限制、数据卷和安全设置。 然而，Init 容器对资源请求和限制的处理稍有不同，在下面 [资源](#资源) 处有说明。

同时 Init 容器不支持 `lifecycle`、`livenessProbe`、`readinessProbe` 和 `startupProbe`，因为它们必须在 Pod 就绪之前运行完成。

如果为一个 Pod 指定了多个 Init 容器，这些容器会按顺序逐个运行。每个 Init 容器必须运行成功，下一个才能够运行。当所有的 Init 容器运行完成时，Kubernetes 才会为 Pod 初始化应用容器并像平常一样运行。


<!--
## Using init containers
Because init containers have separate images from app containers, they have some advantages for start-up related code:
* Init containers can contain utilities or custom code for setup that are not present in an app image. For example, there is no need to make an image `FROM` another image just to use a tool like `sed`, `awk`, `python`, or `dig` during setup.
* Init containers can securely run utilities that would make an app container image less secure.
* The application image builder and deployer roles can work independently without the need to jointly build a single app image.
* Init containers can run with a different view of the filesystem than app containers in the same Pod. Consequently, they can be given access to {{< glossary_tooltip text="Secrets" term_id="secret" >}} that app containers cannot access.
* Because init containers run to completion before any app containers start, init containers offer a mechanism to block or delay app container startup until a set of preconditions are met. Once preconditions are met, all of the app containers in a Pod can start in parallel.
-->
## Init 容器能做什么？

因为 Init 容器具有与应用容器分离的单独镜像，其启动相关代码具有如下优势：

* Init 容器可以包含一些安装过程中应用容器中不存在的实用工具或个性化代码。例如，没有必要仅为了在安装过程中使用类似 `sed`、 `awk`、 `python` 或 `dig` 这样的工具而去`FROM` 一个镜像来生成一个新的镜像。
* Init 容器可以安全地运行这些工具，避免这些工具导致应用镜像的安全性降低。
* 应用镜像的创建者和部署者可以各自独立工作，而没有必要联合构建一个单独的应用镜像。
* Init 容器能以不同于Pod内应用容器的文件系统视图运行。因此，Init容器可具有访问 {{< glossary_tooltip text="Secrets" term_id="secret" >}} 的权限，而应用容器不能够访问。
* 由于 Init 容器必须在应用容器启动之前运行完成，因此 Init 容器提供了一种机制来阻塞或延迟应用容器的启动，直到满足了一组先决条件。一旦前置条件满足，Pod内的所有的应用容器会并行启动。


<!--
### Examples
Here are some ideas for how to use init containers:
* Wait for a {{< glossary_tooltip text="Service" term_id="service">}} to
  be created, using a shell one-line command like:
  ```shell
  for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; done; exit 1
  ```
 * Register this Pod with a remote server from the downward API with a command like:
  ```shell
  curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'
  ```
* Wait for some time before starting the app container with a command like
  ```shell
  sleep 60
  ```

* Clone a Git repository into a {{< glossary_tooltip text="Volume" term_id="volume" >}}
* Place values into a configuration file and run a template tool to dynamically generate a configuration file for the main app container. For example, place the `POD_IP` value in a configuration and generate the main app configuration file using Jinja.

-->

### 示例

下面是一些如何使用 Init 容器的想法：

* 等待一个 Service 完成创建，通过类似如下 shell 命令：

        for i in {1..100}; do sleep 1; if dig myservice; then exit 0; fi; exit 1

* 注册这个 Pod 到远程服务器，通过在命令中调用 API，类似如下：

        curl -X POST http://$MANAGEMENT_SERVICE_HOST:$MANAGEMENT_SERVICE_PORT/register -d 'instance=$(<POD_NAME>)&ip=$(<POD_IP>)'

* 在启动应用容器之前等一段时间，使用类似命令：

        sleep 60

* 克隆 Git 仓库到 {{< glossary_tooltip text="Volume" term_id="volume" >}}。
* 将配置值放到配置文件中，运行模板工具为主应用容器动态地生成配置文件。例如，在配置文件中存放 POD_IP 值，并使用 Jinja 生成主应用配置文件。


<!--
#### Init containers in use
This example defines a simple Pod that has two init containers. The first waits for `myservice`, and the second waits for `mydb`. Once both init containers complete, the Pod runs the app container from its `spec` section.
```yaml

```

The following YAML file outlines the `mydb` and `myservice` services:
```yaml

```


You can start this Pod by running:
```shell
```

And check on its status with:
 ```shell
```
-->
### 使用 Init 容器

下面的例子定义了一个具有 2 个 Init 容器的简单 Pod。 第一个等待  `myservice` 启动，第二个等待 `mydb` 启动。 一旦这两个 Init容器 都启动完成，Pod 将启动`spec`区域中的应用容器。

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


要启动这个 Pod，可以执行如下命令：

```
kubectl apply -f myapp.yaml
```

```
pod/myapp-pod created
```



要检查其状态：
```
kubectl get -f myapp.yaml
```

```
NAME        READY     STATUS     RESTARTS   AGE
myapp-pod   0/1       Init:0/2   0          6m
```

如需更详细的信息：

```
kubectl describe -f myapp.yaml
```

```
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
```

如需查看Pod内 Init 容器的日志，请执行:

```
$ kubectl logs myapp-pod -c init-myservice # Inspect the first init container
$ kubectl logs myapp-pod -c init-mydb      # Inspect the second init container
```

<!--
At this point, those init containers will be waiting to discover Services named `mydb` and `myservice`.

Here's a configuration you can use to make those Services appear:
-->

在这一刻，Init 容器将会等待至发现名称为`mydb`和`myservice`的 Service。

如下为创建这些 Service 的配置文件：

```
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


创建`mydb`和`myservice`的 service 命令：

```shell
$ kubectl create -f services.yaml
```

```
service "myservice" created
service "mydb" created
```

这样你将能看到这些 Init容器 执行完毕，随后`my-app`的Pod转移进入 Running 状态：
```shell
$ kubectl get -f myapp.yaml
```
```shell
NAME        READY     STATUS    RESTARTS   AGE
myapp-pod   1/1       Running   0          9m
```

一旦我们启动了 `mydb` 和 `myservice` 这两个 Service，我们能够看到 Init 容器完成，并且 `myapp-pod` 被创建：


<!--
This simple example should provide some inspiration for you to create your own init containers. [What's next](#what-s-next) contains a link to a more detailed example.
-->
这个简单的例子应该能为你创建自己的 Init 容器提供一些启发。 [What's next](#what-s-next) 部分提供了更详细例子的链接。


<!--
During the startup of a Pod, each init container starts in order, after the network and volumes are initialized. Each container must exit successfully before the next container starts. If a container fails to start due to the runtime or exits with failure, it is retried according to the Pod `restartPolicy`. However, if the Pod `restartPolicy` is set to Always, the init containers use `restartPolicy` OnFailure.

A Pod cannot be `Ready` until all init containers have succeeded. The ports on an init container are not aggregated under a Service. A Pod that is initializing
 is in the `Pending` state but should have a condition `Initializing` set to true.

If the Pod [restarts](#pod-restart-reasons), or is restarted, all init containers must execute again.

Changes to the init container spec are limited to the container image field. Altering an init container image field is equivalent to restarting the Pod.

Because init containers can be restarted, retried, or re-executed, init container code should be idempotent. In particular, code that writes to files on `EmptyDirs` should be prepared for the possibility that an output file already exists.

Init containers have all of the fields of an app container. However, Kubernetes prohibits `readinessProbe` from being used because init containers cannot define readiness distinct from completion. This is enforced during validation.

Use `activeDeadlineSeconds` on the Pod and `livenessProbe` on the container to prevent init containers from failing forever. The active deadline includes init containers.

The name of each app and init container in a Pod must be unique; avalidation error is thrown for any container sharing a name with another.

-->

## 具体行为

在 Pod 启动过程中，每个Init 容器在网络和数据卷初始化之后会按顺序启动。每个 Init容器 成功退出后才会启动下一个 Init容器。 如果因为运行或退出时失败引发容器启动失败，它会根据 Pod 的 `restartPolicy` 策略进行重试。
然而，如果 Pod 的 `restartPolicy` 设置为 Always，Init 容器失败时会使用 `restartPolicy` 的 OnFailure 策略。

在所有的 Init 容器没有成功之前，Pod 将不会变成 `Ready` 状态。 Init 容器的端口将不会在 Service 中进行聚集。 正在初始化中的 Pod 处于 `Pending` 状态，但会将条件 `Initializing` 设置为 true。

如果 Pod [重启](#pod-restart-reasons)，所有 Init 容器必须重新执行。

对 Init 容器 spec 的修改仅限于容器的 image 字段。 更改 Init 容器的 image 字段，等同于重启该 Pod。

因为 Init 容器可能会被重启、重试或者重新执行，所以 Init 容器的代码应该是幂等的。 特别地，基于 `EmptyDirs` 写文件的代码，应该对输出文件可能已经存在做好准备。

Init 容器具有应用容器的所有字段。 然而 Kubernetes 禁止使用 `readinessProbe`，因为 Init 容器不能定义不同于完成（completion）的就绪（readiness）。 这一点会在校验时强制执行。

在 Pod 上使用 `activeDeadlineSeconds`和在容器上使用 `livenessProbe` 可以避免 Init 容器一直重复失败。 `activeDeadlineSeconds` 时间包含了 Init 容器启动的时间。

在 Pod 中的每个应用容器和 Init 容器的名称必须唯一；与任何其它容器共享同一个名称，会在校验时抛出错误。


<!--
 ### Resources
Given the ordering and execution for init containers, the following rules for resource usage apply:
* The highest of any particular resource request or limit defined on all init containers is the *effective init request/limit*
* The Pod's *effective request/limit* for a resource is the higher of:
  * the sum of all app containers request/limit for a resource
  * the effective init request/limit for a resource
* Scheduling is done based on effective requests/limits, which means init containers can reserve resources for initialization that are not used during the life of the Pod.
* The QoS (quality of service) tier of the Pod's *effective QoS tier* is the QoS tier for init containers and app containers alike.

Quota and limits are applied based on the effective Pod request and limit.
Pod level control groups (cgroups) are based on the effective Pod request and limit, the same as the scheduler.
-->

### 资源

给定Init 容器的执行顺序下，资源使用适用于如下规则：

* 所有 Init 容器上定义的任何特定资源的 limit 或 request 的最大值，作为 Pod *有效初始 request/limit*
* Pod 对资源的 *有效 limit/request* 是如下两者的较大者：
  * 所有应用容器对某个资源的 limit/request 之和
  * 对某个资源的有效初始 limit/request
* 基于有效 limit/request 完成调度，这意味着 Init 容器能够为初始化过程预留资源，这些资源在 Pod 生命周期过程中并没有被使用。
* Pod 的 *有效 QoS 层* ，与 Init 容器和应用容器的一样。

配额和限制适用于有效 Pod的 limit/request。
Pod 级别的 cgroups 是基于有效 Pod 的 limit/request，和调度器相同。


<!--
 ### Pod restart reasons
A Pod can restart, causing re-execution of init containers, for the following reasons:
* A user updates the Pod specification, causing the init container image to change. Any changes to the init container image restarts the Pod. App container image changes only restart the app container.
* The Pod infrastructure container is restarted. This is uncommon and would have to be done by someone with root access to nodes.
* All containers in a Pod are terminated while `restartPolicy` is set to Always, forcing a restart, and the init container completion record has been lost due to garbage collection.


-->
### Pod 重启的原因

Pod重启导致 Init 容器重新执行，主要有如下几个原因：

* 用户更新 Pod 的 Spec 导致 Init 容器镜像发生改变。Init 容器镜像的变更会引起 Pod 重启. 应用容器镜像的变更仅会重启应用容器。
* Pod 的基础设施容器 (译者注：如 pause 容器) 被重启。 这种情况不多见，必须由具备 root 权限访问 Node 的人员来完成。
* 当 `restartPolicy` 设置为 Always，Pod 中所有容器会终止而强制重启，由于垃圾收集导致 Init 容器的完成记录丢失。





## {{% heading "whatsnext" %}}


<!--
* Read about [creating a Pod that has an init container](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* Learn how to [debug init containers](/docs/tasks/debug-application-cluster/debug-init-containers/)
-->

* 阅读[创建包含 Init 容器的 Pod](/docs/tasks/configure-pod-container/configure-pod-initialization/#create-a-pod-that-has-an-init-container)
* 学习如何[调测 Init 容器](/docs/tasks/debug-application-cluster/debug-init-containers/)
