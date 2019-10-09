---
title: "예시: 카산드라를 스테이트풀셋으로 배포하기"
reviewers:
content_template: templates/tutorial
weight: 30
---

{{% capture overview %}}
이 튜토리얼은 네이티브 클라우드 [카산드라](http://cassandra.apache.org/)를 쿠버네티스에서 배포하는 방법을 소개한다. 이 예제에서 커스텀 카산드라 *시드 제공자(SeedProvider)* 는 카산드라가 클러스터에 조인한 새 카산드라 노드를 발견할 수 있게 한다.

*스테이트풀셋* 은 상태있는 애플리케이션을 클러스터 환경에서 쉽게 배포할 수 있게 한다. 이 튜토리얼에서 이용할 기능의 자세한 정보는 [*스테이트풀셋*](/docs/concepts/workloads/controllers/statefulset/) 문서를 참조하자.

**도커에서 카산드라**

이 튜토리얼의 *파드* 는 구글의 [컨테이너 레지스트리](https://cloud.google.com/container-registry/docs/)에
[`gcr.io/google-samples/cassandra:v13`](https://github.com/kubernetes/examples/blob/master/cassandra/image/Dockerfile) 이미지를 이용한다.
이 도커 이미지는 [debian-base](https://github.com/kubernetes/kubernetes/tree/master/build/debian-base)에
기반하였고 OpenJDK 8을 포함한다.

이 이미지는 아파치 데비안 리포의 표준 카산드라 설치본을 포함한다.
환경변수를 이용하여 `cassandra.yaml`에 삽입된 값을 바꿀 수 있다.

| 환경 변수       | 기본값  |
| ------------- |:-------------: |
| `CASSANDRA_CLUSTER_NAME` | `'Test Cluster'`  |
| `CASSANDRA_NUM_TOKENS`  | `32`               |
| `CASSANDRA_RPC_ADDRESS` | `0.0.0.0`          |

{{% /capture %}}

{{% capture objectives %}}
* 카산드라 헤드리스 [*서비스*](/docs/concepts/services-networking/service/)를 생성하고 검증한다.
* [스테이트풀셋](/docs/concepts/workloads/controllers/statefulset/)을 이용하여 카산드라 링을 생성한다.
* [스테이트풀셋](/docs/concepts/workloads/controllers/statefulset/)을 검증한다.
* [스테이트풀셋](/docs/concepts/workloads/controllers/statefulset/)을 수정한다.
* [스테이트풀셋](/docs/concepts/workloads/controllers/statefulset/)과 포함된 [파드](/docs/concepts/workloads/pods/pod/)를 삭제한다.
{{% /capture %}}

{{% capture prerequisites %}}
이 튜토리얼을 완료하려면, [파드](/docs/concepts/workloads/pods/pod/), [서비스](/docs/concepts/services-networking/service/), [스테이트풀셋](/docs/concepts/workloads/controllers/statefulset/)의 기본 개념에 친숙해야한다. 추가로

* *kubectl* 커맨드라인 도구를 [설치와 설정](/docs/tasks/tools/install-kubectl/)하자.

* [`cassandra-service.yaml`](/examples/application/cassandra/cassandra-service.yaml)와
  [`cassandra-statefulset.yaml`](/examples/application/cassandra/cassandra-statefulset.yaml)를 다운로드한다.

* 실행 중인 쿠버네티스 클러스터를 소유

{{< note >}}
아직 클러스터가 없다면 [설치](/docs/setup/)를 읽도록 하자.
{{< /note >}}

### 추가적인 Minikube 설정 요령

{{< caution >}}
[Minikube](/docs/getting-started-guides/minikube/)는 1024MB 메모리와 1개 CPU가 기본 설정이다. 이 튜토리얼에서 Minikube를 기본 리소스 설정으로 실행하면 리소스 부족 오류가 발생한다. 이런 오류를 피하려면 Minikube를 다음 설정으로 실행하자.

```shell
minikube start --memory 5120 --cpus=4
```
{{< /caution >}}

{{% /capture %}}

{{% capture lessoncontent %}}
## 카산드라 헤드리스 서비스 생성하기

쿠버네티스 [서비스](/docs/concepts/services-networking/service/)는 동일 작업을 수행하는 [파드](/docs/concepts/workloads/pods/pod/)의 집합을 기술한다.

다음의 `서비스`는 쿠버네티스 클러스터에서 카산드라 파드와 클라이언트 간에 DNS 찾아보기 용도로 사용한다.

{{< codenew file="application/cassandra/cassandra-service.yaml" >}}

1. 다운로드 받은 매니페스트 파일 디렉터리에 터미널 윈도우를 열자.
1. `cassandra-service.yaml` 파일에서 카산드라 스테이트풀셋 노드를 모두 추적하는 서비스를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-service.yaml
    ```

### 검증하기 (선택)

카산드라 서비스 살펴보기

```shell
kubectl get svc cassandra
```

결과는 다음과 같다.

```
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
cassandra   ClusterIP   None         <none>        9042/TCP   45s
```

이와 다른 응답이라면 서비스 생성에 실패한 것이다. 일반적인 문제에 대한 [서비스 디버깅하기](/docs/tasks/debug-application-cluster/debug-service/)를 읽어보자.

## 카산드라 링을 생성하는 스테이트풀셋 이용하기

스테이트풀셋 매니페스트에는 다음을 포함하는데 3개 파드로 구성된 카산드라 링을 생성한다.

{{< note >}}
이 예는 Minikube를 위한 기본 프로비저너이다. 다음 스테이트풀셋을 작업하는 클라우드 환경에서 갱신한다.
{{< /note >}}

{{< codenew file="application/cassandra/cassandra-statefulset.yaml" >}}

1. 필요하면 스테이트풀셋 갱신
1. `cassandra-statefulset.yaml` 파일로 카산드라 스테이트풀셋 생성

    ```shell
    kubectl apply -f https://k8s.io/examples/application/cassandra/cassandra-statefulset.yaml
    ```

## 카산드라 스테이트풀셋 검증하기

1. 카산드라 스테이트풀셋 얻기

    ```shell
    kubectl get statefulset cassandra
    ```

    응답은 다음과 같다.

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   3         0         13s
    ```

    `StatefulSet`리소스는 순차적으로 파드를 배포한다.

1. 순차적으로 생성된 현황을 보기 위해 파드를 살펴보자.

    ```shell
    kubectl get pods -l="app=cassandra"
    ```

    응답은 다음과 같다.

    ```shell
    NAME          READY     STATUS              RESTARTS   AGE
    cassandra-0   1/1       Running             0          1m
    cassandra-1   0/1       ContainerCreating   0          8s
    ```

    모든 3개 파드가 배포되기까지 몇 분이 소요될 수 있다. 배포 후에는 같은 명령은 다음같이 응답한다.

    ```
    NAME          READY     STATUS    RESTARTS   AGE
    cassandra-0   1/1       Running   0          10m
    cassandra-1   1/1       Running   0          9m
    cassandra-2   1/1       Running   0          8m
    ```

3. 링의 상태를 보여주는 카산드라 [nodetool](https://wiki.apache.org/cassandra/NodeTool)을 실행하자.

    ```shell
    kubectl exec -it cassandra-0 -- nodetool status
    ```

    이 응답은 다음과 비슷하게 보일 것이다.

    ```
    Datacenter: DC1-K8Demo
    ======================
    Status=Up/Down
    |/ State=Normal/Leaving/Joining/Moving
    --  Address     Load       Tokens       Owns (effective)  Host ID                               Rack
    UN  172.17.0.5  83.57 KiB  32           74.0%             e2dd09e6-d9d3-477e-96c5-45094c08db0f  Rack1-K8Demo
    UN  172.17.0.4  101.04 KiB  32           58.8%             f89d6835-3a42-4419-92b3-0e62cae1479c  Rack1-K8Demo
    UN  172.17.0.6  84.74 KiB  32           67.1%             a6a1e8c2-3dc5-4417-b1a0-26507af2aaad  Rack1-K8Demo
    ```

## 카산드라 스테이트풀셋 수정하기

`kubectl edit`를 사용하여 카산드라 스테이트풀셋의 크기를 수정한다.

1. 다음 명령어를 실행한다.

    ```shell
    kubectl edit statefulset cassandra
    ```

    이 명령은 터미널에서 편집기를 연다. 변경해야할 행은 `replicas` 필드이다. 다음 예제는 `StatefulSet` 파일에서 발췌했다.

    ```yaml
    # Please edit the object below. Lines beginning with a '#' will be ignored,
    # and an empty file will abort the edit. If an error occurs while saving this file will be
    # reopened with the relevant failures.
    #
    apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
    kind: StatefulSet
    metadata:
      creationTimestamp: 2016-08-13T18:40:58Z
      generation: 1
      labels:
      app: cassandra
      name: cassandra
      namespace: default
      resourceVersion: "323"
      uid: 7a219483-6185-11e6-a910-42010a8a0fc0
    spec:
      replicas: 3
    ```

1. 레플리카 개수를 4로 바꾸고, 매니페스트를 저장한다.

    The `StatefulSet` now contains 4 Pods.

1. 검증하기 위해 카산드라 스테이트풀셋을 살펴보자

    ```shell
    kubectl get statefulset cassandra
    ```

    결과는 다음과 같다.

    ```
    NAME        DESIRED   CURRENT   AGE
    cassandra   4         4         36m
    ```

{{% /capture %}}

{{% capture cleanup %}}
스테이트풀셋을 삭제하거나 스케일링하는 것은 스테이트풀셋에 연관된 볼륨을 삭제하지 않는다. 당신의 데이터가 스테이트풀셋의 관련된 모든 리소스를 자동으로 제거하는 것보다 더 가치있기에 이 설정은 당신의 안전을 위한 것이다.

{{< warning >}}
스토리지 클래스와 리클레임 정책에 따라 *퍼시스턴스볼륨클레임* 을 삭제하면 그와 연관된 볼륨도 삭제될 수 있다. 볼륨 요청이 삭제되어도 데이터를 접근할 수 있다고 절대로 가정하지 말자.
{{< /warning >}}

1. 다음 명령어(한 줄로 연결된)를 실행하여 카산드라 `스테이트풀셋`을 모두 제거하자.

    ```shell
    grace=$(kubectl get po cassandra-0 -o=jsonpath='{.spec.terminationGracePeriodSeconds}') \
      && kubectl delete statefulset -l app=cassandra \
      && echo "Sleeping $grace" \
      && sleep $grace \
      && kubectl delete pvc -l app=cassandra
    ```

1. 다음 명령어를 실행하여 카산드라 서비스를 제거하자.

    ```shell
    kubectl delete service -l app=cassandra
    ```

{{% /capture %}}

{{% capture whatsnext %}}

* 어떻게 [스테이트풀셋 스케일](/docs/tasks/run-application/scale-stateful-set/)하는지 살펴본다.
* [*쿠버네티스시드제공자*](https://github.com/kubernetes/examples/blob/master/cassandra/java/src/main/java/io/k8s/cassandra/KubernetesSeedProvider.java)에 대해 더 살펴본다.
* 커스텀 [시드 제공자 설정](https://git.k8s.io/examples/cassandra/java/README.md)를 살펴본다.

{{% /capture %}}

