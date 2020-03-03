---
title: 애그리게이션 레이어(aggregation layer)로 쿠버네티스 API 확장하기
content_template: templates/concept
weight: 10
---

{{% capture overview %}}

애그리게이션 레이어는 코어 쿠버네티스 API가 제공하는 기능 이외에 더 많은 기능을 제공할 수 있도록 추가 API를 더해 쿠버네티스를 확장할 수 있게 해준다.

{{% /capture %}}

{{% capture body %}}

## 개요

애그리게이션 레이어는 부가적인 쿠버네티스-스타일 API를 클러스터에 설치할 수 있게 해준다. 이는 [서비스-카탈로그](https://github.com/kubernetes-incubator/service-catalog/blob/master/README.md)와 같이 사전에 구축되어 있는 서드 파티 솔루션일 수 있고, [apiserver-builder](https://github.com/kubernetes-incubator/apiserver-builder/blob/master/README.md)로 시작해볼 수 있는 것과 같은 사용자 정의 API일 수도 있다.

애그리게이션 레이어는 kube-apiserver 프로세스 안에서 구동된다. 확장 리소스가 등록되기 전까지, 애그리게이션 레이어는 아무 일도 하지 않는다. API를 등록하기 위해서, 사용자는 쿠버네티스 API 내에서 URL 경로를 "요구하는(claim)" APIService 오브젝트를 추가해야 한다. 이때, 애그리게이션 레이어는 해당 API 경로(예: /apis/myextensions.mycompany.io/v1/...)로 전송되는 모든 것을 등록된 APIService로 프록시하게 된다.

대개, APIService는 클러스터 내에서 구동 중인 파드(pod) 내 *extension-apiserver* 로 구현된다. 이 extension-apiserver는 일반적으로 추가된 리소스에 대한 적극적인 관리가 필요한 경우 하나 이상의 컨트롤러와 짝지어진다. 결과적으로, apiserver-builder는 실제로 그 둘 모두에 대한 스켈레톤을 제공한다. 또 다른 예로, 서비스-카탈로그가 설치된 경우에는, 제공하는 서비스에 대한 extension-apiserver와 컨트롤러를 모두 제공한다.

Extension-apiserver는 kube-apiserver로 오가는 연결의 레이턴시가 낮아야 한다.
특히, kube-apiserver로 부터의 디스커버리 요청은 왕복 레이턴시가 5초 이내여야 한다.
사용자의 환경에서 달성할 수 없는 경우에는, 이를 어떻게 바꿀 수 있을지 고려해야 한다. 지금은,
`EnableAggregatedDiscoveryTimeout=false` 기능 게이트를 설정해서 타임아웃 제한을
비활성화 할 수 있다. 이 기능은 미래의 릴리스에서는 삭제될 예정이다.

{{% /capture %}}

{{% capture whatsnext %}}

* 사용자의 환경에서 Aggregator를 동작시키려면, [애그리게이션 레이어를 설정한다](/docs/tasks/access-kubernetes-api/configure-aggregation-layer/).
* 다음에, [extension api-server를 구성해서](/docs/tasks/access-kubernetes-api/setup-extension-api-server/) 애그리게이션 레이어와 연계한다.
* 또한, 어떻게 [쿠버네티스 API를 커스텀 리소스 데피니션으로 확장하는지](/docs/tasks/access-kubernetes-api/extend-api-custom-resource-definitions/)를 배워본다.

{{% /capture %}}

