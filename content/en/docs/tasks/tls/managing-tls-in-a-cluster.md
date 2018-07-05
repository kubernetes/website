---
title: Manage TLS Certificates in a Cluster
content_template: templates/task
reviewers:
- mikedanese
- beacham
- liggit
---

{{% capture overview %}}

Every Kubernetes cluster has a cluster root Certificate Authority (CA). The CA
is generally used by cluster components to validate the API server's
certificate, by the API server to validate kubelet client certificates, etc. To
support this, the CA certificate bundle is distributed to every node in the
cluster and is distributed as a secret attached to default service accounts.
Optionally, your workloads can use this CA to establish trust. Your application
can request a certificate signing using the `certificates.k8s.io` API using a
protocol that is similar to the
[ACME draft](https://github.com/ietf-wg-acme/acme/).

{{% /capture %}}

{{< toc >}}

{{% capture prerequisites %}}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

{{% /capture %}}

{{% capture steps %}}

## Trusting TLS in a Cluster

Trusting the cluster root CA from an application running as a pod usually
requires some extra application configuration. You will need to add the CA
certificate bundle to the list of CA certificates that the TLS client or server
trusts. For example, you would do this with a golang TLS config by parsing the
certificate chain and adding the parsed certificates to the `Certificates` field
in the [`tls.Config`](https://godoc.org/crypto/tls#Config) struct.

The CA certificate bundle is automatically mounted into pods using the default
service account at the path `/var/run/secrets/kubernetes.io/serviceaccount/ca.crt`.
If you are not using the default service account, ask a cluster administrator to
build a configmap containing the certificate bundle that you have access to use.

## Requesting a Certificate

The following section demonstrates how to create a TLS certificate for a
Kubernetes service accessed through DNS.

{{< note >}}
**Note:** This tutorial uses CFSSL: Cloudflare's PKI and TLS toolkit [click here](https://blog.cloudflare.com/introducing-cfssl/) to know more.
{{< /note >}}

## Download and install CFSSL

The cfssl tools used in this example can be downloaded at
[https://pkg.cfssl.org/](https://pkg.cfssl.org/).

## Create a Certificate Signing Request

Generate a private key and certificate signing request (or CSR) by running
the following command:

```console
$ cat <<EOF | cfssl genkey - | cfssljson -bare server
{
  "hosts": [
    "my-svc.my-namespace.svc.cluster.local",
    "my-pod.my-namespace.pod.cluster.local",
    "172.168.0.24",
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

Where `172.168.0.24` is the service's cluster IP,
`my-svc.my-namespace.svc.cluster.local` is the service's DNS name,
`10.0.34.2` is the pod's IP and `my-pod.my-namespace.pod.cluster.local`
is the pod's DNS name. You should see the following output:

```
2017/03/21 06:48:17 [INFO] generate received request
2017/03/21 06:48:17 [INFO] received CSR
2017/03/21 06:48:17 [INFO] generating key: ecdsa-256
2017/03/21 06:48:17 [INFO] encoded CSR
```

This command generates two files; it generates `server.csr` containing the PEM
encoded [pkcs#10](https://tools.ietf.org/html/rfc2986) certification request,
and `server-key.pem` containing the PEM encoded key to the certificate that
is still to be created.

## Create a Certificate Signing Request object to send to the Kubernetes API

Generate a CSR yaml blob and send it to the apiserver by running the following
command:

```console
$ cat <<EOF | kubectl create -f -
apiVersion: certificates.k8s.io/v1beta1
kind: CertificateSigningRequest
metadata:
  name: my-svc.my-namespace
spec:
  groups:
  - system:authenticated
  request: $(cat server.csr | base64 | tr -d '\n')
  usages:
  - digital signature
  - key encipherment
  - server auth
EOF
```

Notice that the `server.csr` file created in step 1 is base64 encoded
and stashed in the `.spec.request` field. We are also requesting a
certificate with the "digital signature", "key encipherment", and "server
auth" key usages. We support all key usages and extended key usages listed
[here](https://godoc.org/k8s.io/api/certificates/v1beta1#KeyUsage)
so you can request client certificates and other certificates using this
same API.

The CSR should now be visible from the API in a Pending state. You can see
it by running:

```console
$ kubectl describe csr my-svc.my-namespace
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
        IP Addresses:   172.168.0.24
                        10.0.34.2
Events: <none>
```

## Get the Certificate Signing Request Approved

Approving the certificate signing request is either done by an automated
approval process or on a one off basis by a cluster administrator. More
information on what this involves is covered below.

## Download the Certificate and Use It

Once the CSR is signed and approved you should see the following:

```console
$ kubectl get csr
NAME                  AGE       REQUESTOR               CONDITION
my-svc.my-namespace   10m       yourname@example.com    Approved,Issued
```

You can download the issued certificate and save it to a `server.crt` file
by running the following:

```console
$ kubectl get csr my-svc.my-namespace -o jsonpath='{.status.certificate}' \
    | base64 -d > server.crt
```

Now you can use `server.crt` and `server-key.pem` as the keypair to start
your HTTPS server.

## Approving Certificate Signing Requests

A Kubernetes administrator (with appropriate permissions) can manually approve
(or deny) Certificate Signing Requests by using the `kubectl certificate
approve` and `kubectl certificate deny` commands. However if you intend
to make heavy usage of this API, you might consider writing an automated
certificates controller.

Whether a machine or a human using kubectl as above, the role of the approver is
to verify that the CSR satisfies two requirements:

1. The subject of the CSR controls the private key used to sign the CSR. This
   addresses the threat of a third party masquerading as an authorized subject.
   In the above example, this step would be to verify that the pod controls the
   private key used to generate the CSR.
2. The subject of the CSR is authorized to act in the requested context. This
   addresses the threat of an undesired subject joining the cluster. In the
   above example, this step would be to verify that the pod is allowed to
   participate in the requested service.

If and only if these two requirements are met, the approver should approve
the CSR and otherwise should deny the CSR.

## A Word of **Warning** on the Approval Permission

The ability to approve CSRs decides who trusts who within the cluster. This
includes who the Kubernetes API trusts. The ability to approve CSRs should
not be granted broadly or lightly. The requirements of the challenge
noted in the previous section and the repercussions of issuing a specific
certificate should be fully understood before granting this permission. See
[here](/docs/admin/authentication#x509-client-certs) for information on how
certificates interact with authentication.

## A Note to Cluster Administrators

This tutorial assumes that a signer is setup to serve the certificates API. The
Kubernetes controller manager provides a default implementation of a signer. To
enable it, pass the `--cluster-signing-cert-file` and
`--cluster-signing-key-file` parameters to the controller manager with paths to
your Certificate Authority's keypair.

{{% /capture %}}
