---
# reviewers:
# - derekwaynecarr
title: HugePages 관리
content_type: task
description: 클러스터에서 huge page를 스케줄할 수 있는 리소스로 구성하고 관리한다.
---

<!-- overview -->
{{< feature-state state="stable" >}}

쿠버네티스는 파드의 애플리케이션에 미리 할당된
huge page의 할당과 사용을 지원한다. 이 페이지에서는 사용자가 huge page를 사용하는 방법에 대해 설명한다.

## {{% heading "prerequisites" %}}


1. 쿠버네티스 노드는 노드에 대한 huge page 용량을 보고하기 위해
   huge page를 미리 할당해야 한다. 노드는 여러 크기의 huge page를 미리 할당할 수
   있다.

노드는 모든 huge page 리소스를 스케줄 가능한 리소스로 자동 검색하고
보고한다.



<!-- steps -->

## API

리소스 이름 `hugepages-<size>` (`<size>` 는 특정 노드에서 지원되는 정수값을
사용하는 가장 간단한 2진 표기법)를 사용하여 컨테이너 레벨의 리소스
요구 사항을 통해 huge page를 사용할 수 있다. 예를 들어,
노드가 2048KiB 및 1048576KiB 페이지 크기를 지원하는 경우, 스케줄 가능한
리소스인 `hugepages-2Mi` 와 `hugepages-1Gi` 를 노출한다. CPU나 메모리와 달리,
huge page는 오버커밋을 지원하지 않는다. 참고로 hugepage 리소스를 요청하는 경우,
메모리 또는 CPU 리소스도 요청해야 한다.

파드는 단일 파드 스펙에 여러 개의 huge page 크기를 사용할 수 있다. 이 경우
모든 볼륨 마운트에 대해 `medium: HugePages-<hugepagesize>` 표기법을 사용해야 한다.


```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages-2Mi
      name: hugepage-2mi
    - mountPath: /hugepages-1Gi
      name: hugepage-1gi
    resources:
      limits:
        hugepages-2Mi: 100Mi
        hugepages-1Gi: 2Gi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage-2mi
    emptyDir:
      medium: HugePages-2Mi
  - name: hugepage-1gi
    emptyDir:
      medium: HugePages-1Gi
```

파드는 동일한 크기의 huge page들을 요청하는 경우에만 `medium: HugePages` 를 사용할 수 있다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: huge-pages-example
spec:
  containers:
  - name: example
    image: fedora:latest
    command:
    - sleep
    - inf
    volumeMounts:
    - mountPath: /hugepages
      name: hugepage
    resources:
      limits:
        hugepages-2Mi: 100Mi
        memory: 100Mi
      requests:
        memory: 100Mi
  volumes:
  - name: hugepage
    emptyDir:
      medium: HugePages
```

- Huge page 요청(requests)은 제한(limits)과 같아야 한다. 제한이 지정되었지만, 요청은 지정되지 않은 경우
  이것이 기본값이다.
- Huge page는 컨테이너 범위에서 격리되므로, 각 컨테이너에는 컨테이너 사양에서 요청한대로
  cgroup 샌드박스에 대한 제한이 있다.
- Huge page가 지원하는 EmptyDir 볼륨은 파드 요청보다 더 많은 huge page 메모리를
  사용하지 말아야 한다.
- `shmget()` 의 `SHM_HUGETLB` 를 통해 huge page를 사용하는 애플리케이션은
  `proc/sys/vm/hugetlb_shm_group` 과 일치하는 보충 그룹(supplemental group)으로 실행해야 한다.
- 네임스페이스에서의 huge page 사용은 `hugepages-<size>` 토큰을 사용하는 `cpu` 또는 `memory` 와 같은
  다른 컴퓨트 리소스와 비슷한 리소스쿼터(ResourceQuota)를 통해 제어할 수
  있다.
