---
title: kube-scheduler
content_type: tool-reference
weight: 30
auto_generated: true
---


## {{% heading "synopsis" %}}

Планувальник Kubernetes — це процес панелі управління, який призначає Podʼи до вузлів. Планувальник визначає, які вузли є допустимими для розміщення для кожного Pod у черзі планування відповідно до обмежень та доступних ресурсів. Потім планувальник ранжує кожен допустимий вузол і привʼязує Pod до відповідного вузла. У кластері може використовуватися декілька різних планувальників; kube-scheduler є еталонною реалізацією. Див. статтю [планування](/docs/concepts/scheduling-eviction/) для отримання додаткової інформації про планування та компонент kube-scheduler.

```shell
kube-scheduler [flags]
```

## {{% heading "options" %}}

<table style="width: 100%; table-layout: fixed;">
   <colgroup>
      <col span="1" style="width: 10px;" />
      <col span="1" />
   </colgroup>
   <tbody>
      <tr>
         <td colspan="2">--allow-metric-labels stringToString&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: []</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Зіставляє метрику-мітку зі списком дозволених значень цієї мітки. Формат ключа — &lt;MetricName&gt;,&lt;LabelName&gt;. Формат значення — &lt; allowed_value&gt;, &lt;allowed_value&gt;...наприклад, metric1,label1='v1,v2,v3', metric1,label2='v1,v2,v3' metric2,label1='v1,v2,v3'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--allow-metric-labels-manifest string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу маніфесту, який містить зіставлення allow-list. Формат файлу такий самий, як і у прапорця --allow-metric-labels. Зауважте, що прапорець --allow-metric-labels замінить файл маніфесту.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>файл kubeconfig, що вказує на 'core' сервер kubernetes з достатніми правами для створення tokenreviews.authentication.k8s.io. Цей параметр не є обовʼязковим. Якщо він порожній, всі запити токенів вважаються анонімними, і жоден клієнтський центр сертифікації не шукається в кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-skip-lookup</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення false, authentication-kubeconfig буде використано для пошуку відсутньої конфігурації автентифікації в кластері.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-token-webhook-cache-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування відповідей від автентифікатора токенів вебхуків.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authentication-tolerate-lookup-failure&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення встановлено, невдачі у пошуку відсутньої конфігурації автентифікації в кластері не вважатимуться фатальними. Зауважте, що це може призвести до автентифікації, яка розглядає всі запити як анонімні.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-always-allow-paths strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "/healthz,/readyz,/livez"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список HTTP-шляхів, які пропускаються під час авторизації, тобто авторизуються без звʼязку з 'core' сервером kubernetes.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>файл kubeconfig, що вказує на 'core' сервер kubernetes з достатніми правами для створення subjectaccessreviews.authorization.k8s.io. Цей параметр не є обовʼязковим. Якщо він порожній, всі запити, не пропущені авторизацією, будуть заборонені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-authorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'authorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--authorization-webhook-cache-unauthorized-ttl duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість кешування 'unauthorized' відповідей від авторизатора вебхука.</p></td>
      </tr>
      <tr>
         <td colspan="2">--bind-address string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 0.0.0.0</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>IP-адреса, на якій буде прослуховуватися порт --secure-port. Відповідний інтерфейс(и) має бути доступним для решти кластера, а також для CLI/веб-клієнтів. Якщо цей параметр не вказано або вказано невизначену адресу (0.0.0.0 або ::), будуть використані всі інтерфейси та сімейства IP-адрес.</p></td>
      </tr>
      <tr>
         <td colspan="2">--cert-dir string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тека, в якій знаходяться TLS-сертифікати. Якщо вказано --tls-cert-file та --tls-private-key-file, цей прапорець буде проігноровано.</p></td>
      </tr>
      <tr>
         <td colspan="2">--client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо встановлено, будь-який запит, що надає клієнтський сертифікат, підписаний одним із центрів сертифікації у клієнтському файлі, буде автентифіковано за допомогою ідентифікатора, що відповідає CommonName клієнтського сертифіката.</p></td>
      </tr>
      <tr>
         <td colspan="2">--config string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Шлях до файлу конфігурації.</p></td>
      </tr>
      <tr>
         <td colspan="2">--contention-profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: увімкнути профілювання блоків, якщо профілювання увімкнено. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--disable-http2-serving</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, HTTP2-сервіс буде вимкнено [default=false].</p></td>
      </tr>
      <tr>
         <td colspan="2">--disabled-metrics strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Цей прапорець забезпечує аварійний вихід для метрик, що поводяться не належним чином. Щоб вимкнути метрику, ви маєте вказати її повну назву. Застереження: вимкнення метрик має вищий пріоритет, ніж показ прихованих метрик.</p></td>
      </tr>
      <tr>
         <td colspan="2">--emulated-version strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>У версіях різні компоненти емулюють свої можливості (API, функції, ...) інших компонентів.<br/>
         Якщо встановлено, компонент буде емулювати поведінку цієї версії замість базової двійкової версії.<br/>
         Формат версії може бути лише major.minor, наприклад: '--emulated-version=wardle=1.2,kube=1.31'. Можливі варіанти:<br/>
         kube=1.32..1.32 (default=1.32) Якщо компонент не вказано, стандартно використовується &quot;kube&quot;</p></td>
      </tr>
      <tr>
         <td colspan="2">--feature-gates colonSeparatedMultimapStringString</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список пар component:key=value, які описують функціональні можливості для альфа/експериментальних можливостей різних компонентів.<br/>
         Якщо компонент не вказано, стандартно використовується &quot;kube&quot;. Цей прапорець можна викликати багаторазово. Наприклад: --feature-gates 'wardle:featureA=true,wardle:featureB=false' --feature-gates 'kube:featureC=true'. Можливі варіанти:<br/>
            kube:APIResponseCompression=true|false (BETA - default=true)<br/>
            kube:APIServerIdentity=true|false (BETA - default=true)<br/>
            kube:APIServerTracing=true|false (BETA - default=true)<br/>
            kube:APIServingWithRoutine=true|false (ALPHA - default=false)<br/>
            kube:AllAlpha=true|false (ALPHA - default=false)<br/>
            kube:AllBeta=true|false (BETA - default=false)<br/>
            kube:AllowUnsafeMalformedObjectDeletion=true|false (ALPHA - default=false)<br/>
            kube:AnonymousAuthConfigurableEndpoints=true|false (BETA - default=true)<br/>
            kube:AnyVolumeDataSource=true|false (BETA - default=true)<br/>
            kube:AuthorizeNodeWithSelectors=true|false (BETA - default=true)<br/>
            kube:AuthorizeWithSelectors=true|false (BETA - default=true)<br/>
            kube:BtreeWatchCache=true|false (BETA - default=true)<br/>
            kube:CBORServingAndStorage=true|false (ALPHA - default=false)<br/>
            kube:CPUManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:CPUManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            kube:CPUManagerPolicyOptions=true|false (BETA - default=true)<br/>
            kube:CRDValidationRatcheting=true|false (BETA - default=true)<br/>
            kube:CSIMigrationPortworx=true|false (BETA - default=true)<br/>
            kube:CSIVolumeHealth=true|false (ALPHA - default=false)<br/>
            kube:ClientsAllowCBOR=true|false (ALPHA - default=false)<br/>
            kube:ClientsPreferCBOR=true|false (ALPHA - default=false)<br/>
            kube:CloudControllerManagerWebhook=true|false (ALPHA - default=false)<br/>
            kube:ClusterTrustBundle=true|false (ALPHA - default=false)<br/>
            kube:ClusterTrustBundleProjection=true|false (ALPHA - default=false)<br/>
            kube:ComponentFlagz=true|false (ALPHA - default=false)<br/>
            kube:ComponentStatusz=true|false (ALPHA - default=false)<br/>
            kube:ConcurrentWatchObjectDecode=true|false (BETA - default=false)<br/>
            kube:ConsistentListFromCache=true|false (BETA - default=true)<br/>
            kube:ContainerCheckpoint=true|false (BETA - default=true)<br/>
            kube:ContextualLogging=true|false (BETA - default=true)<br/>
            kube:CoordinatedLeaderElection=true|false (ALPHA - default=false)<br/>
            kube:CrossNamespaceVolumeDataSource=true|false (ALPHA - default=false)<br/>
            kube:CustomCPUCFSQuotaPeriod=true|false (ALPHA - default=false)<br/>
            kube:DRAAdminAccess=true|false (ALPHA - default=false)<br/>
            kube:DRAResourceClaimDeviceStatus=true|false (ALPHA - default=false)<br/>
            kube:DisableAllocatorDualWrite=true|false (ALPHA - default=false)<br/>
            kube:DynamicResourceAllocation=true|false (BETA - default=false)<br/>
            kube:EventedPLEG=true|false (ALPHA - default=false)<br/>
            kube:ExternalServiceAccountTokenSigner=true|false (ALPHA - default=false)<br/>
            kube:GracefulNodeShutdown=true|false (BETA - default=true)<br/>
            kube:GracefulNodeShutdownBasedOnPodPriority=true|false (BETA - default=true)<br/>
            kube:HPAScaleToZero=true|false (ALPHA - default=false)<br/>
            kube:HonorPVReclaimPolicy=true|false (BETA - default=true)<br/>
            kube:ImageMaximumGCAge=true|false (BETA - default=true)<br/>
            kube:ImageVolume=true|false (ALPHA - default=false)<br/>
            kube:InPlacePodVerticalScaling=true|false (ALPHA - default=false)<br/>
            kube:InPlacePodVerticalScalingAllocatedStatus=true|false (ALPHA - default=false)<br/>
            kube:InPlacePodVerticalScalingExclusiveCPUs=true|false (ALPHA - default=false)<br/>
            kube:InTreePluginPortworxUnregister=true|false (ALPHA - default=false)<br/>
            kube:InformerResourceVersion=true|false (ALPHA - default=false)<br/>
            kube:JobBackoffLimitPerIndex=true|false (BETA - default=true)<br/>
            kube:JobManagedBy=true|false (BETA - default=true)<br/>
            kube:JobPodReplacementPolicy=true|false (BETA - default=true)<br/>
            kube:JobSuccessPolicy=true|false (BETA - default=true)<br/>
            kube:KubeletCgroupDriverFromCRI=true|false (BETA - default=true)<br/>
            kube:KubeletCrashLoopBackOffMax=true|false (ALPHA - default=false)<br/>
            kube:KubeletFineGrainedAuthz=true|false (ALPHA - default=false)<br/>
            kube:KubeletInUserNamespace=true|false (ALPHA - default=false)<br/>
            kube:KubeletPodResourcesDynamicResources=true|false (ALPHA - default=false)<br/>
            kube:KubeletPodResourcesGet=true|false (ALPHA - default=false)<br/>
            kube:KubeletSeparateDiskGC=true|false (BETA - default=true)<br/>
            kube:KubeletTracing=true|false (BETA - default=true)<br/>
            kube:LocalStorageCapacityIsolationFSQuotaMonitoring=true|false (BETA - default=false)<br/>
            kube:LoggingAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:LoggingBetaOptions=true|false (BETA - default=true)<br/>
            kube:MatchLabelKeysInPodAffinity=true|false (BETA - default=true)<br/>
            kube:MatchLabelKeysInPodTopologySpread=true|false (BETA - default=true)<br/>
            kube:MaxUnavailableStatefulSet=true|false (ALPHA - default=false)<br/>
            kube:MemoryQoS=true|false (ALPHA - default=false)<br/>
            kube:MultiCIDRServiceAllocator=true|false (BETA - default=false)<br/>
            kube:MutatingAdmissionPolicy=true|false (ALPHA - default=false)<br/>
            kube:NFTablesProxyMode=true|false (BETA - default=true)<br/>
            kube:NodeInclusionPolicyInPodTopologySpread=true|false (BETA - default=true)<br/>
            kube:NodeLogQuery=true|false (BETA - default=false)<br/>
            kube:NodeSwap=true|false (BETA - default=true)<br/>
            kube:OpenAPIEnums=true|false (BETA - default=true)<br/>
            kube:PodAndContainerStatsFromCRI=true|false (ALPHA - default=false)<br/>
            kube:PodDeletionCost=true|false (BETA - default=true)<br/>
            kube:PodLevelResources=true|false (ALPHA - default=false)<br/>
            kube:PodLifecycleSleepAction=true|false (BETA - default=true)<br/>
            kube:PodLifecycleSleepActionAllowZero=true|false (ALPHA - default=false)<br/>
            kube:PodLogsQuerySplitStreams=true|false (ALPHA - default=false)<br/>
            kube:PodReadyToStartContainersCondition=true|false (BETA - default=true)<br/>
            kube:PortForwardWebsockets=true|false (BETA - default=true)<br/>
            kube:ProcMountType=true|false (BETA - default=false)<br/>
            kube:QOSReserved=true|false (ALPHA - default=false)<br/>
            kube:RecoverVolumeExpansionFailure=true|false (BETA - default=true)<br/>
            kube:RecursiveReadOnlyMounts=true|false (BETA - default=true)<br/>
            kube:RelaxedDNSSearchValidation=true|false (ALPHA - default=false)<br/>
            kube:RelaxedEnvironmentVariableValidation=true|false (BETA - default=true)<br/>
            kube:ReloadKubeletServerCertificateFile=true|false (BETA - default=true)<br/>
            kube:RemoteRequestHeaderUID=true|false (ALPHA - default=false)<br/>
            kube:ResilientWatchCacheInitialization=true|false (BETA - default=true)<br/>
            kube:ResourceHealthStatus=true|false (ALPHA - default=false)<br/>
            kube:RotateKubeletServerCertificate=true|false (BETA - default=true)<br/>
            kube:RuntimeClassInImageCriApi=true|false (ALPHA - default=false)<br/>
            kube:SELinuxChangePolicy=true|false (ALPHA - default=false)<br/>
            kube:SELinuxMount=true|false (ALPHA - default=false)<br/>
            kube:SELinuxMountReadWriteOncePod=true|false (BETA - default=true)<br/>
            kube:SchedulerAsyncPreemption=true|false (ALPHA - default=false)<br/>
            kube:SchedulerQueueingHints=true|false (BETA - default=true)<br/>
            kube:SeparateCacheWatchRPC=true|false (BETA - default=true)<br/>
            kube:SeparateTaintEvictionController=true|false (BETA - default=true)<br/>
            kube:ServiceAccountNodeAudienceRestriction=true|false (BETA - default=true)<br/>
            kube:ServiceAccountTokenNodeBinding=true|false (BETA - default=true)<br/>
            kube:ServiceTrafficDistribution=true|false (BETA - default=true)<br/>
            kube:SidecarContainers=true|false (BETA - default=true)<br/>
            kube:StorageNamespaceIndex=true|false (BETA - default=true)<br/>
            kube:StorageVersionAPI=true|false (ALPHA - default=false)<br/>
            kube:StorageVersionHash=true|false (BETA - default=true)<br/>
            kube:StorageVersionMigrator=true|false (ALPHA - default=false)<br/>
            kube:StructuredAuthenticationConfiguration=true|false (BETA - default=true)<br/>
            kube:SupplementalGroupsPolicy=true|false (ALPHA - default=false)<br/>
            kube:SystemdWatchdog=true|false (BETA - default=true)<br/>
            kube:TopologyAwareHints=true|false (BETA - default=true)<br/>
            kube:TopologyManagerPolicyAlphaOptions=true|false (ALPHA - default=false)<br/>
            kube:TopologyManagerPolicyBetaOptions=true|false (BETA - default=true)<br/>
            kube:TranslateStreamCloseWebsocketRequests=true|false (BETA - default=true)<br/>
            kube:UnauthenticatedHTTP2DOSMitigation=true|false (BETA - default=true)<br/>
            kube:UnknownVersionInteroperabilityProxy=true|false (ALPHA - default=false)<br/>
            kube:UserNamespacesPodSecurityStandards=true|false (ALPHA - default=false)<br/>
            kube:UserNamespacesSupport=true|false (BETA - default=false)<br/>
            kube:VolumeAttributesClass=true|false (BETA - default=false)<br/>
            kube:VolumeCapacityPriority=true|false (ALPHA - default=false)<br/>
            kube:WatchCacheInitializationPostStartHook=true|false (BETA - default=false)<br/>
            kube:WatchFromStorageWithoutResourceVersion=true|false (BETA - default=false)<br/>
            kube:WatchList=true|false (BETA - default=true)<br/>
            kube:WatchListClient=true|false (BETA - default=false)<br/>
            kube:WinDSR=true|false (ALPHA - default=false)<br/>
            kube:WinOverlay=true|false (BETA - default=true)<br/>
            kube:WindowsCPUAndMemoryAffinity=true|false (ALPHA - default=false)<br/>
            kube:WindowsGracefulNodeShutdown=true|false (ALPHA - default=false)<br/>
            kube:WindowsHostNetwork=true|false (ALPHA - default=true)</p></td>
      </tr>
      <tr>
         <td colspan="2">-h, --help</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Довідка kube-scheduler</p></td>
      </tr>
      <tr>
         <td colspan="2">--http2-max-streams-per-connection int</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Обмеження, яке сервер надає клієнтам на максимальну кількість потоків у зʼєднанні HTTP/2. Нуль означає використання стандартних значень golang.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-burst int32&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 100</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: сплеск для використання під час спілкування з apiserver'ом kubernetes. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-content-type string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "application/vnd.kubernetes.protobuf"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: тип вмісту запитів, що надсилаються до apiserver. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kube-api-qps float&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 50</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: Використовувати QPS під час спілкування з apiserver'ом kubernetes. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--kubeconfig string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: шлях до файлу kubeconfig з інформацією про авторизацію та місцезнаходження майстра. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Запускає клієнта виборів лідера і отримує лідерство перед виконанням основного циклу. Увімкніть цю опцію під час запуску реплікованих компонентів для забезпечення високої доступності.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-lease-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 15s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тривалість, протягом якої кандидати, що не є лідерами, чекатимуть після поновлення лідерства, перш ніж спробувати зайняти лідерство в лідируючому, але не поновленому лідерському слоті. Це фактично максимальний час, протягом якого лідер може бути зупинений, перш ніж його замінить інший кандидат. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-renew-deadline duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Інтервал між спробами виконуючого обовʼязки майстра поновити слот лідера до того, як він перестане бути лідером. Він має бути меншим за тривалість оренди. Це застосовується лише у тому випадку, якщо вибори лідера увімкнені.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-lock string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "leases"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Тип обʼєкта ресурсу, який використовується для блокування під час обрання лідера. Підтримувані варіанти: 'leases'.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-name string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kube-scheduler"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Імʼя обʼєкта ресурсу, який використовується для блокування під час виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-resource-namespace string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "kube-system"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Простір імен обʼєкта ресурсу, який використовується для блокування під час виборів лідера.</p></td>
      </tr>
      <tr>
         <td colspan="2">--leader-elect-retry-period duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 2s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Час, протягом якого клієнти повинні чекати між спробою отримання та поновленням лідерства. Це стосується лише тих випадків, коли увімкнено обрання лідера.</p></td>
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
         <td colspan="2">--logging-format string&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "text"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Задає формат логу. Дозволені формати: &quot;text&quot;.</p></td>
      </tr>
      <tr>
         <td colspan="2">--master string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Адреса сервера API Kubernetes (перевизначає будь-яке значення в kubeconfig).</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-address-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо це значення дорівнює true, SO_REUSEADDR буде використано при привʼязці порту. Це дозволяє паралельно привʼязуватись до підстановочних IP-адрес, таких як 0.0.0.0, і до конкретних IP-адрес, а також дозволяє уникнути очікування ядром звільнення сокетів у стані TIME_WAIT. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--permit-port-sharing</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Якщо значення true, SO_REUSEPORT буде використано при привʼязці порту, що дозволяє більш ніж одному екземпляру привʼязуватися до однієї адреси та порту. [default=false]</p></td>
      </tr>
      <tr>
         <td colspan="2">--pod-max-in-unschedulable-pods-duration duration&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 5m0s</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: максимальний час, протягом якого Pod може перебувати в unschedulablePods. Якщо Pod залишається в unschedulablePods довше, ніж це значення, то його буде переміщено з unschedulablePods до backoffQ або activeQ. Цей прапорець є застарілим і буде вилучений у наступній версії.</p></td>
      </tr>
      <tr>
         <td colspan="2">--profiling&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: true</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>DEPRECATED: увімкнути профілювання через веб-інтерфейс host:port/debug/prof/. Цей параметр ігнорується, якщо у --config вказано конфігураційний файл.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-allowed-names strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список загальних імен клієнтських сертифікатів, щоб дозволити вказувати імена користувачів у заголовках, визначених параметром --requestheader-username-headers. Якщо він порожній, можна використовувати будь-який сертифікат клієнта, підтверджений центрами сертифікації у файлі --requestheader-client-ca-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-client-ca-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пакет кореневих сертифікатів для перевірки клієнтських сертифікатів на вхідних запитах перед тим, як довіряти іменам користувачів у заголовках, визначених параметром --requestheader-username-headers. ПОПЕРЕДЖЕННЯ: зазвичай не залежить від авторизації, яку вже виконано для вхідних запитів.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-extra-headers-prefix strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-extra-"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список префіксів заголовків запитів для перевірки. Запропоновано X-Remote-Extra-.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-group-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-group"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність груп. Пропонується X-Remote-Group.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-uid-headers strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність UID. Пропонується X-Remote-Uid. Потребує увімкнення функції RemoteRequestHeaderUID.</p></td>
      </tr>
      <tr>
         <td colspan="2">--requestheader-username-headers strings&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: "x-remote-user"</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Список заголовків запитів для перевірки на наявність імен користувачів. X-Remote-User є поширеним.</p></td>
      </tr>
      <tr>
         <td colspan="2">--secure-port int&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Типово: 10259</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Порт, на якому обслуговувати HTTPS з автентифікацією та авторизацією. Якщо 0, не обслуговувати HTTPS взагалі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--show-hidden-metrics-for-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Попередня версія, для якої ви хочете показати приховані метрики. Значення має лише попередня мінорна версія, інші значення не будуть дозволені. Формат: &lt;major&gt;.&lt;minor&gt;, наприклад: '1.16'. Мета цього формату - переконатися, що ви маєте можливість помітити, що наступний реліз приховує додаткові метрики, замість того, щоб дивуватися, коли вони будуть назавжди вилучені в наступному релізі.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cert-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Файл, що містить стандартний сертифікат x509 для HTTPS. (Сертифікат центру сертифікації, якщо такий є, додається після сертифіката сервера). Якщо HTTPS-сервіс увімкнено, а --tls-cert-file і --tls-private-key-file не вказано, для публічної адреси буде згенеровано самопідписаний сертифікат і ключ, які буде збережено в теці, вказаній в --cert-dir.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-cipher-suites strings</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Розділений комами список наборів шифрів для сервера. Якщо не вказано, буде використано стандартний набір шифрів Go.<br/>
         Значення, яким надається перевага: TLS_AES_128_GCM_SHA256, TLS_AES_256_GCM_SHA384, TLS_CHACHA20_POLY1305_SHA256, TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256, TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305, TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256.<br/>
         Небезпечні значення: TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_ECDSA_WITH_RC4_128_SHA, TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA, TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256, TLS_ECDHE_RSA_WITH_RC4_128_SHA, TLS_RSA_WITH_3DES_EDE_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA, TLS_RSA_WITH_AES_128_CBC_SHA256, TLS_RSA_WITH_AES_128_GCM_SHA256, TLS_RSA_WITH_AES_256_CBC_SHA, TLS_RSA_WITH_AES_256_GCM_SHA384, TLS_RSA_WITH_RC4_128_SHA.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-min-version string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Мінімальна підтримувана версія TLS. Можливі значення: VersionTLS10, VersionTLS11, VersionTLS12, VersionTLS13</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-private-key-file string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>>Файл, що містить стандартний приватний ключ x509, який відповідає --tls-cert-file.</p></td>
      </tr>
      <tr>
         <td colspan="2">--tls-sni-cert-key string</td>
      </tr>
      <tr>
         <td></td>
         <td style="line-height: 130%; word-wrap: break-word;"><p>Пара шляхів до файлів сертифіката x509 і приватного ключа, до яких за бажанням додається список доменних шаблонів, які є повними доменними іменами, можливо, з префіксальними підстановчими сегментами. Доменні шаблони також дозволяють використовувати IP-адреси, але IP-адреси слід використовувати лише в тому випадку, якщо apiserver має доступ до IP-адреси, запитуваної клієнтом. Якщо шаблони домену не надано, витягуються імена сертифікатів. Збіги без підстановочних знаків мають перевагу над збігами з підстановочними знаками, а явні шаблони доменів мають перевагу над отриманими іменами. Для кількох пар ключ/сертифікат використовуйте --tls-sni-cert-key кілька разів. Приклади: &quot;example.crt,example.key&quot; або &quot;foo.crt,foo.key:*.foo.com,foo.com&quot;.</p></td>
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
