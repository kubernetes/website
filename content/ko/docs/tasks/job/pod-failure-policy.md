---
title: 파드 실패 정책을 통해 재시도 가능 및 불가능한 파드 실패 처리하기
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

{{< feature-state for_k8s_version="v1.26" state="beta" >}}

<!-- overview -->

이 문서는
기본 [파드 백오프(backoff) 실패 정책](/ko/docs/concepts/workloads/controllers/job#파드-백오프-backoff-실패-정책)과 함께
[파드 실패 정책](/ko/docs/concepts/workloads/controllers/job#pod-failure-policy)을 사용하여
{{<glossary_tooltip text="잡" term_id="job">}} 내부에서 일어나는
컨테이너 및 파드 레벨의 실패를 세부적으로 통제하는
방법에 대해 설명한다.

파드 실패 정책를 정의하는 것은 아래와 같은 방식으로 도움이 될 수 있다.
* 불필요한 파드 재시도를 예방함으로써 컴퓨터 리소스를 더 잘 활용할 수 있다.
* ({{<glossary_tooltip text="선점(preemption)" term_id="preemption" >}},
{{<glossary_tooltip text="API를 이용한 축출(API-initiated Eviction)" term_id="api-eviction" >}}
또는 {{<glossary_tooltip text="테인트(taint)" term_id="taint" >}}-기반 축출와 같은) 파드 중단(disruption)으로 인한 잡 실패를 예방한다.

## {{% heading "prerequisites" %}}

기본적으로 [잡](/ko/docs/concepts/workloads/controllers/job/) 사용 방법에 익숙하다고 가정한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## 파드 실패 정책으로 불필요한 파드 재시도 예방하기

아래 예제를 통해 파드 실패 정책을 사용하여
재시도할 수 없는 소프트웨어 버그로 인해 파드가 실패했을 때
불필요한 파드 재시작을 회피하는 방법을 알 수 있다.

우선, 아래 설정으로

{{< codenew file="/controllers/job-pod-failure-policy-failjob.yaml" >}}

아래 명령어를 실행하여 잡을 생성한다.

```sh
kubectl create -f job-pod-failure-policy-failjob.yaml
```

30초 정도가 지나면 잡은 Terminated 상태가 되었을 것이다. 아래 명령어를 실행하여 잡의 상태를 검사한다.

```sh
kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
```

잡 상태에서, `reason` 필드 값이 `PodFailurePolicy`인
`Failed` 상태의 잡을 확인한다. 추가적으로 `message` 필드는
`Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`와 같이
잡의 종료에 대한 더욱 자세한 정보를 포함한다.

대조적으로, 만일 파드 실패 정책이 비활성화되었다면 파드는 6번 재실행되었을 것이며,
최소 2분이 소요되었을 것이다.

### 정리

다음 명령을 실행하여, 생성했던 잡을 제거한다.

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

클러스터가 자동으로 파드를 정리한다.

## 파드 실패 정책으로 파드 중단 예방하기

아래 예제를 참고하면 파드 실패 정책을 통해
파드 중단(disruption)으로 인해 파드 재시작 횟수가
`.spec.backoffLimit` 값에 가까워지는 것을 막을 수 있다.

{{< caution >}}
해당 예제에서는 타이밍이 중요하다. 그러므로 실행하기 전에 각 단계를 미리 읽는 것을
권장한다. 파드 중단을 발생시키기 위해서는 (파드가 스케줄된 90초 이내로)
파드가 실행 중인 상태에서 노드를 드레인(drain)하는 것이 중요하다.
{{< /caution >}}

1. 아래 설정으로

   {{< codenew file="/controllers/job-pod-failure-policy-ignore.yaml" >}}

   아래 명령어를 실행하여 잡을 생성한다.

   ```sh
   kubectl create -f job-pod-failure-policy-ignore.yaml
   ```

2. 파드가 스케줄된 `nodeName`을 확인하기 위해 아래 명령어를 실행한다.

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

3. 노드를 드레인(drain)하여 파드가 (90초 내로) 완료되기 전에 축출(evict)되도록 한다.
   
   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

4. `.status.failed`를 검사하여 잡에 대한 카운터가 증가하지 않았음을 확인한다.

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

5. 노드에 대한 드레인을 해제한다 

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

잡은 재개하며 성공한다.

대조적으로, 만일 파드 실패 정책이 비활성화되었다면 (`.spec.backoffLimit` 값이 0이므로)
파드 중단(disruption)은 잡 전체를 Terminated 상태로 만들었을 것이다.

### 정리

다음 명령을 실행하여, 생성했던 잡을 제거한다.

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

클러스터가 자동으로 파드를 정리한다.

## 대안

잡의 `.spec.backoffLimit` 필드를 지정함으로써
[파드 백오프(backoff) 실패 정책](/ko/docs/concepts/workloads/controllers/job#파드-백오프-backoff-실패-정책)에
온전히 의존할 수도 있다. 그러나 많은 경우
불필요한 파드 재시도를 막기 위해 충분히 낮으면서도,
동시에 파드 중단(disruption)으로 인해 잡이 Terminated 상태가 되지 않도록 충분히 높은
`.spec.backoffLimit` 값의 균형을 찾는 것은 어렵다.
