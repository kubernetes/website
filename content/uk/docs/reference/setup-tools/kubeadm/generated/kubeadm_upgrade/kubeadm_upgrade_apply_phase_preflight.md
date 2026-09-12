### Опис {#synopsis}

Запуск передпольотних перевірок перед оновленням

```shell
kubeadm upgrade apply phase preflight [flags]
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
         <td colspan="2">--config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до конфігураційного файлу kubeadm.</p></td>
      </tr>
      <tr>
         <td colspan="2">--dry-run</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Не застосовувати жодних змін; просто вивести, що буде зроблено.</p></td>
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
         <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка preflight</p></td>
      </tr>
      <tr>
         <td colspan="2">--ignore-preflight-errors strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список перевірок, помилки яких будуть показані як попередження. Приклад: 'IsPrivilegedUser,Swap'. Значення 'all' ігнорує помилки всіх перевірок.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubeconfig string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Default: "/etc/kubernetes/admin.conf"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл kubeconfig, який використовується для спілкування з кластером. Якщо прапорець не встановлено, може буити переглянутий набір стандартних місць для пошуку наявного файлу kubeconfig.</p></td>
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
