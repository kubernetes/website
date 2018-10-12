<!--
---
reviewers:
- janetkuo
title: Tools
content_template: templates/concept
---
-->
---
reviewers:
- janetkuo
<<<<<<< HEAD
title: å·¥å…·
=======
title: ¹¤¾ß
>>>>>>> Update localization guidelines (#10485)
content_template: templates/concept
---

<!--
<<<<<<< HEAD
Kubernetes contains several built-in tools to help you work with the Kubernetes system.
-->
{{% capture overview %}}
Kubernetes åŒ…å«ä¸€äº›å†…ç½®å·¥å…·ï¼Œå¯ä»¥å¸®åŠ©ç”¨æˆ·æ›´å¥½çš„ä½¿ç”¨ Kubernetes ç³»ç»Ÿã€‚
=======
{{% capture overview %}}
Kubernetes contains several built-in tools to help you work with the Kubernetes system.
{{% /capture %}}
-->
{{% capture overview %}}
Kubernetes °üº¬Ò»Ð©ÄÚÖÃ¹¤¾ß£¬¿ÉÒÔ°ïÖúÓÃ»§¸üºÃµÄÊ¹ÓÃ Kubernetes ÏµÍ³¡£
>>>>>>> Update localization guidelines (#10485)
{{% /capture %}}

{{% capture body %}}
## Kubectl

<!--
[`kubectl`](/docs/tasks/tools/install-kubectl/) is the command line tool for Kubernetes. It controls the Kubernetes cluster manager.
-->
<<<<<<< HEAD
[`kubectl`](/docs/tasks/tools/install-kubectl/) æ˜¯ Kubernetes å‘½ä»¤è¡Œå·¥å…·ï¼Œå¯ä»¥ç”¨æ¥æ“æŽ§ Kubernetes é›†ç¾¤ã€‚
=======
[`kubectl`](/docs/tasks/tools/install-kubectl/) ÊÇ Kubernetes ÃüÁîÐÐ¹¤¾ß£¬¿ÉÒÔÓÃÀ´²Ù¿Ø Kubernetes ¼¯Èº¡£
>>>>>>> Update localization guidelines (#10485)

## Kubeadm 

<!--
[`kubeadm`](/docs/tasks/tools/install-kubeadm/) is the command line tool for easily provisioning a secure Kubernetes cluster on top of physical or cloud servers or virtual machines (currently in alpha).
-->
<<<<<<< HEAD
[`kubeadm`](/docs/tasks/tools/install-kubeadm/) æ˜¯ä¸€ä¸ªå‘½ä»¤è¡Œå·¥å…·ï¼Œå¯ä»¥ç”¨æ¥åœ¨ç‰©ç†æœºã€äº‘æœåŠ¡å™¨æˆ–è™šæ‹Ÿæœºï¼ˆç›®å‰å¤„äºŽ alpha é˜¶æ®µï¼‰ä¸Šè½»æ¾éƒ¨ç½²ä¸€ä¸ªå®‰å…¨å¯é çš„ Kubernetes é›†ç¾¤ã€‚
=======
[`kubeadm`](/docs/tasks/tools/install-kubeadm/) ÊÇÒ»¸öÃüÁîÐÐ¹¤¾ß£¬¿ÉÒÔÓÃÀ´ÔÚÎïÀí»ú¡¢ÔÆ·þÎñÆ÷»òÐéÄâ»ú£¨Ä¿Ç°´¦ÓÚ alpha ½×¶Î£©ÉÏÇáËÉ²¿ÊðÒ»¸ö°²È«¿É¿¿µÄ Kubernetes ¼¯Èº¡£
>>>>>>> Update localization guidelines (#10485)

## Kubefed

<!--
[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) is the command line tool
to help you administrate your federated clusters.
-->
<<<<<<< HEAD
[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) æ˜¯ä¸€ä¸ªå‘½ä»¤è¡Œå·¥å…·ï¼Œå¯ä»¥ç”¨æ¥å¸®åŠ©ç”¨æˆ·ç®¡ç†è”é‚¦é›†ç¾¤ã€‚
=======
[`kubefed`](/docs/tasks/federation/set-up-cluster-federation-kubefed/) ÊÇÒ»¸öÃüÁîÐÐ¹¤¾ß£¬¿ÉÒÔÓÃÀ´°ïÖúÓÃ»§¹ÜÀíÁª°î¼¯Èº¡£
>>>>>>> Update localization guidelines (#10485)


## Minikube

<!--
[`minikube`](/docs/tasks/tools/install-minikube/) is a tool that makes it
easy to run a single-node Kubernetes cluster locally on your workstation for
development and testing purposes.
-->
<<<<<<< HEAD
[`minikube`](/docs/tasks/tools/install-minikube/) æ˜¯ä¸€ä¸ªå¯ä»¥æ–¹ä¾¿ç”¨æˆ·åœ¨å…¶å·¥ä½œç«™ç‚¹æœ¬åœ°éƒ¨ç½²ä¸€ä¸ªå•èŠ‚ç‚¹ Kubernetes é›†ç¾¤çš„å·¥å…·ï¼Œç”¨äºŽå¼€å‘å’Œæµ‹è¯•ã€‚
=======
[`minikube`](/docs/tasks/tools/install-minikube/) ÊÇÒ»¸ö¿ÉÒÔ·½±ãÓÃ»§ÔÚÆä¹¤×÷Õ¾µã±¾µØ²¿ÊðÒ»¸öµ¥½Úµã Kubernetes ¼¯ÈºµÄ¹¤¾ß£¬ÓÃÓÚ¿ª·¢ºÍ²âÊÔ¡£
>>>>>>> Update localization guidelines (#10485)


## Dashboard 

<!--
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), the web-based user interface of Kubernetes, allows you to deploy containerized applications
to a Kubernetes cluster, troubleshoot them, and manage the cluster and its resources itself. 
-->
<<<<<<< HEAD
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), æ˜¯ Kubernetes åŸºäºŽ Web çš„ç”¨æˆ·ç®¡ç†ç•Œé¢ï¼Œå…è®¸ç”¨æˆ·éƒ¨ç½²å®¹å™¨åŒ–åº”ç”¨åˆ° Kubernetes é›†ç¾¤ï¼Œè¿›è¡Œæ•…éšœæŽ’æŸ¥ä»¥åŠç®¡ç†é›†ç¾¤å’Œé›†ç¾¤èµ„æºã€‚ 
=======
[`Dashboard`](/docs/tasks/access-application-cluster/web-ui-dashboard/), ÊÇ Kubernetes »ùÓÚ Web µÄÓÃ»§¹ÜÀí½çÃæ£¬ÔÊÐíÓÃ»§²¿ÊðÈÝÆ÷»¯Ó¦ÓÃµ½ Kubernetes ¼¯Èº£¬½øÐÐ¹ÊÕÏÅÅ²éÒÔ¼°¹ÜÀí¼¯ÈººÍ¼¯Èº×ÊÔ´¡£ 
>>>>>>> Update localization guidelines (#10485)

## Helm

<!--
[`Kubernetes Helm`](https://github.com/kubernetes/helm) is a tool for managing packages of pre-configured
Kubernetes resources, aka Kubernetes charts.
-->
<<<<<<< HEAD
[`Kubernetes Helm`](https://github.com/kubernetes/helm) æ˜¯ä¸€ä¸ªç®¡ç†é¢„å…ˆé…ç½® Kubernetes èµ„æºåŒ…çš„å·¥å…·ï¼Œè¿™é‡Œçš„èµ„æºåœ¨ Helm ä¸­ä¹Ÿè¢«ç§°ä½œ Kubernetes chartsã€‚
=======
[`Kubernetes Helm`](https://github.com/kubernetes/helm) ÊÇÒ»¸ö¹ÜÀíÔ¤ÏÈÅäÖÃ Kubernetes ×ÊÔ´°üµÄ¹¤¾ß£¬ÕâÀïµÄ×ÊÔ´ÔÚ Helm ÖÐÒ²±»³Æ×÷ Kubernetes charts¡£
>>>>>>> Update localization guidelines (#10485)

<!--
Use Helm to:

* Find and use popular software packaged as Kubernetes charts
* Share your own applications as Kubernetes charts
* Create reproducible builds of your Kubernetes applications
* Intelligently manage your Kubernetes manifest files
* Manage releases of Helm packages
-->
<<<<<<< HEAD
ä½¿ç”¨ Helmï¼š

* æŸ¥æ‰¾å¹¶ä½¿ç”¨å·²ç»æ‰“åŒ…ä¸º Kubernetes charts çš„æµè¡Œè½¯ä»¶
* åˆ†äº«æ‚¨è‡ªå·±çš„åº”ç”¨ä½œä¸º Kubernetes charts
* ä¸º Kubernetes åº”ç”¨åˆ›å»ºå¯é‡å¤æ‰§è¡Œçš„æž„å»º
* ä¸ºæ‚¨çš„ Kubernetes æ¸…å•æ–‡ä»¶æä¾›æ›´æ™ºèƒ½åŒ–çš„ç®¡ç†
* ç®¡ç† Helm è½¯ä»¶åŒ…çš„å‘å¸ƒ
=======
Ê¹ÓÃ Helm£º

*²éÕÒ²¢Ê¹ÓÃÒÑ¾­´ò°üÎª Kubernetes charts µÄÁ÷ÐÐÈí¼þ
*·ÖÏíÄú×Ô¼ºµÄÓ¦ÓÃ×÷Îª Kubernetes charts
*Îª Kubernetes Ó¦ÓÃ´´½¨¿ÉÖØ¸´Ö´ÐÐµÄ¹¹½¨
*ÎªÄúµÄ Kubernetes Çåµ¥ÎÄ¼þÌá¹©¸üÖÇÄÜ»¯µÄ¹ÜÀí
*¹ÜÀí Helm Èí¼þ°üµÄ·¢²¼
>>>>>>> Update localization guidelines (#10485)

## Kompose

<!--
[`Kompose`](https://github.com/kubernetes-incubator/kompose) is a tool to help Docker Compose users move to Kubernetes.
-->
<<<<<<< HEAD
[`Kompose`](https://github.com/kubernetes-incubator/kompose) ä¸€ä¸ªè½¬æ¢å·¥å…·ï¼Œç”¨æ¥å¸®åŠ© Docker Compose ç”¨æˆ·è¿ç§»è‡³ Kubernetesã€‚
=======
[`Kompose`](https://github.com/kubernetes-incubator/kompose) Ò»¸ö×ª»»¹¤¾ß£¬ÓÃÀ´°ïÖú Docker Compose ÓÃ»§Ç¨ÒÆÖÁ Kubernetes¡£
>>>>>>> Update localization guidelines (#10485)

<!--
Use Kompose to:

* Translate a Docker Compose file into Kubernetes objects
* Go from local Docker development to managing your application via Kubernetes
* Convert v1 or v2 Docker Compose `yaml` files or [Distributed Application Bundles](https://docs.docker.com/compose/bundles/)
<<<<<<< HEAD
-->
ä½¿ç”¨ Kompose:

* å°†ä¸€ä¸ª Docker Compose æ–‡ä»¶è§£é‡Šæˆ Kubernetes å¯¹è±¡
* å°†æœ¬åœ° Docker å¼€å‘ è½¬å˜æˆé€šè¿‡ Kubernetes æ¥ç®¡ç†
* è½¬æ¢ v1 æˆ– v2 Docker Compose `yaml` æ–‡ä»¶ æˆ– [åˆ†å¸ƒå¼åº”ç”¨ç¨‹åºåŒ…](https://docs.docker.com/compose/bundles/)
{{% /capture %}}
=======
{{% /capture %}}
-->
Ê¹ÓÃ Kompose:

* ½«Ò»¸ö Docker Compose ÎÄ¼þ½âÊÍ³É Kubernetes ¶ÔÏó
* ½«±¾µØ Docker ¿ª·¢ ×ª±ä³ÉÍ¨¹ý Kubernetes À´¹ÜÀí
* ×ª»» v1 »ò v2 Docker Compose `yaml` ÎÄ¼þ »ò [·Ö²¼Ê½Ó¦ÓÃ³ÌÐò°ü](https://docs.docker.com/compose/bundles/)
{{% /capture %}}
>>>>>>> Update localization guidelines (#10485)
