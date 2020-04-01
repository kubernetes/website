---
title: 쿠버네티스 문서 한글화 가이드
content_template: templates/concept
---

{{% capture overview %}}

쿠버네티스 문서 한글화를 위한 가이드

{{% /capture %}}


{{% capture body %}}

## 문체 가이드

### 높임말

평어체 사용을 원칙으로 하나, 일부 페이지(예: [https://kubernetes.io/ko](https://kubernetes.io/ko))에 한해 예외적으로
높임말을 사용한다.

### 명령형

어떤 일을 하도록 청자에게 요구하는 명령형 표현은 간결하고 부드러운 표현으로 정확한 의미를 전달하기 위해
어떤 일을 함께 하기를 요청하는 청유형 또는 객관적으로 진술하는 평어체로 번역한다.

명령형 문장 | 번역체
--- | ---
사이트를 방문하라 | 사이트를 방문하자 (청유형)
가이드를 참고하라 | 가이드를 참고한다 (평어체)


### 번역체 지양

우리글로서 자연스럽고 무리가 없도록 번역한다.

번역체 | 자연스러운 문장
--- | ---
-되어지다 (이중 피동 표현) | -되다
짧은 다리를 가진 돼지 | 다리가 짧은 돼지
그는 그의 손으로 숟가락을 들어 그의 밥을 먹었다 | 그는 손으로 숟가락을 들어 밥을 먹었다
접시를 씻고 | 설거지를 하고
가게에 배들, 사과들, 복숭아들이 있다 (과다한 복수형) | 가게에 배, 사과, 복숭아들이 있다

## 문서 코딩 가이드

### 가로폭은 원문을 따름

유지보수의 편의를 위해서 원문의 가로폭을 따른다.

즉, 원문이 한 문단을 줄바꿈하지 않고 한 행에 길게 기술했다면 한글화 시에도 한 행에 길게 기술하고, 원문이 한 문단을
줄바꿈해서 여러 행으로 기술한 경우에는 한글화 시에도 가로폭을 원문과 비슷하게 유지한다.

### 리뷰어 삭제

때때로 원문의 코드 상단에 리뷰어가 명시되어 있는 경우가 있다. 일반적으로 원문 페이지의 리뷰어가 한글화 된 페이지를 리뷰하기 어려우므로 리소스 메타데이터에서 리뷰어 관련 코드를
삭제한다.

아래는 리뷰어 관련 코드를 삭제하는 예시를 보여준다.

```diff
- reviews:
- - reviewer1
- - reviewer
- title: Kubernetes Components
+
+
+
+ title: 쿠버네티스 컴포넌트
content_template: templates/concept
weight: 10
```

## 용어 한글화 가이드

### 용어 한글화의 일반적 방침

영문 용어를 한글화할 때는 다음의 우선 순위를 따르나, 자연스럽지 않은 용어를 무리하게 선택하지는 않는다.

* 한글 단어
  * 순 우리말 단어
  * 한자어 (예: 운영 체제), 외래어 (예: 쿠버네티스, 파드)
* 한영 병기 (예: 훅(hook))
* 영어 단어 (예: Kubelet)

단, 자연스러움을 판단하는 기준은 주관적이므로 [한글화 용어집](#한글화-용어집)을 준용하고
기존에 번역된 문서를 참고한다.

{{% note %}}
한영 병기는 페이지 내에서 해당 용어가 처음 사용되는 경우에만 적용하고 이후 부터는 한글만 표기한다.
{{% /note %}}

### API 오브젝트 용어 한글화 관련 방침

API 오브젝트는 외래어 표기법에 따라 한글 표기한다.

쿠버네티스 API 오브젝트는 원 단어를
[국립국어원 외래어 표기법](http://kornorms.korean.go.kr/regltn/regltnView.do?regltn_code=0003#a)에
따라 한글화 한다. 예를 들면 다음과 같다.

원 단어    | 외래어 표기
---        | ---
Deployment | 디플로이먼트
Pod        | 파드
Service    | 서비스

{{% note %}}
단, API 오브젝트 한글화 원칙에 예외가 있을 수 있으며, 이 경우에는 가능한
[한글화 용어집](#한글화-용어집)을 준용한다. (예를 들면, Horizontal Pod Autoscaler
는 API 오브젝트에 대해 외래어 표기법 적용하지 않고 원문 그대로 표기한다.)
{{% /note %}}

{{% note %}}
API 오브젝트의 필드 이름, 파일 이름, 경로와 같은 내용은 독자가 구성 파일이나
커맨드라인에서 그대로 사용할 가능성이 높으므로 한글로 옮기지 않고 원문을 유지한다.
단, 주석에 포함된 내용은 한글로 옮길 수 있다.
{{% /note %}}

### 한글화 용어집 정보

쿠버네티스 [한글화 용어집](#한글화-용어집)은 한글화된 쿠버네티스 문서의 일관성을 위해서
각 영문 용어에 대한 한글화 방법을 제시한다.
한글화 용어집에 포함된 용어는 쿠버네티스 문서 한글화팀 회의를 통해 결정되었으며,
본 문서에 대한 ISSUE 및 PR을 통해서 개선한다.

#### 한글화 용어집 개선 가이드

한글화 용어집의 개선(추가, 수정, 삭제 등)을 위한 과정은 다음과 같다.

1. 컨트리뷰터가 개선이 필요한 용어을 파악하면, ISSUE를 생성하여 개선 필요성을 공유하거나 `master` 브랜치에
PR을 생성하여 개선된 용어를 제안한다.

1. 개선 제안에 대한 논의는 ISSUE 및 PR을 통해서 이루어지며, 한글화팀 회의를 통해 확정한다.

1. 리뷰어 및 승인자는 작업 중인 한글화 작업 브랜치(예: dev-1.17-ko.3)에 영향을 최소화 하기 위해서,
신규 한글화 작업 브랜치(예: dev-1.17-ko.4) 생성 시점에 맞춰 확정된 PR을 승인한다.
개선된 한글화 용어집은 신규 한글화 작업 브랜치부터 적용한다.

1. 개선된 한글화 용어집에 따라 기존의 한글 문서에 대한 업데이트가 필요하며,
컨트리뷰션을 통해서 업데이트를 진행한다.

#### 한글화 용어집


English | 한글 | 비고
--- | --- | ---
Access | 접근 |
Active | Active | 잡의 상태
Active Job | 액티브 잡 |
Addons | 애드온 |
admission controller | 어드미션 컨트롤러 |
Age | 기간 |
Allocation | 할당량 |
alphanumeric | 영숫자 |
Annotation | 어노테이션 |
App | 앱 |
Appendix | 부록 |
Application | 애플리케이션 |
Args | Args | 약어의 형태이므로 한글화하지 않고 영문 표기
array | 배열 |
autoscaler | 오토스케일러 |
availability zone | 가용성 영역(availability zone) |
bare pod | 베어(bare) 파드 |
beta | 베타 |
boilerplate | 상용구 |
Boot | 부트 |
Build | 빌드 |
Cache | 캐시 |
canary | 카나리(canary) | 릴리스 방식에 관련한 용어인 경우에 한함
cascading | 캐스케이딩(cascading) |
character set | 캐릭터 셋 |
Charts | 차트 |
checkpoint | 체크포인트 |
CLI | CLI |
Cluster | 클러스터 |
Command Line Tool | 커맨드라인 툴 |
Config Map | 컨피그 맵 |
configuration | 구성, 설정 |
Connection | 연결 |
containerized | 컨테이너화 된 |
Context | 컨텍스트  |
Control Plane | 컨트롤 플레인 |
controller | 컨트롤러 |
Cron Job | 크론 잡 |
custom metrics | 사용자 정의 메트릭 |
Custom resource | 사용자 정의 리소스 |
CustomResourceDefinition | 커스텀 리소스 데피니션 |
Daemon | 데몬 |
Daemon Set | 데몬 셋 |
Dashboard | 대시보드 |
Data Plane | 데이터 플레인 |
Default Limit | 기본 상한 |
Default Request | 기본 요청량 |
Deployment | 디플로이먼트 |
deprecated | 사용 중단(deprecated) |
descriptor | 디스크립터, 식별자 |
Desired number of pods | 의도한 파드의 수 |
Desired State | 의도한 상태 |
disruption | 중단(disruption) |
distros | 배포판 |
Docker | 도커 |
Dockerfile | Dockerfile |
Downward API | 다운워드(Downward) API |
draining | 드레이닝(draining) |
egress | 이그레스, 송신(egress) |
Endpoint | 엔드포인트 |
entry point | 진입점 |
Event | 이벤트 |
Exec | Exec |
expose | 노출시키다 |
extension | 익스텐션(extension) |
Failed | Failed | 파드의 상태에 한함
Federation | 페더레이션 |
field | 필드 |
Flannel | Flannel |
form | 형식 |
Google Compute Engine | Google Compute Engine |
hash | 해시 |
headless | 헤드리스 |
health check | 헬스 체크 |
Heapster | 힙스터(Heapster) |
Heartbeat | 하트비트 |
Homebrew | Homebrew |
hook | 훅(hook) |
Horizontal Pod Autoscaler | Horizontal Pod Autoscaler | 예외적으로 API 오브젝트에 대해 외래어 표기법 적용하지 않고 원문 그대로 표기
hosted zone | 호스팅 영역 |
hostname | 호스트네임 |
Huge page | Huge page |
Hypervisor | 하이퍼바이저 |
idempotent | 멱등성 |
Image | 이미지 |
Image Pull Secrets | 이미지 풀(Pull) 시크릿 |
Ingress | 인그레스 |
Init Container | 초기화 컨테이너 |
Instance group | 인스턴스 그룹 |
introspection | 인트로스펙션(introspection) |
Istio | 이스티오(Istio) |
Job | 잡 |
kube-proxy | kube-proxy |
Kubelet | Kubelet |
Kubernetes | 쿠버네티스 |
label | 레이블 |
lifecycle | 라이프사이클 |
Linux | 리눅스 |
load | 부하 |
Log | 로그 |
loopback | 루프백(loopback) |
Lost | Lost | 클레임의 상태에 한함
Machine | 머신 |
manifest | 매니페스트 |
Master | 마스터 |
max limit/request ratio | 최대 상한/요청량 비율 |
metadata | 메타데이터 |
metric | 메트릭 |
masquerading | 마스커레이딩 |
Minikube | Minikube |
Mirror pod | 미러 파드(mirror pod) |
monitoring | 모니터링 |
multihomed | 멀티홈드(multihomed) |
naked pod | 네이키드(naked) 파드 |
Namespace | 네임스페이스 |
netfilter | 넷필터(netfilter) |
Network Policy | 네트워크 폴리시 |
Node | 노드 |
node lease | 노드 리스(lease)
Object | 오브젝트 |
Orchestrate | 오케스트레이션하다 |
Output | 출력 |
parameter | 파라미터 |
patch | 패치 |
Pending | Pending | 파드, 클레임의 상태에 한함
Persistent Volume | 퍼시스턴트 볼륨 |
Persistent Volume Claim | 퍼시스턴트 볼륨 클레임 |
pipeline | 파이프라인 |
placeholder pod | 플레이스홀더(placeholder) 파드 |
Pod(파드) | 파드 |
Pod Preset | 파드 프리셋 |
PodAntiAffinity | 파드안티어피니티(PodAntiAffinity) |
PodDisruptionBudget | PodDisruptionBudget |
postfix | 접미사 |
prefix | 접두사 |
Privileged | 특권을 가진(privileged) |
Prometheus | 프로메테우스 |
proof of concept | 개념 증명 |
Pull Request | 풀 리퀘스트 |
Pull Secret Credentials | 풀(Pull) 시크릿 자격증명 |
QoS Class | QoS 클래스 |
Quota | 쿼터 |
readiness gate | 준비성 게이트(readiness gate) |
readiness probe | 준비성 프로브(readiness probe) |
Ready | Ready |
Reclaim Policy | 반환 정책 |
redirect | 리다이렉트(redirect) |
redirection | 리다이렉션 |
Registry | 레지스트리 |
Release | 릴리스 |
Replica Set | 레플리카 셋 |
replicas | 레플리카 |
Replication Controller | 레플리케이션 컨트롤러 |
repository | 리포지터리 |
resource | 리소스 |
Resource Limit | 리소스 상한 |
Resource Quota | 리소스 쿼터 |
return | 반환하다 |
revision | 리비전 |
Role | 롤 |
rollback | 롤백 |
rolling update | 롤링 업데이트 |
rollout | 롤아웃 |
Running | Running | 파드의 상태에 한함
runtime | 런타임 |
Scale | 스케일 |
Secret | 시크릿 |
segment | 세그먼트 |
Selector | 셀렉터 |
Self-healing | 자가 치유 |
Service | 서비스 |
Service Account | 서비스 어카운트 |
service discovery | 서비스 디스커버리 |
service mesh | 서비스 메시 |
Session | 세션 |
Session Affinity | 세션 어피니티(Affinity) |
Setting | 세팅 |
Shell | 셸 |
Sign In | 로그인 |
Sign Out | 로그아웃 |
skew | 차이(skew) |
spec | 명세, 스펙, 사양 |
specification | 명세 |
Stateful Set | 스테이트풀 셋 |
stateless | 스테이트리스 |
Static pod | 스태틱(static) 파드 |
Storage Class | 스토리지 클래스 |
Sub-Object | 서브-오브젝트 |
support | 지원 |
Surge | 증가율 | 롤링업데이트 전략에 한함
System | 시스템 |
taint | 테인트(taint) |
Task | 태스크 |
Terminated | Terminated | 파드의 상태에 한함
tolerations | 톨러레이션(toleration) |
Topology spread constraints | 토폴로지 분배 제약 조건 |
Tools  | 도구 |
traffic | 트래픽 |
Type | 타입 |
ubuntu | 우분투 |
use case | 유스케이스 |
userspace | 유저스페이스(userspace) |
Utilization | 사용량, 사용률 |
verbosity | 로그 상세 레벨(verbosity) |
virtualization | 가상화 |
Volume | 볼륨 |
Waiting | Waiting | 파드의 상태에 한함
Walkthrough | 연습 |
Windows | 윈도우 |
Worker | 워커 | 노드의 형태에 한함
Workload | 워크로드 |
YAML | YAML |

{{% /capture %}}
