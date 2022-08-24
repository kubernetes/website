---
title: 구성 파일을 이용한 명령형 쿠버네티스 오브젝트 관리
content_type: task
weight: 40
---

<!-- overview -->
쿠버네티스 오브젝트는 YAML 또는 JSON으로 작성된 오프젝트 구성 파일과 함께 `kubectl`
커맨드 라인 툴을 이용하여 생성, 업데이트 및 삭제할 수 있다.
이 문서는 구성 파일을 이용하여 어떻게 오브젝트를 정의하고 관리할 수 있는지에 대해 설명한다.


## {{% heading "prerequisites" %}}


[`kubectl`](/ko/docs/tasks/tools/)을 설치한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 트레이드 오프

`kubectl` 툴은 3가지 종류의 오브젝트 관리를 지원한다.

* 명령형 커맨드
* 명령형 오브젝트 구성
* 선언형 오브젝트 구성

각 종류별 오브젝트 관리의 장점과 단점에 대한 논의는
[쿠버네티스 오브젝트 관리](/ko/docs/concepts/overview/working-with-objects/object-management/)를 참고한다.

## 오브젝트 생성 방법

구성 파일로부터 오브젝트를 생성하기 위해 `kubectl create -f`를 사용할 수 있다.
보다 상세한 정보는 [쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)를
참조한다.

* `kubectl create -f <파일명|url>`

## 오브젝트 업데이트 방법

{{< warning >}}
`replace` 커맨드로 오브젝트를 업데이트 하게되면,
구성 파일에 정의되지 않은 스펙의 모든 부분이 삭제된다. 이는
`externalIPs`필드가 구성 파일로부터 독립적으로 관리되는
`LoadBalancer`타입의 서비스와 같이, 클러스터 의해 부분적으로
관리되는 스펙의 오브젝트와 함께 사용되어서는 안된다.
독립적으로 관리되는 필드는 `replace`로 삭제되는 것을 방지하기 위해
구성 파일에 복사되어져야만 한다.
{{< /warning >}}

구성 파일에 따라 활성 오브젝트를 업데이트하기 위해 `kubectl replace -f`
를 사용할 수 있다.

* `kubectl replace -f <파일명|url>`

## 오브젝트 삭제 방법

구성 파일에 정의한 오브젝트를 삭제하기 위해 `kubectl delete -f`를
사용할 수 있다.

* `kubectl delete -f <파일명|url>`

{{< note >}}
구성 파일이 `metadata` 섹션에서 `name` 필드 대신 `generateName`
필드를 지정한 경우, `kubectl delete -f <filename|url>` 을 사용하여
오브젝트를 삭제할 수 없다.
오브젝트를 삭제하려면 다른 플래그를 사용해야 한다. 예를 들면, 다음과 같다.

```shell
kubectl delete <type> <name>
kubectl delete <type> -l <label>
```
{{< /note >}}

## 오브젝트 확인 방법

구성 파일에 정의한 오브젝트에 관한 정보 확인을 위해 `kubectl get -f`
명령을 사용할 수 있다.

* `kubectl get -f <파일명|url> -o yaml`

`-o yaml` 플래그는 전체 오브젝트 구성이 출력되도록 정의한다. 옵션의 리스트를 확인하기
위해서는 `kubectl get -h`를 사용한다.

## 제약사항

`create`, `replace`, 그리고 `delete` 명령은 각 오브젝트의 구성이
그 구성 파일 내에 완전하게 정의되고 기록되어질 경우 잘 동작한다.
그러나 활성 오브젝트가 업데이트 되고, 구성 파일 안에 병합되지 않으면,
업데이트 내용은 다음번 `replace`가 실행될 때 삭제될 것이다.
이는 HorizontalPodAutoscaler와 같은 컨트롤러가
활성 오브젝트를 직접적으로 업데이트하도록 할 경우 발생한다.
여기 예시가 있다.

1. 구성 파일로부터 오브젝트를 생성할 경우
1. 또 다른 소스가 일부 필드를 변경함으로써 오브젝트가 업데이트 되는 경우
1. 구성 파일로부터 오브젝트를 대체할 경우. 스텝 2에서의
다른 소스에 의해 이루어진 변경은 유실된다.

동일 오브젝트에 대해 여러 명의 작성자들로부터의 지원이 필요한 경우, 오브젝트를 관리하기 위해
`kubectl apply`를 사용할 수 있다.

## 구성 저장 없이 URL로부터 오브젝트 생성과 편집하기

구성 파일에 대한 URL을 가진다고 가정해보자.
`kubectl create --edit`을 사용하여 오브젝트가 생성되기 전에
구성을 변경할 수 있다. 이는 독자가 수정할 수 있는 구성 파일을
가르키는 튜토리얼과 작업에 특히 유용하다.

```shell
kubectl create -f <url> --edit
```

## 명령형 커맨드에서 명령형 오브젝트 구성으로 전환하기

령형 커맨드에서 명령형 오브젝트 구성으로 전환하기 위해
몇 가지 수동 단계를 포함한다.

1. 다음과 같이 활성 오브젝트를 로컬 오브젝트 구성 파일로 내보낸다.

    ```shell
    kubectl get <종류>/<이름> -o yaml > <종류>_<이름>.yaml
    ```

1. 수동으로 오브젝트 구성 파일에서 상태 필드를 제거한다.

1. 이후 오브젝트 관리를 위해, `replace`만 사용한다.

    ```shell
    kubectl replace -f <종류>_<이름>.yaml
    ```

## 컨트롤러 셀렉터와 PodTemplate 레이블 삭제하기

{{< warning >}}
컨트롤러에서 셀렉터를 업데이트하지 않도록 강력하게 권고한다.
{{< /warning >}}

권고되는 접근방법은 다른 의미론적 의미가 없는 컨트롤러 셀렉터의 의해서만
사용되는 단일, 불변의 PodTemplate 레이블로 정의하는 것이다.

레이블 예시:

```yaml
selector:
  matchLabels:
      controller-selector: "apps/v1/deployment/nginx"
template:
  metadata:
    labels:
      controller-selector: "apps/v1/deployment/nginx"
```



## {{% heading "whatsnext" %}}


* [명령형 커맨드를 이용한 쿠버네티스 오브젝트 관리하기](/ko/docs/tasks/manage-kubernetes-objects/imperative-command/)
* [구성 파일을 이용한 쿠버네티스 오브젝트의 선언형 관리](/ko/docs/tasks/manage-kubernetes-objects/declarative-config/)
* [Kubectl 커맨드 참조](/docs/reference/generated/kubectl/kubectl-commands/)
* [쿠버네티스 API 참조](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/)
