---
# reviewers:
# - erictune
title: 파드
api_metadata:
- apiVersion: "v1"
  kind: "Pod"
content_type: concept
weight: 10
no_list: true
---

<!-- overview -->

_파드(Pod)_ 는 쿠버네티스에서 생성하고 관리할 수 있는 배포 가능한 가장 작은 컴퓨팅 단위이다.

_파드_ (고래 떼나 완두콩 꼬투리처럼)는 하나 이상의
{{< glossary_tooltip text="컨테이너" term_id="container" >}}의 그룹이다. 이 그룹은 스토리지 및 네트워크를 공유하고, 해당 컨테이너를 구동하는 방식에 대한 명세를 갖는다. 파드의 콘텐츠는 항상 함께 배치되고,
함께 스케줄되며, 공유 컨텍스트에서 실행된다. 파드는
애플리케이션 별 "논리 호스트"를 모델링한다. 여기에는 상대적으로 밀접하게 결합된 하나 이상의
애플리케이션 컨테이너가 포함된다.
클라우드가 아닌 컨텍스트에서, 동일한 물리 또는 가상 머신에서 실행되는 애플리케이션은 동일한 논리 호스트에서 실행되는 클라우드 애플리케이션과 비슷하다.

애플리케이션 컨테이너와 마찬가지로, 파드에는
파드 시작 중에 실행되는 {{< glossary_tooltip text="초기화 컨테이너" term_id="init-container" >}}가
포함될 수 있다. 디버깅을 위해 실행중인 파드에
{{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}를
삽입할 수도 있다.

<!-- body -->

## 파드란 무엇인가?

{{< note >}}
클러스터의 각 노드에 [컨테이너 런타임](/ko/docs/setup/production-environment/container-runtimes/)을 
설치해야 노드에서 파드가 실행될 수 있다.
{{< /note >}}

파드의 공유 컨텍스트는 리눅스 네임스페이스, 컨트롤 그룹(cgroups) 및
{{< glossary_tooltip text="컨테이너" term_id="container" >}}를 격리하는 것과 같이 잠재적으로 다른 격리 요소들이다.
파드의 컨텍스트 내에서 개별 애플리케이션은 추가적으로 하위 격리가 적용된다.

파드는 공유 네임스페이스와 공유 파일시스템 볼륨이 있는 컨테이너들의 집합과 비슷하다.

쿠버네티스 클러스터의 파드는 크게 두 가지 방식으로 사용된다.

* **단일 컨테이너에서 실행되는 파드**: "파드 당 컨테이너 1개(one-container-per-Pod)” 모델은 
  쿠버네티스에서 가장 흔한 사용 사례이다. 이 경우 파드는 단일 컨테이너를 감싸는 
  래퍼(wrapper)처럼 볼 수 있으며, 쿠버네티스는 컨테이너 자체가 아니라 
  파드를 관리한다.
* **함께 동작해야 하는 여러 컨테이너를 실행하는 파드**: 파드는 서로 긴밀하게 
  결합되어 자원을 공유해야 하는 [여러 개의 컨테이너](#how-pods-manage-multiple-containers)로 
  구성된 애플리케이션을 
  캡슐화할 수 있다. 이렇게 함께 배치되고 공동 관리되는 
  컨테이너들은 하나의 응집력 있는 단위를 이룬다.

  여러 개의 컨테이너를 하나의 파드 안에 두고 관리하여 그룹화하는 것은 상대적으로 
  고급 사용 사례이다. 컨테이너들이 긴밀히 결합되어 있는 특정한 상황에서만 이 
  패턴을 사용하는 것을 권장한다.

  (복원성 또는 용량으로 인해) 복제를 제공하는 여러 컨테이너를 실행할 필요는 없다. 
  여러 복제가 필요하다면, 
  [워크로드 관리](/ko/docs/concepts/workloads/controllers/)를 참고한다.
  
## 파드의 사용

다음은 `nginx:1.14.2` 이미지를 실행하는 컨테이너로 구성되는 파드의 예시이다.

{{% code_sample file="pods/simple-pod.yaml" %}}

위에서 설명한 파드를 생성하려면, 다음 명령을 실행한다.
```shell
kubectl apply -f https://k8s.io/examples/pods/simple-pod.yaml
```

일반적으로 파드는 직접 생성하지는 않으며, 대신 워크로드 리소스를 사용하여 생성한다.
[파드 작업](#파드-작업) 섹션에서 파드와 워크로드 리소스의 관계에 대한 
더 많은 정보를 확인한다.

### 파드를 관리하기 위한 워크로드 리소스

일반적으로 싱글톤(singleton) 파드를 포함하여 파드를 직접 만들 필요가 없다. 대신, {{< glossary_tooltip text="디플로이먼트(Deployment)"
term_id="deployment" >}} 또는 {{< glossary_tooltip text="잡(Job)" term_id="job" >}}과 같은 워크로드 리소스를 사용하여 생성한다.
파드가 상태를 추적해야 한다면,
{{< glossary_tooltip text="스테이트풀셋(StatefulSet)" term_id="statefulset" >}} 리소스를 고려하자.


각 파드는 특정 애플리케이션의 단일 인스턴스를 실행하기 위한 것이다. 더 많은
인스턴스를 실행하여 더 많은 전체 리소스를 제공하기 위해 애플리케이션을
수평적으로 확장하려면, 각 인스턴스에 하나씩, 여러 파드를 사용해야 한다.
쿠버네티스에서는 이를 일반적으로 _레플리케이션_ 이라고 한다.
복제된 파드는 일반적으로 워크로드 리소스와
해당 {{< glossary_tooltip text="컨트롤러" term_id="controller" >}}에 의해 그룹으로 생성되고 관리된다.

쿠버네티스가 워크로드 리소스와 해당 컨트롤러를 사용하여 애플리케이션 스케일링과
자동 복구를 구현하는 방법에 대한 자세한 내용은
[파드와 컨트롤러](#파드와-컨트롤러)를 참고한다.

파드는 기본적으로 파드에 속한 컨테이너에 [네트워킹](#파드-네트워킹)과 [스토리지](#pod-storage)라는
두 가지 종류의 공유 리소스를 제공한다.


## 파드 작업

사용자가 쿠버네티스에서 직접 개별 파드를 만드는 경우는 거의 없다. 싱글톤 파드도 마찬가지이다. 이는
파드가 상대적으로 일시적인, 일회용 엔티티로 설계되었기 때문이다. 파드가
생성될 때(사용자가 직접 또는
{{< glossary_tooltip text="컨트롤러" term_id="controller" >}}가 간접적으로), 새 파드는
클러스터의 {{< glossary_tooltip text="노드" term_id="node" >}}에서 실행되도록 스케줄된다.
파드는 파드 실행이 완료되거나, 파드 오브젝트가 삭제되거나,
리소스 부족으로 인해 파드가 *축출* 되거나, 노드가 실패할 때까지 해당 노드에 남아있다.

{{< note >}}
파드에서 컨테이너를 다시 시작하는 것과 파드를 다시 시작하는 것을 혼동해서는 안된다. 파드는
프로세스가 아니라, 하나 이상의 컨테이너를 실행하기 위한 환경이다. 파드는
삭제될 때까지 유지된다.
{{< /note >}}

파드의 이름은 반드시 유효한 
[DNS 서브도메인 이름](/ko/docs/concepts/overview/working-with-objects/names/#dns-서브도메인-이름)을 가져야한다. 
그렇지 않으면, 파드 호스트네임에 예상지 못한 결과가 생길 수도 있다. 최고의 호환성을 위해,
이름은 [DNS 레이블](/ko/docs/concepts/overview/working-with-objects/names#dns-label-names)의 
더욱 제한적인 조건을 따라야한다.

### 파드 OS

{{< feature-state state="stable" for_k8s_version="v1.25" >}}

`.spec.os.name` 필드는 파드를 실행하고자 하는 운영체제를 나타내기 위해 `windows` 또는 
`linux`로 설정해야 한다. 현재 쿠버네티스에서 지원되는 운영체제는 
이 두가지이다. 향후 이 목록이 확장될 수 있다.

쿠버네티스 v{{< skew currentVersion >}}에서, `.spec.os.name` 값은
{{< glossary_tooltip text="kube-scheduler" term_id="kube-scheduler" >}}가 파드를 
어떤 노드에 스케줄링하는지에 결정하는 것에 영향을 주지 않는다. 
서로 다른 운영체제를 실행하는 노드가 있는 클러스터라면, 
[kubernetes.io/os](/ko/docs/reference/labels-annotations-taints/#kubernetes-io-os)레이블을 
각 노드에 올바르게 지정해야 하고, 운영체제 레이블을 기반으로 파드의 `nodeSelector`를 
정의해야 한다. kube-scheduler는 다른 기준을 바탕으로 파드를 노드에 할당하는데, 
파드 내의 컨테이너에 맞는 OS를 갖는 적절한 노드를 선택하는 데 성공할 수도 있고 실패할 수도 있다.
[파드 시큐리티 스탠다드](/ko/docs/concepts/security/pod-security-standards/) 또한 이 
필드를 사용하여 해당 운영체제와 관련이 없는 정책이 적용되지 않도록 한다.

### 파드와 컨트롤러

워크로드 리소스를 사용하여 여러 파드를 만들고 관리할 수 있다. 리소스에 대한 컨트롤러는
파드 장애 시 복제 및 롤아웃과 자동 복구를
처리한다. 예를 들어, 노드가 실패하면, 컨트롤러는 해당 노드의 파드가 작동을 중지했음을
인식하고 대체 파드를 생성한다. 스케줄러는
대체 파드를 정상 노드에 배치한다.

다음은 하나 이상의 파드를 관리하는 워크로드 리소스의 몇 가지 예시이다.

* {{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}
* {{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}}
* {{< glossary_tooltip text="데몬셋(DaemonSet)" term_id="daemonset" >}}

### 파드 템플릿

{{< glossary_tooltip text="워크로드" term_id="workload" >}} 리소스에 대한 컨트롤러는
_파드 템플릿_ 에서 파드를 생성하고 사용자 대신 해당 파드를 관리한다.

파드템플릿(PodTemplate)은 파드를 생성하기 위한 명세이며,
[디플로이먼트](/ko/docs/concepts/workloads/controllers/deployment/),
[잡](/ko/docs/concepts/workloads/controllers/job/) 및
[데몬셋](/ko/docs/concepts/workloads/controllers/daemonset/)과 같은 워크로드 리소스에 포함된다.

워크로드 리소스의 각 컨트롤러는 워크로드 오브젝트 내부의 `PodTemplate` 을
사용하여 실제 파드를 생성한다. `PodTemplate` 은 앱을 실행하는 데 사용되는 워크로드 리소스가
무엇이든지 원하는 상태의 일부이다.

파드를 생성할 때, 파드 내에서 실행되는 컨테이너를 위해 파드 템플릿에서
[환경 변수](/ko/docs/tasks/inject-data-application/define-environment-variable-container/)를 
선택할 수 있다.

아래 샘플은 하나의 컨테이너를 시작하는 `template` 이 있는 간단한 잡의
매니페스트이다. 해당 파드의 컨테이너는 메시지를 출력한 다음 일시 중지한다.

```yaml
apiVersion: batch/v1
kind: Job
metadata:
  name: hello
spec:
  template:
    # 여기서부터 파드 템플릿이다
    spec:
      containers:
      - name: hello
        image: busybox:1.28
        command: ['sh', '-c', 'echo "Hello, Kubernetes!" && sleep 3600']
      restartPolicy: OnFailure
    # 여기까지 파드 템플릿이다
```

파드 템플릿을 수정하거나 새로운 파드 템플릿으로 바꿔도 이미 존재하는
파드에는 직접적인 영향을 주지 않는다. 워크로드 리소스의 파드 템플릿을
변경하는 경우, 해당 리소스는 수정된 템플릿을 사용하는 대체 파드를 생성해야 한다.

예를 들어, 스테이트풀셋 컨트롤러는 실행 중인 파드가 각 스테이트풀셋 오브젝트에 대한 현재
파드 템플릿과 일치하는지 확인한다. 스테이트풀셋을 수정하여 파드 템플릿을
변경하면, 스테이트풀셋이 업데이트된 템플릿을 기반으로 새로운 파드를 생성하기 시작한다.
결국, 모든 이전의 파드가 새로운 파드로 교체되고, 업데이트가 완료된다.

각 워크로드 리소스는 파드 템플릿의 변경 사항을 처리하기 위한 자체 규칙을 구현한다.
스테이트풀셋에 대해 자세히 알아 보려면,
스테이트풀셋 기본 튜토리얼에서 [업데이트 전략](/ko/docs/tutorials/stateful-application/basic-stateful-set/#스테이트풀셋-업데이트하기)을 읽어본다.

노드에서 {{< glossary_tooltip term_id="kubelet" text="kubelet" >}}은
파드 템플릿과 업데이트에 대한 상세 정보를 직접 관찰하거나 관리하지 않는다. 이러한
상세 내용은 추상화된다. 이러한 추상화와 관심사 분리(separation of concerns)는
시스템 시맨틱을 단순화하고, 기존 코드를 변경하지 않고도 클러스터의 동작을
확장할 수 있게 한다.

## 파드 갱신 및 교체

이전 섹션에서 언급한 바와 같이, 워크로드 리소스의 파드
템플릿이 바뀌면, 컨트롤러는 기존의 파드를 갱신하거나 패치하는 대신
갱신된 템플릿을 기반으로 신규 파드를 생성한다.

쿠버네티스는 사용자가 파드를 직접 관리하는 것을 막지는 않는다.
동작 중인 파드의 필드를 갱신하는 것도 가능하다.
그러나,
[`patch`](/ko/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#patch-pod-v1-core) 및
[`replace`](/ko/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#replace-pod-v1-core)와 같은
파드 갱신 작업에는 다음과 같은 제약이 있다.

- 파드에 대한 대부분의 메타데이터는 불변(immutable)이다. 예를 들면, 사용자는
  `namespace`, `name`, `uid`, 또는 `creationTimestamp` 필드를 변경할 수 없다.

- `metadata.deletionTimestamp` 가 설정된 경우,
  `metadata.finalizers` 리스트에 새로운 항목이 추가될 수 없다.
- 파드 갱신은 `spec.containers[*].image`, 
  `spec.initContainers[*].image`, `spec.activeDeadlineSeconds`, `spec.terminationGracePeriodSeconds`,
  `spec.tolerations`, 또는 `spec.schedulingGates` 이외의 필드는 변경할 수 없다. `spec.tolerations` 에 대해서만 새로운 항목을 추가할 수 있다.
- `spec.activeDeadlineSeconds` 필드를 추가할 때는, 다음의 두 가지 형태의 갱신만
  허용한다.

  1. 지정되지 않은 필드를 양수로 설정;
  1. 필드의 양수를 음수가 아닌 더 작은 숫자로
     갱신.

### 파드 서브리소스(Pod subresources)

앞서 설명한 업데이트 규칙은 일반적인 파드 업데이트에 적용되지만, _서브리소스_를 통해 업데이트할 수 있는 다른 파드 필드도 있다.

- **리사이즈(Resize):** `resize` 서브리소스를 사용하면 컨테이너 리소스(`spec.containers[*].resources`)를 업데이트할 수 있다.
  자세한 내용은 [컨테이너 리소스 리사이즈](#resize-container-resources)를 참고한다.
- **임시 컨테이너(Ephemeral Containers):** `ephemeralContainers` 서브리소스를 사용하면
  {{< glossary_tooltip text="임시 컨테이너" term_id="ephemeral-container" >}}를 
  파드에 추가할 수 있다.
  자세한 내용은 [임시 컨테이너](/ko/docs/concepts/workloads/pods/ephemeral-containers/)를 참고한다.
- **상태(Status):** `status` 서브리소스를 사용하면 파드 상태를 업데이트할 수 있다.
  이 서브리소스는 일반적으로 Kubelet과 다른 시스템 컨트롤러에서만 사용한다.
- **바인딩(Binding):** `binding` 서브리소스를 사용하면 `Binding` 요청을 통해 파드의 `spec.nodeName`을 설정할 수 있다.
  이 서브리소스는 일반적으로 {{< glossary_tooltip text="스케줄러" term_id="kube-scheduler" >}}에서만 사용한다.

### 파드 세대(Pod generation)

- `metadata.generation` 필드는 고유하다. 시스템에서 자동으로 설정되며, 
  새 파드의 `metadata.generation` 값은 1이 된다. 파드 스펙의 변경 가능한 필드가 
  업데이트될 때마다 `metadata.generation` 값이 1씩 증가한다.

{{< feature-state feature_gate_name="PodObservedGenerationTracking" >}}

- `observedGeneration`은 파드 객체의 `status` 섹션에 기록되는 필드이다.
  `PodObservedGenerationTracking` 기능 게이트가 설정되어 있으면, 
  Kubelet이 파드 상태를 현재 파드 상태와 동기화하기 위해 `status.observedGeneration`을 설정한다. 파드의 `status.observedGeneration`은 
  상태가 보고되는 시점의 `metadata.generation`을 반영한다.

{{< note >}}
`status.observedGeneration` 필드는 kubelet에서 관리하며 외부 컨트롤러는 이 필드를 수정하지 **않아야** 한다.
{{< /note >}}

상태 필드는 현재 동기 루프(sync loop)의 `metadata.generation`과 연결될 수도 
있고, 이전 동기 루프의 `metadata.generation`과 연결될 수도 있다. 핵심 차이는 
`spec`의 변경이 `status`에 직접 반영되는지, 아니면 실행 중인 프로세스의 간접적인 결과인지에 있다.

#### 직접적인 상태 업데이트(Direct Status Updates)

할당된 스펙이 직접적으로 반영되는 상태 필드의 경우,  
`observedGeneration`은 현재 `metadata.generation`(Generation N)과 연결된다.

이 동작은 다음과 같은 경우에 적용한다.

- **리사이즈 상태(Resize Status)**: 리소스 리사이즈 작업의 상태이다.
- **할당된 리소스(Allocated Resources)**: 리사이즈 이후 파드에 할당된 리소스이다.
- **임시 컨테이너(Ephemeral Containers)**: 새 임시 컨테이너가 추가되어 `Waiting` 상태일 때이다.

#### 간접적인 상태 업데이트(Indirect Status Updates)

실행 중인 스펙의 결과로 간접적으로 반영되는 상태 필드의 경우,  
`observedGeneration`은 이전 동기 루프의 `metadata.generation`(Generation N-1)과 연결된다.

이 동작은 다음과 같은 경우에 적용한다.

- **컨테이너 이미지**: `ContainerStatus.ImageID`는 새 이미지가 풀(pull)
  되고 컨테이너가 업데이트되기 전까지 이전 세대의 이미지를 반영한다.
- **실제 리소스**: 리사이즈가 진행 중일 때, 실제 사용 중인 리소스는 이전 세대의 
  요청에 해당한다.
- **컨테이너 상태**: 리사이즈가 진행 중이고 재시작 정책이 필요한 경우, 이전 세대의  
  요청을 반영한다.
- **activeDeadlineSeconds** & **terminationGracePeriodSeconds** &**deletionTimestamp**: 이 필드들이 파드 상태에 미치는 효과는 
  이전에 관찰된 스펙의 결과이다.

## 리소스 공유와 통신

파드는 파드에 속한 컨테이너 간의 데이터 공유와 통신을
지원한다.

### 파드 스토리지 {#pod-storage}

파드는 공유 스토리지 {{< glossary_tooltip text="볼륨" term_id="volume" >}}의
집합을 지정할 수 있다. 파드의 모든 컨테이너는
공유 볼륨에 접근할 수 있으므로, 해당 컨테이너가 데이터를 공유할 수
있다. 또한 볼륨은 내부 컨테이너 중 하나를 다시
시작해야 하는 경우 파드의 영구 데이터를 유지하도록 허용한다.
쿠버네티스가 공유 스토리지를 구현하고 파드에서 사용할 수 있도록 하는 방법에 대한
자세한 내용은 [스토리지](/ko/docs/concepts/storage/)를 참고한다.

### 파드 네트워킹

각 파드에는 각 주소 패밀리에 대해 고유한 IP 주소가 할당된다. 
파드의 모든 컨테이너는 네트워크 네임스페이스를 공유하며, 
여기에는 IP 주소와 네트워크 포트가 포함된다. 
파드 내부(이 경우에 **만** 해당)에서, 파드에 속한 컨테이너는 
`localhost` 를 사용하여 서로 통신할 수 있다. 
파드의 컨테이너가 *파드 외부의* 엔티티와 통신할 때, 
공유 네트워크 리소스(포트와 같은)를 사용하는 방법을 조정해야 한다. 
파드 내에서 컨테이너는 IP 주소와 포트 공간을 공유하며, 
`localhost` 를 통해 서로를 찾을 수 있다. 
파드의 컨테이너는 SystemV 세마포어 또는 POSIX 공유 메모리와 같은 
표준 프로세스 간 통신을 사용하여 서로 통신할 수도 있다. 
다른 파드의 컨테이너는 고유한 IP 주소를 가지며 특별한 구성 없이 OS 수준의 IPC로 통신할 수 없다. 
다른 파드에서 실행되는 컨테이너와 상호 작용하려는 컨테이너는 IP 네트워킹을 사용하여 통신할 수 있다.

파드 내의 컨테이너는 시스템 호스트명이 파드에 대해 구성된
`name` 과 동일한 것으로 간주한다. [네트워킹](/ko/docs/concepts/cluster-administration/networking/) 섹션에 이에 대한
자세한 내용이 있다.

## 파드 보안 설정 {#pod-security}

파드와 컨테이너에 보안 제약을 설정하려면 파드 명세의 
`securityContext` 필드를 사용한다. 이 필드를 사용하면 
파드나 개별 컨테이너가 할 수 있는 작업을 세밀하게 제어할 수 있다. 예를 들어,

* 특정 리눅스 capabilities를 제거하여 CVE의 영향을 피한다.  
* 파드의 모든 프로세스를 루트가 아닌 사용자 또는 특정 사용자나 그룹 ID로 
  실행하도록 강제한다.  
* 특정 seccomp 프로파일을 설정한다.  
* 윈도우 보안 옵션을 설정한다. 예를 들어, 컨테이너를 HostProcess로 실행할지 여부를 지정한다.  

{{< caution >}}
파드의 securityContext를 사용해 리눅스 컨테이너에서  
[_특권(privileged) 모드_](/ko/docs/concepts/security/linux-kernel-security-constraints/#privileged-containers)를 
활성화할 수도 있다. 특권 모드는 securityContext의 다른 많은 보안 설정을 
무시한다. 이 설정은 securityContext의 다른 필드로 동등한 권한을 부여할 
수 없을 때를 제외하고는 사용하지 않는 것이 좋다.  
쿠버네티스 1.26 이상에서는 파드 명세의 securityContext에서 
`windowsOptions.hostProcess` 플래그를 설정하여  
윈도우 컨테이너를 유사한 특권 모드로 실행할 수 있다. 자세한 내용과 사용 방법은 
[윈도우 호스트 프로세스 파드 생성](/ko/docs/tasks/configure-pod-container/create-hostprocess-pod/)을 참고한다.
{{< /caution >}}

* 사용 가능한 커널 수준 보안 제약에 대해 알아보려면,  
  [파드와 컨테이너를 위한 리눅스 커널 보안 제약](/ko/docs/concepts/security/linux-kernel-security-constraints)을 참고한다.
* 파드 보안 컨텍스트에 대해 더 알아보려면,  
  [파드 또는 컨테이너 보안 컨텍스트 구성하기](/ko/docs/tasks/configure-pod-container/security-context/)를 참고한다.

## 정적 파드

_정적 파드_ 는 {{< glossary_tooltip text="API 서버" term_id="kube-apiserver" >}}가
관찰하는 대신 특정 노드의 kubelet 데몬에 의해 직접
관리된다.
대부분의 파드는 컨트롤 플레인(예를 들어,
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}})에 의해 관리되고, 정적 파드의
경우, kubelet이 각 정적 파드를 직접 감독한다(실패하면 다시 시작한다).

정적 파드는 항상 특정 노드의 {{< glossary_tooltip term_id="kubelet" >}} 하나에 바인딩된다.
정적 파드의 주요 용도는 자체 호스팅 컨트롤 플레인을 실행하는 것이다. 즉,
kubelet을 사용하여 개별 [컨트롤 플레인 컴포넌트](/ko/docs/concepts/overview/components/#컨트롤-플레인-컴포넌트)를 감독한다.

kubelet은 자동으로 각 정적 파드에 대한 쿠버네티스 API 서버에서 {{< glossary_tooltip text="미러 파드" term_id="mirror-pod" >}}를
생성하려고 한다.
즉, 노드에서 실행되는 파드는 API 서버에서 보이지만,
여기에서 제어할 수는 없다는 의미이다. 자세한 내용은 [스태틱(static) 파드 생성](/ko/docs/tasks/configure-pod-container/static-pod)을 
참고한다.

{{< note >}}
스태틱 파드의 `스펙(spec)`은 다른 API 오브젝트
(예를 들면, {{< glossary_tooltip text="서비스어카운트" term_id="service-account" >}},
{{< glossary_tooltip text="컨피그맵" term_id="configmap" >}},
{{< glossary_tooltip text="시크릿" term_id="secret" >}}, 등)가 참조할 수 없다.
{{< /note >}}

## 여러 컨테이너를 가진 파드 {#how-pods-manage-multiple-containers}

상호 협력하는 여러 프로세스(컨테이너 형태)를 지원하도록 설계되어 있으며, 
하나의 응집력 있는 서비스 단위를 형성한다. 파드의 컨테이너는 클러스터 
내 동일한 물리적 또는 가상 머신에 자동으로 함께 배치되고, 함께 스케줄링된다. 
컨테이너는 리소스와 종속성을 공유할 수 있고, 서로 통신할 수 있으며, 
종료 시점과 방식을 조율할 수 있다.

<!-- 본문 앞부분의 텍스트를 의도적으로 반복하되, 더 자세히 설명한다 -->
쿠버네티스 클러스터에서 파드는 다음 두 가지 주요 방식으로 사용한다.

* **단일 컨테이너를 실행하는 파드**: "파드 당 컨테이너 1개(one-container-per-Pod)" 모델은 
  가장 일반적인 쿠버네티스 사용 사례이다. 이 경우 파드는 단일 컨테이너를 감싸는 
  래퍼로 볼 수 있으며, 쿠버네티스는 컨테이너 자체가 아니라 
  파드를 관리한다.
* **여러 컨테이너가 함께 동작해야 하는 파드**: 파드는 
  밀접하게 연결되고 리소스를 공유해야 하는 여러 개의 
  컨테이너로 구성된 애플리케이션을 
  캡슐화할 수 있다. 이러한 컨테이너들은 하나의 응집력 
  있는 서비스 단위를 형성한다. 예를 들어, 하나의 컨테이너가 
  공유 볼륨에 저장된 데이터를 외부로 제공하고, 다른 
  {{< glossary_tooltip text="사이드카 컨테이너" term_id="sidecar-container" >}}가 
  해당 파일을 갱신하거나 업데이트하는 방식이다. 
  파드는 이러한 컨테이너, 스토리지 리소스, 임시 네트워크 
  식별자를 하나의 단위로 묶는다.

예를 들어, 웹 서버 역할의 한 컨테이너가 
공유 볼륨에 있는 파일을 제공하고, 별도의 
[사이드카 컨테이너](/ko/docs/concepts/workloads/pods/sidecar-containers/)가 
원격 소스에서 해당 파일을 업데이트하는 경우가 있다. 이는 다음 다이어그램과 같다.

{{< figure src="/images/docs/pod.svg" alt="Pod creation diagram" class="diagram-medium" >}}

일부 파드에는 {{< glossary_tooltip text="애플리케이션 컨테이너" term_id="app-container" >}}
뿐 아니라 {{< glossary_tooltip text="초기화 컨테이너" term_id="init-container" >}}도 있다.    
기본적으로 초기화 컨테이너는 애플리케이션 컨테이너가 시작되기 전에 실행되고 완료된다.

또한 [사이드카 컨테이너](/ko/docs/concepts/workloads/pods/sidecar-containers/)를 
두어, 메인 애플리케이션 파드에 보조 서비스를 제공할 수도 있다(예: 서비스 메시).

{{< feature-state feature_gate_name="SidecarContainers" >}}

`SidecarContainers` [기능 게이트](/ko/docs/reference/command-line-tools-reference/feature-gates/)는 기본적으로 활성화되어 있다.  
이 기능을 사용하면 초기화 컨테이너에 `restartPolicy: Always`를 지정할 수 있다.  
`Always` 재시작 정책을 설정하면 쿠버네티스가 해당 초기화 컨테이너를 
_사이드카_로 취급하여 파드 전체 수명 동안 계속 실행되도록 한다.
명시적으로 사이드카 컨테이너로 정의된 컨테이너는 
메인 애플리케이션 파드보다 먼저 시작되고, 파드가 종료될 때까지 
계속 실행된다.


## 컨테이너 프로브

_프로브_는 컨테이너의 kubelet에 의해 주기적으로 실행되는 진단이다. 
진단을 수행하기 위하여 kubelet은 다음과 같은 작업을 호출할 수 있다.

- `ExecAction` (컨테이너 런타임의 도움을 받아 수행)
- `TCPSocketAction` (kubelet에 의해 직접 검사)
- `HTTPGetAction` (kubelet에 의해 직접 검사)

[프로브](/ko/docs/concepts/workloads/pods/pod-lifecycle/#컨테이너-프로브-probe)에 대한 자세한 내용은
파드 라이프사이클 문서를 참고한다.

## {{% heading "whatsnext" %}}

* [파드의 라이프사이클](/ko/docs/concepts/workloads/pods/pod-lifecycle/)에 대해 알아본다.
* [런타임클래스(RuntimeClass)](/ko/docs/concepts/containers/runtime-class/)와 이를 사용하여
  다양한 컨테이너 런타임 구성으로 다양한 파드를 설정하는 방법에 대해 알아본다.
* [PodDisruptionBudget](/ko/docs/concepts/workloads/pods/disruptions/)과 이를 
  사용하여 서비스 중단 중에 애플리케이션 가용성을 관리하는 방법에 대해 읽어본다.
* 파드는 쿠버네티스 REST API의 최상위 리소스이다.
  {{< api-reference page="workload-resources/pod-v1" >}}
  오브젝트 정의는 오브젝트를 상세히 설명한다.
* [분산 시스템 툴킷: 컴포지트 컨테이너에 대한 패턴](/blog/2015/06/the-distributed-system-toolkit-patterns/)은 둘 이상의 컨테이너가 있는 파드의 일반적인 레이아웃을 설명한다.
* [파드 토폴로지 분배 제약 조건](/ko/docs/concepts/scheduling-eviction/topology-spread-constraints/)에 대해 읽어본다.

쿠버네티스가 다른 리소스({{< glossary_tooltip text="스테이트풀셋" term_id="statefulset" >}}이나 
{{< glossary_tooltip text="디플로이먼트" term_id="deployment" >}}와 같은)에서 
공통 파드 API를 래핑하는 이유에 대한 컨텍스트를 이해하고자 한다면, 
다음과 같은 선행 기술에 대해 읽어보자.

* [Aurora](https://aurora.apache.org/documentation/latest/reference/configuration/#job-schema)
* [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)
* [Marathon](https://github.com/d2iq-archive/marathon)
* [Omega](https://research.google/pubs/pub41684/)
* [Tupperware](https://engineering.fb.com/data-center-engineering/tupperware/).
