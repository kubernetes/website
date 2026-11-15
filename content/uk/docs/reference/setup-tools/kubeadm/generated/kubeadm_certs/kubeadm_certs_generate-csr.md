
Генерує ключі та запити на підписання сертифікатів

### Опис {#synopsis}

Генерує ключі та запити на підписування сертифікатів (CSRs) для всіх сертифікатів, необхідних для роботи панелі управління. Ця команда також генерує часткові файли kubeconfig з даними приватного ключа в полі "users &gt; user &gt; client-key-data", і для кожного файлу kubeconfig створюється супутній файл ".csr".

Ця команда призначена для використання в [Режимі Kubeadm з зовнішнім CA Kubeadm](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/#external-ca-mode). Вона генерує CSRs, які ви можете подати на підписання до вашого зовнішнього центру сертифікації.

Закодовані в PEM підписані сертифікати повинні бути збережені поруч з файлами ключів, використовуючи ".crt" як розширення файлу, або, у випадку з файлами kubeconfig, закодований в PEM підписаний сертифікат повинен бути закодований у base64 і доданий до файлу kubeconfig в полі "users &gt; user &gt; client-certificate-data".

```shell
kubeadm certs generate-csr [flags]
```

### Приклади {#examples}

```shell
# Наступна команда згенерує ключі та CSRs для всіх сертифікатів панелі управління та файлів kubeconfig:
kubeadm certs generate-csr --kubeconfig-dir /tmp/etc-k8s --cert-dir /tmp/etc-k8s/pki
```

### Параметри {#options}

<table style="width: 100%; table-layout: fixed;">
    <colgroup>
        <col span="1" style="width: 10px;" />
        <col span="1" />
    </colgroup>
    <tbody>
        <tr>
            <td colspan="2">--cert-dir string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях, де будуть збережені сертифікати</p></td>
        </tr>
        <tr>
            <td colspan="2">--config string</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
        </tr>
        <tr>
            <td colspan="2">-h, --help</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка generate-csr</p></td>
        </tr>
        <tr>
            <td colspan="2">--kubeconfig-dir string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/etc/kubernetes"</td>
        </tr>
        <tr>
            <td></td>
            <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях, де буде збережено файл kubeconfig.</p></td>
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
