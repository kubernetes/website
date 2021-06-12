---


title: 파드와 레플리케이션컨트롤러(ReplicationController) 디버그하기
content_type: task
---

<!-- overview -->

이 페이지에서는 파드와 레플리케이션컨트롤러를 디버깅하는 방법을 소개한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 사용자는
  {{< glossary_tooltip text="파드" term_id="pod" >}} 기본 사항과 파드의  
  [라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)에 대해 잘 알고 있어야 한다.

<!-- steps -->

## 파드 디버깅

파드 디버깅의 첫 번째 단계는 파드를 살펴 보는 것이다. 다음의 명령어를
사용하여 파드의 현재 상태와 최근 이벤트를 점검한다.

```shell
kubectl describe pods ${POD_NAME}
```

파드 내부 컨테이너의 상태를 확인한다. 모두 `Running` 상태인가?
최근에 재시작 되었는가?

파드의 상태에 따라 디버깅을 계속한다.

### 파드가 pending 상태로 유지

파드가 `Pending` 상태로 멈춰 있는 경우는, 노드에 스케줄 될 수 없음을 의미한다.
일반적으로 이것은 어떤 유형의 리소스가 부족하거나 스케줄링을 방해하는 다른 요인 때문이다.
상단의 `kubectl describe ...` 명령의 결과를 확인하자.
파드를 스케줄 할 수 없는 이유에 대한 스케줄러의 메세지가 있어야 한다.
이유는 다음과 같다.

#### 부족한 리소스

사용자 클러스터의 CPU 나 Memory의 공급이 소진되었을 수 있다. 이 경우
몇 가지 방법을 시도할 수 있다.

* 클러스터에 노드를 더 추가하기.

* pending 상태인 파드를 위한 공간을 확보하기 위해
  [불필요한 파드 종료하기](/ko/docs/concepts/workloads/pods/pod-lifecycle/#pod-termination)

* 파드가 노드보다 크지 않은지 확인한다. 예를 들어 모든
  노드가 `cpu:1` 의 용량을 가지고 있을 경우, `cpu: 1.1` 을 요청하는 파드는
  절대 스케줄 될 수 없다.

	사용자는 `kubectl get nodes -o <format>` 명령으로 노드의
	용량을 점검할 수 있다. 다음은 필요한 정보를 추출하는 몇 가지
	명령의 예이다.

    ```shell
    kubectl get nodes -o yaml | egrep '\sname:|cpu:|memory:'
    kubectl get nodes -o json | jq '.items[] | {name: .metadata.name, cap: .status.capacity}'
    ```

  [리소스 쿼터](/ko/docs/concepts/policy/resource-quotas/)
  기능은 사용할 수 있는 전체 리소스의 양을 제한하도록 설정할 수 있다.
  네임스페이스와 함께 사용하면,
  한 팀이 모든 리소스를 점유하는 것을 방지할 수 있다.

#### hostPort 사용하기

파드를 `hostPort` 에 바인딩 할 때 파드를 스케줄링 할 수 있는
위치는 제한되어 있다. 대부분의 경우 `hostPort` 는 불필요하다. 서비스 오브젝트를
사용하여 파드를 노출하도록 한다. `hostPort` 가 필요한 경우
컨테이너 클러스터에 있는 노드의 수만큼 파드를 스케줄 할 수 있다.

### 파드가 waiting 상태로 유지

파드가 `Waiting` 상태에서 멈춘 경우, 워커 노드에 스케줄 되었지만, 해당 장비에서 사용할 수 없다.
거듭 강조하지만, `kubectl describe ...` 의 정보는 유익하게 사용되어야 한다.
`Waiting` 파드의 가장 일반적인 원인은 이미지를 가져오지 못하는 경우이다.
확인해야 할 3가지 사항이 있다.

* 이미지 이름이 올바른지 확인한다.
* 이미지를 저장소에 푸시하였는가?
* 이미지가 풀 될 수 있는지 보기 위해, 사용자의 장비에서 `docker pull <image>` 를 수동으로
  실행한다.

### 파드가 손상(crashing)되었거나 양호하지 않을(unhealthy) 경우

일단 사용자의 파드가 스케줄 되면, [구동중인 파드 디버그하기](/docs/tasks/debug-application-cluster/debug-running-pod/)에
기술된 메서드를 디버깅에 사용할 수 있다.


## 레플리케이션컨트롤러 디버깅

레플리케이션컨트롤러는 매우 간단하다. 이 오브젝트는 파드를 만들거나
만들 수 없는 경우뿐이다. 만약 파드를 만들 수 없는 경우,
[위의 지침](#파드-디버깅)을 참조하여 파드를 디버그한다.

사용자는 `kubectl describe rc ${CONTROLLER_NAME}` 을 사용하여 레플리케이션 컨트롤러와
관련된 이벤트를 검사할 수도 있다.
