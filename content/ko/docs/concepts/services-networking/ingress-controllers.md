---
title: 인그레스 컨트롤러
description: >-
  클러스터에서 [인그레스](/docs/concepts/services-networking/ingress/)가 동작하려면
  인그레스 컨트롤러가 실행 중이어야 한다.
  적어도 하나의 인그레스 컨트롤러를 선택하고 이를 클러스터 내에 설정해야 한다.
  이 페이지는 배포할 수 있는 일반적인 인그레스 컨트롤러를 나열한다.
content_type: concept
weight: 50
---

{{< note >}}
쿠버네티스 프로젝트는 [인그레스](/docs/concepts/services-networking/ingress/) 대신
[게이트웨이](https://gateway-api.sigs.k8s.io/) 사용을 권장한다.
인그레스 API는 동결(frozen)된 상태이다.
​
이는 다음을 의미한다.
* 인그레스 API는 일반적으로 사용 가능하며, 일반적으로 사용 가능한 API에 적용하는 [안정성 보장](/docs/reference/using-api/deprecation-policy/#deprecating-parts-of-the-api)을 따른다.
  쿠버네티스 프로젝트는 인그레스를 쿠버네티스에서 제거할 계획이 없다.
* 인그레스 API는 더 이상 개발되지 않으며, 앞으로 변경이나
  업데이트가 이루어지지 않는다.
​{{< /note >}}

<!-- body --> 

<!-- overview -->


## 인그레스 컨트롤러

프로젝트로서 쿠버네티스는 [AWS](https://github.com/kubernetes-sigs/aws-load-balancer-controller#readme) 및 [GCE](https://git.k8s.io/ingress-gce/README.md#readme) 인그레스 컨트롤러를 지원하고 유지 관리한다.



## 서드파티 인그레스 컨트롤러

{{% thirdparty-content %}}

* [AKS 애플리케이션 게이트웨이 인그레스 컨트롤러](https://docs.microsoft.com/azure/application-gateway/tutorial-ingress-controller-add-on-existing?toc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Faks%2Ftoc.json&bc=https%3A%2F%2Fdocs.microsoft.com%2Fen-us%2Fazure%2Fbread%2Ftoc.json)는 [Azure 애플리케이션 게이트웨이](https://docs.microsoft.com/azure/application-gateway/overview)를 구성하는 인그레스 컨트롤러다.
* [Alibaba 클라우드 API 게이트웨이 인그레스](https://www.alibabacloud.com/help/en/api-gateway/cloud-native-api-gateway/user-guide/ingress-managementapig-ngress-management)는 [Alibaba 클라우드 네이티브 API 게이트웨이](https://www.alibabacloud.com/help/en/api-gateway/cloud-native-api-gateway/product-overview/what-is-cloud-native-api-gateway)를 구성하는 인그레스 컨트롤러이며, 이는 [Higress](https://github.com/alibaba/higress)의 상용 버전이기도 하다.
* [Apache APISIX 인그레스 컨트롤러](https://github.com/apache/apisix-ingress-controller)는 [Apache APISIX](https://github.com/apache/apisix) 기반의 인그레스 컨트롤러이다.
* [Avi 쿠버네티스 오퍼레이터](https://github.com/vmware/load-balancer-and-ingress-services-for-kubernetes)는 [VMware NSX 고급 로드 밸런서](https://avinetworks.com/)을 사용하는 L4-L7 로드 밸런싱을 제공한다.
* [BFE 인그레스 컨트롤러](https://github.com/bfenetworks/ingress-bfe)는 [BFE](https://www.bfe-networks.net) 기반 인그레스 컨트롤러다.
* [Cilium 인그레스 컨트롤러](https://docs.cilium.io/en/stable/network/servicemesh/ingress/)는 [Cilium](https://cilium.io/)으로 구현된 인그레스 컨트롤러이다.
* [Citrix 인그레스 컨트롤러](https://github.com/citrix/citrix-k8s-ingress-controller#readme)는
  Citrix 애플리케이션 딜리버리 컨트롤러와 함께 작동한다.
* [Contour](https://projectcontour.io/)는 [Envoy](https://www.envoyproxy.io/) 기반 인그레스 컨트롤러다.
* [Emissary-Ingress](https://www.getambassador.io/products/api-gateway) API 게이트웨이는 [Envoy](https://www.envoyproxy.io) 기반 인그레스
  컨트롤러이다.
* [EnRoute](https://getenroute.io/)는 인그레스 컨트롤러로 실행할 수 있는 [Envoy](https://www.envoyproxy.io) 기반 API 게이트웨이다.
* F5 BIG-IP [쿠버네티스 용 컨테이너 인그레스 서비스](https://clouddocs.f5.com/containers/latest/userguide/kubernetes/)를
  이용하면 인그레스를 사용하여 F5 BIG-IP 가상 서버를 구성할 수 있다.
* [FortiADC 인그레스 컨트롤러](https://docs.fortinet.com/document/fortiadc/7.0.0/fortiadc-ingress-controller/742835/fortiadc-ingress-controller-overview)는 쿠버네티스 인그레스 리소스를 지원하며, 쿠버네티스에서 FortiADC 오브젝트를 관리할 수 있게 한다.
* [Gloo](https://gloo.solo.io)는 API 게이트웨이 기능을 제공하는 [Envoy](https://www.envoyproxy.io) 기반의
  오픈소스 인그레스 컨트롤러다.
* [HAProxy 인그레스](https://haproxy-ingress.github.io/)는 [HAProxy](https://www.haproxy.org/#desc)의
  인그레스 컨트롤러다.
* [Higress](https://github.com/alibaba/higress)는 인그레스 컨트롤러로 실행할 수 있는 [Envoy](https://www.envoyproxy.io) 기반 API 게이트웨이이다.
* [쿠버네티스 용 HAProxy 인그레스 컨트롤러](https://github.com/haproxytech/kubernetes-ingress#readme)는 [HAProxy](https://www.haproxy.org/#desc) 용
  인그레스 컨트롤러이기도 하다.
* [Istio 인그레스](https://istio.io/latest/docs/tasks/traffic-management/ingress/kubernetes-ingress/)는 [Istio](https://istio.io/)
  기반 인그레스 컨트롤러다.
* [쿠버네티스 용 Kong 인그레스 컨트롤러](https://github.com/Kong/kubernetes-ingress-controller#readme)는 [Kong 게이트웨이](https://konghq.com/kong/)를
  구동하는 인그레스 컨트롤러다.
* [Kusk 게이트웨이](https://kusk.kubeshop.io/)는 OpenAPI 중심의 [Envoy](https://www.envoyproxy.io) 기반 인그레스 컨트롤러다.
* [쿠버네티스 용 NGINX 인그레스 컨트롤러](https://www.nginx.com/products/nginx-ingress-controller/)는 [NGINX](https://www.nginx.com/resources/glossary/nginx/)
  웹서버(프록시로 사용)와 함께 작동한다.
* [ngrok-operator](https://github.com/ngrok/ngrok-operator)는 [ngrok](https://ngrok.com/)용 컨트롤러로, K8s 서비스에 대한 보안 공인 접근을 위한 인그레스와 게이트웨이 API를 모두 지원한다.
* [OCI Native 인그레스 컨트롤러](https://github.com/oracle/oci-native-ingress-controller#readme)는 Oracle Cloud Infrastructure용 인그레스 컨트롤러로, [OCI 로드 밸런서](https://docs.oracle.com/en-us/iaas/Content/Balance/home.htm)를 관리할 수 있게 한다.
* [OpenNJet 인그레스 컨트롤러](https://gitee.com/njet-rd/open-njet-kic)은 [OpenNJet](https://njet.org.cn/) 기반 인그레스 컨트롤러이다.
* [Pomerium 인그레스 컨트롤러](https://www.pomerium.com/docs/k8s/ingress.html)는 컨텍스트 기반 접근 제어 정책을 제공하는 [Pomerium](https://pomerium.com/) 기반 인그레스 컨트롤러이다.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)는 사용자의 커스텀 프록시를 구축하기 위한 라이브러리로 설계된 쿠버네티스 인그레스와 같은 유스케이스를 포함한 서비스 구성을 위한 HTTP 라우터 및 역방향 프록시다.
* [Traefik 쿠버네티스 인그레스 제공자](https://doc.traefik.io/traefik/providers/kubernetes-ingress/)는
  [Traefik](https://traefik.io/traefik/) 프록시 용 인그레스 컨트롤러다.
* [Tyk 오퍼레이터](https://github.com/TykTechnologies/tyk-operator)는 사용자 지정 리소스로 인그레스를 확장하여 API 관리 기능을 인그레스로 가져온다. Tyk 오퍼레이터는 오픈 소스 Tyk 게이트웨이 및 Tyk 클라우드 컨트롤 플레인과 함께 작동한다.
* [Voyager](https://voyagermesh.com)는
  [HAProxy](https://www.haproxy.org/#desc)의 인그레스 컨트롤러다.
* [Wallarm 인그레스 컨트롤러](https://www.wallarm.com/solutions/waf-for-kubernetes)는 WAAP(WAF 및 API 보안) 기능을 제공하는 인그레스 컨트롤러이다.

## 여러 인그레스 컨트롤러 사용

하나의 클러스터 내에 [인그레스 클래스](/ko/docs/concepts/services-networking/ingress/#ingress-class)를 이용하여 여러 개의 인그레스 컨트롤러를 배포할 수 있다.
`.metadata.name` 필드를 확인해둔다. 인그레스를 생성할 때 인그레스 오브젝트([IngressSpec v1 참고](/docs/reference/kubernetes-api/service-resources/ingress-v1/#IngressSpec))의 `ingressClassName` 필드에 해당 이름을 명시해야 한다. `ingressClassName`은 이전 [어노테이션 방식](/ko/docs/concepts/services-networking/ingress/#사용중단-deprecated-어노테이션)의 대체 수단이다.

인그레스에 대한 인그레스 클래스를 설정하지 않았고, 클러스터에 기본으로 설정된 인그레스 클래스가 정확히 하나만 존재하는 경우, 쿠버네티스는 클러스터의 기본 인그레스 클래스를 인그레스에 [적용](/ko/docs/concepts/services-networking/ingress/#default-ingress-class)한다.
인그레스 클래스에 [`ingressclass.kubernetes.io/is-default-class` 어노테이션](/ko/docs/reference/labels-annotations-taints/#ingressclass-kubernetes-io-is-default-class)을 문자열 값 `"true"`로 설정하여, 해당 인그레스 클래스를 기본으로 설정할 수 있다.

이상적으로는 모든 인그레스 컨트롤러가 이 사양을 충족해야 하지만,
다양한 인그레스 컨트롤러는 약간 다르게 작동한다.

{{< note >}}
인그레스 컨트롤러의 설명서를 검토하여 선택 시 주의 사항을 이해해야 한다.
{{< /note >}}



## {{% heading "whatsnext" %}}


* [인그레스](/docs/concepts/services-networking/ingress/)에 대해 자세히 알아보기.


