---
title: Ingress 控制器
description: >-
  为了让 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/) 在你的集群中工作，
  必须有一个 Ingress 控制器正在运行。你需要选择至少一个 Ingress 控制器并确保其已被部署到你的集群中。
  本页列出了你可以部署的常见 Ingress 控制器。
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
为了让 Ingress 资源工作，集群必须有一个正在运行的 Ingress 控制器。

与作为 `kube-controller-manager` 可执行文件的一部分运行的其他类型的控制器不同，
Ingress 控制器不是随集群自动启动的。
基于此页面，你可选择最适合你的集群的 ingress 控制器实现。

Kubernetes 作为一个项目，目前支持和维护
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
* [AKS 应用程序网关 Ingress 控制器](https://docs.microsoft.com/zh-cn/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
  是一个配置 [Azure 应用程序网关](https://docs.microsoft.com/zh-cn/azure/application-gateway/overview)
  的 Ingress 控制器。
* [阿里云 MSE Ingress](https://www.alibabacloud.com/help/zh/mse/user-guide/overview-of-mse-ingress-gateways)
  是一个 Ingress 控制器，它负责配置[阿里云原生网关](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is)，
  也是 [Higress](https://github.com/alibaba/higress) 的商业版本。
* [Apache APISIX Ingress 控制器](https://github.com/apache/apisix-ingress-controller)
  是一个基于 [Apache APISIX 网关](https://github.com/apache/apisix) 的 Ingress 控制器。
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)
  使用 [VMware NSX Advanced Load Balancer](https://avinetworks.com/)
  提供第 4 到第 7 层的负载均衡。
<!--
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) is a [BFE](https://www.bfe-networks.net)-based ingress controller.
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) is an ingress controller powered by [Cilium](https://cilium.io/).
* The [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) works with
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller.
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API Gateway is an [Envoy](https://www.envoyproxy.io)-based ingress
  controller.
* [EnRoute](https://getenroute.io/) is an [Envoy](https://www.envoyproxy.io) based API gateway that can run as an ingress controller.
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/) is an [Easegress](https://megaease.com/easegress/) based API gateway that can run as an ingress controller.
-->
* [BFE Ingress 控制器](https://github.com/bfenetworks/ingress-bfe)是一个基于
  [BFE](https://www.bfe-networks.net) 的 Ingress 控制器。
* [Cilium Ingress 控制器](https://docs.cilium.io/en/stable/network/servicemesh/ingress/)是一个由
  [Cilium](https://cilium.io/) 出品支持的 Ingress 控制器。
* [Citrix Ingress 控制器](https://github.com/citrix/citrix-k8s-ingress-controller#readme)
  可以用来与 Citrix Application Delivery Controller 一起使用。
* [Contour](https://projectcontour.io/) 是一个基于 [Envoy](https://www.envoyproxy.io/)
  的 Ingress 控制器。
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API 网关是一个基于 
  [Envoy](https://www.envoyproxy.io/) 的入口控制器。
* [EnRoute](https://getenroute.io/) 是一个基于 [Envoy](https://www.envoyproxy.io)
  的 API 网关，可以用作 Ingress 控制器。
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/)
  是一个基于 [Easegress](https://megaease.com/easegress/) 的 API 网关，可以用作 Ingress 控制器。
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
  [用于 Kubernetes 的容器 Ingress 服务](https://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)
  让你能够使用 Ingress 来配置 F5 BIG-IP 虚拟服务器。
* [FortiADC Ingress 控制器](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview)
  支持 Kubernetes Ingress 资源，并允许你从 Kubernetes 管理 FortiADC 对象。
* [Gloo](https://gloo.solo.io) 是一个开源的、基于 [Envoy](https://www.envoyproxy.io) 的
  Ingress 控制器，能够提供 API 网关功能。
* [HAProxy Ingress](https://haproxy-ingress.github.io/) 是一个针对
  [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Higress](https://github.com/alibaba/higress) 是一个基于 [Envoy](https://www.envoyproxy.io) 的 API 网关，
  可以作为一个 Ingress 控制器运行。
* [用于 Kubernetes 的 HAProxy Ingress 控制器](https://github.com/haproxytech/kubernetes-ingress#readme)
  也是一个针对 [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Istio Ingress](https://istio.io/latest/zh/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  是一个基于 [Istio](https://istio.io/zh/) 的 Ingress 控制器。
<!--
* The [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  is an ingress controller driving [Kong Gateway](https://konghq.com/kong/).
* [Kusk Gateway](https://kusk.kubeshop.io/) is an OpenAPI-driven ingress controller based on [Envoy](https://www.envoyproxy.io).
* The [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  works with the [NGINX](https://www.nginx.com/resources/glossary/nginx/) webserver (as a proxy).
* The [ngrok Kubernetes Ingress Controller](https://github.com/ngrok/kubernetes-ingress-controller) is an open source controller for adding secure public access to your K8s services using the [ngrok platform](https://ngrok.com).
* The [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme) is an Ingress controller for Oracle Cloud Infrastructure which allows you to manage the [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm).
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) is a [OpenNJet](https://njet.org.cn/)-based ingress controller.
* The [Pomerium Ingress Controller](https://www.pomerium.com/docs/k8s/ingress.html) is based on [Pomerium](https://pomerium.com/), which offers context-aware access policy.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy.
-->
* [用于 Kubernetes 的 Kong Ingress 控制器](https://github.com/Kong/kubernetes-ingress-controller#readme)
  是一个用来驱动 [Kong Gateway](https://konghq.com/kong/) 的 Ingress 控制器。
* [Kusk Gateway](https://kusk.kubeshop.io/) 是一个基于 [Envoy](https://www.envoyproxy.io) 的、
  OpenAPI 驱动的 Ingress 控制器。
* [用于 Kubernetes 的 NGINX Ingress 控制器](https://www.nginx.com/products/nginx-ingress-controller/)
  能够与 [NGINX](https://www.nginx.com/resources/glossary/nginx/)
  网页服务器（作为代理）一起使用。
* [ngrok Kubernetes Ingress 控制器](https://github.com/ngrok/kubernetes-ingress-controller)
  是一个开源控制器，通过使用 [ngrok 平台](https://ngrok.com)为你的 K8s 服务添加安全的公开访问权限。
* [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme)
  是一个适用于 Oracle Cloud Infrastructure 的 Ingress 控制器，可帮助你管理
  [OCI 负载均衡](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm)。
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) 是一个基于 
  [OpenNJet](https://njet.org.cn/) 的 Ingress 控制器。
* [Pomerium Ingress 控制器](https://www.pomerium.com/docs/k8s/ingress.html)
  基于 [Pomerium](https://pomerium.com/)，能提供上下文感知的准入策略。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP
  路由器和反向代理可用于服务组装，支持包括 Kubernetes Ingress
  这类使用场景，是一个用以构造你自己的定制代理的库。
<!--
* The [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) is an
  ingress controller for the [Traefik](https://traefik.io/traefik/) proxy.
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) extends Ingress with Custom Resources to bring API Management capabilities to Ingress. Tyk Operator works with the Open Source Tyk Gateway & Tyk Cloud control plane.
* [Voyager](https://voyagermesh.com) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) is an Ingress Controller that provides WAAP (WAF) and API Security capabilities.
-->
* [Traefik Kubernetes Ingress 提供程序](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)
  是一个用于 [Traefik](https://traefik.io/traefik/) 代理的 Ingress 控制器。
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator)
  使用自定义资源扩展 Ingress，为之带来 API 管理能力。Tyk Operator
  使用开源的 Tyk Gateway & Tyk Cloud 控制面。
* [Voyager](https://voyagermesh.com) 是一个针对
  [HAProxy](https://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) 是提供 WAAP（WAF）
  和 API 安全功能的 Ingress Controller。

<!--
## Using multiple Ingress controllers
-->
## 使用多个 Ingress 控制器  {#using-multiple-ingress-controllers}

<!--
You may deploy any number of ingress controllers using [ingress class](/docs/concepts/services-networking/ingress/#ingress-class)
within a cluster. Note the `.metadata.name` of your ingress class resource. When you create an ingress you would need that name to specify the `ingressClassName` field on your Ingress object (refer to [IngressSpec v1 reference](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` is a replacement of the older [annotation method](/docs/concepts/services-networking/ingress/#deprecated-annotation).
-->
你可以使用
[Ingress 类](/zh-cn/docs/concepts/services-networking/ingress/#ingress-class)在集群中部署任意数量的
Ingress 控制器。
请注意你的 Ingress 类资源的 `.metadata.name` 字段。
当你创建 Ingress 时，你需要用此字段的值来设置 Ingress 对象的 `ingressClassName` 字段（请参考
[IngressSpec v1 reference](/zh-cn/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)）。
`ingressClassName`
是之前的[注解](/zh-cn/docs/concepts/services-networking/ingress/#deprecated-annotation)做法的替代。

<!--
If you do not specify an IngressClass for an Ingress, and your cluster has exactly one IngressClass marked as default, then Kubernetes [applies](/docs/concepts/services-networking/ingress/#default-ingress-class) the cluster's default IngressClass to the Ingress.
You mark an IngressClass as default by setting the [`ingressclass.kubernetes.io/is-default-class` annotation](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) on that IngressClass, with the string value `"true"`.

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.
-->
如果你不为 Ingress 指定 IngressClass，并且你的集群中只有一个 IngressClass 被标记为默认，那么
Kubernetes 会将此集群的默认 IngressClass
[应用](/zh-cn/docs/concepts/services-networking/ingress/#default-ingress-class)到 Ingress 上。
IngressClass。
你可以通过将
[`ingressclass.kubernetes.io/is-default-class` 注解](/zh-cn/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class)
的值设置为 `"true"` 来将一个 IngressClass 标记为集群默认。

理想情况下，所有 Ingress 控制器都应满足此规范，但各种 Ingress 控制器的操作略有不同。

<!--
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
-->
{{< note >}}
确保你查看了 ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).
-->
* 进一步了解 [Ingress](/zh-cn/docs/concepts/services-networking/ingress/)。
* [在 Minikube 上使用 NGINX 控制器安装 Ingress](/zh-cn/docs/tasks/access-application-cluster/ingress-minikube)。

