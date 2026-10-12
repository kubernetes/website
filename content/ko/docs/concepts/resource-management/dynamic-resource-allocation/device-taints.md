---
# reviewers:
# - klueska
# - pohly
title: 장치 테인트(taint)와 톨러레이션(toleration)
content_type: concept
weight: 50
api_metadata:
- apiVersion: "resource.k8s.io/v1alpha3"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1beta2"
  kind: "DeviceTaintRule"
- apiVersion: "resource.k8s.io/v1"
  kind: "DeviceTaintRule"
---

<!-- overview -->

이 페이지에서는 드라이버와 관리자가 특정 장치에 파드를 배치하지 않거나, 이미 해당 장치를
사용 중인 파드를 축출할 수 있게 하는 동적 리소스 할당(DRA)의 장치 테인트와 톨러레이션을 설명한다.

<!-- body -->

## 장치 테인트와 톨러레이션 {#device-taints-and-tolerations}

{{< feature-state feature_gate_name="DRADeviceTaints" >}}

장치 테인트는 노드 테인트와 유사하다. 테인트는 문자열 키, 문자열 값, 효과(effect)로 구성된다.
효과는 테인트가 있는 장치를 사용하는 리소스클레임(ResourceClaim)과 해당 리소스클레임을 참조하는 모든 파드에 적용된다.
"NoSchedule" 효과는 해당 파드가 스케줄링되는 것을 방지한다.
테인트가 있는 장치를 사용하면 파드를 스케줄링할 수 없으므로 리소스클레임을 할당할 때 이러한 장치는 무시한다.

"NoExecute" 효과는 "NoSchedule" 효과를 포함하며 이미 스케줄링된 모든 파드를
추가로 축출한다.
이 축출은 `kube-controller-manager`의 장치 테인트 축출 컨트롤러가 영향을 받는 파드를 삭제하는 방식으로 구현된다.

스케줄러와 축출 컨트롤러는 "None" 효과를 무시한다.
DRA 드라이버는 이를 이용해 장치 상태 저하와 같은 예외 상황을
관리자나 다른 컨트롤러에 알릴 수 있다. 관리자는 디바이스테인트룰(DeviceTaintRule)에서
파드 축출을 모의 실행하는 데에도 이 효과를 사용할 수 있다(아래에서 자세히 설명한다).

리소스클레임에 톨러레이션을 설정하여 테인트의 영향을 받지 않도록 할 수 있다. 일치하는 톨러레이션이 있으면 해당 테인트의 효과는 적용되지 않는다.
빈 톨러레이션은 모든 테인트와 일치한다. 톨러레이션을 특정 효과로 제한하거나 특정 키/값 쌍과
일치하도록 설정할 수 있으며 두 조건을 함께 적용할 수도 있다.
톨러레이션은 키의 값과 관계없이 특정 키가 존재하는지 확인하거나,
키가 특정 값을 갖는지 확인할 수 있다.
이러한 매칭에 대한 자세한 내용은
[노드 테인트 개념](/docs/concepts/scheduling-eviction/taint-and-toleration#개요)을 참고한다.

일정 기간 동안 테인트의 영향을 받지 않도록 톨러레이션을 설정하면 축출을 지연할 수 있다.
지연 기간은 장치에 테인트가 추가된 시점부터 시작하며, 이 시점은 테인트의 필드에 기록된다.

위에서 설명한 테인트의 동작은 노드의 "모든" 장치를 할당하는 리소스클레임에도 적용된다.
모든 장치에 테인트가 없거나 각 장치의 모든 테인트와 일치하는 톨러레이션이 있어야 한다.
[관리자 접근](/docs/concepts/resource-management/dynamic-resource-allocation/dra-api/#admin-access) 권한으로 장치를 할당하는 경우에도
예외가 적용되지 않는다. 이 모드를 사용하는 관리자는 테인트가 있는 장치에 접근하려면
모든 테인트에 대응하는 톨러레이션을 명시적으로 설정해야 한다.

디바이스테인트룰 API 종류를 사용하면 다음과 같은 방법으로 장치에 테인트를 추가할 수 있다.

### 드라이버가 설정하는 테인트

DRA 드라이버는 리소스슬라이스(ResourceSlice)에 게시하는 장치 정보에 테인트를 추가할 수 있다.
드라이버가 테인트를 사용하는지와 해당 키와 값이 무엇인지는 DRA 드라이버 문서를 참고한다.

### 관리자가 설정하는 테인트

{{< feature-state feature_gate_name="DRADeviceTaintRules" >}}

관리자나 컨트롤 플레인 컴포넌트는 DRA 드라이버에
리소스슬라이스의 장치 정보에 테인트를 포함하도록 요청하지 않고도 장치에 테인트를 적용할 수 있다.
이를 위해 디바이스테인트룰을 생성한다.
각 디바이스테인트룰은 장치 셀렉터와 일치하는 장치에 테인트 하나를 추가한다.
이러한 셀렉터가 없으면 어떤 장치에도 테인트가 적용되지 않는다.
이는 실수로 셀렉터를 누락했을 때 리소스클레임을 사용하는 모든 파드가 우발적으로 축출되는 것을 방지하는 데 도움이 된다.

디바이스클래스(DeviceClass), 드라이버, 풀 또는 장치의 이름을 지정하거나 이들을 조합하여 장치를 선택할 수 있다.
디바이스클래스는 해당 디바이스클래스의 셀렉터가 선택하는 모든 장치를 선택한다.
관리자는 드라이버 이름만으로 해당 드라이버가 관리하는 모든 장치에 테인트를 적용할 수 있다.
예를 들어 클러스터 전체에서 해당 드라이버를 유지 관리할 때 이 방법을 사용할 수 있다.
드라이버가 노드 로컬 장치를 관리하는 경우 풀 이름을 추가하면 테인트를 단일 노드로 제한할 수 있다.

마지막으로 장치 이름을 추가하면 특정 장치 하나를 선택할 수 있다.
필요한 경우 장치 이름과 풀 이름을 각각 단독으로 사용할 수도 있다.
예를 들어 노드 로컬 장치용 드라이버는 노드 이름을 풀 이름으로 사용하는 것이 권장된다.
이 경우 해당 풀 이름으로 테인트를 적용하면 노드의 모든 장치에 자동으로 테인트가 적용된다.

드라이버는 현재 그 이름에 어떤 장치가 할당되어 있는지 드러내지 않는 "gpu-0" 같은 고정된 이름을 사용할 수 있다.
특정 하드웨어 인스턴스에 테인트를 적용하려면 디바이스테인트룰에서 공통 표현식 언어(Common Expression Language, CEL) 셀렉터를 사용해
벤더별 고유 ID 속성을 매칭할 수 있다. 이는 드라이버가 해당 하드웨어의 고유 ID 속성을 지원하는 경우에 가능하다.

테인트는 디바이스테인트룰이 존재하는 동안 적용된다.
언제든지 수정하거나 제거할 수 있다.
가상의 DRA 드라이버를 위한 디바이스테인트룰의 예시는 다음과 같다.

```yaml
apiVersion: resource.k8s.io/v1
kind: DeviceTaintRule
metadata:
  name: example
spec:
  # The entire hardware installation for this
  # particular driver is broken.
  # Evict all pods and don't schedule new ones.
  deviceSelector:
    driver: dra.example.com
  taint:
    key: dra.example.com/unhealthy
    value: Broken
    effect: NoExecute
```

kube-apiserver는 `spec`의 `timeAdded` 필드를 설정하여
이 테인트의 생성 시점을 자동으로 추적한다. 톨러레이션 기간은 이 타임스탬프부터
시작한다. 효과를 변경하는 업데이트(아래의 모의 축출 흐름 참고)가 수행되면
kube-apiserver는 타임스탬프를 자동으로 갱신한다. 사용자는 디바이스테인트룰을 생성할 때
이 필드를 설정하거나 업데이트할 때 다른 값으로 변경하여
타임스탬프를 명시적으로 제어할 수 있다.

상태에는 축출 컨트롤러가 추가한 컨디션(condition)이 포함된다.

```
kubectl describe devicetaintrules
```

```
Name:         example
...
Spec:
  Device Selector:
    Driver:  dra.example.com
  Taint:
    Effect:      NoExecute
    Key:         dra.example.com/unhealthy
    Time Added:  2025-11-05T18:15:37Z
    Value:       Broken
Status:
  Conditions:
    Last Transition Time:  2025-11-05T18:15:37Z
    Message:               1 pod evicted since starting the controller.
    Observed Generation:   1
    Reason:                Completed
    Status:                False
    Type:                  EvictionInProgress
Events:                    <none>
```

파드는 삭제하는 방식으로 축출된다. 일반적으로 축출은 매우 빠르게 이루어지지만,
테인트의 톨러레이션으로 일정 기간 지연되거나 축출해야 할 파드가 매우 많은 경우에는
시간이 더 걸릴 수 있다. 축출에 시간이 오래 걸리면
메시지에서 현재 상태에 관한 정보를 제공한다.

    2 pods need to be evicted in 2 different namespaces. 1 pod evicted since starting the controller.

현재 축출이 진행 중인지 확인하는 데 이 컨디션을 사용할 수 있다.

    kubectl wait --for=condition=EvictionInProgress=false DeviceTaintRule/example

스케줄러와 컨트롤러가 새 테인트를 서로 다른 시점에 관찰하면서 발생할 수 있는 경쟁 상태(race condition)에
유의해야 한다. 이 경쟁 상태로 인해 컨트롤러가 축출할 파드가 없다고 판단하여
컨디션을 `False`로 설정하는 시점에도 파드가 여전히
스케줄링될 수 있다. 실제로는 의도적으로 몇 초간 지연한 뒤에만
상태를 갱신하므로 이러한 경쟁 상태가 발생할 가능성은
매우 낮다.

`effect: None`인 경우 메시지는 영향을 받는 장치의 수,
그중 할당된 장치의 수와 효과가 `NoExecute`였다면 축출되었을
파드의 수에 관한 정보를 제공한다. 실제 축출을 시작하기 전에
모의 실행하는 데 이 정보를 사용할 수 있다.

- 원하는 셀렉터와 `effect: None`으로 디바이스테인트룰을 생성한다.

- 메시지를 검토한다.

  ```
  3 published devices selected. 1 allocated device selected.
  1 pod would be evicted in 1 namespace if the effect was NoExecute.
  This information will not be updated again. Recreate the DeviceTaintRule to trigger an update.
  ```

  게시된 장치는 리소스슬라이스에 나열된 장치다. 여기에 테인트를 적용하면
  새 파드에 장치가 할당되는 것을 방지한다. 할당된 장치에 테인트를 적용한 경우에만
  이를 사용하는 파드가 축출된다.

- 디바이스테인트룰을 편집하여 효과를 `NoExecute`로 변경한다.
