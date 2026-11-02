---
title: Podセキュリティの標準
content_type: concept
weight: 10
---

<!-- overview -->

Podセキュリティ標準はセキュリティを幅広くカバーするための3つの _ポリシー_ を定義します。
3つのポリシーは _累積的_ で、強く制限をかけるものから自由度の高いものまで及びます。
このガイドでは各ポリシーの概要を説明します。

| プロファイル | 説明 |
| ------ | ----------- |
| <strong style="white-space: nowrap">特権</strong> | 制限のかかっていないポリシーで、可能な限り幅広い権限を提供します。このポリシーは既知の特権昇格を認めます。 |
| <strong style="white-space: nowrap">ベースライン</strong> | 制限は最小限にされたポリシーですが、既知の特権昇格を防止します。デフォルト（最小の指定）のPod設定を許容します。 |
| <strong style="white-space: nowrap">制限</strong> | 厳しく制限されたポリシーで、Podを強化するための現在のベストプラクティスに沿っています。 |

<!-- body -->

## プロファイルの詳細

### 特権

** _特権_ ポリシーは意図的に開放されていて、完全に制限がかけられていません。**
この種のポリシーは通常、特権ユーザーまたは信頼されたユーザーが管理する、システムまたはインフラレベルのワークロードに対して適用されることを意図しています。

特権ポリシーは制限がないことと定義されます。
特権セキュリティポリシーの適用されたPodを定義すると、そのPodは典型的なコンテナの隔離メカニズムをバイパスすることができます。
例えば、ノードのホストネットワークにアクセスできるPodを定義することもできます。

### ベースライン

** _ベースライン_ ポリシーは、一般的なコンテナ化されたランタイムに適用しやすく、かつ既知の特権昇格を防ぐことを意図しています。**
このポリシーはクリティカルではないアプリケーションの運用者または開発者を対象にしています。
次の項目は強制、または無効化すべきです。

{{< note >}}
この表では、ワイルドカード(`*`)はリスト内のすべての要素を意味します。
例えば、`spec.containers[*].securityContext`は_定義されたすべてのコンテナ_に対するセキュリティコンテキストオブジェクトを指します。
もしもリスト内のいずれかのコンテナが要件を満たさなければ、Pod全体が検証に失敗します。
{{< /note >}}

<table>
	<caption style="display:none">ベースラインポリシーの定義</caption>
	<tbody>
		<tr>
			<td><strong>項目</strong></td>
			<td><strong>ポリシー</strong></td>
		</tr>
    	<tr>
			<td style="white-space: nowrap">ホストのプロセス</td>
			<td>
        		<p>Windows Podは、Windowsノードへの特権的なアクセスを可能にする<a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcessコンテナ</a>を実行する機能を提供します。
				ベースラインポリシーでは、ホストへの特権的なアクセスは禁止されています。
				{{< feature-state for_k8s_version="v1.26" state="stable" >}}</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.containers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.initContainers[*].securityContext.windowsOptions.hostProcess</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.windowsOptions.hostProcess</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">ホストの名前空間</td>
			<td>
				<p>ホストの名前空間の共有は無効化すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.hostNetwork</code></li>
					<li><code>spec.hostPID</code></li>
					<li><code>spec.hostIPC</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">特権コンテナ</td>
			<td>
				<p>特権を持つPodはほとんどのセキュリティ機構を無効化できるので、禁止すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.privileged</code></li>
					<li><code>spec.initContainers[*].securityContext.privileged</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.privileged</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">ケーパビリティ</td>
			<td>
				<p>以下に記載された以外のケーパビリティを与えることは禁止すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
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
			<td style="white-space: nowrap">HostPathボリューム</td>
			<td>
				<p>HostPathボリュームは禁止すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.volumes[*].hostPath</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">ホストのポート</td>
			<td>
				<p>HostPortは完全に禁止するか（推奨）、最小限の既知のリストに限定すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].ports[*].hostPort</code></li>
					<li><code>spec.initContainers[*].ports[*].hostPort</code></li>
					<li><code>spec.ephemeralContainers[*].ports[*].hostPort</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>Known list (組み込みの<a href="/docs/concepts/security/pod-security-admission/">Pod Security Admission controller</a>では未サポート)</li>
					<li><code>0</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td>ホストのProbe / ライフサイクルフック (v1.34+)</td>
			<td>
				<p>Probeとライフサイクルフックのhostフィールドは禁止すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
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
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li>""</li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">AppArmor</td>
			<td>
				<p>サポートされるホストでは、AppArmorの<code>RuntimeDefault</code>プロファイルがデフォルトで適用されます。
				ベースラインのポリシーはデフォルトのAppArmorプロファイルの上書きや無効化を防ぎ、許可されたプロファイルのセットを上書きできないよう制限すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.appArmorProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.appArmorProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.appArmorProfile.type</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<hr />
				<ul>
					<li><code>metadata.annotations["container.apparmor.security.beta.kubernetes.io/*"]</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
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
				<p>SELinuxのtypeを設定することは制限し、SELinuxのユーザーやロールをカスタムで設定することは禁止すべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.containers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seLinuxOptions.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seLinuxOptions.type</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/""</li>
					<li><code>container_t</code></li>
					<li><code>container_init_t</code></li>
					<li><code>container_kvm_t</code></li>
					<li><code>container_engine_t</code> (since Kubernetes 1.31)</li>
				</ul>
				<hr />
				<p><strong>制限されるフィールド</strong></p>
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
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/""</li>
				</ul> 
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap"><code>/proc</code>マウントタイプ</td>
			<td>
				<p>攻撃対象を縮小するためデフォルトの<code>/proc</code>のマスクを設定し、必須とすべきです。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.procMount</code></li>
					<li><code>spec.initContainers[*].securityContext.procMount</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.procMount</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>Default</code></li>
				</ul>
			</td>
		</tr>
    <tr>
    	<td>Seccomp</td>
	  	<td>
          <p>Seccompプロファイルを明示的に<code>Unconfined</code>に設定することはできません。</p>
  				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  		</td>
    </tr>
		<tr>
			<td style="white-space: nowrap">Sysctl</td>
			<td>
				<p>Sysctlはセキュリティ機構を無効化したり、ホストの全てのコンテナに影響を与えたりすることが可能なので、「安全」なサブセットを除いては禁止すべきです。
				コンテナまたはPodの中にsysctlがあり名前空間が分離されていて、同じノードの別のPodやプロセスから分離されている場合はsysctlは安全だと考えられます。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.sysctls[*].name</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>kernel.shm_rmid_forced</code></li>
					<li><code>net.ipv4.ip_local_port_range</code></li>
					<li><code>net.ipv4.ip_unprivileged_port_start</code></li>
					<li><code>net.ipv4.tcp_syncookies</code></li>
					<li><code>net.ipv4.ping_group_range</code></li>
					<li><code>net.ipv4.ip_local_reserved_ports</code> (since Kubernetes 1.27)</li>
					<li><code>net.ipv4.tcp_keepalive_time</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_fin_timeout</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_intvl</code> (since Kubernetes 1.29)</li>
					<li><code>net.ipv4.tcp_keepalive_probes</code> (since Kubernetes 1.29)</li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

### 制限

** _制限_ ポリシーはいくらかの互換性を犠牲にして、Podを強化するためのベストプラクティスを強制することを意図しています。**
セキュリティ上クリティカルなアプリケーションの運用者や開発者、また信頼度の低いユーザーも対象にしています。
下記の項目を強制、無効化すべきです。

{{< note >}}
この表では、ワイルドカード(`*`)はリスト内のすべての要素を意味します。
例えば、`spec.containers[*].securityContext`は_定義されたすべてのコンテナ_に対するセキュリティコンテキストオブジェクトを指します。
もしもリスト内のいずれかのコンテナが要件を満たさなければ、Pod全体が検証に失敗します。
{{< /note >}}

<table>
	<caption style="display:none">制限ポリシーの定義</caption>
	<tbody>
		<tr>
			<td><strong>項目</strong></td>
			<td><strong>ポリシー</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>ベースラインポリシーにある項目全て</em></td>
		</tr>
		<tr>
			<td style="white-space: nowrap">Volumeタイプ</td>
			<td>
				<p>制限ポリシーでは以下のVolumeタイプのみを許可します。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.volumes[*]</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<code>spec.volumes[*]</code> リストのすべての項目では、以下のいずれかのフィールドにnullでない値が設定される必要があります:
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
			<td style="white-space: nowrap">特権昇格(v1.8+)</td>
			<td>
				<p>特権昇格(ファイルモードのset-user-IDまたはset-group-IDのような方法による)は禁止すべきです。
				v1.25以降では、<em><a href="#os-specific-policy-controls">これはLinuxのみのポリシーです</a><code>(spec.os.name != windows)</code></em></p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.initContainers[*].securityContext.allowPrivilegeEscalation</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li><code>false</code></li>
				</ul>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">root以外のユーザーでの実行</td>
			<td>
				<p>コンテナはroot以外のユーザーで実行する必要があります。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsNonRoot</code></li>
					<li><code>spec.containers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsNonRoot</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsNonRoot</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li><code>true</code></li>
				</ul>
				<small>
					Podレベルの<code>spec.securityContext.runAsNonRoot</code>に<code>true</code>が設定される場合、コンテナフィールドはundefined/<code>nil</code>でも認められます。
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">root以外のユーザーでの実行(v1.23+)</td>
			<td>
				<p>コンテナは<tt>runAsUser</tt>を0に設定することはできません。</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.runAsUser</code></li>
				    <li><code>spec.containers[*].securityContext.runAsUser</code></li>
					<li><code>spec.initContainers[*].securityContext.runAsUser</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.runAsUser</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>0以外</li>
					<li><code>undefined/null</code></li>
				</ul>
			</td>
		</tr>
		<tr>
  			<td style="white-space: nowrap">Seccomp (v1.19+)</td>
			<td>
				<p>Seccompプロファイルは認められる値の一つを明示的に設定する必要があります。
				<code>Unconfined</code>プロファイルと<em>未設定</em>のどちらも禁止されています。
				v1.25以降では、<em><a href="#os-specific-policy-controls">これはLinuxのみのポリシーです</a><code>(spec.os.name != windows)</code></em></p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
				<small>
					Podレベルの<code>spec.securityContext.seccompProfile.type</code>が適切に設定される場合、コンテナフィールドはundefined/<code>nil</code>でも認められます。
					逆に、もし _全ての_ コンテナレベルのフィールドが設定される場合、Podレベルのフィールドはundefined/<code>nil</code>でも認められます。
				</small>
			</td>
		</tr>
		<tr>
			<td style="white-space: nowrap">ケーパビリティ(v1.22+)</td>
			<td>
				<p>
					コンテナはすべてのケーパビリティを削除する必要があり、<code>NET_BIND_SERVICE</code>のケーパビリティを追加することだけが許可されています。
					v1.25以降では、<em><a href="#os-specific-policy-controls">これはLinuxのみのポリシーです</a><code>(spec.os.name != windows)</code></em>
				</p>
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li><code>ALL</code>を含む全てのケーパビリティ</li>
				</ul>
				<hr />
				<p><strong>制限されるフィールド</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>認められる値</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>NET_BIND_SERVICE</code></li>
				</ul>
			</td>
		</tr>
	</tbody>
</table>

## ポリシーの実例

ポリシーの定義とポリシーの実装を切り離すことによって、ポリシーを強制する機構とは独立して、汎用的な理解や複数のクラスターにわたる共通言語とすることができます。

機構が成熟してきたら、ポリシーごとに下記に定義されます。
それぞれのポリシーを強制する方法についてはここでは定義しません。

[**Pod Security Admission Controller**](/docs/concepts/security/pod-security-admission/)

- {{< example file="security/podsecurity-privileged.yaml" >}}特権namespace{{< /example >}}
- {{< example file="security/podsecurity-baseline.yaml" >}}ベースラインnamespace{{< /example >}}
- {{< example file="security/podsecurity-restricted.yaml" >}}制限namespace{{< /example >}}

### 代替の方法

{{% thirdparty-content %}}

Kubernetesのエコシステムの中で開発されているポリシーを強制するための代替の方法には、以下のようなものがあります:

- [Kubewarden](https://github.com/kubewarden)
- [Kyverno](https://kyverno.io/policies)
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper)

## PodのOSフィールド

KubernetesではLinuxとWindowsの動作するノードをどちらも利用できます。
両方の種類のノードを一つのクラスターに混在させることもできます。
Kubernetesにおいて、WindowsはLinuxベースのワークロードと比べ制限事項や相違点があります。
具体的には、Podの`securityContext`フィールドの多くは[Windowsでは効果がありません](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)。

{{< note >}}
v1.24以前のKubeletはPodのOSフィールドを強制しないため、もしもクラスターにv1.24以前のバージョンのノードがある場合は、制限ポリシーはv1.25以前に固定されるべきです。
{{< /note >}}

### Podセキュリティの標準における制限ポリシーの変更点

Kubernetes v1.25での他の重要な変更点として、 _制限_ ポリシーは`pod.spec.os.name`フィールドを使用するようにアップデートされました。
OS名に基づき、OS固有の特定のポリシーが他のOSでは緩和されるようになりました。

#### OS固有のポリシー制御
以下の制御における制限は、`.spec.os.name`が`windows`でないときのみ要求されます:
- 特権昇格
- Seccomp
- Linuxケーパビリティ

## ユーザー名前空間

ユーザー名前空間はLinux固有の機能であり、ワークロードをより高度に隔離します。
ユーザー名前空間を使用するPodが、Podセキュリティの標準と一緒に動作する仕組みは[ドキュメント](/docs/concepts/workloads/pods/user-namespaces#integration-with-pod-security-admission-checks)に記載されています。

## FAQ

### 特権とベースラインの間のプロファイルがないのはどうしてですか?

ここで定義されている3つのプロファイルは最も安全(制限)から最も安全ではない(特権)まで、直線的に段階が設定されており、幅広いワークロードをカバーしています。
ベースラインを超える特権が必要な場合、その多くはアプリケーションに特化しているため、その限られた要求に対して標準的なプロファイルを提供することはできません。
これは、このような場合に必ず特権プロファイルを使用すべきだという意味ではなく、場合に応じてポリシーを定義する必要があります。

将来、他のプロファイルの必要性が明らかになった場合、SIG Authはこの方針について再考する可能性があります。

### セキュリティプロファイルとセキュリティコンテキストの違いは何ですか?

[Security Context](/docs/tasks/configure-pod-container/security-context/)は実行時のコンテナやPodを設定するものです。
Security ContextはPodのマニフェストの中でPodやコンテナの仕様の一部として定義され、コンテナランタイムへ渡されるパラメーターを示します。

セキュリティポリシーはコントロールプレーンの機構で、Security Contextとそれ以外も含め、特定の関連する設定を強制するものです。
2021年7月時点で、[Podセキュリティポリシー](/docs/concepts/policy/pod-security-policy/)は非推奨であり、組み込みの[Podセキュリティアドミッションコントローラー](/docs/concepts/security/pod-security-admission/)に移行しました。


### サンドボックス化されたPodはどのように扱えばよいでしょうか?

現在のところ、Podがサンドボックス化されていると見なされるかどうかを制御できるAPI標準はありません。
サンドボックス化されたPodはサンドボックス化されたランタイム（例えばgVisorやKata Containers）の使用により特定することは可能ですが、サンドボックス化されたランタイムの標準的な定義は存在しません。

サンドボックス化されたランタイムに対して必要な保護は、それ以外に対するものとは異なります。
例えば、ワークロードがその基になるカーネルと分離されている場合、特権を制限する必要性は小さくなります。
これにより、強い権限を必要とするワークロードが隔離された状態を維持できます。

加えて、サンドボックス化されたワークロードの保護はサンドボックス化の実装に強く依存します。
したがって、全てのサンドボックス化されたワークロードに推奨される単一のポリシーは存在しません。
