---
title: 인그레스 컨트롤러
reviewers:
content_type: concept
weight: 40
---

<!-- overview -->

인그레스 리소스가 작동하려면, 클러스터는 실행 중인 인그레스 컨트롤러가 반드시 필요하다.

`kube-controller-manager` 바이너리의 일부로 실행되는 컨트롤러의 다른 타입과 달리 인그레스 컨트롤러는
클러스터와 함께 자동으로 실행되지 않는다.
클러스터에 가장 적합한 인그레스 컨트롤러 구현을 선택하는데 이 페이지를 사용한다.

프로젝트로서 쿠버네티스는 [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme), [GCE](https://git.k8s.io/ingress-gce/README.md#readme)와
  [nginx](https://git.k8s.io/ingress-nginx/README.md#readme) 인그레스 컨트롤러를 지원하고 유지한다.


<!-- body -->

## 추가 컨트롤러

{{% thirdparty-content %}}

* [AKS 애플리케이션 게이트웨이 인그레스 컨트롤러](https://azure.github.io/application-gateway-kubernetes-ingress/)는 [Azure 애플리케이션 게이트웨이](https://docs.microsoft.com)를 구성하는 인그레스 컨트롤러다.
* [Ambassador](https://www.getambassador.io/) API 게이트웨이는 [Envoy](https://www.envoyproxy.io) 기반 인그레스
  컨트롤러다.
* [Apache APISIX 인그레스 컨트롤러](https://github.com/apache/apisix-ingress-controller)는 [Apache APISIX](https://github.com/apache/apisix) 기반의 인그레스 컨트롤러이다.
* [Avi 쿠버네티스 오퍼레이터](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)는 [VMware NSX Advanced Load Balancer](https://avinetworks.com/)을 사용하는 L4-L7 로드 밸런싱을 제공한다.
* [Citrix 인그레스 컨트롤러](https://github.com/citrix/citrix-k8s-ingress-controller#readme)는
  Citrix 애플리케이션 딜리버리 컨트롤러에서 작동한다.
* [Contour](https://projectcontour.io/)는 [Envoy](https://www.envoyproxy.io/) 기반 인그레스 컨트롤러다.
* [EnRoute](https://getenroute.io/)는 인그레스 컨트롤러로 실행할 수 있는 [Envoy](https://www.envoyproxy.io) 기반 API 게이트웨이다.
* F5 BIG-IP [쿠버네티스 용 컨테이너 인그레스 서비스](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)를
  이용하면 인그레스를 사용하여 F5 BIG-IP 가상 서버를 구성할 수 있다.
* [Gloo](https://gloo.solo.io)는 API 게이트웨이 기능을 제공하는 [Envoy](https://www.envoyproxy.io) 기반의
  오픈소스 인그레스 컨트롤러다.
* [HAProxy 인그레스](https://haproxy-ingress.github.io/)는 [HAProxy](https://www.haproxy.org/#desc)의
  인그레스 컨트롤러다.
* [쿠버네티스 용 HAProxy 인그레스 컨트롤러](https://github.com/haproxytech/kubernetes-ingress#readme)는 [HAProxy](https://www.haproxy.org/#desc) 용
  인그레스 컨트롤러이기도 하다.
* [Istio 인그레스](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)는 [Istio](https://istio.io/)
  기반 인그레스 컨트롤러다.
* [쿠버네티스 용 Kong 인그레스 컨트롤러](https://github.com/Kong/kubernetes-ingress-controller#readme)는 [Kong 게이트웨이](https://konghq.com/kong/)를
  구동하는 인그레스 컨트롤러다.
* [쿠버네티스 용 NGINX 인그레스 컨트롤러](https://www.nginx.com/products/nginx-ingress-controller/)는 [NGINX](https://www.nginx.com/resources/glossary/nginx/)
  웹서버(프록시로 사용)와 함께 작동한다.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)는 사용자의 커스텀 프록시를 구축하기 위한 라이브러리로 설계된 쿠버네티스 인그레스와 같은 유스케이스를 포함한 서비스 구성을 위한 HTTP 라우터 및 역방향 프록시다.
* [Traefik 쿠버네티스 인그레스 제공자](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)는
  [Traefik](https://traefik.io/traefik/) 프록시 용 인그레스 컨트롤러다.
* [Tyk 오퍼레이터](https://github.com/TykTechnologies/tyk-operator)는 사용자 지정 리소스로 인그레스를 확장하여 API 관리 기능을 인그레스로 가져온다. Tyk 오퍼레이터는 오픈 소스 Tyk 게이트웨이 및 Tyk 클라우드 컨트롤 플레인과 함께 작동한다.
* [Voyager](https://appscode.com/products/voyager)는
  [HAProxy](https://www.haproxy.org/#desc)의 인그레스 컨트롤러다.

## 여러 인그레스 컨트롤러 사용

하나의 클러스터 내에 [여러 개의 인그레스 컨트롤러](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)를 배포할 수 있다.
인그레스를 생성할 때,  클러스터 내에 둘 이상의 인그레스 컨트롤러가 존재하는 경우
어떤 인그레스 컨트롤러를 사용해야 하는지 표시해주는 적절한 [`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)
어노테이션을 각각의 인그레스에 달아야 한다.

만약 클래스를 정의하지 않으면, 클라우드 제공자는 기본 인그레스 컨트롤러를 사용할 수 있다.

이상적으로는 모든 인그레스 컨트롤러가 이 사양을 충족해야 하지만,
다양한 인그레스 컨트롤러는 약간 다르게 작동한다.

{{< note >}}
인그레스 컨트롤러의 설명서를 검토하여 선택 시 주의 사항을 이해해야 한다.
{{< /note >}}



## {{% heading "whatsnext" %}}


* [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대해 자세히 알아보기.
* [NGINX 컨트롤러로 Minikube에서 인그레스를 설정하기](/docs/tasks/access-application-cluster/ingress-minikube).
