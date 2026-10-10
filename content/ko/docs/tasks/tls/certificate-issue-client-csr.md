---
title: CertificateSigningRequest를 사용하여 쿠버네티스 API 클라이언트용 인증서 발급하기
api_metadata:
- apiVersion: "certificates.k8s.io/v1"
  kind: "CertificateSigningRequest"
  override_link_text: "CSR v1"
weight: 80

# Docs maintenance note
#
# If there is a future page /docs/tasks/tls/certificate-issue-client-manually/ then this page
# should link there, and the new page should link back to this one.
---

<!-- overview -->

쿠버네티스는 클라이언트로서 클러스터에 인증하기 위해 공개 키 기반 구조(PKI)를 
사용할 수 있다.

일반 사용자가 API를 인증하고 호출할 수 있도록 하려면 몇 가지 
단계가 필요하다. 먼저, 해당 사용자는 쿠버네티스 클러스터가 신뢰하는 기관에서 발급한 [X.509](https://www.itu.int/rec/T-REC-X.509) 
인증서를 가져야 한다. 이후 클라이언트는 해당 인증서를 쿠버네티스 API에 제시해야 한다.

이 과정의 일부로 [CertificateSigningRequest](/concepts/security/certificate-signing-requests/)
를 사용하며, 이 요청은 사용자 또는 다른 주체가 승인해야 한다.


개인 키를 생성한 뒤 인증서를 발급받고, 마지막으로 해당 개인 키를 
클라이언트에 구성하게 된다.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* `kubectl`, `openssl`, `base64` 유틸리티가 필요하다.

이 페이지는 쿠버네티스 {{< glossary_tooltip term_id="rbac" text="역할 기반 접근 제어" >}}(RBAC)를 사용한다고 가정한다. 
만약 인가와 관련하여 대체 또는 추가 보안 매커니즘이 있다면, 해당 메커니즘 또한 고려해야 한다.

<!-- steps -->

## 개인 키 생성하기

해당 단계에서, 개인 키를 생성한다. 이 문서는 비밀로 유지해야 한다. 해당 키를 가진 누구든 사용자를 가장할 수 있다.

```shell
# Create a private key
openssl genrsa -out myuser.key 3072
```

## X.509 인증서 서명 요청 생성하기 {#create-x.509-certificatessigningrequest}

{{< note >}}
이는 이름이 비슷한 CertificateSigningRequest API와 동일한 것이 아니다. 여기서 생성한 파일은 
CertificateSigningRequest 안에 포함된다.
{{< /note >}}

CSR의 CN과 O 속성을 설정하는 것이 중요하다. CN은 사용자의 이름이고, O는 해당 사용자가 속할 그룹이다.
표준 그룹에 대해서는 [RBAC](/docs/reference/access-authn-authz/rbac/) 문서를 참고할 수 있다.

```shell
# Change the common name "myuser" to the actual username that you want to use
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

## 쿠버네티스 CertificateSigningRequest 생성하기 {#create-k8s-certificatessigningrequest}

다음 명령어를 사용하여 CSR 문서를 인코딩한다.

```shell
cat myuser.csr | base64 | tr -d "\n"
```

[CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)를 
생성하여 kubectl을 통해 쿠버네티스 클러스터에 제출한다. 아래는 CertificateSigningRequest를 생성하기 위해 
사용할 수 있는 셸 스니펫(snippet)이다.

```shell
cat <<EOF | kubectl apply -f -
apiVersion: certificates.k8s.io/v1
kind: CertificateSigningRequest
metadata:
  name: myuser # example
spec:
  # This is an encoded CSR. Change this to the base64-encoded contents of myuser.csr
  request: LS0tLS1CRUdJTiBDRVJUSUZJQ0FURSBSRVFVRVNULS0tLS0KTUlJQ1ZqQ0NBVDRDQVFBd0VURVBNQTBHQTFVRUF3d0dZVzVuWld4aE1JSUJJakFOQmdrcWhraUc5dzBCQVFFRgpBQU9DQVE4QU1JSUJDZ0tDQVFFQTByczhJTHRHdTYxakx2dHhWTTJSVlRWMDNHWlJTWWw0dWluVWo4RElaWjBOCnR2MUZtRVFSd3VoaUZsOFEzcWl0Qm0wMUFSMkNJVXBGd2ZzSjZ4MXF3ckJzVkhZbGlBNVhwRVpZM3ExcGswSDQKM3Z3aGJlK1o2MVNrVHF5SVBYUUwrTWM5T1Nsbm0xb0R2N0NtSkZNMUlMRVI3QTVGZnZKOEdFRjJ6dHBoaUlFMwpub1dtdHNZb3JuT2wzc2lHQ2ZGZzR4Zmd4eW8ybmlneFNVekl1bXNnVm9PM2ttT0x1RVF6cXpkakJ3TFJXbWlECklmMXBMWnoyalVnald4UkhCM1gyWnVVV1d1T09PZnpXM01LaE8ybHEvZi9DdS8wYk83c0x0MCt3U2ZMSU91TFcKcW90blZtRmxMMytqTy82WDNDKzBERHk5aUtwbXJjVDBnWGZLemE1dHJRSURBUUFCb0FBd0RRWUpLb1pJaHZjTgpBUUVMQlFBRGdnRUJBR05WdmVIOGR4ZzNvK21VeVRkbmFjVmQ1N24zSkExdnZEU1JWREkyQTZ1eXN3ZFp1L1BVCkkwZXpZWFV0RVNnSk1IRmQycVVNMjNuNVJsSXJ3R0xuUXFISUh5VStWWHhsdnZsRnpNOVpEWllSTmU3QlJvYXgKQVlEdUI5STZXT3FYbkFvczFqRmxNUG5NbFpqdU5kSGxpT1BjTU1oNndLaTZzZFhpVStHYTJ2RUVLY01jSVUyRgpvU2djUWdMYTk0aEpacGk3ZnNMdm1OQUxoT045UHdNMGM1dVJVejV4T0dGMUtCbWRSeEgvbUNOS2JKYjFRQm1HCkkwYitEUEdaTktXTU0xMzhIQXdoV0tkNjVoVHdYOWl4V3ZHMkh4TG1WQzg0L1BHT0tWQW9FNkpsYWFHdTlQVmkKdjlOSjVaZlZrcXdCd0hKbzZXdk9xVlA3SVFjZmg3d0drWm89Ci0tLS0tRU5EIENFUlRJRklDQVRFIFJFUVVFU1QtLS0tLQo=
  signerName: kubernetes.io/kube-apiserver-client
  expirationSeconds: 86400  # one day
  usages:
  - client auth
EOF
```

몇 가지 참고할 사항은 다음과 같다.

- `usages`는 반드시 `client auth`여야 한다.
- `expirationSeconds`는 더 길게(예: `864000`은 10일을 의미) 또는 더 짧게(예: `3600`은 1시간을 의미) 설정할 수 있다.
  10분보다 짧은 기간은 요청할 수 없다.
- `request`는 CSR 파일 내용을 base64로 인코딩한 값이다.

## CertificateSigningRequest 승인 {#approve-certificate-signing-request}

kubectl을 사용하여 생성한 CSR을 찾고, 수동으로 승인한다.

CSR 목록을 가져온다.

```shell
kubectl get csr
```

CSR 승인한다.

```shell
kubectl certificate approve myuser
```

## 인증서 가져오기

CSR에서 인증서를 가져와서 정상적으로 발급되었는지 확인한다.

```shell
kubectl get csr/myuser -o yaml
```

인증서 값은 `.status.certificate` 아래에 Base64로 인코딩된 형식으로 존재한다.

발급된 인증서를 CertificateSigningRequest에서 내보내기한다.

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

## kubeconfig에 인증서 구성하기

다음 단계로, 해당 사용자를 kubeconfig 파일에 추가한다.

먼저, 새 자격 증명을 추가해야 한다.

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true

```

그다음, 컨텍스트를 추가해야 한다.

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

테스트하려면

```shell
kubectl --context myuser auth whoami
```

“myuser”임을 확인하는 출력 결과가 보여야 한다.

## Role과 RoleBinding 생성하기

{{< note >}}
쿠버네티스 RBAC을 사용하지 않는다면, 이 단계를 건너뛰고 클러스터에서 실제로 사용하는 인가 
메커니즘에 맞게 적절히 변경한다.
{{< /note >}}

인증서가 생성되었으므로, 이 사용자가 쿠버네티스 클러스터 리소스에 접근할 수 
있도록 Role과 RoleBinding을 정의해야 한다.

다음은 이 새로운 사용자를 위한 Role을 생성하는 예시 명령어이다.

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

다음은 이 새로운 사용자를 위한 RoleBinding을 생성하는 예시 명령어이다.

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

## {{% heading "whatsnext" %}}

* [클러스터에서 TLS 인증서 관리](/ko/docs/tasks/tls/managing-tls-in-a-cluster/)를 읽어본다.
* X.509 자체에 대한 자세한 내용은 [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) 3.1절을 참고한다.
* PKCS#10 인증서 서명 요청의 문법에 대한 정보는 [RFC 2986](https://tools.ietf.org/html/rfc2986)을 참고한다.
* [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)에 대해 읽어본다.
