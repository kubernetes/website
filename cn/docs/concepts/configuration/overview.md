---
assignees:
- mikedanese
title: 配置最佳实践
redirect_from:
- "/docs/user-guide/config-best-practices/"
- "/docs/user-guide/config-best-practices.html"
cn-approvers:
- rootsongjc
cn-reviewers:
- shidrdn
---

{% capture overview %}

<!--
This document highlights and consolidates configuration best practices that are introduced throughout the user-guide, getting-started documentation, and examples.

This is a living document. If you think of something that is not on this list but might be useful to others, please don't hesitate to file an issue or submit a PR.

-->

本文档旨在汇总和强调用户指南、快速开始文档和示例中的最佳实践。

该文档会很活跃并持续更新中。如果您觉得很有用的最佳实践但是本文档中没有包含，欢迎给我们提 Pull Request。

{% endcapture %}

{% capture body %}

<!--

## General Config Tips

- When defining configurations, specify the latest stable API version (currently v1).

- Configuration files should be stored in version control before being pushed to the cluster. This allows quick roll-back of a configuration if needed. It also aids with cluster re-creation and restoration if necessary.

- Write your configuration files using YAML rather than JSON. Though these formats can be used interchangeably in almost all scenarios, YAML tends to be more user-friendly.

- Group related objects into a single file whenever it makes sense. One file is often easier to manage than several. See the [guestbook-all-in-one.yaml](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/all-in-one/guestbook-all-in-one.yaml) file as an example of this syntax.

  Note also that many `kubectl` commands can be called on a directory, so you can also call `kubectl create` on a directory of config files. See below for more details.

- Don't specify default values unnecessarily, in order to simplify and minimize configs, and to reduce error. For example, omit the selector and labels in a `ReplicationController` if you want them to be the same as the labels in its `podTemplate`, since those fields are populated from the `podTemplate` labels by default. See the [guestbook app's](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) .yaml files for some [examples](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/frontend-deployment.yaml) of this.

- Put an object description in an annotation to allow better introspection.

-->

## 通用配置建议

- 定义配置文件的时候，指定最新的稳定 API 版本（目前是 V1）。
- 在配置文件 push 到集群之前应该保存在版本控制系统中。这样当需要的时候能够快速回滚，必要的时候也可以快速的创建集群。
- 使用 YAML 格式而不是 JSON 格式的配置文件。在大多数场景下它们都可以作为数据交换格式，但是 YAML 格式比起 JSON 更易读和配置。
- 尽量将相关的对象放在同一个配置文件里。这样比分成多个文件更容易管理。参考 [guestbook-all-in-one.yaml](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/all-in-one/guestbook-all-in-one.yaml) 文件中的配置（注意，尽管您可以在使用 `kubectl` 命令时指定配置文件目录，您也可以在配置文件目录下执行  `kubectl create`——查看下面的详细信息）。
- 为了简化和最小化配置，也为了防止错误发生，不要指定不必要的默认配置。例如，省略掉 `ReplicationController` 的 selector 和 label，如果您希望它们跟 `podTemplate` 中的 label 一样的话，因为那些配置默认是 `podTemplate` 的 label 产生的。更多信息请查看 [guestbook app](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/) 的 yaml 文件和  [examples](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/frontend-deployment.yaml) 。
- 将资源对象的描述放在一个 annotation 中可以更好的内省。

<!--

## "Naked" Pods vs Replication Controllers and Jobs

- If there is a viable alternative to naked pods (in other words: pods not bound to a [replication controller](/docs/user-guide/replication-controller)), go with the alternative. Naked pods will not be rescheduled in the event of node failure.

  Replication controllers are almost always preferable to creating pods, except for some explicit [`restartPolicy: Never`](/docs/concepts/workloads/pods/pod-lifecycle/#restart-policy) scenarios. A [Job](/docs/concepts/jobs/run-to-completion-finite-workloads/) object (currently in Beta) may also be appropriate.

-->

## ”裸“ Pod 对比 Replication Controllers 和  Job

- 如果有其他方式替代 “裸的“ pod（如没有绑定到 [replication controller ](docs/user-guide/replication-controller)上的 pod，那么就使用其他选择。在 node 节点出现故障时，裸的 pod 不会被重新调度。Replication Controller 总是会重新创建 pod，除了明确指定了 [`restartPolicy: Never`](docs/concepts/workloads/pods/pod-lifecycle/#restart-policy)  的场景。[Job](docs/concepts/jobs/run-to-completion-finite-workloads/)  也许是比较合适的选择。

<!--

## Services

- It's typically best to create a [service](/docs/concepts/services-networking/service/) before corresponding [replication controllers](/docs/concepts/workloads/controllers/replicationcontroller/). This lets the scheduler spread the pods that comprise the service.

  You can also use this process to ensure that at least one replica works before creating lots of them:

      1. Create a replication controller without specifying replicas (this will set replicas=1);
      2. Create a service;
      3. Then scale up the replication controller.

- Don't use `hostPort` unless it is absolutely necessary (for example: for a node daemon). It specifies the port number to expose on the host. When you bind a Pod to a `hostPort`, there are a limited number of places to schedule a pod due to port conflicts— you can only schedule as many such Pods as there are nodes in your Kubernetes cluster.

  If you only need access to the port for debugging purposes, you can use the [kubectl proxy and apiserver proxy](/docs/tasks/access-kubernetes-api/http-proxy-access-api/) or [kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/).
  You can use a [Service](/docs/concepts/services-networking/service/) object for external service access.

  If you explicitly need to expose a pod's port on the host machine, consider using a [NodePort](/docs/user-guide/services/#type-nodeport) service before resorting to `hostPort`.

- Avoid using `hostNetwork`, for the same reasons as `hostPort`.

- Use _headless services_ for easy service discovery when you don't need kube-proxy load balancing. See [headless services](/docs/user-guide/services/#headless-services).

-->

## Service

- 通常最好在创建相关的 [replication controller](docs/concepts/workloads/controllers/replicationcontroller/) 之前先创建 [service](docs/concepts/services-networking/service/) 。这样能够让 scheduler 传播构成 service 的 pod。

  您也可以按照下列过程确保在创建很多个 pod 之前确保至少有一个 replica 是可以工作的：

  1. 创建 Replication Controller 的时候不指定 replica 数量（默认是1）；
  2. 创建 service ；
  3. 通过 Replication Controller 来扩容。

- 除非十分必要的情况下（如运行一个 node daemon），不要使用 `hostPort`（用来指定暴露在主机上的端口号）。当您给 Pod 绑定了一个 `hostPort`，该 pod 可被调度到的主机的受限了，因为端口冲突。如果是为了调试目的来通过端口访问的话，您可以使用  [kubectl proxy 和 apiserver proxy](docs/tasks/access-kubernetes-api/http-proxy-access-api/)  或者  [kubectl 端口转发](docs/tasks/access-application-cluster/port-forward-access-application-cluster/)。您可使用  [Service](/docs/concepts/services-networking/service/)  来对外暴露服务。如果您确实需要将 pod 的端口暴露到主机上，考虑使用 [NodePort](docs/user-guide/services/#type-nodeport) service。

- 跟 `hostPort` 一样的原因，避免使用  `hostNetwork`。

- 如果您不需要 kube-proxy 的负载均衡的话，可以考虑使用使用 [headless service](docs/user-guide/services/#headless-services)。

<!--

## Using Labels

- Define and use [labels](/docs/user-guide/labels/) that identify __semantic attributes__ of your application or deployment. For example, instead of attaching a label to a set of pods to explicitly represent some service (For example, `service: myservice`), or explicitly representing the replication controller managing the pods  (for example, `controller: mycontroller`), attach labels that identify semantic attributes, such as `{ app: myapp, tier: frontend, phase: test, deployment: v3 }`. This will let you select the object groups appropriate to the context— for example, a service for all "tier: frontend" pods, or all "test" phase components of app "myapp". See the [guestbook](https://github.com/kubernetes/kubernetes/tree/{{page.githubbranch}}/examples/guestbook/) app for an example of this approach.

  A service can be made to span multiple deployments, such as is done across [rolling updates](/docs/tasks/run-application/rolling-update-replication-controller/), by simply omitting release-specific labels from its selector, rather than updating a service's selector to match the replication controller's selector fully.

- To facilitate rolling updates, include version info in replication controller names, for example as a suffix to the name. It is useful to set a 'version' label as well. The rolling update creates a new controller as opposed to modifying the existing controller. So, there will be issues with version-agnostic controller names. See the [documentation](/docs/tasks/run-application/rolling-update-replication-controller/) on the rolling-update command for more detail.

  Note that the [Deployment](/docs/concepts/workloads/controllers/deployment/) object obviates the need to manage replication controller 'version names'. A desired state of an object is described by a Deployment, and if changes to that spec are _applied_, the deployment controller changes the actual state to the desired state at a controlled rate. (Deployment objects are currently part of the [`extensions` API Group](/docs/concepts/overview/kubernetes-api/#api-groups).)

- You can manipulate labels for debugging. Because Kubernetes replication controllers and services match to pods using labels, this allows you to remove a pod from being considered by a controller, or served traffic by a service, by removing the relevant selector labels. If you remove the labels of an existing pod, its controller will create a new pod to take its place. This is a useful way to debug a previously "live" pod in a quarantine environment. See the [`kubectl label`](/docs/concepts/overview/working-with-objects/labels/) command.

-->

## 使用 Label

- 定义  [labels](docs/user-guide/labels/)  来指定应用或 Deployment 的 _语义属性_ 。例如，不是将 label 附加到一组 pod 来显式表示某些服务（例如，`service:myservice`），或者显式地表示管理 pod 的 replication controller（例如，`controller:mycontroller`），附加 label 应该是标示语义属性的标签， 例如 `{app:myapp,tier:frontend,phase:test,deployment:v3}`。 这将允许您选择适合上下文的对象组——例如，所有的 ”tier:frontend“ pod 的服务或 app 是 “myapp” 的所有“测试”阶段组件。 有关此方法的示例，请参阅 [guestbook](https://github.com/kubernetes/kubernetes/tree/master/examples/guestbook/) 应用程序。

  可以通过简单地从其 service 的选择器中省略特定于发行版本的标签，而不是更新服务的选择器来完全匹配 replication controller 的选择器，来实现跨越多个部署的服务，例如滚动更新。

- 为了滚动升级的方便，在 Replication Controller 的名字中包含版本信息，例如作为名字的后缀。设置一个 `version` 标签页是很有用的。滚动更新创建一个新的 controller 而不是修改现有的 controller。因此， version 含混不清的 controller 名字就可能带来问题。查看 [滚动升级 Replication Controller ](docs/tasks/run-application/rolling-update-replication-controller/)文档获取更多关于滚动升级命令的信息。

  注意  [Deployment](docs/concepts/workloads/controllers/deployment/)  对象不需要再管理  replication controller  的版本名。Deployment 中描述了对象的期望状态，如果对 spec 的更改被应用了的话，Deployment controller 会以控制的速率将实际状态更改到期望状态。（Deployment 目前是  [`extensions` API Group ](docs/concepts/overview/kubernetes-api/#api-groups)的一部分）。

- 利用 label 做调试。因为 Kubernetes replication controller 和 service 使用 label 来匹配 pod，这允许您通过移除 pod 中的 label 的方式将其从一个 controller 或者 service 中移除，原来的 controller 会创建一个新的 pod 来取代移除的 pod。这是一个很有用的方式，帮您在一个隔离的环境中调试之前的 “活着的” pod。查看 [`kubectl label`](docs/concepts/overview/working-with-objects/labels/) 命令。

<!--

## Container Images

- The [default container image pull policy](/docs/concepts/containers/images/) is `IfNotPresent`, which causes the [Kubelet](/docs/admin/kubelet/) to not pull an image if it already exists. If you would like to always force a pull, you must specify a pull image policy of `Always` in your .yaml file (`imagePullPolicy: Always`) or specify a `:latest` tag on your image.

  That is, if you're specifying an image with other than the `:latest` tag, for example `myimage:v1`, and there is an image update to that same tag, the Kubelet won't pull the updated image. You can address this by ensuring that any updates to an image bump the image tag as well (for example, `myimage:v2`), and ensuring that your configs point to the correct version.

  **Note:** you should avoid using `:latest` tag when deploying containers in production, because this makes it hard to track which version of the image is running and hard to roll back.

-->

## 容器镜像

- [默认容器镜像拉取策略](docs/concepts/containers/images/) 是  `IfNotPresent`, 当本地已存在该镜像的时候  [Kubelet](docs/admin/kubelet/)  不会再从镜像仓库拉取。如果您希望总是从镜像仓库中拉取镜像的话，在yaml文件中指定镜像拉取策略为 `Always`（ `imagePullPolicy: Always`）或者指定镜像的 tag 为 `:latest` 。

  如果您没有将镜像标签指定为 `:latest`，例如指定为 `myimage:v1`，当该标签的镜像进行了更新，kubelet 也不会拉取该镜像。您可以在每次镜像更新后都生成一个新的 tag（例如 `myimage:v2`），在配置文件中明确指定该版本。

  **注意：** 在生产环境下部署容器应该尽量避免使用 `:latest` 标签，因为这样很难追溯到底运行的是哪个版本的容器和回滚。

<!--

## Using kubectl

- Use `kubectl create -f <directory>` where possible. This looks for config objects in all `.yaml`, `.yml`, and `.json` files in `<directory>` and passes them to `create`.

- Use `kubectl delete` rather than `stop`. `Delete` has a superset of the functionality of `stop`, and `stop` is deprecated.

- Use kubectl bulk operations (via files and/or labels) for get and delete. See [label selector](/docs/user-guide/labels/#label-selectors) and [using labels effectively](/docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively).

- Use `kubectl run` and `expose` to quickly create and expose single container Deployments. See the [quick start](/docs/user-guide/quick-start/) for an example.

-->

## 使用 kubectl

- 尽量使用 `kubectl create -f <directory>`  。kubeclt 会自动查找该目录下的所有后缀名为 `.yaml`、`.yml` 和 `.json` 文件并将它们传递给`create`命令。
- 使用  `kubectl delete` 而不是 `stop`. `Delete` 是  `stop` 的超集，`stop` 已经被弃用。
- 使用 kubectl bulk 操作（通过文件或者 label）来 get 和 delete。查看 [label selector ](docs/user-guide/labels/#label-selectors) 和  [有效地使用 label](docs/concepts/cluster-administration/manage-deployment/#using-labels-effectively)。
- 使用  `kubectl run` 和 `expose` 命令快速创建只有单个容器的 Deployment。查看 [入门指南](docs/user-guide/quick-start/) 中的示例。

{% endcapture %}

{% include templates/concept.md %}
