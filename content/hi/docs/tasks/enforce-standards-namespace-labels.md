---
title: Namespace Labels के साथ Pod Security Standards लागू करें
reviewers:
- tallclair
- liggitt
content_type: task
weight: 250
---

Namespaces को label करके [Pod Security Standards](/docs/concepts/security/pod-security-standards) लागू किए जा सकते हैं।
तीन policies
[privileged (प्रिविलेज्ड)](/docs/concepts/security/pod-security-standards/#privileged), [baseline (बेसलाइन)](/docs/concepts/security/pod-security-standards/#baseline)
और [restricted](/docs/concepts/security/pod-security-standards/#restricted) सुरक्षा स्पेक्ट्रम को व्यापक रूप से कवर करती हैं
और इन्हें [Pod Security](/docs/concepts/security/pod-security-admission/)
{{< glossary_tooltip text="admission controller" term_id="admission-controller" >}} द्वारा लागू किया जाता है।

## {{% heading "prerequisites" %}}

Pod Security Admission Kubernetes v1.23 में beta रूप में default रूप से उपलब्ध था।
version 1.25 से आगे, Pod Security Admission सामान्य रूप से उपलब्ध (generally available) है।

{{% version-check %}}

## Namespace labels के साथ `baseline` Pod Security Standard अनिवार्य करना

यह manifest `my-baseline-namespace` नाम का Namespace परिभाषित करता है, जो:

- ऐसे किसी भी pods को _block_ करता है जो `baseline` policy requirements पूरी नहीं करते।
- बनाए गए उन pods के लिए user-facing warning जनरेट करता है और audit annotation जोड़ता है जो
  `restricted` policy requirements पूरी नहीं करते।
- `baseline` और `restricted` policies के versions को v{{< skew currentVersion >}} पर pin करता है।

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: my-baseline-namespace
  labels:
    pod-security.kubernetes.io/enforce: baseline
    pod-security.kubernetes.io/enforce-version: v{{< skew currentVersion >}}

    # We are setting these to our _desired_ `enforce` level.
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/audit-version: v{{< skew currentVersion >}}
    pod-security.kubernetes.io/warn: restricted
    pod-security.kubernetes.io/warn-version: v{{< skew currentVersion >}}
```

## `kubectl label` के साथ मौजूदा namespaces में labels जोड़ें

{{< note >}}
जब `enforce` policy (या version) label जोड़ा या बदला जाता है, admission plugin namespace के
हर pod को नई policy के विरुद्ध test करता है। उल्लंघन user को warnings के रूप में लौटाए जाते हैं।
{{< /note >}}

namespaces के लिए security profile changes का प्रारंभिक मूल्यांकन करते समय `--dry-run` flag लगाना उपयोगी होता है।
Pod Security Standard checks _dry run_ mode में भी चलेंगी, जिससे आपको यह जानकारी मिलेगी
कि नई policy मौजूदा pods को कैसे treat करेगी, बिना वास्तव में policy अपडेट किए।

```shell
kubectl label --dry-run=server --overwrite ns --all \
    pod-security.kubernetes.io/enforce=baseline
```

### सभी namespaces पर लागू करना

अगर आप Pod Security Standards के साथ शुरुआत कर रहे हैं, तो एक उपयुक्त पहला कदम यह होगा कि
सभी namespaces में `baseline` जैसे अधिक सख्त स्तर के लिए audit annotations कॉन्फ़िगर करें:

```shell
kubectl label --overwrite ns --all \
  pod-security.kubernetes.io/audit=baseline \
  pod-security.kubernetes.io/warn=baseline
```

ध्यान दें कि यह enforce level सेट नहीं कर रहा है, ताकि जिन namespaces का स्पष्ट रूप से
मूल्यांकन नहीं हुआ है उन्हें अलग पहचाना जा सके। आप explicit enforce level के बिना namespaces को
इस कमांड से सूचीबद्ध कर सकते हैं:

```shell
kubectl get namespaces --selector='!pod-security.kubernetes.io/enforce'
```

### एक single namespace पर लागू करना

आप किसी specific namespace को भी अपडेट कर सकते हैं। यह कमांड `my-existing-namespace` में
`enforce=restricted` policy जोड़ती है, और restricted policy version को
v{{< skew currentVersion >}} पर pin करती है।

```shell
kubectl label --overwrite ns my-existing-namespace \
  pod-security.kubernetes.io/enforce=restricted \
  pod-security.kubernetes.io/enforce-version=v{{< skew currentVersion >}}
```
