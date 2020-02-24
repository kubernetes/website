---
reviewers:
- liggitt
- mikedanese
- munnerz
title: Certificate Signing Requests
content_template: templates/concept
weight: 20
---

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

{{% capture overview %}}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

TBD

{{% /capture %}}

{{% capture body %}}
## Certificate Signing Requests Overview

* Request
* Approval (or denial)
* Signing (or signing failure/rejection)
* Retrieval
* Garbage collection of issued CSRs

## Signers

### Signers should define...

TBD

### Kubernetes signers

* `kubernetes.io/kube-apiserver-client`
* `kubernetes.io/kube-apiserver-client-kubelet`
* `kubernetes.io/kubelet-serving`
* `kubernetes.io/legacy-unknown`

## Authorization

To allow creating a CertificateSigningRequest and retrieving any CertificateSigningRequest:
* create certificates.k8s.io certificatesigningrequests
* get certificates.k8s.io certificatesigningrequests

To allow approving a CertificateSigningRequest:
* update certificates.k8s.io certificatesigningrequests/approval
* approve certificates.k8s.io signers <signerNameDomain>/<signerNamePath> or
  approve certificates.k8s.io signers <signerNameDomain>/*

To allow signing a CertificateSigningRequest:
* update certificates.k8s.io certificatesigningrequests/status
* sign certificates.k8s.io signers <signerNameDomain>/<signerNamePath> or
  sign certificates.k8s.io signers <signerNameDomain>/*

## Approval/Rejection

### kube-controller-manager auto-approval

TBD

### kubectl-based approver

TBD

### API-based approver

## Signing

### kube-controller-manager signer

TBD

### API-based signers

TBD

{{% /capture %}}
