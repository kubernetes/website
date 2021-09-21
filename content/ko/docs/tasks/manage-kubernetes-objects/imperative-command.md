---
title: 명령형 커맨드를 이용한 쿠버네티스 오브젝트 관리하기
content_type: task
weight: 30
---

<!-- overview -->
쿠버네티스 오브젝트는 `kubectl` 커맨드 라인 툴 속에 내장된 명령형 커맨드를 이용함으로써
바로 신속하게 생성, 업데이트 및 삭제할 수 있다. 이 문서는 어떻게 커맨드가 구성되어 있으며,
이를 사용하여 활성 오브젝트를 어떻게 관리하는 지에 대해 설명한다.


## {{% heading "prerequisites" %}}

[`kubectl`](/ko/docs/tasks/tools/)을 설치한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 트레이드 오프

`kubectl`툴은 3가지 종류의 오브젝트 관리를 지원한다.

* 명령형 커맨드
* 명령형 오브젝트 구성
* 선언형 오브젝트 구성

각 종류별 오브젝트 관리의 장점과 단점에 대한 논의는 [쿠버네티스 오브젝트 관리](/ko/docs/concepts/overview/working-with-objects/object-management/)
를 참고한다.

## 오브젝트 생성 방법

`kubectl` 툴은 가장 일반적인 오브젝트 타입을 생성하는데 동사 형태 기반의 커맨드를
지원한다. 쿠버네티스 오브젝트 타입에 익숙하지 않은 사용자가 인지할 수 있도록 커맨드
이름이 지어졌다.

- `run`: 컨테이너를 실행할 새로운 파드를 생성한다.
- `expose`: 파드에 걸쳐 트래픽을 로드 밸런스하도록 새로운 서비스 오브젝트를 생성한다.
- `autoscale`: 디플로이먼트와 같이, 하나의 컨트롤러에 대해 자동으로 수평적 스케일이 이루어 지도록 새로운 Autoscaler 오브젝트를 생성한다.

또한 `kubectl` 툴은 오브젝트 타입에 의해 구동되는 생성 커맨드를 지원한다.
이러한 커맨드는 더 많은 오브젝트 타입을 지원해주며 그 의도하는 바에 대해
보다 명확하게 해주지만, 사용자가 생성하고자 하는 오브젝트 타입에 대해
알 수 있도록 해야 한다.

- `create <오브젝트 타입> [<서브 타입>] <인스턴스명>`

일부 오브젝트 타입은 `create` 커맨드 내 정의할 수 있는 서브 타입을 가진다.
예를 들어, 서비스 오브젝트는 ClusterIP, LoadBalancer 및 NodePort 등을
포함하는 여러 서브 타입을 가진다, 다음은 NodePort 서브 타입을 통해 서비스를
생성하는 예제이다.

```shell
kubectl create service nodeport <사용자 서비스 명칭>
```

이전 예제에서, `create service nodeport` 커맨드는
`create service` 커맨드의 서브 커맨드라고 칭한다.

`-h` 플래그를 사용하여 서브 커맨드에 의해 지원되는 인수 및 플래그를
찾아 볼 수 있다.

```shell
kubectl create service nodeport -h
```

## 오브젝트 업데이트 방법

`kubectl` 커맨드는 일반적인 몇몇의 업데이트 작업을 위해 동사 형태 기반의 커맨드를 지원한다.
이 커맨드는 쿠버네티스 오브젝트에 익숙하지 않은 사용자가 설정되어야
하는 특정 필드를 모르는 상태에서도 업데이트를 수행할 수 있도록
이름 지어졌다.

- `scale`: 컨트롤러의 레플리카 수를 업데이트 함으로써 파드를 추가 또는 제거하는 컨트롤러를 수평적으로 스케일한다.
- `annotate`: 오브젝트로부터 어노테이션을 추가 또는 제거한다.
- `label`: 오브젝트에서 레이블을 추가 또는 제거한다.

`kubectl` 커맨드는 또한 오브젝트 측면에서 구동되는 업데이트 커맨드를 지원한다.
이 측면의 설정은 다른 오브젝트 타입에 대한 다른 필드를 설정 할 수도 있다.

- `set` `<field>`: 오브젝트의 측면을 설정한다.

{{< note >}}
쿠버네티스 1.5 버전에서는 모든 동사 형태 기반의 커맨드가 관련된 측면 중심의 커맨드를 가지는 것은 아니다.
{{< /note >}}

`kubectl` 툴은 활성 오브젝트를 직접 업데이트하기 위해 추가적인 방법을 지원하지만,
쿠버네티스 오브젝트 스키마에 대한 추가적인 이해를 요구한다.

- `edit`: 편집기에서 구성을 열어 활성 오브젝트에 대한 원래 그대로의 구성을 바로 편집한다.
- `patch`: 패치 문자열를 사용하여 활성 오브젝트를 바로 편집한다.
패치 문자열에 대한 보다 자세한 정보를 보려면
[API 규정](https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#patch-operations)에서 패치 섹션을 참고한다.

## 오브젝트 삭제 방법

클러스터에서 오브젝트를 삭제하기 위해 `delete` 커맨드을 사용할 수 있다.

- `delete <타입>/<이름>`

{{< note >}}
명령형 커맨드와 명령형 오브젝트 구성 모두 `kubectl delete`를 사용할 수
있다. 차이점은 커맨드에 전해지는 인수에 있다. 명령형 커맨드로
`kubectl delete`을 사용하기 위해, 삭제할 오브젝트를 인수로 전한다.
다음은 nginx라는 디플로이먼트 오브젝트를 전하는 예제이다.
{{< /note >}}

```shell
kubectl delete deployment/nginx
```

## 오브젝트 확인 방법

{{< comment >}}
TODO(pwittrock): 구현이 이루어지면 주석을 해제한다.

오브젝트의 특정 필드를 출력하기 위해 `kubectl view`를 사용할 수 있다.

- `view`: 오브젝트의 특정 필드의 값을 출력한다.

{{< /comment >}}



오브젝트에 대한 정보를 출력하는 몇 가지 커맨드가 있다.

- `get`: 일치하는 오브젝트에 대한 기본 정보를 출력한다. 옵션 리스트를 확인하기 위해 `get -h`를 사용한다.
- `describe`: 일치하는 오브젝트에 대해 수집한 상세한 정보를 출력한다.
- `logs`: 파드에서 실행 중인 컨테이너에 대한 stdout과 stderr를 출력한다.

## 생성 전 오브젝트 수정을 위해 `set` 커맨드 사용하기

`create` 커맨드에 사용할 수 있는 플래그가 없는 몇 가지 오브젝트
필드가 있다. 이러한 경우, 오브젝트 생성 전에 필드에 대한 값을
정의하기 위해 `set`과 `create`을 조합해서 사용할 수 있다.
이는 `set` 커맨드에 `create` 커맨드의 출력을 파이프 함으로써 수행할 수 있다.
다음은 관련 예제이다.

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client | kubectl set selector --local -f - 'environment=qa' -o yaml | kubectl create -f -
```

1. `kubectl create service -o yaml --dry-run=client` 커맨드는 서비스에 대한 구성을 생성하지만, 이를 쿠버네티스 API 서버에 전송하는 대신 YAML 형식으로 stdout에 출력한다.
1. `kubectl set selector --local -f - -o yaml` 커맨드는 stdin으로부터 구성을 읽어, YAML 형식으로 stdout에 업데이트된 구성을 기록한다.
1. `kubectl create -f -` 커맨드는 stdin을 통해 제공된 구성을 사용하여 오브젝트를 생성한다.

## 생성 전 오브젝트 수정을 위해 `--edit` 사용하기

생성 전에 오브젝트에 임의의 변경을 가하기 위해 `kubectl create --edit` 을 사용할 수 있다.
다음은 관련 예제이다.

```sh
kubectl create service clusterip my-svc --clusterip="None" -o yaml --dry-run=client > /tmp/srv.yaml
kubectl create --edit -f /tmp/srv.yaml
```

1. `kubectl create service` 커맨드는 서비스에 대한 구성을 생성하고 이를 `/tmp/srv.yaml`에 저장한다.
1. `kubectl create --edit` 커맨드는 오브젝트를 생성하기 전에 편집을 위해 구성파일을 열어준다.



## {{% heading "whatsnext" %}}


* [오브젝트 구성을 이용하여 쿠버네티스 관리하기(명령형)](/ko/docs/tasks/manage-kubernetes-objects/imperative-config/)
* [오브젝트 구성을 이용하여 쿠버네티스 관리하기(선언형)](/ko/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 커맨드 참조](/docs/reference/generated/kubectl/kubectl-commands/)
* [쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
