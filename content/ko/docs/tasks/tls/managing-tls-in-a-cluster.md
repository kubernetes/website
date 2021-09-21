---
title: 클러스터에서 TLS 인증서 관리
content_type: task
---

<!-- overview -->

쿠버네티스는 사용자가 제어하는 ​​인증 기관 (CA)에서 서명한 TLS 인증서를 
프로비저닝 할 수 있는 `certificates.k8s.io` API를 제공한다.
이러한 CA 및 인증서는 워크로드 간의 신뢰 관계를 구성하는 용도로 사용할 수 있다.

`certificates.k8s.io` API는 [ACME 초안](https://github.com/ietf-wg-acme/acme/)과 
유사한 프로토콜을 사용한다.

{{< note >}}
`certificates.k8s.io` API를 사용하여 생성된 인증서는 전용 CA로 서명된다. 
이러한 목적을 위해 클러스터 루트 CA를 사용하도록 클러스터를 
구성할 수 있지만, 절대 이에 의존해서는 안된다. 
해당 인증서가 클러스터 루트 CA에 대해 유효성을 검사한다고 가정하면 안된다.
{{< /note >}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}



<!-- steps -->

## 클러스터에서 TLS 신뢰

파드로 실행되는 애플리케이션에서 사용자 정의 CA를 신뢰하려면 
일반적으로 몇 가지 추가 애플리케이션 구성이 필요하다.
TLS 클라이언트 또는 서버가 신뢰하는 CA 인증서 목록에 
CA 인증서 번들을 추가해야 한다.
예를 들어 인증서 체인을 파싱하고, 파싱된 인증서를 [`tls.Config`](https://godoc.org/crypto/tls#Config) 구조체의 
`RootCAs` 필드에 추가하여, golang TLS 구성으로 이를 수행할 수 있다.

CA 인증서를 파드에서 사용할 수 있는 
[ConfigMap](/docs/tasks/configure-pod-container/configure-pod-configmap)으로 
배포할 수 있다.

## 인증서 요청

다음 섹션에서는 DNS를 통해 액세스되는 쿠버네티스 서비스의 
TLS 인증서를 생성하는 방법을 보여준다.

{{< note >}}
이 튜토리얼에서는 CFSSL을 사용한다. [여기를 클릭](https://blog.cloudflare.com/introducing-cfssl/)하여 Cloudflare의 PKI 및 TLS 툴킷을 자세히 알아본다.
{{< /note >}}

## CFSSL 다운로드 및 설치

이 예제에 사용된 cfssl 도구는 
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases)에서 다운로드 할 수 있다.

## 인증서 서명 요청 (CSR) 생성

다음 명령을 실행하여 개인 키 및 인증서 서명 요청(또는 CSR)을 
생성한다.

```shell
cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "192.0.2.24",
    "10.0.34.2"
  ],
  "CN": "system:node:my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  },
  "names": [
    {
      "O": "system:nodes"
    }
  ]
}
EOF
```

여기서 `192.0.2.24`는 서비스의 클러스터 IP, 
`my-svc.my-namespace.svc.cluster.local`은 서비스의 DNS 이름, 
`10.0.34.2`는 파드의 IP,`my-pod.my-namespace.pod.cluster.local`은 
파드의 DNS 이름이다. 다음 출력이 표시되어야 한다.

```
2017/03/21 06:48:17 [INFO] generate received request
2017/03/21 06:48:17 [INFO] received CSR
2017/03/21 06:48:17 [INFO] generating key: ecdsa-256
2017/03/21 06:48:17 [INFO] encoded CSR
```

이 명령은 두 개의 파일을 생성한다. PEM으로 
인코딩된 [pkcs#10](https://tools.ietf.org/html/rfc2986) 
인증 요청이 포함된 `server.csr`과 생성할 인증서 키를 PEM 인코딩한 값이
포함된 `server-key.pem`을 생성한다.

## 쿠버네티스 API로 보낼 인증서 서명 요청 객체 만들기

CSR yaml blob을 생성하고 다음 명령을 실행하여 
apiserver로 보낸다.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: $(cat server.csr | base64 | tr -d '\n')
  signerName: kubernetes.io/kubelet-serving
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

1단계에서 만든 `server.csr` 파일은 base64로 인코딩되고 
`.spec.request` 필드에 숨겨져 있다.
또한 `kubernetes.io/kubelet-serving` 서명자가 서명한 
"digitalSignature", "keyEnciperment" 및 "serverAuth" 키 사용(keyUsage)이 있는 인증서를 요청한다.
특정 `signerName`을 요청해야 한다.
자세한 내용은 [지원되는 서명자 이름](/docs/reference/access-authn-authz/certificate-signing-requests/#signers) 
문서를 참조한다.

이제 CSR이 API에서 보류 상태로 표시되어야 한다. 다음을 실행하여 
확인할 수 있다.

```shell
kubectl describe csr my-svc.my-namespace
```

```none
Name:                   my-svc.my-namespace
Labels:                 <none>
Annotations:            <none>
CreationTimestamp:      Tue, 21 Mar 2017 07:03:51 -0700
Requesting User:        yourname@example.com
Status:                 Pending
Subject:
        Common Name:    my-svc.my-namespace.svc.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-svc.my-namespace.svc.cluster.local
        IP Addresses:   192.0.2.24
                        10.0.34.2
Events: <none>
```

## 인증서 서명 요청 승인 받기

인증서 서명 요청을 승인하는 것은 자동화된 승인 프로세스나
클러스터 관리자에 의해 일회성으로 수행한다. 여기에 
관련된 내용에 대한 자세한 내용은 아래에서 설명한다.

## 인증서 다운로드 및 사용

CSR이 서명되고 승인되면 다음이 표시된다.

```shell
kubectl get csr
```

```none
NAME                  AGE       REQUESTOR               CONDITION
my-svc.my-namespace   10m       yourname@example.com    Approved,Issued
```

다음을 실행하여 발급된 인증서를 다운로드하고 `server.crt` 파일에 
저장할 수 있다.

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

이제 `server.crt` 및 `server-key.pem`을 키페어(keypair)로 사용하여 
HTTPS 서버를 시작할 수 있다.

## 인증서 서명 요청 승인

(적절한 권한이 있는) 쿠버네티스 관리자는 
`kubectl certificate approve` 과 `kubectl certificate deny` 
명령을 사용하여 인증서 서명 요청을 수동으로 승인 (또는 거부) 할 수 있다. 
그러나 이 API를 많이 사용한다면,
자동화된 인증서 컨트롤러 작성을 고려할 수 있다.

위와 같이 kubectl을 사용하는 시스템이든 사람이든, 승인자의 역할은 
CSR이 다음 두 가지 요구 사항을 충족하는지 확인하는 것이다.

1. CSR은 CSR에 서명하는 데 사용되는 개인 키를 제어하는 것이다. 이는 
   승인된 대상으로 가장하는 제 3자의 위협을 해결한다. 위의 예에서 
   이 단계는 파드(pod)가 CSR을 생성하는 데 
   사용되는 개인 키를 제어하는지 확인하는 것이다.
2. CSR은 요청된 상황에서 작동할 권한이 있다. 이것은 
   원하지 않는 대상이 클러스터에 합류(join)하는 위협을 
   해결한다. 위의 예에서, 이 단계는 
   파드가 요청된 서비스에 참여할 수 있는지 확인하는 것이다.

이 두 가지 요구 사항이 충족되는 경우에만, 승인자가 CSR을 승인하고 
그렇지 않으면 CSR을 거부해야 한다.

## 승인 허가에 대한 경고문

CSR을 승인하는 능력은 환경 내에서 누구를 신뢰하는지 결정한다. CSR 승인
능력은 광범위하거나 가볍게 부여해서는 안된다. 이 권한을 
부여하기 전에 이전 섹션에서 언급한 
요청의 요구 사항과 특정 인증서 발급의 영향을 
완전히 이해해야 한다.

## 클러스터 관리자를 위한 참고 사항

이 가이드에서는 서명자가 인증서 API를 제공하도록 설정되었다고 가정한다. 쿠버네티스 
컨트롤러 관리자는 서명자의 기본 구현을 제공한다. 이를 
활성화하려면 인증 기관(CA)의 키 쌍에 대한 경로와 함께 `--cluster-signing-cert-file` 와 
`--cluster-signing-key-file` 매개 변수를 
컨트롤러 관리자에 전달한다.
