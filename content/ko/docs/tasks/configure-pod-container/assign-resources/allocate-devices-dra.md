---
title: DRA를 사용하여 워크로드에 디바이스 할당하기
content_type: task
min-kubernetes-server-version: v1.34
weight: 20
---
{{< feature-state feature_gate_name="DynamicResourceAllocation" >}}

<!-- overview -->

이 페이지는 _동적 리소스 할당(DRA)_ 을 사용하여
파드에 디바이스를 할당하는 방법을 보여준다. 이 지침은 워크로드
운영자를 대상으로 한다. 이 페이지를 읽기 전에, DRA의 동작 방식과
{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}} 및
{{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}과
같은 DRA 용어를 숙지한다.
자세한 정보는
[동적 리소스 할당(DRA)](/docs/concepts/scheduling-eviction/dynamic-resource-allocation/)을 참고한다.

<!-- body -->

## DRA를 사용한 디바이스 할당에 대하여 {#about-device-allocation-dra}

워크로드 운영자는 ResourceClaim 또는 ResourceClaimTemplate을 생성하여
워크로드에 대한 디바이스를 _요청_ 할 수 있다. 워크로드를 배포하면,
쿠버네티스와 디바이스 드라이버가 사용 가능한 디바이스를 찾아 파드에 할당하고,
해당 디바이스에 접근할 수 있는 노드에 파드를 배치한다.

<!-- prerequisites -->

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

* 클러스터 관리자가 DRA를 설정하고, 디바이스를 연결하며, 드라이버를 설치했는지
  확인한다. 자세한 정보는
  [클러스터에서 DRA 설정하기](/docs/tasks/configure-pod-container/assign-resources/set-up-dra-cluster)를 참고한다.

<!-- steps -->

## 요청할 디바이스 확인하기 {#identify-devices}

클러스터 관리자 또는 디바이스 드라이버가 디바이스 카테고리를 정의하는
_{{< glossary_tooltip term_id="deviceclass" text="DeviceClass" >}}_ 를
생성한다. {{< glossary_tooltip term_id="cel" >}}을 사용하여
특정 디바이스 속성을 필터링함으로써 디바이스를 요청할 수 있다.

클러스터에 있는 DeviceClass 목록을 조회한다.

```shell
kubectl get deviceclasses
```
출력은 다음과 유사하다.

```
NAME                 AGE
driver.example.com   16m
```
권한 오류가 발생하면, DeviceClass를 조회할 수 있는 접근 권한이 없을 수 있다.
사용 가능한 디바이스 속성에 대해서는 클러스터 관리자 또는 드라이버 제공자에게
확인한다.

## 리소스 요청하기 {#claim-resources}

{{< glossary_tooltip text="ResourceClaim" term_id="resourceclaim" >}}을 사용하여
DeviceClass에서 리소스를 요청할 수 있다.
ResourceClaim을 생성하려면, 다음 중 하나를 수행한다.

* 여러 파드가 동일한 디바이스에 대한 접근을 공유하도록 하거나,
  파드의 수명을 넘어 클레임이 존재하도록 하려면
  ResourceClaim을 수동으로 생성한다.
* 쿠버네티스가 파드별 ResourceClaim을 생성하고 관리하도록 하려면
  {{< glossary_tooltip text="ResourceClaimTemplate" term_id="resourceclaimtemplate" >}}을
  사용한다. 모든 파드가 유사한 구성의 별도 디바이스에
  접근하도록 하려면 ResourceClaimTemplate을 생성한다. 예를 들어,
  [병렬 실행](/docs/concepts/workloads/controllers/job/#parallel-jobs)을
  사용하는 잡(Job)에서 파드에 대한 동시 디바이스
  접근이 필요할 수 있다.

파드에서 특정 ResourceClaim을 직접 참조하는 경우, 해당 ResourceClaim이
클러스터에 이미 존재해야 한다. 참조된 ResourceClaim이 존재하지 않으면,
ResourceClaim이 생성될 때까지 파드는 보류(pending) 상태로 유지된다.
파드에서 자동 생성된 ResourceClaim을 참조할 수 있지만,
자동 생성된 ResourceClaim은 생성을 트리거한 파드의
수명에 바인딩되므로 권장되지 않는다.

리소스를 요청하는 워크로드를 생성하려면, 다음 옵션 중 하나를 선택한다.

{{< tabs name="claim-resources" >}}
{{% tab name="ResourceClaimTemplate" %}}

다음 예시 매니페스트를 확인한다.

{{% code_sample file="dra/resourceclaimtemplate.yaml" %}}

이 매니페스트는 `example-device-class` DeviceClass에서 다음 두 파라미터에
모두 일치하는 디바이스를 요청하는 ResourceClaimTemplate을 생성한다.

  * `driver.example.com/type` 속성의 값이
    `gpu`인 디바이스.
  * 용량이 `64Gi`인 디바이스.

ResourceClaimTemplate을 생성하려면, 다음 명령을 실행한다.

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
```

{{% /tab %}}
{{% tab name="ResourceClaim" %}}

다음 예시 매니페스트를 확인한다.

{{% code_sample file="dra/resourceclaim.yaml" %}}

이 매니페스트는 `example-device-class` DeviceClass에서 다음 두 파라미터에
모두 일치하는 디바이스를 요청하는 ResourceClaim을 생성한다.

  * `driver.example.com/type` 속성의 값이
    `gpu`인 디바이스.
  * 용량이 `64Gi`인 디바이스.

ResourceClaim을 생성하려면, 다음 명령을 실행한다.

```shell
kubectl apply -f https://k8s.io/examples/dra/resourceclaim.yaml
```

{{% /tab %}}
{{< /tabs >}}

## DRA를 사용하여 워크로드에서 디바이스 요청하기 {#request-devices-workloads}

디바이스 할당을 요청하려면, 파드 스펙의 `resourceClaims` 필드에
ResourceClaim 또는 ResourceClaimTemplate을 지정한다. 그런 다음, 해당 파드의
컨테이너에서 `resources.claims` 필드에 특정 클레임을 이름으로 요청한다.
`resourceClaims` 필드에 여러 항목을 지정하고 서로 다른 컨테이너에서
특정 클레임을 사용할 수 있다.

1. 다음 예시 잡을 확인한다.

   {{% code_sample file="dra/dra-example-job.yaml" %}}

   이 잡의 각 파드는 다음 속성을 가진다.

   * `separate-gpu-claim`이라는 ResourceClaimTemplate과
     `shared-gpu-claim`이라는 ResourceClaim을 컨테이너에서 사용할 수 있도록 한다.
   * 다음 컨테이너를 실행한다.
       * `container0`은 `separate-gpu-claim`
         ResourceClaimTemplate의 디바이스를 요청한다.
       * `container1`과 `container2`는 `shared-gpu-claim`
         ResourceClaim의 디바이스에 대한 접근을 공유한다.

1. 잡을 생성한다.

   ```shell
   kubectl apply -f https://k8s.io/examples/dra/dra-example-job.yaml
   ```

다음 문제 해결 단계를 시도한다.

1. 워크로드가 예상대로 시작되지 않으면, 잡에서
   파드로, 파드에서 ResourceClaim으로 단계적으로 확인하여
   각 레벨에서 `kubectl describe`로 오브젝트를 확인한다. 워크로드가
   시작되지 않는 이유를 설명할 수 있는 상태 필드나
   이벤트가 있는지 확인한다.
1. 파드 생성 시 `must specify one of: resourceClaimName,
   resourceClaimTemplateName` 오류가 발생하면, `pod.spec.resourceClaims`의
   모든 항목에 해당 필드 중 정확히 하나가 설정되어 있는지 확인한다.
   설정되어 있다면, 쿠버네티스 1.32 미만의 API를 기반으로 빌드된
   변형(mutating) 파드 웹훅이 클러스터에 설치되어 있을 수 있다.
   클러스터 관리자에게 확인한다.

## 정리 {#clean-up}

이 작업에서 생성한 쿠버네티스 오브젝트를 삭제하려면, 다음 단계를
수행한다.

1.  예시 잡을 삭제한다.

    ```shell
    kubectl delete -f https://k8s.io/examples/dra/dra-example-job.yaml
    ```

1.  리소스 클레임을 삭제하려면, 다음 명령 중 하나를 실행한다.

    * ResourceClaimTemplate을 삭제한다.

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaimtemplate.yaml
      ```
    * ResourceClaim을 삭제한다.

      ```shell
      kubectl delete -f https://k8s.io/examples/dra/resourceclaim.yaml
      ```

## {{% heading "whatsnext" %}}

* [DRA에 대해 더 알아보기](/docs/concepts/scheduling-eviction/dynamic-resource-allocation)
