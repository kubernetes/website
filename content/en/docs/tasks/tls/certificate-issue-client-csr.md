---
title: Issue a Certificate for a Kubernetes API Client Using A CertificateSigningRequest
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

Kubernetes lets you use a public key infrastructure (PKI) to authenticate to your cluster
as a client.

A few steps are required in order to get a normal user to be able to
authenticate and invoke an API. First, this user must have an [X.509](https://www.itu.int/rec/T-REC-X.509) certificate
issued by an authority that your Kubernetes cluster trusts. The client must then present that certificate to the Kubernetes API.

You use a [CertificateSigningRequest](/concepts/security/certificate-signing-requests/)
as part of this process, and either you or some other principal must approve the request.


You will create a private key, and then get a certificate issued, and finally configure
that private key for a client.

## {{% heading "prerequisites" %}}

* {{< include "task-tutorial-prereqs.md" >}}

* You need the `kubectl`, `openssl` and `base64` utilities.

This page assumes you are using Kubernetes {{< glossary_tooltip term_id="rbac" text="role based access control" >}} (RBAC).
If you have alternative or additional security mechanisms around authorization, you need to account for those as well.

<!-- steps -->

## Create private key

In this step, you create a private key. You need to keep this document secret; anyone who has it can impersonate the user.

```shell
# Create a private key
openssl genrsa -out myuser.key 3072
```

## Create an X.509 certificate signing request {#create-x.509-certificatessigningrequest}

{{< note >}}
This is not the same as the similarly-named CertificateSigningRequest API; the file you generate here goes into the
CertificateSigningRequest.
{{< /note >}}

It is important to set CN and O attribute of the CSR. CN is the name of the user and O is the group that this user will belong to.
You can refer to [RBAC](/docs/reference/access-authn-authz/rbac/) for standard groups.

```shell
# Change the common name "myuser" to the actual username that you want to use
openssl req -new -key myuser.key -out myuser.csr -subj "/CN=myuser"
```

## Create a Kubernetes CertificateSigningRequest {#create-k8s-certificatessigningrequest}

Encode the CSR document using this command:

```shell
cat myuser.csr | base64 | tr -d "\n"
```

Create a [CertificateSigningRequest](/docs/reference/kubernetes-api/authentication-resources/certificate-signing-request-v1/)
and submit it to a Kubernetes Cluster via kubectl. Below is a snippet of shell that you can use to generate the
CertificateSigningRequest.

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

Some points to note:

- `usages` has to be `client auth`
- `expirationSeconds` could be made longer (i.e. `864000` for ten days) or shorter (i.e. `3600` for one hour).
  You cannot request a duration shorter than 10 minutes.
- `request` is the base64 encoded value of the CSR file content.

## Approve the CertificateSigningRequest {#approve-certificate-signing-request}

Use kubectl to find the CSR you made, and manually approve it.

Get the list of CSRs:

```shell
kubectl get csr
```

Approve the CSR:

```shell
kubectl certificate approve myuser
```

## Get the certificate

Retrieve the certificate from the CSR, to check it looks OK.

```shell
kubectl get csr/myuser -o yaml
```

The certificate value is in Base64-encoded format under `.status.certificate`.

Export the issued certificate from the CertificateSigningRequest.

```shell
kubectl get csr myuser -o jsonpath='{.status.certificate}'| base64 -d > myuser.crt
```

## Configure the certificate into kubeconfig

The next step is to add this user into the kubeconfig file.

First, you need to add new credentials:

```shell
kubectl config set-credentials myuser --client-key=myuser.key --client-certificate=myuser.crt --embed-certs=true

```

Then, you need to add the context:

```shell
kubectl config set-context myuser --cluster=kubernetes --user=myuser
```

To test it:

```shell
kubectl --context myuser auth whoami
```

You should see output confirming that you are “myuser“.

## Create Role and RoleBinding

{{< note >}}
If you don't use Kubernetes RBAC, skip this step and make the appropriate changes for the authorization mechanism
your cluster actually uses.
{{< /note >}}

With the certificate created it is time to define the Role and RoleBinding for
this user to access Kubernetes cluster resources.

This is a sample command to create a Role for this new user:

```shell
kubectl create role developer --verb=create --verb=get --verb=list --verb=update --verb=delete --resource=pods
```

This is a sample command to create a RoleBinding for this new user:

```shell
kubectl create rolebinding developer-binding-myuser --role=developer --user=myuser
```

## {{% heading "whatsnext" %}}

* Read [Manage TLS Certificates in a Cluster](/docs/tasks/tls/managing-tls-in-a-cluster/)
* For details of X.509 itself, refer to [RFC 5280](https://tools.ietf.org/html/rfc5280#section-3.1) section 3.1
* For information on the syntax of PKCS#10 certificate signing requests, refer to [RFC 2986](https://tools.ietf.org/html/rfc2986)
* Read about [ClusterTrustBundles](/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles)
