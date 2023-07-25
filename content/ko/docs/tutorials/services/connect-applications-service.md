---
# reviewers:
# - caesarxuchao
# - lavalamp
# - thockin
title: 서비스와 애플리케이션 연결하기
content_type: tutorial
weight: 20
---


<!-- overview -->

## 컨테이너 연결을 위한 쿠버네티스 모델

지속적으로 실행중이고, 복제된 애플리케이션을 가지고 있다면 네트워크에 노출할 수 있다.

쿠버네티스는 파드가 배치된 호스트와는 무관하게 다른 파드와 통신할 수 있다고 가정한다. 쿠버네티스는 모든 파드에게 자체 클러스터-프라이빗 IP 주소를 제공하기 때문에 파드간에 명시적으로 링크를 만들거나 컨테이너 포트를 호스트 포트에 매핑할 필요가 없다. 이것은 파드 내의 컨테이너는 모두 로컬호스트(localhost)에서 서로의 포트에 도달할 수 있으며 클러스터의 모든 파드는 NAT 없이 서로를 볼 수 있다는 의미이다. 이 문서의 나머지 부분에서는 이러한 네트워킹 모델에서 신뢰할 수 있는 서비스를 실행하는 방법에 대해 자세히 설명할 것이다.

이 튜토리얼은 간단한 nginx 서버를 사용하여 개념을 시연한다.

<!-- body -->

## 파드를 클러스터에 노출하기

이 작업은 이전 예시에서 수행해 보았지만, 네트워킹 관점을 중점에 두고 다시 한번 수행해 보자.
nginx 파드를 생성하고, 해당 파드에 컨테이너 포트 사양이 있는 것을 참고한다.

{{< codenew file="service/networking/run-my-nginx.yaml" >}}

이렇게 하면 클러스터의 모든 노드에서 접근할 수 있다. 파드를 실행 중인 노드를 확인한다.

```shell
kubectl apply -f ./run-my-nginx.yaml
kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE       IP            NODE
my-nginx-3800858182-jr4a2   1/1       Running   0          13s       10.244.3.4    kubernetes-minion-905m
my-nginx-3800858182-kna2y   1/1       Running   0          13s       10.244.2.5    kubernetes-minion-ljyd
```

파드의 IP를 확인한다.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.4]]
    [map[ip:10.244.2.5]]
```

이제 클러스터의 모든 노드로 ssh 접속하거나 `curl`과 같은 도구를 사용하여 두 IP 주소에 질의를 전송할 수 있을 것이다. 컨테이너는 노드의 포트 80을 사용하지 *않으며* , 트래픽을 파드로 라우팅하는 특별한 NAT 규칙도 없다는 것을 참고한다. 이것은 동일한 `containerPort`를 사용하여 동일한 노드에서 여러 nginx 파드를 실행하는 것이 가능하고, 또한 서비스에 할당된 IP 주소를 사용하여 클러스터의 다른 파드나 노드에서 접근할 수 있다는 의미이다. 호스트 노드의 특정 포트를 배후(backing) 파드로 포워드하고 싶다면, 가능은 하지만 네트워킹 모델을 사용하면 그렇게 할 필요가 없어야 한다.


만약 궁금하다면 [쿠버네티스 네트워킹 모델](/ko/docs/concepts/cluster-administration/networking/#쿠버네티스-네트워크-모델)을 자세히 읽어본다.

## 서비스 생성하기

이제 우리에게는 플랫(flat)하고 클러스터 전역에 걸치는 주소 공간에서 실행되고 있는 nginx 파드가 있다. 이론적으로는 이러한 파드와 직접 대화할 수 있지만, 노드가 죽으면 어떻게 되는가? 파드가 함께 죽으면 디플로이먼트에서 다른 IP를 가진 새로운 파드를 생성한다. 이 문제를 해결하는 것이 바로 서비스이다.

쿠버네티스 서비스는 클러스터 어딘가에서 실행되는 논리적인 파드 집합을 정의하고 추상화함으로써 모두 동일한 기능을 제공한다. 생성시 각 서비스에는 고유한 IP 주소(clusterIP라고도 한다)가 할당된다. 이 주소는 서비스의 수명과 연관되어 있으며, 서비스가 활성화 되어 있는 동안에는 변경되지 않는다. 파드는 서비스와 통신하도록 구성할 수 있으며, 서비스와의 통신은 서비스의 맴버 중 일부 파드에 자동적으로 로드-밸런싱 된다.

`kubectl expose` 를 사용해서 2개의 nginx 레플리카에 대한 서비스를 생성할 수 있다.

```shell
kubectl expose deployment/my-nginx
```
```
service/my-nginx exposed
```

이것은 다음 yaml 파일을 `kubectl apply -f` 로 실행한 것과 동일하다.

{{< codenew file="service/networking/nginx-svc.yaml" >}}

이 사양은 `run: my-nginx` 레이블이 부착된 모든 파드에 TCP 포트 80을
대상으로 하는 서비스를 만들고 추상화된 서비스 포트에 노출시킨다
(`targetPort` 는 컨테이너가 트래픽을 수신하는 포트, `port` 는
추상화된 서비스 포트로 다른 파드들이 서비스에 접속하기위해 사용하는
모든 포트일 수 있다).
[서비스](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#service-v1-core)의
API 오브젝트를 보고 서비스 정의에서 지원되는 필드 목록을 확인한다.
서비스를 확인한다.

```shell
kubectl get svc my-nginx
```
```
NAME       TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
my-nginx   ClusterIP   10.0.162.149   <none>        80/TCP    21s
```

앞에서 언급한 바와 같이, 서비스 밑에는 여러 파드들이 있다. 
이 파드들은 
{{<glossary_tooltip term_id="endpoint-slice" text="엔드포인트슬라이스(EndpointSlice)">}}를 
통해 노출된다. 해당 서비스의 셀렉터는 지속적으로 평가되고, 그 결과는 
{{< glossary_tooltip text="레이블" term_id="label" >}}을 사용하여 
서비스에 연결된 엔드포인트슬라이스로 POST된다. 
파드가 죽으면, 해당 파드를 엔드포인트로 갖는 엔드포인트슬라이스에서 자동으로 제거된다. 
신규 파드가 특정 서비스의 셀렉터에 매치되면 
해당 서비스를 위한 엔드포인트슬라이스에 자동으로 추가된다. 
엔드포인트를 확인해 보면, 
IP가 첫 번째 단계에서 생성된 파드의 IP와 동일하다는 것을 알 수 있다.

```shell
kubectl describe svc my-nginx
```
```
Name:                my-nginx
Namespace:           default
Labels:              run=my-nginx
Annotations:         <none>
Selector:            run=my-nginx
Type:                ClusterIP
IP:                  10.0.162.149
Port:                <unset> 80/TCP
Endpoints:           10.244.2.5:80,10.244.3.4:80
Session Affinity:    None
Events:              <none>
```
```shell
kubectl get ep my-nginx
```
```
NAME       ENDPOINTS                     AGE
my-nginx   10.244.2.5:80,10.244.3.4:80   1m
```

이제 클러스터의 모든 노드에서 `<CLUSTER-IP>:<PORT>` 로 nginx 서비스를
curl을 할 수 있을 것이다. 서비스 IP는 완전히 가상이므로 외부에서는 절대로 연결되지
않음에 참고한다. 만약 이것이 어떻게 작동하는지 궁금하다면
[서비스 프록시](/ko/docs/concepts/services-networking/service/#가상-ip와-서비스-프록시)에 대해 더 읽어본다.

## 서비스에 접근하기

쿠버네티스는 서비스를 찾는 두 가지 기본 모드인 환경 변수와 DNS를
지원한다. 전자는 기본적으로 작동하지만 후자는
[CoreDNS 클러스터 애드온](https://releases.k8s.io/v{{< skew currentPatchVersion >}}/cluster/addons/dns/coredns)이 필요하다.
{{< note >}}
만약 서비스 환경 변수가 필요하지 않은 경우(소유한 프로그램과의 예상되는 충돌 가능성,
처리할 변수가 너무 많은 경우, DNS만 사용하는 경우 등) [파드 사양](/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#pod-v1-core)에서
`enableServiceLinks` 플래그를 `false` 로 설정하면 이 모드를 비활성화할 수 있다.
{{< /note >}}


### 환경 변수

파드가 노드에서 실행될 때 kubelet은 각기 활성화된 서비스에 대해 일련의 환경
변수 집합을 추가한다. 이것은 순서 문제를 야기한다. 이유를 확인하려면
실행 중인 nginx 파드 환경을 점검해야 한다(실제 사용자의 파드 이름은 다를 것이다).

```shell
kubectl exec my-nginx-3800858182-jr4a2 -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_HOST=10.0.0.1
KUBERNETES_SERVICE_PORT=443
KUBERNETES_SERVICE_PORT_HTTPS=443
```

서비스에 대한 언급이 없다는 것에 참고해야 한다. 이것은 서비스 이전에 레플리카를
생성했기 때문이다. 이 작업을 수행할 때 또 다른 단점은 스케줄러가 두 파드를
모두 동일한 머신에 배치할 수도 있다는 것이며, 이로 인해 전체 서비스가 중단될 수
있다. 두개의 파드를 죽이고 디플로이먼트가 파드를 재생성하기를 기다리는 것으로
이를 정상화 할 수 있다. 이번에는 서비스가 레플리카들 *전* 에
존재한다. 이렇게 하면 올바른 환경 변수뿐만 아니라 파드의 스케줄러-수준의
서비스 분배(모든 노드에 동일한 용량이 제공되는 경우)가
된다.

```shell
kubectl scale deployment my-nginx --replicas=0; kubectl scale deployment my-nginx --replicas=2;

kubectl get pods -l run=my-nginx -o wide
```
```
NAME                        READY     STATUS    RESTARTS   AGE     IP            NODE
my-nginx-3800858182-e9ihh   1/1       Running   0          5s      10.244.2.7    kubernetes-minion-ljyd
my-nginx-3800858182-j4rm4   1/1       Running   0          5s      10.244.3.8    kubernetes-minion-905m
```

파드가 죽고 재생성되었기 때문에 다른 이름을 가지는 것을 알 수 있다.

```shell
kubectl exec my-nginx-3800858182-e9ihh -- printenv | grep SERVICE
```
```
KUBERNETES_SERVICE_PORT=443
MY_NGINX_SERVICE_HOST=10.0.162.149
KUBERNETES_SERVICE_HOST=10.0.0.1
MY_NGINX_SERVICE_PORT=80
KUBERNETES_SERVICE_PORT_HTTPS=443
```

### DNS

쿠버네티스는 DNS 클러스터 애드온 서비스를 제공하며 dns 이름을 다른 서비스에 자동으로 할당한다. 다음 명령어로 이것이 클러스터에서 실행 중인지 확인할 수 있다.

```shell
kubectl get services kube-dns --namespace=kube-system
```
```
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)         AGE
kube-dns   ClusterIP   10.0.0.10    <none>        53/UDP,53/TCP   8m
```

이 섹션의 나머지 부분에서는 수명이 긴 IP의 서비스(my-nginx)와 이 IP
에 이름을 할당한 DNS 서버가 있다고 가정한다. 여기서는 CoreDNS 클러스터 애드온(애플리케이션 이름 `kube-dns`)을 사용하므로, 표준 방법(예: `gethostbyname()`)을 사용해서 클러스터의 모든 파드에서 서비스와 통신할 수 있다. 만약 CoreDNS가 실행 중이 아니라면 [CoreDNS README](https://github.com/coredns/deployment/tree/master/kubernetes) 또는 [CoreDNS 설치](/ko/docs/tasks/administer-cluster/coredns/#coredns-설치)를 참조해서 활성화 할 수 있다. 이것을 테스트하기 위해 다른 curl 애플리케이션을 실행한다.

```shell
kubectl run curl --image=radial/busyboxplus:curl -i --tty
```
```
Waiting for pod default/curl-131556218-9fnch to be running, status is Pending, pod ready: false
Hit enter for command prompt
```

이제, `nslookup my-nginx` 를 입력하고 실행한다:

```shell
[ root@curl-131556218-9fnch:/ ]$ nslookup my-nginx
Server:    10.0.0.10
Address 1: 10.0.0.10

Name:      my-nginx
Address 1: 10.0.162.149
```

## 서비스 보안

지금까지는 클러스터 내부에서만 ngnix 서버에 엑세스 해왔다. 서비스를 인터넷에 공개하기 전에 통신 채널이 안전한지 확인해야 한다. 이를 위해선 다음이 필요하다.

* https에 대한 자체 서명한 인증서 (신원 인증서를 가지고 있지 않은 경우)
* 인증서를 사용하도록 구성된 nginx 서버
* 파드에 접근할 수 있는 인증서를 만드는 [시크릿](/ko/docs/concepts/configuration/secret/)

[nginx https 예제](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/)에서 이 모든 것을 얻을 수 있다. 이를 위해서는 도구를 설치해야 한다. 만약 설치하지 않으려면 나중에 수동으로 단계를 수행한다. 한마디로:

```shell
make keys KEY=/tmp/nginx.key CERT=/tmp/nginx.crt
kubectl create secret tls nginxsecret --key /tmp/nginx.key --cert /tmp/nginx.crt
```
```
secret/nginxsecret created
```
```shell
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```
그리고 또한 컨피그맵:
```shell
kubectl create configmap nginxconfigmap --from-file=default.conf
```
```
configmap/nginxconfigmap created
```
```shell
kubectl get configmaps
```
```
NAME             DATA   AGE
nginxconfigmap   1      114s
```
다음은 make를 실행하는데 문제가 있는 경우에 수행해야 하는 수동 단계이다(예시로 windows).

```shell
# Create a public private key pair
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /d/tmp/nginx.key -out /d/tmp/nginx.crt -subj "/CN=my-nginx/O=my-nginx"
# Convert the keys to base64 encoding
cat /d/tmp/nginx.crt | base64
cat /d/tmp/nginx.key | base64
```
이전 명령의 출력을 사용해서 다음과 같이 yaml 파일을 생성한다. base64로 인코딩된 값은 모두 한 줄에 있어야 한다.

```yaml
apiVersion: "v1"
kind: "Secret"
metadata:
  name: "nginxsecret"
  namespace: "default"
type: kubernetes.io/tls
data:
  tls.crt: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURIekNDQWdlZ0F3SUJBZ0lKQUp5M3lQK0pzMlpJTUEwR0NTcUdTSWIzRFFFQkJRVUFNQ1l4RVRBUEJnTlYKQkFNVENHNW5hVzU0YzNaak1SRXdEd1lEVlFRS0V3aHVaMmx1ZUhOMll6QWVGdzB4TnpFd01qWXdOekEzTVRKYQpGdzB4T0RFd01qWXdOekEzTVRKYU1DWXhFVEFQQmdOVkJBTVRDRzVuYVc1NGMzWmpNUkV3RHdZRFZRUUtFd2h1CloybHVlSE4yWXpDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBSjFxSU1SOVdWM0IKMlZIQlRMRmtobDRONXljMEJxYUhIQktMSnJMcy8vdzZhU3hRS29GbHlJSU94NGUrMlN5ajBFcndCLzlYTnBwbQppeW1CL3JkRldkOXg5UWhBQUxCZkVaTmNiV3NsTVFVcnhBZW50VWt1dk1vLzgvMHRpbGhjc3paenJEYVJ4NEo5Ci82UVRtVVI3a0ZTWUpOWTVQZkR3cGc3dlVvaDZmZ1Voam92VG42eHNVR0M2QURVODBpNXFlZWhNeVI1N2lmU2YKNHZpaXdIY3hnL3lZR1JBRS9mRTRqakxCdmdONjc2SU90S01rZXV3R0ljNDFhd05tNnNTSzRqYUNGeGpYSnZaZQp2by9kTlEybHhHWCtKT2l3SEhXbXNhdGp4WTRaNVk3R1ZoK0QrWnYvcW1mMFgvbVY0Rmo1NzV3ajFMWVBocWtsCmdhSXZYRyt4U1FVQ0F3RUFBYU5RTUU0d0hRWURWUjBPQkJZRUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjcKTUI4R0ExVWRJd1FZTUJhQUZPNG9OWkI3YXc1OUlsYkROMzhIYkduYnhFVjdNQXdHQTFVZEV3UUZNQU1CQWY4dwpEUVlKS29aSWh2Y05BUUVGQlFBRGdnRUJBRVhTMW9FU0lFaXdyMDhWcVA0K2NwTHI3TW5FMTducDBvMm14alFvCjRGb0RvRjdRZnZqeE04Tzd2TjB0clcxb2pGSW0vWDE4ZnZaL3k4ZzVaWG40Vm8zc3hKVmRBcStNZC9jTStzUGEKNmJjTkNUekZqeFpUV0UrKzE5NS9zb2dmOUZ3VDVDK3U2Q3B5N0M3MTZvUXRUakViV05VdEt4cXI0Nk1OZWNCMApwRFhWZmdWQTRadkR4NFo3S2RiZDY5eXM3OVFHYmg5ZW1PZ05NZFlsSUswSGt0ejF5WU4vbVpmK3FqTkJqbWZjCkNnMnlwbGQ0Wi8rUUNQZjl3SkoybFIrY2FnT0R4elBWcGxNSEcybzgvTHFDdnh6elZPUDUxeXdLZEtxaUMwSVEKQ0I5T2wwWW5scE9UNEh1b2hSUzBPOStlMm9KdFZsNUIyczRpbDlhZ3RTVXFxUlU9Ci0tLS0tRU5EIENFUlRJRklDQVRFLS0tLS0K"
  tls.key: "LS0tLS1CRUdJTiBQUklWQVRFIEtFWS0tLS0tCk1JSUV2UUlCQURBTkJna3Foa2lHOXcwQkFRRUZBQVNDQktjd2dnU2pBZ0VBQW9JQkFRQ2RhaURFZlZsZHdkbFIKd1V5eFpJWmVEZWNuTkFhbWh4d1NpeWF5N1AvOE9ta3NVQ3FCWmNpQ0RzZUh2dGtzbzlCSzhBZi9WemFhWm9zcApnZjYzUlZuZmNmVUlRQUN3WHhHVFhHMXJKVEVGSzhRSHA3VkpMcnpLUC9QOUxZcFlYTE0yYzZ3MmtjZUNmZitrCkU1bEVlNUJVbUNUV09UM3c4S1lPNzFLSWVuNEZJWTZMMDUrc2JGQmd1Z0ExUE5JdWFubm9UTWtlZTRuMG4rTDQKb3NCM01ZUDhtQmtRQlAzeE9JNHl3YjREZXUraURyU2pKSHJzQmlIT05Xc0RadXJFaXVJMmdoY1kxeWIyWHI2UAozVFVOcGNSbC9pVG9zQngxcHJHclk4V09HZVdPeGxZZmcvbWIvNnBuOUYvNWxlQlkrZStjSTlTMkQ0YXBKWUdpCkwxeHZzVWtGQWdNQkFBRUNnZ0VBZFhCK0xkbk8ySElOTGo5bWRsb25IUGlHWWVzZ294RGQwci9hQ1Zkank4dlEKTjIwL3FQWkUxek1yall6Ry9kVGhTMmMwc0QxaTBXSjdwR1lGb0xtdXlWTjltY0FXUTM5SjM0VHZaU2FFSWZWNgo5TE1jUHhNTmFsNjRLMFRVbUFQZytGam9QSFlhUUxLOERLOUtnNXNrSE5pOWNzMlY5ckd6VWlVZWtBL0RBUlBTClI3L2ZjUFBacDRuRWVBZmI3WTk1R1llb1p5V21SU3VKdlNyblBESGtUdW1vVlVWdkxMRHRzaG9reUxiTWVtN3oKMmJzVmpwSW1GTHJqbGtmQXlpNHg0WjJrV3YyMFRrdWtsZU1jaVlMbjk4QWxiRi9DSmRLM3QraTRoMTVlR2ZQegpoTnh3bk9QdlVTaDR2Q0o3c2Q5TmtEUGJvS2JneVVHOXBYamZhRGR2UVFLQmdRRFFLM01nUkhkQ1pKNVFqZWFKClFGdXF4cHdnNzhZTjQyL1NwenlUYmtGcVFoQWtyczJxWGx1MDZBRzhrZzIzQkswaHkzaE9zSGgxcXRVK3NHZVAKOWRERHBsUWV0ODZsY2FlR3hoc0V0L1R6cEdtNGFKSm5oNzVVaTVGZk9QTDhPTm1FZ3MxMVRhUldhNzZxelRyMgphRlpjQ2pWV1g0YnRSTHVwSkgrMjZnY0FhUUtCZ1FEQmxVSUUzTnNVOFBBZEYvL25sQVB5VWs1T3lDdWc3dmVyClUycXlrdXFzYnBkSi9hODViT1JhM05IVmpVM25uRGpHVHBWaE9JeXg5TEFrc2RwZEFjVmxvcG9HODhXYk9lMTAKMUdqbnkySmdDK3JVWUZiRGtpUGx1K09IYnRnOXFYcGJMSHBzUVpsMGhucDBYSFNYVm9CMUliQndnMGEyOFVadApCbFBtWmc2d1BRS0JnRHVIUVV2SDZHYTNDVUsxNFdmOFhIcFFnMU16M2VvWTBPQm5iSDRvZUZKZmcraEppSXlnCm9RN3hqWldVR3BIc3AyblRtcHErQWlSNzdyRVhsdlhtOElVU2FsbkNiRGlKY01Pc29RdFBZNS9NczJMRm5LQTQKaENmL0pWb2FtZm1nZEN0ZGtFMXNINE9MR2lJVHdEbTRpb0dWZGIwMllnbzFyb2htNUpLMUI3MkpBb0dBUW01UQpHNDhXOTVhL0w1eSt5dCsyZ3YvUHM2VnBvMjZlTzRNQ3lJazJVem9ZWE9IYnNkODJkaC8xT2sybGdHZlI2K3VuCnc1YytZUXRSTHlhQmd3MUtpbGhFZDBKTWU3cGpUSVpnQWJ0LzVPbnlDak9OVXN2aDJjS2lrQ1Z2dTZsZlBjNkQKckliT2ZIaHhxV0RZK2Q1TGN1YSt2NzJ0RkxhenJsSlBsRzlOZHhrQ2dZRUF5elIzT3UyMDNRVVV6bUlCRkwzZAp4Wm5XZ0JLSEo3TnNxcGFWb2RjL0d5aGVycjFDZzE2MmJaSjJDV2RsZkI0VEdtUjZZdmxTZEFOOFRwUWhFbUtKCnFBLzVzdHdxNWd0WGVLOVJmMWxXK29xNThRNTBxMmk1NVdUTThoSDZhTjlaMTltZ0FGdE5VdGNqQUx2dFYxdEYKWSs4WFJkSHJaRnBIWll2NWkwVW1VbGc9Ci0tLS0tRU5EIFBSSVZBVEUgS0VZLS0tLS0K"
```
이제 파일을 사용해서 시크릿을 생성한다.

```shell
kubectl apply -f nginxsecrets.yaml
kubectl get secrets
```
```
NAME                  TYPE                                  DATA      AGE
nginxsecret           kubernetes.io/tls                     2         1m
```

이제 nginx 레플리카를 수정하여 암호화된 인증서를 사용한 https 서버와 서비스를 실행하고, 두 포트(80과 443)를 노출한다.

{{< codenew file="service/networking/nginx-secure-app.yaml" >}}

nginx-secure-app의 매니페스트에 대한 주목할만한 점:

- 이것은 동일한 파일에 디플로이먼트와 서비스의 사양을 모두 포함하고 있다.
- [nginx 서버](https://github.com/kubernetes/examples/tree/master/staging/https-nginx/default.conf)
  는 포트 80에서 HTTP 트래픽을 443에서 HTTPS 트래픽 서비스를 제공하고, nginx 서비스는
  두 포트를 모두 노출한다.
- 각 컨테이너는 `/etc/nginx/ssl` 에 마운트된 볼륨을 통해 키에 접근할 수 있다.
  이것은 nginx 서버가 시작되기 *전에* 설정된 것이다.

```shell
kubectl delete deployments,svc my-nginx; kubectl create -f ./nginx-secure-app.yaml
```

이 시점에서 모든 노드에서 nginx 서버에 연결할 수 있다.

```shell
kubectl get pods -l run=my-nginx -o custom-columns=POD_IP:.status.podIPs
    POD_IP
    [map[ip:10.244.3.5]]
```

```shell
node $ curl -k https://10.244.3.5
...
<h1>Welcome to nginx!</h1>
```

마지막 단계에서 curl에 `-k` 파라미터를 제공한 방법에 참고한다. 이는 인증서 생성시 nginx를 실행하는 파드에 대해 아무것도 모르기 때문에
curl에 CName 불일치를 무시하도록 지시해야하기 때문이다. 서비스를 생성해서 인증서에 사용된 CName을 서비스 조회시 파드에서 사용된 실제 DNS 이름과 연결했다.
파드에서 이것을 테스트 해보자(단순히 동일한 시크릿이 재사용되고 있으며, 파드는 서비스에 접근하기위해 nginx.crt만 필요하다).

{{< codenew file="service/networking/curlpod.yaml" >}}

```shell
kubectl apply -f ./curlpod.yaml
kubectl get pods -l app=curlpod
```
```
NAME                               READY     STATUS    RESTARTS   AGE
curl-deployment-1515033274-1410r   1/1       Running   0          1m
```
```shell
kubectl exec curl-deployment-1515033274-1410r -- curl https://my-nginx --cacert /etc/nginx/ssl/tls.crt
...
<title>Welcome to nginx!</title>
...
```

## 서비스 노출하기

애플리케이션의 일부인 경우 원한다면 외부 IP 주소에 서비스를
노출할 수 있다. 쿠버네티스는 이를 수행하는 2가지 방법인 NodePorts와
LoadBalancers를지원한다. 마지막 섹션에서 생성된 서비스는 이미 `NodePort` 를 사용했기에
노드에 공용 IP가 있는경우 nginx HTTPS 레플리카가 인터넷 트래픽을 처리할
준비가 되어 있다.

```shell
kubectl get svc my-nginx -o yaml | grep nodePort -C 5
  uid: 07191fb3-f61a-11e5-8ae5-42010af00002
spec:
  clusterIP: 10.0.162.149
  ports:
  - name: http
    nodePort: 31704
    port: 8080
    protocol: TCP
    targetPort: 80
  - name: https
    nodePort: 32453
    port: 443
    protocol: TCP
    targetPort: 443
  selector:
    run: my-nginx
```
```shell
kubectl get nodes -o yaml | grep ExternalIP -C 1
    - address: 104.197.41.11
      type: ExternalIP
    allocatable:
--
    - address: 23.251.152.56
      type: ExternalIP
    allocatable:
...

$ curl https://<EXTERNAL-IP>:<NODE-PORT> -k
...
<h1>Welcome to nginx!</h1>
```

이제 클라우드 로드 밸런서를 사용하도록 서비스를 재생성한다. `my-nginx` 서비스의 `Type` 을  `NodePort` 에서 `LoadBalancer` 로 변경한다.

```shell
kubectl edit svc my-nginx
kubectl get svc my-nginx
```
```
NAME       TYPE           CLUSTER-IP     EXTERNAL-IP        PORT(S)               AGE
my-nginx   LoadBalancer   10.0.162.149   xx.xxx.xxx.xxx     8080:30163/TCP        21s
```
```
curl https://<EXTERNAL-IP> -k
...
<title>Welcome to nginx!</title>
```

`EXTERNAL-IP` 의 IP 주소는 공용 인터넷에서 이용할 수 있는 주소이다. `CLUSTER-IP` 는
클러스터/프라이빗 클라우드 네트워크 내에서만 사용할 수 있다.

AWS에서는 `LoadBalancer` 유형은 IP가 아닌 (긴)호스트네임을 사용하는 ELB를
생성한다는 점을 참고한다. 이것은 일반적인 `kubectl get svc` 의 출력에
맞추기에는 매우 길기 때문에 실제로 이를 보려면 `kubectl describe service my-nginx` 를
수행해야 한다. 다음과 같은 것을 보게 된다.

```shell
kubectl describe service my-nginx
...
LoadBalancer Ingress:   a320587ffd19711e5a37606cf4a74574-1142138393.us-east-1.elb.amazonaws.com
...
```



## {{% heading "whatsnext" %}}


* [서비스를 사용해서 클러스터 내 애플리케이션에 접근하기](/ko/docs/tasks/access-application-cluster/service-access-application-cluster/)를 더 자세히 알아본다.
* [서비스를 사용해서 프론트 엔드부터 백 엔드까지 연결하기](/ko/docs/tasks/access-application-cluster/connecting-frontend-backend/)를 더 자세히 알아본다.
* [외부 로드 밸런서를 생성하기](/ko/docs/tasks/access-application-cluster/create-external-load-balancer/)를 더 자세히 알아본다.


