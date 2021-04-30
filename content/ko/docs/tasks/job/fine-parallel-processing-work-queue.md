---
title: 작업 대기열을 사용한 정밀 병렬 처리
content_type: task
min-kubernetes-server-version: v1.8
weight: 30
---

<!-- overview -->

이 예에서는, 지정된 파드에서 여러 병렬 워커 프로세스가 있는
쿠버네티스 잡(Job)을 실행한다.

이 예에서는, 각 파드가 생성될 때, 작업 대기열에서 하나의 작업 단위를
선택하여, 처리하고, 대기열이 비워질 때까지 반복한다.

이 예에서의 단계에 대한 개요는 다음과 같다.

1. **작업 대기열을 보관할 스토리지 서비스를 시작한다.**  이 예에서는, Redis를 사용하여
   작업 항목을 저장한다. 이전 예에서는, RabbitMQ를 사용했다. 이 예에서는, AMQP가 길이가
   정해져 있는 작업 대기열이 비어있을 때 클라이언트가 이를 감지할 수 있는 좋은 방법을 제공하지
   않기 때문에 Redis 및 사용자 지정의 작업 대기열 클라이언트 라이브러리를 사용한다. 실제로는
   Redis와 같은 저장소를 한 번 설정하고 여러 작업과 다른 것들의 작업 대기열로 재사용한다.
1. **대기열을 만들고, 메시지로 채운다.**  각 메시지는 수행할 하나의 작업을 나타낸다. 이
   예에서, 메시지는 긴 계산을 수행할 정수다.
1. **대기열에서 작업을 수행하는 잡을 시작한다.**  잡은 여러 파드를 시작한다. 각 파드는
   메시지 대기열에서 하나의 작업을 가져와서, 처리한 다음, 대기열이 비워질 때까지 반복한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

[잡](/ko/docs/concepts/workloads/controllers/job/)의 기본적이고,
병렬 작업이 아닌, 사용법에 대해 잘 알고 있어야 한다.

<!-- steps -->

## Redis 시작

이 문서의 예시에서는, 단순함을 위해, Redis의 단일 인스턴스를 시작한다.
Redis를 확장 가능하고 중복적으로 배포하는 예에 대해서는
[Redis 예시](https://github.com/kubernetes/examples/tree/master/guestbook)를 참고한다.

다음 파일을 직접 다운로드할 수도 있다.

- [`redis-pod.yaml`](/examples/application/job/redis/redis-pod.yaml)
- [`redis-service.yaml`](/examples/application/job/redis/redis-service.yaml)
- [`Dockerfile`](/examples/application/job/redis/Dockerfile)
- [`job.yaml`](/examples/application/job/redis/job.yaml)
- [`rediswq.py`](/examples/application/job/redis/rediswq.py)
- [`worker.py`](/examples/application/job/redis/worker.py)


## 작업으로 대기열 채우기

이제 몇 가지 "작업"으로 대기열을 채운다. 이 예제의 작업은 문자열을 출력하는
것이다.

Redis CLI를 실행하기 위한 임시 대화형 파드를 시작한다.

```shell
kubectl run -i --tty temp --image redis --command "/bin/sh"
Waiting for pod default/redis2-c7h78 to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

이제 엔터 키를 누르고, redis CLI를 시작하고, 몇몇 작업 항목이 포함된 목록을 생성한다.

```
# redis-cli -h redis
redis:6379> rpush job2 "apple"
(integer) 1
redis:6379> rpush job2 "banana"
(integer) 2
redis:6379> rpush job2 "cherry"
(integer) 3
redis:6379> rpush job2 "date"
(integer) 4
redis:6379> rpush job2 "fig"
(integer) 5
redis:6379> rpush job2 "grape"
(integer) 6
redis:6379> rpush job2 "lemon"
(integer) 7
redis:6379> rpush job2 "melon"
(integer) 8
redis:6379> rpush job2 "orange"
(integer) 9
redis:6379> lrange job2 0 -1
1) "apple"
2) "banana"
3) "cherry"
4) "date"
5) "fig"
6) "grape"
7) "lemon"
8) "melon"
9) "orange"
```

자, 키 `job2` 가 있는 목록이 작업 대기열이 된다.

참고: Kube DNS를 올바르게 설정하지 않은 경우, 위 블록의
첫 번째 단계를 `redis-cli -h $REDIS_SERVICE_HOST` 로 변경해야 할 수 있다.


## 이미지 생성

이제 실행할 이미지를 만들 준비가 되었다.

redis 클라이언트와 함께 python 워커 프로그램을 사용하여
메시지 큐에서 메시지를 읽는다.

rediswq.py([다운로드](/examples/application/job/redis/rediswq.py))라는
간단한 Redis 작업 대기열 클라이언트 라이브러리가 제공된다.

잡의 각 파드에 있는 "워커" 프로그램은 작업 대기열
클라이언트 라이브러리를 사용하여 작업을 가져온다. 다음은 워커 프로그램이다.

{{< codenew language="python" file="application/job/redis/worker.py" >}}

[`worker.py`](/examples/application/job/redis/worker.py),
[`rediswq.py`](/examples/application/job/redis/rediswq.py) 및
[`Dockerfile`](/examples/application/job/redis/Dockerfile) 파일을 다운로드할 수 있고, 그런 다음
이미지를 만들 수도 있다.

```shell
docker build -t job-wq-2 .
```

### 이미지 푸시

[도커 허브(Docker Hub)](https://hub.docker.com/)를 위해, 아래 명령으로
사용자의 username과 앱 이미지에 태그하고 허브에 푸시한다. `<username>` 을
사용자의 허브 username으로 바꾼다.

```shell
docker tag job-wq-2 <username>/job-wq-2
docker push <username>/job-wq-2
```

공용 저장소로 푸시하거나 [개인 저장소에 접근할 수 있도록
클러스터를 구성](/ko/docs/concepts/containers/images/)해야 한다.

[Google Container
Registry](https://cloud.google.com/tools/container-registry/)를 사용하는 경우,
사용자의 프로젝트 ID로 앱 이미지에 태그를 지정하고 GCR로 푸시한다. `<project>` 를
사용자의 프로젝트 ID로 바꾼다.

```shell
docker tag job-wq-2 gcr.io/<project>/job-wq-2
gcloud docker -- push gcr.io/<project>/job-wq-2
```

## 잡 정의

다음은 잡 정의이다.

{{< codenew file="application/job/redis/job.yaml" >}}

사용자 자신의 경로로 `gcr.io/myproject` 를
변경하려면 잡 템플릿을 편집해야 한다.

이 예에서, 각 파드는 대기열의 여러 항목에 대해 작업한 다음 더 이상 항목이 없을 때 종료된다.
워커는 작업 대기열이 비어있을 때를 감지하고 잡 컨트롤러는 작업 대기열에 대해
알지 못하기 때문에, 작업이 완료되면 워커에게 신호를 보낸다.
워커는 성공적으로 종료하여 대기열이 비어 있음을 알린다. 따라서, 워커가 성공적으로
종료하자마자, 컨트롤러는 작업이 완료되었음을 인식하고, 파드가 곧 종료된다.
따라서, 잡 완료 횟수를 1로 설정했다. 잡 컨트롤러는 다른 파드도 완료될 때까지
기다린다.

## 잡 실행

이제 잡을 실행한다.

```shell
kubectl apply -f ./job.yaml
```

이제 조금 기다린 다음, 잡을 확인한다.

```shell
kubectl describe jobs/job-wq-2
Name:             job-wq-2
Namespace:        default
Selector:         controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-2
Annotations:      <none>
Parallelism:      2
Completions:      <unset>
Start Time:       Mon, 11 Jan 2016 17:07:59 -0800
Pods Statuses:    1 Running / 0 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=b1c7e4e3-92e1-11e7-b85e-fa163ee3c11f
                job-name=job-wq-2
  Containers:
   c:
    Image:              gcr.io/exampleproject/job-wq-2
    Port:
    Environment:        <none>
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen    LastSeen    Count    From            SubobjectPath    Type        Reason            Message
  ---------    --------    -----    ----            -------------    --------    ------            -------
  33s          33s         1        {job-controller }                Normal      SuccessfulCreate  Created pod: job-wq-2-lglf8


kubectl logs pods/job-wq-2-7r7b2
Worker with sessionID: bbd72d0a-9e5c-4dd6-abf6-416cc267991f
Initial queue state: empty=False
Working on banana
Working on date
Working on lemon
```

보시다시피, 사용자의 파드 중 하나가 여러 작업 단위에서 작업했다.

<!-- discussion -->

## 대안

대기열 서비스를 실행하거나 작업 대기열을 사용하도록 컨테이너를 수정하는 것이 불편한 경우, 다른
[잡 패턴](/ko/docs/concepts/workloads/controllers/job/#잡-패턴)
중 하나를 고려할 수 있다.

만약 실행할 백그라운드 처리 작업의 연속 스트림이 있는 경우,
`ReplicaSet` 이 있는 백그라운드 워커를 실행하는 것과,
[https://github.com/resque/resque](https://github.com/resque/resque)와 같은
백그라운드 처리 라이브러리를 실행하는 것이 좋다.
