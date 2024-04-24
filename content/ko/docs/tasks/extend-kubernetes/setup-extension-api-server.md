---
title: 확장 API 서버 설정
# reviewers:
# - lavalamp
# - cheftako
# - chenopis
content_type: task
weight: 15
---

<!-- overview -->

애그리게이션 레이어(aggregation layer)와 작동하도록 확장 API 서버를 설정하면 쿠버네티스 API 서버를 쿠버네티스의 핵심 API의 일부가 아닌 추가 API로 확장할 수 있다.



## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [애그리게이션 레이어를 구성](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)하고 apiserver 플래그를 활성화해야 한다.



<!-- steps -->

## 애그리게이션 레이어와 작동하도록 확장 API 서버 설정하기

다음 단계는 확장 API 서버를 *높은 수준* 으로 설정하는 방법을 설명한다. 이 단계는 YAML 구성을 사용하거나 API를 사용하는 것에 상관없이 적용된다. 둘 사이의 차이점을 구체적으로 식별하려고 시도한다. YAML 구성을 사용하여 구현하는 방법에 대한 구체적인 예를 보려면, 쿠버네티스 리포지터리에서 [sample-apiserver](https://github.com/kubernetes/sample-apiserver/blob/master/README.md)를 참고할 수 있다.

또는, [apiserver-builder](https://github.com/kubernetes-sigs/apiserver-builder-alpha/blob/master/README.md)와 같은 기존의 타사 솔루션을 사용하여 스켈레톤(skeleton)을 생성하고 다음 단계를 모두 자동화해야 한다.

1. API서비스(APIService) API가 활성화되어 있는지 확인한다(`--runtime-config` 확인). 클러스터에서 일부러 해제하지 않았다면, 기본적으로 활성화되어 있어야 한다.
1. API서비스 오브젝트를 추가하거나 클러스터 관리자가 작성하도록 RBAC 규칙을 작성해야 할 수도 있다. (API 확장은 전체 클러스터에 영향을 주기 때문에, 운영 중인 클러스터에서 API 확장에 대한 테스트/개발/디버깅을 수행하지 않는 것이 좋다.)
1. 확장 API 서비스를 실행하려는 쿠버네티스 네임스페이스를 생성한다.
1. HTTPS를 위해 확장 API 서버가 사용하는 서버 인증서에 서명하는 데 사용할 CA 인증서를 생성하거나 가져온다.
1. HTTPS를 위해 API 서버가 사용할 서버 인증서/키를 생성한다. 이 인증서는 위의 CA 인증서에 의해 서명해야 한다. 또한 Kube DNS 이름의 CN이 있어야 한다. 이것은 쿠버네티스 서비스에서 파생되었으며 `<service name>.<service name namespace>.svc` 형식이다.
1. 네임스페이스에 서버 인증서/키를 사용하여 쿠버네티스 시크릿을 생성한다.
1. 확장 API 서버에 대한 쿠버네티스 디플로이먼트를 생성하고 시크릿을 볼륨으로 로드하는지 확인한다. 확장 API 서버의 작동하는(working) 이미지에 대한 참조를 포함해야 한다. 디플로이먼트는 네임스페이스에도 있어야 한다.
1. 확장 API 서버가 해당 볼륨에서 해당 인증서를 로드하고 HTTPS 핸드셰이크에 사용되는지 확인한다.
1. 네임스페이스에서 쿠버네티스 서비스 어카운트를 생성한다.
1. 리소스에 허용하려는 작업에 대한 쿠버네티스 클러스터 롤(role)을 생성한다.
1. 네임스페이스의 서비스 어카운트에서 방금 만든 클러스터 롤로 쿠버네티스 클러스터 롤 바인딩을 생성한다.
1. 네임스페이스의 서비스 어카운트에서 `system:auth-delegator` 클러스터 롤로 쿠버네티스 클러스터 롤 바인딩을 만들어 인증 결정을 쿠버네티스 핵심 API 서버에 위임한다.
1. 네임스페이스의 서비스 어카운트에서 `extension-apiserver-authentication-reader` 롤로 쿠버네티스 롤 바인딩을 생성한다. 이를 통해 확장 API 서버가 `extension-apiserver-authentication` 컨피그맵(configmap)에 접근할 수 있다.
1. 쿠버네티스 API 서비스를 생성한다. 위의 CA 인증서는 base64로 인코딩되어, 새로운 라인이 제거되고 API 서비스에서 spec.caBundle로 사용되어야 한다. 이것은 namespaced가 아니어야 한다. [kube-aggregator API](https://github.com/kubernetes/kube-aggregator/)를 사용하는 경우, base64 인코딩이 수행되므로 PEM 인코딩된 CA 번들만 통과한다.
1. kubectl을 사용하여 리소스를 얻는다. kubectl을 실행하면, "No resources found."가 반환된다. 이 메시지는
모든 것이 작동됐지만 현재 해당 리소스 유형의 오브젝트가 생성되지 않았음을 나타낸다.


## {{% heading "whatsnext" %}}


* [API 애그리게이션 레이어를 구성](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)하고 apiserver 플래그를 활성화하는 단계를 수행한다.
* 높은 수준의 개요에 대해서는, [애그리게이션 레이어로 쿠버네티스 API 확장하기](/ko/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)를 참고한다.
* [커스텀 리소스 데피니션을 사용하여 쿠버네티스 API 확장](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)하는 방법에 대해 알아본다.
