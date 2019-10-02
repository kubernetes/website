---
title: 페더레이션
content_template: templates/concept
weight: 80
---

{{% capture overview %}}

{{< deprecationfilewarning >}}
{{< include "federation-deprecation-warning-note.md" >}}
{{< /deprecationfilewarning >}}

이 페이지는 여러 쿠버네티스 클러스터를 페더레이션을 통해서 관리해야 하는 이유와 방법을 
설명한다.
{{% /capture %}}

{{% capture body %}}
## 페더레이션 이유

페더레이션을 사용하면 여러 클러스터를 쉽게 관리할 수 있다. 이는 2가지 주요 빌딩 블록을 
제공함으로써 이루어진다. 

  * 클러스터 간의 리소스 동기화: 페더레이션은 여러 클러스터 내의 리소스를 
    동기화하는 능력을 제공한다. 예를 들면, 여러 클러스터에 동일한 디플로이먼트가 존재하는 것을 확인 할 수 있다.
  * 클러스터 간의 디스커버리: 페더레이션은 모든 클러스터의 백엔드에 DNS 서버 및 로드벨런서를 자동 구성하는 능력을 제공한다. 예를 들면, 글로벌 VIP 또는 DNS 기록이 여러 클러스터의 백엔드 엑세스에 사용될 수 있는 것을 확인할 수 있다.

페더레이션이 가능하게 하는 다른 사례는 다음과 같다.

* 고가용성: 클러스터에 걸쳐서 부하를 분산하고 DNS 
  서버와 로드벨런서를 자동 구성함으로써, 페더레이션은 클러스터 장애의 영향을 
  최소화한다.
* 공급자 락인(lock-in) 회피: 애플리케이션의 클러스터 간 마이그레이션을 쉽게 
  만듦으로써, 페더레이션은 클러스터 공급자의 락인을 방지한다.


여러 클러스터를 운영하는 경우가 아니면 페더레이션은 필요 없다. 여러 클러스터가 필요한 
이유의 일부는 다음과 같다.

* 짧은 지연시간: 클러스터가 여러 지역(region)에 있으면 사용자에게 가장 가까운 클러스터로부터 
  서비스함으로써 지연시간을 최소화한다.
* 결함 격리: 하나의 큰 클러스터보다 여러 개의 작은 클러스터를 사용하는 것이 
  결함을 격리하는데 더 효과적이다(예를 들면, 클라우드 
  공급자의 다른 가용 영역(availability zone)에 있는 여러 클러스터).
* 확장성: 단일 쿠버네티스 클러스터는 확장성에 한계가 있다(일반적인 
  사용자에게 해당되는 사항은 아니다. 더 자세한 내용: 
  [쿠버네티스 스케일링 및 성능 목표](https://git.k8s.io/community/sig-scalability/goals.md)).
* [하이브리드 클라우드](#하이브리드-클라우드-역량): 다른 클라우드 공급자나 온-프레미스 데이터 센터에 있는 여러 클러스터를 
  운영할 수 있다. 

### 주의 사항

페더레이션에는 매력적인 사례가 많지만, 다소 주의 해야 할 
사항도 있다.

* 네트워크 대역폭과 비용 증가: 페더레이션 컨트롤 플레인은 모든 클러스터를 
  감시하여 현재 상태가 예정된 상태와 같은지 확인한다. 이것은 클러스터들이 
  한 클라우드 제공자의 여러 다른 지역에서 또는 클라우드 제공자 간에 걸쳐 동작하는 
  경우 상당한 네트워크 비용을 초래할 수 있다.
* 클러스터 간 격리 수준 감소: 페더레이션 컨트롤 플레인에서의 오류는 모든 클러스터에 
  영향을 줄 수 있다. 이것은 페더레이션 컨트롤 플레인의 논리를 최소한으로 
  유지함으로써 완화된다. 페더레이션은 가능한 경우 언제라도 
  쿠버네티스 클러스터에 컨트롤 플레인을 위임한다. 페더레이션은 안전성을 제공하고 
  여러 클러스터의 중단을 방지할 수 있도록 민감하게 설계 및 구현되었다.
* 성숙도: 페더레이션 프로젝트는 상대적으로 신규 프로젝트이고 성숙도가 높지 않다.
  모든 리소스가 이용 가능한 상태는 아니며 많은 리소스가 아직 알파 상태이다. [이슈
  88](https://github.com/kubernetes/federation/issues/88)은 팀이 해결 
  중에 있는 시스템의 알려진 이슈를 열거하고 있다. 

### 하이브리드 클라우드 역량

쿠버네티스 클러스터의 페더레이션은 다른 클라우드 제공자(예를 들어, Google 클라우드, AWS), 
그리고 온-프레미스(예를 들어, OpenStack)에서 동작 중인 클러스터를 포함할 수 
있다. [Kubefed](/docs/tasks/federation/set-up-cluster-federation-kubefed/)는 연합된 클러스터 배치에 권장되는 방법이다. 

그 후에, [API 리소스](#api-리소스)는 서로 다른 클러스터와 클라우드 
제공자에 걸쳐 확장될 수 있다. 

## 페더레이션 설치

여러 클러스터의 페더레이션 구성을 위해서는, 페더레이션 컨트롤 플레인을 우선적으로 
설치해야 한다.
페더레이션 컨트롤 플레인의 설치를 위해서는 [설치 가이드](/docs/tutorials/federation/set-up-cluster-federation-kubefed/)
를 따른다.

## API 리소스

컨트롤 플레인이 설치되고 나면, 페더레이션 API 리소스 생성을 시작할 수 
있다.
다음의 가이드는 일부 리소스에 대해서 자세히 설명한다.

* [클러스터](/docs/tasks/administer-federation/cluster/)
* [컨피그 맵](/docs/tasks/administer-federation/configmap/)
* [데몬 셋](/docs/tasks/administer-federation/daemonset/)
* [디플로이먼트](/docs/tasks/administer-federation/deployment/)
* [이벤트](/docs/tasks/administer-federation/events/)
* [Hpa](/docs/tasks/administer-federation/hpa/)
* [인그레스](/docs/tasks/administer-federation/ingress/)
* [잡](/docs/tasks/administer-federation/job/)
* [네임스페이스](/docs/tasks/administer-federation/namespaces/)
* [레플리카 셋](/docs/tasks/administer-federation/replicaset/)
* [시크릿](/docs/tasks/administer-federation/secret/)
* [서비스](/docs/concepts/cluster-administration/federation-service-discovery/)


[API 참조 문서](/docs/reference/federation/)는 페더레이션 
apiserver가 지원하는 모든 리소스를 열거한다. 

## 삭제 캐스케이딩(cascading)

쿠버네티스 버전 1.6은 연합된 리소스에 대한 삭제 캐스케이딩을 
지원한다. 삭제 케스케이딩이 적용된 경우, 페더레이션 컨트롤 플레인에서 
리소스를 삭제하면, 모든 클러스터에서 상응하는 리소스가 삭제된다.

REST API 사용하는 경우 삭제 캐스케이딩이 기본으로 활성화되지 않는다. 그것을 
활성화하려면, REST API를 사용하여 페더레이션 컨트롤 플레인에서 리소스를 삭제할 때 
`DeleteOptions.orphanDependents=false` 옵션을 설정한다. `kubectl
delete`를 사용하면 
삭제 캐스케이딩이 기본으로 활성화된다. `kubectl
delete --cascade=false`를 실행하여 비활성화할 수 있다.

참고: 쿠버네티스 버전 1.5는 페더레이션 리소스의 부분 집합에 대한 삭제 
캐스케이딩을 지원하였다.

## 단일 클러스터의 범위

Google Compute Engine 또는 Amazon Web Services와 같은 IaaS 제공자에서는, VM이 
[영역(zone)](https://cloud.google.com/compute/docs/zones) 또는 [가용 영역(availability
zone)](http://docs.aws.amazon.com/AWSEC2/latest/UserGuide/using-regions-availability-zones.html)에 존재한다.
다음과 같은 이유로, 쿠버네티스 클러스터의 모든 VM을 동일한 가용 영역에 두는 것을 추천한다.

  - 단일 글로벌 쿠버네티스 클러스터에 비해서, 장애에 대한 단일-포인트가 더 적다.
  - 여러 가용 영역에 걸친 클러스터에 비해서, 단일-영역 클러스터의 가용성 속성에 대한 추론이 
    더 쉽다.
  - 쿠버네티스 개발자가 시스템을 디자인할 때(예를 들어, 지연 시간, 대역폭, 연관된 장애를 
    고려할 때) 모든 기계가 단일 데이터 센터에 있거나 밀접하게 연결되어 있다고 가정하고 있다.

가용 영역당 더 많은 VM이 포함되는 적은 수의 클러스터 실행을 추천한다. 다만, 여러 가용 영역 마다 여러 클러스터의 실행도 가능하다.

가용 영역당 더 적은 수의 클러스터가 선호되는 이유는 다음과 같다.

  - 한 클러스터에 많은 노드가 있는 일부의 경우 파드의 빈 패킹(bin packing)이 향상됨(리소스 단편화 감소).
  - 운영 오버헤드 감소(운영 툴과 프로세스의 성숙도에 의해 해당 장점은 반감되는 측면이 있음).
  - apiserver VMs와 같이, 클러스터당 비용이 고정된 리소스의 비용을 감소(그러나 중간 규모 부터 큰 규모에 이르는 클러스터의 
    전체 클러스터 비용에 비하면 상대적으로 적은 비용). 

여러 클러스터가 필요한 이유는 다음을 포함한다.

  - 다른 업무의 계층으로부터 특정 계층의 격리가 요구되는 엄격한 보안 정책(다만, 아래의 클러스터 분할하기 정보를 확인하기 
    바람).
  - 새로운 쿠버네티스 릴리스 또는 다른 클러스터 소프트웨어를 카나리아(canary) 방식으로 릴리스하기 위해서 클러스터를 테스트.

## 적절한 클러스터 수 선택하기

쿠버네티스 클러스터의 수를 선택하는 것은 상대적으로 고정적인 선택이며, 가끔식만 재고된다.
대조적으로, 클러스터의 노드 수와 서비스 내의 파드 수는 부하와 규모 증가에 따라 
빈번하게 변경될 수 있다.

클러스터의 수를 선택하기 위해서, 첫 번째로, 쿠버네티스에서 동작할 서비스의 모든 최종 사용자에게 적절한 지연 시간을 제공할 수 있는 지역들을 선택할 
필요가 있다(만약 콘텐츠 전송 네트워크를 사용한다면, CDN-호스트된 콘텐츠의 지연 시간 요구사항 
고려할 필요가 없음). 법적인 이슈 또한 이것에 영향을 줄 수 있다. 예를 들면, 어떤 글로벌 고객 기반의 회사는 US, AP, SA 지역 등 특정 지역에서 클러스터를 운영하도록 결정할 수도 있다.
지역의 수를 `R`이라 부르자.

두 번째로, 여전히 사용 가능한 상태에서, 얼마나 많은 클러스터가 동시에 사용할 수 없는 상태가 될 수 있는지 결정한다.
사용하지 않는 상태가 될 수 있는 수를 `U`라고 하자. 만약이 값에 확신이 없다면, 1이 괜찮은 선택이다.

클러스터 장애 상황에서 어느 지역으로든지 직접적인 트래픽에 대한 로드밸런싱이 허용된다면, `R` 
또는 적어도 `U + 1` 이상의 클러스터가 있으면 된다. 만약 그렇지 않다면(예를 들어, 클러스터 장애 상황에서 모든 
사용자에 대한 낮은 지연 시간을 유지하고 싶다면), `R * (U + 1)`(각 `R` 지역 내에 `U + 1`) 
클러스터가 필요하다. 어느 경우든지, 각 클러스터는 다른 영역에 배치하도록 노력하는 것이 좋다.

마지막으로, 클러스터 중 어느 클러스터라도 쿠버네티스 클러스터에서 추천되는 최대 노드 수 보다 더 많은 노드가 필요하다면, 
더 많은 클러스터가 필요할 것이다. 쿠버네티스 v1.3은 클러스터를 최대 1000노드까지 지원한다. 쿠버네티스 v1.8은 
클러스터를 최대 5000 노드까지 지원한다. 더 자세한 가이드는 [대규모 클러스터 구축하기](/docs/setup/best-practices/cluster-large/)에서 확인 가능하다.

{{% /capture %}}

{{% capture whatsnext %}}
* [페더레이션 
  제안](https://github.com/kubernetes/community/blob/{{< param "githubbranch" >}}/contributors/design-proposals/multicluster/federation.md)에 대해 더 학습하기.
* 클러스터 페더레이션 [설치 가이드](/docs/tutorials/federation/set-up-cluster-federation-kubefed/) 보기.
* [Kubecon2016 페더레이션 발표](https://www.youtube.com/watch?v=pq9lbkmxpS8) 보기
* [Kubecon2017 유럽 페더레이션 업데이트 내용](https://www.youtube.com/watch?v=kwOvOLnFYck) 보기
* [Kubecon2018 유럽 sig-multicluster 업데이트 내용](https://www.youtube.com/watch?v=vGZo5DaThQU) 보기
* [Kubecon2018 유럽 Federation-v2 프로토타입 발표](https://youtu.be/q27rbaX5Jis?t=7m20s) 보기
* [Federation-v2 사용자 가이드](https://github.com/kubernetes-sigs/federation-v2/blob/master/docs/userguide.md) 보기
{{% /capture %}}
