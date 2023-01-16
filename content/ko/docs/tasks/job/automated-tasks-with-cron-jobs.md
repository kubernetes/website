---
title: 크론잡(CronJob)으로 자동화된 작업 실행
min-kubernetes-server-version: v1.21
# reviewers:
# - chenopis
content_type: task
weight: 10
---

<!-- overview -->

{{< glossary_tooltip text="크론잡" term_id="cronjob" >}}을 이용하여
{{< glossary_tooltip text="잡(Job)" term_id="job" >}}을 시간 기반의 스케줄에 따라 실행할 수 있다.
이러한 자동화된 잡은 리눅스 또는 유닉스 시스템의 [크론](https://ko.wikipedia.org/wiki/Cron) 작업처럼 실행된다.

크론 잡은 백업을 수행하거나 이메일을 보내는 것과 같이 주기적이고 반복적인 작업들을 생성하는 데 유용하다.
크론 잡은 시스템 사용이 적은 시간에 잡을 스케줄하려는 경우처럼 특정 시간에 개별 작업을 스케줄할 수도 있다.

크론 잡에는 제한 사항과 특이점이 있다.
예를 들어, 특정 상황에서는 하나의 크론 잡이 여러 잡을 생성할 수 있다.
따라서, 잡은 멱등성을 가져야 한다.

제한 사항에 대한 자세한 내용은 [크론잡](/ko/docs/concepts/workloads/controllers/cron-jobs/)을 참고한다.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

<!-- steps -->

## 크론잡(CronJob) 생성 {#creating-a-cron-job}

크론 잡은 구성 파일이 필요하다.
다음은 1분마다 간단한 데모 작업을 실행하는 크론잡 매니페스트다.

{{< codenew file="application/job/cronjob.yaml" >}}

다음 명령을 사용하여 크론잡 예제를 실행한다.

```shell
kubectl create -f https://k8s.io/examples/application/job/cronjob.yaml
```
출력 결과는 다음과 비슷하다.

```
cronjob.batch/hello created
```

크론 잡을 생성한 후, 다음 명령을 사용하여 상태를 가져온다.

```shell
kubectl get cronjob hello
```

출력 결과는 다음과 비슷하다.

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        <none>          10s
```

명령의 결과에서 알 수 있듯이, 크론 잡은 아직 잡을 스케줄하거나 실행하지 않았다.
약 1분 내로 잡이 생성되는지 확인한다.

```shell
kubectl get jobs --watch
```
출력 결과는 다음과 비슷하다.

```
NAME               COMPLETIONS   DURATION   AGE
hello-4111706356   0/1                      0s
hello-4111706356   0/1           0s         0s
hello-4111706356   1/1           5s         5s
```

이제 "hello" 크론 잡에 의해 스케줄된 실행 중인 작업을 확인했다.
잡 감시를 중지한 뒤에 크론 잡이 다시 스케줄되었는지를 확인할 수 있다.

```shell
kubectl get cronjob hello
```

출력 결과는 다음과 비슷하다.

```
NAME    SCHEDULE      SUSPEND   ACTIVE   LAST SCHEDULE   AGE
hello   */1 * * * *   False     0        50s             75s
```

크론 잡 `hello` 가 `LAST SCHEDULE` 열에 명시된 시간에 잡을 성공적으로 스케줄링한 것을 볼 수 있다.
현재는 0개의 활성 잡이 있고, 이는 작업이 완료되었거나 실패했음을 의미한다.

이제, 마지막으로 스케줄된 잡이 생성한 파드를 찾고 생성된 파드 중 하나의 표준 출력을 확인한다.

{{< note >}}
잡 이름과 파드 이름은 다르다.
{{< /note >}}

```shell
# "hello-4111706356"을 사용자의 시스템에 있는 잡 이름으로 바꾼다
pods=$(kubectl get pods --selector=job-name=hello-4111706356 --output=jsonpath={.items[*].metadata.name})
```
파드의 로그를 출력한다.

```shell
kubectl logs $pods
```
출력 결과는 다음과 비슷하다.

```
Fri Feb 22 11:02:09 UTC 2019
Hello from the Kubernetes cluster
```

## 크론잡(CronJob) 삭제 {#deleting-a-cron-job}

더 이상 크론 잡이 필요하지 않으면, `kubectl delete cronjob <cronjob name>` 명령을 사용해서 삭제한다.

```shell
kubectl delete cronjob hello
```

크론 잡을 삭제하면 생성된 모든 잡과 파드가 제거되고 추가 잡 생성이 중지된다.
[가비지(garbage) 수집](/ko/docs/concepts/architecture/garbage-collection/)에서 잡 제거에 대해 상세한 내용을 읽을 수 있다.

## 크론잡(CronJob) 명세 작성 {#writing-a-cron-job-spec}

다른 모든 쿠버네티스 오브젝트들과 마찬가지로,
크론잡은 `apiVersion`, `kind` 그리고 `metadata` 필드가 반드시 필요하다.
쿠버네티스 오브젝트 및 그 {{< glossary_tooltip text="매니페스트" term_id="manifest" >}} 다루기에 대한
자세한 내용은 [리소스 관리하기](/ko/docs/concepts/cluster-administration/manage-deployment/)와
[kubectl을 사용하여 리소스 관리하기](/ko/docs/concepts/overview/working-with-objects/object-management/) 문서를 참고한다.

크론잡(CronJob)의 각 매니페스트에는 [`.spec`](/ko/docs/concepts/overview/working-with-objects/kubernetes-objects/#오브젝트-명세-spec-와-상태-status) 섹션도 필요하다.

{{< note >}}
크론잡(CronJob)을 수정한 경우, 수정 후 새로 실행하는 작업부터 적용된다.
이미 시작된 작업(및 해당 파드)은 변경 없이 계속 실행된다.
즉, 크론잡(CronJob)은 기존 작업이 계속 실행 중이라면, 작업을 변경하지 _않는다._
{{< /note >}}

### 스케줄

`.spec.schedule` 은 `.spec` 의 필수 필드이다.
이 필드는 `0 * * * *` 또는 `@hourly`와 같은 [크론](https://ko.wikipedia.org/wiki/Cron) 형식의 문자열을 받아, 
해당 잡이 생성 및 실행될 스케줄 시간으로 설정한다.

이 형식은 확장된 "Vixie cron" 스텝(step) 값도 포함한다. 이 내용은
[FreeBSD 매뉴얼](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)에 설명되어 있다.

> 스텝 값은 범위(range)와 함께 사용할 수 있다. 범위 뒤에 `/<number>` 를
> 지정하여 범위 내에서 숫자만큼의 값을 건너뛴다. 예를 들어,
> 시간 필드에 `0-23/2` 를 사용하여 매 2시간마다 명령 실행을
> 지정할 수 있다(V7 표준의 대안은 `0,2,4,6,8,10,12,14,16,18,20,22`
> 이다). 별표(asterisk) 뒤에 붙이는 스텝도 허용되며,
> "2시간마다"라고 지정하고 싶으면, 간단히 `*/2` 를 사용하면 된다.

{{< note >}}
스케줄에서 물음표(`?`)는 별표 `*` 와 동일한 의미를 가지며,
주어진 필드에 대해 사용할 수 있는 모든 값을 나타낸다.
{{< /note >}}

### 잡 템플릿

`.spec.jobTemplate` 은 잡에 대한 템플릿이며, 이것은 필수 필드다.
이것은 중첩되어(nested) 있고 `apiVersion` 이나 `kind` 가 없다는 것을 제외하면,
[잡](/ko/docs/concepts/workloads/controllers/job/)과 정확히 같은 스키마를 가진다.
잡 `.spec` 을 작성하는 것에 대한 내용은 [잡 명세 작성하기](/ko/docs/concepts/workloads/controllers/job/#잡-사양-작성하기)를 참고한다.

### 시작 기한

`.spec.startingDeadlineSeconds` 필드는 선택 사항이다.
어떤 이유로든 스케줄된 시간을 놓친 경우 잡의 시작 기한을 초 단위로 나타낸다.
기한이 지나면, 크론 잡이 잡을 시작하지 않는다.
이러한 방식으로 기한을 맞추지 못한 잡은 실패한 작업으로 간주된다.
이 필드를 지정하지 않으면, 잡에 기한이 없다.

`.spec.startingDeadlineSeconds` 필드가 (null이 아닌 값으로) 설정되어 있다면,
크론잡 컨트롤러는 예상 잡 생성 시각과 현재 시각의 차이를 측정하고,
시각 차이가 설정한 값보다 커지면 잡 생성 동작을 스킵한다.

예를 들어, `200` 으로 설정되었다면,
예상 잡 생성 시각으로부터 200초까지는 잡이 생성될 수 있다.

### 동시성 정책

`.spec.concurrencyPolicy` 필드도 선택 사항이다.
이것은 이 크론 잡에 의해 생성된 잡의 동시 실행을 처리하는 방법을 지정한다.
명세는 다음의 동시성 정책 중 하나만 지정할 수 있다.

* `Allow`(기본값): 크론 잡은 동시에 실행되는 잡을 허용한다.
* `Forbid`: 크론 잡은 동시 실행을 허용하지 않는다.
  새로운 잡을 실행할 시간이고 이전 잡 실행이 아직 완료되지 않은 경우, 크론 잡은 새로운 잡 실행을 건너뛴다.
* `Replace`: 새로운 잡을 실행할 시간이고 이전 잡 실행이 아직 완료되지 않은 경우,
  크론 잡은 현재 실행 중인 잡 실행을 새로운 잡 실행으로 대체한다.

참고로 동시성 정책은 동일한 크론 잡에 의해 생성된 잡에만 적용된다.
크론 잡이 여러 개인 경우, 각각의 잡은 항상 동시에 실행될 수 있다.

### 일시 정지

`.spec.suspend` 필드도 선택 사항이다.
`true` 로 설정되면, 모든 후속 실행이 일시 정지된다.
이 설정은 이미 시작된 실행에는 적용되지 않는다.
기본값은 false이다.

{{< caution >}}
스케줄된 시간 동안 잡이 일시 정지되어 있다면 누락된 잡으로 간주한다.
[시작 기한](#시작-기한) 없이 기존의 크론 잡에 대해 `.spec.suspend` 가 `true` 에서 `false` 로 변경되면,
누락된 잡들이 즉시 스케줄된다.
{{< /caution >}}

### 잡 히스토리 한도

`.spec.successfulJobsHistoryLimit` 와 `.spec.failedJobsHistoryLimit` 필드는 선택 사항이다.
이들 필드는 기록을 보관해야 하는 완료 및 실패한 잡의 개수를 지정한다.
기본적으로, 각각 3과 1로 설정된다.
한도를 `0` 으로 설정하는 것은 잡 완료 후에 해당 잡 유형의 기록을 보관하지 않는다는 것이다.
