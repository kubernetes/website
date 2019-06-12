---
title: 런타임 클래스
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

이 페이지는 런타임 클래스 리소스와 런타임 선택 메커니즘에 대해서 설명한다.

{{% /capture %}}


{{% capture body %}}

## 런타임 클래스

런타임 클래스는 파드의 컨테이너를 실행하는데 사용할 컨테이너 런타임 설정을 선택하기 위한 
알파 특징이다.

### 셋업

초기 알파 특징이므로, 런타임 클래스 특징을 사용하기 위해서는 몇 가지 추가 셋업 
단계가 필요하다.

1. 런타임 클래스 특징 게이트 활성화(apiservers 및 kubelets에 대해서, 버전 1.12+ 필요)
2. 런타임 클래스 CRD 설치
3. CRI 구현(implementation)을 노드에 설정(런타임에 따라서)
4. 상응하는 런타임 클래스 리소스 생성

#### 1. 런타임 클래스 특징 게이트 활성화

특징 게이트 활성화에 대한 설명은 [특징 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
참고한다. `RuntimeClass` 특징 게이트는 apiservers _및_ kubelets에서 활성화되어야 
한다.

#### 2. 런타임 클래스 CRD 설치

런타임 클래스 [CustomResourceDefinition][] (CRD)는 쿠버네티스 git 저장소의 애드온 디렉터리에서 찾을 수 
있다. [kubernetes/cluster/addons/runtimeclass/runtimeclass_crd.yaml][runtimeclass_crd]

`kubectl apply -f runtimeclass_crd.yaml`을 통해서 해당 CRD를 설치한다.

[CustomResourceDefinition]: /docs/tasks/access-kubernetes-api/custom-resources/custom-resource-definitions/
[runtimeclass_crd]: https://github.com/kubernetes/kubernetes/tree/master/cluster/addons/runtimeclass/runtimeclass_crd.yaml


#### 3. CRI 구현을 노드에 설정

런타임 클래스와 함께 선택할 설정은 CRI 구현에 의존적이다. 사용자의 CRI 
구현에 따른 설정 방법은 연관된 문서를 통해서 확인한다. 이것은 알파 
특징이므로, 아직 모든 CRI가 다중 런타임 클래스를 지원하지는 않는다.

{{< note >}}
런타임 클래스는 클러스터 전체에 걸쳐 동질의 노드 설정
(모든 노드가 컨테이너 런타임에 준하는 동일한 방식으로 설정되었음을 의미)을 가정한다. 어떠한 이질성(다양한 
설정)이라도 
스케줄링 특징을 통해서 런타임 클래스와는 독립적으로 관리되어야 한다([파드를 노드에 
할당하기](/docs/concepts/configuration/assign-pod-node/) 참고).
{{< /note >}}

해당 설정은 상응하는 `RuntimeHandler` 이름을 가지며, 이는 런타임 클래스에 의해서 참조된다.
런타임 핸들러는 유효한 DNS 1123 서브도메인(알파-숫자 + `-`와 `.`문자)을 가져야 한다.

#### 4. 상응하는 런타임 클래스 리소스 생성

3단계에서 셋업 한 설정은 연관된 `RuntimeHandler` 이름을 가져야 하며, 이를 통해서 
설정을 식별할 수 있다. 각 런타임 핸들러(그리고 선택적으로 비어있는 `""` 핸들러)에 대해서, 
상응하는 런타임 클래스 오브젝트를 생성한다.

현재 런타임 클래스 리소스는 런타임 클래스 이름(`metadata.name`)과 런타임 핸들러
(`spec.runtimeHandler`)로 단 2개의 중요 필드만 가지고 있다. 오브젝트 정의는 다음과 같은 형태이다.

```yaml
apiVersion: node.k8s.io/v1alpha1  # 런타임 클래스는 node.k8s.io API 그룹에 정의되어 있음
kind: RuntimeClass
metadata:
  name: myclass  # 런타임 클래스는 해당 이름을 통해서 참조됨
  # 런타임 클래스는 네임스페이스가 없는 리소스임
spec:
  runtimeHandler: myconfiguration  # 상응하는 CRI 설정의 이름임
```


{{< note >}}
런타임 클래스 쓰기 작업(create/update/patch/delete)은
클러스터 관리자로 제한할 것을 권장한다. 이것은 일반적으로 기본 설정이다. 더 자세한 정보는 [권한 
개요](/docs/reference/access-authn-authz/authorization/)를 참고한다.
{{< /note >}}

### 사용

클러스터를 위해서 런타임 클래스를 설정하고 나면, 그것을 사용하는 것은 매우 간단하다. 파드 스펙에 
`runtimeClassName`를 명시한다. 예를 들면 다음과 같다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  runtimeClassName: myclass
  # ...
```

이것은 Kubelet이 지명된 런타임 클래스를 사용하여 해당 파드를 실행하도록 지시할 것이다. 만약 지명된 
런타임 클래스가 없거나, CRI가 상응하는 핸들러를 실행할 수 없는 경우, 파드는 
`Failed` 터미널 [단계](/ko/docs/concepts/workloads/pods/pod-lifecycle/#파드의-단계-phase)로 들어간다. 에러 
메시지를 위해서는 상응하는 [이벤트](/docs/tasks/debug-application-cluster/debug-application-introspection/)를 
확인한다.

만약 명시된 `runtimeClassName`가 없다면, 기본 런타임 핸들러가 사용될 것이다. 기본 런타임 핸들러는 런타임 클래스 특징이 비활성화되었을 때와 동일하게 동작한다.

{{% /capture %}}
