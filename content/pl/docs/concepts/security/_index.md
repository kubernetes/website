---
title: "Bezpieczeństwo"
weight: 85
description: >
  Zasady ochrony aplikacji cloud-native.
simple_list: true
---

Ta sekcja dokumentacji Kubernetesa ma na celu pomoc w nauce
bezpiecznego uruchamiania workloadów oraz zapoznanie z
podstawowymi aspektami utrzymania bezpieczeństwa klastra Kubernetes.

Kubernetes opiera się na architekturze cloud-native i korzysta z
porad {{< glossary_tooltip text="CNCF" term_id="cncf" >}}
dotyczących dobrych praktyk w zakresie bezpieczeństwa informacji cloud-native.

Przeczytaj [Cloud Native Security and Kubernetes](/docs/concepts/security/cloud-native-security/),
aby zrozumieć szerszy
kontekst zabezpieczania klastrów i uruchamianych na nich aplikacji.

## Mechanizmy bezpieczeństwa Kubernetesa {#security-mechanisms}

Kubernetes zawiera kilka interfejsów API i mechanizmów bezpieczeństwa, a także sposoby na definiowanie
[polityk (ang. policies)](#policies), które mogą stanowić część tego, jak zarządzasz bezpieczeństwem informacji.

### Ochrona warstwy sterowania {#control-plane-protection}

Kluczowym mechanizmem bezpieczeństwa dla każdego klastra Kubernetes jest
[kontrolowanie dostępu do API Kubernetesa](/docs/concepts/security/controlling-access).

Kubernetes oczekuje, że skonfigurujesz i użyjesz TLS do zapewnienia
[szyfrowania przesyłanych danych](/docs/tasks/tls/managing-tls-in-a-cluster/) w obrębie warstwy
sterowania oraz pomiędzy warstwą sterowania a jej klientami. Możesz także włączyć
[szyfrowanie danych spoczynkowych](/docs/tasks/administer-cluster/encrypt-data/) dla danych
przechowywanych w obrębie warstwy sterowania Kubernetesa; Nie należy mylić tego z
szyfrowaniem danych w stanie spoczynku dla własnych workloadów, co również może być dobrą praktyką.

### Sekrety (ang. Secret) {#secrets}

Obiekt API [Secret](/docs/concepts/configuration/secret/) zapewnia
podstawową ochronę dla wartości konfiguracyjnych, które wymagają poufności.

### Ochrona workloadów {#workload-protection}

Egzekwowanie [standardów bezpieczeństwa poda](/docs/concepts/security/pod-security-standards/)
zapewnia, że Pody i ich kontenery są odpowiednio
izolowane. Możesz również użyć [RuntimeClasses](/docs/concepts/containers/runtime-class)
do zdefiniowania niestandardowej izolacji, jeśli tego potrzebujesz.

[Polityki sieciowe](/docs/concepts/services-networking/network-policies/) pozwalają kontrolować
ruch sieciowy pomiędzy Podami lub pomiędzy Podami a siecią poza klastrem.

Możesz wdrażać mechanizmy zabezpieczeń z szerszego ekosystemu, aby wprowadzać środki
zapobiegawcze lub detekcyjne wokół Podów, ich kontenerów oraz obrazów, które w nich działają.

### Audytowanie {#auditing}

Dziennik audytu Kubernetesa [audit logging](/docs/tasks/debug/debug-cluster/audit/)
dostarcza istotnego z punktu widzenia bezpieczeństwa, chronologicznego zbioru zapisów
dokumentujących sekwencję działań w klastrze. Klastr audytuje aktywności generowane przez
użytkowników, przez aplikacje korzystające z API Kubernetesa oraz przez samą warstwę sterowania.

## Zabezpieczenia dostawcy chmury {#cloud-provider-security}

{{% thirdparty-content vendor="true" %}}

Jeśli uruchamiasz klaster Kubernetes na własnym sprzęcie lub sprzęcie dostawcy
chmury, zapoznaj się z dokumentacją dotyczącą najlepszych praktyk w zakresie
bezpieczeństwa. Oto linki do dokumentacji bezpieczeństwa niektórych popularnych dostawców chmury:

{{< table caption="Zabezpieczenia dostawcy chmury" >}}

Dostawca IaaS        | Link |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/security/hardening-guides |

{{< /table >}}

## Polityki {#policies}

Możesz definiować zasady bezpieczeństwa, używając mechanizmów natywnych dla
Kubernetesa, takich jak [NetworkPolicy](/docs/concepts/services-networking/network-policies/)
(deklaratywna kontrola nad filtrowaniem pakietów sieciowych) lub
[ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (deklaratywne ograniczenia
dotyczące tego, jakie zmiany ktoś może wprowadzać za pomocą API Kubernetesa).

Możesz również polegać na implementacjach polityk z szerszego
ekosystemu wokół Kubernetesa. Kubernetes zapewnia mechanizmy
rozszerzeń, aby umożliwić projektom ekosystemowym wdrażanie
własnych kontroli polityk dotyczących przeglądu kodu źródłowego,
zatwierdzania obrazów kontenerów, kontroli dostępu do API, sieci i innych.

Aby uzyskać więcej informacji na temat mechanizmów polityki i
Kubernetesa, przeczytaj [Polityki](/docs/concepts/policy/).

## {{% heading "whatsnext" %}}

Dowiedz się więcej na temat powiązanych zagadnień bezpieczeństwa Kubernetesa:

* [Zabezpieczanie klastra](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Znane podatności](/docs/reference/issues-security/official-cve-feed/)
  w Kubernetesie (i linki do dalszych informacji)
* [Szyfrowanie danych podczas przesyłania](/docs/tasks/tls/managing-tls-in-a-cluster/) dla warstwy sterowania
* [Szyfrowanie danych w spoczynku](/docs/tasks/administer-cluster/encrypt-data/)
* [Kontrola dostępu do API Kubernetesa](/docs/concepts/security/controlling-access)
* [Zasady sieciowe](/docs/concepts/services-networking/network-policies/) dla Podów
* [Sekrety w Kubernetesie](/docs/concepts/configuration/secret/)
* [Standardy bezpieczeństwa podów](/docs/concepts/security/pod-security-standards/)
* [Klasy środowisk uruchomieniowych](/docs/concepts/containers/runtime-class)

Poznaj kontekst:

<!-- if changing this, also edit the front matter of content/en/docs/concepts/security/cloud-native-security.md to match; check the no_list setting -->
* [Bezpieczeństwo natywne dla chmury i Kubernetesa](/docs/concepts/security/cloud-native-security/)

Zdobądź certyfikat:

* Certyfikacja [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/)
  oraz oficjalny kurs szkoleniowy.

Przeczytaj więcej w tej sekcji:

