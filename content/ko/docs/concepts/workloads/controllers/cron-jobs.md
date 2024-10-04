---
# reviewers:
# - erictune
# - soltysh
# - janetkuo
title: 크론잡
content_type: concept
weight: 80
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.21" state="stable" >}}

_크론잡은_ 반복 일정에 따라 {{< glossary_tooltip term_id="job" text="잡" >}}을 만든다.

크론잡은 백업, 리포트 생성 등과 같이 정기적으로 예약된 작업을 수행하기 위한 것이다.
하나의 크론잡 오브젝트는 Unix 시스템의 _크론탭_ (크론 테이블) 파일의 한 줄과 같다.
크론잡은 잡을 [크론](https://ko.wikipedia.org/wiki/Cron) 형식으로 쓰여진 주어진 일정에 따라 주기적으로 동작시킨다.

크론잡은 한계와 특징이 있다.
예를 들어, 특정 상황에서는 하나의 크론잡이 동시에 여러 개의 잡을 생성할 수 있다. 하단의 [한계](#크론잡의-한계-cron-job-limitations)를 보자.

컨트롤 플레인이 크론잡에 대한 새 잡과 (간접적으로) 파드를 생성할 때, 크론잡의 `.metadata.name`은 해당 파드의 이름을 지정하는 기준의 일부이다.
크론잡의 이름은 유효한 [DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름) 값이어야 하지만, 이 경우  파드 호스트네임에 예기치 않은 결과가 발생할 수 있다.
최상의 호환성을 위해, 이름은 [DNS 레이블](/ko/docs/concepts/overview/working-with-objects/names#dns-label-names)에 대한 보다 제한적인 규칙을 따라야 한다.
이름이 DNS 서브도메인인 경우에도 이름은 52자를 넘지 않아야 한다. 이는 크론잡 컨트롤러가 사용자가 제공한 이름에
자동으로 11자를 추가하고, 잡 이름의 길이는 63자를 넘지 않아야 한다는 제약이 있기 때문이다.

<!-- body -->
## 예시

이 크론잡 매니페스트 예제는 현재 시간과 hello 메시지를 1분마다 출력한다.

{{% codenew file="application/job/cronjob.yaml" %}}

([크론잡으로 자동화된 작업 실행하기](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)는
이 예시를 더 자세히 설명한다.)

## 크론잡 스펙 작성하기
### 스케줄 문법
`.spec.schedule` 필드는 반드시 포함되어야 한다. 이 필드의 값은 [크론](https://en.wikipedia.org/wiki/Cron) 문법을 따른다:

```
# ┌───────────── 분 (0 - 59)
# │ ┌───────────── 시 (0 - 23)
# │ │ ┌───────────── 일 (1 - 31)
# │ │ │ ┌───────────── 월 (1 - 12)
# │ │ │ │ ┌───────────── 요일 (0 - 6) (일요일부터 토요일까지;
# │ │ │ │ │                                   특정 시스템에서는 7도 일요일)
# │ │ │ │ │                                   또는 sun, mon, tue, wed, thu, fri, sat
# │ │ │ │ │
# * * * * *
```

예를 들면, `0 0 13 * 5`은 해당 작업이 매주 금요일 자정에 시작되어야 하고, 매월 13일 자정에도 시작되어야 한다는 뜻이다.

이 표현식은 확장된 "빅시 크론" 스텝 값 또한 포함하고 있다. [FreeBSD 매뉴얼](https://www.freebsd.org/cgi/man.cgi?crontab%285%29)에 따르면

> 스텝 값은 범위와 함께 사용할 수 있다. 범위 뒤에 있는 
> `/<숫자>`는 범위 내에서 값을 건너뛰는 주기를 지정한다. 
> 예를 들어 `0-23/2`는 시간 필드에서 격시로 실행하도록 지정할 수 있다. 
> (V7 표준의 대안은 `0,2,4,6,8,10,12,14,16,18,20,22`이다). 
> 스텝은 별표 뒤에도 허용되므로 "매 2시간"이라고 지정 싶다면 `*/2`를 사용하자.

스케줄 내의 물음표(`?`)는 별표 `*`와 같은 의미를 가지고 있다. 즉, 해당 필드에 가능한 모든 값을 의미한다.

| 항목   										 | 설명	      																								  | 상응 표현       |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| 매년 1월 1일 자정에 실행                 										   | 0 0 1 1 * 		|
| @monthly 									| 매월 1일 자정에 실행  	                                        | 0 0 1 * * 		|
| @weekly 									| 매주 일요일 자정에 실행							                             | 0 0 * * 0 		|
| @daily (or @midnight)			| 매일 자정에 실행 																             	| 0 0 * * * 		|
| @hourly 									| 매시 0분에 시작                          								       | 0 * * * * 		|




크론잡 스케줄 표현을 생성하기 위해서 [crontab.guru](https://crontab.guru/)와 같은 웹 도구를 사용할 수도 있다.

### 잡 템플릿

`.spec.jobTemplate`는 크론잡이 생성하는 잡의 템플릿을 정의하며, 필수적으로 작성해야 한다.
내부에 중첩되어 있으며 `apiVersion`과 `kind`가 없다는 것을 제외하면 [잡](/ko/docs/concepts/workloads/controllers/job/)과 동일하다.
{{< glossary_tooltip text="레이블" term_id="label" >}},
{{< glossary_tooltip text="어노테이션" term_id="annotation" >}}과 같이
잡 템플릿의 공통되는 메타데이터를 명시할 수 있다.
잡의 `.spec`을 작성하는 정보에 관해서는 [잡 사양 작성하기](/ko/docs/concepts/workloads/controllers/job/#잡-사양-작성하기)를 참고하자.

### 지연된 잡 시작의 데드라인 {#starting-deadline}

`.spec.startingDeadlineSeconds` 필드는 선택사항이다.
이 필드는 잡이 스케줄된 시간을 놓쳤을 때, 잡을 시작하기까지의 데드라인 (초 단위)을 정의한다.

데드라인을 놓치면, 크론잡은 해당 잡을 넘긴다 (이후는 여전히 스케줄링되어 있다).
예를 들어, 백업 관련 잡이 하루에 2번 실행될 때, 8시간 이후까지 실행될 수 있도록 허용할 수 있지만, 
그 이후로는 백업이 의미없기 때문에 하지 않을 것이다.
차라리 다음으로 예정된 잡이 실행되는 것을 선호할 것이다.

쿠버네티스는 지정된 데드라인을 놓친 잡들을 실패한 것으로 취급한다.
크론잡의 `startingDeadlineSeconds`을 지정하지 않는다면, 잡 실행에 데드라인은 존재하지 않는다.

`.spec.startingDeadlineSeconds` 필드가 설정되었을 때 (null이 아닐때),
크론잡 컨트롤러는 현재 시간과 다음 예정된 잡 생성시간의 차이를 계산한다.
이 차이가 데드라인보다 높다면, 해당 잡의 실행을 건너뛸 것이다.

예를 들어, `200`으로 설정되어 있으면 잡이 스케줄되고 200초 동안 생성되는 것을 허용한다.

### 동시성 정책

`.spec.concurrencyPolicy` 필드 또한 선택사항이다.
이 필드는 해당 크론잡에 의해 생성된 잡들의 동시 실행을 어떻게 취급할지에 대해 정의한다.
이 스펙은 아래의 동시성 정책 중 한 가지만 지정할 수 있다:

* `Allow` (기본값): 크론잡의 잡이 동시성을 지원한다.
* `Forbid`: 크론잡이 동시성을 지원하지 않는다; 새로운 잡을 생성하는 시간이 되었으나 이전 잡이 완료되지 않았을 때, 
  크론잡은 새로운 잡을 생성하지 않고 건너뛴다.
* `Replace`: 새로운 잡을 생성하는 시간이 됐으나 이전 잡이 완료되지 않았을 때, 크론잡이 현재 실행되고 있는 잡을
  새로운 잡으로 교체한다.

동시성 정책은 같은 크론잡에 의해 생성된 잡 사이에서만 통용된다.
복수의 크론잡이 존재할 때 각자의 잡은 서로에 대해서 항상 동시성을 지원한다.

### 스케줄 지연

선택사항인 `.spec.suspend` 필드를 true로 설정하면 크론잡의 잡의 실행을 연기할 수 있다. 기본값은 false로 지정되어 있다.

이 설정은 크론잡에 의해 이미 시작된 잡들에 영향을 끼치지 _않는다._

이 필드를 true로 설정하면 모든 하위 실행 단위들이 해제할 때까지 지연된다. (스케줄된 상태로 존재하나, 크론잡 컨트롤러가 잡들을 시작하지 않는다)

{{< caution >}}
스케줄된 시간에 지연된 실행들은 놓친 잡으로 포함된다.
[시작 데드라인](#starting-deadline)을 지정하지 않고 존재하는 크론잡의 `spec.suspend`를 `true`에서 `false`로 변경하면
놓친 잡들이 즉시 스케줄된다.
{{< /caution >}}

### 잡 내역 한도

`.spec.successfulJobsHistoryLimit`과 `.spec.failedJobsHistoryLimit` 필드는 선택사항이다.
이 필드들은 완료 그리고 실패한 잡을 얼마나 많이 유지할 것인지 지정한다.
기본값으로 3과 1로 지정된다. 한도를 0으로 설정하면 해당 종류의 잡이 완료된 후에도 해당 잡을 유지하지 않는 것에 해당한다.

잡을 자동적으로 정리하는 다른 방법으로 [완료된 잡을 자동으로 정리](/ko/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)을 보자.

### 타임 존
{{< feature-state for_k8s_version="v1.27" state="stable" >}}

크론잡에 타임 존이 명시되어 있지 않으면, {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}는 로컬 타임 존을 기준으로 스케줄을 해석한다.

크론잡의 `.spec.timeZone`을 유효한 특정 [타임 존](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)으로 지정할 수 있다. 
예를 들어, `.spec.timeZone: "Etc/UTC"`와 같이 설정하면 쿠버네티스는 협정 세계시를 기준으로 스케줄을 해석한다.

Go 표준 라이브러리의 타임 존 데이터베이스가 바이너리로 인클루드되며, 시스템에서 외부 데이터베이스를 사용할 수 없을 때 폴백(fallback)으로 사용된다.

## 크론잡의 한계 {#cron-job-limitations}

### 타임존 지정 미지원

쿠버네티스 {{< skew currentVersion >}}의 크론잡 API 구현체는 `.spec.schedule` 필드에 `CRON_TZ=UTC * * * * *` 또는 `TZ=UTC * * * * *`와 같이 타임존을 포함할 수 있게 해준다.

이 방법으로 타임존을 지정하는 것은 **공식적으로 지원되지 않는다** (지원한 적도 없다).

`TZ` 또는 `CRON_TZ` 타임존 설정을 포함한 스케줄을 설정하려고 하면 쿠버네티스는 클라이언트에 
[warning](/blog/2020/09/03/warnings/)을 보고한다.
향후 쿠버네티스 버전들은 이 비공식적인 타임존 메커니즘을 모두 방지할 예정이다.

### 크론잡의 수정

설계 구조상 크론잡은 _새로운_ 잡을 위한 템플릿을 포함하고 있다.
이미 존재하는 크론잡을 수정하면, 이 수정사항들은 수정이 완료되고 나서 시작할 새로운 잡들에 적용된다.
기존에 이미 시작한 잡 (그리고 파드)들은 변경사항 없이 그대로 유지된다.
즉, 크론잡이 기존 잡이 실행 중인 경우에도 업데이트하지 _않는다_.

### 잡 생성
크론잡은 일정의 실행시간 마다 대략 한 번의 잡 오브젝트를 생성한다. "대략" 이라고 하는 이유는
특정 환경에서는 두 개의 잡이 만들어지거나, 잡이 생성되지 않기도 하기 때문이다. 쿠버네티스는 이러한 상황을
최대한 피하려 하지만, 완벽히 그럴 수는 없다. 따라서 정의하는 잡들은 _멱등원_ 이 되어야 한다.

만약 `startingDeadlineSeconds` 가 큰 값으로 설정되거나, 설정되지 않고(디폴트 값),
`concurrencyPolicy` 가 `Allow` 로 설정될 경우, 잡은 항상 적어도 한 번은
실행될 것이다.

{{< caution >}}
`startingDeadlineSeconds` 가 10초 미만의 값으로 설정되면, 크론잡이 스케줄되지 않을 수 있다. 이는 크론잡 컨트롤러가 10초마다 항목을 확인하기 때문이다.
{{< /caution >}}


모든 크론잡에 대해 크론잡 {{< glossary_tooltip term_id="controller" text="컨트롤러" >}} 는 마지막 일정부터 지금까지 얼마나 많은 일정이 누락되었는지 확인한다. 만약 100회 이상의 일정이 누락되었다면, 잡을 실행하지 않고 아래와 같은 에러 로그를 남긴다.

```
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
```

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

* 크론잡이 의존하고 있는 [파드](/ko/docs/concepts/workloads/pods/)와
  [잡](/ko/docs/concepts/workloads/controllers/job/) 두 개념에
  대해 배운다.
* 크론잡 `.spec.schedule` 필드의 구체적인 [형식](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)에
  대해서 읽는다.
* 크론잡을 생성하고 다루기 위한 지침 및
  크론잡 매니페스트의 예제로
  [크론잡으로 자동화된 작업 실행](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)를 읽는다.
* `CronJob`은 쿠버네티스 REST API의 일부이다.
  자세한 내용은 {{< api-reference page="workload-resources/cron-job-v1" >}}
  API 레퍼런스를 참조한다.
