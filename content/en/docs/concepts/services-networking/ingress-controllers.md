---
title: Ingress Controllers
description: >-
  In order for an [Ingress](/docs/concepts/services-networking/ingress/) to work in your cluster,
  there must be an _ingress controller_ running.
  You need to select at least one ingress controller and make sure it is set up in your cluster.  
  This page lists common ingress controllers that you can deploy.
content_type: concept
weight: 50
---

<!-- overview -->

In order for the Ingress resource to work, the cluster must have an ingress controller running. 

Unlike other types of controllers which run as part of the `kube-controller-manager` binary, Ingress controllers 
are not started automatically with a cluster. Use this page to choose the ingress controller implementation 
that best fits your cluster.

Kubernetes as a project supports and maintains [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme), and
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme) ingress controllers.


<!-- body -->

## Additional controllers

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json) is an ingress controller that configures the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Alibaba Cloud MSE Ingress](https://www.alibabacloud.com/help/en/mse/user-guide/overview-of-mse-ingress-gateways) is an ingress controller that configures the [Alibaba Cloud Native Gateway](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is), which is also the commercial version of [Higress](https://github.com/alibaba/higress).
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) is an [Apache APISIX](https://github.com/apache/apisix)-based ingress controller.
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) provides L4-L7 load-balancing using [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) is a [BFE](https://www.bfe-networks.net)-based ingress controller.
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) is an ingress controller powered by [Cilium](https://cilium.io/).
* The [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) works with
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller.
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API Gateway is an [Envoy](https://www.envoyproxy.io)-based ingress
  controller.
* [EnRoute](https://getenroute.io/) is an [Envoy](https://www.envoyproxy.io) based API gateway that can run as an ingress controller.
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/) is an [Easegress](https://megaease.com/easegress/) based API gateway that can run as an ingress controller.
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
* The [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) is an
  ingress controller for the [Traefik](https://traefik.io/traefik/) proxy.
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) extends Ingress with Custom Resources to bring API Management capabilities to Ingress. Tyk Operator works with the Open Source Tyk Gateway & Tyk Cloud control plane.
* [Voyager](https://voyagermesh.com) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) is an Ingress Controller that provides WAAP (WAF) and API Security capabilities.

## Using multiple Ingress controllers

You may deploy any number of ingress controllers using [ingress class](/docs/concepts/services-networking/ingress/#ingress-class)
within a cluster. Note the `.metadata.name` of your ingress class resource. When you create an ingress you would need that name to specify the `ingressClassName` field on your Ingress object (refer to [IngressSpec v1 reference](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` is a replacement of the older [annotation method](/docs/concepts/services-networking/ingress/#deprecated-annotation).

If you do not specify an IngressClass for an Ingress, and your cluster has exactly one IngressClass marked as default, then Kubernetes [applies](/docs/concepts/services-networking/ingress/#default-ingress-class) the cluster's default IngressClass to the Ingress.
You mark an IngressClass as default by setting the [`ingressclass.kubernetes.io/is-default-class` annotation](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) on that IngressClass, with the string value `"true"`.

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.

{{< note >}}
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
{{< /note >}}



## {{% heading "whatsnext" %}}


* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).


