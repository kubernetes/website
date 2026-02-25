---
title: Стандарти безпеки для Podʼів
description: >
  Детальний огляд різних рівнів політики, визначених у стандартах безпеки для Podʼів.
content_type: concept
weight: 15
---

<!-- overview -->

Стандарти безпеки для Podʼів визначають три різні _політики_, щоб покрити широкий спектр безпеки. Ці політики є _кумулятивними_ та охоплюють широкий діапазон від все дозволено до все обмежено. У цьому керівництві наведено вимоги кожної політики.

| Профіль | Опис |
| ------ | ----------- |
| <strong style="white-space: nowrap">Privileged</strong> | Необмежена політика, яка забезпечує найширший можливий рівень дозволів. Ця політика дозволяє відомі підвищення привілеїв. |
| <strong style="white-space: nowrap">Baseline</strong> | Мінімально обмежена політика, яка запобігає відомим підвищенням привілеїв. Дозволяє стандартну (мінімально визначену) конфігурацію Pod. |
| <strong style="white-space: nowrap">Restricted</strong> | Дуже обмежена політика, яка відповідає поточним найкращим практикам забезпечення безпеки Pod. |

<!-- body -->

## Деталі профілю {#profile-details}

### Privileged

**Політика _Privileged_ спеціально є відкритою і цілковито необмеженою.** Цей тип політики зазвичай спрямований на робочі навантаження рівня системи та інфраструктури, які керуються привілейованими, довіреними користувачами.

Політика Privileged визначається відсутністю обмежень. Якщо ви визначаєте Pod, до якого застосовується політика безпеки Privileged, визначений вами Pod може обходити типові механізми ізоляції контейнерів. Наприклад, ви можете визначити Pod, який має доступ до мережі хоста вузла.

### Baseline

**Політика _Baseline_ спрямована на полегшення впровадження загальних контейнеризованих робочих навантажень та запобіганням відомим ескалаціям привілеїв.** Ця політика призначена для операторів застосунків та розробників не критичних застосунків. Наведені нижче параметри мають бути виконані/заборонені:

{{< note >}}
У цій таблиці зірочки (`*`) позначають всі елементи в списку. Наприклад,
`spec.containers[*].securityContext` стосується обʼєкта Контексту Безпеки для _усіх визначених контейнерів_. Якщо будь-який із перерахованих контейнерів не відповідає вимогам, весь Pod не пройде перевірку.
{{< /note >}}

<table>
	<caption style="display:none">Специфікація політики "Baseline"</caption>
	<tbody>
		<tr>
			<th>Елемент</th>
			<th>Політика</th>
		</tr>
		<tr>
			<td style="white-space: nowrap">HostProcess</td>
			<td>
				<p>Для Podʼів Windows надається можливість запуску <a href="/uk/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess контейнерів</a>, що дозволяє привілейований доступ до машини хосту Windows. Привілеї на вузлs заборонені політикою baseline. {{< feature-state for_k8s_version="v1.26" state="stable" >}}</p>
				<p><strong>Заборонені поля</strong></p>
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
			<td style="white-space: nowrap">Host Namespaces</td>
			<td>
				<p>Доступ до просторів імен вузла має бути заборонений.</p>
				<p><strong>Заборонені поля</strong></p>
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
				<p>Привілейовані Podʼи відключають більшість механізмів безпеки і повинні бути відключені.</p>
				<p><strong>Заборонені поля</strong></p>
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
				<p>Додавання додаткових можливостей, крім перерахованих нижче, має бути заборонене.</p>
				<p><strong>Заборонені поля</strong></p>
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
				<p><strong>Заборонені поля</strong></p>
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
			<td style="white-space: nowrap">Порти хосту</td>
			<td>
				<p>HostPort повинні бути заборонені повністю (рекомендовано) або обмежені до відомого списку</p>
				<p><strong>Заборонені поля</strong></p>
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
			<td>Проби хосту / хуки життєвого циклу (v1.34+)</td>
			<td>
				<p>Поле Host у пробах і хуках життєвого циклу має бути заборонене.</p>
				<p><strong>Заборонені поля</strong></p>
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
				<p>На підтримуваних вузлах стандартно застосовується профіль AppArmor <code>RuntimeDefault</code>. Політика Baseline має заборонити зміну або вимкнення профілю AppArmor стандартно, або обмежити заміни дозволеним набором профілів.</p>
				<p><strong>Заборонені поля</strong></p>
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
				<p>Встановлення типу SELinux обмежено, а встановлення користувацького SELinux або ролі заборонено.</p>
				<p><strong>Заборонені поля</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Визначено/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
					<li><code>container_engine_t</code> (з Kubernetes 1.31)</li>
				</ul>
				<hr />
				<p><strong>Заборонені поля</strong></p>
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
					<li>Визначено/""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code> Тип монтування</td>
			<td>
				<p>Типові маски <code>/proc</code> налаштовані для зменшення поверхні атаки і мають бути обовʼязковими.</p>
				<p><strong>Заборонені поля</strong></p>
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
  				<p>Профіль Seccomp не повинен явно встановлюватися на значення <code>Unconfined</code>.</p>
  				<p><strong>Заборонені поля</strong></p>
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
				<p>Sysctls можуть вимкнути механізми безпеки або вплинути на всі контейнери на вузлі, тому вони мають бути заборонені за виключенням дозволеного "безпечного" піднабору. Sysctl вважається безпечним, якщо він знаходиться в просторі імен в контейнері чи Podʼі, і він ізольований від інших Podʼів або процесів на тому ж Вузлі.</p>
				<p><strong>Заборонені поля</strong></p>
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
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### Restricted

**Політика _Restricted_ призначена для забезпечення поточних кращих практик у забезпеченні безпеки Pod, за рахунок деякої сумісності.** Вона спрямована на операторів та розробників критичних з точки зору безпеки застосунків, а також на користувачів з меншою довірою. Нижче наведено перелік контролів, які слід дотримуватися/забороняти:

{{< note >}}
У цій таблиці зірочки (`*`) позначають всі елементи списку. Наприклад, `spec.containers[*].securityContext` вказує на обʼєкт Контексту безпеки для _всіх визначених контейнерів_. Якщо хоча б один з наведених контейнерів не відповідає вимогам, весь підпроцес не пройде валідацію.
{{< /note >}}

<table>
	<caption style="display:none">Специфікація політики "Restricted"</caption>
	<tbody>
		<tr>
			<td><strong>Елемент</strong></td>
			<td><strong>Політика</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>Все з політики Baseline.</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Типи томів</td>
			<td>
				<p>В політиці Restricted дозволяються лише наступні типи томів.</p>
				<p><strong>Заборонені поля</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				Кожен елемент списку <code>spec.volumes[*]</code> повинен встановлювати одне з наступних полів на ненульове значення:
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
				<p>Підвищення привілеїв (наприклад, через файловий режим set-user-ID або set-group-ID) не повинно бути дозволено. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(spec.os.name != windows)</code></em></p>
				<p><strong>Заборонені поля</strong></p>
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
			<td style="white-space: nowrap">Запуск як не-root</td>
			<td>
				<p>Контейнери мають запускатися як не-root користувачі.</p>
				<p><strong>Заборонені поля</strong></p>
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
					Поля контейнера можуть бути undefined/<code>nil</code>, якщо рівень контейнера на рівні підпроцесу
					<code>spec.securityContext.runAsNonRoot</code> встановлено на <code>true</code>.
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Запуск як не-root (v1.23+)</td>
			<td>
				<p>Контейнери не повинні встановлювати <tt>runAsUser</tt> на 0</p>
				<p><strong>Заборонені поля</strong></p>
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
  				<p>Профіль Seccomp повинен бути явно встановлений на одне з дозволених значень. Обидва, <code>Unconfined</code>, так и <em>відсутність</em> профілю заборонені. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(spec.os.name != windows)</code></em></p>
  				<p><strong>Заборонені поля</strong></p>
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
					Поля контейнера можуть бути undefined/<code>nil</code>, якщо на рівні підпроцесу <code>spec.securityContext.seccompProfile.type</code> встановлено відповідне значення. Навпаки, поле на рівні підпроцесу може бути undefined/<code>nil</code>, якщо _всі_ поля рівня контейнера встановлені.
				</small>
  			</td>
  		</tr>
		  <tr>
			<td style="white-space: nowrap">Capabilities (v1.22+)</td>
			<td>
				<p>
					Контейнери повинні скидати <code>ALL</code>, і дозволяється лише додавання можливості <code>NET_BIND_SERVICE</code>. <em><a href="#os-specific-policy-controls">Це політика лише для Linux</a> у v1.25+ <code>(.spec.os.name != "windows")</code></em>
				</p>
				<p><strong>Заборонені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Будь-який список можливостей, який включає <code>ALL</code></li>
				</ul>
				<hr />
				<p><strong>Заборонені поля</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Дозволені значення</strong></p>
				<ul>
					<li>Undefined/<code>nil</code></li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

## Впровадження політики {#policy-instantiation}

Відокремлення визначення політики від її впровадження дозволяє отримати спільне розуміння та послідовне використання політик у кластерах, незалежно від механізму їх виконання.

Після того як механізми стануть більш зрілими, вони будуть визначені нижче на основі кожної політики. Методи виконання окремих політик тут не визначені.

[**Контролер Pod Security Admission**](/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}Привілейоване пространство імен{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}Базове пространство імен{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}Обмежене пространство імен{{< /example >}}

### Альтернативи {#alternatives}

{{% thirdparty-content %}}

Інші альтернативи для виконання політик розробляються в екосистемі Kubernetes, такі як:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies/pod-security/)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## Поле OS Podʼа {#pod-os-field}

У Kubernetes ви можете використовувати вузли, які працюють на операційних системах Linux або Windows. Ви можете комбінувати обидва типи вузлів в одному кластері. Windows в Kubernetes має деякі обмеження та відмінності від навантаженнь на базі Linux. Зокрема, багато з полів `securityContext` для контейнерів Pod [не мають ефекту у Windows](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext).

{{< note >}}
Kubelet до версії v1.24 не здійснює контроль над полем OS для Pod, і якщо в кластері є вузли з версіями під номерами менше v1.24, політики Restricted повинні бути привʼязані до версії до v1.25.
{{< /note >}}

### Зміни в стандарті обмеження безпеки Pod {#restricted-pod-security-standard-changes}

Ще одна важлива зміна, внесена в Kubernetes v1.25, полягає в тому, що _Restricted_ політики були оновлені для використання поля `pod.spec.os.name`. Залежно від назви ОС, деякі політики, які специфічні для певної ОС, можуть бути послаблені для іншої ОС.

#### Елементи політики, специфічні для ОС {#os-specific-policy-controls}

Обмеження для наступних елементів є обовʼязковими лише в разі, якщо `.spec.os.name` не є `windows`:
- Підвищення привілеїв
- Seccomp
- Linux Capabilities

## Простори імен користувачів {#user-namespaces}

Простори імен користувачів — це функція лише для операційних систем Linux, яка дозволяє запускати завдання з підвищеним рівнем ізоляції. Як вони працюють разом зі стандартами безпеки Pod описано в [документації](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks) Podʼів, що використовують простори імен користувачів.

## ЧаПи {#faq}

### Чому відсутній профіль між Privileged та Baseline? {#why-isn-t-there-a-profile-between-privileged-and-baseline}

Три профілі, що визначені тут, мають чітку лінійну прогресію від найбільш безпечного (Restricted) до найменш безпечного (Privileged) і охоплюють широкий набір завдань. Привілеї, необхідні вище baseline, зазвичай є дуже специфічними для застосунку, тому ми не пропонуємо стандартний профіль у цій області. Це не означає, що профіль privileged завжди має використовуватися в цьому випадку, але політику в цій області потрібно визначати індивідуально для кожного випадку.

SIG Auth може переосмислити цю позицію у майбутньому, якщо зʼявиться чітка потреба у інших профілях.

### В чому різниця між профілем безпеки та контекстом безпеки? {#what-s-the-difference-between-a-security-profile-and-a-security-context}

[Контексти безпеки](/docs/tasks/configure-pod-container/security-context/) налаштовують Podʼи та контейнери під час виконання. Контексти безпеки визначаються як частина специфікації Podʼа та контейнера в маніфесті Podʼа і представляють параметри для контейнерного середовища виконання.

Профілі безпеки — це механізми керування панелі управління для забезпечення певних налаштувань у контексті безпеки, а також інших повʼязаних параметрів поза контекстом безпеки. На даний момент, з липня 2021 року, [Політики безпеки Podʼів](/docs/concepts/security/pod-security-policy/) є застарілими на користь вбудованого [Контролера Pod Security Admission](/docs/concepts/security/pod-security-admission/).

### Що на рахунок Podʼів у пісочниці? {#what-about-sandboxed-pods}

Наразі не існує стандартного API, що контролює, чи знаходиться Pod у пісочниці, чи ні. Podʼи у пісочниці можуть бути ідентифіковані за допомогою використання середовища виконання пісочниці (такого як gVisor або Kata Containers), але немає стандартного визначення того, що таке середовище виконання пісочниці.

Захист, необхідний для робочих навантажень у пісочниці, може відрізнятися від інших. Наприклад, необхідність обмежити привілейовані дозволи менше, коли робоче навантаження ізольоване від базового ядра. Це дозволяє робочим навантаженням, що потребують підвищених дозволів, залишатися ізольованими.

Крім того, захист робочих навантажень у пісочниці сильно залежить від методу розташування у пісочниці. Таким чином, для всіх робочих навантажень у пісочниці не надається один рекомендований профіль.
