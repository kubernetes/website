---
title: 외부 로드 밸런서 생성하기
content_type: task
weight: 80
---

<!-- overview -->

이 문서는 외부 로드 밸런서를 생성하는 방법에 관하여 설명한다.

{{< glossary_tooltip text="서비스" term_id="service" >}}를 생성할 때,
클라우드 로드 밸런서를 자동으로 생성하는 옵션을 사용할 수 있다.
이것은 클러스터 노드의 올바른 포트로 트래픽을 전송할 수 있도록
외부에서 접근 가능한 IP 주소를 제공한다.
_클러스터가 지원되는 환경과
올바른 클라우드 로드 밸런서 제공자 패키지 구성으로 실행되는 경우._

또한, 서비스 대신 {{< glossary_tooltip text="인그레스(Ingress)" term_id="ingress" >}} 를 사용할 수 있다.
자세한 사항은 [인그레스(Ingress)](/ko/docs/concepts/services-networking/ingress/)
문서를 참고한다.

## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

클러스터는 반드시 클라우드 또는 외부 로드 밸런서 구성을 지원하는
환경에서 실행 중이어야 한다.


<!-- steps -->

## 서비스 생성

### 매니페스트를 사용하여 서비스 생성하기

외부 로드 밸런서를 생성하기 위해서, 서비스 매니페스트에
다음을 추가한다.

```yaml
    type: LoadBalancer
```

매니페스트는 아래와 같을 것이다.

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  type: LoadBalancer
```

### kubectl를 이용하여 서비스 생성하기

또한, `kubectl expose` 명령어에 `--type=LoadBalancer` 플래그를 이용해
서비스를 생성할 수 있다.

```bash
kubectl expose deployment example --port=8765 --target-port=9376 \
        --name=example-service --type=LoadBalancer
```

이 명령은 동일한 리소스를 셀렉터로 참조하는 새로운 서비스를 만든다. 
(위 예시의 경우, `example`로 명명된
{{< glossary_tooltip text="디플로이먼트(Deployment)" term_id="deployment" >}} ).

명령줄 옵션 플래그를 포함한, 더 자세한 내용은 
[`kubectl expose` 레퍼런스](/docs/reference/generated/kubectl/kubectl-commands/#expose) 문서를 참고한다.

## IP 주소 찾기

`kubectl` 명령어를 사용해 서비스 정보를 얻어,
생성된 서비스에 관한 IP 주소를 찾을 수 있다.

```bash
kubectl describe services example-service
```

출력은 다음과 같다.

```
Name:                     example-service
Namespace:                default
Labels:                   app=example
Annotations:              <none>
Selector:                 app=example
Type:                     LoadBalancer
IP Families:              <none>
IP:                       10.3.22.96
IPs:                      10.3.22.96
LoadBalancer Ingress:     192.0.2.89
Port:                     <unset>  8765/TCP
TargetPort:               9376/TCP
NodePort:                 <unset>  30593/TCP
Endpoints:                172.17.0.3:9376
Session Affinity:         None
External Traffic Policy:  Cluster
Events:                   <none>
```

로드 밸런서의 IP 주소는 `LoadBalancer Ingress` 옆에 나타난다.

{{< note >}}
만약 서비스가 Minikube에서 실행되고 있다면, 아래의 명령을 통해 할당된 IP 주소와 포트를 찾을 수 있다.

```bash
minikube service example-service --url
```
{{< /note >}}

## 클라이언트 소스 IP 보존하기 {#preserving-the-client-source-ip}

기본적으로 대상 컨테이너에 보이는 소스 IP는 클라이언트의 *원래 소스 IP가 아니다.*
클라이언트의 IP를 보존할 수 있도록 하려면,
아래의 서비스 `.spec` 필드 구성을 따른다.

* `.spec.externalTrafficPolicy` - 이 서비스가 외부 트래픽을 노드-로컬 또는
  클러스터-전체 엔드포인트로 라우팅할지 여부를 나타낸다.
  두 가지 옵션이 있다. `Cluster` (기본) 그리고 `Local`.
  `Cluster` 는 클라이언트 소스 IP를 가리고 다른 노드에 대한
  두 번째 홉(hop)을 발생시킬 수 있지만,
  전체적인 부하 분산에서 이점이 있다.
  `Local` 은 클라이언트 소스 IP를 보존하고
  `LoadBalancer`와 `NodePort` 타입의 서비스에서 두 번째 홉(hop) 발생을 피할 수 있지만,
  트래픽 분산이 불균형적인 잠재적인 위험이 있다.
* `.spec.healthCheckNodePort` - 서비스를 위한 헬스 체크 노드 포트(정수 포트 번호)를 지정한다.
  `healthCheckNodePort`를 지정하지 않으면,
  서비스 컨트롤러가 클러스터의 노트 포트 범위에서 포트를 할당한다.
  API 서버 명령줄 플래그 `--service-node-port-range`를 설정하여 해당 범위를 구성할 수 있다.
  서비스 `type`이 `LoadBalancer`이고 `externalTrafficPolicy`를 `Local`로 설정한 경우,
  서비스는 `healthCheckNodePort`가 지정되었다면,
  사용자가 지정한 설정을 이용한다.

서비스 매니페스트에서 `externalTrafficPolicy`를 `Local`로 설정하면 이 기능이 작동한다.
예시:

```yaml
apiVersion: v1
kind: Service
metadata:
  name: example-service
spec:
  selector:
    app: example
  ports:
    - port: 8765
      targetPort: 9376
  externalTrafficPolicy: Local
  type: LoadBalancer
```

### 소스 IP를 보존할 때 주의사항 및 제한 사항 {#caveats-and-limitations-when-preserving-source-ips}

일부 클라우드 제공자의 로드 밸런싱 서비스에서는 대상별로 다른 가중치를 구성할 수 없다.

각 대상의 가중치는 노드로 전송하는 트래픽을 측면에서 균등하게 부여하기 때문에
외부 트래픽은 서로 다른 파드 간에 로드 밸런싱되지 않는다.
외부 로드 밸런서는 각 노드에서 대상으로 사용되는 파드의 개수를 인식하지 못한다.

`서비스파드개수 << 노드개수` 이거나 `서비스파드개수 >> 노드개수` 인 경우에선
가중치 없이도 거의 균등한 분포를 볼 수 있다.

내부 파드 간 트래픽은 `ClusterIP` 서비스에서와 비슷하게 모든 파드에서 동일한 확률로 IP 서비스를 제공한다.

## 가비지(Garbage) 수집 로드 밸런서 {#garbage-collecting-load-balancers}

{{< feature-state for_k8s_version="v1.17" state="stable" >}}

일반적으로 클라우드 제공자와 관련 있는 로드밸런서 리소스는 `type`이 `LoadBalancer`인
서비스가 삭제된 후 즉시 정리되어야 한다.
그러나 관련 서비스가 삭제된 후 클라우드 리소스가 고아가 되는 코너 케이스가 다양한 것으로 알려져 있다.
이러한 문제를 예방하기 위해 서비스 로드밸런서를 위한 `Finalizer Protection`이 도입되었다.
`Finalizer`를 사용하면, 서비스 리소스는 로드밸런서 관련 리소스가 삭제될 때까지 삭제되지 않는다.

특히 서비스에 `type`이 `LoadBalancer`인 경우
서비스 컨트롤러는 `service.kubernetes.io/load-balancer-cleanup`
이라는 이름의 `finalizer`를 붙인다.
`finalizer`는 (클라우드) 로드 밸런서 리소스를 정리한 후에만 제거된다.
이렇게 하면 서비스 컨트롤러 충돌(crash)과 같은 코너 케이스에서도
로드 밸런서 리소스가 고아가 되는 것을 방지할 수 있다.

## 외부 로드 밸런서 제공자 {#external-load-balancer-providers}

중요한 점은 이 기능을 위한 데이터 경로는 쿠버네티스 클러스터 외부의 로드 밸런서에서 제공한다는 것이다.

서비스의 `type`이 `LoadBalancer`로 설정된 경우,
쿠버네티스는 `type`이 `ClusterIP`인 경우처럼 동등한 기능을 클러스터 내의 파드에 제공하고
관련 쿠버네티스 파드를 호스팅하는 노드에 대한 항목으로 (쿠버네티스 외부) 로드 밸런서를 프로그래밍을 통해 확장한다.
쿠버네티스 컨트롤 플레인은 외부 로드 밸런서, (필요한 경우) 헬스 체크 및 (필요한 경우) 패킷 필터링 규칙의 생성을 자동화한다.
클라우드 공급자가 로드 밸런서에 대한 IP 주소를 할당하면 컨트롤 플레인이 해당 외부 IP 주소를 찾아 서비스 오브젝트를 갱신한다.

## {{% heading "whatsnext" %}}

* [서비스와 애플리케이션 연결하기](/ko/docs/tutorials/services/connect-applications-service/) 튜토리얼을 따라하기
* [서비스](/ko/docs/concepts/services-networking/service/)에 대해 알아보기
* [인그레스](/ko/docs/concepts/services-networking/ingress/)에 대해 알아보기
