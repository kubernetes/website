---
layout: blog
title: "Confidential Kubernetes: Use Confidential Virtual Machines and Enclaves to improve your cluster security"
date: 2023-07-06
slug: "confidential-kubernetes"
author: >
  Fabian Kammel (Edgeless Systems),
  Mikko Ylinen (Intel),
  Tobin Feldman-Fitzthum (IBM)
---

In this blog post, we will introduce the concept of Confidential Computing (CC) to improve any computing environment's security and privacy properties. Further, we will show how
the Cloud-Native ecosystem, particularly Kubernetes, can benefit from the new compute paradigm.

Confidential Computing is a concept that has been introduced previously in the cloud-native world. The
[Confidential Computing Consortium](https://confidentialcomputing.io/) (CCC) is a project community in the Linux Foundation
that already worked on
[Defining and Enabling Confidential Computing](https://confidentialcomputing.io/wp-content/uploads/sites/85/2019/12/CCC_Overview.pdf).
In the [Whitepaper](https://confidentialcomputing.io/wp-content/uploads/sites/85/2023/01/CCC-A-Technical-Analysis-of-Confidential-Computing-v1.3_Updated_November_2022.pdf),
they provide a great motivation for the use of Confidential Computing:

   > Data exists in three states: in transit, at rest, and in use. …Protecting sensitive data
   > in all of its states is more critical than ever. Cryptography is now commonly deployed
   > to provide both data confidentiality (stopping unauthorized viewing) and data integrity
   > (preventing or detecting unauthorized changes). While techniques to protect data in transit
   > and at rest are now commonly deployed, the third state - protecting data in use - is the new frontier.

Confidential Computing aims to primarily solve the problem of **protecting data in use**
by introducing a hardware-enforced Trusted Execution Environment (TEE).

## Trusted Execution Environments

For more than a decade, Trusted Execution Environments (TEEs) have been available in commercial
computing hardware in the form of [Hardware Security Modules](https://en.wikipedia.org/wiki/Hardware_security_module)
(HSMs) and [Trusted Platform Modules](https://www.iso.org/standard/50970.html) (TPMs). These
technologies provide trusted environments for shielded computations. They can
store highly sensitive cryptographic keys and carry out critical cryptographic operations
such as signing or encrypting data.

TPMs are optimized for low cost, allowing them to be integrated into mainboards and act as a
system's physical root of trust. To keep the cost low, TPMs are limited in scope, i.e., they
provide storage for only a few keys and are capable of just a small subset of cryptographic operations.

In contrast, HSMs are optimized for high performance, providing secure storage for far
more keys and offering advanced physical attack detection mechanisms. Additionally, high-end HSMs
can be programmed so that arbitrary code can be compiled and executed. The downside
is that they are very costly. A managed CloudHSM from AWS costs
[around $1.50 / hour](https://aws.amazon.com/cloudhsm/pricing/) or ~$13,500 / year.

In recent years, a new kind of TEE has gained popularity. Technologies like
[AMD SEV](https://developer.amd.com/sev/),
[Intel SGX](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html),
and [Intel TDX](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
provide TEEs that are closely integrated with userspace. Rather than low-power or high-performance
devices that support specific use cases, these TEEs shield normal processes or virtual machines
and can do so with relatively low overhead. These technologies each have different design goals,
advantages, and limitations, and they are available in different environments, including consumer
laptops, servers, and mobile devices.

Additionally, we should mention
[ARM TrustZone](https://www.arm.com/technologies/trustzone-for-cortex-a), which is optimized
for embedded devices such as smartphones, tablets, and smart TVs, as well as
[AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/), which are only available
on [Amazon Web Services](https://aws.amazon.com/) and have a different threat model compared
to the CPU-based solutions by Intel and AMD.

[IBM Secure Execution for Linux](https://www.ibm.com/docs/en/linux-on-systems?topic=virtualization-secure-execution)
lets you run your Kubernetes cluster's nodes as KVM guests within a trusted execution environment on
IBM Z series hardware. You can use this hardware-enhanced virtual machine isolation to
provide strong isolation between tenants in a cluster, with hardware attestation about the (virtual) node's integrity.

### Security properties and feature set

In the following sections, we will review the security properties and additional features
these new technologies bring to the table. Only some solutions will provide all properties;
we will discuss each technology in further detail in their respective section.

The **Confidentiality** property ensures that information cannot be viewed while it is
in use in the TEE. This provides us with the highly desired feature to secure
**data in use**. Depending on the specific TEE used, both code and data may be protected
from outside viewers. The differences in TEE architectures and how their use
in a cloud native context are important considerations when designing end-to-end security
for sensitive workloads with a minimal **Trusted Computing Base** (TCB) in mind. CCC has recently
worked on a [common vocabulary and supporting material](https://confidentialcomputing.io/wp-content/uploads/sites/85/2023/01/Common-Terminology-for-Confidential-Computing.pdf)
that helps to explain where confidentiality boundaries are drawn with the different TEE
architectures and how that impacts the TCB size.

Confidentiality is a great feature, but an attacker can still manipulate
or inject arbitrary code and data for the TEE to execute and, therefore, easily leak critical
information. **Integrity** guarantees a TEE owner that neither code nor data can be
tampered with while running critical computations.

**Availability** is a basic property often discussed in the context of information
security. However, this property is outside the scope of most TEEs. Usually, they can be controlled
(shut down, restarted, …) by some higher level abstraction. This could be the CPU itself, the
hypervisor, or the kernel. This is to preserve the overall system's availability,
not the TEE itself. When running in the cloud, availability is usually guaranteed by
the cloud provider in terms of Service Level Agreements (SLAs) and is not cryptographically enforceable.

Confidentiality and Integrity by themselves are only helpful in some cases. For example,
consider a TEE running in a remote cloud. How would you know the TEE is genuine and running
your intended software? It could be an imposter stealing your data as soon as you send it over.
This fundamental problem is addressed by **Attestability**. Attestation allows us to verify
the identity, confidentiality, and integrity of TEEs based on cryptographic certificates issued
from the hardware itself. This feature can also be made available to clients outside of the
confidential computing hardware in the form of remote attestation.

TEEs can hold and process information that predates or outlives the trusted environment. That
could mean across restarts, different versions, or platform migrations. Therefore **Recoverability**
is an important feature. Data and the state of a TEE need to be sealed before they are written
to persistent storage to maintain confidentiality and integrity guarantees. The access to such
sealed data needs to be well-defined. In most cases, the unsealing is bound to a TEE's identity.
Hence, making sure the recovery can only happen in the same confidential context.

This does not have to limit the flexibility of the overall system.
[AMD SEV-SNP's migration agent (MA)](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
allows users to migrate a confidential virtual machine to a different host system
while keeping the security properties of the TEE intact.

## Feature comparison

These sections of the article will dive a little bit deeper into the specific implementations,
compare supported features and analyze their security properties.

### AMD SEV

AMD's [Secure Encrypted Virtualization (SEV)](https://developer.amd.com/sev/) technologies
are a set of features to enhance the security of virtual machines on AMD's server CPUs. SEV
transparently encrypts the memory of each VM with a unique key. SEV can also calculate a
signature of the memory contents, which can be sent to the VM's owner as an attestation that
the initial guest memory was not manipulated.

The second generation of SEV, known as
[Encrypted State](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/white-papers/Protecting-VM-Register-State-with-SEV-ES.pdf)
or SEV-ES, provides additional protection from the hypervisor by encrypting all
CPU register contents when a context switch occurs.

The third generation of SEV,
[Secure Nested Paging](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
or SEV-SNP, is designed to prevent software-based integrity attacks and reduce the risk associated with
compromised memory integrity. The basic principle of SEV-SNP integrity is that if a VM can read
a private (encrypted) memory page, it must always read the value it last wrote.

Additionally, by allowing the guest to obtain remote attestation statements dynamically,
SNP enhances the remote attestation capabilities of SEV.

AMD SEV has been implemented incrementally. New features and improvements have been added with
each new CPU generation. The Linux community makes these features available as part of the KVM hypervisor
and for host and guest kernels. The first SEV features were discussed and implemented in 2016 - see
[AMD x86 Memory Encryption Technologies](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/kaplan)
from the 2016 Usenix Security Symposium. The latest big addition was
[SEV-SNP guest support in Linux 5.19](https://www.phoronix.com/news/AMD-SEV-SNP-Arrives-Linux-5.19).

[Confidential VMs based on AMD SEV-SNP](https://azure.microsoft.com/en-us/updates/azureconfidentialvm/)
are available in Microsoft Azure since July 2022. Similarly, Google Cloud Platform (GCP) offers
[confidential VMs based on AMD SEV-ES](https://cloud.google.com/compute/confidential-vm/docs/about-cvm).

### Intel SGX

Intel's
[Software Guard Extensions](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
has been available since 2015 and were introduced with the Skylake architecture.

SGX is an instruction set that enables users to create a protected and isolated process called
an *enclave*. It provides a reverse sandbox that protects enclaves from the operating system,
firmware, and any other privileged execution context.

The enclave memory cannot be read or written from outside the enclave, regardless of
the current privilege level and CPU mode. The only way to call an enclave function is
through a new instruction that performs several protection checks. Its memory is encrypted.
Tapping the memory or connecting the DRAM modules to another system will yield only encrypted
data. The memory encryption key randomly changes every power cycle. The key is stored
within the CPU and is not accessible.

Since the enclaves are process isolated, the operating system's libraries are not usable as is;
therefore, SGX enclave SDKs are required to compile programs for SGX. This also implies applications
need to be designed and implemented to consider the trusted/untrusted isolation boundaries.
On the other hand, applications get built with very minimal TCB.

An emerging approach to easily transition to process-based confidential computing
and avoid the need to build custom applications is to utilize library OSes. These OSes
facilitate running native, unmodified Linux applications inside SGX enclaves.
A library OS intercepts all application requests to the host OS and processes them securely
without the application knowing it's running a TEE.

The 3rd generation Xeon CPUs (aka Ice Lake Server - "ICX") and later generations did switch to using a technology called
[Total Memory Encryption - Multi-Key](https://www.intel.com/content/www/us/en/developer/articles/news/runtime-encryption-of-memory-with-intel-tme-mk.html)
(TME-MK) that uses AES-XTS, moving away from the
[Memory Encryption Engine](https://eprint.iacr.org/2016/204.pdf)
that the consumer and Xeon E CPUs used. This increased the possible
[enclave page cache](https://sgx101.gitbook.io/sgx101/sgx-bootstrap/enclave#enclave-page-cache-epc)
(EPC) size (up to 512GB/CPU) and improved performance. More info
about SGX on multi-socket platforms can be found in the
[Whitepaper](https://www.intel.com/content/dam/www/public/us/en/documents/white-papers/supporting-intel-sgx-on-mulit-socket-platforms.pdf).

A [list of supported platforms](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873)
is available from Intel.

SGX is available on
[Azure](https://azure.microsoft.com/de-de/updates/intel-sgx-based-confidential-computing-vms-now-available-on-azure-dedicated-hosts/),
[Alibaba Cloud](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-an-sgx-encrypted-computing-environment),
[IBM](https://cloud.ibm.com/docs/bare-metal?topic=bare-metal-bm-server-provision-sgx), and many more.

### Intel TDX

Where Intel SGX aims to protect the context of a single process,
[Intel's Trusted Domain Extensions](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
protect a full virtual machine and are, therefore, most closely comparable to AMD SEV.

As with SEV-SNP, guest support for TDX was [merged in Linux Kernel 5.19](https://www.phoronix.com/news/Intel-TDX-For-Linux-5.19).
However, hardware support will land with [Sapphire Rapids](https://en.wikipedia.org/wiki/Sapphire_Rapids) during 2023:
[Alibaba Cloud provides](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-a-tdx-confidential-computing-environment)
invitational preview instances, and
[Azure has announced](https://techcommunity.microsoft.com/t5/azure-confidential-computing/preview-introducing-dcesv5-and-ecesv5-series-confidential-vms/ba-p/3800718)
its TDX preview opportunity.

## Overhead analysis

The benefits that Confidential Computing technologies provide via strong isolation and enhanced
security to customer data and workloads are not for free. Quantifying this impact is challenging and
depends on many factors: The TEE technology, the benchmark, the metrics, and the type of workload
all have a huge impact on the expected performance overhead.

Intel SGX-based TEEs are hard to benchmark, as [shown](https://arxiv.org/pdf/2205.06415.pdf)
[by](https://www.ibr.cs.tu-bs.de/users/mahhouk/papers/eurosec2021.pdf)
[different papers](https://dl.acm.org/doi/fullHtml/10.1145/3533737.3535098). The chosen SDK/library
OS, the application itself, as well as the resource requirements (especially large memory requirements)
have a huge impact on performance. A single-digit percentage overhead can be expected if an application
is well suited to run inside an enclave.

Confidential virtual machines based on AMD SEV-SNP require no changes to the executed program
and operating system and are a lot easier to benchmark. A
[benchmark from Azure and AMD](https://community.amd.com/t5/business/microsoft-azure-confidential-computing-powered-by-3rd-gen-epyc/ba-p/497796)
shows that SEV-SNP VM overhead is <10%, sometimes as low as 2%.

Although there is a performance overhead, it should be low enough to enable real-world workloads
to run in these protected environments and improve the security and privacy of our data.

## Confidential Computing compared to FHE, ZKP, and MPC

Fully Homomorphic Encryption (FHE), Zero Knowledge Proof/Protocol (ZKP), and Multi-Party
Computations (MPC) are all a form of encryption or cryptographic protocols that offer
similar security guarantees to Confidential Computing but do not require hardware support.

Fully (also partially and somewhat) homomorphic encryption allows one to perform
computations, such as addition or multiplication, on encrypted data. This provides
the property of encryption in use but does not provide integrity protection or attestation
like confidential computing does. Therefore, these two technologies can [complement to each other](https://confidentialcomputing.io/2023/03/29/confidential-computing-and-homomorphic-encryption/).

Zero Knowledge Proofs or Protocols are a privacy-preserving technique (PPT) that
allows one party to prove facts about their data without revealing anything else about
the data. ZKP can be used instead of or in addition to Confidential Computing to protect
the privacy of the involved parties and their data. Similarly, Multi-Party Computation
enables multiple parties to work together on a computation, i.e., each party provides
their data to the result without leaking it to any other parties.

## Use cases of Confidential Computing

The presented Confidential Computing platforms show that both the isolation of a single container
process and, therefore, minimization of the trusted computing base and the isolation of a
``
full virtual machine are possible. This has already enabled a lot of interesting and secure
projects to emerge:

### Confidential Containers

[Confidential Containers](https://github.com/confidential-containers) (CoCo) is a
CNCF sandbox project that isolates Kubernetes pods inside of confidential virtual machines.

CoCo can be installed on a Kubernetes cluster with an operator.
The operator will create a set of runtime classes that can be used to deploy
pods inside an enclave on several different platforms, including
AMD SEV, Intel TDX, Secure Execution for IBM Z, and Intel SGX.

CoCo is typically used with signed and/or encrypted container images
which are pulled, verified, and decrypted inside the enclave.
Secrets, such as image decryption keys, are conditionally provisioned
to the enclave by a trusted Key Broker Service that validates the
hardware evidence of the TEE prior to releasing any sensitive information.

CoCo has several deployment models. Since the Kubernetes control plane
is outside the TCB, CoCo is suitable for managed environments. CoCo can
be run in virtual environments that don't support nesting with the help of an
API adaptor that starts pod VMs in the cloud. CoCo can also be run on
bare metal, providing strong isolation even in multi-tenant environments.

### Managed confidential Kubernetes

[Azure](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-node-pool-aks) and
[GCP](https://cloud.google.com/blog/products/identity-security/announcing-general-availability-of-confidential-gke-nodes)
both support the use of confidential virtual machines as worker nodes for their managed Kubernetes offerings.

Both services aim for better workload protection and security guarantees by enabling memory encryption
for container workloads. However, they don't seek to fully isolate the cluster or workloads against
the service provider or infrastructure. Specifically, they don't offer a dedicated confidential control
plane or expose attestation capabilities for the confidential cluster/nodes.

Azure also enables
[Confidential Containers](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-nodes-aks-overview)
in their managed Kubernetes offering. They support the creation based on
[Intel SGX enclaves](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-containers-enclaves)
and [AMD SEV-based VMs](https://techcommunity.microsoft.com/t5/azure-confidential-computing/microsoft-introduces-preview-of-confidential-containers-on-azure/ba-p/3410394).

### Constellation

[Constellation](https://github.com/edgelesssys/constellation) is a Kubernetes engine that aims to
provide the best possible data security. Constellation wraps your entire Kubernetes cluster into
a single confidential context that is shielded from the underlying cloud infrastructure. Everything
inside is always encrypted, including at runtime in memory. It shields both the worker and control
plane nodes. In addition, it already integrates with popular CNCF software such as Cilium for
secure networking and provides extended CSI drivers to write data securely.

### Occlum and Gramine

[Occlum](https://occlum.io/) and [Gramine](https://gramineproject.io/) are examples of open source
library OS projects that can be used to run unmodified applications in SGX enclaves. They
are member projects under the CCC, but similar projects and products maintained by companies
also exist. With these libOS projects, existing containerized applications can be
easily converted into confidential computing enabled containers. Many curated prebuilt
containers are also available.

## Where are we today? Vendors, limitations, and FOSS landscape

As we hope you have seen from the previous sections, Confidential Computing is a powerful new concept
to improve security, but we are still in the (early) adoption phase. New products are
starting to emerge to take advantage of the unique properties.

Google and Microsoft are the first major cloud providers to have confidential offerings that
can run unmodified applications inside a protected boundary.
Still, these offerings are limited to compute, while end-to-end solutions for confidential
databases, cluster networking, and load balancers have to be self-managed.

These technologies provide opportunities to bring even the most
sensitive workloads into the cloud and enables them to leverage all the
tools in the CNCF landscape.

## Call to action

If you are currently working on a high-security product that struggles to run in the
public cloud due to legal requirements or are looking to bring the privacy and security
of your cloud-native project to the next level: Reach out to all the great projects
we have highlighted! Everyone is keen to improve the security of our ecosystem, and you can
play a vital role in that journey.

* [Confidential Containers](https://github.com/confidential-containers)
* [Constellation: Always Encrypted Kubernetes](https://github.com/edgelesssys/constellation)
* [Occlum](https://occlum.io/)
* [Gramine](https://gramineproject.io/)
* CCC also maintains a [list of projects](https://confidentialcomputing.io/projects/)
