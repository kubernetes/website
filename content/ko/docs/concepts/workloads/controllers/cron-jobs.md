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

하나의 크론잡 오브젝트는 _크론탭_ (크론 테이블) 파일의 한 줄과 같다.
크론잡은 잡을 [크론](https://ko.wikipedia.org/wiki/Cron) 형식으로 쓰여진 주어진 일정에 따라 주기적으로 동작시킨다.

{{< caution >}}
모든 **크론잡** `일정:` 시간은
{{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}의 시간대를 기준으로 한다.

컨트롤 플레인이 파드 또는 베어 컨테이너에서 kube-controller-manager를 실행하는 경우,
kube-controller-manager 컨테이너에 설정된 시간대는
크론잡 컨트롤러가 사용하는 시간대로 결정한다.
{{< /caution >}}

{{< caution >}}
[v1 CronJob API](/docs/reference/kubernetes-api/workload-resources/cron-job-v1/)은 
위에서 설명한 타임존 설정을 공식적으로 지원하지는 않는다.

`CRON_TZ` 또는 `TZ` 와 같은 변수를 설정하는 것은 쿠버네티스 프로젝트에서 공식적으로 지원하지는 않는다.
`CRON_TZ` 또는 `TZ` 와 같은 변수를 설정하는 것은 
크론탭을 파싱하고 다음 잡 생성 시간을 계산하는 내부 라이브러리의 구현 상세사항이다.
프로덕션 클러스터에서는 사용을 권장하지 않는다.
{{< /caution >}}

크론잡 리소스에 대한 매니페스트를 생성할 때에는 제공하는 이름이
유효한 [DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)이어야 한다.
이름은 52자 이하여야 한다. 이는 크론잡 컨트롤러는 제공된 잡 이름에
11자를 자동으로 추가하고, 작업 이름의 최대 길이는
63자라는 제약 조건이 있기 때문이다.

<!-- body -->

## 크론잡

크론잡은 백업, 리포트 생성 등의 정기적 작업을 수행하기 위해 사용된다. 
각 작업은 무기한 반복되도록 구성해야 한다(예: 
1일/1주/1달마다 1회). 
작업을 시작해야 하는 해당 간격 내 특정 시점을 정의할 수 있다.

### 예시

이 크론잡 매니페스트 예제는 현재 시간과 hello 메시지를 1분마다 출력한다.

{{< codenew file="application/job/cronjob.yaml" >}}

([크론잡으로 자동화된 작업 실행하기](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)는
이 예시를 더 자세히 설명한다.)

### 크론 스케줄 문법

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


| 항목   										 | 설명	      																								  | 상응 표현       |
| ------------- 						| ------------- 																							|-------------  |
| @yearly (or @annually)		| 매년 1월 1일 자정에 실행                 										   | 0 0 1 1 * 		|
| @monthly 									| 매월 1일 자정에 실행  	                                        | 0 0 1 * * 		|
| @weekly 									| 매주 일요일 자정에 실행							                             | 0 0 * * 0 		|
| @daily (or @midnight)			| 매일 자정에 실행 																             	| 0 0 * * * 		|
| @hourly 									| 매시 0분에 시작                          								       | 0 * * * * 		|



예를 들면, 다음은 해당 작업이 매주 금요일 자정에 시작되어야 하고, 매월 13일 자정에도 시작되어야 한다는 뜻이다.

`0 0 13 * 5`

크론잡 스케줄 표현을 생성하기 위해서 [crontab.guru](https://crontab.guru/)와 같은 웹 도구를 사용할 수도 있다.

## 타임 존

크론잡에 타임 존이 명시되어 있지 않으면, kube-controller-manager는 로컬 타임 존을 기준으로 스케줄을 해석한다.

{{< feature-state for_k8s_version="v1.25" state="beta" >}}

`CronJobTimeZone` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)를 활성화하면, 
크론잡에 대해 타임 존을 명시할 수 있다(기능 게이트를 활성화하지 않거나, 
타임 존에 대한 실험적 지원을 제공하지 않는 쿠버네티스 버전을 사용 중인 경우, 
클러스터의 모든 크론잡은 타임 존이 명시되지 않은 것으로 동작한다).

이 기능을 활성화하면, `spec.timeZone`을 유효한 [타임 존](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones)으로 지정할 수 있다. 
예를 들어, `spec.timeZone: "Etc/UTC"`와 같이 설정하면 쿠버네티스는 협정 세계시를 기준으로 스케줄을 해석한다.

Go 표준 라이브러리의 타임 존 데이터베이스가 바이너리로 인클루드되며, 시스템에서 외부 데이터베이스를 사용할 수 없을 때 폴백(fallback)으로 사용된다.

## 크론잡의 한계 {#cron-job-limitations}

크론잡은 일정의 실행시간 마다 _약_ 한 번의 잡 오브젝트를 생성한다. "약" 이라고 하는 이유는
특정 환경에서는 두 개의 잡이 만들어지거나, 잡이 생성되지 않기도 하기 때문이다. 보통 이렇게 하지
않도록 해야겠지만, 완벽히 그럴 수는 없다. 따라서 잡은 _멱등원_ 이 된다.

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

## 컨트롤러 버전 {#new-controller}

쿠버네티스 v1.21부터 크론잡 컨트롤러의 두 번째 버전이
기본 구현이다. 기본 크론잡 컨트롤러를 비활성화하고
대신 원래 크론잡 컨트롤러를 사용하려면, `CronJobControllerV2`
[기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)
플래그를 {{< glossary_tooltip term_id="kube-controller-manager" text="kube-controller-manager" >}}에 전달하고,
이 플래그를 `false` 로 설정한다. 예를 들면, 다음과 같다.

```
--feature-gates="CronJobControllerV2=false"
```


## {{% heading "whatsnext" %}}

* 크론잡이 의존하고 있는 [파드](/ko/docs/concepts/workloads/pods/)와
  [잡](/ko/docs/concepts/workloads/controllers/job/) 두 개념에
  대해 배운다.
* 크론잡 `.spec.schedule` 필드의 [형식](https://pkg.go.dev/github.com/robfig/cron/v3#hdr-CRON_Expression_Format)에
  대해서 읽는다.
* 크론잡을 생성하고 다루기 위한 지침 및
  크론잡 매니페스트의 예제로
  [크론잡으로 자동화된 작업 실행](/ko/docs/tasks/job/automated-tasks-with-cron-jobs/)를 읽는다.
* 실패했거나 완료된 잡을 자동으로 정리하도록 하려면, 
  [완료된 잡을 자동으로 정리](/ko/docs/concepts/workloads/controllers/job/#clean-up-finished-jobs-automatically)를 확인한다.
* `CronJob`은 쿠버네티스 REST API의 일부이다.
  {{< api-reference page="workload-resources/cron-job-v1" >}}
  오브젝트 정의를 읽고 쿠버네티스 크론잡 API에 대해 이해한다.
