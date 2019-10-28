---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: 高级主题
track: "USERS › APPLICATION DEVELOPER › ADVANCED"
content_template: templates/user-journey-content
---
<!--
---
reviewers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: Advanced Topics
track: "USERS › APPLICATION DEVELOPER › ADVANCED"
content_template: templates/user-journey-content
---
-->
{{% capture overview %}}

<!--
This page assumes that you're familiar with core Kubernetes concepts, and are comfortable deploying your own apps. If not, you should review the {{< link text="Intermediate App Developer" url="/docs/user-journeys/users/application-developer/intermediate/" >}} topics first.
-->
{{< note  >}}
本页假设您熟悉核心 Kubernetes 概念，并且可以轻松部署自己的应用程序。如果没有，您应首先查看 {{< link text="中级应用程序开发人员" url="/docs/user-journeys/users/application-developer/intermediate/" >}}主题。
{{< /note  >}}
<!--
After checking out the current page and its linked sections, you should have a better understanding of the following:

* Advanced features that you can leverage in your application
* The various ways of extending the Kubernetes API
-->
在检测完当前页和它的链接部分后，您应该对以下内容有更好的了解：
* 您可以在应用程序中使用的高级功能
* 扩展 Kubernetes API 的各种方法

{{% /capture %}}


{{% capture body %}}

<!--
## Deploy an application with advanced features
-->
## 用高级功能部署应用程序

<!--
Now you know the set of API objects that Kubernetes provides. Understanding the difference between a {{< glossary_tooltip term_id="daemonset" >}} and a {{< glossary_tooltip term_id="deployment" >}} is oftentimes sufficient for app deployment. That being said, it's also worth familiarizing yourself with Kubernetes's lesser known features. They can be quite powerful when applied to the right use cases.
-->
现在您知道了 Kubernetes 提供的一组 API 对象。理解{{< glossary_tooltip term_id="daemonset" >}}和{{< glossary_tooltip term_id="deployment" >}}之间的差异通常足以支持应用程序的部署。话虽如此，也值得熟悉 Kubernetes 鲜为人知的功能。当应用于正确的用例时，它们可以非常强大。

<!--
#### Container-level features
-->
#### 容器级功能

<!--
As you may know, it's an antipattern to migrate an entire app (e.g. containerized Rails app, MySQL database, and all) into a single Pod. That being said, there are some very useful patterns that go beyond a 1:1 correspondence between a container and its Pod:
-->
就像你知道的那样，将整个应用程序（例如，容器化的 Rails 应用程序，MySQL 数据库和所有应用程序）迁移到单个 Pod 中是一种反模式。话虽如此，有一些非常有用的模式超出了容器和它的 pod 之间 1:1 的对应关系。

<!--
* **Sidecar container**: Although your Pod should still have a single main container, you can add a secondary container that acts as a helper (see a {{< link text="logging example" url="/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent" >}}). Two containers within a single Pod can communicate {{< link text="via a shared volume" url="/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/" >}}.
-->
* **Sidecar 容器**:虽然您的 Pod 仍然应该有一个主容器，但您可以添加一个充当帮助程序的辅助容器(请参阅 {{< link text="记录示例" url="/docs/concepts/cluster-administration/logging/#sidecar-container-with-a-logging-agent" >}})。一个 Pod 里的两个容器可以沟通{{< link text="通过共享卷" url="/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/" >}}。

<!--
* **Init containers**: *Init containers* run before any of a Pod's *app containers* (such as main and sidecar containers). {{< link text="Read more" url="/docs/concepts/workloads/pods/init-containers/" >}}, see an {{< link text="nginx server example" url="/docs/tasks/configure-pod-container/configure-pod-initialization/" >}}, and {{< link text="learn how to debug these containers" url="/docs/tasks/debug-application-cluster/debug-init-containers/" >}}.
-->
* **Init 容器**:*Init 容器*在 Pod 的任何应用程序容器之前运行。{{< link text="阅读更多" url="/docs/concepts/workloads/pods/init-containers/" >}}，请参阅{{< link text="nginx 服务器示例" url="/docs/tasks/configure-pod-container/configure-pod-initialization/" >}}，和{{< link text="了解如何调试这些容器" url="/docs/tasks/debug-application-cluster/debug-init-containers/" >}}。

<!--
#### Pod configuration
-->
#### Pod 配置

<!--
Usually, you use {{< glossary_tooltip text="labels" term_id="label" >}} and {{< glossary_tooltip text="annotations" term_id="annotation" >}} to attach metadata to your resources. To inject data into your resources, you'd likely create {{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}} (for nonconfidential data) or {{< glossary_tooltip text="Secrets" term_id="secret" >}} (for confidential data).
-->
通常，您使用{{< glossary_tooltip text="labels" term_id="label" >}}和{{< glossary_tooltip text="annotations" term_id="annotation" >}}将元数据附加到您的资源。要将数据注入到您的资源，您最好创建{{< glossary_tooltip text="ConfigMaps" term_id="configmap" >}}（对于非机密数据）或{{< glossary_tooltip text="Secrets" term_id="secret" >}}（对于机密数据）。

<!--
Below are some other, lesser-known ways of configuring your resources' Pods:
-->
以下是一些其他鲜为人知的配置资源的方法：

<!--
* **Taints and Tolerations** - These provide a way for nodes to "attract" or "repel" your Pods. They are often used when an application needs to be deployed onto specific hardware, such as GPUs for scientific computing. {{< link text="Read more" url="/docs/concepts/configuration/taint-and-toleration/" >}}.
-->
* **污点和容忍度** -这些为节点“吸引“或”击退“你的 Pod 提供了一种方法。通常在应用程序需要部署在特殊硬件上时使用，比如用于科学计算的 GPU。{{< link text="阅读更多" url="/docs/concepts/configuration/taint-and-toleration/" >}}。
<!--
* **Downward API** - This allows your containers to consume information about themselves or the cluster, without being overly coupled to the Kubernetes API server. This can be achieved with {{< link text="environment variables" url="/docs/tasks/inject-data-application/environment-variable-expose-pod-information/" >}} or {{< link text="DownwardAPIVolumeFiles" url="/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/" >}}.
-->
* **下载 API** -这允许您的容器使用有关自身或集群的信息，而不会过度耦合到 Kubernetes API 服务器。这个可以通过{{< link text="环境变量" url="/docs/tasks/inject-data-application/environment-variable-expose-pod-information/" >}}或者{{< link text="向下的 API 卷文件" url="/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/" >}}来实现。
<!--
* **Pod Presets** - Normally, to mount runtime requirements (such as environmental variables, ConfigMaps, and Secrets) into a resource, you specify them in the resource's configuration file. {{< link text="PodPresets" url="/docs/concepts/workloads/pods/podpreset/" >}} allow you to dynamically inject these requirements instead, when the resource is created. For instance, this allows team A to mount any number of new Secrets into the resources created by teams B and C, without requiring action from B and C. {{< link text="See an example" url="/docs/tasks/inject-data-application/podpreset/" >}}.
-->
* **Pod 预设** -通常，将运行时的要求安装到资源中（比如环境变量、ConfigMaps、和 Secrets），请在资源的配置文件中指定它们。{{< link text="Pod 预设值" url="/docs/concepts/workloads/pods/podpreset/" >}}允许您在创建资源时动态地注入这些需求。例如，这允许团队 A 将任意数量的新 Secrets 安装到团队 B 和 C 创建的资源中，而无需 B 和 C 的命令操作。{{< link text="看一个例子" url="/docs/tasks/inject-data-application/podpreset/" >}}。
* 
<!--
#### Additional API Objects
-->
#### 其他 API 对象

<!--
Before setting up the following resources, check to see if they are the responsibility of your organization's {{< glossary_tooltip text="cluster operators" term_id="cluster-operator" >}}.
-->
{{< note  >}}
在设置以下资源之前，请检查您的组织是否负责{{< glossary_tooltip text="集群 operators" term_id="cluster-operator" >}}。
{{< /note  >}}
<!--
* **{{< glossary_tooltip text="Horizontal Pod Autoscaler (HPA)" term_id="horizontal-pod-autoscaler" >}}** - These resources are a great way to automate the process of scaling your application when CPU usage or other {{< link text="custom metrics" url="https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md" >}} spike. {{< link text="See an example" url="/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/" >}} to understand how HPAs are set up.
-->
* **{{< glossary_tooltip text="Horizontal Pod Autoscaler (HPA)" term_id="horizontal-pod-autoscaler" >}}** - 这些资源是在 CPU 使用或其他{{< link text="自定义指标" url="https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md" >}}峰值时自动执行缩放应用程序的好方法。
{{< link text="参看一个例子" url="/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/" >}}以了解如何设置 HPA。
<!--
* **Federated cluster objects** - If you are running an application on multiple Kubernetes clusters using *federation*, you need to deploy the federated version of the standard Kubernetes API objects. For reference, check out the guides for setting up {{< link text="Federated ConfigMaps" url="/docs/tasks/administer-federation/configmap/" >}} and {{< link text="Federated Deployments" url="/docs/tasks/administer-federation/deployment/" >}}.
-->
* **联合集群对象** - 如果您在多个 Kubernetes 集群上使用*federation*运行应用程序，您需要部署标准 Kubernetes API 对象的联合版本。有关参考，请查看设置指南{{< link text="联邦 ConfigMaps" url="/docs/tasks/administer-federation/configmap/" >}} and {{< link text="联邦 Deployments" url="/docs/tasks/administer-federation/deployment/" >}}。

<!--
## Extend the Kubernetes API
-->
## 扩展 Kunernetes API

<!--
Kubernetes is designed with extensibility in mind. If the API resources and features mentioned above are not enough for your needs, there are ways to customize its behavior without having to modify core Kubernetes code.
-->
Kubernetes 在设计时考虑了可扩展性。如果以上提到的 API 资源和功能不足以满足您的需求，可以通过各种方法自定义其行为，而无需修改核心 Kubernetes 代码。

<!--
#### Understand Kubernetes's default behavior
-->
#### 了解 Kubernetes 的默认行为

<!--
Before making any customizations, it's important that you understand the general abstraction behind Kubernetes API objects. Although Deployments and Secrets may seem quite different, the following concepts are true for *any* object:
-->
在进行任何自定义之前，了解 Kubernetes API 对象背后的一般抽象非常重要。尽管 Deployments 和 Secrets 可能看起来非常不同，以下概念适用于*any* 对象:

<!--
* **Kubernetes objects are a way of storing structured data about your cluster.**
-->
* **Kubernetes 对象是一种存储集群结构化数据的方法。**
<!--
  In the case of Deployments, this data represents desired state (such as "How many replicas should be running?"), but it can also be general metadata (such as database credentials).
-->
对于 Deployments，此数据表示所需的状态（例如“应运行多少个副本？”），但它也可以是常规元数据（例如数据库凭据）。
<!--
* **Kubernetes objects are modified via the {{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}**.
-->
* **Kubernetes 对象通过{{< glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" >}}进行修改**。
<!--
  In other words, you can make `GET` and `POST` requests to a specific resource path (such as `<api-server-url>/api/v1/namespaces/default/deployments`) to read and write the corresponding object type.
-->
换句话说，您可以对特定的资源路径（例如`<api-server-url>/api/v1/namespaces/default/deployments`）发出`GET`和`POST`请求来读写相应的对象类型。
<!--
* **By leveraging the {{< link text="Controller pattern" url="/docs/concepts/api-extension/custom-resources/#custom-controllers" >}}, Kubernetes objects can be used to enforce desired state**. For simplicity, you can think of the Controller pattern as the following continuous loop:
-->
* **通过利用{{< link text="控制器模式" url="/docs/concepts/api-extension/custom-resources/#custom-controllers" >}}，可以使用 Kubernetes 对象来强制执行所需的状态**。为简单起见，您可以将 Controller 模式视为以下连续循环：

<!--
  <div class="emphasize-box" markdown="1">
  1. Check current state (number of replicas, container image, etc)
  2. Compare current state to desired state
  3. Update if there's a mismatch
  </div>
-->
  <div class="emphasize-box" markdown="1">
  1. 检查当前状态(副本数量, 容器镜像等)
  2. 比较当前状态与期望状态
  3. 如果不匹配则更新
  </div>

<!--
  These states are obtained from the Kubernetes API.
-->
  这些状态来自 Kubernetes API。

<!--
Not all Kubernetes objects need to have a Controller. Though Deployments trigger the cluster to make state changes, ConfigMaps act purely as storage.
-->
  {{< note  >}}
  不是所有 Kubernetes 对象都需要一个 Controller。尽管 Deployment 会触发集群进行状态更改，但 ConfigMap 仅作为存储使用。
  {{< /note  >}}
<!--  
#### Create Custom Resources
-->
#### 创建自定义资源

<!-- 
Based on the ideas above, you can define a new {{< link text="Custom Resource" url="/docs/concepts/api-extension/custom-resources/#custom-resources" >}} that is just as legitimate as a Deployment. For example, you might want to define a `Backup` object for periodic backups, if `CronJobs` don't provide all the functionality you need.
-->
基于以上想法，您可以定义一个新的{{< link text="自定义资源" url="/docs/concepts/api-extension/custom-resources/#custom-resources" >}}作为合理的部署。例如，如果`CronJobs`没有提供您需要的所有功能，您可能希望为定期备份定义一个`Backup`对象。

<!-- 
There are two main ways of setting up custom resources:
1. **Custom Resource Definitions (CRDs)** - This method requires the least amount of implementation work. See {{< link text="an example" url="/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/" >}}.
2. **API aggregation** - This method requires some {{< link text="pre-configuration" url="/docs/tasks/access-kubernetes-api/configure-aggregation-layer/" >}} before you actually {{< link text="set up a separate, extension API server" url="/docs/tasks/access-kubernetes-api/setup-extension-api-server/" >}}.
-->
设置自定义资源有两种主要方式：
1.**自定义资源定义 (CRDs)** - 此方法需要的实施工作量最少。请参阅{{< link text="一个例子" url="/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/" >}}。
2.**API 聚合** - 此方法需要一些{{< link text="预配置" url="/docs/tasks/access-kubernetes-api/configure-aggregation-layer/" >}}在你实际上{{< link text="设置一个单独的扩展的 API 服务器" url="/docs/tasks/access-kubernetes-api/setup-extension-api-server/" >}}之前。

<!--
Note that unlike standard Kubernetes objects, which rely on the built-in {{< link text="`kube-controller-manager`" url="/docs/reference/generated/kube-controller-manager/" >}}, you'll need to write and run your own {{< link text="custom controllers" url="https://github.com/kubernetes/sample-controller" >}}.
-->
请注意，与标准的 Kubernetes 对象不同，后者依赖于内置的{{< link text="`kube-controller-manager`" url="/docs/reference/generated/kube-controller-manager/" >}}，您需要编写并运行自己的{{< link text="自定义控制器" url="https://github.com/kubernetes/sample-controller" >}}。

<!--
You may also find the following info helpful:
* {{< link text="How to know if custom resources are right for your use case" url="/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource" >}}
* {{< link text="How to decide between CRDs and API aggregation" url="/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources" >}}
-->
您可能还会发现以下信息有用：
* {{< link text="如何知道自定义资源是否适合您的用例" url="/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource" >}}
* {{< link text="如何决定 CRD 和 API 聚合" url="/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources" >}}

<!--
#### Service Catalog
-->
#### 服务目录

<!--
If you want to consume or provide complete services (rather than individual resources), **{{< glossary_tooltip text="Service Catalog" term_id="service-catalog" >}}** provides a {{< link text="specification" url="https://github.com/openservicebrokerapi/servicebroker" >}} for doing so. These services are registered using {{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}} (see {{< link text="some examples" url="https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#example-service-brokers" >}}).
-->
如果您想使用或提供完整的服务（而不是单个资源），**{{< glossary_tooltip text="Service Catalog" term_id="service-catalog" >}}**提供{{< link text="规格" url="https://github.com/openservicebrokerapi/servicebroker" >}}来这样做。这些服务使用{{< glossary_tooltip text="Service Brokers" term_id="service-broker" >}}注册（请参阅{{< link text="一些例子" url="https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#example-service-brokers" >}}）。

<!--
If you do not have a {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}} to manage the installation of Service Catalog, you can do so using {{< link text="Helm" url="/docs/tasks/service-catalog/install-service-catalog-using-helm/" >}} or an {{< link text="installer binary" url="/docs/tasks/service-catalog/install-service-catalog-using-sc/" >}}.
-->
如果您没有{{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}}来管理服务目录的安装，您可以使用{{< link text="Helm" url="/docs/tasks/service-catalog/install-service-catalog-using-helm/" >}} 或{{< link text="安装程序二进制" url="/docs/tasks/service-catalog/install-service-catalog-using-sc/" >}}。


<!--
## Explore additional resources
-->
## 探索其他资源

<!--
#### References
-->
#### 参考

<!--
The following topics are also useful for building more complex applications:
-->
以下主题对于构建更复杂的应用程序也很有用：

<!--
* {{< link text="Other points of extensibility within Kubernetes" url="/docs/concepts/overview/extending/" >}} -  A conceptual overview of where you can hook into the Kubernetes architecture.
* {{< link text="Kubernetes Client Libraries" url="/docs/reference/using-api/client-libraries/" >}} - Useful for building apps that need to interact heavily with the Kubernetes API.
-->
* {{< link text="Kubernetes 中的其他可扩展性点" url="/docs/concepts/overview/extending/" >}} - 概述您可以在何处进入 Kubernetes 架构。
* {{< link text="Kubernetes 客户库" url="/docs/reference/using-api/client-libraries/" >}} -  用于构建需要与 Kubernetes API 进行大量交互的应用程序。 

<!--
#### What's next
Congrats on completing the Application Developer user journey! You've covered the majority of features that Kubernetes has to offer. What now?
-->
#### 接下来是什么
恭喜您完成应用程序开发者用户之旅！您已经掌握了 Kubernetes 提供的大多数功能。现在该做什么？

<!--
* If you'd like to suggest new features or keep up with the latest developments around Kubernetes app development, consider joining a {{< glossary_tooltip term_id="sig" >}} such as {{< link text="SIG Apps" url="https://github.com/kubernetes/community/tree/master/sig-apps" >}}.
-->
* 如果您想推荐新功能或者了解 Kubernentes 应用程序开发的最新进展，请考虑加入{{< glossary_tooltip term_id="sig" >}}，例如{{< link text="SIG Apps" url="https://github.com/kubernetes/community/tree/master/sig-apps" >}}。

<!--
* If you are interested in learning more about the inner workings of Kubernetes (e.g. networking), consider checking out the {{< link text="Cluster Operator journey" url="/docs/user-journeys/users/cluster-operator/foundational/" >}}.
-->
* 如果您有兴趣了解 Kubernetes 的内部工作（例如网络），请考虑查看{{< link text="Cluster Operator journey" url="/docs/user-journeys/users/cluster-operator/foundational/" >}}。

{{% /capture %}}


