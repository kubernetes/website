---
title: Oʻrganish muhiti
content_type: concept
weight: 20
---

<!-- overview -->

Agar Kubernetesni oʻrganayotgan boʻlsangiz, mashq qiladigan joyingiz kerak boʻladi. Ushbu sahifa tajriba oʻtkazish va oʻrganishingiz mumkin boʻlgan Kubernetes muhitini oʻrnatish variantlaringizni tushuntiradi.

<!-- body -->

## kubectl ni oʻrnatish {#installing-kubectl}

Klaster oʻrnatishdan oldin `kubectl` buyruq qatori vositasi kerak. Bu vosita Kubernetes klasteri bilan muloqot qilish va unga qarshi buyruqlarni bajarish imkonini beradi.

Oʻrnatish koʻrsatmalari uchun [kubectl ni oʻrnatish va sozlash](/docs/tasks/tools/#kubectl) sahifasiga qarang.

## Mahalliy Kubernetes muhitlarini oʻrnatish {#setting-up-local-kubernetes-environments}

Kubernetesni mahalliy ishga tushirish oʻrganish va tajriba oʻtkazish uchun xavfsiz muhit beradi. Xarajatlar haqida xavotirlanmasdan va ishlab chiqarish tizimlariga taʼsir qilmasdan klasterlarni oʻrnatishingiz hamda olib tashlashingiz mumkin.

### kind {#kind}

[kind](https://kind.sigs.k8s.io/) (Kubernetes IN Docker) tugunlar sifatida Docker konteynerlaridan foydalanib Kubernetes klasterlarini ishga tushiradi. U yengil va maxsus Kubernetesning oʻzini sinash uchun moʻljallangan, lekin oʻrganish uchun ham juda mos keladi.

kind bilan boshlash uchun [kind tezkor boshlash](https://kind.sigs.k8s.io/docs/user/quick-start/) sahifasiga qarang.

### minikube {#minikube}

[minikube](https://minikube.sigs.k8s.io/) mahalliy mashinangizda bir tugunli Kubernetes klasterini ishga tushiradi. U bir nechta konteyner runtime larini qoʻllab-quvvatlaydi hamda Linux, macOS va Windowsda ishlaydi.

minikube bilan boshlash uchun [minikube bilan boshlash](https://minikube.sigs.k8s.io/docs/start/) qoʻllanmasiga qarang.

### Boshqa mahalliy variantlar {#other-local-options}

{{% thirdparty-content single="true" %}}

Kubernetesni mahalliy ishga tushira oladigan bir nechta uchinchi tomon vositalari ham bor. Kubernetes bu vositalarni qoʻllab-quvvatlamaydi, lekin ular oʻrganish ehtiyojlaringiz uchun yaxshi mos kelishi mumkin:

- [Docker Desktop](https://docs.docker.com/desktop/kubernetes/) mahalliy Kubernetes klasterini ishga tushira oladi
- [Podman Desktop](https://podman-desktop.io/docs/kubernetes) mahalliy Kubernetes klasterini ishga tushira oladi
- [Rancher Desktop](https://docs.rancherdesktop.io/) ish stolingizda Kubernetesni taqdim etadi
- [MicroK8s](https://canonical.com/microk8s) yengil Kubernetes klasterini ishga tushiradi
- [Red Hat CodeReady Containers (CRC)](https://developers.redhat.com/products/openshift-local) mahalliy ravishda minimal OpenShift klasterini ishga tushiradi (OpenShift Kubernetesga muvofiqdir)

Oʻrnatish koʻrsatmalari va qoʻllab-quvvatlash uchun har bir vositaning hujjatlariga murojaat qiling.

## Onlayn sinov maydonchalaridan foydalanish {#using-online-playgrounds}

{{% thirdparty-content single="true" %}}

Onlayn Kubernetes sinov maydonchalari kompyuteringizga hech narsa oʻrnatmasdan Kubernetesni sinab koʻrish imkonini beradi. Bu muhitlar veb-brauzeringizda ishlaydi:

- **[Killercoda](https://killercoda.com/kubernetes)** interaktiv Kubernetes stsenariylari va sinov maydonchasi muhitini taqdim etadi

Bu platformalar tezkor tajribalar va mahalliy oʻrnatishsiz qoʻllanmalarga amal qilish uchun foydalidir.

## Ishlab chiqarishga oʻxshash klasterlar bilan mashq qilish {#practicing-with-production-like-clusters}

Agar ishlab chiqarishga oʻxshashroq klaster oʻrnatishni mashq qilmoqchi boʻlsangiz, **kubeadm** dan foydalanishingiz mumkin. kubeadm bilan klaster oʻrnatish bir nechta mashina (jismoniy yoki virtual) va ehtiyotkor sozlashni talab qiladigan murakkab vazifadir.

Ishlab chiqarish muhitlari haqida oʻrganish uchun [Ishlab chiqarish muhiti](/docs/setup/production-environment/) sahifasiga qarang.

{{< note >}}
Ishlab chiqarishga oʻxshash klaster oʻrnatish yuqorida tavsiflangan oʻrganish muhitlaridan sezilarli darajada murakkabroq. Avval kind, minikube yoki onlayn sinov maydonchasidan boshlang.
{{< /note >}}

## {{% heading "whatsnext" %}}

- Birinchi ilovangizni joylashtirish uchun [Hello Minikube](/docs/tutorials/hello-minikube/) qoʻllanmasiga amal qiling
- [Kubernetes komponentlari](/docs/concepts/overview/components/) haqida oʻrganing
- [kubectl buyruqlari](/docs/reference/kubectl/)ni oʻrganib chiqing
