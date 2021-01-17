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

Kubernetes as a project supports and maintains [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme), and
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme) ingress controllers.
-->
为了让 Ingress 资源工作，集群必须有一个正在运行的 Ingress 控制器。

与作为 `kube-controller-manager` 可执行文件的一部分运行的其他类型的控制器不同，Ingress 控制器不是随集群自动启动的。
基于此页面，你可选择最适合你的集群的 ingress 控制器实现。

Kubernetes 作为一个项目，目前支持和维护
[AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme)，
[GCE](https://git.k8s.io/ingress-gce/README.md) 
和 [nginx](https://git.k8s.io/ingress-nginx/README.md#readme) Ingress 控制器。

<!-- body -->

<!--
## Additional controllers
-->
## 其他控制器

{{% thirdparty-content %}}

<!--
* [AKS Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/) is an ingress controller that configures the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Ambassador](https://www.getambassador.io/) API Gateway is an [Envoy](https://www.envoyproxy.io)-based ingress
  controller.
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) provides L4-L7 load-balancing using [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* The [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) works with
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller.
-->
* [AKS 应用程序网关 Ingress 控制器](https://azure.github.io/application-gateway-kubernetes-ingress/)
  是一个配置 [Azure 应用程序网关](https://docs.microsoft.com/azure/application-gateway/overview)
  的 Ingress 控制器。
* [Ambassador](https://www.getambassador.io/) API 网关是一个基于 [Envoy](https://www.envoyproxy.io) 的 Ingress
  控制器。
* [Apache APISIX Ingress 控制器](https://github.com/apache/apisix-ingress-controller) 是一个基于 [Apache APISIX 网关](https://github.com/apache/apisix) 的 Ingress 控制器。
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)
  使用 [VMware NSX Advanced Load Balancer](https://avinetworks.com/)
  提供第 4 到第 7 层的负载均衡。
* [Citrix Ingress 控制器](https://github.com/citrix/citrix-k8s-ingress-controller#readme)
  可以用来与 Citrix Application Delivery Controller 一起使用。
* [Contour](https://projectcontour.io/) 是一个基于 [Envoy](https://www.envoyproxy.io/) 的 Ingress 控制器。
<!--
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  lets you use an Ingress to configure F5 BIG-IP virtual servers.
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io),
  which offers API gateway functionality.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) is an ingress controller for
  [HAProxy](http://www.haproxy.org/#desc).
* The [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  is also an ingress controller for [HAProxy](http://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  is an [Istio](https://istio.io/) based ingress controller.
-->
* F5 BIG-IP 的
  [用于 Kubernetes 的容器 Ingress 服务](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)
  让你能够使用 Ingress 来配置 F5 BIG-IP 虚拟服务器。
* [Gloo](https://gloo.solo.io) 是一个开源的、基于 [Envoy](https://www.envoyproxy.io) 的
  Ingress 控制器，能够提供 API 网关功能，
* [HAProxy Ingress](https://haproxy-ingress.github.io/) 针对 [HAProxy](http://www.haproxy.org/#desc)
  的 Ingress 控制器。
* [用于 Kubernetes 的 HAProxy Ingress 控制器](https://github.com/haproxytech/kubernetes-ingress#readme)
  也是一个针对 [HAProxy](http://www.haproxy.org/#desc) 的 Ingress 控制器。
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  是一个基于 [Istio](https://istio.io/) 的 Ingress 控制器。
<!--
* The [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  is an ingress controller driving [Kong Gateway](https://konghq.com/kong/).
* The [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)
  works with the [NGINX](https://www.nginx.com/resources/glossary/nginx/) webserver (as a proxy).
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy.
* The [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) is an
  ingress controller for the [Traefik](https://traefik.io/traefik/) proxy.
* [Voyager](https://appscode.com/products/voyager) is an ingress controller for
  [HAProxy](http://www.haproxy.org/#desc).
-->
* [用于 Kubernetes 的 Kong Ingress 控制器](https://github.com/Kong/kubernetes-ingress-controller#readme)
  是一个用来驱动 [Kong Gateway](https://konghq.com/kong/) 的 Ingress 控制器。
* [用于 Kubernetes 的 NGINX Ingress 控制器](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)
  能够与 [NGINX](https://www.nginx.com/resources/glossary/nginx/) Web 服务器（作为代理）
  一起使用。
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP
  路由器和反向代理可用于服务组装，支持包括 Kubernetes Ingress 这类使用场景，
  设计用来作为构造你自己的定制代理的库。
* [Traefik Kubernetes Ingress 提供程序](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)
  是一个用于 [Traefik](https://traefik.io/traefik/) 代理的 Ingress 控制器。
* [Voyager](https://appscode.com/products/voyager) 是一个针对 [HAProxy](http://www.haproxy.org/#desc)
  的 Ingress 控制器。

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
确保你查看了 ingress 控制器的文档，以了解选择它的注意事项。
{{< /note >}}

## {{% heading "whatsnext" %}}

<!--
* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).
-->
* 进一步了解 [Ingress](/zh/docs/concepts/services-networking/ingress/)。
* [在 Minikube 上使用 NGINX 控制器安装 Ingress](/zh/docs/tasks/access-application-cluster/ingress-minikube)。

