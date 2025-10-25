---
title: Контролери Ingress
description: >-
  Для того, щоб ресурс [Ingress](/docs/concepts/services-networking/ingress/) працював у вашому кластері, повинен бути запущений _контролер Ingress_. Вам потрібно вибрати принаймні один контролер Ingress та переконатися, що він налаштований у вашому кластері. На цій сторінці перелічені поширені контролери Ingress, які ви можете встановити.
content_type: concept
weight: 50
---

<!-- overview -->

Для того, щоб ресурс Ingress працював, у кластері повинен бути запущений контролер Ingress.

На відміну від інших типів контролерів, які працюють як частина бінарного файлу `kube-controller-manager`, контролери Ingress не запускаються автоматично разом з кластером. Використовуйте цю сторінку, щоб вибрати реалізацію контролера Ingress, яка найкраще підходить для вашого кластера.

Проєкт Kubernetes підтримує контролери Ingress для [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme) та [nginx](https://git.k8s.io/ingress-nginx/README.md#readme).

<!-- body -->

## Додаткові контролери {#additional-controllers}

{{% thirdparty-content %}}

* [AKS Application Gateway Ingress Controller](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json) — це контролер Ingress, який налаштовує [Azure Application Gateway](https://docs.microsoft.com/azure/application-gateway/overview).
* [Alibaba Cloud MSE Ingress](https://www.alibabacloud.com/help/en/mse/user-guide/overview-of-mse-ingress-gateways) — це контролер Ingress, який налаштовує [Alibaba Cloud Native Gateway](https://www.alibabacloud.com/help/en/mse/product-overview/cloud-native-gateway-overview?spm=a2c63.p38356.0.0.20563003HJK9is), який також є комерційною версією [Higress](https://github.com/alibaba/higress).
* [Apache APISIX Ingress Controller](https://github.com/apache/apisix-ingress-controller) — це контролер Ingress, заснований на [Apache APISIX](https://github.com/apache/apisix).
* [Avi Kubernetes Operator](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes) забезпечує балансування навантаження рівня 4-7, використовуючи [VMware NSX Advanced Load Balancer](https://avinetworks.com/).
* [BFE Ingress Controller](https://github.com/bfenetworks/ingress-bfe) — це контролер Ingress, заснований на [BFE](https://www.bfe-networks.net).
* [Cilium Ingress Controller](https://docs.cilium.io/en/stable/network/servicemesh/ingress/) — це контролер Ingress, який працює на основі [Cilium](https://cilium.io/).
* Контролер Ingress [Citrix](https://github.com/citrix/citrix-k8s-ingress-controller#readme) співпрацює з контролером доставки програм Citrix.
* [Contour](https://projectcontour.io/) — це контролер Ingress на основі [Envoy](https://www.envoyproxy.io/).
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API Gateway — це контролер Ingress на основі [Envoy](https://www.envoyproxy.io).
* [EnRoute](https://getenroute.io/) — це шлюз API на основі [Envoy](https://www.envoyproxy.io), який може працювати як контролер Ingress.
* [Easegress IngressController](https://megaease.com/docs/easegress/04.cloud-native/4.1.kubernetes-ingress-controller/) — це шлюз API на основі [Easegress](https://megaease.com/easegress/), який може працювати як контролер Ingress.
* [F5 BIG-IP Container Ingress Services for Kubernetes](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/) дозволяє використовувати Ingress для конфігурації віртуальних серверів F5 BIG-IP.
* [FortiADC Ingress Controller](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview) підтримує ресурси Kubernetes Ingress та дозволяє керувати обʼєктами FortiADC з Kubernetes
* [Gloo](https://gloo.solo.io) — це відкритий контролер Ingress на основі [Envoy](https://www.envoyproxy.io), який пропонує функціональність воріт API.
* [HAProxy Ingress](https://haproxy-ingress.github.io/) — це контролер Ingress для
  [HAProxy](https://www.haproxy.org/#desc).
* [Higress](https://github.com/alibaba/higress) — це шлюз API на основі [Envoy](https://www.envoyproxy.io), який може працювати як контролер Ingress.
* Контролер Ingress [HAProxy для Kubernetes](https://github.com/haproxytech/kubernetes-ingress#readme) також є контролером Ingress для [HAProxy](https://www.haproxy.org/#desc).
* [Istio Ingress](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/) — це контролер Ingress на основі [Istio](https://istio.io/).
* Контролер Ingress [Kong для Kubernetes](https://github.com/Kong/kubernetes-ingress-controller#readme) — це контролер Ingress, який керує [Kong Gateway](https://konghq.com/kong/).
* [Kusk Gateway](https://kusk.kubeshop.io/) — це контролер Ingress, орієнтований на OpenAPI, на основі [Envoy](https://www.envoyproxy.io).
* Контролер Ingress [NGINX для Kubernetes](https://www.nginx.com/products/nginx-ingress-controller/) працює з вебсервером [NGINX](https://www.nginx.com/resources/glossary/nginx/) (як проксі).
* [ngrok Kubernetes Ingress Controller](https://github.com/ngrok/kubernetes-ingress-controller) — це контролер Ingress з відкритим кодом для надання безпечного публічного доступу до ваших служб K8s за допомогою платформи [ngrok](https://ngrok.com).
* Контролер Ingress [OCI Native](https://github.com/oracle/oci-native-ingress-controller#readme) — це контролер Ingress для Oracle Cloud Infrastructure, який дозволяє керувати [OCI Load Balancer](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm).
* [OpenNJet Ingress Controller](https://gitee.com/njet-rd/open-njet-kic) є ingress-контролером на основі [OpenNJet](https://njet.org.cn/).
* Контролер Ingress [Pomerium](https://www.pomerium.com/docs/k8s/ingress.html) — це контролер Ingress на основі [Pomerium](https://pomerium.com/), який пропонує політику доступу з урахуванням контексту.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) — це HTTP-маршрутизатор та зворотний проксі для композиції служб, включаючи випадки використання, такі як Kubernetes Ingress, розроблений як бібліотека для побудови вашого власного проксі.
* Контролер Ingress [Traefik Kubernetes provider](https://doc.traefik.io/traefik/providers/kubernetes-ingress/) — це контролер Ingress для проксі [Traefik](https://traefik.io/traefik/).
* [Tyk Operator](https://github.com/TykTechnologies/tyk-operator) розширює Ingress за допомогою власних ресурсів для надання можливостей управління API Ingress. Tyk Operator працює з відкритими шлюзами Tyk та хмарною системою управління Tyk.
* [Voyager](https://voyagermesh.com) — це контролер Ingress для
  [HAProxy](https://www.haproxy.org/#desc).
* Контролер Ingress [Wallarm](https://www.wallarm.com/solutions/waf-for-kubernetes) — це контролер Ingress, який надає можливості WAAP (WAF) та захисту API.

## Використання кількох контролерів Ingress {#using-multiple-ingress-controllers}

Ви можете розгортати будь-яку кількість контролерів Ingress за допомогою [класу Ingress](/docs/concepts/services-networking/ingress/#ingress-class) у межах кластера. Зверніть увагу на значення `.metadata.name` вашого ресурсу класу Ingress. При створенні Ingress вам слід вказати це імʼя для визначення поля `ingressClassName` в обʼєкті Ingress (див. [специфікацію IngressSpec v1](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec)). `ingressClassName` є заміною застарілого [методу анотації](/docs/concepts/services-networking/ingress/#deprecated-annotation).

Якщо ви не вказуєте IngressClass для Ingress, і у вашому кластері рівно один IngressClass відзначений як типовий, тоді Kubernetes [застосовує](/docs/concepts/services-networking/ingress/#default-ingress-class) типовий IngressClass кластера до Ingress. Ви вказуєте IngressClass як типовий, встановлюючи анотацію [`ingressclass.kubernetes.io/is-default-class`](/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class) для цього IngressClass, зі значенням `"true"`.

В ідеалі, всі контролери Ingress повинні відповідати цій специфікації, але різні контролери Ingress працюють трошки по-різному.

{{< note >}}
Переконайтеся, що ви ознайомилися з документацією вашого контролера Ingress, щоб зрозуміти особливості вибору.
{{< /note >}}

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [Ingress](/docs/concepts/services-networking/ingress/).
* [Налаштуйте Ingress на Minikube з контролером NGINX](/docs/tasks/access-application-cluster/ingress-minikube).
