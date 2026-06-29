---
title: Початок роботи
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Навчальне середовище
  - anchor: "#production-environment"
    title: Операційне середовище
---

<!-- overview -->

У цьому розділі перераховані різні способи налаштування та запуску Kubernetes. Коли ви встановлюєте Kubernetes, виберіть тип встановлення на основі: простоти обслуговування, захищеності, контролю, доступних ресурсів та досвіду, необхідного для роботи та управління кластером.

Ви можете [завантажити Kubernetes](/releases/download/) для розгортання кластера Kubernetes на локальному компʼютері, у хмарі або у власному дата-центрі.

Деякі [компоненти Kubernetes](/docs/concepts/overview/components/), такі як {{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} або {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}}, також можуть бути розгорнуті у вигляді [образів контейнерів](/releases/download/#container-images) всередині кластера.

**Рекомендується** запускати компоненти Kubernetes у вигляді образів контейнерів, де це можливо, та дозволити Kubernetes керувати цими компонентами. Компоненти, які запускають контейнери, зокрема kubelet, не можуть бути включені до цієї категорії.

Якщо ви не хочете самостійно керувати кластером Kubernetes, ви можете вибрати керований сервіс, включаючи [сертифіковані платформи](/docs/setup/production-environment/turnkey-solutions/). Існують також інші стандартизовані та спеціалізовані рішення для широкого спектру хмарних та фізичних середовищ.

<!-- body -->

## Навчальне середовище {#learning-environment}

Якщо ви вивчаєте Kubernetes, використовуйте інструменти, які підтримуються спільнотою Kubernetes або входять до сімейства проєктів Kubernetes для розгортання кластера на локальному компʼютері. Див. [Навчальне середовище](/docs/setup/learning-environment/)

## Операційне середовище {#production-environment}

При оцінці рішення для [операційного середовища](/docs/setup/production-environment/), враховуйте, якими з аспектів керування кластером Kubernetes (або *абстракцій*) ви хочете керувати самостійно, а які — доручити провайдеру.

Для кластера, яким ви керуєте самостійно, офіційно підтримуваним інструментом для розгортання Kubernetes є [kubeadm](/docs/setup/production-environment/tools/kubeadm/).

## {{% heading "whatsnext" %}}

- [Завантаження Kubernetes](/releases/download/)
- Завантажте та [встановіть інструменти](/docs/tasks/tools/) включаючи `kubectl`
- Оберіть [середовище виконання контейнерів](/docs/setup/production-environment/container-runtimes/) для кластера Kubernetes
- Ознайомтесь з [найкращими практиками](/docs/setup/best-practices/) розгортання Kubernetes

Kubernetes створено так, щоб його {{< glossary_tooltip term_id="control-plane" text="панель управління" >}} працювала на Linux. У вашому кластері ви можете запускати застосунки на Linux чи іншій операційній системі, включаючи Windows.

- Дізнайтеся як [розгорнути кластер з вузлами Windows](/docs/concepts/windows/)
