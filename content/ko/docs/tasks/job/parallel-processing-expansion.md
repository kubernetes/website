---
title: 확장을 사용한 병렬 처리
content_type: task
min-kubernetes-server-version: v1.8
weight: 50
---

<!-- overview -->

이 태스크는 공통 템플릿을 기반으로 하는 여러 개의 {{< glossary_tooltip text="잡(Job)" term_id="job" >}}을
실행하는 것을 보여준다. 이 접근 방식을 사용하여 일괄 작업을 병렬로 처리할 수
있다.

이 예에는 _apple_, _banana_ 그리고 _cherry_ 세 항목만 있다.
샘플 잡들은 문자열을 출력한 다음 일시 정지하는 각 항목을 처리한다.

이 패턴이 보다 실질적인 유스케이스에 어떻게 부합하는지 알아 보려면
[실제 워크로드에서 잡 사용하기](#실제-워크로드에서-잡-사용하기)를 참고한다.

## {{% heading "prerequisites" %}}

사용자는 기본적인 내용과, 병렬 작업이 아닌
[잡](/ko/docs/concepts/workloads/controllers/job/) 사용에 대해 익숙해야 한다.

{{< include "task-tutorial-prereqs.md" >}}

기본 템플릿을 사용하려면 커맨드 라인 유틸리티 `sed` 가 필요하다.

고급 템플릿 예제를 따라하려면, [파이썬(Python)](https://www.python.org/)과
파이썬용 Jinja2 템플릿 라이브러리의 설치가
필요하다.

파이썬을 설정했으면, 다음을 실행하여 Jinja2를 설치할 수 있다.

```shell
pip install --user jinja2
```

<!-- steps -->

## 템플릿 기반의 잡 생성하기

먼저, 다음의 잡 템플릿을 다운로드해서 `job-tmpl.yaml` 파일로 저장한다.
다운로드할 내용은 다음과 같다.

{{< codenew file="application/job/job-tmpl.yaml" >}}

```shell
# job-tmpl.yaml를 다운로드하기 위해 curl을 사용한다
curl -L -s -O https://k8s.io/examples/application/job/job-tmpl.yaml
```

다운로드한 파일은 아직 유효한 쿠버네티스
{{< glossary_tooltip text="매니페스트" term_id="manifest" >}}가 아니다.
대신 해당 템플릿은 사용하기 전에 채워야하는 자리 표시자가 있는 잡 오브젝트의
YAML 표현이다. `$ITEM` 구문은 쿠버네티스에 의미가 있지 않다.


### 템플릿에서 매니페스트 생성하기

다음의 셸 스니펫은 `sed` 를 사용하여 루프 변수로 `$ITEM` 문자열을 바꾸고,
`jobs` 라는 임시 디렉터리에 기록한다. 다음과 같이 실행한다.

```shell
# 처리할 각 항목에 대해 하나씩, 템플릿을 여러 파일로 확장한다.
mkdir ./jobs
for i in apple banana cherry
do
  cat job-tmpl.yaml | sed "s/\$ITEM/$i/" > ./jobs/job-$i.yaml
done
```

작동하는지 확인한다.

```shell
ls jobs/
```

출력 결과는 다음과 비슷하다.

```
job-apple.yaml
job-banana.yaml
job-cherry.yaml
```

모든 유형의 템플릿 언어(예를 들어, Jinja2, ERB)를 사용하거나,
프로그램을 작성하여 잡 매니페스트를 생성할 수 있다.

### 매니페스트에서 잡 생성하기

다음으로, 하나의 kubectl 명령으로 모든 잡을 생성한다.

```shell
kubectl create -f ./jobs
```

출력 결과는 다음과 비슷하다.

```
job.batch/process-item-apple created
job.batch/process-item-banana created
job.batch/process-item-cherry created
```

이제, 작업을 확인한다.

```shell
kubectl get jobs -l jobgroup=jobexample
```

출력 결과는 다음과 비슷하다.

```
NAME                  COMPLETIONS   DURATION   AGE
process-item-apple    1/1           14s        22s
process-item-banana   1/1           12s        21s
process-item-cherry   1/1           12s        20s
```

kubectl 명령에 `-l` 옵션을 사용하면 이 잡 그룹의
일부인 잡만 선택된다(시스템에서 관련이 없는 다른 잡이 있을 수 있음).

파드도 동일한 {{< glossary_tooltip text="레이블 셀렉터" term_id="selector" >}}를
사용하여 확인할 수 있다.


```shell
kubectl get pods -l jobgroup=jobexample
```

출력 결과는 다음과 비슷하다.

```
NAME                        READY     STATUS      RESTARTS   AGE
process-item-apple-kixwv    0/1       Completed   0          4m
process-item-banana-wrsf7   0/1       Completed   0          4m
process-item-cherry-dnfu9   0/1       Completed   0          4m
```

이 단일 명령을 사용하여 모든 잡의 출력을 한 번에 확인할 수 있다.

```shell
kubectl logs -f -l jobgroup=jobexample
```

출력 결과는 다음과 같아야 한다.

```
Processing item apple
Processing item banana
Processing item cherry
```

### 정리 {#cleanup-1}

```shell
# 생성한 잡 제거
# 클러스터가 자동으로 잡의 파드들을 정리
kubectl delete job -l jobgroup=jobexample
```

## 고급 템플릿 파라미터 사용하기

[첫 번째 예제](#템플릿-기반의-잡-생성하기)에서, 템플릿의 각 인스턴스는 하나의
파라미터를 가지고, 해당 파라미터는 잡의 이름에도 사용되었다. 그러나,
[이름](/ko/docs/concepts/overview/working-with-objects/names/#names)은
특정 문자들만 포함하도록 제한된다.

이런 약간 더 복잡한 예제는 [Jinja 템플릿 언어](https://palletsprojects.com/p/jinja/)를
사용하여 각 잡에 대한 여러 파라미터로 매니페스트를 생성한 다음
해당 매니페스트에서 오브젝트를 생성한다.

태스크의 이 부분에서는, 한줄 파이썬 스크립트를 사용하여
매니페스트 집합으로 템플릿을 변환한다.

먼저, 다음의 잡 오브젝트 템플릿을 복사하고 붙여넣기하여, `job.yaml.jinja2` 파일로 저장한다.


```liquid
{% set params = [{ "name": "apple", "url": "http://dbpedia.org/resource/Apple", },
                  { "name": "banana", "url": "http://dbpedia.org/resource/Banana", },
                  { "name": "cherry", "url": "http://dbpedia.org/resource/Cherry" }]
%}
{% for p in params %}
{% set name = p["name"] %}
{% set url = p["url"] %}
---
apiVersion: batch/v1
kind: Job
metadata:
  name: jobexample-{{ name }}
  labels:
    jobgroup: jobexample
spec:
  template:
    metadata:
      name: jobexample
      labels:
        jobgroup: jobexample
    spec:
      containers:
      - name: c
        image: busybox:1.28
        command: ["sh", "-c", "echo Processing URL {{ url }} && sleep 5"]
      restartPolicy: Never
{% endfor %}
```

위의 템플릿은 파이썬 딕셔너리(dicts)로 구성된 항목(1-4행)을 사용하여 각 잡 오브젝트에 대해
두 개의 파라미터를 정의한다. `for` 루프는 각 파라미터의 집합(나머지 행)에 대해
하나의 잡 매니페스트를 방출한다.

이 예제는 YAML의 기능에 의존한다. 하나의 YAML 파일은 여러
문서(이 경우, 쿠버네티스 매니페스트)를 포함할 수 있으며, 행에 있는 `---` 로
구분된다.
출력 결과를 `kubectl` 에 직접 파이프를 사용해 잡을 생성할 수 있다.

다음으로, 이 한 줄 파이썬 프로그램을 사용하여 템플릿을 확장한다.

```shell
alias render_template='python -c "from jinja2 import Template; import sys; print(Template(sys.stdin.read()).render());"'
```

`render_template` 을 사용해서 파라미터와 템플릿을 쿠버네티스 매니페스트가
포함된 하나의 YAML 파일로 변환한다.

```shell
# 앞에서 정의한 앨리어스(alias)가 필요하다
cat job.yaml.jinja2 | render_template > jobs.yaml
```

`render_template` 스크립트가 제대로 동작하는지 확인하기 위해 `jobs.yaml` 을
볼 수 있다.

`render_template` 스크립트가 원하는대로 동작하는 것을 확인했다면,
스크립트의 출력 결과를 파이프를 사용하여 `kubectl` 에 보낼 수 있다.

```shell
cat job.yaml.jinja2 | render_template | kubectl apply -f -
```

쿠버네티스는 생성한 잡을 수락하고 실행한다.

### 정리 {#cleanup-2}

```shell
# 생성한 잡 제거
# 클러스터가 자동으로 잡이 있던 파드를 정리
kubectl delete job -l jobgroup=jobexample
```


<!-- discussion -->

## 실제 워크로드에서 잡 사용하기

실제 유스케이스에서, 각 잡은 동영상의 프레임을 렌더링하거나, 데이터베이스에서 행 범위를
처리하는 것과 같은 상당한 규모의 계산을 수행한다. 동영상을 렌더링하는 경우 프레임 번호에
`$ITEM` 을 설정한다. 데이터베이스에서 행을 처리하는
경우, 처리할 데이터베이스 행의 범위를 나타내도록 `$ITEM` 을 설정한다.

이번 태스크에서, 로그를 가져와 파드에서 출력 결과를 수집하는 명령어를
실행했다. 실제 유스케이스에서, 잡의 각 파드는 완료하기 전에 출력 결과를
내구성있는 스토리지에 기록한다. 각 잡에 대해 퍼시스턴트볼륨(PersistentVolume)을
사용하거나 외장 스토리지 서비스를 사용할 수 있다. 예를 들어, 동영상의 프레임을 렌더링하는 경우,
HTTP를 사용하여 렌더링된 프레임 데이터를 각 프레임에 대한 다른 URL을 사용해서 URL에  `PUT`
한다.

## 잡과 파드의 레이블

잡을 생성한 후, 쿠버네티스는 한 잡의 파드를 다른 잡의 파드와 구별하기 위해서
추가 {{< glossary_tooltip text="레이블" term_id="label" >}}을
자동으로 추가한다.

이 예시에서, 각 잡과 잡의 파드 템플릿은 `jobgroup=jobexample`
레이블을 갖는다.

쿠버네티스 자체는 `jobgroup` 이라는 레이블에 신경쓰지 않는다. 템플릿에서
생성한 모든 잡에 대해 레이블을 설정하면 한번에 모든 잡을 편리하게
조작할 수 있다.
[첫 번째 예제](#템플릿-기반의-잡-생성하기)에서 템플릿을 사용해서
여러 잡을 생성했다. 템플릿은 각 파드도 동일한 레이블을 가질 수 있도록 보장하므로,
단일 명령어로 이러한 템플릿 기반 잡들의 모든 파드에서 확인할 수 있다.

{{< note >}}
레이블 키 `jobgroup` 은 특별하거나 예약되어 있지 않다.
고유한 레이블링 체계를 선택할 수 있다.
원하는 경우 사용할 수 있는
[권장 레이블](/ko/docs/concepts/overview/working-with-objects/common-labels/#레이블)이 있다.
{{< /note >}}

## 대안

많은 수의 잡 오브젝트의 생성을 계획 중이라면, 아마도 다음의 사항을 파악하게 될 것이다.

- 레이블을 사용해도, 너무 많은 잡을 관리하는 것은 번거롭다.
- 일괄적으로 많은 잡을 생성하는 경우, 쿠버네티스 컨트롤 플레인에
  높음 부하를 가할 수 있다. 대안으로, 쿠버네티스 API 서버가
  속도를 제한하여 429 상태의 사용자 요청을 일시적으로 거부할 수 있다.
- 사용자는 잡의 {{< glossary_tooltip text="리소스 쿼터" term_id="resource-quota" >}}로
  제한될 수 있다. 한번에 많은 작업을 생성하면 API 서버가 사용자의 요청 중
  일부를 영구적으로 거부한다.

아주 많은 잡 오브젝트를 생성하지 않고 많은 양의 작업을 처리하는데 사용할 수 있는
다른 [잡 패턴](/ko/docs/concepts/workloads/controllers/job/#잡-패턴)도
있다.

잡 오브젝트를 자동으로 관리하기 위해 자체 [컨트롤러](/ko/docs/concepts/architecture/controller/)를
작성하는 것도 고려할 수 있다.
