---
title: API를 이용한 축출(API-initiated Eviction)
content_type: concept
weight: 110
---

{{< glossary_definition term_id="api-eviction" length="short" >}} </br>

축출 API를 직접 호출하거나, 또는 `kubectl drain` 명령과 같이 
{{<glossary_tooltip term_id="kube-apiserver" text="API 서버">}}의 클라이언트를 사용하여 프로그램적인 방법으로 축출 요청을 할 수 있다. 
이는 `Eviction` 오브젝트를 만들며, API 서버로 하여금 파드를 종료하도록 만든다.

API를 이용한 축출은 사용자가 설정한 [`PodDisruptionBudgets`](/docs/tasks/run-application/configure-pdb/) 및 
[`terminationGracePeriodSeconds`](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination) 값을 준수한다.

API를 사용하여 `Eviction` 오브젝트를 만드는 것은 
정책 기반의 파드 [`DELETE` 동작](/docs/reference/kubernetes-api/workload-resources/pod-v1/#delete-delete-a-pod)을 수행하는 것과 
비슷한 효과를 낸다.

## 축출 API 호출하기

[각 언어 별 쿠버네티스 클라이언트](/ko/docs/tasks/administer-cluster/access-cluster-api/#api에-프로그래밍-방식으로-접근)를 사용하여 
쿠버네티스 API를 호출하고 `Eviction` 오브젝트를 생성할 수 있다. 
이를 실행하려면, 아래의 예시를 참고하여 POST 호출을 수행한다.

{{< tabs name="Eviction_example" >}}
{{% tab name="policy/v1" %}}
{{< note >}}
`policy/v1` 축출은 v1.22 이상에서 사용 가능하다. 이전 버전에서는 `policy/v1beta1`를 사용한다.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{% tab name="policy/v1beta1" %}}
{{< note >}}
v1.22에서 사용 중단 및 `policy/v1`으로 대체되었다.
{{< /note >}}

```json
{
  "apiVersion": "policy/v1beta1",
  "kind": "Eviction",
  "metadata": {
    "name": "quux",
    "namespace": "default"
  }
}
```
{{% /tab %}}
{{< /tabs >}}

또는 다음 예시와 같이 `curl` 또는 `wget`으로 API에 접근하여 
축출 동작을 시도할 수도 있다.

```bash
curl -v -H 'Content-type: application/json' https://your-cluster-api-endpoint.example/api/v1/namespaces/default/pods/quux/eviction -d @eviction.json
```

## API를 이용한 축출의 동작

API를 사용하여 축출을 요청하면, 
API 서버는 인가 확인(admission checks)를 수행하고 다음 중 하나로 응답한다.

* `200 OK`: 축출 요청이 허용되었고, `Eviction` 서브리소스가 생성되었고, 
  (마치 파드 URL에 `DELETE` 요청을 보낸 것처럼) 파드가 삭제되었다.
* `429 Too Many Requests`: 현재 설정된 
  {{<glossary_tooltip term_id="pod-disruption-budget" text="PodDisruptionBudget">}} 때문에 
  축출이 현재 허용되지 않는다. 
  또는 API 요청 속도 제한(rate limiting) 때문에 이 응답을 받았을 수도 있다.
* `500 Internal Server Error`: 잘못된 환경 설정(예: 
  여러 PodDisruptionBudget이 하나의 동일한 파드를 참조함)으로 인해 축출이 허용되지 않는다.

축출하려는 파드가 
PodDisruptionBudget이 설정된 워크로드에 속하지 않는다면, 
API 서버는 항상 `200 OK`를 반환하고 축출을 허용한다.

API 서버가 축출을 허용하면, 파드는 다음과 같이 삭제된다.

1. API 서버 내 `Pod` 리소스의 삭제 타임스탬프(deletion timestamp)가 업데이트되며, 
   이 타임스탬프에 명시된 시각이 경과하면 API 서버는 해당 `Pod` 리소스를 종료 대상으로 간주한다. 
   또한 설정된 그레이스 시간(grace period)이 `Pod` 리소스에 기록된다.
1. 로컬 파드가 실행되고 있는 노드의 {{<glossary_tooltip term_id="kubelet" text="kubelet">}}이 
   `Pod`가 종료 대상으로 표시된 것을 감지하고 
   로컬 파드의 그레이스풀 셧다운을 시작한다.
1. kubelet이 파드를 종료하는 와중에, 컨트롤 플레인은 
   {{<glossary_tooltip term_id="endpoint" text="엔드포인트">}} 및 
   {{<glossary_tooltip term_id="endpoint-slice" text="엔드포인트슬라이스">}} 오브젝트에서 파드를 삭제한다. 
   이 결과, 컨트롤러는 파드를 더 이상 유효한 오브젝트로 간주하지 않는다.
1. 파드의 그레이스 시간이 만료되면, 
   kubelet이 로컬 파드를 강제로 종료한다.
1. kubelet이 API 서버에 `Pod` 리소스를 삭제하도록 지시한다.
1. API 서버가 `Pod` 리소스를 삭제한다.

## 문제가 있어 중단된 축출 트러블슈팅하기

일부 경우에, 애플리케이션이 잘못된 상태로 돌입하여, 
직접 개입하기 전에는 축출 API가 `429` 또는 `500` 응답만 반환할 수 있다. 
이러한 현상은, 예를 들면 레플리카셋이 애플리케이션을 서비스할 파드를 생성했지만 
새 파드가 `Ready`로 바뀌지 못하는 경우에 발생할 수 있다. 
또는 마지막으로 축출된 파드가 긴 종료 그레이스 시간을 가진 경우에 이러한 현상을 목격할 수도 있다.

문제가 있어 중단된 축출을 발견했다면, 다음 해결책 중 하나를 시도해 본다.

* 이 문제를 발생시키는 자동 동작(automated operation)을 중단하거나 일시 중지한다. 
  해당 동작을 재시작하기 전에, 문제가 있어 중단된 애플리케이션을 조사한다.
* 잠시 기다린 뒤, 축출 API를 사용하는 것 대신 
  클러스터 컨트롤 플레인에서 파드를 직접 삭제한다.

## {{% heading "whatsnext" %}}

* [Pod Disruption Budget](/docs/tasks/run-application/configure-pdb/)을 사용하여 애플리케이션을 보호하는 방법에 대해 알아본다.
* [노드-압박 축출](/ko/docs/concepts/scheduling-eviction/node-pressure-eviction/)에 대해 알아본다.
* [파드 우선순위와 선점](/ko/docs/concepts/scheduling-eviction/pod-priority-preemption/)에 대해 알아본다.
