---
title: 환경 변수로 컨테이너에 파드 정보 노출하기
content_type: task
weight: 30
---

<!-- overview -->

본 페이지는 파드가 환경 변수를 사용하여 _downward API_ 로 파드 내부의 컨테이너 정보를 노출하는 방법에 
대해 설명한다.
환경 변수를 사용하여 파드 필드, 컨테이너 필드 또는 둘 다 노출할 수 있다.

쿠버네티스에는 실행 중인 컨테이너에 파드 필드 및 컨테이너 필드를 노출하는 두 가지 방법이 있다.

* _환경 변수_ (본 태스크에 설명이 있음)
* [볼륨 파일](/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#다운워드-downward-api)

파드 및 컨테이너 필드를 노출하는 이 두 가지 방법을 downward API라고 한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 파드 필드를 환경 변수의 값으로 사용하자

이 연습에서 하나의 컨테이너가 있는 파드와 파드 수준의 필드를 실행 중인 컨테이너의 환경변수로 생성한다.

{{< codenew file="pods/inject/dapi-envars-pod.yaml" >}}

매니페스트에서 5개의 환경 변수를 확인할 수 있다. `env` 필드는 
환경 변수 정의의 배열이다. 배열의 첫 번째 요소는 `MY_NODE_NAME` 환경 변수가 파드의 `spec.nodeName` 필드에서 값을 가져오도록 지정한다. 마찬가지로 다른 환경 변수도 파드 필드에서 이름을 가져온다.

{{< note >}}
이 예제의 필드는 파드에 있는 컨테이너의 필드가 아니라 파드 필드이다.
{{< /note >}}

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-pod.yaml
```

파드의 컨테이너가 실행중인지 확인한다.

```shell
# 새 파드가 아직 정상 상태가 아니면, 이 명령을 몇 번 다시 실행한다.
kubectl get pods
```

컨테이너의 로그를 본다.

```shell
kubectl logs dapi-envars-fieldref
```

출력은 선택된 환경 변수의 값을 보여준다.

```
minikube
dapi-envars-fieldref
default
172.17.0.4
default
```

이러한 값이 로그에 출력된 이유를 보려면 구성 파일의 `command` 및 `args` 필드를 확인하자.
컨테이너가 시작되면 5개의 환경 변수 값을 stdout에 쓰며 10초마다 이를 반복한다.

다음으로 파드에서 실행 중인 컨테이너의 셸을 가져오자.

```shell
kubectl exec -it dapi-envars-fieldref -- sh
```

셸에서 환경 변수를 보자.

```shell
# 컨테이너 내부의 쉘에서 실행하자.
printenv
```

출력은 특정 환경 변수에 파드 필드 값이 할당되었음을 보여준다.

```
MY_POD_SERVICE_ACCOUNT=default
...
MY_POD_NAMESPACE=default
MY_POD_IP=172.17.0.4
...
MY_NODE_NAME=minikube
...
MY_POD_NAME=dapi-envars-fieldref
```

## 컨테이너 필드를 환경 변수의 값으로 사용하기

이전 연습에서 파드 수준 필드의 정보를 환경 변수의 값으로 사용했다. 이번 연습에서는 파드 전체가 아닌 특정 [컨테이너](/docs/reference/kubernetes-api/workload-resources/pod-v1/#Container)의 일부 필드만 전달한다. 다음은 하나의 컨테이너가 있는 파드의 구성 파일이다.

여기, 다시 하나의 컨테이너만 가진 파드를 위한 매니페스트가 있다.

{{< codenew file="pods/inject/dapi-envars-container.yaml" >}}

매니페스트에서 4개의 환경 변수를 확인할 수 있다. `env` 필드는 
환경 변수 정의의 배열이다. 배열의 첫 번째 요소는 `MY_CPU_REQUEST` 환경 변수가 `test-container`라는 컨테이너의 
`requests.cpu` 필드에서 값을 가져오도록 지정한다. 마찬가지로 다른 환경 변수도 특정 컨테이너 필드에서 
값을 가져온다.

파드를 생성한다.

```shell
kubectl apply -f https://k8s.io/examples/pods/inject/dapi-envars-container.yaml
```

파드의 컨테이너가 실행중인지 확인한다.

```shell
# 새 파드가 아직 정상 상태가 아니면, 이 명령을 몇 번 다시 실행한다.
kubectl get pods
```

컨테이너의 로그를 본다.

```shell
kubectl logs dapi-envars-resourcefieldref
```

출력은 선택된 환경 변수의 값을 보여준다.

```
1
1
33554432
67108864
```

## {{% heading "whatsnext" %}}

* [컨테이너를 위한 환경 변수 정의하기](/ko/docs/tasks/inject-data-application/define-environment-variable-container/)를 읽어보자.
* [`spec`](/docs/reference/kubernetes-api/workload-resources/pod-v1/#PodSpec)을 읽어보자.
  파드에 대한 API 정의다. 여기에는 컨테이너 (파드의 일부)의 정의가 포함되어 있다.
* downward API를 사용하여 노출할 수 있는 [이용 가능한 필드](/ko/docs/concepts/workloads/pods/downward-api/#사용-가능한-필드) 목록을 읽어보자.

레거시 API 레퍼런스에서 파드, 컨테이너 및 환경 변수에 대해 읽어본다.

* [PodSpec](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)
* [컨테이너](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#container-v1-core)
* [EnvVar](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvar-v1-core)
* [EnvVarSource](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#envvarsource-v1-core)
* [ObjectFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#objectfieldselector-v1-core)
* [ResourceFieldSelector](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#resourcefieldselector-v1-core)



