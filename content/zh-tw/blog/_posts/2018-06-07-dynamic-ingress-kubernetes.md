---
title: 'Kubernetes 的動態 Ingress'
date: 2018-06-07
layout: blog
Author: Richard Li (Datawire)
slug: dynamic-ingress-in-kubernetes
---
<!--
title: Dynamic Ingress in Kubernetes
date:  2018-06-07
Author: Richard Li (Datawire)
-->

<!--
Kubernetes makes it easy to deploy applications that consist of many microservices, but one of the key challenges with this type of architecture is dynamically routing ingress traffic to each of these services.  One approach is Ambassador, a Kubernetes-native open source API Gateway built on the Envoy Proxy. Ambassador is designed for dynamic environment where services may come and go frequently.
Ambassador is configured using Kubernetes annotations. Annotations are used to configure specific mappings from a given Kubernetes service to a particular URL. A mapping can include a number of annotations for configuring a route. Examples include rate limiting, protocol, cross-origin request sharing, traffic shadowing, and routing rules.
-->

Kubernetes 可以輕鬆部署由許多微服務組成的應用程序，但這種架構的關鍵挑戰之一是動態地將流量路由到這些服務中的每一個。
一種方法是使用 [Ambassador](https://www.getambassador.io)，
一個基於 [Envoy Proxy](https://www.envoyproxy.io) 構建的 Kubernetes 原生開源 API 網關。
Ambassador 專爲動態環境而設計，這類環境中的服務可能被頻繁添加或刪除。

Ambassador 使用 Kubernetes 註解進行設定。
註解用於設定從給定 Kubernetes 服務到特定 URL 的具體映射關係。
每個映射中可以包括多個註解，用於設定路由。
註解的例子有速率限制、協議、跨源請求共享（CORS）、流量影射和路由規則等。

<!--
## A Basic Ambassador Example
Ambassador is typically installed as a Kubernetes deployment, and is also available as a Helm chart. To configure Ambassador, create a Kubernetes service with the Ambassador annotations. Here is an example that configures Ambassador to route requests to /httpbin/ to the public httpbin.org service:
-->

## 一個簡單的 Ambassador 示例

Ambassador 通常作爲 Kubernetes Deployment 來安裝，也可以作爲 Helm Chart 使用。
設定 Ambassador 時，請使用 Ambassador 註解創建 Kubernetes 服務。
下面是一個例子，用來設定 Ambassador，將針對 /httpbin/ 的請求路由到公共的 httpbin.org 服務：

```
apiVersion: v1
kind: Service
metadata:
  name: httpbin
  annotations:
    getambassador.io/config: |
      ---
      apiVersion: ambassador/v0
      kind:  Mapping
      name:  httpbin_mapping
      prefix: /httpbin/
      service: httpbin.org:80
      host_rewrite: httpbin.org
spec:
  type: ClusterIP
  ports:
    - port: 80
```

<!--
A mapping object is created with a prefix of /httpbin/ and a service name of httpbin.org. The host_rewrite annotation specifies that the HTTP host header should be set to httpbin.org.
-->

例子中創建了一個 Mapping 對象，其 prefix 設置爲 /httpbin/，service 名稱爲 httpbin.org。
其中的 host_rewrite 註解指定 HTTP 的 host 頭部字段應設置爲 httpbin.org。

<!--
## Kubeflow
Kubeflow provides a simple way to easily deploy machine learning infrastructure on Kubernetes. The Kubeflow team needed a proxy that provided a central point of authentication and routing to the wide range of services used in Kubeflow, many of which are ephemeral in nature.
<center><i>Kubeflow architecture, pre-Ambassador</center></i>
-->

## Kubeflow

[Kubeflow](https://github.com/kubeflow/kubeflow) 提供了一種簡單的方法，用於在 Kubernetes 上輕鬆部署機器學習基礎設施。
Kubeflow 團隊需要一個代理，爲 Kubeflow 中所使用的各種服務提供集中化的認證和路由能力；Kubeflow 中許多服務本質上都是生命期很短的。

<center><i>Kubeflow architecture, pre-Ambassador</center></i>

<!--
## Service configuration
With Ambassador, Kubeflow can use a distributed model for configuration. Instead of a central configuration file, Ambassador allows each service to configure its route in Ambassador via Kubernetes annotations. Here is a simplified example configuration:
-->

## 服務設定

有了 Ambassador，Kubeflow 可以使用分佈式模型進行設定。
Ambassador 不使用集中的設定文件，而是允許每個服務通過 Kubernetes 註解在 Ambassador 中設定其路由。
下面是一個簡化的設定示例：

```
---
apiVersion: ambassador/v0
kind:  Mapping
name: tfserving-mapping-test-post
prefix: /models/test/
rewrite: /model/test/:predict
method: POST
service: test.kubeflow:8000
```

<!--
In this example, the “test” service uses Ambassador annotations to dynamically configure a route to the service, triggered only when the HTTP method is a POST, and the annotation also specifies a rewrite rule.
-->

示例中，“test” 服務使用 Ambassador 註解來爲服務動態設定路由。
所設定的路由僅在 HTTP 方法是 POST 時觸發；註解中同時還給出了一條重寫規則。

<!--
With Ambassador, Kubeflow manages routing easily with Kubernetes annotations. Kubeflow configures a single ingress object that directs traffic to Ambassador, then creates services with Ambassador annotations as needed to direct traffic  to specific backends. For example, when deploying TensorFlow services,  Kubeflow creates and and annotates a K8s service so that the model will be served at https://<ingress host>/models/<model name>/. Kubeflow can also use the Envoy Proxy to do the actual L7 routing. Using Ambassador, Kubeflow takes advantage of additional routing configuration like URL rewriting and method-based routing.
If you’re interested in using Ambassador with Kubeflow, the standard Kubeflow install automatically installs and configures Ambassador.
If you’re interested in using Ambassador as an API Gateway or Kubernetes ingress solution for your non-Kubeflow services, check out the Getting Started with Ambassador guide.
## Kubeflow and Ambassador
-->

## Kubeflow 和 Ambassador

通過 Ambassador，Kubeflow 可以使用 Kubernetes 註解輕鬆管理路由。
Kubeflow 設定同一個 Ingress 對象，將流量定向到 Ambassador，然後根據需要創建具有 Ambassador 註解的服務，以將流量定向到特定後端。
例如，在部署 TensorFlow 服務時，Kubeflow 會創建 Kubernetes 服務併爲其添加註解，
以便使用者能夠在 `https://<ingress主機>/models/<模型名稱>/` 處訪問到模型本身。
Kubeflow 還可以使用 Envoy Proxy 來進行實際的 L7 路由。
通過 Ambassador，Kubeflow 能夠更充分地利用 URL 重寫和基於方法的路由等額外的路由設定能力。

如果您對在 Kubeflow 中使用 Ambassador 感興趣，標準的 Kubeflow 安裝會自動安裝和設定 Ambassador。

如果您有興趣將 Ambassador 用作 API 網關或 Kubernetes 的 Ingress 解決方案，
請參閱 [Ambassador 入門指南](https://www.getambassador.io/user-guide/getting-started)。

