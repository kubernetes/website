---
approvers:
- chenopis
layout: docsportal
css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
title: 高级主题
track: "USERS › APPLICATION DEVELOPER › ADVANCED"
---
<!--
---
approvers:
- chenopis
  layout: docsportal
  css: /css/style_user_journeys.css, https://fonts.googleapis.com/icon?family=Material+Icons
  js: https://use.fontawesome.com/4bcc658a89.js, https://cdnjs.cloudflare.com/ajax/libs/prefixfree/1.0.7/prefixfree.min.js
  title: Advanced Topics
  track: "USERS › APPLICATION DEVELOPER › ADVANCED"
---
-->

{% capture overview %}
<!--
{: .note }
This page assumes that you're familiar with core Kubernetes concepts, and are comfortable deploying your own apps. If not, you should review the [Intermediate App Developer](/docs/user-journeys/users/application-developer/intermediate/){:target="_blank"} topics first.

After checking out the current page and its linked sections, you should have a better understanding of the following:
* Advanced features that you can leverage in your application
* The various ways of extending the Kubernetes API
  -->

{: .note}
本页假定您已经熟悉 Kubernetes 的核心概念并可以轻松的部署自己的应用程序。如果还不能，您需要先查看下[中级应用开发者](/docs/user-journeys/users/application-developer/intermediate/){:target="_blank"}主题。

在浏览了本页面及其链接的内容后，您将会更好的理解如下部分：

- 可以在应用程序中使用的高级功能
- 扩展 Kubernetes API 的各种方法

{% endcapture %}

{% capture body %}

<!--

## Deploy an application with advanced features

Now you know the set of API objects that Kubernetes provides. Understanding the difference between a {% glossary_tooltip term_id="daemonset" %} and a {% glossary_tooltip term_id="deployment" %} is oftentimes sufficient for app deployment. That being said, it's also worth familiarizing yourself with Kubernetes's lesser known features. They can be quite powerful when applied to the right use cases.

-->

## 使用高级功能部署应用

现在您知道了 Kubernetes 中提供的一组 API 对象。理解了 {% glossary_tooltip term_id="daemonset" %} 和 {% glossary_tooltip term_id="deployment" %} 之间的区别对于应用程序部署通常是足够的。也就是说，熟悉 Kubernetes 中其它的鲜为人知的功能也是值得的。因为这些功能有时候对于特别的用例是非常强大的。

<!--

#### Container-level features

As you may know, it's an antipattern to migrate an entire app (e.g. containerized Rails app, MySQL database, and all) into a single Pod. That being said, there are some very useful patterns that go beyond a 1:1 correspondence between a container and its Pod:
* **Sidecar container**: Although your Pod should still have a single main container, you can add a secondary container that acts as a helper (see a [logging example](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent){:target="_blank"}). Two containers within a single Pod can communicate [via a shared volume](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/){:target="_blank"}.
* **Init containers**: *Init containers* run before any of a Pod's *app containers* (such as main and sidecar containers). [Read more](/docs/concepts/workloads/pods/init-containers/){:target="_blank"}, see an [nginx server example](/docs/tasks/configure-pod-container/configure-pod-initialization/){:target="_blank"}, and [learn how to debug these containers](/docs/tasks/debug-application-cluster/debug-init-containers/){:target="_blank"}.

-->

#### 容器级功能

如您所知，将整个应用程序（例如容器化的 Rails 应用程序，MySQL 数据库以及所有应用程序）迁移到单个 Pod 中是一种反模式。这就是说，有一些非常有用的模式超出了容器和 Pod 之间的 1:1 的对应关系：

- **Sidecar 容器**：虽然 Pod 中依然需要有一个主容器，你还可以添加一个副容器作为辅助（见 [日志示例](/docs/concepts/cluster-administration/logging/#using-a-sidecar-container-with-the-logging-agent){:target="_blank"})。*单个 Pod 中的两个容器可以[通过共享卷](/docs/tasks/access-application-cluster/communicate-containers-same-pod-shared-volume/){:target="blank"}进行通信*。
- **Init 容器**：*Init 容器*在 Pod 的应用容器（如主容器和 sidecar 容器）之前运行。[阅读更多](/docs/concepts/workloads/pods/init-containers/){:target="_blank"}，查看 [nginx 服务器示例](/docs/tasks/configure-pod-container/configure-pod-initialization/){:target="_blank"}，并[学习如何调试这些容器](/docs/tasks/debug-application-cluster/debug-init-containers/){:target="_blank"}。

<!--

#### Pod configuration

Usually, you use {% glossary_tooltip text="labels" term_id="label" %} and {% glossary_tooltip text="annotations" term_id="annotation" %} to attach metadata to your resources. To inject data into your resources, you'd likely create {% glossary_tooltip text="ConfigMaps" term_id="configmap" %} (for nonconfidential data) or {% glossary_tooltip text="Secrets" term_id="secret" %} (for confidential data).

Below are some other, lesser-known ways of configuring your resources' Pods:

* **Taints and Tolerations** - These provide a way for nodes to "attract" or "repel" your Pods. They are often used when an application needs to be deployed onto specific hardware, such as GPUs for scientific computing. [Read more](/docs/concepts/configuration/taint-and-toleration/){:target="_blank"}.
* **Downward API** - This allows your containers to consume information about themselves or the cluster, without being overly coupled to the Kubernetes API server. This can be achieved with [environment variables](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/){:target="_blank"} or [DownwardAPIVolumeFiles](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/){:target="_blank"}.
* **Pod Presets** - Normally, to mount runtime requirements (such as environmental variables, ConfigMaps, and Secrets) into a resource, you specify them in the resource's configuration file. [PodPresets](/docs/concepts/workloads/pods/podpreset/){:target="_blank"} allow you to dynamically inject these requirements instead, when the resource is created. For instance, this allows team A to mount any number of new Secrets into the resources created by teams B and C, without requiring action from B and C. [See an example](/docs/tasks/inject-data-application/podpreset/){:target="_blank"}.

-->

#### Pod 配置

通常，您可以使用  {% glossary_tooltip text="labels" term_id="label" %}  和 {% glossary_tooltip text="annotations" term_id="annotation" %} 将元数据附加到资源上。将数据注入到资源，您可以会创建 {% glossary_tooltip text="ConfigMaps" term_id="configmap" %}（用于非机密数据）或 {% glossary_tooltip text="Secrets" term_id="secret" %} （用于机密数据）。

下面是一些其他不太为人所知的配置资源 Pod 的方法：

- Taint（污点）和 Toleration（容忍）：这些为节点“吸引”或“排斥” Pod 提供了一种方法。当需要将应用程序部署到特定硬件（例如用于科学计算的 GPU）时，经常使用它们。[阅读更多](/docs/concepts/configuration/taint-and-toleration/){:target="_blank"}。
- **向下 API**：这允许您的容器使用有关自己或集群的信息，而不会过度耦合到 Kubernetes API server。这可以通过[环境变量](/docs/tasks/inject-data-application/environment-variable-expose-pod-information/){:target="_blank"} 或者 [DownwardAPIVolumeFiles](/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/){:target="_blank"}。
- **Pod 预设**：通常，要将运行时需求（例如环境变量、ConfigMaps 和 Secrets）安装到资源中，可以在资源的配置文件中指定它们。*[PodPresets](/docs/concepts/workloads/pods/podpreset/){:target="_blank"}允许您在创建资源时动态注入这些需求。例如，这允许团队 A 将任意数量的新Secret 安装到团队 B 和 C 创建的资源中，而不需要 B 和 C 的操作。[请参阅示例](/docs/tasks/inject-data-application/podpreset/){:target="blank"}*。

<!--

#### Additional API Objects

{: .note }
Before setting up the following resources, check to see if they are the responsibility of your organization's {% glossary_tooltip text="cluster operators" term_id="cluster-operator" %}.

* **{% glossary_tooltip text="Horizontal Pod Autoscaler (HPA)" term_id="horizontal-pod-autoscaler" %}** - These resources are a great way to automate the process of scaling your application when CPU usage or other [custom metrics](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md){:target="_blank"} spike. [See an example](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/){:target="_blank"} to understand how HPAs are set up.
* **Federated cluster objects** - If you are running an application on multiple Kubernetes clusters using *federation*, you need to deploy the federated version of the standard Kubernetes API objects. For reference, check out the guides for setting up [Federated ConfigMaps](/docs/tasks/administer-federation/configmap/){:target="_blank"} and [Federated Deployments](/docs/tasks/administer-federation/deployment/){:target="_blank"}.

-->

#### 其他 API 对象

{: .note }
在设置以下资源之前，请检查这是否属于您组织的 {% glossary_tooltip text="集群管理员" term_id="cluster-operator" %}的责任。

- **{% glossary_tooltip text="Horizontal Pod Autoscaler (HPA)" term_id="horizontal-pod-autoscaler" %}** ：这些资源是在CPU使用率或其他[自定义度量](https://github.com/kubernetes/community/blob/master/contributors/design-proposals/instrumentation/custom-metrics-api.md){:target="_blank"}标准“秒杀”时自动化扩展应用程序的好方法。*[查看示例](/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/){:target="blank"}*以了解如何设置HPA。
- **联合集群对象**：如果使用 *federation* 在多个 Kubernetes 集群上运行应用程序，则需要部署标准 Kubernetes API 对象的联合版本。有关参考，请查看设置 [联合 ConfigMaps](/docs/tasks/administer-federation/configmap/){:target="_blank"}  {:target="blank"}和[联合 Deployment](/docs/tasks/administer-federation/deployment/){:target="_blank"} 的指南。

<!--

## Extend the Kubernetes API

Kubernetes is designed with extensibility in mind. If the API resources and features mentioned above are not enough for your needs, there are ways to customize its behavior without having to modify core Kubernetes code.

-->

## 扩展 Kubernetes API

Kubernetes 在设计之初就考虑到了可扩展性。如果上面提到的 API 资源和功能不足以满足您的需求，则可以自定义其行为，而无需修改核心 Kubernetes 代码。

<!--

#### Understand Kubernetes's default behavior

Before making any customizations, it's important that you understand the general abstraction behind Kubernetes API objects. Although Deployments and Secrets may seem quite different, the following concepts are true for *any* object:

* **Kubernetes objects are a way of storing structured data about your cluster.**
  In the case of Deployments, this data represents desired state (such as "How many replicas should be running?"), but it can also be general metadata (such as database credentials).

* **Kubernetes objects are modified via the {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %}**.
  In other words, you can make `GET` and `POST` requests to a specific resource path (such as `<api-server-url>/api/v1/namespaces/default/deployments`) to read and write the corresponding object type.

* **By leveraging the [Controller pattern](/docs/concepts/api-extension/custom-resources/#custom-controllers){:target="_blank"}, Kubernetes objects can be used to enforce desired state**. For simplicity, you can think of the Controller pattern as the following continuous loop:

  <div class="emphasize-box" markdown="1">
  1. Check current state (number of replicas, container image, etc)
  2. Compare current state to desired state
  3. Update if there's a mismatch
    </div>

  These states are obtained from the Kubernetes API.

  {: .note }
  Not all Kubernetes objects need to have a Controller. Though Deployments trigger the cluster to make state changes, ConfigMaps act purely as storage.

-->

#### 理解 Kubernetes 的默认行为

在进行任何自定义之前，了解 Kubernetes API 对象背后的一般抽象很重要。虽然 Deployment 和 Secret 看起来可能完全不同，但对于*任何*对象来说，以下概念都是正确的：

- **Kubernetes对象是存储有关您的集群的结构化数据的一种方式。**

  在 Deployment 的情况下，该数据代表期望的状态（例如“应该运行多少副本？”），但也可以是通用的元数据（例如数据库凭证）。

- **Kubernetes 对象通过 {% glossary_tooltip text="Kubernetes API" term_id="kubernetes-api" %}** 修改。

  换句话说，您可以对特定的资源路径（例如 `<api-server-url>/api/v1/namespaces/default/deployments` ）执行 `GET` 和 `POST` 请求来读取或修改对应的对象类型。

- **利用 [Controller 模式](/docs/concepts/api-extension/custom-resources/#custom-controllers){:target="_blank"}，Kubernetes 对象可被确保达到期望的状态**。为了简单起见，您可以将 Controller 模式看作以下连续循环：

  <div class="emphasize-box" markdown="1">

  1. 检查当前状态（副本数、容器镜像等）
  2. 对比当前状态和期望状态
  3. 如果不匹配则更新当前状态
    </div>

  这些状态是通过 Kubernetes API 来获取的。

  {: .note}
  并非所有的 Kubernetes 对象都需要一个 Controller。尽管 Deployment 触发群集进行状态更改，但 ConfigMaps 纯粹作为存储。

<!--

#### Create Custom Resources

Based on the ideas above, you can define a new [Custom Resource](/docs/concepts/api-extension/custom-resources/#custom-resources){:target="_blank"} that is just as legitimate as a Deployment. For example, you might want to define a `Backup` object for periodic backups, if `CronJobs` don't provide all the functionality you need.

There are two main ways of setting up custom resources:
1. **Custom Resource Definitions (CRDs)** - This method requires the least amount of implementation work. See [an example](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/){:target="_blank"}.
2. **API aggregation** - This method requires some [pre-configuration](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/){:target="_blank"} before you actually [set up a separate, extension API server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/){:target="_blank"}.

Note that unlike standard Kubernetes objects, which rely on the built-in [`kube-controller-manager`](/docs/reference/generated/kube-controller-manager/){:target="_blank"}, you'll need to write and run your own [custom controllers](https://github.com/kubernetes/sample-controller){:target="_blank"}.

You may also find the following info helpful:
* [How to know if custom resources are right for your use case](/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource){:target="_blank"}
* [How to decide between CRDs and API aggregation](/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources){:target="_blank"}

-->

#### 创建自定义资源

基于上述想法，您可以定义与 Deployment 一样合法的[自定义资源](/docs/concepts/api-extension/custom-resources/#custom-resources){:target="_blank"}。例如，如果 `CronJobs` 不能提供所有您需要的功能，您可能需要定义 `Backup` 对象以进行定期备份。

创建自定义资源有以下两种方式：

1. **自定义资源定义（CRD）**：这种实现方式的工作量最小。参考[示例](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/){:target="_blank"}。
2. **API 聚合**：在实际设置单独的[扩展 API server](/docs/tasks/access-kubernetes-api/setup-extension-api-server/){:target="_blank"} 之前，此方法需要一些[预配置](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/){:target="_blank"}

请注意，与依赖内置的  [`kube-controller-manager`](/docs/reference/generated/kube-controller-manager/){:target="_blank"} 不同，您需要编写并运行[自定义控制器](https://github.com/kubernetes/sample-controller){:target="_blank"}。

下面是一些有用的链接：

- [如何才知道自定义资源是否符合您的使用场景](/docs/concepts/api-extension/custom-resources/#should-i-use-a-configmap-or-a-custom-resource){:target="_blank"}
- [CRD 还是 API 聚合，如何选择？](/docs/concepts/api-extension/custom-resources/#choosing-a-method-for-adding-custom-resources){:target="_blank"}

<!--

#### Service Catalog

If you want to consume or provide complete services (rather than individual resources), **{% glossary_tooltip text="Service Catalog" term_id="service-catalog" %}** provides a [specification](https://github.com/openservicebrokerapi/servicebroker){:target="_blank"} for doing so. These services are registered using {% glossary_tooltip text="Service Brokers" term_id="service-broker" %} (see [some examples](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#example-service-brokers){:target="_blank"}).

If you do not have a {% glossary_tooltip text="cluster operator" term_id="cluster-operator" %} to manage the installation of Service Catalog, you can do so using [Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/){:target="_blank"} or an [installer binary](/docs/tasks/service-catalog/install-service-catalog-using-sc/){:target="_blank"}.

-->

#### Service Catalog

如果您想要使用或提供完整的服务（而不是单个资源），**{% glossary_tooltip text="Service Catalog" term_id="service-catalog"** 为此提供了一个[规范](https://github.com/openservicebrokerapi/servicebroker){:target="_blank"}。这些服务使用  {% glossary_tooltip text="Service Brokers" term_id="service-broker" %} 注册（请参阅 [示例](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#example-service-brokers){:target="_blank"}）。

如果您没有{% glossary_tooltip text="集群管理员" term_id="cluster-operator" %}来管理 Service Catalog 的安装，您可以使用 [Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/){:target="_blank"} 或 [二进制安装器](/docs/tasks/service-catalog/install-service-catalog-using-sc/){:target="_blank"}。

<!--


## Explore additional resources

#### References

The following topics are also useful for building more complex applications:
* [Other points of extensibility within Kubernetes](/docs/concepts/overview/extending/){:target="_blank"} -  A conceptual overview of where you can hook into the Kubernetes architecture.
* [Kubernetes Client Libraries](/docs/reference/client-libraries/){:target="_blank"} - Useful for building apps that need to interact heavily with the Kubernetes API.

-->

## 探索其他资源

#### 参考

以下主题对构建更复杂的应用程序也很有用：

- [Kubernetes 中的其他扩展点](/docs/concepts/overview/extending/){:target="_blank"} - 在哪里可以挂勾到 Kubernetes 架构的概念性的概述
- [Kubernetes 客户端库](/docs/reference/client-libraries/){:target="_blank"} - 用于构建需要与 Kubernetes API 大量交互的应用程序。

<!--

#### What's next
Congrats on completing the Application Developer user journey! You've covered the majority of features that Kubernetes has to offer. What now?

* If you'd like to suggest new features or keep up with the latest developments around Kubernetes app development, consider joining a {% glossary_tooltip term_id="sig" %} such as [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps){:target="_blank"}.
* If you are interested in learning more about the inner workings of Kubernetes (e.g. networking), consider checking out the [Cluster Operator journey](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"}.

-->

#### 下一步

恭喜您完成了应用开发者之旅！您已经了解了 Kubernetes 提供的大部分功能。现在怎么办？

- 如果您想推荐新功能或跟上Kubernetes应用开发的最新进展，请考虑加入 {% glossary_tooltip term_id="sig" %}，如 [SIG Apps](https://github.com/kubernetes/community/tree/master/sig-apps){:target="_blank"}。
- 如果您有兴趣详细了解 Kubernetes 的内部运作（例如网络），请考虑查看[集群运维之旅](/docs/user-journeys/users/cluster-operator/foundational/){:target="_blank"}。

{% endcapture %}

{% include templates/user-journey-content.md %}
