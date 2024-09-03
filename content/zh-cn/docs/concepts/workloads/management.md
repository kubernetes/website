---
title: 管理工作负载
content_type: concept
weight: 40
---
<!--
title: Managing Workloads
content_type: concept
reviewers:
- janetkuo
weight: 40
-->

<!-- overview -->

<!-- 
You've deployed your application and exposed it via a Service. Now what? Kubernetes provides a
number of tools to help you manage your application deployment, including scaling and updating. 
-->
你已经部署了你的应用并且通过 Service 将其暴露出来。现在要做什么？
Kubernetes 提供了一系列的工具帮助你管理应用的部署，包括扩缩和更新。
<!-- body -->

<!--
## Organizing resource configurations
-->
## 组织资源配置
<!--
Many applications require multiple resources to be created, such as a Deployment along with a Service.
Management of multiple resources can be simplified by grouping them together in the same file
(separated by `---` in YAML). For example: 
-->
一些应用需要创建多个资源，例如 Deployment 和 Service。
将多个资源归入同一个文件（在 YAML 中使用 `---` 分隔）可以简化对多个资源的管理。例如：

{{% code_sample file="application/nginx-app.yaml" %}}

<!--
Multiple resources can be created the same way as a single resource:
-->
创建多个资源的方法与创建单个资源的方法相同：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
service/my-nginx-svc created
deployment.apps/my-nginx created
```

<!--
The resources will be created in the order they appear in the manifest. Therefore, it's best to
specify the Service first, since that will ensure the scheduler can spread the pods associated
with the Service as they are created by the controller(s), such as Deployment.
-->
资源会按照在清单中出现的顺序创建。
因此，最好先指定 Service，这样可以确保调度器能在控制器（如 Deployment）创建 Pod 时对
Service 相关的 Pod 作分布。

<!--
`kubectl apply` also accepts multiple `-f` arguments:
-->
`kubectl apply` 还可以接收多个 `-f` 参数：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-svc.yaml \
  -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```


<!--
It is a recommended practice to put resources related to the same microservice or application tier
into the same file, and to group all of the files associated with your application in the same
directory. If the tiers of your application bind to each other using DNS, you can deploy all of
the components of your stack together.
-->
建议将同一个微服务或应用相关的资源放到同一个文件中，
并将与应用相关的所有文件归类到同一目录中。
如果应用各层使用 DNS 相互绑定，你可以同时部署工作栈中的所有组件。


<!--
A URL can also be specified as a configuration source, which is handy for deploying directly from
manifests in your source control system:
-->
URL 链接也可以被指定为配置源，这对于直接基于源码控制系统的清单进行部署来说非常方便：

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx created
```

<!--
If you need to define more manifests, such as adding a ConfigMap, you can do that too.
-->
如果你需要定义更多清单，例如添加一个 ConfigMap，你也可以这样做。

<!--
### External tools
-->
### 外部工具 {#external-tools}

<!--
This section lists only the most common tools used for managing workloads on Kubernetes. To see a larger list, view
[Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)
in the {{< glossary_tooltip text="CNCF" term_id="cncf" >}} Landscape.
-->
这一节列出了在 Kubernetes 中管理工作负载最常用的一些工具。
如果想要查看完整的清单，参阅 {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
文章 [Application definition and image build](https://landscape.cncf.io/guide#app-definition-and-development--application-definition-image-build)。

#### Helm {#external-tool-helm}

{{% thirdparty-content single="true" %}}

<!--
[Helm](https://helm.sh/) is a tool for managing packages of pre-configured
Kubernetes resources. These packages are known as _Helm charts_.
-->
[Helm](https://helm.sh/) 是一种管理预配置 Kubernetes 资源包的工具。这些资源包被称为 _Helm charts_。

#### Kustomize {#external-tool-kustomize}

<!--
[Kustomize](https://kustomize.io/) traverses a Kubernetes manifest to add, remove or update configuration options.
It is available both as a standalone binary and as a [native feature](/docs/tasks/manage-kubernetes-objects/kustomization/)
of kubectl.
-->
[Kustomize](https://kustomize.io/) 遍历 Kubernetes 清单以添加、删除或更新配置选项。
它既可以作为独立的二级制文件使用，也可以作为 kubectl 的[原生功能](/zh-cn/docs/tasks/manage-kubernetes-objects/kustomization/) 使用。

<!--
## Bulk operations in kubectl
-->
## kubectl 中的批量操作 {#bulk-operations-in-kubectl}

<!--
Resource creation isn't the only operation that `kubectl` can perform in bulk. It can also extract
resource names from configuration files in order to perform other operations, in particular to
delete the same resources you created:
-->
资源创建并不是 `kubectl` 可以批量执行的唯一操作。
它还能提取配置文件中的资源名称来执行其他操作，尤其是删除已经创建的相同资源：

```shell
kubectl delete -f https://k8s.io/examples/application/nginx-app.yaml
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
In the case of two resources, you can specify both resources on the command line using the
resource/name syntax:
-->
如果有两个资源，你可以使用 resource/name 语法在命令行中指定这两个资源：

```shell
kubectl delete deployments/my-nginx services/my-nginx-svc
```

<!--
For larger numbers of resources, you'll find it easier to specify the selector (label query)
specified using `-l` or `--selector`, to filter resources by their labels:
-->
对于数量众多的资源，使用 `-l` 或 `--selector` 指定选择算符（标签查询）会更方便，
可以根据标签来过滤资源：

```shell
kubectl delete deployment,services -l app=nginx
```

```none
deployment.apps "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
### Chaining and filtering
-->
### 链式操作和过滤 {#chaining-and-filtering}

<!--
Because `kubectl` outputs resource names in the same syntax it accepts, you can chain operations
using `$()` or `xargs`:
-->
因为 `kubectl` 输出的资源名称与接收的语法相同，你可以使用 `$()` 或 `xargs` 进行链式操作：

```shell
kubectl get $(kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ )
kubectl create -f docs/concepts/cluster-administration/nginx/ -o name | grep service/ | xargs -i kubectl get '{}'
```

<!--
The output might be similar to:
-->
输出类似这样：

```none
NAME           TYPE           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   LoadBalancer   10.0.0.208   <pending>     80/TCP       0s
```

<!--
With the above commands, first you create resources under `examples/application/nginx/` and print
the resources created with `-o name` output format (print each resource as resource/name).
Then you `grep` only the Service, and then print it with [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/).
-->
使用上面的命令，首先会创建 `examples/application/nginx/` 目录下的资源，
然后使用 `-o name` 输出格式打印创建的资源（以 resource/name 格式打印）。
然后 `grep` 筛选出 Service，再用 [`kubectl get`](/docs/reference/kubectl/generated/kubectl_get/) 打印。

<!--
### Recursive operations on local files
-->
### 对本地文件的递归操作 {#recursive-operations-on-local-files}

<!--
If you happen to organize your resources across several subdirectories within a particular
directory, you can recursively perform the operations on the subdirectories also, by specifying
`--recursive` or `-R` alongside the `--filename`/`-f` argument.
-->
如果你碰巧在一个特定目录下跨多个子目录中组织资源，
你也可以通过在指定 `--filename`/`-f` 的同时指定 `--recursive` 或 `-R` 参数对子目录执行递归操作。

<!--
For instance, assume there is a directory `project/k8s/development` that holds all of the
{{< glossary_tooltip text="manifests" term_id="manifest" >}} needed for the development environment,
organized by resource type:
-->
例如，假设有一个目录 `project/k8s/development` 包含了开发环境所需的所有{{< glossary_tooltip text="清单文件" term_id="manifest" >}}，
并按资源类型进行了分类：

```none
project/k8s/development
├── configmap
│   └── my-configmap.yaml
├── deployment
│   └── my-deployment.yaml
└── pvc
    └── my-pvc.yaml
```

<!--
By default, performing a bulk operation on `project/k8s/development` will stop at the first level
of the directory, not processing any subdirectories. If you had tried to create the resources in
this directory using the following command, we would have encountered an error:
-->
默认情况下，在 `project/k8s/development` 下执行批量操作会在目录的第一层终止，不会处理任何子目录。
如果你在这个目录下使用如下命令尝试创建资源，会得到如下错误：

```shell
kubectl apply -f project/k8s/development
```

```none
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

<!--
Instead, specify the `--recursive` or `-R` command line argument along with the `--filename`/`-f` argument:
-->
在命令行参数中与 `--filename`/`-f` 一起指定 `--recursive` 或 `-R`：

```shell
kubectl apply -f project/k8s/development --recursive
```

```none
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
The `--recursive` argument works with any operation that accepts the `--filename`/`-f` argument such as:
`kubectl create`, `kubectl get`, `kubectl delete`, `kubectl describe`, or even `kubectl rollout`.

The `--recursive` argument also works when multiple `-f` arguments are provided:
-->
参数 `--recursive` 可以处理任何可以接收 `--filename`/`-f` 参数的操作，
例如： `kubectl create`、`kubectl get`、`kubectl delete`、`kubectl describe`，甚至是 `kubectl rollout`。

当指定了多个 `-f` 参数时，`--recursive` 仍然可以生效。

```shell
kubectl apply -f project/k8s/namespaces -f project/k8s/development --recursive
```

```none
namespace/development created
namespace/staging created
configmap/my-config created
deployment.apps/my-deployment created
persistentvolumeclaim/my-pvc created
```

<!--
If you're interested in learning more about `kubectl`, go ahead and read
[Command line tool (kubectl)](/docs/reference/kubectl/).
-->
如果你对了解更多 `kubectl` 有兴趣，请阅读[命令行工具 (kubectl)](/zh-cn/docs/reference/kubectl/)。

<!--
## Updating your application without an outage
-->
## 无中断更新应用 {#updating-your-application-without-an-outage}

<!--
At some point, you'll eventually need to update your deployed application, typically by specifying
a new image or image tag. `kubectl` supports several update operations, each of which is applicable
to different scenarios.
-->
有时候，你需要更新你所部署的应用，通常是指定新的镜像或镜像标签。
`kubectl` 支持多种更新操作，每一种都适用于不同的场景。

<!--
You can run multiple copies of your app, and use a _rollout_ to gradually shift the traffic to
new healthy Pods. Eventually, all the running Pods would have the new software.
-->
你可以运行应用的多个副本，并使用 **上线（rollout）** 操作将流量逐渐转移到新的健康 Pod 上。
最终，所有正在运行的 Pod 都将拥有新的应用。 

<!--
This section of the page guides you through how to create and update applications with Deployments.
-->
本节将指导你如何使用 Deployment 创建和更新应用。

<!--
Let's say you were running version 1.14.2 of nginx:
-->
假设你运行了 Nginx 1.14.2 版本。

```shell
kubectl create deployment my-nginx --image=nginx:1.14.2
```

```none
deployment.apps/my-nginx created
```

<!--
Ensure that there is 1 replica:
-->
确保只有一个副本:

```shell
kubectl scale --replicas 1 deployments/my-nginx --subresource='scale' --type='merge' -p '{"spec":{"replicas": 1}}'
```

```none
deployment.apps/my-nginx scaled
```

<!--
and allow Kubernetes to add more temporary replicas during a rollout, by setting a _surge maximum_ of
100%:
-->
允许 Kubernetes 在上线过程中添加更多的临时副本，方法是设置最大涨幅为 100%。

```shell
kubectl patch --type='merge' -p '{"spec":{"strategy":{"rollingUpdate":{"maxSurge": "100%" }}}}'
```

```none
deployment.apps/my-nginx patched
```

<!--
To update to version 1.16.1, change `.spec.template.spec.containers[0].image` from `nginx:1.14.2`
to `nginx:1.16.1` using `kubectl edit`:
-->
要更新到版本 1.61.1，使用 `kubectl edit` 将 `.spec.template.spec.containers[0].image`
值从 `nginx:1.14.2` 修改为 `nginx:1.16.1`。

```shell
kubectl edit deployment/my-nginx
# 修改清单文件以使用新的容器镜像，然后保存你所作的更改
```

<!--
That's it! The Deployment will declaratively update the deployed nginx application progressively
behind the scene. It ensures that only a certain number of old replicas may be down while they are
being updated, and only a certain number of new replicas may be created above the desired number
of pods. To learn more details about how this happens,
visit [Deployment](/docs/concepts/workloads/controllers/deployment/).
-->
就是这样！Deployment 会逐步声明式地更新已部署的 Nginx 应用。
它确保只有一定数量的旧副本会在更新时处于宕机状态，
并且超过所需的 Pod 数量的新副本个数在创建期间可控。
要了解更多关于如何实现的详细信息，参照 [Deployment](/zh-cn/docs/concepts/workloads/controllers/deployment/)。

<!--
You can use rollouts with DaemonSets, Deployments, or StatefulSets.
-->
你可以使用 DaemonSet、Deployment 或 StatefulSet 来完成上线。

<!--
### Managing rollouts
-->
### 管理上线 {#managing-rollouts}

<!--
You can use [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) to manage a
progressive update of an existing application.
-->
你可以使用 [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) 管理现有应用的逐步更新。

<!--
For example:
-->
例如：

<!--
```shell
kubectl apply -f my-deployment.yaml

# wait for rollout to finish
kubectl rollout status deployment/my-deployment --timeout 10m # 10 minute timeout
```
-->
```shell
kubectl apply -f my-deployment.yaml

# 等待上线完成
kubectl rollout status deployment/my-deployment --timeout 10m # 超时时长为 10 分钟
```

<!-- or -->
或者

<!--
```shell
kubectl apply -f backing-stateful-component.yaml

# don't wait for rollout to finish, just check the status
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```
-->
```shell
kubectl apply -f backing-stateful-component.yaml

# 不用等待上线完成，只需要检查状态
kubectl rollout status statefulsets/backing-stateful-component --watch=false
```

<!--
You can also pause, resume or cancel a rollout.
Visit [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) to learn more.
-->
你也可以暂停、恢复或取消上线。
参阅 [`kubectl rollout`](/docs/reference/kubectl/generated/kubectl_rollout/) 以深入了解。

<!--
## Canary deployments
-->
## 金丝雀部署 {#canary-deployments}

<!--TODO: make a task out of this for canary deployment, ref #42786-->

<!--
Another scenario where multiple labels are needed is to distinguish deployments of different
releases or configurations of the same component. It is common practice to deploy a *canary* of a
new application release (specified via image tag in the pod template) side by side with the
previous release so that the new release can receive live production traffic before fully rolling
it out.
-->
另一种需要使用多个标签的情况是区分部署的是同一组件的不同版本或不同配置。
通常的做法是将新应用版本的 **金丝雀**（在 Pod 模板中的镜像标签中指定）与之前发布的版本并排部署，
这样新发布的版本可以在完全上线前接收实时生产流量。


<!--
For instance, you can use a `track` label to differentiate different releases.

The primary, stable release would have a `track` label with value as `stable`:
-->
例如，你可以使用 `track` 标签来区分不同的版本。

主版本、稳定版本会存在 `track` 标签，值为 `stable`。

```none
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
and then you can create a new release of the guestbook frontend that carries the `track` label
with different value (i.e. `canary`), so that two sets of pods would not overlap:
-->
然后你可以创建一个 guestbook 前端项目的新版本，该版本使用不同值的 `track` 标签（例如：`canary`），
这样两组 Pod 就不会重叠。

```none
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
The frontend service would span both sets of replicas by selecting the common subset of their
labels (i.e. omitting the `track` label), so that the traffic will be redirected to both
applications:
-->
这个前端服务将通过选择标签的相同子集（例如：忽略 `track` 标签）来覆盖两套副本，
这样，流量会被转发到两个应用：

```yaml
selector:
   app: guestbook
   tier: frontend
```

<!--
You can tweak the number of replicas of the stable and canary releases to determine the ratio of
each release that will receive live production traffic (in this case, 3:1).
Once you're confident, you can update the stable track to the new application release and remove
the canary one.
-->
你可以调整稳定版本和金丝雀版本的副本数量，
以确定每个版本接收实时生产流量的比例（本例中为 3：1）。
一旦有把握，你可以更新所有 track 标签为 stable 的应用为新版本并且移除金丝雀标签。

<!--
## Updating annotations
-->
## 更新注解 {#updating-annotations}

<!--
Sometimes you would want to attach annotations to resources. Annotations are arbitrary
non-identifying metadata for retrieval by API clients such as tools or libraries.
This can be done with `kubectl annotate`. For example:
-->
有时候你想要为资源附加注解。
注解是任意的非标识性元数据，供 API 客户端例如工具或库检索。
这可以通过 `kubectl annotate` 来完成。例如：

```shell
kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
kubectl get pods my-nginx-v4-9gw19 -o yaml
```

```yaml
apiVersion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

<!--
For more information, see [annotations](/docs/concepts/overview/working-with-objects/annotations/)
and [kubectl annotate](/docs/reference/kubectl/generated/kubectl_annotate/).
-->
更多信息，参阅[注解](/zh-cn/docs/concepts/overview/working-with-objects/annotations/)
和 [kubectl annotate](/zh-cn/docs/reference/kubectl/generated/kubectl_annotate/)。

<!--
## Scaling your application
-->
## 扩缩应用 {#scaling-your-application}

<!--
When load on your application grows or shrinks, use `kubectl` to scale your application.
For instance, to decrease the number of nginx replicas from 3 to 1, do:
-->
当应用的负载增长或收缩时，使用 `kubectl` 扩缩你的应用。
例如，将 Nginx 的副本数量从 3 减少到 1，这样做：

```shell
kubectl scale deployment/my-nginx --replicas=1
```

```none
deployment.apps/my-nginx scaled
```

<!--
Now you only have one pod managed by the deployment.
-->
现在，你的 Deployment 只管理一个 Pod。

```shell
kubectl get pods -l app=nginx
```

```none
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

<!--
To have the system automatically choose the number of nginx replicas as needed,
ranging from 1 to 3, do:
-->
为了让系统按需从 1 到 3 自动选择 Nginx 副本数量，这样做：

<!--
```shell
# This requires an existing source of container and Pod metrics
kubectl autoscale deployment/my-nginx --min=1 --max=3
```
-->
```shell
# 需要存在容器和 Pod 指标数据源
kubectl autoscale deployment/my-nginx --min=1 --max=3
```

```none
horizontalpodautoscaler.autoscaling/my-nginx autoscaled
```

<!--
Now your nginx replicas will be scaled up and down as needed, automatically.
-->
现在你的 Nginx 副本数量将会按需自动扩缩。

<!--
For more information, please see [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/),
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) and
[horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) document.
-->
更多信息请参阅文档 [kubectl scale](/docs/reference/kubectl/generated/kubectl_scale/)，
[kubectl autoscale](/docs/reference/kubectl/generated/kubectl_autoscale/) 和
[Pod 水平自动扩缩](/zh-cn/docs/tasks/run-application/horizontal-pod-autoscale/) 。

<!--
## In-place updates of resources
-->
## 就地更新资源 {#in-place-updates-of-resources}

<!--
Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.
-->
有时需要对创建的资源进行小范围、非破坏性的更新。

### kubectl apply

<!--
It is suggested to maintain a set of configuration files in source control
(see [configuration as code](https://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/)
to push your configuration changes to the cluster.
-->
建议参照 ([configuration as code](https://martinfowler.com/bliki/InfrastructureAsCode.html))，
在源码控制系统中维护配置文件集合，
这样它们就能与所配置资源的代码一起得到维护和版本控制。
然后，你可以使用 [`kubectl apply`](/docs/reference/kubectl/generated/kubectl_apply/) 
将配置集更新推送到集群中。

<!--
This command will compare the version of the configuration that you're pushing with the previous
version and apply the changes you've made, without overwriting any automated changes to properties
you haven't specified.
-->
这个命令会将你推送的配置的版本和之前的版本进行比较，并应用你所作的更改，
而不会覆盖任何你没有指定的属性。

```shell
kubectl apply -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml
```

```none
deployment.apps/my-nginx configured
```

<!--
To learn more about the underlying mechanism, read [server-side apply](/docs/reference/using-api/server-side-apply/).
-->
要进一步了解底层原理，参阅[服务器端应用](/zh-cn/docs/reference/using-api/server-side-apply/)。

### kubectl edit

<!--
Alternatively, you may also update resources with [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/):
-->
或者，你也可以使用 [`kubectl edit`](/docs/reference/kubectl/generated/kubectl_edit/) 来更新资源：

```shell
kubectl edit deployment/my-nginx
```

<!--
This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the
resource with the updated version:
-->
等价于先对资源进行 `get` 操作，在文本编辑器中进行编辑，
然后对更新后的版本进行 `apply` 操作：
<!-- 
```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# do some edit, and then save the file

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```
-->

```shell
kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
vi /tmp/nginx.yaml
# 编辑，然后保存

kubectl apply -f /tmp/nginx.yaml
deployment.apps/my-nginx configured

rm /tmp/nginx.yaml
```

<!--
This allows you to do more significant changes more easily. Note that you can specify the editor
with your `EDITOR` or `KUBE_EDITOR` environment variables.
-->
这样，你就可以轻松的进行更重要的修改。
注意，你可以使用 `EDITOR` 或 `KUBE_EDITOR` 环境变量来指定编辑器。

<!--
For more information, please see [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/).
-->
更多信息参阅 [kubectl edit](/docs/reference/kubectl/generated/kubectl_edit/)。

### kubectl patch

<!--
You can use [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) to update API objects in place.
This subcommand supports JSON patch,
JSON merge patch, and strategic merge patch.
-->
你可以使用 [`kubectl patch`](/docs/reference/kubectl/generated/kubectl_patch/) 来就地更新 API 对象。
该子命令支持 JSON 补丁、JSON 合并补丁和策略合并补丁。

<!--
See
[Update API Objects in Place Using kubectl patch](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
for more details.
-->
参阅[使用 kubectl patch 更新 API 对象](/zh-cn/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)
获取更多细节。

<!--
## Disruptive updates
-->
## 破坏性更新 {#disruptive-updates}

<!--
In some cases, you may need to update resource fields that cannot be updated once initialized, or
you may want to make a recursive change immediately, such as to fix broken pods created by a
Deployment. To change such fields, use `replace --force`, which deletes and re-creates the
resource. In this case, you can modify your original configuration file:
-->
某些场景下，你可能需要更新那些一旦被初始化就无法被更新的资源字段，
或者希望立刻进行递归修改，例如修复被 Deployment 创建的异常 Pod。
要更改此类字段，使用 `replace --force` 来删除并且重新创建资源。
这种情况下，你可以修改原始配置文件。

```shell
kubectl replace -f https://k8s.io/examples/application/nginx/nginx-deployment.yaml --force
```

```none
deployment.apps/my-nginx deleted
deployment.apps/my-nginx replaced
```


## {{% heading "whatsnext" %}}

<!--
- Learn about [how to use `kubectl` for application introspection and debugging](/docs/tasks/debug/debug-application/debug-running-pod/).
-->
进一步学习[如何调试运行中的 Pod](/zh-cn/docs/tasks/debug/debug-application/debug-running-pod/)。
