---
title: Ingress Controllers
reviewers:
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

In order for the Ingress resource to work, the cluster must have an ingress controller running. 

Unlike other types of controllers which run as part of the `kube-controller-manager` binary, Ingress controllers 
are not started automatically with a cluster. Use this page to choose the ingress controller implementation 
that best fits your cluster.

Kubernetes as a project currently supports and maintains [GCE](https://git.k8s.io/ingress-gce/README.md) and
  [nginx](https://git.k8s.io/ingress-nginx/README.md) controllers.
  
{{% /capture %}}

{{% capture body %}}

## Additional controllers

* [Ambassador](https://www.getambassador.io/) API Gateway is an [Envoy](https://www.envoyproxy.io) based ingress 
  controller with [community](https://www.getambassador.io/docs) or 
  [commercial](https://www.getambassador.io/pro/) support from [Datawire](https://www.datawire.io/).
* [AppsCode Inc.](https://appscode.com) offers support and maintenance for the most widely used [HAProxy](http://www.haproxy.org/) based ingress controller [Voyager](https://appscode.com/products/voyager).  
* [Contour](https://github.com/heptio/contour) is an [Envoy](https://www.envoyproxy.io) based ingress controller
  provided and supported by Heptio.
* Citrix provides an [Ingress Controller](https://github.com/citrix/citrix-k8s-ingress-controller) for its hardware (MPX), virtualized (VPX) and [free containerized (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html) for [baremetal](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal) and [cloud](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) deployments.
* F5 Networks provides [support and maintenance](https://support.f5.com/csp/article/K86859508)
  for the [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest).
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io) which offers API Gateway functionality with enterprise support from [solo.io](https://www.solo.io).  
* [HAProxy Technologies](https://www.haproxy.com/) offers support and maintenance for the [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress). See the [official documentation](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/).
* [Istio](https://istio.io/) based ingress controller
  [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/) offers [community](https://discuss.konghq.com/c/kubernetes) or
  [commercial](https://konghq.com/kong-enterprise/) support and maintenance for the
  [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller).
* [NGINX, Inc.](https://www.nginx.com/) offers support and maintenance for the
  [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller).
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy
* [Traefik](https://github.com/containous/traefik) is a fully featured ingress controller
  ([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket), and it also comes with commercial
  support by [Containous](https://containo.us/services).

## Using multiple Ingress controllers

You may deploy [any number of ingress controllers](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 
within a cluster. When you create an ingress, you should annotate each ingress with the appropriate
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) 
to indicate which ingress controller should be used if more than one exists within your cluster.

If you do not define a class, your cloud provider may use a default ingress controller.

Ideally, all ingress controllers should fulfill this specification, but the various ingress
controllers operate slightly differently.

{{< note >}}
Make sure you review your ingress controller's documentation to understand the caveats of choosing it.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).

{{% /capture %}}
