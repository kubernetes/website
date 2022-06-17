---
title: 證書（Certificate）
id: certificate
date: 2018-04-12
full_link: /zh-cn/docs/tasks/tls/managing-tls-in-a-cluster/
short_description: >
  證書是個安全加密檔案，用來確認對 Kubernetes 叢集訪問的合法性。

aka: 
tags:
- security
---

<!--
---
title: Certificate
id: certificate
date: 2018-04-12
full_link: /docs/tasks/tls/managing-tls-in-a-cluster/
short_description: >
  A cryptographically secure file used to validate access to the Kubernetes cluster.

aka: 
tags:
- security
---
-->


<!--
 A cryptographically secure file used to validate access to the Kubernetes cluster.
-->

證書是個安全加密檔案，用來確認對 Kubernetes 叢集訪問的合法性。

<!--more--> 

<!--
Certificates enable applications within a Kubernetes cluster to access the Kubernetes API securely. Certificates validate that clients are allowed to access the API.
-->

證書可以讓 Kubernetes 叢集中執行的應用程式安全的訪問 Kubernetes API。證書可以確認客戶端是否被允許訪問 API。

