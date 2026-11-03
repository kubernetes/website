---
title: Налаштування політик керування ЦП на вузлі
content_type: task
min-kubernetes-server-version: v1.26
weight: 140
---

<!-- overview -->

{{< feature-state for_k8s_version="v1.26" state="stable" >}}

Kubernetes приховує від користувача багато аспектів того, як Podʼи виконуються на вузлах. Це зроблено навмисно. Проте деяким робочим навантаженням для прийнятної роботи потрібні сильніші гарантії щодо затримки та/або продуктивності. Kubelet надає методи для ввімкнення складніших політик розміщення робочих навантажень, зберігаючи абстракцію вільною від явних директив розміщення.

Докладну інформацію про керування ресурсами див. у документації [Керування ресурсами Podʼів та контейнерів](/docs/concepts/configuration/manage-resources-containers).

Докладну інформацію про те, як у kubelet реалізовано керування ресурсами, див. у документації [Менеджери ресурсів вузла](/docs/concepts/policy/node-resource-managers).

## {{% heading "prerequisites" %}} {#before-you-begin}

{{< include "task-tutorial-prereqs.md" >}} {{< version-check >}}

Якщо ви використовуєте старішу версію Kubernetes, перегляньте документацію для версії, яку ви фактично використовуєте.

<!-- steps -->

## Налаштування політик керування CPU {#configuring-cpu-management-policies}

Стандартно kubelet використовує [квоту CFS](https://en.wikipedia.org/wiki/Completely_Fair_Scheduler), щоб застосовувати обмеження CPU для Podʼів. Коли на вузлі працює багато Podʼів, що інтенсивно використовують CPU, робоче навантаження може переміщуватися між ядрами CPU залежно від того, чи обмежується Pod (throttling), і які ядра CPU доступні на момент планування. Багато робочих навантажень не чутливі до такого переміщення й тому нормально працюють без будь-якого втручання.

Проте для робочих навантажень, продуктивність яких суттєво залежить від спорідненості кешу CPU та затримки планування, kubelet дозволяє використовувати альтернативні політики керування CPU, щоб задати певні вподобання щодо розміщення на вузлі.

## Підтримка Windows {#windows-support}

{{< feature-state feature_gate_name="WindowsCPUAndMemoryAffinity" >}}

Підтримку CPU Manager можна увімкнути у Windows за допомогою функціональної можливості `WindowsCPUAndMemoryAffinity`, і для цього потрібна підтримка в середовищі виконання контейнерів. Після ввімкнення функціональної можливості виконайте наведені нижче кроки, щоб налаштувати [політику CPU Manager](#configuration).

## Налаштування {#configuration}

Політика CPU Manager задається прапорцем kubelet `--cpu-manager-policy` або полем `cpuManagerPolicy` у [KubeletConfiguration](/docs/reference/config-api/kubelet-config.v1beta1/). Підтримуються дві політики:

* [`none`](#none-policy): стандартна політика.
* [`static`](#static-policy): дозволяє Podʼам з певними характеристиками ресурсів отримувати посилену спорідненість CPU та ексклюзивність на вузлі.

CPU Manager періодично записує оновлення ресурсів через CRI, щоб узгоджувати призначення CPU в памʼяті з cgroupfs. Частота узгодження задається новим значенням конфігурації kubelet `--cpu-manager-reconcile-period`. Якщо його не вказано, стандартно воно дорівнює значенню `--node-status-update-frequency`.

Поведінку статичної політики можна точно налаштувати за допомогою прапорця `--cpu-manager-policy-options`. Прапорець приймає розділений комами список параметрів політики `key=value`. Якщо ви вимкнете функціональну можливість [`CPUManagerPolicyOptions`](/docs/reference/command-line-tools-reference/feature-gates/#CPUManagerPolicyOptions), то не зможете точно налаштовувати політики CPU Manager. У такому разі CPU Manager працює лише зі своїми стандартними налаштуваннями.

Окрім функціональної можливості верхнього рівня `CPUManagerPolicyOptions`, параметри політики поділено на дві групи: альфа-якості (стандартно приховані) та бета-якості (стандартно видимі). Ці групи захищені відповідно функціональними можливостями `CPUManagerPolicyAlphaOptions` і `CPUManagerPolicyBetaOptions`. На відміну від стандарту Kubernetes, ці функціональні можливості захищають групи параметрів, оскільки додавати функціональну можливість для кожного окремого параметра було б надто громіздко.

## Зміна політики CPU Manager {#changing-the-cpu-manager-policy}

Оскільки політику CPU Manager можна застосувати лише тоді, коли kubelet створює нові Podʼи, проста зміна з "none" на "static" не застосується до наявних Podʼів. Тому, щоб правильно змінити політику CPU Manager на вузлі, виконайте такі кроки:

1. Виконайте [drain](/docs/tasks/administer-cluster/safely-drain-node) вузла.
2. Зупиніть kubelet.
3. Видаліть старий файл стану CPU Manager. Стандартно шлях до цього файлу — `/var/lib/kubelet/cpu_manager_state`. Це очищує стан, який підтримує CPUManager, щоб набори CPU (cpu-sets), налаштовані новою політикою, не конфліктували з ним.
4. Відредагуйте конфігурацію kubelet, щоб змінити політику CPU Manager на потрібне значення.
5. Запустіть kubelet.

Повторіть цей процес для кожного вузла, якому потрібно змінити політику CPU Manager. Якщо пропустити цей процес, kubelet постійно аварійно перезапускатиметься (crashloop) з такою помилкою:

```
could not restore state from checkpoint: configured policy "static" differs from state checkpoint policy "none", please drain this node and delete the CPU manager checkpoint file "/var/lib/kubelet/cpu_manager_state" before restarting Kubelet
```

{{< note >}}
Якщо на вузлі змінюється набір доступних (online) CPU, для вузла потрібно виконати drain і вручну скинути CPU Manager, видаливши файл стану `cpu_manager_state` у кореневій теці kubelet.
{{< /note >}}

### Налаштування політики `none` {#none-policy-configuration}

Ця політика не має додаткових елементів конфігурації.

### Налаштування політики `static` {#static-policy-configuration}

Ця політика керує спільним пулом CPU, який спочатку містить усі CPU вузла. Кількість CPU, які можна виділити ексклюзивно, дорівнює загальній кількості CPU на вузлі мінус будь-які резервування CPU, задані параметрами kubelet `--kube-reserved` або `--system-reserved`. Починаючи з 1.17, список зарезервованих CPU можна явно задати параметром kubelet `--reserved-cpus`. Явний список CPU, заданий `--reserved-cpus`, має пріоритет над резервуванням CPU, заданим `--kube-reserved` і `--system-reserved`. CPU, зарезервовані цими параметрами, беруться в цілій кількості з початкового спільного пулу в порядку зростання фізичного ідентифікатора ядра. Цей спільний пул — це набір CPU, на яких працюють усі контейнери в Podʼах `BestEffort` і `Burstable`. Контейнери в Podʼах `Guaranteed` з дробовими `requests` CPU також працюють на CPU зі спільного пулу. Ексклюзивні CPU призначаються лише контейнерам, які водночас належать до Podʼа `Guaranteed` і мають цілочисельні `requests` CPU.

{{< note >}}
Коли статичну політику ввімкнено, kubelet вимагає резервування CPU, більшого за нуль, за допомогою `--kube-reserved` та/або `--system-reserved` або `--reserved-cpus`. Це тому, що нульове резервування CPU дозволило б спільному пулу стати порожнім.
{{< /note >}}

### Параметри політики static {#cpu-policy-static--options}

Ви можете вмикати й вимикати групи параметрів залежно від їхнього рівня зрілості за допомогою таких функціональних можливостей:

* `CPUManagerPolicyBetaOptions` — стандартно увімкнено. Вимкніть, щоб приховати параметри рівня бета.
* `CPUManagerPolicyAlphaOptions` — стандартно вимкнено. Увімкніть, щоб показати параметри рівня альфа. Вам однаково доведеться ввімкнути кожен параметр за допомогою параметра kubelet `CPUManagerPolicyOptions`.

Для статичної політики `CPUManager` існують такі параметри:

* `full-pcpus-only` (GA, стандартно видимий) (1.33 або вище)
* `distribute-cpus-across-numa` (бета, стандартно видимий) (1.33 або вище)
* `align-by-socket` (альфа, стандартно прихований) (1.25 або вище)
* `distribute-cpus-across-cores` (альфа, стандартно прихований) (1.31 або вище)

* `strict-cpu-reservation` (GA, стандартно видимий) (1.35 або вище)
* `prefer-align-cpus-by-uncorecache` (GA, стандартно видимий) (1.36 або вище)

Параметр `full-pcpus-only` можна ввімкнути, додавши `full-pcpus-only=true` до параметрів політики CPUManager. Так само параметр `distribute-cpus-across-numa` можна ввімкнути, додавши `distribute-cpus-across-numa=true` до параметрів політики CPUManager. Якщо задано обидва, вони «адитивні» в тому сенсі, що CPU розподілятимуться між вузлами NUMA блоками повних фізичних ядер (full-pcpus), а не окремими ядрами. Параметр політики `align-by-socket` можна ввімкнути, додавши `align-by-socket=true` до параметрів політики `CPUManager`. Він також адитивний до параметрів політики `full-pcpus-only` і `distribute-cpus-across-numa`.

Параметр `distribute-cpus-across-cores` можна ввімкнути, додавши `distribute-cpus-across-cores=true` до параметрів політики `CPUManager`. Наразі його не можна використовувати разом з параметрами політики `full-pcpus-only` або `distribute-cpus-across-numa`.

Параметр `strict-cpu-reservation` можна ввімкнути, додавши `strict-cpu-reservation=true` до параметрів політики CPUManager, після чого видалити файл `/var/lib/kubelet/cpu_manager_state` і перезапустити kubelet.

Параметр `prefer-align-cpus-by-uncorecache` можна ввімкнути, додавши `prefer-align-cpus-by-uncorecache` до параметрів політики `CPUManager`. Якщо використано несумісні параметри, kubelet не запуститься, а помилку буде пояснено в логах.

Докладніше про поведінку окремих параметрів, які ви можете налаштувати, див. у документації [Менеджери ресурсів вузла](/docs/concepts/policy/node-resource-managers).

## {{% heading "whatsnext" %}} {#what-s-next}

* Прочитайте про [менеджери ресурсів на рівні Podʼів](/docs/concepts/resource-management/resource-managers/#pod-level-resource-managers).
