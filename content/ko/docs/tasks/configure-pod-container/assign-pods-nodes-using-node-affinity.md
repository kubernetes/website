---
title: 노드 어피니티를 사용해 노드에 파드 할당
min-kubernetes-server-version: v1.10
content_type: task
weight: 120
---

<!-- overview -->
이 문서는 쿠버네티스 클러스터의 특정 노드에 노드 어피니티를 사용해 쿠버네티스 파드를 할당하는
방법을 설명한다.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 노드에 레이블 추가

1. 클러스터의 노드를 레이블과 함께 나열하자.

    ```shell
    kubectl get nodes --show-labels
    ```
    결과는 아래와 같다.

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```
1. 노드 한 개를 선택하고, 레이블을 추가하자.

    ```shell
    kubectl label nodes <your-node-name> disktype=ssd
    ```
    `<your-node-name>` 는 선택한 노드의 이름이다.

1. 선택한 노드가 `disktype=ssd` 레이블을 갖고 있는지 확인하자.

    ```shell
    kubectl get nodes --show-labels
    ```

    결과는 아래와 같다.

    ```
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    위의 결과에서, `worker0` 노드에 `disktype=ssd` 레이블이 있는 것을
    확인할 수 있다.

## 필수적인 노드 어피니티를 사용해 파드 스케줄하기

이 매니페스트는 `disktype: ssd` 라는 `requiredDuringSchedulingIgnoredDuringExecution` 노드 어피니티를 가진 파드를 설명한다.
파드가 `disktype=ssd` 레이블이 있는 노드에만 스케줄될 것이라는 것을 의미한다.

{{< codenew file="pods/pod-nginx-required-affinity.yaml" >}}

1. 매니페스트를 적용하여 선택한 노드에 스케줄된 파드를
   생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-required-affinity.yaml
    ```

1. 파드가 선택한 노드에서 실행 중인지 확인하자.

    ```shell
    kubectl get pods --output=wide
    ```

    결과는 아래와 같다.

    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## 선호하는 노드 어피니티를 사용해 파드 스케줄하기

이 매니페스트는 `disktype: ssd` 라는 `preferredDuringSchedulingIgnoredDuringExecution` 노드 어피니티를 가진 파드를 설명한다.
파드가 `disktype=ssd` 레이블이 있는 노드를 선호한다는 것을 의미한다.

{{< codenew file="pods/pod-nginx-preferred-affinity.yaml" >}}

1. 매니페스트를 적용하여 선택한 노드에 스케줄된 파드를
   생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx-preferred-affinity.yaml
    ```

1. 파드가 선택한 노드에서 실행 중인지 확인하자.

    ```shell
    kubectl get pods --output=wide
    ```

    결과는 아래와 같다.

    ```
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```



## {{% heading "whatsnext" %}}

[노드 어피니티](/ko/docs/concepts/scheduling-eviction/assign-pod-node/#노드-어피니티)에
대해 더 알아보기.
