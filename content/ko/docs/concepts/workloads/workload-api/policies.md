---
title: 파드그룹(PodGroup) 스케줄링 정책
content_type: concept
weight: 10
---
 
<!-- overview -->
{{< feature-state feature_gate_name="GenericWorkload" >}}
 
모든 [파드그룹](/docs/concepts/workloads/podgroup-api/)은 `spec.schedulingPolicy`
필드에 스케줄링 정책을 선언해야만 한다. 이 정책은 스케줄러가 그룹 내 파드 모음을
어떻게 다루는지를 결정한다.
 
<!-- body -->
 
## 정책 유형
 
`schedulingPolicy` 필드는 `basic`과 `gang`이라는 두 가지 정책 유형을 지원한다.
둘 중 정확히 하나를 지정해야 한다.
 
### Basic 정책
 
`basic` 정책은 스케줄러가 모든 파드를 최선 노력(best-effort) 방식으로 평가하도록
지시한다. `gang` 정책과 달리, `basic` 정책을 사용하는 파드그룹은 현재 스케줄링
가능한 파드의 수와 관계없이 실행 가능한 것으로 간주된다.
 
`basic` 정책을 사용하는 주된 이유는 파드를 그룹으로 묶어 관측가능성과 관리를 개선하며, 
단일하고 원자적인 [파드그룹 스케줄링 주기](/docs/concepts/scheduling-eviction/podgroup-scheduling/#파드그룹-스케줄링-주기)
내에서 함께 평가되도록 하기 위함이다.
 
이 정책은 동시 시작이 필요하지는 않지만 논리적으로 함께 속하는 그룹, 또는
"전부 아니면 전무(all-or-nothing)" 배치를 의미하지 않는 그룹 수준 제약 조건의
가능성을 열어두고자 하는 경우에 적합하다.
 
```yaml
schedulingPolicy:
  basic: {}
```
 
### Gang 정책
 
`gang` 정책은 "전부 아니면 전무" 스케줄링을 강제한다. 이는 부분적인 시작이 교착 상태(deadlock)나 
자원 낭비로 이어지는, 긴밀하게 결합된 워크로드에 필수적이다.
 
이는 모든 워커가 동시에 실행되어야 진행되는 [잡(Job)](/docs/concepts/workloads/controllers/job/)이나
기타 배치 프로세스에 사용할 수 있다.
 
`gang` 정책에는 `minCount` 필드가 필요하며, 이는 그룹이 실행 가능한 것으로
간주되기 위해 동시에 스케줄링될 수 있어야 하는 최소 파드 수를 의미한다:
 
```yaml
schedulingPolicy:
  gang:
    # 그룹이 승인되기 위해 동시에 스케줄링될 수 
    # 있어야 하는 파드 수.
    minCount: 4
```
 
## PodGroupTemplates를 통한 정책 설정
 
[워크로드 API](/docs/concepts/workloads/workload-api/)를 사용할 때는 `PodGroupTemplates`
내부에 스케줄링 정책을 정의한다. 워크로드 컨트롤러는 템플릿의 정책을 자신이 생성하는 
각 파드그룹으로 복사하여, 파드그룹이 자체적으로 완결되도록 만든다. 워크로드의 템플릿을 변경하면 
새로 생성되는 파드그룹에만 영향을 미치며, 기존 파드그룹에는 영향을 주지 않는다.
 
(워크로드 없이 생성된) 단독 파드그룹의 경우에는 파드그룹 자체에
`spec.schedulingPolicy`를 직접 설정한다.
 
## {{% heading "whatsnext" %}}
 
* 정책이 런타임에 어떻게 전달되는지 알아보려면 [파드그룹 API](/docs/concepts/workloads/podgroup-api/)를 참고한다.
* `PodGroupTemplates`를 정의하는 [워크로드 API](/docs/concepts/workloads/workload-api/)에 대해 알아본다.
* [파드그룹 스케줄링](/docs/concepts/scheduling-eviction/podgroup-scheduling/)에 대해 읽어본다.
* [갱 스케줄링](/docs/concepts/scheduling-eviction/gang-scheduling/)에 대해 읽어본다.
