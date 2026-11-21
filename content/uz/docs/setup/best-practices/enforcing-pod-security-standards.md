---
# reviewers:
# - tallclair
# - liggitt
title: Pod xavfsizlik standartlarini tatbiq etish
weight: 40
---

<!-- overview -->

Ushbu sahifa [Pod xavfsizlik standartlari](/docs/concepts/security/pod-security-standards)ni tatbiq etishdagi
eng yaxshi amaliyotlar haqida umumiy maʼlumot beradi.

<!-- body -->

## Ichki Pod Security Admission Controller dan foydalanish {#using-the-built-in-pod-security-admission-controller}

{{< feature-state for_k8s_version="v1.25" state="stable" >}}

[Pod Security Admission Controller](/docs/reference/access-authn-authz/admission-controllers/#podsecurity)
eskirgan PodSecurityPolicies oʻrnini bosishni koʻzlaydi.

### Barcha klaster Namespacelarini sozlash {#configure-all-cluster-namespaces}

Hech qanday sozlamaga ega boʻlmagan Namespacelar klasteringiz
xavfsizlik modelidagi jiddiy boʻshliqlar deb hisoblanishi kerak. Har bir
Namespacedagi yuklama turlarini tahlil qilishga vaqt ajratishni va Pod xavfsizlik standartlariga tayanib
ularning har biri uchun mos darajani belgilashni tavsiya qilamiz. Yorliqsiz Namespacelar faqat ular hali baholanmaganini bildirishi kerak.

Agar barcha Namespacelardagi barcha yuklamalar bir xil xavfsizlik talablariga ega boʻlsa,
PodSecurity yorliqlarini ommaviy qoʻllashni koʻrsatadigan
[misol](/docs/tasks/configure-pod-container/enforce-standards-namespace-labels/#applying-to-all-namespaces)
taqdim etamiz.

### Eng kam imtiyoz tamoyilini qoʻllash {#embrace-the-principle-of-least-privilege}

Ideal dunyoda har bir Namespacedagi har bir Pod `restricted`
siyosati talablariga javob berardi. Biroq bu na mumkin, na amaliy, chunki baʼzi yuklamalar qonuniy sabablarga koʻra
oshirilgan imtiyozlarni talab qiladi.

- `privileged` yuklamalarga ruxsat beradigan Namespacelar mos kirish nazoratini oʻrnatishi va tatbiq etishi kerak.
- Oʻsha erkinroq Namespacelarda ishlaydigan yuklamalar uchun ularning oʻziga xos
  xavfsizlik talablari haqidagi hujjatlarni yuriting. Imkon qadar bu talablarni yanada
  qatʼiyroq cheklash mumkinligini koʻrib chiqing.

### Koʻp rejimli strategiyani qoʻllash {#adopt-a-multi-mode-strategy}

Pod xavfsizlik standartlari admission controllerining `audit` va `warn` rejimlari mavjud yuklamalarni buzmasdan
Podlaringiz haqida muhim xavfsizlik maʼlumotlarini toʻplashni osonlashtiradi.

Bu rejimlarni barcha Namespacelar uchun yoqish, ularni oxir-oqibat `enforce` qilmoqchi boʻlgan _istalgan_ daraja
va versiyaga oʻrnatish yaxshi amaliyotdir. Ushbu bosqichda hosil boʻlgan ogohlantirishlar va audit annotatsiyalari
sizni oʻsha holatga yoʻnaltirishi mumkin. Agar yuklama mualliflari istalgan darajaga moslashish uchun oʻzgarishlar kiritishini kutayotgan boʻlsangiz, `warn` rejimini yoqing. Agar istalgan darajaga moslashish uchun oʻzgarishlarni kuzatish va yoʻnaltirishda audit jurnallaridan foydalanishni kutayotgan boʻlsangiz, `audit` rejimini yoqing.

`enforce` rejimi istalgan qiymatingizga oʻrnatilganda ham bu rejimlar bir necha
turli usulda foydali boʻlib qolishi mumkin:

- `warn` ni `enforce` bilan bir xil darajaga oʻrnatish orqali mijozlar tekshiruvdan oʻtmaydigan Podlar (yoki Pod andozalariga ega resurslar)
  yaratishga uringanda ogohlantirishlar oladi. Bu ularga ushbu resurslarni talablarga mos holga
  keltirishga yordam beradi.
- `enforce` ni eng soʻnggisi boʻlmagan aniq versiyaga qotirib qoʻygan Namespacelarda `audit` va `warn`
  rejimlarini `enforce` bilan bir xil darajaga, lekin `latest` versiyasiga oʻrnatish avvalgi versiyalar ruxsat bergan, biroq joriy eng yaxshi amaliyotlar boʻyicha endi ruxsat etilmaydigan sozlamalar haqida koʻrinish beradi.

## Uchinchi tomon muqobillari {#third-party-alternatives}

{{% thirdparty-content %}}

Xavfsizlik profillarini tatbiq etishning boshqa muqobillari Kubernetes
ekotizimida ishlab chiqilmoqda:

- [Kubewarden](https://github.com/kubewarden).
- [Kyverno](https://kyverno.io/policies/).
- [OPA Gatekeeper](https://github.com/open-policy-agent/gatekeeper).

_Ichki_ yechim (masalan, PodSecurity admission controller) yoki
uchinchi tomon vositasi bilan borish qarori butunlay oʻz vaziyatingizga bogʻliq. Har qanday yechimni baholayotganda
taʼminot zanjiringizga ishonch hal qiluvchi ahamiyatga ega. Oxir-oqibat, yuqorida zikr etilgan yondashuvlarning _istalganidan_ foydalanish
hech narsa qilmaslikdan yaxshiroq boʻladi.
