---
# reviewers:
# - verb
# - yujuhong
title: 임시(Ephemeral) 컨테이너
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

이 페이지는 임시 컨테이너에 대한 개요를 제공한다. 
이 특별한 유형의 컨테이너는 트러블슈팅과 같은 사용자가 시작한 작업을 완료하기 위해 
기존 {{< glossary_tooltip text="파드" term_id="pod" >}}에서 임시적으로 실행된다. 
임시 컨테이너는 애플리케이션을 빌드하는 경우보다는 서비스 점검과 같은 경우에 더 적합하다.

<!-- body -->

## 임시 컨테이너 이해하기

{{< glossary_tooltip text="파드" term_id="pod" >}} 는 쿠버네티스 애플리케이션의
기본 구성 요소이다. 파드는 일회용이고, 교체 가능한 것으로 의도되었기
때문에, 사용자는 파드가 한번 생성되면, 컨테이너를 추가할 수 없다.
대신, 사용자는 보통 {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}} 를
사용해서 제어하는 방식으로 파드를 삭제하고 교체한다.

그러나 때때로 재현하기 어려운 버그의 문제 해결을 위해
기존 파드의 상태를 검사해야 할 수 있다. 이 경우 사용자는
기존 파드에서 임시 컨테이너를 실행해서 상태를 검사하고, 임의의 명령을
실행할 수 있다.

### 임시 컨테이너는 무엇인가?

임시 컨테이너는 리소스 또는 실행에 대한 보증이 없다는 점에서
다른 컨테이너와 다르며, 결코 자동으로 재시작되지 않는다. 그래서
애플리케이션을 만드는데 적합하지 않다. 임시 컨테이너는
일반 컨테이너와 동일한 `ContainerSpec` 을 사용해서 명시하지만, 많은 필드가
호환되지 않으며 임시 컨테이너에는 허용되지 않는다.

- 임시 컨테이너는 포트를 가지지 않을 수 있으므로, `ports`,
  `livenessProbe`, `readinessProbe` 와 같은 필드는 허용되지 않는다.
- 파드에 할당된 리소스는 변경할 수 없으므로, `resources` 설정이 허용되지 않는다.
- 허용되는 필드의 전체 목록은 [임시컨테이너 참조
  문서](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#ephemeralcontainer-v1-core)를 본다.

임시 컨테이너는 `pod.spec` 에 직접 추가하는 대신
API에서 특별한 `ephemeralcontainers` 핸들러를 사용해서 만들어지기 때문에
`kubectl edit`을 사용해서 임시 컨테이너를 추가할 수 없다.

일반 컨테이너와 마찬가지로, 사용자는 임시 컨테이너를 파드에 추가한
이후에 변경하거나 제거할 수 없다.

{{< note >}}
임시 컨테이너는 [스태틱 파드](/ko/docs/tasks/configure-pod-container/static-pod/)에서 지원되지 않는다.
{{< /note >}}

## 임시 컨테이너의 사용

임시 컨테이너는 컨테이너가 충돌 되거나 또는 컨테이너 이미지에
디버깅 도구가 포함되지 않은 이유로 `kubectl exec` 이 불충분할 때
대화형 문제 해결에 유용하다.

특히, [distroless 이미지](https://github.com/GoogleContainerTools/distroless)
를 사용하면 공격 표면(attack surface)과 버그 및 취약점의 노출을 줄이는 최소한의
컨테이너 이미지를 배포할 수 있다. distroless 이미지는 셸 또는 어떤 디버깅 도구를
포함하지 않기 때문에, `kubectl exec` 만으로는 distroless
이미지의 문제 해결이 어렵다.

임시 컨테이너 사용 시 [프로세스 네임스페이스
공유](/docs/tasks/configure-pod-container/share-process-namespace/)를
활성화하면 다른 컨테이너 안의 프로세스를 보는 데 도움이 된다.

## {{% heading "whatsnext" %}}

* [임시 컨테이너 디버깅하기](/ko/docs/tasks/debug/debug-application/debug-running-pod/#ephemeral-container)에 대해 알아보기.
