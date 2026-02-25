### Опис {#synopsis}

Команда upgrade для вузлів в кластері.

Команда "node" виконує наступні фази:

```none
preflight       Виконання попереднії перевірок оновлення вузла
control-plane   Оновлення екземпляру панелі управління, розгорнутий на цьому вузлі, якщо такий є
kubelet-config  Оновлення конфігурацію kubelet для цього вузла
addon           Оновлення стандартних надбудов kubeadm
  /coredns        Оновлення надбудови CoreDNS
  /kube-proxy     Оновлення надбудови kube-proxy
post-upgrade    Запуск завдань після оновлення
```

```shell
kubeadm upgrade node [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
    <tr>
        <td colspan="2">--certificate-renewal&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
    </tr>
    <tr>
        <td></td>
        <td style="line-height: 130%; word-wrap: break-word;"><p>Виконати оновлення сертифікатів, використовуваних компонентами, які змінюються під час оновлення.</p></td>
    </tr>
    <tr>
        <td colspan="2">--config string</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
    </tr>
    <tr>
        <td colspan="2">--dry-run</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Не змінює жодного стану, просто показує дії, які будуть виконані.</p></td>
    </tr>
    <tr>
        <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Виконати оновлення etcd.</p></td>
    </tr>
    <tr>
        <td colspan="2">-h, --help</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>довідка node</p></td>
    </tr>
    <tr>
        <td colspan="2">--ignore-preflight-errors strings</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки в яких будуть відображені як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки з усіх перевірок.</p></td>
    </tr>
    <tr>
        <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який буде використовуватися при зверненні до кластера. Якщо прапорець не заданий, буде проведено пошук файлу kubeconfig в стандартних місцях.</p></td>
    </tr>
    <tr>
        <td colspan="2">--patches string</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, що містить файли з іменами &quot;target[suffix][+patchtype].extension&quot;. Наприклад, &quot;kube-apiserver0+merge.yaml&quot; або просто &quot;etcd.json&quot;. &quot;target&quot; може бути одним із &quot;kube-apiserver&quot;, &quot;kube-controller-manager&quot;, &quot;kube-scheduler&quot;, &quot;etcd&quot;, &quot;kubeletconfiguration&quot;, &quot;corednsdeployment&quot;. &quot;patchtype&quot; може бути одним із &quot;strategic&quot;, &quot;merge&quot; або &quot;json&quot;, і вони відповідають форматам патчів, що підтримуються kubectl. Стандартно &quot;patchtype&quot; - &quot;strategic&quot;. &quot;extension&quot; повинен бути або &quot;json&quot;, або &quot;yaml&quot;. &quot;suffix&quot; - це необовʼязковий рядок, який може використовуватися для визначення порядку застосування патчів за алфавітном.</p></td>
    </tr>
    <tr>
        <td colspan="2">--skip-phases strings</td>
    </tr>
    <tr>
        <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Список фаз, які слід пропустити.</p></td>
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
