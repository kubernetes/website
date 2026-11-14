---
title: "Ishlab chiqarish muhiti"
description: Ishlab chiqarish darajasidagi Kubernetes klasterini yaratish
weight: 30
no_list: true
---
<!-- overview -->

Ishlab chiqarish darajasidagi Kubernetes klasteri rejalashtirish va tayyorgarlikni talab qiladi.
Agar Kubernetes klasteringiz muhim ish yuklarini bajarsa, u bardoshli qilib sozlanishi kerak.
Ushbu sahifa ishlab chiqarishga tayyor klaster yaratish
yoki mavjud klasterni ishlab chiqarishda foydalanish uchun tayyorlash boʻyicha qadamlarini tushuntiradi.
Agar ishlab chiqarish sozlamalari bilan allaqachon tanish boʻlsangiz va havolalar kerak boʻlsa,
[Keyingi qadamlar](#what-s-next) boʻlimiga oʻting.

<!-- body -->

## Ishlab chiqarish mulohazalari {#production-considerations}

Odatda, ishlab chiqarishdagi Kubernetes klaster muhiti shaxsiy oʻrganish,
ishlab chiqish yoki sinov muhitidagi Kubernetesga qaraganda koʻproq talablarga ega. Ishlab chiqarish muhiti
koʻp foydalanuvchilarning xavfsiz kirishini, barqaror mavjudlikni va oʻzgaruvchan talablarga
moslashish uchun resurslarni talab qilishi mumkin.

Ishlab chiqarish Kubernetes muhiti qayerda joylashishini
(oʻz infratuzilmangizda yoki bulutda) va qancha boshqaruvni oʻzingiz
olishingiz yoki boshqalarga topshirishingizni hal qilar ekansiz, Kubernetes klasteriga qoʻyiladigan
talablaringizga quyidagi masalalar qanday taʼsir qilishini koʻrib chiqing:

- *Mavjudlik*: Bitta mashinadagi Kubernetes [oʻrganish muhiti](/docs/setup/#learning-environment)
  yagona nosozlik nuqtasiga ega. Yuqori mavjudlikdagi klaster yaratish quyidagilarni hisobga olishni anglatadi:
  - Boshqaruv tekisligini ishchi tugunlardan ajratish.
  - Boshqaruv tekisligi komponentlarini bir nechta tugunlarda takrorlash.
  - Klasterning {{< glossary_tooltip term_id="kube-apiserver" text="API serveri" >}}iga keladigan trafikni yuk boʻyicha muvozanatlash.
  - Ish yuklari talab qilganda yetarli ishchi tugunlar mavjud boʻlishi yoki tezda mavjud boʻla olishi.

- *Masshtab*: Agar ishlab chiqarish Kubernetes muhitingiz barqaror hajmdagi
  talabni qabul qilishini kutayotgan boʻlsangiz, kerakli sigʻimni sozlab, shu bilan yakunlashingiz mumkin. Biroq,
  agar talab vaqt oʻtishi bilan oʻsishini yoki mavsum yoki maxsus tadbirlar kabi omillarga qarab
  keskin oʻzgarishini kutayotgan boʻlsangiz, ortgan
  bosimni yengillatish uchun boshqaruv tekisligi va ishchi tugunlarga keladigan koʻproq soʻrovlarga qarab qanday masshtablashni
  yoki foydalanilmayotgan resurslarni kamaytirish uchun qanday kichraytirishni rejalashtirishingiz kerak.

- *Xavfsizlik va kirishni boshqarish*: Oʻz
  Kubernetes oʻrganish klasteringizda toʻliq administrator huquqlariga egasiz. Lekin muhim ish yuklariga ega umumiy klasterlar va
  bir yoki ikkitadan ortiq foydalanuvchi klaster resurslariga kim va nima
  kira olishiga nisbatan yanada nozikroq yondashuvni talab qiladi. Foydalanuvchilar va ish yuklari oʻzlariga kerakli
  resurslarga kira olishi, shu bilan birga ish yuklari va klasterning oʻzi xavfsiz qolishi uchun rolga asoslangan kirishni boshqarish
  ([RBAC](/docs/reference/access-authn-authz/rbac/)) va boshqa
  xavfsizlik mexanizmlaridan foydalanishingiz mumkin.
  Foydalanuvchilar va ish yuklari kira oladigan resurslarga cheklovlar qoʻyishingiz
  mumkin. Buning uchun [siyosatlarni](/docs/concepts/policy/) va
  [konteyner resurslarini](/docs/concepts/configuration/manage-resources-containers/) boshqarasiz.

Oʻz kuchingiz bilan Kubernetes ishlab chiqarish muhitini qurishdan oldin ushbu ishning bir qismini yoki hammasini
[Tayyor bulut yechimlari](/docs/setup/production-environment/turnkey-solutions/)
provayderlariga yoki boshqa [Kubernetes hamkorlariga](/partners/) topshirishni koʻrib chiqing.
Variantlar quyidagilarni oʻz ichiga oladi:

- *Serversiz*: Klasterni umuman boshqarmasdan ish yuklarini uchinchi tomon uskunasida ishga tushirish.
  CPU dan foydalanish, xotira va disk soʻrovlari kabi narsalar uchun toʻlov olinadi.
- *Boshqariladigan boshqaruv tekisligi*: Provayderga klaster boshqaruv tekisligining masshtabi va mavjudligini
  boshqartiring, shuningdek yamoqlar va yangilanishlarni ham u hal qilsin.
- *Boshqariladigan ishchi tugunlar*: Ehtiyojlaringizga mos tugun hovuzlarini sozlang,
  soʻng provayder bu tugunlar mavjud boʻlishini va kerak boʻlganda
  yangilanishlarni amalga oshirishga tayyor boʻlishini taʼminlaydi.
- *Integratsiya*: Kubernetesni sizga kerak boʻlishi mumkin boʻlgan boshqa
  xizmatlar, masalan saqlash, konteyner registrlari, autentifikatsiya
  usullari va ishlab chiqish vositalari bilan integratsiya qiladigan provayderlar bor.

Ishlab chiqarish Kubernetes klasterini oʻzingiz qurasizmi yoki
hamkorlar bilan ishlaysizmi, klasteringizning *boshqaruv tekisligi*, *ishchi tugunlar*, *foydalanuvchi kirishi* va
*ish yuki resurslari* ga oid ehtiyojlaringizni baholash uchun quyidagi boʻlimlarni koʻrib chiqing.

## Ishlab chiqarish klasterini sozlash {#production-cluster-setup}

Ishlab chiqarish darajasidagi Kubernetes klasterida boshqaruv tekisligi
klasterni turli usullarda bir nechta kompyuterga tarqatilishi mumkin boʻlgan xizmatlardan boshqaradi.
Har bir ishchi tugun esa Kubernetes Podlarini ishga tushirish uchun sozlangan bitta obyektni ifodalaydi.

### Ishlab chiqarish boshqaruv tekisligi {#production-control-plane}

Eng oddiy Kubernetes klasterida butun boshqaruv tekisligi va ishchi tugun
xizmatlari bir xil mashinada ishlaydi. Bu muhitni ishchi tugunlar qoʻshish orqali oʻstirishingiz mumkin. Bu
[Kubernetes komponentlari](/docs/concepts/overview/components/) dagi diagrammada aks etgan.
Agar klaster qisqa muddat mavjud boʻlishi nazarda tutilgan boʻlsa yoki jiddiy nosozlik yuz bersa
tashlab yuborilishi mumkin boʻlsa, bu ehtiyojlaringizni qondirishi mumkin.

Agar esa yanada doimiy, yuqori mavjudlikdagi klaster kerak boʻlsa,
boshqaruv tekisligini kengaytirish yoʻllarini koʻrib chiqishingiz kerak. Loyiha boʻyicha bitta mashinada ishlaydigan
boshqaruv tekisligi xizmatlari yuqori mavjudlikka ega emas.
Agar klasterni ishlab turish
va biror narsa notoʻgʻri ketganda uni tuzatish mumkinligini taʼminlash muhim boʻlsa,
quyidagi qadamlarni koʻrib chiqing:

- *Joylashtirish vositalarini tanlash*: Boshqaruv tekisligini kubeadm, kops va kubespray kabi vositalar
  yordamida joylashtirishingiz mumkin. Har bir joylashtirish
  usuli bilan ishlab chiqarish darajasidagi joylashtirishlar uchun maslahatlarni oʻrganish uchun
  [Kubernetesni joylashtirish vositalari bilan oʻrnatish](/docs/setup/production-environment/tools/)
  sahifasiga qarang. Joylashtirishlaringiz bilan foydalanish uchun turli [konteyner runtimelari](/docs/setup/production-environment/container-runtimes/)
  mavjud.
- *Sertifikatlarni boshqarish*: Boshqaruv tekisligi xizmatlari orasidagi xavfsiz aloqa
  sertifikatlar yordamida amalga oshiriladi. Sertifikatlar joylashtirish paytida avtomatik yaratiladi
  yoki ularni oʻz sertifikat markazingiz yordamida yaratishingiz mumkin.
  Batafsil maʼlumot uchun [PKI sertifikatlari va talablar](/docs/setup/best-practices/certificates/) sahifasiga qarang.
- *apiserver uchun yuk muvozanatlagichni sozlash*: Tashqi API soʻrovlarini turli tugunlarda ishlayotgan apiserver xizmati nusxalariga
  taqsimlash uchun yuk muvozanatlagichni
  sozlang. Batafsil maʼlumot uchun
  [Tashqi yuk muvozanatlagich yaratish](/docs/tasks/access-application-cluster/create-external-load-balancer/)
  sahifasiga qarang.
- *etcd xizmatini ajratish va zaxiralash*: etcd xizmatlari boshqa boshqaruv tekisligi xizmatlari bilan bir xil
  mashinalarda ishlashi yoki qoʻshimcha xavfsizlik va mavjudlik uchun alohida mashinalarda ishlashi mumkin.
  etcd klaster konfiguratsiya maʼlumotlarini saqlagani uchun,
  kerak boʻlganda bu maʼlumotlar bazasini tuzata olishingiz uchun etcd maʼlumotlar bazasining zaxira nusxasi muntazam olinishi kerak.
  etcd ni sozlash va undan foydalanish haqida batafsil maʼlumot uchun [etcd FAQ](https://etcd.io/docs/v3.5/faq/) sahifasiga qarang.
  Batafsil maʼlumot uchun [Kubernetes uchun etcd klasterlarini ishlatish](/docs/tasks/administer-cluster/configure-upgrade-etcd/)
  va [kubeadm bilan yuqori mavjudlikdagi etcd klasterini sozlash](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  sahifalariga qarang.
- *Bir nechta boshqaruv tekisligi tizimlarini yaratish*: Yuqori mavjudlik uchun
  boshqaruv tekisligi bitta mashina bilan cheklanmasligi kerak. Agar boshqaruv tekisligi
  xizmatlari init xizmati (masalan, systemd) tomonidan ishga tushirilsa, har bir xizmat kamida
  uchta mashinada ishlashi kerak. Biroq boshqaruv tekisligi xizmatlarini Kubernetesda Podlar sifatida ishga tushirish
  soʻragan takrorlangan xizmatlar soni doim mavjud boʻlishini taʼminlaydi.
  Scheduler nosozlikka bardoshli boʻlishi kerak,
  lekin yuqori mavjudlikka ega boʻlishi shart emas. Ayrim joylashtirish vositalari Kubernetes xizmatlarining yetakchisini saylash uchun [Raft](https://raft.github.io/)
  konsensus algoritmini sozlaydi. Agar
  asosiy nusxa yoʻqolsa, boshqa xizmat oʻzini saylaydi va uning oʻrnini egallaydi.
- *Bir nechta zonalarni qamrab olish*: Agar klasterni har doim mavjud saqlash
  muhim boʻlsa, bir nechta maʼlumotlar markazida ishlaydigan klaster yaratishni koʻrib chiqing.
  Bulut muhitlarida bular zonalar deb ataladi. Zona guruhlari mintaqalar deb ataladi.
  Klasterni bir xil mintaqadagi
  bir nechta zonaga yoyish orqali bitta zona mavjud boʻlmay qolsa ham
  klaster ishlashda davom etish ehtimolini oshirish mumkin.
  Batafsil maʼlumot uchun [Bir nechta zonada ishlatish](/docs/setup/best-practices/multiple-zones/) sahifasiga qarang.
- *Joriy vazifalarni boshqarish*: Agar klasterni vaqt oʻtishi bilan saqlab qolishni rejalashtirsangiz,
  uning sogʻligʻi va xavfsizligini saqlash uchun bajarishingiz kerak boʻlgan vazifalar bor. Masalan,
  agar kubeadm bilan oʻrnatgan boʻlsangiz,
  [sertifikatlarni boshqarish](/docs/tasks/administer-cluster/kubeadm/kubeadm-certs/)
  va [kubeadm klasterlarini yangilash](/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/) boʻyicha koʻrsatmalar mavjud.
  Kubernetes maʼmuriy vazifalarining uzunroq roʻyxati uchun [Klasterni boshqarish](/docs/tasks/administer-cluster/)
  sahifasiga qarang.

Boshqaruv tekisligi xizmatlarini ishga tushirganda mavjud variantlar haqida bilish uchun
[kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/),
[kube-controller-manager](/docs/reference/command-line-tools-reference/kube-controller-manager/)
va [kube-scheduler](/docs/reference/command-line-tools-reference/kube-scheduler/)
komponent sahifalariga qarang. Yuqori mavjudlikdagi boshqaruv tekisligi misollari uchun
[Yuqori mavjudlik topologiyasi variantlari](/docs/setup/production-environment/tools/kubeadm/ha-topology/),
[kubeadm bilan yuqori mavjudlikdagi klasterlar yaratish](/docs/setup/production-environment/tools/kubeadm/high-availability/)
va [Kubernetes uchun etcd klasterlarini ishlatish](/docs/tasks/administer-cluster/configure-upgrade-etcd/) sahifalariga qarang.
etcd zaxira rejasini tuzish haqida axborot uchun [etcd klasterining zaxira nusxasini olish](/docs/tasks/administer-cluster/configure-upgrade-etcd/#backing-up-an-etcd-cluster)
sahifasiga qarang.

### Ishlab chiqarish ishchi tugunlari {#production-worker-nodes}

Ishlab chiqarish darajasidagi ish yuklari bardoshli boʻlishi kerak va ular tayanadigan har qanday narsa
ham bardoshli boʻlishi kerak (masalan, CoreDNS). Boshqaruv tekisligini oʻzingiz boshqarasizmi
yoki buni bulut provayderi siz uchun qilasimi, ishchi tugunlarni (oddiygina
*tugunlar* deb ham ataladi) qanday boshqarishni baribir koʻrib chiqishingiz kerak.

- *Tugunlarni sozlash*: Tugunlar jismoniy yoki virtual mashinalar boʻlishi mumkin. Agar oʻz
  tugunlaringizni yaratish va boshqarishni xohlasangiz, qoʻllab-quvvatlanadigan operatsion tizimni oʻrnatishingiz,
  soʻng tegishli
  [tugun xizmatlarini](/docs/concepts/architecture/#node-components) qoʻshib ishga tushirishingiz mumkin. Quyidagilarni koʻrib chiqing:
  - Tugunlarni sozlayotganda ish yuklaringiz talablari: yetarli xotira, CPU hamda disk tezligi va saqlash sigʻimi mavjud boʻlishi.
  - Oddiy kompyuter tizimlari yetadimi yoki GPU protsessorlari, Windows tugunlari yoki VM izolyatsiyasini talab qiladigan ish yuklaringiz bormi.
- *Tugunlarni tekshirish*: Tugun Kubernetes klasteriga qoʻshilish talablariga javob berishini qanday taʼminlash haqida axborot uchun [Yaroqli tugun sozlamasi](/docs/setup/best-practices/node-conformance/)
  sahifasiga qarang.
- *Klasterga tugunlar qoʻshish*: Agar klasterni oʻzingiz boshqarayotgan boʻlsangiz,
  oʻz mashinalaringizni sozlash hamda ularni qoʻlda qoʻshish yoki
  ular klastening apiserveriga oʻzlari roʻyxatdan oʻtishi orqali tugunlar qoʻshishingiz mumkin. Kubernetesni shu usullarda tugun qoʻshish uchun qanday sozlash haqida axborot uchun
  [Tugunlar](/docs/concepts/architecture/nodes/) boʻlimiga qarang.
- *Tugunlarni masshtablash*: Klasteringiz oxir-oqibat kerak boʻladigan sigʻimni kengaytirish rejasiga ega boʻling. Qancha Pod va
  konteyner ishga tushirishingiz kerakligiga qarab qancha tugun kerakligini aniqlashga yordam berish uchun [Katta klasterlar uchun mulohazalar](/docs/setup/best-practices/cluster-large/)
  sahifasiga qarang. Agar tugunlarni oʻzingiz boshqarayotgan boʻlsangiz, bu
  oʻz jismoniy uskunangizni sotib olish va oʻrnatishni anglatishi mumkin.
- *Tugunlarni avtomatik masshtablash*: Tugunlaringizni va ular
  beradigan sigʻimni avtomatik boshqarish uchun mavjud vositalar haqida bilish uchun [Tugunlarni avtomatik masshtablash](/docs/concepts/cluster-administration/node-autoscaling) sahifasini oʻqing.
- *Tugun sogʻligʻini tekshirishni sozlash*: Muhim ish yuklari uchun
  tugunlar va shu tugunlarda ishlayotgan Podlar sogʻlom ekaniga ishonch hosil qilishni xohlaysiz.
  [Node Problem Detector](/docs/tasks/debug/debug-cluster/monitor-node-health/)
  demoni yordamida tugunlaringiz sogʻlom ekanini taʼminlashingiz mumkin.

## Ishlab chiqarishda foydalanuvchilarni boshqarish {#production-user-management}

Ishlab chiqarishda siz yoki kichik bir guruh odamlar klasterga kiradigan modeldan
oʻnlab yoki yuzlab odamlar kirishi mumkin boʻlgan modelga oʻtishingiz mumkin. Oʻrganish muhitida yoki platforma prototipida hamma ishingiz uchun bitta
maʼmuriy hisob boʻlishi mumkin. Ishlab chiqarishda turli Namespacelarga turli darajadagi kirishga ega
koʻproq hisoblar kerak boʻladi.

Ishlab chiqarish darajasidagi klasterni qoʻlga olish boshqa foydalanuvchilarga kirishga qanday
tanlab ruxsat berishni hal qilishni anglatadi. Xususan, klasteringizga kirishga uringanlarning
shaxslarini tekshirish (autentifikatsiya) va ular soʻrayotgan ishni qilishga ruxsatlari bor-yoʻqligini hal qilish
(avtorizatsiya) strategiyalarini tanlashingiz kerak:

- *Autentifikatsiya*: apiserver foydalanuvchilarni mijoz
  sertifikatlari, bearer tokenlar, autentifikatsiya qiluvchi proksi yoki HTTP basic auth yordamida autentifikatsiya qilishi mumkin.
  Qaysi autentifikatsiya usullaridan foydalanishni tanlashingiz mumkin.
  Plaginlar yordamida apiserver tashkilotingizning mavjud
  autentifikatsiya usullaridan, masalan LDAP yoki Kerberosdan foydalanishi mumkin. Kubernetes foydalanuvchilarini autentifikatsiya qilishning bu turli usullari tavsifi uchun
  [Autentifikatsiya](/docs/reference/access-authn-authz/authentication/)
  sahifasiga qarang.
- *Avtorizatsiya*: Oddiy foydalanuvchilaringizga ruxsat bera boshlaganingizda, ehtimol
  RBAC va ABAC avtorizatsiyasi orasidan tanlaysiz. Foydalanuvchi hisoblariga (shuningdek, klasteringizga ServiceAccount kirishiga)
  ruxsat berishning turli rejimlarini koʻrib chiqish uchun [Avtorizatsiyaga umumiy nuqtai nazar](/docs/reference/access-authn-authz/authorization/)
  sahifasiga qarang:
  - *Rolga asoslangan kirishni boshqarish* ([RBAC](/docs/reference/access-authn-authz/rbac/)): Autentifikatsiya qilingan foydalanuvchilarga muayyan ruxsatlar toʻplamiga ruxsat berish orqali
    klasteringizga kirishni tayinlash imkonini beradi.
    Ruxsatlar muayyan Namespace (Role) uchun yoki butun klaster boʻylab
    (ClusterRole) tayinlanishi mumkin. Soʻng RoleBinding va ClusterRoleBinding yordamida bu ruxsatlar
    muayyan foydalanuvchilarga biriktirilishi mumkin.
  - *Atributga asoslangan kirishni boshqarish* ([ABAC](/docs/reference/access-authn-authz/abac/)): Klasterdagi resurs atributlariga asoslangan siyosatlar yaratish
    va shu atributlarga qarab kirishga ruxsat berish yoki rad etish imkonini beradi. Siyosat faylining har bir qatori versiyalash xossalarini (apiVersion
    va kind) hamda subject (foydalanuvchi yoki guruh), resurs xossasi,
    resurs boʻlmagan xossa (/version yoki /apis) va readonly ga mos keladigan spec xossalari xaritasini aniqlaydi. Batafsil maʼlumot uchun
    [Misollar](/docs/reference/access-authn-authz/abac/#examples) sahifasiga qarang.

Ishlab chiqarish Kubernetes klasteringizda autentifikatsiya va avtorizatsiyani sozlayotgan odam sifatida quyidagilarni koʻrib chiqing:

- *Avtorizatsiya rejimini belgilash*: Kubernetes API serveri
  ([kube-apiserver](/docs/reference/command-line-tools-reference/kube-apiserver/))
  ishga tushganda qoʻllab-quvvatlanadigan avtorizatsiya rejimlari *--authorization-config* fayli yoki *--authorization-mode*
  flagi yordamida belgilanishi kerak. Masalan, */etc/kubernetes/manifests* ichidagi *kube-adminserver.yaml* faylidagi bu flag
  Node,RBAC ga oʻrnatilishi mumkin. Bu autentifikatsiya qilingan soʻrovlar uchun Node va RBAC avtorizatsiyasiga ruxsat beradi.
- *Foydalanuvchi sertifikatlari va rol bogʻlanishlarini yaratish (RBAC)*: Agar RBAC
  avtorizatsiyasidan foydalanayotgan boʻlsangiz, foydalanuvchilar klaster CA si imzolashi mumkin boʻlgan CertificateSigningRequest (CSR) yaratishi
  mumkin. Soʻng har bir foydalanuvchiga Role va ClusterRole larni bogʻlashingiz mumkin.
  Batafsil maʼlumot uchun [Sertifikat imzolash soʻrovlari](/docs/reference/access-authn-authz/certificate-signing-requests/)
  sahifasiga qarang.
- *Atributlarni birlashtiradigan siyosatlar yaratish (ABAC)*: Agar ABAC
  avtorizatsiyasidan foydalanayotgan boʻlsangiz, tanlangan foydalanuvchilar yoki guruhlarga muayyan resurslar (masalan,
  Pod), Namespace yoki apiGroup ga kirishga ruxsat berish uchun atributlar birikmalarini siyosatlar shaklida tayinlashingiz mumkin. Qoʻshimcha axborot uchun
  [Misollar](/docs/reference/access-authn-authz/abac/#examples) sahifasiga qarang.
- *Admission Controllerlarni koʻrib chiqish*: API server orqali kelishi mumkin boʻlgan
  soʻrovlar uchun qoʻshimcha avtorizatsiya shakllari
  [Webhook token autentifikatsiyasi](/docs/reference/access-authn-authz/authentication/#webhook-token-authentication) ni oʻz ichiga oladi.
  Webhooklar va boshqa maxsus avtorizatsiya turlarini yoqish uchun API serverga
  [Admission Controllerlar](/docs/reference/access-authn-authz/admission-controllers/)
  qoʻshish kerak.

## Ish yuki resurslariga cheklovlar qoʻyish {#set-limits-on-workload-resources}

Ishlab chiqarish ish yuklaridan keladigan talablar Kubernetes boshqaruv tekisligining ichida ham, tashqarisida ham
bosim yaratishi mumkin. Klasteringiz ish yuklari ehtiyojlari uchun sozlashda quyidagi bandlarni koʻrib chiqing:

- *Namespace cheklovlarini belgilash*: Xotira va CPU kabi narsalarga har bir Namespace uchun kvotalar belgilang. Batafsil maʼlumot uchun
  [Xotira, CPU va API resurslarini boshqarish](/docs/tasks/administer-cluster/manage-resources/)
  sahifasiga qarang.
- *DNS talabiga tayyorgarlik*: Agar ish yuklari keskin masshtablanishini kutayotgan boʻlsangiz,
  DNS xizmatiningiz ham masshtablanishga tayyor boʻlishi kerak.
  [Klasterdagi DNS xizmatini avtomatik masshtablash](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/) sahifasiga qarang.
- *Qoʻshimcha ServiceAccountlar yaratish*: Foydalanuvchi hisoblari foydalanuvchilar
  klasterda nima qila olishini belgilaydi, ServiceAccount esa muayyan
  Namespaceda Pod kirishini belgilaydi. Standart holatda Pod oʻz Namespacesidagi standart ServiceAccountni qabul qiladi.
  Yangi ServiceAccount yaratish haqida axborot uchun [ServiceAccountlarni boshqarish](/docs/reference/access-authn-authz/service-accounts-admin/)
  sahifasiga qarang. Masalan, quyidagilarni xohlashingiz mumkin:
  - Pod maʼlum bir konteyner registridan obrazlarni olish uchun foydalanishi mumkin boʻlgan Secretlarni qoʻshish. Misol uchun
    [Podlar uchun ServiceAccountlarni sozlash](/docs/tasks/configure-pod-container/configure-service-account/)
    sahifasiga qarang.
  - ServiceAccountga RBAC ruxsatlarini tayinlash. Batafsil maʼlumot uchun
    [ServiceAccount ruxsatlari](/docs/reference/access-authn-authz/rbac/#service-account-permissions)
    sahifasiga qarang.

## {{% heading "whatsnext" %}} {#what-s-next}

- Oʻz ishlab chiqarish Kubernetesingizni oʻzingiz yaratishni yoki uni mavjud
  [Tayyor bulut yechimlari](/docs/setup/production-environment/turnkey-solutions/)
  yoki [Kubernetes hamkorlari](/partners/) dan olishni hal qiling.
- Agar klasterni oʻzingiz qurishni tanlasangiz, [sertifikatlarni](/docs/setup/best-practices/certificates/)
  qanday boshqarishni rejalashtiring
  va
  [etcd](/docs/setup/production-environment/tools/kubeadm/setup-ha-etcd-with-kubeadm/)
  hamda
  [API serveri](/docs/setup/production-environment/tools/kubeadm/ha-topology/) kabi imkoniyatlar uchun yuqori mavjudlikni sozlang.
- [kubeadm](/docs/setup/production-environment/tools/kubeadm/),
  [kops](https://kops.sigs.k8s.io/) yoki
  [Kubespray](https://kubespray.io/) joylashtirish usullaridan birini tanlang.
- [Autentifikatsiya](/docs/reference/access-authn-authz/authentication/) va
  [Avtorizatsiya](/docs/reference/access-authn-authz/authorization/) usullaringizni aniqlash orqali foydalanuvchilarni boshqarishni sozlang.
- [Resurs cheklovlari](/docs/tasks/administer-cluster/manage-resources/),
  [DNSni avtomatik masshtablash](/docs/tasks/administer-cluster/dns-horizontal-autoscaling/)
  va [ServiceAccountlar](/docs/reference/access-authn-authz/service-accounts-admin/) ni sozlash orqali ilova ish yuklariga tayyorlaning.
