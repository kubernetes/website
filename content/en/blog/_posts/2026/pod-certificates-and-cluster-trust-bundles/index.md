---
layout: blog
title: "Kubernetes 1.37: Pod Certificates and Cluster Trust Bundles"
draft: true
slug: pod-certificates-and-cluster-trust-bundles
author: >
  [Taahir Ahmed](https://github.com/ahmedtd)
---

## Pod Certificate / Cluster Trust Bundles Blog Post

Kubernetes brings a wealth of features that make it easy to run your production
workloads securely and reliably.  While aspects like scheduling, health checks
and resource limits are probably at the front of your mind, one other important
feature of Kubernetes is production identity — how your workload can
authenticate to other systems in order to do its job.

Up until now, the primary production identity mechanism built into Kubernetes
has been service account JWTs (JSON Web Tokens).  These are
cryptographically-signed tokens, issued by the control plane of your cluster,
that let anyone in the world understand who is calling when your workload uses
them.

In Kubernetes 1.37, the foundations of a new built-in production identity
technology have gone GA.  Pod Certificates (and the closely-associated Cluster
Trust Bundles) build X.509 certificate issuance for TLS and mTLS directly into
core Kubernetes.

Why?

Service account JWTs have a lot going for them:

* They are built directly into Kubelet, and work pretty magically. They are
  written to your workload container’s filesystem before your workload starts
  up, and automatically kept up to date.  
* The issuance system follows least-privilege principles; the node restriction
  admission plugin ensures that tokens can only be requested by the Kubelet that
  is actually currently running your pod.  
* They can be federated, allowing you to use them to authenticate to other
  systems outside of Kubernetes.  Service account JWTs underpin the pod-to-cloud
  authentication store for all of the largest cloud providers, and have
  widespread support across many additional services and software packages.  If
  it can understand JWTs, you can authenticate to it with a service account
  token.

However, service account JWTs have one big downside — they are bearer tokens.
With bearer tokens, if you *have* the token, then you *are* the identity
asserted by the token.  And since you necessarily have to hand copies of the JWT
to all your peers in order to authenticate to them, *they* can be you, too.

There are partial mitigations for this, and service account tokens make use of
them (time-, object-, and audience-binding), but none are complete defences.

A solution to this problem lies in proof-of-possession credentials, where you
don’t send your *entire* credential to your peer, but only a proof that you
possess the credential.  In practice, these schemes are always built on
asymmetric cryptographic signatures (RSA, ECDSA, and friends).

There are few different standard approaches, such as request signing (AWS SigV4,
JWT DPoP, RFC 9421), but the most widely-deployed and understood solution is
X.509 certificates, as used in TLS.  In TLS, your credential is split into two
pieces

* A private key, which for maximum security should be generated within your
  workload (or within a hardware security module), and never leave.
* A certificate, which is a description of your identity and public key, signed
  by a Certificate Authority.

The goal of Pod Certificates is to make using X.509 certificates from your
Kubernetes workload just as easy as using service account JWTs, while
maintaining Kubernetes’ high security bar.  I think we’ve hit this target.

As I’ll cover in the architecture and example sections below, there are many
similarities between the design of service account JWT issuance and Pod
Certificates.  One significant place they diverge, however, is that Pod
Certificates is a much more flexible mechanism.  Kubernetes only offers one
flavor of service account JWTs, with standardized claims.

The X.509 ecosystem is significantly more varied than the JWT ecosystem, and
X.509 certificates used for different purposes  contain different extensions and
information.  For this reason, Pod Certificates has common machinery built into
Kubelet, but offers a pluggable interface so that many different types of
certificates can be issued within a single cluster, at the same time.

In the fullness of time, I expect Kubernetes to offer at least two built-in
certificate providers:

* One that issues server TLS certificates for the DNS names used by Kubernetes
  services.  
* One that offers SPIFFE client certificates, filling the same role that service
  account JWTs fill today.

In the remainder of this article, I’ll take you through the overall architecture
of a Kubernetes workload using Pod Certificates, as well as give you an example
of installing and using a real (toy) Pod Certificates signer controller.

## Architecture

When you use Pod Certificates and Cluster Trust Bundles, there are the following
major components:

* Your application, which requests certificates in its pod spec, and reads the
  keys, certificates and trust bundles from the container filesystem to use for
  (m)TLS.  
* Kubelet, which issues PodCertificateRequest objects and reads
  ClusterTrustBundle objects on behalf of your workload.  
* The signer controller, which answers PodCertificateRequests and publishes
  ClusterTrustBundles.

{{< figure
  src="pod-certificates-architecture.svg"
  alt="Block diagram of an application using Pod Certificates"
  caption="Architecture of an application using Pod Certificates"
  class="diagram-large"
>}}

The best way to get a sense of what these components each do is to follow the
issuance process chronologically:

1) Once your application pod is scheduled to a node, Kubelet identifies all of
   the podCertificate and clusterTrustBundle projected volumes sources in its
   spec.  
2) For each podCertificate source:  
   1) Kubelet generates a new private key according to the keyType field.  
   2) Kubelet creates a PodCertificateRequest addressed to the signer named in
      the source.  
   3) The signer controller sees the PodCertificateRequest and decides whether
      or not to issue the certificate.  
   4) The signer controller issues the certificate by filling out the
      status.certificateChain field.  
   5) The signer controller also fills out the status.beginRefreshAt field to
      instruct Kubelet when it should begin trying to refresh the certificate.  
      certificate to the container filesystem.  
3) For each clusterTrustBundle source:  
   6) Kubelet retrieves the issued certificate, and writes the private key and
   1) Kubelet collects all the ClusterTrustBundles that match the signer name
   2) Kubelet unifies all of the certificates from all matching
      ClusterTrustBundles, and (stably) reorders them (to prevent applications
      from accidentally depending on a particular ordering).  
      and label selectors in the source.  
   3) Kubelet writes the certificates to the file path named in the source.  
   and trust anchors from the filesystem.  
4) Your application pod starts up, and the application reads keys, certificates,
5) Kubelet periodically updates the files from clusterTrustBundle sources as the
   contents of the selected ClusterTrustBundles changes. The application must
   pick up the changes using inotify or polling.  
6) As each certificate’s beginRefreshAt time passes, Kubelet repeats the process
   in step 2 to refresh the certificates, and write the update private keys and
   certificate chains to the filesystem.  As in step 5, the application must
   pick up changes using inotify or polling.

Some key takeaways:

* Automatic rotation is built in.  Applications *must* properly handle it.  Any
  signers eventually shipped in core Kubernetes will issue certificates with a
  max lifetime of 24 hours.  The maximum lifetime allowed for other signers is
  91 days.  
* To make automatic rotation support as simple as possible, Kubelet supports
  writing the private key and certificate chain to a single file (a *credential
  bundle*) This allows the application to simply subscribe to inotify events for
  (or poll) the single file, read the contents, and use them.  Kubelet does
  support writing the private key and certificate chain to separate files, but
  then the application needs to carefully manage the potential race conditions
  of reading the files mid-rotation.  
* Wherever possible, security checks are built into kube-apiserver, rather than
  burdening signer or application developers.  As an example, the built-in node
  restriction admission plugin enforces node isolation, ensuring that one
  compromised node cannot spread access by requesting certificates for pods that
  aren’t scheduled to it.

## Try it out

Because the Kubernetes project does not yet ship any Pod Certificate signers in
core, in order to try these features out, you will need to install a third-party
signer into your cluster.  To make this easier, I have written
[Tinycert](https://github.com/ahmedtd/tinycert), which you can install into your
cluster (or a Kind cluster).

Tinycert is not a full production solution, but it’s a good starting point for
experimenting with Pod Certificates, as well as a base for creating your own
signers.

Tinycert provides:

* The
  [ahmedtd.github.io/tinycert-service](https://ahmedtd.github.io/tinycert-service)
  signer, which issues certificates with DNS SANs for all of the Kubernetes
  Services your Pod is part of.
* The
  [ahmedtd.github.io/tinycert-spiffe](https://ahmedtd.github.io/tinycert-spiffe)
  signer, which issues SPIFFE-compatible certificates that identify the
  namespace and service account of your Pod.  These can be used as both client
  and (with effort) server certificates.
* A Go library,
  [github.com/ahmedtd/tinycert/lib/spiffefsd](https://github.com/ahmedtd/tinycert/lib/spiffefsd)
  to help your applications load SPIFFE certificates and trust bundles from a
  [SPIFFE Filesystem Delivery (Draft
  Standard)](https://github.com/spiffe/spiffe/pull/376) folder, as well as
  configure the Go TLS library for proper client and server authentication.  
* An example of a SPIFFE client and server application communicating using
  mutual TLS and SPIFFE certificates.

## What next?

* Take a look at the documentation for [Pod
  Certificates](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#pod-certificate-requests)
  and [Cluster Trust
  Bundles](https://kubernetes.io/docs/reference/access-authn-authz/certificate-signing-requests/#cluster-trust-bundles).  
* Review and offer feedback on the [SPIFFE Filesystem Delivery draft
  standard](https://github.com/spiffe/spiffe/pull/376), which aims to make it as
  easy as possible to use SPIFFE certificates directly on native Kubernetes.  
* Participate in Kubernetes SIG Auth to help shape the future of signers that
  are built directly in to core Kubernetes.  
* Try building your own signer based on Tinycert.

Happy hacking!
