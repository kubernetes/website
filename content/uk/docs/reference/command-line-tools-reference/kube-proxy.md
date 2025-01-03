---
title: kube-proxy
content_type: tool-reference
weight: 30
auto_generated: true
---

## {{% heading "synopsis" %}}

Мережевий проксі-сервер Kubernetes працює на кожному вузлі. Це відображає сервіси, визначені у Kubernetes API, на кожному вузлі і може виконувати просте перенаправлення потоків TCP, UDP і SCTP або циклічне перенаправлення TCP, UDP і SCTP через набір бекендів. Наразі IP-адреси та порти кластерів обслуговування можна знайти за допомогою сумісних з Docker-посиланнями змінні оточення, що визначають порти, відкриті проксі-сервісом. Існує надбудова яка надає кластерний DNS для цих кластерних IP-адрес. Користувач повинен створити сервіс за допомогою API apiserver, щоб налаштувати проксі.

```shell
kube-proxy [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
   <colgroup>
      <col span="1" style="width: 10px;" />
      <col span="1" />
   </colgroup>
   <tbody>
      <tr>
         <td colspan="2">--add_dir_header</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, додає теку файлу до заголовка повідомлень логу</p></td>
      </tr>
      <tr>
         <td colspan="2">--alsologtostderr</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>виводити лог до stderr, а також у файли (не має ефекту, якщо -logtostderr=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Перевизначає уявлення kube-proxy про первинну IP-адресу вузла. Зауважте, що назва є історичним артефактом, і kube-proxy насправді не привʼязує жодних сокетів до цього IP. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--bind-address-hard-fail</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, kube-proxy розцінить невдалу спробу звʼязатися з портом як фатальну і завершить роботу</p></td>
      </tr>
      <tr>
         <td colspan="2">--cleanup</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, очистіть iptables та правила ipvs і вийдіть.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cluster-cidr string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Діапазон CIDR для Podʼів у кластері. (Для двостекових кластерів це може бути пара діапазонів CIDR, розділених комами). Коли --detect-local-mode має значення ClusterCIDR, kube-proxy вважатиме трафік локальним, якщо IP-адреса його джерела знаходиться в цьому діапазоні. (В іншому випадку він не використовується.) Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--config-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Як часто оновлюється конфігурація з apiserver. Повинно бути більше 0.</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-max-per-core int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 32768</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість NAT-зʼєднань для відстеження на одне ядро процесора (0 — залишити ліміт як є і ігнорувати conntrack-min).</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-min int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 131072</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна кількість записів conntrack для розподілу, незалежно від conntrack-max-per-core (встановіть conntrack-max-per-core=0, щоб залишити обмеження без змін).</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-tcp-be-liberal</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть ліберальний режим відстеження TCP-пакетів, встановивши nf_conntrack_tcp_be_liberal у 1</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-tcp-timeout-close-wait duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Таймаут NAT для TCP-зʼєднань у стані CLOSE_WAIT</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-tcp-timeout-established duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 24h0m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут простою для встановлених TCP-зʼєднань (0 — залишити як є)</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-udp-timeout duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут очікування для UDP-зʼєднань без відповіді (0 — залишити як є)</p></td>
      </tr>
      <tr>
         <td colspan="2">--conntrack-udp-timeout-stream duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут простою для ASSURED UDP-зʼєднань (0 — залишити як є)</p></td>
      </tr>
      <tr>
         <td colspan="2">--detect-local-mode LocalMode</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Режим для виявлення локального трафіку. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--feature-gates &lt;comma-separated 'key=True|False' pairs&gt;</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Набір пар key=value, які описують функціональні можливостідля альфа/експериментальних функцій. Можливі варіанти:<br/>
         APIResponseCompression=true|false (BETA - default=true)<br/>
         APIServerIdentity=true|false (BETA - default=true)<br/>
         APIServerTracing=true|false (BETA - default=true)<br/>
         APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
         AllAlpha=true|false (ALPHA - default=false)<br/>
         AllBeta=true|false (BETA - default=false)<br/>
         AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
         AnonymousAuthConfigurableEndpoints=true|false (BETA - default=true)<br/>
         AnyVolumeDataSource=true|false (BETA - default=true)<br/>
         AuthorizeNodeWithSelectors=true|false (BETA - default=true)<br/>
         AuthorizeWithSelectors=true|false (BETA - default=true)<br/>
         BtreeWatchCache=true|false (BETA - default=true)<br/>
         CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
         CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
         CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
         CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
         CRDValidationRatcheting=true|false (BETA - default=true)<br/>
         CSIMigrationPortworx=true|false (BETA - default=true)<br/>
         CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
         ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
         ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
         CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
         ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
         ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
         ComponentFlagz=true|false (ALPHA - default=false)<br/>
         ComponentStatusz=true|false (ALPHA - default=false)<br/>
         ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
         ConsistentListFromCache=true|false (BETA - default=true)<br/>
         ContainerCheckpoint=true|false (BETA - default=true)<br/>
         ContextualLogging=true|false (BETA - default=true)<br/>
         CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
         CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
         CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
         DRAAdminAccess=true|false (ALPHA - default=false)<br/>
         DRAResourceClaimDeviceStatus=true|false (ALPHA - default=false)<br/>
         DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>
         DynamicResourceAllocation=true|false (BETA - default=false)<br/>
         EventedPLEG=true|false (ALPHA - default=false)<br/>
         ExternalServiceAccountTokenSigner=true|false (ALPHA - default=false)<br/>
         GracefulNodeShutdown=true|false (BETA - default=true)<br/>
         GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
         HPAScaleToZero=true|false (ALPHA - default=false)<br/>
         HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
         ImageMaximumGCAge=true|false (BETA - default=true)<br/>
         ImageVolume=true|false (ALPHA - default=false)<br/>
         InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
         InPlacePodVerticalScalingAllocatedStatus=true|false (ALPHA - default=false)<br/>
         InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
         InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
         InformerResourceVersion=true|false (ALPHA - default=false)<br/>
         JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
         JobManagedBy=true|false (BETA - default=true)<br/>
         JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
         JobSuccessPolicy=true|false (BETA - default=true)<br/>
         KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
         KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
         KubeletFineGrainedAuthz=true|false (ALPHA - default=false)<br/>
         KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
         KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
         KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
         KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
         KubeletTracing=true|false (BETA - default=true)<br/>
         LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
         LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
         LoggingBetaOptions=true|false (BETA - default=true)<br/>
         MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
         MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
         MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
         MemoryQoS=true|false (ALPHA - default=false)<br/>
         MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
         MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
         NFTablesProxyMode=true|false (BETA - default=true)<br/>
         NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
         NodeLogQuery=true|false (BETA - default=false)<br/>
         NodeSwap=true|false (BETA - default=true)<br/>
         OpenAPIEnums=true|false (BETA - default=true)<br/>
         PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
         PodDeletionCost=true|false (BETA - default=true)<br/>
         PodLevelResources=true|false (ALPHA - default=false)<br/>
         PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
         PodLifecycleSleepActionAllowZero=true|false (ALPHA - default=false)<br/>
         PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
         PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
         PortForwardWebsockets=true|false (BETA - default=true)<br/>
         ProcMountType=true|false (BETA - default=false)<br/>
         QOSReserved=true|false (ALPHA - default=false)<br/>
         RecoverVolumeExpansionFailure=true|false (BETA - default=true)<br/>
         RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
         RelaxedDNSSearchValidation=true|false (ALPHA - default=false)<br/>
         RelaxedEnvironmentVariableValidation=true|false (BETA - default=true)<br/>
         ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
         RemoteRequestHeaderUID=true|false (ALPHA - default=false)<br/>
         ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
         ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
         RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
         RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
         SELinuxChangePolicy=true|false (ALPHA - default=false)<br/>
         SELinuxMount=true|false (ALPHA - default=false)<br/>
         SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
         SchedulerAsyncPreemption=true|false (ALPHA - default=false)<br/>
         SchedulerQueueingHints=true|false (BETA - default=true)<br/>
         SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
         SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
         ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
         ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
         ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
         SidecarContainers=true|false (BETA - default=true)<br/>
         StorageNamespaceIndex=true|false (BETA - default=true)<br/>
         StorageVersionAPI=true|false (ALPHA - default=false)<br/>
         StorageVersionHash=true|false (BETA - default=true)<br/>
         StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
         StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
         SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
         SystemdWatchdog=true|false (BETA - default=true)<br/>
         TopologyAwareHints=true|false (BETA - default=true)<br/>
         TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
         TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
         TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
         UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
         UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
         UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
         UserNamespacesSupport=true|false (BETA - default=false)<br/>
         VolumeAttributesClass=true|false (BETA - default=false)<br/>
         VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
         WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
         WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
         WatchList=true|false (BETA - default=true)<br/>
         WatchListClient=true|false (BETA - default=false)<br/>
         WinDSR=true|false (ALPHA - default=false)<br/>
         WinOverlay=true|false (BETA - default=true)<br/>
         WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
         WindowsGracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
         WindowsHostNetwork=true|false (ALPHA - default=true)<br/>
         Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--healthz-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0:10256</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса та порт для сервера перевірки справності, стандартно &quot;0.0.0.0:10256&quot;. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">-h, --help</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kube-proxy</p></td>
      </tr>
      <tr>
         <td colspan="2">--hostname-override string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо не порожнє, буде використано як імʼя вузла, на якому запущено kube-proxy. Якщо не задано, імʼя вузла вважається таким самим, як і імʼя хоста вузла.</p></td>
      </tr>
      <tr>
         <td colspan="2">--init-only</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, виконайте всі кроки ініціалізації, які необхідно виконати з повними привілеями root, а потім вийдіть. Після цього ви можете запустити kube-proxy знову, але тільки з параметром CAP_NET_ADMIN.</p></td>
      </tr>
      <tr>
         <td colspan="2">--iptables-localhost-nodeports&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення false, kube-proxy вимкне застарілу поведінку, яка дозволяла доступ до сервісів NodePort через localhost. (Стосується лише режиму iptables та IPv4; NodePort через localhost ніколи не буде дозволено в інших режимах проксі або з IPv6).</p></td>
      </tr>
      <tr>
         <td colspan="2">--iptables-masquerade-bit int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 14</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо використовується режим проксі iptables або ipvs, біт простору fwmark, яким слід позначати пакети, що вимагають SNAT.  Повинен знаходитися в діапазоні [0, 31].</p></td>
      </tr>
      <tr>
         <td colspan="2">--iptables-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальний період між пересинхронізаціями правил iptables (наприклад, '5s', '1m', '2h22m'). Значення 0 означає, що кожна зміна Service або EndpointSlice призведе до негайного пересинхронізації iptables.</p></td>
      </tr>
      <tr>
         <td colspan="2">--iptables-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал (наприклад, '5s', '1m', '2h22m'), який вказує, як часто виконуються різні операції ресинхронізації та очищення. Має бути більше 0.</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-exclude-cidrs strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список CIDR, розділених комами, які ipvs-проксі-сервер не повинен торкатися під час очищення правил IPVS.</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-min-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальний період між ресинхронізаціями правил IPVS (наприклад, '5s', '1m', '2h22m'). Значення 0 означає, що кожна зміна Service або EndpointSlice призведе до негайної пересинхронізації IPVS.</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-scheduler string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип планувальника ipvs, якщо режим проксі — ipvs</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-strict-arp</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Увімкніть строгий ARP, встановивши arp_ignore на 1 і arp_announce на 2</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-sync-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 30s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал (наприклад, '5s', '1m', '2h22m'), який вказує, як часто виконуються різні операції ресинхронізації та очищення. Має бути більше 0.</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-tcp-timeout duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут для неактивних TCP-зʼєднань IPVS, 0 — залишити як є. (наприклад, '5s', '1m', '2h22m').</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-tcpfin-timeout duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тайм-аут для IPVS TCP-зʼєднань після отримання FIN-пакету, 0 —
          залишити як є. (наприклад, '5s', '1m', '2h22m').</p></td>
      </tr>
      <tr>
         <td colspan="2">--ipvs-udp-timeout duration</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Таймаут для IPVS UDP-пакетів, 0 — залишити як є. (наприклад, '5s', '1m', '2h22m').</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Сплеск для використання під час спілкування з apiserver на kubernetes.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "application/vnd.kubernetes.protobuf"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип вмісту запитів, що надсилаються до apiserver.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Використання QPS під час спілкування з apiserver на kubernetes</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу kubeconfig з інформацією про авторизацію (розташування master може бути перевизначено прапорцем master).</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-flush-frequency duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Максимальна кількість секунд між очищеннями логів</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-info-buffer-size quantity</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі з розділеними потоками виводу інформаційні повідомлення можуть буферизуватися на деякий час для підвищення продуктивності. Стандартне значення, рівне нулю байт, вимикає буферизацію. Розмір можна вказати як кількість байт (512), кратну 1000 (1K), кратну 1024 (2Ki) або степінь (3M, 4G, 5Mi, 6Gi). Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log-text-split-stream</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>[Alpha] У текстовому форматі записувати повідомлення про помилки до stderr та інформаційні повідомлення до stdout. Стандартно до stdout записується один потік. Увімкніть функцію LoggingAlphaOptions, щоб скористатися цією можливістю.</p></td>
      </tr>
      <tr>
         <td colspan="2">--log_backtrace_at &lt;рядок у вигляді 'file:N'&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: :0</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>при попаданні в лог-файл рядка file:N, вивести трасування стеку</p></td>
      </tr>
      <tr>
         <td colspan="2">--log_dir string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо тека не порожня, записати лог-файли у цю теку (не діє, якщо -logtostderr=true).</p></td>
      </tr>
      <tr>
         <td colspan="2">--log_file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо файл не порожній, використовуйте цей файл логу (не діє, якщо -logtostderr=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">--log_file_max_size uint&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 1800</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Визначає максимальний розмір, до якого може зрости файл логу (не впливає, якщо -logtostderr=true). Одиниця виміру — мегабайти. Якщо значення дорівнює 0, максимальний розмір файлу необмежений.</p></td>
      </tr>
      <tr>
         <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Задає формат логу. Дозволені формати: &quot;text&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--logtostderr&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>писати лог в standard error, а не у файл</p></td>
      </tr>
      <tr>
         <td colspan="2">--masquerade-all</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>SNAT для всього трафіку, що надсилається через IP-кластера сервісу. Це може бути необхідним для деяких втулків CNI. Підтримується лише в Linux.</p></td>
      </tr>
      <tr>
         <td colspan="2">--master string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Адреса сервера API Kubernetes (перевизначає будь-яке значення в kubeconfig).</p></td>
      </tr>
      <tr>
         <td colspan="2">--metrics-bind-address ipport&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 127.0.0.1:10249</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса та порт для сервера метрик, типове значення: &quot;127.0.0.1:10249&quot;. (Встановіть значення &quot;0.0.0.0:10249&quot; / &quot;[::]:10249&quot; для привʼязки на всіх інтерфейсах). Встановіть пусте значення, щоб вимкнути. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--nodeport-addresses strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список діапазонів CIDR, які містять допустимі IP-адреси вузлів,  або, як варіант, єдиний рядок 'primary'. Якщо встановлено перелік CIDRs, зʼєднання з сервісами NodePort будуть прийматися лише з IP-адрес вузла в одному із зазначених діапазонів. Якщо встановлено значення 'primary', сервіси NodePort будуть прийматися лише на основну IP-адресу вузла згідно з обʼєктом Node. Якщо не встановлено, зʼєднання до NodePort будуть прийматися на всіх локальних IP-адресах. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--one_output</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, записувати логи лише до їхнього власного рівня важливості (замість запису до кожного нижчого рівня важливості; немає ефекту, якщо -logtostderr=true).</p></td>
      </tr>
      <tr>
         <td colspan="2">--oom-score-adj int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: -999</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Значення oom-score-adj для процесу kube-proxy. Значення має бути в діапазоні [-1000, 1000]. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--pod-bridge-interface string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя інтерфейсу bridge. Коли --detect-local-mode має значення BridgeInterface, kube-proxy вважатиме трафік локальним, якщо він походить з цього мосту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--pod-interface-name-prefix string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Префікс імені інтерфейсу. Коли --detect-local-mode має значення InterfaceNamePrefix, kube-proxy вважатиме трафік локальним, якщо він походить з будь-якого інтерфейсу, назва якого починається з цього префікса.</p></td>
      </tr>
      <tr>
         <td colspan="2">--profiling</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, вмикає профілювання через веб-інтерфейс у обробнику /debug/pprof. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--proxy-mode ProxyMode</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Режим проксі-сервера: у Linux це може бути 'iptables' (стандартно) або 'ipvs'. У Windows єдиним підтримуваним значенням є 'kernelspace'. Цей параметр ігнорується, якщо у конфігураційному файлі вказано --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--show-hidden-metrics-for-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Попередня версія, для якої ви хочете показати приховані метрики. Значення має лише попередня мінорна версія, інші значення не будуть дозволені. Формат: &lt;major&gt;.&lt;minor&gt;, наприклад: '1.16'. Мета цього формату — переконатися, що ви маєте можливість помітити, що наступний реліз приховує додаткові метрики, а не дивуватися, коли вони назавжди вилучаються в наступному релізі. Цей параметр ігнорується, якщо конфігураційний файл вказано за допомогою --config.</p></td>
      </tr>
      <tr>
         <td colspan="2">--skip_headers</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо true, уникати префіксів заголовків у повідомленнях логу</p></td>
      </tr>
      <tr>
         <td colspan="2">--skip_log_headers</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, уникати заголовків при відкритті файлів логу (не впливає, якщо -logtostderr=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">--stderrthreshold int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>логи на рівні або вище цього порогу потрапляють до stderr під час запису до файлів та stderr (не впливає, якщо -logtostderr=true або -alsologtostderr=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">-v, --v int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>число рівня деталізації логу</p></td>
      </tr>
      <tr>
         <td colspan="2">--version version[=true]</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>--version, --version=raw виводить інформацію про версію та виходить; --version=vX.Y.Z... встановлює вказану версію</p></td>
      </tr>
      <tr>
         <td colspan="2">--vmodule pattern=N,...</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>список параметрів pattern=N, розділених комами, для файлового фільтрування логу (працює лише для текстового формату логу).</p></td>
      </tr>
      <tr>
         <td colspan="2">--write-config-to string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, записати значення стандартної конфігурації до цього файлу і вийти.</p></td>
      </tr>
   </tbody>
</table>
