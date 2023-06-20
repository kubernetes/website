---
title: 파드 스케줄링 준비성(readiness)
content_type: concept
weight: 40
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="alpha" >}}

파드는 생성되면 스케줄링 될 준비가 된 것으로 간주된다. 쿠버네티스 스케줄러는
모든 Pending 중인 파드를 배치할 노드를 찾기 위한 철저한 조사 과정을 수행한다. 그러나 일부 파드는
오랜 기간 동안 "필수 리소스 누락" 상태에 머물 수 있다.
이러한 파드는 실제로 스케줄러(그리고 클러스터 오토스케일러와 같은 다운스트림 통합자)
불필요한 방식으로 작동하게 만들 수 있다.

파드의 `.spec.schedulingGates`를 지정하거나 제거함으로써,
파드가 스케줄링 될 준비가 되는 시기를 제어할 수 있다.

<!-- body -->

## 파드 스케줄링게이트(schedulingGates) 구성하기
 
`스케줄링게이트(schedulingGates)` 필드는 문자열 목록을 포함하며, 각 문자열 리터럴은
파드가 스케줄링 가능한 것으로 간주되기 전에 충족해야 하는 기준으로 인식된다. 이 필드는
파드가 생성될 때만 초기화할 수 있다(클라이언트에 의해 생성되거나, 어드미션 중에 변경될 때).
생성 후 각 스케줄링게이트는 임의의 순서로 제거될 수 있지만, 새로운 스케줄링게이트의 추가는 허용되지 않는다.

{{< figure src="/ko/docs/images/podSchedulingGates.svg" alt="pod-scheduling-gates-diagram" caption="그림. 파드 스케줄링게이트" class="diagram-large" link="https://mermaid.live/edit#pako:eNp1Uk9v0zAc_SqWd5vSdU2yrDMSXMaREzcIBy-2G6tJHMXOYKoqFZHD6HqYBEwcNsQh0nbc0A4g8Yka9zvg_OmqScwn_97v-fk9-zeBgSAUIigVVvSQ41GG496x7Sd-AsySAwRWi0X15RLoT1e6uOtgewPPS_13psuiuv4Ilr8W-up-Nf9dnd90TOf_TF3Oqj_FhuZuaGfl6uJzC3OGnrhgeTsDRkBf3AP947SafzXAi_bQ2-13oNd7bryvMzQlZ2vvXfmUNNA_L5d3tw_eOGvlTGb9rajOTvX38nHHZKyKch24xdx1sKY0nuonDSIs5SFlYDyUgPEoQluO7QV0z5IqE2OKthhj3b73nhMVIjf9YAUiElnTe9ZpmFCWtC3pWNK1eKPnJ9CCMc1izIn50El9vw9VSGPqQ2S2BGdjH_rJ1PBwrsTrkySASGU5tWCeks3_PwZfEq5EBhHDkTRgJDChppxAdZLWkzPiUhnFQCSMj2o8zyIDh0qlEvX7dXtnxFWYH-0EIu5LTkKcqfD4wOt7tjfEtkO9fQfvOQ4JjgYHQ2a7A0b2dwc2htOpBVOcvBEifjBAGz-v2rFtpnf6DwGYFtw" >}}

## 사용 예시

파드가 스케줄링 될 준비가 되지 않았다고 표시하려면, 다음과 같이 하나 이상의 스케줄링 게이트를 생성하여 표시할 수 있다.

{{< codenew file="pods/pod-with-scheduling-gates.yaml" >}}

파드가 생성된 후에는 다음 명령을 사용하여 상태를 확인할 수 있다.

```bash
kubectl get pod test-pod
```

출력은 파드가 `SchedulingGated` 상태임을 보여준다.

```none
NAME       READY   STATUS            RESTARTS   AGE
test-pod   0/1     SchedulingGated   0          7s
```

다음 명령을 실행하여 `schedulingGates` 필드를 확인할 수도 있다.

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

출력은 다음과 같다.

```none
[{"name":"example.com/foo"},{"name":"example.com/bar"}]
```

스케줄러에게 이 파드가 스케줄링 될 준비가 되었음을 알리기 위해, 수정된 매니페스트를 다시 적용하여
`schedulingGates`를 완전히 제거할 수 있다.

{{< codenew file="pods/pod-without-scheduling-gates.yaml" >}}

`schedulingGates`가 지워졌는지 확인하려면 다음 명령을 실행하여 확인할 수 있다.

```bash
kubectl get pod test-pod -o jsonpath='{.spec.schedulingGates}'
```

출력은 비어 있을 것이다. 그리고 다음 명령을 실행하여 최신 상태를 확인할 수 있다.

```bash
kubectl get pod test-pod -o wide
```

test-pod가 CPU/메모리 리소스를 요청하지 않았기 때문에, 이 파드의 상태는 이전의 `SchedulingGated`에서
`Running`으로 전환됐을 것이다.

```none
NAME       READY   STATUS    RESTARTS   AGE   IP         NODE  
test-pod   1/1     Running   0          15s   10.0.0.4   node-2
```

## 가시성(Observability)

스케줄링을 시도했지만 스케줄링할 수 없다고 클레임되거나 스케줄링할 준비가 되지 않은 것으로 명시적으로 표시된 파드를
구분하기 위해 `scheduler_pending_pods` 메트릭은 `”gated"`라는 새로운 레이블과 함께 제공된다. 
`scheduler_pending_pods{queue="gated"}`를 사용하여 메트릭 결과를 확인할 수 있다.

## 파드 스케줄링 지시(Pod Scheduling Directives) 변경하기

{{< feature-state for_k8s_version="v1.27" state="beta" >}}

일정한 제약 조건이 있는 스케줄링 게이트가 있는 동안 포드의 스케줄링 지시를 변경할 수 있다. 고수준의 관점에서는
파드의 스케줄링 지시를 줄이는 것만 가능하다. 즉, 업데이트된 지시는 파드를 이전에 일치했던 노드의 하위 집합으로만
스케줄링할 수 있다. 파드의 스케줄링 지시을 업데이트하는 규칙은 다음과 같다.

1. `.spec.nodeSelector`의 경우, 조건의 추가만 허용된다. 비어있는 경우, 새로 설정할 수 있다.

2. `spec.affinity.nodeAffinity`가 nil이면, 어떤 값으로든 설정이 가능하다.

3. `NodeSelectorTerms`가 비어있다면, 설정이 가능하다. 비어있지 않다면, `matchExpressions` 또는
   `fieldExpressions`에 `NodeSelectorRequirements`만 추가할 수 있으며,
   이미 존재하는 `matchExpressions`과 `fieldExpressions`을 변경하지 않아도 된다. 이는
   `.requiredDuringSchedulingIgnoredDuringExecution.NodeSelectorTerms`은 OR로 적용되는 것에 반해
   `nodeSelectorTerms[].matchExpressions`과 `nodeSelectorTerms[].fieldExpressions`의
   표현식에는 AND로 적용되기 때문이다.

4. `.preferredDuringSchedulingIgnoredDuringExecution`의 경우, 모든 업데이트가 허용된다. 이는
   선호한다는 조건이 강제되지 않고, 이로 인해 정책 컨트롤러들은 해당 항목들을 검증하지 않기 때문이다.

## {{% heading "whatsnext" %}}

* 자세한 내용은 [PodSchedulingReadiness KEP](https://github.com/kubernetes/enhancements/blob/master/keps/sig-scheduling/3521-pod-scheduling-readiness)를 참고한다.
