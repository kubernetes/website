---
title: PKI 인증서 및 요구 사항
# reviewers:
# - sig-cluster-lifecycle
content_type: concept
weight: 50
---

<!-- overview -->

쿠버네티스는 TLS를 통한 인증을 위해서 PKI 인증서가 필요하다.
만약 [kubeadm](/docs/reference/setup-tools/kubeadm/)으로 쿠버네티스를 설치한다면, 
클러스터에 필요한 인증서는 자동으로 생성된다.
또한 자신이 소유한 인증서를 직접 생성할 수도 있다. 이를테면, 개인 키를
API 서버에 저장하지 않음으로써 더 안전하게 보관할 수 있다.
이 페이지는 클러스터에 필요한 인증서를 설명한다.

<!-- body -->

## 클러스터에서 인증서가 이용되는 방식

쿠버네티스는 다음 작업에서 PKI를 필요로 한다.

### 서버 인증서

* API 서버 엔드포인트를 위한 서버 인증서
* etcd 서버를 위한 서버 인증서
* 각 kubelet을 위한 [서버 인증서](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/#client-and-serving-certificates)
  (모든 {{< glossary_tooltip text="노드" term_id="node" >}}는 kubelet을 실행한다)
* [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)를 위한 선택적 서버 인증서

### 클라이언트 인증서

* 쿠버네티스 API의 클라이언트로서 API 서버에 인증하는 데 사용되는 각
  kubelet의 클라이언트 인증서
* etcd에 인증하는 데 사용되는 각 API 서버의 클라이언트 인증서
* 컨트롤러 매니저가 API 서버와 안전하게 통신하기 위한 클라이언트 인증서
* 스케줄러가 API 서버와 안전하게 통신하기 위한 클라이언트 인증서
* kube-proxy가 API 서버에 인증하기 위한, 노드별 클라이언트 인증서
* 클러스터 관리자가 API 서버에 인증하기 위한 선택적 클라이언트 인증서
* [front-proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)를 위한 선택적 클라이언트 인증서

### kubelet의 서버 및 클라이언트 인증서

API 서버가 kubelet과 보안 연결을 맺고 자신을 인증하려면
클라이언트 인증서와 키 쌍이 필요하다.

이 시나리오에서 인증서를 사용하는 방식은 두 가지이다.

* 공유 인증서: kube-apiserver는 클라이언트를 인증할 때 사용하는 인증서와 키 쌍을
  kubelet 서버와 통신할 때도 사용할 수 있다. 즉, `apiserver.crt`와
  `apiserver.key` 같은 기존 인증서를 사용할 수 있다.

* 별도 인증서: 또는 kube-apiserver가 kubelet 서버와의 통신을 인증하기 위해
  새 클라이언트 인증서와 키 쌍을 생성할 수 있다. 이 경우 `kubelet-client.crt`라는
  별도 인증서와 이에 대응하는 개인 키인
  `kubelet-client.key`가 생성된다.

{{< note >}}
`front-proxy` 인증서는 [확장 API 서버](/docs/tasks/extend-kubernetes/setup-extension-api-server/)를 지원하기 위해
API 서버 애그리게이션 레이어를 사용하는 경우에만 필요하다.
{{< /note >}}

etcd 역시 클라이언트와 피어 간에 상호 TLS 인증을 구현한다.

## 인증서를 저장하는 위치

kubeadm으로 쿠버네티스를 설치한 경우, 대부분의 인증서는 `/etc/kubernetes/pki`에 저장된다. 
이 문서에 나오는 모든 경로는 그 디렉터리를 기준으로 한 상대 경로이지만, kubeadm이 `/etc/kubernetes`에 저장하는 
사용자 계정 인증서는 예외이다.

## 인증서 수동 설정

필요한 인증서를 kubeadm으로 생성하지 않으려면, 단일 루트 CA를 사용하거나 
모든 인증서를 직접 제공할 수 있다. 자체 인증 기관을 만드는 자세한 방법은
[인증서](/docs/tasks/administer-cluster/certificates/)를 참고한다.
인증서 관리에 대한 자세한 내용은 
[kubeadm을 사용한 인증서 관리](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)를 참고한다.

### 단일 루트 CA

관리자가 제어하는 단일 루트 CA를 만들 수 있다. 이 루트 CA는 
여러 중간 CA를 생성한 뒤, 이후 인증서 생성을 쿠버네티스 자체에 위임할 수 있다.

필요 CA:

| 경로 | 기본 CN | 설명 |
|------------------------|---------------------------|-------------------------------------------------------------------------------------|
| ca.crt,key             | kubernetes-ca             | 쿠버네티스 일반 CA                                                                      |
| etcd/ca.crt,key        | etcd-ca                   | 모든 etcd 관련 기능을 위해서                                                              |
| front-proxy-ca.crt,key | kubernetes-front-proxy-ca | [front-end proxy](/docs/tasks/extend-kubernetes/configure-aggregation-layer/)를 위해서 |

위의 CA 외에도, 서비스 계정 관리를 위한 공개/개인 키 쌍인 
`sa.key` 와 `sa.pub` 을 얻는 것이 필요하다.
다음은 이전 표에 나온 CA 키와 인증서 파일을 보여준다.

```
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-ca.key
```

### 모든 인증서

CA 개인 키를 클러스터에 복사하고 싶지 않다면, 모든 인증서를 직접 생성할 수 있다.

필요한 인증서:

| 기본 CN | 부모 CA | O (Subject 내) | 종류 | 호스트  (SAN) |
|-------------------------------|---------------------------|----------------|------------------|-----------------------------------------------------|
| kube-etcd                     | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-peer                | etcd-ca                   |                | server, client   | `<hostname>`, `<Host_IP>`, `localhost`, `127.0.0.1` |
| kube-etcd-healthcheck-client  | etcd-ca                   |                | client           |                                                     |
| kube-apiserver-etcd-client    | etcd-ca                   |                | client           |                                                     |
| kube-apiserver                | kubernetes-ca             |                | server           | `<hostname>`, `<Host_IP>`, `<advertise_IP>`[^1]     |
| kube-apiserver-kubelet-client | kubernetes-ca             | system:masters | client           |                                                     |
| front-proxy-client            | kubernetes-front-proxy-ca |                | client           |                                                     |

{{< note >}}
`kube-apiserver-kubelet-client`에 슈퍼유저 그룹인 `system:masters`를 사용하는 대신,
권한이 더 제한된 그룹을 사용할 수 있다. kubeadm은 이 목적으로 `kubeadm:cluster-admins`
그룹을 사용한다.
{{< /note >}}

[^1]: 클러스터에 접속한 다른 IP 또는 DNS 이름([kubeadm](/docs/reference/setup-tools/kubeadm/)이 사용하는
로드 밸런서 안정 IP 또는 DNS 이름, `kubernetes`, `kubernetes.default`, `kubernetes.default.svc`,
`kubernetes.default.svc.cluster`, `kubernetes.default.svc.cluster.local`)

`kind`는 하나 이상의 x509 키 사용에 대응하며,
이는 [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1#CertificateSigningRequest)
타입의 `.spec.usages`에도 명시되어 있다.

| 종류 | 키 사용 |
|--------|---------------------------------------------------------------------------------|
| server | digital signature, key encipherment, server auth                                |
| client | digital signature, key encipherment, client auth                                |

{{< note >}}
위에 나열된 호스트/SAN은 동작하는 클러스터를 구성하는 데 권장된다. 
특정 설정이 필요한 경우, 모든 서버 인증서에 SAN을 추가할 수 있다.
{{< /note >}}

{{< note >}}
kubeadm 사용자만 해당:

* 개인 키 없이 CA 인증서를 클러스터에 복사하는 시나리오는 
  kubeadm 문서에서 외부 CA라고 한다.
* 위 목록을 kubeadm이 생성한 PKI와 비교하는 경우, 
  `kube-etcd`, `kube-etcd-peer` 와 `kube-etcd-healthcheck-client` 인증서는
  외부 etcd를 사용하는 경우에는 생성되지 않는다는 점에 유의한다.

{{< /note >}}

### 인증서 파일 경로

인증서는 권고되는 파일 경로에 존재해야 한다([kubeadm](/docs/reference/setup-tools/kubeadm/)에서 사용되는 것처럼).
경로는 위치에 관계없이 주어진 인자를 사용하여 지정해야 한다.

| 기본 CN | 권고되는 키 파일 경로 | 권고되는 인증서 파일 경로 | 명령어 | 키 인자 | 인증서 인자 |
|------------------------------|------------------------------|-----------------------------|-------------------------|------------------------------|----------------------------------------------------------------|
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | kube-apiserver          |                              | --etcd-cafile                                                  |
| kube-apiserver-etcd-client   | apiserver-etcd-client.key    | apiserver-etcd-client.crt   | kube-apiserver          | --etcd-keyfile               | --etcd-certfile                                                |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-apiserver          |                              | --client-ca-file                                               |
| kubernetes-ca                | ca.key                       | ca.crt                      | kube-controller-manager | --cluster-signing-key-file   | --client-ca-file, --root-ca-file, --cluster-signing-cert-file  |
| kube-apiserver               | apiserver.key                | apiserver.crt               | kube-apiserver          | --tls-private-key-file       | --tls-cert-file                                                |
| kube-apiserver-kubelet-client| apiserver-kubelet-client.key | apiserver-kubelet-client.crt| kube-apiserver          | --kubelet-client-key         | --kubelet-client-certificate                                   |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-apiserver          |                              | --requestheader-client-ca-file                                 |
| front-proxy-ca               | front-proxy-ca.key           | front-proxy-ca.crt          | kube-controller-manager |                              | --requestheader-client-ca-file                                 |
| front-proxy-client           | front-proxy-client.key       | front-proxy-client.crt      | kube-apiserver          | --proxy-client-key-file      | --proxy-client-cert-file                                       |
| etcd-ca                      | etcd/ca.key                  | etcd/ca.crt                 | etcd                    |                              | --trusted-ca-file, --peer-trusted-ca-file                      |
| kube-etcd                    | etcd/server.key              | etcd/server.crt             | etcd                    | --key-file                   | --cert-file                                                    |
| kube-etcd-peer               | etcd/peer.key                | etcd/peer.crt               | etcd                    | --peer-key-file              | --peer-cert-file                                               |
| etcd-ca                      |                              | etcd/ca.crt                 | etcdctl                 |                              | --cacert                                                       |
| kube-etcd-healthcheck-client | etcd/healthcheck-client.key  | etcd/healthcheck-client.crt | etcdctl                 | --key                        | --cert                                                         |

서비스 계정 키 쌍에도 동일한 고려 사항이 적용된다.

| 개인 키 경로 | 공개 키 경로 | 명령어 | 인자 |
|-------------------|------------------|-------------------------|--------------------------------------|
|  sa.key           |                  | kube-controller-manager | --service-account-private-key-file   |
|                   | sa.pub           | kube-apiserver          | --service-account-key-file           |

다음 예시는 키와 인증서를 모두 직접 생성하는 경우에 제공해야 하는
[이전 표의](#인증서-파일-경로) 파일 경로를 보여준다.

```
/etc/kubernetes/pki/etcd/ca.key
/etc/kubernetes/pki/etcd/ca.crt
/etc/kubernetes/pki/apiserver-etcd-client.key
/etc/kubernetes/pki/apiserver-etcd-client.crt
/etc/kubernetes/pki/ca.key
/etc/kubernetes/pki/ca.crt
/etc/kubernetes/pki/apiserver.key
/etc/kubernetes/pki/apiserver.crt
/etc/kubernetes/pki/apiserver-kubelet-client.key
/etc/kubernetes/pki/apiserver-kubelet-client.crt
/etc/kubernetes/pki/front-proxy-ca.key
/etc/kubernetes/pki/front-proxy-ca.crt
/etc/kubernetes/pki/front-proxy-client.key
/etc/kubernetes/pki/front-proxy-client.crt
/etc/kubernetes/pki/etcd/server.key
/etc/kubernetes/pki/etcd/server.crt
/etc/kubernetes/pki/etcd/peer.key
/etc/kubernetes/pki/etcd/peer.crt
/etc/kubernetes/pki/etcd/healthcheck-client.key
/etc/kubernetes/pki/etcd/healthcheck-client.crt
/etc/kubernetes/pki/sa.key
/etc/kubernetes/pki/sa.pub
```

## 각 사용자 계정을 위한 인증서 설정하기

다음 관리자 계정과 서비스 계정은 수동으로 설정해야 한다.

| 파일명 | 자격증명 이름 | 기본 CN | O (Subject 내) |
|-------------------------|----------------------------|-------------------------------------|------------------------|
| admin.conf              | default-admin              | kubernetes-admin                    | `<admin-group>`        |
| super-admin.conf        | default-super-admin        | kubernetes-super-admin              | system:masters         |
| kubelet.conf            | default-auth               | system:node:`<nodeName>` (참고 보기)  | system:nodes           |
| controller-manager.conf | default-controller-manager | system:kube-controller-manager      |                        |
| scheduler.conf          | default-scheduler          | system:kube-scheduler               |                        |

{{< note >}}
`kubelet.conf`의 `<nodeName>` 값은 kubelet이 apiserver에 등록할 때 제공하는
노드 이름 값과 **반드시** 정확히 일치해야 한다.
더 자세한 내용은 [노드 인가](/docs/reference/access-authn-authz/node/)를 참고한다.
{{< /note >}}

{{< note >}}
위 예시의 `<admin-group>`은 구현에 따라 달라진다. 일부 도구는 기본 `admin.conf`의
인증서가 `system:masters` 그룹에 속하도록 서명한다. `system:masters`는 긴급 접근용
슈퍼유저 그룹으로, RBAC 같은 쿠버네티스 권한 부여 계층을 우회할 수 있다. 
또한 일부 도구는
이 슈퍼유저 그룹에 연결된 인증서를 포함하는 별도의 `super-admin.conf`를 생성하지 않는다.

kubeadm은 kubeconfig 파일에 두 개의 관리자 인증서를 별도로 생성한다.
하나는 `admin.conf`에 있으며, `Subject: O = kubeadm:cluster-admins, CN = kubernetes-admin`을 가진다.
`kubeadm:cluster-admins`는 `cluster-admin` 클러스터롤(ClusterRole)에 바인딩된 사용자 정의 그룹이다.
이 파일은 kubeadm이 관리하는 모든 컨트롤 플레인 머신에 생성된다.

다른 하나는 `super-admin.conf`에 있으며, `Subject: O = system:masters, CN = kubernetes-super-admin`을 가진다.
이 파일은 `kubeadm init`을 호출한 노드에만 생성된다.
{{< /note >}}

1. 각 환경 설정에 대해 주어진 Common Name (CN)과 Organization (O)를 이용하여 
   x509 인증서와 키 쌍을 생성한다.

1. 각 환경 설정에 대해 다음과 같이 `kubectl`을 실행한다.

   ```
   KUBECONFIG=<filename> kubectl config set-cluster default-cluster --server=https://<host ip>:6443 --certificate-authority <path-to-kubernetes-ca> --embed-certs
   KUBECONFIG=<filename> kubectl config set-credentials <credential-name> --client-key <path-to-key>.pem --client-certificate <path-to-cert>.pem --embed-certs
   KUBECONFIG=<filename> kubectl config set-context default-system --cluster default-cluster --user <credential-name>
   KUBECONFIG=<filename> kubectl config use-context default-system
   ```

이 파일들은 다음과 같이 사용된다.

| 파일명 | 명령어 | 설명 |
|-------------------------|-------------------------|----------------------------------------------------------------|
| admin.conf              | kubectl                 | 클러스터 관리자를 설정한다.                                           |
| super-admin.conf        | kubectl                 | 클러스터 슈퍼 관리자를 설정한다.                                       |
| kubelet.conf            | kubelet                 | 클러스터의 각 노드마다 하나씩 필요하다.                                  |
| controller-manager.conf | kube-controller-manager | 매니페스트를 `manifests/kube-controller-manager.yaml`에 추가해야 한다. |
| scheduler.conf          | kube-scheduler          | 매니페스트를 `manifests/kube-scheduler.yaml`에 추가해야 한다.          |

다음 파일들은 이전 표에 나열된 파일의 전체 경로를 보여준다.

```
/etc/kubernetes/admin.conf
/etc/kubernetes/super-admin.conf
/etc/kubernetes/kubelet.conf
/etc/kubernetes/controller-manager.conf
/etc/kubernetes/scheduler.conf
```
