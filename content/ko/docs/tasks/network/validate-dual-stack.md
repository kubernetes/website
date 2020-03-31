---
- reviewers:
- - lachie83
- - khenidak
min-kubernetes-server-version: v1.16
title: IPv4/IPv6 듀얼 스택 검증
content_template: templates/task
---

{{% capture overview %}}
이 문서는 IPv4/IPv6 듀얼 스택이 활성화 된 쿠버네티스 클러스터들을 어떻게 검증하는지 설명한다.
{{% /capture %}}

{{% capture prerequisites %}}

* 듀얼 스택 네트워킹을 위한 제공자 지원 (클라우드 제공자 또는 기타 제공자들은 라우팅 가능한 IPv4/IPv6 네트워크 인터페이스를 제공하는 쿠버네티스 노드들을 제공해야 한다.)
* 듀얼 스택을 지원하는 [네트워크 플러그인](/docs/concepts/extend-쿠버네티스/compute-storage-net/network-plugins/)  (예. 쿠베넷 또는 칼리코)
* IPVS 모드로 구동되는 Kube-proxy
* [듀얼 스택 기반](/docs/concepts/services-networking/듀얼 스택/) 클러스터

{{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## 어드래싱 검증

### 노드 어드래싱 검증

각 듀얼 스택 노드는 단일 IPv4 블록 및 단일 IPv6 블록을 할당받아야 한다. IPv4/IPv6 파드 주소 범위를 다음 커맨드를 통해 검증한다. 샘플 노드 이름을 클러스트 내 검증된 듀얼 스택 노드로 대체한다. 본 예제에서, 노드 이름은 `k8s-linuxpool1-34450317-0` 이다:

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```
```
10.244.1.0/24
a00:100::/24
```
단일 IPv4 블록과 단일 IPv6 블록이 할당되어야 한다.

노드가 IPv4 및 IPv6 인터페이스를 갖고 있는 것을 검증한다. (노드 이름을 클러스터에서 검증된 노드로 대체한다. 본 예제에서 노드 이름은 k8s-linuxpool1-34450317-0) 이다:
```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s \n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.240.0.5
InternalIP: 2001:1234:5678:9abc::5
```

### 파드 어드래싱 검증

파드가 IPv4 및 IPv6 주소를 할당받았는지 검증한다. (파드 이름을 클러스터에서 검증된 파드로 대체한다. 본 예제에서 파드 이름은 pod01 이다.)
```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s \n" .ip}}{{end}}'
```
```
10.244.1.4
a00:100::4
```

`status.podIPs` fieldPath를 통한 Downward API로 파드 IP들을 검증할 수도 있다. 다음 snippet은 컨테이너 내 `MY_POD_IPS` 라는 환경 변수를 통해 파드 IP들을 어떻게 도출할 수 있는지 보여준다.

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

다음 커맨드는 컨테이너 내 `MY_POD_IPS` 환경 변수의 값을 출력한다. 해당 값은 파드의 쉼표로 구분된 리스트이며 IPv4 및 IPv6 주소를 나타낸다.
```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```
```
MY_POD_IPS=10.244.1.4,a00:100::4
```

파드의 IP 주소는 또한 컨테이너 내 `/etc/hosts` 에 적힐 것이다. 다음 커맨드는 듀얼 스택 파드의 `/etc/hosts` 에 cat을 실행시킨다. 출력 값을 통해 파드의 IPv4 및 IPv6 주소 모두 검증할 수 있다.

```shell
kubectl exec -it pod01 -- cat /etc/hosts
```
```
# Kubernetes-managed hosts file.
127.0.0.1    localhost
::1    localhost ip6-localhost ip6-loopback
fe00::0    ip6-localnet
fe00::0    ip6-mcastprefix
fe00::1    ip6-allnodes
fe00::2    ip6-allrouters
10.244.1.4    pod01
a00:100::4    pod01
```

## 서비스 검증

`ipFamily` 필드 세트 없이 다음 서비스를 생성한다. 필드가 구성되지 않았으면 서비스는 kube-controller-manager의 `--service-cluster-ip-range` 플래그를 통해 설정된 범위 내 첫 IP를 할당 받는다.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

해당 서비스의 YAML 결과를 통해 서비스의 `ipFamily` 필드가 kub-controller-manager의 `--service-cluster-ip-range` 플래그를 통해 설정된 범위 내 첫 IP를 할당 받도록 설정되었음을 확인할 수 있다.

```shell
kubectl get svc my-service -o yaml
```

```yaml
apiVersion: v1
kind: Service
metadata:
  creationTimestamp: "2019-09-03T20:45:13Z"
  labels:
    app: MyApp
  name: my-service
  namespace: default
  resourceVersion: "485836"
  selfLink: /api/v1/namespaces/default/services/my-service
  uid: b6fa83ef-fe7e-47a3-96a1-ac212fa5b030
spec:
  clusterIP: 10.0.29.179
  ipFamily: IPv4
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

`ipFamily` 필드를 `IPv6`로 설정하여 다음 서비스 생성한다.

{{< codenew file="service/networking/듀얼 스택-ipv6-svc.yaml" >}}

서비스가 IPv6 주소 블록에서 클러스터 IP 주소를 할당받는 것을 검증한다. 그리고 나서 IP 및 포트로 서비스 접근이 가능한지 검증할 수 있다.
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   fe80:20d::d06b   <none>        80/TCP    9s
```

### 듀얼 스택 로드 밸런싱 서비스 생성

만약 클라우드 제공자가 IPv6 기반 외부 로드 밸런서 구성을 지원한다면 `ipFamily` 필드를 `IPv6`로 설정하고 `type` 필드를 `LoadBalancer` 로 설정하여 다음 서비스를 생성한다.

{{< codenew file="service/networking/듀얼 스택-ipv6-lb-svc.yaml" >}}

서비스가 IPv6 주소 블록에서 `CLUSTER-IP` 주소 및 `EXTERNAL-IP` 주소를 할당받는지 검증한다. 그리고 나서 IP 및 포트로 서비스 접근이 가능한지 검증할 수 있다.
```
 kubectl get svc -l app=MyApp
NAME         TYPE        CLUSTER-IP       EXTERNAL-IP                     PORT(S)        AGE
my-service   ClusterIP   fe80:20d::d06b   2001:db8:f100:4002::9d37:c0d7   80:31868/TCP   30s
```

{{% /capture %}}
