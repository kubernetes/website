---
title: "Безпека"
weight: 85
description: >
  Концепції для забезпечення безпеки ваших хмарних робочих навантажень.
simple_list: true
---

Цей розділ документації Kubernetes призначений, щоб допомогти вам дізнатись, як запускати робочі навантаження безпечніше, а також про основні аспекти забезпечення безпеки кластера Kubernetes.

Kubernetes базується на архітектурі, орієнтованій на хмару, та використовує поради від {{< glossary_tooltip text="CNCF" term_id="cncf" >}} щодо найкращих практик з безпеки інформації в хмарних середовищах.

Для отримання загального контексту щодо того, як забезпечити безпеку вашого кластера та застосунків, які ви на ньому запускаєте, прочитайте [Безпека хмарних середовищ та Kubernetes](/docs/concepts/security/cloud-native-security/).

## Механізми безпеки Kubernetes {#security-mechanisms}

Kubernetes включає кілька API та елементів керування безпекою, а також способи визначення [політик](#policies), які можуть бути частиною вашого управління інформаційною безпекою.

### Захист панелі управління {#control-plane-protection}

Ключовий механізм безпеки для будь-якого кластера Kubernetes — це [контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access).

Kubernetes очікує, що ви налаштуєте та використовуватимете TLS для забезпечення [шифрування даних під час їх руху](/docs/tasks/tls/managing-tls-in-a-cluster/) у межах панелі управління та між панеллю управління та її клієнтами. Ви також можете активувати [шифрування в стані спокою](/docs/tasks/administer-cluster/encrypt-data/) для даних, збережених у панелі управління Kubernetes; це відокремлено від використання шифрування в стані спокою для даних ваших власних робочих навантажень, що також може бути хорошою ідеєю.

### Secrets

API [Secret](/docs/concepts/configuration/secret/) надає базовий захист для конфіденційних значень конфігурації.

### Захист робочого навантаження {#workload-protection}

Забезпечуйте дотримання [стандартів безпеки Pod](/docs/concepts/security/pod-security-standards/), щоб переконатися, що Pod та їх контейнери ізольовані належним чином. Ви також можете використовувати [RuntimeClasses](/docs/concepts/containers/runtime-class), щоб визначити власну ізоляцію, якщо це потрібно.

[Мережеві політики](/docs/concepts/services-networking/network-policies/) дозволяють вам контролювати мережевий трафік між Podʼами, або між Podʼами та мережею поза вашим кластером.

Ви можете розгортати компоненти керування безпекою з ширшої екосистеми для впровадження компонентів для запобігання або виявлення небезпеки навколо Pod, їх контейнерів та образів, що запускаються у них.

### Керування допуском {#admission-control}

[Контролери допуску](/docs/reference/access-authn-authz/admission-controllers/) є втулками, які перехоплюють запити Kubernetes API та можуть їх перевіряти чи модифікувати за наявності певних полів в запиті. Продумане проєктування цих контролерів допомагає уникнути ненавмисних збоїв, оскільки API Kubernetes змінюються з оновленнями версій. Щодо міркувань з проєктування див. [Рекомендації щодо використання вебхуків допуску](/docs/concepts/cluster-administration/admission-webhooks-good-practices/).

### Аудит {#auditing}

[Audit logging Kubernetes](/docs/tasks/debug/debug-cluster/audit/) забезпечує безпековий, хронологічний набір записів, що документують послідовність дій в кластері. Кластер перевіряє дії, породжені користувачами, застосунками, які використовують API Kubernetes, та самою панеллю управління.

## Безпека хмарних провайдерів {#cloud-provider-security}

{{% thirdparty-content vendor="true" %}}

Якщо ви запускаєте кластер Kubernetes на власному обладнанні або в іншого хмарного провайдера, зверніться до вашої документації для ознайомлення з найкращими практиками безпеки. Ось посилання на документацію з безпеки деяких популярних хмарних провайдерів:

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

Ви можете визначати політики безпеки за допомогою механізмів, вбудованих у Kubernetes, таких як [NetworkPolicy](/docs/concepts/services-networking/network-policies/) (декларативний контроль над фільтрацією мережевих пакетів) або [ValidatingAdmissionPolicy](/docs/reference/access-authn-authz/validating-admission-policy/) (декларативні обмеження на те, які зміни може вносити кожен за допомогою API Kubernetes).

Однак ви також можете покладатися на реалізації політик з ширшої екосистеми навколо Kubernetes. Kubernetes надає механізми розширення, щоб ці проєкти екосистеми могли впроваджувати власні елементи керування політиками щодо перегляду вихідного коду, затвердження контейнерних образів, контролю доступу до API, мережевого звʼязку та інших аспектів.

Для отримання додаткової інформації про механізми політики та Kubernetes, читайте [Політики](/docs/concepts/policy/).

## {{% heading "whatsnext" %}}

Дізнайтеся про повʼязані теми безпеки Kubernetes:

* [Захист вашого кластера](/docs/tasks/administer-cluster/securing-a-cluster/)
* [Відомі уразливості](/docs/reference/issues-security/official-cve-feed/) в Kubernetes (та посилання на додаткову інформацію)
* [Шифрування даних під час їх обміну](/docs/tasks/tls/managing-tls-in-a-cluster/) для панелі управління
* [Шифрування даних в спокої](/docs/tasks/administer-cluster/encrypt-data/)
* [Контроль доступу до API Kubernetes](/docs/concepts/security/controlling-access)
* [Мережеві політики](/docs/concepts/services-networking/network-policies/) для Pods
* [Secret в Kubernetes](/docs/concepts/configuration/secret/)
* [Стандарти безпеки Pod](/docs/concepts/security/pod-security-standards/)
* [RuntimeClasses](/docs/concepts/containers/runtime-class)

Дізнайтеся контекст:

<!-- якщо змінюєте це, також змініть початкові дані у фронт-маттері content/en/docs/concepts/security/cloud-native-security.md, щоб вони відповідали; перевірте налаштування no_list -->
* [Безпека хмарних середовищ та Kubernetes](/docs/concepts/security/cloud-native-security/)

Отримайте сертифікацію:

* [Спеціаліст з безпеки Kubernetes](https://training.linuxfoundation.org/certification/certified-kubernetes-security-specialist/) сертифікація та офіційний навчальний курс.

Докладніше в цьому розділі:
