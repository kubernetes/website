---
title: Ingress 控制器
description: >-
  爲了讓 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 在你的集羣中工作，
  必須有一個 Ingress 控制器正在運行。你需要選擇至少一個 Ingress 控制器並確保其已被部署到你的集羣中。
  本頁列出了你可以部署的常見 Ingress 控制器。
content_type: concept
weight: 50
---

<!--
title: Ingress Controllers
description: >-
  In order for an [Ingress](/docs/concepts/services-networking/ingress/) to work in your cluster,
  there must be an _ingress controller_ running.
  You need to select at least one ingress controller and make sure it is set up in your cluster.  
  This page lists common ingress controllers that you can deploy.
content_type: concept
weight: 50
-->

<!-- overview -->

<!--
In order for the Ingress resource to work, the cluster must have an ingress controller running. 

Unlike other types of controllers which run as part of the `kube-controller-manager` binary, Ingress controllers 
are not started automatically with a cluster. Use this page to choose the ingress controller implementation 
that best fits your cluster.

Kubernetes as a project supports and maintains [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme), and
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme) ingress controllers.
-->
爲了讓 Ingress 資源工作，集羣必須有一個正在運行的 Ingress 控制器。

與作爲 `kube-controller-manager` 可執行文件的一部分運行的其他類型的控制器不同，
Ingress 控制器不是隨集羣自動啓動的。
基於此頁面，你可選擇最適合你的集羣的 ingress 控制器實現。

Kubernetes 作爲一個項目，目前支持和維護
[AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme)、
[GCE](https://git.k8s.io/ingress-gce/README.md#readme)
和 [Nginx](https://git.k8s.io/ingress-nginx/README.md#readme) Ingress 控制器。

<!-- body -->

<!--
## Additional controllers
-->
## 其他控制器  {#additional-controllers}

{{% thirdparty-content %}}

<!--
* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json) is an ingress controller that configures the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Alibaba Cloud MSE Ingress](https://www.alibabacloud.com/help/en/mse/user-guide/overview-of-mse-ingress-gateways) is an ingress controller that configures the [Alibaba Cloud Native Gateway](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is), which is also the commercial version of [Higress](https://github.com/alibaba/higress).
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) is an [Apache APISIX](https://github.com/apache/apisix)-based ingress controller.
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) provides L4-L7 load-balancing using [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
-->
* [AKS 應用程序網關 Ingress 控制器](https://docs.microsoft.com/zh-cn/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
  是一個配置 [Azure 應用程序網關](https://docs.microsoft.com/zh-cn/azure/application-gateway/overview)
  的 Ingress 控制器。
* [阿里雲 MSE Ingress](https://www.alibabacloud.com/help/zh/mse/user-guide/overview-of-mse-ingress-gateways)
  是一個 Ingress 控制器，它負責配置[阿里雲原生網關](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is)，
  也是 [Higress](https://github.com/alibaba/higress) 的商業版本。
* [Apache APISIX Ingress 控制器](https://github.com/apache/apisix-ingress-controller)
  是一個基於 [Apache APISIX 網關](https://github.com/apache/apisix) 的 Ingress 控制器。
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)
  使用 [VMware NSX Advanced Load Balancer](https://avinetworks.com/)
  提供第 4 到第 7 層的負載均衡。
<!--
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) is a [BFE](https://www.bfe-networks.net)-based ingress controller.
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) is an ingress controller powered by [Cilium](https://cilium.io/).
* The [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) works with
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller.
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API Gateway is an [Envoy](https://www.envoyproxy.io)-based ingress
  controller.
* [EnRoute](https://getenroute.io/) is an [Envoy](https://www.envoyproxy.io) based API gateway that can run as an ingress controller.
-->
* [BFE Ingress 控制器](https://github.com/bfenetworks/ingress-bfe)是一個基於
  [BFE](https://www.bfe-networks.net) 的 Ingress 控制器。
* [Cilium Ingress 控制器](https://docs.cilium.io/en/stable/network/servicemesh/ingress/)是一個由
  [Cilium](https://cilium.io/) 出品支持的 Ingress 控制器。
* [Citrix Ingress 控制器](https://github.com/citrix/citrix-k8s-ingress-controller#readme)
  可以用來與 Citrix Application Delivery Controller 一起使用。
* [Contour](https://projectcontour.io/) 是一個基於 [Envoy](https://www.envoyproxy.io/)
  的 Ingress 控制器。
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API 網關是一個基於 
  [Envoy](https://www.envoyproxy.io/) 的入口控制器。
* [EnRoute](https://getenroute.io/) 是一個基於 [Envoy](https://www.envoyproxy.io)
  的 API 網關，可以用作 Ingress 控制器。
<!--
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  lets you use an Ingress to configure F5 BIG-IP virtual servers.
* [FortiADC Ingress Controller](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview) support the Kubernetes Ingress resources and allows you to manage FortiADC objects from Kubernetes
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io),
  which offers API gateway functionality.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).
* [Higress](https://github.com/alibaba/higress) is an [Envoy](https://www.envoyproxy.io) based API gateway that can run as an ingress controller.
* The [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  is also an ingress controller for [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  is an [Istio](https://istio.io/) based ingress controller.
-->
* F5 BIG-IP 的
  [用於 Kubernetes 的容器 Ingress 服務](https://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)
  讓你能夠使用 Ingress 來配置 F5 BIG-IP 虛擬服務器。
* [FortiADC Ingress 控制器](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview)
  支持 Kubernetes Ingress 資源，並允許你從 Kubernetes 管理 FortiADC 對象。
* [Gloo](https://gloo.solo.io) 是一個開源的、基於 [Envoy](https://www.envoyproxy.io) 的
  Ingress 控制器，能夠提供 API 網關功能。
* [HAProxy Ingress](https://haproxy-ingress.github.io/) 是一個針對
  [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Higress](https://github.com/alibaba/higress) 是一個基於 [Envoy](https://www.envoyproxy.io) 的 API 網關，
  可以作爲一個 Ingress 控制器運行。
* [用於 Kubernetes 的 HAProxy Ingress 控制器](https://github.com/haproxytech/kubernetes-ingress#readme)
  也是一個針對 [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Istio Ingress](https://istio.io/latest/zh/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  是一個基於 [Istio](https://istio.io/zh/) 的 Ingress 控制器。
<!--
* The [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  is an ingress controller driving [Kong Gateway](https://konghq.com/kong/).
* [Kusk Gateway](https://kusk.kubeshop.io/) is an OpenAPI-driven ingress controller based on [Envoy](https://www.envoyproxy.io).
* The [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  works with the [NGINX](https://www.nginx.com/resources/glossary/nginx/) webserver (as a proxy).
* The [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme) is an Ingress controller for Oracle Cloud Infrastructure which allows you to manage the [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm).
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) is a [OpenNJet](https://njet.org.cn/)-based ingress controller.
* The [Pomerium Ingress Controller](https://www.pomerium.com/docs/k8s/ingress.html) is based on [Pomerium](https://pomerium.com/), which offers context-aware access policy.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy.
-->
* [用於 Kubernetes 的 Kong Ingress 控制器](https://github.com/Kong/kubernetes-ingress-controller#readme)
  是一個用來驅動 [Kong Gateway](https://konghq.com/kong/) 的 Ingress 控制器。
* [Kusk Gateway](https://kusk.kubeshop.io/) 是一個基於 [Envoy](https://www.envoyproxy.io) 的、
  OpenAPI 驅動的 Ingress 控制器。
* [用於 Kubernetes 的 NGINX Ingress 控制器](https://www.nginx.com/products/nginx-ingress-controller/)
  能夠與 [NGINX](https://www.nginx.com/resources/glossary/nginx/)
  網頁服務器（作爲代理）一起使用。
* [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme)
  是一個適用於 Oracle Cloud Infrastructure 的 Ingress 控制器，可幫助你管理
  [OCI 負載均衡](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm)。
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) 是一個基於 
  [OpenNJet](https://njet.org.cn/) 的 Ingress 控制器。
* [Pomerium Ingress 控制器](https://www.pomerium.com/docs/k8s/ingress.html)
  基於 [Pomerium](https://pomerium.com/)，能提供上下文感知的准入策略。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP
  路由器和反向代理可用於服務組裝，支持包括 Kubernetes Ingress
  這類使用場景，是一個用以構造你自己的定製代理的庫。
<!--
* The [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) is an
  ingress controller for the [Traefik](https://traefik.io/traefik/) proxy.
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) extends Ingress with Custom Resources to bring API Management capabilities to Ingress. Tyk Operator works with the Open Source Tyk Gateway & Tyk Cloud control plane.
* [Voyager](https://voyagermesh.com) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) is an Ingress Controller that provides WAAP (WAF) and API Security capabilities.
-->
* [Traefik Kubernetes Ingress 提供程序](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)
  是一個用於 [Traefik](https://traefik.io/traefik/) 代理的 Ingress 控制器。
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator)
  使用自定義資源擴展 Ingress，爲之帶來 API 管理能力。Tyk Operator
  使用開源的 Tyk Gateway & Tyk Cloud 控制面。
* [Voyager](https://voyagermesh.com) 是一個針對
  [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) 是提供 WAAP（WAF）
  和 API 安全功能的 Ingress Controller。

<!--
## Using multiple Ingress controllers
-->
## 使用多個 Ingress 控制器  {#using-multiple-ingress-controllers}

<!--
You may deploy any number of ingress controllers using [ingress class](/docs/concepts/services-networking/ingress/#ingress-class)
within a cluster. Note the `.metadata.name` of your ingress class resource. When you create an ingress you would need that name to specify the `ingressClassName` field on your Ingress object (refer to [IngressSpec v1 reference](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` is a replacement of the older [annotation method](/docs/concepts/services-networking/ingress/#deprecated-annotation).
-->
你可以使用
[Ingress 類](/zh-cn/docs/concepts/services-networking/ingress/#ingress-class)在集羣中部署任意數量的
Ingress 控制器。
請注意你的 Ingress 類資源的 `.metadata.name` 字段。
當你創建 Ingress 時，你需要用此字段的值來設置 Ingress 對象的 `ingressClassName` 字段（請參考
[IngressSpec v1 reference](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)）。
`ingressClassName`
是之前的[註解](/zh-cn/docs/concepts/services-networking/ingress/#deprecated-annotation)做法的替代。

<!--
If you do not specify an IngressClass for an Ingress, and your cluster has exactly one IngressClass marked as default, then Kubernetes [applies](/docs/concepts/services-networking/ingress/#default-ingress-class) the cluster's default IngressClass to the Ingress.
You mark an IngressClass as default by setting the [`ingressclass.kubernetes.io/is-default-class` annotation](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) on that IngressClass, with the string value `"true"`.

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.
-->
如果你不爲 Ingress 指定 IngressClass，並且你的集羣中只有一個 IngressClass 被標記爲默認，那麼
Kubernetes 會將此集羣的默認 IngressClass
[應用](/zh-cn/docs/concepts/services-networking/ingress/#default-ingress-class)到 Ingress 上。
IngressClass。
你可以通過將
[`ingressclass.kubernetes.io/is-default-class` 註解](/zh-cn/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class)
的值設置爲 `"true"` 來將一個 IngressClass 標記爲集羣默認。

理想情況下，所有 Ingress 控制器都應滿足此規範，但各種 Ingress 控制器的操作略有不同。

{{< note >}}
<!--
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
-->
確保你查看了 ingress 控制器的文檔，以瞭解選擇它的注意事項。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
-->
* 進一步瞭解 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)。
