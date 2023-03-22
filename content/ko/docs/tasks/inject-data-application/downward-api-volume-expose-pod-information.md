---
title: 파일로 컨테이너에 파드 정보 노출하기
content_type: task
weight: 40
---

<!-- overview -->

본 페이지는 파드가 
[`downwardAPI` 볼륨](/ko/docs/concepts/storage/volumes/#downwardapi)을 사용하여 
파드에서 실행되는 컨테이너에 자신에 대한 정보를 노출하는 방법에 대해 설명한다. 
`downwardAPI` 볼륨은 파드 필드와 컨테이너 필드를 노출할 수 있다.

쿠버네티스에는 실행 중인 컨테이너에 파드 필드 및 컨테이너 필드를 노출하는 두 가지 방법이 있다.

* [환경 변수](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)
* 볼륨 파일

파드 및 컨테이너 필드를 노출하는 이 두 가지 방법을
_downward API_ 라고 한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}


<!-- steps -->

## 파드 필드 저장

이 연습에서는 컨테이너가 한 개 있는 파드를 생성하고, 해당 파드의
파드 수준(Pod-level) 필드를 실행 중인 컨테이너에 파일 형태로 생성한다.
다음은 파드를 위한 매니페스트를 보여준다.

{{< codenew file="pods/inject/dapi-volume.yaml" >}}

매니페스트에서, 파드에 `downwardAPI` 볼륨이 있고, 
컨테이너가 `/etc/podinfo`에 볼륨을 마운트하는 것을 확인할 수 있다.

`downwardAPI` 아래의 `items` 배열을 살펴보자. 배열의 각 요소는
`downwardAPI` 볼륨을 의미한다. 
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

```
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

이전 연습에서는 downward API를 사용하여 파드 수준 필드에 액세스할 수
있도록 했다.
이번 연습에서는 파드 전체가 아닌 특정 
[컨테이너](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)의 
일부 필드만 전달한다. 다음은 기존과 마찬가지로 하나의
컨테이너만 가진 파드의 매니페스트를
보여준다.

{{< codenew file="pods/inject/dapi-volume-resources.yaml" >}}

매니페스트에서 파드에 [`downwardAPI` 볼륨](/ko/docs/concepts/storage/volumes/#downwardapi)이 있고 
단일 컨테이너는 `/etc/podinfo`에 
볼륨을 마운트하는 것을 확인할 수 있다.

`downwardAPI` 아래의 `items` 배열을 살펴보자.
배열의 각 요소는 downward API 볼륨의 파일을 의미한다.

첫 번째 요소는 `client-container`라는 컨테이너에서 
`1m`으로 지정된 형식의 `limits.cpu` 필드 값이 
`cpu_limit`이라는 파일에 배포되어야 함을 지정한다.
`divisor` 필드는 선택 사항이며, 지정하지 않을 경우 `1`의 값을 갖는다.
divisor 1은 `cpu` 리소스를 위한 코어 수를 의미하거나 `memory` 리소스에 대한 바이트 수를 의미한다.

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
# 컨테이너 내부의 쉘에서 실행하자.
cat /etc/podinfo/cpu_limit
```

비슷한 명령을 통해 `cpu_request`, `mem_limit` 및 
`mem_request` 파일을 확인할 수 있다.

<!-- discussion -->

## 특정 경로 및 파일 권한에 대한 프로젝트 키

키(key)를 파드 안의 특정 경로에, 특정 권한으로, 파일 단위로 투영(project)할 수 있다.
자세한 내용은 
[시크릿(Secrets)](/ko/docs/concepts/configuration/secret/)을 참조한다.

## {{% heading "whatsnext" %}}

* [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)을 읽어보자.
  파드에 대한 API 정의다. 여기에는 컨테이너 (파드의 일부)의 정의가 포함되어 있다.
* downward API를 사용하여 노출할 수 있는 [이용 가능한 필드](/ko/docs/concepts/workloads/pods/downward-api/#사용-가능한-필드) 목록을 읽어보자.

레거시 API 레퍼런스에서 볼륨에 대해 읽어본다.
* 컨테이너가 접근할 파드 내의 일반 볼륨을 정의하는 
  [`Volume`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core) API 정의를 확인한다.
* 다운워드 API 정보를 포함하는 볼륨을 정의하는 
  [`DownwardAPIVolumeSource`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumesource-v1-core) API 정의를 확인한다.
* 다운워드 API 볼륨 내 파일을 채우기 위한 
  오브젝트 또는 리소스 필드로의 레퍼런스를 포함하는 
  [`DownwardAPIVolumeFile`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#downwardapivolumefile-v1-core) API 정의를 확인한다.
* 컨테이너 리소스 및 이들의 출력 형식을 지정하는 
  [`ResourceFieldSelector`](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core) API 정의를 확인한다.
