---
# reviewers:
# - thockin
# - bowei
content_type: task
title: 서비스 디버깅하기
weight: 20
---

<!-- overview -->
쿠버네티스를 새로 설치할 때 자주 발생하는 문제 중 하나는
서비스가 제대로 작동하지 않는 현상이다. 디플로이먼트(또는 다른 워크로드 컨트롤러)를 통해 파드를 실행하고
서비스를 생성했지만,
해당 서비스에 엑세스하려고 하면 응답이 없는 경우이다. 이 문서를 통해 무엇이 잘못되었는지
파악하는 데 도움이 되기를 바란다.

<!-- body -->

## 파드 안에서 명령어 실행

이 페이지의 많은 단계에서, 클러스터 내에 실행 중인 파드가 어떤 것을 보고 있는지
알고 싶을 것이다. 이를 수행하는 가장 간단한 방법은 대화형 busybox 파드를 실행하는 것이다:

```none
kubectl run -it --rm --restart=Never busybox --image=gcr.io/google-containers/busybox sh
```

{{< note >}}
명령 프롬프트가 보이지 않으면, enter를 눌러 본다.
{{< /note >}}

사용하려는 파드가 이미 실행 중인 경우, 다음을 사용하여
명령을 실행할 수 있다.

```shell
kubectl exec <POD-NAME> -c <CONTAINER-NAME> -- <COMMAND>
```

## 설정

연습을 위해, 파드를 몇 개 실행한다.
자신이 관리하는 서비스를 디버깅하는 경우에는 세부 사항을 상황에 맞게 변경하고,
아니면 아래의 과정을 그대로 수행하여 두 번째 데이터 포인트를 얻을 수 있다.

```shell
kubectl create deployment hostnames --image=registry.k8s.io/serve_hostname
```
```none
deployment.apps/hostnames created
```

`kubectl` 명령어는 생성되거나 변경된 리소스의 유형과 이름을 출력하여, 여기서 출력된 리소스 유형과 이름은 다음 명령어에 사용할 수 있다.

디플로이먼트의 레플리카를 3개로 확장한다.
```shell
kubectl scale deployment hostnames --replicas=3
```
```none
deployment.apps/hostnames scaled
```

참고로, 위의 명령들을 실행하여 디플로이먼트를 실행하는 것은
다음과 같은 YAML을 사용하는 것과 동일하다.

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

"app" 레이블은 `kubectl create deployment`명령에 의해 디플로이먼트의 이름으로 자동으로
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

파드가 서빙 중인지도 확인할 수 있다. 파드 IP주소의 목록을 가져온 뒤 이를
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

연습에 사용된 컨테이너 예제는 포트 9376에서 HTTP를 통해 호스트이름을 리턴하지만,
본인의 앱을 디버깅하는 경우,
포트 번호를 파드가 수신 대기 중인 포트 번호로 대체하면 된다.

파드 내에서 다음을 실행한다.

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

다음과 같은 결과가 출력될 것이다.

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

이 단계에서 예상한 응답을 받지 못한 경우, 파드가
정상적이지 않거나 또는 예상했던 포트에서 수신 대기를 하지 않고 있을 가능성이 있다.
어떤 일이 발생하고 있는지 확인하는 데 `kubectl logs`가 유용할 수 있으며,
또는 파드에 직접 `kubectl exec`를 실행하고
이를 통해 디버그을 수행해야 할 수도 있다.

지금까지 모든 것이 계획대로 진행되었다면, 서비스가 작동하지 않는 이유를
분석해 볼 수 있다.

## 서비스가 존재하는가?

여기까지 따라왔다면 아직 실제로 서비스를 생성하지 않았다는 것을 알아차렸을 것이다.
이는 의도적인 것이다.  이 단계는 때때로 잊어버리지만,
가장 먼저 확인해야 할 단계이다.

존재하지 않는 서비스에 액세스하려고 하면 어떤 일이 발생할까?
이름을 이용하여 이 서비스를 사용하는 다른 파드가 있다면
다음과 같은 결과를 얻을 것이다.

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

이제 서비스를 생성하자. 이전에도 언급했듯이, 이것은 연습을 위한 예시이다.
본인의 서비스의 세부 사항을 여기에 입력할 수도 있다.

```shell
kubectl expose deployment hostnames --port=80 --target-port=9376
```
```none
service/hostnames exposed
```

다시 조회해 본다.

```shell
kubectl get svc hostnames
```
```none
NAME        TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)   AGE
hostnames   ClusterIP   10.0.1.175   <none>        80/TCP    5s
```

이제 서비스가 존재하는 것을 확인할 수 있다.

위와 마찬가지로, 위의 명령들을 실행하여 서비스를 실행하는 것은 다음과 같은 YAML을 사용하는 것과 동일하다.

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

## 대상 파드에 영향을 미치는 네트워크 폴리시 인그레스 규칙이 있는가?

`hostnames-*` 파드로 들어오는 트래픽에 영향을 줄 수 있는 네트워크 폴리시 인그레스 규칙을
배포하는 경우, 이를 검토해야 한다.

자세한 내용은 [Network Policies](/ko/docs/concepts/services-networking/network-policies/)를 참고한다.

## 서비스가 DNS 이름으로 작동하는가?

클라이언트가 서비스를 사용하는 가장 일반적인 방법 중 하나는 DNS 이름을 통하는
것이다.

동일한 네임스페이스안의 파드 안에서, 다음을 실행한다.

```shell
nslookup hostnames
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

이것이 실패하면, 파드와 서비스가 다른 네임스페이스에 있는 경우일 수 있다.
네임스페이스를 지정한 이름(namespace-qualified name)을 사용해 본다(다시 말하지만, 파드 안에서 다음을 실행한다).

```shell
nslookup hostnames.default
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

이 방법이 성공했다면, 교차 네임스페이스 이름을 사용하기 위해 앱을 조정하거나,
또는 앱과 서비스를 동일한 네임스페이스에서 실행한다.  여전히 실패한다면,
완전히 지정된 이름(fully-qualified name)을 사용한다.

```shell
nslookup hostnames.default.svc.cluster.local
```
```none
Address 1: 10.0.0.10 kube-dns.kube-system.svc.cluster.local

Name:      hostnames.default.svc.cluster.local
Address 1: 10.0.1.175 hostnames.default.svc.cluster.local
```

여기서 접미사: "default.svc.cluster.local"에 유의한다.
"default"는 작업 중인 네임스페이스이다. "svc"는 서비스임을 나타낸다.
"cluster.local"은 클러스터 도메인을 나타내며,
클러스터마다 다를 수 있다.

동일한 작업을 클러스터의 노드에서 시도해 볼 수도 있다.

{{< note >}}
10.0.0.10 은 클러스터의 DNS 서비스 IP이며, 사용자의 것과 다를 수 있다.
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

완전히 지정된 이름은 조회가 가능하지만 상대적인 이름은 조회를 할 수 없는 경우,
파드의 `/etc/resolv.conf` 파일이 올바른지 확인해야 한다.
파드 내에서 다음을 실행한다.

```shell
cat /etc/resolv.conf
```

다음과 같은 내용이 표시될 것이다.

```
nameserver 10.0.0.10
search default.svc.cluster.local svc.cluster.local cluster.local example.com
options ndots:5
```

`nameserver` 라인은 클러스터의 DNS 서비스를 나타내야 한다.
이는 `--cluster-dns` 플래그와 함께 `kubelet`으로 전달된다.

`search` 라인은 서비스 이름을 찾을 수 있는 적절한 접미사가 포함되어야 한다.
위 예시의 경우, ("default.svc.cluster.local" ->) 로컬 네임스페이스의 서비스,
("svc.cluster.local" ->) 모든 네임스페이스의 서비스,
마지막으로 클러스터 ("cluster.local" ->) 클러스터 범위에서 이름을 찾는다.
클러스터의 구성에 따라 그 뒤에 추가 레코드를 기입할 수도 있다(총 6개까지).
클러스터 접미사는 `--cluster-domain` 플래그와 함께
`kubelet`에 전달된다.  이 문서에서, 클러스터 접미사는
"cluster.local"로 간주된다. 당신의 클러스터가 다르게 구성되었을 수도 있으며,
이 경우 이전의 모든 명령어에서 이를
변경해야 한다.

`options` 라인의 `ndots` 값은 DNS 클라이언트 라이브러리가 모든 탐색 경우의 수를 고려할 수 있을 만큼 충분히 높게 설정되어야 한다.
쿠버네티스는 기본적으로 5로 설정하며,
이는 쿠버네티스가 생성하는 모든 DNS 이름을 포함할 수 있을 만큼 충분히 높다.

### DNS 이름으로 동작하는 서비스가 하나라도 있는가? {#does-any-service-exist-in-dns}

위의 작업이 계속 실패하면, 서비스에 대해 DNS 조회가 작동하지 않는 것이다.
한 걸음 뒤로 물러나서 어떤 것이 작동하지 않는지 확인할 수 있다. 쿠버네티스 마스터
서비스는 항상 작동해야 한다. 파드 내에서 다음을 실행한다.

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

## 서비스가 IP로 작동하는가?

DNS가 작동하는 것을 확인했다고 가정하면, 다음 테스트는
서비스가 IP 주소로 작동하는지 확인하는 것이다.  클러스터의 파드에서,
서비스의 IP에 액세스한다(위와 같이 `kubectl get`을 사용).

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

서비스가 작동하는 경우, 올바른 응답을 받았을 것이다. 그렇지 않은 경우,
잘못되어 있을 수 있는 여러가지 사항이 있다. 아래의 내용을 계속 읽어 본다.

## 서비스가 올바르게 정의되었는가?

몇 차례 강조하지만, 서비스가 정확하게 기재되어 있고 파드의 포트와 일치하는지
두 번, 세 번 확인해야 한다. 아래의 명령을 실행하여
서비스를 다시 조회해 본다.

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

* 액세스하려는 서비스 포트가 `spec.ports[]`에 나열되어 있는가?
* 파드에 대한 `targetPort`가 올바른가(일부 파드는 서비스와 다른 포트를 사용한다)?
* 숫자 포트를 사용하려는 경우, 자료형이 숫자(9376)인가 문자열 "9376"인가?
* 이름이 부여된 포트를 사용하려는 경우, 파드가 해당 이름의 포트를 노출하는가?
* 포트의 'protocol'이 파드의 것과 일치하는가?

## 서비스에 엔드포인트가 있는가?

여기까지 왔다면, 서비스가 올바르게 정의되어 있고
DNS에 의해 해석될 수 있음을 확인한 것이다. 이제 실행 중인 파드가
서비스에 의해 실제로 선택되고 있는지 확인한다.

이전에 파드가 실행 중임을 확인했다. 다음 명령을 통해 다시 확인할 수 있다.

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

"AGE" 열은 파드가 실행된 지 약 1시간 되었다고 표시하는 것으로,
이는 파드가 제대로 실행되고 있으며 충돌하지 않음을 의미한다.

"RESTARTS" 열은 파드가 자주 충돌하지 않거나 다시 시작되지 않음을 나타낸다.
잦은 재시작은 간헐적인 연결 문제를 발생할 수 있다.
재시작 횟수가 높으면, [파드를 디버깅하는](/ko/docs/tasks/debug/debug-application/debug-pods/) 방법에 대해 참고한다.

쿠버네티스 시스템 내부에는 모든 서비스의 셀렉터를 평가하고
그 결과를 해당 엔드포인트 오브젝트에 저장하는 제어 루프가 있다.

```shell
kubectl get endpoints hostnames

NAME        ENDPOINTS
hostnames   10.244.0.5:9376,10.244.0.6:9376,10.244.0.7:9376
```

위의 결과를 통해 엔드포인트 컨트롤러가 서비스에 대한 올바른 파드를 찾았음을 알 수 있다.
`ENDPOINTS` 열이 `<none>`인 경우,
서비스의 `spec.selector` 필드가 파드의 `metadata.labels` 값을
실제로 선택하는지 확인해야 한다.
흔한 실수로, `kubectl run` 명령으로 디플로이먼트도 생성할 수 있었던 1.18 이전 버전에서,
서비스는 `app=hostnames` 를 이용하여 파드를 선택하지만
디플로이먼트는 `run=hostnames` 를 이용하여 파드를 선택하는 것과 같은 오타, 또는 기타 오류가 있을 수 있다.

## 파드가 작동하고 있는가?

여기까지 왔다면, 서비스가 존재하며 이 서비스가 파드를 선택하고 있는 것이다.
파드 자체에 대해서는 이 연습의 시작부분에서 확인했었다.
이제 파드가 실제로 작동하는지 다시 확인해 보자.
위에서 나열된 엔드포인트를 이용하여
서비스 메카니즘을 우회하고 파드에 직접 접근할 수 있다.

{{< note >}}
이러한 명령은 서비스 포트(80)가 아닌 파드 포트(9376)을 사용한다.
{{< /note >}}

파드 내에서 다음을 실행한다.

```shell
for ep in 10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376; do
    wget -qO- $ep
done
```

이렇게 하면 다음과 같은 결과가 나타난다.

```
hostnames-632524106-bbpiw
hostnames-632524106-ly40y
hostnames-632524106-tlaok
```

엔드포인트 목록의 각 파드가 호스트네임을 반환할 것이라고 예상할 수 있다.
파드가 호스트네임을 반환하지 않는다면 (또는 파드가 정상 동작을 하지 않는다면)
무슨 일이 일어나고 있는지 조사해야 한다.

## kube-proxy가 작동하는가?

여기까지 진행했다면, 서비스가 실행 중이고, 엔드포인트가 있으며, 파드가
실제로 서빙하고 있는 것이다. 이 시점에서는, 전체 서비스 프록시 메커니즘이 의심된다.
하나씩 확인하기로 한다.

kube-proxy는 쿠버네티스 서비스의 기본 구현이며 대부분의 클러스터에서 사용하고 있다.
kube-proxy는 모든 노드에서 실행되며, 서비스 추상화를 제공하기 위한
메커니즘 일부를 구성하는 프로그램이다.
사용자의 클러스터에서 kube-proxy를 사용하지 않는 경우, 다음 섹션이 적용되지 않으며,
사용 중인 서비스 구현에 대한 내용을 조사해야 할 것이다.

### kube-proxy가 실행 중인가?

노드에서 `kube-proxy`가 실행 중인지 확인한다. 다음의 명령을 노드에서 직접 실행하면,
아래와 같은 결과를 얻을 수 있다.

```shell
ps auxw | grep kube-proxy
```
```none
root  4194  0.4  0.1 101864 17696 ?    Sl Jul04  25:43 /usr/local/bin/kube-proxy --master=https://kubernetes-master --kubeconfig=/var/lib/kube-proxy/kubeconfig --v=2
```

다음으로, 반드시 되어야 하는 것(예: 마스터와 통신)이 잘 되는지를 확인한다.
이를 수행하려면, 로그를 확인한다. 로그에 액세스하는 방법은
노드의 OS 별로 다르다.  일부 OS에서는 /var/log/kube-proxy.log와 같은 파일이다.
반면 어떤 OS에서는 로그에 액세스하기 위해 `journalctl`을 사용한다.
다음과 같은 내용이 표시될 것이다.

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

마스터와 통신할 수 없다는 오류 메시지가 표시되면
노드 구성 및 설치 단계를 다시 확인해야 한다.

`kube-proxy`가 올바르게 실행되지 않는 이유 중 하나로
필수 `conntrack` 바이너리를 찾을 수 없는 경우가 있을 수 있다.
클러스터를 설치하는 방법(예, 사전에 준비 없이 쿠버네티스를 설치)에 따라
일부 리눅스 시스템에서 발생할 수 있다. 이 경우,
`conntrack` 패키지를 수동으로 설치(예: 우분투에서 `sudo apt install conntrack`)한 다음
다시 시도해야 한다.

Kube-proxy는 몇 가지 모드 중 하나로 실행할 수 있다.  위에 나열된 로그에서,
`Using iptables Proxier` 라인은 kube-proxy가 "iptables" 모드로 실행 중임을 나타낸다.
가장 일반적인 다른 모드는 "ipvs"이다.

#### Iptables 모드

"iptables" 모드일 때, 노드에서 다음 명령을 실행하면 아래와 같은 내용이 표시될 것이다.

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

각 서비스의 포트에 대해, `KUBE-SERVICES` 내의 하나의 규칙, 그리고
하나의 `KUBE-SVC-<hash>` 체인이 있어야 한다.  각 파드 엔드포인트에 대해,
해당 `KUBE-SVC-<hash>`에는 몇 개의 규칙이 있어야 하고, 또한 몇 개의 규칙을 포함하는 하나의
`KUBE-SEP-<hash>` 체인이 있어야 한다.  정확한 규칙은
사용자의 정확한 설정(노드 포트 및 로드 밸런서 포함)에 따라 다르다.

#### IPVS 모드

"ipvs" 모드일 때, 노드에서 다음 명령을 실행하면 아래와 같은 내용이 표시될 것이다.

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
각 파드 엔드포인트에 대해, kube-proxy는 각 가상 서버에 대응되는 실제 서버를 생성한다.
예제에서, 'hostnames' 서비스(`10.0.1.175:80`)에는 3개의 엔드포인트(`10.244.0.5:9376`,
`10.244.0.6:9376`, `10.244.0.7:9376`)가 있다.

### kube-proxy가 프록싱을 수행하고 있는가?

위에서 소개한 사례 중 하나를 마주했다고 가정한다면,
노드 중 하나에서 다음을 실행하여 서비스에 IP로 다시 액세스해 본다.

```shell
curl 10.0.1.175:80
```
```none
hostnames-632524106-bbpiw
```

그래도 실패한다면, `kube-proxy` 로그에서 다음과 같은 특정 라인을 확인한다.

```none
Setting endpoints for default/hostnames:default to [10.244.0.5:9376 10.244.0.6:9376 10.244.0.7:9376]
```

이러한 라인이 보이지 않으면, `-v` 플래그를 4로 설정하여 `kube-proxy`를 재시작한 다음
로그를 다시 살펴본다.

### 엣지 케이스: 파드가 서비스 IP를 통해 자신에게 도달하는 데 실패하는 경우 {#a-pod-fails-to-reach-itself-via-the-service-ip}

이러한 일이 일어날 것 같지 않을 수도 있지만 실제로 일어나기도 하며, 정상적이라면 제대로 동작해야 한다.

이러한 현상은 네트워크가 '헤어핀' 트래픽(클러스터 내부에서 U턴하는 트래픽)에 대해 제대로 구성되지 않은 경우에 발생할 수 있으며,
이는 주로 `kube-proxy`가 `iptables` 모드에서 실행되고
파드가 브릿지 네트워크에 연결된 경우에 해당할 수 있다.
`kubelet`은 파드가 자신이 속한 서비스 VIP로 접근하는 경우
서비스의 엔드포인트가 이 트래픽을 다시 서비스의 파드로 로드밸런싱하도록 하는
'hairpin-mode` [플래그](/docs/reference/command-line-tools-reference/kubelet/)를 노출한다.
`hairpin-mode` 플래그는 `hairpin-veth` 또는 `promiscuous-bridge`로 설정되어야 한다.

이 문제를 해결하기 위한 일반적인 단계는 다음과 같다.

* `hairpin-mode`가 `hairpin-veth` 또는 `promiscuous-bridge`로 설정되어 있는지 확인한다.
  아래와 같은 내용이 표시되어야 한다. 아래 예시에서 `hairpin-mode`는
  `promiscuous-bridge`로 설정되어 있다.

```shell
ps auxw | grep kubelet
```
```none
root      3392  1.1  0.8 186804 65208 ?        Sl   00:51  11:11 /usr/local/bin/kubelet --enable-debugging-handlers=true --config=/etc/kubernetes/manifests --allow-privileged=True --v=4 --cluster-dns=10.0.0.10 --cluster-domain=cluster.local --configure-cbr0=true --cgroup-root=/ --system-cgroups=/system --hairpin-mode=promiscuous-bridge --runtime-cgroups=/docker-daemon --kubelet-cgroups=/kubelet --babysit-daemons=true --max-pods=110 --serialize-image-pulls=false --outofdisk-transition-frequency=0
```

* 실제로 적용되어 있는 `hairpin-mode`가 무엇인지 확인한다. 이를 확인하려면, kubelet 로그를 확인해야 한다.
  로그 액세스는 노드 OS에 따라 다르다. 일부 OS에서는
  /var/log/kubelet.log와 같은 파일인 반면 다른 OS에서는 `journalctl`을
  사용하여 로그에 액세스한다. 실제로 적용되어 있는 hairpin 모드는 호환성으로 인해 `--hairpin-mode` 플래그와
  일치하지 않을 수 있으므로 주의한다. kubelet.log에 `hairpin` 이라는 키워드가 포함된
  로그 라인이 있는지 확인한다. 아래와 같이
  실행 중인 헤어핀 모드를 나타내는 로그 라인이 있을 것이다.

```none
I0629 00:51:43.648698    3252 kubelet.go:380] Hairpin mode set to "promiscuous-bridge"
```

* 실행 중인 hairpin 모드가 `hairpin-veth`인 경우, `kubelet`이
노드의 `/sys`에서 작동할 수 있는 권한이 있는지 확인한다. 모든 것이 제대로 작동한다면,
다음 명령을 실행했을 때 아래와 같이 표시될 것이다.

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
`Kubelet`이 노드 안에서 리눅스 브릿지를 조작할 수 있는 권한이 있는지 확인한다. `cbr0` 브릿지가
사용되었고 제대로 구성되어 있다면, 다음 명령을 실행했을 때 아래와 같이 표시될 것이다.

```shell
ifconfig cbr0 |grep PROMISC
```
```none
UP BROADCAST RUNNING PROMISC MULTICAST  MTU:1460  Metric:1
```

* 위의 방법 중 어느 것으로도 해결되지 않는다면, 도움을 요청한다.

## 도움 요청하기

여기까지 왔다면, 아주 이상한 일이 발생하고 있는 것이다.  서비스가
실행 중이고, 엔드포인트가 있으며, 파드가 실제로 서빙하고 있는 상태이다.
DNS가 작동 중이고, `kube-proxy`가 오작동하는 것은 아닌 것 같다.
그럼에도 서비스가 동작하지 않는 것이다.
우리가 도울 수 있도록, 어떤 일이 일어나고 있는지 커뮤니티에 알려주세요!

[Slack](https://slack.k8s.io/) 또는
[포럼](https://discuss.kubernetes.io) 또는
[GitHub](https://github.com/kubernetes/kubernetes)
에 문의한다.

## {{% heading "whatsnext" %}}

자세한 내용은 [트러블슈팅하기 개요 문서](/ko/docs/tasks/debug/)
를 참고한다.
