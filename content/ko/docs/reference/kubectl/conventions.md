---
title: kubectl 사용 규칙
# reviewers:
# - janetkuo
content_type: concept
weight: 60
---

<!-- overview -->
`kubectl`에 대한 권장 사용 규칙.


<!-- body -->

## 재사용 가능한 스크립트에서 `kubectl` 사용

스크립트의 안정적인 출력을 위해서

* `-o name`, `-o json`, `-o yaml`, `-o go-template` 혹은 `-o jsonpath`와 같은 머신 지향(machine-oriented) 출력 양식 중 하나를 요청한다.
* 예를 들어 `jobs.v1.batch/myjob`과 같이 전체 버전을 사용한다. 이를 통해 `kubectl`이 시간이 지남에 따라 변경될 수 있는 기본 버전을 사용하지 않도록 한다.
* 문맥, 설정 또는 기타 암묵적 상태에 의존하지 않는다.

## 서브리소스 {#subresources}

* kubectl의 `get`, `patch`, `edit` 및 `replace`와 같은 명령어에서 
  서브리소스를 지원하는 모든 리소스에 대해 `--subresource` 알파 플래그를 사용하여 
  서브리소스를 조회하고 업데이트할 수 있다. 현재, `status`와 `scale` 서브리소스만 지원된다.
* 서브리소스에 대한 API 계약은 전체 리소스와 동일하다. 
  `status` 서브리소스를 새 값으로 업데이트해도, 
  컨트롤러에서 서브리소스를 잠재적으로 다른 값으로 조정할 수 있다는 점을 염두에 두어야 한다.


## 모범 사례

### `kubectl run`

`kubectl run`으로 infrastructure as code를 충족시키기 위해서

* 버전이 명시된 태그로 이미지를 태그하고 그 태그를 새로운 버전으로 이동하지 않는다. 예를 들어, `:latest`가 아닌 `:v1234`, `v1.2.3`, `r03062016-1-4`를 사용한다(자세한 정보는 [구성 모범 사례](/ko/docs/concepts/configuration/overview/#컨테이너-이미지)를 참고한다).
* 많은 파라미터가 적용된 이미지를 위한 스크립트를 작성한다.
* 필요하지만 `kubectl run` 플래그를 통해 표현할 수 없는 기능은 구성 파일을 소스 코드 버전 관리 시스템에 넣어서 전환한다.

`--dry-run` 플래그를 사용하여 실제로 제출하지 않고 클러스터로 보낼 오브젝트를 미리 볼 수 있다.

### `kubectl apply`

* `kubectl apply`를 사용해서 리소스를 생성하거나 업데이트 할 수 있다. kubectl apply를 사용하여 리소스를 업데이트하는 방법에 대한 자세한 정보는 [Kubectl 책](https://kubectl.docs.kubernetes.io)을 참고한다.
