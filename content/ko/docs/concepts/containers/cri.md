---
title: 컨테이너 런타임 인터페이스 (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

컨테이너 런타임 인터페이스 (CRI)는 클러스터 컴포넌트를 다시 컴파일하지 않아도 Kubelet이 다양한 
컨테이너 런타임을 사용할 수 있도록 하는 플러그인 인터페이스다.

{{< glossary_tooltip text="Kubelet" term_id="Kubelet" >}}이
{{< glossary_tooltip text="파드" term_id="pod" >}}와 컨테이너를 
실행할 수 있도록, 
클러스터의 각 노드에는 동작 중인 
{{<glossary_tooltip text="컨테이너 런타임" term_id="container-runtime">}}이 필요하다.

{{< glossary_definition prepend="컨테이너 런타임 인터페이스(CRI)는" term_id="cri" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet은 gRPC를 통해 컨테이너 런타임과 연결할 때 클라이언트의 역할을 수행한다.
런타임과 이미지 서비스 엔드포인트는 컨테이너 런타임 내에서 사용 가능해야 하며, 
이는 각각 Kubelet 내에서 `--container-runtime-endpoint` 
[커맨드라인 플래그](/docs/reference/command-line-tools-reference/kubelet/)
를 통해 설정할 수 있다.

쿠버네티스 v1.26 및 이후 버전에서, Kubelet은 컨테이너 런타임이 CRI `v1` API를 지원할 것을 요구한다. 
컨테이너 런타임이 `v1` API를 지원하지 않으면, 
Kubelet은 해당 노드를 등록하지 않는다.

## 업그레이드

노드에서 쿠버네티스 버전을 업그레이드하면 Kubelet이 재시작된다. 만약 
컨테이너 런타임이 CRI `v1` API를 지원하지 않는 경우, Kubelet은 등록에 실패하고 
에러를 보고한다. 컨테이너 런타임 업그레이드로 인해 gRPC 재연결이 필요한 경우, 
연결이 성공하려면 런타임이 CRI `v1` API를 지원해야 한다. 
이 경우 컨테이너 런타임이 올바르게 설정된 후 
Kubelet을 재시작해야 할 수 있다.

## 목록 스트리밍 {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

표준 CRI 목록 RPC(`ListContainers`, `ListPodSandbox`, `ListImages`)는 모든 결과를
하나의 단항(unary) 응답으로 반환한다. 많은 수의 컨테이너가 있는 노드에서는
(예를 들어, 실행 중이거나 중지된 컨테이너를 모두 포함해 약 10,000개를 넘는 경우)
이러한 응답의 크기가 gRPC의 기본 메시지 크기 제한인 16 MiB를 초과할 수 있다. 이로 인해
kubelet이 컨테이너 런타임과의 상태 동기화에 실패할 수 있다.

`CRIListStreaming` 기능 게이트를 활성화하면 kubelet은 서버 측
스트리밍 RPC(예: `StreamContainers`, `StreamPodSandboxes`,
`StreamImages`)를 사용한다. 이 RPC를 사용하면 컨테이너 런타임은 결과를
여러 응답 메시지로 나누어 응답 메시지당 크기 제한을 우회할 수 있다. 다음과
같은 경우에 특히 유용하다.

- 컨테이너 생성 및 삭제가 빈번한 환경(CI/CD 시스템)
- 대규모 배치 처리 워크로드

컨테이너 런타임이 스트리밍 RPC를 지원하지 않으면 kubelet은
하위 호환성을 위해 표준 단항 RPC로
자동 전환한다.

## {{% heading "whatsnext" %}}

- CRI [프로토콜 정의](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)에 대해 자세히 알아본다.
