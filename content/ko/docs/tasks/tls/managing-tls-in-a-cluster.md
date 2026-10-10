---
title: 클러스터에서 TLS 인증서 관리
content_type: task
# reviewers:
# - mikedanese
# - beacham
# - liggit
---

<!-- overview -->

쿠버네티스는 사용자가 제어하는 인증 기관 (CA)에서 서명한 TLS 인증서를 
프로비저닝 할 수 있는 `certificates.k8s.io` API를 제공한다.
이러한 CA 및 인증서는 워크로드 간의 신뢰 관계를 구성하는 용도로 사용할 수 있다.

`certificates.k8s.io` API는 [ACME 초안](https://github.com/ietf-wg-acme/acme/)과 
유사한 프로토콜을 사용한다.

{{< note >}}
`certificates.k8s.io` API를 사용하여 생성된 인증서는 [전용 CA](#a-note-to-cluster-administrators)로 서명된다. 
이러한 목적을 위해 클러스터 루트 CA를 사용하도록 클러스터를 
구성할 수 있지만, 절대 이에 의존해서는 안된다. 
해당 인증서가 클러스터 루트 CA에 대해 유효성을 검사한다고 가정하면 안된다.
{{< /note >}}




## {{% heading "prerequisites" %}}


{{< include "task-tutorial-prereqs.md" >}}

`cfssl` 도구가 필요하다. 
[https://github.com/cloudflare/cfssl/releases](https://github.com/cloudflare/cfssl/releases)에서 `cfssl`을 다운로드할 수 있다.

이 페이지의 일부 단계에서 `jq` 도구를 사용한다. 
`jq`가 없다면, 사용 중인 운영 체제의 소프트웨어 소스를 통해 설치하거나, 
[https://stedolan.github.io/jq/](https://stedolan.github.io/jq/)에서 받을 수 있다.

<!-- steps -->

## 클러스터에서 TLS 신뢰

파드로 실행되는 애플리케이션에서 [사용자 정의 CA](#a-note-to-cluster-administrators)를 신뢰하려면 
일반적으로 몇 가지 추가 애플리케이션 구성이 필요하다.
TLS 클라이언트 또는 서버가 신뢰하는 CA 인증서 목록에 
CA 인증서 번들을 추가해야 한다.
예를 들어 인증서 체인을 파싱하고, 파싱된 인증서를 [`tls.Config`](https://pkg.go.dev/crypto/tls#Config) 구조체의 
`RootCAs` 필드에 추가하여, golang TLS 구성으로 이를 수행할 수 있다.

{{< note >}}
사용자 정의 CA 인증서가 
파일시스템(`kube-root-ca.crt` 컨피그맵 내)에 포함될 수 있더라도, 
이 인증서 권한을 내부 쿠버네티스 엔드포인트 검증 용도 외에는 사용하지 말아야 한다. 
내부 쿠버네티스 엔드포인트에 대한 하나의 예시는 
기본 네임스페이스에 있는 `kubernetes`라는 서비스이다.

당신의 워크로드를 위한 사용자 정의 인증서 권한을 사용하고 싶다면, 
이 CA를 별도로 생성하고, 파드가 읽을 수 있는 
[컨피그맵](/docs/tasks/configure-pod-container/configure-pod-configmap/) 형태로 
해당 CA 인증서를 배포해야 한다.
{{< /note >}}

## 인증서 요청

다음 섹션에서는 DNS를 통해 액세스되는 쿠버네티스 서비스의 
TLS 인증서를 생성하는 방법을 보여준다.

{{< note >}}
이 튜토리얼에서는 CFSSL을 사용한다. [여기를 클릭](https://blog.cloudflare.com/introducing-cfssl/)하여 Cloudflare의 PKI 및 TLS 툴킷을 자세히 알아본다.
{{< /note >}}

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
  "CN": "my-pod.my-namespace.pod.cluster.local",
  "key": {
    "algo": "ecdsa",
    "size": 256
  }
}
EOF
```

여기서 `192.0.2.24`는 서비스의 클러스터 IP, 
`my-svc.my-namespace.svc.cluster.local`은 서비스의 DNS 이름, 
`10.0.34.2`는 파드의 IP,`my-pod.my-namespace.pod.cluster.local`은 
파드의 DNS 이름이다. 다음과 비슷한 출력이 표시되어야 한다.

```
2022/02/01 11:45:32 [INFO] generate received request
2022/02/01 11:45:32 [INFO] received CSR
2022/02/01 11:45:32 [INFO] generating key: ecdsa-256
2022/02/01 11:45:32 [INFO] encoded CSR
```

이 명령은 두 개의 파일을 생성한다. PEM으로 
인코딩된 [PKCS#10](https://tools.ietf.org/html/rfc2986) 
인증 요청이 포함된 `server.csr`과 생성할 인증서 키를 PEM 인코딩한 값이
포함된 `server-key.pem`을 생성한다.

## 쿠버네티스 API로 보낼 인증서 서명 요청 객체 만들기

CSR 매니페스트(YAML 형태)를 생성하고, API 서버로 전송한다. 
다음 명령어를 실행하여 수행할 수 있다.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  request: $(cat server.csr | base64 | tr -d '\n')
  signerName: example.com/serving
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

1단계에서 만든 `server.csr` 파일은 base64로 인코딩되고 
`.spec.request` 필드에 숨겨져 있다.
또한 예시 `example.com/serving` 서명자가 서명한 
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
CreationTimestamp:      Tue, 01 Feb 2022 11:49:15 -0500
Requesting User:        yourname@example.com
Signer:                 example.com/serving
Status:                 Pending
Subject:
        Common Name:    my-pod.my-namespace.pod.cluster.local
        Serial Number:
Subject Alternative Names:
        DNS Names:      my-pod.my-namespace.pod.cluster.local
                        my-svc.my-namespace.svc.cluster.local
        IP Addresses:   192.0.2.24
                        10.0.34.2
Events: <none>
```

## 인증서 서명 요청 승인 받기 {#get-the-certificate-signing-request-approved}

[인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/) 승인은 
자동화된 승인 프로세스 또는 클러스터 관리자의 일회성 승인으로 수행된다. 
인증서 요청 승인 권한을 갖고 있다면, 
`kubectl`을 이용하여 다음과 같이 수동으로 승인할 수 있다.

```shell
kubectl certificate approve my-svc.my-namespace
```

```none
certificatesigningrequest.certificates.k8s.io/my-svc.my-namespace approved
```

출력은 다음과 같을 것이다.

```shell
kubectl get csr
```

```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   10m   example.com/serving   yourname@example.com   <none>              Approved
```

이는 즉 인증서 요청이 승인되었으며 
요청받은 서명자의 서명을 기다리고 있음을 나타낸다.

## 인증서 서명 요청에 서명하기 {#sign-the-certificate-signing-request}

다음으로, 인증서 서명자로서, 인증서를 발급하고, 이를 API에 업로드할 것이다.

서명자는 일반적으로 인증서 서명 요청 API를 조회하여 오브젝트의 `signerName`을 확인하고, 
요청이 승인되었는지 체크하고, 해당 요청에 대해 인증서에 서명하고, 
발급된 인증서로 API 오브젝트 상태를 업데이트한다.

### 인증 기관 생성하기

새 인증서의 디지털 서명에 제공할 인증 기관이 필요하다.

먼저, 다음을 실행하여 서명 인증서를 생성한다.

```shell
cat <<EOF | cfssl gencert -initca - | cfssljson -bare ca
{
  "CN": "My Example Signer",
  "key": {
    "algo": "rsa",
    "size": 2048
  }
}
EOF
```

출력은 다음과 같을 것이다.

```none
2022/02/01 11:50:39 [INFO] generating a new CA key and certificate from CSR
2022/02/01 11:50:39 [INFO] generate received request
2022/02/01 11:50:39 [INFO] received CSR
2022/02/01 11:50:39 [INFO] generating key: rsa-2048
2022/02/01 11:50:39 [INFO] encoded CSR
2022/02/01 11:50:39 [INFO] signed certificate with serial number 263983151013686720899716354349605500797834580472
```

이제 인증 기관 키 파일(`ca-key.pem`)과 인증서(`ca.pem`)가 생성되었다.

### 인증서 발급하기

{{< codenew file="tls/server-signing-config.json" >}}

`server-signing-config.json` 서명 구성 파일, 인증 기관 키 파일 및 인증서를 사용하여 
인증서 요청에 서명한다.

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.spec.request}' | \
  base64 --decode | \
  cfssl sign -ca ca.pem -ca-key ca-key.pem -config server-signing-config.json - | \
  cfssljson -bare ca-signed-server
```

출력은 다음과 같을 것이다.

```
2022/02/01 11:52:26 [INFO] signed certificate with serial number 576048928624926584381415936700914530534472870337
```

이제 서명된 제공(serving) 인증서 파일 `ca-signed-server.pem`이 생성되었다.

### 서명된 인증서 업로드하기

마지막으로, 서명된 인증서를 API 오브젝트의 상태에 기재한다.

```shell
kubectl get csr my-svc.my-namespace -o json | \
  jq '.status.certificate = "'$(base64 ca-signed-server.pem | tr -d '\n')'"' | \
  kubectl replace --raw /apis/certificates.k8s.io/v1/certificatesigningrequests/my-svc.my-namespace/status -f -
```

{{< note >}}
위의 명령에서 `.status.certificate` 필드에 base64로 인코딩된 내용을 채우기 위해 
[`jq`](https://stedolan.github.io/jq/) 명령줄 도구를 사용하였다.
`jq`가 없다면, JSON 출력을 파일에 저장하고, 
해당 필드를 수동으로 채우고, 그 결과 파일을 업로드할 수도 있다.
{{< /note >}}

인증서 서명 요청이 승인되고 서명된 인증서가 업로드되면 다음을 실행한다.

```shell
kubectl get csr
```

출력은 다음과 같을 것이다.
```none
NAME                  AGE   SIGNERNAME            REQUESTOR              REQUESTEDDURATION   CONDITION
my-svc.my-namespace   20m   example.com/serving   yourname@example.com   <none>              Approved,Issued
```

## 인증서 다운로드 및 사용

이제, 요청하는 사용자로서, 다음 명령을 실행하여 
발급된 인증서를 다운로드하고 `server.crt` 파일에 저장할 수 있다.

```shell
kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 --decode > server.crt
```

이제 `server.crt` 및 `server-key.pem`의 내용으로 
{{< glossary_tooltip text="시크릿" term_id="secret" >}}을 생성할 수 있으며, 
이 시크릿은 추후 파드에 마운트할 수 있다(예를 들어, 
HTTPS를 제공하는 웹서버에 사용).

```shell
kubectl create secret tls server --cert server.crt --key server-key.pem
```

```none
secret/server created
```

마지막으로, `ca.pem`의 내용으로 {{< glossary_tooltip text="컨피그맵" term_id="configmap" >}}을 생성하여 
제공(serving) 인증서 검증에 필요한 신뢰 루트로 사용할 수 있다.

```shell
kubectl create configmap example-serving-ca --from-file ca.crt=ca.pem
```

```none
configmap/example-serving-ca created
```

## CertificateSigningRequest 승인 {#approving-certificate-signing-requests}

(적절한 권한이 있는) 쿠버네티스 관리자는 
`kubectl certificate approve` 과 `kubectl certificate deny` 
명령을 사용하여 CertificateSigningRequest을 수동으로 승인 (또는 거부) 할 수 있다. 
그러나 이 API를 많이 사용한다면,
자동화된 인증서 컨트롤러 작성을 고려할 수 있다.

{{< caution >}}
CSR을 승인할 수 있는 권한이 있다는 것은 당신의 환경에서 누가 누구를 신뢰할 수 있는지를 결정할 수 있다는 것이다. 
CSR을 승인할 수 있는 권한은 넓게/가볍게 부여되지 않아야 한다.

`approve` 권한을 부여하기 전에, 
승인자에게 할당되는 검증 요구 사항 **및** 특정 인증서 발급에 따른 영향을 
모두 확실히 이해하고 있는지 확인해야 한다.
{{< /caution >}}

위와 같이 kubectl을 사용하는 시스템이든 사람이든, _승인자_ 의 역할은 
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

인증서 승인 및 접근 제어에 대한 추가 정보를 보려면, 
[인증서 서명 요청](/docs/reference/access-authn-authz/certificate-signing-requests/) 레퍼런스 페이지를 
참조한다.

## 서명을 제공하도록 클러스터 구성하기

이 페이지에서는 서명자가 인증서 API를 제공하도록 설정되었다고 가정한다. 쿠버네티스 
컨트롤러 관리자는 서명자의 기본 구현을 제공한다. 이를 
활성화하려면 인증 기관(CA)의 키 쌍에 대한 경로와 함께 `--cluster-signing-cert-file` 와 
`--cluster-signing-key-file` 매개 변수를 
컨트롤러 관리자에 전달한다.

