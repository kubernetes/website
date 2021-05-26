---
title: 작업 대기열을 사용한 거친 병렬 처리
min-kubernetes-server-version: v1.8
content_type: task
weight: 20
---


<!-- overview -->

이 예제에서는, 여러 병렬 워커 프로세스를 활용해 쿠버네티스 잡(Job)을
실행한다. 

이 예제에서는, 각 파드가 생성될 때 작업 대기열에서 하나의 작업 단위를
선택하여, 완료하고, 대기열에서 삭제하고, 종료한다. 

이 예제에서의 단계에 대한 개요는 다음과 같다.

1. **메시지 대기열 서비스를 시작한다.** 이 예에서는, RabbitMQ를 사용하지만, 다른 메시지 대기열을 이용해도
   된다. 실제로 사용할 때는, 한 번 메시지 대기열 서비스를 구축하고서 이를 여러 잡을 위해 재사용하기도 한다.
1. **대기열을 만들고, 메시지로 채운다.** 각 메시지는 수행할 하나의 작업을 나타낸다. 
   이 예제에서, 메시지는 긴 계산을 수행할 정수다.
1. **대기열에서 작업을 수행하는 잡을 시작한다.**  잡은 여러 파드를 시작한다. 각 파드는
   메시지 대기열에서 하나의 작업을 가져와서, 처리한 다음, 대기열이 비워질 때까지 반복한다.

## {{% heading "prerequisites" %}}


기본적이고, 병렬 작업이 아닌,
[잡](/ko/docs/concepts/workloads/controllers/job/)의 사용법에 대해 잘 알고 있어야 한다.

{{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 메시지 대기열 서비스 시작

이 예시에서는 RabbitMQ를 사용하지만, 다른 AMQP 유형의 메시지 서비스를 사용하도록 예시를 조정할 수 있다.

실제로 사용할 때는, 클러스터에 메시지 대기열 서비스를 한 번
구축하고서, 여러 많은 잡이나 오래 동작하는 서비스에 재사용할 수 있다.

다음과 같이 RabbitMQ를 시작한다.

```shell
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.3/examples/celery-rabbitmq/rabbitmq-service.yaml
```
```
service "rabbitmq-service" created
```

```shell
kubectl create -f https://raw.githubusercontent.com/kubernetes/kubernetes/release-1.3/examples/celery-rabbitmq/rabbitmq-controller.yaml
```
```
replicationcontroller "rabbitmq-controller" created
```

이 문서에서는 [celery-rabbitmq 예제](https://github.com/kubernetes/kubernetes/tree/release-1.3/examples/celery-rabbitmq)에 나오는 정도로만 rabbitmq를 사용한다.

## 메시지 대기열 서비스 테스트하기

이제, 메시지 대기열을 이용해 실험할 수 있다. 임시
대화형 파드를 만들어 그 위에 도구들을 설치하고,
대기열을 실험해본다. 

먼저 임시 대화형 파드를 만든다. 

```shell
# 임시 대화형 컨테이너를 만든다.
kubectl run -i --tty temp --image ubuntu:18.04
```
```
Waiting for pod default/temp-loe07 to be running, status is Pending, pod ready: false
... [ previous line repeats several times .. hit return when it stops ] ...
```

참고로 파드 이름과 명령 프롬프트는 위와 다를 수 있다.

다음으로 `amqp-tools`를 설치하여 메시지 대기열을 활용할 수 있게 한다.

```shell
# 도구들을 설치한다.
root@temp-loe07:/# apt-get update
.... [ lots of output ] ....
root@temp-loe07:/# apt-get install -y curl ca-certificates amqp-tools python dnsutils
.... [ lots of output ] ....
```

후에, 이 패키지들을 포함하는 도커 이미지를 만든다.

다음으로, rabbitmq 서비스를 발견할 수 있는지 확인한다.

```
# rabbitmq-service가 쿠버네티스로부터 주어진 DNS 이름을 갖는다.

root@temp-loe07:/# nslookup rabbitmq-service
Server:        10.0.0.10
Address:    10.0.0.10#53

Name:    rabbitmq-service.default.svc.cluster.local
Address: 10.0.147.152

# 주소는 다를 수 있다.
```

만약 Kube-DNS가 적절히 구축되지 않았다면, 전 단계 작업이 작동하지 않을 수 있다.
환경 변수를 통해서도 서비스 IP를 찾을 수 있다.

```
# env | grep RABBIT | grep HOST
RABBITMQ_SERVICE_SERVICE_HOST=10.0.147.152
# 주소는 다를 수 있다.
```

다음으로 대기열을 생성하고, 메시지를 발행하고 사용할 수 있는지 확인한다.

```shell
# 다음 줄에서, rabbitmq-service는 rabbitmq-service에 접근할 수 있는 
# 호스트네임이다. 5672는 rabbitmq의 표준 포트이다.

root@temp-loe07:/# export BROKER_URL=amqp://guest:guest@rabbitmq-service:5672
# 만약 전 단계에서 "rabbitmq-service"가 주소로 변환되지 않는다면,
# 이 커맨드를 대신 사용하면 된다.
# root@temp-loe07:/# BROKER_URL=amqp://guest:guest@$RABBITMQ_SERVICE_SERVICE_HOST:5672

# 이제 대기열을 생성한다.

root@temp-loe07:/# /usr/bin/amqp-declare-queue --url=$BROKER_URL -q foo -d
foo

# 대기열에 메시지를 하나 발행한다.

root@temp-loe07:/# /usr/bin/amqp-publish --url=$BROKER_URL -r foo -p -b Hello

# 다시 메시지를 돌려받는다.

root@temp-loe07:/# /usr/bin/amqp-consume --url=$BROKER_URL -q foo -c 1 cat && echo
Hello
root@temp-loe07:/#
```

마지막 커맨드에서, `amqp-consume` 도구는 대기열로부터 하나의 메시지를
받고(`-c 1`), 그 메시지를 임의의 명령 표준입력으로 전달한다. 이 경우에는, `cat` 프로그램이 표준입력으로부터 받은 값을 출력하고, echo가 캐리지 리턴을 더해주어
출력 결과가 보여진다.

## 작업으로 대기열 채우기

이제 몇 가지 "작업"으로 대기열을 채운다. 이 예제에서의 작업은 문자열을
출력하는 것이다.

실제로 사용할 때는, 메시지의 내용이 다음과 같을 수 있다. 

- 처리되어야 하는 파일들의 이름
- 프로그램의 추가 플래그
- 데이터베이스 테이블의 키(key) 범위
- 시뮬레이션의 구성 파라미터
- 렌더링해야 하는 씬(scene)의 프레임 번호

실제로는, 잡의 모든 파드에서 읽기-전용 모드로 필요한 큰 데이터가
있다면, 일반적으로 그 데이터를 NFS와 같은 공유 파일시스템에 넣고
모든 파드에 읽기 전용으로 마운트하거나, 파드 안에 있는 프로그램이 기본적으로 HDFS와 같은
클러스터 파일시스템으로부터 데이터를 불러들인다.

본 예제에서는, 대기열을 만들고 amqp 커맨드라인 도구를 이용해 대기열을 채울 것이다.
실제로는, amqp 라이브러리를 이용해 대기열을 채우는 프로그램을 작성하게 된다.

```shell
/usr/bin/amqp-declare-queue --url=$BROKER_URL -q job1  -d
job1
```
```shell
for f in apple banana cherry date fig grape lemon melon
do
  /usr/bin/amqp-publish --url=$BROKER_URL -r job1 -p -b $f
done
```

8개의 메시지로 대기열을 채웠다.

## 이미지 생성

이제 잡으로 실행할 이미지를 만들 준비가 되었다.

`amqp-consume` 유틸리티를 이용해 대기열로부터 메시지를 읽고,
실제 프로그램을 실행해 볼 것이다.
여기에 아주 간단한 예제 프로그램이 있다.

{{< codenew language="python" file="application/job/rabbitmq/worker.py" >}}

스크립트에 실행 권한을 준다.

```shell
chmod +x worker.py
```

이제 이미지를 빌드한다. 만약 소스 트리 안에서 작업하고
있다면, `examples/job/work-queue-1`로 디렉터리를 옮긴다.
아니면, 임시 디렉터리를 만들고, 그 디렉터리로 옮긴다.
[Dockerfile](/examples/application/job/rabbitmq/Dockerfile)과
[worker.py](/examples/application/job/rabbitmq/worker.py)를 다운로드한다.
위 두 경우 모두, 다음의 명령을 이용해 이미지를 빌드한다.

```shell
docker build -t job-wq-1 .
```

[도커 허브](https://hub.docker.com/)를 이용하기 위해, 앱 이미지를
사용자의 username으로 태깅하고 아래의 명령어를 이용해 허브에 푸시한다.
`<username>`을 사용자의 허브 username으로 대체한다.

```shell
docker tag job-wq-1 <username>/job-wq-1
docker push <username>/job-wq-1
```

만약 [구글 컨테이너
레지스트리](https://cloud.google.com/tools/container-registry/)를 이용하고 있다면, 
앱 이미지를 사용자의 프로젝트 ID를 이용해 태깅하고, GCR에 푸시한다.
`<proejct>` 부분을 사용자의 프로젝트 ID로 대체한다.

```shell
docker tag job-wq-1 gcr.io/<project>/job-wq-1
gcloud docker -- push gcr.io/<project>/job-wq-1
```

## 잡 정의

다음은 잡 정의이다. 잡의 사본을 만들고 위에서 정한 이름에 맞게
이미지를 수정하고, 파일 이름을 `./job.yaml`이라 정한다.


{{< codenew file="application/job/rabbitmq/job.yaml" >}}

이 예시에서는, 각 파드가 대기열로부터 얻은 하나의 아이템을 수행하고 종료한다.
그래서, 잡의 완료 횟수가 완료된 작업 아이템의 숫자에 대응한다.
예시에서 `.spec.completions: 8`이라 정한 것도, 대기열에 8개의 아이템을 넣었기 때문이다.

## 잡 실행

이제 잡을 실행한다.

```shell
kubectl apply -f ./job.yaml
```

이제 조금 기다린 다음, 잡을 확인한다.

```shell
kubectl describe jobs/job-wq-1
```
```
Name:             job-wq-1
Namespace:        default
Selector:         controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
Labels:           controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                  job-name=job-wq-1
Annotations:      <none>
Parallelism:      2
Completions:      8
Start Time:       Wed, 06 Sep 2017 16:42:02 +0800
Pods Statuses:    0 Running / 8 Succeeded / 0 Failed
Pod Template:
  Labels:       controller-uid=41d75705-92df-11e7-b85e-fa163ee3c11f
                job-name=job-wq-1
  Containers:
   c:
    Image:      gcr.io/causal-jigsaw-637/job-wq-1
    Port:
    Environment:
      BROKER_URL:       amqp://guest:guest@rabbitmq-service:5672
      QUEUE:            job1
    Mounts:             <none>
  Volumes:              <none>
Events:
  FirstSeen  LastSeen   Count    From    SubobjectPath    Type      Reason              Message
  ─────────  ────────   ─────    ────    ─────────────    ──────    ──────              ───────
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-hcobb
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-weytj
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-qaam5
  27s        27s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-b67sr
  26s        26s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-xe5hj
  15s        15s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-w2zqe
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-d6ppa
  14s        14s        1        {job }                   Normal    SuccessfulCreate    Created pod: job-wq-1-p17e0
```

모든 파드가 성공했다. 야호.



<!-- discussion -->

## 대안

이러한 접근은 "워커" 프로그램을 작업 대기열에 맞게 수정하지 않아도 
된다는 장점이 있다.

이 접근을 이용하려면, 메시지 대기열 서비스를 실행해야만 한다.
만약 메시지 대기열 서비스를 실행하는 게 불편하다면, 
다른 [잡 패턴](/ko/docs/concepts/workloads/controllers/job/#잡-패턴)을 고려해볼 수 있다.

이 접근은 모든 작업 아이템에 대해 파드를 생성한다. 만약 작업 아이템이 오직 몇 초밖에 걸리지 않는 작업이라면, 
매 작업마다 파드를 생성하는 것은 아주 큰 오버헤드를 더할 수 있다. 하나의 파드가
여러 작업 아이템을 수행하는 이 [예제](/ko/docs/tasks/job/fine-parallel-processing-work-queue/)를 고려해보자.

이 예제에서는, `amqp-consume` 유틸리티를 이용해 대기열로부터 메시지를 읽어
실제 프로그램을 실행했다. 이러면 메시지 대기열을 이용하기 위해 프로그램을 수정하지
않아도 된다는 장점이 있다.
[다른 예제](/ko/docs/tasks/job/fine-parallel-processing-work-queue/)는 
클라이언트 라이브러리를 이용해 작업 대기열과 소통하는 방법을 보여준다.

## 주의 사항

만약 작업 완료 수가 대기열에 있는 아이템의 숫자보다 적게 설정되면, 
모든 아이템 처리되지 않는다.

만약 작업 완료 수가 큐에 있는 아이템의 숫자보다 많게 설정되면,
대기열에 있는 아이템이 모두 처리되어도, 잡이 완료됐다고 표시되지
않고, 메시지를 기다리는 과정에서 막히는 파드를
추가적으로 실행시킨다.

이 패턴에서는 경쟁 상태(race)가 잘 나타나지 않는다. 만약 amqp-consume 명령으로부터
메시지가 인정되는 시간과 컨테이너가 성공적으로 종료되는
시간 사이에 컨테이너가 종료되거나, kubelet이 api-server에게 파드가 성공했음을 알리기 전에
노드가 비정상적으로 종료되면, 대기열의 모든 아이템이 처리되었다 해도,
잡이 완료되었다고 표시되지 않는다.
