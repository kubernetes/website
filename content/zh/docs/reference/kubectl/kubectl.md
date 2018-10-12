---
title: kubectl
notitle: true
---

## kubectl
<!--
kubectl controls the Kubernetes cluster manager
-->
<<<<<<< HEAD
kubectl å¯ä»¥æ“æŽ§ Kubernetes é›†ç¾¤ã€‚
=======
kubectl ¿ÉÒÔ²Ù¿Ø Kubernetes ¼¯Èº¡£
>>>>>>> Update localization guidelines (#10485)

<!--
### Synopsis

kubectl controls the Kubernetes cluster manager. 

Find more information at: https://kubernetes.io/docs/reference/kubectl/overview/
-->
<<<<<<< HEAD
### ç®€ä»‹

kubectl å¯ä»¥æ“æŽ§ Kubernetes é›†ç¾¤ã€‚

èŽ·å–æ›´å¤šä¿¡æ¯ï¼Œè¯·è®¿é—®ï¼šhttps://kubernetes.io/docs/reference/kubectl/overview/
=======
### ¼ò½é

kubectl ¿ÉÒÔ²Ù¿Ø Kubernetes ¼¯Èº¡£

»ñÈ¡¸ü¶àÐÅÏ¢£¬Çë·ÃÎÊ£ºhttps://kubernetes.io/docs/reference/kubectl/overview/
>>>>>>> Update localization guidelines (#10485)

```
kubectl [flags]
```
<!--
### Options

```
      --alsologtostderr                  log to standard error as well as files
      --as string                        Username to impersonate for the operation
      --as-group stringArray             Group to impersonate for the operation, this flag can be repeated to specify multiple groups.
      --cache-dir string                 Default HTTP cache directory (default "/home/username/.kube/http-cache")
      --certificate-authority string     Path to a cert file for the certificate authority
      --client-certificate string        Path to a client certificate file for TLS
      --client-key string                Path to a client key file for TLS
      --cluster string                   The name of the kubeconfig cluster to use
      --context string                   The name of the kubeconfig context to use
  -h, --help                             help for kubectl
      --insecure-skip-tls-verify         If true, the server's certificate will not be checked for validity. This will make your HTTPS connections insecure
      --kubeconfig string                Path to the kubeconfig file to use for CLI requests.
      --log-backtrace-at traceLocation   when logging hits line file:N, emit a stack trace (default :0)
      --log-dir string                   If non-empty, write log files in this directory
      --logtostderr                      log to standard error instead of files
      --match-server-version             Require server version to match client version
  -n, --namespace string                 If present, the namespace scope for this CLI request
      --request-timeout string           The length of time to wait before giving up on a single server request. Non-zero values should contain a corresponding time unit (e.g. 1s, 2m, 3h). A value of zero means don't timeout requests. (default "0")
  -s, --server string                    The address and port of the Kubernetes API server
      --stderrthreshold severity         logs at or above this threshold go to stderr (default 2)
      --token string                     Bearer token for authentication to the API server
      --user string                      The name of the kubeconfig user to use
  -v, --v Level                          log level for V logs
      --vmodule moduleSpec               comma-separated list of pattern=N settings for file-filtered logging
```
-->
<<<<<<< HEAD
### é€‰é¡¹
```
      --alsologtostderr                  åŒæ—¶è¾“å‡ºæ—¥å¿—åˆ°æ ‡å‡†é”™è¯¯æŽ§åˆ¶å°å’Œæ–‡ä»¶
      --as string                        ä»¥æŒ‡å®šç”¨æˆ·æ‰§è¡Œæ“ä½œ
	  --as-group stringArray             æ¨¡æ‹Ÿæ“ä½œçš„ç»„ï¼Œå¯ä»¥ä½¿ç”¨è¿™ä¸ªæ ‡è¯†æ¥æŒ‡å®šå¤šä¸ªç»„ã€‚
      --cache-dir string                 é»˜è®¤ HTTP ç¼“å­˜ç›®å½•ï¼ˆé»˜è®¤å€¼ "/home/username/.kube/http-cache" ï¼‰
      --certificate-authority string     ç”¨äºŽè¿›è¡Œè®¤è¯æŽˆæƒçš„ .cert æ–‡ä»¶è·¯å¾„
      --client-certificate string        TLS ä½¿ç”¨çš„å®¢æˆ·ç«¯è¯ä¹¦è·¯å¾„
      --client-key string                TLS ä½¿ç”¨çš„å®¢æˆ·ç«¯å¯†é’¥æ–‡ä»¶è·¯å¾„
      --cluster string                   æŒ‡å®šè¦ä½¿ç”¨çš„ kubeconfig æ–‡ä»¶ä¸­é›†ç¾¤å
      --context string                   æŒ‡å®šè¦ä½¿ç”¨çš„ kubeconfig æ–‡ä»¶ä¸­ä¸Šä¸‹æ–‡
  -h, --help                             kubectl å¸®åŠ©
      --insecure-skip-tls-verify         å€¼ä¸º trueï¼Œåˆ™ä¸ä¼šæ£€æŸ¥æœåŠ¡å™¨çš„è¯ä¹¦çš„æœ‰æ•ˆæ€§ã€‚ è¿™å°†ä½¿æ‚¨çš„HTTPSè¿žæŽ¥ä¸å®‰å…¨
      --kubeconfig string                CLI è¯·æ±‚ä½¿ç”¨çš„ kubeconfig é…ç½®æ–‡ä»¶è·¯å¾„ã€‚
      --log-backtrace-at traceLocation   å½“æ—¥å¿—é•¿åº¦è¶…å‡ºè§„å®šçš„è¡Œæ•°æ—¶ï¼Œå¿½ç•¥å †æ ˆä¿¡æ¯ï¼ˆé»˜è®¤å€¼ï¼š0ï¼‰
      --log-dir string                   å¦‚æžœä¸ä¸ºç©ºï¼Œåˆ™å°†æ—¥å¿—æ–‡ä»¶å†™å…¥æ­¤ç›®å½•
      --logtostderr                      æ—¥å¿—è¾“å‡ºåˆ°æ ‡å‡†é”™è¯¯æŽ§åˆ¶å°è€Œä¸è¾“å‡ºåˆ°æ–‡ä»¶
      --match-server-version             è¦æ±‚å®¢æˆ·ç«¯ç‰ˆæœ¬å’ŒæœåŠ¡ç«¯ç‰ˆæœ¬ç›¸åŒ¹é…
  -n, --namespace string                 å¦‚æžœå­˜åœ¨ï¼ŒCLI è¯·æ±‚å°†ä½¿ç”¨æ­¤å‘½åç©ºé—´
      --request-timeout string           æ”¾å¼ƒä¸€ä¸ªç®€å•æœåŠ¡è¯·æ±‚å‰çš„ç­‰å¾…æ—¶é—´ï¼Œéžé›¶å€¼éœ€è¦åŒ…å«ç›¸åº”æ—¶é—´å•ä½(ä¾‹å¦‚ï¼š1s, 2m, 3h)ã€‚é›¶å€¼åˆ™è®¤ä¸ºä¸åšè¶…æ—¶è¯·æ±‚ã€‚ (é»˜è®¤å€¼ "0")
  -s, --server string                    Kubernetes API server çš„åœ°å€å’Œç«¯å£
      --stderrthreshold severity         ç­‰äºŽæˆ–é«˜äºŽæ­¤é˜ˆå€¼çš„æ—¥å¿—å°†è¾“å‡ºæ ‡å‡†é”™è¯¯æŽ§åˆ¶å°ï¼ˆé»˜è®¤å€¼2ï¼‰
      --token string                     ç”¨äºŽ API server è¿›è¡Œèº«ä»½è®¤è¯çš„æ‰¿è½½ä»¤ç‰Œ
      --user string                      æŒ‡å®šä½¿ç”¨çš„ kubeconfig é…ç½®æ–‡ä»¶ä¸­çš„ç”¨æˆ·å
  -v, --v Level                          æŒ‡å®šè¾“å‡ºæ—¥å¿—çš„æ—¥å¿—çº§åˆ«
      --vmodule moduleSpec               æŒ‡å®šè¾“å‡ºæ—¥å¿—çš„æ¨¡å—ï¼Œæ ¼å¼å¦‚ä¸‹ï¼špattern=Nï¼Œä½¿ç”¨é€—å·åˆ†éš”
=======
### Ñ¡Ïî
```
      --alsologtostderr                  Í¬Ê±Êä³öÈÕÖ¾µ½±ê×¼´íÎó¿ØÖÆÌ¨ºÍÎÄ¼þ
      --as string                        ÒÔÖ¸¶¨ÓÃ»§Ö´ÐÐ²Ù×÷
	  --as-group stringArray             Ä£Äâ²Ù×÷µÄ×é£¬¿ÉÒÔÊ¹ÓÃÕâ¸ö±êÊ¶À´Ö¸¶¨¶à¸ö×é¡£
      --cache-dir string                 Ä¬ÈÏ HTTP »º´æÄ¿Â¼£¨Ä¬ÈÏÖµ "/home/username/.kube/http-cache" £©
      --certificate-authority string     ÓÃÓÚ½øÐÐÈÏÖ¤ÊÚÈ¨µÄ .cert ÎÄ¼þÂ·¾¶
      --client-certificate string        TLS Ê¹ÓÃµÄ¿Í»§¶ËÖ¤ÊéÂ·¾¶
      --client-key string                TLS Ê¹ÓÃµÄ¿Í»§¶ËÃÜÔ¿ÎÄ¼þÂ·¾¶
      --cluster string                   Ö¸¶¨ÒªÊ¹ÓÃµÄ kubeconfig ÎÄ¼þÖÐ¼¯ÈºÃû
      --context string                   Ö¸¶¨ÒªÊ¹ÓÃµÄ kubeconfig ÎÄ¼þÖÐÉÏÏÂÎÄ
  -h, --help                             kubectl °ïÖú
      --insecure-skip-tls-verify         ÖµÎª true£¬Ôò²»»á¼ì²é·þÎñÆ÷µÄÖ¤ÊéµÄÓÐÐ§ÐÔ¡£ Õâ½«Ê¹ÄúµÄHTTPSÁ¬½Ó²»°²È«
      --kubeconfig string                CLI ÇëÇóÊ¹ÓÃµÄ kubeconfig ÅäÖÃÎÄ¼þÂ·¾¶¡£
      --log-backtrace-at traceLocation   µ±ÈÕÖ¾³¤¶È³¬³ö¹æ¶¨µÄÐÐÊýÊ±£¬ºöÂÔ¶ÑÕ»ÐÅÏ¢£¨Ä¬ÈÏÖµ£º0£©
      --log-dir string                   Èç¹û²»Îª¿Õ£¬Ôò½«ÈÕÖ¾ÎÄ¼þÐ´Èë´ËÄ¿Â¼
      --logtostderr                      ÈÕÖ¾Êä³öµ½±ê×¼´íÎó¿ØÖÆÌ¨¶ø²»Êä³öµ½ÎÄ¼þ
      --match-server-version             ÒªÇó¿Í»§¶Ë°æ±¾ºÍ·þÎñ¶Ë°æ±¾ÏàÆ¥Åä
  -n, --namespace string                 Èç¹û´æÔÚ£¬CLI ÇëÇó½«Ê¹ÓÃ´ËÃüÃû¿Õ¼ä
      --request-timeout string           ·ÅÆúÒ»¸ö¼òµ¥·þÎñÇëÇóÇ°µÄµÈ´ýÊ±¼ä£¬·ÇÁãÖµÐèÒª°üº¬ÏàÓ¦Ê±¼äµ¥Î»(ÀýÈç£º1s, 2m, 3h)¡£ÁãÖµÔòÈÏÎª²»×ö³¬Ê±ÇëÇó¡£ (Ä¬ÈÏÖµ "0")
  -s, --server string                    Kubernetes API server µÄµØÖ·ºÍ¶Ë¿Ú
      --stderrthreshold severity         µÈÓÚ»ò¸ßÓÚ´ËãÐÖµµÄÈÕÖ¾½«Êä³ö±ê×¼´íÎó¿ØÖÆÌ¨£¨Ä¬ÈÏÖµ2£©
      --token string                     ÓÃÓÚ API server ½øÐÐÉí·ÝÈÏÖ¤µÄ³ÐÔØÁîÅÆ
      --user string                      Ö¸¶¨Ê¹ÓÃµÄ kubeconfig ÅäÖÃÎÄ¼þÖÐµÄÓÃ»§Ãû
  -v, --v Level                          Ö¸¶¨Êä³öÈÕÖ¾µÄÈÕÖ¾¼¶±ð
      --vmodule moduleSpec               Ö¸¶¨Êä³öÈÕÖ¾µÄÄ£¿é£¬¸ñÊ½ÈçÏÂ£ºpattern=N£¬Ê¹ÓÃ¶ººÅ·Ö¸ô
>>>>>>> Update localization guidelines (#10485)
```
<!--
### SEE ALSO

* [kubectl alpha](kubectl_alpha.md)	 - Commands for features in alpha
* [kubectl annotate](kubectl_annotate.md)	 - Update the annotations on a resource
* [kubectl api-resources](kubectl_api-resources.md)	 - Print the supported API resources on the server
* [kubectl api-versions](kubectl_api-versions.md)	 - Print the supported API versions on the server, in the form of "group/version"
* [kubectl apply](kubectl_apply.md)	 - Apply a configuration to a resource by filename or stdin
* [kubectl attach](kubectl_attach.md)	 - Attach to a running container
* [kubectl auth](kubectl_auth.md)	 - Inspect authorization
* [kubectl autoscale](kubectl_autoscale.md)	 - Auto-scale a Deployment, ReplicaSet, or ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - Modify certificate resources.
* [kubectl cluster-info](kubectl_cluster-info.md)	 - Display cluster info
* [kubectl completion](kubectl_completion.md)	 - Output shell completion code for the specified shell (bash or zsh)
* [kubectl config](kubectl_config.md)	 - Modify kubeconfig files
* [kubectl convert](kubectl_convert.md)	 - Convert config files between different API versions
* [kubectl cordon](kubectl_cordon.md)	 - Mark node as unschedulable
* [kubectl cp](kubectl_cp.md)	 - Copy files and directories to and from containers.
* [kubectl create](kubectl_create.md)	 - Create a resource from a file or from stdin.
* [kubectl delete](kubectl_delete.md)	 - Delete resources by filenames, stdin, resources and names, or by resources and label selector
* [kubectl describe](kubectl_describe.md)	 - Show details of a specific resource or group of resources
* [kubectl drain](kubectl_drain.md)	 - Drain node in preparation for maintenance
* [kubectl edit](kubectl_edit.md)	 - Edit a resource on the server
* [kubectl exec](kubectl_exec.md)	 - Execute a command in a container
* [kubectl explain](kubectl_explain.md)	 - Documentation of resources
* [kubectl expose](kubectl_expose.md)	 - Take a replication controller, service, deployment or pod and expose it as a new Kubernetes Service
* [kubectl get](kubectl_get.md)	 - Display one or many resources
* [kubectl label](kubectl_label.md)	 - Update the labels on a resource
* [kubectl logs](kubectl_logs.md)	 - Print the logs for a container in a pod
* [kubectl options](kubectl_options.md)	 - Print the list of flags inherited by all commands
* [kubectl patch](kubectl_patch.md)	 - Update field(s) of a resource using strategic merge patch
* [kubectl plugin](kubectl_plugin.md)	 - Runs a command-line plugin
* [kubectl port-forward](kubectl_port-forward.md)	 - Forward one or more local ports to a pod
* [kubectl proxy](kubectl_proxy.md)	 - Run a proxy to the Kubernetes API server
* [kubectl replace](kubectl_replace.md)	 - Replace a resource by filename or stdin
* [kubectl rollout](kubectl_rollout.md)	 - Manage the rollout of a resource
* [kubectl run](kubectl_run.md)	 - Run a particular image on the cluster
* [kubectl scale](kubectl_scale.md)	 - Set a new size for a Deployment, ReplicaSet, Replication Controller, or Job
* [kubectl set](kubectl_set.md)	 - Set specific features on objects
* [kubectl taint](kubectl_taint.md)	 - Update the taints on one or more nodes
* [kubectl top](kubectl_top.md)	 - Display Resource (CPU/Memory/Storage) usage.
* [kubectl uncordon](kubectl_uncordon.md)	 - Mark node as schedulable
* [kubectl version](kubectl_version.md)	 - Print the client and server version information
* [kubectl wait](kubectl_wait.md)	 - Experimental: Wait for one condition on one or many resources
-->
<<<<<<< HEAD
### æŽ¥ä¸‹æ¥çœ‹

* [kubectl alpha](kubectl_alpha.md)	 - alphaçŽ¯å¢ƒä¸Šå‘½ä»¤å±žæ€§
* [kubectl annotate](kubectl_annotate.md)	 - æ›´æ–°èµ„æºä¸Šæ³¨é‡Š
* [kubectl api-resources](kubectl_api-resources.md)	 - åœ¨æœåŠ¡å™¨ä¸Šæ‰“å°æ”¯æŒçš„ API èµ„æº
* [kubectl api-versions](kubectl_api-versions.md)	 - ä»¥ "group/version" çš„å½¢å¼åœ¨æœåŠ¡å™¨ä¸Šæ‰“å°æ”¯æŒçš„ API ç‰ˆæœ¬
* [kubectl apply](kubectl_apply.md)	 - é€šè¿‡æ–‡ä»¶åæˆ–æ ‡å‡†è¾“å…¥å°†é…ç½®æ·»åŠ ç»™èµ„æº
* [kubectl attach](kubectl_attach.md)	 - é™„åŠ åˆ°æ­£åœ¨è¿è¡Œçš„å®¹å™¨
* [kubectl auth](kubectl_auth.md)	 - æ£€æŸ¥æŽˆæƒ
* [kubectl autoscale](kubectl_autoscale.md)	 - è‡ªåŠ¨æ‰©å±• Deployment, ReplicaSet æˆ– ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - ä¿®æ”¹è¯ä¹¦èµ„æºã€‚
* [kubectl cluster-info](kubectl_cluster-info.md)	 - å±•ç¤ºé›†ç¾¤ä¿¡æ¯
* [kubectl completion](kubectl_completion.md)	 - ä¸ºç»™å®šçš„ shell è¾“å‡ºå®Œæˆä»£ç ï¼ˆ bash æˆ– zshï¼‰
* [kubectl config](kubectl_config.md)	 - ä¿®æ”¹ kubeconfig é…ç½®æ–‡ä»¶
* [kubectl convert](kubectl_convert.md)	 - åœ¨ä¸åŒçš„ API ç‰ˆæœ¬ä¹‹é—´è½¬æ¢é…ç½®æ–‡ä»¶
* [kubectl cordon](kubectl_cordon.md)	 - å°† node èŠ‚ç‚¹æ ‡è®°ä¸ºä¸å¯è°ƒåº¦
* [kubectl cp](kubectl_cp.md)	 - ä»Žå®¹å™¨å¤åˆ¶æ–‡ä»¶å’Œç›®å½•ï¼Œä¹Ÿå¯å°†æ–‡ä»¶å’Œç›®å½•å¤åˆ¶åˆ°å®¹å™¨ã€‚
* [kubectl create](kubectl_create.md)	 - é€šè¿‡æ–‡ä»¶åæˆ–æ ‡å‡†è¾“å…¥åˆ›å»ºèµ„æºã€‚
* [kubectl delete](kubectl_delete.md)	 - é€šè¿‡æ–‡ä»¶åï¼Œæ ‡å‡†è¾“å…¥ï¼Œèµ„æºå’Œåç§°æˆ–èµ„æºå’Œæ ‡ç­¾é€‰æ‹©å™¨åˆ é™¤èµ„æº
* [kubectl describe](kubectl_describe.md)	 - æ˜¾ç¤ºç‰¹å®šèµ„æºæˆ–èµ„æºç»„çš„è¯¦ç»†ä¿¡æ¯
* [kubectl drain](kubectl_drain.md)	 - ä¸ºä¾¿äºŽç»´æŠ¤ï¼Œéœ€è¦æå‰é©±é€nodeèŠ‚ç‚¹
* [kubectl edit](kubectl_edit.md)	 - åœ¨æœåŠ¡å™¨ç¼–è¾‘èµ„æº
* [kubectl exec](kubectl_exec.md)	 - å®¹å™¨å†…é€€å‡ºå‘½ä»¤
* [kubectl explain](kubectl_explain.md)	 - èµ„æºæ–‡æ¡£
* [kubectl expose](kubectl_expose.md)	 - èŽ·å– replication controller, service, deployment æˆ– pod èµ„æºï¼Œå¹¶ä½œä¸ºæ–°çš„ Kubernetes æœåŠ¡æš´éœ²
* [kubectl get](kubectl_get.md)	 - å±•ç¤ºä¸€ä¸ªæˆ–å¤šä¸ªèµ„æº
* [kubectl label](kubectl_label.md)	 - å‡çº§èµ„æºæ ‡ç­¾
* [kubectl logs](kubectl_logs.md)	 - ä¸º pod ä¸­çš„å®¹å™¨æ‰“å°æ—¥å¿—
* [kubectl options](kubectl_options.md)	 - æ‰“å°æ‰€æœ‰å‘½ä»¤ç»§æ‰¿çš„æ ‡è¯†åˆ—è¡¨
* [kubectl patch](kubectl_patch.md)	 - ä½¿ç”¨æˆ˜ç•¥æ€§åˆå¹¶è¡¥ä¸æ›´æ–°èµ„æºå­—æ®µ
* [kubectl plugin](kubectl_plugin.md)	 - è¿è¡Œå‘½ä»¤è¡Œæ’ä»¶
* [kubectl port-forward](kubectl_port-forward.md)	 - ç»™ pod å¼€æ”¾ä¸€ä¸ªæˆ–å¤šä¸ªæœ¬åœ°ç«¯å£
* [kubectl proxy](kubectl_proxy.md)	 - ä¸º Kubernetes API server è¿è¡Œä»£ç†
* [kubectl replace](kubectl_replace.md)	 - é€šè¿‡æ–‡ä»¶æˆ–æ ‡å‡†è¾“å…¥æ›¿æ¢èµ„æº
* [kubectl rollout](kubectl_rollout.md)	 - ç®¡ç†èµ„æºå±•ç¤º
* [kubectl run](kubectl_run.md)	 - åœ¨é›†ç¾¤ä¸Šè¿è¡ŒæŒ‡å®šé•œåƒ
* [kubectl scale](kubectl_scale.md)	 - ç»™ Deployment, ReplicaSet, Replication Controller æˆ– Job è®¾ç½®æ–°å‰¯æœ¬è§„æ¨¡
* [kubectl set](kubectl_set.md)	 - ç»™å¯¹è±¡è®¾ç½®ç‰¹å®šåŠŸèƒ½
* [kubectl taint](kubectl_taint.md)	 - æ›´æ–°ä¸€ä¸ªæˆ–å¤šä¸ª node èŠ‚ç‚¹çš„æ±¡ç‚¹ä¿¡æ¯
* [kubectl top](kubectl_top.md)	 - å±•ç¤ºèµ„æº (CPU/Memory/Storage) ä½¿ç”¨ä¿¡æ¯ã€‚
* [kubectl uncordon](kubectl_uncordon.md)	 - æ ‡è®° node èŠ‚ç‚¹ä¸ºå¯è°ƒåº¦
* [kubectl version](kubectl_version.md)	 - æ‰“å°å®¢æˆ·ç«¯å’ŒæœåŠ¡ç«¯ç‰ˆæœ¬ä¿¡æ¯
* [kubectl wait](kubectl_wait.md)	 - è¯•éªŒ: åœ¨ä¸€ä¸ªæˆ–å¤šä¸ªèµ„æºä¸Šç­‰å¾…æ¡ä»¶å®Œæˆ
=======
### ½ÓÏÂÀ´¿´

* [kubectl alpha](kubectl_alpha.md)	 - alpha»·¾³ÉÏÃüÁîÊôÐÔ
* [kubectl annotate](kubectl_annotate.md)	 - ¸üÐÂ×ÊÔ´ÉÏ×¢ÊÍ
* [kubectl api-resources](kubectl_api-resources.md)	 - ÔÚ·þÎñÆ÷ÉÏ´òÓ¡Ö§³ÖµÄ API ×ÊÔ´
* [kubectl api-versions](kubectl_api-versions.md)	 - ÒÔ "group/version" µÄÐÎÊ½ÔÚ·þÎñÆ÷ÉÏ´òÓ¡Ö§³ÖµÄ API °æ±¾
* [kubectl apply](kubectl_apply.md)	 - Í¨¹ýÎÄ¼þÃû»ò±ê×¼ÊäÈë½«ÅäÖÃÌí¼Ó¸ø×ÊÔ´
* [kubectl attach](kubectl_attach.md)	 - ¸½¼Óµ½ÕýÔÚÔËÐÐµÄÈÝÆ÷
* [kubectl auth](kubectl_auth.md)	 - ¼ì²éÊÚÈ¨
* [kubectl autoscale](kubectl_autoscale.md)	 - ×Ô¶¯À©Õ¹ Deployment, ReplicaSet »ò ReplicationController
* [kubectl certificate](kubectl_certificate.md)	 - ÐÞ¸ÄÖ¤Êé×ÊÔ´¡£
* [kubectl cluster-info](kubectl_cluster-info.md)	 - Õ¹Ê¾¼¯ÈºÐÅÏ¢
* [kubectl completion](kubectl_completion.md)	 - Îª¸ø¶¨µÄ shell Êä³öÍê³É´úÂë£¨ bash »ò zsh£©
* [kubectl config](kubectl_config.md)	 - ÐÞ¸Ä kubeconfig ÅäÖÃÎÄ¼þ
* [kubectl convert](kubectl_convert.md)	 - ÔÚ²»Í¬µÄ API °æ±¾Ö®¼ä×ª»»ÅäÖÃÎÄ¼þ
* [kubectl cordon](kubectl_cordon.md)	 - ½« node ½Úµã±ê¼ÇÎª²»¿Éµ÷¶È
* [kubectl cp](kubectl_cp.md)	 - ´ÓÈÝÆ÷¸´ÖÆÎÄ¼þºÍÄ¿Â¼£¬Ò²¿É½«ÎÄ¼þºÍÄ¿Â¼¸´ÖÆµ½ÈÝÆ÷¡£
* [kubectl create](kubectl_create.md)	 - Í¨¹ýÎÄ¼þÃû»ò±ê×¼ÊäÈë´´½¨×ÊÔ´¡£
* [kubectl delete](kubectl_delete.md)	 - Í¨¹ýÎÄ¼þÃû£¬±ê×¼ÊäÈë£¬×ÊÔ´ºÍÃû³Æ»ò×ÊÔ´ºÍ±êÇ©Ñ¡ÔñÆ÷É¾³ý×ÊÔ´
* [kubectl describe](kubectl_describe.md)	 - ÏÔÊ¾ÌØ¶¨×ÊÔ´»ò×ÊÔ´×éµÄÏêÏ¸ÐÅÏ¢
* [kubectl drain](kubectl_drain.md)	 - Îª±ãÓÚÎ¬»¤£¬ÐèÒªÌáÇ°ÇýÖðnode½Úµã
* [kubectl edit](kubectl_edit.md)	 - ÔÚ·þÎñÆ÷±à¼­×ÊÔ´
* [kubectl exec](kubectl_exec.md)	 - ÈÝÆ÷ÄÚÍË³öÃüÁî
* [kubectl explain](kubectl_explain.md)	 - ×ÊÔ´ÎÄµµ
* [kubectl expose](kubectl_expose.md)	 - »ñÈ¡ replication controller, service, deployment »ò pod ×ÊÔ´£¬²¢×÷ÎªÐÂµÄ Kubernetes ·þÎñ±©Â¶
* [kubectl get](kubectl_get.md)	 - Õ¹Ê¾Ò»¸ö»ò¶à¸ö×ÊÔ´
* [kubectl label](kubectl_label.md)	 - Éý¼¶×ÊÔ´±êÇ©
* [kubectl logs](kubectl_logs.md)	 - Îª pod ÖÐµÄÈÝÆ÷´òÓ¡ÈÕÖ¾
* [kubectl options](kubectl_options.md)	 - ´òÓ¡ËùÓÐÃüÁî¼Ì³ÐµÄ±êÊ¶ÁÐ±í
* [kubectl patch](kubectl_patch.md)	 - Ê¹ÓÃÕ½ÂÔÐÔºÏ²¢²¹¶¡¸üÐÂ×ÊÔ´×Ö¶Î
* [kubectl plugin](kubectl_plugin.md)	 - ÔËÐÐÃüÁîÐÐ²å¼þ
* [kubectl port-forward](kubectl_port-forward.md)	 - ¸ø pod ¿ª·ÅÒ»¸ö»ò¶à¸ö±¾µØ¶Ë¿Ú
* [kubectl proxy](kubectl_proxy.md)	 - Îª Kubernetes API server ÔËÐÐ´úÀí
* [kubectl replace](kubectl_replace.md)	 - Í¨¹ýÎÄ¼þ»ò±ê×¼ÊäÈëÌæ»»×ÊÔ´
* [kubectl rollout](kubectl_rollout.md)	 - ¹ÜÀí×ÊÔ´Õ¹Ê¾
* [kubectl run](kubectl_run.md)	 - ÔÚ¼¯ÈºÉÏÔËÐÐÖ¸¶¨¾µÏñ
* [kubectl scale](kubectl_scale.md)	 - ¸ø Deployment, ReplicaSet, Replication Controller »ò Job ÉèÖÃÐÂ¸±±¾¹æÄ£
* [kubectl set](kubectl_set.md)	 - ¸ø¶ÔÏóÉèÖÃÌØ¶¨¹¦ÄÜ
* [kubectl taint](kubectl_taint.md)	 - ¸üÐÂÒ»¸ö»ò¶à¸ö node ½ÚµãµÄÎÛµãÐÅÏ¢
* [kubectl top](kubectl_top.md)	 - Õ¹Ê¾×ÊÔ´ (CPU/Memory/Storage) Ê¹ÓÃÐÅÏ¢¡£
* [kubectl uncordon](kubectl_uncordon.md)	 - ±ê¼Ç node ½ÚµãÎª¿Éµ÷¶È
* [kubectl version](kubectl_version.md)	 - ´òÓ¡¿Í»§¶ËºÍ·þÎñ¶Ë°æ±¾ÐÅÏ¢
* [kubectl wait](kubectl_wait.md)	 - ÊÔÑé: ÔÚÒ»¸ö»ò¶à¸ö×ÊÔ´ÉÏµÈ´ýÌõ¼þÍê³É
>>>>>>> Update localization guidelines (#10485)

<!--
###### Auto generated by spf13/cobra on 16-Jun-2018
-->
<<<<<<< HEAD
######2018å¹´6æœˆ16æ—¥ï¼Œé€šè¿‡spf13/cobraè‡ªåŠ¨ç”Ÿæˆ

=======
######2018Äê6ÔÂ16ÈÕ£¬Í¨¹ýspf13/cobra×Ô¶¯Éú³É
>>>>>>> Update localization guidelines (#10485)

