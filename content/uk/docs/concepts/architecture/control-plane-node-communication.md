---
title: Звʼязок між Вузлами та Панеллю управління
content_type: concept
weight: 20
aliases:
- master-node-communication
---

<!-- overview -->

Цей документ описує шляхи звʼязку між {{< glossary_tooltip term_id="kube-apiserver" text="API-сервером" >}} та {{< glossary_tooltip text="кластером" term_id="cluster" length="all" >}} Kubernetes. Мета — надати користувачам можливість налаштувати їхнє встановлення для зміцнення конфігурації мережі так, щоб кластер можна було запускати в ненадійній мережі (або на повністю публічних IP-адресах у хмарному середовищі).

<!-- body -->

## Звʼязок Вузла з Панеллю управління {#node-to-control-plane}

У Kubernetes існує шаблон API "hub-and-spoke". Всі використання API вузлів (або Podʼів, які вони виконують) завершуються на API-сервері. Інші компоненти панелі управління не призначені для експонування віддалених служб. API-сервер налаштований для прослуховування віддалених підключень на захищеному порту HTTPS (зазвичай 443) з однією або декількома формами [автентифікації клієнта](/docs/reference/access-authn-authz/authentication/). Рекомендується включити одну чи кілька форм [авторизації](/docs/reference/access-authn-authz/authorization/), особливо якщо [анонімні запити](/docs/reference/access-authn-authz/authentication/#anonymous-requests) або [токени службового облікового запису](/docs/reference/access-authn-authz/authentication/#service-account-tokens) дозволені.

Вузли повинні бути забезпечені загальним кореневим {{< glossary_tooltip text="сертифікатом" term_id="certificate" >}} для кластера, щоб вони могли безпечно підключатися до API-сервера разом з дійсними обліковими даними клієнта. Добрим підходом є те, що облікові дані клієнта, які надаються kubelet, мають форму сертифіката клієнта. Див. [завантаження TLS kubelet](/docs/reference/access-authn-authz/kubelet-tls-bootstrapping/) для автоматичного забезпечення облікових даних клієнта kubelet.

{{< glossary_tooltip text="Podʼи" term_id="pod" >}}, які бажають підʼєднатися до API-сервера, можуть це зробити безпечно, використовуючи службовий обліковий запис (service account), так що Kubernetes автоматично вставлятиме загальний кореневий сертифікат та дійсний токен власника у Pod, коли він буде ініціалізований. Служба `kubernetes` (в просторі імен `default`) налаштована з віртуальною IP-адресою, яка перенаправляється (через `{{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}`) на точку доступу HTTPS на API-сервері.

Компоненти панелі управління також взаємодіють з API-сервером через захищений порт.

В результаті, типовий режим роботи для зʼєднань від вузлів та Podʼів, що працюють на
вузлах, до панелі управління є захищеним і може працювати через ненадійні та/або публічні мережі.

## Звʼязок Панелі управління з Вузлом {#control-plane-to-node}

Існують два основних шляхи звʼязку панелі управління (API-сервера) з вузлами. Перший — від API-сервера до процесу {{< glossary_tooltip text="kubelet" term_id="kubelet" >}}, який працює на кожному вузлі в кластері. Другий — від API-сервера до будь-якого вузла, Podʼа чи Service через _проксі_ API-сервера.

### Звʼязок API-сервер з kubelet {#api-server-to-kubelet}

Зʼєднання від API-сервера до kubelet використовуються для:

* Отримання логів для Podʼів.
* Приєднання (зазвичай через `kubectl`) до запущених Podʼів.
* Забезпечення функціональності перенаправлення портів kubelet.

Ці зʼєднання завершуються на точці доступу HTTPS kubelet. Стандартно API-сервер не
перевіряє сертифікат обслуговування kubelet, що робить зʼєднання вразливими до атаки "особа-посередині" і **небезпечними** для використання через ненадійні та/або публічні мережі.

Щоб перевірити це зʼєднання, використовуйте прапорець `--kubelet-certificate-authority`, щоб надати API серверу пакет кореневих сертифікатів для перевірки сертифіката обслуговування kubelet.

Якщо це неможливо, скористайтеся [тунелюванням SSH](#ssh-tunnels) між API-сервером та kubelet, якщо необхідно, щоб уникнути підключення через ненадійну або публічну мережу.

Нарешті, [автентифікацію та/або авторизацію Kubelet](/docs/reference/access-authn-authz/kubelet-authn-authz/) потрібно ввімкнути, щоб захистити API kubelet.

### Звʼязок API-сервера з вузлами, Podʼам та Service {#api-server-to-nodes-pods-and-services}

Зʼєднання від API-сервера до вузла, Podʼа чи Service типово використовують прості HTTP-зʼєднання і, отже, не автентифікуються або не шифруються. Їх можна використовувати через захищене зʼєднання HTTPS, підставивши `https:` перед назвою вузла, Podʼа чи Service в URL API, але вони не будуть перевіряти сертифікат, наданий точкою доступу HTTPS, та не надаватимуть облікові дані клієнта. Таким чином, хоча зʼєднання буде зашифрованим, воно не гарантує цілісності. Ці зʼєднання **поки не є безпечними** для використання через ненадійні або публічні мережі.

### Тунелі SSH {#ssh-tunnels}

Kubernetes підтримує [тунелі SSH](https://www.ssh.com/academy/ssh/tunneling), щоб захистити канали звʼязку від панелі управління до вузлів. У цій конфігурації API-сервер ініціює тунель SSH до кожного вузла в кластері (підключаючись до SSH-сервера, який прослуховує порт 22) і передає весь трафік, призначений для kubelet, вузла, Podʼа чи Service через тунель. Цей тунель гарантує, що трафік не виходить за межі мережі, в якій працюють вузли.

{{< note >}}
Тунелі SSH наразі застарілі, тому ви не повинні вибирати їх для використання, якщо не знаєте, що робите. Служба [Konnectivity](#konnectivity-service) — це заміна для цього каналу звʼязку.
{{< /note >}}

### Служба Konnectivity {#konnectivity-service}

{{< feature-state for_k8s_version="v1.18" state="beta" >}}

Як заміна тунелям SSH, служба Konnectivity надає проксі на рівні TCP для звʼязку панелі управління з кластером. Служба Konnectivity складається з двох частин: сервера Konnectivity в мережі панелі управління та агентів Konnectivity в мережі вузлів. Агенти Konnectivity ініціюють зʼєднання з сервером Konnectivity та утримують мережеві підключення. Після ввімкнення служби Konnectivity весь трафік від панелі управління до вузлів прокладається через ці зʼєднання.

Для налаштування служби Konnectivity у своєму кластері ознайомтесь із завданням [служби Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/).

## {{% heading "whatsnext" %}}

* Дізнайтеся більше про [компоненти панелі управління Kubernetes](/docs/concepts/architecture/#control-plane-components)
* Дізнайтеся більше про [модель "Hubs and Spoke"](https://book.kubebuilder.io/multiversion-tutorial/conversion-concepts.html#hubs-spokes-and-other-wheel-metaphors)
* Дізнайтеся, як [захистити кластер](/docs/tasks/administer-cluster/securing-a-cluster/)
* Дізнайтеся більше про [API Kubernetes](/docs/concepts/overview/kubernetes-api/)
* [Налаштуйте службу Konnectivity](/docs/tasks/extend-kubernetes/setup-konnectivity/)
* [Використовуйте перенаправлення портів для доступу до застосунку у кластері](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/)
* Дізнайтеся, як [отримати логи для Podʼів](/docs/tasks/debug/debug-application/debug-running-pod/#examine-pod-logs), [використовуйте kubectl port-forward](/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod)
