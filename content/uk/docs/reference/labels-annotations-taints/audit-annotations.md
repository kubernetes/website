---
title: "Анотації аудиту"
weight: 10
---

<!-- overview -->

Ця сторінка — довідник з анотацій аудиту простору імен kubernetes.io. Ці анотації застосовуються до обʼєктів `Event` з API-групи `audit.k8s.io`.

{{< note >}}
Наведені нижче анотації не використовуються в API Kubernetes. Коли ви [вмикаєте аудит](/docs/tasks/debug/debug-cluster/audit/) у своєму кластері, дані подій аудиту записуються за допомогою `Event` з API-групи `audit.k8s.io`. Ці анотації застосовуються до подій аудиту. Події аудиту відрізняються від обʼєктів у [API подій](/docs/reference/kubernetes-api/cluster-resources/event-v1/) (API-група `events.k8s.io`).
{{< /note >}}

<!-- body -->

## k8s.io/deprecated

Приклад: `k8s.io/deprecated: "true"`

Значення **повинно** бути "true" або "false". Значення "true" вказує на те, що запит використовував застарілу версію API.

## k8s.io/removed-release

Приклад: `k8s.io/removed-release: "1.22"`

Значення **повинно** бути у форматі "\<MAJOR>\.\<MINOR>\". Встановлюється для запитів до застарілих версій API, для яких визначено цільовий випуск видалення, і містить цей випуск.

## pod-security.kubernetes.io/exempt

Приклад: `pod-security.kubernetes.io/exempt: namespace`

Значення **повинно** бути одним із `user`, `namespace` або `runtimeClass`, що відповідає вимірам [винятків Pod Security](/docs/concepts/security/pod-security-admission/#exemptions). Ця анотація вказує, на якому вимірі ґрунтувався виняток із застосування PodSecurity.

## pod-security.kubernetes.io/enforce-policy

Приклад: `pod-security.kubernetes.io/enforce-policy: restricted:latest`

Значення **повинно** бути `privileged:<version>`, `baseline:<version>`,
`restricted:<version>`, що відповідає рівням [стандартів безпеки Podʼів](/docs/concepts/security/pod-security-standards), супроводжуваних версією, яка **повинна** бути `latest` або дійсною версією Kubernetes у форматі `v<MAJOR>.<MINOR>`. Ця анотація надає інформацію про рівень застосування, який дозволив або відхилив Pod під час допуску PodSecurity.

Див. [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) для отримання додаткової інформації.

## pod-security.kubernetes.io/audit-violations

Приклад:  `pod-security.kubernetes.io/audit-violations: would violate
PodSecurity "restricted:latest": allowPrivilegeEscalation != false (container "example" must set securityContext.allowPrivilegeEscalation=false), ...`

Значення описує порушення політики, виявлене аудитом: воно містить рівень [стандартів безпеки Podʼів](/docs/concepts/security/pod-security-standards/), який було порушено, а також конкретні політики для полів, що порушують вимоги PodSecurity.

Див. [Стандарти безпеки Podʼів](/docs/concepts/security/pod-security-standards/) для отримання додаткової інформації.

## audit.k8s.io/truncated

Приклад: `audit.k8s.io/truncated: "true"`

Значення завжди "true". Ця анотація вказує на те, що подія аудиту була скорочена через те, що розмір події перевищив налаштований максимум. Скорочення типово вимкнено, і його потрібно явно увімкнути через прапорці API-сервера.

Див. [Аудит](/docs/tasks/debug/debug-cluster/audit/) для отримання додаткової інформації.

## apiserver.latency.k8s.io/etcd

Приклад: `apiserver.latency.k8s.io/etcd: "4.730661757s"`

Ця анотація вказує на міру затримки, що виникає на рівні зберігання, вона враховує час, необхідний для надсилання даних до etcd і отримання повної відповіді назад.

Значення цієї анотації аудиту не включає час, витрачений на допуск або перевірку.

## apiserver.latency.k8s.io/decode-response-object

Приклад: `apiserver.latency.k8s.io/decode-response-object: "450.6649ns"`

Ця анотація записує час, необхідний для декодування відповіді, отриманої від рівня зберігання (etcd)

## apiserver.latency.k8s.io/apf-queue-wait

Приклад: `apiserver.latency.k8s.io/apf-queue-wait: "100ns"`

Ця анотація записує час, який запит провів у черзі через пріоритети API-сервера.

Дивіться [API Priority and Fairness](/docs/concepts/cluster-administration/flow-control/) (APF) для отримання додаткової інформації про цей механізм.

## authorization.k8s.io/decision

Приклад: `authorization.k8s.io/decision: "forbid"`

Значення має бути **forbid** або **allow**. Ця анотація вказує на те, чи було дозволено запит у логах аудиту Kubernetes.

Див. [Аудит](/docs/tasks/debug/debug-cluster/audit/) для отримання додаткової інформації.

## authorization.k8s.io/reason

Приклад: `authorization.k8s.io/reason: "Human-readable reason for the decision"`

Ця анотація вказує причину для [рішення](#authorization-k8s-io-decision) в логах аудиту Kubernetes.

Див. [Аудит](/docs/tasks/debug/debug-cluster/audit/) для отримання додаткової інформації.

## missing-san.invalid-cert.kubernetes.io/$hostname

Приклад: `missing-san.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "relies on a legacy Common Name field instead of the SAN extension for subject validation"`

Використовується у Kubernetes версії v1.24 і новіших.

Ця анотація вказує, що вебхук або агрегований API-сервер використовує недійсний сертифікат, у якого відсутні `subjectAltNames`. Підтримку цих сертифікатів типово вимкнено в Kubernetes 1.19 та видалено в Kubernetes 1.23.

Запити до точок доступу, які використовують ці сертифікати, будуть невдалими. Сервіси, які використовують ці сертифікати, повинні замінити їх якомога швидше, щоб уникнути порушень у середовищах Kubernetes 1.23+.

Додаткову інформацію можна знайти в документації Go: [Застарілість CommonName у X.509](https://go.dev/doc/go1.15#commonname).

## insecure-sha1.invalid-cert.kubernetes.io/$hostname

Приклад: `insecure-sha1.invalid-cert.kubernetes.io/example-svc.example-namespace.svc: "uses an insecure SHA-1 signature"`

Використовується у Kubernetes версії v1.24 і новіших.

Ця анотація вказує, що вебхук або агрегований API-сервер використовує небезпечний сертифікат, підписаний хешем SHA-1. Підтримку цих небезпечних сертифікатів типово вимкнено в Kubernetes 1.24 та буде видалена в майбутніх версіях.

Сервіси, які використовують ці сертифікати, повинні замінити їх якнайшвидше, щоб забезпечити належну безпеку зʼєднань та уникнути порушень у майбутніх випусках.

Додаткову інформацію можна знайти в документації Go: [Відхилення сертифікатів SHA-1](https://go.dev/doc/go1.18#sha1).

## validation.policy.admission.k8s.io/validation_failure

Приклад: `validation.policy.admission.k8s.io/validation_failure: '[{"message": "Invalid value", {"policy": "policy.example.com", {"binding": "policybinding.example.com", {"expressionIndex": "1", {"validationActions": ["Audit"]}]'`

Використовується у Kubernetes версії v1.27 і новіших.

Ця анотація вказує, що перевірка політики допуску повернула false для запиту API або що перевірка призвела до помилки, коли політика була налаштована з `failurePolicy: Fail`.

Значення анотації є обʼєктом JSON. `message` у JSON надає повідомлення про невдачу перевірки.

`policy`, `binding` і `expressionIndex` в JSON ідентифікують імʼя `ValidatingAdmissionPolicy`, імʼя `ValidatingAdmissionPolicyBinding` та індекс у політиці `validations` виразів CEL, перевірка яких не вдалася, відповідно.

`validationActions` показують, які дії були вжиті для цієї невдачі перевірки. Див. [Правила перевірки допуску](/docs/reference/access-authn-authz/validating-admission-policy/) для отримання додаткових відомостей щодо `validationActions`.
