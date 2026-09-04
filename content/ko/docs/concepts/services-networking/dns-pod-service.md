---
# reviewers:
# - jbelamaric
# - bowei
# - thockin
title: 서비스 및 파드용 DNS
content_type: concept
weight: 80
description: >-
  워크로드는 DNS를 사용하여 클러스터 내의 서비스들을 발견할 수 있다;
  이 페이지는 이것이 어떻게 동작하는지를 설명한다.
---
<!-- overview -->

쿠버네티스는 서비스와 파드에 대한 DNS 레코드를 생성한다. IP 주소 대신
일관된 DNS 이름을 사용하여 서비스에 연결할 수 있다.

<!-- body -->

쿠버네티스는 DNS를 구성하는 데 사용하는 파드와 서비스 정보를
게시한다. Kubelet은 실행 중인 컨테이너가 IP가 아닌 이름으로 서비스를
조회할 수 있도록 파드의 DNS를 구성한다.

클러스터 내에 정의된 서비스에는 DNS 이름이 할당된다. 기본적으로
클라이언트 파드의 DNS 검색 목록에는 파드 자체의 네임스페이스와
클러스터의 기본 도메인이 포함된다.

### 서비스의 네임스페이스

DNS 쿼리는 쿼리하는 파드의 네임스페이스에 따라 다른 결과를 반환할 수
있다. 네임스페이스를 지정하지 않은 DNS 쿼리는 파드의
네임스페이스로 제한된다. DNS 쿼리에 네임스페이스를 지정하여 다른 네임스페이스의 서비스에 접근한다.

예를 들어, `test` 네임스페이스에 있는 파드를 생각해 보자. `data` 서비스는
`prod` 네임스페이스에 있다.

이 경우, `data` 에 대한 쿼리는 파드의 `test` 네임스페이스를 사용하기 때문에 결과를 반환하지 않을 것이다.

`data.prod`를 쿼리하면 네임스페이스를 지정했으므로 의도한 결과가
반환된다.

DNS 쿼리는 파드의 `/etc/resolv.conf`를 사용하여 확장될 수 있다. Kubelet은
각 파드에 대해 이 파일을 구성한다. 예를 들어, `data`만 쿼리하면
`data.test.svc.cluster.local`로 확장될 수 있다. 쿼리를 확장하는 데
`search` 옵션의 값을 사용한다. DNS 쿼리에 대한 자세한 내용은
[`resolv.conf` 매뉴얼 페이지](https://www.man7.org/linux/man-pages/man5/resolv.conf.5.html)를 참고한다.

```
nameserver 10.32.0.10
search <namespace>.svc.cluster.local svc.cluster.local cluster.local
options ndots:5
```

요약하면, _test_ 네임스페이스의 파드는 `data.prod` 또는
`data.prod.svc.cluster.local`을 성공적으로 해석할 수 있다.

### DNS 레코드

어떤 오브젝트가 DNS 레코드를 가지는가?

1. 서비스
1. 파드

다음 섹션에서는 지원되는 DNS 레코드 유형과 레이아웃을 자세히
설명한다. 그 밖의 레이아웃, 이름 또는 쿼리가 현재 동작하더라도 이는
구현 세부 사항일 뿐이며, 경고 없이 변경될 수 있다.
최신 명세는
[쿠버네티스 DNS 기반 서비스 디스커버리](https://github.com/kubernetes/dns/blob/master/docs/specification.md)를 참고한다.

## 서비스

### A/AAAA 레코드

"일반"(헤드리스가 아닌) 서비스에는 해당 서비스의 IP 패밀리에 따라
`my-svc.my-namespace.svc.cluster-domain.example`
형식의 이름을 가진 DNS A 및/또는 AAAA 레코드가 할당된다. 이는 서비스의 클러스터
IP로 해석된다.

[헤드리스 서비스](/docs/concepts/services-networking/service/#헤드리스-서비스)
(클러스터 IP가 없는) 또한
`my-svc.my-namespace.svc.cluster-domain.example` 형식의 이름을 가진 DNS A 및/또는 AAAA 레코드가 할당된다. 일반
서비스와 달리, 이 이름은 서비스에 의해 선택된 파드들의 IP 집합으로 해석된다.
클라이언트는 이 집합을 사용하거나, 이 집합에서 표준 라운드 로빈
방식으로 선택해야 한다.

### SRV 레코드

일반 또는 헤드리스 서비스에 속한 이름이 지정된 포트에 대해 SRV 레코드가
생성된다.

- 이름이 지정된 각 포트에 대해 SRV 레코드는
  `_port-name._port-protocol.my-svc.my-namespace.svc.cluster-domain.example` 형식이다.
- 일반 서비스의 경우, 이 레코드는 포트 번호와 다음 도메인 이름으로 해석된다.
  `my-svc.my-namespace.svc.cluster-domain.example`.
- 헤드리스 서비스의 경우, 이 레코드는 여러 응답으로 해석되며, 서비스를 지원하는 각 파드마다
  하나의 응답이 반환된다. 각 응답에는 포트 번호와
  `hostname.my-svc.my-namespace.svc.cluster-domain.example` 형식의 파드 도메인 이름이 포함된다.

## 파드

### A/AAAA 레코드

[DNS 명세](https://github.com/kubernetes/dns/blob/master/docs/specification.md)를
구현하기 전 Kube-DNS 버전에서는 다음과 같이 DNS를
해석했다.

```
<pod-IPv4-address>.<namespace>.pod.<cluster-domain>
```

예를 들어, `default` 네임스페이스의 파드에 IP 주소 172.17.0.3이 있고
클러스터의 도메인 이름이 `cluster.local`이면, 파드는 다음 DNS 이름을 가진다.

```
172-17-0-3.default.pod.cluster.local
```

[CoreDNS](https://coredns.io/)와 같은 일부 클러스터 DNS 메커니즘은 다음에 대한 `A` 레코드도 제공한다.

```
<pod-ipv4-address>.<service-name>.<my-namespace>.svc.<cluster-domain.example>
```

예를 들어, `cafe` 네임스페이스의 파드에 IP 주소 172.17.0.3이 있고,
이 파드가 `barista`라는 서비스의 엔드포인트이며, 클러스터의 도메인 이름이
`cluster.local`이면, 파드는 다음과 같은 서비스 범위 DNS `A` 레코드를 가진다.

```
172-17-0-3.barista.cafe.svc.cluster.local
```

### 파드의 hostname과 subdomain 필드 {#pod-hostname-and-subdomain-field}

현재는 파드가 생성되면 (파드 내부에서 관찰되는) 호스트네임은
파드의 `metadata.name` 값이다.

파드 명세에는 다른 호스트네임을 지정하는 데 사용할 수 있는 선택적
`hostname` 필드가 있다. 이 필드가 지정되면 파드의 이름보다 우선하여
(마찬가지로 파드 내부에서 관찰되는) 파드의 호스트네임이 된다. 예를 들어,
`spec.hostname` 필드가 `"my-host"`로 설정된 파드의
호스트네임은 `"my-host"`로 설정된다.

또한, 파드 명세에는 파드가 네임스페이스의 하위 그룹에 속함을 나타내는 선택적 `subdomain` 필드가 있다.
예를 들어, `"my-namespace"` 네임스페이스에서 `spec.hostname` 필드가
`"foo"`로 설정되고, `spec.subdomain` 필드가 `"bar"`로 설정된 파드는
호스트네임이 `"foo"`로 설정되고, 전체 주소 도메인 이름(FQDN)은
`"foo.bar.my-namespace.svc.cluster.local"`로 설정된다(이 역시 파드 내부에서
관찰되는 값이다).

파드와 동일한 네임스페이스 내에 같은 서브도메인 이름을 가진
헤드리스 서비스가 있다면, 클러스터의 DNS 서버는
파드의 전체 주소 호스트네임(fully qualified hostname)인 A 및/또는 AAAA 레코드를 반환한다.

예시:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: busybox-subdomain
spec:
  selector:
    name: busybox
  clusterIP: None
  ports:
  - name: foo # 단일 포트 서비스에 이름은 필수사항이 아니다.
    port: 1234
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox1
  labels:
    name: busybox
spec:
  hostname: busybox-1
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
---
apiVersion: v1
kind: Pod
metadata:
  name: busybox2
  labels:
    name: busybox
spec:
  hostname: busybox-2
  subdomain: busybox-subdomain
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    name: busybox
```

위의 `"busybox-subdomain"` 서비스와 `spec.subdomain`을
`"busybox-subdomain"`으로 설정한 파드가 주어졌을 때, 첫 번째 파드는 자체 FQDN을
`"busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example"`로 인식한다. DNS는
해당 이름에 파드의 IP를 가리키는 A 및/또는 AAAA 레코드를 제공한다. `"busybox1"`과
`"busybox2"` 파드는 각각 자체 주소 레코드를 가진다.

{{<glossary_tooltip term_id="endpoint-slice" text="엔드포인트슬라이스(EndpointSlice)">}}는
어떤 엔드포인트 주소에 대해서든 해당 IP와 함께 DNS 호스트네임을 지정할 수 있다.

{{< note >}}
파드에 `hostname`이 없으므로 파드 이름에 대한 A와 AAAA 레코드는 생성되지 않는다.
`hostname` 없이 `subdomain`만 있는 파드는 파드의 IP 주소를 가리키는
헤드리스 서비스(`busybox-subdomain.my-namespace.svc.cluster-domain.example`)에 대한
A 또는 AAAA 레코드만 생성한다. 또한 서비스에 `publishNotReadyAddresses=True`를 설정하지 않았다면
레코드를 생성하려면 파드가 준비 상태여야 한다.
{{< /note >}}

### 파드의 setHostnameAsFQDN 필드 {#pod-sethostnameasfqdn-field}

{{< feature-state for_k8s_version="v1.22" state="stable" >}}

파드가 전체 주소 도메인 이름(FQDN)을 갖도록 구성된 경우,
해당 호스트네임은 짧은 호스트네임이다.
예를 들어, 전체 주소 도메인 이름이 `busybox-1.busybox-subdomain.my-namespace.svc.cluster-domain.example` 인 파드가 있는 경우,
기본적으로 해당 파드 내부의 `hostname` 명령어는 `busybox-1` 을 반환하고
`hostname --fqdn` 명령은 FQDN을 반환한다.

파드 명세에서 `setHostnameAsFQDN: true`를 설정하면, Kubelet은 파드의 
FQDN을 해당 파드 네임스페이스의 호스트네임에 기록한다. 이 경우, `hostname`과 `hostname --fqdn`은 
모두 파드의 FQDN을 반환한다.

{{< note >}}
리눅스에서, 커널의 호스트네임 필드(`struct utsname`의 `nodename` 필드)는 64자로 제한된다.

파드에서 이 기능을 활성화하고 FQDN이 64자보다 길면 파드를 시작할 수 없다.
파드는 `Pending` 상태(`kubectl`에서는 `ContainerCreating`으로 표시됨)에 머물면서
Failed to construct FQDN from Pod hostname and cluster domain,
FQDN `long-FQDN` is too long (64 characters is the max, 70 characters requested) 같은 오류 이벤트를 생성한다.
이 시나리오의 사용자 경험을 개선하는 한 가지 방법은 사용자가 디플로이먼트(Deployment) 같은 최상위 오브젝트를 생성할 때
FQDN 크기를 제어하는
[어드미션 웹훅 컨트롤러](/docs/reference/access-authn-authz/extensible-admission-controllers/#what-are-admission-webhooks)를 생성하는 것이다.
{{< /note >}}

### 파드의 DNS 정책

DNS 정책은 파드별로 설정할 수 있다. 현재 쿠버네티스는 다음과 같은
파드별 DNS 정책을 지원한다. 이러한 정책은 파드 명세의
`dnsPolicy` 필드에 지정한다.

- "`Default`": 파드는 파드가 실행되고 있는 노드로부터
  네임 해석 설정(the name resolution configuration)을 상속받는다.
  자세한 내용은 [관련 논의](/docs/tasks/administer-cluster/dns-custom-nameservers)을
  참고한다.
- "`ClusterFirst`": "`www.kubernetes.io`"와 같이 구성된 클러스터
  도메인 접미사와 일치하지 않는 모든 DNS 쿼리는 DNS 서버가 업스트림
  네임서버(nameserver)로 전달한다. 클러스터 관리자가 추가
  스텁 도메인(stub-domain)과 업스트림 DNS 서버를 구성했을 수 있다.
  그러한 경우 DNS 쿼리를 처리하는 방법에 대한 자세한 내용은
  [관련 논의](/docs/tasks/administer-cluster/dns-custom-nameservers)을 참고한다.
- "`ClusterFirstWithHostNet`": hostNetwork로 실행되는 파드의 DNS 정책은
  "`ClusterFirstWithHostNet`"으로 명시적으로 설정해야 한다. 그렇지 않으면 hostNetwork와
  "`ClusterFirst`"로 실행되는 파드는 "`Default`" 정책에 따라
  동작한다.

  {{< note >}}
  윈도우에서는 지원되지 않는다. 자세한 내용은 [아래](#dns-windows)를 참고한다.
  {{< /note >}}

- "`None`": 파드가 쿠버네티스 환경의 DNS 설정을 무시하도록 한다.
  모든 DNS 설정은 파드 명세의 `dnsConfig` 필드를 사용하여
  제공해야 한다.
  아래의 [파드의 DNS 구성](#pod-dns-config) 하위 섹션을 참고한다.

{{< note >}}
"Default"는 기본 DNS 정책이 아니다. `dnsPolicy`가 명시적으로 지정되어 있지 않다면
"ClusterFirst"가 사용된다.
{{< /note >}}

아래 예시는 `hostNetwork` 필드가 `true`로 설정되어 있어서
DNS 정책이 "`ClusterFirstWithHostNet`"으로 설정된 파드를 보여준다.

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: busybox
  namespace: default
spec:
  containers:
  - image: busybox:1.28
    command:
      - sleep
      - "3600"
    imagePullPolicy: IfNotPresent
    name: busybox
  restartPolicy: Always
  hostNetwork: true
  dnsPolicy: ClusterFirstWithHostNet
```

### 파드의 DNS 설정 {#pod-dns-config}

{{< feature-state for_k8s_version="v1.14" state="stable" >}}

파드의 DNS 설정을 통해 사용자는 파드의 DNS 설정을 더 세밀하게 제어할 수 있다.

`dnsConfig` 필드는 선택 사항이며 모든 `dnsPolicy` 설정과 함께 사용할 수 있다.
그러나, 파드의 `dnsPolicy`가 "`None`"으로 설정되면 `dnsConfig` 필드를
지정해야 한다.

사용자는 `dnsConfig` 필드에서 다음과 같은 속성들을 지정할 수 있다.

- `nameservers`: 파드의 DNS 서버로 사용할 IP 주소의 목록이다.
  최대 3개의 IP 주소를 지정할 수 있다. 파드의 `dnsPolicy`가
  "`None`"으로 설정되면 목록에 하나 이상의 IP 주소가 있어야 하며, 그렇지 않으면
  이 속성은 선택 사항이다.
  나열된 서버는 지정한 DNS 정책에서 생성된 기본 네임서버와 결합되며
  중복 주소는 제거된다.
- `searches`: 파드에서 호스트네임을 조회하기 위한 DNS 검색 도메인의 목록이다.
  이 속성은 선택 사항이다. 지정하면 제공된 목록을 선택한 DNS 정책에서
  생성된 기본 검색 도메인 이름에 병합한다.
  중복된 도메인 이름은 제거된다.
  쿠버네티스는 최대 32개의 검색 도메인을 허용한다.
- `options`: 각 오브젝트가 `name` 속성(필수)과 `value` 속성(선택 사항)을 가질 수 있는
  선택적 오브젝트 목록이다. 이 속성의 내용은
  지정된 DNS 정책에서 생성된 옵션으로 병합된다.
  중복 항목은 제거된다.

다음은 사용자 정의 DNS 설정이 있는 파드의 예시이다.

{{% code_sample file="service/networking/custom-dns.yaml" %}}

위 파드가 생성되면, 컨테이너 `test`의 `/etc/resolv.conf` 파일에는
다음과 같은 내용이 추가된다.

```
nameserver 192.0.2.1
search ns1.svc.cluster-domain.example my.dns.search.suffix
options ndots:2 edns0
```

IPv6 설정에서는 검색 경로와 네임서버를 다음과 같이 설정해야 한다.

```shell
kubectl exec -it dns-example -- cat /etc/resolv.conf
```

출력은 다음과 비슷하다.

```
nameserver 2001:db8:30::a
search default.svc.cluster-domain.example svc.cluster-domain.example cluster-domain.example
options ndots:5
```

## DNS 검색 도메인 목록 제한

{{< feature-state for_k8s_version="1.28" state="stable" >}}

쿠버네티스 자체는 검색 도메인 목록이 32개를 초과하거나 모든 검색 도메인의
전체 길이가 2048자를 초과하기 전까지 DNS 구성을 제한하지 않는다.
이 제한은 노드의 리졸버(resolver) 구성 파일, 파드의 DNS 구성,
병합된 DNS 구성에 각각 적용된다.

{{< note >}}
이전 버전의 일부 컨테이너 런타임은 DNS 검색 도메인 수에 대해
자체적인 제한을 가지고 있을 수 있다. 컨테이너 런타임 환경에 따라
많은 수의 DNS 검색 도메인을 갖는 파드는
Pending 상태로 고착될 수 있다.

containerd v1.5.5 이하와 CRI-O v1.21 이하에서
이 문제가 발생하는 것으로 알려져 있다.
{{< /note >}}

## 윈도우 노드에서의 DNS 해석 {#dns-windows}

- `ClusterFirstWithHostNet`은 윈도우 노드에서 실행되는 파드에 지원되지 않는다.
  윈도우는 `.`이 포함된 모든 이름을 FQDN으로 취급하고 FQDN 해석을 건너뛴다.
- 윈도우에서는 여러 DNS 리졸버를 사용할 수 있다. 이들은
  서로 조금 다르게 동작하므로, 이름 쿼리 해석에는
  [`Resolve-DNSName`](https://docs.microsoft.com/powershell/module/dnsclient/resolve-dnsname)
  파워셸 cmdlet을 사용하는 것이 좋다.
- 리눅스에는 이름을 전체 주소로 해석하는 데 실패한 후 사용하는 DNS 접미사 목록이
  있다.
  윈도우에서는 파드의 네임스페이스와 연결된 DNS 접미사(예: `mydns.svc.cluster.local`)를
  하나만 사용할 수 있다. 윈도우는 이 단일 접미사로 해석할 수 있는 FQDN, 서비스
  또는 네트워크 이름을 해석할 수 있다. 예를 들어, `default` 네임스페이스에서 생성된 파드는
  DNS 접미사 `default.svc.cluster.local`을 가진다.
  윈도우 파드 내부에서는 `kubernetes.default.svc.cluster.local`과
  `kubernetes`를 모두 해석할 수 있지만, 부분 주소 이름(`kubernetes.default` 또는
  `kubernetes.default.svc`)은 해석할 수 없다.

## {{% heading "whatsnext" %}}

DNS 구성 관리에 대한 지침은
[DNS 서비스 구성](/docs/tasks/administer-cluster/dns-custom-nameservers/)에서 확인할 수 있다.
