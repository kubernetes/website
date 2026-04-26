---
# reviewers:
# - erictune
# - thockin
title: 이미지
content_type: concept
weight: 10
hide_summary: true # 섹션의 목차에 별도로 기재
---

<!-- overview -->

컨테이너 이미지는 애플리케이션과 모든 소프트웨어 의존성을 캡슐화하는 바이너리 데이터를
나타낸다. 컨테이너 이미지는 독립적으로 실행할 수 있고 런타임 환경에 대해
잘 정의된 가정을 만드는 실행 가능한 소프트웨어 번들이다.

일반적으로 {{< glossary_tooltip text="파드" term_id="pod" >}}에서 참조하기 전에
애플리케이션의 컨테이너 이미지를 생성해서 레지스트리로 푸시한다.

이 페이지는 컨테이너 이미지 개념의 개요를 제공한다.

{{< note >}}
(v{{< skew latestVersion >}}와 같은 최신 마이너 릴리즈와 같은)
쿠버네티스 릴리즈에 대한 컨테이너 이미지를 찾고 있다면 
[쿠버네티스 다운로드](https://kubernetes.io/releases/download/)를 확인하라.
{{< /note >}}

<!-- body -->

## 이미지 이름

컨테이너 이미지는 일반적으로 `pause`, `example/mycontainer` 또는 `kube-apiserver` 와 같은 이름을 부여한다.
이미지는 또한 레지스트리 호스트 이름을 포함할 수 있다. 예를 들어 `fictional.registry.example/imagename`
와 같다. 그리고 `fictional.registry.example:10443/imagename` 와 같이 포트 번호도 포함할 수 있다.

레지스트리 호스트 이름을 지정하지 않으면, 쿠버네티스는 [도커 퍼블릭 레지스트리](https://hub.docker.com/)를 의미한다고 가정한다.
이 동작은 [컨테이너 런타임](/docs/setup/production-environment/container-runtimes/)
설정에서 기본 이미지 레지스트리를 설정하여 변경할 수 있다.

이미지 이름 부분 다음에 _tag_ 또는 _digest_ 를 추가할 수 있다
(`docker` 또는 `podman` 과 같은 명령을 사용할 때와 동일한 방식으로). 태그를 사용하면 동일한 시리즈 이미지의 다른 버전을 식별할 수 있다.
다이제스트는 이미지의 특정 버전에 대한 고유 식별자이다. 다이제스트는
이미지 콘텐츠의 해시이며 변경 불가능하다. 태그는 다른 이미지를 가리키도록 변경될 수 있지만, 다이제스트는 고정된다.

이미지 태그는 소문자와 대문자, 숫자, 밑줄(`_`),
마침표(`.`) 및 대시(`-`)로 구성된다. 태그는 최대 128자까지 가능하며,
다음 정규 표현식 패턴을 따라야 한다: `[a-zA-Z0-9_][a-zA-Z0-9._-]{0,127}`.
자세한 내용과 유효성 검증 정규 표현식은
[OCI Distribution Specification](https://github.com/opencontainers/distribution-spec/blob/master/spec.md#workflow-categories)에서 확인할 수 있다.
태그를 지정하지 않으면, 쿠버네티스는 태그 `latest` 를 의미한다고 가정한다.

이미지 다이제스트는 해시 알고리즘(예: `sha256`)과 해시 값으로 구성된다. 예를 들어,
`sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` 이다.
다이제스트 형식에 대한 자세한 내용은
[OCI Image Specification](https://github.com/opencontainers/image-spec/blob/master/descriptor.md#digests)에서 확인할 수 있다.

쿠버네티스가 사용할 수 있는 이미지 이름 예시는 다음과 같다.

- `busybox` &mdash; 이미지 이름만 지정, 태그나 다이제스트 없음. 쿠버네티스는
    도커 퍼블릭 레지스트리와 latest 태그를 사용한다. `docker.io/library/busybox:latest`와 동일하다.
- `busybox:1.32.0` &mdash; 태그가 있는 이미지 이름. 쿠버네티스는
    도커 퍼블릭 레지스트리를 사용한다. `docker.io/library/busybox:1.32.0`과 동일하다.
- `registry.k8s.io/pause:latest` &mdash; 사용자 정의 레지스트리와 latest 태그가 있는 이미지 이름.
- `registry.k8s.io/pause:3.5` &mdash; 사용자 정의 레지스트리와 latest가 아닌 태그가 있는 이미지 이름.
- `registry.k8s.io/pause@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    다이제스트가 있는 이미지 이름.
- `registry.k8s.io/pause:3.5@sha256:1ff6c18fbef2045af6b9c16bf034cc421a29027b800e4f9b68ae9b1cb3e9ae07` &mdash;
    태그와 다이제스트가 있는 이미지 이름. 풀링 시 다이제스트만 사용된다.

## 이미지 업데이트

{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}},
{{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}}, 파드 또는
파드 템플릿을 포함하는 다른 오브젝트를 처음 만들 때 특별히 명시하지 않은 경우,
기본적으로 해당 파드에 있는 모든 컨테이너의 풀(pull)
정책은 `IfNotPresent`로 설정된다. 이 정책은
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}이 이미 존재하는
이미지에 대한 풀을 생략하게 한다.

### 이미지 풀(pull) 정책

컨테이너에 대한 `imagePullPolicy`와 이미지의 태그는
[kubelet](/docs/reference/command-line-tools-reference/kubelet/)이 특정 이미지를 풀
(다운로드)하려고 할 때 영향을 준다.

다음은 `imagePullPolicy`에 설정할 수 있는 값의 목록과 
효과이다.

`IfNotPresent`
: 이미지가 로컬에 없는 경우에만 내려받는다.

`Always`
: kubelet이 컨테이너를 기동할 때마다, kubelet이 컨테이너 
  이미지 레지스트리에 이름과 이미지의
  [다이제스트](https://docs.docker.com/engine/reference/commandline/pull/#pull-an-image-by-digest-immutable-identifier)가 있는지 질의한다.
  일치하는 다이제스트를 가진 컨테이너 이미지가 로컬에 있는 경우, kubelet은 캐시된 이미지를 사용한다.
  이외의 경우, kubelet은 검색된 다이제스트를 가진 이미지를 내려받아서
  컨테이너를 기동할 때 사용한다.

`Never`
: kubelet은 이미지를 가져오려고 시도하지 않는다. 이미지가 어쨌든 이미 로컬에 존재하는
  경우, kubelet은 컨테이너 기동을 시도한다. 이외의 경우 기동은 실패한다.
  보다 자세한 내용은 [미리 내려받은 이미지](#pre-pulled-images)를 참조한다.

이미지 제공자에 앞서 깔린 캐시의 의미 체계는 레지스트리에 안정적으로 접근할 수 있는 한,
`imagePullPolicy: Always`인 경우 조차도 효율적이다.
컨테이너 런타임은 노드에 이미 존재하는 이미지 레이어를 알고
다시 내려받지 않는다.

{{< note >}}
프로덕션 환경에서 컨테이너를 배포하는 경우 `:latest` 태그 사용을 지양해야 하는데,
이미지의 어떤 버전이 기동되고 있는지 추적이 어렵고 
제대로 롤백하기 어렵게 되기 때문이다.

대신, `v1.42.0`과 같이 의미있는 태그 및/또는 다이제스트를 명기한다.
{{< /note >}}

파드가 항상 컨테이너 이미지의 같은 버전을 사용하는 것을 확실히 하려면,
이미지의 다이제스트를 명기할 수 있다.
`<image-name>:<tag>`를 `<image-name>@<digest>`로 교체한다.
(예를 들어, `image@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2`).

이미지 태그를 사용하는 경우, 이미지 레지스트리에서 한 이미지를 나타내는 태그에 코드를
변경하게 되면, 기존 코드와 신규 코드를 구동하는 파드가 섞이게 되고 만다. 이미지 다이제스트를
통해 이미지의 특정 버전을 유일하게 식별할 수 있기 때문에, 쿠버네티스는 매번
해당 이미지 이름과 다이제스트가 명시된 컨테이너를 기동해서 같은 코드를 구동한다. 이미지를 다이제스트로 명시하면
구동할 코드를 고정시켜서 레지스트리에서의 변경으로 인해 버전이 섞이는 일이 발생하지 않도록 해 준다.

파드(및 파드 템플릿)가 생성될 때 구동 중인 워크로드가 
태그가 아닌 이미지 다이제스트를 통해 정의되도록 조작해주는
서드-파티 [어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/)가 있다.
이는 레지스트리에서 태그가 변경되는 일이 발생해도
구동 중인 워크로드가 모두 같은 코드를 사용하고 있다는 것을 보장하기를 원하는 경우 유용할 것이다.

#### 기본 이미지 풀 정책 {#imagepullpolicy-defaulting}

사용자(또는 컨트롤러)가 신규 파드를 API 서버에 요청할 때,
특정 조건에 부합하면 클러스터가 `imagePullPolicy` 필드를 설정한다.

- `imagePullPolicy` 필드를 생략하고 컨테이너 이미지의 다이제스트를 명시한 경우,
  `imagePullPolicy`는 자동으로 `IfNotPresent`로 설정된다.
- `imagePullPolicy` 필드를 생략하고 컨테이너 이미지의 태그가
  `:latest`인 경우, `imagePullPolicy`는 자동으로 `Always`로 설정된다.
- `imagePullPolicy` 필드를 생략하고 컨테이너 이미지의 태그를 명기하지 않은 경우,
  `imagePullPolicy`는 자동으로 `Always`로 설정된다.
- `imagePullPolicy` 필드를 생략하고, 
  명기한 컨테이너 이미지의 태그가 `:latest`가 아니면, 
  `imagePullPolicy`는 자동으로 `IfNotPresent`로 설정된다.

{{< note >}}
컨테이너의 `imagePullPolicy` 값은 오브젝트가 처음 _created_ 일 때 항상
설정되고, 나중에 이미지의 태그나 다이제스트가 변경되더라도 업데이트되지 않는다.

예를 들어, 태그가 `:latest`가 _아닌_ 이미지로 디플로이먼트를 생성하고,
나중에 해당 디플로이먼트의 이미지를 `:latest` 태그로 업데이트하면
`imagePullPolicy` 필드가 `Always` 로 변경되지 _않는다_. 오브젝트를
처음 생성 한 후 모든 오브젝트의 풀 정책을 수동으로 변경해야 한다.
{{< /note >}}

#### 이미지 풀 강제

이미지를 내려받도록 강제하려면, 다음 중 한가지 방법을 사용한다.

- 컨테이너의 `imagePullPolicy`를 `Always`로 설정한다.
- `imagePullPolicy`를 생략하고 사용할 이미지 태그로 `:latest`를 사용한다.
  그러면 사용자가 파드를 요청할 때 쿠버네티스가 정책을 `Always`로 설정한다.
- `imagePullPolicy`와 사용할 이미지의 태그를 생략한다.
  그러면 사용자가 파드를 요청할 때 쿠버네티스가 정책을 `Always`로 설정한다.
- [AlwaysPullImages](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)
  어드미션 컨트롤러를 활성화 한다.

### 이미지풀백오프(ImagePullBackOff)

kubelet이 컨테이너 런타임을 사용하여 파드의 컨테이너 생성을 시작할 때, 
`ImagePullBackOff`로 인해 컨테이너가 
[Waiting](/docs/concepts/workloads/pods/pod-lifecycle/#container-state-waiting) 상태에 있을 수 있다.

`ImagePullBackOff`라는 상태는 (이미지 이름이 잘못됨, 또는 `imagePullSecret` 없이 
비공개 레지스트리에서 풀링 시도 등의 이유로) 쿠버네티스가 컨테이너 이미지를 
가져올 수 없기 때문에 컨테이너를 실행할 수 없음을 의미한다. `BackOff`라는 단어는 
쿠버네티스가 백오프 딜레이를 증가시키면서 이미지 풀링을 계속 시도할 것임을 나타낸다.

쿠버네티스는 시간 간격을 늘려가면서 시도를 계속하며, 시간 간격의 상한은 쿠버네티스 코드에
300초(5분)로 정해져 있다.

### 런타임 클래스별 이미지 풀

{{< feature-state feature_gate_name="RuntimeClassInImageCriApi" >}}
쿠버네티스는 파드의 RuntimeClass를 기반으로 이미지 풀을 수행하는 알파 기능을 포함한다.

`RuntimeClassInImageCriApi` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)를
활성화하면, kubelet은 이미지 이름이나 다이제스트만이 아닌 이미지 이름과 런타임
핸들러의 튜플로 컨테이너 이미지를 참조한다.
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}은
선택된 런타임 핸들러에 따라 동작을 조정할 수 있다.
런타임 클래스 기반 이미지 풀은 Windows Hyper-V 컨테이너와 같은
VM 기반 컨테이너에 유용하다.

## 직렬 및 병렬 이미지 풀

기본적으로 kubelet은 이미지를 직렬로 풀한다. 즉, kubelet은 한 번에 하나의
이미지 풀 요청만 이미지 서비스에 전송한다. 다른 이미지 풀 요청은 처리 중인
요청이 완료될 때까지 대기해야 한다.

노드는 이미지 풀 결정을 독립적으로 내린다. 직렬 이미지 풀을 사용하더라도
두 개의 다른 노드가 같은 이미지를 병렬로 풀할 수 있다.

병렬 이미지 풀을 활성화하려면, [kubelet 설정](/docs/reference/config-api/kubelet-config.v1beta1/)에서
`serializeImagePulls` 필드를 false로 설정할 수 있다.
`serializeImagePulls`를 false로 설정하면, 이미지 풀 요청이 즉시 이미지 서비스에 전송되고
여러 이미지가 동시에 풀된다.

병렬 이미지 풀을 활성화할 때, 컨테이너 런타임의 이미지 서비스가 병렬 이미지 풀을
처리할 수 있는지 확인한다.

kubelet은 하나의 파드를 대신하여 여러 이미지를 병렬로 풀하지 않는다. 예를 들어,
초기화 컨테이너와 애플리케이션 컨테이너가 있는 파드의 경우, 두 컨테이너의 이미지 풀은
병렬화되지 않는다. 그러나 서로 다른 이미지를 사용하는 두 개의 파드가 있고
병렬 이미지 풀 기능이 활성화된 경우, kubelet은 두 개의 서로 다른 파드를 대신하여
이미지를 병렬로 풀한다.

### 최대 병렬 이미지 풀

{{< feature-state for_k8s_version="v1.35" state="stable" >}}

`serializeImagePulls`가 false로 설정되면, kubelet은 기본적으로 동시에 풀되는
이미지의 최대 수에 제한을 두지 않는다. 병렬 이미지 풀 수를 제한하려면,
kubelet 설정에서 `maxParallelImagePulls` 필드를 설정할 수 있다.
`maxParallelImagePulls`가 _n_ 으로 설정되면, 동시에 _n_ 개의 이미지만
풀할 수 있으며, _n_ 을 초과하는 이미지 풀은 진행 중인 이미지 풀이
하나 이상 완료될 때까지 대기해야 한다.

병렬 이미지 풀이 활성화된 경우, 병렬 이미지 풀 수를 제한하면 이미지 풀이
너무 많은 네트워크 대역폭이나 디스크 I/O를 소비하는 것을 방지할 수 있다.

`maxParallelImagePulls`를 1 이상의 양의 정수로 설정할 수 있다.
`maxParallelImagePulls`를 2 이상으로 설정하는 경우, `serializeImagePulls`를
false로 설정해야 한다. 잘못된 `maxParallelImagePulls` 설정으로는
kubelet이 시작에 실패한다.

## 이미지 인덱스가 있는 다중 아키텍처 이미지

바이너리 이미지를 제공할 뿐만 아니라, 컨테이너 레지스트리는
[컨테이너 이미지 인덱스](https://github.com/opencontainers/image-spec/blob/master/image-index.md)를 제공할 수도 있다.
이미지 인덱스는 컨테이너의 아키텍처별 버전에 대한 여러 [이미지 매니페스트](https://github.com/opencontainers/image-spec/blob/master/manifest.md)를
가리킬 수 있다. 그 아이디어는 이미지의 이름(예를 들어, `pause`,
`example/mycontainer`, `kube-apiserver`)
을 가질 수 있고 서로 다른 시스템들이
사용 중인 머신 아키텍처에 적합한 바이너리 이미지를 가져오도록 허용하는 것이다.

쿠버네티스 프로젝트는 일반적으로 `-$(ARCH)` 접미사가 포함된 이름으로 릴리스용 컨테이너 이미지를
생성한다. 이전 버전과의 호환성을 위해, 접미사가
있는 오래된 이미지를 생성한다. 예를 들어,
`pause`라는 이미지는 지원되는 모든 아키텍처에 대한 매니페스트를 포함하는
다중 아키텍처 이미지이고, `pause-amd64`는 이전 구성이나 접미사가 포함된 이미지 이름을
하드 코딩한 YAML 파일과 호환되는 버전이다.

## 프라이빗 레지스트리 사용

프라이빗 레지스트리는 이미지를 검색하거나 풀하기
위해 인증을 요구할 수 있다.
자격 증명(credential)은 여러 가지 방법으로 제공될 수 있다.

- [파드 정의 시 `imagePullSecrets` 명시](#파드에-imagepullsecrets-명시)

  자신의 키를 제공하는 파드만 프라이빗 레지스트리에 접근 가능하다.

- [프라이빗 레지스트리에 인증하도록 노드 구성](#프라이빗-레지스트리에-인증하도록-노드-구성)
  - 모든 파드는 구성된 프라이빗 레지스트리를 읽을 수 있다.
  - 클러스터 관리자에 의한 노드 구성이 필요하다.
- _kubelet 자격증명 제공자_ 플러그인을 사용하여 [프라이빗 레지스트리의 자격증명을 동적으로 가져오기](#kubelet-credential-provider)

  kubelet은 해당 프라이빗 레지스트리에 대해 자격증명 제공자 실행
  플러그인을 사용하도록 설정될 수 있다.

- [미리 내려받은(pre-pulled) 이미지](#미리-내려받은-이미지)
  - 모든 파드는 노드에 캐시된 모든 이미지를 사용 가능하다.
  - 셋업을 위해서는 모든 노드에 대해서 root 접근이 필요하다.
- 공급 업체별 또는 로컬 확장

  사용자 정의 노드 구성을 사용하는 경우, 사용자(또는 클라우드 제공자)가
  컨테이너 레지스트리에 대한 노드 인증 메커니즘을 구현할 수 있다.

이들 옵션은 아래에서 더 자세히 설명한다.

### 파드에 `imagePullSecrets` 명시

{{< note >}}
이 방법은 프라이빗 레지스트리의 이미지를 기반으로 컨테이너를 실행하는 데
권장된다.
{{< /note >}}

쿠버네티스는 파드에 컨테이너 이미지 레지스트리 키를 명시하는 것을 지원한다.
모든 `imagePullSecrets`은 파드와 동일한
{{< glossary_tooltip term_id="namespace" >}}에 존재하는 시크릿이어야 한다.
이 시크릿의 타입은 `kubernetes.io/dockercfg` 이거나 `kubernetes.io/dockerconfigjson` 이어야 한다.

### 프라이빗 레지스트리에 인증하도록 노드 구성

크리덴셜 설정에 대한 상세 지침은 사용하는 컨테이너 런타임 및 레지스트리에
따라 다르다. 가장 정확한 정보는 솔루션 설명서를 참조해야 한다.

프라이빗 컨테이너 이미지 레지스트리 구성 예시를 보려면, 
[프라이빗 레지스트리에서 이미지 가져오기](/docs/tasks/configure-pod-container/pull-image-private-registry/)를 참조한다. 
해당 예시는 도커 허브에서 제공하는 프라이빗 레지스트리를 사용한다.

### 인증된 이미지 풀을 위한 Kubelet 자격증명 제공자 {#kubelet-credential-provider}

kubelet에서 플러그인 바이너리를 호출하여 컨테이너 이미지에 대한 레지스트리 자격증명을
동적으로 가져오도록 설정할 수 있다. 이는 프라이빗 레지스트리에서 자격증명을 가져오는
가장 강력하고 다재다능한 방법이지만, 활성화하기
위해 kubelet 수준의 구성이 필요하다.

이 기법은 프라이빗 레지스트리에 호스팅된 컨테이너 이미지가 필요한 {{< glossary_tooltip term_id="static-pod" text="스태틱 파드" >}}를
실행할 때 특히 유용하다.
{{< glossary_tooltip term_id="service-account" >}} 또는
{{< glossary_tooltip term_id="secret" >}}을 사용하여 프라이빗 레지스트리
자격증명을 제공하는 것은 스태틱 파드의 명세에서는 불가능한데,
다른 API 리소스에 대한 참조를 가질 수 _없기_ 때문이다.

자세한 내용은 [kubelet 이미지 자격증명 제공자 설정하기](/docs/tasks/administer-cluster/kubelet-credential-provider/)를 참고한다.

### config.json 파일 해석 {#config-json}

`config.json` 파일의 해석에 있어서, 기존 도커의 구현과 쿠버네티스의
구현에 차이가 있다. 도커에서는 `auths` 키에 특정 루트 URL만 기재할 수 있으나,
쿠버네티스에서는 glob URL과 접두사-매칭
경로도 기재할 수 있다. 유일한 제한 사항은 glob 패턴(`*`)이
각 서브도메인에 대해 점(`.`)을 포함해야 한다는 것이다. 매치되는 서브도메인의 수는
glob 패턴(`*.`)의 수와 같아야 한다. 예를 들어,

- `*.kubernetes.io`는 `kubernetes.io`와는 매치되지 *않지만*,
  `abc.kubernetes.io`와는 매치된다.
- `*.*.kubernetes.io`는 `abc.kubernetes.io`와는 매치되지 *않지만*,
  `abc.def.kubernetes.io`와는 매치된다.
- `prefix.*.io`는 `prefix.kubernetes.io`와 매치된다.
- `*-good.kubernetes.io`는 `prefix-good.kubernetes.io`와 매치된다.

이는 곧 다음과 같은 `config.json`도 유효하다는 뜻이다.

```json
{
    "auths": {
        "my-registry.example/images": { "auth": "…" },
        "*.my-registry.example/images": { "auth": "…" }
    }
}
```

이미지 풀 작업 시, 모든 유효한 패턴에 대해 크리덴셜을 CRI 컨테이너 런타임에 제공할 것이다.
예를 들어 다음과 같은 컨테이너 이미지 이름은
성공적으로 매치될 것이다.

- `my-registry.example/images`
- `my-registry.example/images/my-image`
- `my-registry.example/images/another-image`
- `sub.my-registry.example/images/my-image`

하지만, 이러한 컨테이너 이미지 이름들은 일치하지 *않을 것이다*.

- `a.sub.my-registry.example/images/my-image`
- `a.b.sub.my-registry.example/images/my-image`

kubelet은 인식된 모든 크리덴셜을 순차적으로 이용하여 이미지 풀을 수행한다. 이것은
서로 다른 경로들에 대한 `config.json`의 여러 항목들 또한 가능함을 의미한다.

```json
{
    "auths": {
        "my-registry.example/images": {
            "auth": "…"
        },
        "my-registry.example/images/subpath": {
            "auth": "…"
        }
    }
}
```

이제 컨테이너가 `my-registry.example/images/subpath/my-image` 이미지를 풀해야
한다고 명시하면, kubelet은 인증 소스 중 하나가 실패할 경우 두 인증 소스를
모두 사용하여 다운로드를 시도한다.

### 미리 내려받은 이미지 {#pre-pulled-images}

{{< note >}}
이 방법은 노드의 구성을 제어할 수 있는 경우에만 적합하다. 이 방법은
클라우드 제공자가 노드를 관리하고 자동으로 교체한다면 안정적으로
작동하지 않을 것이다.
{{< /note >}}

기본적으로, kubelet은 지정된 레지스트리에서 각 이미지를 풀 하려고 한다.
그러나, 컨테이너의 `imagePullPolicy` 속성이 `IfNotPresent` 또는 `Never`으로 설정되어 있다면,
로컬 이미지가 사용된다(우선적으로 또는 배타적으로).

레지스트리 인증의 대안으로 미리 풀 된 이미지에 의존하고 싶다면,
클러스터의 모든 노드가 동일한 미리 내려받은 이미지를 가지고 있는지 확인해야 한다.

이것은 특정 이미지를 속도를 위해 미리 로드하거나 프라이빗 레지스트리에 대한
인증의 대안으로 사용될 수 있다.

[kubelet 자격증명 제공자](#kubelet-credential-provider)의 사용과 유사하게,
미리 내려받은 이미지는 프라이빗 레지스트리에 호스팅된 이미지에 의존하는
{{< glossary_tooltip text="스태틱 파드" term_id="static-pod" >}}를
실행하는 데에도 적합하다.

{{< note >}}
{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}
미리 내려받은 이미지에 대한 접근은 [이미지 풀 자격증명 검증 보장](#ensureimagepullcredentialverification)에 따라 인가될 수 있다.
{{< /note >}}

### 이미지 풀 자격증명 검증 보장 {#ensureimagepullcredentialverification}

{{< feature-state feature_gate_name="KubeletEnsureSecretPulledImages" >}}

클러스터에서 `KubeletEnsureSecretPulledImages` 기능 게이트가 활성화된 경우,
쿠버네티스는 풀을 위해 자격증명이 필요한 모든 이미지에 대해 이미지 자격증명을
검증할 것이다, 비록 해당 이미지가 이미 노드에 존재하더라도 마찬가지이다. 이 검증은
제공된 자격증명을 통해 성공적으로 풀되지 않은 파드 요청의 이미지가 레지스트리에서 이미지를
다시 풀해야 함을 보장한다.
또한, 이전에 성공적인 이미지 풀을 수행한 것과 동일한 자격증명을 재사용하는
이미지 풀은 레지스트리에서 다시 풀할 필요 없이 레지스트리에 접근하지 않고
로컬에서 검증된다
(이미지가 로컬에서 사용 가능한 경우).
이는 [Kubelet 설정](/docs/reference/config-api/kubelet-config.v1beta1/#kubelet-config-k8s-io-v1beta1-ImagePullCredentialsVerificationPolicy)의
`imagePullCredentialsVerificationPolicy` 필드로 제어된다.

이 설정은 이미지가 이미 노드에 있는 경우 이미지 풀 자격증명을
언제 검증해야 하는지를 제어한다.

* `NeverVerify`: 이 기능 게이트가 비활성화된 것과 동일한 동작을 한다.
   이미지가 로컬에 있으면, 이미지 풀 자격증명을 검증하지 않는다.
* `NeverVerifyPreloadedImages`: kubelet 외부에서 풀된 이미지는 검증하지 않지만,
다른 모든 이미지는 자격증명이 검증된다. 이것이 기본 동작이다.
* `NeverVerifyAllowListedImages`: kubelet 외부에서 풀되었고 kubelet 설정에
   지정된 `preloadedImagesVerificationAllowlist`에 언급된 이미지는 검증하지 않는다.
* `AlwaysVerify`: 모든 이미지는 사용되기 전에 자격증명이
   검증될 것이다.

이 검증은 [미리 내려받은 이미지](#미리-내려받은-이미지), 노드 전체 시크릿을
사용하여 풀된 이미지, 그리고 파드 수준 시크릿을 사용하여 풀된 이미지에 적용된다.

{{< note >}}
자격증명 로테이션의 경우, 이전에 이미지를 풀하는 데 사용된 자격증명은
레지스트리에 접근할 필요 없이 계속 검증된다. 새로운 또는 로테이션된 자격증명은
이미지를 레지스트리에서 다시 풀해야 한다.
{{< /note >}}

#### 처음으로 `KubeletEnsureSecretPulledImages` 활성화

kubelet 업그레이드 또는 기능의 명시적 활성화에 의해 `KubeletEnsureSecretPulledImages`가
처음으로 활성화되면, kubelet이 해당 시점에 접근할 수 있는 모든 이미지는
미리 내려받은 것으로 간주된다. 이는
kubelet이 풀된 이미지에 대한 기록이 없기 때문이다.
kubelet은 이미지가 처음 풀될 때부터
이미지 풀 기록을 만들 수 있다.

이것이 우려되는 경우, 기능을 활성화하기 전에 미리 내려받은 것으로 간주되어서는
안 되는 모든 이미지를 노드에서 정리하는 것이 좋다.

이미지 풀 기록을 보관하는 디렉터리를 제거하면 kubelet 재시작 시 동일한 효과가
발생한다. 특히 컨테이너 런타임에 의해 현재 노드에 캐시된 이미지는 모두
미리 내려받은 것으로 간주된다.

### 도커 구성으로 시크릿 생성

레지스트리에 인증하기 위해서는, 레지스트리 호스트네임 뿐만 아니라, 
사용자 이름, 비밀번호 및 클라이언트 이메일 주소를 알아야 한다.
대문자 값을 적절히 대체하여, 다음 커맨드를 실행한다.

```shell
kubectl create secret docker-registry <name> \
  --docker-server=<docker-registry-server> \
  --docker-username=<docker-user> \
  --docker-password=<docker-password> \
  --docker-email=<docker-email>
```

만약 도커 자격 증명 파일이 이미 존재한다면, 위의 명령을 사용하지 않고,
자격 증명 파일을 쿠버네티스 {{< glossary_tooltip text="시크릿" term_id="secret" >}}으로
가져올 수 있다.
[기존 도커 자격 증명으로 시크릿 생성](/docs/tasks/configure-pod-container/pull-image-private-registry/#registry-secret-existing-credentials)에서
관련 방법을 설명하고 있다.

`kubectl create secret docker-registry`는
하나의 프라이빗 레지스트리에서만 작동하는 시크릿을 생성하기 때문에,
여러 프라이빗 컨테이너 레지스트리를 사용하는 경우 특히 유용하다.

{{< note >}}
파드는 이미지 풀 시크릿을 자신의 네임스페이스에서만 참조할 수 있다.
따라서 이 과정은 네임스페이스 당 한 번만 수행될 필요가 있다.
{{< /note >}}

#### 파드의 `imagePullSecrets` 참조

이제, `imagePullSecrets` 섹션을 파드의 정의에 추가함으로써 해당 시크릿을
참조하는 파드를 생성할 수 있다. `imagePullSecrets` 배열의 각 항목은
동일한 네임스페이스의 하나의 시크릿만 참조할 수 있다.

예를 들면 다음과 같다.

```shell
cat <<EOF > pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: foo
  namespace: awesomeapps
spec:
  containers:
    - name: foo
      image: janedoe/awesomeapp:v1
  imagePullSecrets:
    - name: myregistrykey
EOF

cat <<EOF >> ./kustomization.yaml
resources:
- pod.yaml
EOF
```

이것은 프라이빗 레지스트리를 사용하는 각 파드에 대해서 수행될 필요가 있다.

그러나, [서비스어카운트(ServiceAccount)](/docs/tasks/configure-pod-container/configure-service-account/)
리소스에 `imagePullSecrets` 섹션을 설정하여 이 과정을
자동화할 수 있다. 자세한 지침을 위해서는 [서비스어카운트에 ImagePullSecrets 추가](/docs/tasks/configure-pod-container/configure-service-account/#add-imagepullsecrets-to-a-service-account)를
확인한다.

이것은 노드 당 `.docker/config.json`와 함께 사용할 수 있다. 자격 증명은
병합될 것이다.

## 유스케이스

프라이빗 레지스트리를 구성하기 위한 많은 솔루션이 있다. 다음은 여러 가지
일반적인 유스케이스와 제안된 솔루션이다.

1. 비소유 이미지(예를 들어, 오픈소스)만 실행하는 클러스터의 경우. 이미지를 숨길 필요가 없다.
   - 퍼블릭 레지스트리의 퍼블릭 이미지를 사용한다.
     - 설정이 필요 없다.
     - 일부 클라우드 제공자는 퍼블릭 이미지를 자동으로 캐시하거나 미러링하므로, 가용성이 향상되고
       이미지를 가져오는 시간이 줄어든다.
1. 모든 클러스터 사용자에게는 보이지만, 회사 외부에는 숨겨야하는 일부 독점 이미지를
   실행하는 클러스터의 경우.
   - 호스트된 프라이빗 레지스트리를 사용한다.
     - 프라이빗 레지스트리에 접근해야 하는 노드에 수동 설정이 필요할 수 있다
   - 또는, 방화벽 뒤에서 읽기 접근 권한을 가진 내부 프라이빗 레지스트리를 실행한다.
     - 쿠버네티스 구성은 필요하지 않다.
   - 이미지 접근을 제어하는 호스팅된 컨테이너 이미지 레지스트리 서비스를 사용한다.
     - 그것은 수동 노드 구성에 비해서 클러스터 오토스케일링과 더 잘 동작할 것이다.
   - 또는, 노드의 구성 변경이 불편한 클러스터에서는, `imagePullSecrets`를 사용한다.
1. 독점 이미지를 가진 클러스터로, 그 중 일부가 더 엄격한 접근 제어를 필요로 하는 경우.
   - [AlwaysPullImages 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)가
     활성화되어 있는지 확인한다. 그렇지 않으면, 모든 파드가 잠재적으로 모든 이미지에 접근 권한을 가진다.
   - 민감한 데이터는 이미지 안에 포장하는 대신, "시크릿" 리소스로 이동한다.
1. 멀티-테넌트 클러스터에서 각 테넌트가 자신의 프라이빗 레지스트리를 필요로 하는 경우.
   - [AlwaysPullImages 어드미션 컨트롤러](/docs/reference/access-authn-authz/admission-controllers/#alwayspullimages)가
     활성화되어 있는지 확인한다. 그렇지 않으면, 모든 파드가 잠재적으로 모든 이미지에 접근 권한을 가진다.
   - 인가가 요구되도록 프라이빗 레지스트리를 실행한다.
   - 각 테넌트에 대한 레지스트리 자격 증명을 생성하고, 시크릿에 넣고,
     각 테넌트 네임스페이스에 시크릿을 채운다.
   - 테넌트는 해당 시크릿을 각 네임스페이스의 `imagePullSecrets`에 추가한다.

다중 레지스트리에 접근해야 하는 경우, 각 레지스트리에 대해 하나의 시크릿을 생성할 수 있다.

## 레거시 내장 kubelet 자격증명 제공자

이전 버전의 쿠버네티스에서는, kubelet이 클라우드 제공자 자격증명과
직접 통합되어 있었다. 이를 통해 이미지 레지스트리에 대한 자격증명을
동적으로 가져올 수 있었다.

kubelet 자격증명 제공자 통합에는 ACR(Azure Container Registry),
ECR(Elastic Container Registry), GCR(Google Container Registry)의
세 가지 내장 구현이 있었다.

쿠버네티스 버전 1.26부터 레거시 메커니즘이 제거되었으므로,
다음 중 하나를 수행해야 한다.
- 각 노드에 kubelet 이미지 자격증명 제공자를 구성하거나
- `imagePullSecrets`과 하나 이상의 시크릿을 사용하여 이미지 풀 자격증명을 지정한다.

## {{% heading "whatsnext" %}}

* [OCI 이미지 매니페스트 명세](https://github.com/opencontainers/image-spec/blob/main/manifest.md) 읽어보기.
* [컨테이너 이미지 가비지 수집(garbage collection)](/docs/concepts/architecture/garbage-collection/#container-image-garbage-collection)에 대해 배우기.
* [프라이빗 레지스트리에서 이미지 받아오기](/docs/tasks/configure-pod-container/pull-image-private-registry)에 대해 자세히 알아보기.
