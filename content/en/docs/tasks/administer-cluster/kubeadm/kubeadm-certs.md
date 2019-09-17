---
reviewers:
- sig-cluster-lifecycle
title: Certificate Management with kubeadm
content_template: templates/task
---

{{% capture overview %}}

This page explains how to manage certificates manually with kubeadm.

{{% /capture %}}

{{% capture prerequisites %}}

These are advanced topics for users who need to integrate their organization's certificate infrastructure into a kubeadm-built cluster. If kubeadm with the default configuration satisfies your needs, you should let kubeadm manage certificates instead.

You should be familiar with [PKI certificates and requirements in Kubernetes](/docs/setup/best-practices/certificates/).

{{% /capture %}}

{{% capture steps %}}

## Renew certificates with the certificates API

The Kubernetes certificates normally reach their expiration date after one year.

Kubeadm can renew certificates with the `kubeadm alpha certs renew` commands; you should run these commands on control-plane nodes only.

Typically this is done by loading on-disk CA certificates and keys and using them to issue new certificates.
This approach works well if your certificate tree is self-contained. However, if your certificates are externally
managed, you might need a different approach.

As an alternative, Kubernetes provides its own [API for managing certificates][manage-tls].
With kubeadm, you can use this API by running `kubeadm alpha certs renew --use-api`.

## Set up a signer

The Kubernetes Certificate Authority does not work out of the box.
You can configure an external signer such as [cert-manager][cert-manager-issuer], or you can use the build-in signer.
The built-in signer is part of [`kube-controller-manager`][kcm].
To activate the build-in signer, you pass the `--cluster-signing-cert-file` and `--cluster-signing-key-file` arguments.

You pass these arguments in any of the following ways:

* Edit `/etc/kubernetes/manifests/kube-controller-manager.yaml` to add the arguments to the command.
  Remember that your changes could be overwritten when you upgrade.

* If you're creating a new cluster, you can use a kubeadm [configuration file][config]:

  ```yaml
  apiVersion: kubeadm.k8s.io/v1beta1
  kind: ClusterConfiguration
  controllerManager:
    extraArgs:
      cluster-signing-cert-file: /etc/kubernetes/pki/ca.crt
      cluster-signing-key-file: /etc/kubernetes/pki/ca.key
  ```

* You can also upload a config file using [`kubeadm config upload from-files`][config-upload]

[cert-manager-issuer]: https://cert-manager.readthedocs.io/en/latest/tutorials/ca/creating-ca-issuer.html
[kcm]: /docs/reference/command-line-tools-reference/kube-controller-manager/
[config]: https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1
[config-upload]: /docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-from-file

### Approve requests

If you set up an external signer such as [cert-manager][cert-manager], certificate signing requests (CSRs) are automatically approved.
Otherwise, you must manually approve certificates with the [`kubectl certificate`][certs] command.
The following kubeadm command outputs the name of the certificate to approve, then blocks and waits for approval to occur:

```shell
sudo kubeadm alpha certs renew apiserver --use-api &
```
```
[1] 2890
[certs] certificate request "kubeadm-cert-kube-apiserver-ld526" created
```
```shell
kubectl certificate approve kubeadm-cert-kube-apiserver-ld526
certificatesigningrequest.certificates.k8s.io/kubeadm-cert-kube-apiserver-ld526 approved
[1]+  Done                    sudo kubeadm alpha certs renew apiserver --use-api
```

You can view a list of pending certificates with `kubectl get csr`.

[manage-tls]: /docs/tasks/tls/managing-tls-in-a-cluster/
[cert-manager]: https://github.com/jetstack/cert-manager
[certs]: /docs/reference/generated/kubectl/kubectl-commands#certificate

## Certificate requests with kubeadm

To better integrate with external CAs, kubeadm can also produce certificate signing requests (CSRs).
A CSR represents a request to a CA for a signed certificate for a client.
In kubeadm terms, any certificate that would normally be signed by an on-disk CA can be produced as a CSR instead. A CA, however, cannot be produced as a CSR.

You can create an individual CSR with `kubeadm init phase certs apiserver --csr-only`.
The `--csr-only` flag can be applied only to individual phases. After [all certificates are in place][certs], you can run `kubeadm init --external-ca`.

You can pass in a directory with `--csr-dir` to output the CSRs to the specified location.
If `--csr-dir` is not specified, the default certificate directory (`/etc/kubernetes/pki`) is used.
Both the CSR and the accompanying private key are given in the output. After a certificate is signed, the certificate and the private key must be copied to the PKI directory (by default `/etc/kubernetes/pki`).

### Renew certificates

Certificates can be renewed with `kubeadm alpha certs renew --csr-only`.
As with `kubeadm init`, an output directory can be specified with the `--csr-dir` flag.
To use the new certificates, copy the signed certificate and private key into the PKI directory (by default `/etc/kubernetes/pki`)

## Cert usage

A CSR contains a certificate's name, domains, and IPs, but it does not specify usages.
It is the responsibility of the CA to specify [the correct cert usages][cert-table] when issuing a certificate.

* In `openssl` this is done with the [`openssl ca` command][openssl-ca].
* In `cfssl` you specify [usages in the config file][cfssl-usages]

## CA selection

Kubeadm sets up [three CAs][cert-cas] by default. Make sure to sign the CSRs with a corresponding CA.

[openssl-ca]: https://superuser.com/questions/738612/openssl-ca-keyusage-extension
[cfssl-usages]: https://github.com/cloudflare/cfssl/blob/master/doc/cmd/cfssl.txt#L170
[certs]: /docs/setup/best-practices/certificates/
[cert-cas]: /docs/setup/best-practices/certificates/#single-root-ca
[cert-table]: /docs/setup/best-practices/certificates/#all-certificates

{{% /capture %}}
