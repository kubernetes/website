---
linktitle: سجل الإصدارات
title: الإصدارات
type: docs
layout: release-info
notoc: true
---

<!-- overview -->

يحافظ مشروع كوبيرنيتيس على فروع الإصدار لأحدث ثلاثة إصدارات فرعية
({{< skew latestVersion >}} و{{< skew prevMinorVersion >}} و{{< skew oldestMinorVersion >}}).
تحصل إصدارات كوبيرنيتيس 1.19 وما بعدها على
[دعم تصحيحي لمدة سنة واحدة تقريبًا](/releases/patch-releases/#support-period).
أما إصدارات كوبيرنيتيس 1.18 وما قبلها فقد حصلت على دعم تصحيحي لمدة تسعة أشهر تقريبًا.

تُكتب إصدارات كوبيرنيتيس بالصيغة **x.y.z**،
حيث **x** هو الإصدار الرئيسي، و**y** هو الإصدار الفرعي، و**z** هو الإصدار التصحيحي،
وفقًا لمصطلحات [الإصدار الدلالي (Semantic Versioning)](https://semver.org/).

لمزيد من المعلومات، راجع مستند [سياسة انحراف الإصدارات](/releases/version-skew-policy/).

<!-- body -->

## سجل الإصدارات {#release-history}

{{< release-data >}}

## الإصدارات المنتهية الدعم {#end-of-life-releases}

فيما يلي قائمة بإصدارات كوبيرنيتيس القديمة التي لم تعد مدعومة.

<details>
  <summary>الإصدارات المنتهية الدعم</summary>
  {{< note >}}
  لم تعد هذه الإصدارات مدعومة ولا تتلقى تحديثات أمنية أو إصلاحات للعلل.
  إذا كنت تُشغّل أحد هذه الإصدارات، فإن مشروع كوبيرنيتيس ينصح بشدة بالترقية إلى [إصدار مدعوم](#release-history).
  {{< /note >}}

  {{< eol-releases >}}
</details>

## الإصدار القادم {#upcoming-release}

اطّلع على [الجدول الزمني](https://github.com/kubernetes/sig-release/tree/master/releases/release-{{< skew nextMinorVersion >}})
لإصدار كوبيرنيتيس **{{< skew nextMinorVersion >}}** القادم!

{{< note >}}
قد يكون رابط الجدول الزمني غير متوفر مؤقتًا خلال المراحل الأولى من تخطيط الإصدار.
راجع [مستودع SIG Release](https://github.com/kubernetes/sig-release/tree/master/releases) للحصول على آخر التحديثات.
{{< /note >}}

## موارد مفيدة {#helpful-resources}

راجع موارد [فريق إصدار كوبيرنيتيس](https://github.com/kubernetes/sig-release/tree/master/release-team)
للحصول على معلومات أساسية عن الأدوار وعملية الإصدار.
