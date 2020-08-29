---
title: Ingress 控制器
content_type: concept
weight: 40
---

<!--
title: Ingress Controllers
content_type: concept
weight: 40
-->

<!-- overview -->

<!--
In order for the Ingress resource to work, the cluster must have an ingress controller running. 

Unlike other types of controllers which run as part of the `kube-controller-manager` binary, Ingress controllers 
are not started automatically with a cluster. Use this page to choose the ingress controller implementation 
that best fits your cluster.

Kubernetes as a project currently supports and maintains [GCE](https://git.k8s.io/ingress-gce/README.md) and
  [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers.
-->
为了让 Ingress 资源工作，集群必须有一个正在运行的 Ingress 控制器。

与作为 `kube-controller-manager` 可执行文件的一部分运行的其他类型的控制器不同，Ingress 控制器不是随集群自动启动的。
基于此页面，您可选择最适合您的集群的 ingress 控制器实现。

Kubernetes 作为一个项目，目前支持和维护 [GCE](https://git.k8s.io/ingress-gce/README.md) 
和 [nginx](https://git.k8s.io/ingress-nginx/README.md) 控制器。

<!-- body -->

<!--
## Additional controllers
-->
## 其他控制器

<!--
* [AKS Application Gateway Ingress Controller](https://github.com/Azure/application-gateway-kubernetes-ingress) is an ingress controller that enables ingress to [AKS clusters](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal) using the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Ambassador](https://www.getambassador.io/) API Gateway is an [Envoy](https://www.envoyproxy.io) based ingress 
  controller with [community](https://www.getambassador.io/docs) or 
  [commercial](https://www.getambassador.io/pro/) support from [Datawire](https://www.datawire.io/).
* [AppsCode Inc.](https://appscode.com) offers support and maintenance for the most widely used [HAProxy](http://www.haproxy.org/) based ingress controller [Voyager](https://appscode.com/products/voyager). 
* [AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-alb-ingress-controller) enables ingress using the [AWS Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/).
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller
  provided and supported by VMware.
-->
* [AKS 应用程序网关 Ingress 控制器]使用
  [Azure 应用程序网关](https://docs.microsoft.com/azure/application-gateway/overview)启用
  [AKS 集群](https://docs.microsoft.com/azure/aks/kubernetes-walkthrough-portal) ingress。
* [Ambassador](https://www.getambassador.io/) API 网关，一个基于 [Envoy](https://www.envoyproxy.io) 的 Ingress
  控制器，有着来自[社区](https://www.getambassador.io/docs) 的支持和来自
  [Datawire](https://www.datawire.io/) 的[商业](https://www.getambassador.io/pro/) 支持。
* [AppsCode Inc.](https://appscode.com) 为最广泛使用的基于
  [HAProxy](https://www.haproxy.org/) 的 Ingress 控制器
  [Voyager](https://appscode.com/products/voyager) 提供支持和维护。
* [AWS ALB Ingress 控制器](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)
  通过 [AWS 应用 Load Balancer](https://aws.amazon.com/elasticloadbalancing/) 启用 Ingress。
* [Contour](https://projectcontour.io/) 是一个基于 [Envoy](https://www.envoyproxy.io/)
  的 Ingress 控制器，它由 VMware 提供和支持。
<!--
* Citrix provides an [Ingress Controller](https://github.com/citrix/citrix-k8s-ingress-controller) for its hardware (MPX), virtualized (VPX) and [free containerized (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html) for [baremetal](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal) and [cloud](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) deployments.
* F5 Networks provides [support and maintenance](https://support.f5.com/csp/article/K86859508)
  for the [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest).
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io) which offers API Gateway functionality with enterprise support from [solo.io](https://www.solo.io).  
* [HAProxy Ingress](https://haproxy-ingress.github.io) is a highly customizable community-driven ingress controller for HAProxy.
* [HAProxy Technologies](https://www.haproxy.com/) offers support and maintenance for the [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress). See the [official documentation](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/).
* [Istio](https://istio.io/) based ingress controller
  [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/).
-->
* Citrix 为其硬件（MPX），虚拟化（VPX）和
  [免费容器化 (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html)
  提供了一个 [Ingress 控制器](https://github.com/citrix/citrix-k8s-ingress-controller)，
  用于[裸金属](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal)和
  [云](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment)部署。
* F5 Networks 为
  [用于 Kubernetes 的 F5 BIG-IP 控制器](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)提供
  [支持和维护](https://support.f5.com/csp/article/K86859508)。
* [Gloo](https://gloo.solo.io) 是一个开源的基于
  [Envoy](https://www.envoyproxy.io) 的 Ingress 控制器，它提供了 API 网关功能，
  有着来自 [solo.io](https://www.solo.io) 的企业级支持。
* [HAProxy Ingress](https://haproxy-ingress.github.io) 是 HAProxy 高度可定制的、
  由社区驱动的 Ingress 控制器。
* [HAProxy Technologies](https://www.haproxy.com/) 为
  [用于 Kubernetes 的 HAProxy Ingress 控制器](https://github.com/haproxytech/kubernetes-ingress)
  提供支持和维护。具体信息请参考[官方文档](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)。
* 基于 [Istio](https://istio.io/) 的 ingress 控制器
  [控制 Ingress 流量](https://istio.io/docs/tasks/traffic-management/ingress/)。
<!--
* [Kong](https://konghq.com/) offers [community](https://discuss.konghq.com/c/kubernetes) or
  [commercial](https://konghq.com/kong-enterprise/) support and maintenance for the
  [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller).
* [NGINX, Inc.](https://www.nginx.com/) offers support and maintenance for the
  [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller).
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy
* [Traefik](https://github.com/containous/traefik) is a fully featured ingress controller
  ([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket), and it also comes with commercial
  support by [Containous](https://containo.us/services).
-->
* [Kong](https://konghq.com/) 为
  [用于 Kubernetes 的 Kong Ingress 控制器](https://github.com/Kong/kubernetes-ingress-controller)
  提供[社区](https://discuss.konghq.com/c/kubernetes)或
  [商业](https://konghq.com/kong-enterprise/)支持和维护。
* [NGINX, Inc.](https://www.nginx.com/) 为
  [用于 Kubernetes 的 NGINX Ingress 控制器](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)
  提供支持和维护。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP 路由器和反向代理，用于服务组合，包括诸如 Kubernetes Ingress 之类的用例，被设计为用于构建自定义代理的库。
* [Traefik](https://github.com/containous/traefik) 是一个全功能的 ingress 控制器
  （[Let's Encrypt](https://letsencrypt.org)，secrets，http2，websocket），
  并且它也有来自 [Containous](https://containo.us/services) 的商业支持。

<!--
## Using multiple Ingress controllers
-->
## 使用多个 Ingress 控制器

<!--
You may deploy [any number of ingress controllers](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 
within a cluster. When you create an ingress, you should annotate each ingress with the appropriate
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) 
to indicate which ingress controller should be used if more than one exists within your cluster.

If you do not define a class, your cloud provider may use a default ingress controller.

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.
-->

你可以在集群中部署[任意数量的 ingress 控制器](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)。
创建 ingress 时，应该使用适当的
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) 
注解每个 Ingress 以表明在集群中如果有多个 Ingress 控制器时，应该使用哪个 Ingress 控制器。

如果不定义 `ingress.class`，云提供商可能使用默认的 Ingress 控制器。

理想情况下，所有 Ingress 控制器都应满足此规范，但各种 Ingress 控制器的操作略有不同。

<!--
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
-->
{{< note >}}
确保您查看了 ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).
-->
* 进一步了解 [Ingress](/zh/docs/concepts/services-networking/ingress/)。
* [在 Minikube 上使用 NGINX 控制器安装 Ingress](/zh/docs/tasks/access-application-cluster/ingress-minikube)。

