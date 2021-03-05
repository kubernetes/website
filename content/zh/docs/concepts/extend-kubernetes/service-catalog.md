---
title: 服务目录
content_type: concept
weight: 40
---
<!--
title: Service Catalog
reviewers:
- chenopis
content_type: concept
weight: 40
-->

<!-- overview -->
{{< glossary_definition term_id="service-catalog" length="all" prepend="服务目录（Service Catalog）是" >}}  

<!--
A service broker, as defined by the [Open service broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), is an endpoint for a set of managed services offered and maintained by a third-party, which could be a cloud provider such as AWS, GCP, or Azure.
Some examples of managed services are Microsoft Azure Cloud Queue, Amazon Simple Queue Service, and Google Cloud Pub/Sub, but they can be any software offering that can be used by an application.

Using Service Catalog, a {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}} can browse the list of managed services offered by a service broker, provision an instance of a managed service, and bind with it to make it available to an application in the Kubernetes cluster.
-->
服务代理（Service Broker）是由[Open Service Broker API 规范](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)定义的一组托管服务的端点，这些服务由第三方提供并维护，其中的第三方可以是 AWS、GCP 或 Azure 等云服务提供商。
托管服务的一些示例是 Microsoft Azure Cloud Queue、Amazon Simple Queue Service 和 Google Cloud Pub/Sub，但它们可以是应用程序能够使用的任何软件交付物。

使用服务目录，{{< glossary_tooltip text="集群操作员" term_id="cluster-operator" >}}
可以浏览某服务代理所提供的托管服务列表，供应托管服务实例并与之绑定，
以使其可以被 Kubernetes 集群中的应用程序使用。

<!-- body -->
<!--
## Example use case

An {{< glossary_tooltip text="application developer" term_id="application-developer" >}} wants to use message queuing as part of their application running in a Kubernetes cluster.
However, they do not want to deal with the overhead of setting such a service up and administering it themselves.
Fortunately, there is a cloud provider that offers message queuing as a managed service through its service broker.

A cluster operator can setup Service Catalog and use it to communicate with the cloud provider's service broker to provision an instance of the message queuing service and make it available to the application within the Kubernetes cluster.
The application developer therefore does not need to be concerned with the implementation details or management of the message queue.
The application can simply use it as a service.
-->
## 示例用例

{{< glossary_tooltip text="应用开发人员" term_id="application-developer" >}}，
希望使用消息队列，作为其在 Kubernetes 集群中运行的应用程序的一部分。
但是，他们不想承受构造这种服务的开销，也不想自行管理。
幸运的是，有一家云服务提供商通过其服务代理以托管服务的形式提供消息队列服务。

集群操作员可以设置服务目录并使用它与云服务提供商的服务代理通信，进而部署消息队列服务的实例
并使其对 Kubernetes 中的应用程序可用。
应用开发者于是可以不关心消息队列的实现细节，也不用对其进行管理。
他们的应用程序可以简单的将其作为服务使用。

<!--
## Architecture

Service Catalog uses the [Open service broker API](https://github.com/openservicebrokerapi/servicebroker) to communicate with service brokers, acting as an intermediary for the Kubernetes API Server to negotiate the initial provisioning and retrieve the credentials necessary for the application to use a managed service.

It is implemented as an extension API server and a controller, using etcd for storage. It also uses the [aggregation layer](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) available in Kubernetes 1.7+ to present its API.

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)
-->
## 架构  {#architecture}

服务目录使用[Open Service Broker API](https://github.com/openservicebrokerapi/servicebroker)
与服务代理进行通信，并作为 Kubernetes API 服务器的中介，以便协商启动部署和获取
应用程序使用托管服务时必须的凭据。

服务目录实现为一个扩展 API 服务器和一个控制器，使用 Etcd 提供存储。
它还使用了 Kubernetes 1.7 之后版本中提供的
[聚合层](/zh/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
来呈现其 API。

![服务目录架构](/images/docs/service-catalog-architecture.svg)

<!--
### API Resources

Service Catalog installs the `servicecatalog.k8s.io` API and provides the following Kubernetes resources:

* `ClusterServiceBroker`: An in-cluster representation of a service broker, encapsulating its server connection details.
These are created and managed by cluster operators who wish to use that broker server to make new types of managed services available within their cluster.
* `ClusterServiceClass`: A managed service offered by a particular service broker.
When a new `ClusterServiceBroker` resource is added to the cluster, the Service Catalog controller connects to the service broker to obtain a list of available managed services. It then creates a new `ClusterServiceClass` resource corresponding to each managed service.
* `ClusterServicePlan`: A specific offering of a managed service. For example, a managed service may have different plans available, such as a free tier or paid tier, or it may have different configuration options, such as using SSD storage or having more resources. Similar to `ClusterServiceClass`, when a new `ClusterServiceBroker` is added to the cluster, Service Catalog creates a new `ClusterServicePlan` resource corresponding to each Service Plan available for each managed service.
* `ServiceInstance`: A provisioned instance of a `ClusterServiceClass`.
These are created by cluster operators to make a specific instance of a managed service available for use by one or more in-cluster applications.
When a new `ServiceInstance` resource is created, the Service Catalog controller connects to the appropriate service broker and instruct it to provision the service instance.
* `ServiceBinding`: Access credentials to a `ServiceInstance`.
These are created by cluster operators who want their applications to make use of a `ServiceInstance`.
Upon creation, the Service Catalog controller creates a Kubernetes `Secret` containing connection details and credentials for the Service Instance, which can be mounted into Pods.
-->
## API 资源 {#api-resources}

服务目录安装 `servicecatalog.k8s.io` API 并提供以下 Kubernetes 资源：

* `ClusterServiceBroker`：服务目录的集群内表现形式，封装了其服务连接细节。集群运维人员创建和管理这些资源，并希望使用该代理服务在集群中提供新类型的托管服务。
* `ClusterServiceClass`：由特定服务代理提供的托管服务。当新的 `ClusterServiceBroker` 资源被添加到集群时，服务目录控制器将连接到服务代理以获取可用的托管服务列表。然后为每个托管服务创建对应的新 `ClusterServiceClass` 资源。
* `ClusterServicePlan`：托管服务的特定产品。例如托管服务可能有不同的计划可用，如免费版本和付费版本，或者可能有不同的配置选项，例如使用 SSD 存储或拥有更多资源。与 `ClusterServiceClass` 类似，当一个新的 `ClusterServiceBroker` 被添加到集群时，服务目录会为每个托管服务的每个可用服务计划创建对应的新 `ClusterServicePlan` 资源。
* `ServiceInstance`：`ClusterServiceClass` 提供的示例。由集群运维人员创建，以使托管服务的特定实例可供一个或多个集群内应用程序使用。当创建一个新的 `ServiceInstance` 资源时，服务目录控制器将连接到相应的服务代理并指示它调配服务实例。
* `ServiceBinding`：`ServiceInstance` 的访问凭据。由希望其应用程序使用服务 `ServiceInstance` 的集群运维人员创建。创建之后，服务目录控制器将创建一个 Kubernetes `Secret`，其中包含服务实例的连接细节和凭据，可以挂载到 Pod 中。

<!--
### Authentication

Service Catalog supports these methods of authentication:

* Basic (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)
-->
### 认证  {#authentication}

服务目录支持这些认证方法：

* 基本认证（用户名/密码）
* [OAuth 2.0 不记名令牌](https://tools.ietf.org/html/rfc6750)

<!--
## Usage

A cluster operator can use Service Catalog API Resources to provision managed services and make them available within a Kubernetes cluster. The steps involved are:

1. Listing the managed services and Service Plans available from a service broker.
2. Provisioning a new instance of the managed service.
3. Binding to the managed service, which returns the connection credentials.
4. Mapping the connection credentials into the application.
-->
## 使用方式

集群运维人员可以使用服务目录 API 资源来供应托管服务并使其在 Kubernetes 集群内可用。涉及的步骤有：

1. 列出服务代理提供的托管服务和服务计划。
2. 配置托管服务的新实例。
3. 绑定到托管服务，它将返回连接凭证。
4. 将连接凭证映射到应用程序中。

<!--
### Listing managed services and Service Plans

First, a cluster operator must create a `ClusterServiceBroker` resource within the `servicecatalog.k8s.io` group. This resource contains the URL and connection details necessary to access a service broker endpoint.

This is an example of a `ClusterServiceBroker` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # Points to the endpoint of a service broker. (This example is not a working URL.)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # Additional values can be added here, which may be used to communicate
  # with the service broker, such as bearer token info or a caBundle for TLS.
  #####
```
-->
### 列出托管服务和服务计划

首先，集群运维人员在 `servicecatalog.k8s.io` 组内创建一个 `ClusterServiceBroker` 资源。此资源包含访问服务代理终结点所需的 URL 和连接详细信息。

这是一个 `ClusterServiceBroker` 资源的例子：

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # 指向服务代理的末端。(这里的 URL 是无法使用的。)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # 这里可以添加额外的用来与服务代理通信的属性值,
  # 例如持有者令牌信息或者 TLS 的 CA 包。
  #####
```

<!--
The following is a sequence diagram illustrating the steps involved in listing managed services and Plans available from a service broker:

![List Services](/images/docs/service-catalog-list.svg)

1. Once the `ClusterServiceBroker` resource is added to Service Catalog, it triggers a call to the external service broker for a list of available services.
1. The service broker returns a list of available managed services and a list of Service Plans, which are cached locally as `ClusterServiceClass` and `ClusterServicePlan` resources respectively.
1. A cluster operator can then get the list of available managed services using the following command:
-->
下面的时序图展示了从服务代理列出可用托管服务和计划所涉及的各个步骤：

![列举服务](/images/docs/service-catalog-list.svg)

1. 一旦 `ClusterServiceBroker` 资源被添加到了服务目录之后，将会触发一个到外部服务代理的
   调用，以列举所有可用服务；
1. 服务代理返回可用的托管服务和服务计划列表，这些列表将本地缓存在 `ClusterServiceClass`
   和 `ClusterServicePlan` 资源中。
1. 集群运维人员接下来可以使用以下命令获取可用托管服务的列表：

<!--
        kubectl get clusterserviceclasses -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of service names with a format similar to:

        SERVICE NAME                           EXTERNAL NAME
        4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
        ...                                    ...

    They can also view the Service Plans available using the following command:

        kubectl get clusterserviceplans -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName

    It should output a list of plan names with a format similar to:

        PLAN NAME                              EXTERNAL NAME
        86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
        ...                                    ...
-->

   ```shell
   kubectl get clusterserviceclasses \
     -o=custom-columns=SERVICE\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName
   ```

   它应该输出一个和以下格式类似的服务名称列表：

   ```
   SERVICE NAME                           EXTERNAL NAME
   4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
   ...                                    ...
   ```

   他们还可以使用以下命令查看可用的服务计划：

   ```shell
   kubectl get clusterserviceplans \
      -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName
   ```

    它应该输出一个和以下格式类似的服务计划列表：

   ```
   PLAN NAME                              EXTERNAL NAME
   86064792-7ea2-467b-af93-ac9694d96d52   service-plan-name
   ...                                    ...
   ```

<!--
### Provisioning a new instance

A cluster operator can initiate the provisioning of a new instance by creating a `ServiceInstance` resource.

This is an example of a `ServiceInstance` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # References one of the previously returned services
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # Additional parameters can be added here,
  # which may be used by the service broker.
  #####
```
-->
### 供应一个新实例

集群运维人员 可以通过创建一个 `ServiceInstance` 资源来启动一个新实例的配置。

下面是一个 `ServiceInstance` 资源的例子：

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # 引用之前返回的服务之一
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # 这里可添加额外的参数，供服务代理使用
  #####
```

<!--
The following sequence diagram illustrates the steps involved in provisioning a new instance of a managed service:

![Provision a Service](/images/docs/service-catalog-provision.svg)

1. When the `ServiceInstance` resource is created, Service Catalog initiates a call to the external service broker to provision an instance of the service.
1. The service broker creates a new instance of the managed service and returns an HTTP response.
1. A cluster operator can then check the status of the instance to see if it is ready.
-->
以下时序图展示了配置托管服务新实例所涉及的步骤：

![供应服务](/images/docs/service-catalog-provision.svg)

1. 创建 `ServiceInstance` 资源时，服务目录将启动一个到外部服务代理的调用，
   请求供应一个实例。
1. 服务代理创建一个托管服务的新实例并返回 HTTP 响应。
1. 接下来，集群运维人员可以检查实例的状态是否就绪。

<!--
### Binding to a managed service

After a new instance has been provisioned, a cluster operator must bind to the managed service to get the connection credentials and service account details necessary for the application to use the service. This is done by creating a `ServiceBinding` resource.

The following is an example of a `ServiceBinding` resource:

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cloud-queue-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-queue-instance
  #####
  # Additional information can be added here, such as a secretName or
  # service account parameters, which may be used by the service broker.
  #####
```
-->
### 绑定到托管服务

在设置新实例之后，集群运维人员必须绑定到托管服务才能获取应用程序使用服务所需的连接凭据和服务账户的详细信息。该操作通过创建一个 `ServiceBinding` 资源完成。

以下是 `ServiceBinding` 资源的示例：

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceBinding
metadata:
  name: cloud-queue-binding
  namespace: cloud-apps
spec:
  instanceRef:
    name: cloud-queue-instance
  #####
  # 这里可以添加供服务代理使用的额外信息，例如 Secret 名称或者服务账号参数，
  #####
```

<!--
The following sequence diagram illustrates the steps involved in binding to a managed service instance:

![Bind to a managed service](/images/docs/service-catalog-bind.svg)

1. After the `ServiceBinding` is created, Service Catalog makes a call to the external service broker requesting the information necessary to bind with the service instance.
1. The service broker enables the application permissions/roles for the appropriate service account.
1. The service broker returns the information necessary to connect and access the managed service instance. This is provider and service-specific so the information returned may differ between Service Providers and their managed services.
-->
以下顺序图展示了绑定到托管服务实例的步骤：

![绑定到托管服务](/images/docs/service-catalog-bind.svg)

1. 在创建 `ServiceBinding` 之后，服务目录调用外部服务代理，请求绑定服务实例所需的信息。
1. 服务代理为相应服务账户启用应用权限/角色。
1. 服务代理返回连接和访问托管服务示例所需的信息。这是由提供商和服务特定的，故返回的信息可能因服务提供商和其托管服务而有所不同。

<!--
### Mapping the connection credentials

After binding, the final step involves mapping the connection credentials and service-specific information into the application.
These pieces of information are stored in secrets that the application in the cluster can access and use to connect directly with the managed service.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)
-->
### 映射连接凭据

完成绑定之后的最后一步就是将连接凭据和服务特定的信息映射到应用程序中。这些信息存储在 secret 中，集群中的应用程序可以访问并使用它们直接与托管服务进行连接。

<br>

![映射连接凭据](/images/docs/service-catalog-map.svg)

<!--
#### Pod configuration File

One method to perform this mapping is to use a declarative Pod configuration.

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `provider-cloud-key`, and the application mounts this volume at `/var/secrets/provider/key.json`. The environment variable `PROVIDER_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.
-->
#### Pod 配置文件

执行此映射的一种方法是使用声明式 Pod 配置。

以下示例描述了如何将服务账户凭据映射到应用程序中。名为 `sa-key` 的密钥保存在一个名为
`provider-cloud-key` 的卷中，应用程序会将该卷挂载在 `/var/secrets/provider/key.json`
路径下。环境变量 `PROVIDER_APPLICATION_CREDENTIALS` 将映射为挂载文件的路径。

```yaml
...
    spec:
      volumes:
        - name: provider-cloud-key
          secret:
            secretName: sa-key
      containers:
...
          volumeMounts:
          - name: provider-cloud-key
            mountPath: /var/secrets/provider
          env:
          - name: PROVIDER_APPLICATION_CREDENTIALS
            value: "/var/secrets/provider/key.json"
```

<!--
The following example describes how to map secret values into application environment variables. In this example, the messaging queue topic name is mapped from a secret named `provider-queue-credentials` with a key named `topic` to the environment variable `TOPIC`.
-->
以下示例描述了如何将 Secret 值映射为应用程序的环境变量。
在这个示例中，消息队列的主题名从 Secret `provider-queue-credentials` 中名为
`topic` 的主键映射到环境变量 `TOPIC` 中。

```yaml
...
          env:
          - name: "TOPIC"
            valueFrom:
                secretKeyRef:
                   name: provider-queue-credentials
                   key: topic
```

## {{% heading "whatsnext" %}}

<!--
* If you are familiar with {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}, [install Service Catalog using Helm](/docs/tasks/service-catalog/install-service-catalog-using-helm/) into your Kubernetes cluster. Alternatively, you can [install Service Catalog using the SC tool](/docs/tasks/service-catalog/install-service-catalog-using-sc/).
* View [sample service brokers](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers).
* Explore the [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) project.
* View [svc-cat.io](https://svc-cat.io/docs/).
-->
* 如果你熟悉 {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}，
  可以[使用 Helm 安装服务目录](/zh/docs/tasks/service-catalog/install-service-catalog-using-helm/)
  到 Kubernetes 集群中。或者，你可以
  [使用 SC 工具安装服务目录](/zh/docs/tasks/service-catalog/install-service-catalog-using-sc/)。
* 查看[服务代理示例](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)
* 浏览 [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) 项目
* 查看 [svc-cat.io](https://svc-cat.io/docs/)


