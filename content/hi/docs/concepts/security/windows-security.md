---
reviewers:
- jayunit100
- jsturtevant
- marosset
- perithompson
title: विंडोज़ नोड्स के लिए सुरक्षा
content_type: concept
weight: 40
---

<!-- overview -->

यह पृष्ठ विंडोज़ ऑपरेटिंग सिस्टम के लिए विशिष्ट सुरक्षा संबंधी विचारों और सर्वोत्तम प्रथाओं का वर्णन करता है।

<!-- body -->

## नोड्स पर सीक्रेट (Secret) डेटा के लिए सुरक्षा

विंडोज़ पर, सीक्रेट्स (Secrets) का डेटा नोड के स्थानीय स्टोरेज (local storage) पर स्पष्ट पाठ (clear text) में लिखा जाता है (लिनक्स पर tmpfs / इन-मेमोरी फ़ाइल सिस्टम के उपयोग की तुलना में)। एक क्लस्टर ऑपरेटर के रूप में, आपको निम्नलिखित दोनों अतिरिक्त उपाय करने चाहिए:

1. सीक्रेट्स की फ़ाइल स्थान (file location) को सुरक्षित करने के लिए फ़ाइल ACL का उपयोग करें।
1. [BitLocker](https://docs.microsoft.com/windows/security/information-protection/bitlocker/bitlocker-how-to-deploy-on-windows-server) का उपयोग करके वॉल्यूम-स्तर एन्क्रिप्शन लागू करें।

## कंटेनर उपयोगकर्ता (Container users)

विंडोज़ पॉड्स या कंटेनरों के लिए [RunAsUsername](/docs/tasks/configure-pod-container/configure-runasusername) निर्दिष्ट किया जा सकता है ताकि कंटेनर प्रक्रियाओं (processes) को विशिष्ट उपयोगकर्ता (user) के रूप में निष्पादित (execute) किया जा सके। यह लगभग [RunAsUser](/docs/concepts/security/pod-security-policy/#users-and-groups) के समतुल्य है।

विंडोज़ कंटेनर दो डिफ़ॉल्ट उपयोगकर्ता खाते प्रदान करते हैं, ContainerUser और ContainerAdministrator।
इन दो उपयोगकर्ता खातों के बीच के अंतर को माइक्रोसॉफ्ट के _Secure Windows containers_ दस्तावेज़ के भीतर [When to use ContainerAdmin and ContainerUser user accounts](https://docs.microsoft.com/virtualization/windowscontainers/manage-containers/container-security#when-to-use-containeradmin-and-containeruser-user-accounts) में कवर किया गया है।

कंटेनर निर्माण (build) प्रक्रिया के दौरान स्थानीय उपयोगकर्ताओं (Local users) को कंटेनर छवियों (images) में जोड़ा जा सकता है।

{{< note >}}

* [Nano Server](https://hub.docker.com/_/microsoft-windows-nanoserver) आधारित छवियां डिफ़ॉल्ट रूप से `ContainerUser` के रूप में चलती हैं
* [Server Core](https://hub.docker.com/_/microsoft-windows-servercore) आधारित छवियां डिफ़ॉल्ट रूप से `ContainerAdministrator` के रूप में चलती हैं

{{< /note >}}

विंडोज़ कंटेनर [Group Managed Service Accounts](/docs/tasks/configure-pod-container/configure-gmsa/) का उपयोग करके सक्रिय निर्देशिका पहचानों (Active Directory identities) के रूप में भी चल सकते हैं।

## पॉड-स्तरीय सुरक्षा अलगाव (Pod-level security isolation)

लिनक्स-विशिष्ट पॉड सुरक्षा संदर्भ तंत्र (security context mechanisms) (जैसे SELinux, AppArmor, Seccomp, या कस्टम POSIX क्षमताएं) विंडोज़ नोड्स पर समर्थित नहीं हैं।

विशेषाधिकार प्राप्त कंटेनर (Privileged containers) विंडोज़ पर [समर्थित नहीं हैं](/docs/concepts/windows/intro/#compatibility-v1-pod-spec-containers-securitycontext)।
इसके बजाय लिनक्स पर विशेषाधिकार प्राप्त कंटेनरों द्वारा किए जाने वाले कई कार्यों को करने के लिए विंडोज़ पर [HostProcess containers](/docs/tasks/configure-pod-container/create-hostprocess-pod) का उपयोग किया जा सकता है।
