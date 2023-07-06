---
title: 정적 작업 할당을 통한 병렬 처리를 위한 색인된 잡
content_type: task
min-kubernetes-server-version: v1.21
weight: 30
---

{{< feature-state for_k8s_version="v1.24" state="stable" >}}

<!-- overview -->


이 예제에서는, 여러 병렬 워커(worker) 프로세스를 활용해 쿠버네티스 잡(Job)을
실행한다.
각 워커는 각 파드에서 실행되는 서로 다른 컨테이너다. 파드에는
컨트롤 플레인이 자동으로 설정한 _인덱스 번호_ 가 부여되며, 이를 통해 각 파드는
전체 태스크 중 어느 부분을 수행해야 할 지 식별할 수 있다.

파드 인덱스는 10진수 값을 문자열로 표현한 {{< glossary_tooltip text="어노테이션" term_id="annotation" >}}
`batch.kubernetes.io/job-completion-index` 를 통해
사용할 수 있다. 컨테이너화된 태스크 프로세스가 이 인덱스 정보를 가져갈 수 있도록,
[다운워드(downward) API](/ko/docs/concepts/workloads/pods/downward-api/)
메커니즘을 사용하여 어노테이션의 값을 발행할 수 있다.
편의상, 컨트롤 플레인은 downward API를 자동 설정하여
`JOB_COMPLETION_INDEX` 환경변수에 인덱스를 노출할 수 있도록 한다.

이 예제에서의 단계에 대한 개요는 다음과 같다.

1. **색인된 완료(indexed completion)를 사용하는 잡 매니페스트를 정의한다**.
   downward API를 통해 파드 인덱스 어노테이션을
   환경변수 또는 파일의 형태로 컨테이너에 전달할 수 있다.
2. **해당 매니페스트를 바탕으로 색인된(`Indexed`) 잡을 시작한다**.

## {{% heading "prerequisites" %}}

기본적이고, 병렬 작업이 아닌,
[잡](/ko/docs/concepts/workloads/controllers/job/)의 사용법에 대해 잘 알고 있어야 한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

<!-- steps -->

## 접근 방법 선택하기

워커 프로그램에서 작업 항목에 접근하기 위한 몇 가지 선택지가 있다.

1. `JOB_COMPLETION_INDEX` 환경변수를 읽는다. 잡
   {{< glossary_tooltip text="컨트롤러" term_id="controller" >}} 는
   이 환경변수를 완료 인덱스 정보를 갖고 있는 어노테이션에 자동
   연결한다.
2. 완료 인덱스 정보를 갖고 있는 파일을 읽는다.
3. 프로그램을 수정할 수 없다면,
   위 방법을 통해 인덱스를 읽고 프로그램의
   입력값으로 사용 가능한 형태로 변환하는 스크립트로 감싸준다.

예를 들어, 3번째 방법을 선택했으며 
[rev](https://man7.org/linux/man-pages/man1/rev.1.html) 유틸리티를 실행한다고 가정하면, 이
프로그램은 파일을 인자로 받아 그 내용을 거꾸로 출력한다.

```shell
rev data.txt
```

`rev` 툴은
[`busybox`](https://hub.docker.com/_/busybox) 컨테이너 이미지 내에서 실행할 것이다.

예제에 불과하므로, 각 파드는 아주 작은 작업(짧은 문자열 거꾸로 뒤집기)만을
수행한다. 실제 워크로드에서는 예를
들어
장면 정보를 바탕으로 60초 길이의 영상을 제작하는 태스크에 해당하는 잡을 생성할 수도 있다.
영상 렌더링 잡의 각 작업 항목은 영상 클립의 특정
프레임을 렌더링하는 것이다. 색인된 완료는 잡에 포함된 각 파드가
클립의 시작 지점부터 프레임 수를 세어 어느 프레임을 렌더링하고 발행해야 할 지
알고 있음을 의미한다.

## 색인된 잡 정의하기

다음은 색인된(`Indexed`) 완료 모드를 사용하는 잡 매니페스트의 예이다.

{{< codenew language="yaml" file="application/job/indexed-job.yaml" >}}

위 예제에서, 잡 컨트롤러가 모든 컨테이너에 설정한 `JOB_COMPLETION_INDEX`
내장 환경 변수를 사용한다. [초기화 컨테이너](/ko/docs/concepts/workloads/pods/init-containers/)는
인덱스를 정적 값으로 매핑하고 [emptyDir 볼륨](/ko/docs/concepts/storage/volumes/#emptydir)을 통해
워커를 실행중인 컨테이너와 공유하는 파일에 쓴다.
선택적으로 컨테이너에 인덱스를 발행하기 위해 [downward API를 통해
직접 환경 변수를 정의](/ko/docs/tasks/inject-data-application/environment-variable-expose-pod-information/)할
수 있다. 또한 [환경변수 또는 파일로 된 컨피그맵(ConfigMap)](/docs/tasks/configure-pod-container/configure-pod-configmap/)으로부터
값 목록을 불러올 수도 있다.

혹은 다음 예제와 같이 직접 [downward API를 사용하여 어노테이션의 값을 볼륨 파일의 형태로 전달](
/ko/docs/tasks/inject-data-application/downward-api-volume-expose-pod-information/#파드-필드-저장)할
수도 있다.

{{< codenew language="yaml" file="application/job/indexed-job-vol.yaml" >}}

## 잡 실행하기

이제 잡을 실행하자.

```shell
# 첫 번째 접근 방법을 사용한다. ($JOB_COMPLETION_INDEX 에 의존)
kubectl apply -f https://kubernetes.io/examples/application/job/indexed-job.yaml
```

이 잡을 생성할 때, 컨트롤 플레인은 명시한 각 인덱스당 하나씩 일련의 파드를 생성한다. `.spec.parallelism`의 값은 한 번에 실행 가능한 수를 결정하는 반면 `.spec.completions`는 잡에서 총 생성되는 파드의 수를 결정한다.

`.spec.parallelism`가 `.spec.completions`보다 작기 때문에, 컨트롤 플레인은 추가로 파드를 시작하기 전 최초 생성된 파드 중 일부가 완료되기를 기다린다.

아래와 같이 시간 제한(timeout)을 설정하고, 잡이 성공할 때까지 기다린다.
```shell
# 조건명은 대소문자를 구분하지 않는다.
kubectl wait --for=condition=complete --timeout=300s job/indexed-job
```

잡의 상세 설명을 출력하여 성공적으로 수행되었는지 확인한다.


```shell
kubectl describe jobs/indexed-job
```

출력 결과는 다음과 비슷하다.

```
Name:              indexed-job
Namespace:         default
Selector:          controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
Labels:            controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
                   job-name=indexed-job
Annotations:       <none>
Parallelism:       3
Completions:       5
Start Time:        Thu, 11 Mar 2021 15:47:34 +0000
Pods Statuses:     2 Running / 3 Succeeded / 0 Failed
Completed Indexes: 0-2
Pod Template:
  Labels:  controller-uid=bf865e04-0b67-483b-9a90-74cfc4c3e756
           job-name=indexed-job
  Init Containers:
   input:
    Image:      docker.io/library/bash
    Port:       <none>
    Host Port:  <none>
    Command:
      bash
      -c
      items=(foo bar baz qux xyz)
      echo ${items[$JOB_COMPLETION_INDEX]} > /input/data.txt

    Environment:  <none>
    Mounts:
      /input from input (rw)
  Containers:
   worker:
    Image:      docker.io/library/busybox
    Port:       <none>
    Host Port:  <none>
    Command:
      rev
      /input/data.txt
    Environment:  <none>
    Mounts:
      /input from input (rw)
  Volumes:
   input:
    Type:       EmptyDir (a temporary directory that shares a pod's lifetime)
    Medium:
    SizeLimit:  <unset>
Events:
  Type    Reason            Age   From            Message
  ----    ------            ----  ----            -------
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-njkjj
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-9kd4h
  Normal  SuccessfulCreate  4s    job-controller  Created pod: indexed-job-qjwsz
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-fdhq5
  Normal  SuccessfulCreate  1s    job-controller  Created pod: indexed-job-ncslj
```

이 예제에서는 각 인덱스에 직접 설정한 값을 갖는 잡을 실행한다. 파드
중 하나의 출력을 검사할 수도 있다.

```shell
kubectl logs indexed-job-fdhq5 # 잡에 속한 파드의 이름에 맞춰 변경한다.
```


출력 결과는 다음과 비슷하다.

```
xuq
```
