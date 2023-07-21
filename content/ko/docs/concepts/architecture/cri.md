---
title: 컨테이너 런타임 인터페이스(CRI)
content_type: concept
weight: 60
---

<!-- overview -->

컨테이너 런타임 인터페이스(CRI)는 클러스터 컴포넌트를 다시 컴파일하지 않아도 Kubelet이 다양한 
컨테이너 런타임을 사용할 수 있도록 하는 플러그인 인터페이스다.

클러스터의 모든 노드에 동작 중인
{{<glossary_tooltip text="컨테이너 런타임" term_id="container-runtime">}}이 존재해야, 
{{< glossary_tooltip text="kubelet" term_id="kubelet" >}}이
{{< glossary_tooltip text="파드" term_id="pod" >}}들과 컨테이너들을 
구동할 수 있다.

{{< glossary_definition prepend="컨테이너 런타임 인터페이스(CRI)는" term_id="container-runtime-interface" length="all" >}}

<!-- body -->

## API {#api}

{{< feature-state for_k8s_version="v1.23" state="stable" >}}

Kubelet은 gRPC를 통해 컨테이너 런타임과 연결할 때 클라이언트의 역할을 수행한다.
런타임과 이미지 서비스 엔드포인트는 컨테이너 런타임 내에서 사용 가능해야 하며, 
이는 각각 Kubelet 내에서 `--image-service-endpoint`와 `--container-runtime-endpoint` 
[커맨드라인 플래그](/docs/reference/command-line-tools-reference/kubelet)
를 통해 설정할 수 있다.

쿠버네티스 v{{< skew currentVersion >}}에서는, Kubelet은 CRI `v1`을 사용하는 것을 권장한다.
컨테이너 런타임이 CRI `v1` 버전을 지원하지 않는다면, 
Kubelet은 지원 가능한 이전 지원 버전으로 협상을 시도한다.
또한 v{{< skew currentVersion >}} Kubelet은 CRI `v1alpha2`버전도 협상할 수 있지만, 
해당 버전은 사용 중단(deprecated)으로 간주한다.
Kubelet이 지원되는 CRI 버전을 협상할 수 없는 경우, 
Kubelet은 협상을 포기하고 노드로 등록하지 않는다.

## 업그레이드

쿠버네티스를 업그레이드할 때, Kubelet은 컴포넌트의 재시작 시점에서 최신 CRI 버전을 자동으로 선택하려고 시도한다. 
이 과정이 실패하면 위에서 언급한 대로 이전 버전을 선택하는 과정을 거친다. 
컨테이너 런타임이 업그레이드되어 gRPC 재다이얼이 필요하다면, 
컨테이너 런타임도 처음에 선택된 버전을 지원해야 하며, 
그렇지 못한 경우 재다이얼은 실패하게 될 것이다. 이 과정은 Kubelet의 재시작이 필요하다.

## {{% heading "whatsnext" %}}

- CRI [프로토콜 정의](https://github.com/kubernetes/cri-api/blob/c75ef5b/pkg/apis/runtime/v1/api.proto)를 자세히 알아보자.
