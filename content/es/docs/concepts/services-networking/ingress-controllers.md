---
title: Controladores Ingress
description: >-
  Para que un [Ingress](/docs/concepts/services-networking/ingress/) funcione en tu clúster,
  debe haber un _ingress controller_ en ejecución.
  Debes seleccionar al menos un controlador Ingress y asegurarte de que está configurado en tu clúster.  
  En esta página se enumeran los controladores Ingress más comunes que se pueden implementar.
content_type: concept
weight: 50
---

<!-- overview -->
Para que el recurso Ingress funcione, el clúster necesita tener un controlador Ingress corriendo.

Mientras otro tipo de controladores que corren como parte del binario de `kube-controller-manager`, los controladores Ingress no son automaticamente iniciados dentro del clúster. Usa esta página para elegir la mejor implementación de controlador Ingress que funcione mejor para tu clúster.

Kubernetes es un proyecto que soporta y mantiene los controladores Ingress de [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme) y
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme).

<!-- body -->

## Controladores adicionales

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json) es un controlador Ingress que controla la configuración de [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Alibaba Cloud MSE Ingress](https://www.alibabacloud.com/help/en/mse/user-guide/overview-of-mse-ingress-gateways) es un controlador Ingress que controla la configuración de [Alibaba Cloud Native Gateway](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is), el cual es una versión comercial de [Higress](https://github.com/alibaba/higress).
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) es un [Apache APISIX](https://github.com/apache/apisix)-basado en un controlador Ingress.
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) provee un balanceador de cargas L4-L7 usando [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) es un controlador Ingress basado en [BFE](https://www.bfe-networks.net).
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) es un controlador Ingress potenciado por [Cilium](https://cilium.io/).
* El [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) funciona con Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) es un controlador Ingress basado en [Envoy](https://www.envoyproxy.io/).
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) es un API Gateway [Envoy](https://www.envoyproxy.io)-basado en el controlador Ingress.
* [EnRoute](https://getenroute.io/) es un API Gateway basado en [Envoy](https://www.envoyproxy.io) que puede correr como un controlador Ingress.
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/) es una API Gateway basada en [Easegress](https://megaease.com/easegress/) que puede correr como un controlador Ingress.
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  te permite usar un Ingress para configurar los servidores virtuales de F5 BIG-IP.
* [FortiADC Ingress Controller](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview) soporta el recurso de Kubernetes Ingress y te permite manejar los objectos FortiADC desde Kubernetes.
* [Gloo](https://gloo.solo.io) es un controlador Ingress de código abierto basado en [Envoy](https://www.envoyproxy.io),
  el cual ofrece la funcionalidad de API gateway.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) es un controlador Ingress para
  [HAProxy](https://www.haproxy.org/#desc).
* [Higress](https://github.com/alibaba/higress) es una API Gateway basada en [Envoy](https://www.envoyproxy.io) que puede funcionar como un controlador Ingress.
* El [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  es también un controlador Ingress para [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  es un controlador Ingress basado en [Istio](https://istio.io/).
* El [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  es un controlador Ingress que controla [Kong Gateway](https://konghq.com/kong/).
* [Kusk Gateway](https://kusk.kubeshop.io/) es un controlador Ingress OpenAPI-driven basado en [Envoy](https://www.envoyproxy.io).
* El [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  trabaja con el servidor web (como un proxy) [NGINX](https://www.nginx.com/resources/glossary/nginx/).
* El [ngrok Kubernetes Ingress Controller](https://github.com/ngrok/kubernetes-ingress-controller) es un controlador de código abierto para añadir acceso público seguro a sus servicios K8s utilizando la [plataforma ngrok](https://ngrok.com).
* El [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme) es un controlador Ingress para Oracle Cloud Infrastructure el cual te permite manejar el [balanceador de cargas OCI](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm).
* El [Pomerium Ingress Controller](https://www.pomerium.com/docs/k8s/ingress.html) esta basado en [Pomerium](https://pomerium.com/), que ofrece una política de acceso sensible al contexto.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) es un enrutador HTTP y proxy inverso para la composición de servicios, incluyendo casos de uso como Kubernetes Ingress, diseñado como una biblioteca para construir su proxy personalizado.
* El [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) es un controlador Ingress para el [Traefik](https://traefik.io/traefik/) proxy.
* El [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) amplía Ingress con recursos personalizados para aportar capacidades de gestión de API a Ingress. Tyk Operator funciona con el plano de control de código abierto Tyk Gateway y Tyk Cloud.
* [Voyager](https://voyagermesh.com) es un controlador Ingress para
  [HAProxy](https://www.haproxy.org/#desc).
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) es un controlador Ingress que proporciona capacidades de seguridad WAAP (WAF) y API.

## Uso de varios controladores Ingress

Puedes desplegar cualquier número de controladores Ingress utilizando [clase ingress](/docs/concepts/services-networking/ingress/#ingress-class)
dentro de un clúster. Ten en cuenta el `.metadata.name` de tu recurso de clase Ingress. Cuando creas un Ingress, necesitarás ese nombre para especificar el campo `ingressClassName` de su objeto Ingress (consulta [referencia IngressSpec v1](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` sustituye el antiguo [método de anotación](/docs/concepts/services-networking/ingress/#deprecated-annotation).

Si no especificas una IngressClass para un Ingress, y tu clúster tiene exactamente una IngressClass marcada como predeterminada, Kubernetes [aplica](/docs/concepts/services-networking/ingress/#default-ingress-class) la IngressClass predeterminada del clúster al Ingress.
Se marca una IngressClass como predeterminada estableciendo la [anotación `ingressclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) en esa IngressClass, con el valor de cadena `"true"`.


Lo ideal sería que todos los controladores Ingress cumplieran esta especificación, pero los distintos controladores Ingress funcionan de forma ligeramente diferente.

{{< note >}}
Asegúrate de revisar la documentación de tu controlador Ingress para entender las advertencias de tu elección.
{{< /note >}}



## {{% heading "whatsnext" %}}


* Más información [Ingress](/docs/concepts/services-networking/ingress/).
* [Configurar Ingress en Minikube con el controlador NGINX](/docs/tasks/access-application-cluster/ingress-minikube).


