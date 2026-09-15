### Опис {#synopsis}

Виконує максимально можливий відкат змін для хоста, зроблених командами `kubeadm init` або `kubeadm join`.

Команда "reset" виконує наступні фази:

```none
preflight           Запуск попередніх перевірок
remove-etcd-member  Вилучення локального учасника etcd.
cleanup-node        Запуск очищення вузла.
```

```shell
kubeadm reset [flags]
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--cert-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/pki"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до теки, де зберігаються сертифікати. Якщо вказано, очистити цю теку.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cleanup-tmp-dir</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Очистити теку &quot;/etc/kubernetes/tmp&quot;</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--cri-socket string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до CRI сокету для підключення. Якщо порожньо, kubeadm спробує автоматично визначити це значення; використовуйте цей параметр лише якщо у вас встановлено більше одного CRI або якщо у вас нестандартний CRI сокет.</p></td>
        </tr>
        <tr>
            <td colspan="2">--dry-run</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Не вносити жодних змін; лише вивести, що буде зроблено.</p></td>
        </tr>
        <tr>
            <td colspan="2">-f, --force</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконати reset вузла без запиту на підтвердження.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка reset</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-preflight-errors strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки від усіх перевірок.</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig для використання при спілкуванні з кластером. Якщо прапорець не встановлено, можна шукати наявний файл kubeconfig у наборі стандартних місць.</p></td>
        </tr>
        <tr>
            <td colspan="2">--skip-phases strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список фаз, які слід пропустити</p></td>
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
