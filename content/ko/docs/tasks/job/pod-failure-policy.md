---
title: 파드 실패 정책으로 재시도 가능한 파드 실패와 재시도 불가능한 파드 실패 다루기
content_type: task
min-kubernetes-server-version: v1.25
weight: 60
---

{{< feature-state feature_gate_name="JobPodFailurePolicy" >}}

<!-- overview -->

이 문서에서는
[파드 실패 정책](/docs/concepts/workloads/controllers/job#pod-failure-policy)을
기본값인
[파드 백오프 실패 정책](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)과 함께 사용하여
{{<glossary_tooltip text="잡" term_id="job">}} 내의 컨테이너 수준 또는 파드 수준 실패 처리에 대한
제어를 개선하는 방법을 보여 준다.

파드 실패 정책을 정의하면 다음과 같은 도움을 받을 수 있다.
* 불필요한 파드 재시도를 피해 컴퓨팅 리소스를 더 잘 활용할 수 있다.
* 파드 중단(예: {{<glossary_tooltip text="선점" term_id="preemption" >}},
{{<glossary_tooltip text="API를 이용한 축출" term_id="api-eviction" >}}
또는 {{<glossary_tooltip text="테인트" term_id="taint" >}} 기반 축출)으로 인한 잡 실패를 피할 수 있다.

## {{% heading "prerequisites" %}}

[잡](/docs/concepts/workloads/controllers/job/)의 기본 사용법에 이미 익숙해야 한다.

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## 사용 시나리오

파드 실패 정책을 정의하는 잡의 사용 시나리오로 다음을 살펴보자.
- [불필요한 파드 재시도 방지하기](#pod-failure-policy-failjob)
- [파드 중단 무시하기](#pod-failure-policy-ignore)
- [커스텀 파드 컨디션을 기반으로 불필요한 파드 재시도 방지하기](#pod-failure-policy-config-issue)
- [인덱스별 불필요한 파드 재시도 방지하기](#backoff-limit-per-index-failindex)

### 파드 실패 정책으로 불필요한 파드 재시도 방지하기 {#pod-failure-policy-failjob}

다음 예시를 통해, 파드 실패가 재시도할 수 없는 소프트웨어 버그를 나타낼 때
파드 실패 정책으로 불필요한 파드 재시작을 방지하는 방법을
배울 수 있다.

1. 다음 매니페스트를 살펴본다.

   {{% code_sample file="/controllers/job-pod-failure-policy-failjob.yaml" %}}

1. 매니페스트를 적용한다.

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-failjob.yaml
   ```

1. 30초 정도 지나면 전체 잡이 종료된다. 다음을 실행하여 잡의 상태를 확인한다.

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-failjob -o yaml
   ```

   잡 상태에는 다음 컨디션이 표시된다.
   - `FailureTarget` 컨디션은 `reason` 필드가 `PodFailurePolicy`로 설정되어 있고,
     `message` 필드에는 종료에 대한 자세한 정보가 담긴다. 예를 들면
     `Container main for pod default/job-pod-failure-policy-failjob-8ckj8 failed with exit code 42 matching FailJob rule at index 0`과 같다.
     잡 컨트롤러는 잡이 실패로 간주되는 즉시 이 컨디션을 추가한다.
     자세한 내용은 [잡 파드 종료](/docs/concepts/workloads/controllers/job/#termination-of-job-pods)를 참고한다.
   - `Failed` 컨디션은 `FailureTarget` 컨디션과 동일한 `reason`,
     `message` 값을 가진다. 잡 컨트롤러는 잡의 모든 파드가 종료된 뒤에
     이 컨디션을 추가한다.

   비교하자면, 파드 실패 정책이 비활성화되어 있다면 잡은
   `backoffLimit`(6회 실패)에 도달할 때까지 재시도한다. 재시도에는
   지수 백오프가 사용되고 `parallelism: 2`이므로 실패가 쌍으로 발생하여,
   시도 사이의 지연이 재시도할 때마다 늘어난다. 그 결과
   이 예시는 잡이 실패하기까지 최소 9분이 걸린다.

#### 정리하기

생성한 잡을 삭제한다.

```sh
kubectl delete jobs/job-pod-failure-policy-failjob
```

클러스터가 파드를 자동으로 정리한다.

### 파드 실패 정책으로 파드 중단 무시하기 {#pod-failure-policy-ignore}

다음 예시를 통해, 파드 중단이 파드 재시도 카운터를 증가시켜
`.spec.backoffLimit` 한도에 이르지 않도록 파드 실패 정책으로 파드 중단을
무시하는 방법을 배울 수 있다.

{{< caution >}}
이 예시는 타이밍이 중요하므로, 실행하기 전에 단계를 미리 읽어 두는 것이 좋다.
파드 중단을 유발하려면 파드가 노드에서 실행되는 동안 해당 노드를
드레인(drain)하는 것이 중요하다(파드가 스케줄링된 뒤 90초 이내).
{{< /caution >}}

1. 다음 매니페스트를 살펴본다.

   {{% code_sample file="/controllers/job-pod-failure-policy-ignore.yaml" %}}

1. 매니페스트를 적용한다.

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-ignore.yaml
   ```

1. 다음 명령을 실행하여 파드가 스케줄링된 `nodeName`을 확인한다.

   ```sh
   nodeName=$(kubectl get pods -l job-name=job-pod-failure-policy-ignore -o jsonpath='{.items[0].spec.nodeName}')
   ```

1. 파드가 완료되기 전에 노드를 드레인하여 파드를 축출한다(90초 이내).

   ```sh
   kubectl drain nodes/$nodeName --ignore-daemonsets --grace-period=0
   ```

1. `.status.failed`를 확인하여 잡의 카운터가 증가하지 않았는지 검사한다.

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-ignore -o yaml
   ```

1. 노드의 통제를 해제(uncordon)한다.

   ```sh
   kubectl uncordon nodes/$nodeName
   ```

잡이 재개되어 성공한다.

비교하자면, 파드 실패 정책이 비활성화되어 있다면 파드 중단으로 인해
전체 잡이 종료된다(`.spec.backoffLimit`이 0으로 설정되어 있기 때문).

#### 정리하기

생성한 잡을 삭제한다.

```sh
kubectl delete jobs/job-pod-failure-policy-ignore
```

클러스터가 파드를 자동으로 정리한다.

### 커스텀 파드 컨디션을 기반으로 파드 실패 정책으로 불필요한 파드 재시도 방지하기 {#pod-failure-policy-config-issue}

다음 예시를 통해, 커스텀 파드 컨디션을 기반으로 파드 실패 정책으로
불필요한 파드 재시작을 방지하는 방법을 배울 수 있다.

{{< note >}}
아래 예시는 `Pending` 단계에 있는 삭제된 파드가 터미널 단계로 전환되는 것에
의존하므로 1.27 버전부터 동작한다
([파드의 단계](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) 참고).
{{< /note >}}

1. 다음 매니페스트를 살펴본다.

   {{% code_sample file="/controllers/job-pod-failure-policy-config-issue.yaml" %}}

1. 매니페스트를 적용한다.

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-pod-failure-policy-config-issue.yaml
   ```

   이미지가 존재하지 않으므로 잘못 구성되어 있다는 점에 유의한다.

1. 다음을 실행하여 잡 파드의 상태를 확인한다.

   ```sh
   kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   다음과 유사한 출력을 확인할 수 있다.
   ```yaml
   containerStatuses:
   - image: non-existing-repo/non-existing-image:example
      ...
      state:
      waiting:
         message: Back-off pulling image "non-existing-repo/non-existing-image:example"
         reason: ImagePullBackOff
         ...
   phase: Pending
   ```

   잘못 구성된 이미지를 가져오지 못하기 때문에 파드가 `Pending` 단계에
   머물러 있다는 점에 유의한다. 원칙적으로 이는 일시적인 문제일 수 있고
   이미지를 가져오게 될 수도 있다. 그러나 이 경우에는 이미지가 존재하지 않으므로
   커스텀 컨디션으로 이 사실을 나타낸다.

1. 커스텀 컨디션을 추가한다. 먼저 다음을 실행하여 패치를 준비한다.

   ```sh
   cat <<EOF > patch.yaml
   status:
     conditions:
     - type: ConfigIssue
       status: "True"
       reason: "NonExistingImage"
       lastTransitionTime: "$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
   EOF
   ```
   다음으로, 다음을 실행하여 잡이 생성한 파드 중 하나를 선택한다.
   ```
   podName=$(kubectl get pods -l job-name=job-pod-failure-policy-config-issue -o jsonpath='{.items[0].metadata.name}')
   ```

   그다음, 다음 명령을 실행하여 파드 중 하나에 패치를 적용한다.

   ```sh
   kubectl patch pod $podName --subresource=status --patch-file=patch.yaml
   ```

   성공적으로 적용되면 다음과 같은 알림을 받게 된다.

   ```sh
   pod/job-pod-failure-policy-config-issue-k6pvp patched
   ```

1. 다음 명령을 실행하여 파드를 삭제해 `Failed` 단계로 전환한다.

   ```sh
   kubectl delete pods/$podName
   ```

1. 다음을 실행하여 잡의 상태를 확인한다.

   ```sh
   kubectl get jobs -l job-name=job-pod-failure-policy-config-issue -o yaml
   ```

   잡 상태에서 `reason` 필드가 `PodFailurePolicy`인 잡 `Failed` 컨디션을
   확인할 수 있다. 또한 `message` 필드에는 잡 종료에 대한
   더 자세한 정보가 담겨 있으며, 예를 들면 다음과 같다.
   `Pod default/job-pod-failure-policy-config-issue-k6pvp has condition ConfigIssue matching FailJob rule at index 0`.

{{< note >}}
프로덕션 환경에서는 3단계와 4단계를 사용자가 제공하는 컨트롤러로
자동화해야 한다.
{{< /note >}}

#### 정리하기

생성한 잡을 삭제한다.

```sh
kubectl delete jobs/job-pod-failure-policy-config-issue
```

클러스터가 파드를 자동으로 정리한다.

### 파드 실패 정책으로 인덱스별 불필요한 파드 재시도 방지하기 {#backoff-limit-per-index-failindex}

인덱스별 불필요한 파드 재시작을 방지하려면 _파드 실패 정책_ 과
_인덱스당 백오프 제한_ 기능을 사용할 수 있다. 이 절에서는 두 기능을 함께 사용하는
방법을 보여 준다.

1. 다음 매니페스트를 살펴본다.

   {{% code_sample file="/controllers/job-backoff-limit-per-index-failindex.yaml" %}}

1. 매니페스트를 적용한다.

   ```sh
   kubectl create -f https://k8s.io/examples/controllers/job-backoff-limit-per-index-failindex.yaml
   ```

1. 15초 정도 지난 뒤 잡 파드의 상태를 확인한다. 다음을 실행하면 된다.

   ```shell
   kubectl get pods -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   다음과 유사한 출력을 확인할 수 있다.

   ```none
   NAME                                            READY   STATUS      RESTARTS   AGE
   job-backoff-limit-per-index-failindex-0-4g4cm   0/1     Error       0          4s
   job-backoff-limit-per-index-failindex-0-fkdzq   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-1-2bgdj   0/1     Error       0          15s
   job-backoff-limit-per-index-failindex-2-vs6lt   0/1     Completed   0          11s
   job-backoff-limit-per-index-failindex-3-s7s47   0/1     Completed   0          6s
   ```

   출력에는 다음 내용이 나타난다는 점에 유의한다.

   * 백오프 제한이 해당 인덱스에 대해 한 번의 재시도를 허용했기 때문에
   두 개의 파드가 인덱스 0을 가진다.
   * 실패한 파드의 종료 코드가 `FailIndex` 액션을 가진 파드 실패 정책과
   일치했기 때문에 인덱스 1을 가진 파드는 하나뿐이다.

1. 다음을 실행하여 잡의 상태를 확인한다.

   ```sh
   kubectl get jobs -l job-name=job-backoff-limit-per-index-failindex -o yaml
   ```

   두 인덱스가 모두 실패했기 때문에 잡 상태의 `failedIndexes` 필드에는
   "0,1"이 표시된다. 인덱스 1은 재시도되지 않았으므로 상태 필드 "failed"가
   나타내는 실패한 파드 수는 3이다.

#### 정리하기

생성한 잡을 삭제한다.

```sh
kubectl delete jobs/job-backoff-limit-per-index-failindex
```

클러스터가 파드를 자동으로 정리한다.

## 대안

잡의 `.spec.backoffLimit` 필드를 지정하여
[파드 백오프 실패 정책](/docs/concepts/workloads/controllers/job#pod-backoff-failure-policy)에만
의존할 수도 있다. 그러나 많은 경우, 불필요한 파드 재시도를 피할 만큼
`.spec.backoffLimit`을 낮게 설정하면서도 파드 중단으로 잡이 종료되지 않을 만큼
충분히 높게 설정하는 균형점을 찾기가
어렵다.
