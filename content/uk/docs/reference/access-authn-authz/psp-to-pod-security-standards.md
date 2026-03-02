---
title: Зіставлення PodSecurityPolicies зі стандартами безпеки Podʼів
content_type: concept
weight: 95
---

<!-- overview -->

Нижче наведено таблиці, що перераховують параметри конфігурації обʼєктів `PodSecurityPolicy`, чи поле змінює або перевіряє контейнери, та як значення конфігурації зіставляються з [Стандартами безпеки Podʼів](/docs/concepts/security/pod-security-standards/).

Для кожного параметра, до якого це застосовується, перераховані допустимі значення для [Baseline](/docs/concepts/security/pod-security-standards/#baseline) та [Restricted](/docs/concepts/security/pod-security-standards/#restricted) профілів. Все, що перебуває за межами допустимих значень для цих профілів, підпадає під [Privileged](/docs/concepts/security/pod-security-standards/#privileged) профіль. "Немає думки" означає, що всі значення допустимі для всіх стандартів безпеки Podʼів.

Для покрокового керівництва міграції див. [Міграція з PodSecurityPolicy до вбудованого контролера допуску PodSecurity](/docs/tasks/configure-pod-container/migrate-from-psp/).

<!-- body -->

## Специфікація PodSecurityPolicy {#podsecuritypolicyspec-spec}

Поля, перераховані в цій таблиці, є частиною `PodSecurityPolicySpec`, яка вказана
в шляху поля `.spec`.

<table class="no-word-break">
  <caption style="display:none">Зіставлення політики безпеки PodSecurityPolicySpec зі стандартами безпеки Podʼів</caption>
  <tbody>
    <tr>
      <th><code>PodSecurityPolicySpec</code></th>
      <th>Тип</th>
      <th>Еквівалент стандартів безпеки Podʼів</th>
    </tr>
    <tr>
      <td><code>privileged</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>defaultAddCapabilities</code></td>
      <td>Зміна & Перевірка</td>
      <td>Вимоги відповідають <code>allowedCapabilities</code> нижче.</td>
    </tr>
    <tr>
      <td><code>allowedCapabilities</code></td>
      <td>Перевірка</td>
      <td>
        <p><b>Baseline</b>: підмножина</p>
        <ul>
          <li><code>AUDIT_WRITE</code></li>
          <li><code>CHOWN</code></li>
          <li><code>DAC_OVERRIDE</code></li>
          <li><code>FOWNER</code></li>
          <li><code>FSETID</code></li>
          <li><code>KILL</code></li>
          <li><code>MKNOD</code></li>
          <li><code>NET_BIND_SERVICE</code></li>
          <li><code>SETFCAP</code></li>
          <li><code>SETGID</code></li>
          <li><code>SETPCAP</code></li>
          <li><code>SETUID</code></li>
          <li><code>SYS_CHROOT</code></li>
        </ul>
        <p><b>Обмежений</b>: пустий / undefined / nil АБО список, що містить <i>тільки</i>
        <code>NET_BIND_SERVICE</code>
      </td>
    </tr>
    <tr>
      <td><code>requiredDropCapabilities</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <p><b>Baseline</b>: немає думки</p>
        <p><b>Baseline</b>: повинен містити <code>ALL</code></p>
      </td>
    </tr>
    <tr>
      <td><code>volumes</code></td>
      <td>Перевірка</td>
      <td>
        <p><b>Baseline</b>: будь-що крім</p>
        <ul>
          <li><code>hostPath</code></li>
          <li><code>*</code></li>
        </ul>
        <p><b>Restricted</b>: підмножина</p>
        <ul>
          <li><code>configMap</code></li>
          <li><code>csi</code></li>
          <li><code>downwardAPI</code></li>
          <li><code>emptyDir</code></li>
          <li><code>ephemeral</code></li>
          <li><code>persistentVolumeClaim</code></li>
          <li><code>projected</code></li>
          <li><code>secret</code></li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>hostNetwork</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>hostPorts</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: undefined / nil / пустий</td>
    </tr>
    <tr>
      <td><code>hostPID</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>hostIPC</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: <code>false</code> / undefined / nil</td>
    </tr>
    <tr>
      <td><code>seLinux</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <p><b>Baseline & Restricted</b>:
        <code>seLinux.rule</code> is <code>MustRunAs</code>, з наступними <code>options</code></p>
        <ul>
          <li><code>user</code> не встановлено (<code>""</code> / undefined / nil)</li>
          <li><code>role</code> не встановлено (<code>""</code> / undefined / nil)</li>
          <li><code>type</code> не встановлено або один із: <code>container_t, container_init_t, container_kvm_t, container_engine_t</code></li>
          <li><code>level</code> є будь-чим</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td><code>runAsUser</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <p><b>Baseline</b>: Будь-що</p>
        <p><b>Restricted</b>: <code>rule</code> є <code>MustRunAsNonRoot</code></p>
      </td>
    </tr>
    <tr>
      <td><code>runAsGroup</code></td>
      <td>Зміна (MustRunAs) & Перевірка</td>
      <td>
        <i>Немає думки</i>
      </td>
    </tr>
    <tr>
      <td><code>supplementalGroups</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <i>Немає думки</i>
      </td>
    </tr>
    <tr>
      <td><code>fsGroup</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <i>Немає думки</i>
      </td>
    </tr>
    <tr>
      <td><code>readOnlyRootFilesystem</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <i>Немає думки</i>
      </td>
    </tr>
    <tr>
      <td><code>defaultAllowPrivilegeEscalation</code></td>
      <td>Зміна</td>
      <td>
        <i>Немає думки</i>
      </td>
    </tr>
    <tr>
      <td><code>allowPrivilegeEscalation</code></td>
      <td>Зміна & Перевірка</td>
      <td>
        <p><i>Лише зміна, якщо встановлено <code>false</code></i></p>
        <p><b>Baseline</b>: Немає думки</p>
        <p><b>Restricted</b>: <code>false</code></p>
      </td>
    </tr>
    <tr>
      <td><code>allowedHostPaths</code></td>
      <td>Перевірка</td>
      <td><i>Немає думки (пріоритет мають volumes)</i></td>
    </tr>
    <tr>
      <td><code>allowedFlexVolumes</code></td>
      <td>Перевірка</td>
      <td><i>Немає думки (пріоритет мають volumes)</i></td>
    </tr>
    <tr>
      <td><code>allowedCSIDrivers</code></td>
      <td>Перевірка</td>
      <td><i>Немає думки (пріоритет мають volumes)</i></td>
    </tr>
    <tr>
      <td><code>allowedUnsafeSysctls</code></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: undefined / nil / empty</td>
    </tr>
    <tr>
      <td><code>forbiddenSysctls</code></td>
      <td>Перевірка</td>
      <td><i>Немає думки</i></td>
    </tr>
    <tr>
      <td><code>allowedProcMountTypes</code><br><i>(альфа-функція)</i></td>
      <td>Перевірка</td>
      <td><b>Baseline & Restricted</b>: <code>["Default"]</code> АБО undefined / nil / empty</td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.defaultRuntimeClassName</code></td>
      <td>Зміна</td>
      <td><i>Немає думки</i></td>
    </tr>
    <tr>
      <td><code>runtimeClass</code><br><code>&nbsp;.allowedRuntimeClassNames</code></td>
      <td>Перевірка</td>
      <td><i>Немає думки</i></td>
    </tr>
  </tbody>
</table>

## Анотації PodSecurityPolicy {#podsecuritypolicy-annotations}

[Анотації](/docs/concepts/overview/working-with-objects/annotations/), перераховані в цій таблиці, можуть бути вказані у `.metadata.annotations` обʼєкту PodSecurityPolicy.

<table class="no-word-break">
  <caption style="display:none">Зіставлення анотацій PodSecurityPolicy зі стандартами безпеки Podʼів</caption>
  <tbody>
    <tr>
      <th><code>Анотація PSP</code></th>
      <th>Тип</th>
      <th>Еквівалент стандартів безпеки Podʼів</th>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>Зміна</td>
      <td><i>Немає думки</i></td>
    </tr>
    <tr>
      <td><code>seccomp.security.alpha.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>Перевірка</td>
      <td>
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Кома в кінці, щоб встановити unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(Без коми в кінці)</i></p>
        <p><i>Значення <code>localhost/*</code> також дозволені як для Baseline, так і для Restricted.</i></p>
      </td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/defaultProfileName</code></td>
      <td>Зміна</td>
      <td><i>Немає думки</i></td>
    </tr>
    <tr>
      <td><code>apparmor.security.beta.kubernetes.io</code><br><code>/allowedProfileNames</code></td>
      <td>Перевірка</td>
      <td>
        <p><b>Baseline</b>: <code>"runtime/default,"</code> <i>(Кома в кінці, щоб встановити unset)</i></p>
        <p><b>Restricted</b>: <code>"runtime/default"</code> <i>(Без коми в кінці)</i></p>
        <p><i>Значення <code>localhost/*</code> також дозволені як для Baseline, так і для Restricted.</i></p>
      </td>
    </tr>
  </tbody>
</table>
