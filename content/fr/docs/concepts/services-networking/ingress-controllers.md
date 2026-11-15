---
title: Contrôleurs d'Ingress
description: >-
  Pour qu'un [Ingress](/docs/concepts/services-networking/ingress/) fonctionne dans votre cluster,
  un _contrôleur d'Ingress_ doit être en cours d'exécution.
  Vous devez choisir au moins un contrôleur d'Ingress et vous assurer qu'il est mis en place dans votre cluster.
  Cette page liste des contrôleurs d'Ingress courants que vous pouvez déployer.
content_type: concept
weight: 50
---

{{< note >}}
Le projet Kubernetes recommande d'utiliser [Gateway](https://gateway-api.sigs.k8s.io/) plutôt
qu'[Ingress](/docs/concepts/services-networking/ingress/).
L'API Ingress est figée.

Cela signifie que :
* L'API Ingress est en disponibilité générale (GA) et soumise aux [garanties de stabilité](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api) prévues pour les API GA.
  Le projet Kubernetes n'a pas l'intention de retirer Ingress de Kubernetes.
* L'API Ingress n'est plus développée et ne recevra plus aucune modification
  ni mise à jour.
{{< /note >}}

<!-- body -->

<!-- overview -->


## Contrôleurs d'Ingress {#ingress-controllers}

Le projet Kubernetes prend en charge et maintient les contrôleurs d'Ingress [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme) et [GCE](https://git.k8s.io/ingress-gce/README.md#readme).



## Contrôleurs d'Ingress tiers {#third-party-ingress-controllers}

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json) est un contrôleur d'Ingress qui configure [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Alibaba Cloud API Gateway Ingress](https://www.alibabacloud.com/help/en/api-gateway/cloud-native-api-gateway/user-guide/ingress-managementapig-ngress-management) est un contrôleur d'Ingress qui configure [Alibaba Cloud Native API Gateway](https://www.alibabacloud.com/help/en/api-gateway/cloud-native-api-gateway/product-overview/what-is-cloud-native-api-gateway), qui est aussi la version commerciale de [Higress](https://github.com/alibaba/higress).
* [Apache APISIX ingress controller](https://github.com/apache/apisix-ingress-controller) est un contrôleur d'Ingress basé sur [Apache APISIX](https://github.com/apache/apisix).
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) fournit de l'équilibrage de charge L4-L7 avec [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) est un contrôleur d'Ingress basé sur [BFE](https://www.bfe-networks.net).
* [BunkerWeb Ingress Controller](https://docs.bunkerweb.io/latest/integrations/#kubernetes) est un contrôleur d'Ingress pour [BunkerWeb](https://www.bunkerweb.io/), un WAF (Web Application Firewall, pare-feu applicatif) basé sur nginx.
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) est un contrôleur d'Ingress reposant sur [Cilium](https://cilium.io/).
* [Citrix ingress controller](https://github.com/citrix/citrix-k8s-ingress-controller#readme) fonctionne avec
  Citrix Application Delivery Controller.
* [Contour](https://projectcontour.io/) est un contrôleur d'Ingress basé sur [Envoy](https://www.envoyproxy.io/).
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API Gateway est un contrôleur d'Ingress
  basé sur [Envoy](https://www.envoyproxy.io).
* [EnRoute](https://getenroute.io/) est une passerelle d'API basée sur [Envoy](https://www.envoyproxy.io) qui peut fonctionner comme contrôleur d'Ingress.
* F5 BIG-IP [Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)
  vous permet d'utiliser un Ingress pour configurer des serveurs virtuels F5 BIG-IP.
* [FortiADC Ingress Controller](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview) prend en charge les ressources Ingress de Kubernetes et vous permet de gérer des objets FortiADC depuis Kubernetes.
* [Gloo](https://gloo.solo.io) est un contrôleur d'Ingress open source basé sur [Envoy](https://www.envoyproxy.io),
  qui offre des fonctionnalités de passerelle d'API.
* [Higress](https://github.com/alibaba/higress) est une passerelle d'API basée sur [Envoy](https://www.envoyproxy.io) qui peut fonctionner comme contrôleur d'Ingress.
* [HAProxy Ingress Controller for Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme)
  est un contrôleur d'Ingress pour [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)
  est un contrôleur d'Ingress basé sur [Istio](https://istio.io/).
* [Kong Ingress Controller for Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme)
  est un contrôleur d'Ingress qui pilote [Kong Gateway](https://konghq.com/kong/).
* [Kusk Gateway](https://kusk.kubeshop.io/) est un contrôleur d'Ingress piloté par OpenAPI et basé sur [Envoy](https://www.envoyproxy.io).
* [N42 Gateway](https://n42-gateway.github.io/) est un contrôleur pour Ingress et Gateway API, destiné à [HAProxy](https://www.haproxy.org/#desc).
* [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/)
  fonctionne avec le serveur web [NGINX](https://www.nginx.com/resources/glossary/nginx/) (utilisé comme proxy).
* [ngrok-operator](https://github.com/ngrok/ngrok-operator) est un contrôleur pour [ngrok](https://ngrok.com/) qui prend en charge à la fois Ingress et Gateway API pour exposer vos Services K8s de manière sécurisée sur Internet.
* [OCI Native Ingress Controller](https://github.com/oracle/oci-native-ingress-controller#readme) est un contrôleur d'Ingress pour Oracle Cloud Infrastructure qui vous permet de gérer [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm).
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) est un contrôleur d'Ingress basé sur [OpenNJet](https://njet.org.cn/).
* [Pomerium Ingress Controller](https://www.pomerium.com/docs/k8s/ingress.html) est basé sur [Pomerium](https://pomerium.com/), qui propose des politiques d'accès tenant compte du contexte.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) est un routeur HTTP et un proxy inverse pour la composition de services, y compris pour des cas d'usage comme Kubernetes Ingress, conçu comme une bibliothèque pour construire votre propre proxy.
* [Traefik Kubernetes Ingress provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) est un
  contrôleur d'Ingress pour le proxy [Traefik](https://traefik.io/traefik/).
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) étend Ingress avec des ressources personnalisées pour lui apporter des fonctionnalités de gestion d'API. Tyk Operator fonctionne avec Tyk Gateway (open source) et avec le plan de contrôle Tyk Cloud.
* [Voyager](https://voyagermesh.com) est un contrôleur d'Ingress pour
  [HAProxy](https://www.haproxy.org/#desc).
* [Wallarm Ingress Controller](https://www.wallarm.com/solutions/waf-for-kubernetes) est un contrôleur d'Ingress qui fournit des fonctionnalités de WAAP (WAF) et de sécurité des API.

## Utiliser plusieurs contrôleurs d'Ingress {#using-multiple-ingress-controllers}

Vous pouvez déployer autant de contrôleurs d'Ingress que vous le souhaitez dans un cluster, grâce aux
[classes d'Ingress](/docs/concepts/services-networking/ingress/#ingress-class). Notez le `.metadata.name` de votre ressource de classe d'Ingress. Lorsque vous créez un Ingress, vous avez besoin de ce nom pour renseigner le champ `ingressClassName` de votre objet Ingress (voir la [référence IngressSpec v1](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` remplace l'ancienne [méthode par annotation](/docs/concepts/services-networking/ingress/#deprecated-annotation).

Si vous ne précisez pas d'IngressClass pour un Ingress et que votre cluster a exactement une IngressClass marquée comme classe par défaut, Kubernetes [applique](/docs/concepts/services-networking/ingress/#default-ingress-class) cette IngressClass par défaut du cluster à l'Ingress.
Pour marquer une IngressClass comme classe par défaut, définissez l'[annotation `ingressclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) sur cette IngressClass, avec la chaîne `"true"`.

Idéalement, tous les contrôleurs d'Ingress devraient respecter cette spécification, mais les différents
contrôleurs d'Ingress fonctionnent de manière légèrement différente.

{{< note >}}
Consultez bien la documentation de votre contrôleur d'Ingress pour connaître les points d'attention liés à ce choix.
{{< /note >}}



## {{% heading "whatsnext" %}}


* En savoir plus sur [Ingress](/docs/concepts/services-networking/ingress/).
