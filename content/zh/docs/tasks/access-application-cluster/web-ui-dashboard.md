---
reviewers:
- bryk
- mikedanese
- rf232
title: 网页界面 (Dashboard)
content_template: templates/concept
weight: 10
card:
  name: tasks
  weight: 30
  title: 使用网页界面 Dashboard
---
<!--
---
reviewers:
- bryk
- mikedanese
- rf232
title: Web UI (Dashboard)
content_template: templates/concept
weight: 10
card:
  name: tasks
  weight: 30
  title: Use the Web UI Dashboard
---
-->

{{% capture overview %}}

<!--
Dashboard is a web-based Kubernetes user interface. You can use Dashboard to deploy containerized applications to a Kubernetes cluster, troubleshoot your containerized application, and manage the cluster resources. You can use Dashboard to get an overview of applications running on your cluster, as well as for creating or modifying individual Kubernetes resources (such as Deployments, Jobs, DaemonSets, etc). For example, you can scale a Deployment, initiate a rolling update, restart a pod or deploy new applications using a deploy wizard.

Dashboard also provides information on the state of Kubernetes resources in your cluster and on any errors that may have occurred.
-->
Dashboard 是基于网页的 Kubernetes 用户界面。您可以使用 Dashboard 将容器应用部署到 Kubernetes 集群中，也可以对容器应用排错，还能管理集群资源。您可以使用 Dashboard 获取运行在集群中的应用的概览信息，也可以创建或者修改 Kubernetes 资源（如 Deployment，Job，DaemonSet 等等）。例如，您可以对 Deployment 实现弹性伸缩、发起滚动升级、重启 Pod 或者使用向导创建新的应用。

Dashboard 同时展示了 Kubernetes 集群中的资源状态信息和所有报错信息。

![Kubernetes Dashboard UI](/images/docs/ui-dashboard.png)

{{% /capture %}}


{{% capture body %}}

<!--
## Deploying the Dashboard UI
-->
## 部署 Dashboard UI

<!--
The Dashboard UI is not deployed by default. To deploy it, run the following command:
-->
默认情况下不会部署 Dashboard。可以通过以下命令部署：

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v2.0.0/aio/deploy/recommended.yaml
```

<!--
## Accessing the Dashboard UI
-->
## 访问 Dashboard UI

<!--
To protect your cluster data, Dashboard deploys with a minimal RBAC configuration by default. Currently, Dashboard only supports logging in with a Bearer Token. To create a token for this demo, you can follow our guide on [creating a sample user](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user).
-->
为了保护您的集群数据，默认情况下，Dashboard 会使用最少的 RBAC 配置进行部署。
当前，Dashboard 仅支持使用 Bearer 令牌登录。
要为此样本演示创建令牌，您可以按照[创建示例用户](https://github.com/kubernetes/dashboard/wiki/Creating-sample-user)上的指南进行操作。

<!--
The sample user created in the tutorial will have administrative privileges and is for educational purposes only.
-->
{{< warning >}}
在教程中创建的样本用户将具有管理特权，并且仅用于教育目的。
{{< /warning >}}

<!--
### Command line proxy
-->
### 命令行代理
<!--
You can access Dashboard using the kubectl command-line tool by running the following command:
-->
您可以使用 kubectl 命令行工具访问 Dashboard，命令如下：

```
kubectl proxy
```

<!--
Kubectl will make Dashboard available at http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/.
-->
kubectl 会使得 Dashboard 可以通过 http://localhost:8001/api/v1/namespaces/kubernetes-dashboard/services/https:kubernetes-dashboard:/proxy/ 访问。

<!--
The UI can _only_ be accessed from the machine where the command is executed. See `kubectl proxy --help` for more options.
-->
UI _只能_ 通过执行这条命令的机器进行访问。更多选项参见 `kubectl proxy --help`。

<!--
Kubeconfig Authentication method does NOT support external identity providers or x509 certificate-based authentication.
-->
{{< note >}}
Kubeconfig 身份验证方法不支持外部身份提供程序或基于 x509 证书的身份验证。
{{< /note >}}

<!--
## Welcome view
-->
## 欢迎界面

<!--
When you access Dashboard on an empty cluster, you'll see the welcome page. This page contains a link to this document as well as a button to deploy your first application. In addition, you can view which system applications are running by default in the `kube-system` [namespace](/docs/tasks/administer-cluster/namespaces/) of your cluster, for example the Dashboard itself.
 -->
当访问空集群的 Dashboard 时，您会看到欢迎界面。页面包含一个指向此文档的链接，以及一个用于部署第一个应用程序的按钮。此外，您可以看到在默认情况下有哪些默认系统应用运行在 `kube-system` [命名空间](/docs/tasks/administer-cluster/namespaces/) 中，比如 Dashboard 自己。

<!--
![Kubernetes Dashboard welcome page](/images/docs/ui-dashboard-zerostate.png)
 -->
![Kubernetes Dashboard 欢迎页面](/images/docs/ui-dashboard-zerostate.png)

<!--
## Deploying containerized applications
-->
## 部署容器化应用

<!--
Dashboard lets you create and deploy a containerized application as a Deployment and optional Service with a simple wizard. You can either manually specify application details, or upload a YAML or JSON file containing application configuration.
-->
通过一个简单的部署向导，您可以使用 Dashboard 将容器化应用作为一个 Deployment 和可选的 Service 进行创建和部署。可以手工指定应用的详细配置，或者上传一个包含应用配置的 YAML 或 JSON 文件。

<!--
Click the **CREATE** button in the upper right corner of any page to begin.
-->
点击任何页面右上角的 **创建** 按钮以开始。

<!--
### Specifying application details
-->
### 指定应用的详细配置

<!--
The deploy wizard expects that you provide the following information:
-->
部署向导需要您提供以下信息：

<!--
- **App name** (mandatory): Name for your application. A [label](/docs/concepts/overview/working-with-objects/labels/) with the name will be added to the Deployment and Service, if any, that will be deployed.
-->
- **应用名称**（必填）：应用的名称。内容为`应用名称`的[标签](/docs/concepts/overview/working-with-objects/labels/) 会被添加到任何将被部署的 Deployment 和 Service。

<!--
  The application name must be unique within the selected Kubernetes [namespace](/docs/tasks/administer-cluster/namespaces/). It must start with a lowercase character, and end with a lowercase character or a number, and contain only lowercase letters, numbers and dashes (-). It is limited to 24 characters. Leading and trailing spaces are ignored.
-->
  在选定的 Kubernetes [命名空间](/docs/tasks/administer-cluster/namespaces/) 中，应用名称必须唯一。必须由小写字母开头，以数字或者小写字母结尾，并且只含有小写字母、数字和中划线（-）。小于等于24个字符。开头和结尾的空格会被忽略。

<!--
- **Container image** (mandatory): The URL of a public Docker [container image](/docs/concepts/containers/images/) on any registry, or a private image (commonly hosted on the Google Container Registry or Docker Hub). The container image specification must end with a colon.
 -->
- **容器镜像**（必填）：公共镜像仓库上的 Docker [容器镜像](/docs/concepts/containers/images/) 或者私有镜像仓库（通常是 Google Container Registery 或者 Docker Hub）的 URL。容器镜像参数说明必须以冒号结尾。

<!--
- **Number of pods** (mandatory): The target number of Pods you want your application to be deployed in. The value must be a positive integer.
-->
- **pod 的数量**（必填）：您希望应用程序部署的 Pod 的数量。值必须为正整数。

<!--
  A [Deployment](/docs/concepts/workloads/controllers/deployment/) will be created to maintain the desired number of Pods across your cluster.
-->
  系统会创建一个 [Deployment](/docs/concepts/workloads/controllers/deployment/) 用于保证集群中运行了期望的 Pod 数量。

<!--
- **Service** (optional): For some parts of your application (e.g. frontends) you may want to expose a [Service](/docs/concepts/services-networking/service/) onto an external, maybe public IP address outside of your cluster (external Service). For external Services, you may need to open up one or more ports to do so. Find more details [here](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/).
 -->
- **服务**（可选）：对于部分应用（比如前端），您可能想对外暴露一个 [Service](/docs/concepts/services-networking/service/) ，这个 Service（外部 Service）可能用的是集群之外的公网 IP 地址。对于外部 Service 的情况，需要开放一个或者多个端口来满足。更多信息请参考 [这里](/docs/tasks/access-application-cluster/configure-cloud-provider-firewall/)。

<!--
  Other Services that are only visible from inside the cluster are called internal Services.
-->
  其它只能对集群内部可见的 Service 称为内部 Service。
  
<!--
  Irrespective of the Service type, if you choose to create a Service and your container listens on a port (incoming), you need to specify two ports. The Service will be created mapping the port (incoming) to the target port seen by the container. This Service will route to your deployed Pods. Supported protocols are TCP and UDP. The internal DNS name for this Service will be the value you specified as application name above.
 -->
  不管哪种 Service 类型，如果您选择创建一个 Service，而且容器在一个端口上开启了监听（入向的），那么您需要定义两个端口。创建的 Service 会把（入向的）端口映射到容器可见的目标端口。该 Service 会把流量路由到您部署的 Pod。支持的协议有 TCP 和 UDP。这个 Service 的内部 DNS 解析名就是之前您定义的应用名称的值。

<!--
If needed, you can expand the **Advanced options** section where you can specify more settings:
 -->
如果需要，您可以打开 **高级选项** 部分，这里您可以定义更多设置：

<!--
- **Description**: The text you enter here will be added as an [annotation](/docs/concepts/overview/working-with-objects/annotations/) to the Deployment and displayed in the application's details.
 -->
- **描述**：这里您输入的文本会作为一个 [注解](/docs/concepts/overview/working-with-objects/annotations/) 添加到 Deployment，并显示在应用的详细信息中。

<!--
- **Labels**: Default [labels](/docs/concepts/overview/working-with-objects/labels/) to be used for your application are application name and version. You can specify additional labels to be applied to the Deployment, Service (if any), and Pods, such as release, environment, tier, partition, and release track.
-->
- **标签**：应用默认使用的 [标签](/docs/concepts/overview/working-with-objects/labels/) 是应用名称和版本。您可以为 Deployment、Service（如果有）定义额外的标签，比如 release（版本）、environment（环境）、tier（层级）、partition（分区） 和 release track（版本跟踪）。

<!--
  Example:
-->
  例子：

  ```conf
release=1.0
tier=frontend
environment=pod
track=stable
```

<!--
- **Namespace**: Kubernetes supports multiple virtual clusters backed by the same physical cluster. These virtual clusters are called [namespaces](/docs/tasks/administer-cluster/namespaces/). They let you partition resources into logically named groups.
-->
- **命名空间**：Kubernetes 支持多个虚拟集群依附于同一个物理集群。这些虚拟集群被称为 [命名空间](/docs/tasks/administer-cluster/namespaces/)，可以让您将资源划分为逻辑命名的组。

<!--
  Dashboard offers all available namespaces in a dropdown list, and allows you to create a new namespace. The namespace name may contain a maximum of 63 alphanumeric characters and dashes (-) but can not contain capital letters.
-->
Dashboard 通过下拉菜单提供所有可用的命名空间，并允许您创建新的命名空间。命名空间的名称最长可以包含 63 个字母或数字和中横线（-），但是不能包含大写字母。
<!--
  Namespace names should not consist of only numbers. If the name is set as a number, such as 10, the pod will be put in the default namespace.
-->
 命名空间的名称不能只包含数字。如果名字被设置成一个数字，比如 10，pod 就

<!--
  In case the creation of the namespace is successful, it is selected by default. If the creation fails, the first namespace is selected.
-->
  在 namespace 创建成功的情况下，默认会使用新创建的命名空间。如果创建失败，那么第一个命名空间会被选中。

<!--
- **Image Pull Secret**: In case the specified Docker container image is private, it may require [pull secret](/docs/concepts/configuration/secret/) credentials.
-->
- **镜像拉取 Secret**：如果要使用私有的 Docker 容器镜像，需要拉取 [secret](/docs/concepts/configuration/secret/) 凭证。

<!--
  Dashboard offers all available secrets in a dropdown list, and allows you to create a new secret. The secret name must follow the DNS domain name syntax, e.g. `new.image-pull.secret`. The content of a secret must be base64-encoded and specified in a  [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) file. The secret name may consist of a maximum of 253 characters.
-->
  Dashboard 通过下拉菜单提供所有可用的 secret，并允许您创建新的 secret。secret 名称必须遵循 DNS 域名语法，比如 `new.image-pull.secret`。secret 的内容必须是 base64 编码的，并且在一个 [`.dockercfg`](/docs/concepts/containers/images/#specifying-imagepullsecrets-on-a-pod) 文件中声明。secret 名称最大可以包含 253 个字符。
  
<!--
  In case the creation of the image pull secret is successful, it is selected by default. If the creation fails, no secret is applied.
-->
  在镜像拉取 secret 创建成功的情况下，默认会使用新创建的 secret。如果创建失败，则不会使用任何 secret。

<!--
- **CPU requirement (cores)** and **Memory requirement (MiB)**: You can specify the minimum [resource limits](/docs/tasks/configure-pod-container/limit-range/) for the container. By default, Pods run with unbounded CPU and memory limits.
 -->
- **CPU 需求（核数）**和**内存需求（MiB）**：您可以为容器定义最小的 [资源限制](/docs/tasks/configure-pod-container/limit-range/)。默认情况下，Pod 没有 CPU 和内存限制。

<!--
- **Run command** and **Run command arguments**: By default, your containers run the specified Docker image's default [entrypoint command](/docs/user-guide/containers/#containers-and-commands). You can use the command options and arguments to override the default.
 -->
- **运行命令**和**运行命令参数**：默认情况下，您的容器会运行 Docker 镜像的默认 [入口命令](/docs/user-guide/containers/#containers-and-commands)。您可以使用 command 选项覆盖默认值。

<!--
- **Run as privileged**: This setting determines whether processes in [privileged containers](/docs/user-guide/pods/#privileged-mode-for-pod-containers) are equivalent to processes running as root on the host. Privileged containers can make use of capabilities like manipulating the network stack and accessing devices.
 -->
- **以特权运行**：这个设置决定了在 [特权容器](/docs/user-guide/pods/#privileged-mode-for-pod-containers) 中运行的进程是否像主机中使用 root 运行的进程一样。特权容器可以使用诸如操纵网络堆栈和访问设备的功能。

<!--
- **Environment variables**: Kubernetes exposes Services through [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/). You can compose environment variable or pass arguments to your commands using the values of environment variables. They can be used in applications to find a Service. Values can reference other variables using the `$(VAR_NAME)` syntax.
 -->
- **环境变量**：Kubernetes 通过 [环境变量](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/) 暴露 Service。您可以构建环境变量，或者将环境变量的值作为参数传递给您的命令。它们可以被应用用于查找 Service。值可以通过  `$(VAR_NAME)` 语法关联其他变量。

<!--
### Uploading a YAML or JSON file
-->
### 上传 YAML 或者 JSON 文件

<!--
Kubernetes supports declarative configuration. In this style, all configuration is stored in YAML or JSON configuration files using the Kubernetes [API](/docs/concepts/overview/kubernetes-api/) resource schemas.
-->
Kubernetes 支持声明式配置。所有的配置都存储在遵循 Kubernetes [API](/docs/concepts/overview/kubernetes-api/) 架构的 YAML 或者 JSON 配置文件中。

<!--
As an alternative to specifying application details in the deploy wizard, you can define your application in YAML or JSON files, and upload the files using Dashboard:
-->
作为一种替代在部署向导中指定应用详情的方式，您可以在 YAML 或者 JSON 文件中定义应用，并且使用 Dashboard 上传文件：

<!--
## Using Dashboard
-->
## 使用 Dashboard
<!--
Following sections describe views of the Kubernetes Dashboard UI; what they provide and how can they be used.
-->
以下各节描述了 Kubernetes Dashboard UI 视图；包括它们提供的内容，以及怎么使用它们。

<!--
### Navigation
-->
### 导航栏

<!--
When there are Kubernetes objects defined in the cluster, Dashboard shows them in the initial view. By default only objects from the _default_ namespace are shown and this can be changed using the namespace selector located in the navigation menu.
-->
当在集群中定义 Kubernetes 对象时，Dashboard 会在初始视图中显示它们。默认情况下只会显示 _默认_ 命名空间中的对象，可以通过更改导航栏菜单中的命名空间筛选器进行改变。

<!--
Dashboard shows most Kubernetes object kinds and groups them in a few menu categories.
-->
Dashboard 展示大部分 Kubernetes 对象，并将它们分组放在几个菜单类别中。

<!--
#### Admin Overview
-->
#### 管理概述

<!--
For cluster and namespace administrators, Dashboard lists Nodes, Namespaces and Persistent Volumes and has detail views for them. Node list view contains CPU and memory usage metrics aggregated across all Nodes. The details view shows the metrics for a Node, its specification, status, allocated resources, events and pods running on the node.
-->
集群和命名空间管理的视图, Dashboard 会列出节点、命名空间和持久卷，并且有它们的详细视图。节点列表视图包含从所有节点聚合的 CPU 和内存使用的度量值。详细信息视图显示了一个节点的度量值，它的规格、状态、分配的资源、事件和这个节点上运行的 Pod。

<!--
#### Workloads
Shows all applications running in the selected namespace. The view lists applications by workload kind (e.g., Deployments, Replica Sets, Stateful Sets, etc.) and each workload kind can be viewed separately. The lists summarize actionable information about the workloads, such as the number of ready pods for a Replica Set or current memory usage for a Pod.
 -->
#### 负载
显示选中的命名空间中所有运行的应用。视图按照负载类型（如 Deployment、ReplicaSet、StatefulSet 等）罗列应用，并且每种负载都可以单独查看。列表总结了关于负载的可执行信息，比如一个 ReplicaSet 的准备状态的 Pod 数量，或者目前一个 Pod 的内存使用量。

<!--
Detail views for workloads show status and specification information and surface relationships between objects. For example, Pods that Replica Set is controlling or New Replica Sets and Horizontal Pod Autoscalers for Deployments.
-->
工作负载的详情视图展示了对象的状态、详细信息和相互关系。例如，ReplicaSet 所控制的 Pod，或者 Deployment 关联的 新 ReplicaSet 和 Pod 水平扩展控制器。

<!--
#### Services
Shows Kubernetes resources that allow for exposing services to external world and discovering them within a cluster. For that reason, Service and Ingress views show Pods targeted by them, internal endpoints for cluster connections and external endpoints for external users.
-->
#### 服务
展示允许暴露给外网服务和允许集群内部发现的 Kubernetes 资源。因此，Service 和 Ingress 视图展示他们关联的 Pod、给集群连接使用的内部端点和给外部用户使用的外部端点。

<!--
#### Storage
-->
#### 存储
<!--
Storage view shows Persistent Volume Claim resources which are used by applications for storing data.
-->
存储视图展示持久卷申领（PVC）资源，这些资源被应用程序用来存储数据。

<!--
#### Config Maps and Secrets
-->
#### 配置
<!--
Shows all Kubernetes resources that are used for live configuration of applications running in clusters. The view allows for editing and managing config objects and displays secrets hidden by default.
-->
展示的所有 Kubernetes 资源是在集群中运行的应用程序的实时配置。通过这个视图可以编辑和管理配置对象，并显示那些默认隐藏的 secret。

<!--
#### Logs viewer
-->
#### 日志查看器
<!--
Pod lists and detail pages link to logs viewer that is built into Dashboard. The viewer allows for drilling down logs from containers belonging to a single Pod.
-->
Pod 列表和详细信息页面可以链接到 Dashboard 内置的日志查看器。查看器可以钻取属于同一个 Pod 的不同容器的日志。

<!--
![Logs viewer](/images/docs/ui-dashboard-logs-view.png)
 -->
![日志浏览](/images/docs/ui-dashboard-logs-view.png)

{{% /capture %}}

{{% capture whatsnext %}}

<!--
For more information, see the
[Kubernetes Dashboard project page](https://github.com/kubernetes/dashboard).
-->
更多信息，参见
[Kubernetes Dashboard 项目页面](https://github.com/kubernetes/dashboard).

{{% /capture %}}
