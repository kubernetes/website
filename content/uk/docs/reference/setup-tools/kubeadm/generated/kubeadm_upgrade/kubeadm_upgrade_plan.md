### Опис {#synopsis}

Перевіряє, до яких версій можна оновитися, і перевіряє, чи можна оновити ваш поточний кластер. Ця команда може бути виконана лише на вузлах панелі управління, де існує файл kubeconfig "admin.conf". Щоб пропустити перевірку Інтернету, вкажіть необовʼязковий параметр [version].

```shell
kubeadm upgrade plan [version] [flags]
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показати нестабільні версії Kubernetes як альтернативу для оновлення і дозволити оновлення до альфа/бета/кандидатів на випуск версій Kubernetes.</p></td>
        </tr>
        <tr>
        <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, ігнорувати будь-які помилки в шаблонах, коли поле або ключ map відсутній у шаблоні. Застосовується лише до форматів виведення golang та jsonpath.</p></td>
        </tr>
        <tr>
        <td colspan="2">--allow-release-candidate-upgrades</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показати версії кандидатів на випуск Kubernetes як альтернативу для оновлення і дозволити оновлення до версій кандидатів на випуск Kubernetes.</p></td>
        </tr>
        <tr>
        <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації kubeadm.</p></td>
        </tr>
        <tr>
        <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td><td style="line-height: 130%; word-wrap: break-word;"><p>Виконує оновлення etcd.</p></td>
        </tr>
        <tr>
        <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка plan</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який буде використовуватися при зверненні до кластера. Якщо прапорець не заданий, буде проведено пошук файлу kubeconfig в стандартнх місцях.</p></td>
        </tr>
        <td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Формат виводу. Один із: text|json|yaml|kyaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.</p></td>
        </tr>
        <tr>
        <td colspan="2">--print-config</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Вказує, чи потрібно надрукувати файл конфігурації, який буде використаний під час оновлення.</p></td>
        </tr>
        <tr>
        <td colspan="2">--show-managed-fields</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, зберігати managedFields під час виводу обʼєктів у форматі JSON або YAML.</p></td>
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
