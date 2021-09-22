---
title: Controladores Ingress
reviewers:
content_type: concept
weight: 40
---

<!-- overview -->

Para que o Ingress funcione corretamente, o cluster necessita de um controlador Ingress em execução. 

Diferente dos outros tipos de controladores que são executados como parte do binário `kube-controller-manager`, os controladores Ingress não são iniciados automaticamente com o cluster. Use essa página para escolher a implementação de controlador Ingress que melhor se encaixa no seu cluster.

O projeto Kubernetes dá suporte e mantem os controladores Ingress [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme), e
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme).

<!-- body -->

## Controladores adicionais

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://azure.github.io/application-gateway-kubernetes-ingress/) é um 
  controlador Ingress que configura o [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Ambassador](https://www.getambassador.io/) API Gateway é um controlador Ingress baseado em [Envoy](https://www.envoyproxy.io).
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) é um controlador Ingress baseado 
  em [Apache APISIX](https://github.com/apache/apisix).
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) fornece balanceamento 
  de carga L4-L7 utilizando o [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* O [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) funciona com 
  o Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) é um controlador Ingress baseado em [Envoy](https://www.envoyproxy.io/).
* [EnRoute](https://getenroute.io/) é uma API gateway baseado em [Envoy](https://www.envoyproxy.io) que 
  pode ser executada como um controlador Ingress.
* [Easegress IngressController](https://github.com/megaease/easegress/blob/main/doc/ingresscontroller.md) 
  é uma API gateway baseado em [Easegress](https://megaease.com/easegress/) que pode ser executada como um controlador Ingress.
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  permite a utilização de um Ingress para configurar o F5 BIG-IP virtual servers.
* [Gloo](https://gloo.solo.io) é um controlador Ingress open-source baseadp em [Envoy](https://www.envoyproxy.io),
  que oferece funcionalidade de APIS gateway.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) é um controlador Ingress para o 
  [HAProxy](https://www.haproxy.org/#desc).
* O [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  é outro controlador Ingress para o [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  é um controlador Ingress  baseado no [Istio](https://istio.io/).
* o [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
 é um controlador Ingress para [Kong Gateway](https://konghq.com/kong/).
* O [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  funciona com o webserver [NGINX](https://www.nginx.com/resources/glossary/nginx/) (como uma proxy).
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) é um router HTTP e proxy reversa para composição de serviço, incluindo casos como o Ingress Kubernetes, desenvolvido como uma biblioteca para desenvolver sua proxy customizada.
* o [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) é um controlador Ingress para a proxy [Traefik](https://traefik.io/traefik/).
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) extende o Ingress com recursos customizados para trazer capacidades de gerenciamento de API para o Ingress. O Tyk Operator funciona com o painel de controle Tyk Gateway & Tyk Cloud
* [Voyager](https://appscode.com/products/voyager) é um controlador Ingress para o
  [HAProxy](https://www.haproxy.org/#desc).

## Utilizando múltiplos controladores Ingress

Você pode ter [quantos controladores Ingress desejar](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 
em um cluster. Quando você cria um ingress, você deve especificar para cada ingress o [`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) 
para indicar qual controlador ingress deve ser utilizado caso exista mais de um em seu cluster.

Se você não definir uma classe, sua provedora de serviços talvez use um controlador ingress padrão.

Idealmente, todos os controladores Ingress devem preencher essa informações, mas cada um dos diversos controladores ingress operam de maneira um pouco diferente.

{{< note >}}
Tenha certeza de conferir a documentação do seu controlador Ingress para entender as ressalvas de uso.
{{< /note >}}



## {{% heading "whatsnext" %}}


* Aprenda mais sobre [Ingress](/docs/concepts/services-networking/ingress/).
* [Configure um Ingress no Minikube com o NGINX Controller](/docs/tasks/access-application-cluster/ingress-minikube).
