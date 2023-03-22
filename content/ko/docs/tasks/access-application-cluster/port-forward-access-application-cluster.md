---
title: 포트 포워딩을 사용해서 클러스터 내 애플리케이션에 접근하기
content_type: task
weight: 40
min-kubernetes-server-version: v1.10
---

<!-- overview -->

이 페이지는 `kubectl port-forward` 를 사용해서 쿠버네티스 클러스터 내에서
실행중인 MongoDB 서버에 연결하는 방법을 보여준다. 이 유형의 연결은 데이터베이스
디버깅에 유용할 수 있다.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* [MongoDB Shell](https://www.mongodb.com/try/download/shell)을 설치한다.

<!-- steps -->

## MongoDB 디플로이먼트와 서비스 생성하기

1. MongoDB를 실행하기 위해 디플로이먼트를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-deployment.yaml
   ```

   성공적인 명령어의 출력은 디플로이먼트가 생성됐다는 것을 확인해준다.

   ```
   deployment.apps/mongo created
   ```

   파드 상태를 조회하여 파드가 준비되었는지 확인한다.

   ```shell
   kubectl get pods
   ```

   출력은 파드가 생성되었다는 것을 보여준다.

   ```
   NAME                     READY   STATUS    RESTARTS   AGE
   mongo-75f59d57f4-4nd6q   1/1     Running   0          2m4s
  ```

   디플로이먼트 상태를 조회한다.

   ```shell
   kubectl get deployment
   ```

   출력은 디플로이먼트가 생성되었다는 것을 보여준다.

   ```
   NAME    READY   UP-TO-DATE   AVAILABLE   AGE
   mongo   1/1     1            1           2m21s
   ```

   디플로이먼트는 자동으로 레플리카셋을 관리한다.
   아래의 명령어를 사용하여 레플리카셋 상태를 조회한다.

   ```shell
   kubectl get replicaset
   ```

   출력은 레플리카셋이 생성되었다는 것을 보여준다.

   ```
   NAME               DESIRED   CURRENT   READY   AGE
   mongo-75f59d57f4   1         1         1       3m12s
   ```

2. MongoDB를 네트워크에 노출시키기 위해 서비스를 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/application/mongodb/mongo-service.yaml
   ```

   성공적인 커맨드의 출력은 서비스가 생성되었다는 것을 확인해준다.

   ```
   service/mongo created
   ```

   서비스가 생성되었는지 확인한다.

   ```shell
    kubectl get service mongo
  ```

   출력은 서비스가 생성되었다는 것을 보여준다.

   ```
   NAME    TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)     AGE
   mongo   ClusterIP   10.96.41.183   <none>        27017/TCP   11s
   ```

3. MongoDB 서버가 파드 안에서 실행되고 있고, 27017번 포트에서 수신하고 있는지 확인한다.

   ```shell
   # mongo-75f59d57f4-4nd6q 를 당신의 파드 이름으로 대체한다.
   kubectl get pod mongo-75f59d57f4-4nd6q --template='{{(index (index .spec.containers 0).ports 0).containerPort}}{{"\n"}}'
   ```

   출력은 파드 내 MongoDB 포트 번호를 보여준다.

   ```
   27017
   ```

    (27017은 인터넷 상의 MongoDB에 할당된 TCP 포트이다.)

## 파드의 포트를 로컬 포트로 포워딩하기

1. `kubectl port-forward` 명령어는 파드 이름과 같이 리소스 이름을 사용하여 일치하는 파드를 선택해 포트 포워딩하는 것을 허용한다.


   ```shell
   # mongo-75f59d57f4-4nd6q 를 당신의 파드 이름으로 대체한다.
   kubectl port-forward mongo-75f59d57f4-4nd6q 28015:27017
   ```

   이것은

   ```shell
   kubectl port-forward pods/mongo-75f59d57f4-4nd6q 28015:27017
   ```

   또는

   ```shell
   kubectl port-forward deployment/mongo 28015:27017
   ```

   또는

   ```shell
   kubectl port-forward replicaset/mongo-75f59d57f4 28015:27017
   ```

   또는 다음과 같다.

   ```shell
   kubectl port-forward service/mongo 28015:27017
    ```

   위의 명령어들은 모두 동일하게 동작한다. 이와 유사하게 출력된다.

   ```
   Forwarding from 127.0.0.1:28015 -> 27017
   Forwarding from [::1]:28015 -> 27017
   ```

{{< note >}}
`kubectl port-forward` 는 프롬프트를 리턴하지 않으므로, 이 연습을 계속하려면 다른 터미널을 열어야 한다.
{{< /note >}}

2. MongoDB 커맨드라인 인터페이스를 실행한다.

   ```shell
   mongosh --port 28015
   ```

3. MongoDB 커맨드라인 프롬프트에 `ping` 명령을 입력한다.

   ```
   db.runCommand( { ping: 1 } )
   ```

   성공적인 핑 요청을 반환한다.

   ```
   { ok: 1 }
   ```

### 선택적으로 _kubectl_ 이 로컬 포트를 선택하게 하기 {#let-kubectl-choose-local-port}

만약 특정 로컬 포트가 필요하지 않다면, `kubectl` 이 로컬 포트를 선택 및 할당하게 하여,
조금 더 단순한 문법으로 로컬 포트 충돌 관리를 위한
부담을 줄일 수 있다.

```shell
kubectl port-forward deployment/mongo :27017
```

`kubectl` 도구는 사용 중이 아닌 로컬 포트 번호를 찾는다 (낮은 포트 번호는
다른 애플리케이션에서 사용될 것이므로, 낮은 포트 번호를 피해서). 출력은 다음과 같을 것이다.

```
Forwarding from 127.0.0.1:63753 -> 27017
Forwarding from [::1]:63753 -> 27017
```

<!-- discussion -->

## 토의

로컬 28015 포트에 대한 연결은 MongoDB 서버가 실행중인 파드의 27017 포트로 포워딩된다.
이 연결로 로컬 워크스테이션에서 파드 안에서 실행 중인 데이터베이스를 디버깅하는데
사용할 수 있다.

{{< note >}}
`kubectl port-forward` 는 TCP 포트에서만 구현된다.
UDP 프로토콜에 대한 지원은
[이슈 47862](https://github.com/kubernetes/kubernetes/issues/47862)에서 추적되고 있다.
{{< /note >}}

## {{% heading "whatsnext" %}}

[kubectl port-forward](/docs/reference/generated/kubectl/kubectl-commands/#port-forward)에 대해 더 알아본다.

