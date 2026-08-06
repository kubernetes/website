---
title: 컨테이너 런타임 인터페이스 (CRI)
content_type: concept
weight: 60
---

<!-- overview -->

컨테이너 런타임 인터페이스(CRI)는 클러스터 컴포넌트를 다시 컴파일하지 않고도 kubelet이 다양한
컨테이너 런타임을 사용할 수 있게 하는 플러그인 인터페이스다.

클러스터의 각 노드에는 동작 중인
{{< glossary_tooltip text="컨테이너 런타임" term_id="container-runtime" >}}이
필요하다. 그래야
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}이
{{< glossary_tooltip text="파드" term_id="pod" >}}와 해당 컨테이너를 시작할 수 있다.

{{< glossary_definition prepend="컨테이너 런타임 인터페이스(CRI)는" term_id="cri" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

kubelet은 gRPC를 통해 컨테이너 런타임에 연결할 때 클라이언트 역할을 한다.
런타임 및 이미지 서비스 엔드포인트는 컨테이너 런타임에서 사용할 수 있어야 하며,
kubelet에서 다음 `--container-runtime-endpoint`
[명령줄 플래그](/docs/reference/command-line-tools-reference/kubelet/)를 사용하여 별도로
구성할 수 있다.

쿠버네티스 v1.26 이상에서 kubelet은 컨테이너 런타임이 `v1` CRI API를
지원해야 한다. 컨테이너 런타임이 `v1` API를 지원하지 않으면
kubelet은 노드를 등록하지 않는다.

## 업그레이드

노드에서 쿠버네티스 버전을 업그레이드하면 kubelet이 재시작된다. 컨테이너
런타임이 `v1` CRI API를 지원하지 않으면 kubelet은 노드를 등록하지 못하고
오류를 보고한다. 컨테이너 런타임 업그레이드로 gRPC 재연결이 필요하다면
연결에 성공하려면 런타임이 `v1` CRI API를 지원해야 한다. 이 경우
컨테이너 런타임을 올바르게 구성한 후 kubelet을 재시작해야 할
수 있다.

## 목록 스트리밍 {#list-streaming}

{{< feature-state feature_gate_name="CRIListStreaming" >}}

표준 CRI 목록 RPC(`ListContainers`, `ListPodSandbox`, `ListImages`)는 모든 결과를
단일 단항(unary) 응답으로 반환한다. 컨테이너 수가 많은 노드에서는
(예: 실행 중이거나 중지된 컨테이너를 모두 포함해 약 10,000개를 초과하는 경우)
이 응답은 gRPC의 기본 메시지 크기 제한인 16 MiB를 초과할 수 있으며, 이로 인해 kubelet이
컨테이너 런타임과 상태를 동기화하는 데 실패할 수 있다.

`CRIListStreaming` 기능 게이트를 활성화하면 kubelet은 서버 측
스트리밍 RPC(예: `StreamContainers`, `StreamPodSandboxes`,
`StreamImages`)를 사용한다. 이 RPC를 사용하면 컨테이너 런타임이 결과를
여러 응답 메시지로 나눠 메시지당 크기 제한을 우회할 수 있다. 이는
다음의 경우 특히 유용하다.

- 컨테이너 생성과 삭제가 빈번한 환경(CI/CD 시스템)
- 대규모 배치 처리 워크로드

컨테이너 런타임이 스트리밍 RPC를 지원하지 않으면 kubelet은
하위 호환성을 위해 표준 단항 RPC로 자동으로
대체한다.

## {{% heading "whatsnext" %}}

- CRI [프로토콜 정의](https://github.com/kubernetes/cri-api/blob/v0.33.1/pkg/apis/runtime/v1/api.proto)에 대해 자세히 알아본다.
