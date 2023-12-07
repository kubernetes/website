---
title: Podセキュリティの標準
content_type: concept
weight: 10
---

<!-- overview -->

Podに対するセキュリティの設定は通常[Security Context](/docs/tasks/configure-pod-container/security-context/)を使用して適用されます。Security ContextはPod単位での特権やアクセスコントロールの定義を実現します。

クラスターにおけるSecurity Contextの強制やポリシーベースの定義は[Pod Security Policy](/docs/concepts/policy/pod-security-policy/)によって実現されてきました。
_Pod Security Policy_ はクラスターレベルのリソースで、Pod定義のセキュリティに関する設定を制御します。

しかし、PodSecurityPolicyを拡張したり代替する、ポリシーを強制するための多くの方法が生まれてきました。
このページの意図は、推奨されるPodのセキュリティプロファイルを特定の実装から切り離して詳しく説明することです。



<!-- body -->

## ポリシーの種別

まず、幅広いセキュリティの範囲をカバーできる、基礎となるポリシーの定義が必要です。
それらは強く制限をかけるものから自由度の高いものまでをカバーすべきです。

- **_特権_** - 制限のかかっていないポリシーで、可能な限り幅広い権限を提供します。このポリシーは既知の特権昇格を認めます。
- **_ベースライン、デフォルト_** - 制限は最小限にされたポリシーですが、既知の特権昇格を防止します。デフォルト（最小の指定）のPod設定を許容します。
- **_制限_** - 厳しく制限されたポリシーで、Podを強化するための現在のベストプラクティスに沿っています。

## ポリシー

### 特権

特権ポリシーは意図的に開放されていて、完全に制限がかけられていません。この種のポリシーは通常、特権ユーザーまたは信頼されたユーザーが管理する、システムまたはインフラレベルのワークロードに対して適用されることを意図しています。

特権ポリシーは制限がないことと定義されます。gatekeeperのようにデフォルトで許可される仕組みでは、特権プロファイルはポリシーを設定せず、何も制限を適用しないことにあたります。
一方で、Pod Security Policyのようにデフォルトで拒否される仕組みでは、特権ポリシーでは全ての制限を無効化してコントロールできるようにする必要があります。

### ベースライン、デフォルト

ベースライン、デフォルトのプロファイルは一般的なコンテナ化されたランタイムに適用しやすく、かつ既知の特権昇格を防ぐことを意図しています。
このポリシーはクリティカルではないアプリケーションの運用者または開発者を対象にしています。
次の項目は強制、または無効化すべきです。

<table>
	<caption style="display:none">ベースラインポリシーの定義</caption>
	<tbody>
		<tr>
			<td><strong>項目</strong></td>
			<td><strong>ポリシー</strong></td>
		</tr>
    <tr>
			<td>ホストのプロセス</td>
			<td>
        <p>Windows Podは、Windowsノードへの特権的なアクセスを可能にする<a href="/docs/tasks/configure-pod-container/create-hostprocess-pod">HostProcess</a>コンテナ</a>を実行する機能を提供します。ベースラインポリシーでは、ホストへの特権的なアクセスは禁止されています。HostProcess Podは、Kubernetes v1.22時点ではアルファ版の機能です。
				ホストのネームスペースの共有は無効化すべきです。</p>
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
			<td>ホストのネームスペース</td>
			<td>
				ホストのネームスペースの共有は無効化すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.hostNetwork<br>
				spec.hostPID<br>
				spec.hostIPC<br>
				<br><b>認められる値:</b> false, Undefined/nil<br>
			</td>
		</tr>
		<tr>
			<td>特権コンテナ</td>
			<td>
				特権を持つPodはほとんどのセキュリティ機構を無効化できるので、禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.containers[*].securityContext.privileged<br>
				spec.initContainers[*].securityContext.privileged<br>
        spec.ephemeralContainers[*].securityContext.privileged<br>
				<br><b>認められる値:</b> false, undefined/nil<br>
			</td>
		</tr>
		<tr>
			<td>ケーパビリティー</td>
			<td>
				<a href="https://docs.docker.com/engine/reference/run/#runtime-privilege-and-linux-capabilities">デフォルト</a>よりも多くのケーパビリティーを与えることは禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.containers[*].securityContext.capabilities.add<br>
				spec.initContainers[*].securityContext.capabilities.add<br>
        spec.ephemeralContainers[*].securityContext.capabilities.add<br>
				<br><b>認められる値:</b>
					Undefined/nil<br>
					AUDIT_WRITE<br>
					CHOWN<br>
					DAC_OVERRIDE<br>
					FOWNER<br>
					FSETID<br>
					KILL<br>
					MKNOD<br>
					NET_BIND_SERVICE<br>
					SETFCAP<br>
					SETGID<br>
					SETPCAP<br>
					SETUID<br>
					SYS_CHROOT<br>
			</td>
		</tr>
		<tr>
			<td>HostPathボリューム</td>
			<td>
				HostPathボリュームは禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.volumes[*].hostPath<br>
				<br><b>認められる値:</b> undefined/nil<br>
			</td>
		</tr>
		<tr>
			<td>ホストのポート</td>
			<td>
				HostPortは禁止するか、最小限の既知のリストに限定すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.containers[*].ports[*].hostPort<br>
				spec.initContainers[*].ports[*].hostPort<br>
        spec.ephemeralContainers[*].ports[*].hostPort<br>
				<br><b>認められる値:</b> 0, undefined (または既知のリストに限定)<br>
			</td>
		</tr>
		<tr>
			<td>AppArmor<em>(任意)</em></td>
			<td>
				サポートされるホストでは、AppArmorの'runtime/default'プロファイルがデフォルトで適用されます。デフォルトのポリシーはポリシーの上書きや無効化を防ぎ、許可されたポリシーのセットを上書きできないよう制限すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				metadata.annotations['container.apparmor.security.beta.kubernetes.io/*']<br>
				<br><b>認められる値:</b> 'runtime/default', undefined, localhost/*<br>
			</td>
		</tr>
		<tr>
			<td>SELinux <em>(任意)</em></td>
			<td>
				SELinuxのオプションをカスタムで設定することは禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.securityContext.seLinuxOptions<br>
				spec.containers[*].securityContext.seLinuxOptions<br>
				spec.initContainers[*].securityContext.seLinuxOptions<br>
        spec.ephemeralContainers[*].securityContext.seLinuxOptions.type<br>
				<br><b>認められる値:</b>undefined/nil<br>
        Undefined/""<br>
        container_t<br>
        container_init_t<br>
        container_kvm_t<br>
        <hr />
        <br><b>制限されるフィールド:</b><br>
        spec.securityContext.seLinuxOptions.user<br>
        spec.containers[*].securityContext.seLinuxOptions.user<br>
        spec.initContainers[*].securityContext.seLinuxOptions.user<br>
        spec.ephemeralContainers[*].securityContext.seLinuxOptions.user<br>
        spec.securityContext.seLinuxOptions.role<br>
        spec.containers[*].securityContext.seLinuxOptions.role<br>
        spec.initContainers[*].securityContext.seLinuxOptions.role<br>
        spec.ephemeralContainers[*].securityContext.seLinuxOptions.role<br>
        <br><b>認められる値:</b>undefined/nil<br>
        Undefined/""        
			</td>
		</tr>
		<tr>
			<td>/procマウントタイプ</td>
			<td>
				攻撃対象を縮小するため/procのマスクを設定し、必須とすべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.containers[*].securityContext.procMount<br>
				spec.initContainers[*].securityContext.procMount<br>
        spec.ephemeralContainers[*].securityContext.procMount<br>
				<br><b>認められる値:</b>undefined/nil, 'Default'<br>
			</td>
		</tr>
    <tr>
      <td>Seccomp</td>
  			<td>
          <p>Seccompプロファイルを明示的に<code>Unconfined</code>に設定することはできません。</p>
  				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.securityContext.seccompProfile.type</code></li>
					<li><code>spec.containers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.initContainers[*].securityContext.seccompProfile.type</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.seccompProfile.type</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Undefined/nil</li>
					<li><code>RuntimeDefault</code></li>
					<li><code>Localhost</code></li>
				</ul>
  			</td>
    </tr>
		<tr>
			<td>Sysctl</td>
			<td>
				Sysctlはセキュリティ機構を無効化したり、ホストの全てのコンテナに影響を与えたりすることが可能なので、「安全」なサブネットを除いては禁止すべきです。
				コンテナまたはPodの中にsysctlがありネームスペースが分離されていて、同じノードの別のPodやプロセスから分離されている場合はsysctlは安全だと考えられます。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.securityContext.sysctls<br>
				<br><b>認められる値:</b><br>
				kernel.shm_rmid_forced<br>
				net.ipv4.ip_local_port_range<br>
				net.ipv4.tcp_syncookies<br>
				net.ipv4.ping_group_range<br>
				undefined/空文字列<br>
			</td>
		</tr>
	</tbody>
</table>

### 制限

制限ポリシーはいくらかの互換性を犠牲にして、Podを強化するためのベストプラクティスを強制することを意図しています。
セキュリティ上クリティカルなアプリケーションの運用者や開発者、また信頼度の低いユーザーも対象にしています。
下記の項目を強制、無効化すべきです。


<table>
	<caption style="display:none">制限ポリシーの定義</caption>
	<tbody>
		<tr>
			<td><strong>項目</strong></td>
			<td><strong>ポリシー</strong></td>
		</tr>
		<tr>
			<td colspan="2"><em>デフォルトプロファイルにある項目全て</em></td>
		</tr>
		<tr>
			<td>Volumeタイプ</td>
			<td>
				HostPathボリュームの制限に加え、制限プロファイルではコアでない種類のボリュームの利用をPersistentVolumeにより定義されたものに限定します。<br>
				<br><b>制限されるフィールド:</b><br>
				  spec.volumes[*].hostPath<br>
          spec.volumes[*].gcePersistentDisk<br>
          spec.volumes[*].awsElasticBlockStore<br>
          spec.volumes[*].gitRepo<br>
          spec.volumes[*].nfs<br>
          spec.volumes[*].iscsi<br>
          spec.volumes[*].glusterfs<br>
          spec.volumes[*].rbd<br>
          spec.volumes[*].flexVolume<br>
          spec.volumes[*].cinder<br>
          spec.volumes[*].cephfs<br>
          spec.volumes[*].flocker<br>
          spec.volumes[*].fc<br>
          spec.volumes[*].azureFile<br>
          spec.volumes[*].vsphereVolume<br>
          spec.volumes[*].quobyte<br>
          spec.volumes[*].azureDisk<br>
          spec.volumes[*].portworxVolume<br>
          spec.volumes[*].scaleIO<br>
          spec.volumes[*].storageos<br>
          spec.volumes[*].photonPersistentDisk<br>
				<br><b>認められる値:</b> undefined/nil<br>
			</td>
		</tr>
		<tr>
			<td>特権昇格</td>
			<td>
				特権昇格(ファイルモードのset-user-IDまたはset-group-IDのような方法による)は禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.containers[*].securityContext.allowPrivilegeEscalation<br>
				spec.initContainers[*].securityContext.allowPrivilegeEscalation<br>
        spec.ephemeralContainers[*].securityContext.allowPrivilegeEscalation<br>
				<br><b>認められる値:</b> false<br>
			</td>
		</tr>
		<tr>
			<td>root以外での実行</td>
			<td>
				コンテナはroot以外のユーザーで実行する必要があります。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.securityContext.runAsNonRoot<br>
				spec.containers[*].securityContext.runAsNonRoot<br>
				spec.initContainers[*].securityContext.runAsNonRoot<br>
        spec.ephemeralContainers[*].securityContext.runAsNonRoot<br>
				<br><b>認められる値:</b> true<br>
			</td>
		</tr>
		<tr>
			<td>root以外のグループ <em>(任意)</em></td>
			<td>
				コンテナをrootのプライマリまたは補助GIDで実行することを禁止すべきです。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.securityContext.runAsGroup<br>
				spec.securityContext.supplementalGroups[*]<br>
				spec.securityContext.fsGroup<br>
				spec.containers[*].securityContext.runAsGroup<br>
				spec.initContainers[*].securityContext.runAsGroup<br>
				<br><b>認められる値:</b><br>
				0以外<br>
				undefined / nil (`*.runAsGroup`を除く)<br>
			</td>
		</tr>
		<tr>
			<td>Seccomp</td>
			<td>
				SeccompのRuntimeDefaultを必須とする、または特定の追加プロファイルを許可することが必要です。<br>
				<br><b>制限されるフィールド:</b><br>
				spec.securityContext.seccompProfile.type<br>
				spec.containers[*].securityContext.seccompProfile<br>
				spec.initContainers[*].securityContext.seccompProfile<br>
				<br><b>認められる値:</b><br>
				'runtime/default'<br>
				undefined / nil<br>
			</td>
		</tr>
    <tr>
			<td style="white-space: nowrap">Capabilities (v1.22+)</td>
			<td>
				<p>
					コンテナはすべてのケイパビリティを削除する必要があり、<code>NET_BIND_SERVICE</code>ケイパビリティを追加することだけが許可されています。
				</p>
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.drop</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.drop</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
				<ul>
					<li>Any list of capabilities that includes <code>ALL</code></li>
				</ul>
				<hr />
				<p><strong>Restricted Fields</strong></p>
				<ul>
					<li><code>spec.containers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.initContainers[*].securityContext.capabilities.add</code></li>
					<li><code>spec.ephemeralContainers[*].securityContext.capabilities.add</code></li>
				</ul>
				<p><strong>Allowed Values</strong></p>
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

機構が成熟してきたら、ポリシーごとに下記に定義されます。それぞれのポリシーを強制する方法についてはここでは定義しません。

[**PodSecurityPolicy**](/docs/concepts/policy/pod-security-policy/)

- [特権](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/privileged-psp.yaml)
- [ベースライン](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/baseline-psp.yaml)
- [制限](https://raw.githubusercontent.com/kubernetes/website/master/content/en/examples/policy/restricted-psp.yaml)

## FAQ

### 特権とデフォルトの間のプロファイルがないのはどうしてですか?

ここで定義されている3つのプロファイルは最も安全(制限)から最も安全ではない(特権)まで、直線的に段階が設定されており、幅広いワークロードをカバーしています。
ベースラインを超える特権が必要な場合、その多くはアプリケーションに特化しているため、その限られた要求に対して標準的なプロファイルを提供することはできません。
これは、このような場合に必ず特権プロファイルを使用すべきだという意味ではなく、場合に応じてポリシーを定義する必要があります。

将来、他のプロファイルの必要性が明らかになった場合、SIG Authはこの方針について再考する可能性があります。

### セキュリティポリシーとセキュリティコンテキストの違いは何ですか?

[Security Context](/docs/tasks/configure-pod-container/security-context/)は実行時のコンテナやPodを設定するものです。
Security ContextはPodのマニフェストの中でPodやコンテナの仕様の一部として定義され、コンテナランタイムへ渡されるパラメーターを示します。

セキュリティポリシーはコントロールプレーンの機構で、Security Contextとそれ以外も含め、特定の設定を強制するものです。
2020年2月時点では、ネイティブにサポートされているポリシー強制の機構は[Pod Security
Policy](/docs/concepts/policy/pod-security-policy/)です。これはクラスター全体にわたってセキュリティポリシーを中央集権的に強制するものです。
セキュリティポリシーを強制する他の手段もKubernetesのエコシステムでは開発が進められています。例えば[OPA
Gatekeeper](https://github.com/open-policy-agent/gatekeeper)があります。

### WindowsのPodにはどのプロファイルを適用すればよいですか?

Kubernetesでは、Linuxベースのワークロードと比べてWindowsの使用は制限や差異があります。
特に、PodのSecurityContextフィールドは[Windows環境では効果がありません](/ja/docs/setup/production-environment/windows/intro-windows-in-kubernetes/#v1-podsecuritycontext)。
したがって、現段階では標準化されたセキュリティポリシーは存在しません。

Windows Podに制限付きプロファイルを適用すると、実行時にPodに影響が出る場合があります。
制限付きプロファイルでは、Linux固有の制限(seccompプロファイルや特権昇格の不許可など)を適用する必要があります。
kubeletおよび/またはそのコンテナランタイムがこれらのLinux固有の値を無視した場合、Windows Podは制限付きプロファイル内で正常に動作します。
ただし、強制力がないため、Windows コンテナを使用するPodについては、ベースラインプロファイルと比較して追加の制限はありません。

HostProcess Podを作成するためのHostProcessフラグの使用は、特権的なポリシーに沿ってのみ行われるべきです。
Windows HostProcess Podの作成は、ベースラインおよび制限されたポリシーの下でブロックされているため、いかなるHostProcess Podも特権的であるとみなされるべきです。

### サンドボックス化されたPodはどのように扱えばよいでしょうか?

現在のところ、Podがサンドボックス化されていると見なされるかどうかを制御できるAPI標準はありません。
サンドボックス化されたPodはサンドボックス化されたランタイム（例えばgVisorやKata Containers）の使用により特定することは可能ですが、サンドボックス化されたランタイムの標準的な定義は存在しません。

サンドボックス化されたランタイムに対して必要な保護は、それ以外に対するものとは異なります。
例えば、ワークロードがその基になるカーネルと分離されている場合、特権を制限する必要性は小さくなります。
これにより、強い権限を必要とするワークロードが隔離された状態を維持できます。

加えて、サンドボックス化されたワークロードの保護はサンドボックス化の実装に強く依存します。
したがって、全てのサンドボックス化されたワークロードに推奨される単一のポリシーは存在しません。
