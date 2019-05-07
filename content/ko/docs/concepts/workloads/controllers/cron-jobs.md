---
title: 크론잡
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

_크론 잡은_ 시간 기반의 일정에 따라 [잡](/docs/concepts/workloads/controllers/jobs-run-to-completion/)을 만든다.

하나의 크론잡 객체는 _크론탭_ (크론 테이블) 파일의 한 줄과 같다. 크론잡은 잡을 [크론](https://en.wikipedia.org/wiki/Cron)형식으로 쓰여진 주어진 일정에 따라 주기적으로 동작시킨다.


{{< note >}}
모든 **크론잡** `일정:` 시간은 잡이 처음 시작된 마스터의 시간대를 기반으로 한다.
{{< /note >}}

크론 잡을 생성하고 작동하는 방법은 크론 잡의 스펙 파일을 확안한다. 내용은 [크론 잡으로 자동 작업 실행하기](/docs/tasks/job/automated-tasks-with-cron-jobs)를 참조한다.


{{% /capture %}}


{{% capture body %}}

## 크론 잡의 한계

크론 잡은 일정의 실행시간 마다 _약_ 한 번의 잡을 생성한다. "약" 이라고 하는 이유는 특정 환경에서는 두 개의 잡이 만들어지거나, 잡이 생성되지 않기도 하기 때문이다. 보통 이렇게 하지 않도록 해야겠지만, 완벽히 그럴 수 는 없다. 따라서 잡은 멱등원이 된다.

만약 `startingDeadlineSeconds` 가 큰 값으로 설정되거나, 설정되지 않고(디폴트 값), `concurrencyPolicy` 가 `Allow`로 설정될 경우, 잡은 항상 적어도 한 번은 실행될 것이다.

모든 크론 잡에 대해 크론잡 컨트롤러는 마지막 일정부터 지금까지 얼마나 많은 일정이 누락되었는지 확인한다. 만약 100회 이상의 일정이 누락되었다면, 잡을 실행하지 않고 아래와 같은 에러 로그를 남긴다.

````
Cannot determine if job needs to be started. Too many missed start time (> 100). Set or decrease .spec.startingDeadlineSeconds or check clock skew.
````

중요한 것은 만약 `startingDeadlineSeconds` 필드가 설정이 되면(`nil` 이 아닌 값으로), 컨트롤러는 마지막 일정부터 지금까지 대신 `startingDeadlineSeconds` 값에서 몇 개의 잡이 누락되었는지 카운팅한다. 예를 들면, `startingDeadlineSeconds` 가 `200` 이면, 컨트롤러는 최근 200초 내 몇 개의 잡이 누락되었는지 카운팅한다.


크론잡은 정해진 일정에 잡 실행을 실패하면 놓쳤다고 카운팅된다. 예를 들면, `concurrencyPolicy` 가 `Forbid` 로 설정되었고, 크론 잡이 이전 일정이 스케줄되어 여전히 시도하고 있을 때, 그 때 누락되었다고 판단한다.

즉, 크론잡이 `08:30:00` 에 시작하여 매 분마다 새로운 잡을 실행하도록 설정이 되었고, `startingDeadlineSeconds` 값이 설정되어 있지 않는다고 가정해보자. 만약 크론 잡 컨트롤러가 `08:29:00` 부터 `10:21:00` 까지 고장이 나면, 일정을 놓친 작업 수가 100개를 초과하여 잡이 실행되지 않을 것이다.

이 개념을 더 자세히 설명하자면, 크론 잡이 `08:30:00` 부터 매 분 실행되는 일정으로 설정되고, `startingDeadlineSeconds` 이 200이라고 가정한다. 크론 잡 컨트롤러가 전의 예시와 같이 고장났다고 하면 (`08:29:00` 부터 `10:21:00` 까지),  잡은 10:22:00 부터 시작될 것이다. 이 경우, 컨트롤러가 마지막 일정부터 지금까지가 아니라, 최근 200초 안에 얼마나 놓쳤는지 체크하기 때문이다. (여기서는 3번 놓쳤다고 체크함)

크론 잡은 오직 그 일정에 맞는 잡 생성에 책임이 있고, 잡은 그 잡이 대표하는 파드 관리에 책임이 있다.

{{% /capture %}}
