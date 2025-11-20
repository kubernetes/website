---
layout: blog
title: "Kubernetes 機密：使用機密虛擬機和安全區來增強你的叢集安全性"
date: 2023-07-06
slug: "confidential-kubernetes"
---

<!--
layout: blog
title: "Confidential Kubernetes: Use Confidential Virtual Machines and Enclaves to improve your cluster security"
date: 2023-07-06
slug: "confidential-kubernetes"
-->

<!--
**Authors:** Fabian Kammel (Edgeless Systems), Mikko Ylinen (Intel), Tobin Feldman-Fitzthum (IBM)
-->
**作者**：Fabian Kammel (Edgeless Systems), Mikko Ylinen (Intel), Tobin Feldman-Fitzthum (IBM)

**譯者**：[顧欣](https://github.com/asa3311)

<!--
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
-->
在這篇博客文章中，我們將介紹機密計算（Confidential Computing，簡稱 CC）的概念，
以增強任何計算環境的安全和隱私屬性。此外，我們將展示雲原生生態系統，
特別是 Kubernetes，如何從新的計算範式中受益。

機密計算是一個先前在雲原生領域中引入的概念。
[機密計算聯盟](https://confidentialcomputing.io/)(Confidential Computing Consortium，簡稱 CCC) 
是 Linux 基金會中的一個項目社區，
致力於[定義和啓用機密計算](https://confidentialcomputing.io/wp-content/uploads/sites/85/2019/12/CCC_Overview.pdf)。
在[白皮書](https://confidentialcomputing.io/wp-content/uploads/sites/85/2023/01/CCC-A-Technical-Analysis-of-Confidential-Computing-v1.3_Updated_November_2022.pdf)中，
他們爲使用機密計算提供了很好的動機。

   > 資料存在於三種狀態：傳輸中、靜態儲存和使用中。保護所有狀態下的敏感資料比以往任何時候都更加關鍵。
   > 現在加密技術常被部署以提供資料機密性（阻止未經授權的查看）和資料完整性（防止或檢測未經授權的更改）。
   > 雖然現在通常部署了保護傳輸中和靜態儲存中的資料的技術，但保護使用中的資料是新的前沿。

機密計算主要通過引入硬件強制執行的可信執行環境（TEE）來解決**保護使用中的資料**的問題。

<!--
## Trusted Execution Environments

For more than a decade, Trusted Execution Environments (TEEs) have been available in commercial
computing hardware in the form of [Hardware Security Modules](https://en.wikipedia.org/wiki/Hardware_security_module)
(HSMs) and [Trusted Platform Modules](https://www.iso.org/standard/50970.html) (TPMs). These
technologies provide trusted environments for shielded computations. They can
store highly sensitive cryptographic keys and carry out critical cryptographic operations
such as signing or encrypting data.
-->
## 可信執行環境  {#trusted-execution-environments}

在過去的十多年裏，可信執行環境（Trusted Execution Environments，簡稱 TEEs）
以[硬件安全模塊](https://zh.wikipedia.org/zh-cn/%E7%A1%AC%E4%BB%B6%E5%AE%89%E5%85%A8%E6%A8%A1%E5%9D%97)（Hardware Security Modules，簡稱 HSMs）
和[可信平臺模塊](https://www.iso.org/standard/50970.html)（Trusted Platform Modules，簡稱 TPMs）
的形式在商業計算硬件中得以應用。這些技術提供了可信的環境來進行受保護的計算。
它們可以儲存高度敏感的加密密鑰，並執行關鍵的加密操作，如簽名或加密資料。

<!--
TPMs are optimized for low cost, allowing them to be integrated into mainboards and act as a
system's physical root of trust. To keep the cost low, TPMs are limited in scope, i.e., they
provide storage for only a few keys and are capable of just a small subset of cryptographic operations.

In contrast, HSMs are optimized for high performance, providing secure storage for far
more keys and offering advanced physical attack detection mechanisms. Additionally, high-end HSMs
can be programmed so that arbitrary code can be compiled and executed. The downside
is that they are very costly. A managed CloudHSM from AWS costs
[around $1.50 / hour](https://aws.amazon.com/cloudhsm/pricing/) or ~$13,500 / year.
-->
TPMs 的優化爲降低成本，使它們能夠集成到主板中並充當系統的物理根信任。
爲了保持低成本，TPMs 的範圍受到限制，即它們只能儲存少量的密鑰，並且僅能執行一小部分的加密操作。

相比之下，HSMs 的優化爲提高性能，爲更多的密鑰提供安全儲存，並提供高級物理攻擊檢測機制。
此外，高端 HSMs 可以編程，以便可以編譯和執行任意代碼。缺點是它們的成本非常高。
來自 AWS 的託管 CloudHSM 的費用大約是[每小時 1.50 美元](https://aws.amazon.com/cloudhsm/pricing/)，
或者約每年 13,500 美元。

<!--
In recent years, a new kind of TEE has gained popularity. Technologies like
[AMD SEV](https://developer.amd.com/sev/),
[Intel SGX](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html),
and [Intel TDX](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
provide TEEs that are closely integrated with userspace. Rather than low-power or high-performance
devices that support specific use cases, these TEEs shield normal processes or virtual machines
and can do so with relatively low overhead. These technologies each have different design goals,
advantages, and limitations, and they are available in different environments, including consumer
laptops, servers, and mobile devices.
-->
近年來，一種新型的 TEE 已經變得流行。
像 [AMD SEV](https://developer.amd.com/sev/)、
[Intel SGX](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
和 [Intel TDX](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
這樣的技術提供了與使用者空間緊密集成的 TEE。與支持特定的低功耗或高性能設備不同，
這些 TEE 保護普通進程或虛擬機，並且可以以相對較低的開銷執行此操作。
這些技術各有不同的設計目標、優點和侷限性，
並且在不同的環境中可用，包括消費者筆記本電腦、伺服器和移動設備。

<!--
Additionally, we should mention
[ARM TrustZone](https://www.arm.com/technologies/trustzone-for-cortex-a), which is optimized
for embedded devices such as smartphones, tablets, and smart TVs, as well as
[AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/), which are only available
on [Amazon Web Services](https://aws.amazon.com/) and have a different threat model compared
to the CPU-based solutions by Intel and AMD.
-->
此外，我們應該提及 [ARM TrustZone](https://www.arm.com/technologies/trustzone-for-cortex-a)，
它針對智能手機、平板電腦和智能電視等嵌入式設備進行了優化，
以及 [AWS Nitro Enclaves](https://aws.amazon.com/ec2/nitro/nitro-enclaves/)，
它們只在 [Amazon Web Services](https://aws.amazon.com/) 上可用，
並且與 Intel 和 AMD 的基於 CPU 的解決方案相比，具有不同的威脅模型。

<!--
[IBM Secure Execution for Linux](https://www.ibm.com/docs/en/linux-on-systems?topic=virtualization-secure-execution)
lets you run your Kubernetes cluster's nodes as KVM guests within a trusted execution environment on
IBM Z series hardware. You can use this hardware-enhanced virtual machine isolation to
provide strong isolation between tenants in a cluster, with hardware attestation about the (virtual) node's integrity.
-->
[IBM Secure Execution for Linux](https://www.ibm.com/docs/en/linux-on-systems?topic=virtualization-secure-execution)
允許你在 IBM Z 系列硬件的可信執行環境內以 KVM 客戶端的形式運行 Kubernetes 叢集的節點。
你可以使用這種硬件增強的虛擬機隔離機制爲叢集中的租戶之間提供穩固的隔離，
並通過硬件驗證提供關於（虛擬）節點完整性的資訊。

<!--
### Security properties and feature set

In the following sections, we will review the security properties and additional features
these new technologies bring to the table. Only some solutions will provide all properties;
we will discuss each technology in further detail in their respective section.
-->
### 安全屬性和特性功能  {#security-properties-and-feature-set}

下文將回顧這些新技術所帶來的安全屬性和額外功能。
只有部分解決方案會提供所有屬性；我們將在各自的小節中更詳細地討論每項技術。

<!--
The **Confidentiality** property ensures that information cannot be viewed while it is
in use in the TEE. This provides us with the highly desired feature to secure
**data in use**. Depending on the specific TEE used, both code and data may be protected
from outside viewers. The differences in TEE architectures and how their use
in a cloud native context are important considerations when designing end-to-end security
for sensitive workloads with a minimal **Trusted Computing Base** (TCB) in mind. CCC has recently
worked on a [common vocabulary and supporting material](https://confidentialcomputing.io/wp-content/uploads/sites/85/2023/01/Common-Terminology-for-Confidential-Computing.pdf)
that helps to explain where confidentiality boundaries are drawn with the different TEE
architectures and how that impacts the TCB size.
-->
**機密性**屬性確保在使用 TEE 時資訊無法被查看。這爲我們提供了非常需要的的功能以保護**使用中的資料**。
根據使用的特定 TEE，代碼和資料都可能受到外部查看者的保護。
TEE 架構的差異以及它們在雲原生環境中的使用是在設計端到端安全性時的重要考慮因素，
目的是爲敏感工作負載提供最小的**可信計算基礎**（Trusted Computing Base, 簡稱 TCB）。
CCC 最近致力於**通用術語和支持材料**，以幫助解釋在不同的 TEE 架構下機密性邊界的劃分，
以及這如何影響 TCB 的大小。

<!--
Confidentiality is a great feature, but an attacker can still manipulate
or inject arbitrary code and data for the TEE to execute and, therefore, easily leak critical
information. **Integrity** guarantees a TEE owner that neither code nor data can be
tampered with while running critical computations.
-->
機密性是一個很好的特性，但攻擊者仍然可以操縱或注入任意代碼和資料供 TEE 執行，
因此，很容易泄露關鍵資訊。**完整性**保證 TEE 擁有者在運行關鍵計算時，代碼和資料都不能被篡改。

<!--
**Availability** is a basic property often discussed in the context of information
security. However, this property is outside the scope of most TEEs. Usually, they can be controlled
(shut down, restarted, …) by some higher level abstraction. This could be the CPU itself, the
hypervisor, or the kernel. This is to preserve the overall system's availability,
not the TEE itself. When running in the cloud, availability is usually guaranteed by
the cloud provider in terms of Service Level Agreements (SLAs) and is not cryptographically enforceable.
-->
**可用性**是在資訊安全背景下經常討論的一項基本屬性。然而，這一屬性超出了大多數 TEE 的範圍。
通常，它們可以被一些更高級別的抽象控制（關閉、重啓...）。這可以是 CPU 本身、虛擬機監視器或內核。
這是爲了保持整個系統的可用性，而不是 TEE 本身。在雲環境中運行時，
可用性通常由雲提供商以服務級別協議（Service Level Agreements，簡稱 SLAs）的形式保證，
並且不能通過加密強制執行。

<!--
Confidentiality and Integrity by themselves are only helpful in some cases. For example,
consider a TEE running in a remote cloud. How would you know the TEE is genuine and running
your intended software? It could be an imposter stealing your data as soon as you send it over.
This fundamental problem is addressed by **Attestability**. Attestation allows us to verify
the identity, confidentiality, and integrity of TEEs based on cryptographic certificates issued
from the hardware itself. This feature can also be made available to clients outside of the
confidential computing hardware in the form of remote attestation.
-->
僅憑機密性和完整性在某些情況下是有幫助的。例如，考慮一個在遠程雲中運行的 TEE。
你如何知道 TEE 是真實的並且正在運行你預期的軟體？一旦你發送資料，
它可能是一個冒名頂替者竊取你的資料。這個根本問題通過**可驗證性**得到解決。
驗證允許我們基於硬件本身簽發的加密證書來驗證 TEE 的身份、機密性和完整性。
這個功能也可以以遠程驗證的形式提供給機密計算硬件之外的客戶端使用。

<!--
TEEs can hold and process information that predates or outlives the trusted environment. That
could mean across restarts, different versions, or platform migrations. Therefore **Recoverability**
is an important feature. Data and the state of a TEE need to be sealed before they are written
to persistent storage to maintain confidentiality and integrity guarantees. The access to such
sealed data needs to be well-defined. In most cases, the unsealing is bound to a TEE's identity.
Hence, making sure the recovery can only happen in the same confidential context.
-->
TEEs 可以保存和處理早於或超出可信環境存在時間的資訊。這可能意味着重啓、跨不同版本或平臺遷移的資訊。
因此，**可恢復性**是一個重要的特性。在將資料和 TEE 的狀態寫入持久性儲存之前，需要對它們進行封裝，
以維護保證機密性和完整性。對這種封裝資料的訪問需要明確定義。在大多數情況下，
解封過程與 TEE 綁定的身份有關。因此，確保恢復只能在相同的機密環境中進行。

<!--
This does not have to limit the flexibility of the overall system.
[AMD SEV-SNP's migration agent (MA)](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
allows users to migrate a confidential virtual machine to a different host system
while keeping the security properties of the TEE intact.
-->
這不必限制整個系統的靈活性。
[AMD SEV-SNP 的遷移代理 (MA)](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
允許使用者將機密虛擬機遷移到不同的主機系統，同時保持 TEE 的安全屬性不變。

<!--
## Feature comparison

These sections of the article will dive a little bit deeper into the specific implementations,
compare supported features and analyze their security properties.
-->
## 功能比較  {#feature-comparison}

本文的這部分將更深入地探討具體的實現，比較支持的功能並分析它們的安全屬性。

<!--
### AMD SEV

AMD's [Secure Encrypted Virtualization (SEV)](https://developer.amd.com/sev/) technologies
are a set of features to enhance the security of virtual machines on AMD's server CPUs. SEV
transparently encrypts the memory of each VM with a unique key. SEV can also calculate a
signature of the memory contents, which can be sent to the VM's owner as an attestation that
the initial guest memory was not manipulated.
-->
### AMD SEV  {#amd-sev}

AMD 的[安全加密虛擬化 (SEV)](https://developer.amd.com/sev/)技術是一組功能，
用於增強 AMD 伺服器 CPU 上虛擬機的安全性。SEV 透明地用唯一密鑰加密每個 VM 的內存。
SEV 還可以計算內存內容的簽名，該簽名可以作爲證明初始客戶機內存沒有被篡改的依據發送給 VM 的所有者。

<!--
The second generation of SEV, known as
[Encrypted State](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/white-papers/Protecting-VM-Register-State-with-SEV-ES.pdf)
or SEV-ES, provides additional protection from the hypervisor by encrypting all
CPU register contents when a context switch occurs.
-->
SEV 的第二代，稱爲[加密狀態](https://www.amd.com/content/dam/amd/en/documents/epyc-business-docs/white-papers/Protecting-VM-Register-State-with-SEV-ES.pdf)
或 SEV-ES，通過在發生上下文切換時加密所有 CPU 寄存器內容，提供了對虛擬機管理程式的額外保護。

<!--
The third generation of SEV,
[Secure Nested Paging](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
or SEV-SNP, is designed to prevent software-based integrity attacks and reduce the risk associated with
compromised memory integrity. The basic principle of SEV-SNP integrity is that if a VM can read
a private (encrypted) memory page, it must always read the value it last wrote.

Additionally, by allowing the guest to obtain remote attestation statements dynamically,
SNP enhances the remote attestation capabilities of SEV.
-->
SEV 的第三代，[安全嵌套分頁](https://www.amd.com/system/files/TechDocs/SEV-SNP-strengthening-vm-isolation-with-integrity-protection-and-more.pdf)
或 SEV-SNP，旨在防止基於軟體的完整性攻擊並降低受損內存完整性相關的風險。
SEV-SNP 完整性的基本原則是，如果虛擬機可以讀取私有（加密）內存頁，
那麼它必須始終讀取它最後寫入的值。

此外，通過允許客戶端動態獲取遠程驗證聲明，SNP 增強了 SEV 的遠程驗證能力。

<!--
AMD SEV has been implemented incrementally. New features and improvements have been added with
each new CPU generation. The Linux community makes these features available as part of the KVM hypervisor
and for host and guest kernels. The first SEV features were discussed and implemented in 2016 - see
[AMD x86 Memory Encryption Technologies](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/kaplan)
from the 2016 Usenix Security Symposium. The latest big addition was
[SEV-SNP guest support in Linux 5.19](https://www.phoronix.com/news/AMD-SEV-SNP-Arrives-Linux-5.19).

[Confidential VMs based on AMD SEV-SNP](https://azure.microsoft.com/en-us/updates/azureconfidentialvm/)
are available in Microsoft Azure since July 2022. Similarly, Google Cloud Platform (GCP) offers
[confidential VMs based on AMD SEV-ES](https://cloud.google.com/compute/confidential-vm/docs/about-cvm).
-->
AMD SEV 是以增量方式實施的。每個新的 CPU 代都增加了新功能和改進。
Linux 社區將這些功能作爲 KVM 虛擬機管理程式的一部分提供，適用於主機和客戶機內核。
第一批 SEV 功能在 2016 年被討論並實施 - 參見 2016 年 Usenix 安全研討會的 
[AMD x86 內存加密技術](https://www.usenix.org/conference/usenixsecurity16/technical-sessions/presentation/kaplan)。
最新的重大補充是 [Linux 5.19 中的 SEV-SNP 客戶端支持](https://cloud.google.com/compute/confidential-vm/docs/about-cvm)。

自 2022 年 7 月以來，Microsoft Azure 提供基於 
[AMD SEV-SNP 的機密虛擬機](https://azure.microsoft.com/en-us/updates/azureconfidentialvm/)。
類似地，Google Cloud Platform (GCP) 提供基於 
[AMD SEV-ES 的機密虛擬機](https://cloud.google.com/compute/confidential-vm/docs/about-cvm)。

<!--
### Intel SGX

Intel's
[Software Guard Extensions](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
has been available since 2015 and were introduced with the Skylake architecture.
-->
### Intel SGX  {#intel-sgx}

Intel 的[軟體防護擴展](https://www.intel.com/content/www/us/en/developer/tools/software-guard-extensions/overview.html)
自 2015 年起便已推出，並在 Skylake 架構中首次亮相。

<!--
SGX is an instruction set that enables users to create a protected and isolated process called
an *enclave*. It provides a reverse sandbox that protects enclaves from the operating system,
firmware, and any other privileged execution context.
-->
SGX 是一套指令集，它使使用者能夠創建一個叫做 *Enclave* 的受保護且隔離的進程。
它提供了一個反沙箱機制，保護 Enclave 不受操作系統、固件以及任何其他特權執行上下文的影響。

<!--
The enclave memory cannot be read or written from outside the enclave, regardless of
the current privilege level and CPU mode. The only way to call an enclave function is
through a new instruction that performs several protection checks. Its memory is encrypted.
Tapping the memory or connecting the DRAM modules to another system will yield only encrypted
data. The memory encryption key randomly changes every power cycle. The key is stored
within the CPU and is not accessible.
-->
Enclave 內存無法從 Enclave 外部讀取或寫入，無論當前的權限級別和 CPU 模式如何。
調用 Enclave 功能的唯一方式是通過一條執行多個保護檢查的新指令。Enclave 的內存是加密的。
竊聽內存或將 DRAM 模塊連接到另一個系統只會得到加密資料。內存加密密鑰在每次上電週期時隨機更改。
密鑰儲存在 CPU 內部，無法訪問。

<!--
Since the enclaves are process isolated, the operating system's libraries are not usable as is;
therefore, SGX enclave SDKs are required to compile programs for SGX. This also implies applications
need to be designed and implemented to consider the trusted/untrusted isolation boundaries.
On the other hand, applications get built with very minimal TCB.
-->
由於 Enclave 是進程隔離的，操作系統的庫不能直接使用；
因此，需要 SGX Enclave SDK 來編譯針對 SGX 的程式。
這也意味着應用程式需要在設計和實現時考慮受信任/不受信任的隔離邊界。
另一方面，應用程式的構建具有非常小的 TCB。

<!--
An emerging approach to easily transition to process-based confidential computing
and avoid the need to build custom applications is to utilize library OSes. These OSes
facilitate running native, unmodified Linux applications inside SGX enclaves.
A library OS intercepts all application requests to the host OS and processes them securely
without the application knowing it's running a TEE.
-->
一種新興的方法，利用庫操作系統（library OSes）來輕鬆過渡到基於進程的機密計算並避免需要構建自定義應用程式。
這些操作系統有助於在 SGX 安全 Enclave 內運行原生的、未經修改的 Linux 應用程式。
操作系統庫會攔截應用對宿主機操作系統的所有請求，並在應用不知情的情況下安全地處理它們，
而應用實際上是在一個受信執行環境（TEE）中運行。

<!--
The 3rd generation Xeon CPUs (aka Ice Lake Server - "ICX") and later generations did switch to using a technology called
[Total Memory Encryption - Multi-Key](https://www.intel.com/content/www/us/en/developer/articles/news/runtime-encryption-of-memory-with-intel-tme-mk.html)
(TME-MK) that uses AES-XTS, moving away from the
[Memory Encryption Engine](https://eprint.iacr.org/2016/204.pdf)
that the consumer and Xeon E CPUs used. This increased the possible
[enclave page cache](https://sgx101.gitbook.io/sgx101/sgx-bootstrap/enclave#enclave-page-cache-epc)
(EPC) size (up to 512GB/CPU) and improved performance. More info
about SGX on multi-socket platforms can be found in the
[Whitepaper](https://www.intel.com/content/dam/www/public/us/en/documents/white-papers/supporting-intel-sgx-on-mulit-socket-platforms.pdf).
-->
第三代 Xeon 處理器（又稱爲 Ice Lake 伺服器 - "ICX"）及其後續版本採用了一種名爲
[全內存加密 - 多密鑰](https://www.intel.com/content/www/us/en/developer/articles/news/runtime-encryption-of-memory-with-intel-tme-mk.html)（TME-MK）的技術，
該技術使用 AES-XTS，從消費者和 Xeon E 處理器使用的[內存加密引擎](https://eprint.iacr.org/2016/204.pdf)中脫離出來。
這可能增加了 [Enclave 頁面緩存](https://sgx101.gitbook.io/sgx101/sgx-bootstrap/enclave#enclave-page-cache-epc)
（EPC）大小（每個 CPU 高達 512 GB）並提高了性能。關於多插槽平臺上的 SGX 的更多資訊可以在
[白皮書](https://www.intel.com/content/dam/www/public/us/en/documents/white-papers/supporting-intel-sgx-on-mulit-socket-platforms.pdf)中找到。

<!--
A [list of supported platforms](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873)
is available from Intel.

SGX is available on
[Azure](https://azure.microsoft.com/de-de/updates/intel-sgx-based-confidential-computing-vms-now-available-on-azure-dedicated-hosts/),
[Alibaba Cloud](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-an-sgx-encrypted-computing-environment),
[IBM](https://cloud.ibm.com/docs/bare-metal?topic=bare-metal-bm-server-provision-sgx), and many more.
-->
可以從 Intel 獲取[支持的平臺列表](https://ark.intel.com/content/www/us/en/ark/search/featurefilter.html?productType=873)。

SGX 在 [Azure](https://azure.microsoft.com/de-de/updates/intel-sgx-based-confidential-computing-vms-now-available-on-azure-dedicated-hosts/)、
[阿里雲](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-an-sgx-encrypted-computing-environment)、
[IBM](https://cloud.ibm.com/docs/bare-metal?topic=bare-metal-bm-server-provision-sgx) 以及更多平臺上可用。

<!--
### Intel TDX

Where Intel SGX aims to protect the context of a single process,
[Intel's Trusted Domain Extensions](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)
protect a full virtual machine and are, therefore, most closely comparable to AMD SEV.
-->
### Intel TDX  {#intel-tdx}

Intel SGX 旨在保護單個進程的上下文，而
[Intel 的可信域擴展](https://www.intel.com/content/www/us/en/developer/articles/technical/intel-trust-domain-extensions.html)保護整個虛擬機，
因此，它與 AMD SEV 最爲相似。

<!--
As with SEV-SNP, guest support for TDX was [merged in Linux Kernel 5.19](https://www.phoronix.com/news/Intel-TDX-For-Linux-5.19).
However, hardware support will land with [Sapphire Rapids](https://en.wikipedia.org/wiki/Sapphire_Rapids) during 2023:
[Alibaba Cloud provides](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-a-tdx-confidential-computing-environment)
invitational preview instances, and
[Azure has announced](https://techcommunity.microsoft.com/t5/azure-confidential-computing/preview-introducing-dcesv5-and-ecesv5-series-confidential-vms/ba-p/3800718)
its TDX preview opportunity.
-->
與 SEV-SNP 一樣，對 TDX 的客戶端支持已經在
[Linux Kernel 5.19版本中合併](https://www.phoronix.com/news/Intel-TDX-For-Linux-5.19)。
然而，硬件支持將在 2023 年與 [Sapphire Rapids](https://en.wikipedia.org/wiki/Sapphire_Rapids) 一同發佈：
[阿里雲提供](https://www.alibabacloud.com/help/en/elastic-compute-service/latest/build-a-tdx-confidential-computing-environment)
邀請預覽實例，同時，[Azure 已經宣佈](https://techcommunity.microsoft.com/t5/azure-confidential-computing/preview-introducing-dcesv5-and-ecesv5-series-confidential-vms/ba-p/3800718)
其 TDX 預覽機會。

<!--
## Overhead analysis

The benefits that Confidential Computing technologies provide via strong isolation and enhanced
security to customer data and workloads are not for free. Quantifying this impact is challenging and
depends on many factors: The TEE technology, the benchmark, the metrics, and the type of workload
all have a huge impact on the expected performance overhead.
-->
## 開銷分析  {#overhead-analysis}

通過強隔離和增強的安全性，機密計算技術爲客戶資料和工作負載提供的好處並非免費。
量化這種影響是具有挑戰性的，並且取決於許多因素：TEE 技術，基準測試，
度量標準以及工作負載的類型都對預期的性能開銷有巨大的影響。

<!--
Intel SGX-based TEEs are hard to benchmark, as [shown](https://arxiv.org/pdf/2205.06415.pdf)
[by](https://www.ibr.cs.tu-bs.de/users/mahhouk/papers/eurosec2021.pdf)
[different papers](https://dl.acm.org/doi/fullHtml/10.1145/3533737.3535098). The chosen SDK/library
OS, the application itself, as well as the resource requirements (especially large memory requirements)
have a huge impact on performance. A single-digit percentage overhead can be expected if an application
is well suited to run inside an enclave.
-->
基於 Intel SGX 的 TEE 很難進行基準測試，
正如[不同的論文](https://dl.acm.org/doi/fullHtml/10.1145/3533737.3535098)所
[展示](https://arxiv.org/pdf/2205.06415.pdf)的[一樣](https://www.ibr.cs.tu-bs.de/users/mahhouk/papers/eurosec2021.pdf)。
所選擇的 SDK/操作系統庫，應用程式本身以及資源需求（特別是大內存需求）對性能有巨大的影響。
如果應用程式非常適合在 Enclave 內運行，那麼通常可以預期會有一個個位數的百分比的開銷。

<!--
Confidential virtual machines based on AMD SEV-SNP require no changes to the executed program
and operating system and are a lot easier to benchmark. A
[benchmark from Azure and AMD](https://community.amd.com/t5/business/microsoft-azure-confidential-computing-powered-by-3rd-gen-epyc/ba-p/497796)
shows that SEV-SNP VM overhead is <10%, sometimes as low as 2%.
-->
基於 AMD SEV-SNP 的機密虛擬機不需要對執行的程式和操作系統進行任何更改，
因此更容易進行基準測試。一個來自 
[Azure 和 AMD 的基準測試](https://community.amd.com/t5/business/microsoft-azure-confidential-computing-powered-by-3rd-gen-epyc/ba-p/497796)顯示，
SEV-SNP VM 的開銷 < 10%，有時甚至低至 2%。

<!--
Although there is a performance overhead, it should be low enough to enable real-world workloads
to run in these protected environments and improve the security and privacy of our data.
-->
儘管存在性能開銷，但它應該足夠低，以便使真實世界的工作負載能夠在這些受保護的環境中運行，
並提高我們資料的安全性和隱私性。

<!--
## Confidential Computing compared to FHE, ZKP, and MPC

Fully Homomorphic Encryption (FHE), Zero Knowledge Proof/Protocol (ZKP), and Multi-Party
Computations (MPC) are all a form of encryption or cryptographic protocols that offer
similar security guarantees to Confidential Computing but do not require hardware support.
-->
## 機密計算與 FHE、ZKP 和 MPC 的比較  {#confidential-computing-compared-to-fhe-zkp-and-mpc}

全同態加密（FHE），零知識證明/協議（ZKP）和多方計算（MPC）都是加密或密碼學協議的形式，
提供與機密計算類似的安全保證，但不需要硬件支持。

<!--
Fully (also partially and somewhat) homomorphic encryption allows one to perform
computations, such as addition or multiplication, on encrypted data. This provides
the property of encryption in use but does not provide integrity protection or attestation
like confidential computing does. Therefore, these two technologies can [complement to each other](https://confidentialcomputing.io/2023/03/29/confidential-computing-and-homomorphic-encryption/).
-->
全同態加密（也包括部分和有限同態加密）允許在加密資料上執行計算，例如加法或乘法。
這提供了在使用中加密的屬性，但不像機密計算那樣提供完整性保護或認證。因此，這兩種技術可以
[互爲補充](https://confidentialcomputing.io/2023/03/29/confidential-computing-and-homomorphic-encryption/)。

<!--
Zero Knowledge Proofs or Protocols are a privacy-preserving technique (PPT) that
allows one party to prove facts about their data without revealing anything else about
the data. ZKP can be used instead of or in addition to Confidential Computing to protect
the privacy of the involved parties and their data. Similarly, Multi-Party Computation
enables multiple parties to work together on a computation, i.e., each party provides
their data to the result without leaking it to any other parties.
-->
零知識證明或協議是一種隱私保護技術（PPT），它允許一方證明其資料的事實而不泄露關於資料的任何其他資訊。
ZKP 可以替代或與機密計算一起使用，以保護相關方及其資料的隱私。同樣，
多方計算使多個參與方能夠共同進行計算，即每個參與方提供其資料以得出結果，
但不會泄露給任何其他參與方。

<!--
## Use cases of Confidential Computing

The presented Confidential Computing platforms show that both the isolation of a single container
process and, therefore, minimization of the trusted computing base and the isolation of a
``
full virtual machine are possible. This has already enabled a lot of interesting and secure
projects to emerge:
-->
## 機密計算的應用場景  {#use-cases-of-confidential-computing}

前面介紹的機密計算平臺表明，既可以實現單個容器進程的隔離，從而最小化可信計算單元，
也可以實現整個虛擬機的隔離。這已經促使很多有趣且安全的項目湧現：

<!--
### Confidential Containers

[Confidential Containers](https://github.com/confidential-containers) (CoCo) is a
CNCF sandbox project that isolates Kubernetes pods inside of confidential virtual machines.
-->
### 機密容器  {#confidential-containers}

機密容器 (CoCo) 是一個 CNCF 沙箱項目，它在機密虛擬機內隔離 Kubernetes Pod。

<!--
CoCo can be installed on a Kubernetes cluster with an operator.
The operator will create a set of runtime classes that can be used to deploy
pods inside an enclave on several different platforms, including
AMD SEV, Intel TDX, Secure Execution for IBM Z, and Intel SGX.
-->
CoCo 可以通過 operator 安裝在 Kubernetes 叢集上。operator 將創建一組運行時類，
這些類可以用於在多個不同的平臺上的 Enclave 內部署 Pod，
包括 AMD SEV，Intel TDX，IBM Z 的安全執行和 Intel SGX。

<!--
CoCo is typically used with signed and/or encrypted container images
which are pulled, verified, and decrypted inside the enclave.
Secrets, such as image decryption keys, are conditionally provisioned
to the enclave by a trusted Key Broker Service that validates the
hardware evidence of the TEE prior to releasing any sensitive information.
-->
CoCo 通常與簽名和/或加密的容器映像檔一起使用，這些映像檔在 Enclave 內部被拉取、驗證和解密。
密鑰資訊，比如映像檔解密密鑰，經由受信任的 Key Broker 服務有條件地提供給 Enclave，
這個服務在釋放任何敏感資訊之前驗證 TEE 的硬件認證。

<!--
CoCo has several deployment models. Since the Kubernetes control plane
is outside the TCB, CoCo is suitable for managed environments. CoCo can
be run in virtual environments that don't support nesting with the help of an
API adaptor that starts pod VMs in the cloud. CoCo can also be run on
bare metal, providing strong isolation even in multi-tenant environments.
-->
CoCo 有幾種部署模型。由於 Kubernetes 控制平面在 TCB 之外，因此 CoCo 適合於受管理的環境。
在不支持嵌套的虛擬環境中，CoCo 可以藉助 API 適配器運行，該適配器在雲中啓動 Pod VM。
CoCo 還可以在裸機上運行，在多租戶環境中提供強大的隔離。

<!--
### Managed confidential Kubernetes

[Azure](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-node-pool-aks) and
[GCP](https://cloud.google.com/blog/products/identity-security/announcing-general-availability-of-confidential-gke-nodes)
both support the use of confidential virtual machines as worker nodes for their managed Kubernetes offerings.
-->
### 受管理的機密 Kubernetes  {#managed-confidential-kubernetes} 

[Azure](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-node-pool-aks)
和 [GCP](https://cloud.google.com/blog/products/identity-security/announcing-general-availability-of-confidential-gke-nodes)
都支持將機密虛擬機用作其受管理的 Kubernetes 的工作節點。

<!--
Both services aim for better workload protection and security guarantees by enabling memory encryption
for container workloads. However, they don't seek to fully isolate the cluster or workloads against
the service provider or infrastructure. Specifically, they don't offer a dedicated confidential control
plane or expose attestation capabilities for the confidential cluster/nodes.
-->
這兩項服務通過啓用容器工作負載的內存加密，旨在提供更好的工作負載保護和安全保證。
然而，它們並沒有尋求完全隔離叢集或工作負載以防止服務提供者或基礎設施的訪問。
具體來說，它們不提供專用的機密控制平面，也不爲機密叢集/節點提供可驗證的能力。

<!--
Azure also enables
[Confidential Containers](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-nodes-aks-overview)
in their managed Kubernetes offering. They support the creation based on
[Intel SGX enclaves](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-containers-enclaves)
and [AMD SEV-based VMs](https://techcommunity.microsoft.com/t5/azure-confidential-computing/microsoft-introduces-preview-of-confidential-containers-on-azure/ba-p/3410394).
-->
Azure 在其託管的 Kubernetes 服務中也啓用了
[機密容器](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-nodes-aks-overview)。
他們支持基於 [Intel SGX Enclave](https://learn.microsoft.com/en-us/azure/confidential-computing/confidential-containers-enclaves)
和基於 [AMD SEV 虛擬機](https://techcommunity.microsoft.com/t5/azure-confidential-computing/microsoft-introduces-preview-of-confidential-containers-on-azure/ba-p/3410394)
創建的機密容器。

<!--
### Constellation

[Constellation](https://github.com/edgelesssys/constellation) is a Kubernetes engine that aims to
provide the best possible data security. Constellation wraps your entire Kubernetes cluster into
a single confidential context that is shielded from the underlying cloud infrastructure. Everything
inside is always encrypted, including at runtime in memory. It shields both the worker and control
plane nodes. In addition, it already integrates with popular CNCF software such as Cilium for
secure networking and provides extended CSI drivers to write data securely.
-->
### Constellation  {#constellation}

[Constellation](https://github.com/edgelesssys/constellation) 
是一個旨在提供最佳資料安全的 Kubernetes 引擎。
Constellation 將整個 Kubernetes 叢集包裝到一個機密上下文中，使其免受底層雲基礎設施的影響。
其中的所有內容始終是加密的，包括在內存中的運行時資料。它保護工作節點和控制平面節點。
此外，它已經與流行的 CNCF 軟體（如 Cilium，用於安全網路）集成，
並提供擴展的 CSI 動程式來安全地寫入資料。

<!--
### Occlum and Gramine

[Occlum](https://occlum.io/) and [Gramine](https://gramineproject.io/) are examples of open source
library OS projects that can be used to run unmodified applications in SGX enclaves. They
are member projects under the CCC, but similar projects and products maintained by companies
also exist. With these libOS projects, existing containerized applications can be
easily converted into confidential computing enabled containers. Many curated prebuilt
containers are also available.
-->
### Occlum 和 Gramine  {#occlum-and-gramine}

[Occlum](https://occlum.io/) 和 [Gramine](https://gramineproject.io/)
是兩個開源的操作系統庫項目，它們允許在 SGX 信任執行環境（Enclave）中運行未經修改的應用程式。
它們是 CCC（Confidential Computing Consortium）下的成員項目，
但也存在由公司維護的類似項目和產品。通過使用這些操作系統庫項目，
現有的容器化應用可以輕鬆轉換爲支持機密計算的容器。還有許多經過篩選的預構建容器可供使用。

<!--
## Where are we today? Vendors, limitations, and FOSS landscape

As we hope you have seen from the previous sections, Confidential Computing is a powerful new concept
to improve security, but we are still in the (early) adoption phase. New products are
starting to emerge to take advantage of the unique properties.
-->
## 我們現在處於哪個階段？供應商、侷限性和開源軟體生態  {#where-are-we-today-vendors-limitations-and-foss-landscape}

正如我們希望你從前面的章節中看到的，機密計算是一種強大的新概念，
用於提高安全性，但我們仍處於（早期）階段。新產品開始湧現，以利用這些獨特的屬性。

<!--
Google and Microsoft are the first major cloud providers to have confidential offerings that
can run unmodified applications inside a protected boundary.
Still, these offerings are limited to compute, while end-to-end solutions for confidential
databases, cluster networking, and load balancers have to be self-managed.
-->
谷歌和微軟是首批能夠讓客戶在一個受保護的環境內運行未經修改的應用程式的機密計算服務的主要雲提供商。
然而，這些服務僅限於計算，而對於機密資料庫、叢集網路和負載均衡器的端到端解決方案則需要自行管理。

<!--
These technologies provide opportunities to bring even the most
sensitive workloads into the cloud and enables them to leverage all the
tools in the CNCF landscape.
-->
這些技術爲極其敏感的工作負載部署到雲中提供了可能，並使其能夠充分利用 CNCF 領域中的各種工具。

<!--
## Call to action

If you are currently working on a high-security product that struggles to run in the
public cloud due to legal requirements or are looking to bring the privacy and security
of your cloud-native project to the next level: Reach out to all the great projects
we have highlighted! Everyone is keen to improve the security of our ecosystem, and you can
play a vital role in that journey.
-->
## 號召行動  {#call-to-action}

如果你目前正在開發一個高安全性的產品，但由於法律要求在公共雲上運行面臨困難，
或者你希望提升你的雲原生項目的隱私和安全性：請聯繫我們強調的所有出色項目！
每個人都渴望提高我們生態系統的安全性，而你可以在這個過程中扮演至關重要的角色。

<!--
* [Confidential Containers](https://github.com/confidential-containers)
* [Constellation: Always Encrypted Kubernetes](https://github.com/edgelesssys/constellation)
* [Occlum](https://occlum.io/)
* [Gramine](https://gramineproject.io/)
* CCC also maintains a [list of projects](https://confidentialcomputing.io/projects/)
-->
* [機密容器](https://github.com/confidential-containers)
* [Constellation：始終加密的 Kubernetes](https://github.com/edgelesssys/constellation)
* [Occlum](https://occlum.io/)
* [Gramine](https://gramineproject.io/)
* CCC 還維護了一個[項目列表](https://confidentialcomputing.io/projects/)
