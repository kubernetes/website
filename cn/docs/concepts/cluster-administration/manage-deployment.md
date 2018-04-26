---
approvers:
- bgrant0607
- janetkuo
- mikedanese
title: 管理资源
cn-approvers:
- chentao1596
---
<!--
---
approvers:
- bgrant0607
- janetkuo
- mikedanese
title: Managing Resources
---
-->

<!--
You've deployed your application and exposed it via a service. Now what? Kubernetes provides a number of tools to help you manage your application deployment, including scaling and updating. Among the features that we will discuss in more depth are [configuration files](/docs/concepts/configuration/overview/) and [labels](/docs/concepts/overview/working-with-objects/labels/).
-->
您已经部署了应用并通过服务暴露它。现在要做的是？Kubernetes 提供了一些工具来帮助管理您的应用部署，包括缩放和更新。我们将更深入讨论的特性包括 [配置文件](/docs/concepts/configuration/overview/) 和 [label](/docs/concepts/overview/working-with-objects/labels/)。


<!--
You can find all the files for this example [in our docs
repo here](https://github.com/kubernetes/website/tree/{{page.docsbranch}}/docs/user-guide/).
-->
您可以 [在我们的 doc 仓库中](https://github.com/kubernetes/website/tree/{{page.docsbranch}}/docs/user-guide/) 找到该示例的所有文件。

* TOC
{:toc}

<!--
## Organizing resource configurations
-->
## 组织资源配置

<!--
Many applications require multiple resources to be created, such as a Deployment and a Service. Management of multiple resources can be simplified by grouping them together in the same file (separated by `---` in YAML). For example:
-->
许多应用需要创建多个资源，例如一个 Deployment 和一个 Service。可以通过将多个资源组合在同一个文件中（在 YAML 中以 `---` 分隔）来简化对它们的管理。例如：

{% include code.html language="yaml" file="nginx-app.yaml" ghlink="/docs/user-guide/nginx-app.yaml" %}

<!--
Multiple resources can be created the same way as a single resource:
-->
可以用创建单个资源的方式来创建多个资源：

```shell
$ kubectl create -f docs/user-guide/nginx-app.yaml
service "my-nginx-svc" created
deployment "my-nginx" created
```

<!--
The resources will be created in the order they appear in the file. Therefore, it's best to specify the service first, since that will ensure the scheduler can spread the pods associated with the service as they are created by the controller(s), such as Deployment.
-->
资源将按照它们在文件中出现的顺序创建。因此，最好先指定服务，因为这将确保调度能够像控制器（例如 Deployment）那样创建与服务相关联的 pod。

<!--
`kubectl create` also accepts multiple `-f` arguments:
-->
`kubectl create` 也接受多个 `-f` 参数:

```shell
$ kubectl create -f docs/user-guide/nginx/nginx-svc.yaml -f docs/user-guide/nginx/nginx-deployment.yaml
```

<!--
And a directory can be specified rather than or in addition to individual files:
-->
还可以指定目录，而不是指定或单独添加一个文件：

```shell
$ kubectl create -f docs/user-guide/nginx/
```

<!--
`kubectl` will read any files with suffixes `.yaml`, `.yml`, or `.json`.
-->
`kubectl` 将读取后缀为 `.yaml`，`.yml` 或者 `.json` 的所有文件。

<!--
It is a recommended practice to put resources related to the same microservice or application tier into the same file, and to group all of the files associated with your application in the same directory. If the tiers of your application bind to each other using DNS, then you can then simply deploy all of the components of your stack en masse.
-->
建议将那些与同一个微服务或应用层相关的资源放到同一个文件中，并将与应用相关的所有文件分组到同一个目录中。如果应用的各个层使用 DNS 相互绑定，那么您可以简单地将堆栈的所有组件一起部署。

<!--
A URL can also be specified as a configuration source, which is handy for deploying directly from configuration files checked into github:
-->
还可以将 URL 指定为配置源，便于直接部署迁入 github 的配置文件：

```shell
$ kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/master/docs/user-guide/nginx-deployment.yaml
deployment "nginx-deployment" created
```

<!--
## Bulk operations in kubectl
-->
## kubectl 中的批量操作

<!--
Resource creation isn't the only operation that `kubectl` can perform in bulk. It can also extract resource names from configuration files in order to perform other operations, in particular to delete the same resources you created:
-->
资源创建并不是 `kubectl` 可以批量执行的唯一操作。它还可以从配置文件中提取资源名，以便执行其他操作，特别是删除您创建的相同资源：

```shell
$ kubectl delete -f docs/user-guide/nginx/
deployment "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
In the case of just two resources, it's also easy to specify both on the command line using the resource/name syntax:
-->
在只有两个资源的情况下，还可以使用 资源/名称 的语法在命令行中指定这两个资源：

```shell
$ kubectl delete deployments/my-nginx services/my-nginx-svc
```

<!--
For larger numbers of resources, you'll find it easier to specify the selector (label query) specified using `-l` or `--selector`, to filter resources by their labels:
-->
对于更多的资源，您会发现，使用 `-l` 或 `--selector` 指定的选择器（label 查询），很容易通过 label 筛选资源：

```shell
$ kubectl delete deployment,services -l app=nginx
deployment "my-nginx" deleted
service "my-nginx-svc" deleted
```

<!--
Because `kubectl` outputs resource names in the same syntax it accepts, it's easy to chain operations using `$()` or `xargs`:
-->
因为 `kubectl` 输出的资源名称和它接收的资源名称语法相同，所以很容易使用 `$()` 或 `xargs` 形成链操作：

```shell
$ kubectl get $(kubectl create -f docs/user-guide/nginx/ -o name | grep service)
NAME           CLUSTER-IP   EXTERNAL-IP   PORT(S)      AGE
my-nginx-svc   10.0.0.208   <pending>     80/TCP       0s
```

<!--
With the above commands, we first create resources under docs/user-guide/nginx/ and print the resources created with `-o name` output format
(print each resource as resource/name). Then we `grep` only the "service", and then print it with `kubectl get`.
-->
上面的命令中，我们首先使用 docs/user-guide/nginx/ 下的配置文件创建资源，并使用 `-o name` 的输出格式（每个资源打印为 资源/名称）打印创建的资源。然后，我们通过 `grep` 仅获取 “service”，最后再打印 `kubectl get` 的内容。

<!--
If you happen to organize your resources across several subdirectories within a particular directory, you can recursively perform the operations on the subdirectories also, by specifying `--recursive` or `-R` alongside the `--filename,-f` flag.
-->
如果您碰巧在一个特定目录下的多个子目录中组织资源，那么也可以递归地在所有子目录上执行操作，方法是在 `--filename,-f` 后面指定 `--recursive` 或者 `-R`。

<!--
For instance, assume there is a directory `project/k8s/development` that holds all of the manifests needed for the development environment, organized by resource type:
-->
例如，假设有一个目录 “Project/K8s/Development”，它保存开发环境所需的所有清单，按资源类型组织：

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
默认情况下，对 “Project/K8s/Development” 执行批量操作将停止在目录的第一级，而不是处理所有子目录。如果我们试图使用以下命令在此目录中创建资源，则会遇到一个错误：

```shell
$ kubectl create -f project/k8s/development
error: you must provide one or more resources by argument or filename (.json|.yaml|.yml|stdin)
```

<!--
Instead, specify the `--recursive` or `-R` flag with the `--filename,-f` flag as such:
-->
取而代之的是，我们应该像下面这样，在 `--filename,-f` 后面指定 `--recursive` 或者 `-R`：

```shell
$ kubectl create -f project/k8s/development --recursive
configmap "my-config" created
deployment "my-deployment" created
persistentvolumeclaim "my-pvc" created
```

<!--
The `--recursive` flag works with any operation that accepts the `--filename,-f` flag such as: `kubectl {create,get,delete,describe,rollout} etc.`
-->
`--recursive` 与接受 `--filename,-f` 标志的任何操作都能一起工作，例如：`kubectl {create,get,delete,describe,rollout}` 等。

<!--
The `--recursive` flag also works when multiple `-f` arguments are provided:
-->
有多个 `-f` 参数出现的时候，`--recursive` 标志也能正常工作：

```shell
$ kubectl create -f project/k8s/namespaces -f project/k8s/development --recursive
namespace "development" created
namespace "staging" created
configmap "my-config" created
deployment "my-deployment" created
persistentvolumeclaim "my-pvc" created
```

<!--
If you're interested in learning more about `kubectl`, go ahead and read [kubectl Overview](/docs/user-guide/kubectl-overview).
-->
如果您有兴趣学习更多关于 `kubectl` 的内容，请阅读 [kubectl 概述](/docs/user-guide/kubectl-overview)。

<!--
## Using labels effectively
-->
## 有效地使用 label

<!--
The examples we've used so far apply at most a single label to any resource. There are many scenarios where multiple labels should be used to distinguish sets from one another.
-->
到目前为止，我们的例子中任何资源使用的 label 最多也就一个。很多时候，应该使用多个 label 来区分集合。

<!--
For instance, different applications would use different values for the `app` label, but a multi-tier application, such as the [guestbook example](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/guestbook/), would additionally need to distinguish each tier. The frontend could carry the following labels:
-->
例如，不同的应用将为 `app` label 设置不同的值，但是，类似 [guestbook 示例](https://github.com/kubernetes/examples/tree/{{page.githubbranch}}/guestbook/) 这样的多层应用，还需要区分每一层。前端可以带以下 label：

```yaml
     labels:
        app: guestbook
        tier: frontend
```

<!--
while the Redis master and slave would have different `tier` labels, and perhaps even an additional `role` label:
-->
Redis 的 master 和 slave 会有不同的 `tier` 值的 label，甚至还有一个额外的 `role` label：

```yaml
     labels:
        app: guestbook
        tier: backend
        role: master
```

<!--
and
-->
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
label 允许我们沿着 label 指定的任何维度对我们的资源进行切片和剪裁：

```shell
$ kubectl create -f examples/guestbook/all-in-one/guestbook-all-in-one.yaml
$ kubectl get pods -Lapp -Ltier -Lrole
NAME                           READY     STATUS    RESTARTS   AGE       APP         TIER       ROLE
guestbook-fe-4nlpb             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-ght6d             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-fe-jpy62             1/1       Running   0          1m        guestbook   frontend   <none>
guestbook-redis-master-5pg3b   1/1       Running   0          1m        guestbook   backend    master
guestbook-redis-slave-2q2yf    1/1       Running   0          1m        guestbook   backend    slave
guestbook-redis-slave-qgazl    1/1       Running   0          1m        guestbook   backend    slave
my-nginx-divi2                 1/1       Running   0          29m       nginx       <none>     <none>
my-nginx-o0ef1                 1/1       Running   0          29m       nginx       <none>     <none>
$ kubectl get pods -lapp=guestbook,role=slave
NAME                          READY     STATUS    RESTARTS   AGE
guestbook-redis-slave-2q2yf   1/1       Running   0          3m
guestbook-redis-slave-qgazl   1/1       Running   0          3m
```

<!--
## Canary deployments
-->
## 金丝雀部署

<!--
Another scenario where multiple labels are needed is to distinguish deployments of different releases or configurations of the same component. It is common practice to deploy a *canary* of a new application release (specified via image tag in the pod template) side by side with the previous release so that the new release can receive live production traffic before fully rolling it out.
-->
区分同一组件不同版本或者配置的部署，是需要多 label 的另外一个场景。常见的做法，是部署一个新应用发布版本（在 pod 模板中通过镜像的 tag 指定）的 *金丝雀*，保持与以前的版本同时运行，这样，新版本在完全推出之前可以接收实时生产流量。

<!--
For instance, you can use a `track` label to differentiate different releases.
-->
例如，您可以使用 `track` label 来区分不同的版本。

<!--
The primary, stable release would have a `track` label with value as `stable`:
-->
主要的、稳定的发行版将有一个值为 `stable` 的`track` label：

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
然后，您可以创建 guestbook 前端的新版本，让这些版本的 `track` label 带有不同的值（即 `canary`），以便两组 pod 不会重叠：

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
前端服务通过选择 label 的公共子集（即省略 `track` label），就能跨越两组副本，这样，流量将重定向到两个应用：

```yaml
  selector:
     app: guestbook
     tier: frontend
```

<!--
You can tweak the number of replicas of the stable and canary releases to determine the ratio of each release that will receive live production traffic (in this case, 3:1).
Once you're confident, you can update the stable track to the new application release and remove the canary one.
-->
您可以调整 stable 和 canary 版本的副本数量，以确定每个版本将接收实时生产流量的比例(在本例中为 3:1)。一旦有信心了，您就可以将值为 `stable` 的 `track` 更新到新的应用发行版本，并删除 `canary`。

<!--
For a more concrete example, check the [tutorial of deploying Ghost](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary).
-->
想要了解更具体的示例，请查看 [部署 Ghost 指南](https://github.com/kelseyhightower/talks/tree/master/kubecon-eu-2016/demo#deploy-a-canary)。

<!--
## Updating labels
-->
## 更新 label

<!--
Sometimes existing pods and other resources need to be relabeled before creating new resources. This can be done with `kubectl label`.
For example, if you want to label all your nginx pods as frontend tier, simply run:
-->
有时，现有的 pod 和其它资源需要在创建新资源之前重新标记。这可以用 `kubectl label` 完成。例如，如果想要将所有 nginx pod 标记为前端层，只需运行：

```shell
$ kubectl label pods -l app=nginx tier=fe
pod "my-nginx-2035384211-j5fhi" labeled
pod "my-nginx-2035384211-u2c7e" labeled
pod "my-nginx-2035384211-u3t6x" labeled
```

<!--
This first filters all pods with the label "app=nginx", and then labels them with the "tier=fe".
To see the pods you just labeled, run:
-->
首先用标签 "app=nginx" 过滤所有的 pod，然后用 "tier=fe" 标记它们。想要查看您刚才标记的 pod，请运行：

```shell
$ kubectl get pods -l app=nginx -L tier
NAME                        READY     STATUS    RESTARTS   AGE       TIER
my-nginx-2035384211-j5fhi   1/1       Running   0          23m       fe
my-nginx-2035384211-u2c7e   1/1       Running   0          23m       fe
my-nginx-2035384211-u3t6x   1/1       Running   0          23m       fe
```

<!--
This outputs all "app=nginx" pods, with an additional label column of pods' tier (specified with `-L` or `--label-columns`).
-->
这将输出所有 "app=nginx" 的 pod，并有一个额外的描述 pod 的 tier 的标签列（使用 `-L` 或者 `--label-columns` 指定）。

<!--
For more information, please see [labels](/docs/concepts/overview/working-with-objects/labels/) and [kubectl label](/docs/user-guide/kubectl/{{page.version}}/#label) document.
-->
想要了解更多信息，请查看 [labels](/docs/concepts/overview/working-with-objects/labels/) 和 [kubectl label](/docs/user-guide/kubectl/{{page.version}}/#label) 文档。

<!--
## Updating annotations
-->
## 更新 annotation

<!--
Sometimes you would want to attach annotations to resources. Annotations are arbitrary non-identifying metadata for retrieval by API clients such as tools, libraries, etc. This can be done with `kubectl annotate`. For example:
-->
有时，您可能希望将 annotation 附加到资源中。annotation 是 API 客户端（如工具、库等）用于检索的任意非标识元数据。这可以通过 `kubectl annotate` 来完成。例如：

```shell
$ kubectl annotate pods my-nginx-v4-9gw19 description='my frontend running nginx'
$ kubectl get pods my-nginx-v4-9gw19 -o yaml
apiversion: v1
kind: pod
metadata:
  annotations:
    description: my frontend running nginx
...
```

<!--
For more information, please see [annotations](/docs/concepts/overview/working-with-objects/annotations/) and [kubectl annotate](/docs/user-guide/kubectl/{{page.version}}/#annotate) document.
-->
想要了解更多信息，请查看 [annotations](/docs/concepts/overview/working-with-objects/annotations/) 和 [kubectl annotate](/docs/user-guide/kubectl/{{page.version}}/#annotate) 文档。

<!--
## Scaling your application
-->
## 伸缩您的应用

<!--
When load on your application grows or shrinks, it's easy to scale with `kubectl`. For instance, to decrease the number of nginx replicas from 3 to 1, do:
-->
当应用上的负载增长或收缩时，使用 `kubectl` 能够轻松实现规模的伸缩。例如，要将 nginx 副本的数量从 3 减少到 1，请执行以下操作：

```shell
$ kubectl scale deployment/my-nginx --replicas=1
deployment "my-nginx" scaled
```

<!--
Now you only have one pod managed by the deployment.
-->
现在，您只有一个由 deployment 管理的 pod 了。

```shell
$ kubectl get pods -l app=nginx
NAME                        READY     STATUS    RESTARTS   AGE
my-nginx-2035384211-j5fhi   1/1       Running   0          30m
```

<!--
To have the system automatically choose the number of nginx replicas as needed, ranging from 1 to 3, do:
-->
想要让系统自动选择需要 nginx 副本的数量，范围从 1 到 3，请执行以下操作：

```shell
$ kubectl autoscale deployment/my-nginx --min=1 --max=3
deployment "my-nginx" autoscaled
```

<!--
Now your nginx replicas will be scaled up and down as needed, automatically.
-->
现在，您的 nginx 副本将根据需要自动地增加或者减少。

<!--
For more information, please see [kubectl scale](/docs/user-guide/kubectl/{{page.version}}/#scale), [kubectl autoscale](/docs/user-guide/kubectl/{{page.version}}/#autoscale) and [horizontal pod autoscaler](/docs/tasks/run-application/horizontal-pod-autoscale/) document.
-->
想要了解更多信息，请查看 [kubectl scale](/docs/user-guide/kubectl/{{page.version}}/#scale)，[kubectl autoscale](/docs/user-guide/kubectl/{{page.version}}/#autoscale) 和 [pod 横向自动伸缩](/docs/tasks/run-application/horizontal-pod-autoscale/) 文档。


<!--
## In-place updates of resources
-->
## 直接更新资源

<!--
Sometimes it's necessary to make narrow, non-disruptive updates to resources you've created.
-->
有时，有必要对您所创建的资源进行小范围的、无干扰的更新。

### kubectl apply

<!--
It is suggested to maintain a set of configuration files in source control (see [configuration as code](http://martinfowler.com/bliki/InfrastructureAsCode.html)),
so that they can be maintained and versioned along with the code for the resources they configure.
Then, you can use [`kubectl apply`](/docs/user-guide/kubectl/{{page.version}}/#apply) to push your configuration changes to the cluster.
-->
建议在源代码管理中维护一组配置文件（请参阅 [像代码一样对待配置 ](http://martinfowler.com/bliki/InfrastructureAsCode.html)），这样，它们就可以与它们配置的资源的代码一起维护和版本化。然后，您可以用 [`kubectl apply`](/docs/user-guide/kubectl/{{page.version}}/#apply) 将您的配置更改推送到集群。

<!--
This command will compare the version of the configuration that you're pushing with the previous version and apply the changes you've made, without overwriting any automated changes to properties you haven't specified.
-->
这个命令将会把推送的版本与以前的版本进行比较，并应用您所做的更改，但是不会覆盖任何你没有指定的自动更改的属性。

```shell
$ kubectl apply -f docs/user-guide/nginx/nginx-deployment.yaml
deployment "my-nginx" configured
```

<!--
Note that `kubectl apply` attaches an annotation to the resource in order to determine the changes to the configuration since the previous invocation. When it's invoked, `kubectl apply` does a three-way diff between the previous configuration, the provided input and the current configuration of the resource, in order to determine how to modify the resource.
-->
注意，`kubectl apply` 将为资源增加一个额外的 annotation，以确定自上次调用以来对配置的更改。当调用它时，`kubectl apply`  会在以前的配置、提供的输入和资源的当前配置之间找出三方差异，以确定如何修改资源。

<!--
Currently, resources are created without this annotation, so the first invocation of `kubectl apply` will fall back to a two-way diff between the provided input and the current configuration of the resource. During this first invocation, it cannot detect the deletion of properties set when the resource was created. For this reason, it will not remove them.
-->
目前，资源是在没有这个 annotation 的情况下创建的，所以，第一次调用 `kubectl apply`  将回到提供的输入和资源的当前配置之间的双向差异。在第一次调用期间，它无法检测资源创建时属性集的删除。因此，不会删除它们。

<!--
All subsequent calls to `kubectl apply`, and other commands that modify the configuration, such as `kubectl replace` and `kubectl edit`, will update the annotation, allowing subsequent calls to `kubectl apply` to detect and perform deletions using a three-way diff.
-->
所有后续调用 `kubectl apply` 以及其它修改配置的命令，如 `kubectl replace` 和 `kubectl edit`，都将更新 annotation，并允许随后调用 `kubectl apply`  去使用三向差异检测和执行删除。

<!--
**Note:** To use apply, always create resource initially with either `kubectl apply` or `kubectl create --save-config`.
-->
**注：** 想要使用 apply，请始终使用 `kubectl apply` 或 `kubectl create --save-config` 创建资源。

### kubectl edit

<!--
Alternatively, you may also update resources with `kubectl edit`:
-->
或者，您也可以使用 `kubectl edit` 更新资源：

```shell
$ kubectl edit deployment/my-nginx
```

<!--
This is equivalent to first `get` the resource, edit it in text editor, and then `apply` the resource with the updated version:
-->
这相当于首先 `get` 资源，在文本编辑器中编辑它，然后用更新的版本 `apply` 资源：

<!--
```shell
$ kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
$ vi /tmp/nginx.yaml
# do some edit, and then save the file
$ kubectl apply -f /tmp/nginx.yaml
deployment "my-nginx" configured
$ rm /tmp/nginx.yaml
```
-->
```shell
$ kubectl get deployment my-nginx -o yaml > /tmp/nginx.yaml
$ vi /tmp/nginx.yaml
# 编辑并保存文件
$ kubectl apply -f /tmp/nginx.yaml
deployment "my-nginx" configured
$ rm /tmp/nginx.yaml
```

<!--
This allows you to do more significant changes more easily. Note that you can specify the editor with your `EDITOR` or `KUBE_EDITOR` environment variables.
-->
这使您可以更加容易地进行更重大的更改。请注意，可以使用 `EDITOR` 或 `KUBE_EDITOR` 环境变量来指定编辑器。

<!--
For more information, please see [kubectl edit](/docs/user-guide/kubectl/{{page.version}}/#edit) document.
-->
想要了解更多信息，请查看 [kubectl edit](/docs/user-guide/kubectl/{{page.version}}/#edit) 文档。

### kubectl patch

<!--
You can use `kubectl patch` to update API objects in place. This command supports JSON patch,
JSON merge patch, and strategic merge patch. See
[Update API Objects in Place Using kubectl patch](/docs/tasks/run-application/update-api-object-kubectl-patch/)
and
[kubectl patch](/docs/user-guide/kubectl/{{page.version}}/#patch).
-->
您可以使用 `kubectl patch` 来更新 API 对象。此命令支持 JSON patch，JSON merge patch，以及 strategic merge patch。请查看 [使用 kubectl patch 更新 API 对象](/docs/tasks/run-application/update-api-object-kubectl-patch/) 和 [kubectl patch](/docs/user-guide/kubectl/{{page.version}}/#patch)。

<!--
## Disruptive updates
-->
## 破坏性的更新

<!--
In some cases, you may need to update resource fields that cannot be updated once initialized, or you may just want to make a recursive change immediately, such as to fix broken pods created by a Deployment. To change such fields, use `replace --force`, which deletes and re-creates the resource. In this case, you can simply modify your original configuration file:
-->
在某些情况下，您可能需要更新某些初始化后无法更新的资源字段，或者您可能只想立即进行递归更改，例如修复 Deployment 创建的不正常的 pod。若要更改这些字段，请使用 `replace --force`，它将删除并重新创建资源。在这种情况下，您可以简单地修改原始配置文件：

```shell
$ kubectl replace -f docs/user-guide/nginx/nginx-deployment.yaml --force
deployment "my-nginx" deleted
deployment "my-nginx" replaced
```

<!--
## Updating your application without a service outage
-->
## 在不中断服务的情况下更新应用

<!--
At some point, you'll eventually need to update your deployed application, typically by specifying a new image or image tag, as in the canary deployment scenario above. `kubectl` supports several update operations, each of which is applicable to different scenarios.
-->
在某些时候，您最终需要更新已部署的应用，通常都是通过指定新的镜像或镜像 tag，如上面的金丝雀部署场景中所示。`kubectl` 支持几个更新操作，每个更新操作都适用于不同的场景。

<!--
We'll guide you through how to create and update applications with Deployments. If your deployed application is managed by Replication Controllers,
you should read [how to use `kubectl rolling-update`](/docs/tasks/run-application/rolling-update-replication-controller/) instead.
-->
我们将指导您通过 Deployment 如何创建和更新应用。如果部署的应用由副本控制器（Replication Controllers）管理，那么您应该选择阅读 [怎么样使用 `kubectl rolling-update`](/docs/tasks/run-application/rolling-update-replication-controller/)。

<!--
Let's say you were running version 1.7.9 of nginx:
-->
假设您正运行的是 1.7.9 版本的 nginx：

```shell
$ kubectl run my-nginx --image=nginx:1.7.9 --replicas=3
deployment "my-nginx" created
```

<!--
To update to version 1.9.1, simply change `.spec.template.spec.containers[0].image` from `nginx:1.7.9` to `nginx:1.9.1`, with the kubectl commands we learned above.
-->
要更新到 1.9.1 版本，只需使用我们前面学到的 kubectl 命令将 `.spec.template.spec.containers[0].image` 从 `nginx:1.7.9` 修改为 `nginx:1.9.1`。

```shell
$ kubectl edit deployment/my-nginx
```

<!--
That's it! The Deployment will declaratively update the deployed nginx application progressively behind the scene. It ensures that only a certain number of old replicas may be down while they are being updated, and only a certain number of new replicas may be created above the desired number of pods. To learn more details about it, visit [Deployment page](/docs/concepts/workloads/controllers/deployment/).
-->
是这样子的。Deployment 将在后台逐步更新已经部署的 nginx 应用。它确保在更新过程中，只有一定数量的旧副本被开闭，并且只有一定超过所需 pod 数量的新副本被创建。想要学习更多关于它的细节，请参考 [Deployment 页](/docs/concepts/workloads/controllers/deployment/)。

<!--
## What's next?

- [Learn about how to use `kubectl` for application introspection and debugging.](/docs/tasks/debug-application-cluster/debug-application-introspection/)
- [Configuration Best Practices and Tips](/docs/concepts/configuration/overview/)
-->
## 接下来呢？
- [学习怎么样使用 `kubectl` 观察和调试应用](/docs/tasks/debug-application-cluster/debug-application-introspection/)
- [配置最佳实践和技巧](/docs/concepts/configuration/overview/)
