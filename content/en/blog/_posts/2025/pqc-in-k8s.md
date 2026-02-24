---
layout: blog
title: "Post-Quantum Cryptography in Kubernetes"
slug: pqc-in-k8s
date: 2025-07-18
canonicalUrl: https://www.kubernetes.dev/blog/2025/07/18/pqc-in-k8s/
author: "Fabian Kammel (ControlPlane)"
draft: false
---

The world of cryptography is on the cusp of a major shift with the advent of
quantum computing. While powerful quantum computers are still largely
theoretical for many applications, their potential to break current
cryptographic standards is a serious concern, especially for long-lived
systems. This is where _Post-Quantum Cryptography_ (PQC) comes in. In this
article, I\'ll dive into what PQC means for TLS and, more specifically, for the
Kubernetes ecosystem. I'll explain what the (suprising) state of PQC in
Kubernetes is and what the implications are for current and future clusters.

## What is Post-Quantum Cryptography

Post-Quantum Cryptography refers to cryptographic algorithms that are thought to
be secure against attacks by both classical and quantum computers. The primary
concern is that quantum computers, using algorithms like [Shor\'s Algorithm],
could efficiently break widely used public-key cryptosystems such as RSA and
Elliptic Curve Cryptography (ECC), which underpin much of today\'s secure
communication, including TLS. The industry is actively working on standardizing
and adopting PQC algorithms. One of the first to be standardized by [NIST] is
the Module-Lattice Key Encapsulation Mechanism (`ML-KEM`), formerly known as
Kyber, and now standardized as [FIPS\-203] (PDF download).

It is difficult to predict when quantum computers will be able to break
classical algorithms. However, it is clear that we need to start migrating to
PQC algorithms now, as the next section shows. To get a feeling for the
predicted timeline we can look at a [NIST report] covering the transition to
post-quantum cryptography standards. It declares that system with classical
crypto should be deprecated after 2030 and disallowed after 2035.

## Key exchange vs. digital signatures: different needs, different timelines {#timelines}

In TLS, there are two main cryptographic operations we need to secure:

**Key Exchange**: This is how the client and server agree on a shared secret to
encrypt their communication. If an attacker records encrypted traffic today,
they could decrypt it in the future, if they gain access to a quantum computer
capable of breaking the key exchange. This makes migrating KEMs to PQC an
immediate priority.

**Digital Signatures**: These are primarily used to authenticate the server (and
sometimes the client) via certificates. The authenticity of a server is
verified at the time of connection. While important, the risk of an attack
today is much lower, because the decision of trusting a server cannot be abused
after the fact. Additionally, current PQC signature schemes often come with
significant computational overhead and larger key/signature sizes compared to
their classical counterparts.

Another significant hurdle in the migration to PQ certificates is the upgrade
of root certificates. These certificates have long validity periods and are
installed in many devices and operating systems as trust anchors.

Given these differences, the focus for immediate PQC adoption in TLS has been
on hybrid key exchange mechanisms. These combine a classical algorithm (such as
Elliptic Curve Diffie-Hellman Ephemeral (ECDHE)) with a PQC algorithm (such as
`ML-KEM`). The resulting shared secret is secure as long as at least one of the
component algorithms remains unbroken. The `X25519MLKEM768` hybrid scheme is the
most widely supported one.

## State of PQC key exchange mechanisms (KEMs) today {#state-of-kems}

Support for PQC KEMs is rapidly improving across the ecosystem.

**Go**: The Go standard library\'s `crypto/tls` package introduced support for
`X25519MLKEM768` in version 1.24 (released February 2025). Crucially, it\'s
enabled by default when there is no explicit configuration, i.e.,
`Config.CurvePreferences` is `nil`.

**Browsers & OpenSSL**: Major browsers like Chrome (version 131, November 2024)
and Firefox (version 135, February 2025), as well as OpenSSL (version 3.5.0,
April 2025), have also added support for the `ML-KEM` based hybrid scheme.

Apple is also [rolling out support][ApplePQC] for `X25519MLKEM768` in version
26 of their operating systems. Given the proliferation of Apple devices, this
will have a significant impact on the global PQC adoption.

For a more detailed overview of the state of PQC in the wider industry,
see [this blog post by Cloudflare][PQC2024].

## Post-quantum KEMs in Kubernetes: an unexpected arrival

So, what does this mean for Kubernetes? Kubernetes components, including the
API server and kubelet, are built with Go.

As of Kubernetes v1.33, released in April 2025, the project uses Go 1.24. A
quick check of the Kubernetes codebase reveals that `Config.CurvePreferences`
is not explicitly set. This leads to a fascinating conclusion: Kubernetes
v1.33, by virtue of using Go 1.24, supports hybrid post-quantum
`X25519MLKEM768` for TLS connections by default!

You can test this yourself. If you set up a Minikube cluster running Kubernetes
v1.33.0, you can connect to the API server using a recent OpenSSL client:

```console
$ minikube start --kubernetes-version=v1.33.0
$ kubectl cluster-info
Kubernetes control plane is running at https://127.0.0.1:<PORT>
$ kubectl config view --minify --raw -o jsonpath=\'{.clusters[0].cluster.certificate-authority-data}\' | base64 -d > ca.crt
$ openssl version
OpenSSL 3.5.0 8 Apr 2025 (Library: OpenSSL 3.5.0 8 Apr 2025)
$ echo -n "Q" | openssl s_client -connect 127.0.0.1:<PORT> -CAfile ca.crt
[...]
Negotiated TLS1.3 group: X25519MLKEM768
[...]
DONE
```

Lo and behold, the negotiated group is `X25519MLKEM768`! This is a significant
step towards making Kubernetes quantum-safe, seemingly without a major
announcement or dedicated KEP (Kubernetes Enhancement Proposal).

## The Go version mismatch pitfall

An interesting wrinkle emerged with Go versions 1.23 and 1.24. Go 1.23
included experimental support for a draft version of `ML-KEM`, identified as
`X25519Kyber768Draft00`. This was also enabled by default if
`Config.CurvePreferences` was `nil`. Kubernetes v1.32 used Go 1.23. However,
Go 1.24 removed the draft support and replaced it with the standardized version
`X25519MLKEM768`.

What happens if a client and server are using mismatched Go versions (one on
1.23, the other on 1.24)? They won\'t have a common PQC KEM to negotiate, and
the handshake will fall back to classical ECC curves (e.g., `X25519`). How
could this happen in practice?

Consider a scenario:

A Kubernetes cluster is running v1.32 (using Go 1.23 and thus
`X25519Kyber768Draft00`). A developer upgrades their `kubectl` to v1.33,
compiled with Go 1.24, only supporting `X25519MLKEM768`. Now, when `kubectl`
communicates with the v1.32 API server, they no longer share a common PQC
algorithm. The connection will downgrade to classical cryptography, silently
losing the PQC protection that has been in place. This highlights the
importance of understanding the implications of Go version upgrades, and the
details of the TLS stack.

## Limitations: packet size {#limitation-packet-size}

One practical consideration with `ML-KEM` is the size of its public keys
with encoded key sizes of around 1.2 kilobytes for `ML-KEM-768`.
This can cause the initial TLS `ClientHello` message not to fit inside
a single TCP/IP packet, given the typical networking constraints
(most commonly, the standard Ethernet frame size limit of 1500
bytes). Some TLS libraries or network appliances might not handle this
gracefully, assuming the Client Hello always fits in one packet. This issue
has been observed in some Kubernetes-related projects and networking
components, potentially leading to connection failures when PQC KEMs are used.
More details can be found at [tldr.fail].

## State of Post-Quantum Signatures

While KEMs are seeing broader adoption, PQC digital signatures are further
behind in terms of widespread integration into standard toolchains. NIST has
published standards for PQC signatures, such as `ML-DSA` (`FIPS-204`) and
`SLH-DSA` (`FIPS-205`). However, implementing these in a way that\'s broadly
usable (e.g., for PQC Certificate Authorities) [presents challenges]:

**Larger Keys and Signatures**: PQC signature schemes often have significantly
larger public keys and signature sizes compared to classical algorithms like
Ed25519 or RSA. For instance, Dilithium2 keys can be 30 times larger than
Ed25519 keys, and certificates can be 12 times larger.

**Performance**: Signing and verification operations [can be substantially slower].
While some algorithms are on par with classical algorithms, others may have a
much higher overhead, sometimes on the order of 10x to 1000x worse performance.
To improve this situation, NIST is running a
[second round of standardization][NIST2ndRound] for PQC signatures.

**Toolchain Support**: Mainstream TLS libraries and CA software do not yet have
mature, built-in support for these new signature algorithms. The Go team, for
example, has indicated that `ML-DSA` support is a high priority, but the
soonest it might appear in the standard library is Go 1.26 [(as of May 2025)].

[Cloudflare\'s CIRCL] (Cloudflare Interoperable Reusable Cryptographic Library)
library implements some PQC signature schemes like variants of Dilithium, and
they maintain a [fork of Go (cfgo)] that integrates CIRCL. Using `cfgo`, it\'s
possible to experiment with generating certificates signed with PQC algorithms
like Ed25519-Dilithium2. However, this requires using a custom Go toolchain and
is not yet part of the mainstream Kubernetes or Go distributions.

## Conclusion

The journey to a post-quantum secure Kubernetes is underway, and perhaps
further along than many realize, thanks to the proactive adoption of `ML-KEM`
in Go. With Kubernetes v1.33, users are already benefiting from hybrid post-quantum key
exchange in many TLS connections by default.

However, awareness of potential pitfalls, such as Go version mismatches leading
to downgrades and issues with Client Hello packet sizes, is crucial. While PQC
for KEMs is becoming a reality, PQC for digital signatures and certificate
hierarchies is still in earlier stages of development and adoption for
mainstream use. As Kubernetes maintainers and contributors, staying informed
about these developments will be key to ensuring the long-term security of the
platform.

[Shor\'s Algorithm]: https://en.wikipedia.org/wiki/Shor%27s_algorithm
[NIST]: https://www.nist.gov/
[FIPS\-203]: https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.203.pdf
[NIST report]: https://nvlpubs.nist.gov/nistpubs/ir/2024/NIST.IR.8547.ipd.pdf
[tldr.fail]: https://tldr.fail/
[presents challenges]: https://blog.cloudflare.com/another-look-at-pq-signatures/#the-algorithms
[can be substantially slower]: https://pqshield.github.io/nist-sigs-zoo/
[(as of May 2025)]: https://github.com/golang/go/issues/64537#issuecomment-2877714729
[Cloudflare\'s CIRCL]: https://github.com/cloudflare/circl
[fork of Go (cfgo)]: https://github.com/cloudflare/go
[PQC2024]: https://blog.cloudflare.com/pq-2024/
[NIST2ndRound]: https://csrc.nist.gov/news/2024/pqc-digital-signature-second-round-announcement
[ApplePQC]: https://support.apple.com/en-lb/122756