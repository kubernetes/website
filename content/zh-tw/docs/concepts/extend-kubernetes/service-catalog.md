---
title: 服務目錄
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
{{< glossary_definition term_id="service-catalog" length="all" prepend="服務目錄（Service Catalog）是" >}}  

<!--
A service broker, as defined by the [Open service broker API spec](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md), is an endpoint for a set of managed services offered and maintained by a third-party, which could be a cloud provider such as AWS, GCP, or Azure.
Some examples of managed services are Microsoft Azure Cloud Queue, Amazon Simple Queue Service, and Google Cloud Pub/Sub, but they can be any software offering that can be used by an application.

Using Service Catalog, a {{< glossary_tooltip text="cluster operator" term_id="cluster-operator" >}} can browse the list of managed services offered by a service broker, provision an instance of a managed service, and bind with it to make it available to an application in the Kubernetes cluster.
-->
服務代理（Service Broker）是由[Open Service Broker API 規範](https://github.com/openservicebrokerapi/servicebroker/blob/v2.13/spec.md)定義的一組託管服務的端點，這些服務由第三方提供並維護，其中的第三方可以是 AWS、GCP 或 Azure 等雲服務提供商。
託管服務的一些示例是 Microsoft Azure Cloud Queue、Amazon Simple Queue Service 和 Google Cloud Pub/Sub，但它們可以是應用程式能夠使用的任何軟體交付物。

使用服務目錄，{{< glossary_tooltip text="叢集操作員" term_id="cluster-operator" >}}
可以瀏覽某服務代理所提供的託管服務列表，供應託管服務例項並與之繫結，
以使其可以被 Kubernetes 叢集中的應用程式使用。

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

{{< glossary_tooltip text="應用開發人員" term_id="application-developer" >}}，
希望使用訊息佇列，作為其在 Kubernetes 叢集中執行的應用程式的一部分。
但是，他們不想承受構造這種服務的開銷，也不想自行管理。
幸運的是，有一家雲服務提供商透過其服務代理以託管服務的形式提供訊息佇列服務。

叢集操作員可以設定服務目錄並使用它與雲服務提供商的服務代理通訊，進而部署訊息佇列服務的例項
並使其對 Kubernetes 中的應用程式可用。
應用開發者於是可以不關心訊息佇列的實現細節，也不用對其進行管理。
他們的應用程式可以簡單的將其作為服務使用。

<!--
## Architecture

Service Catalog uses the [Open service broker API](https://github.com/openservicebrokerapi/servicebroker) to communicate with service brokers, acting as an intermediary for the Kubernetes API Server to negotiate the initial provisioning and retrieve the credentials necessary for the application to use a managed service.

It is implemented using a [CRDs-based](/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources) architecture.

![Service Catalog Architecture](/images/docs/service-catalog-architecture.svg)
-->
## 架構  {#architecture}

服務目錄使用[Open Service Broker API](https://github.com/openservicebrokerapi/servicebroker)
與服務代理進行通訊，並作為 Kubernetes API 伺服器的中介，以便協商啟動部署和獲取
應用程式使用託管服務時必須的憑據。

它是[基於 CRDs](/zh-cn/docs/concepts/extend-kubernetes/api-extension/custom-resources/#custom-resources)
架構實現的。

![服務目錄架構](/images/docs/service-catalog-architecture.svg)

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
## API 資源 {#api-resources}

服務目錄安裝 `servicecatalog.k8s.io` API 並提供以下 Kubernetes 資源：

* `ClusterServiceBroker`：服務目錄的叢集內表現形式，封裝了其服務連線細節。叢集運維人員建立和管理這些資源，並希望使用該代理服務在叢集中提供新型別的託管服務。
* `ClusterServiceClass`：由特定服務代理提供的託管服務。當新的 `ClusterServiceBroker` 資源被新增到叢集時，服務目錄控制器將連線到服務代理以獲取可用的託管服務列表。然後為每個託管服務建立對應的新 `ClusterServiceClass` 資源。
* `ClusterServicePlan`：託管服務的特定產品。例如託管服務可能有不同的計劃可用，如免費版本和付費版本，或者可能有不同的配置選項，例如使用 SSD 儲存或擁有更多資源。與 `ClusterServiceClass` 類似，當一個新的 `ClusterServiceBroker` 被新增到叢集時，服務目錄會為每個託管服務的每個可用服務計劃建立對應的新 `ClusterServicePlan` 資源。
* `ServiceInstance`：`ClusterServiceClass` 提供的示例。由叢集運維人員建立，以使託管服務的特定例項可供一個或多個叢集內應用程式使用。當建立一個新的 `ServiceInstance` 資源時，服務目錄控制器將連線到相應的服務代理並指示它調配服務例項。
* `ServiceBinding`：`ServiceInstance` 的訪問憑據。由希望其應用程式使用服務 `ServiceInstance` 的叢集運維人員建立。建立之後，服務目錄控制器將建立一個 Kubernetes `Secret`，其中包含服務例項的連線細節和憑據，可以掛載到 Pod 中。

<!--
### Authentication

Service Catalog supports these methods of authentication:

* Basic (username/password)
* [OAuth 2.0 Bearer Token](https://tools.ietf.org/html/rfc6750)
-->
### 認證  {#authentication}

服務目錄支援這些認證方法：

* 基本認證（使用者名稱/密碼）
* [OAuth 2.0 不記名令牌](https://tools.ietf.org/html/rfc6750)

<!--
## Usage

A cluster operator can use Service Catalog API Resources to provision managed services and make them available within a Kubernetes cluster. The steps involved are:

1. Listing the managed services and Service Plans available from a service broker.
2. Provisioning a new instance of the managed service.
3. Binding to the managed service, which returns the connection credentials.
4. Mapping the connection credentials into the application.
-->
## 使用方式

叢集運維人員可以使用服務目錄 API 資源來供應託管服務並使其在 Kubernetes 叢集內可用。涉及的步驟有：

1. 列出服務代理提供的託管服務和服務計劃。
2. 配置託管服務的新例項。
3. 繫結到託管服務，它將返回連線憑證。
4. 將連線憑證對映到應用程式中。

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
### 列出託管服務和服務計劃

首先，叢集運維人員在 `servicecatalog.k8s.io` 組內建立一個 `ClusterServiceBroker` 資源。此資源包含訪問服務代理終結點所需的 URL 和連線詳細資訊。

這是一個 `ClusterServiceBroker` 資源的例子：

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ClusterServiceBroker
metadata:
  name: cloud-broker
spec:
  # 指向服務代理的末端。(這裡的 URL 是無法使用的。)
  url:  https://servicebroker.somecloudprovider.com/v1alpha1/projects/service-catalog/brokers/default
  #####
  # 這裡可以新增額外的用來與服務代理通訊的屬性值,
  # 例如持有者令牌資訊或者 TLS 的 CA 包。
  #####
```

<!--
The following is a sequence diagram illustrating the steps involved in listing managed services and Plans available from a service broker:

![List Services](/images/docs/service-catalog-list.svg)

1. Once the `ClusterServiceBroker` resource is added to Service Catalog, it triggers a call to the external service broker for a list of available services.
1. The service broker returns a list of available managed services and a list of Service Plans, which are cached locally as `ClusterServiceClass` and `ClusterServicePlan` resources respectively.
1. A cluster operator can then get the list of available managed services using the following command:
-->
下面的時序圖展示了從服務代理列出可用託管服務和計劃所涉及的各個步驟：

![列舉服務](/images/docs/service-catalog-list.svg)

1. 一旦 `ClusterServiceBroker` 資源被新增到了服務目錄之後，將會觸發一個到外部服務代理的
   呼叫，以列舉所有可用服務；
1. 服務代理返回可用的託管服務和服務計劃列表，這些列表將本地快取在 `ClusterServiceClass`
   和 `ClusterServicePlan` 資源中。
1. 叢集運維人員接下來可以使用以下命令獲取可用託管服務的列表：

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

   它應該輸出一個和以下格式類似的服務名稱列表：

   ```
   SERVICE NAME                           EXTERNAL NAME
   4f6e6cf6-ffdd-425f-a2c7-3c9258ad2468   cloud-provider-service
   ...                                    ...
   ```

   他們還可以使用以下命令檢視可用的服務計劃：

   ```shell
   kubectl get clusterserviceplans \
      -o=custom-columns=PLAN\ NAME:.metadata.name,EXTERNAL\ NAME:.spec.externalName
   ```

    它應該輸出一個和以下格式類似的服務計劃列表：

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
### 供應一個新例項

叢集運維人員 可以透過建立一個 `ServiceInstance` 資源來啟動一個新例項的配置。

下面是一個 `ServiceInstance` 資源的例子：

```yaml
apiVersion: servicecatalog.k8s.io/v1beta1
kind: ServiceInstance
metadata:
  name: cloud-queue-instance
  namespace: cloud-apps
spec:
  # 引用之前返回的服務之一
  clusterServiceClassExternalName: cloud-provider-service
  clusterServicePlanExternalName: service-plan-name
  #####
  # 這裡可新增額外的引數，供服務代理使用
  #####
```

<!--
The following sequence diagram illustrates the steps involved in provisioning a new instance of a managed service:

![Provision a Service](/images/docs/service-catalog-provision.svg)

1. When the `ServiceInstance` resource is created, Service Catalog initiates a call to the external service broker to provision an instance of the service.
1. The service broker creates a new instance of the managed service and returns an HTTP response.
1. A cluster operator can then check the status of the instance to see if it is ready.
-->
以下時序圖展示了配置託管服務新例項所涉及的步驟：

![供應服務](/images/docs/service-catalog-provision.svg)

1. 建立 `ServiceInstance` 資源時，服務目錄將啟動一個到外部服務代理的呼叫，
   請求供應一個例項。
1. 服務代理建立一個託管服務的新例項並返回 HTTP 響應。
1. 接下來，叢集運維人員可以檢查例項的狀態是否就緒。

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
### 繫結到託管服務

在設定新例項之後，叢集運維人員必須繫結到託管服務才能獲取應用程式使用服務所需的連線憑據和服務賬戶的詳細資訊。該操作透過建立一個 `ServiceBinding` 資源完成。

以下是 `ServiceBinding` 資源的示例：

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
  # 這裡可以新增供服務代理使用的額外資訊，例如 Secret 名稱或者服務賬號引數，
  #####
```

<!--
The following sequence diagram illustrates the steps involved in binding to a managed service instance:

![Bind to a managed service](/images/docs/service-catalog-bind.svg)

1. After the `ServiceBinding` is created, Service Catalog makes a call to the external service broker requesting the information necessary to bind with the service instance.
1. The service broker enables the application permissions/roles for the appropriate service account.
1. The service broker returns the information necessary to connect and access the managed service instance. This is provider and service-specific so the information returned may differ between Service Providers and their managed services.
-->
以下順序圖展示了繫結到託管服務例項的步驟：

![繫結到託管服務](/images/docs/service-catalog-bind.svg)

1. 在建立 `ServiceBinding` 之後，服務目錄呼叫外部服務代理，請求繫結服務例項所需的資訊。
1. 服務代理為相應服務賬戶啟用應用許可權/角色。
1. 服務代理返回連線和訪問託管服務示例所需的資訊。這是由提供商和服務特定的，故返回的資訊可能因服務提供商和其託管服務而有所不同。

<!--
### Mapping the connection credentials

After binding, the final step involves mapping the connection credentials and service-specific information into the application.
These pieces of information are stored in secrets that the application in the cluster can access and use to connect directly with the managed service.

<br>

![Map connection credentials](/images/docs/service-catalog-map.svg)
-->
### 對映連線憑據

完成繫結之後的最後一步就是將連線憑據和服務特定的資訊對映到應用程式中。這些資訊儲存在 secret 中，叢集中的應用程式可以訪問並使用它們直接與託管服務進行連線。

<br>

![對映連線憑據](/images/docs/service-catalog-map.svg)

<!--
#### Pod configuration File

One method to perform this mapping is to use a declarative Pod configuration.

The following example describes how to map service account credentials into the application. A key called `sa-key` is stored in a volume named `provider-cloud-key`, and the application mounts this volume at `/var/secrets/provider/key.json`. The environment variable `PROVIDER_APPLICATION_CREDENTIALS` is mapped from the value of the mounted file.
-->
#### Pod 配置檔案

執行此對映的一種方法是使用宣告式 Pod 配置。

以下示例描述瞭如何將服務賬戶憑據對映到應用程式中。名為 `sa-key` 的金鑰儲存在一個名為
`provider-cloud-key` 的卷中，應用程式會將該卷掛載在 `/var/secrets/provider/key.json`
路徑下。環境變數 `PROVIDER_APPLICATION_CREDENTIALS` 將對映為掛載檔案的路徑。

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
以下示例描述瞭如何將 Secret 值對映為應用程式的環境變數。
在這個示例中，訊息佇列的主題名從 Secret `provider-queue-credentials` 中名為
`topic` 的主鍵對映到環境變數 `TOPIC` 中。

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
-->
* 如果你熟悉 {{< glossary_tooltip text="Helm Charts" term_id="helm-chart" >}}，
  可以[使用 Helm 安裝服務目錄](/zh-cn/docs/tasks/service-catalog/install-service-catalog-using-helm/)
  到 Kubernetes 叢集中。或者，你可以
  [使用 SC 工具安裝服務目錄](/zh-cn/docs/tasks/service-catalog/install-service-catalog-using-sc/)。
* 檢視[服務代理示例](https://github.com/openservicebrokerapi/servicebroker/blob/master/gettingStarted.md#sample-service-brokers)
* 瀏覽 [kubernetes-sigs/service-catalog](https://github.com/kubernetes-sigs/service-catalog) 專案


