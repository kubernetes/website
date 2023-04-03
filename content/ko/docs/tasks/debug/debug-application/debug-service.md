---
reviewers:
- thockin
- bowei
content_type: 태스크
title: 디버그 서비스
weight: 20
---

<!-- overview -->
쿠버네티스를 새로 설치하는데 자주 발생하는 문제는
서비스가 제대로 작동하지 않는 것이다. 배포(또 다른 워크로드 컨트롤러)를 통해 파드를 실행하고
서비스를 생성했지만,
엑세스하려고 하면 응답이 없다.  이 문서는 무엇이 잘못되었는지
파악하는 데 도움이 되기를 바란다.

<!-- body -->

## 파드에서 명령어 실행

여기서 많은 단계에서 클러스터에 실행 중인 파드가 바라보고 있는 것을
보고싶을 것이다. 이를 수행하는 가장 간단한 방법은 대화형 busybox 파드를 실행하는 것이다:

```none
kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

{{< note >}}
명령 프롬프트가 보이지 않으면, enter를 눌러 본다.
{{< /note >}}

사용하려는 파드가 이미 실행 중인 경우, 다음과 같이
명령어를 사용할 수 있다:

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## 설정

연습을 위해 일부 파드를 실행한다.  자신의
서비스를 디버깅 중일 수 있으므로 자신의 세부 정보를 대체하거나, 따라가서
두 번째 데이터 포인트를 얻을 수 있다.

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```
```none
deployment.apps/hostnames created
```

`kubectl` 명령어는 생성되거나 변경된 리소스의 유형과 이름을 출력하여, 다음 명령어에서 사용할 수 있다.

디플로이먼트를 3개의 레플리카로 확장한다.
```shell
kubectl scale deployment hostnames --replicas=3
```
```none
deployment.apps/hostnames scaled
```

다음과 같이 YAML을 사용하여 디플로이먼트를 시작하는 것과 동일하므로
참조한다.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    matchLabels:
      app: hostnames
  replicas: 3
  template:
    metadata:
      labels:
        app: hostnames
    spec:
      containers:
      - name: hostnames
        image: registry.k8s.io/serve_hostname
```

"앱" 레이블은 `kubectl create deployment`명령어를 통해 디플로이먼트 이름으로 자동으로
설정된다.

파드가 실행 중인지 확인할 수 있다.

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          2m
hostnames-632524106-ly40y   1/1       Running   0          2m
hostnames-632524106-tlaok   1/1       Running   0          2m
```

파드가 제공되고 있는지 확인할 수 있다.  파드 IP주소의 목록을 가져올 수 있고
직접 테스트할 수 있다.

```shell
kubectl get pods -l app=hostnames \
    -o go-template='{{range .items}}{{.status.podIP}}{{"\n"}}{{end}}'
```
```none
10.244.0.5
10.244.0.6
10.244.0.7
```

연습에 사용된 컨테이너 예제는 포트 9376에서 HTTP를 통해 호스트이름을 제공하지만
앱을 디버깅하는 경우,
파드가 수신 대기 중인 포트 번호를 사용하길 원한다.

파드 내에서 확인한다.

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

다음과 같이 생성해야 한다.

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

해당 지점에서 예상한 응답을 받지 못한 경우, 파드가
정상적이지 않거나 생각한 포트에서 수신 대기를 하지 않을 수 있다.
어떤 일이 발생하고 있는지 확인하는데 `kubectl logs`가 유용할 수 있고,
파드에 직접 `kubectl exec`를 실행하고, 거기에서
디버그해야 할 수도 있다.

지금까지 모든 것이 계획대로 진행되었다고 가정하면, 서비스가 작동하지 않는 이유를
분석할 수 있다.

## 서비스가 존재합니까?

여기까지 파악했다면 아직 실제로 서비스를 생성하지 않았다는 것을 알아차렸을 것이다.
그것은 의도적인 것이다.  이 단계는 때때로 잊어버리지만,
가장 먼저 해야할 단계이다.

존재하지 않는 서비스에 엑세스하려고 하면 어떤 일이 발생할까?
서비스를 이름으로 사용하는 다른 파드가 있다면
다음과 같이 결과를 얻는다.

```shell
wget -O- hostnames
```
```none
Resolving hostnames (hostnames)... failed: Name or service not known.
wget: unable to resolve host address 'hostnames'
```

가장 먼저 확인해야 할 것은 서비스가 실제로 존재하는지 여부이다.

```shell
kubectl get svc hostnames
```
```none
No resources found.
Error from server (NotFound): services "hostnames" not found
```

서비스를 생성합니다. 이전과 마찬가지로 이것은 둘러보기를 위한 것이다.
여기서 서비스 세부정보를 사용할 수 있다.

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```
```none
service/hostnames exposed
```

다시 읽는다.

```shell
kubectl get svc hostnames
```
```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

지금 서비스가 존재한다는 것을 알수 있다.

이전과 마찬가지로, YAML로 서비스를 시작한 것과 동일하다.

```yaml
apiVersion: v1
kind: Service
metadata:
  labels:
    app: hostnames
  name: hostnames
spec:
  selector:
    app: hostnames
  ports:
  - name: default
    protocol: TCP
    port: 80
    targetPort: 9376
```

환경설정의 전체 범위를 강조하기 위해, 여기에서 생성한 서비스는
파드와 다른 포트 번호를 사용한다.  실제 많은 서비스에서,
이러한 값은 동일할 수 있다.

## 대상 파드에 영향을 미치는 네트워크 폴리시 인그레스 규칙이 있습니까?

`hostnames-*` 파드로 들어오는 트래픽에 영향을 줄 수 있는 네트워크 폴리시 인그레스 규칙을
배포하는 경우, 이를 검토해야 한다.

자세한 내용은 [Network Policies](/docs/concepts/services-networking/network-policies/)를 참고한다.

## 서비스가 DNS 이름으로 작동합니까?

클라이언트가 서비스를 사용하는 가장 일반적인 방법 중 하나는 DNS 이름을 통하는
것이다.

동일한 네임스페이스안의 파드에서,

```shell
nslookup hostnames
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

이것이 실패하면, 파드와 서비스가 다른 네임스페이스에 있을 수 있다.
네임스페이스로 한정된 이름을 사용해 본다. (다시 말해, 파드 내에서 확인한다.)

```shell
nslookup hostnames.default
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

이 방법이 작동하면, 교차 네임스페이스 이름을 사용하기 위해 앱을 조정하거나
동일한 네임스페이스에서 앱과 서비스를 실행한다.  여전히 실패하면,
지정된 이름을 사용한다.

```shell
nslookup hostnames.default.svc.cluster.local
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

여기서 접미사: "default.svc.cluster.local"에 유의한다.
"기본값"은 작업 중인 네임스페이스이다. "svc"는 서비스임을 나타낸다.
"cluster.local"은 클러스터에서 다를 수 있는
클러스터 도메인이다.

클러스터의 노드에서 다음과 같이 시도할 수 있다.

{{< note >}}
10.0.0.10은 클러스터의 DNS 서비스 IP이며, 사용자의 것과 다를 수 있다.
{{< /note >}}

```shell
nslookup hostnames.default.svc.cluster.local 10.0.0.10
```
```none
Server:         10.0.0.10
Address:        10.0.0.10#53

Name:   hostnames.default.svc.cluster.local
Address: 10.0.1.175
```

지정된 이름은 조회할 수 있지만 상대적으로 조회를 할 수 없는 경우,
파드의 `/etc/resolv.conf` 파일이 올바른지 확인해야 한다.
파드 내에서 확인한다.

```shell
cat /etc/resolv.conf
```

다음과 같은 내용이 표시되어야 한다.

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

`nameserver` 라인은 클러스터의 DNS 서비스를 나타내야 한다.
이는 `--cluster-dns` 플래그와 함께 `kubelet`으로 전달된다.

`search` 라인은 서비스 이름을 찾을 수 있는 적절한 접미사가 포함되어야 한다.
이 경우 로컬 네임스페이스 ("default.svc.cluster.local")의 서비스,
네임스페이스 ("svc.cluster.local")의 서비스,
마지막으로 클러스터 ("cluster.local")의 이름을 찾는다.
설치에 따라 그 후에 추가적인 레코드가 있을 수 있다. (총 6개까지)
클러스터 접미사는 `--cluster-domain` 플래그와 함께
`kubelet`에 전달된다.  이 문서에서, 클러스터 접미사는
"cluster.local"로 간주된다.  클러스터가 다르게 구성되었을 수 있으며,
이 경우 이전의 모든 명령어에서 이를
변경해야 한다.

`options` 라인은 DNS 클라이언트 라이브러리가 검색 경로를 전혀 고려하지 않을 만큼 충분히 높게 'ndots'를 설정해야 한다.
쿠버네티스는 기본적으로 5로 설정하며,
생성하는 모든 DNS 이름을 포함할 수 있을 만큼 충분히 높다.

### 서비스가 DNS 이름으로 작동합니까? {#does-any-service-exist-in-dns}

위의 작업이 계속 실패하면, 서비스에 대해 DNS 조회가 작동하지 않는다.
한 걸음 뒤로 물러나서 어떤 것이 작동되지 않는지 확인 할 수 있다.  쿠버네티스 마스터
서비스는 항상 작동해야 한다.  파드 내에서 확인한다.

```shell
nslookup kubernetes.default
```
```none
Server:    10.0.0.10
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      kubernetes.default
Address 1: 10.0.0.1 kubernetes.default.svc.cluster.local
```

이것이 실패하면, 이 문서의 [kube-proxy](#is-the-kube-proxy-working) 섹션을 참고하거나
본 문서의 맨 위로 돌아가서 다시 시작한다.
단, 서비스를 디버깅하는 대신, DNS 서비스를 디버그한다.

## 서비스가 IP로 작동합니까?

DNS가 작동하는 것을 확인했다고 가정하면, 다음 테스트는
서비스가 IP주소로 작동하는지 확인하는 것이다.  클러스터의 파드에서,
서비스의 IP에 엑세스한다. (위와 같이 `kubectl get`을 사용)

```shell
for i in $(seq 1 3); do 
    wget -qO- 10.0.1.175:80
done
```

이렇게 하면 다음과 같은 결과가 나타난다.

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

서비스가 작동하는 경우, 올바른 응답을 받아야 한다. 그렇지 않은 경우,
잘못될 수 있는 여러가지가 있다.  읽어본다.

## 서비스가 올바르게 정의되었습니까?

몇 차례 강조하지만, 서비스가 정확하고 파드의 포트와 일치하는지
두 번, 세 번 확인해야 한다.  서비스를 다시 읽고
확인한다.

```shell
kubectl get service hostnames -o json
```
```json
{
    "kind": "Service",
    "apiVersion": "v1",
    "metadata": {
        "name": "hostnames",
        "namespace": "default",
        "uid": "428c8b6c-24bc-11e5-936d-42010af0a9bc",
        "resourceVersion": "347189",
        "creationTimestamp": "2015-07-07T15:24:29Z",
        "labels": {
            "app": "hostnames"
        }
    },
    "spec": {
        "ports": [
            {
                "name": "default",
                "protocol": "TCP",
                "port": 80,
                "targetPort": 9376,
                "nodePort": 0
            }
        ],
        "selector": {
            "app": "hostnames"
        },
        "clusterIP": "10.0.1.175",
        "type": "ClusterIP",
        "sessionAffinity": "None"
    },
    "status": {
        "loadBalancer": {}
    }
}
```

* 액세스하려는 서비스 포트가 `spec.ports[]`에 나열되어 있습니까?
* 파드에 대한 `targetPort`가 맞습니까 (일부 파드는 서비스와 다른 포트를 사용한다.)?
* 숫자 포트를 사용하려는 경우, 숫자 (9376) 또는 문자열 "9376"입니까?
* 지정된 포트를 사용하려는 경우, 파드가 동일한 이름의 포트를 노출합니까?
* 포트의 '프로토콜'이 파드에 맞습니까?

## 서비스에 엔드포인트가 있습니까?

여기까지 왔다면, 서비스가 올바르게 정의되고
DNS에 의해 해결되었음을 확인한 것이다.  이제 실행한 파드가
서비스에서 실제로 선택되고 있는지 확인한다.

이전에 파드가 실행 중임을 확인했다. 다음과 같이 다시 확인할 수 있다.

```shell
kubectl get pods -l app=hostnames
```
```none
NAME                        READY     STATUS    RESTARTS   AGE
hostnames-632524106-bbpiw   1/1       Running   0          1h
hostnames-632524106-ly40y   1/1       Running   0          1h
hostnames-632524106-tlaok   1/1       Running   0          1h
```

`-l app=hostnames` 인수는 서비스에 구성된 레이블 셀렉터이다.

"AGE" 열은 파드가 약 1시간 되었다고 표시하며,
이는 파드가 제대로 실행되고 있으며 충돌되지 않음을 의미한다.

"RESTARTS" 열은 파드가 자주 충돌하지 않거나 다시 시작되지 않음을 타나낸다.
자주 다시 시작하면 간헐적으로 연결 문제가 발생할 수 있다.
재 시작 횟수가 높으면, [debug pods](/docs/tasks/debug/debug-application/debug-pods) 방법에 대해 참고한다.

쿠버네티스 시스템 내부에는 모든 서비스의 셀렉터를 평가하고
결과를 해당 엔드포인트 오브젝트에 저장하는 제어 루프가 있다.

```shell
kubectl get endpoints hostnames

NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

엔드포인트 컨트롤러가 서비스에 대한 올바른 파드를 찾았음을 확인한다.
`ENDPOINTS` 열이 `<none>`인 경우,
서비스의 `spec.selector` 필드가 파드의 `metadata.labels` 값을
실제로 선택하는지 확인해야 한다.  일반적인 실수는
`app=hostnames`에 대해 서비스를 선택하지만 `kubectl run` 명령을 사용하여
디플로이먼트를 생성할 수 있는 1.18 이전 버전에서와 같이
`run=hostnames`를 지정하는 디플로이먼트와 같은 오타 또는 기타 오류가 있다.

## 파드가 작동하고 있습니까?

현 시점에서, 서비스가 존재하고 파드가 선택되었음을 알 수 있다.
이 연습의 시작부분에서 파드를 확인했다.
파드가 실제로 작동하는지 다시 확인한다.
서비스 메카니즘을 우회하고 위의 엔드포인트에 나열된 대로
파드로 바로 이동할 수 있다.

{{< note >}}
이러한 명령은 서비스 포트(80)가 아닌 파드 포트(9376)을 사용한다.
{{< /note >}}

파드 내에서 확인한다.

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

이렇게 하면 다음과 같은 결과가 나타납니다.

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

엔드포인트 목록의 각 파드는 호스트네임을 반환할 것으로 예상한다.
이것이 발생하지 않는 경우(또는 파드에 대한 올바른 동작이 무엇이든 상관없다.),
무슨 일이 일어나고 있는지 조사해야 한다.

## kube-proxy가 작동합니까?

여기까지 진행 했다면, 서비스가 실행 중이고 엔드포인트가 있으며 파드가
실제로 제공되고 있다.  이 시점에서 전체 서비스 프록시 메커니즘이 의심된다.
하나씩 확인하기로 한다.

서비스의 기본 구현 및 대부분 클러스터에서 사용되는 것은
kube-proxy이다.  이는 모든 노드에서 실행되고 서비스 추상화를 제공하기 위한
작은 메커니즘 세트 중 하나를 구성하는 프로그램이다.
클러스터에서 kube-proxy를 사용하지 않는 경우, 다음 섹션이 적용되지 않으며
사용 중인 서비스 구현을 조사해야 한다.

### kube-proxy가 실행 중인가요?

노드에서 `kube-proxy`가 실행 중인지 확인한다.  노드가 직접 실행하면,
아래와 같은 결과를 얻을 수 있다.

```shell
ps auxw | grep kube-proxy
```
```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

다음으로 마스터에 연락하는 것처럼, 명백한 오류가 없는지 확인한다.
이렇게 하려면, 로그를 확인해야 한다.  로그에 엑세스하는 것은
노드의 OS 마다 다르다.  일부 OS에서는 /var/log/kube-proxy.log와 같은 파일이다.
반면 다른 OS에서는 로그에 엑세스하기 위해 `journalctl`을 사용한다.
다음과 같은 내용이 표시되어야 한다.

```none
I1027 22:14:53.995134    5063 server.go:200] Running in resource-only container "/kube-proxy"
I1027 22:14:53.998163    5063 server.go:247] Using iptables Proxier.
I1027 22:14:54.038140    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns-tcp" to [10.244.1.3:53]
I1027 22:14:54.038164    5063 proxier.go:352] Setting endpoints for "kube-system/kube-dns:dns" to [10.244.1.3:53]
I1027 22:14:54.038209    5063 proxier.go:352] Setting endpoints for "default/kubernetes:https" to [10.240.0.2:443]
I1027 22:14:54.038238    5063 proxier.go:429] Not syncing iptables until Services and Endpoints have been received from master
I1027 22:14:54.040048    5063 proxier.go:294] Adding new service "default/kubernetes:https" at 10.0.0.1:443/TCP
I1027 22:14:54.040154    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns" at 10.0.0.10:53/UDP
I1027 22:14:54.040223    5063 proxier.go:294] Adding new service "kube-system/kube-dns:dns-tcp" at 10.0.0.10:53/TCP
```

마스터에 연결할 수 없다는 오류 메시지가 표시되면
노드 구성 및 설치 단계를 다시 확인해야 한다.

`kube-proxy`가 올바르게 실행되지 않는 이유 중 하나는
필수 `conntrack` 바이너리를 찾을 수 없기 때문이다.
클러스터를 설치하는 방법(예, 사전에 준비 없이 쿠버네티스를 설치)에 따라
일부 리눅스 시스템에서 발생할 수 있다. 이 경우,
`conntrack` 패키지(예, 우분투에서 `sudo apt install conntrack`)를 수동으로 설치한 다음
다시 시도해야 한다.

Kube-proxy는 몇 가지 모드 중 하나로 실행할 수 있다.  위에 나열된 로그에서,
`Using iptables Proxier` 라인은 kube-proxy가 "iptables" 모드에서 실행 중임을 나타낸다.
가장 일반적인 다른 모드는 "ipvs"이다.

#### Iptables 모드

"iptables" 모드에서, 노드에 다음과 같은 내용이 표시되어야 한다.

```shell
iptables-save | grep hostnames
```
```none
-A KUBE-SEP-57KPRZ3JQVENLNBR -s 10.244.3.6/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-57KPRZ3JQVENLNBR -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.3.6:9376
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -s 10.244.1.7/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-WNBA2IHDGP2BOBGZ -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.1.7:9376
-A KUBE-SEP-X3P2623AGDH6CDF3 -s 10.244.2.3/32 -m comment --comment "default/hostnames:" -j MARK --set-xmark 0x00004000/0x00004000
-A KUBE-SEP-X3P2623AGDH6CDF3 -p tcp -m comment --comment "default/hostnames:" -m tcp -j DNAT --to-destination 10.244.2.3:9376
-A KUBE-SERVICES -d 10.0.1.175/32 -p tcp -m comment --comment "default/hostnames: cluster IP" -m tcp --dport 80 -j KUBE-SVC-NWV5X2332I4OT4T3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.33332999982 -j KUBE-SEP-WNBA2IHDGP2BOBGZ
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -m statistic --mode random --probability 0.50000000000 -j KUBE-SEP-X3P2623AGDH6CDF3
-A KUBE-SVC-NWV5X2332I4OT4T3 -m comment --comment "default/hostnames:" -j KUBE-SEP-57KPRZ3JQVENLNBR
```

각 서비스의 포트에 대해, `KUBE-SERVICES`에는 하나의 규칙과
`KUBE-SVC-<hash>` 체인이 있어야 한다.  각 파드 엔드포인트에 대해,
`KUBE-SVC-<hash>`에는 적은 수의 규칙이 있어야 하고 그 안에 적은 수의 규칙이 있는 하나의
`KUBE-SEP-<hash>` 체인이 있어야 한다.  정확한 규칙은
올바른 설정(노드 포트 및 로드 밸런서 포함)에 따라 다르다.

#### IPVS 모드

"ipvs" 모드에서는, 노드에 다음과 같은 내용이 표시되어야 한다.

```shell
ipvsadm -ln
```
```none
Prot LocalAddress:Port Scheduler Flags
  -> RemoteAddress:Port           Forward Weight ActiveConn InActConn
...
TCP  10.0.1.175:80 rr
  -> 10.244.0.5:9376               Masq    1      0          0
  -> 10.244.0.6:9376               Masq    1      0          0
  -> 10.244.0.7:9376               Masq    1      0          0
...
```

각 서비스의 포트와 모든 NodePort, 외부 IP
및 로드 밸런서 IP에 대해 kube-proxy는 가상 서버를 생성한다.
각 파드 엔드포인트에 대해, 해당하는 실제 서버를 생성한다.
예제에서, 서비스 호스트네임(`10.0.1.175:80`)에는 3개의 엔드포인트가 있습니다(`10.244.0.5:9376`,
`10.244.0.6:9376`, `10.244.0.7:9376`).

### kube-proxy는 프록시입니까?

위의 경우 하나가 있다고 가정하면, 하나의 노드에서
IP로 서비스에 다시 액세스한다.

```shell
curl 10.0.1.175:80
```
```none
hostnames-632524106-bbpiw
```

그래도 실패하면 `kube-proxy` 로그에서 다음과 같은 특정 라인을 확인한다.

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

표시되지 않으면, `-v` 플래그를 4로 설정해서 `kube-proxy`를 재 시작한 다음
로그를 다시 살펴본다.

### 엣지 케이스: 파드가 서비스 IP를 통해 자신에게 도달하는데 실패한다. {#a-pod-fails-to-reach-itself-via-the-service-ip}

그럴 것 같지 않을 수도 있지만 실제로 발생하고 작동해야 한다.

네트워크가 'hairpin' 트래픽에 대해 제대로 구성되지 않은 경우,
일반적으로 `kube-proxy`가 `iptables` 모드에서 실행되고
파드가 브릿지 네트워크에 연결된 경우에 발생할 수 있다. `Kubelet`은 서비스의
엔드포인트가 서비스 VIP에 액세스하려고 시도하는 경우 로드밸런스를 다시 수행할 수 있도록
'hairpin-mode` [flag](/docs/reference/command-line-tools-reference/kubelet/)를 노출한다.
`hairpin-mode` 플래그는 `hairpin-veth` 또는
`promiscuous-bridge`로 설정되어야 한다.

이 문제를 해결하기 위해 일반적인 단계를 다음과 같다.

* `hairpin-mode`는 `hairpin-veth` 또는 `promiscuous-bridge`로 설정되어 있는지 확인한다.
아래와 같은 내용이 표시되어야 한다. 다음과 같은 예에서 `hairpin-mode`는
`promiscuous-bridge`로 설정된다.

```shell
ps auxw | grep kubelet
```
```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* 실행 중인 `hairpin-mode`를 확인한다. 확인하기 위해, kubelet 로그를 확인해야 한다.
로그 액세스는 노드 OS에 따라 다르다. 일부 OS에서는
/var/log/kubelet.log와 같은 파일인 반면 다른 OS에서는 `journalctl`을
사용하여 로그에 액세스한다. 실제의 hairpin 모드는 호환성으로 인해 `--hairpin-mode` 플래그와
일치하지 않을 수 있으니 주의한다. kubelet.log에 `hairpin` 이라는 키워드가 포함된
로그 라인이 있는지 확인한다. 아래와 같이
실행 중인 헤어핀 모드를 나타내는 로그 라인이 있어야 한다.

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* 실행 중인 hairpin 모드가 `hairpin-veth`인 경우, `Kubelet`이
노드의 `/sys`에서 작동할 수 있는 권한이 있는지 확인한다. 모든 것이 제대로 작동하면,
다음과 같이 표시된다.

```shell
for intf in /sys/devices/virtual/net/cbr0/brif/*; do cat $intf/hairpin_mode; done
```
```none
1
1
1
1
```

* 실행 중인 hairpin 모드가 `promiscuous-bridge`인 경우,
`Kubelet`이 노드에서 linux 브릿지를 조작할 수 있는 권한이 있는지 확인한다. `cbr0` 브릿지가
제대로 구성되고 사용되고 있으면, 다음과 같이 볼 수 있다.

```shell
ifconfig cbr0 |grep PROMISC
```
```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* 위의 방법에서 어는 것도 해결되지 않으면 도움을 요청한다.

## Seek help

여기까지 왔다면, 아주 이상한 일이 발생하고 있다.  서비스가
실행 중이고, 엔드포인트가 있으며, 파드가 실제로 제공되고 있다.  DNS가
DNS가 작동 중이고, `kube-proxy`가 오작동하지 않는 것 같다.
커뮤니티에서는 이슈에 대해 도울 수 있도록 어떤 일이 발생하고 있는지
알려준다!

[Slack](https://slack.k8s.io/) 또는
[Forum](https://discuss.kubernetes.io) 또는
[GitHub](https://github.com/kubernetes/kubernetes)
에서 문의한다.

## {{% heading "whatsnext" %}}

자세한 내용은 [troubleshooting overview document](/docs/tasks/debug/)
를 참고한다.


