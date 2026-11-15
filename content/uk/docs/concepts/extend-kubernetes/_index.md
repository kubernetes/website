---
title: Розширення можливостей Kubernetes
weight: 999 # this section should come last
description: Різні способи зміни поведінки вашого кластера Kubernetes.
feature:
  title: Створений для розширення
  description: >
    Додавайте можливості до свого кластера Kubernetes без зміни вихідного коду основного проєкту.
content_type: concept
no_list: true
---

<!-- overview -->

Kubernetes добре налаштовується та розширюється. Тому потреба робити форк або надсилати патчі до коду проєкту Kubernetes виникає рідко.

У цьому посібнику описано варіанти налаштування кластера Kubernetes. Він призначений для {{< glossary_tooltip text="операторів кластера" term_id="cluster-operator" >}}, які хочуть зрозуміти, як адаптувати свій кластер Kubernetes до потреб робочого середовища. Розробникам, які є потенційними {{< glossary_tooltip text="розробниками платформ" term_id="platform-developer" >}} чи {{< glossary_tooltip text="учасниками" term_id="contributor" >}} проєкту Kubernetes, він також буде корисним як вступ до наявних точок і шаблонів розширення, а також їхніх компромісів та обмежень.

Підходи до налаштування можна загалом поділити на [конфігурацію](#configuration), яка передбачає лише зміну аргументів командного рядка, локальних файлів конфігурації або ресурсів API, та [розширення](#extensions), які передбачають запуск додаткових програм, додаткових мережевих сервісів або й того, й іншого. Цей документ присвячено переважно _розширенням_.

<!-- body -->

## Конфігурація {#configuration}

*Файли конфігурації* та *аргументи командного рядка* описано в розділі [Довідник](/docs/reference/) онлайн-документації, де для кожного бінарного файлу є окрема сторінка:

* [`kube-apiserver`](/docs/reference/command-line-tools-reference/kube-apiserver/)
* [`kube-controller-manager`](/docs/reference/command-line-tools-reference/kube-controller-manager/)
* [`kube-scheduler`](/docs/reference/command-line-tools-reference/kube-scheduler/)
* [`kubelet`](/docs/reference/command-line-tools-reference/kubelet/)
* [`kube-proxy`](/docs/reference/command-line-tools-reference/kube-proxy/)

Аргументи командного рядка та файли конфігурації не завжди можна змінити в сервісі Kubernetes, що надається провайдером, або в дистрибутиві з керованою інсталяцією. Коли їх можна змінювати, це зазвичай може робити лише оператор кластера. Крім того, вони можуть змінитися в майбутніх версіях Kubernetes, а їх налаштування може потребувати перезапуску процесів. З цих причин їх слід використовувати лише тоді, коли немає інших варіантів.

Вбудовані *API політик*, такі як [ResourceQuota](/docs/concepts/policy/resource-quotas/), [NetworkPolicy](/docs/concepts/services-networking/network-policies/) та керування доступом на основі ролей ([RBAC](/docs/reference/access-authn-authz/rbac/)), є вбудованими API Kubernetes, які надають декларативно налаштовувані параметри політик. Ці API зазвичай доступні навіть у сервісах Kubernetes, що надаються провайдером, та в керованих інсталяціях Kubernetes. Вбудовані API політик дотримуються тих самих домовленостей, що й інші ресурси Kubernetes, такі як Podʼи. Коли ви використовуєте [стабільний](/docs/reference/using-api/#api-versioning) API політик, ви отримуєте переваги [визначеної політики підтримки](/docs/reference/using-api/deprecation-policy/), як і для інших API Kubernetes. З цих причин, де це доречно, рекомендується використовувати API політик, а не *файли конфігурації* та *аргументи командного рядка*.

## Розширення {#extensions}

Розширення — це програмні компоненти, які розширюють Kubernetes і глибоко з ним інтегруються. Вони адаптують його для підтримки нових типів ресурсів і нових видів обладнання.

Багато адміністраторів кластерів використовують екземпляри Kubernetes, що надаються провайдером, або встановлені з дистрибутива. У таких кластерах розширення вже попередньо встановлено. Тому більшості користувачів Kubernetes не потрібно встановлювати розширення, і ще меншій кількості потрібно створювати нові.

### Шаблони розширень {#extension-patterns}

Kubernetes спроєктовано для автоматизації шляхом написання клієнтських програм. Будь-яка програма, яка читає та/або записує дані в API Kubernetes, може забезпечувати корисну автоматизацію. *Автоматизація* може працювати як у кластері, так і поза ним. Дотримуючись настанов із цього документа, ви зможете писати високодоступну та надійну автоматизацію. Автоматизація зазвичай працює з будь-яким кластером Kubernetes, зокрема з кластерами, що надаються провайдером, і керованими інсталяціями.

Існує особливий шаблон написання клієнтських програм, які добре працюють із Kubernetes, відомий як шаблон {{< glossary_tooltip term_id="controller" text="контролера" >}}. Контролери зазвичай читають `.spec` обʼєкта, можливо, виконують певні дії, а потім оновлюють `.status` обʼєкта.

Контролер є клієнтом API Kubernetes. Коли Kubernetes є клієнтом і звертається до віддаленого сервісу, Kubernetes називає це *вебхуком*. Віддалений сервіс називається *бекендом вебхука*. Як і власні контролери, вебхуки додають точку відмови.

{{< note >}}
Поза Kubernetes термін «вебхук» зазвичай означає механізм асинхронних сповіщень, де виклик вебхука є одностороннім сповіщенням іншій системі чи компоненту. В екосистемі Kubernetes «вебхуками» часто називають навіть синхронні HTTP-виклики.
{{< /note >}}

У моделі вебхуків Kubernetes надсилає мережевий запит до віддаленого сервісу. В альтернативній моделі *бінарних втулків* Kubernetes виконує бінарний файл (програму). Бінарні втулки використовуються в kubelet (наприклад, [втулки сховища CSI](https://kubernetes-csi.github.io/docs/) та [мережеві втулки CNI](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)), а також у kubectl (дивіться [Розширення kubectl за допомогою втулків](/docs/tasks/extend-kubectl/kubectl-plugins/)).

### Точки розширення {#extension-points}

На цій діаграмі показано точки розширення в кластері Kubernetes та клієнти, які до нього звертаються.

<!-- image source: https://docs.google.com/drawings/d/1k2YdJgNTtNfW7_A8moIIkij-DmVgEhNrn3y2OODwqQQ/view -->

{{< figure src="/docs/concepts/extend-kubernetes/extension-points.png" alt="Символічне представлення семи пронумерованих точок розширення для Kubernetes." class="diagram-large" caption="Точки розширення Kubernetes" >}}

#### Пояснення до діаграми {#key-to-the-figure}

1. Користувачі часто взаємодіють з API Kubernetes через `kubectl`. [Втулки](#client-extensions) налаштовують поведінку клієнтів. Існують загальні розширення, які можна застосовувати до різних клієнтів, а також спеціальні способи розширення `kubectl`.

1. API-сервер обробляє всі запити. Кілька типів точок розширення в API-сервері дозволяють автентифікувати запити або блокувати їх на основі вмісту, редагувати вміст та обробляти видалення. Про це йдеться в розділі [Розширення доступу до API](#api-access-extensions).

1. API-сервер обслуговує різні види *ресурсів*. *Вбудовані види ресурсів*, такі як `pods`, визначені проєктом Kubernetes і не можуть бути змінені. Про розширення API Kubernetes читайте в розділі [Розширення API](#api-extensions).

1. Планувальник Kubernetes [вирішує](/docs/concepts/scheduling-eviction/assign-pod-node/), на яких вузлах розмістити Podʼи. Існує кілька способів розширити планування, вони описані в розділі [Розширення планувальника](#scheduling-extensions).

1. Значну частину поведінки Kubernetes реалізовано програмами, які називаються {{< glossary_tooltip term_id="controller" text="контролерами" >}} і є клієнтами API-сервера. Контролери часто використовуються разом із власними ресурсами. Докладніше читайте в розділах [Поєднання нових API з автоматизацією](#combining-new-apis-with-automation) та [Зміна вбудованих ресурсів](#changing-built-in-resources).

1. kubelet працює на серверах (вузлах) і допомагає Podʼам виглядати як віртуальні сервери з власними IP-адресами в мережі кластера. [Мережеві втулки](#network-plugins) дозволяють різні реалізації мережі Podʼів.

1. Ви можете використовувати [втулки пристроїв](#device-plugins), щоб інтегрувати власне обладнання або інші спеціальні локальні можливості вузла і зробити їх доступними для Podʼів, що працюють у вашому кластері. kubelet містить підтримку роботи з втулками пристроїв.

   kubelet також монтує та демонтує {{< glossary_tooltip text="томи" term_id="volume" >}} для Podʼів та їхніх контейнерів. Ви можете використовувати [втулки сховища](#storage-plugins), щоб додати підтримку нових видів сховища та інших типів томів.

#### Блок-схема вибору точки розширення {#extension-flowchart}

Якщо ви не впевнені, з чого почати, вам може допомогти ця блок-схема. Зауважте, що деякі рішення можуть включати кілька типів розширень.

<!-- image source for flowchart: https://docs.google.com/drawings/d/1sdviU6lDz4BpnzJNHfNpQrqI9F19QZ07KnhnxVrp2yg/edit -->

{{< figure src="/docs/concepts/extend-kubernetes/flowchart.svg" alt="Блок-схема із запитаннями про варіанти використання та настановами для тих, хто реалізує розширення. Зелені кола означають «так», червоні — «ні»." class="diagram-large" caption="Блок-схема для вибору підходу до розширення" >}}

---

## Розширення клієнта {#client-extensions}

Втулки для kubectl — це окремі бінарні файли, які додають або замінюють поведінку певних підкоманд. Інструмент `kubectl` також може інтегруватися з [втулками облікових даних](/docs/reference/access-authn-authz/authentication/#client-go-credential-plugins). Ці розширення впливають лише на локальне середовище окремого користувача, тому не можуть застосовувати політики для всього кластера.

Якщо ви хочете розширити інструмент `kubectl`, прочитайте [Розширення kubectl за допомогою втулків](/docs/tasks/extend-kubectl/kubectl-plugins/).

## Розширення API {#api-extensions}

### Визначення власних ресурсів {#custom-resource-definitions}

Розгляньте можливість додавання _власного ресурсу_ до Kubernetes, якщо ви хочете визначати нові контролери, обʼєкти конфігурації застосунків або інші декларативні API та керувати ними за допомогою інструментів Kubernetes, таких як `kubectl`.

Докладніше про власні ресурси дивіться на сторінці [Власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/).

### Шар агрегації API {#api-aggregation-layer}

Ви можете використовувати [шар агрегації API](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/) Kubernetes, щоб інтегрувати API Kubernetes з додатковими сервісами, такими як [Metrics API](/docs/concepts/cluster-administration/observability/#metrics-api).

### Поєднання нових API з автоматизацією {#combining-new-apis-with-automation}

Поєднання API власного ресурсу та циклу управління називається шаблоном {{< glossary_tooltip term_id="controller" text="контролера" >}}. Якщо ваш контролер заміняє оператора-людину, який розгортає інфраструктуру на основі бажаного стану, то він також може дотримуватися {{< glossary_tooltip text="шаблону Operator" term_id="operator-pattern" >}}. Шаблон Operator використовується для керування конкретними застосунками; зазвичай це застосунки, які зберігають стан і потребують уважного керування.

Ви також можете створювати власні API та цикли управління, які керують іншими ресурсами, такими як сховище, або визначають політики (наприклад, обмеження контролю доступу).

### Зміна вбудованих ресурсів {#changing-built-in-resources}

Коли ви розширюєте API Kubernetes, додаючи власні ресурси, додані ресурси завжди потрапляють до нової групи API. Ви не можете замінити чи змінити наявні групи API. Додавання API не дає прямого впливу на поведінку наявних API (таких як Podʼи), тоді як _розширення доступу до API_ це дозволяють.

## Розширення доступу до API {#api-access-extensions}

Коли запит потрапляє до API-сервера Kubernetes, він спочатку _автентифікується_, потім _авторизується_, а потім проходить різні типи _контролю допуску_ (деякі запити насправді не автентифікуються й обробляються особливим чином). Докладніше про цей процес дивіться в розділі [Керування доступом до API Kubernetes](/docs/concepts/security/controlling-access/).

Кожен крок процесу автентифікації/авторизації в Kubernetes пропонує точки розширення.

### Автентифікація {#authentication}

[Автентифікація](/docs/reference/access-authn-authz/authentication/) зіставляє заголовки або сертифікати в усіх запитах з іменем користувача клієнта, який робить запит.

Kubernetes підтримує кілька вбудованих методів автентифікації. Він також може працювати за проксі-сервером автентифікації та надсилати токен із заголовка `Authorization:` до віддаленого сервісу для перевірки ([вебхук автентифікації](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication)), якщо вбудовані методи вам не підходять.

### Авторизація {#authorization}

[Авторизація](/docs/reference/access-authn-authz/authorization/) визначає, чи можуть певні користувачі читати, записувати та виконувати інші операції з ресурсами API. Вона працює на рівні цілих ресурсів і не розрізняє їх за довільними полями обʼєктів.

Якщо вбудовані варіанти авторизації вам не підходять, [вебхук авторизації](/docs/reference/access-authn-authz/webhook/) дозволяє викликати власний код, який приймає рішення про авторизацію.

### Динамічний контроль допуску {#dynamic-admission-control}

Після авторизації запит, якщо це операція запису, також проходить кроки [контролю допуску](/docs/reference/access-authn-authz/admission-controllers/). На додаток до вбудованих кроків є кілька розширень:

* [Вебхук Image Policy](/docs/reference/access-authn-authz/admission-controllers/#imagepolicywebhook) обмежує, які образи можна запускати в контейнерах.
* Для прийняття довільних рішень щодо контролю допуску можна використовувати загальний [вебхук допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/#admission-webhooks). Вебхуки допуску можуть відхиляти створення або оновлення. Деякі вебхуки допуску змінюють дані вхідного запиту до того, як Kubernetes обробить його далі.

## Розширення інфраструктури {#infrastructure-extensions}

### Втулки пристроїв {#device-plugins}

_Втулки пристроїв_ дозволяють вузлу виявляти нові ресурси вузла (на додаток до вбудованих, таких як cpu та memory) за допомогою [втулка пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/).

### Втулки сховища {#storage-plugins}

Втулки {{< glossary_tooltip text="Container Storage Interface" term_id="csi" >}} (CSI) дають змогу розширити Kubernetes підтримкою нових типів томів. Томи можуть спиратися на надійне зовнішнє сховище, надавати тимчасове сховище або пропонувати інтерфейс лише для читання до інформації, використовуючи парадигму файлової системи.

Kubernetes також містить підтримку втулків [FlexVolume](/docs/concepts/storage/volumes/#flexvolume), які застаріли з Kubernetes v1.23 (на користь CSI).

Втулки FlexVolume дозволяють користувачам монтувати типи томів, які Kubernetes не підтримує нативно. Коли ви запускаєте Pod, який залежить від сховища FlexVolume, kubelet викликає бінарний втулок для монтування тому. Більше подробиць про цей підхід є в архівній [проєктній пропозиції FlexVolume](https://git.k8s.io/design-proposals-archive/storage/flexvolume-deployment.md).

[Kubernetes Volume Plugin FAQ for Storage Vendors](https://github.com/kubernetes/community/blob/main/sig-storage/volume-plugin-faq.md#kubernetes-volume-plugin-faq-for-storage-vendors) містить загальну інформацію про втулки сховища.

### Мережеві втулки {#network-plugins}

Вашому кластеру Kubernetes потрібен _мережевий втулок_, щоб мати робочу мережу Podʼів і підтримувати інші аспекти мережевої моделі Kubernetes.

[Мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/) дозволяють Kubernetes працювати з різними мережевими топологіями та технологіями.

### Втулки kubelet image credential provider {#kubelet-image-credential-provider-plugins}

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Постачальники облікових даних образів kubelet (kubelet image credential providers) — це втулки, які дозволяють kubelet динамічно отримувати облікові дані реєстрів образів. Ці облікові дані потім використовуються під час завантаження образів із реєстрів образів контейнерів, які відповідають конфігурації.

Втулки можуть взаємодіяти із зовнішніми сервісами або використовувати локальні файли для отримання облікових даних. Завдяки цьому kubelet не потребує статичних облікових даних для кожного реєстру й може підтримувати різні методи та протоколи автентифікації.

Подробиці налаштування втулка дивіться на сторінці [Налаштування kubelet image credential provider](/docs/tasks/administer-cluster/kubelet-credential-provider/).

## Розширення планувальника {#scheduling-extensions}

Планувальник — це особливий тип контролера, який стежить за Podʼами та призначає їх вузлам. Стандартний планувальник можна повністю замінити, продовжуючи використовувати інші компоненти Kubernetes, або ж одночасно запускати [кілька планувальників](/docs/tasks/extend-kubernetes/configure-multiple-schedulers/).

Це значне завдання, і майже всі користувачі Kubernetes вважають, що їм не потрібно змінювати планувальник.

Ви можете контролювати, які [втулки планування](/docs/reference/scheduling/config/#scheduling-plugins) активні, або привʼязувати набори втулків до різних іменованих [профілів планувальника](/docs/reference/scheduling/config/#multiple-profiles). Ви також можете написати власний втулок, який інтегрується з однією або кількома [точками розширення](/docs/concepts/scheduling-eviction/scheduling-framework/#extension-points) kube-scheduler.

Нарешті, вбудований компонент `kube-scheduler` підтримує [вебхук](https://git.k8s.io/design-proposals-archive/scheduling/scheduler_extender.md), який дозволяє віддаленому HTTP-бекенду (розширенню планувальника) фільтрувати та/або пріоритизувати вузли, які kube-scheduler обирає для Podʼа.

{{< note >}}
За допомогою вебхука розширення планувальника ви можете впливати лише на фільтрування та пріоритизацію вузлів; інші точки розширення через інтеграцію вебхука недоступні.
{{< /note >}}

## {{% heading "whatsnext" %}} {#whats-next}

* Дізнайтеся більше про розширення інфраструктури
  * [Втулки пристроїв](/docs/concepts/extend-kubernetes/compute-storage-net/device-plugins/)
  * [Мережеві втулки](/docs/concepts/extend-kubernetes/compute-storage-net/network-plugins/)
  * [Втулки сховища](https://kubernetes-csi.github.io/docs/) CSI
* Дізнайтеся про [втулки kubectl](/docs/tasks/extend-kubectl/kubectl-plugins/)
* Дізнайтеся більше про [власні ресурси](/docs/concepts/extend-kubernetes/api-extension/custom-resources/)
* Дізнайтеся більше про [API-сервери розширення](/docs/concepts/extend-kubernetes/api-extension/apiserver-aggregation/)
* Дізнайтеся про [динамічний контроль допуску](/docs/reference/access-authn-authz/extensible-admission-controllers/)
* Дізнайтеся про [шаблон Operator](/docs/concepts/extend-kubernetes/operator/)
