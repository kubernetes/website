---
title: Ingress Controllers
reviewers:
content_type: concept
weight: 40
---

<!-- overview -->

In order for the Ingress resource to work, the cluster must have an ingress controller running. 

Unlike other types of controllers which run as part of the `kube-controller-manager` binary, Ingress controllers 
are not started automatically with a cluster. Use this page to choose the ingress controller implementation 
that best fits your cluster.

Kubernetes as a project supports and maintains [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme), and
  [NGINX](https://git.k8s.io/ingress-nginx/README.md#readme) ingress controllers.


<!-- body -->

## Additional controllers

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/) is an ingress controller that configures the [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Ambassador](https://www.getambassador.io/) API Gateway is an [Envoy](https://www.envoyproxy.io)-based ingress
  controller.
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) is an [Apache APISIX](https://github.com/apache/apisix)-based ingress controller.
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) provides L4-L7 load-balancing using [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* The [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) works with
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) is an [Envoy](https://www.envoyproxy.io/) based ingress controller.
* [EnRoute](https://getenroute.io/) is an [Envoy](https://www.envoyproxy.io) based API gateway that can run as an ingress controller.
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  lets you use an Ingress to configure F5 BIG-IP virtual servers.
* [Gloo](https://gloo.solo.io) is an open-source ingress controller based on [Envoy](https://www.envoyproxy.io),
  which offers API gateway functionality.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).
* The [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  is also an ingress controller for [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  is an [Istio](https://istio.io/) based ingress controller.
* The [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  is an ingress controller driving [Kong Gateway](https://konghq.com/kong/).
* The [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  works with the [NGINX](https://www.nginx.com/resources/glossary/nginx/) webserver (as a proxy).
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP router and reverse proxy for service composition, including use cases like Kubernetes Ingress, designed as a library to build your custom proxy.
* The [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) is an
  ingress controller for the [Traefik](https://traefik.io/traefik/) proxy.
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) extends Ingress with Custom Resources to bring API Management capabilities to Ingress. Tyk Operator works with the Open Source Tyk Gateway & Tyk Cloud control plane.
* [Voyager](https://appscode.com/products/voyager) is an ingress controller for
  [HAProxy](https://www.haproxy.org/#desc).

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



## {{% heading "whatsnext" %}}


* Learn more about [Ingress](/docs/concepts/services-networking/ingress/).
* [Set up Ingress on Minikube with the NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).


