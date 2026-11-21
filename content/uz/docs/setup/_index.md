---
# reviewers:
# - brendandburns
# - erictune
# - mikedanese
title: Boshlash
main_menu: true
weight: 20
content_type: concept
no_list: true
card:
  name: setup
  weight: 20
  anchors:
  - anchor: "#learning-environment"
    title: Oʻrganish muhiti
  - anchor: "#production-environment"
    title: Ishlab chiqarish muhiti
---

<!-- overview -->

Ushbu boʻlim Kubernetesni oʻrnatish va ishga tushirishning turli usullarini sanab oʻtadi.
Kubernetesni oʻrnatayotganda oʻrnatish turini quyidagilarga qarab tanlang: texnik xizmat koʻrsatish qulayligi, xavfsizlik,
nazorat, mavjud resurslar hamda klasterni yuritish va boshqarish uchun zarur tajriba.

Kubernetes klasterini mahalliy mashinada, bulutda yoki oʻz maʼlumotlar markazingizda joylashtirish uchun
[Kubernetesni yuklab olishingiz](/releases/download/) mumkin.

{{< glossary_tooltip text="kube-apiserver" term_id="kube-apiserver" >}} yoki {{< glossary_tooltip text="kube-proxy" term_id="kube-proxy" >}} kabi bir qator [Kubernetes komponentlari](/docs/concepts/overview/components/)ni
klaster ichida [konteyner obrazlari](/releases/download/#container-images) sifatida ham joylashtirish mumkin.

Imkon qadar Kubernetes komponentlarini konteyner obrazlari sifatida ishga tushirish
va ushbu komponentlarni Kubernetesning oʻzi boshqarishi **tavsiya etiladi**.
Konteynerlarni ishga tushiradigan komponentlar — xususan, kubelet — bu toifaga kirmaydi.

Agar Kubernetes klasterini oʻzingiz boshqarishni xohlamasangiz, boshqariladigan xizmatni, jumladan
[sertifikatlangan platformalar](/docs/setup/production-environment/turnkey-solutions/)ni tanlashingiz mumkin.
Keng koʻlamdagi bulut va fizik server (bare metal) muhitlari boʻylab boshqa standartlashtirilgan hamda maxsus yechimlar ham mavjud.

<!-- body -->

## Oʻrganish muhiti {#learning-environment}

Agar Kubernetesni oʻrganayotgan boʻlsangiz, Kubernetes hamjamiyati qoʻllab-quvvatlaydigan vositalardan
yoki ekotizimdagi vositalardan foydalanib, mahalliy mashinada Kubernetes klasterini oʻrnating.
[Oʻrganish muhiti](/docs/setup/learning-environment/) sahifasiga qarang.

## Ishlab chiqarish muhiti {#production-environment}

[Ishlab chiqarish muhiti](/docs/setup/production-environment/) uchun yechimni baholayotganda
Kubernetes klasterini (yoki _abstraksiyalarni_) yuritishning qaysi jihatlarini oʻzingiz boshqarishni
va qaysilarini provayderga topshirishni afzal koʻrishingizni hisobga oling.

Oʻzingiz boshqaradigan klaster uchun Kubernetesni joylashtirishning rasman qoʻllab-quvvatlanadigan vositasi
[kubeadm](/docs/setup/production-environment/tools/kubeadm/) hisoblanadi.

## {{% heading "whatsnext" %}}

- [Kubernetesni yuklab oling](/releases/download/)
- Yuklab oling va [vositalarni oʻrnating](/docs/tasks/tools/), jumladan `kubectl` ni
- Yangi klasteringiz uchun [konteyner runtime](/docs/setup/production-environment/container-runtimes/) ni tanlang
- Klaster oʻrnatish boʻyicha [eng yaxshi amaliyotlar](/docs/setup/best-practices/) bilan tanishing

Kubernetes oʻzining {{< glossary_tooltip term_id="control-plane" text="boshqaruv tekisligi" >}} Linuxda
ishlashi uchun moʻljallangan. Klasteringiz ichida ilovalarni Linuxda yoki Windowsni ham oʻz ichiga olgan
boshqa operatsion tizimlarda ishga tushirishingiz mumkin.

- [Windows tugunlari bilan klaster oʻrnatish](/docs/concepts/windows/)ni oʻrganing
