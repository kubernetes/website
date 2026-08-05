---
content_type: reference
title: kubelet 체크포인트 API
weight: 10
---


{{< feature-state for_k8s_version="v1.25" state="alpha" >}}

컨테이너 체크포인트는 실행 중인 컨테이너의 스테이트풀(stateful) 복사본을 생성하는 기능이다.
컨테이너의 스테이트풀 복사본이 있으면,
디버깅 또는 다른 목적을 위해 이를 다른 컴퓨터로 이동할 수 있다.

체크포인트 컨테이너 데이터를 복원할 수 있는 컴퓨터로 이동하면,
복원된 컨테이너는 체크포인트된 지점과
정확히 동일한 지점에서 계속 실행된다. 적절한 도구가 있다면,
저장된 데이터를 검사해 볼 수도 있다.

컨테이너 체크포인트 생성 시에는 유의해야 할 보안 사항이 있다.
일반적으로 각 체크포인트는 체크포인트된 컨테이너의 모든 프로세스의 메모리 페이지를 포함한다.
이는 곧 메모리에 있던 모든 데이터가 로컬 디스크에 저장되어 열람이 가능함을 의미한다.
이 아카이브(archive)에는 모든 개인 데이터와 암호화 키가 포함된다.
따라서, 내부 CRI 구현체(노드의 컨테이너 런타임)는
체크포인트 아카이브를 생성 시 `root` 사용자만 액세스 가능하도록 처리해야 한다.
그럼에도 여전히 주의가 필요한데, 체크포인트 아카이브를 다른 시스템으로 전송하게 되면 해당 시스템의 체크포인트 아카이브 소유자가
모든 메모리 페이지를 읽을 수 있기 때문이다.

## 운영 {#operations}

### `POST` 특정 컨테이너의 체크포인트 생성 {#post-checkpoint}

지정된 파드의 특정 컨테이너를 체크포인트하도록 kubelet에 지시한다.

kubelet 체크포인트 인터페이스로의 접근이 어떻게 제어되는지에 대한 자세한 내용은
[Kubelet 인증/인가 레퍼런스](/ko/docs/reference/access-authn-authz/kubelet-authn-authz/)
를 참고한다.

kubelet은 내부 {{<glossary_tooltip term_id="cri" text="CRI">}} 구현체에
체크포인트를 요청한다.
체크포인트 요청 시, kubelet은 체크포인트 아카이브의 이름을
`checkpoint-<podFullName>-<containerName>-<timestamp>.tar`로 지정하고
루트 디렉토리(`--root-dir` 로 지정 가능) 아래의 `checkpoints` 디렉토리에
체크포인트 아카이브를 저장하도록 요청한다.
기본값은 `/var/lib/kubelet/checkpoints`이다.

체크포인트 아카이브는 _tar_ 형식이며
[`tar`](https://pubs.opengroup.org/onlinepubs/7908799/xcu/tar.html) 유틸리티를 사용하여 조회해 볼 수 있다.
아카이브의 내용은 내부 CRI 구현체(노드의 컨테이너 런타임)에 따라 다르다.

#### HTTP 요청 {#post-checkpoint-request}

POST /checkpoint/{namespace}/{pod}/{container}

#### 파라미터 {#post-checkpoint-params}

- **namespace** (*경로 내 파라미터*): 문자열(string), 필수

  {{< glossary_tooltip term_id="namespace" >}}

- **pod** (*경로 내 파라미터*): 문자열(string), 필수

  {{< glossary_tooltip term_id="pod" >}}

- **container** (*경로 내 파라미터*): 문자열(string), 필수

  {{< glossary_tooltip term_id="container" >}}

- **timeout** (*쿼리 파라미터*): 정수(integer)

  체크포인트 생성이 완료될 때까지 대기할 시간제한(초)이다.
  시간 제한이 0 또는 지정되지 않은 경우
  기본 {{<glossary_tooltip term_id="cri" text="CRI">}} 시간 제한 값이 사용될 것이다.
  체크포인트 생성 시간은 컨테이너가 사용하고 있는 메모리에 따라 다르다.
  컨테이너가 사용하는 메모리가 많을수록 해당 체크포인트를 생성하는 데
  더 많은 시간이 필요하다.

#### 응답 {#post-checkpoint-response}

200: OK

401: Unauthorized

404: Not Found (`ContainerCheckpoint` 기능 게이트가 비활성화된 경우)

404: Not Found (명시한 `namespace`, `pod` 또는 `container`를 찾을 수 없는 경우)

500: Internal Server Error (CRI 구현체가 체크포인트를 수행하는 중에 오류가 발생한 경우 (자세한 내용은 오류 메시지를 확인한다.))

500: Internal Server Error (CRI 구현체가 체크포인트 CRI API를 구현하지 않은 경우 (자세한 내용은 오류 메시지를 확인한다.))

{{< comment >}}
TODO: CRI 구현체가 체크포인트/복원 기능을 가지게 되면 반환 코드에 대한 자세한 정보를 추가해야 한다.
      CRI 구현체는 새로운 ContainerCheckpoint CRI API 호출을 구현하기 위한
      쿠버네티스의 변경이 필요하기 때문에 릴리스 전에는 TODO를 수정할 수 없다.
      이 문제를 해결하려면 1.25 릴리스 이후를 기다려야 한다.
{{< /comment >}}