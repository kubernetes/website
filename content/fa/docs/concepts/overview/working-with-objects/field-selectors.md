---
title: انتخابگرهای فیلد
content_type: concept
weight: 70
---

_انتخابگرهای فیلد (Field selectors)_ به شما امکان می‌دهند {{< glossary_tooltip text="اشیا" term_id="object" >}} کوبرنتیز را بر اساس مقدار یک یا چند فیلدِ منبع انتخاب کنید. در ادامه چند نمونه از جستارهای انتخابگر فیلد آمده است:

* `metadata.name=my-service`
* `metadata.namespace!=default`
* `status.phase=Pending`

این دستور `kubectl` تمام پادهایی را انتخاب می‌کند که مقدار فیلد [`status.phase`](/docs/concepts/workloads/pods/pod-lifecycle/#pod-phase) آن‌ها `Running` باشد:

```shell
kubectl get pods --field-selector status.phase=Running
```

{{< note >}}
انتخابگرهای فیلد در اصل *فیلتر* منابع هستند. به‌طور پیش‌فرض هیچ انتخابگر/فیلتری اعمال نمی‌شود؛ یعنی همهٔ منابع از نوع مشخص‌شده برگزیده می‌شوند. به همین دلیل دو فرمان زیر در `kubectl` معادل‌اند:  
`kubectl get pods` و `kubectl get pods --field-selector ""`.
{{< /note >}}

## فیلدهای پشتیبانی‌شده

انتخابگرهای فیلد پشتیبانی‌شده بسته به نوع منبع کوبرنتیز متفاوت‌اند. همهٔ انواع منبع از فیلدهای `metadata.name` و `metadata.namespace` پشتیبانی می‌کنند. استفاده از انتخابگرهای فیلد پشتیبانی‌نشده باعث خطا می‌شود. برای مثال:

```shell
kubectl get ingress --field-selector foo.bar=baz
```
```
Error from server (BadRequest): Unable to find "ingresses" that match label selector "", field selector "foo.bar=baz": "foo.bar" is not a known field selector: only "metadata.name", "metadata.namespace"
```

### فهرست فیلدهای پشتیبانی شده

| Kind                      | Fields                                                                                                                                                                                                                                                          |
| ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pod                       | `spec.nodeName`<br>`spec.restartPolicy`<br>`spec.schedulerName`<br>`spec.serviceAccountName`<br>`spec.hostNetwork`<br>`status.phase`<br>`status.podIP`<br>`status.nominatedNodeName`                                                                            |
| Event                     | `involvedObject.kind`<br>`involvedObject.namespace`<br>`involvedObject.name`<br>`involvedObject.uid`<br>`involvedObject.apiVersion`<br>`involvedObject.resourceVersion`<br>`involvedObject.fieldPath`<br>`reason`<br>`reportingComponent`<br>`source`<br>`type` |
| Secret                    | `type`                                                                                                                                                                                                                                                          |
| Namespace                 | `status.phase`                                                                                                                                                                                                                                                  |
| ReplicaSet                | `status.replicas`                                                                                                                                                                                                                                               |
| ReplicationController     | `status.replicas`                                                                                                                                                                                                                                               |
| Job                       | `status.successful`                                                                                                                                                                                                                                             |
| Node                      | `spec.unschedulable`                                                                                                                                                                                                                                            |
| CertificateSigningRequest | `spec.signerName`                                                                                                                                                                                                                                               |

### فیلدهای منابع سفارشی

تمام انواع منبع سفارشی از فیلدهای `metadata.name` و `metadata.namespace` پشتیبانی می‌کنند.

علاوه بر این، فیلد `spec.versions[*].selectableFields` در یک {{< glossary_tooltip term_id="CustomResourceDefinition" text="CustomResourceDefinition" >}} تعیین می‌کند که کدام فیلدهای دیگرِ یک منبع سفارشی را می‌توان در انتخابگرهای فیلد به‌کار برد. برای اطلاعات بیشتر دربارهٔ استفاده از انتخابگرهای فیلد همراه با CustomResourceDefinitionها، به [فیلدهای قابل انتخاب برای منابع سفارشی](/docs/tasks/extend-kubernetes/custom-resources/custom-resource-definitions/#crd-selectable-fields) مراجعه کنید.

## عملگرهای پشتیبانی‌شده

می‌توانید از عملگرهای `=`, `==` و `!=` در انتخابگرهای فیلد استفاده کنید (دو عملگر `=` و `==` معادل هم هستند). برای مثال، این فرمان `kubectl` تمامی سرویس‌های کوبرنتیز را که در فضای نام `default` نیستند انتخاب می‌کند:

```shell
kubectl get services  --all-namespaces --field-selector metadata.namespace!=default
```
{{< note >}}
عملگرهای [مبتنی بر مجموعه](/docs/concepts/overview/working-with-objects/labels/#set-based-requirement)
(`in`، `notin`، `exists`) برای انتخابگرهای فیلد پشتیبانی نمی‌شوند.
{{< /note >}}

## انتخابگرهای زنجیره‌ای

مانند [برچسب](/docs/concepts/overview/working-with-objects/labels) و سایر انتخابگرها، انتخابگرهای فیلد را می‌توان به‌صورت فهرستی جداشده با ویرگول به یکدیگر زنجیر کرد. این فرمان `kubectl` تمامی پادهایی را انتخاب می‌کند که مقدار `status.phase` آن‌ها برابر با `Running` نیست و فیلد `spec.restartPolicy` آن‌ها برابر با `Always` است:

```shell
kubectl get pods --field-selector=status.phase!=Running,spec.restartPolicy=Always
```

## چندین نوع منبع

می‌توانید از انتخابگرهای فیلد برای انواع مختلف منبع استفاده کنید. این فرمان `kubectl` تمامی StatefulSet‌ها و Service‌ها را که در فضای نام `default` نیستند انتخاب می‌کند:

```shell
kubectl get statefulsets,services --all-namespaces --field-selector metadata.namespace!=default
```
