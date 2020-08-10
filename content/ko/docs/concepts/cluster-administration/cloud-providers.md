---
title: 클라우드 제공자
content_type: concept
weight: 30
---

<!-- overview -->
이 페이지에서는 특정 클라우드 제공자에서 실행 중인 쿠버네티스를 관리하는 방법에
대해 설명한다.



<!-- body -->
### kubeadm
[kubeadm](/docs/reference/setup-tools/kubeadm/kubeadm/)은 쿠버네티스 클러스터를 생성하는 데 많이 사용하는 옵션이다.
kubeadm에는 클라우드 제공자에 대한 구성 정보를 지정하는 구성 옵션이 있다. 예를 들어
kubeadm을 사용하여 일반적인 인-트리(in-tree) 클라우드 제공자를 아래와 같이 구성할 수 있다.

```yaml
apiVersion: kubeadm.k8s.io/v1beta2
kind: InitConfiguration
nodeRegistration:
  kubeletExtraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v1.13.0
apiServer:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
controllerManager:
  extraArgs:
    cloud-provider: "openstack"
    cloud-config: "/etc/kubernetes/cloud.conf"
  extraVolumes:
  - name: cloud
    hostPath: "/etc/kubernetes/cloud.conf"
    mountPath: "/etc/kubernetes/cloud.conf"
```

인-트리 클라우드 제공자는 일반적으로 [kube-apiserver](/docs/admin/kube-apiserver/), [kube-controller-manager](/docs/admin/kube-controller-manager/)
및 [kubelet](/docs/admin/kubelet/)의 커맨드 라인에 지정된 `--cloud-provider` 와 `--cloud-config` 가 모두 필요하다.
각 제공자에 대해 `--cloud-config` 에 지정된 파일의 내용도 아래에 설명되어 있다.

모든 외부 클라우드 제공자의 경우, 아래 제공자에 대한 제목 아래에 있는 개별 리포지터리의 지침을 따르거나,
[모든 리포지터리 목록](https://github.com/kubernetes?q=cloud-provider-&type=&language=)을 볼 수 있다

## AWS
이 섹션에서는 Amazon Web Services에서 쿠버네티스를 실행할 때 사용할 수 있는
모든 구성에 대해 설명한다.

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes/cloud-provider-aws](https://github.com/kubernetes/cloud-provider-aws#readme)이다.

### 노드 이름

AWS 클라우드 제공자는 AWS 인스턴스의 프라이빗 DNS 이름을 쿠버네티스 노드 오브젝트의 이름으로 사용한다.

### 로드 밸런서
아래와 같이 어노테이션을 구성하여 AWS의 특정 기능을 사용하도록
[외부 로드 밸런서](/docs/tasks/access-application-cluster/create-external-load-balancer/)를 설정할 수 있다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example
  namespace: kube-system
  labels:
    run: example
  annotations:
     service.beta.kubernetes.io/aws-load-balancer-ssl-cert: arn:aws:acm:xx-xxxx-x:xxxxxxxxx:xxxxxxx/xxxxx-xxxx-xxxx-xxxx-xxxxxxxxx #이 값을 교체한다
     service.beta.kubernetes.io/aws-load-balancer-backend-protocol: http
spec:
  type: LoadBalancer
  ports:
  - port: 443
    targetPort: 5556
    protocol: TCP
  selector:
    app: example
```
_어노테이션_ 을 사용하여 AWS의 로드 밸런서 서비스에 다른 설정을 적용할 수 있다. 다음은 AWS ELB에서 지원하는 어노테이션에 대해 설명한다.

* `service.beta.kubernetes.io/aws-load-balancer-access-log-emit-interval`: 액세스 로그 방출 간격을 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-enabled`: 서비스에서 액세스 로그를 활성화하거나 비활성화하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-name`: 액세스 로그 s3 버킷 이름을 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-access-log-s3-bucket-prefix`: 액세스 로그 s3 버킷 접두사를 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-additional-resource-tags`: 서비스에서 쉼표로 구분된 키-값 쌍의 목록을 지정하여 ELB에 추가 태그로 기록된다. 예를 들면 다음과 같다. `"Key1=Val1,Key2=Val2,KeyNoVal1=,KeyNoVal2"`
* `service.beta.kubernetes.io/aws-load-balancer-backend-protocol`: 서비스에서 리스너 뒤의 백엔드(파드)가 언급한 프로토콜을 지정하는 데 사용된다. 만약 `http` (기본값) 또는 `https` 인 경우, 연결을 종료하고 헤더를 파싱하는 HTTPS 리스너가 생성된다. `ssl` 이나 `tcp` 로 설정된 경우, "원시(raw)" SSL 리스너가 사용된다. `http` 로 설정하고 `aws-load-balancer-ssl-cert` 를 사용하지 않았다면 HTTP 리스너가 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-cert`: 서비스에서 보안 리스너를 요청하는 데 사용된다. 값은 유효한 인증서 ARN이다. 자세한 내용은, [ELB 리스너 구성](https://docs.aws.amazon.com/ko_kr/elasticloadbalancing/latest/classic/elb-listener-config.html)을 참고한다. CertARN은 IAM 또는 CM 인증서 ARN이다(예: `arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012`).
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-enabled`: 서비스에서 연결 드레이닝(draining)을 활성화하거나 비활성화하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-connection-draining-timeout`: 서비스에서 연결 드레이닝 타임아웃 값을 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-connection-idle-timeout`: 서비스에서 유휴 연결 타임아웃 값을 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-cross-zone-load-balancing-enabled`: 서비스에서 교차 영역의 로드 밸런싱을 활성화하거나 비활성화하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-security-groups`: 생성된 ELB에 추가할 보안 그룹을 지정하는 데 사용된다. 이는 이전에 ELB에 할당된 다른 모든 보안 그룹을 대체한다. 여기에 정의된 보안 그룹은 서비스 간에 공유해서는 안된다.
* `service.beta.kubernetes.io/aws-load-balancer-extra-security-groups`: 서비스에서 생성된 ELB에 추가할 추가적인 보안 그룹을 지정하는 데 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-internal`: 서비스에서 내부 ELB 사용 희망을 표시하기 위해 사용된다.
* `service.beta.kubernetes.io/aws-load-balancer-proxy-protocol`: 서비스에서 ELB에서 프록시 프로토콜을 활성화하는 데 사용된다. 현재는 모든 ELB 백엔드에서 프록시 프로토콜을 사용하도록 설정하는 `*` 값만 허용한다. 향후에는 특정 백엔드에서만 프록시 프로토콜을 설정할 수 있도록 이를 조정할 수 있게 된다.
* `service.beta.kubernetes.io/aws-load-balancer-ssl-ports`: SSL/HTTPS 리스너를 사용할 쉼표로 구분된 포트의 목록을 지정하기 위해 서비스에서 사용된다. 기본값은 `*`(모두)이다.

AWS 어노테이션에 대한 정보 출처는 [aws.go](https://github.com/kubernetes/legacy-cloud-providers/blob/master/aws/aws.go)의 코멘트이다.

## Azure

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes/cloud-provider-azure](https://github.com/kubernetes/cloud-provider-azure#readme)이다.

### 노드 이름

Azure 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름(hostname)을 사용한다.
참고로 쿠버네티스 노드 이름은 Azure VM 이름과 일치해야 한다.

## CloudStack

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [apache/cloudstack-kubernetes-provider](https://github.com/apache/cloudstack-kubernetes-provider)이다.

### 노드 이름

CloudStack 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름을 사용한다.
참고로 쿠버네티스 노드 이름은 CloudStack VM 이름과 일치해야 한다.

## GCE

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes/cloud-provider-gcp](https://github.com/kubernetes/cloud-provider-gcp#readme)이다.

### 노드 이름

GCE 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름을 사용한다.
참고로 쿠버네티스 노드 이름의 첫 번째 세그먼트는 GCE 인스턴스 이름과 일치해야 한다(예: `kubernetes-node-2.c.my-proj.internal` 이름이 지정된 노드는 `kubernetes-node-2` 이름이 지정된 인스턴스에 해당해야 함).

## HUAWEI CLOUD

외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes-sigs/cloud-provider-huaweicloud](https://github.com/kubernetes-sigs/cloud-provider-huaweicloud)이다.

### 노드 이름

HUAWEI CLOUD 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 프라이빗 IP 주소가 필요하다.
노드에서 kubelet을 시작할 때 반드시 `--hostname-override=<node private IP>` 를 사용한다.

## OpenStack
이 섹션에서는 쿠버네티스와 함께 OpenStack을 사용할 때 사용할 수 있는
모든 구성에 대해 설명한다.

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes/cloud-provider-openstack](https://github.com/kubernetes/cloud-provider-openstack#readme)이다.

### 노드 이름

OpenStack 클라우드 제공자는 (OpenStack 메타데이터에서 결정한) 인스턴스 이름을 쿠버네티스 노드 오브젝트의 이름으로 사용한다.
참고로 kubelet이 노드 오브젝트를 성공적으로 등록하려면 인스턴스 이름이 유효한 쿠버네티스 노드 이름이어야 한다.

### 서비스

쿠버네티스에 대한
OpenStack 클라우드 제공자 구현은 사용 가능한 경우 기본 클라우드에서
이러한 OpenStack 서비스 사용을 지원한다.

| 서비스                    | API 버전         | 필수      |
|--------------------------|----------------|----------|
| 블록 스토리지 (Cinder)      | V1†, V2, V3    | 아니오     |
| 컴퓨트 (Nova)              | V2             | 아니오    |
| 아이덴티티(Identity) (Keystone) | V2‡,  V3       | 예        |
| 로드 밸런싱 (Neutron)       | V1§, V2        | 아니오     |
| 로드 밸런싱 (Octavia)       | V2             | 아니오     |

† 블록 스토리지 V1 API 지원은 사용 중단(deprecated)되며, 쿠버네티스 1.9에서 블록 스토리지
V3 API 지원이 추가되었다.

‡ 아이덴티티 V2 API 지원은 사용 중단되며, 향후 릴리스에서는 제공자에서
제거될 예정이다. "Queens" 릴리스부터 OpenStack은 더 이상 아이덴티티 V2 API를
공개하지 않는다.

§ 로드 밸런싱 V1 API 지원이 쿠버네티스 1.9에서 제거되었다.

서비스 디스커버리는 제공자 구성에서 제공된 `auth-url` 을 사용하여
OpenStack 아이덴티티(Keystone)에서 관리하는 서비스 카탈로그를
나열하여 수행된다. Keystone 이외의 OpenStack 서비스를 사용할 수 없고
영향을 받는 기능에 대한 지원을 거부할 경우 제공자는 기능이
점진적으로 떨어진다. 기본 클라우드에서 Neutron이 게시한 확장 목록을 기반으로
특정 기능을 활성화하거나 비활성화할 수도 있다.

### cloud.conf
쿠버네티스는 cloud.conf 파일을 통해 OpenStack과 상호 작용하는 방법을 알고 있다. 쿠버네티스에
OpenStack 인증 엔드포인트의 자격 증명과 위치를 제공하는 파일이다.
다음의 세부 정보를 지정하여 cloud.conf 파일을 만들 수 있다.

#### 일반적인 구성
이것은 가장 자주 설정해야 하는 값에 대한 일반적인 구성의
예시이다. OpenStack 클라우드의 Keystone
엔드포인트에서, 제공자를 가리키고 이를 인증하는 방법에 대한 세부 사항을 제공하고,
로드 밸런서를 구성한다.

```yaml
[Global]
username=user
password=pass
auth-url=https://<keystone_ip>/identity/v3
tenant-id=c869168a828847f39f7f06edd7305637
domain-id=2a73b8f597c04551a0fdc8e95544be8a

[LoadBalancer]
subnet-id=6937f8fa-858d-4bc9-a3a5-18d2c957166a
```

##### 글로벌
OpenStack 제공자에 대한 다음의 구성 옵션은 글로벌
구성과 관련이 있으며 `cloud.conf` 파일의 `[Global]` 섹션에 있어야
한다.

* `auth-url` (필수): 인증에 사용되는 Keystone API의 URL이다.
  OpenStack 제어판의 액세스 및 보안 > API 액세스 >
  자격 증명에서 찾을 수 있다.
* `username` (필수): Keystone에 설정된 유효한 사용자의 username을 나타낸다.
* `password` (필수): Keystone에 설정된 유효한 사용자의 password를 나타낸다.
* `tenant-id` (필수): 리소스를 생성하려는 프로젝트의 id를 지정하는 데
  사용된다.
* `tenant-name` (선택): 리소스를 생성하려는 프로젝트의 이름을
  지정하는 데 사용된다.
* `trust-id` (선택): 권한 부여에 사용할 트러스트(trust)의 식별자를 지정하는 데
  사용된다. 트러스트는 한 사용자(트러스터(trustor))의 권한을 다른 사용자(트러스티(trustee))에게 역할을
  위임하고, 선택적으로 트러스티가 트러스터를 가장하도록
  허용한다. 사용 가능한 트러스트는
  Keystone API의 `/v3/OS-TRUST/trusts` 엔드포인트 아래에 있다.
* `domain-id` (선택): 사용자가 속한 도메인의 id를 지정하는 데
  사용된다.
* `domain-name` (선택): 사용자가 속한 도메인의 이름을 지정하는 데
  사용된다.
* `region` (선택): 멀티-리전(multi-region) OpenStack 클라우드에서
  실행할 때 사용할 리전의 식별자를 지정하는 데 사용된다. 리전은 OpenStack 디플로이먼트의
  일반 디비전(division)이다. 리전에 엄격한 지리적 의미는 없지만,
  디플로이먼트 시 `us-east` 와 같은
  리전의 식별자에 지리적 이름을 사용할 수 있다. 사용 가능한 지역은
  Keystone API의 `/v3/regions` 엔드포인트 아래에 있다.
* `ca-file` (선택): 사용자 지정 CA 파일의 경로를 지정하는 데 사용된다.


테넌트를 프로젝트로 변경하는 Keystone V3을 사용하면 `tenant-id` 값이
API의 프로젝트 구성에 자동으로 매핑된다.

#####  로드 밸런서
OpenStack 제공자에 대한 다음의 구성 옵션은 로드 밸런서와 관련이 있으며
`cloud.conf` 파일의 `[LoadBalancer]` 섹션에 있어야
한다.

* `lb-version` (선택): 자동 버전 감지를 대체하는 데 사용된다. 유효한
  값은 `v1` 또는 `v2` 이다. 값이 제공되지 않는 경우 자동 감지는
  기본 OpenStack 클라우드에 의해 제공되는 가장 최신의 지원되는 버전을
  선택한다.
* `use-octavia` (선택): Octavia LBaaS V2 서비스 카탈로그 엔드포인트를 찾고 사용할지의
  여부를 결정하는 데 사용된다. 유효한 값은 `true` 또는 `false` 이다.
  `true` 가 지정되고 Octaiva LBaaS V2 항목을 찾을 수 없는 경우,
  제공자는 폴백(fall back)하고 대신 Neutron LBaaS V2 엔드포인트를 찾으려고
  시도한다. 기본값은 `false` 이다.
* `subnet-id` (선택): 로드 밸런서를 생성하려는 서브넷의 id를
  지정하는 데 사용된다. Network > Networks 에서 찾을 수 있다. 해당
  네트워크를 클릭하여 서브넷을 가져온다.
* `floating-network-id` (선택): 지정된 경우, 로드 밸런서에 대한 유동 IP를
  생성한다.
* `lb-method` (선택): 로드 밸런서 풀(pool)의 멤버 간에 부하가
  분산되는 알고리즘을 지정하는 데 사용된다. 값은
  `ROUND_ROBIN`, `LEAST_CONNECTIONS` 또는 `SOURCE_IP` 가 될 수 있다. 지정되지
  않은 경우 기본 동작은 `ROUND_ROBIN` 이다.
* `lb-provider` (선택): 로드 밸런서의 제공자를 지정하는 데 사용된다.
  지정하지 않으면, neutron에 구성된 기본 제공자 서비스가
  사용된다.
* `create-monitor` (선택): Neutron 로드 밸런서에 대한 헬스 모니터를
  생성할지의 여부를 나타낸다. 유효한 값은 `true` 및 `false` 이다.
  기본값은 `false` 이다. `true` 가 지정되면 `monitor-delay`,
  `monitor-timeout` 및 `monitor-max-retries` 도 설정해야 한다.
* `monitor-delay` (선택): 로드 밸런서의 멤버에게 프로브(probe)를
  보내는 간격의 시간이다. 유효한 시간 단위를 지정해야 한다. 유효한 시간 단위는 "ns", "us"(또는 "µs"), "ms", "s", "m", "h"이다.
* `monitor-timeout` (선택): 모니터가 타임아웃 되기 전에 핑(ping) 응답을
  기다리는 최대 시간이다. 값은 지연 값보다 작아야
  한다. 유효한 시간 단위를 지정해야 한다. 유효한 시간 단위는 "ns", "us"(또는 "µs"), "ms", "s", "m", "h"이다.
* `monitor-max-retries` (선택): 로드 밸런서 멤버의 상태를 INACTIVE로
  변경하기 전에 허용되는 핑 오류 수이다. 1에서 10 사이의
  숫자여야 한다.
* `manage-security-groups` (선택): 로드 밸런서가 보안 그룹 규칙을
  자동으로 관리해야 하는지의 여부를 결정한다. 유효한 값은
  `true` 및 `false` 이다. 기본값은 `false` 이다. `true` 가 지정되면
  `node-security-group` 도 제공해야 한다.
* `node-security-group` (선택): 관리할 보안 그룹의 ID이다.

##### 블록 스토리지
OpenStack 제공자에 대한 다음의 구성 옵션은 블록 스토리지와 관련이 있으며
`cloud.conf` 파일의 `[BlockStorage]` 섹션에 있어야 한다.

* `bs-version` (선택): 자동 버전 감지를 대체하는 데 사용된다. 유효한
  값은 `v1`, `v2`, `v3` 및 `auto` 이다. `auto` 가 지정되면 자동
  감지는 기본 OpenStack 클라우드에 의해 노출되는 가장 최신의 지원되는
  버전을 선택한다. 제공되지 않은 경우 기본값은 `auto` 이다.
* `trust-device-path` (선택): 대부분의 시나리오에서 Cinder가 제공한
  블록 장치 이름(예: `/dev/vda`)을 신뢰할 수 없다. 이 부울은
  이 동작을 토글(toggle)한다. 이를 `true` 로 설정하면 Cinder에서 제공한
  블록 장치 이름을 신뢰하게 된다. 기본값인 `false` 는 일련 번호와
  `/dev/disk/by-id` 를 매핑하여 장치 경로를 검색하게 하며
  권장하는 방법이다.
* `ignore-volume-az` (선택): Cinder 볼륨을 연결할 때 가용 영역(availability zone)
  사용에 영향을 주기 위해 사용된다. Nova와 Cinder의 가용성
  영역이 서로 다른 경우, 이 값을 `true` 로 설정해야 한다. 이는 가장 일반적인 상황으로 Nova 가용 영역은
  많지만 Cinder는 하나의 가용 영역만 있는 경우이다.
  이전 릴리스에서 사용된 동작을 유지하기 위해 기본값은 `false`
  이지만, 나중에 변경될 수 있다.
* `node-volume-attach-limit` (선택): 노드에 연결할 수 있는
  최대 볼륨 수이다. 기본값은 cinder의 경우 256이다.

포트가 아닌 경로를 사용하여 엔드포인트를 구별하는 OpenStack
디플로이먼트에서 1.8 이하의 쿠버네티스 버전을 배포하는 경우
명시적으로 `bs-version` 파라미터를 설정해야 한다. 경로 기반의 엔드포인트는
`http://foo.bar/volume` 형식이며 포트 기반의 엔드포인트는
`http://foo.bar:xxx` 형식이다.

경로 기반의 엔드포인트를 사용하고 쿠버네티스가 이전 자동 감지 로직을 사용하는 환경에서는
볼륨 분리 시도 시 `BS API version autodetection failed.` 오류가
리턴된다. 이 문제를 해결하려면 클라우드 제공자 구성에
다음을 추가하여 Cinder API 버전 2를 강제로
사용할 수 있다.

```yaml
[BlockStorage]
bs-version=v2
```

##### 메타데이터
OpenStack 제공자에 대한 다음의 구성 옵션은 메타데이터와 관련이 있으며
`cloud.conf` 파일의 `[Metadata]` 섹션에 있어야 한다.

* `search-order` (선택): 이 구성 키는 실행되는 인스턴스와
  관련된 메타데이터를 제공자가 검색하는 방식에 영향을 준다. 기본값인
  `configDrive,metadataService` 를 사용할 수 있는 경우에 제공자가
  먼저 구성 드라이브에서 인스턴스와 관련된 메타데이터를
  검색한 다음 메타데이터 서비스를 검색하게 한다. 대체할 수 있는 값은 다음과 같다.
  * `configDrive` - 구성 드라이브에서 인스턴스 메타데이터만
    검색한다.
  * `metadataService` - 메타데이터 서비스에서 인스턴스 메타데이터만
    검색한다.
  * `metadataService,configDrive` - 사용할 수 있는 경우 먼저 메타데이터
    서비스에서 인스턴스 메타데이터를 검색한 다음, 구성 드라이브를 검색한다.

  구성 드라이브의 메타데이터는 시간이 지남에 따라
  오래될 수 있지만, 메타데이터 서비스는 항상 최신 뷰를 제공하므로
  이러한 설정은 바람직하다. 모든 OpenStack 클라우드가
  구성 드라이브와 메타데이터 서비스를 모두 제공하는 것은 아니며 하나 또는 다른 하나만
  사용할 수 있으므로 기본값은 둘 다를 확인하는 것이다.

##### 라우트

OpenStack 제공자에 대한 다음의 구성 옵션은 [kubenet]
쿠버네티스 네트워크 플러그인과 관련이 있으며 `cloud.conf` 파일의 `[Route]` 섹션에
있어야 한다.

* `router-id` (선택): 기본 클라우드의 Neutron 디플로이먼트가
  `extraroutes` 확장을 지원하는 경우 경로를 추가할 라우터를 지정하는 데 `router-id`
  를 사용한다. 선택한 라우터는 클러스터 노드를 포함하는 프라이빗 네트워크에
  걸쳐 있어야 한다(일반적으로 하나의 노드 네트워크만 있으며, 이 값은
  노드 네트워크의 기본 라우터여야 한다). 이 값은 OpenStack에서 [kubenet]을 사용하는 데
  필요하다.

[kubenet]: /ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/#kubenet



## OVirt

### 노드 이름

OVirt 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름을 사용한다.
참고로 쿠버네티스 노드 이름은 VM FQDN(Ovirt의 `<vm><guest_info><fqdn>...</fqdn></guest_info></vm>` 아래에서 보고된)과 일치해야 한다.

## Photon

### 노드 이름

Photon 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름을 사용한다.
참고로 쿠버네티스 노드 이름은 Photon VM 이름(또는 `--cloud-config` 에서 `overrideIP` 가 true로 설정된 경우, 쿠버네티스 노드 이름은 Photon VM IP 주소와 일치해야 함)과 일치해야 한다.

## vSphere

{{< tabs name="vSphere cloud provider" >}}
{{% tab name="vSphere 6.7U3 이상" %}}
vSphere 6.7U3 이상의 모든 vSphere 디플로이먼트의 경우, [vSphere CSI 드라이버](https://github.com/kubernetes-sigs/vsphere-csi-driver)와 함께 [외부 vSphere 클라우드 제공자](https://github.com/kubernetes/cloud-provider-vsphere)를 권장한다. 퀵스타트 가이드는 [CSI와 CPI를 사용하여 vSphere에 쿠버네티스 클러스터 배포하기](https://cloud-provider-vsphere.sigs.k8s.io/tutorials/kubernetes-on-vsphere-with-kubeadm.html)를 참고한다.
{{% /tab %}}
{{% tab name="vSphere 6.7U3 미만" %}}
vSphere 6.7U3 미만을 사용할 경우, 인-트리 vSphere 클라우드 제공자를 권장한다. 퀵스타트 가이드는 [kubeadm을 사용하여 vSphere에 쿠버네티스 클러스터 실행하기](https://cloud-provider-vsphere.sigs.k8s.io/tutorials/k8s-vcp-on-vsphere-with-kubeadm.html)를 참고한다.
{{% /tab %}}
{{< /tabs >}}

vSphere 클라우드 제공자에 대한 자세한 문서를 보려면, [vSphere 클라우드 제공자 문서 사이트](https://cloud-provider-vsphere.sigs.k8s.io)를 방문한다.

## IBM 클라우드 쿠버네티스 서비스

### 컴퓨트 노드
IBM 클라우드 쿠버네티스 서비스 제공자를 사용하면, 단일 영역 또는 하나의 리전에서 여러 영역에 걸쳐 가상 노드와 물리(베어 메탈) 노드가 혼합된 클러스터를 생성할 수 있다. 자세한 정보는, [클러스터와 워커(worker) 노드 설정 계획](https://cloud.ibm.com/docs/containers?topic=containers-planning_worker_nodes)을 참고한다.

쿠버네티스 노드 오브젝트의 이름은 IBM 클라우드 쿠버네티스 서비스 워커 노드 인스턴스의 프라이빗 IP 주소이다.

### 네트워킹
IBM 클라우드 쿠버네티스 서비스 제공자는 노드의 네트워크 성능 품질과 네트워크 격리를 위한 VLAN을 제공한다. 사용자 정의 방화벽 및 Calico 네트워크 폴리시를 설정하여 클러스터에 추가적인 보안 계층을 추가하거나 VPN을 통해 온-프레미스 데이터센터에 클러스터를 연결할 수 있다. 자세한 내용은 [클러스터 네트워킹 구성](https://cloud.ibm.com/docs/containers?topic=containers-plan_clusters)을 참고한다.

퍼블릭 또는 클러스터 내에서 앱을 노출하기 위해 노드포트(NodePort), 로드밸런서 또는 인그레스 서비스를 활용할 수 있다. 어노테이션을 사용하여 인그레스 애플리케이션 로드 밸런서를 커스터마이징 할 수도 있다. 자세한 내용은 [앱을 노출할 서비스 선택하기](https://cloud.ibm.com/docs/containers?topic=containers-cs_network_planning#cs_network_planning)을 참고한다.

### 스토리지
IBM 클라우드 쿠버네티스 서비스 제공자는 쿠버네티스-네이티브 퍼시스턴트 볼륨을 활용하여 사용자가 파일, 블록 및 클라우드 오브젝트 스토리지를 앱에 마운트할 수 있도록 한다. 데이터를 지속적으로 저장하기 위해 서비스로서의-데이터베이스(database-as-a-service)와 써드파티 애드온을 사용할 수도 있다. 자세한 정보는 [고가용성 퍼시스턴트 스토리지 계획](https://cloud.ibm.com/docs/containers?topic=containers-storage_planning#storage_planning)을 참고한다.

## Baidu 클라우드 컨테이너 엔진

### 노드 이름

Baidu 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 프라이빗 IP 주소를 사용한다.
참고로 쿠버네티스 노드 이름은 Baidu VM 프라이빗 IP와 일치해야 한다.

## Tencent 쿠버네티스 엔진

이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [TencentCloud/tencentcloud-cloud-controller-manager](https://github.com/TencentCloud/tencentcloud-cloud-controller-manager)이다.

### 노드 이름

Tencent 클라우드 제공자는 쿠버네티스 노드 오브젝트의 이름으로 노드의 (kubelet에 의해 결정되거나 `--hostname-override` 로 재정의된) 호스트 이름을 사용한다.
참고로 쿠버네티스 노드 이름은 Tencent VM 프라이빗 IP와 일치해야 한다.

## Alibaba 클라우드 쿠버네티스

 이 외부 클라우드 제공자를 사용하려는 경우, 해당 리포지터리는 [kubernetes/cloud-provider-alibaba-cloud](https://github.com/kubernetes/cloud-provider-alibaba-cloud)이다.

### 노드 이름

Alibaba 클라우드는 노드 이름의 형식을 요구하지는 않지만, kubelet은 `--provider-id=${REGION_ID}.${INSTANCE_ID}` 를 추가해야만 한다. 파라미터 `${REGION_ID}` 는 쿠버네티스의 지역 ID에 해당하고, `${INSTANCE_ID}` 는 Alibaba ECS (Elastic Compute Service) ID를 의미한다.

### 로드 밸런서

[어노테이션](https://www.alibabacloud.com/help/en/doc-detail/86531.htm)을 구성해서 Alibaba 클라우드의 특정 기능을 사용하도록 외부 로드 밸런서를 설정할 수 있다.
