---
title: 인그레스 컨트롤러
reviewers:
content_template: templates/concept
weight: 40
---

{{% capture overview %}}

인그레스 리소스가 작동하려면, 클러스터는 실행 중인 인그레스 컨트롤러가 반드시 필요하다.

kube-controller-manager 바이너리의 일부로 실행되는 컨트롤러의 다른 타입과 달리 인그레스 컨트롤러는 클러스터와 함께 자동으로 실행되지 않는다. 
클러스터에 가장 적합한 인그레스 컨트롤러 구현을 선택하는데 이 페이지를 사용한다.

프로젝트로써 쿠버네티스는 현재 [GCE](https://git.k8s.io/ingress-gce/README.md) 와
  [nginx](https://git.k8s.io/ingress-nginx/README.md) 컨트롤러를 지원하고 유지한다.
  
{{% /capture %}}

{{% capture body %}}

## 추가 컨트롤러

* [Ambassador](https://www.getambassador.io/) API 게이트웨이는 [Datawire](https://www.datawire.io/)의 
  [커뮤니티](https://www.getambassador.io/docs) 혹은 [상업적](https://www.getambassador.io/pro/) 지원을 제공하는 
  [Envoy](https://www.envoyproxy.io) 기반 인그레스 컨트롤러다.
* [AppsCode Inc.](https://appscode.com) 는 가장 널리 사용되는 [HAProxy](http://www.haproxy.org/) 기반 인그레스 컨트롤러인 [Voyager](https://appscode.com/products/voyager)에 대한 지원 및 유지 보수를 제공한다. 
* [AWS ALB 인그레스 컨트롤러](https://github.com/kubernetes-sigs/aws-alb-ingress-controller)는 [AWS Application Load Balancer](https://aws.amazon.com/elasticloadbalancing/)를 사용하여 인그레스를 활성화한다.
* [Contour](https://projectcontour.io/)는 VMware에서 제공하고 지원하는 [Envoy](https://www.envoyproxy.io/) 기반 인그레스 컨트롤러다.
* Citrix는 [베어메탈](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment/baremetal)과 [클라우드](https://github.com/citrix/citrix-k8s-ingress-controller/tree/master/deployment) 배포를 위해 하드웨어 (MPX), 가상화 (VPX) 및 [무료 컨테이너화 (CPX) ADC](https://www.citrix.com/products/citrix-adc/cpx-express.html)를 위한 [인그레스 컨트롤러](https://github.com/citrix/citrix-k8s-ingress-controller)를 제공한다.
* F5 Networks는 [쿠버네티스를 위한 F5 BIG-IP 컨트롤러](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)에 대한 [지원과 유지 보수](https://support.f5.com/csp/article/K86859508)를 제공한다.
* [Gloo](https://gloo.solo.io)는 [solo.io](https://www.solo.io)의 엔터프라이즈 지원과 함께 API 게이트웨이 기능을 제공하는 [Envoy](https://www.envoyproxy.io) 기반의 오픈 소스 인그레스 컨트롤러다.
* [HAProxy 인그레스](https://haproxy-ingress.github.io)는 HAProxy를 위한 고도로 커스터마이징 가능한 커뮤니티 주도형 인그레스 컨트롤러다.
* [HAProxy Technologies](https://www.haproxy.com/)는 [쿠버네티스를 위한 HAProxy 인그레스 컨트롤러](https://github.com/haproxytech/kubernetes-ingress)를 지원하고 유지 보수한다. [공식 문서](https://www.haproxy.com/documentation/hapee/1-9r1/traffic-management/kubernetes-ingress-controller/)를 통해 확인할 수 있다.
* [Istio](https://istio.io/)는 인그레스 컨트롤러 기반으로 
     [인그레스 트래픽을 제어](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/)은 [쿠버네티스를 위한 Kong 인그레스 컨트롤러](https://github.com/Kong/kubernetes-ingress-controller)에 대한 [커뮤니티](https://discuss.konghq.com/c/kubernetes) 또는 [상업적](https://konghq.com/kong-enterprise/) 지원과 유지 보수를 제공한다.
* [NGINX, Inc.](https://www.nginx.com/) 는 [쿠버네티스를 위한 NGINX 인그레스 컨트롤러](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)에 대한 지원과 유지 보수를 제공한다.
* 쿠버네티스 인그레스와 같이 사용 사례를 포함하는 서비스 구성을 위한 [Skipper](https://opensource.zalando.com/skipper/kubernetes/ingress-controller/) HTTP 라우터와 리버스 프록시는 사용자 정의 프록시를 빌드하기 위한 라이브러리로 설계되었다.
* [Traefik](https://github.com/containous/traefik)은 완벽한 기능([암호화](https://letsencrypt.org), secrets, http2, 웹 소켓)을 갖춘 인그레스 컨트롤러로, [Containous](https://containo.us/services)에서 상업적인 지원을 제공한다.

## 여러 인그레스 컨트롤러 사용

하나의 클러스터 내에 [여러 개의 인그레스 컨트롤러](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers)를 배포할 수 있다. 인그레스를 생성할 때,  클러스터 내에 둘 이상의 인그레스 컨트롤러가 존재하는 경우 어떤 인그레스 컨트롤러를 사용해야하는지 표시해주는 적절한 [`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster) 어노테이션을 각각의 인그레스에 달아야 한다. 

만약 클래스를 정의하지 않으면, 클라우드 제공자는 기본 인그레스 컨트롤러를 사용할 수 있다.

이상적으로는 모든 인그레스 컨트롤러가 이 사양을 충족해야하지만, 다양한 인그레스 컨트롤러는 약간 다르게 작동한다.

{{< note >}}
인그레스 컨트롤러의 설명서를 검토하여 선택 시 주의 사항을 이해해야한다.
{{< /note >}}

{{% /capture %}}

{{% capture whatsnext %}}

* [인그레스](/docs/concepts/services-networking/ingress/)에 대해 자세히 알아보기.
* [NGINX 컨트롤러로 Minikube에서 Ingress를 설정하기](/docs/tasks/access-application-cluster/ingress-minikube).

{{% /capture %}}
