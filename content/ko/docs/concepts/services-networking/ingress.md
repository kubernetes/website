- - - -
reviewers:
* bprashanth
title: Ingress
content_template: templates/concept
weight: 40
- - - -

{{% capture overview %}}
{{< glossary_definition term_id="ingress" length="all" >}}
{{% /capture %}}

{{% capture body %}}

## 용어
이 가이드에서 사용되는 용어들은 다음과 같은 뜻으로 이용된다:

* 노드: 쿠버네티스 클러스터 내에 있는 하나의 가상/물리 서버
* 클러스터: 쿠버네티스의 컴퓨팅 자원을 제공하는 노드들의 집합. 외부망으로부터는 접근할 수 없다(firewalls).
* 엣지 라우터 : 클러스터에 방화벽 정책을 적용해주는 라우터. 클라우드 프로바이더가 제공하는 게이트웨이, 물리 장비 등이 이 역할을 수행할 수 있다.
* 클러스터 네트워크: 논리/물리 링크의 집합으로, [쿠버네티스 네트워킹 모델](/docs/concepts/cluster-administration/networking/)에 따라 클러스터 내부 커뮤니케이션을 가능하게 한다.
* 서비스: 라벨 셀렉터를 사용하는 파드의 집합을 나타내는 쿠버네티스 [서비스](/docs/concepts/services-networking/service/). 별도로 표기되지 않는 이상, 서비스는 클러스터 내부에서만 라우팅되는 가상 IP를 갖는다고 간주됨.

## 인그레스란?

쿠버네티스 1.1버전에서 추가된 인그레스는, 클러스터 외부에서 클러스터 내부 {{< link text=“서비스” url="/docs/concepts/services-networking/service/" >}}로 통신할 수 있도록 HTTP, HTTPS 라우팅을 외부에 노출시키는 역할을 한다. 트래픽 라우팅은 인그레스에 정의된 정책에 따라 컨트롤된다.


```none
     인터넷
       |
   [ 인그레스 ]
  --|-----|--
    [ 서비스 ]
```

외부에서 접근 가능한 URL을 서비스에 붙이거나, 트래픽 로드 밸런싱, SSL 차단, 주소 기반의 가상 호스팅을 제공하기 위한 목적으로 인그레스가 사용될 수 있다. [인그레스 컨트롤러](#ingress-controllers) 는 인그레스의 기능—주로 로드밸런서 기능—을 담당한다. 하지만 인그레스 컨트롤러를 사용하지 않고 엣지 라우터나 별도 프론트엔드 컴포넌트로 트래픽을 처리할 수도 있기는 하다.

인그레스는 임의의 포트나 프로토콜을 외부에 노출하지 않는다. HTTP나 HTTPS를 제외한 다른 유형의 프로토콜로 서비스를 인터넷에 노출하는 경우에는 주로  [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) 나
[Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) 서비스 타입을 이용한다.

## 선결요건
{{< feature-state for_k8s_version="v1.1" state="beta" >}}

인그레스를 사용하기 전에 몇 가지 알아두어야 할 게 있는데, 인그레스는 지금 베타 단계다. 
{{< 참고 >}}
참고: 인그레스를 사용하기 위해서는 인그레스 컨트롤러가 필요하다. 인그레스만 생성하는 것으로는 기능을 할 수 없다.
{{< /참고 >}}


GCE/Google Kubernetes Engine 는 [인그레스 컨트롤러](#ingress-controllers) 를 마스터에 구현하고 있다. GCE/GKE.의 컨트롤러가 갖는 한계는 다음 문서에서 확인할 수 있다:
[베타 버전의 한계](https://github.com/kubernetes/ingress-gce/blob/master/BETA_LIMITATIONS.md#glbc-beta-limitations)

GCE/GKE 외의 환경에서는 [인그레스 컨트롤러 도입](https://kubernetes.github.io/ingress-nginx/deploy/)이 필요하다. 선택할 수 있는
[인그레스 컨트롤러](#ingress-controllers)가 많으니 필요에 따라 선택한다.
{{< 참고 >}}
참고: 선택하고자 하는 인그레스 컨트롤러의 속성을 파악하기 위해서는 각각의 공식 문서를 리뷰하는 것이 좋다.
{{< /참고 >}}

## 인그레스 컨트롤러
인그레스 리소스가 작동하기 위해서는, 클러스터 내에서 인그레스 컨트롤러가 실행 중이어야 한다. `kube-controller-manager` 바이너리의 일부로 클러스터가 실행될 때 자동으로 함께 실행되는 다른 컨트롤러와 다르기 때문에 주의가 필요하다. 클러스터 성격에 가장 잘 맞는 인그레스 컨트롤러 구현체를 선택해야 한다.

* 쿠버네티스 프로젝트는 현재 공식적으로  [GCE](https://git.k8s.io/ingress-gce/README.md) 와
[nginx](https://git.k8s.io/ingress-nginx/README.md) 컨트롤러를 지원, 관리한다.

이외에도 다음과 같이 다양한 종류의 컨트롤러가 있다:

* [Contour](https://github.com/heptio/contour) 는 [Envoy](https://www.envoyproxy.io) 기반의 인그레스 컨트롤러로, Heptio가 제공한다.
* F5 Networks 는 [F5 BIG-IP Controller for Kubernetes](http://clouddocs.f5.com/products/connectors/k8s-bigip-ctlr/latest)에 대한 [기술 지원과 유지보수](https://support.f5.com/csp/article/K86859508)를 제공한다.
* [HAProxy](http://www.haproxy.org/) 기반의 컨트롤러인 
[jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) 은 다음 블로그 포스트에서 설명을 찾아볼 수 있다:
[HAProxy Ingress Controller for Kubernetes](https://www.haproxy.com/blog/haproxy_ingress_controller_for_kubernetes/).
[HAProxy Technologies](https://www.haproxy.com/) 가 HAProxy Enterprise 와 [jcmoraisjr/haproxy-ingress](https://github.com/jcmoraisjr/haproxy-ingress) 인그레스 컨트롤러에 대해 기술지원과 유지보수를 제공한다.
* [Istio](https://istio.io/) 기반의 인그레스 컨트롤러 [Control Ingress Traffic](https://istio.io/docs/tasks/traffic-management/ingress/).
* [Kong](https://konghq.com/) 는 에 대한 [Kong Ingress Controllerfor Kubernetes](https://konghq.com/blog/kubernetes-ingress-controller-for-kong/) [community](https://discuss.konghq.com/c/kubernetes) 버전과 [commercial](https://konghq.com/api-customer-success/)버전을 지원하고 유지보수 서비스를 제공한다.
* [NGINX, Inc.](https://www.nginx.com/) 는 [NGINX Ingress Controller for Kubernetes](https://www.nginx.com/products/nginx/kubernetes-ingress-controller)에 대해 기술지원과 유지보수를 제공한다.
* [Traefik](https://github.com/containous/traefik) 는 [Let's Encrypt](https://letsencrypt.org), secrets, http2, 웹 소켓 기능을 제공하는 인그레스 컨트롤러로, [Containous](https://containo.us/services)의 유상 지원을 받을 수 있다.

한 클러스터 내에 [다양한 종류의 인그레스 컨트롤러](https://git.k8s.io/ingress-nginx/docs/user-guide/multiple-ingress.md#multiple-ingress-controllers) 를 도입할 수 있다. 여러 인그레스 컨트롤러가 한 클러스터 내에 존재하는 경우, 인그레스를 생성할 때 각각의 인그레스에 적절한 [`ingress.class`](https://git.k8s.io/ingress-gce/docs/faq/README.md#how-do-i-run-multiple-ingress-controllers-in-the-same-cluster)로 어노테이션 값을 넣어서 어떤 인그레스 컨트롤러가 이용되어야 하는지 정의해줘야 한다. 클래스를 정의해주지 않으면 클라우드 프로바이더가 임의로 기본 인그레스 프로바이더를 사용할 수 있다.


### 들어가기 전에
이상적으로는 모든 인그레스 컨트롤러가 아래 스펙을 따라야 하지만, 인그레스 컨트롤러 종류에 따라 약간 다를 수 있다.

{{< 참고 >}}
참고: 선택하고자 하는 인그레스 컨트롤러의 속성을 파악하기 위해서는 각각의 공식 문서를 리뷰하는 것이 좋다.
{{< /참고 >}}

## 인그레스 리소스
최소한의 정보를 담은 인그레스 리소스 예시:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: test-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - http:
      paths:
      - path: /testpath
        backend:
          serviceName: test
          servicePort: 80
```


다른 쿠버네티스 리소스 같이, 인그레스에도 역시 `apiVersion`, `kind`, `metadta` 필드가 들어가야 한다.  구성 파일에 대한 일반적인 이해가 필요하다면 [deploying applications](/docs/tasks/run-application/run-stateless-application-deployment/), [configuring containers](/docs/tasks/configure-pod-container/configure-pod-configmap/), [managing resources](/docs/concepts/cluster-administration/manage-deployment/) 이 링크들을 이용한다. 인그레스는 인그레스 컨트롤러에 따른 옵션을 설정하기 위해 어노테이션을 사용한다. [rewrite-target annotation](https://github.com/kubernetes/ingress-nginx/blob/master/docs/examples/rewrite/README.md)에서 예시를 찾아볼 수 있다. [인그레스 컨트롤러](#ingress-controllers)  종류에 따라 다른 종류의 어노테이션을 사용한다. 선택한 인그레스 컨트롤러에 대한 문서를 참고하여 어떤 어노테이션이 지원되는지 확인해야 한다. 


인그레스 [스펙](https://git.k8s.io/community/contributors/devel/api-conventions.md#spec-and-status)은 로드밸런서나 프록시 서버를 구성하는 데에 필요한 모든 정보를 담고 있다. 더 중요하게는, 인그레스가 수용할 모든 요청에 대한 규칙 리스트를 갖고 있어야 한다. 인그레스 리소스는 HTTP 트래픽을 다이렉팅하는 규칙 만을 지원한다. 

### 인그레스 규칙
각각의 HTTP 규칙은 다음과 같은 정보를 포함하고 있어야 한다:

* 호스트 정보 (선택적). 위 예시처럼 호스트를 정의하지 않으면, 호스트에 관계 없이 해당 IP 주소를 통해 들어오는 모든 인바운드 HTTP 트래픽에 대해 규칙이 적용됨. 호스트 정보(예, foo.bar.com)가 제공되면 해당 호스트 기준으로 정책이 적용된다.
* `serviceName`과 `servicePort`로 매핑된 백엔드가 있는 경로(예, /testpath)의 리스트. 호스트와 경로가 요청의 내용과 일치해야 로드밸런서가 해당 서비스로 트래픽을 전달할 수 있다.
* [서비스 문서](/docs/concepts/services-networking/service/)에서 정의된 것처럼, 백엔드는 서비스와 포트 이름의 조합을 의미한다. 인그레스로 들어오는 HTTP, HTTPS 요청은, 이와 매칭되는 호스트, 패스 매칭 규칙에 따라 정의된 백엔드로 전달된다.

스펙에서 정의된 어느 패스에도 매칭되지 않는 요청을 처리하기 위해 인그레스 컨트롤러에 기본 백엔드가 컨트롤러에 설정되기도 한다.

### 기본 백엔드
규칙이 없는 인그레스는 모든 트래픽을 하나의 기본 백엔드로 보낸다. 기본 백엔드는 [인그레스 컨트롤러](#ingress-controllers)의 설정 옵션을 통해 정의되고, 인그레스 리소스에 들어가지는 않는다.

인그레스 오브젝트 내의 HTTP 요청에 매칭되는 호스트나 패스가 전혀 없는 경우, 해당 트래픽은 기본 백엔드로 전달된다.

## 인그레스 유형

### 싱글 서비스 인그레스
기존 쿠버네티스 개념에도 하나의 서비스를 외부로 노출할 수는 있었다 ([대안](#alternatives) 참고). 인그레스를 통해서도, 규칙을 정의하지 않고 기본 백엔드 만을 특정하여 이렇게 하나의 서비스만 외부에 노출할 수 있다.

{{< codenew file="service/networking/ingress.yaml" >}}

이 파일을  `kubectl create -f` 로 실행시키면 다음과 같은 결과를 확인할 수 있다:

```shell
kubectl get ingress test-ingress
```

```shell
NAME           HOSTS     ADDRESS           PORTS     AGE
test-ingress   *         107.178.254.228   80        59s
```

`107.178.254.228`는 위에서 정의한 인그레스를 구현하기 위한 인그레스 컨트롤러가 할당한 IP이다.

{{< 참고 >}}
인그레스 컨트롤러와 로드 밸런서가 IP 주소를 할당하는 데에 1-2분 정도의 시간이 소요될 수 있다. 할당 중에는 주소 영역에 `<pending>`이라고 표기된다.
{{< /참고 >}}

### 단순 팬아웃
팬아웃 설정은 한 IP 주소로 들어오는 트래픽들을, 요청된 HTTP URI에 따라 하나 이상의 서비스로 라우팅해준다. 이런 기능 등을 통해 인그레스는 로드밸런서를 최소한만 유지할 수 있도록 해준다. 예를 들어 다음과 같이 설정할 수 있다:

```shell
foo.bar.com -> 178.91.123.132 -> / foo    service1:4200
                                 / bar    service2:8080
```

이런 설정은 다음과 같은 인그레스를 필요로 한다:

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: simple-fanout-example
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - path: /foo
        backend:
          serviceName: service1
          servicePort: 4200
      - path: /bar
        backend:
          serviceName: service2
          servicePort: 8080
```

 `kubectl create -f`로 인그레스를 생성하면 아래와 같은 결과를 볼 수 있다.

```shell
kubectl describe ingress simple-fanout-example
```

```shell
Name:             simple-fanout-example
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   service1:4200 (10.8.0.90:4200)
               /bar   service2:8080 (10.8.0.91:8080)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     22s                loadbalancer-controller  default/test
```

`s1`, `s2` 서비스가 존재하는 이상, 이 인그레스 컨트롤러는 인그레스의 정책을 만족시키는 로드밸런서 역할을 수행한다. 이 과정이 완료되면 `Address` 영역에 로드밸런서의 주소가 뜬다.

{{< 참고 >}}
사용 중인 [인그레스 컨트롤러](#ingress-controllers)에 따라 기본 HTTP 백엔드 [서비스](/docs/concepts/services-networking/service/)를 생성해야 할 수도 있다.
{{< /참고 >}}

### 주소 기반 가상 호스팅
주소 기반 가상 호스팅은 HTTP 트래픽을, 한 IP를 공유하는 여러 호스트에 전달할 수 있게 해준다.

```none
foo.bar.com --|                 |-> foo.bar.com s1:80
              | 178.91.123.132  |
bar.foo.com --|                 |-> bar.foo.com s2:80
```


다음 인그레스는 [Host header](https://tools.ietf.org/html/rfc7230#section-5.4)에 따라 요청을 라우팅하도록 로드밸런서를 설정한다.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: bar.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
```

인그레스 리소스 내에서 어떤 호스트에 대한 규칙도 정의하지 않는 경우, 해당 인그레스 컨트롤러의 IP로 들어오는 웹 트래픽은 요청의 주소 기반으로 라우팅된다. 예를 들어, 아래의 인그레스 리소스는  `first.bar.com` 는  `service1`로, `second.foo.com` 는 `service2`로 라우팅한다. 호스트네임 없이 IP 주소로 요청이 들어오는 경우에는, 모든 트래픽을 `service3`으로 라우팅한다.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: name-virtual-host-ingress
spec:
  rules:
  - host: first.bar.com
    http:
      paths:
      - backend:
          serviceName: service1
          servicePort: 80
  - host: second.foo.com
    http:
      paths:
      - backend:
          serviceName: service2
          servicePort: 80
  - http:
      paths:
      - backend:
          serviceName: service3
          servicePort: 80
```

### TLS
[시크릿](/docs/concepts/configuration/secret) 기능을 통해 인그레스의 보안을 강화할 수 있다. 시크릿에는 TLS 비공개키와 인증서가 들어있다. 현재 인그레스는 하나의 TLS 포트(443) 만을 지원한다. TLS 종료기능도 지원한다. TLS 설정 섹션이 여러 개의 호스트를 가리킨다면, SNI 기능을 제공하는 인그레스 컨트롤러의 SNI TLS 익스텐션(extension) 을 통해 한 포트에서 호스트네임 별로 다중 송신된다. TLS secret은 인증서와 비공개키를 `tls.crt` 와  `tls.key` 필드로 반드시 갖고 있어야 한다.
```yaml
apiVersion: v1
data:
  tls.crt: base64 encoded cert
  tls.key: base64 encoded key
kind: Secret
metadata:
  name: testsecret-tls
  namespace: default
type: Opaque
```


아래 secret은, 인그레스 컨트롤러가 TLS를 이용해 클라이언트에서 로드밸런서로 가는 채널을 보호하게 한다. 아래의 경우  `sslexample.foo.com` 의 CN을 포함하는 인증서에서 TLS secret이 생성되어야만 정상 통신이 가능하다.

```yaml
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: tls-example-ingress
spec:
  tls:
  - hosts:
    - sslexample.foo.com
    secretName: testsecret-tls
  rules:
    - host: sslexample.foo.com
      http:
        paths:
        - path: /
          backend:
            serviceName: service1
            servicePort: 80
```

{{< 참고 >}}
인그레스 컨트롤러 종류에 따라 지원하는 TLS 기능에 차이가 있으니 다음 문서를 참고해서 TLS가 어떻게 작동하는지 확인한 후 이용해야 한다: [nginx](https://git.k8s.io/ingress-nginx/README.md#https),[GCE](https://git.k8s.io/ingress-gce/README.md#frontend-https), 이외 인그레스 컨트롤러의 공식 문서.
{{< /참고 >}}

### 로드밸런싱
인그레스 컨트롤러는 로드밸런싱 알고리즘, 백엔드 가중치 스키마 등, 모든 인그레스에 적용되는 로드밸런싱 정책을 기반으로 생성된다. 세션 지속(persistent session), 동적 가중치(dynamic weight) 등 고급 로드밸런싱 개념은 아직 인그레스에서 사용할 수 없다. 이런 기능을 사용하기 위해서는 [서비스 로드밸런서](https://github.com/kubernetes/ingress-nginx)를 사용해야 한다. 인그레스가 헬스체크를 직접적으로 노출시키지는 못하지만, 같은 역할을 하는 [readiness probes](/docs/tasks/configure-pod-container/configure-liveness-readiness-probes/)이라는 쿠버네티스 개념이 있음을 알아두면 좋다. 헬스 체크 처리 방식에 대한 상세 내용은 각 컨트롤러의 문서에서 확인한다 ([nginx](https://git.k8s.io/ingress-nginx/README.md),[GCE](https://git.k8s.io/ingress-gce/README.md#health-checks)).

## 인그레스 업데이트
이미 존재하는 인그레스에 새로운 호스트를 추가하기 위해서는 리소스를 직접 업데이트해야 한다.

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     35s                loadbalancer-controller  default/test
```

```shell
kubectl edit ingress test
```

이 명령어를 치면 이미 존재하는 yaml 파일을 수정하기 위한 에디터가 뜬다. 새 호스트를 포함하도록 수정한다:

```yaml
spec:
  rules:
  - host: foo.bar.com
    http:
      paths:
      - backend:
          serviceName: s1
          servicePort: 80
        path: /foo
  - host: bar.baz.com
    http:
      paths:
      - backend:
          serviceName: s2
          servicePort: 80
        path: /foo
..
```

yaml 파일을 저장하면 API 서버의 리소스를 업데이트하게 되고, 이를 통해 인그레스 컨트롤러가 로드밸런서의 설정을 업데이트한다. 

```shell
kubectl describe ingress test
```

```shell
Name:             test
Namespace:        default
Address:          178.91.123.132
Default backend:  default-http-backend:80 (10.8.2.3:8080)
Rules:
  Host         Path  Backends
  ----         ----  --------
  foo.bar.com
               /foo   s1:80 (10.8.0.90:80)
  bar.baz.com
               /foo   s2:80 (10.8.0.91:80)
Annotations:
  nginx.ingress.kubernetes.io/rewrite-target:  /
Events:
  Type     Reason  Age                From                     Message
  ----     ------  ----               ----                     -------
  Normal   ADD     45s                loadbalancer-controller  default/test
```

 `kubectl replace -f`로 수정된 yaml 파일을 반영해도 같은 결과를 얻을 수 있다.

## 가용성 영역 간 Failover
Techniques for spreading traffic across failure domains differs between cloud providers.
각 클라우드 프로바이더는 쿠버네티스 매니지드 서비스를 제공할 때, 가용성 영역의 장애에 대비해 트래픽을 분산시키는 기술을 갖고 있다. 자세한 내용은 관련 [ingress controller](#ingress-controllers) 문서를 참고한다. 여러 클러스터가 합쳐진 환경에서 인그레스를 도입할 때 참고해야 하는 내용은 다음 링크에서 찾아볼 수 있다: [federation documentation](/docs/concepts/cluster-administration/federation/)

## Future Work
인그레스와 관련 리소스의 발전 과정을 지속적으로 따라잡고 싶다면 [SIG Network](https://github.com/kubernetes/community/tree/master/sig-network) 트래킹하는 것이 좋다. 다양한 인그레스 컨트롤러에 대한 상세한 내용은 [ingress repository](https://github.com/kubernetes/ingress/tree/master) 를 지속적으로 찾아볼 것을 권고한다.


## 대안
인그레스 리소스를 통하지 않고 바로 서비스를 인터넷에 노출시킬 수도 있는데, 여기에는 다음과 같은 방법을 사용할 수 있다:

* [Service.Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer) 사용
* [Service.Type=NodePort](/docs/concepts/services-networking/service/#nodeport) 사용
* [Port Proxy](https://git.k8s.io/contrib/for-demos/proxy-to-service) 사용

{{% /capture %}}

{{% capture whatsnext %}}

{{% /capture %}}
