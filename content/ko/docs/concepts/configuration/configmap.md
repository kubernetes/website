---
title: 컨피그맵(ConfigMap)
content_type: concept
weight: 20
---

<!-- overview -->

{{< glossary_definition term_id="configmap" prepend="컨피그맵은" length="all" >}}

{{< caution >}}
컨피그맵은 보안 또는 암호화를 제공하지 않는다.
저장하려는 데이터가 기밀인 경우, 컨피그맵
대신 {{< glossary_tooltip text="시크릿(Secret)" term_id="secret" >}} 또는 추가(써드파티) 도구를
사용하여 데이터를 비공개로 유지하자.
{{< /caution >}}

<!-- body -->
## 사용 동기

애플리케이션 코드와 별도로 구성 데이터를 설정하려면 컨피그맵을 사용하자.

예를 들어, 자신의 컴퓨터(개발용)와 클라우드(실제 트래픽 처리)에서
실행할 수 있는 애플리케이션을 개발한다고 가정해보자.
`DATABASE_HOST` 라는 환경 변수를 찾기 위해 코드를 작성한다.
로컬에서는 해당 변수를 `localhost` 로 설정한다. 클라우드에서는, 데이터베이스
컴포넌트를 클러스터에 노출하는 쿠버네티스 {{< glossary_tooltip text="서비스" term_id="service" >}}를
참조하도록 설정한다.
이를 통해 클라우드에서 실행 중인 컨테이너 이미지를 가져와
필요한 경우 정확히 동일한 코드를 로컬에서 디버깅할 수 있다.

컨피그맵은 많은 양의 데이터를 보유하도록 설계되지 않았다. 컨피그맵에 저장된
데이터는 1MiB를 초과할 수 없다. 이 제한보다 큰 설정을
저장해야 하는 경우, 볼륨을 마운트하는 것을 고려하거나 별도의
데이터베이스 또는 파일 서비스를 사용할 수 있다.

## 컨피그맵 오브젝트

컨피그맵은 다른 오브젝트가 사용할 구성을 저장할 수 있는
API [오브젝트](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/)이다.
`spec` 이 있는 대부분의 쿠버네티스 오브젝트와 달리, 컨피그맵에는 `data` 및 `binaryData`
필드가 있다. 이러한 필드는 키-값 쌍을 값으로 허용한다. `data` 필드와
`binaryData` 는 모두 선택 사항이다. `data` 필드는
UTF-8 문자열을 포함하도록 설계되었으며 `binaryData` 필드는 바이너리
데이터를 base64로 인코딩된 문자열로 포함하도록 설계되었다.

컨피그맵의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

`data` 또는 `binaryData` 필드 아래의 각 키는
영숫자 문자, `-`, `_` 또는 `.` 으로 구성되어야 한다. `data` 에 저장된 키는
`binaryData` 필드의 키와 겹치지 않아야 한다.

v1.19부터 컨피그맵 정의에 `immutable` 필드를 추가하여
[변경할 수 없는 컨피그맵](#configmap-immutable)을 만들 수 있다.

## 컨피그맵과 파드

컨피그맵을 참조하는 파드 `spec` 을 작성하고 컨피그맵의 데이터를
기반으로 해당 파드의 컨테이너를 구성할 수 있다. 파드와 컨피그맵은
동일한 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에 있어야 한다.

{{< note >}}
{{< glossary_tooltip text="스태틱(static) 파드" term_id="static-pod" >}}의 `spec`은 컨피그맵
또는 다른 API 오브젝트를 참조할 수 없다.
{{< /note >}}

다음은 단일 값을 가진 키와,
값이 구성 형식의 일부처럼 보이는 키를 가진 컨피그맵의
예시이다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: game-demo
data:
  # 속성과 비슷한 키; 각 키는 간단한 값으로 매핑됨
  player_initial_lives: "3"
  ui_properties_file_name: "user-interface.properties"

  # 파일과 비슷한 키
  game.properties: |
    enemy.types=aliens,monsters
    player.maximum-lives=5
  user-interface.properties: |
    color.good=purple
    color.bad=yellow
    allow.textmode=true
```

컨피그맵을 사용하여 파드 내부에 컨테이너를 구성할 수 있는
네 가지 방법이 있다.

1. 컨테이너 커맨드와 인수 내에서
1. 컨테이너에 대한 환경 변수
1. 애플리케이션이 읽을 수 있도록 읽기 전용 볼륨에 파일 추가
1. 쿠버네티스 API를 사용하여 컨피그맵을 읽는 파드 내에서 실행할 코드 작성

이러한 방법들은 소비되는 데이터를 모델링하는
방식에 따라 다르게 쓰인다.
처음 세 가지 방법의 경우,
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}은 파드의 컨테이너를 시작할 때
컨피그맵의 데이터를 사용한다.

네 번째 방법은 컨피그맵과 데이터를 읽기 위해 코드를 작성해야 한다는 것을 의미한다.
그러나, 쿠버네티스 API를 직접 사용하기 때문에, 애플리케이션은
컨피그맵이 변경될 때마다 업데이트를 받기 위해 구독할 수 있고, 업데이트가
있으면 반응한다. 쿠버네티스 API에 직접 접근하면, 이
기술을 사용하여 다른 네임스페이스의 컨피그맵에 접근할 수도 있다.

다음은 `game-demo` 의 값을 사용하여 파드를 구성하는 파드 예시이다.

{{< codenew file="configmap/configure-pod.yaml" >}}

컨피그맵은 단일 라인 속성(single line property) 값과 멀티 라인의 파일과 비슷한(multi-line file-like) 값을
구분하지 않는다.
더 중요한 것은 파드와 다른 오브젝트가 이러한 값을 소비하는 방식이다.

이 예제에서, 볼륨을 정의하고 `demo` 컨테이너에
`/config` 로 마운트하면 컨피그맵에 4개의 키가 있더라도
`/config/game.properties` 와 `/config/user-interface.properties`
2개의 파일이 생성된다. 이것은 파드 정의가
`volume` 섹션에서 `items` 배열을 지정하기 때문이다.
`items` 배열을 완전히 생략하면, 컨피그맵의 모든 키가
키와 이름이 같은 파일이 되고, 4개의 파일을 얻게 된다.

## 컨피그맵 사용하기

컨피그맵은 데이터 볼륨으로 마운트할 수 있다. 컨피그맵은 파드에 직접적으로
노출되지 않고, 시스템의 다른 부분에서도 사용할 수 있다. 예를 들어,
컨피그맵은 시스템의 다른 부분이 구성을 위해 사용해야 하는 데이터를 보유할 수 있다.

컨피그맵을 사용하는 가장 일반적인 방법은 동일한 네임스페이스의
파드에서 실행되는 컨테이너에 대한 설정을 구성하는 것이다. 컨피그맵을
별도로 사용할 수도 있다.

예를 들어,
컨피그맵에 기반한 동작을 조정하는 {{< glossary_tooltip text="애드온" term_id="addons" >}}이나
{{< glossary_tooltip text="오퍼레이터" term_id="operator-pattern" >}}를
사용할 수도 있다.

### 파드에서 컨피그맵을 파일로 사용하기

파드의 볼륨에서 컨피그맵을 사용하려면 다음을 수행한다.

1. 컨피그맵을 생성하거나 기존 컨피그맵을 사용한다. 여러 파드가 동일한 컨피그맵을
   참조할 수 있다.
1. 파드 정의를 수정해서 `.spec.volumes[]` 아래에 볼륨을 추가한다. 볼륨 이름은
   원하는 대로 정하고, 컨피그맵 오브젝트를 참조하도록 `.spec.volumes[].configMap.name`
   필드를 설정한다.
1. 컨피그맵이 필요한 각 컨테이너에 `.spec.containers[].volumeMounts[]` 를
   추가한다. `.spec.containers[].volumeMounts[].readOnly = true` 를 설정하고
   컨피그맵이 연결되기를 원하는 곳에 사용하지 않은 디렉터리 이름으로
   `.spec.containers[].volumeMounts[].mountPath` 를 지정한다.
1. 프로그램이 해당 디렉터리에서 파일을 찾도록 이미지 또는 커맨드 라인을
   수정한다. 컨피그맵의 `data` 맵 각 키는 `mountPath` 아래의
   파일 이름이 된다.

다음은 볼륨에 컨피그맵을 마운트하는 파드의 예시이다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mypod
spec:
  containers:
  - name: mypod
    image: redis
    volumeMounts:
    - name: foo
      mountPath: "/etc/foo"
      readOnly: true
  volumes:
  - name: foo
    configmap:
      name: myconfigmap
```

사용하려는 각 컨피그맵은 `.spec.volumes` 에서 참조해야 한다.

파드에 여러 컨테이너가 있는 경우 각 컨테이너에는 자체 `volumeMounts` 블록이 필요하지만,
컨피그맵은 각 컨피그맵 당 하나의 `.spec.volumes` 만 필요하다.

#### 마운트된 컨피그맵이 자동으로 업데이트

현재 볼륨에서 사용된 컨피그맵이 업데이트되면, 프로젝션된 키도 마찬가지로 업데이트된다.
kubelet은 모든 주기적인 동기화에서 마운트된 컨피그맵이 최신 상태인지 확인한다.
그러나, kubelet은 로컬 캐시를 사용해서 컨피그맵의 현재 값을 가져온다.
캐시 유형은 [KubeletConfiguration 구조체](/docs/reference/config-api/kubelet-config.v1beta1/)의
`ConfigMapAndSecretChangeDetectionStrategy` 필드를 사용해서 구성할 수 있다.
컨피그맵은 watch(기본값), ttl 기반 또는 API 서버로 직접
모든 요청을 리디렉션할 수 있다.
따라서 컨피그맵이 업데이트되는 순간부터 새 키가 파드에 업데이트되는 순간까지의
총 지연시간은 kubelet 동기화 기간 + 캐시 전파 지연만큼 길 수 있다. 여기서 캐시
전파 지연은 선택한 캐시 유형에 따라 달라질 수 있다(전파
지연을 지켜보거나, 캐시의 ttl 또는 0에 상응함).

환경 변수로 사용되는 컨피그맵은 자동으로 업데이트되지 않으며 파드를 다시 시작해야 한다.

{{< note >}}
컨피그맵을 [subPath](/ko/docs/concepts/storage/volumes/#using-subpath) 볼륨 마운트로 사용하는 컨테이너는 컨피그맵 업데이트를 받지 못할 것이다.
{{< /note >}}

## 변경할 수 없는(immutable) 컨피그맵 {#configmap-immutable}

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

쿠버네티스 기능인 _변경할 수 없는 시크릿과 컨피그맵_ 은 개별 시크릿과
컨피그맵을 변경할 수 없는 것으로 설정하는 옵션을 제공한다. 컨피그맵을 광범위하게
사용하는 클러스터(최소 수만 개의 고유한 컨피그맵이 파드에 마운트)의 경우
데이터 변경을 방지하면 다음과 같은 이점이 있다.

- 애플리케이션 중단을 일으킬 수 있는 우발적(또는 원하지 않는) 업데이트로부터 보호
- immutable로 표시된 컨피그맵에 대한 감시를 중단하여, kube-apiserver의 부하를 크게 줄임으로써
  클러스터의 성능을 향상시킴

이 기능은 `ImmutableEphemeralVolumes`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)에 의해 제어된다.
`immutable` 필드를 `true` 로 설정하여 변경할 수 없는 컨피그맵을 생성할 수 있다.
다음은 예시이다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  ...
data:
  ...
immutable: true
```

컨피그맵을 immutable로 표시하면, 이 변경 사항을 되돌리거나
`data` 또는 `binaryData` 필드 내용을 변경할 수 _없다_. 컨피그맵만
삭제하고 다시 작성할 수 있다. 기존 파드는 삭제된 컨피그맵에 대한 마운트 지점을
유지하므로, 이러한 파드를 다시 작성하는 것을 권장한다.

## {{% heading "whatsnext" %}}

* [시크릿](/ko/docs/concepts/configuration/secret/)에 대해 읽어본다.
* [컨피그맵을 사용하도록 파드 구성하기](/docs/tasks/configure-pod-container/configure-pod-configmap/)를 읽어본다.
* [컨피그맵 (또는 어떠한 쿠버네티스 오브젝트) 변경하기](/docs/tasks/manage-kubernetes-objects/update-api-object-kubectl-patch/)를 읽어본다.
* 코드를 구성에서 분리하려는 동기를 이해하려면
  [Twelve-Factor 앱](https://12factor.net/ko/)을 읽어본다.
