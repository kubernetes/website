---
title: "Kubernetes Release: 0.17.0"
date: 2015-05-15
slug: kubernetes-release-0170
url: /blog/2015/05/Kubernetes-Release-0170
evergreen: true
---
Release Notes:  

* Cleanups

    * Remove old salt configs [#8065][4] (roberthbailey)
    * Kubelet: minor cleanups [#8069][5] (yujuhong)
* v1beta3

    * update example/walkthrough to v1beta3 [#7940][6] (caesarxuchao)
    * update example/rethinkdb to v1beta3 [#7946][7] (caesarxuchao)
    * verify the v1beta3 yaml files all work; merge the yaml files [#7917][8] (caesarxuchao)
    * update examples/cassandra to api v1beta3 [#7258][9] (caesarxuchao)
    * update service.json in persistent-volume example to v1beta3 [#7899][10] (caesarxuchao)
    * update mysql-wordpress example to use v1beta3 API [#7864][11] (caesarxuchao)
    * Update examples/meteor to use API v1beta3 [#7848][12] (caesarxuchao)
    * update node-selector example to API v1beta3 [#7872][13] (caesarxuchao)
    * update logging-demo to use API v1beta3; modify the way to access Elasticsearch and Kibana services [#7824][14] (caesarxuchao)
    * Convert the skydns rc to use v1beta3 and add a health check to it [#7619][15] (a-robinson)
    * update the hazelcast example to API version v1beta3 [#7728][16] (caesarxuchao)
    * Fix YAML parsing for v1beta3 objects in the kubelet for file/http [#7515][17] (brendandburns)
    * Updated kubectl cluster-info to show v1beta3 addresses [#7502][18] (piosz)
* Kubelet

    * kubelet: Fix racy kubelet tests. [#7980][19] (yifan-gu)
    * kubelet/container: Move prober.ContainerCommandRunner to container. [#8079][20] (yifan-gu)
    * Kubelet: set host field in the pending pod status [#6127][21] (yujuhong)
    * Fix the kubelet node watch [#6442][22] (yujuhong)
    * Kubelet: recreate mirror pod if the static pod changes [#6607][23] (yujuhong)
    * Kubelet: record the timestamp correctly in the runtime cache [#7749][24] (yujuhong)
    * Kubelet: wait until container runtime is up [#7729][25] (yujuhong)
    * Kubelet: replace DockerManager with the Runtime interface [#7674][26] (yujuhong)
    * Kubelet: filter out terminated pods in SyncPods [#7301][27] (yujuhong)
    * Kubelet: parallelize cleaning up containers in unwanted pods [#7048][28] (yujuhong)
    * kubelet: Add container runtime option for rkt. [#7952][29] (yifan-gu)
    * kubelet/rkt: Remove build label. [#7916][30] (yifan-gu)
    * kubelet/metrics: Move instrumented_docker.go to dockertools. [#7327][31] (yifan-gu)
    * kubelet/rkt: Add GetPods() for rkt. [#7599][32] (yifan-gu)
    * kubelet/rkt: Add KillPod() and GetPodStatus() for rkt. [#7605][33] (yifan-gu)
    * pkg/kubelet: Fix logging. [#4755][34] (yifan-gu)
    * kubelet: Refactor RunInContainer/ExecInContainer/PortForward. [#6491][35] (yifan-gu)
    * kubelet/DockerManager: Fix returning empty error from GetPodStatus(). [#6609][36] (yifan-gu)
    * kubelet: Move pod infra container image setting to dockertools. [#6634][37] (yifan-gu)
    * kubelet/fake_docker_client: Use self's PID instead of 42 in testing. [#6653][38] (yifan-gu)
    * kubelet/dockertool: Move Getpods() to DockerManager. [#6778][39] (yifan-gu)
    * kubelet/dockertools: Add puller interfaces in the containerManager. [#6776][40] (yifan-gu)
    * kubelet: Introduce PodInfraContainerChanged(). [#6608][41] (yifan-gu)
    * kubelet/container: Replace DockerCache with RuntimeCache. [#6795][42] (yifan-gu)
    * kubelet: Clean up computePodContainerChanges. [#6844][43] (yifan-gu)
    * kubelet: Refactor prober. [#7009][44] (yifan-gu)
    * kubelet/container: Update the runtime interface. [#7466][45] (yifan-gu)
    * kubelet: Refactor isPodRunning() in runonce.go [#7477][46] (yifan-gu)
    * kubelet/rkt: Add basic rkt runtime routines. [#7465][47] (yifan-gu)
    * kubelet/rkt: Add podInfo. [#7555][48] (yifan-gu)
    * kubelet/container: Add GetContainerLogs to runtime interface. [#7488][49] (yifan-gu)
    * kubelet/rkt: Add routines for converting kubelet pod to rkt pod. [#7543][50] (yifan-gu)
    * kubelet/rkt: Add RunPod() for rkt. [#7589][51] (yifan-gu)
    * kubelet/rkt: Add RunInContainer()/ExecInContainer()/PortForward(). [#7553][52] (yifan-gu)
    * kubelet/container: Move ShouldContainerBeRestarted() to runtime. [#7613][53] (yifan-gu)
    * kubelet/rkt: Add SyncPod() to rkt. [#7611][54] (yifan-gu)
    * Kubelet: persist restart count of a container [#6794][55] (yujuhong)
    * kubelet/container: Move pty*.go to container runtime package. [#7951][56] (yifan-gu)
    * kubelet: Add container runtime option for rkt. [#7900][57] (yifan-gu)
    * kubelet/rkt: Add docker prefix to image string. [#7803][58] (yifan-gu)
    * kubelet/rkt: Inject dependencies to rkt. [#7849][59] (yifan-gu)
    * kubelet/rkt: Remove dependencies on rkt.store [#7859][60] (yifan-gu)
    * Kubelet talks securely to apiserver [#2387][61] (erictune)
    * Rename EnvVarSource.FieldPath -> FieldRef and add example [#7592][62] (pmorie)
    * Add containerized option to kubelet binary [#7741][63] (pmorie)
    * Ease building kubelet image [#7948][64] (pmorie)
    * Remove unnecessary bind-mount from dockerized kubelet run [#7854][65] (pmorie)
    * Add ability to dockerize kubelet in local cluster [#7798][66] (pmorie)
    * Create docker image for kubelet [#7797][67] (pmorie)
    * Security context - types, kubelet, admission [#7343][68] (pweil-)
    * Kubelet: Add rkt as a runtime option [#7743][69] (vmarmol)
    * Fix kubelet's docker RunInContainer implementation [#7746][70] (vishh)
* AWS

    * AWS: Don't try to copy gce_keys in jenkins e2e job [#8018][71] (justinsb)
    * AWS: Copy some new properties from config-default => config.test [#7992][72] (justinsb)
    * AWS: make it possible to disable minion public ip assignment [#7928][73] (manolitto)
    * update AWS CloudFormation template and cloud-configs [#7667][74] (antoineco)
    * AWS: Fix variable naming that meant not all tokens were written [#7736][75] (justinsb)
    * AWS: Change apiserver to listen on 443 directly, not through nginx [#7678][76] (justinsb)
    * AWS: Improving getting existing VPC and subnet [#6606][77] (gust1n)
    * AWS EBS volume support [#5138][78] (justinsb)
* Introduce an 'svc' segment for DNS search [#8089][79] (thockin)
* Adds ability to define a prefix for etcd paths [#5707][80] (kbeecher)
* Add kubectl log --previous support to view last terminated container log [#7973][81] (dchen1107)
* Add a flag to disable legacy APIs [#8083][82] (brendandburns)
* make the dockerkeyring handle mutiple matching credentials [#7971][83] (deads2k)
* Convert Fluentd to Cloud Logging pod specs to YAML [#8078][84] (satnam6502)
* Use etcd to allocate PortalIPs instead of in-mem [#7704][85] (smarterclayton)
* eliminate auth-path [#8064][86] (deads2k)
* Record failure reasons for image pulling [#7981][87] (yujuhong)
* Rate limit replica creation [#7869][88] (bprashanth)
* Upgrade to Kibana 4 for cluster logging [#7995][89] (satnam6502)
* Added name to kube-dns service [#8049][90] (piosz)
* Fix validation by moving it into the resource builder. [#7919][91] (brendandburns)
* Add cache with multiple shards to decrease lock contention [#8050][92] (fgrzadkowski)
* Delete status from displayable resources [#8039][93] (nak3)
* Refactor volume interfaces to receive pod instead of ObjectReference [#8044][94] (pmorie)
* fix kube-down for provider gke [#7565][95] (jlowdermilk)
* Service port names are required for multi-port [#7786][96] (thockin)
* Increase disk size for kubernetes master. [#8051][97] (fgrzadkowski)
* expose: Load input object for increased safety [#7774][98] (kargakis)
* Improments to conversion methods generator [#7896][99] (wojtek-t)
* Added displaying external IPs to kubectl cluster-info [#7557][100] (piosz)
* Add missing Errorf formatting directives [#8037][101] (shawnps)
* Add startup code to apiserver to migrate etcd keys [#7567][102] (kbeecher)
* Use error type from docker go-client instead of string [#8021][103] (ddysher)
* Accurately get hardware cpu count in Vagrantfile. [#8024][104] (BenTheElder)
* Stop setting a GKE specific version of the kubeconfig file [#7921][105] (roberthbailey)
* Make the API server deal with HEAD requests via the service proxy [#7950][106] (satnam6502)
* GlusterFS Critical Bug Resolved - Removing warning in README [#7983][107] (wattsteve)
* Don't use the first token `uname -n` as the hostname [#7967][108] (yujuhong)
* Call kube-down in test-teardown for vagrant. [#7982][109] (BenTheElder)
* defaults_tests: verify defaults when converting to an API object [#6235][110] (yujuhong)
* Use the full hostname for mirror pod name. [#7910][111] (yujuhong)
* Removes RunPod in the Runtime interface [#7657][112] (yujuhong)
* Clean up dockertools/manager.go and add more unit tests [#7533][113] (yujuhong)
* Adapt pod killing and cleanup for generic container runtime [#7525][114] (yujuhong)
* Fix pod filtering in replication controller [#7198][115] (yujuhong)
* Print container statuses in `kubectl get pods` [#7116][116] (yujuhong)
* Prioritize deleting the non-running pods when reducing replicas [#6992][117] (yujuhong)
* Fix locking issue in pod manager [#6872][118] (yujuhong)
* Limit the number of concurrent tests in integration.go [#6655][119] (yujuhong)
* Fix typos in different config comments [#7931][120] (pmorie)
* Update cAdvisor dependency. [#7929][121] (vmarmol)
* Ubuntu-distro: deprecate & merge ubuntu single node work to ubuntu cluster node stuff[#5498][122] (resouer)
* Add control variables to Jenkins E2E script [#7935][123] (saad-ali)
* Check node status as part of validate-cluster.sh. [#7932][124] (fabioy)
* Add old endpoint cleanup function [#7821][125] (lavalamp)
* Support recovery from in the middle of a rename. [#7620][126] (brendandburns)
* Update Exec and Portforward client to use pod subresource [#7715][127] (csrwng)
* Added NFS to PV structs [#7564][128] (markturansky)
* Fix environment variable error in Vagrant docs [#7904][129] (posita)
* Adds a simple release-note builder that scrapes the GitHub API for recent PRs [#7616][130](brendandburns)
* Scheduler ignores nodes that are in a bad state [#7668][131] (bprashanth)
* Set GOMAXPROCS for etcd [#7863][132] (fgrzadkowski)
* Auto-generated conversion methods calling one another [#7556][133] (wojtek-t)
* Bring up a kuberenetes cluster using coreos image as worker nodes [#7445][134] (dchen1107)
* Godep: Add godep for rkt. [#7410][135] (yifan-gu)
* Add volumeGetter to rkt. [#7870][136] (yifan-gu)
* Update cAdvisor dependency. [#7897][137] (vmarmol)
* DNS: expose 53/TCP [#7822][138] (thockin)
* Set NodeReady=False when docker is dead [#7763][139] (wojtek-t)
* Ignore latency metrics for events [#7857][140] (fgrzadkowski)
* SecurityContext admission clean up [#7792][141] (pweil-)
* Support manually-created and generated conversion functions [#7832][142] (wojtek-t)
* Add latency metrics for etcd operations [#7833][143] (fgrzadkowski)
* Update errors_test.go [#7885][144] (hurf)
* Change signature of container runtime PullImage to allow pull w/ secret [#7861][145] (pmorie)
* Fix bug in Service documentation: incorrect location of "selector" in JSON [#7873][146](bkeroackdsc)
* Fix controller-manager manifest for providers that don't specify CLUSTER_IP_RANGE[#7876][147] (cjcullen)
* Fix controller unittests [#7867][148] (bprashanth)
* Enable GCM and GCL instead of InfluxDB on GCE [#7751][149] (saad-ali)
* Remove restriction that cluster-cidr be a class-b [#7862][150] (cjcullen)
* Fix OpenShift example [#7591][151] (derekwaynecarr)
* API Server - pass path name in context of create request for subresource [#7718][152] (csrwng)
* Rolling Updates: Add support for --rollback. [#7575][153] (brendandburns)
* Update to container-vm-v20150505 (Also updates GCE to Docker 1.6) [#7820][154] (zmerlynn)
* Fix metric label [#7830][155] (rhcarvalho)
* Fix v1beta1 typos in v1beta2 conversions [#7838][156] (pmorie)
* skydns: use the etcd-2.x native syntax, enable IANA attributed ports. [#7764][157](AntonioMeireles)
* Added port 6443 to kube-proxy default IP address for api-server [#7794][158] (markllama)
* Added client header info for authentication doc. [#7834][159] (ashcrow)
* Clean up safe_format_and_mount spam in the startup logs [#7827][160] (zmerlynn)
* Set allocate_node_cidrs to be blank by default. [#7829][161] (roberthbailey)
* Fix sync problems in [#5246][162] [#7799][163] (cjcullen)
* Fix event doc link [#7823][164] (saad-ali)
* Cobra update and bash completions fix [#7776][165] (eparis)
* Fix kube2sky flakes. Fix tools.GetEtcdVersion to work with etcd > 2.0.7 [#7675][166] (cjcullen)
* Change kube2sky to use token-system-dns secret, point at https endpoint ... [#7154][167](cjcullen)
* replica: serialize created-by reference [#7468][168] (simon3z)
* Inject mounter into volume plugins [#7702][169] (pmorie)
* bringing CoreOS cloud-configs up-to-date (against 0.15.x and latest OS' alpha) [#6973][170](AntonioMeireles)
* Update kubeconfig-file doc. [#7787][171] (jlowdermilk)
* Throw an API error when deleting namespace in termination [#7780][172] (derekwaynecarr)
* Fix command field PodExecOptions [#7773][173] (csrwng)
* Start ImageManager housekeeping in Run(). [#7785][174] (vmarmol)
* fix DeepCopy to properly support runtime.EmbeddedObject [#7769][175] (deads2k)
* fix master service endpoint system for multiple masters [#7273][176] (lavalamp)
* Add genbashcomp to KUBE_TEST_TARGETS [#7757][177] (nak3)
* Change the cloud provider TCPLoadBalancerExists function to GetTCPLoadBalancer...[#7669][178] (a-robinson)
* Add containerized option to kubelet binary [#7772][179] (pmorie)
* Fix swagger spec [#7779][180] (pmorie)
* FIX: Issue [#7750][181] \- Hyperkube docker image needs certificates to connect to cloud-providers[#7755][182] (viklas)
* Add build labels to rkt [#7752][183] (vmarmol)
* Check license boilerplate for python files [#7672][184] (eparis)
* Reliable updates in rollingupdate [#7705][185] (bprashanth)
* Don't exit abruptly if there aren't yet any minions right after the cluster is created. [#7650][186](roberthbailey)
* Make changes suggested in [#7675][166] [#7742][187] (cjcullen)
* A guide to set up kubernetes multiple nodes cluster with flannel on fedora [#7357][188](aveshagarwal)
* Setup generators in factory [#7760][189] (kargakis)
* Reduce usage of time.After [#7737][190] (lavalamp)
* Remove node status from "componentstatuses" call. [#7735][191] (fabioy)
* React to failure by growing the remaining clusters [#7614][192] (tamsky)
* Fix typo in runtime_cache.go [#7725][193] (pmorie)
* Update non-GCE Salt distros to 1.6.0, fallback to ContainerVM Docker version on GCE[#7740][194] (zmerlynn)
* Skip SaltStack install if it's already installed [#7744][195] (zmerlynn)
* Expose pod name as a label on containers. [#7712][196] (rjnagal)
* Log which SSH key is used in e2e SSH test [#7732][197] (mbforbes)
* Add a central simple getting started guide with kubernetes guide. [#7649][198] (brendandburns)
* Explicitly state the lack of support for 'Requests' for the purposes of scheduling [#7443][199](vishh)
* Select IPv4-only from host interfaces [#7721][200] (smarterclayton)
* Metrics tests can't run on Mac [#7723][201] (smarterclayton)
* Add step to API changes doc for swagger regen [#7727][202] (pmorie)
* Add NsenterMounter mount implementation [#7703][203] (pmorie)
* add StringSet.HasAny [#7509][204] (deads2k)
* Add an integration test that checks for the metrics we expect to be exported from the master [#6941][205] (a-robinson)
* Minor bash update found by shellcheck.net [#7722][206] (eparis)
* Add --hostport to run-container. [#7536][207] (rjnagal)
* Have rkt implement the container Runtime interface [#7659][208] (vmarmol)
* Change the order the different versions of API are registered [#7629][209] (caesarxuchao)
* expose: Create objects in a generic way [#7699][210] (kargakis)
* Requeue rc if a single get/put retry on status.Replicas fails [#7643][211] (bprashanth)
* logs for master components [#7316][212] (ArtfulCoder)
* cloudproviders: add ovirt getting started guide [#7522][213] (simon3z)
* Make rkt-install a oneshot. [#7671][214] (vmarmol)
* Provide container_runtime flag to Kubelet in CoreOS. [#7665][215] (vmarmol)
* Boilerplate speedup [#7654][216] (eparis)
* Log host for failed pod in Density test [#7700][217] (wojtek-t)
* Removes spurious quotation mark [#7655][218] (alindeman)
* Add kubectl_label to custom functions in bash completion [#7694][219] (nak3)
* Enable profiling in kube-controller [#7696][220] (wojtek-t)
* Set vagrant test cluster default NUM_MINIONS=2 [#7690][221] (BenTheElder)
* Add metrics to measure cache hit ratio [#7695][222] (fgrzadkowski)
* Change IP to IP(S) in service columns for kubectl get [#7662][223] (jlowdermilk)
* annotate required flags for bash_completions [#7076][224] (eparis)
* (minor) Add pgrep debugging to etcd error [#7685][225] (jayunit100)
* Fixed nil pointer issue in describe when volume is unbound [#7676][226] (markturansky)
* Removed unnecessary closing bracket [#7691][227] (piosz)
* Added TerminationGracePeriod field to PodSpec and grace-period flag to kubectl stop[#7432][228] (piosz)
* Fix boilerplate in test/e2e/scale.go [#7689][229] (wojtek-t)
* Update expiration timeout based on observed latencies [#7628][230] (bprashanth)
* Output generated conversion functions/names [#7644][231] (liggitt)
* Moved the Scale tests into a scale file. [#7645][232] [#7646][233] (rrati)
* Truncate GCE load balancer names to 63 chars [#7609][234] (brendandburns)
* Add SyncPod() and remove Kill/Run InContainer(). [#7603][235] (vmarmol)
* Merge release 0.16 to master [#7663][236] (brendandburns)
* Update license boilerplate for examples/rethinkdb [#7637][237] (eparis)
* First part of improved rolling update, allow dynamic next replication controller generation.[#7268][238] (brendandburns)
* Add license boilerplate to examples/phabricator [#7638][239] (eparis)
* Use generic copyright holder name in license boilerplate [#7597][240] (eparis)
* Retry incrementing quota if there is a conflict [#7633][241] (derekwaynecarr)
* Remove GetContainers from Runtime interface [#7568][242] (yujuhong)
* Add image-related methods to DockerManager [#7578][243] (yujuhong)
* Remove more docker references in kubelet [#7586][244] (yujuhong)
* Add KillContainerInPod in DockerManager [#7601][245] (yujuhong)
* Kubelet: Add container runtime option. [#7652][246] (vmarmol)
* bump heapster to v0.11.0 and grafana to v0.7.0 [#7626][247] (idosh)
* Build github.com/onsi/ginkgo/ginkgo as a part of the release [#7593][248] (ixdy)
* Do not automatically decode runtime.RawExtension [#7490][249] (smarterclayton)
* Update changelog. [#7500][250] (brendandburns)
* Add SyncPod() to DockerManager and use it in Kubelet [#7610][251] (vmarmol)
* Build: Push .md5 and .sha1 files for every file we push to GCS [#7602][252] (zmerlynn)
* Fix rolling update --image [#7540][253] (bprashanth)
* Update license boilerplate for docs/man/md2man-all.sh [#7636][254] (eparis)
* Include shell license boilerplate in examples/k8petstore [#7632][255] (eparis)
* Add --cgroup_parent flag to Kubelet to set the parent cgroup for pods [#7277][256] (guenter)
* change the current dir to the config dir [#7209][257] (you-n-g)
* Set Weave To 0.9.0 And Update Etcd Configuration For Azure [#7158][258] (idosh)
* Augment describe to search for matching things if it doesn't match the original resource.[#7467][259] (brendandburns)
* Add a simple cache for objects stored in etcd. [#7559][260] (fgrzadkowski)
* Rkt gc [#7549][261] (yifan-gu)
* Rkt pull [#7550][262] (yifan-gu)
* Implement Mount interface using mount(8) and umount(8) [#6400][263] (ddysher)
* Trim Fleuntd tag for Cloud Logging [#7588][264] (satnam6502)
* GCE CoreOS cluster - set master name based on variable [#7569][265] (bakins)
* Capitalization of KubeProxyVersion wrong in JSON [#7535][266] (smarterclayton)
* Make nodes report their external IP rather than the master's. [#7530][267] (mbforbes)
* Trim cluster log tags to pod name and container name [#7539][268] (satnam6502)
* Handle conversion of boolean query parameters with a value of "false" [#7541][269] (csrwng)
* Add image-related methods to Runtime interface. [#7532][270] (vmarmol)
* Test whether auto-generated conversions weren't manually edited [#7560][271] (wojtek-t)
* Mention :latest behavior for image version tag [#7484][272] (colemickens)
* readinessProbe calls livenessProbe.Exec.Command which cause "invalid memory address or nil pointer dereference". [#7487][273] (njuicsgz)
* Add RuntimeHooks to abstract Kubelet logic [#7520][274] (vmarmol)
* Expose URL() on Request to allow building URLs [#7546][275] (smarterclayton)
* Add a simple cache for objects stored in etcd [#7288][276] (fgrzadkowski)
* Prepare for chaining autogenerated conversion methods [#7431][277] (wojtek-t)
* Increase maxIdleConnection limit when creating etcd client in apiserver. [#7353][278] (wojtek-t)
* Improvements to generator of conversion methods. [#7354][279] (wojtek-t)
* Code to automatically generate conversion methods [#7107][280] (wojtek-t)
* Support recovery for anonymous roll outs [#7407][281] (brendandburns)
* Bump kube2sky to 1.2. Point it at https endpoint (3rd try). [#7527][282] (cjcullen)
* cluster/gce/coreos: Add metadata-service in node.yaml [#7526][283] (yifan-gu)
* Move ComputePodChanges to the Docker runtime [#7480][284] (vmarmol)
* Cobra rebase [#7510][285] (eparis)
* Adding system oom events from kubelet [#6718][286] (vishh)
* Move Prober to its own subpackage [#7479][287] (vmarmol)
* Fix parallel-e2e.sh to work on my macbook (bash v3.2) [#7513][288] (cjcullen)
* Move network plugin TearDown to DockerManager [#7449][289] (vmarmol)
* Fixes [#7498][290] \- CoreOS Getting Started Guide had invalid cloud config [#7499][291] (elsonrodriguez)
* Fix invalid character '"' after object key:value pair [#7504][292] (resouer)
* Fixed kubelet deleting data from volumes on stop ([#7317][293]). [#7503][294] (jsafrane)
* Fixing hooks/description to catch API fields without description tags [#7482][295] (nikhiljindal)
* cadvisor is obsoleted so kubelet service does not require it. [#7457][296] (aveshagarwal)
* Set the default namespace for events to be "default" [#7408][297] (vishh)
* Fix typo in namespace conversion [#7446][298] (liggitt)
* Convert Secret registry to use update/create strategy, allow filtering by Type [#7419][299] (liggitt)
* Use pod namespace when looking for its GlusterFS endpoints. [#7102][300] (jsafrane)
* Fixed name of kube-proxy path in deployment scripts. [#7427][301] (jsafrane)

To download, please visit https://github.com/GoogleCloudPlatform/kubernetes/releases/tag/v0.17.0

<!-- [ ![][327] ][386] -->

[1]: http://kubernetes.io/images/nav_logo.svg
[2]: http://kubernetes.io/docs/
[3]: https://kubernetes.io/blog/
[4]: https://github.com/kubernetes/kubernetes/pull/8065 "Remove old salt configs"
[5]: https://github.com/kubernetes/kubernetes/pull/8069 "Kubelet: minor cleanups"
[6]: https://github.com/kubernetes/kubernetes/pull/7940 "update example/walkthrough to v1beta3"
[7]: https://github.com/kubernetes/kubernetes/pull/7946 "update example/rethinkdb to v1beta3"
[8]: https://github.com/kubernetes/kubernetes/pull/7917 "verify the v1beta3 yaml files all work; merge the yaml files"
[9]: https://github.com/kubernetes/kubernetes/pull/7258 "update examples/cassandra to api v1beta3"
[10]: https://github.com/kubernetes/kubernetes/pull/7899 "update service.json in persistent-volume example to v1beta3"
[11]: https://github.com/kubernetes/kubernetes/pull/7864 "update mysql-wordpress example to use v1beta3 API"
[12]: https://github.com/kubernetes/kubernetes/pull/7848 "Update examples/meteor to use API v1beta3"
[13]: https://github.com/kubernetes/kubernetes/pull/7872 "update node-selector example to API v1beta3"
[14]: https://github.com/kubernetes/kubernetes/pull/7824 "update logging-demo to use API v1beta3; modify the way to access Elasticsearch and Kibana services"
[15]: https://github.com/kubernetes/kubernetes/pull/7619 "Convert the skydns rc to use v1beta3 and add a health check to it"
[16]: https://github.com/kubernetes/kubernetes/pull/7728 "update the hazelcast example to API version v1beta3"
[17]: https://github.com/kubernetes/kubernetes/pull/7515 "Fix YAML parsing for v1beta3 objects in the kubelet for file/http"
[18]: https://github.com/kubernetes/kubernetes/pull/7502 "Updated kubectl cluster-info to show v1beta3 addresses"
[19]: https://github.com/kubernetes/kubernetes/pull/7980 "kubelet: Fix racy kubelet tests."
[20]: https://github.com/kubernetes/kubernetes/pull/8079 "kubelet/container: Move prober.ContainerCommandRunner to container."
[21]: https://github.com/kubernetes/kubernetes/pull/6127 "Kubelet: set host field in the pending pod status"
[22]: https://github.com/kubernetes/kubernetes/pull/6442 "Fix the kubelet node watch"
[23]: https://github.com/kubernetes/kubernetes/pull/6607 "Kubelet: recreate mirror pod if the static pod changes"
[24]: https://github.com/kubernetes/kubernetes/pull/7749 "Kubelet: record the timestamp correctly in the runtime cache"
[25]: https://github.com/kubernetes/kubernetes/pull/7729 "Kubelet: wait until container runtime is up"
[26]: https://github.com/kubernetes/kubernetes/pull/7674 "Kubelet: replace DockerManager with the Runtime interface"
[27]: https://github.com/kubernetes/kubernetes/pull/7301 "Kubelet: filter out terminated pods in SyncPods"
[28]: https://github.com/kubernetes/kubernetes/pull/7048 "Kubelet: parallelize cleaning up containers in unwanted pods"
[29]: https://github.com/kubernetes/kubernetes/pull/7952 "kubelet: Add container runtime option for rkt."
[30]: https://github.com/kubernetes/kubernetes/pull/7916 "kubelet/rkt: Remove build label."
[31]: https://github.com/kubernetes/kubernetes/pull/7327 "kubelet/metrics: Move instrumented_docker.go to dockertools."
[32]: https://github.com/kubernetes/kubernetes/pull/7599 "kubelet/rkt: Add GetPods() for rkt."
[33]: https://github.com/kubernetes/kubernetes/pull/7605 "kubelet/rkt: Add KillPod() and GetPodStatus() for rkt."
[34]: https://github.com/kubernetes/kubernetes/pull/4755 "pkg/kubelet: Fix logging."
[35]: https://github.com/kubernetes/kubernetes/pull/6491 "kubelet: Refactor RunInContainer/ExecInContainer/PortForward."
[36]: https://github.com/kubernetes/kubernetes/pull/6609 "kubelet/DockerManager: Fix returning empty error from GetPodStatus()."
[37]: https://github.com/kubernetes/kubernetes/pull/6634 "kubelet: Move pod infra container image setting to dockertools."
[38]: https://github.com/kubernetes/kubernetes/pull/6653 "kubelet/fake_docker_client: Use self's PID instead of 42 in testing."
[39]: https://github.com/kubernetes/kubernetes/pull/6778 "kubelet/dockertool: Move Getpods() to DockerManager."
[40]: https://github.com/kubernetes/kubernetes/pull/6776 "kubelet/dockertools: Add puller interfaces in the containerManager."
[41]: https://github.com/kubernetes/kubernetes/pull/6608 "kubelet: Introduce PodInfraContainerChanged()."
[42]: https://github.com/kubernetes/kubernetes/pull/6795 "kubelet/container: Replace DockerCache with RuntimeCache."
[43]: https://github.com/kubernetes/kubernetes/pull/6844 "kubelet: Clean up computePodContainerChanges."
[44]: https://github.com/kubernetes/kubernetes/pull/7009 "kubelet: Refactor prober."
[45]: https://github.com/kubernetes/kubernetes/pull/7466 "kubelet/container: Update the runtime interface."
[46]: https://github.com/kubernetes/kubernetes/pull/7477 "kubelet: Refactor isPodRunning() in runonce.go"
[47]: https://github.com/kubernetes/kubernetes/pull/7465 "kubelet/rkt: Add basic rkt runtime routines."
[48]: https://github.com/kubernetes/kubernetes/pull/7555 "kubelet/rkt: Add podInfo."
[49]: https://github.com/kubernetes/kubernetes/pull/7488 "kubelet/container: Add GetContainerLogs to runtime interface."
[50]: https://github.com/kubernetes/kubernetes/pull/7543 "kubelet/rkt: Add routines for converting kubelet pod to rkt pod."
[51]: https://github.com/kubernetes/kubernetes/pull/7589 "kubelet/rkt: Add RunPod() for rkt."
[52]: https://github.com/kubernetes/kubernetes/pull/7553 "kubelet/rkt: Add RunInContainer()/ExecInContainer()/PortForward()."
[53]: https://github.com/kubernetes/kubernetes/pull/7613 "kubelet/container: Move ShouldContainerBeRestarted() to runtime."
[54]: https://github.com/kubernetes/kubernetes/pull/7611 "kubelet/rkt: Add SyncPod() to rkt."
[55]: https://github.com/kubernetes/kubernetes/pull/6794 "Kubelet: persist restart count of a container"
[56]: https://github.com/kubernetes/kubernetes/pull/7951 "kubelet/container: Move pty*.go to container runtime package."
[57]: https://github.com/kubernetes/kubernetes/pull/7900 "kubelet: Add container runtime option for rkt."
[58]: https://github.com/kubernetes/kubernetes/pull/7803 "kubelet/rkt: Add docker prefix to image string."
[59]: https://github.com/kubernetes/kubernetes/pull/7849 "kubelet/rkt: Inject dependencies to rkt."
[60]: https://github.com/kubernetes/kubernetes/pull/7859 "kubelet/rkt: Remove dependencies on rkt.store"
[61]: https://github.com/kubernetes/kubernetes/pull/2387 "Kubelet talks securely to apiserver"
[62]: https://github.com/kubernetes/kubernetes/pull/7592 "Rename EnvVarSource.FieldPath -> FieldRef and add example"
[63]: https://github.com/kubernetes/kubernetes/pull/7741 "Add containerized option to kubelet binary"
[64]: https://github.com/kubernetes/kubernetes/pull/7948 "Ease building kubelet image"
[65]: https://github.com/kubernetes/kubernetes/pull/7854 "Remove unnecessary bind-mount from dockerized kubelet run"
[66]: https://github.com/kubernetes/kubernetes/pull/7798 "Add ability to dockerize kubelet in local cluster"
[67]: https://github.com/kubernetes/kubernetes/pull/7797 "Create docker image for kubelet"
[68]: https://github.com/kubernetes/kubernetes/pull/7343 "Security context - types, kubelet, admission"
[69]: https://github.com/kubernetes/kubernetes/pull/7743 "Kubelet: Add rkt as a runtime option"
[70]: https://github.com/kubernetes/kubernetes/pull/7746 "Fix kubelet's docker RunInContainer implementation "
[71]: https://github.com/kubernetes/kubernetes/pull/8018 "AWS: Don't try to copy gce_keys in jenkins e2e job"
[72]: https://github.com/kubernetes/kubernetes/pull/7992 "AWS: Copy some new properties from config-default => config.test"
[73]: https://github.com/kubernetes/kubernetes/pull/7928 "AWS: make it possible to disable minion public ip assignment"
[74]: https://github.com/kubernetes/kubernetes/pull/7667 "update AWS CloudFormation template and cloud-configs"
[75]: https://github.com/kubernetes/kubernetes/pull/7736 "AWS: Fix variable naming that meant not all tokens were written"
[76]: https://github.com/kubernetes/kubernetes/pull/7678 "AWS: Change apiserver to listen on 443 directly, not through nginx"
[77]: https://github.com/kubernetes/kubernetes/pull/6606 "AWS: Improving getting existing VPC and subnet"
[78]: https://github.com/kubernetes/kubernetes/pull/5138 "AWS EBS volume support"
[79]: https://github.com/kubernetes/kubernetes/pull/8089 "Introduce an 'svc' segment for DNS search"
[80]: https://github.com/kubernetes/kubernetes/pull/5707 "Adds ability to define a prefix for etcd paths"
[81]: https://github.com/kubernetes/kubernetes/pull/7973 "Add kubectl log --previous support to view last terminated container log"
[82]: https://github.com/kubernetes/kubernetes/pull/8083 "Add a flag to disable legacy APIs"
[83]: https://github.com/kubernetes/kubernetes/pull/7971 "make the dockerkeyring handle mutiple matching credentials"
[84]: https://github.com/kubernetes/kubernetes/pull/8078 "Convert Fluentd to Cloud Logging pod specs to YAML"
[85]: https://github.com/kubernetes/kubernetes/pull/7704 "Use etcd to allocate PortalIPs instead of in-mem"
[86]: https://github.com/kubernetes/kubernetes/pull/8064 "eliminate auth-path"
[87]: https://github.com/kubernetes/kubernetes/pull/7981 "Record failure reasons for image pulling"
[88]: https://github.com/kubernetes/kubernetes/pull/7869 "Rate limit replica creation"
[89]: https://github.com/kubernetes/kubernetes/pull/7995 "Upgrade to Kibana 4 for cluster logging"
[90]: https://github.com/kubernetes/kubernetes/pull/8049 "Added name to kube-dns service"
[91]: https://github.com/kubernetes/kubernetes/pull/7919 "Fix validation by moving it into the resource builder."
[92]: https://github.com/kubernetes/kubernetes/pull/8050 "Add cache with multiple shards to decrease lock contention"
[93]: https://github.com/kubernetes/kubernetes/pull/8039 "Delete status from displayable resources"
[94]: https://github.com/kubernetes/kubernetes/pull/8044 "Refactor volume interfaces to receive pod instead of ObjectReference"
[95]: https://github.com/kubernetes/kubernetes/pull/7565 "fix kube-down for provider gke"
[96]: https://github.com/kubernetes/kubernetes/pull/7786 "Service port names are required for multi-port"
[97]: https://github.com/kubernetes/kubernetes/pull/8051 "Increase disk size for kubernetes master."
[98]: https://github.com/kubernetes/kubernetes/pull/7774 "expose: Load input object for increased safety"
[99]: https://github.com/kubernetes/kubernetes/pull/7896 "Improments to conversion methods generator"
[100]: https://github.com/kubernetes/kubernetes/pull/7557 "Added displaying external IPs to kubectl cluster-info"
[101]: https://github.com/kubernetes/kubernetes/pull/8037 "Add missing Errorf formatting directives"
[102]: https://github.com/kubernetes/kubernetes/pull/7567 "WIP: Add startup code to apiserver to migrate etcd keys"
[103]: https://github.com/kubernetes/kubernetes/pull/8021 "Use error type from docker go-client instead of string"
[104]: https://github.com/kubernetes/kubernetes/pull/8024 "Accurately get hardware cpu count in Vagrantfile."
[105]: https://github.com/kubernetes/kubernetes/pull/7921 "Stop setting a GKE specific version of the kubeconfig file"
[106]: https://github.com/kubernetes/kubernetes/pull/7950 "Make the API server deal with HEAD requests via the service proxy"
[107]: https://github.com/kubernetes/kubernetes/pull/7983 "GlusterFS Critical Bug Resolved - Removing warning in README"
[108]: https://github.com/kubernetes/kubernetes/pull/7967 "Don't use the first token `uname -n` as the hostname"
[109]: https://github.com/kubernetes/kubernetes/pull/7982 "Call kube-down in test-teardown for vagrant."
[110]: https://github.com/kubernetes/kubernetes/pull/6235 "defaults_tests: verify defaults when converting to an API object"
[111]: https://github.com/kubernetes/kubernetes/pull/7910 "Use the full hostname for mirror pod name."
[112]: https://github.com/kubernetes/kubernetes/pull/7657 "Removes RunPod in the Runtime interface"
[113]: https://github.com/kubernetes/kubernetes/pull/7533 "Clean up dockertools/manager.go and add more unit tests"
[114]: https://github.com/kubernetes/kubernetes/pull/7525 "Adapt pod killing and cleanup for generic container runtime"
[115]: https://github.com/kubernetes/kubernetes/pull/7198 "Fix pod filtering in replication controller"
[116]: https://github.com/kubernetes/kubernetes/pull/7116 "Print container statuses in `kubectl get pods`"
[117]: https://github.com/kubernetes/kubernetes/pull/6992 "Prioritize deleting the non-running pods when reducing replicas"
[118]: https://github.com/kubernetes/kubernetes/pull/6872 "Fix locking issue in pod manager"
[119]: https://github.com/kubernetes/kubernetes/pull/6655 "Limit the number of concurrent tests in integration.go"
[120]: https://github.com/kubernetes/kubernetes/pull/7931 "Fix typos in different config comments"
[121]: https://github.com/kubernetes/kubernetes/pull/7929 "Update cAdvisor dependency."
[122]: https://github.com/kubernetes/kubernetes/pull/5498 "Ubuntu-distro: deprecate & merge ubuntu single node work to ubuntu cluster node stuff"
[123]: https://github.com/kubernetes/kubernetes/pull/7935 "Add control variables to Jenkins E2E script"
[124]: https://github.com/kubernetes/kubernetes/pull/7932 "Check node status as part of validate-cluster.sh."
[125]: https://github.com/kubernetes/kubernetes/pull/7821 "Add old endpoint cleanup function"
[126]: https://github.com/kubernetes/kubernetes/pull/7620 "Support recovery from in the middle of a rename."
[127]: https://github.com/kubernetes/kubernetes/pull/7715 "Update Exec and Portforward client to use pod subresource"
[128]: https://github.com/kubernetes/kubernetes/pull/7564 "Added NFS to PV structs"
[129]: https://github.com/kubernetes/kubernetes/pull/7904 "Fix environment variable error in Vagrant docs"
[130]: https://github.com/kubernetes/kubernetes/pull/7616 "Adds a simple release-note builder that scrapes the GitHub API for recent PRs"
[131]: https://github.com/kubernetes/kubernetes/pull/7668 "Scheduler ignores nodes that are in a bad state"
[132]: https://github.com/kubernetes/kubernetes/pull/7863 "Set GOMAXPROCS for etcd"
[133]: https://github.com/kubernetes/kubernetes/pull/7556 "Auto-generated conversion methods calling one another"
[134]: https://github.com/kubernetes/kubernetes/pull/7445 "Bring up a kuberenetes cluster using coreos image as worker nodes"
[135]: https://github.com/kubernetes/kubernetes/pull/7410 "Godep: Add godep for rkt."
[136]: https://github.com/kubernetes/kubernetes/pull/7870 "Add volumeGetter to rkt."
[137]: https://github.com/kubernetes/kubernetes/pull/7897 "Update cAdvisor dependency."
[138]: https://github.com/kubernetes/kubernetes/pull/7822 "DNS: expose 53/TCP"
[139]: https://github.com/kubernetes/kubernetes/pull/7763 "Set NodeReady=False when docker is dead"
[140]: https://github.com/kubernetes/kubernetes/pull/7857 "Ignore latency metrics for events"
[141]: https://github.com/kubernetes/kubernetes/pull/7792 "SecurityContext admission clean up"
[142]: https://github.com/kubernetes/kubernetes/pull/7832 "Support manually-created and generated conversion functions"
[143]: https://github.com/kubernetes/kubernetes/pull/7833 "Add latency metrics for etcd operations"
[144]: https://github.com/kubernetes/kubernetes/pull/7885 "Update errors_test.go"
[145]: https://github.com/kubernetes/kubernetes/pull/7861 "Change signature of container runtime PullImage to allow pull w/ secret"
[146]: https://github.com/kubernetes/kubernetes/pull/7873 "Fix bug in Service documentation: incorrect location of `selector` in JSON"
[147]: https://github.com/kubernetes/kubernetes/pull/7876 "Fix controller-manager manifest for providers that don't specify CLUSTER_IP_RANGE"
[148]: https://github.com/kubernetes/kubernetes/pull/7867 "Fix controller unittests"
[149]: https://github.com/kubernetes/kubernetes/pull/7751 "Enable GCM and GCL instead of InfluxDB on GCE"
[150]: https://github.com/kubernetes/kubernetes/pull/7862 "Remove restriction that cluster-cidr be a class-b"
[151]: https://github.com/kubernetes/kubernetes/pull/7591 "Fix OpenShift example"
[152]: https://github.com/kubernetes/kubernetes/pull/7718 "API Server - pass path name in context of create request for subresource"
[153]: https://github.com/kubernetes/kubernetes/pull/7575 "Rolling Updates: Add support for --rollback."
[154]: https://github.com/kubernetes/kubernetes/pull/7820 "Update to container-vm-v20150505 (Also updates GCE to Docker 1.6)"
[155]: https://github.com/kubernetes/kubernetes/pull/7830 "Fix metric label"
[156]: https://github.com/kubernetes/kubernetes/pull/7838 "Fix v1beta1 typos in v1beta2 conversions"
[157]: https://github.com/kubernetes/kubernetes/pull/7764 "skydns: use the etcd-2.x native syntax, enable IANA attributed ports."
[158]: https://github.com/kubernetes/kubernetes/pull/7794 "Added port 6443 to kube-proxy default IP address for api-server"
[159]: https://github.com/kubernetes/kubernetes/pull/7834 "Added client header info for authentication doc."
[160]: https://github.com/kubernetes/kubernetes/pull/7827 "Clean up safe_format_and_mount spam in the startup logs"
[161]: https://github.com/kubernetes/kubernetes/pull/7829 "Set allocate_node_cidrs to be blank by default."
[162]: https://github.com/kubernetes/kubernetes/pull/5246 "Make nodecontroller configure nodes' pod IP ranges"
[163]: https://github.com/kubernetes/kubernetes/pull/7799 "Fix sync problems in #5246"
[164]: https://github.com/kubernetes/kubernetes/pull/7823 "Fix event doc link"
[165]: https://github.com/kubernetes/kubernetes/pull/7776 "Cobra update and bash completions fix"
[166]: https://github.com/kubernetes/kubernetes/pull/7675 "Fix kube2sky flakes. Fix tools.GetEtcdVersion to work with etcd > 2.0.7"
[167]: https://github.com/kubernetes/kubernetes/pull/7154 "Change kube2sky to use token-system-dns secret, point at https endpoint ..."
[168]: https://github.com/kubernetes/kubernetes/pull/7468 "replica: serialize created-by reference"
[169]: https://github.com/kubernetes/kubernetes/pull/7702 "Inject mounter into volume plugins"
[170]: https://github.com/kubernetes/kubernetes/pull/6973 "bringing CoreOS cloud-configs up-to-date (against 0.15.x and latest OS' alpha) "
[171]: https://github.com/kubernetes/kubernetes/pull/7787 "Update kubeconfig-file doc."
[172]: https://github.com/kubernetes/kubernetes/pull/7780 "Throw an API error when deleting namespace in termination"
[173]: https://github.com/kubernetes/kubernetes/pull/7773 "Fix command field PodExecOptions"
[174]: https://github.com/kubernetes/kubernetes/pull/7785 "Start ImageManager housekeeping in Run()."
[175]: https://github.com/kubernetes/kubernetes/pull/7769 "fix DeepCopy to properly support runtime.EmbeddedObject"
[176]: https://github.com/kubernetes/kubernetes/pull/7273 "fix master service endpoint system for multiple masters"
[177]: https://github.com/kubernetes/kubernetes/pull/7757 "Add genbashcomp to KUBE_TEST_TARGETS"
[178]: https://github.com/kubernetes/kubernetes/pull/7669 "Change the cloud provider TCPLoadBalancerExists function to GetTCPLoadBalancer..."
[179]: https://github.com/kubernetes/kubernetes/pull/7772 "Add containerized option to kubelet binary"
[180]: https://github.com/kubernetes/kubernetes/pull/7779 "Fix swagger spec"
[181]: https://github.com/kubernetes/kubernetes/issues/7750 "Hyperkube image requires root certificates to work with cloud-providers (at least AWS)"
[182]: https://github.com/kubernetes/kubernetes/pull/7755 "FIX: Issue #7750 - Hyperkube docker image needs certificates to connect to cloud-providers"
[183]: https://github.com/kubernetes/kubernetes/pull/7752 "Add build labels to rkt"
[184]: https://github.com/kubernetes/kubernetes/pull/7672 "Check license boilerplate for python files"
[185]: https://github.com/kubernetes/kubernetes/pull/7705 "Reliable updates in rollingupdate"
[186]: https://github.com/kubernetes/kubernetes/pull/7650 "Don't exit abruptly if there aren't yet any minions right after the cluster is created."
[187]: https://github.com/kubernetes/kubernetes/pull/7742 "Make changes suggested in #7675"
[188]: https://github.com/kubernetes/kubernetes/pull/7357 "A guide to set up kubernetes multiple nodes cluster with flannel on fedora"
[189]: https://github.com/kubernetes/kubernetes/pull/7760 "Setup generators in factory"
[190]: https://github.com/kubernetes/kubernetes/pull/7737 "Reduce usage of time.After"
[191]: https://github.com/kubernetes/kubernetes/pull/7735 "Remove node status from `componentstatuses` call."
[192]: https://github.com/kubernetes/kubernetes/pull/7614 "React to failure by growing the remaining clusters"
[193]: https://github.com/kubernetes/kubernetes/pull/7725 "Fix typo in runtime_cache.go"
[194]: https://github.com/kubernetes/kubernetes/pull/7740 "Update non-GCE Salt distros to 1.6.0, fallback to ContainerVM Docker version on GCE"
[195]: https://github.com/kubernetes/kubernetes/pull/7744 "Skip SaltStack install if it's already installed"
[196]: https://github.com/kubernetes/kubernetes/pull/7712 "Expose pod name as a label on containers."
[197]: https://github.com/kubernetes/kubernetes/pull/7732 "Log which SSH key is used in e2e SSH test"
[198]: https://github.com/kubernetes/kubernetes/pull/7649 "Add a central simple getting started guide with kubernetes guide."
[199]: https://github.com/kubernetes/kubernetes/pull/7443 "Explicitly state the lack of support for 'Requests' for the purposes of scheduling"
[200]: https://github.com/kubernetes/kubernetes/pull/7721 "Select IPv4-only from host interfaces"
[201]: https://github.com/kubernetes/kubernetes/pull/7723 "Metrics tests can't run on Mac"
[202]: https://github.com/kubernetes/kubernetes/pull/7727 "Add step to API changes doc for swagger regen"
[203]: https://github.com/kubernetes/kubernetes/pull/7703 "Add NsenterMounter mount implementation"
[204]: https://github.com/kubernetes/kubernetes/pull/7509 "add StringSet.HasAny"
[205]: https://github.com/kubernetes/kubernetes/pull/6941 "Add an integration test that checks for the metrics we expect to be exported from the master"
[206]: https://github.com/kubernetes/kubernetes/pull/7722 "Minor bash update found by shellcheck.net"
[207]: https://github.com/kubernetes/kubernetes/pull/7536 "Add --hostport to run-container."
[208]: https://github.com/kubernetes/kubernetes/pull/7659 "Have rkt implement the container Runtime interface"
[209]: https://github.com/kubernetes/kubernetes/pull/7629 "Change the order the different versions of API are registered "
[210]: https://github.com/kubernetes/kubernetes/pull/7699 "expose: Create objects in a generic way"
[211]: https://github.com/kubernetes/kubernetes/pull/7643 "Requeue rc if a single get/put retry on status.Replicas fails"
[212]: https://github.com/kubernetes/kubernetes/pull/7316 "logs for master components"
[213]: https://github.com/kubernetes/kubernetes/pull/7522 "cloudproviders: add ovirt getting started guide"
[214]: https://github.com/kubernetes/kubernetes/pull/7671 "Make rkt-install a oneshot."
[215]: https://github.com/kubernetes/kubernetes/pull/7665 "Provide container_runtime flag to Kubelet in CoreOS."
[216]: https://github.com/kubernetes/kubernetes/pull/7654 "Boilerplate speedup"
[217]: https://github.com/kubernetes/kubernetes/pull/7700 "Log host for failed pod in Density test"
[218]: https://github.com/kubernetes/kubernetes/pull/7655 "Removes spurious quotation mark"
[219]: https://github.com/kubernetes/kubernetes/pull/7694 "Add kubectl_label to custom functions in bash completion"
[220]: https://github.com/kubernetes/kubernetes/pull/7696 "Enable profiling in kube-controller"
[221]: https://github.com/kubernetes/kubernetes/pull/7690 "Set vagrant test cluster default NUM_MINIONS=2"
[222]: https://github.com/kubernetes/kubernetes/pull/7695 "Add metrics to measure cache hit ratio"
[223]: https://github.com/kubernetes/kubernetes/pull/7662 "Change IP to IP(S) in service columns for kubectl get"
[224]: https://github.com/kubernetes/kubernetes/pull/7076 "annotate required flags for bash_completions"
[225]: https://github.com/kubernetes/kubernetes/pull/7685 "(minor) Add pgrep debugging to etcd error"
[226]: https://github.com/kubernetes/kubernetes/pull/7676 "Fixed nil pointer issue in describe when volume is unbound"
[227]: https://github.com/kubernetes/kubernetes/pull/7691 "Removed unnecessary closing bracket"
[228]: https://github.com/kubernetes/kubernetes/pull/7432 "Added TerminationGracePeriod field to PodSpec and grace-period flag to kubectl stop"
[229]: https://github.com/kubernetes/kubernetes/pull/7689 "Fix boilerplate in test/e2e/scale.go"
[230]: https://github.com/kubernetes/kubernetes/pull/7628 "Update expiration timeout based on observed latencies"
[231]: https://github.com/kubernetes/kubernetes/pull/7644 "Output generated conversion functions/names"
[232]: https://github.com/kubernetes/kubernetes/issues/7645 "Move the scale tests into a separate file"
[233]: https://github.com/kubernetes/kubernetes/pull/7646 "Moved the Scale tests into a scale file. #7645"
[234]: https://github.com/kubernetes/kubernetes/pull/7609 "Truncate GCE load balancer names to 63 chars"
[235]: https://github.com/kubernetes/kubernetes/pull/7603 "Add SyncPod() and remove Kill/Run InContainer()."
[236]: https://github.com/kubernetes/kubernetes/pull/7663 "Merge release 0.16 to master"
[237]: https://github.com/kubernetes/kubernetes/pull/7637 "Update license boilerplate for examples/rethinkdb"
[238]: https://github.com/kubernetes/kubernetes/pull/7268 "First part of improved rolling update, allow dynamic next replication controller generation."
[239]: https://github.com/kubernetes/kubernetes/pull/7638 "Add license boilerplate to examples/phabricator"
[240]: https://github.com/kubernetes/kubernetes/pull/7597 "Use generic copyright holder name in license boilerplate"
[241]: https://github.com/kubernetes/kubernetes/pull/7633 "Retry incrementing quota if there is a conflict"
[242]: https://github.com/kubernetes/kubernetes/pull/7568 "Remove GetContainers from Runtime interface"
[243]: https://github.com/kubernetes/kubernetes/pull/7578 "Add image-related methods to DockerManager"
[244]: https://github.com/kubernetes/kubernetes/pull/7586 "Remove more docker references in kubelet"
[245]: https://github.com/kubernetes/kubernetes/pull/7601 "Add KillContainerInPod in DockerManager"
[246]: https://github.com/kubernetes/kubernetes/pull/7652 "Kubelet: Add container runtime option."
[247]: https://github.com/kubernetes/kubernetes/pull/7626 "bump heapster to v0.11.0 and grafana to v0.7.0"
[248]: https://github.com/kubernetes/kubernetes/pull/7593 "Build github.com/onsi/ginkgo/ginkgo as a part of the release"
[249]: https://github.com/kubernetes/kubernetes/pull/7490 "Do not automatically decode runtime.RawExtension"
[250]: https://github.com/kubernetes/kubernetes/pull/7500 "Update changelog."
[251]: https://github.com/kubernetes/kubernetes/pull/7610 "Add SyncPod() to DockerManager and use it in Kubelet"
[252]: https://github.com/kubernetes/kubernetes/pull/7602 "Build: Push .md5 and .sha1 files for every file we push to GCS"
[253]: https://github.com/kubernetes/kubernetes/pull/7540 "Fix rolling update --image "
[254]: https://github.com/kubernetes/kubernetes/pull/7636 "Update license boilerplate for docs/man/md2man-all.sh"
[255]: https://github.com/kubernetes/kubernetes/pull/7632 "Include shell license boilerplate in examples/k8petstore"
[256]: https://github.com/kubernetes/kubernetes/pull/7277 "Add --cgroup_parent flag to Kubelet to set the parent cgroup for pods"
[257]: https://github.com/kubernetes/kubernetes/pull/7209 "change the current dir to the config dir"
[258]: https://github.com/kubernetes/kubernetes/pull/7158 "Set Weave To 0.9.0 And Update Etcd Configuration For Azure"
[259]: https://github.com/kubernetes/kubernetes/pull/7467 "Augment describe to search for matching things if it doesn't match the original resource."
[260]: https://github.com/kubernetes/kubernetes/pull/7559 "Add a simple cache for objects stored in etcd."
[261]: https://github.com/kubernetes/kubernetes/pull/7549 "Rkt gc"
[262]: https://github.com/kubernetes/kubernetes/pull/7550 "Rkt pull"
[263]: https://github.com/kubernetes/kubernetes/pull/6400 "Implement Mount interface using mount(8) and umount(8)"
[264]: https://github.com/kubernetes/kubernetes/pull/7588 "Trim Fleuntd tag for Cloud Logging"
[265]: https://github.com/kubernetes/kubernetes/pull/7569 "GCE CoreOS cluster - set master name based on variable"
[266]: https://github.com/kubernetes/kubernetes/pull/7535 "Capitalization of KubeProxyVersion wrong in JSON"
[267]: https://github.com/kubernetes/kubernetes/pull/7530 "Make nodes report their external IP rather than the master's."
[268]: https://github.com/kubernetes/kubernetes/pull/7539 "Trim cluster log tags to pod name and container name"
[269]: https://github.com/kubernetes/kubernetes/pull/7541 "Handle conversion of boolean query parameters with a value of `false`"
[270]: https://github.com/kubernetes/kubernetes/pull/7532 "Add image-related methods to Runtime interface."
[271]: https://github.com/kubernetes/kubernetes/pull/7560 "Test whether auto-generated conversions weren't manually edited"
[272]: https://github.com/kubernetes/kubernetes/pull/7484 "Mention :latest behavior for image version tag"
[273]: https://github.com/kubernetes/kubernetes/pull/7487 "readinessProbe calls livenessProbe.Exec.Command which cause `invalid memory address or nil pointer dereference`."
[274]: https://github.com/kubernetes/kubernetes/pull/7520 "Add RuntimeHooks to abstract Kubelet logic"
[275]: https://github.com/kubernetes/kubernetes/pull/7546 "Expose URL() on Request to allow building URLs"
[276]: https://github.com/kubernetes/kubernetes/pull/7288 "Add a simple cache for objects stored in etcd"
[277]: https://github.com/kubernetes/kubernetes/pull/7431 "Prepare for chaining autogenerated conversion methods "
[278]: https://github.com/kubernetes/kubernetes/pull/7353 "Increase maxIdleConnection limit when creating etcd client in apiserver."
[279]: https://github.com/kubernetes/kubernetes/pull/7354 "Improvements to generator of conversion methods."
[280]: https://github.com/kubernetes/kubernetes/pull/7107 "Code to automatically generate conversion methods"
[281]: https://github.com/kubernetes/kubernetes/pull/7407 "Support recovery for anonymous roll outs"
[282]: https://github.com/kubernetes/kubernetes/pull/7527 "Bump kube2sky to 1.2. Point it at https endpoint (3rd try)."
[283]: https://github.com/kubernetes/kubernetes/pull/7526 "cluster/gce/coreos: Add metadata-service in node.yaml"
[284]: https://github.com/kubernetes/kubernetes/pull/7480 "Move ComputePodChanges to the Docker runtime"
[285]: https://github.com/kubernetes/kubernetes/pull/7510 "Cobra rebase"
[286]: https://github.com/kubernetes/kubernetes/pull/6718 "Adding system oom events from kubelet"
[287]: https://github.com/kubernetes/kubernetes/pull/7479 "Move Prober to its own subpackage"
[288]: https://github.com/kubernetes/kubernetes/pull/7513 "Fix parallel-e2e.sh to work on my macbook (bash v3.2)"
[289]: https://github.com/kubernetes/kubernetes/pull/7449 "Move network plugin TearDown to DockerManager"
[290]: https://github.com/kubernetes/kubernetes/issues/7498 "CoreOS Getting Started Guide not working"
[291]: https://github.com/kubernetes/kubernetes/pull/7499 "Fixes #7498 - CoreOS Getting Started Guide had invalid cloud config"
[292]: https://github.com/kubernetes/kubernetes/pull/7504 "Fix invalid character &quot; after object key:value pair"
[293]: https://github.com/kubernetes/kubernetes/issues/7317 "GlusterFS Volume Plugin deletes the contents of the mounted volume upon Pod deletion"
[294]: https://github.com/kubernetes/kubernetes/pull/7503 "Fixed kubelet deleting data from volumes on stop (#7317)."
[295]: https://github.com/kubernetes/kubernetes/pull/7482 "Fixing hooks/description to catch API fields without description tags"
[296]: https://github.com/kubernetes/kubernetes/pull/7457 "cadvisor is obsoleted so kubelet service does not require it."
[297]: https://github.com/kubernetes/kubernetes/pull/7408 "Set the default namespace for events to be &quot;default&quot;"
[298]: https://github.com/kubernetes/kubernetes/pull/7446 "Fix typo in namespace conversion"
[299]: https://github.com/kubernetes/kubernetes/pull/7419 "Convert Secret registry to use update/create strategy, allow filtering by Type"
[300]: https://github.com/kubernetes/kubernetes/pull/7102 "Use pod namespace when looking for its GlusterFS endpoints."
[301]: https://github.com/kubernetes/kubernetes/pull/7427 "Fixed name of kube-proxy path in deployment scripts."
