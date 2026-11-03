---
title: "Безпека"
weight: 85
description: >
  Концепції для захисту ваших робочих навантажень cloud native.
simple_list: true
---

Цей розділ документації Kubernetes допоможе вам навчитися запускати робочі навантаження безпечніше й дізнатися про основні аспекти забезпечення безпеки кластера Kubernetes.

Kubernetes базується на архітектурі cloud native і спирається на поради {{< glossary_tooltip text="CNCF" term_id="cncf" >}} щодо рекомендованих практик інформаційної безпеки cloud native.

Ширший контекст щодо того, як захистити ваш кластер і застосунки, які ви на ньому запускаєте, дивіться в розділі [Безпека cloud native та Kubernetes](/docs/concepts/security/cloud-native-security/).

## Механізми безпеки Kubernetes {#security-mechanisms}

Kubernetes містить кілька API та засобів контролю безпеки, а також способи визначення [політик](#policies), які можуть бути частиною вашого керування інформаційною безпекою.

### Захист панелі управління {#control-plane-protection}

Ключовий механізм безпеки для будь-якого кластера Kubernetes — це [контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access).

Kubernetes очікує, що ви налаштуєте та використовуватимете TLS для [шифрування даних під час передавання](/docs/tasks/tls/managing-tls-in-a-cluster/) в межах панелі управління та між панеллю управління і її клієнтами. Ви також можете ввімкнути [шифрування даних у стані спокою](/docs/tasks/administer-cluster/encrypt-data/) для даних, що зберігаються в панелі управління Kubernetes; це окремо від шифрування в стані спокою для даних ваших власних робочих навантажень, що також може бути доброю ідеєю.

### Secrets

API [Secret](/docs/concepts/configuration/secret/) надає базовий захист для конфіденційних значень конфігурації.

### Захист робочих навантажень {#workload-protection}

Застосовуйте [стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/), щоб Podʼи та їхні контейнери були належно ізольовані. Якщо потрібно, ви також можете використовувати [RuntimeClasses](/docs/concepts/containers/runtime-class) для визначення власної ізоляції.

[Мережеві політики](/docs/concepts/services-networking/network-policies/) дозволяють вам контролювати мережевий трафік між Podʼами або між Podʼами та мережею поза вашим кластером.

Ви можете розгортати засоби безпеки з ширшої екосистеми, щоб реалізувати превентивний або детективний контроль для Podʼів, їхніх контейнерів та образів, що в них працюють.

### Контроль допуску {#admission-control}

[Контролери допуску](/docs/reference/access-authn-authz/admission-controllers/) — це втулки, які перехоплюють запити до API Kubernetes і можуть перевіряти або змінювати їх на основі певних полів запиту. Продумане проєктування цих контролерів допомагає уникнути ненавмисних порушень, коли API Kubernetes змінюється з оновленнями версій. Міркування щодо проєктування дивіться в розділі [Рекомендації щодо використання вебхуків допуску](/docs/concepts/cluster-administration/admission-webhooks-good-practices/).

### Аудит {#auditing}

[Логування аудиту](/docs/tasks/debug/debug-cluster/audit/) Kubernetes забезпечує важливий для безпеки хронологічний набір записів, що документують послідовність дій у кластері. Кластер проводить аудит дій користувачів, застосунків, які використовують API Kubernetes, і самої панелі управління.

## Безпека хмарних провайдерів {#cloud-provider-security}

{{% thirdparty-content vendor="true" %}}

Якщо ви запускаєте кластер Kubernetes на власному обладнанні або в іншого хмарного провайдера, ознайомтеся з рекомендаціями щодо безпеки у вашій документації. Ось посилання на документацію з безпеки деяких популярних хмарних провайдерів:

{{< table caption="Безпека хмарних провайдерів" >}}

IaaS провайдер        | Посилання |
-------------------- | ------------ |
Alibaba Cloud | https://www.alibabacloud.com/trust-center |
Amazon Web Services | https://aws.amazon.com/security |
Google Cloud Platform | https://cloud.google.com/security |
Huawei Cloud | https://www.huaweicloud.com/intl/en-us/securecenter/overallsafety |
IBM Cloud | https://www.ibm.com/cloud/security |
Microsoft Azure | https://docs.microsoft.com/en-us/azure/security/azure-security |
Oracle Cloud Infrastructure | https://www.oracle.com/security |
Tencent Cloud | https://www.tencentcloud.com/solutions/data-security-and-information-protection |
VMware vSphere | https://www.vmware.com/solutions/security/hardening-guides |

{{< /table >}}

## Політики {#policies}

Ви можете визначати політики безпеки за допомогою вбудованих механізмів Kubernetes, таких як [NetworkPolicy](/docs/concepts/services-networking/network-policies/) (декларативний контроль фільтрації мережевих пакетів) або [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (декларативні обмеження на те, які зміни можна вносити через API Kubernetes).

Однак ви також можете покладатися на реалізації політик із ширшої екосистеми навколо Kubernetes. Kubernetes надає механізми розширення, завдяки яким проєкти екосистеми можуть реалізовувати власні засоби контролю політик щодо перевірки вихідного коду, схвалення образів контейнерів, контролю доступу до API, мережі тощо.

Докладніше про механізми політик у Kubernetes читайте в розділі [Політики](/docs/concepts/policy/).

## {{% heading "whatsnext" %}} {#whats-next}

Дізнайтеся про повʼязані теми безпеки Kubernetes:

* [Захист вашого кластера](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Відомі вразливості](/docs/reference/issues-security/official-cve-feed/) у Kubernetes (та посилання на додаткову інформацію)
* [Шифрування даних під час передавання](/docs/tasks/tls/managing-tls-in-a-cluster/) для панелі управління
* [Шифрування даних у стані спокою](/docs/tasks/administer-cluster/encrypt-data/)
* [Контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access)
* [Мережеві політики](/docs/concepts/services-networking/network-policies/) для Podʼів
* [Secrets у Kubernetes](/docs/concepts/configuration/secret/)
* [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

Дізнайтеся про контекст:

<!-- якщо змінюєте це, також змініть front matter у content/en/docs/concepts/security/cloud-native-security.md, щоб вони відповідали; перевірте налаштування no_list -->
* [Безпека cloud native та Kubernetes](/docs/concepts/security/cloud-native-security/)

Отримайте сертифікацію:

* Сертифікація [Certified Kubernetes Security Specialist](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) та офіційний навчальний курс.

Докладніше в цьому розділі:
