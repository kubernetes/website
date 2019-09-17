---
title: 런타임 클래스
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.12" state="alpha" >}}

이 페이지는 런타임 클래스(RuntimeClass) 리소스와 런타임 선택 메커니즘에 대해서 설명한다.

{{< warning >}}
런타임클래스는 v1.14 베타 업그레이드에서 *중대한* 변화를 포함한다.
런타임클래스를 v1.14 이전부터 사용하고 있었다면,
[런타임 클래스를 알파에서 베타로 업그레이드하기](#upgrading-runtimeclass-from-alpha-to-beta)를 확인한다.
{{< /warning >}}

{{% /capture %}}


{{% capture body %}}

## 런타임 클래스

런타임 클래스는 컨테이너 런타임 설정을 선택하는 기능이다.
이 컨테이너 런타임 설정은 파드의 컨테이너를 실행할 때에 이용한다.

## 동기

서로 다른 파드간에 런타임 클래스를 설정하여
성능대 보안의 균형을 유지할 수 있다.
예를 들어, 일부 작업에서 높은 수준의 정보 보안 보증이 요구되는 경우,
하드웨어 가상화를 이용하는 컨테이너 런타임으로 파드를 실행하도록 예약하는 선택을 할 수 있다.
그러면 몇가지 추가적인 오버헤드는 있지만
대체 런타임을 추가 분리하는 유익이 있다.

또한 런타임 클래스를 사용하여 컨테이너 런타임이 같으나 설정이 다른
여러 파드를 실행할 수 있다.

### 셋업

RuntimeClass 특징 게이트가 활성화(기본값)를 확인한다.
특징 게이트 활성화에 대한 설명은 [특징 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
참고한다. `RuntimeClass` 특징 게이트는 apiservers _및_ kubelets에서 활성화되어야 한다.

1. CRI 구현(implementation)을 노드에 설정(런타임에 따라서)
2. 상응하는 런타임 클래스 리소스 생성

#### 1. CRI 구현을 노드에 설정

런타임 클래스를 통한 가능한 구성은 컨테이너 런타임 인터페이스(CRI) 구현에 의존적이다.
사용자의 CRI 구현에 따른 설정 방법은
연관된 문서를 통해서 확인한다([아래](#cri-configuration)).

{{< note >}}
런타임 클래스는 클러스터 전체에 걸쳐 동질의 노드 설정
(모든 노드가 컨테이너 런타임에 준하는 동일한 방식으로 설정되었음을 의미)을 가정한다. 어떠한 이질성(다양한
설정)이라도 스케줄링 특징을 통해서 런타임 클래스와는 독립적으로 관리되어야 한다
([파드를 노드에 할당하기](/docs/concepts/configuration/assign-pod-node/) 참고).
{{< /note >}}

해당 설정은 상응하는 `handler` 이름을 가지며, 이는 런타임 클래스에 의해서 참조된다.
런타임 핸들러는 유효한 DNS 1123 서브도메인(알파-숫자 + `-`와 `.`문자)을 가져야 한다.

#### 2. 상응하는 런타임 클래스 리소스 생성

1단계에서 셋업 한 설정은 연관된 `handler` 이름을 가져야 하며, 이를 통해서 설정을 식별할 수 있다.
각 런타임 핸들러(그리고 선택적으로 비어있는 `""` 핸들러)에 대해서, 상응하는 런타임 클래스 오브젝트를 생성한다.

현재 런타임 클래스 리소스는 런타임 클래스 이름(`metadata.name`)과 런타임 핸들러
(`handler`)로 단 2개의 중요 필드만 가지고 있다. 오브젝트 정의는 다음과 같은 형태이다.

```yaml
apiVersion: node.k8s.io/v1beta1  # 런타임 클래스는 node.k8s.io API 그룹에 정의되어 있음
kind: RuntimeClass
metadata:
  name: myclass  # 런타임 클래스는 해당 이름을 통해서 참조됨
  # 런타임 클래스는 네임스페이스가 없는 리소스임
handler: myconfiguration  # 상응하는 CRI 설정의 이름임
```

{{< note >}}
런타임 클래스 쓰기 작업(create/update/patch/delete)은
클러스터 관리자로 제한할 것을 권장한다. 이것은 일반적으로 기본 설정이다.
더 자세한 정보는 [권한 개요](/docs/reference/access-authn-authz/authorization/)를 참고한다.
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

이것은 Kubelet이 지명된 런타임 클래스를 사용하여 해당 파드를 실행하도록 지시할 것이다.
만약 지명된 런타임 클래스가 없거나, CRI가 상응하는 핸들러를 실행할 수 없는 경우, 파드는
`Failed` 터미널 [단계](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase)로 들어간다.
에러 메시지에 상응하는 [이벤트](/docs/tasks/debug-application-cluster/debug-application-introspection/)를
확인한다.

만약 명시된 `runtimeClassName`가 없다면, 기본 런타임 핸들러가 사용되며,
런타임 클래스 특징이 비활성화되었을 때와 동일하게 동작한다.

### CRI 구성 {#cri-configuration}

CRI 런타임 설치에 대한 자세한 내용은 [CRI 설치](/docs/setup/production-environment/container-runtimes/)를 확인한다.

#### dockershim

쿠버네티스의 내장 dockershim CRI는 런타임 핸들러를 지원하지 않는다.

#### [containerd](https://containerd.io/)

런타임 핸들러는 containerd의 구성 파일인 `/etc/containerd/config.toml` 통해 설정한다.
유효한 핸들러는 runtimes 단락 아래에서 설정한다.

```
[plugins.cri.containerd.runtimes.${HANDLER_NAME}]
```

더 자세한 containerd의 구성 문서를 살펴본다.
https://github.com/containerd/cri/blob/master/docs/config.md

#### [cri-o](https://cri-o.io/)

런타임 핸들러는 cri-o의 구성파일인 `/etc/crio/crio.conf`을 통해 설정한다.
[crio.runtime 테이블](https://github.com/kubernetes-sigs/cri-o/blob/master/docs/crio.conf.5.md#crioruntime-table) 아래에
유효한 핸들러를 설정한다.

```
[crio.runtime.runtimes.${HANDLER_NAME}]
  runtime_path = "${PATH_TO_BINARY}"
```

더 자세한 cri-o의 구성 문서를 살펴본다.
https://github.com/kubernetes-sigs/cri-o/blob/master/cmd/crio/config.go


### 런타임 클래스를 알파에서 베타로 업그레이드 {#upgrading-runtimeclass-from-alpha-to-beta}

런타임 클래스 베타 기능은 다음의 변화를 포함한다.

- `node.k8s.io` API 그룹과 `runtimeclasses.node.k8s.io` 리소스는 CustomResourceDefinition에서
  내장 API로 이전되었다.
- 런타임 클래스 정의에서 `spec`을 직접 사용할 수 있다.
  (즉, 더 이상 RuntimeClassSpec는 없다).
- `runtimeHandler` 필드는 `handler`로 이름이 바뀌었다.
- `handler` 필드는 이제 모두 API 버전에서 요구된다. 이는 알파 API에서도 `runtimeHandler` 필드가
  필요하다는 의미이다.
- `handler` 필드는 반드시 올바른 DNS 레이블([RFC 1123](https://tools.ietf.org/html/rfc1123))으로,
  이는 더 이상 `.` 캐릭터(모든 버전에서)를 포함할 수 없다 의미이다. 올바른 핸들러는
  다음의 정규 표현식을 따른다. `^[a-z0-9]([-a-z0-9]*[a-z0-9])?$`.

**작업 필요** 다음 작업은 알파 버전의 런타임 기능을
베타 버전으로 업그레이드하기 위해 진행되어야 한다.

- 런타임 클래스 리소스는 v1.14로 업그레이드 *후에* 반드시 재생성되어야 하고,
  `runtimeclasses.node.k8s.io` CRD는 다음과 같이 수동으로 지워야 한다.
  ```
  kubectl delete customresourcedefinitions.apiextensions.k8s.io runtimeclasses.node.k8s.io
  ```
- 지정되지 않았거나 비어 있는 `runtimeHandler` 이거나 핸들러 내에 `.` 캐릭터를 사용한 알파 런타임 클래스는
  더 이상 올바르지 않으며, 반드시 올바른 핸들러 구성으로 이전헤야 한다
  (위를 참조).

{{% /capture %}}
