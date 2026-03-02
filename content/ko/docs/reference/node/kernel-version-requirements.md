---
content_type: "reference"
title: 리눅스 커널 버전 요구 사항
weight: 10
---

{{% thirdparty-content %}}

많은 기능이 특정 커널 기능에 의존하며 최소 커널 버전 요구 사항이 있다.
그러나 특정 운영 체제 배포판에서는 커널 버전 번호에만 의존하는 것이 충분하지
않을 수 있다.
RHEL, 우분투, SUSE와 같은 배포판의 메인테이너들이 선택된 기능을 이전 커널 릴리스에
백포트(이전 커널 버전을 유지하면서)하는 경우가 많기 때문이다.

## 파드 sysctl

리눅스에서 `sysctl()` 시스템 콜은 런타임에 커널 파라미터를 설정한다. 이러한
파라미터를 설정하는 데 사용할 수 있는 `sysctl`이라는 커맨드라인 툴이 있으며, 많은 파라미터가
`proc` 파일시스템을 통해 노출된다.

일부 sysctl은 커널 버전이 충분히 최신인 경우에만 사용할 수 있다.

다음 sysctl은 최소 커널 버전 요구 사항이 있으며,
[안전한 집합(safe set)](/docs/tasks/administer-cluster/sysctl-cluster/#safe-and-unsafe-sysctls)에서 지원된다.

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L19-L45
-->
- `net.ipv4.ip_local_reserved_ports` (쿠버네티스 1.27부터, 커널 3.16+ 필요);
- `net.ipv4.tcp_keepalive_time` (쿠버네티스 1.29부터, 커널 4.5+ 필요);
- `net.ipv4.tcp_fin_timeout` (쿠버네티스 1.29부터, 커널 4.6+ 필요);
- `net.ipv4.tcp_keepalive_intvl` (쿠버네티스 1.29부터, 커널 4.5+ 필요);
- `net.ipv4.tcp_keepalive_probes` (쿠버네티스 1.29부터, 커널 4.5+ 필요);
- `net.ipv4.tcp_syncookies` (커널 4.6+부터 네임스페이스 지원).
- `net.ipv4.tcp_rmem` (쿠버네티스 1.32부터, 커널 4.15+ 필요).
- `net.ipv4.tcp_wmem` (쿠버네티스 1.32부터, 커널 4.15+ 필요).
- `net.ipv4.vs.conn_reuse_mode` (`ipvs` 프록시 모드에서 사용, 커널 4.1+ 필요);

### kube proxy `nftables` 프록시 모드

<!--
Code: https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L53-L56
-->
쿠버네티스 {{< skew currentVersion >}}에서,
kube-proxy의 [`nftables` 모드](/docs/reference/networking/virtual-ips/#proxy-mode-nftables)는
nft 커맨드라인 툴의 버전 1.0.1 이상과
커널 5.13 이상이 필요하다.

테스트/개발 목적으로는 kube-proxy 설정에서
`nftables.skipKernelVersionCheck` 옵션을 설정하면 5.4까지의 이전 커널을 사용할 수 있다.
그러나 시스템의 다른 nftables 사용자와 문제를 일으킬 수 있으므로
프로덕션 환경에서는 권장하지 않는다.

## 버전 2 컨트롤 그룹(control group)

쿠버네티스 v1.31부터 cgroup v1 지원은 유지 관리 모드이며, cgroup v2
사용을 권장한다.
[리눅스 5.8](https://github.com/torvalds/linux/commit/4a7e89c5ec0238017a757131eb9ab8dc111f961c)에서 편의를 위해 시스템 레벨 `cpu.stat` 파일이 루트 cgroup에 추가되었다.

runc 문서에서는, freezer 부재로 인해 커널 5.2 이전 버전은 권장하지 않는다.

## PSI(Pressure Stall Information) {#requirements-psi}

[PSI(Pressure Stall Information)](/docs/reference/instrumentation/understand-psi-metrics/)는 리눅스 커널 버전 4.20 이상에서 지원되지만, 다음 설정이 필요하다.

- 커널이 `CONFIG_PSI=y` 옵션으로 컴파일되어야 한다. 대부분의 최신 배포판은 이를 기본적으로 활성화한다. `zgrep CONFIG_PSI /proc/config.gz`를 실행하여 커널 설정을 확인할 수 있다.
- 일부 리눅스 배포판은 PSI를 커널에 컴파일하지만 기본적으로 비활성화할 수 있다. 이 경우, 커널 커맨드라인에 `psi=1` 파라미터를 추가하여 부트 시 활성화해야 한다.

## 기타 커널 요구 사항 {#requirements-other}

일부 기능은 새로운 커널 기능에 의존할 수 있으며 특정 커널 요구 사항이 있다.

<!--
Code(recursive read only mount): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/staging/src/k8s.io/cri-api/pkg/apis/runtime/v1/api.proto#L1605-L1609
Code(user namespace and swap): https://github.com/kubernetes/kubernetes/blob/00236ae0d73d2455a2470469ed1005674f8ed61f/pkg/util/kernel/constants.go#L47-L51
-->
1. [재귀적 읽기 전용 마운트](/docs/concepts/storage/volumes/#recursive-read-only-mounts):
    리눅스 커널 v5.12에 추가된 `mount_setattr`(2)를 사용하여
    `AT_RECURSIVE` 플래그와 함께 `MOUNT_ATTR_RDONLY` 속성을 적용하여 구현된다.
2. 파드 사용자 네임스페이스 지원은
   [KEP-127](https://github.com/kubernetes/enhancements/blob/master/keps/sig-node/127-user-namespaces/README.md)에 따라 최소 커널 버전 6.5+가 필요하다.
3. [노드 시스템 스왑(swap)](/docs/concepts/architecture/nodes/#swap-memory)의 경우, `noswap`으로 설정된 tmpfs는
   커널 6.3까지 지원되지 않는다.

## 리눅스 커널 장기 유지 관리

활성 커널 릴리스는 [kernel.org](https://www.kernel.org/category/releases.html)에서 확인할 수 있다.

이전 커널 트리에 대한 버그 수정을 백포트하기 위해 보통 여러 _장기 유지 관리(long term maintenance)_ 커널 릴리스가
제공된다. 이러한 커널에는 중요한 버그 수정만 적용되며, 특히 오래된
트리의 경우 자주 릴리스되지 않는다.
리눅스 커널 웹사이트의 _Longterm_ 카테고리에서
[릴리스 목록](https://www.kernel.org/category/releases.html)을 참고한다.

## {{% heading "whatsnext" %}}

- 자세한 내용은 [sysctl](/docs/tasks/administer-cluster/sysctl-cluster/)을 참고한다.
- kube-proxy를 [nftables 모드](/docs/reference/networking/virtual-ips/#proxy-mode-nftables)로 실행할 수 있다.
- [cgroup v2](/docs/concepts/architecture/cgroups/)에서 더 많은 정보를 확인한다.
