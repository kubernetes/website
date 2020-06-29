---
title: 포트 포워딩을 사용해서 클러스터 내 애플리케이션에 접근하기
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

이 페이지는 `kubectl port-forward` 를 사용해서 쿠버네티스 클러스터 내에서 
실행중인 Redis 서버에 연결하는 방법을 보여준다. 이 유형의 연결은 데이터베이스
디버깅에 유용할 수 있다.




## {{% heading "prerequisites" %}}


* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [redis-cli](http://redis.io/topics/rediscli)를 설치한다.




<!-- steps -->

## Redis 디플로이먼트와 서비스 생성하기

1. Redis를 실행하기 위해 디플로이먼트를 생성한다.
    
    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-deployment.yaml
    ```

    성공적인 명령어의 출력은 디플로이먼트가 생성됐다는 것을 확인해준다.

    ```
    deployment.apps/redis-master created
    ```

    파드 상태를 조회하여 파드가 준비되었는지 확인한다.

    ```shell
    kubectl get pods
    ```

    출력은 파드가 생성되었다는 것을 보여준다.

    ```
    NAME                            READY     STATUS    RESTARTS   AGE
    redis-master-765d459796-258hz   1/1       Running   0          50s
    ```

    디플로이먼트 상태를 조회한다.

    ```shell
    kubectl get deployment
    ```

    출력은 디플로이먼트가 생성되었다는 것을 보여준다.

    ```
    NAME         READY   UP-TO-DATE   AVAILABLE   AGE
    redis-master 1/1     1            1           55s
    ```

    아래의 명령어를 사용하여 레플리카셋 상태를 조회한다.

    ```shell
    kubectl get rs
    ```

    출력은 레플리카셋이 생성되었다는 것을 보여준다.

    ```
    NAME                      DESIRED   CURRENT   READY     AGE
    redis-master-765d459796   1         1         1         1m
    ```


2. Redis를 네트워크에 노출시키기 위해 서비스를 생성한다.

    ```shell
    kubectl apply -f https://k8s.io/examples/application/guestbook/redis-master-service.yaml
    ```

    성공적인 커맨드의 출력은 서비스가 생성되었다는 것을 확인해준다.

    ```
    service/redis-master created
    ```

    서비스가 생성되었는지 확인한다.

    ```shell
    kubectl get svc | grep redis
    ```

    출력은 서비스가 생성되었다는 것을 보여준다.

    ```
    NAME           TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)    AGE
    redis-master   ClusterIP   10.0.0.213   <none>        6379/TCP   27s
    ```

3. Redis 서버가 파드 안에서 실행되고 있고, 6379번 포트에서 수신하고 있는지 확인한다.

    ```shell
    # redis-master-765d459796-258hz 를 파드 이름으로 변경한다.
    kubectl get pod redis-master-765d459796-258hz --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'

    ```

    출력은 파드 내 Redis 포트 번호를 보여준다.

    ```
    6379
    ```

    (이 TCP 포트는 Redis가 인터넷에 할당된 것이다).

## 파드의 포트를 로컬 포트로 포워딩하기

1.  	`kubectl port-forward` 명령어는 파드 이름과 같이 리소스 이름을 사용하여 일치하는 파드를 선택해 포트 포워딩하는 것을 허용한다.

    ```shell
    # redis-master-765d459796-258hz 를 파드 이름으로 변경한다.
    kubectl port-forward redis-master-765d459796-258hz 7000:6379
    ```

    이것은

    ```shell
    kubectl port-forward pods/redis-master-765d459796-258hz 7000:6379
    ```

    또는

    ```shell
    kubectl port-forward deployment/redis-master 7000:6379
    ```

    또는

    ```shell
    kubectl port-forward rs/redis-master 7000:6379
    ```

    또는 다음과 같다.

    ```shell
    kubectl port-forward svc/redis-master 7000:6379
    ```

    위의 명령어들은 모두 동일하게 동작한다. 이와 유사하게 출력된다.

    ```
    I0710 14:43:38.274550    3655 portforward.go:225] Forwarding from 127.0.0.1:7000 -> 6379
    I0710 14:43:38.274797    3655 portforward.go:225] Forwarding from [::1]:7000 -> 6379
    ```

2.  Redis 커맨드라인 인터페이스를 실행한다.

    ```shell
    redis-cli -p 7000
    ```

3.  Redis 커맨드라인 프롬프트에 `ping` 명령을 입력한다.

    ```shell
    ping
    ```

    성공적인 핑 요청을 반환한다.

    ```
    PONG
    ```




<!-- discussion -->

## 토의

로컬 7000 포트에 대한 연결은 Redis 서버가 실행중인 파드의 6379 포트로 포워딩된다.
이 연결로 로컬 워크스테이션에서 파드 안에서 실행 중인 데이터베이스를 디버깅하는데
사용할 수 있다.

{{< note >}}
`kubectl port-forward` 는 TCP 포트에서만 구현된다.
UDP 프로토콜에 대한 지원은
[이슈 47862](https://github.com/kubernetes/kubernetes/issues/47862)
에서 추적되고 있다.
{{< /note >}}




## {{% heading "whatsnext" %}}

[kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)에 대해 더 알아본다.




