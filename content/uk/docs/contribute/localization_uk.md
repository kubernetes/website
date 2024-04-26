---
title: Рекомендації з перекладу українською мовою
content_type: concept
anchors:
  - anchor: "#правила-перекладу"
    title: Правила перекладу
  - anchor: "#словник"
    title: Словник
---

<!-- overview -->

Дорогі друзі! Раді вітати вас у спільноті українських контриб'юторів проекту Kubernetes. Ця сторінка створена з метою полегшити вашу роботу при перекладі документації. Вона містить правила, якими ми керувалися під час перекладу, і базовий словник, який ми почали укладати. Перелічені у ньому терміни ви знайдете в українській версії документації Kubernetes. Будемо дуже вдячні, якщо ви допоможете нам доповнити цей словник і розширити правила перекладу.

Сподіваємось, наші рекомендації стануть вам у пригоді.



<!-- body -->

## Загальний процес

1. Виберіть одне з [найбільш витребуваних ішьюзів](https://github.com/kubernetes-i18n-ukrainian/website/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+no%3Aassignee+label%3A%22most+wanted%22) або [будь-яке ішью](https://github.com/kubernetes-i18n-ukrainian/website/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc+no%3Aassignee) і залиште в ньому коментар на кшталт "Працюю над цим". Ми надішлемо вам запрошення до організації та закріпимо цей ішьюз за вами.</sup>
2. Зробіть форк [k/website](https://github.com/kubernetes/website).
3. Прочитайте цей документ.
4. Перекладіть
5. Створіть пул-реквест в [k/website](https://github.com/kubernetes/website).

Якщо вам знадобиться допомога, зареєструйтеся в [Slack Kubernetes](https://slack.k8s.io/), приєднайтеся до каналу [`#kubernetes-docs-uk`](https://kubernetes.slack.com/archives/CSKCYN138) і спитайте там.

### Отримання допомоги 
Якщо ви виявили проблеми з перекладеним вмістом, [створіть проблему на k/website](https://github.com/kubernetes/website/issues/new/choose) за допомогою `/language uk`.

[kubernetes-i18n-ukrainian/website](https://github.com/kubernetes-i18n-ukrainian/website) слід використовувати лише для спрощення процесу локалізації.

### Існуючі проблеми/оновлення локалізації

Якщо ви виявили проблеми з перекладеним вмістом і не можете негайно їх виправити, [створіть ішью у k/website](https://github.com/kubernetes/website/issues/new/choose) з описом що не так, на якій сторінці (посилання) і додайте в опис ішью з нового рядка `/language uk`.

[kubernetes-i18n-ukrainian/website](https://github.com/kubernetes-i18n-ukrainian/website) слід використовувати лише для спрощення процесу локалізації.

## Правила перекладу {#правила-перекладу}

* Скопіюйте оригінал і додайте його перед перекладом у якості коментаря. Це потрібно для спрощення відслідковування змін і процесу ревью. Приклади: [для Markdown](https://github.com/kubernetes/website/blob/7774cc9f3582c5f94e40245cdd5855e3c206177e/content/uk/docs/tutorials/hello-minikube.md#L23-L35), [для YAML](https://github.com/kubernetes/website/blob/7774cc9f3582c5f94e40245cdd5855e3c206177e/content/uk/docs/tutorials/hello-minikube.md#L8-L14).

* У випадку, якщо у перекладі термін набуває неоднозначності і розуміння тексту ускладнюється, надайте у дужках англійський варіант, наприклад: кінцеві точки (endpoints). Якщо при перекладі термін втрачає своє значення, краще не перекладати його, наприклад: характеристики affinity.

* Назви об'єктів Kubernetes залишаємо без перекладу і пишемо з великої літери: Service, Pod, Deployment, Volume, Namespace, за винятком терміна node (вузол). Назви об'єктів Kubernetes вважаємо за іменники ч.р. і відмінюємо за допомогою апострофа: Pod'ів, Deployment'ами.
  Для слів, що закінчуються на приголосний, у родовому відмінку однини використовуємо закінчення -а: Pod'а, Deployment'а.
  Слова, що закінчуються на голосний, не відмінюємо: доступ до Service, за допомогою Namespace. У множині використовуємо англійську форму: користуватися Services, спільні Volumes.

* Частовживані і усталені за межами Kubernetes слова перекладаємо українською і пишемо з малої літери (label -> мітка). У випадку, якщо термін для означення об'єкта Kubernetes вживається у своєму загальному значенні поза контекстом Kubernetes (service як службова програма, deployment як розгортання), перекладаємо його і пишемо з малої літери, наприклад: service discovery -> виявлення сервісу, continuous deployment -> безперервне розгортання.

* Складені слова вважаємо за власні назви і не перекладаємо (LabelSelector, kube-apiserver).

* Для перевірки закінчень слів у родовому відмінку однини (-а/-я, -у/-ю) використовуйте [онлайн словник](https://slovnyk.ua/). Якщо слова немає у словнику, визначте його відміну і далі відмінюйте за правилами. Докладніше [дивіться тут](https://pidruchniki.com/1948041951499/dokumentoznavstvo/vidminyuvannya_imennikiv).

## Словник {#словник}

English | Українська |
--- | --- |
addon | розширення |
application | застосунок |
backend | бекенд |
build | збирання (результат) |
build | збирати (процес) |
cache | кеш |
CLI | інтерфейс командного рядка |
cloud | хмара; хмарний провайдер |
containerized | контейнеризований |
continuous deployment | безперервне розгортання |
continuous development | безперервна розробка |
continuous integration | безперервна інтеграція |
contribute | робити внесок (до проекту), допомагати (проекту) |
contributor | контриб'ютор, учасник проекту |
control plane | площина управління |
controller | контролер |
CPU | ЦП |
dashboard | дашборд |
data plane | площина даних |
default (by) | за умовчанням |
default settings | типові налаштування |
Deployment | Deployment |
deprecated | застарілий |
desired state | бажаний стан |
downtime | недоступність, простій |
ecosystem | сімейство проектів (екосистема) |
endpoint | кінцева точка |
expose (a service) | відкрити доступ (до сервісу) |
fail | відмовити |
feature | компонент |
framework | фреймворк |
frontend | фронтенд |
image | образ |
Ingress | Ingress |
instance | інстанс |
issue | запит |
kube-proxy | kube-proxy |
kubelet | kubelet |
Kubernetes features | функціональні можливості Kubernetes |
label | мітка |
lifecycle | життєвий цикл |
logging | логування |
maintenance | обслуговування |
map | спроектувати, зіставити, встановити відповідність |
master | master |
monitor | моніторити |
monitoring | моніторинг |
Namespace | Namespace |
network policy | мережева політика |
node | вузол |
orchestrate | оркеструвати |
output | вивід |
patch | патч |
Pod | Pod |
production | прод |
pull request | pull request |
release | реліз |
replica | репліка |
rollback | відкатування |
rolling update | послідовне оновлення |
rollout (new updates) | викатка (оновлень) |
run | запускати |
scale | масштабувати |
schedule | розподіляти (Pod'и по вузлах) |
Scheduler | Scheduler |
Secret | Secret |
Selector | Селектор |
self-healing | самозцілення |
self-restoring | самовідновлення |
Service | Service (як об'єкт Kubernetes) |
service | сервіс (як службова програма) |
service discovery | виявлення сервісу |
source code | вихідний код |
stateful app | застосунок зі станом |
stateless app | застосунок без стану |
task | завдання |
terminated | зупинений |
traffic | трафік |
VM (virtual machine) | ВМ (віртуальна машина) |
Volume | Volume |
workload | робоче навантаження |
YAML | YAML |


