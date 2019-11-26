---
title: 인그레스 컨트롤러
reviewers:
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

인그레스 리소스가 작동하려면 클러스터에 인그레스 컨트롤러를 실행하고 있어야 한다.

`kube-controller-manager` 바이너리의 일부로 실행하는 다른 유형의 컨트롤러와 다르게 인그레스 컨트롤러는
클러스터에서 자동으로 시작되지 않는다. 이 페이지를 이용해서 클러스터에
가장 적합한 인그레스 컨트롤러를 선택한다.

쿠버네티스 프로젝트로서 현재 [GCE](https://git.k8s.io/ingress-gce/README.md)와
  [nginx](https://git.k8s.io/ingress-nginx/README.md) 컨트롤러를 지원하고 유지 보수한다.

{{% /capture %}}

{{% capture body %}}

## 추가 컨트롤러

* [Ambassador](https://www.getambassador.io/) API 게이트웨이는 [Datawire](https://www.datawire.io/)의
  [커뮤니티](https://www.getambassador.io/docs) 또는
  [상업](https://www.getambassador.io/pro/) 지원을 받는 [Envoy](https://www.envoyproxy.io) 기반의 인그레스 컨트롤러이다.
* [AppsCode Inc.](https://appscode.com)는 가장 널리 사용되는 [HAProxy](http://www.haproxy.org/) 기반으로 하는 인그레스 컨트롤러인 [Voyager](https://appscode.com/products/voyager)에 대한 지원 과 유지 보수를 제공한다.
* [AWS ALB Ingress Controller](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)는 [AWS Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/)를 사용해서 인그레스를 활성화한다.
* [Contour](https://projectcontour.io/)는 VMware에서 제공하고 지원하는 [Envoy](https://www.envoyproxy.io/)
  기반의 인그레스 컨트롤러이다.
* Citrix는 하드웨어(MPX), 가상화(VPX) 그리고 [무료 컨테이터화 된 (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html)에 [베어메탈](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal)과 [클라우드](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) 배포를 위한 [인그레스 컨트롤러](https://github.com/citrix/citrix-k8s-ingress-controller)를 제공한다.
* F5 Networks는 [쿠버네티스용 F5 BIG-IP 컨트롤러](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)
  에 대한 [지원과 유지 보수](https://support.f5.com/csp/article/K86859508)를 제공한다.
* [Gloo](https://gloo.solo.io)는 [solo.io](https://www.solo.io)의 엔터프라이즈 지원과 함께 API 게이트웨이 기능을 제공하는 [Envoy](https://www.envoyproxy.io) 기반의 오픈소스인 인그레스 컨트롤러이다.
* [HAProxy 인그레스](https://haproxy-ingress.github.io)는 HAProxy를 위한 높은 수준의 사용자 정의를 할 수 있는 커뮤니티 주도형 인그레스 컨트롤러이다.
* [HAProxy Technologies](https://www.haproxy.com/)는 [쿠버네티스용 HAProxy 인그레스 컨트롤러](https://github.com/haproxytech/kubernetes-ingress)에 대한 지원과 유지 보수를 제공한다. [공식 문서](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)를 참조한다.
* [Istio](https://istio.io/)는 인그레스 컨트롤러를 기반으로
  [인그레스 트레픽을 컨트롤 한다](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/)은 [쿠버네티스용 Kong 인그레스 컨트롤러](https://github.com/Kong/kubernetes-ingress-controller)에 대한
  [커뮤니티](https://discuss.konghq.com/c/kubernetes) 또는 
  [상업](https://konghq.com/kong-enterprise/) 지원과 유지 보수를 제공한다.
* [NGINX, Inc.](https://www.nginx.com/) 는
  [쿠버네티스용 NGINX 인그레스 컨트롤러](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)에 대한 지원과 유지 보수를 제공한다.
* [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/)는 쿠버네티스 인그레스와 같은 사용 사례를 포함해서 서비스 구성을 위한 HTTP 라우터와 리버스 프록시, 사용자 지정 프록시를 빌드하기 위한 라이브러리로 설계되었다.
* [Traefik](https://github.com/containous/traefik)는 모든 기능을 갖춘 인그레스 컨트롤러
  ([Let's Encrypt](https://letsencrypt.org), secrets, http2, websocket)이며, [Containous](https://containo.us/services)의
  상업적 지원도 제공한다.

## 복수의 인그레스 컨트롤러 사용하기

사용자는 클러스터 내에 [복수의 인그레스 컨트롤러](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)
를 배포할 수 있다. 인그레스를 생성할 때, 사용자는 각 수신기에 적절한
[`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)
어노테이션을 달아 클러스터 내에 둘 이상의 인그레스 컨트롤러가 있을 경우 사용해야 하는 인그레스 컨트롤러를 표시해야 한다.

만약 클래스를 정의하지 않으면, 클라우드 공급자가 기본 인그레스 컨트롤러를 사용하게 된다.

이상적으로, 모든 인그레스 컨트롤러는 이 사양을 충족해야 하지만, 다양한 인그레스
컨트롤러는 조금씩 다르게 작동한다.

{{< note >}}
인그레스 컨트롤러의 설명서를 검토하여 선택시 주의 사항을 이해해야 한다.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대해 더 자세히 알아보기.
* [NGINX 컨트롤러로 Minikube에서 인그레스 구성하기](/docs/tasks/access-application-cluster/ingress-minikube).

{{% /capture %}}
