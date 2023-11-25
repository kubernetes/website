---
title: 스토리지의 볼륨을 사용하는 파드 구성
content_type: task
weight: 50
---

<!-- overview -->

이 페이지는 스토리지의 볼륨을 사용하는 파드를 구성하는 방법을 설명한다.

컨테이너 파일 시스템은 컨테이너가 살아있는 동안만 존재한다. 따라서
컨테이너가 종료되고 재시작할 때, 파일 시스템 변경사항이 손실된다. 컨테이너와
독립적이며 보다 일관된 스토리지를 위해 사용자는 [볼륨](/ko/docs/concepts/storage/volumes/)을
사용할 수 있다. 이것은 레디스(Redis)와 같은 키-값 저장소나
데이터베이스와 같은 스테이트풀 애플리케이션에 매우 중요하다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 파드에 볼륨 구성

이 연습에서는 하나의 컨테이너를 실행하는 파드를 생성한다. 이 파드는
컨테이너가
종료되고, 재시작 하더라도 파드의 수명동안 지속되는 [emptyDir](/ko/docs/concepts/storage/volumes/#emptydir)
유형의 볼륨이 있다.
파드의 구성 파일은 다음과 같다.

{{< codenew file="pods/storage/redis.yaml" >}}

1. 파드 생성

   ```shell
   kubectl apply -f https://k8s.io/examples/pods/storage/redis.yaml
   ```

1. 파드의 컨테이너가 Running 중인지 확인하고, 파드의 변경사항을
지켜본다.

   ```shell
   kubectl get pod redis --watch
   ```

   출력은 이와 유사하다.

   ```shell
   NAME      READY     STATUS    RESTARTS   AGE
   redis     1/1       Running   0          13s
   ```

1. 다른 터미널에서 실행 중인 컨테이너의 셸을 획득한다.

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. 셸에서 `/data/redis` 로 이동하고, 파일을 생성한다.

   ```shell
   root@redis:/data# cd /data/redis/
   root@redis:/data/redis# echo Hello > test-file
   ```

1. 셸에서 실행 중인 프로세스 목록을 확인한다.

   ```shell
   root@redis:/data/redis# apt-get update
   root@redis:/data/redis# apt-get install procps
   root@redis:/data/redis# ps aux
   ```

   출력은 이와 유사하다.

   ```shell
   USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND
   redis        1  0.1  0.1  33308  3828 ?        Ssl  00:46   0:00 redis-server *:6379
   root        12  0.0  0.0  20228  3020 ?        Ss   00:47   0:00 /bin/bash
   root        15  0.0  0.0  17500  2072 ?        R+   00:48   0:00 ps aux
   ```

1. 셸에서 Redis 프로세스를 강제종료(kill)한다.

   ```shell
   root@redis:/data/redis# kill <pid>
   ```

   여기서 `<pid>`는 Redis 프로세스 ID(PID) 이다.

1. 원래 터미널에서, Redis 파드의 변경을 지켜본다. 결국,
   다음과 유사한 것을 보게 될 것이다.

   ```shell
   NAME      READY     STATUS     RESTARTS   AGE
   redis     1/1       Running    0          13s
   redis     0/1       Completed  0         6m
   redis     1/1       Running    1         6m
   ```

이때, 컨테이너는 종료되고 재시작된다. 이는
Redis 파드의
[restartPolicy](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podspec-v1-core)는
`Always` 이기 때문이다.

1. 재시작된 컨테이너의 셸을 획득한다.

   ```shell
   kubectl exec -it redis -- /bin/bash
   ```

1. 셸에서 `/data/redis` 로 이동하고, `test-file` 이 여전히 존재하는지 확인한다.

   ```shell
   root@redis:/data/redis# cd /data/redis/
   root@redis:/data/redis# ls
   test-file
   ```

1. 이 연습을 위해 생성한 파드를 삭제한다.

   ```shell
   kubectl delete pod redis
   ```

## {{% heading "whatsnext" %}}

* [볼륨](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#volume-v1-core)을 참고한다.

* [파드](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)을 참고한다.

* 쿠버네티스는 `emptyDir` 이 제공하는 로컬 디스크 스토리지뿐만 아니라,
중요한 데이터에 선호하는 GCE의 PD, EC2의 EBS를 포함해서
네트워크 연결 스토리지(NAS) 솔루션을 지원하며,
노드의 디바이스 마운트, 언마운트와 같은 세부사항을 처리한다.
자세한 내용은 [볼륨](/ko/docs/concepts/storage/volumes/)을 참고한다.
