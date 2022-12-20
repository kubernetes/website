---
##reviewers:
##- jpeeler
##- pmorie
title: 파드의 스토리지에 프로젝티드 볼륨(Projected Volume)을 사용하도록 구성
content_type: task
weight: 70
---

<!-- overview -->
이 페이지는 [`프로젝티드`](/ko/docs/concepts/storage/volumes/#projected) 볼륨을 사용하여 여러 기존 볼륨 소스들을
동일한 디렉터리에 마운트하는 방법을 보여준다. 현재 `시크릿(secret)`, `컨피그맵(configMap)`, `downwardAPI`,
그리고 `서비스어카운트토큰(serviceAccountToken)` 볼륨이 프로젝티드(projected)될 수 있다.

{{< note >}}
`서비스어카운트토큰(serviceAccountToken)` 은 볼륨 타입이 아니다.
{{< /note >}}


## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}


<!-- steps -->
## 파드에 프로젝티드 볼륨을 구성

이 연습에서는 로컬 파일에 유저네임과 패스워드를 {{< glossary_tooltip text="시크릿" term_id="secret" >}}으로 생성한다. 이후 하나의 컨테이너를 포함한 파드를 생성하는 데, 이 때 시크릿을 동일한 공유 디렉터리에 마운트하기 위해 [`프로젝티드`](/ko/docs/concepts/storage/volumes/#projected) 볼륨을 사용한다.

다음은 파드의 구성 파일이다.

{{< codenew file="pods/storage/projected.yaml" >}}

1. 시크릿을 생성한다.

    ```shell
    # 유저네임과 패스워드를 포함한 파일들을 생성한다.
    echo -n "admin" > ./username.txt
    echo -n "1f2d1e2e67df" > ./password.txt

    # 생성한 파일들을 시크릿으로 패키징한다.
    kubectl create secret generic user --from-file=./username.txt
    kubectl create secret generic pass --from-file=./password.txt
    ```
1. 파드를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/pods/storage/projected.yaml
    ```
1. 파드의 컨테이너가 정상적으로 실행되는지 확인한 다음, 파드에 대한 변경 사항을 
확인한다.

    ```shell
    kubectl get --watch pod test-projected-volume
    ```
    The output looks like this:
    ```
    NAME                    READY     STATUS    RESTARTS   AGE
    test-projected-volume   1/1       Running   0          14s
    ```
1. 다른 터미널을 이용해, 실행 중인 컨테이너에 대한 셸을 가져온다.

    ```shell
    kubectl exec -it test-projected-volume -- /bin/sh
    ```
1. 셸에서 `projected-volume` 디렉터리에 프로젝티드 소스들이 포함되어 있는지 확인한다.

    ```shell
    ls /projected-volume/
    ```

## 정리하기

파드와 시크릿을 제거한다.

```shellxs
kubectl delete pod test-projected-volume
kubectl delete secret user pass
```



## {{% heading "whatsnext" %}}

* [`프로젝티드`](/ko/docs/concepts/storage/volumes/#projected) 볼륨에 대해 더 알아보기.
* [all-in-one 볼륨](https://git.k8s.io/design-proposals-archive/node/all-in-one-volume.md) 디자인 문서를 읽기.

