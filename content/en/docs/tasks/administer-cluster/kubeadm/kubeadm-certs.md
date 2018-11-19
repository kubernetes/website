---
reviewers:
- sig-cluster-lifecycle
title: Certificate Management with kubeadm
content_template: templates/task
---

{{% capture overview %}}

This page explains various kubeadm-specific topics related to certificate management

{{% /capture %}}

{{% capture prerequisites %}}

These are advanced topics for particular scenarios. Most kubeadm users with generic configuration will not need to use them. Read on if you are looking to integrate a kubeadm-built cluster into a larger organisation's certificate infrastructure.

{{% /capture %}}

{{% capture steps %}}

# Renewing certificates using the certificates API

Kubeadm can renew certificates using the `kubeadm alpha certs renew` commands. 
Typically this is done by loading on-disk CA certificates and keys and using them to issue new certificates.
This works fine when using an entirely self-contained certificate tree, but may not make sense when certificates are managed externally.

As an alternative, Kubernetes provides its own [API for managing certificates][manage-tls].
You can direct `kubeadm` to use this API with `kubeadm alpha certs renew --use-api`.

## Setting up a signer

The Kubernetes certificate authority does not work out of the box. 
You can configure an external signer such as [cert-manager][cert-manager-issuer], or you can use the build-in signer. 
The built-in signer is part of [`kube-controller-manager`][kcm]. 
Activating it requires that you pass in the `--cluster-signing-cert-file` and `--cluster-signing-key-file` arguments.

There are several ways of doing this:

* Edit `/etc/kubernetes/manifests/kube-controller-manager.yaml` to add the arguments to the command.
  Keep in mind that this may be overwritten during the next upgrade.
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
[kcm]: https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/
[config]: https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta1
[config-upload]: https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm-config/#cmd-config-from-file

## Approving requests

Unless you've set up an external signer such as [cert-manager][cert-manager], you will need to manually approve certificates. This is done using the [`kubectl certificates`][certs] command. 
The `kubeadm` command will output the name of the certificate you need to approve, then block and wait for approval to occur:

```shell
$ sudo kubeadm alpha certs renew apiserver --use-api &
[1] 2890
[certs] certificate request "kubeadm-cert-kube-apiserver-ld526" created
$ kubectl certificate approve kubeadm-cert-kube-apiserver-ld526
certificatesigningrequest.certificates.k8s.io/kubeadm-cert-kube-apiserver-ld526 approved
[1]+  Done                    sudo kubeadm alpha certs renew apiserver --use-api
```

You can view a list of pending certificates with `kubectl get csr`.

[manage-tls]: https://kubernetes.io/docs/tasks/tls/managing-tls-in-a-cluster/
[cert-manager]: https://github.com/jetstack/cert-manager
[certs]: https://kubernetes.io/docs/reference/generated/kubectl/kubectl-commands#certificate

# Using Certificate Requests with Kubeadm

To better integrate with external CAs, kubeadm can also produce certificate signing requests (CSRs). 
A CSR represents a request for a CA to produce a signed certificate for a client. 
In kubeadm terms, any certificate that would normally be signed by an on-disk CA can be produced as a CSR instead, but CAs themselves cannot.

## Requesting CSRs

### kubeadm init 
You can request an individual CSR with `kubeadm init phase certs apiserver --use-csr`. 
The `--use-csr` flag can only be applied to individual phases; once [all certificates are in place][certs] you can run `kubeadm init --external-ca`.

You can pass in a directory to output the CSRs with `--csr-dir`. 
If it is not specified, the default certificate directory (`/etc/kubernetes/pki`) is used.
Both the CSR and the accompanying private key are given in the output. Once a certificate is signed, the certificate and the private key must be copied to the PKI directory (by default `/etc/kubernetes/pki`).

### certs renew

Certificates can also be renewed using `kubeadm alpha certs renew --use-csr`. 
Like with `kubeadm init`, an output directory can be specified with `--csr-dir`. 
To use the new certificates, copy the signed certificate and private key into the PKI directory (by default `/etc/kubernetes/pki`)

## Cert usage

CSRs contain a certificate's name, domains, and IPs, but it does _not_ specify usages. 
It is the responsibility of the CA to specify [the correct cert usages][cert-table] when issuing a certificate. 
* In `openssl` this is done using the [`openssl ca` command][openssl-ca].
* In `cfssl` you specify [usages in the config file][cfssl-usages]

## CA selection

Kubeadm sets up [three CAs][cert-cas] by default. Be sure you sign the CSRs with a corresponding CA.

[openssl-ca]: https://superuser.com/questions/738612/openssl-ca-keyusage-extension
[cfssl-usages]: https://github.com/cloudflare/cfssl/blob/master/doc/cmd/cfssl.txt#L170
[certs]: https://kubernetes.io/docs/setup/certificates
[cert-cas]: https://kubernetes.io/docs/setup/certificates/#single-root-ca
[cert-table]: https://kubernetes.io/docs/setup/certificates/#all-certificates

{{% /capture %}}
https://prow.k8s.io/?pull=71212
