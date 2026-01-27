---
reviewers:
- lmktfy
title: 리눅스 노드의 보안
content_type: concept
weight: 40
---

<!-- overview -->

이 페이지는 리눅스 운영체제에 특화된 보안 고려사항과 모범 사례에 대해 설명한다.

<!-- body -->

## 노드에서의 Secret 데이터 보호

리눅스 노드에서 메모리 기반 볼륨 ([`secret`](/docs/concepts/configuration/secret/)
와 같은 볼륨 마운트나 `medium: Memory`를 사용하는 [`emptyDir`](/docs/concepts/storage/volumes/#emptydir) 등)
은 `tmpfs` 파일 시스템으로 구현된다.

스왑이 구성된 상태에서 오래된 리눅스 커널을 사용하거나 (또는 현재 커널과 지원되지 않는 쿠버네티스 구성을 사용하는 경우),
**메모리** 기반 볼륨의 데이터가 영구 스토리지에 기록될 수 있다.

리눅스 커널은 `noswap` 설정을 6.3 버전부터  공식적으로 지원하므로,
노드에서 스왑을 활성화했다면 커널 버전이 6.3 이상이거나
백포트(backport)를 통해 `noswap` 설정을 지원하는 것을 권장한다.

더 자세한 정보는 [스왑 메모리 관리](/docs/concepts/cluster-administration/swap-memory-management/#memory-backed-volumes)에서 알아볼 수 있다.