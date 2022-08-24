---
title: 파일로 컨테이너에 파드 정보 노출하기
content_type: task
weight: 40
---

<!-- overview -->

본 페이지는 파드가 
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)을 사용하여 
파드에서 실행되는 컨테이너에 자신에 대한 정보를 노출하는 방법에 대해 설명한다. 
`DownwardAPIVolumeFile`은 파드 필드와 컨테이너 필드를 노출할 수 있다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 다운워드(Downward) API

실행 중인 컨테이너에 파드 및 컨테이너 필드를 노출하는 방법에는 두 가지가 있다.

* [환경 변수](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/#다운워드-downward-api)
* 볼륨 파일

파드 및 컨테이너 필드를 노출하는 이 두 가지 방법을 
"다운워드 API"라고 한다.

## 파드 필드 저장

이 연습에서는 하나의 컨테이너를 가진 파드를 생성한다.
다음은 파드에 대한 구성 파일이다.

{{< codenew file="pods/inject/dapi-volume.yaml" >}}

구성 파일에서 파드에 `downwardAPI` 볼륨이 있고 컨테이너가 `/etc/podinfo`에 볼륨을 마운트하는
것을 확인할 수 있다.

`downwardAPI` 아래의 배열을 살펴보자. 배열의 각 요소는 
[DownwardAPIVolumeFile](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)이다.
첫 번째 요소는 파드의 `metadata.labels` 필드 값이 
`labels`라는 파일에 저장되어야 함을 지정한다.
두 번째 요소는 파드의 `annotations` 필드 값이 
`annotations`라는 파일에 저장되어야 함을 지정한다.

{{< note >}}
이 예제의 필드는 파드에 있는 컨테이너의 필드가 아니라 
파드 필드이다. 
{{< /note >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume.yaml
```

파드의 컨테이너가 실행 중인지 확인한다.

```shell
kubectl get pods
```

컨테이너의 로그를 본다.

```shell
kubectl logs kubernetes-downwardapi-volume-example
```

출력은 `labels` 파일과 `annotations` 파일의 내용을 보여준다.

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"

build="two"
builder="john-doe"
```

파드에서 실행 중인 컨테이너의 셸을 가져온다.

```shell
kubectl exec -it kubernetes-downwardapi-volume-example -- sh
```

셸에서 `labels` 파일을 보자.

```shell
/# cat /etc/podinfo/labels
```

출력을 통해 모든 파드의 레이블이 
`labels` 파일에 기록되었음을 확인할 수 있다.

```shell
cluster="test-cluster1"
rack="rack-22"
zone="us-est-coast"
```

마찬가지로 `annotations` 파일을 확인하자.

```shell
/# cat /etc/podinfo/annotations
```

`etc/podinfo` 디렉터리에 파일을 확인하자.

```shell
/# ls -laR /etc/podinfo
```

출력에서 `labels` 및 `annotations` 파일이 
임시 하위 디렉터리에 있음을 알 수 있다. 이 예제에서는 
`..2982_06_02_21_47_53.299460680`이다. `/etc/podinfo` 디렉터리에서 `..data`는 
임시 하위 디렉토리에 대한 심볼릭 링크이다. `/etc/podinfo` 디렉토리에서 
`labels`와 `annotations` 또한 심볼릭 링크이다.

```
drwxr-xr-x  ... Feb 6 21:47 ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 ..data -> ..2982_06_02_21_47_53.299460680
lrwxrwxrwx  ... Feb 6 21:47 annotations -> ..data/annotations
lrwxrwxrwx  ... Feb 6 21:47 labels -> ..data/labels

/etc/..2982_06_02_21_47_53.299460680:
total 8
-rw-r--r--  ... Feb  6 21:47 annotations
-rw-r--r--  ... Feb  6 21:47 labels
```

심볼릭 링크를 사용하면 메타데이터의 동적(dynamic) 원자적(atomic) 갱신이 가능하다.
업데이트는 새 임시 디렉터리에 기록되고, `..data` 심볼릭 링크는 
[rename(2)](http://man7.org/linux/man-pages/man2/rename.2.html)을 사용하여 원자적(atomic)으로 갱신한다.

{{< note >}}
다운워드 API를 [subPath](/ko/docs/concepts/storage/volumes/#using-subpath) 
볼륨 마운트로 사용하는 컨테이너는 
다운워드 API 업데이트를 수신하지 않는다.
{{< /note >}}

셸을 종료한다.

```shell
/# exit
```

## 컨테이너 필드 저장

이전 연습에서는 파드 필드를 
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)에 저장하였다.
이 다음 연습에서는 컨테이너 필드를 저장한다. 
다음은 하나의 컨테이너를 가진 파드의 구성 파일이다.

{{< codenew file="pods/inject/dapi-volume-resources.yaml" >}}

구성 파일에서 파드에 [`downwardAPI` 볼륨](/ko/docs/concepts/storage/volumes/#downwardapi)이 있고 
컨테이너는 `/etc/podinfo`에 
볼륨을 마운트하는 것을 확인할 수 있다.

`downwardAPI` 아래의 `items` 배열을 살펴보자. 배열의 각 요소는 
[`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core)이다.

첫 번째 요소는 `client-container`라는 컨테이너에서 
`1m`으로 지정된 형식의 `limits.cpu` 필드 값이 
`cpu_limit`이라는 파일에 저장되어야 함을 지정한다. `divisor` 필드는 선택 사항이며 
기본값인 `1`은 CPU에 대한 코어 및 메모리에 대한 바이트를 의미한다.

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-volume-resources.yaml
```

파드에서 실행 중인 컨테이너의 셸을 가져온다.

```shell
kubectl exec -it kubernetes-downwardapi-volume-example-2 -- sh
```

셸에서 `cpu_limit` 파일을 확인한다.

```shell
/# cat /etc/podinfo/cpu_limit
```

비슷한 명령을 통해 `cpu_request`, `mem_limit` 및 
`mem_request` 파일을 확인할 수 있다.

<!-- discussion -->

<!-- TODO: This section should be extracted out of the task page. -->
## 다운워드 API의 기능

다음 정보는 환경 변수 및 `downwardAPI` 볼륨을 통해 
컨테이너에서 사용할 수 있다.

* `fieldRef`를 통해 다음 정보를 사용할 수 있다.

  * `metadata.name` - 파드의 이름
  * `metadata.namespace` - 파드의 네임스페이스(Namespace)
  * `metadata.uid` - 파드의 UID
  * `metadata.labels['<KEY>']` - 파드의 레이블 `<KEY>` 값 
    (예를 들어, `metadata.labels['mylabel']`)
  * `metadata.annotations['<KEY>']` - 파드의 어노테이션 `<KEY>` 값 
    (예를 들어, `metadata.annotations['myannotation']`)

* `resourceFieldRef`를 통해 다음 정보를 사용할 수 있다.

  * 컨테이너의 CPU 한도(limit)
  * 컨테이너의 CPU 요청(request)
  * 컨테이너의 메모리 한도(limit)
  * 컨테이너의 메모리 요청(request)
  * 컨테이너의 hugepages 한도(limit) (`DownwardAPIHugePages` 
    [기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화된 경우)
  * 컨테이너의 hugepages 요청(request) (`DownwardAPIHugePages` 
    [기능 게이트(feature gate)](/ko/docs/reference/command-line-tools-reference/feature-gates/)가 활성화된 경우)
  * 컨테이너의 임시-스토리지 한도(limit)
  * 컨테이너의 임시-스토리지 요청(request)

`downwardAPI` 볼륨 `fieldRef`를 통해 
다음 정보를 사용할 수 있다.

* `metadata.labels` - 한 줄에 하나의 레이블이 있는 
  `label-key="escaped-label-value"` 형식의 모든 파드 레이블
* `metadata.annotations` - 한 줄에 하나의 어노테이션이 있는 
  `annotation-key="escaped-annotation-value"` 형식의 모든 파드 어노테이션

환경 변수를 통해 다음 정보를 사용할 수 있다.

* `status.podIP` - 파드의 IP 주소
* `spec.serviceAccountName` - 파드의 서비스 계정 이름
* `spec.nodeName` - 스케줄러가 항상 파드를 스케줄링하려고 시도할 
  노드의 이름
* `status.hostIP` - 파드가 할당될 노드의 IP 주소

{{< note >}}
컨테이너에 대해 CPU 및 메모리 한도(limit)가 지정되지 않은 경우 다운워드 API는 기본적으로 
CPU 및 메모리에 대해 할당 가능한 노드 값으로 설정한다.
{{< /note >}}

## 특정 경로 및 파일 권한에 대한 프로젝트 키

키(key)를 파드 안의 특정 경로에, 특정 권한으로, 파일 단위로 투영(project)할 수 있다.
자세한 내용은 
[시크릿(Secrets)](/ko/docs/concepts/configuration/secret/)을 참조한다.

## 다운워드 API에 대한 동기

컨테이너가 쿠버네티스에 과도하게 결합되지 않고 
자체에 대한 정보를 갖는 것이 때때로 유용하다. 
다운워드 API를 사용하면 컨테이너가 쿠버네티스 클라이언트 또는 API 서버를 사용하지 않고 
자체 또는 클러스터에 대한 정보를 사용할 수 있다.

예를 들어 잘 알려진 특정 환경 변수에 고유 식별자가 있다고 가정하는 
기존 애플리케이션이 있다. 한 가지 가능성은 애플리케이션을 래핑하는 것이지만 
이는 지루하고 오류가 발생하기 쉬우며 낮은 결합 목표를 위반한다. 
더 나은 옵션은 파드의 이름을 식별자로 사용하고 
파드의 이름을 잘 알려진 환경 변수에 삽입하는 것이다.

## {{% heading "whatsnext" %}}

* 파드의 목표 상태(desired state)를 정의하는 
  [`PodSpec`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core) API 정의를 확인한다.
* 컨테이너가 접근할 파드 내의 일반 볼륨을 정의하는 
  [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core) API 정의를 확인한다.
* 다운워드 API 정보를 포함하는 볼륨을 정의하는 
  [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core) API 정의를 확인한다.
* 다운워드 API 볼륨 내 파일을 채우기 위한 
  오브젝트 또는 리소스 필드로의 레퍼런스를 포함하는 
  [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core) API 정의를 확인한다.
* 컨테이너 리소스 및 이들의 출력 형식을 지정하는 
  [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core) API 정의를 확인한다.
