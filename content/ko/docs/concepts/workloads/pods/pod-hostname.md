---
title: 파드 호스트네임
content_type: concept
weight: 85
---

<!-- overview -->

이 페이지에서는 파드 호스트네임을 설정하는 방법과,
설정 이후 발생할 수 있는 잠재적인 문제, 그리고 해당 메커니즘에 대해 설명한다.

<!-- body -->

## 기본 파드 호스트네임

파드가 생성되면, 그 (파드 내부에서 확인되는) 호스트 네임은
파드의 metadata.name 값에서 유래한다.
호스트네임과 이에 대응하는 전체 주소 도메인 네임(FQDN) 모두
(파드의 관점에서) metadata.name 값으로 설정된다

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-1
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```
이 메니페스트로 생성된 파드는 호스트네임과 전체 주소 도메인 네임(FQDN)이 모두 `busybox-1`로 설정된다.

## 파드의 호스트네임과 서브도메인 필드
파드 스펙에는 옵션으로 사용할 수 있는 `hostname` 필드가 있다.
이 필드가 설정되면, (파드 내부에서 관찰되는) 호스트네임으로 `metadata.name` 대신
해당 필드의 값으로 설정된다.
예를 들어, spec.hostname이 `my-host`로 설정된 파드는 호스트네임이 `my-host`로 설정된다.

파드 스펙에는 옵션으로 `subdomain` 필드 역시 가지고 있으며,
이는 파드가 네임스페이스 내 특정 서브도메인에 속하고 있음을 나타낸다.
만약 네임스페이스 `my-namespace`에서 `spec.hostname`이 "foo"이고, spec.subdomain이
"bar"로 설정된 경우, 파드의 호스트네임은 `foo`가 되고
(파드 내부에서 관찰되는) 전체 주소 도메인 네임(FQDN)은
`foo.bar.my-namespace.svc.cluster-domain.example`이 된다.

hostname과 subdomain이 모두 설정된 경우, 클러스터의 DNS 서버는
이 필드를 기반으로 A 및/또는 AAAA 레코드를 생성한다.
자세한 내용은 [파드 hostname과 subdomain 필드](/docs/concepts/services-networking/dns-pod-service/#pod-hostname-and-subdomain-field)를 참고한다.

## 파드의 setHostnameAsFQDN 필드

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

파드를 전체 주소 도메인 네임(FQDN)으로 구성한 경우,
호스트네임은 짧은 형태의 호스트네임으로 설정된다. 예를 들어 파드의 전체
주소 도메인 네임이 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example`인 경우,
기본적으로 파드 내부에서 `hostname` 커맨드를 실행하면 `busybox-1`을 반환하고
`hostname --fqdn` 커맨드를 실행하면 FQDN을 반환한다.

파드 스펙에서 `setHostnameAsFQDN: true`와 서브도메인 필드가 함께 설정된 경우,
kubelet은 해당 파드 네임스페이스의
호스트명에 파드의 FQDN을 기록한다. 이 경우 `hostname`과 `hostname --fqdn` 커맨드 모두
파드의 FQDN을 반환한다.

파드의 FQDN은 앞서 설명한 방식과 동일하게 구성된다.
즉, 파드의 `spec.hostname`(지정된 경우) 또는 `metadata.name` 필드,
`spec.subdomain`, `namespace`명, 그리고 클러스터 도메인 접미사로 구성된다.

{{< note >}}
리눅스에서 커널의 호스트네임(`struct utsname`의 `nodename`)은 최대 64자까지 허용된다.

파드가 이 기능을 활성화하고 FQDN이 64자를 초과하는 경우, 파드는 초기 단계부터 실행에 실패하게 된다.
이때 파드는 `Pending` 상태(`kubectl` 기준 `ContainerCreating`)에 머물며
"Failed to construct FQDN from Pod hostname and cluster domain"와 같은 에러 이벤트를 발생시킨다.

따라서 이 필드를 사용할 때는,
파드의 `metadata.name` (혹은 `spec.hostname`)과
`spec.subdomain` 필드 값의 조합으로 생성된 FQDN이 64자를 넘지 않도록 해야 한다.
{{< /note >}}

## 파드의 hostnameOverride
{{< feature-state feature_gate_name="HostnameOverride" >}}

파드 스펙에서 `hostnameOverride` 값을 설정하면 kubelet은 
파드의 호스트네임과 전체 주소 도메인 네임(FQDN)을 조건없이 모두
`hostnameOverride` 값으로 설정한다.

`hostnameOverride` 필드는 최대 64자의 길이 제한이 있으며
반드시 [RFC 1123](https://datatracker.ietf.org/doc/html/rfc1123)에서 정의한 DNS 서브도메인 이름 규칙을 준수해야 한다.

Example:
```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox-2-busybox-example-domain
spec:
  hostnameOverride: busybox-2.busybox.example.domain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```
{{< note >}}
이 설정은 파드 내부의 호스트에만 영향을 미치며, 클러스터 DNS 서버의 파드 A 또는 AAAA 레코드에는 영향을 주지 않는다.
{{< /note >}}

`hostnameOverride`가 `hostname`, `subdomain` 필드와 함께 설정된 경우,
* 파드 내부의 호스트네임은 `hostnameOverride` 값으로 재정의된다.

* 클러스터 DNS 서버의 파드 A 및/또는 AAAA 레코드는 여전히 `hostname`과 `subdomain` 필드를 기반으로 생성된다.

참고: `hostnameOverride`가 설정된 경우, `hostNetwork`와 `setHostnameAsFQDN` 필드를 동시에 설정할 수 없다.
API 서버는 이 조합을 시도하는 생성 요청을 명시적으로 거부한다.

`hostnameOverride`가 다른 필드(hostname, subdomain, setHostnameAsFQDN, hostNetwork)와
함께 설정되었을 때의 동작 방식에 대한 상세 내용은
[KEP-4762 디자인 상세](https://github.com/kubernetes/enhancements/blob/master/keps/sig-network/4762-allow-arbitrary-fqdn-as-pod-hostname/README.md#design-details )의 표를 참고한다.