---
layout: blog
title: "쿠버네티스 구성 모범 사례"
date: 2025-11-25T00:00:00+00:00
slug: configuration-good-practices
evergreen: true
author: Kirti Goyal
translator: >
  [Jaehan Byun(Supergate)](https://github.com/jaehanbyun)
---

구성(Configuration)은 쿠버네티스에서 가볍게 여기다가 문제가 생기는 부분 중 하나입니다. 구성은 모든 쿠버네티스 워크로드의 핵심입니다.
누락된 따옴표, 잘못된 API 버전, 잘못된 YAML 들여쓰기가 전체 배포를 망칠 수 있습니다.

이 블로그에서는 검증된 구성 모범 사례를 정리합니다. 쿠버네티스 환경을 깔끔하고, 일관성 있고, 관리하기 쉽게 만드는 작은 습관들입니다.
막 시작했든, 매일 앱을 배포하고 있든, 이러한 사소한 것들이 클러스터를 안정적으로 유지하고 미래의 자신을 편하게 해줍니다.

_이 블로그는 쿠버네티스 커뮤니티의 많은 구성원들의 기여를 통해 발전해온 *구성 모범 사례* 페이지에서 영감을 받았습니다._

## 일반적인 구성 사례

### 최신 안정 API 버전 사용
쿠버네티스는 빠르게 발전합니다. 오래된 API는 결국 사용 중단(deprecated)되고 작동이 중단됩니다. 따라서 리소스를 정의할 때는 최신 안정 API 버전을 사용해야 합니다.
아래 명령어로 확인할 수 있습니다.
```bash
kubectl api-resources
```
이 간단한 단계가 향후 호환성 문제를 방지합니다.

### 구성을 버전 관리에 저장
매니페스트 파일을 데스크톱에서 직접 적용하지 마세요. 항상 Git과 같은 버전 관리 시스템에 보관하세요. 이것이 안전망입니다.
문제가 발생하면 즉시 이전 커밋으로 롤백하거나, 변경 사항을 비교하거나, 당황하지 않고 클러스터 설정을 재생성할 수 있습니다.

### JSON이 아닌 YAML로 구성 작성
구성 파일은 JSON이 아닌 YAML로 작성하세요. 기술적으로 둘 다 작동하지만, YAML이 사람에게 더 친숙합니다. 읽기 쉽고, 노이즈가 적고, 커뮤니티에서 널리 사용됩니다.

YAML에는 불리언(boolean) 값 관련 주의 사항이 있습니다.
`true` 또는 `false`만 사용하세요.
`yes`, `no`, `on`, `off`를 사용하지 마세요.
한 버전의 YAML에서는 작동하지만 다른 버전에서는 문제가 될 수 있습니다. 안전을 위해 불리언처럼 보이는 값은 따옴표로 감싸세요(예: `"yes"`).

###	구성을 단순하고 최소화
쿠버네티스가 이미 처리하는 기본값을 설정하지 마세요. 최소한의 매니페스트가 디버깅하기 쉽고, 리뷰하기 깔끔하고, 나중에 문제를 일으킬 가능성이 적습니다.

###	관련 오브젝트를 함께 그룹화
디플로이먼트(Deployment), 서비스, 컨피그맵(ConfigMap)이 모두 하나의 앱에 속한다면, 하나의 매니페스트 파일에 넣으세요.
변경 사항을 추적하고 하나의 단위로 적용하기 더 쉽습니다.
이 문법의 예시는 [Guestbook all-in-one.yaml](https://github.com/kubernetes/examples/blob/master/web/guestbook/all-in-one/guestbook-all-in-one.yaml) 파일을 참고하세요.

전체 디렉터리를 아래 명령어로 적용할 수도 있습니다.
```bash
kubectl apply -f configs/
```
명령어 하나로 해당 폴더의 모든 것이 배포됩니다.

###	유용한 어노테이션(Annotation) 추가
매니페스트 파일은 기계만을 위한 것이 아니라 사람을 위한 것이기도 합니다. 어노테이션을 사용해서 무언가가 왜 존재하는지 또는 무엇을 하는지 설명하세요. 간단한 한 줄이 나중에 디버깅할 때 몇 시간을 절약하고 더 나은 협업을 가능하게 합니다.

설정할 수 있는 가장 유용한 어노테이션은 `kubernetes.io/description`입니다. 주석을 사용하는 것과 비슷하지만, API에 복사되어 배포 후에도 다른 모든 사람이 볼 수 있습니다.

## 워크로드 관리: 파드, 디플로이먼트, 잡(Job)

쿠버네티스에서 흔히 하는 초기 실수는 파드를 직접 생성하는 것입니다. 파드는 작동하지만, 문제가 발생해도 스스로 다시 스케줄링되지 않습니다.

_Naked 파드_ ([디플로이먼트](/docs/concepts/workloads/controllers/deployment/)나 [스테이트풀셋(StatefulSet)](/docs/concepts/workloads/controllers/statefulset/)과 같은 컨트롤러가 관리하지 않는 파드)는 테스트에는 괜찮지만, 실제 환경에서는 위험합니다.

왜일까요?
해당 파드를 호스팅하는 노드가 죽으면, 파드도 함께 죽고 쿠버네티스가 자동으로 복구하지 않기 때문입니다.

### 항상 실행되어야 하는 앱에는 디플로이먼트 사용
디플로이먼트는 원하는 수의 파드가 항상 사용 가능하도록 레플리카셋(ReplicaSet)을 생성하고, 파드를 교체하는 전략(예: [롤링 업데이트](/docs/concepts/workloads/controllers/deployment/#디플로이먼트-롤링-업데이트))을 지정하므로, 파드를 직접 생성하는 것보다 거의 항상 선호됩니다.
새 버전을 롤아웃하고, 문제가 발생하면 즉시 롤백할 수 있습니다.

### 완료되어야 하는 작업에는 잡 사용
[잡](/docs/concepts/workloads/controllers/job/)은 데이터베이스 마이그레이션이나 배치 처리 작업처럼 한 번 실행되고 종료되어야 하는 작업에 적합합니다.
파드가 실패하면 재시도하고, 완료되면 성공을 보고합니다.

## 서비스 구성 및 네트워킹

서비스는 클러스터 내부(때로는 외부)에서 워크로드가 서로 통신하는 방법입니다. 서비스가 없으면 파드는 존재하지만 아무에게도 연결할 수 없습니다. 이런 일이 발생하지 않도록 확인해 봅시다.

### 서비스를 사용하는 워크로드보다 먼저 생성
쿠버네티스는 파드를 시작할 때 기존 서비스에 대한 환경 변수를 자동으로 주입합니다.
따라서 파드가 서비스에 의존한다면, 해당 백엔드 워크로드(디플로이먼트 또는 스테이트풀셋)와 서비스에 접근해야 하는 워크로드보다 **먼저** [서비스](/docs/concepts/services-networking/service/)를 생성하세요.

예를 들어, foo라는 이름의 서비스가 존재하면 모든 컨테이너는 초기 환경에서 다음 변수를 받습니다.
```
FOO_SERVICE_HOST=<서비스가 실행되는 호스트>
FOO_SERVICE_PORT=<서비스가 실행되는 포트>
```
DNS 기반 디스커버리(discovery)에는 이 문제가 없지만, 어쨌든 좋은 습관입니다.

### 서비스 디스커버리에 DNS 사용
클러스터에 DNS [애드온](/docs/concepts/cluster-administration/addons/)(대부분 있음)이 있으면, 모든 서비스는 자동으로 DNS 항목을 갖습니다. 즉, IP 대신 이름으로 접근할 수 있습니다.
```bash
curl http://my-service.default.svc.cluster.local
```
쿠버네티스 네트워킹이 마법처럼 느껴지게 하는 기능 중 하나입니다.

### 절대적으로 필요한 경우가 아니면 `hostPort`와 `hostNetwork` 피하기
매니페스트에서 이러한 옵션을 볼 수 있습니다.
```yaml
hostPort: 8080
hostNetwork: true
```
하지만 문제가 있습니다.
이것들은 파드를 특정 노드에 묶어서 스케줄링과 확장을 어렵게 만듭니다. 각 <`hostIP`, `hostPort`, `protocol`> 조합은 고유해야 합니다. `hostIP`와 `protocol`을 명시적으로 지정하지 않으면, 쿠버네티스는 기본 `hostIP`로 `0.0.0.0`을, 기본 `protocol`로 `TCP`를 사용합니다.
디버깅하거나 네트워크 플러그인 같은 것을 구축하는 게 아니라면 피하세요.

테스트를 위한 로컬 접근만 필요하다면 [`kubectl port-forward`](/docs/reference/kubectl/generated/kubectl_port-forward/)를 시도하세요.

```bash
kubectl port-forward deployment/web 8080:80
```
자세한 내용은 [포트 포워딩을 사용해서 클러스터 내 애플리케이션에 접근하기](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)를 참고하세요.
외부 접근이 정말 필요하다면 [`type: NodePort` 서비스](/docs/concepts/services-networking/service/#type-nodeport)를 사용하세요. 더 안전한 쿠버네티스 네이티브 방식입니다.

### 내부 디스커버리에는 헤드리스(Headless) 서비스 사용
때로는 쿠버네티스가 트래픽을 로드 밸런싱하는 것을 원하지 않고 각 파드에 직접 통신하고 싶을 수 있습니다. 이때 [헤드리스 서비스](/docs/concepts/services-networking/service/#headless-services)가 필요합니다.

`clusterIP: None`으로 설정해서 생성합니다.
단일 IP 대신 DNS가 모든 파드 IP 목록을 제공하며, 연결을 직접 관리하는 앱에 적합합니다.


## 레이블을 효과적으로 사용하기

[레이블](/docs/concepts/overview/working-with-objects/labels/)은 파드와 같은 오브젝트에 첨부되는 키/값 쌍입니다.
레이블은 리소스를 구성하고, 쿼리하고, 그룹화하는 데 도움이 됩니다.
레이블 자체는 아무것도 하지 않지만, 서비스부터 디플로이먼트까지 모든 것이 원활하게 함께 작동되도록 합니다.

### 시맨틱 레이블 사용
좋은 레이블은 몇 달이 지나도 무엇이 무엇인지 이해하는 데 도움이 됩니다.
애플리케이션 또는 디플로이먼트의 시맨틱(의미론적) 속성을 식별하는 [레이블](/docs/concepts/overview/working-with-objects/labels/)을 정의하고 사용하세요.
예를 들면:
```yaml
labels:
  app.kubernetes.io/name: myapp
  app.kubernetes.io/component: web
  tier: frontend
  phase: test
```
  - `app.kubernetes.io/name` : 앱이 무엇인지
  - `tier` : 어느 계층에 속하는지 (frontend/backend)
  - `phase` : 어느 단계인지 (test/prod)

그러면 이 레이블을 사용해서 강력한 셀렉터를 만들 수 있습니다.
예를 들어,
```bash
kubectl get pods -l tier=frontend
```
이 명령은 어떤 디플로이먼트에서 왔든 클러스터 전체의 모든 프론트엔드 파드를 나열합니다.
기본적으로 파드 이름을 수동으로 나열하는 것이 아니라 원하는 것을 설명하는 것입니다.
이 접근 방식의 예시는 [guestbook](https://github.com/kubernetes/examples/tree/master/web/guestbook/) 앱을 참고하세요.

### 공통 쿠버네티스 레이블 사용
쿠버네티스는 실제로 [공통 레이블](/docs/concepts/overview/working-with-objects/common-labels/) 세트를 권장합니다. 다양한 워크로드나 프로젝트 전반에서 표준화된 명명 방식입니다.
이 규칙을 따르면 매니페스트가 깔끔해지고, [Headlamp](https://headlamp.dev/), [대시보드](https://github.com/kubernetes/dashboard#introduction), 또는 서드파티 모니터링 시스템과 같은 도구가 
무엇이 실행 중인지 자동으로 이해할 수 있습니다.

###	디버깅을 위한 레이블 조작
컨트롤러(레플리카셋이나 디플로이먼트 등)가 레이블을 사용해서 파드를 관리하므로, 레이블을 제거해서 파드를 일시적으로 "분리"할 수 있습니다.

예시:
```bash
kubectl label pod mypod app-
```
`app-` 부분은 `app` 레이블 키를 제거합니다.
이렇게 하면 컨트롤러가 더 이상 해당 파드를 관리하지 않습니다.
검사를 위해 격리하는 것과 같습니다. 디버깅을 위한 "격리 모드"입니다. 레이블을 인터랙티브하게 제거하거나 추가하려면 [`kubectl label`](/docs/reference/kubectl/generated/kubectl_label/)을 사용하세요.

그런 다음 로그를 확인하고, exec로 접속하고, 완료되면 수동으로 삭제합니다.
모든 쿠버네티스 엔지니어가 알아야 할 과소평가된 트릭입니다.

## 유용한 kubectl 팁

이러한 작은 팁들은 여러 매니페스트 파일이나 클러스터를 다룰 때 삶을 훨씬 쉽게 만들어줍니다.

### 전체 디렉터리 적용
파일을 하나씩 적용하는 대신 전체 폴더를 적용하세요.

```bash
# 서버 사이드 적용을 사용하는 것도 좋은 사례입니다
kubectl apply -f configs/ --server-side
```
이 명령은 해당 폴더에서 `.yaml`, `.yml`, `.json` 파일을 찾아서 모두 함께 적용합니다.
더 빠르고, 깔끔하고, 앱별로 그룹화하는 데 도움이 됩니다.

### 레이블 셀렉터를 사용해서 리소스 조회 또는 삭제
리소스 이름을 하나씩 입력할 필요가 없습니다.
대신 [셀렉터](/docs/concepts/overview/working-with-objects/labels/#label-selectors)를 사용해서 전체 그룹에 한 번에 작업하세요.

```bash
kubectl get pods -l app=myapp
kubectl delete pod -l phase=test
```
테스트 리소스를 동적으로 정리하려는 CI/CD 파이프라인에서 특히 유용합니다.

### 디플로이먼트와 서비스 빠르게 생성
빠른 실험을 위해 항상 매니페스트를 작성할 필요는 없습니다. CLI에서 바로 디플로이먼트를 만들 수 있습니다.

```bash
kubectl create deployment webapp --image=nginx
```

그런 다음 서비스로 노출합니다.
```bash
kubectl expose deployment webapp --port=80
```
전체 매니페스트를 작성하기 전에 무언가를 테스트하고 싶을 때 좋습니다.
또한 예시는 [서비스를 사용해서 클러스터 내 애플리케이션에 접근하기](/docs/tasks/access-application-cluster/service-access-application-cluster/)를 참고하세요.

## 결론

깔끔한 구성은 클러스터 관리자를 안정되게 합니다.
몇 가지 간단한 습관(구성을 단순하고 최소화하기, 모든 것을 버전 관리하기, 일관된 레이블 사용하기, 네이키드(naked) 파드에 의존하지 않기)을 고수하면 앞으로 수많은 디버깅 시간을 절약할 수 있습니다.

가장 좋은 점은?
깔끔한 구성은 읽기 쉬운 상태로 유지됩니다. 몇 달이 지나도 여러분이나 팀의 누구든 그것을 보고 정확히 무슨 일이 일어나고 있는지 알 수 있습니다.

