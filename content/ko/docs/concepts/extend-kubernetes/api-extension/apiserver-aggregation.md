---
title: 애그리게이션 레이어(aggregation layer)로 쿠버네티스 API 확장하기




content_type: concept
weight: 10
---

<!-- overview -->

애그리게이션 레이어는 코어 쿠버네티스 API가 제공하는 기능 이외에 더 많은 기능을 제공할 수 있도록 추가 API를 더해 쿠버네티스를 확장할 수 있게 해준다.
추가 API는 [서비스-카탈로그](/ko/docs/concepts/extend-kubernetes/service-catalog/)와 같이 미리 만들어진 솔루션이거나 사용자가 직접 개발한 API일 수 있다.

애그리게이션 레이어는 [사용자 정의 리소스](/ko/docs/concepts/extend-kubernetes/api-extension/custom-resources/)와는 다르며, 애그리게이션 레이어는 {{< glossary_tooltip term_id="kube-apiserver" text="kube-apiserver" >}} 가 새로운 종류의 오브젝트를 인식하도록 하는 방법이다.

<!-- body -->

## 애그리게이션 레이어

애그리게이션 레이어는 kube-apiserver 프로세스 안에서 구동된다. 확장 리소스가 등록되기 전까지, 애그리게이션 레이어는 아무 일도 하지 않는다. API를 등록하기 위해서, 사용자는 쿠버네티스 API 내에서 URL 경로를 "요구하는(claim)" APIService 오브젝트를 추가해야 한다. 이때, 애그리게이션 레이어는 해당 API 경로(예: /apis/myextensions.mycompany.io/v1/...)로 전송되는 모든 것을 등록된 APIService로 프록시하게 된다.

APIService를 구현하는 가장 일반적인 방법은 클러스터 내에 실행되고 있는 파드에서 *extension API server* 를 실행하는 것이다. extension API server를 사용해서 클러스터의 리소스를 관리하는 경우 extension API server("extension-apiserver" 라고도 한다)는 일반적으로 하나 이상의 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}와 쌍을 이룬다. apiserver-builder 라이브러리는 extension API server와 연관된 컨틀로러에 대한 스켈레톤을 제공한다.

### 응답 레이턴시

Extension-apiserver는 kube-apiserver로 오가는 연결의 레이턴시가 낮아야 한다.
kube-apiserver로 부터의 디스커버리 요청은 왕복 레이턴시가 5초 이내여야 한다.

extention API server가 레이턴시 요구 사항을 달성할 수 없는 경우 이를 충족할 수 있도록 변경하는 것을 고려한다.

## {{% heading "whatsnext" %}}

* 사용자의 환경에서 Aggregator를 동작시키려면, [애그리게이션 레이어를 설정한다](/docs/tasks/extend-kubernetes/configure-aggregation-layer/).
* 다음에, [확장 API 서버를 구성해서](/ko/docs/tasks/extend-kubernetes/setup-extension-api-server/) 애그리게이션 레이어와 연계한다.
* 또한, 어떻게 [쿠버네티스 API를 커스텀 리소스 데피니션으로 확장하는지](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/)를 배워본다.
* [API 서비스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#apiservice-v1-apiregistration-k8s-io)의 사양을 읽어본다.
