---
title: Konnectivity 서비스 설정
content_type: task
weight: 70
---

<!-- overview -->

Konnectivity 서비스는 컨트롤 플레인에 클러스터 통신을 위한 TCP 수준 프록시를 
제공한다.

## {{% heading "prerequisites" %}}

쿠버네티스 클러스터가 있어야 하며, kubectl 명령줄 도구가 
클러스터와 통신하도록 설정되어 있어야 한다. 컨트롤 플레인 호스트가 아닌 
두 개 이상의 노드로 구성된 클러스터에서 이 튜토리얼을 수행하는 것을 권장한다. 
클러스터가 없다면, [minikube](https://minikube.sigs.k8s.io/docs/tutorials/multi_node/)를 
이용하여 생성할 수 있다.

<!-- steps -->

## Konnectivity 서비스 설정

다음 단계에는 송신(egress) 설정이 필요하다. 예를 들면 다음과 같다.

{{< codenew file="admin/konnectivity/egress-selector-configuration.yaml" >}}

Konnectivity 서비스를 사용하고 네트워크 트래픽을 클러스터 노드로 보내도록 
API 서버를 구성해야 한다.

1. [Service Account Token Volume Projection](/docs/tasks/configure-pod-container/configure-service-account/#service-account-token-volume-projection) 
기능이 활성화되어 있는지 확인한다. 
쿠버네티스 v1.20부터는 기본적으로 활성화되어 있다.
1. `admin/konnectivity/egress-selector-configuration.yaml`과 같은 송신 구성 파일을 생성한다.
1. API 서버의 `--egress-selector-config-file` 플래그를 
API 서버 송신 구성 파일의 경로로 설정한다.
1. UDS 연결을 사용하는 경우 kube-apiserver에 볼륨 구성을 추가한다.
   ```yaml
   spec:
     containers:
       volumeMounts:
       - name: konnectivity-uds
         mountPath: /etc/kubernetes/konnectivity-server
         readOnly: false
     volumes:
     - name: konnectivity-uds
       hostPath:
         path: /etc/kubernetes/konnectivity-server
         type: DirectoryOrCreate
   ```

konnectivity-server에 대한 인증서 및 kubeconfig를 생성하거나 얻는다.
예를 들어 OpenSSL 커맨드라인 툴을 사용하여 컨트롤 플레인 호스트에서 
클러스터 CA 인증서 `/etc/kubernetes/pki/ca.crt`를 사용하여 X.509 인증서를 발급할 수 있다.

```bash
openssl req -subj "/CN=system:konnectivity-server" -new -newkey rsa:2048 -nodes -out konnectivity.csr -keyout konnectivity.key
openssl x509 -req -in konnectivity.csr -CA /etc/kubernetes/pki/ca.crt -CAkey /etc/kubernetes/pki/ca.key -CAcreateserial -out konnectivity.crt -days 375 -sha256
SERVER=$(kubectl config view -o jsonpath='{.clusters..server}')
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-credentials system:konnectivity-server --client-certificate konnectivity.crt --client-key konnectivity.key --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-cluster kubernetes --server "$SERVER" --certificate-authority /etc/kubernetes/pki/ca.crt --embed-certs=true
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config set-context system:konnectivity-server@kubernetes --cluster kubernetes --user system:konnectivity-server
kubectl --kubeconfig /etc/kubernetes/konnectivity-server.conf config use-context system:konnectivity-server@kubernetes
rm -f konnectivity.crt konnectivity.key konnectivity.csr
```

다음으로 Konnectivity 서버와 에이전트를 배포해야 한다.
[kubernetes-sigs/apiserver-network-proxy](https://github.com/kubernetes-sigs/apiserver-network-proxy)에서 
구현을 참조할 수 있다.

컨트롤 플레인 노드에 Konnectivity 서버를 배포한다. 제공된 
`konnectivity-server.yaml` 매니페스트는 
쿠버네티스 구성 요소가 클러스터에 {{< glossary_tooltip text="스태틱 파드(static Pod)"
term_id="static-pod" >}}로 배포되었다고 가정한다. 그렇지 않은 경우에는 Konnectivity 
서버를 데몬셋(DaemonSet)으로 배포할 수 있다.

{{< codenew file="admin/konnectivity/konnectivity-server.yaml" >}}

그런 다음 클러스터에 Konnectivity 에이전트를 배포한다.

{{< codenew file="admin/konnectivity/konnectivity-agent.yaml" >}}

마지막으로 클러스터에서 RBAC가 활성화된 경우 관련 RBAC 규칙을 생성한다.

{{< codenew file="admin/konnectivity/konnectivity-rbac.yaml" >}}
