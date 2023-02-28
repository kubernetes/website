---
# reviewers:
# - lachie83
# - khenidak
# - bridgetkromhout
min-kubernetes-server-version: v1.23
title: IPv4/IPv6 이중 스택 검증
content_type: task
---

<!-- overview -->
이 문서는 IPv4/IPv6 이중 스택이 활성화된 쿠버네티스 클러스터들을 어떻게 검증하는지 설명한다.


## {{% heading "prerequisites" %}}


* 이중 스택 네트워킹을 위한 제공자 지원 (클라우드 제공자 또는 기타 제공자들은 라우팅 가능한 IPv4/IPv6 네트워크 인터페이스를 제공하는 쿠버네티스 노드들을 제공해야 한다.)
* 이중 스택 네트워킹을 지원하는 [네트워크 플러그인](/ko/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
* [이중 스택 활성화](/ko/docs/concepts/services-networking/dual-stack/) 클러스터

{{< version-check >}}

{{< note >}}
v1.23 이전 버전에서도 검증을 수행할 수 있지만 GA 기능으로만 제공되며, v1.23부터 공식적으로 지원된다.
{{< /note >}}


<!-- steps -->

## 어드레싱 검증

### 노드 어드레싱 검증

각각의 이중 스택 노드는 단일 IPv4 블록 및 단일 IPv6 블록을 할당받아야 한다. IPv4/IPv6 파드 주소 범위를 다음 커맨드를 실행하여 검증한다. 샘플 노드 이름을 클러스터 내 검증된 이중 스택 노드로 대체한다. 본 예제에서, 노드 이름은 `k8s-linuxpool1-34450317-0` 이다.

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .spec.podCIDRs}}{{printf "%s\n" .}}{{end}}'
```
```
10.244.1.0/24
2001:db8::/64
```
단일 IPv4 블록과 단일 IPv6 블록이 할당되어야 한다.

노드가 IPv4 및 IPv6 인터페이스를 가지고 있는지 검증한다. 노드 이름을 클러스터의 검증된 노드로 대체한다. 본 예제에서 노드 이름은 `k8s-linuxpool1-34450317-0` 이다.

```shell
kubectl get nodes k8s-linuxpool1-34450317-0 -o go-template --template='{{range .status.addresses}}{{printf "%s: %s\n" .type .address}}{{end}}'
```
```
Hostname: k8s-linuxpool1-34450317-0
InternalIP: 10.0.0.5
InternalIP: 2001:db8:10::5
```

### 파드 어드레싱 검증

파드가 IPv4 및 IPv6 주소를 할당받았는지 검증한다. 파드 이름을 클러스터에서 검증된 파드로 대체한다. 본 예제에서 파드 이름은 `pod01` 이다.

```shell
kubectl get pods pod01 -o go-template --template='{{range .status.podIPs}}{{printf "%s\n" .ip}}{{end}}'
```
```
10.244.1.4
2001:db8::4
```

`status.podIPs` fieldPath를 통한 다운워드(downward) API로 파드 IP들을 검증할 수도 있다. 다음 스니펫은 컨테이너 내 `MY_POD_IPS` 라는 환경 변수를 통해 파드 IP들을 어떻게 노출시킬 수 있는지 보여준다.

```
        env:
        - name: MY_POD_IPS
          valueFrom:
            fieldRef:
              fieldPath: status.podIPs
```

다음 커맨드는 컨테이너 내 `MY_POD_IPS` 환경 변수의 값을 출력한다. 해당 값은 파드의 IPv4 및 IPv6 주소를 나타내는 쉼표로 구분된 목록이다.

```shell
kubectl exec -it pod01 -- set | grep MY_POD_IPS
```
```
MY_POD_IPS=10.244.1.4,2001:db8::4
```

파드의 IP 주소는 또한 컨테이너 내 `/etc/hosts` 에 적힐 것이다. 다음 커맨드는 이중 스택 파드의 `/etc/hosts` 에 cat을 실행시킨다. 출력 값을 통해 파드의 IPv4 및 IPv6 주소 모두 검증할 수 있다.

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
2001:db8::4    pod01
```

## 서비스 검증

`.spec.ipFamilyPolicy` 를 명시적으로 정의하지 않은 다음의 서비스를 생성한다. 쿠버네티스는 처음 구성된 `service-cluster-ip-range` 에서 서비스에 대한 클러스터 IP를 할당하고 `.spec.ipFamilyPolicy` 를 `SingleStack` 으로 설정한다.

{{< codenew file="service/networking/dual-stack-default-svc.yaml" >}}

`kubectl` 을 사용하여 서비스의 YAML을 확인한다.

```shell
kubectl get svc my-service -o yaml
```

이 서비스에서 `.spec.ipFamilyPolicy` 를 `SingleStack` 으로 설정하고 `.spec.clusterIP` 를 kube-controller-manager의 `--service-cluster-ip-range` 플래그를 통해 설정된 첫 번째 구성 범위에서 IPv4 주소로 설정한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: my-service
  namespace: default
spec:
  clusterIP: 10.0.217.164
  clusterIPs:
  - 10.0.217.164
  ipFamilies:
  - IPv4
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 9376
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

`.spec.ipFamilies` 의 첫 번째 배열 요소로 `IPv6` 을 명시적으로 정의하는 다음 서비스를 생성한다. Kubernetes는 `service-cluster-ip-range`로 구성된 IPv6 범위에서 서비스용 클러스터 IP를 할당하고 `.spec.ipFamilyPolicy` 를 `SingleStack` 으로 설정한다.

{{< codenew file="service/networking/dual-stack-ipfamilies-ipv6.yaml" >}}

`kubectl` 를 사용하여 서비스의 YAML을 확인한다.

```shell
kubectl get svc my-service -o yaml
```

이 서비스에서 `.spec.ipFamilyPolicy` 를 `SingleStack` 으로 설정하고 `.spec.clusterIP` 를 kube-controller-manager의 `--service-cluster-ip-range` 플래그를 통해 설정된 IPv6 범위에서 IPv6 주소로 설정한다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app.kubernetes.io/name: MyApp
  name: my-service
spec:
  clusterIP: 2001:db8:fd00::5118
  clusterIPs:
  - 2001:db8:fd00::5118
  ipFamilies:
  - IPv6
  ipFamilyPolicy: SingleStack
  ports:
  - port: 80
    protocol: TCP
    targetPort: 80
  selector:
    app.kubernetes.io/name: MyApp
  sessionAffinity: None
  type: ClusterIP
status:
  loadBalancer: {}
```

`PreferDualStack` 에 `.spec.ipFamilyPolicy` 을 명시적으로 정의하는 다음 서비스를 생성한다. 쿠버네티스는 IPv4 및 IPv6 주소를 모두 할당하고 (이 클러스터에는 이중 스택을 사용하도록 설정되었으므로) `.spec.ipFamilies` 배열에 있는 첫 번째 요소의 주소 계열을 기반으로`.spec.ClusterIP` 목록에서 `.spec.ClusterIPs` 를 선택한다.

{{< codenew file="service/networking/dual-stack-preferred-svc.yaml" >}}

{{< note >}}
`kubectl get svc` 명령어는 오직 `CLUSTER-IP` 필드에 주요 IP만 표시한다.

```shell
 kubectl get svc -l app.kubernetes.io/name: MyApp

NAME         TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-service   ClusterIP   10.0.216.242   <none>        80/TCP    5s
```
{{< /note >}}

서비스가 `kubectl describe` 를 사용하여 IPv4 및 IPv6 주소 블록에서 클러스터 IP를 가져오는지 확인한다. 그런 다음 IP 및 포트를 통해 서비스에 대한 접속을 확인할 수 있다.

```shell
kubectl describe svc -l app.kubernetes.io/name: MyApp
```

```
Name:              my-service
Namespace:         default
Labels:            app.kubernetes.io/name: MyApp
Annotations:       <none>
Selector:          app.kubernetes.io/name: MyApp
Type:              ClusterIP
IP Family Policy:  PreferDualStack
IP Families:       IPv4,IPv6
IP:                10.0.216.242
IPs:               10.0.216.242,2001:db8:fd00::af55
Port:              <unset>  80/TCP
TargetPort:        9376/TCP
Endpoints:         <none>
Session Affinity:  None
Events:            <none>
```

### 이중 스택 로드 밸런싱 서비스 생성

만약 클라우드 제공자가 IPv6 기반 외부 로드 밸런서 구성을 지원한다면 `.spec.ipFamilyPolicy` 의 `PreferDualStack` 과 `.spec.ipFamilies` 배열의 첫 번째 요소로 `IPv6` 및 `LoadBalancer` 로 설정된 `type` 필드를 사용하여 다음 서비스를 생성한다.

{{< codenew file="service/networking/dual-stack-prefer-ipv6-lb-svc.yaml" >}}

Check the Service:

```shell
kubectl get svc -l app.kubernetes.io/name: MyApp
```

서비스가 IPv6 주소 블록에서 `CLUSTER-IP` 주소 및 `EXTERNAL-IP` 주소를 할당받는지 검증한다. 그리고 나서 IP 및 포트로 서비스 접근이 가능한지 검증할 수 있다.

```shell
NAME         TYPE           CLUSTER-IP            EXTERNAL-IP        PORT(S)        AGE
my-service   LoadBalancer   2001:db8:fd00::7ebc   2603:1030:805::5   80:30790/TCP   35s
```


