---
title: Стандарти безпеки Podʼів
description: >
  Докладний огляд різних рівнів політики, визначених у стандартах безпеки Podʼів.
content_type: concept
weight: 15
---

<!-- overview -->

Стандарти безпеки Podʼів визначають три різні _політики_, щоб широко охопити спектр безпеки. Ці політики є _кумулятивними_ й охоплюють діапазон від дуже дозвільних до дуже обмежувальних. У цьому посібнику наведено вимоги кожної політики.

| Профіль | Опис |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Необмежена політика, яка забезпечує найширший можливий рівень дозволів. Ця політика дозволяє відомі підвищення привілеїв. |
| <strong style="white-space: nowrap">Baseline</strong> | Мінімально обмежувальна політика, яка запобігає відомим підвищенням привілеїв. Дозволяє стандартну (мінімально визначену) конфігурацію Podʼа. |
| <strong style="white-space: nowrap">Restricted</strong> | Дуже обмежувальна політика, що відповідає поточним рекомендаціям зі зміцнення Podʼів. |

<!-- body -->

## Докладно про профілі {#profile-details}

### Privileged

**Політика _Privileged_ навмисно відкрита й повністю необмежена.** Цей тип політики зазвичай призначений для робочих навантажень системного та інфраструктурного рівня, якими керують привілейовані, довірені користувачі.

Політика Privileged визначається відсутністю обмежень. Якщо ви визначаєте Pod, до якого застосовується політика безпеки Privileged, цей Pod може обходити типові механізми ізоляції контейнерів. Наприклад, ви можете визначити Pod, який має доступ до мережі хоста вузла.

### Baseline

**Політика _Baseline_ спрямована на легке впровадження для поширених контейнеризованих робочих навантажень із запобіганням відомим підвищенням привілеїв.** Ця політика призначена для операторів застосунків і розробників некритичних застосунків. Наведені нижче засоби контролю слід застосовувати або забороняти:

{{< note >}}
У цій таблиці символи підстановки (`*`) позначають усі елементи списку. Наприклад, `spec.containers[*].securityContext` стосується обʼєкта контексту безпеки для _усіх визначених контейнерів_. Якщо будь-який із перелічених контейнерів не відповідає вимогам, весь Pod не пройде перевірку.
{{< /note >}}

<table>
	<caption style="display:none">Специфікація політики Baseline</caption>
	<tbody>
		<tr>
			<th>Засіб контролю</th>
			<th>Політика</th>
		</tr>
		<tr>
			<td style="white-space: nowrap">HostProcess</td>
			<td>
				<p>Podʼи Windows дають змогу запускати <a href="/uk/docs/tasks/configure-pod-container/create-hostprocess-pod">контейнери HostProcess</a>, що надають привілейований доступ до хост-машини Windows. Привілейований доступ до хоста заборонено в політиці Baseline. {{< feature-state for_k8s_version="v1.26" state="stable" >}}</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Простори імен хоста</td>
			<td>
				<p>Спільне використання просторів імен хоста має бути заборонене.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Привілейовані контейнери</td>
			<td>
				<p>Привілейовані Podʼи вимикають більшість механізмів безпеки й мають бути заборонені.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Capabilities</td>
			<td>
				<p>Додавання capabilities, крім перелічених нижче, має бути заборонене.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
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
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Томи HostPath</td>
			<td>
				<p>Томи HostPath мають бути заборонені.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Порти хоста</td>
			<td>
				<p>HostPorts слід повністю заборонити (рекомендовано) або обмежити відомим списком</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>Відомий список (не підтримується вбудованим <a href="/uk/docs/concepts/security/pod-security-admission/">контролером Pod Security Admission</a>)</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>Проби хоста / хуки життєвого циклу (v1.34+)</td>
			<td>
				<p>Поле Host у пробах і хуках життєвого циклу має бути заборонене.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].livenessProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].readinessProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].startupProbe.httpGet.host</code></li>
					<li><code>spec.containers[*].livenessProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].readinessProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].startupProbe.tcpSocket.host</code></li>
					<li><code>spec.containers[*].lifecycle.postStart.tcpSocket.host</code>
					<li><code>spec.containers[*].lifecycle.preStop.tcpSocket.host</code>
					<li><code>spec.containers[*].lifecycle.postStart.httpGet.host</code></li>
					<li><code>spec.containers[*].lifecycle.preStop.httpGet.host</code></li>
					<li><code>spec.initContainers[*].livenessProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].readinessProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].startupProbe.httpGet.host</code></li>
					<li><code>spec.initContainers[*].livenessProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].readinessProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].startupProbe.tcpSocket.host</code></li>
					<li><code>spec.initContainers[*].lifecycle.postStart.tcpSocket.host</code>
					<li><code>spec.initContainers[*].lifecycle.preStop.tcpSocket.host</code>
					<li><code>spec.initContainers[*].lifecycle.postStart.httpGet.host</code></li>
					<li><code>spec.initContainers[*].lifecycle.preStop.httpGet.host</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>На підтримуваних хостах стандартно застосовується профіль AppArmor <code>RuntimeDefault</code>. Політика Baseline має запобігати перевизначенню або вимкненню стандартного профілю AppArmor чи обмежувати перевизначення дозволеним набором профілів.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.appArmorProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>runtime/default</code></li>
					<li><code>localhost/*</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">SELinux</td>
			<td>
				<p>Встановлення типу SELinux обмежено, а встановлення власного користувача або ролі SELinux заборонено.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
					<li><code>container_engine_t</code> (з Kubernetes 1.31)</li>
				</ul>
				<hr />
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.user</code></li>
					<li><code>spec.securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.role</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.role</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Тип монтування <code>/proc</code></td>
			<td>
				<p>Стандартні маски <code>/proc</code> налаштовані для зменшення поверхні атаки, і їх використання має бути обовʼязковим.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td>Seccomp</td>
  			<td>
  				<p>Профіль Seccomp не можна явно встановлювати в значення <code>Unconfined</code>.</p>
  				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  			</td>
  		</tr>
		<tr>
			<td style="white-space: nowrap">Sysctls</td>
			<td>
				<p>Sysctls можуть вимикати механізми безпеки або впливати на всі контейнери на хості, тому їх слід заборонити, крім дозволеної «безпечної» підмножини. Sysctl вважається безпечним, якщо він обмежений простором імен контейнера або Podʼа й ізольований від інших Podʼів або процесів на тому самому вузлі.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
					<li><code>net.ipv4.ip_local_reserved_ports</code> (з Kubernetes 1.27)</li>
					<li><code>net.ipv4.tcp_keepalive_time</code> (з Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_fin_timeout</code> (з Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code> (з Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code> (з Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_rmem</code> (з Kubernetes 1.32)</li>
					<li><code>net.ipv4.tcp_wmem</code> (з Kubernetes 1.32)</li>
					<li><code>net.ipv4.tcp_slow_start_after_idle</code> (з Kubernetes 1.37)</li>
					<li><code>net.ipv4.tcp_notsent_lowat</code> (з Kubernetes 1.37)</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### Restricted

**Політика _Restricted_ спрямована на застосування поточних рекомендацій зі зміцнення Podʼів ціною певної втрати сумісності.** Вона призначена для операторів і розробників критичних для безпеки застосунків, а також для користувачів із нижчим рівнем довіри. Наведені нижче засоби контролю слід застосовувати або забороняти:

{{< note >}}
У цій таблиці символи підстановки (`*`) позначають усі елементи списку. Наприклад, `spec.containers[*].securityContext` стосується обʼєкта контексту безпеки для _усіх визначених контейнерів_. Якщо будь-який із перелічених контейнерів не відповідає вимогам, весь Pod не пройде перевірку.
{{< /note >}}

<table>
	<caption style="display:none">Специфікація політики Restricted</caption>
	<tbody>
		<tr>
			<td><strong>Засіб контролю</strong></td>
			<td><strong>Політика</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>Усе з політики Baseline</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Типи томів</td>
			<td>
				<p>Політика Restricted дозволяє лише такі типи томів.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				Кожен елемент списку <code>spec.volumes[*]</code> повинен встановлювати одне з наведених нижче полів у значення, відмінне від null:
				<ul>
					<li><code>spec.volumes[*].configMap</code></li>
					<li><code>spec.volumes[*].csi</code></li>
					<li><code>spec.volumes[*].downwardAPI</code></li>
					<li><code>spec.volumes[*].emptyDir</code></li>
					<li><code>spec.volumes[*].ephemeral</code></li>
					<li><code>spec.volumes[*].persistentVolumeClaim</code></li>
					<li><code>spec.volumes[*].projected</code></li>
					<li><code>spec.volumes[*].secret</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Підвищення привілеїв (v1.8+)</td>
			<td>
				<p>Підвищення привілеїв (наприклад, через режим файлів set-user-ID або set-group-ID) не слід дозволяти. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(spec.os.name != windows)</code></em></p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Запуск не від імені root</td>
			<td>
				<p>Контейнери мають працювати від імені користувачів, відмінних від root.</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
Поля контейнера можуть бути undefined/<code>nil</code>, якщо на рівні Podʼа
<code>spec.securityContext.runAsNonRoot</code> встановлено в <code>true</code>.
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Запуск від імені користувача, відмінного від root (v1.23+)</td>
			<td>
				<p>Контейнери не повинні встановлювати <tt>runAsUser</tt> у 0</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
				    <li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>будь-яке ненульове значення</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
  			<td>
  				<p>Профіль Seccomp має бути явно встановлений в одне з дозволених значень. Заборонено як профіль <code>Unconfined</code>, так і <em>відсутність</em> профілю. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(spec.os.name != windows)</code></em></p>
  				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					Поля контейнера можуть бути undefined/<code>nil</code>, якщо на рівні Podʼа <code>spec.securityContext.seccompProfile.type</code> встановлено відповідне значення. Навпаки, поле на рівні Podʼа може бути undefined/<code>nil</code>, якщо встановлено _всі_ поля на рівні контейнера.
				</small>
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap">Capabilities (v1.22+)</td>
			<td>
				<p>
					Контейнери повинні скидати всі capabilities (<code>ALL</code>), і їм дозволено додавати назад лише capability <code>NET_BIND_SERVICE</code>. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(.spec.os.name != "windows")</code></em>
				</p>
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Будь-який список capabilities, що містить <code>ALL</code></li>
				</ul>
				<hr />
				<p><strong>Обмежені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

## Втілення політики {#policy-instantiation}

Відокремлення визначення політики від її втілення дає змогу мати спільне розуміння й узгоджену мову політик у всіх кластерах незалежно від базового механізму застосування.

Коли механізми стануть зрілішими, їх буде описано нижче окремо для кожної політики. Способи застосування окремих політик тут не визначено.

[**Контролер Pod Security Admission**](/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Простір імен Privileged{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Простір імен Baseline{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Простір імен Restricted{{< /example >}}

### Альтернативи {#alternatives}

{{% thirdparty-content %}}

Інші альтернативи застосування політик розробляються в екосистемі Kubernetes, зокрема:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## Поле OS Podʼа {#pod-os-field}

Kubernetes дозволяє використовувати вузли, що працюють під керуванням Linux або Windows. Ви можете поєднувати обидва типи вузлів в одному кластері. Windows у Kubernetes має певні обмеження й відмінності від робочих навантажень на базі Linux. Зокрема, багато полів `securityContext` Podʼа [не діють у Windows](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).

{{< note >}}
kubelet версій до v1.24 не застосовує поле OS Podʼа, і якщо в кластері є вузли з версіями до v1.24, політики Restricted слід закріпити на версії до v1.25.
{{< /note >}}

### Зміни в стандарті безпеки Podʼів Restricted {#restricted-pod-security-standard-changes}

Ще одна важлива зміна, внесена в Kubernetes v1.25, полягає в тому, що політику _Restricted_ оновлено для використання поля `pod.spec.os.name`. Залежно від назви ОС певні політики, специфічні для конкретної ОС, можна послабити для іншої ОС.

#### Засоби контролю політики, специфічні для ОС {#os-specific-policy-controls}

Обмеження на наведені нижче засоби контролю потрібні лише тоді, коли `.spec.os.name` не дорівнює `windows`:
- Підвищення привілеїв
- Seccomp
- Linux Capabilities

## Простори імен користувачів {#user-namespaces}

Простори імен користувачів — це можливість лише для Linux, що дозволяє запускати робочі навантаження з підвищеною ізоляцією. Як вони працюють разом зі стандартами безпеки Podʼів, описано в [документації](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks) для Podʼів, що використовують простори імен користувачів.

## ЧаП {#faq}

### Чому немає профілю між Privileged та Baseline? {#why-isn-t-there-a-profile-between-privileged-and-baseline}

Три визначені тут профілі мають чітку лінійну прогресію від найбезпечнішого (Restricted) до найменш безпечного (Privileged) і охоплюють широкий набір робочих навантажень. Привілеї, потрібні понад політику Baseline, зазвичай дуже специфічні для застосунку, тому ми не пропонуємо стандартного профілю в цій ніші. Це не означає, що в такому разі завжди слід використовувати профіль Privileged, але політики в цій області потрібно визначати окремо для кожного випадку.

SIG Auth може переглянути цю позицію в майбутньому, якщо зʼявиться чітка потреба в інших профілях.

### У чому різниця між профілем безпеки та контекстом безпеки? {#what-s-the-difference-between-a-security-profile-and-a-security-context}

[Контексти безпеки](/docs/tasks/configure-pod-container/security-context/) налаштовують Podʼи та контейнери під час виконання. Контексти безпеки визначаються як частина специфікацій Podʼа й контейнера в маніфесті Podʼа та є параметрами для середовища виконання контейнерів.

Профілі безпеки — це механізми панелі управління для застосування певних налаштувань у контексті безпеки, а також інших повʼязаних параметрів поза контекстом безпеки. Станом на липень 2021 року [політики безпеки Podʼів](/docs/concepts/security/pod-security-policy/) визнано застарілими на користь вбудованого [контролера Pod Security Admission](/docs/concepts/security/pod-security-admission/).

### А як щодо Podʼів у пісочниці? {#what-about-sandboxed-pods}

Наразі немає стандарту API, який визначає, чи вважається Pod ізольованим у пісочниці. Podʼи в пісочниці можна визначити за використанням середовища виконання в пісочниці (такого як gVisor або Kata Containers), але стандартного визначення такого середовища немає.

Захист, потрібний робочим навантаженням у пісочниці, може відрізнятися від інших. Наприклад, потреба обмежувати привілейовані дозволи менша, коли робоче навантаження ізольоване від базового ядра. Це дозволяє ізолювати робочі навантаження, яким потрібні підвищені дозволи.

Крім того, захист робочих навантажень у пісочниці значною мірою залежить від методу ізоляції в пісочниці. Тому немає єдиного профілю, рекомендованого для всіх робочих навантажень у пісочниці.
