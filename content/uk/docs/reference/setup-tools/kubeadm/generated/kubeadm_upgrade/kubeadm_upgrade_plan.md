### Опис {#synopsis}

Перевіряє, до яких версій можна оновитися, і перевіряє, чи можна оновити ваш поточний кластер. Ця команда може бути виконана лише на вузлах панелі управління, де існує файл kubeconfig "admin.conf". Щоб пропустити перевірку Інтернету, вкажіть необовʼязковий параметр [version].

```
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показує нестабільні версії Kubernetes як альтернативу для оновлення і дозволяє оновлення до альфа/бета/кандидатів на випуск версій Kubernetes.</p></td>
        </tr>
        <tr>
            <td colspan="2">--allow-missing-template-keys&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, ігнорувати будь-які помилки в шаблонах, коли поле або ключ map відсутні в шаблоні. Застосовується тільки до форматів виведення golang і jsonpath.</p></td>
        </tr>
        <tr>
            <td colspan="2">--allow-release-candidate-upgrades</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Показує версії кандидатів на випуск Kubernetes як альтернативу для оновлення і дозволяє оновлювати до версій кандидатів на випуск Kubernetes.</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">--etcd-upgrade&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Виконує оновлення etcd.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>довідка для plan</p></td>
        </tr>
        <tr>
            <td colspan="2">--ignore-preflight-errors strings</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки всіх перевірок.</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes/admin.conf"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може бути переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
        </tr>
        <tr>
            <td colspan="2">-o, --output string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Формат виводу. Один з: text|json|yaml|kyaml|go-template|go-template-file|template|templatefile|jsonpath|jsonpath-as-json|jsonpath-file.</p></td>
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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, залишати managedFields при виведенні обʼєктів у форматі JSON або YAML.</p></td>
        </tr>
    </tbody>
</table>

### Параметри, успадковані від батьківських команд {#options-inherited-from-parent-commands}

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
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до 'справжньої' кореневої файлової системи хоста. Це змусить kubeadm виконати chroot у вказаний шлях.</p></td>
        </tr>
    </tbody>
</table>
