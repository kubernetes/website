---
title: 노드 선언형 기능
weight: 160
---

{{< feature-state feature_gate_name="NodeDeclaredFeatures" >}}

쿠버네티스 노드는 새로운 기능이나 기능 게이트가 적용된 
특정 기능의 가용성을 보고하기 위해 _선언형 기능(declared features)_ 을 사용한다. 컨트롤 플레인의 요소는 
이 정보를 활용해서 더 나은 결정을 내린다. kube-scheduler는 
`NodeDeclaredFeatures` 플러그인을 통해 파드가 요구하는 기능을 
명시적으로 지원하는 노드에만 배치되도록 보장한다. 또한, 
`NodeDeclaredFeatureValidator` 승인 컨트롤러는 노드의 선언형 기능에 대해 
파드 업데이트를 검증한다.

이 메커니즘은 버전 불일치를 관리하고 클러스터 안정성을 향상시키는 데 도움이 된다. 
특히 클러스터 업그레이드나 모든 노드가 동일한 기능을 활성화되지 않은 혼합 버전 환경에서
유용하다. 이 기능은 새로운 노드 수준의 기능을 
도입하는 쿠버네티스 기능 개발자를 위해 고안되었으며, 백그라운드에서 
작동한다. 파드를 배포하는 애플리케이션 개발자는 이 프레임워크와 
직접 상호작용할 필요가 없다.

## 작동 방식

1.  **Kubelet 기능 보고:** 시작시 각 노드의 kubelet은 현재 활성화된
관리 쿠버네티스 기능을 감지하고 
    노드의 `.status.declaredFeatures` 필드에 보고한다. 
    활발히 개발 중인 기능만 이 필드에 포함된다.
2.  **스케줄러 필터링:** 기본 kube-scheduler는
    `NodeDeclaredFeatures` 플러그인을 사용한다. 이 플러그인은
    * `PreFilter` 단계에서 `PodSpec`을 확인하여 파드가
      필요로 하는 노드의 기능 집합을 추론한다.
    * `Filter` 단계에서 노드의
      `.status.declaredFeatures`에 나열된 기능이 파드에 대해 추론된 요구사항을 충족하는지 확인한다. 
      파드는 필요한 기능이 없는 노드에 스케줄링되지 않는다.
    사용자 정의 스케줄러도 `.status.declaredFeatures` 필드를 활용하여 
    유사한 제약 조건을 강제할 수 있다.
3.  **승인 제어:** `nodedeclaredfeaturevalidator` 승인 컨트롤러는 
    바인딩된 노드가 선언하지 않은 기능을 요구하는 파드를 거부할 수 있으며, 이를 통해 
    파드 업데이트 중 발생하는 문제를 방지한다.

## 노드 선언형 기능 활성화

노드 선언형 기능을 사용하려면 
`kube-apiserver`, `kube-scheduler`, 그리고 `kubelet`의 구성 요소에서 `NodeDeclaredFeatures`
[기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/#NodeDeclaredFeatures)를 
활성화해야 한다.

## {{% heading "whatsnext" %}}

* 더 자세한 내용은 KEP를 참조하여 읽어본다.
    [KEP-5328: 노드 선언형 기능](https://github.com/kubernetes/enhancements/blob/6d3210f7dd5d547c8f7f6a33af6a09eb45193cd7/keps/sig-node/5328-node-declared-features/README.md)
* [`NodeDeclaredFeatureValidator` 승인 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#nodedeclaredfeaturevalidator)에 대하여 읽어본다.