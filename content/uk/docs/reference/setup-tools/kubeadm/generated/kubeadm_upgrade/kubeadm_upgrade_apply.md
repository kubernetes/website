### Опис {#synopsis}

Оновлює кластер Kubernetes до вказаної версії.

Команда "apply [version]" виконує наступні етапи:

```text
preflight        Виконання перевірок перед запуском
control-plane    Оновлення панелі управління
upload-config    Завантаження конфігурації kubeadm та kubelet у ConfigMapі
  /kubeadm         Завантаження конфігурації кластера kubeadm у ConfigMap
  /kubelet         Завантаження конфігурації компоненту kubelet у ConfigMap
kubelet-config   Оновлення конфігурації kubelet для цього вузла
bootstrap-token  Налаштування токену bootstrap та правил cluster-info RBAC
addon            Оновлення типових надбудов kubeadm
  /coredns         Оновлення надбудови CoreDNS
  /kube-proxy      Оновлення надбудови kube-proxy
post-upgrade     Запуск завдань після оновлення
```

```shell
kubeadm upgrade apply [version]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--allow-experimental-upgrades</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показує нестабільні версії Kubernetes як альтернативу для оновлення і дозволяє оновлювати до альфа/бета/версій кандидатів Kubernetes.</p></td>
        </tr>
        <tr>
            <td colspan="2">--allow-release-candidate-upgrades</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показує версії кандидатів на випуск Kubernetes як альтернативу для оновлення і дозволяє оновлювати до версій кандидатів на випуск Kubernetes.</p></td>
        </tr>
        <tr>
            <td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконує оновлення сертифікатів, які використовуються компонентами під час оновлення.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Не змінює жодного стану, просто показує дії, які будуть виконані.</p></td>
        </tr>
        <tr>
            <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконує оновлення etcd.</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --force</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Примусове оновлення, навіть якщо деякі вимоги можуть бути не виконані. Це також передбачає неітерактивний режим.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка apply</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-preflight-errors strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки з усіх перевірок.</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який буде використовуватися при зверненні до кластера. Якщо прапорець не заданий, буде проведено пошук файлу kubeconfig в стандартних місцях.</p></td>
        </tr>
        <tr>
            <td colspan="2">--patches string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з іменами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним із &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним із &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot;, і вони відповідають форматам патчів, які підтримуються kubectl. Стандартно &quot;patchtype&quot; - &quot;strategic&quot;. &quot;extension&quot; повинен бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; є необовʼязковим рядком, який може використовуватися для визначення порядку застосування патчів за алфавітом.</p></td>
        </tr>
        <tr>
            <td colspan="2">--print-config</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вказує, чи потрібно надрукувати файл конфігурації, який буде використаний під час оновлення.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-phases strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список етапів, які потрібно оминути</p></td>
        </tr>
        <tr>
            <td colspan="2">-y, --yes</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконати оновлення і не запитувати підтвердження (режим без взаємодії).</p></td>
        </tr>
    </tbody>
</table>

### Параметри успадковані від батьківських команд {#options-inherited-from-parent-commands}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--rootfs string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до реальної кореневої файлової системи хоста. Це призведе до зміни корення (chroot) kubeadm на вказаних шлях</p></td>
        </tr>
    </tbody>
</table>
