---
title: पॉड जीवनचक्र (Pod Lifecycle)
id: पॉड जीवनचक्र (pod-lifecycle)
date: 2019-02-17
full-link: /docs/concepts/workloads/pods/pod-lifecycle/
related:
 - pod
 - container
tags:
 - fundamental
short_description: >
  अवस्थाओं का क्रम जिसके माध्यम से एक पॉड अपने जीवनकाल में गुजरता है।
 
---
 अवस्थाओं का क्रम जिसके माध्यम से एक पॉड अपने जीवनकाल में गुजरता है।

<!--अधिक-->

[पॉड जीवनचक्र](/docs/concepts/workloads/pods/pod-lifecycle/) को पॉड की अवस्थाओं या चरणों द्वारा परिभाषित किया जाता है। पांच संभावित पॉड चरण हैं: लंबित, दौड़ना, सफल, विफल और अज्ञात। पॉड स्थिति का एक उच्च-स्तरीय विवरण [पॉडस्टैटस] (/docs/reference/generated/kubernetes-api/{{< param "version" >}}/#podstatus-v1-core) `चरण` फ़ील्ड में सारांशित किया गया है। .
