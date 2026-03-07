---
# reviewers:
# - erictune
# - soltysh
# - janetkuo
title: 크론잡
api_metadata:
- apiVersion: "batch/v1"
  kind: "CronJob"
content_type: concept
description: >-
  크론잡은 반복적인 일정에 따라 일회성 작업을 시작한다. 
weight: 80
hide_summary: true # Listed separately in section index
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

_크론잡_ 은 반복 일정에 따라 {{< glossary_tooltip term_id="job" text="잡" >}}을 만든다.

크론잡은 백업, 리포트 생성과 같은 정규적으로 스케줄된 액션을 수행하는 것을 
의미한다. 하나의 크론잡 오브젝트는 Unix 시스템의 _크론탭_ (크론 테이블) 파일의 한 줄과 
같다. 크론잡은 잡을 [크론](https://ko.wikipedia.org/wiki/Cron) 형식으로 쓰여진 
주어진 일정에 따라 주기적으로 동작시킨다.

크론잡에는 한계와 특이 사항이 있다.
예를 들어, 특정 상황에서 하나의 크론잡이 여러 개의 동시 잡을 생성할 수 있다. 아래의 [한계](#cron-job-limitations)를 참고한다.

컨트롤 플레인이 크론잡에 대해 새로운 잡과 (간접적으로) 파드를 생성할 때, 크론잡의 `.metadata.name`이
해당 파드의 이름을 짓는 기반이 된다. 크론잡의 이름은 유효한
[DNS 서브도메인](/docs/concepts/overview/working-with-objects/names#dns-subdomain-names)
값이어야 하지만, 파드 호스트네임에 예기치 않은 결과를 만들 수 있다. 최상의 호환성을 위해,
[DNS 레이블](/docs/concepts/overview/working-with-objects/names#dns-label-names)의
보다 제한적인 규칙을 따르는 것이 좋다.
이름이 DNS 서브도메인이더라도 52자 이하여야 
한다. 이는 크론잡 컨트롤러가 제공된 이름에 자동으로 
11자를 추가하고, 잡 이름의 최대 길이가
63자라는 제약 조건이 있기 때문이다.

<!-- body -->
## 예시

이 크론잡 매니페스트 예제는 현재 시간과 hello 메시지를 1분마다 출력한다.

{{% code_sample file="application/job/cronjob.yaml" %}}

([크론잡으로 자동화된 작업 실행하기](/docs/tasks/job/automated-tasks-with-cron-jobs/)에서
이 예시를 더 자세히 설명한다).

## 크론잡 명세 작성
### 스케줄 문법 
`.spec.schedule` 필드는 필수이다. 해당 필드의 값은 [크론](https://en.wikipedia.org/wiki/Cron) 문법을 따른다.

```
# ┌───────────── 분 (0 - 59)
# │ ┌───────────── 시 (0 - 23)
# │ │ ┌───────────── 일 (1 - 31)
# │ │ │ ┌───────────── 월 (1 - 12)
# │ │ │ │ ┌───────────── 요일 (0 - 6) (일요일부터 토요일까지)
# │ │ │ │ │                                   또는 sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# │ │ │ │ │
# * * * * *
```

예를 들어, `0 3 * * 1`은 해당 작업이 매주 월요일 오전 3시에 실행되도록 예약됨을 의미한다.

이 형식은 확장된 "Vixie cron" 스텝 값도 포함한다.
[FreeBSD 매뉴얼](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)에서 설명하는 내용은 다음과 같다.

> 스텝 값은 범위와 함께 사용할 수 있다. 범위 뒤에 `/<number>`를
> 붙이면 범위 내에서 해당 숫자의 값만큼 건너뛴다.
> 예를 들어, `0-23/2`를 시간 필드에 사용하면 매 2시간마다 명령을
> 실행하도록 지정할 수 있다 (V7 표준에서의 대안은
> `0,2,4,6,8,10,12,14,16,18,20,22`이다). 애스터리스크 뒤에도
> 스텝을 사용할 수 있으므로, "매 2시간마다"라고 지정하려면 `*/2`를 사용하면 된다.

{{< note >}}
스케줄에서 물음표(`?`)는 애스터리스크 `*`와 같은 의미를 가지며,
해당 필드에 사용 가능한 모든 값을 나타낸다.
{{< /note >}}

표준 문법 외에도 `@monthly`와 같은 매크로도 사용할 수 있다.

| 항목   										 | 설명	      																								  | 상응 표현       |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| 매년 1월 1일 자정에 실행                 										   | 0 0 1 1 * 		|
| @monthly 									| 매월 1일 자정에 실행  	                                        | 0 0 1 * * 		|
| @weekly 									| 매주 일요일 자정에 실행							                             | 0 0 * * 0 		|
| @daily (or @midnight)			| 매일 자정에 실행 																             	| 0 0 * * * 		|
| @hourly 									| 매시 0분에 시작                          								       | 0 * * * * 		|

크론잡 스케줄 표현을 생성하기 위해서 [crontab.guru](https://crontab.guru/)와 같은 웹 도구를 사용할 수도 있다.

### 잡 템플릿

`.spec.jobTemplate`은 크론잡이 생성하는 잡의 템플릿을 정의하며, 필수 항목이다.
[잡](/docs/concepts/workloads/controllers/job/)과 정확히 동일한 스키마를 가지지만,
중첩되어 있으며 `apiVersion`이나 `kind`가 없다.
템플릿으로 생성되는 잡에 대해
{{< glossary_tooltip text="레이블" term_id="label" >}}이나
{{< glossary_tooltip text="어노테이션" term_id="annotation" >}} 등의 공통 메타데이터를 지정할 수 있다.
잡의 `.spec` 작성에 대한 정보는 [잡 명세 작성](/docs/concepts/workloads/controllers/job/#writing-a-job-spec)을 참고한다.

### 지연된 잡 시작에 대한 데드라인 {#starting-deadline}

`.spec.startingDeadlineSeconds` 필드는 선택 사항이다.
이 필드는 어떤 이유로든 잡이 예정된 시간을 놓친 경우,
잡을 시작하기 위한 데드라인(초 단위 정수)을 정의한다.

데드라인을 놓치면 크론잡은 해당 잡 인스턴스를 건너뛴다(이후 실행은 여전히 예약된다).
예를 들어, 하루에 두 번 실행되는 백업 잡이 있다면, 최대 8시간까지 늦게 시작하는 것은 허용하되
그 이후에는 허용하지 않을 수 있다. 그보다 늦은 백업은 유용하지 않으므로 다음 예정된
실행을 기다리는 것이 나을 수 있기 때문이다.

설정된 데드라인을 놓친 잡에 대해 쿠버네티스는 이를 실패한 잡으로 처리한다.
크론잡에 `startingDeadlineSeconds`를 지정하지 않으면 잡 발생에 데드라인이 없다.

`.spec.startingDeadlineSeconds` 필드가 설정되면 (null이 아닌 경우) 크론잡
컨트롤러는 잡이 생성될 것으로 예상되는 시간과 현재 시간 사이의
차이를 측정한다. 차이가 해당 한도보다 크면 해당 실행을 건너뛴다.

예를 들어, `200`으로 설정되면 실제 일정 이후 최대 200초까지
잡 생성을 허용한다.

### 동시성 정책

`.spec.concurrencyPolicy` 필드도 선택 사항이다.
이 필드는 이 크론잡에 의해 생성된 잡의 동시 실행을 어떻게 처리할지 지정한다.
명세에는 다음 동시성 정책 중 하나만 지정할 수 있다.

* `Allow` (기본값): 크론잡이 동시에 실행되는 잡을 허용한다
* `Forbid`: 크론잡이 동시 실행을 허용하지 않는다. 새 잡을 실행할 시간이 되었는데
  이전 잡 실행이 아직 완료되지 않은 경우, 크론잡은 새 잡 실행을 건너뛴다. 또한 이전 잡 실행이
  완료될 때 `.spec.startingDeadlineSeconds`가 여전히 고려되며 새 잡 실행이
  발생할 수 있다는 점에 유의한다.
* `Replace`: 새 잡을 실행할 시간이 되었는데 이전 잡 실행이 아직 완료되지 않은 경우, 크론잡은
  현재 실행 중인 잡을 새 잡 실행으로 대체한다.

동시성 정책은 동일한 크론잡에 의해 생성된 잡에만 적용된다는 점에 유의한다.
여러 크론잡이 있는 경우, 각각의 잡은 항상 동시에 실행되는 것이 허용된다.

### 스케줄 일시 중지

`.spec.suspend` 선택 필드를 true로 설정하여 크론잡의 잡 실행을 일시 중지할 수 
있다. 이 필드의 기본값은 false이다.

이 설정은 크론잡이 이미 시작한 잡에는 영향을 주지 _않는다_.

이 필드를 true로 설정하면, 모든 후속 실행이 일시 중지된다 (예약은 유지되지만
크론잡 컨트롤러가 작업을 실행하기 위한 잡을 시작하지 않는다).
크론잡을 일시 중지 해제할 때까지 이 상태가 유지된다.

{{< caution >}}
예약된 시간 동안 일시 중지된 실행은 누락된 잡으로 집계된다.
기존 크론잡에서 [시작 데드라인](#starting-deadline) 없이 `.spec.suspend`가 `true`에서 `false`로 변경되면,
누락된 잡이 즉시 스케줄된다.
{{< /caution >}}

### 잡 히스토리 한도

`.spec.successfulJobsHistoryLimit`과 `.spec.failedJobsHistoryLimit` 필드는
완료된 잡과 실패한 잡을 얼마나 보관할지 지정한다. 두 필드 모두 선택 사항이다.

* `.spec.successfulJobsHistoryLimit`: 이 필드는 성공적으로 완료된 잡의
보관 수를 지정한다. 기본값은 `3`이다. 이 필드를 `0`으로 설정하면 성공한 잡을 보관하지 않는다.

* `.spec.failedJobsHistoryLimit`: 이 필드는 실패한 잡의 보관 수를 지정한다.
기본값은 `1`이다. 이 필드를 `0`으로 설정하면 실패한 잡을 보관하지 않는다.

잡을 자동으로 정리하는 다른 방법에 대해서는
[완료된 잡을 자동으로 정리](/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)를 참고한다.

### 타임 존

{{< feature-state for_k8s_version="v1.27" state="stable" >}}

타임 존이 지정되지 않은 크론잡의 경우, {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}는
로컬 타임 존을 기준으로 스케줄을 해석한다.

`.spec.timeZone`을 유효한 [타임 존](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) 이름으로
설정하여 크론잡의 타임 존을 지정할 수 있다.
예를 들어, `.spec.timeZone: "Etc/UTC"`로 설정하면 쿠버네티스는
스케줄을 협정 세계시 기준으로 해석한다.

Go 표준 라이브러리의 타임 존 데이터베이스가 바이너리에 포함되며, 시스템에서 외부 데이터베이스를 사용할 수 없을 때 폴백(fallback)으로 사용된다.

## 크론잡의 한계 {#cron-job-limitations}

### 지원되지 않는 타임 존 명세

`.spec.schedule` 내부에서 `CRON_TZ` 또는 `TZ` 변수를 사용하여 타임 존을 지정하는 것은
**공식적으로 지원되지 않는다**(그리고 지원된 적이 없다). `TZ` 또는 `CRON_TZ` 타임 존
명세가 포함된 스케줄을 설정하려고 하면, 쿠버네티스는 유효성 검사 오류와 함께 리소스
생성 또는 업데이트에 실패한다. 대신 [타임 존 필드](#타임-존)를 사용하여 
타임 존을 지정해야 한다.

### 크론잡 수정

설계상 크론잡은 _새로운_ 잡을 위한 템플릿을 포함한다.
기존 크론잡을 수정하면, 변경 사항은 수정이 완료된 후 실행되기 시작하는
새 잡에 적용된다. 이미 시작된 잡(및 해당 파드)은
변경 없이 계속 실행된다.
즉, 크론잡은 기존 잡이 여전히 실행 중이더라도 해당 잡을 업데이트하지 _않는다_.

### 잡 생성

크론잡은 일정의 실행 시간마다 _대략_ 한 번의 잡 오브젝트를 생성한다.
스케줄링이 대략적인 이유는 
특정 상황에서 두 개의 잡이 생성되거나, 잡이 생성되지 않을 수 있기 때문이다. 
쿠버네티스는 이러한 상황을 피하려고 하지만, 완전히 방지하지는 못한다. 따라서
잡은 _멱등성_ 을 가져야 한다.

쿠버네티스 v1.32부터, 크론잡은 생성하는 잡에
`batch.kubernetes.io/cronjob-scheduled-timestamp` 어노테이션을 적용한다. 이 어노테이션은
잡이 원래 예정된 생성 시간을 나타내며 RFC3339 형식으로 표기된다.

`startingDeadlineSeconds`가 큰 값으로 설정되거나 설정되지 않은 경우 (기본값)
그리고 `concurrencyPolicy`가 `Allow`로 설정된 경우, 잡은 항상
적어도 한 번은 실행된다.

{{< caution >}}
`startingDeadlineSeconds` 가 10초 미만의 값으로 설정되면, 크론잡이 스케줄되지 않을 수 있다. 이는 크론잡 컨트롤러가 10초마다 항목을 확인하기 때문이다.
{{< /caution >}}


모든 크론잡에 대해 크론잡 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 는 마지막 일정부터 지금까지 얼마나 많은 일정이 누락되었는지 확인한다. 만약 100회 이상의 일정이 누락되었다면, 잡을 실행하지 않고 아래와 같은 에러 로그를 남긴다.

```
too many missed start times. Set or decrease .spec.startingDeadlineSeconds or check clock skew
```
이 동작은 누락 보상(catch-up) 스케줄링에 적용되며, 크론잡이 실행을 중단한다는 의미가 아니다.

예를 들어, `concurrencyPolicy: Forbid`를 사용할 때, 오래 실행되는 잡으로 인해 예정된 시간이 건너뛰어질 수 있지만, 이전 잡이 완료되면 새 잡이 생성될 수 있다.

중요한 것은 만약 `startingDeadlineSeconds` 필드가 설정이 되면(`nil` 이 아닌 값으로), 컨트롤러는 마지막 일정부터 지금까지 대신 `startingDeadlineSeconds` 값에서 몇 개의 잡이 누락되었는지 카운팅한다. 예를 들면, `startingDeadlineSeconds` 가 `200` 이면, 컨트롤러는 최근 200초 내 몇 개의 잡이 누락되었는지 카운팅한다.

크론잡은 정해진 시간에 생성되는데 실패하면 누락(missed)된 것으로 집계된다. 예를 들어 `concurrencyPolicy`가 `Forbid` 로 설정되어 있고 이전 크론잡이 여전히 실행 중인 상태라면, 크론잡은 일정에 따라 시도되었다가 생성을 실패하고 누락된 것으로 집계될 것이다.

즉, 크론잡이 `08:30:00` 에 시작하여 매 분마다 새로운 잡을 실행하도록 설정이 되었고,
`startingDeadlineSeconds` 값이 설정되어 있지 않는다고 가정해보자. 만약 크론잡 컨트롤러가
`08:29:00` 부터 `10:21:00` 까지 고장이 나면, 일정을 놓친 작업 수가 100개를 초과하여 잡이 실행되지 않을 것이다.

이 개념을 더 자세히 설명하자면, 크론잡이 `08:30:00` 부터 매 분 실행되는 일정으로 설정되고,
`startingDeadlineSeconds` 이 200이라고 가정한다. 크론잡 컨트롤러가
전의 예시와 같이 고장났다고 하면 (`08:29:00` 부터 `10:21:00` 까지), 잡은 10:22:00 부터 시작될 것이다. 이 경우, 컨트롤러가 마지막 일정부터 지금까지가 아니라, 최근 200초 안에 얼마나 놓쳤는지 체크하기 때문이다. (여기서는 3번 놓쳤다고 체크함)

크론잡은 오직 그 일정에 맞는 잡 생성에 책임이 있고,
잡은 그 잡이 대표하는 파드 관리에 책임이 있다.

## {{% heading "whatsnext" %}}

* 크론잡이 의존하는 [파드](/docs/concepts/workloads/pods/)와
  [잡](/docs/concepts/workloads/controllers/job/) 두 가지 개념에 대해 알아본다.
* 크론잡 `.spec.schedule` 필드의 상세 [형식](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)에
  대해 읽어본다.
* 크론잡 생성 및 관리를 위한 지침과 크론잡 매니페스트 예제는
  [크론잡으로 자동화된 작업 실행](/docs/tasks/job/automated-tasks-with-cron-jobs/)을 참고한다.
* `CronJob`은 쿠버네티스 REST API의 일부이다.
  {{< api-reference page="workload-resources/cron-job-v1" >}}
  API 레퍼런스에서 더 자세한 정보를 확인한다.
