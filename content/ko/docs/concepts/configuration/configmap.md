---
title: 컨피그맵(ConfigMap)
content_template: templates/concept
weight: 20
---

{{% capture overview %}}

{{< glossary_definition term_id="configmap" prepend="컨피그맵은" length="all" >}}

{{< caution >}}
컨피그맵은 보안 또는 암호화를 제공하지 않는다.
저장하려는 데이터가 기밀인 경우, 컨피그맵
대신 {{< glossary_tooltip text="시크릿(Secret)" term_id="secret" >}} 또는 추가(써드파티) 도구를
사용하여 데이터를 비공개로 유지하자.
{{< /caution >}}

{{% /capture %}}

{{% capture body %}}
## 사용 동기

애플리케이션 코드와 별도로 구성 데이터를 설정하려면 컨피그맵을 사용하자.

예를 들어, 자신의 컴퓨터(개발용)와 클라우드(실제 트래픽 처리)에서
실행할 수 있는 애플리케이션을 개발한다고 가정해보자.
`DATABASE_HOST` 라는
환경 변수를 찾기 위해 코드를 작성한다. 로컬에서는 해당 변수를
`localhost` 로 설정한다. 클라우드에서는, 데이터베이스
컴포넌트를 클러스터에 노출하는 쿠버네티스 {{< glossary_tooltip text="서비스" term_id="service" >}}를 참조하도록
설정한다.

이를 통해 클라우드에서 실행 중인 컨테이너 이미지를 가져와
필요한 경우 정확히 동일한 코드를 로컬에서 디버깅할 수 있다.

## 컨피그맵 오브젝트

컨피그맵은 다른 오브젝트가 사용할 구성을 저장할 수 있는
API [오브젝트](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/)이다.
`spec` 이 있는 대부분의 쿠버네티스 오브젝트와 달리,
컨피그맵에는 항목(키)과 해당 값을 저장하는 `data` 섹션이 있다.

컨피그맵의 이름은 유효한
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.

## 컨피그맵과 파드(Pod)

컨피그맵을 참조하는 파드 `spec` 을 작성하고 컨피그맵의 데이터를
기반으로 해당 파드의 컨테이너를 구성할 수 있다. 파드와 컨피그맵은
동일한 {{< glossary_tooltip text="네임스페이스" term_id="namespace" >}}에 있어야 한다.

다음은 단일 값을 가진 키와,
값이 구성 형식의 일부처럼 보이는 키를 가진 컨피그맵의
예시이다.

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  Name: game-demo
data:
  # 속성과 비슷한 키; 각 키는 간단한 값으로 매핑됨
  player_initial_lives: 3
  ui_properties_file_name: "user-interface.properties"
  #
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

1. 컨테이너의 엔트리포인트에 대한 커맨드 라인 인수
1. 컨테이너에 대한 환경 변수
1. 애플리케이션이 읽을 수 있도록 읽기 전용 볼륨에 파일 추가
1. 쿠버네티스 API를 사용하여 컨피그맵을 읽는 파드 내에서 실행할 코드 작성

이러한 방법들은 소비되는 데이터를 모델링하는
방식에 따라 다르게 쓰인다.
처음 세 가지 방법의 경우,
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}은 파드의 컨테이너를 시작할 때
시크릿의 데이터를 사용한다.

네 번째 방법은 시크릿과 데이터를 읽기 위해 코드를 작성해야 한다는 것을 의미한다.
그러나, 쿠버네티스 API를 직접 사용하기 때문에, 애플리케이션은
컨피그맵이 변경될 때마다 업데이트를 받기 위해 구독할 수 있고, 업데이트가
있으면 반응한다. 쿠버네티스 API에 직접 접근하면, 이
기술을 사용하여 다른 네임스페이스의 컨피그맵에 접근할 수도 있다.

다음은 `game-demo` 의 값을 사용하여 파드를 구성하는 파드 예시이다.
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: configmap-demo-pod
spec:
  containers:
    - name: demo
      image: game.example/demo-game
      env:
        # 환경 변수 정의
        - name: PLAYER_INITIAL_LIVES # 참고로 여기서는 컨피그맵의 키 이름과
                                     # 대소문자가 다르다.
          valueFrom:
            configMapKeyRef:
              name: game-demo           # 이 값의 컨피그맵.
              key: player_initial_lives # 가져올 키.
        - name: UI_PROPERTIES_FILE_NAME
          valueFrom:
            configMapKeyRef:
              name: game-demo
              key: ui_properties_file_name
      volumeMounts:
      - name: config
        mountPath: "/config"
        readOnly: true
  volumes:
    # 파드 레벨에서 볼륨을 설정한 다음, 해당 파드 내의 컨테이너에 마운트한다.
    - name: config
      configMap:
        # 마운트하려는 컨피그맵의 이름을 제공한다.
        name: game-demo
```


컨피그맵은 단일 라인 속성(single line property) 값과 멀티 라인의 파일과 비슷한(multi-line file-like) 값을
구분하지 않는다.
더 중요한 것은 파드와 다른 오브젝트가 이러한 값을 소비하는 방식이다.
이 예제에서, 볼륨을 정의하고 `demo` 컨테이너에
`/config` 로 마운트하면 4개의 파일이 생성된다.

- `/config/player_initial_lives`
- `/config/ui_properties_file_name`
- `/config/game.properties`
- `/config/user-interface.properties`

`/config` 에 `.properties` 확장자를 가진 파일만
포함시키려면, 두 개의 다른 컨피그맵을 사용하고, 파드에
대해서는 `spec` 의 두 컨피그맵을 참조한다. 첫 번째 컨피그맵은
`player_initial_lives` 와 `ui_properties_file_name` 을 정의한다. 두 번째
컨피그맵은 kubelet이 `/config` 에 넣는 파일을 정의한다.

{{< note >}}
컨피그맵을 사용하는 가장 일반적인 방법은 동일한 네임스페이스의
파드에서 실행되는 컨테이너에 대한 설정을 구성하는 것이다. 컨피그맵을
별도로 사용할 수도 있다.

예를 들어,
컨피그맵에 기반한 동작을 조정하는 {{< glossary_tooltip text="애드온" term_id="addons" >}}이나
{{< glossary_tooltip text="오퍼레이터" term_id="operator-pattern" >}}를
사용할 수도 있다.
{{< /note >}}


{{% /capture %}}
{{% capture whatsnext %}}

* [시크릿](/docs/concepts/configuration/secret/)에 대해 읽어본다.
* [컨피그맵을 사용하도록 파드 구성하기](/docs/tasks/configure-pod-container/configure-pod-configmap/)를 읽어본다.
* 코드를 구성에서 분리하려는 동기를 이해하려면
  [Twelve-Factor 앱](https://12factor.net/ko/)을 읽어본다.

{{% /capture %}}
