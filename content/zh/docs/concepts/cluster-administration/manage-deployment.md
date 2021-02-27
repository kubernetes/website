---
title: 管理资源
content_type: concept
weight: 40
---

<!-- overview -->

<!--
You've deployed your application and exposed it via a service. Now what? Kubernetes provides a number of tools to help you manage your application deployment, including scaling and updating. Among the features that we will discuss in more depth are [configuration files](/docs/concepts/configuration/overview/) and [labels](/docs/concepts/overview/working-with-objects/labels/).
 -->
你已经部署了应用并通过服务暴露它。然后呢？
Kubernetes 提供了一些工具来帮助管理你的应用部署，包括扩缩容和更新。
我们将更深入讨论的特性包括
[配置文件](/zh/docs/concepts/configuration/overview/)和
[标签](/zh/docs/concepts/overview/working-with-objects/labels/)。

<!-- body -->

<!--
## Organizing resource configurations

Many applications require multiple resources to be created, such as a Deployment and a Service. Management of multiple resources can be simplified by grouping them together in the same file (separated by  in YAML). For example:
 -->
## 组织资源配置

许多应用需要创建多个资源，例如 Deployment 和 Service。
可以通过将多个资源组合在同一个文件中（在 YAML 中以 `---` 分隔）
来简化对它们的管理。例如：

{{< codenew file="application/nginx-app.yaml" >}}

<!--
Multiple resources can be created the same way as a single resource:
 -->
可以用创建单个资源相同的方式来创建多个资源：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```
service/my-nginx-svc created
deployment.apps/my-nginx created
```

<!--
The resources will be created in the order they appear in the file. Therefore, it's best to specify the service first, since that will ensure the scheduler can spread the pods associated with the service as they are created by the controller(s), such as Deployment.
 -->
资源将按照它们在文件中的顺序创建。
因此，最好先指定服务，这样在控制器（例如 Deployment）创建 Pod 时能够
确保调度器可以将与服务关联的多个 Pod 分散到不同节点。

<!--
`kubectl apply` also accepts multiple `-f` arguments:
 -->
`kubectl create` 也接受多个 `-f` 参数:

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

<!--
And a directory can be specified rather than or in addition to individual files:
 -->
还可以指定目录路径，而不用添加多个单独的文件：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/
```

<!--
`kubectl` will read any files with suffixes `.yaml`, `.yml`, or `.json`.

It is a recommended practice to put resources related to the same microservice or application tier into the same file, and to group all of the files associated with your application in the same directory. If the tiers of your application bind to each other using DNS, then you can then simply deploy all of the components of your stack en masse.

A URL can also be specified as a configuration source, which is handy for deploying directly from configuration files checked into github:
 -->
`kubectl` 将读取任何后缀为 `.yaml`、`.yml` 或者 `.json` 的文件。

建议的做法是，将同一个微服务或同一应用层相关的资源放到同一个文件中，
将同一个应用相关的所有文件按组存放到同一个目录中。
如果应用的各层使用 DNS 相互绑定，那么你可以简单地将堆栈的所有组件一起部署。

还可以使用 URL 作为配置源，便于直接使用已经提交到 Github 上的配置文件进行部署：

```shell
kubectl apply -f https://raw.githubusercontent.com/kubernetes/website/master/content/zh/examples/application/nginx/nginx-deployment.yaml
```

```
deployment.apps/my-nginx created
```

<!--
## Bulk operations in kubectl

Resource creation isn't the only operation that `kubectl` can perform in bulk. It can also extract resource names from configuration files in order to perform other operations, in particular to delete the same resources you created:
 -->
## kubectl 中的批量操作

资源创建并不是 `kubectl` 可以批量执行的唯一操作。
`kubectl` 还可以从配置文件中提取资源名，以便执行其他操作，
特别是删除你之前创建的资源：

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
In the case of just two resources, it's also easy to specify both on the command line using the resource/name syntax:
 -->
在仅有两种资源的情况下，可以使用"资源类型/资源名"的语法在命令行中
同时指定这两个资源：

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

<!--
For larger numbers of resources, you'll find it easier to specify the selector (label query) specified using `-l` or `--selector`, to filter resources by their labels:
-->
对于资源数目较大的情况，你会发现使用 `-l` 或 `--selector` 
指定筛选器（标签查询）能很容易根据标签筛选资源：

```shell
kubectl delete deployment,services -l app=nginx
```

```
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
Because `kubectl` outputs resource names in the same syntax it accepts, it's easy to chain operations using `$()` or `xargs`:
-->
由于 `kubectl` 用来输出资源名称的语法与其所接受的资源名称语法相同，
所以很容易使用 `$()` 或 `xargs` 进行链式操作：

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service)
```

```
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

<!--
With the above commands, we first create resources under `examples/application/nginx/` and print the resources created with `-o name` output format
(print each resource as resource/name). Then we `grep` only the "service", and then print it with `kubectl get`.
 -->
上面的命令中，我们首先使用 `examples/application/nginx/` 下的配置文件创建资源，
并使用 `-o name` 的输出格式（以"资源/名称"的形式打印每个资源）打印所创建的资源。
然后，我们通过 `grep` 来过滤 "service"，最后再打印 `kubectl get` 的内容。

<!--
If you happen to organize your resources across several subdirectories within a particular directory, you can recursively perform the operations on the subdirectories also, by specifying `--recursive` or `-R` alongside the `--filename,-f` flag.
 -->
如果你碰巧在某个路径下的多个子路径中组织资源，那么也可以递归地在所有子路径上
执行操作，方法是在 `--filename,-f` 后面指定 `--recursive` 或者 `-R`。

<!--
For instance, assume there is a directory `project/k8s/development` that holds all of the manifests needed for the development environment, organized by resource type:
 -->
例如，假设有一个目录路径为 `project/k8s/development`，它保存开发环境所需的
所有清单，并按资源类型组织：

```
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

<!--
By default, performing a bulk operation on `project/k8s/development` will stop at the first level of the directory, not processing any subdirectories. If we had tried to create the resources in this directory using the following command, we would have encountered an error:
 -->
默认情况下，对 `project/k8s/development` 执行的批量操作将停止在目录的第一级，
而不是处理所有子目录。
如果我们试图使用以下命令在此目录中创建资源，则会遇到一个错误：

```shell
kubectl apply -f project/k8s/development
```

```
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

<!--
Instead, specify the `--recursive` or `-R` flag with the `--filename,-f` flag as such:
 -->
正确的做法是，在 `--filename,-f` 后面标明 `--recursive` 或者 `-R` 之后：

```shell
kubectl apply -f project/k8s/development --recursive
```

```
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
The `--recursive` flag works with any operation that accepts the `--filename,-f` flag such as: `kubectl {create,get,delete,describe,rollout} etc.`

The `--recursive` flag also works when multiple `-f` arguments are provided:
 -->
`--recursive` 可以用于接受 `--filename,-f` 参数的任何操作，例如：
`kubectl {create,get,delete,describe,rollout}` 等。

有多个 `-f` 参数出现的时候，`--recursive` 参数也能正常工作：

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
If you're interested in learning more about `kubectl`, go ahead and read [kubectl Overview](/docs/reference/kubectl/overview/).
 -->
如果你有兴趣进一步学习关于 `kubectl` 的内容，请阅读
[kubectl 概述](/zh/docs/reference/kubectl/overview/)。

<!--
## Using labels effectively

The examples we've used so far apply at most a single label to any resource. There are many scenarios where multiple labels should be used to distinguish sets from one another.
-->
## 有效地使用标签

到目前为止我们使用的示例中的资源最多使用了一个标签。
在许多情况下，应使用多个标签来区分集合。

<!--
For instance, different applications would use different values for the `app` label, but a multi-tier application, such as the [guestbook example](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/), would additionally need to distinguish each tier. The frontend could carry the following labels:
-->
例如，不同的应用可能会为 `app` 标签设置不同的值。
但是，类似 [guestbook 示例](https://github.com/kubernetes/examples/tree/{{< param "githubbranch" >}}/guestbook/)
这样的多层应用，还需要区分每一层。前端可以带以下标签：

```yaml
     labels:
        app: guestbook
        tier: frontend
```

<!--
while the Redis master and slave would have different `tier` labels, and perhaps even an additional `role` label:
 -->
Redis 的主节点和从节点会有不同的 `tier` 标签，甚至还有一个额外的 `role` 标签：

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

<!-- and -->
以及

```yaml
     labels:
        app: guestbook
        tier: backend
        role: slave
```

<!--
The labels allow us to slice and dice our resources along any dimension specified by a label:
 -->
标签允许我们按照标签指定的任何维度对我们的资源进行切片和切块：

```shell
kubectl apply -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
kubectl get pods -Lapp -Ltier -Lrole
```

```
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
```

```shell
kubectl get pods -lapp=guestbook,role=slave
```

```
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

<!--
## Canary deployments

Another scenario where multiple labels are needed is to distinguish deployments of different releases or configurations of the same component. It is common practice to deploy a *canary* of a new application release (specified via image tag in the pod template) side by side with the previous release so that the new release can receive live production traffic before fully rolling it out.
 -->
## 金丝雀部署（Canary Deployments）   {#canary-deployments}

另一个需要多标签的场景是用来区分同一组件的不同版本或者不同配置的多个部署。
常见的做法是部署一个使用*金丝雀发布*来部署新应用版本
（在 Pod 模板中通过镜像标签指定），保持新旧版本应用同时运行。
这样，新版本在完全发布之前也可以接收实时的生产流量。

<!--
For instance, you can use a `track` label to differentiate different releases.

The primary, stable release would have a `track` label with value as `stable`:
 -->
例如，你可以使用 `track` 标签来区分不同的版本。

主要稳定的发行版将有一个 `track` 标签，其值为 `stable`：

```yaml
     name: frontend
     replicas: 3
     ...
     labels:
        app: guestbook
        tier: frontend
        track: stable
     ...
     image: gb-frontend:v3
```

<!--
and then you can create a new release of the guestbook frontend that carries the `track` label with different value (i.e. `canary`), so that two sets of pods would not overlap:
 -->
然后，你可以创建 guestbook 前端的新版本，让这些版本的 `track` 标签带有不同的值
（即 `canary`），以便两组 Pod 不会重叠：

```yaml
     name: frontend-canary
     replicas: 1
     ...
     labels:
        app: guestbook
        tier: frontend
        track: canary
     ...
     image: gb-frontend:v4
```

<!--
The frontend service would span both sets of replicas by selecting the common subset of their labels (i.e. omitting the `track` label), so that the traffic will be redirected to both applications:
 -->
前端服务通过选择标签的公共子集（即忽略 `track` 标签）来覆盖两组副本，
以便流量可以转发到两个应用：

```yaml
  selector:
     app: guestbook
     tier: frontend
```

<!--
You can tweak the number of replicas of the stable and canary releases to determine the ratio of each release that will receive live production traffic (in this case, 3:1).
Once you're confident, you can update the stable track to the new application release and remove the canary one.
 -->
你可以调整 `stable` 和 `canary` 版本的副本数量，以确定每个版本将接收
实时生产流量的比例（在本例中为 3:1）。
一旦有信心，你就可以将新版本应用的 `track` 标签的值从
`canary` 替换为 `stable`，并且将老版本应用删除。

<!--
For a more concrete example, check the [tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).
 -->
想要了解更具体的示例，请查看
[Ghost 部署教程](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)。

<!--
## Updating labels

Sometimes existing pods and other resources need to be relabeled before creating new resources. This can be done with `kubectl label`.
For example, if you want to label all your nginx pods as frontend tier, simply run:
 -->
## 更新标签  {#updating-labels}

有时，现有的 pod 和其它资源需要在创建新资源之前重新标记。
这可以用 `kubectl label` 完成。
例如，如果想要将所有 nginx pod 标记为前端层，只需运行：

```shell
kubectl label pods -l app=nginx tier=fe
```

```
pod/my-nginx-2035384211-j5fhi labeled
pod/my-nginx-2035384211-u2c7e labeled
pod/my-nginx-2035384211-u3t6x labeled
```

<!--
This first filters all pods with the label "app=nginx", and then labels them with the "tier=fe".
To see the pods you just labeled, run:
 -->
首先用标签 "app=nginx" 过滤所有的 Pod，然后用 "tier=fe" 标记它们。
想要查看你刚才标记的 Pod，请运行：

```shell
kubectl get pods -l app=nginx -L tier
```

```
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

<!--
This outputs all "app=nginx" pods, with an additional label column of pods' tier (specified with `-L` or `--label-columns`).

For more information, please see [labels](/docs/concepts/overview/working-with-objects/labels/) and [kubectl label](/docs/reference/generated/kubectl/kubectl-commands/#label).
 -->
这将输出所有 "app=nginx" 的 Pod，并有一个额外的描述 Pod 的 tier 的标签列
（用参数 `-L` 或者 `--label-columns` 标明）。

想要了解更多信息，请参考
[标签](/zh/docs/concepts/overview/working-with-objects/labels/) 和
[`kubectl label`](/zh/docs/reference/generated/kubectl/kubectl-commands/#label)
命令文档。

<!--
## Updating annotations

Sometimes you would want to attach annotations to resources. Annotations are arbitrary non-identifying metadata for retrieval by API clients such as tools, libraries, etc. This can be done with `kubectl annotate`. For example:
 -->
## 更新注解   {#updating-annotations}

有时，你可能希望将注解附加到资源中。注解是 API 客户端（如工具、库等）
用于检索的任意非标识元数据。这可以通过 `kubectl annotate` 来完成。例如：

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```
```shell
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

<!--
For more information, please see [annotations](/docs/concepts/overview/working-with-objects/annotations/) and [kubectl annotate](/docs/reference/generated/kubectl/kubectl-commands/#annotate) document.
 -->
想要了解更多信息，请参考
[注解](/zh/docs/concepts/overview/working-with-objects/annotations/)和
[`kubectl annotate`](/zh/docs/reference/generated/kubectl/kubectl-commands/#annotate)
命令文档。

<!--
## Scaling your application

When load on your application grows or shrinks, it's easy to scale with `kubectl`. For instance, to decrease the number of nginx replicas from 3 to 1, do:
 -->
## 扩缩你的应用

当应用上的负载增长或收缩时，使用 `kubectl` 能够轻松实现规模的扩缩。
例如，要将 nginx 副本的数量从 3 减少到 1，请执行以下操作：

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```
deployment.extensions/my-nginx scaled
```

<!--
Now you only have one pod managed by the deployment.
 -->
现在，你的 Deployment 管理的 Pod 只有一个了。

```shell
kubectl get pods -l app=nginx
```
```
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

<!--
To have the system automatically choose the number of nginx replicas as needed, ranging from 1 to 3, do:
 -->
想要让系统自动选择需要 nginx 副本的数量，范围从 1 到 3，请执行以下操作：

```shell
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

<!--
Now your nginx replicas will be scaled up and down as needed, automatically.

For more information, please see [kubectl scale](/docs/reference/generated/kubectl/kubectl-commands/#scale), [kubectl autoscale](/docs/reference/generated/kubectl/kubectl-commands/#autoscale) and [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) document.
 -->
现在，你的 nginx 副本将根据需要自动地增加或者减少。

想要了解更多信息，请参考
[kubectl scale](/zh/docs/reference/generated/kubectl/kubectl-commands/#scale)命令文档、
[kubectl autoscale](/zh/docs/reference/generated/kubectl/kubectl-commands/#autoscale) 命令文档和
[水平 Pod 自动伸缩](/zh/docs/tasks/run-application/horizontal-pod-autoscale/) 文档。

<!--
## In-place updates of resources

Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.
 -->
## 就地更新资源  {#in-place-updates-of-resources}

有时，有必要对你所创建的资源进行小范围、无干扰地更新。

### kubectl apply

<!--
It is suggested to maintain a set of configuration files in source control (see [configuration as code](http://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/reference/generated/kubectl/kubectl-commands/#apply) to push your configuration changes to the cluster.
 -->
建议在源代码管理中维护一组配置文件
（参见[配置即代码](https://martinfowler.com/bliki/InfrastructureAsCode.html)），
这样，它们就可以和应用代码一样进行维护和版本管理。
然后，你可以用 [`kubectl apply`](/zh/docs/reference/generated/kubectl/kubectl-commands/#apply)
将配置变更应用到集群中。

<!--
This command will compare the version of the configuration that you're pushing with the previous version and apply the changes you've made, without overwriting any automated changes to properties you haven't specified.
 -->
这个命令将会把推送的版本与以前的版本进行比较，并应用你所做的更改，
但是不会自动覆盖任何你没有指定更改的属性。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
deployment.apps/my-nginx configured
```

<!--
Note that `kubectl apply` attaches an annotation to the resource in order to determine the changes to the configuration since the previous invocation. When it's invoked, `kubectl apply` does a three-way diff between the previous configuration, the provided input and the current configuration of the resource, in order to determine how to modify the resource.
 -->
注意，`kubectl apply` 将为资源增加一个额外的注解，以确定自上次调用以来对配置的更改。
执行时，`kubectl apply` 会在以前的配置、提供的输入和资源的当前配置之间
找出三方差异，以确定如何修改资源。

<!--
Currently, resources are created without this annotation, so the first invocation of `kubectl apply` will fall back to a two-way diff between the provided input and the current configuration of the resource. During this first invocation, it cannot detect the deletion of properties set when the resource was created. For this reason, it will not remove them.
 -->
目前，新创建的资源是没有这个注解的，所以，第一次调用 `kubectl apply` 时
将使用提供的输入和资源的当前配置双方之间差异进行比较。
在第一次调用期间，它无法检测资源创建时属性集的删除情况。
因此，kubectl 不会删除它们。

<!--
All subsequent calls to `kubectl apply`, and other commands that modify the configuration, such as `kubectl replace` and `kubectl edit`, will update the annotation, allowing subsequent calls to `kubectl apply` to detect and perform deletions using a three-way diff.
 -->
所有后续的 `kubectl apply` 操作以及其他修改配置的命令，如 `kubectl replace`
和 `kubectl edit`，都将更新注解，并允许随后调用的 `kubectl apply`
使用三方差异进行检查和执行删除。

<!--
To use apply, always create resource initially with either `kubectl apply` or `kubectl create --save-config`.
 -->
{{< note >}}
想要使用 apply，请始终使用 `kubectl apply` 或 `kubectl create --save-config` 创建资源。
{{< /note >}}

### kubectl edit

<!--
Alternatively, you may also update resources with `kubectl edit`:
 -->
或者，你也可以使用 `kubectl edit` 更新资源：

```shell
kubectl edit deployment/my-nginx
```

<!--
This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the resource with the updated version:
 -->
这相当于首先 `get` 资源，在文本编辑器中编辑它，然后用更新的版本 `apply` 资源：

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

<!--
This allows you to do more significant changes more easily. Note that you can specify the editor with your `EDITOR` or `KUBE_EDITOR` environment variables.

For more information, please see [kubectl edit](/docs/reference/generated/kubectl/kubectl-commands/#edit) document.
 -->
这使你可以更加容易地进行更重大的更改。
请注意，可以使用 `EDITOR` 或 `KUBE_EDITOR` 环境变量来指定编辑器。

想要了解更多信息，请参考
[kubectl edit](/zh/docs/reference/generated/kubectl/kubectl-commands/#edit) 文档。

### kubectl patch

<!--
You can use `kubectl patch` to update API objects in place. This command supports JSON patch,
JSON merge patch, and strategic merge patch. See
[Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
and
[kubectl patch](/docs/reference/generated/kubectl/kubectl-commands/#patch).
 -->
你可以使用 `kubectl patch` 来更新 API 对象。此命令支持 JSON patch、
JSON merge patch、以及 strategic merge patch。 请参考
[使用 kubectl patch 更新 API 对象](/zh/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
和
[kubectl patch](/zh/docs/reference/generated/kubectl/kubectl-commands/#patch).

<!--
## Disruptive updates

In some cases, you may need to update resource fields that cannot be updated once initialized, or you may just want to make a recursive change immediately, such as to fix broken pods created by a Deployment. To change such fields, use `replace --force`, which deletes and re-creates the resource. In this case, you can simply modify your original configuration file:
 -->
## 破坏性的更新  {#disruptive-updates}

在某些情况下，你可能需要更新某些初始化后无法更新的资源字段，或者你可能只想立即进行递归更改，
例如修复 Deployment 创建的不正常的 Pod。若要更改这些字段，请使用 `replace --force`，
它将删除并重新创建资源。在这种情况下，你可以简单地修改原始配置文件：

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```

<!--
## Updating your application without a service outage
 -->
## 在不中断服务的情况下更新应用

<!--
At some point, you'll eventually need to update your deployed application, typically by specifying a new image or image tag, as in the canary deployment scenario above. `kubectl` supports several update operations, each of which is applicable to different scenarios.
 -->
在某些时候，你最终需要更新已部署的应用，通常都是通过指定新的镜像或镜像标签，
如上面的金丝雀发布的场景中所示。`kubectl` 支持几种更新操作，
每种更新操作都适用于不同的场景。

<!--
We'll guide you through how to create and update applications with Deployments.
 -->
我们将指导你通过 Deployment 如何创建和更新应用。

<!--
Let's say you were running version 1.14.2 of nginx:
 -->
假设你正运行的是 1.14.2 版本的 nginx：

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```
```
deployment.apps/my-nginx created
```

<!--
To update to version 1.16.1, simply change `.spec.template.spec.containers[0].image` from `nginx:1.14.2` to `nginx:1.16.1`, with the kubectl commands we learned above.
 -->
要更新到 1.16.1 版本，只需使用我们前面学到的 kubectl 命令将
`.spec.template.spec.containers[0].image` 从 `nginx:1.14.2` 修改为 `nginx:1.16.1`。

```shell
kubectl edit deployment/my-nginx
```

<!--
That's it! The Deployment will declaratively update the deployed nginx application progressively behind the scene. It ensures that only a certain number of old replicas may be down while they are being updated, and only a certain number of new replicas may be created above the desired number of pods. To learn more details about it, visit [Deployment page](/docs/concepts/workloads/controllers/deployment/).
 -->
没错，就是这样！Deployment 将在后台逐步更新已经部署的 nginx 应用。
它确保在更新过程中，只有一定数量的旧副本被开闭，并且只有一定基于所需 Pod 数量的新副本被创建。
想要了解更多细节，请参考 [Deployment](/zh/docs/concepts/workloads/controllers/deployment/)。

## {{% heading "whatsnext" %}}

<!--
- [Learn about how to use `kubectl` for application introspection and debugging.](/docs/tasks/debug-application-cluster/debug-application-introspection/)
- [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)
 -->
- 学习[如何使用 `kubectl` 观察和调试应用](/zh/docs/tasks/debug-application-cluster/debug-application-introspection/)
- 阅读[配置最佳实践和技巧](/zh/docs/concepts/configuration/overview/)

