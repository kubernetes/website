---
title: 노드에 파드 할당
content_type: task
weight: 120
---

<!-- overview -->
이 문서는 쿠버네티스 클러스터의 특정 노드에 쿠버네티스 파드를 할당하는
방법을 설명한다.


## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 노드에 레이블 추가

1. 클러스터의 {{< glossary_tooltip term_id="node" text="노드" >}}를 레이블과 함께 나열하자.

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

    `<your-node-name>`는 선택한 노드의 이름이다.

1. 선택한 노드가 `disktype=ssd` 레이블을 갖고 있는지 확인하자.

    ```shell
    kubectl get nodes --show-labels
    ```

    결과는 아래와 같다.

    ```shell
    NAME      STATUS    ROLES    AGE     VERSION        LABELS
    worker0   Ready     <none>   1d      v1.13.0        ...,disktype=ssd,kubernetes.io/hostname=worker0
    worker1   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker1
    worker2   Ready     <none>   1d      v1.13.0        ...,kubernetes.io/hostname=worker2
    ```

    위의 결과에서, `worker0` 노드에 `disktype=ssd` 레이블이 있는 것을
    확인할 수 있다.

## 선택한 노드에 스케줄되도록 파드 생성하기

이 파드 구성 파일은 `disktype: ssd`라는 선택하는 노드 셀렉터를 가진 파드를
설명한다.
즉, `disktype=ssd` 레이블이 있는 노드에 파드가 스케줄될 것이라는
것을 의미한다.

{{< codenew file="pods/pod-nginx.yaml" >}}

1. 구성 파일을 사용해서 선택한 노드로 스케줄되도록 파드를
   생성하자.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/pod-nginx.yaml
    ```

1. 파드가 선택한 노드에서 실행 중인지 확인하자.

    ```shell
    kubectl get pods --output=wide
    ```

    결과는 아래와 같다.

    ```shell
    NAME     READY     STATUS    RESTARTS   AGE    IP           NODE
    nginx    1/1       Running   0          13s    10.200.0.4   worker0
    ```

## 특정 노드에 스케줄되도록 파드 생성하기

`nodeName` 설정을 통해 특정 노드로 파드를 배포할 수 있다.

{{< codenew file="pods/pod-nginx-specific-node.yaml" >}}

설정 파일을 사용해 `foo-node` 노드에 파드를 스케줄되도록 만들어 보자.



## {{% heading "whatsnext" %}}

* [레이블과 셀렉터](/ko/docs/concepts/overview/working-with-objects/labels/)에 대해 배우기.
* [노드](/ko/docs/concepts/architecture/nodes/)에 대해 배우기.

