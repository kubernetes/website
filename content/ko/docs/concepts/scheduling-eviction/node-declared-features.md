---
title: Node Declared Features
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

이 메커니즘은 버전 불일치를 관리하고 클러스터 안정성을 향상시키는 데 도움을 줍니다. 특히 클러스터 업그레이드 중이거나 서로 다른 버전이 혼합된 환경에서 노드마다 동일한 기능이 활성화되어 있지 않을 수 있는 경우에 유용합니다. 이는 Kubernetes의 새로운 노드 수준 기능을 도입하는 기능 개발자를 위한 것이며 백그라운드에서 동작합니다. 파드를 배포하는 애플리케이션 개발자는 이 프레임워크와 직접 상호작용할 필요가 없습니다.

## 동작 방식

Kubelet 기능 보고: 시작 시 각 노드의 kubelet은 현재 활성화된 Kubernetes 관리 기능을 감지하고 이를 Node의 `.status.declaredFeatures` 필드에 보고합니다. 이 필드에는 활발히 개발 중인 기능만 포함됩니다.

스케줄러 필터링: 기본 kube-scheduler는 NodeDeclaredFeatures 플러그인을 사용합니다. 이 플러그인은:
PreFilter 단계에서 PodSpec을 확인하여 해당 파드에 필요한 노드 기능 집합을 추론합니다.
Filter 단계에서 노드의 `.status.declaredFeatures`에 나열된 기능이 파드에 대해 추론된 요구 사항을 충족하는지 확인합니다. 필요한 기능이 없는 노드에는 파드가 스케줄되지 않습니다. 사용자 정의 스케줄러도 `.status.declaredFeatures` 필드를 사용하여 유사한 제약을 적용할 수 있습니다.

어드미션 제어: nodedeclaredfeaturevalidator 어드미션 컨트롤러는 파드가 바인딩된 노드가 선언하지 않은 기능을 파드가 요구하는 경우 해당 파드를 거부할 수 있으며 파드 업데이트 중 발생할 수 있는 문제를 방지합니다.

## Enabling node declared features

Node Declared Features를 사용하려면 kube-apiserver, kube-scheduler, kubelet 컴포넌트에서 [NodeDeclaredFeatures 기능 게이트](https://kubernetes.io/docs/reference/command-line-tools-reference/feature-gates/)를 활성화해야 합니다.

{{% heading "whatsnext" %}}
자세한 내용은 KEP를 참고하세요: [KEP-5328: Node Declared Features](https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/5328-node-declared-features)
[NodeDeclaredFeatureValidator 어드미션 컨트롤러](../node-declared-feature-validator/)에 대해 알아보세요.
