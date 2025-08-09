---
min-kubernetes-server-version: v1.29
title: 서비스 IP 범위 확장
content_type: task
---

<!-- overview -->
{{< feature-state feature_gate_name="MultiCIDRServiceAllocator" >}}

이 문서는 클러스터에 할당된 기존 서비스 IP 범위를 확장하는 방법을 설명한다.

## {{% heading "prerequisites" %}}

{{< include "task-tutorial-prereqs.md" >}}

{{< version-check >}}

{{< note >}}
이 기능은 이전 버전에서도 사용할 수 있지만, v1.33부터 GA로 제공되며 공식 지원한다.
{{< /note >}}

<!-- steps -->

## 서비스 IP 확장 범위

`MultiCIDRServiceAllocator` [기능 게이트](/docs/reference/command-line-tools-reference/feature-gates/)가 활성화되고  
`networking.k8s.io/v1beta1` API 그룹이 활성화된 kube-apiserver를 사용하는 쿠버네티스 클러스터는  
`kubernetes`라는 이름의 ServiceCIDR 오브젝트를 생성하며,
이는 kube-apiserver의 `--service-cluster-ip-range` 커맨드라인 인자 값에 기반하여 IP 주소 범위를 지정한다.

```sh
kubectl get servicecidr
```

```
NAME         CIDRS          AGE
kubernetes   10.96.0.0/28   17d
```

잘 알려진 `kubernetes` 서비스는 파드에 kube-apiserver 엔드포인트를 노출하며,
기본 ServiceCIDR 범위에서 첫 번째 IP 주소를 계산해
해당 주소를 자신의 cluster IP로 사용한다.

```sh
kubectl get service kubernetes
```

```
NAME         TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
kubernetes   ClusterIP   10.96.0.1    <none>        443/TCP   17d
```

이 경우 기본 서비스는 10.96.0.1 ClusterIP 를 사용하며, 해당 IP에 대응하는 IPAddress 오브젝트가 존재한다.

```sh
kubectl get ipaddress 10.96.0.1
```

```
NAME        PARENTREF
10.96.0.1   services/default/kubernetes
```

ServiceCIDR는 {{<glossary_tooltip text="finalizers" term_id="finalizer">}}로 보호되어
서비스 ClusterIP 가 고아 상태로 남는 것을 방지한다. 파이널라이저(finalizer)는 기존 IPAddress를 포함하는 다른 서브넷이 있거나,
해당 서브넷에 속한 IPAddress가 전혀 없을 때만 제거된다.

## 서비스에 사용 가능한 IP 수 확장

사용자가 서비스에 사용 가능한 주소 수를 늘려야 하는 경우가 있다,
이전에는 서비스 범위를 늘리는 작업이 데이터 손실을 초래할 수 있는 파괴적인 작업이었다.
새로운 기능에서는 사용자가 ServiceCIDR을 추가하는 것만으로 사용 가능한 주소를 늘릴 수 있다.

### 새로운 ServiceCIDR 추가

서비스 범위가 10.96.0.0/28인 클러스터에서는 2^(32-28) - 2 = 14개의 IP 주소만 사용할 수 있다.
`kubernetes.default` 서비스는 항상 생성되므로, 이 예시에서는 실제로 13개의 서비스만 만들 수 있다.

```sh
for i in $(seq 1 13); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.11
10.96.0.5
10.96.0.12
10.96.0.13
10.96.0.14
10.96.0.2
10.96.0.3
10.96.0.4
10.96.0.6
10.96.0.7
10.96.0.8
10.96.0.9
error: failed to create ClusterIP service: Internal error occurred: failed to allocate a serviceIP: range is full
```

서비스에서 사용할 수 있는 IP 주소의 개수를 늘리려면,
IP 주소 범위를 확장하거나 새로운 범위를 추가하는 새 ServiceCIDR을 생성하면 된다.

```sh
cat <EOF | kubectl apply -f -
apiVersion: networking.k8s.io/v1beta1
kind: ServiceCIDR
metadata:
  name: newcidr1
spec:
  cidrs:
  - 10.96.0.0/24
EOF
```

```
servicecidr.networking.k8s.io/newcidr1 created
```

그러면 이 새로운 범위에서 선택된 ClusterIP 를 사용하는 새 서비스를 생성할 수 있다.

```sh
for i in $(seq 13 16); do kubectl create service clusterip "test-$i" --tcp 80 -o json | jq -r .spec.clusterIP; done
```

```
10.96.0.48
10.96.0.200
10.96.0.121
10.96.0.144
```

### ServiceCIDR 삭제

해당 ServiceCIDR에 의존하는 IPAddresses가 존재하는 경우 해당 ServiceCIDR을 삭제할 수 없다.

```sh
kubectl delete servicecidr newcidr1
```

```
servicecidr.networking.k8s.io "newcidr1" deleted
```

쿠버네티스는 이러한 종속 관계를 추적하기 위해 ServiceCIDR에 파이널라이저(finalizer)를 사용한다.

```sh
kubectl get servicecidr newcidr1 -o yaml
```

```yaml
apiVersion: networking.k8s.io/v1beta1
kind: ServiceCIDR
metadata:
  creationTimestamp: "2023-10-12T15:11:07Z"
  deletionGracePeriodSeconds: 0
  deletionTimestamp: "2023-10-12T15:12:45Z"
  finalizers:
  - networking.k8s.io/service-cidr-finalizer
  name: newcidr1
  resourceVersion: "1133"
  uid: 5ffd8afe-c78f-4e60-ae76-cec448a8af40
spec:
  cidrs:
  - 10.96.0.0/24
status:
  conditions:
  - lastTransitionTime: "2023-10-12T15:12:45Z"
    message: There are still IPAddresses referencing the ServiceCIDR, please remove
      them or create a new ServiceCIDR
    reason: OrphanIPAddress
    status: "False"
    type: Ready
```

ServiceCIDR 삭제를 막고 있는 IP 주소를 포함한 서비스를 삭제함으로써

```sh
for i in $(seq 13 16); do kubectl delete service "test-$i" ; done
```

```
service "test-13" deleted
service "test-14" deleted
service "test-15" deleted
service "test-16" deleted
```

컨트롤 플레인은 해당 서비스가 삭제된 것을 감지한다. 컨트롤 플레인은 파이널라이저(finalizer)를 삭제하고,
이로써 삭제 대기 상태였던 ServiceCIDR이 실제로 삭제된다.

```sh
kubectl get servicecidr newcidr1
```

```
Error from server (NotFound): servicecidrs.networking.k8s.io "newcidr1" not found
```

## 쿠버네티스 ServiceCIDR 정책

클러스터 관리자는 클러스터 내에서 ServiceCIDR 리소스의 생성과 수정을 제어하는 정책을 구현할 수 있다.
이렇게 하면 서비스에서 사용하는 IP 주소 범위를 중앙에서 관리할 수 있으며, 의도하지 않은 구성이나 충돌하는 구성을 방지하는 데 도움이 된다.
쿠버네티스는 이러한 규칙을 강제하기 위해 Validating Admission Policy와 같은 메커니즘을 제공한다.

### Validating Admission Policy로 무단 ServiceCIDR 생성/수정 방지

클러스터 관리자는 허용할 수 있는 범위를 제한하거나, 클러스터 서비스 IP 범위에 대한 
변경을 완전히 차단하고자 하는 상황이 있을 수 있다.

{{< note >}}
기본 "kubernetes" ServiceCIDR는 클러스터의 일관성을 유지하기 위해 kube-apiserver에서 생성되며,
클러스터가 동작하기 위해 필요하므로 항상 허용되어야 한다.
`ValidatingAdmissionPolicy`가 기본 ServiceCIDR을 제한하지 않도록 하려면,
다음과 같이 절을 추가하면 된다.

```yaml
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
```

아래 예시에서처럼 적용할 수 있다.
{{</ note >}}

#### 특정 범위로 ServiceCIDR 제한

다음은 `allowed`로 지정한 범위의 서브넷인 경우에만 ServiceCIDR을 생성할 수 있도록 허용하는 `ValidatingAdmissionPolicy` 예시이다.
(예를 들어, 이 정책에서는 `cidrs: ['10.96.1.0/24']` 또는
`cidrs: ['2001:db8:0:0:ffff::/80', '10.96.0.0/20']`를 가진 ServiceCIDR은 허용되지만,
`cidrs: ['172.20.0.0/16']`를 가진 ServiceCIDR은 허용되지 않는다.)
이 정책을 복사하여 환경에 맞게 `allowed` 값을 변경해 사용할 수 있다.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.default"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1","v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  matchConditions:
  - name: 'exclude-default-servicecidr'
    expression: "object.metadata.name != 'kubernetes'"
  variables:
  - name: allowed
    expression: "['10.96.0.0/16','2001:db8::/64']"
  validations:
  - expression: "object.spec.cidrs.all(newCIDR, variables.allowed.exists(allowedCIDR, cidr(allowedCIDR).containsCIDR(newCIDR)))"
  # For all CIDRs (newCIDR) listed in the spec.cidrs of the submitted ServiceCIDR
  # object, check if there exists at least one CIDR (allowedCIDR) in the `allowed`
  # list of the VAP such that the allowedCIDR fully contains the newCIDR.
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-binding"
spec:
  policyName: "servicecidrs.default"
  validationActions: [Deny,Audit]
```

자체 검증 `expression`을 작성하려면
[CEL documentation](https://kubernetes.io/docs/reference/using-api/cel/)를 참고하면 된다.

#### ServiceCIDR API 사용 전면 제한

아래 예시는 기본 "kubernetes" ServiceCIDR을 제외하고,
새로운 ServiceCIDR 범위 생성을 제한하기 위해 `ValidatingAdmissionPolicy`와 해당 바인딩을 사용하는 방법을 보여준다.

```yaml
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicy
metadata:
  name: "servicecidrs.deny"
spec:
  failurePolicy: Fail
  matchConstraints:
    resourceRules:
    - apiGroups:   ["networking.k8s.io"]
      apiVersions: ["v1","v1beta1"]
      operations:  ["CREATE", "UPDATE"]
      resources:   ["servicecidrs"]
  validations:
  - expression: "object.metadata.name == 'kubernetes'"
---
apiVersion: admissionregistration.k8s.io/v1
kind: ValidatingAdmissionPolicyBinding
metadata:
  name: "servicecidrs-deny-binding"
spec:
  policyName: "servicecidrs.deny"
  validationActions: [Deny,Audit]
```
