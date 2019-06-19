---
title: 소스 IP 주소 이용하기
content_template: templates/tutorial
---

{{% capture overview %}}

쿠버네티스 클러스터에서 실행 중인 애플리케이션은 서로 간에 외부 세계와
서비스 추상화를 통해 찾고 통신한다. 이 문서는
다른 종류의 서비스로 보내진 패킷의 소스 IP 주소에 어떤 일이 벌어지는지와
이 동작을 요구에 따라 토글할 수 있는지 설명한다.

{{% /capture %}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

## 용어

이 문서는 다음 용어를 사용한다.

* [NAT](https://en.wikipedia.org/wiki/Network_address_translation): 네트워크 주소 변환
* [소스 NAT](https://en.wikipedia.org/wiki/Network_address_translation#SNAT): 패킷 상의 소스 IP 주소를 변경함, 보통 노드의 IP 주소
* [대상 NAT](https://en.wikipedia.org/wiki/Network_address_translation#DNAT): 패킷 상의 대상 IP 주소를 변경함, 보통 파드의 IP 주소
* [VIP](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): 가상 IP 주소, 모든 쿠버네티스 서비스에 할당된 것 같은
* [Kube-proxy](/docs/concepts/services-networking/service/#virtual-ips-and-service-proxies): 네트워크 데몬으로 모든 노드에서 서비스 VIP 관리를 관리한다.


## 전제 조건

이 문서의 예시를 실행하기 위해서 쿠버네티스 1.5 이상의 동작하는 클러스터가 필요하다.
이 예시는 HTTP 헤더로 수신한 요청의 소스 IP 주소를 회신하는
작은 nginx 웹 서버를 이용한다. 다음과 같이 생성할 수 있다.

```console
$ kubectl run source-ip-app --image=k8s.gcr.io/echoserver:1.4
deployment.apps/source-ip-app created
```

{{% /capture %}}

{{% capture objectives %}}

* 간단한 애플리케이션을 다양한 서비스 종류로 노출하기
* 각 서비스 유형에 따른 소스 IP NAT 의 동작 이해하기
* 소스 IP 주소 보존에 관한 절충 사항 이해

{{% /capture %}}


{{% capture lessoncontent %}}

## Type=ClusterIP인 서비스에서 소스 IP

쿠버네티스 1.2부터 기본으로 제공하는
[iptables 모드](/docs/concepts/services-networking/service/#proxy-mode-iptables)로 운영하는 경우
클러스터 내에서 클러스터 IP로 패킷을 보내면 소스 NAT를 통과하지 않는다.
Kube-proxy는 이 모드를 `proxyMode` 엔드포인트를 통해 노출한다.

```console
$ kubectl get nodes
NAME                           STATUS     ROLES    AGE     VERSION
kubernetes-minion-group-6jst   Ready      <none>   2h      v1.13.0
kubernetes-minion-group-cx31   Ready      <none>   2h      v1.13.0
kubernetes-minion-group-jj1t   Ready      <none>   2h      v1.13.0

kubernetes-minion-group-6jst $ curl localhost:10249/proxyMode
iptables
```

소스 IP 애플리케이션을 통해 서비스를 생성하여 소스 IP 주소 보존 여부를 테스트할 수 있다.

```console
$ kubectl expose deployment source-ip-app --name=clusterip --port=80 --target-port=8080
service/clusterip exposed

$ kubectl get svc clusterip
NAME         TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
clusterip    ClusterIP   10.0.170.92   <none>        80/TCP    51s
```

그리고 동일한 클러스터의 파드에서 `클러스터IP`를 치면:

```console
$ kubectl run busybox -it --image=busybox --restart=Never --rm
Waiting for pod default/busybox to be running, status is Pending, pod ready: false
If you don't see a command prompt, try pressing enter.

# ip addr
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
    inet 127.0.0.1/8 scope host lo
       valid_lft forever preferred_lft forever
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
3: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1460 qdisc noqueue
    link/ether 0a:58:0a:f4:03:08 brd ff:ff:ff:ff:ff:ff
    inet 10.244.3.8/24 scope global eth0
       valid_lft forever preferred_lft forever
    inet6 fe80::188a:84ff:feb0:26a5/64 scope link
       valid_lft forever preferred_lft forever

# wget -qO - 10.0.170.92
CLIENT VALUES:
client_address=10.244.3.8
command=GET
...
```
client_address는 클라이언트 파드와 서버 파드가 같은 노드 또는 다른 노드에 있는지 여부에 관계없이 항상 클라이언트 파드의 IP 주소이다.

## Type=NodePort인 서비스에서 소스 IP

쿠버네티스 1.5부터 [Type=NodePort](/docs/concepts/services-networking/service/#nodeport)인 서비스로 보내진 패킷은
소스 NAT가 기본으로 적용된다. `NodePort` 서비스를 생성하여 이것을 테스트할 수 있다.

```console
$ kubectl expose deployment source-ip-app --name=nodeport --port=80 --target-port=8080 --type=NodePort
service/nodeport exposed

$ NODEPORT=$(kubectl get -o jsonpath="{.spec.ports[0].nodePort}" services nodeport)
$ NODES=$(kubectl get nodes -o jsonpath='{ $.items[*].status.addresses[?(@.type=="IPAddress")].address }')
```

클라우드 공급자 상에서 실행한다면,
위에 보고된 `nodes:nodeport`를 위한 방화벽 규칙을 열어주어야 한다.
이제 위에 노드 포트로 할당받은 포트를 통해 클러스터 외부에서
서비스에 도달할 수 있다.

```console
$ for node in $NODES; do curl -s $node:$NODEPORT | grep -i client_address; done
client_address=10.180.1.1
client_address=10.240.0.5
client_address=10.240.0.3
```

명심할 것은 정확한 클라이언트 IP 주소가 아니고, 클러스터 내부 IP 주소이다. 왜 이런 일이 발생했는지 설명한다.

* 클라이언트는 `node2:nodePort`로 패킷을 보낸다.
* `node2`는 소스 IP 주소(SNAT)를 패킷 상에서 자신의 IP 주소로 교체한다.
* `noee2`는 대상 IP를 패킷 상에서 파드의 IP로 교체한다.
* 패킷은 node 1로 라우팅 된 다음 엔드포인트로 라우팅 된다.
* 파드의 응답은 node2로 다시 라우팅된다.
* 파드의 응답은 클라이언트로 다시 전송된다.

시각적으로

```
          client
             \ ^
              \ \
               v \
   node 1 <--- node 2
    | ^   SNAT
    | |   --->
    v |
 endpoint
```


이를 피하기 위해 쿠버네티스는 클라이언트 소스 IP 주소를 보존하는 기능이 있다.
[(기능별 가용성은 여기에)](/docs/tasks/access-application-cluster/create-external-load-balancer/#preserving-the-client-source-ip).
`service.spec.externalTrafficPolicy`을 `Local`로 하면
오직 로컬 엔드포인트로만 프록시 요청하고 다른 노드로 트래픽 전달하지 않으므로,
원본 소스 IP 주소를 보존한다.
만약 로컬 엔드 포인트가 없다면, 그 노드로 보내진 패킷은 버려지므로
패킷 처리 규칙에서 정확한 소스 IP 임을 신뢰할 수 있으므로, 
패킷을 엔드포인트까지 전달할 수 있다.

다음과 같이 `service.spec.externalTrafficPolicy` 필드를 설정하자.

```console
$ kubectl patch svc nodeport -p '{"spec":{"externalTrafficPolicy":"Local"}}'
service/nodeport patched
```

이제 다시 테스트를 실행해보자.

```console
$ for node in $NODES; do curl --connect-timeout 1 -s $node:$NODEPORT | grep -i client_address; done
client_address=104.132.1.79
```

엔드포인트 파드가 실행 중인 노드에서 *올바른* 클라이언트 IP 주소인 
딱 한 종류의 응답만 수신한다.

어떻게 이렇게 되었는가:

* 클라이언트는 패킷을 엔드포인트가 없는 `node2:nodePort` 보낸다.
* 패킷은 버려진다.
* 클라이언트는 패킷을 엔드포인트를 가진 `node1:nodePort` 보낸다.
* node1은 패킷을 올바른 소스 IP 주소로 엔드포인트로 라우팅 한다.


시각적으로

```
        client
       ^ /   \
      / /     \
     / v       X
   node 1     node 2
    ^ |
    | |
    | v
 endpoint
```



## Type=LoadBalancer인 서비스에서 소스 IP

쿠버네티스 1.5 부터 [Type=LoadBalancer](/docs/concepts/services-networking/service/#loadbalancer)인 서비스로
보낸 패킷은 소스 NAT를 기본으로 하는데, `Ready` 상태로 모든 스케줄된 모든 쿠버네티스 노드는
로드 밸런싱 트래픽에 적합하다. 따라서 엔드포인트가 없는 노드에
패킷이 도착하면 시스템은 엔드포인트를 *포함한* 노드에 프록시를
수행하고 패킷 상에서 노드의 IP 주소로 소스 IP 주소를 변경한다
(이전 섹션에서 기술한 것처럼).

로드밸런서를 통해 source-ip-app을 노출하여 테스트할 수 있다.

```console
$ kubectl expose deployment source-ip-app --name=loadbalancer --port=80 --target-port=8080 --type=LoadBalancer
service/loadbalancer exposed

$ kubectl get svc loadbalancer
NAME           TYPE           CLUSTER-IP    EXTERNAL-IP       PORT(S)   AGE
loadbalancer   LoadBalancer   10.0.65.118   104.198.149.140   80/TCP    5m

$ curl 104.198.149.140
CLIENT VALUES:
client_address=10.240.0.5
...
```

그러나 구글 클라우드 엔진/GCE 에서 실행 중이라면 동일한 `service.spec.externalTrafficPolicy` 필드를 `Local`로 설정하면
서비스 엔드포인트가 *없는* 노드는 고의적으로 헬스 체크에 실패하여
강제로 로드밸런싱 트래픽을 받을 수 있는 노드 목록에서 
자신을 스스로 제거한다.

시각적으로:

```
                      client
                        |
                      lb VIP
                     / ^
                    v /
health check --->   node 1   node 2 <--- health check
        200  <---   ^ |             ---> 500
                    | V
                 endpoint
```

이것은 어노테이션을 설정하여 테스트할 수 있다.

```console
$ kubectl patch svc loadbalancer -p '{"spec":{"externalTrafficPolicy":"Local"}}'
```

쿠버네티스에 의해 `service.spec.healthCheckNodePort` 필드가
즉각적으로 할당되는 것을 봐야 한다.

```console
$ kubectl get svc loadbalancer -o yaml | grep -i healthCheckNodePort
  healthCheckNodePort: 32122
```

`service.spec.healthCheckNodePort` 필드는 `/healthz`에서 헬스 체크를 제공하는
모든 노드의 포트를 가르킨다. 이것을 테스트할 수 있다.

```
$ kubectl get pod -o wide -l run=source-ip-app
NAME                            READY     STATUS    RESTARTS   AGE       IP             NODE
source-ip-app-826191075-qehz4   1/1       Running   0          20h       10.180.1.136   kubernetes-minion-group-6jst

kubernetes-minion-group-6jst $ curl localhost:32122/healthz
1 Service Endpoints found

kubernetes-minion-group-jj1t $ curl localhost:32122/healthz
No Service Endpoints Found
```

마스터에서 실행 중인 서비스 컨트롤러는 필요시에 클라우드 로드밸런서를 할당할 책임이 있다.
또한, 각 노드에 HTTP 헬스 체크를 이 포트와 경로로 할당한다.
헬스체크가 실패한 엔드포인트를 포함하지 않은 2개 노드에서 10초를 기다리고
로드밸런서 IP 주소로 curl 하자.

```console
$ curl 104.198.149.140
CLIENT VALUES:
client_address=104.132.1.79
...
```

__크로스 플랫폼 지원__

쿠버네티스 1.5부터 Type=LoadBalancer 서비스를 통한 
소스 IP 주소 보존을 지원하지만,
이는 클라우드 공급자(GCE, Azure)의 하위 집합으로 구현되어 있다. 실행중인 클라우드 공급자에서
몇 가지 다른 방법으로 로드밸런서를 요청하자.

1. 클라이언트 연결을 종료하고 새 연결을 여는 프록시를 이용한다.
이 경우 소스 IP 주소는 클라이언트 IP 주소가 아니고
항상 클라우드 로드밸런서의 IP 주소이다.

2. 로드밸런서의 VIP에 전달된 클라이언트가 보낸 요청을
중간 프록시가 아닌 클라이언트 소스 IP 주소가 있는 노드로
끝나는 패킷 전달자를 이용한다.

첫 번째 범주의 로드밸런서는 진짜 클라이언트 IP를 통신하기 위해
HTTP [X-FORWARDED-FOR](https://en.wikipedia.org/wiki/X-Forwarded-For) 헤더나
[프록시 프로토콜](http://www.haproxy.org/download/1.5/doc/proxy-protocol.txt)같이 로드밸런서와
백엔드 간에 합의된 프로토콜을 사용해야 한다.
두 번째 범주의 로드밸런서는 서비스의 `service.spec.healthCheckNodePort` 필드의 저장된 포트를 가르키는
간단한 HTTP 헬스 체크를 생성하여
위에서 설명한 기능을 활용할 수 있다.

{{% /capture %}}

{{% capture cleanup %}}

서비스를 삭제하자.

```console
$ kubectl delete svc -l run=source-ip-app
```

디플로이먼트와 리플리카 셋과 파드를 삭제하자.

```console
$ kubectl delete deployment source-ip-app
```

{{% /capture %}}

{{% capture whatsnext %}}
* [서비스를 통한 애플리케이션 연결하기](/docs/concepts/services-networking/connect-applications-service/)에 대해 더 공부하기
* [부하분산](/docs/user-guide/load-balancer)에 대해 더 공부하기
{{% /capture %}}


