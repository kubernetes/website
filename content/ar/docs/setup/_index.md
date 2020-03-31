---
reviewers:
- mohamedsgap
- mohamedkhaledhafez
- Benwa-98
no_issue: true
title: ابدء
main_menu: true
weight: 20
content_template: templates/concept
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: بيئة التعلم
  - anchor: "#production-environment"
    title: بيئة الإنتاج 
---

{{% capture overview %}}

يغطي هذا القسم خيارات مختلفة لإعداد Kubernetes وتشغيلها.

تلبي حلول Kubernetes المختلفة المتطلبات المختلفة: سهولة الصيانة ، والأمن ، والتحكم ، والموارد المتاحة ، والخبرة المطلوبة لتشغيل وإدارة المجموعة.

يمكنك نشر مجموعة Kubernetes على جهاز محلي، أو سحابة، أو مركز بيانات محلي، أو اختيار مجموعة Kubernetes مُدارة. يمكنك أيضًا إنشاء حلول مخصصة عبر مجموعة واسعة من مقدمي الخدمات السحابية.

ببساطة أكبر، يمكنك إنشاء مجموعة Kubernetes في بيئات التعلم والإنتاج.

{{% /capture %}}

{{% capture body %}}

## بيئة التعلم

إذا كنت تتعلم Kubernetes، فاستخدم الحلول المستندة إلى Docker: الأدوات التي يدعمها مجتمع Kubernetes، أو الأدوات في النظام البيئي لإعداد مجموعة Kubernetes على جهاز محلي.

{{< table caption="جدول حلول الآلة المحلية الذي يسرد الأدوات التي يدعمها المجتمع والنظام البيئي لنشر Kubernetes." >}}

|المجتمع           |Ecosystem     |
| ------------       | --------     |
| [Minikube](/docs/setup/learning-environment/minikube/) | [CDK on LXD](https://www.ubuntu.com/kubernetes/docs/install-local) |
| [kind (Kubernetes IN Docker)](/docs/setup/learning-environment/kind/) | [Docker Desktop](https://www.docker.com/products/docker-desktop)|
|                     | [Minishift](https://docs.okd.io/latest/minishift/)|
|                     | [MicroK8s](https://microk8s.io/)|
|                     | [IBM Cloud Private-CE (Community Edition)](https://github.com/IBM/deploy-ibm-cloud-private) |
|                     | [IBM Cloud Private-CE (Community Edition) on Linux Containers](https://github.com/HSBawa/icp-ce-on-linux-containers)|
|                     | [k3s](https://k3s.io)|


## بيئة الانتاج

عند تقييم حل لبيئة إنتاج ، ضع في اعتبارك جوانب تشغيل مجموعة Kubernetes (أو  _التجريد_) التي تريد إدارتها بنفسك أو إلغاء تحميلها إلى موفر.

للحصول على قائمة kubernetes المعتمدة [Certified Kubernetes](https://github.com/cncf/k8s-conformance/#certified-kubernetes) مزودي, انظر "[الشركاء](https://kubernetes.io/partners/#conformance)". 

{{% /capture %}}
