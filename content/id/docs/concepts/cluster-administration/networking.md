---
title: Jaringan Kluster
content_type: concept
weight: 50
---

<!-- overview -->
Jaringan adalah bagian utama dari Kubernetes, tetapi bisa menjadi sulit
untuk memahami persis bagaimana mengharapkannya bisa bekerja.
Ada 4 masalah yang berbeda untuk diatasi:

1. Komunikasi antar kontainer yang sangat erat: hal ini diselesaikan oleh
   [Pod](/id/docs/concepts/workloads/pods/pod/) dan komunikasi `localhost`.
2. Komunikasi antar Pod: ini adalah fokus utama dari dokumen ini.
3. Komunikasi Pod dengan Service: ini terdapat di [Service](/id/docs/concepts/services-networking/service/).
4. Komunikasi eksternal dengan Service: ini terdapat di [Service](/id/docs/concepts/services-networking/service/).




<!-- body -->

Kubernetes adalah tentang berbagi mesin antar aplikasi. Pada dasarnya,
saat berbagi mesin harus memastikan bahwa dua aplikasi tidak mencoba menggunakan
_port_ yang sama. Mengkoordinasikan _port_ di banyak pengembang sangat sulit
dilakukan pada skala yang berbeda dan memaparkan pengguna ke masalah
tingkat kluster yang di luar kendali mereka.

Alokasi _port_ yang dinamis membawa banyak komplikasi ke sistem - setiap aplikasi
harus menganggap _port_ sebagai _flag_, _server_ API harus tahu cara memasukkan
nomor _port_ dinamis ke dalam blok konfigurasi, Service-Service harus tahu cara
menemukan satu sama lain, dll. Sebaliknya daripada berurusan dengan ini,
Kubernetes mengambil pendekatan yang berbeda.

## Model jaringan Kubernetes

Setiap Pod mendapatkan alamat IP sendiri. Ini berarti kamu tidak perlu secara langsung membuat tautan antara Pod dan kamu hampir tidak perlu berurusan dengan memetakan _port_ kontainer ke _port_ pada _host_. Ini menciptakan model yang bersih, kompatibel dengan yang sebelumnya dimana Pod dapat diperlakukan seperti halnya VM atau _host_ fisik dari perspektif alokasi _port_, penamaan, _service discovery_, _load balancing_, konfigurasi aplikasi, dan migrasi.

Kubernetes memberlakukan persyaratan mendasar berikut pada setiap implementasi jaringan (kecuali kebijakan segmentasi jaringan yang disengaja):

   * Pod pada suatu Node dapat berkomunikasi dengan semua Pod pada semua Node tanpa NAT
   * agen pada suatu simpul (mis. _daemon_ sistem, kubelet) dapat berkomunikasi dengan semua Pod pada Node itu

Catatan: Untuk platform yang mendukung Pod yang berjalan di jaringan _host_ (mis. Linux):

   * Pod di jaringan _host_ dari sebuah Node dapat berkomunikasi dengan semua Pod pada semua Node tanpa NAT

Model ini tidak hanya sedikit kompleks secara keseluruhan, tetapi pada prinsipnya kompatibel dengan keinginan Kubernetes untuk memungkinkan _low-friction porting_ dari aplikasi dari VM ke kontainer. Jika pekerjaan kamu sebelumnya dijalankan dalam VM, VM kamu memiliki IP dan dapat berbicara dengan VM lain di proyek yang sama. Ini adalah model dasar yang sama.

Alamat IP Kubernetes ada di lingkup Pod - kontainer dalam Pod berbagi jaringan _namespace_ mereka - termasuk alamat IP mereka. Ini berarti bahwa kontainer dalam Pod semua dapat mencapai _port_ satu sama lain di `_localhost_`. Ini juga berarti bahwa kontainer dalam Pod harus mengoordinasikan penggunaan _port_, tetapi ini tidak berbeda dari proses di VM. Ini disebut model "IP-per-pod".

## Bagaimana menerapkan model jaringan Kubernetes

Ada beberapa cara agar model jaringan ini dapat diimplementasikan. Dokumen ini bukan studi lengkap tentang berbagai metode, tetapi semoga berfungsi sebagai pengantar ke berbagai teknologi dan berfungsi sebagai titik awal.

Opsi jaringan berikut ini disortir berdasarkan abjad - urutan tidak menyiratkan status istimewa apa pun.

### ACI

[Infrastruktur Sentral Aplikasi Cisco](https://www.cisco.com/c/en/us/solutions/data-center-virtualization/application-centric-infrastructure/index.html) menawarkan solusi SDN overlay dan underlay terintegrasi yang mendukung kontainer, mesin virtual, dan _bare metal server_. [ACI](https://www.github.com/noironetworks/aci-containers) menyediakan integrasi jaringan kontainer untuk ACI. Tinjauan umum integrasi disediakan [di sini](https://www.cisco.com/c/dam/en/us/solutions/collateral/data-center-virtualization/application-centric-infrastructure/solution-overview-c22-739493.pdf).

### AOS dari Apstra

[AOS](http://www.apstra.com/products/aos/) adalah sistem Jaringan Berbasis Intent yang menciptakan dan mengelola lingkungan pusat data yang kompleks dari platform terintegrasi yang sederhana. AOS memanfaatkan desain terdistribusi sangat _scalable_ untuk menghilangkan pemadaman jaringan sambil meminimalkan biaya.

Desain Referensi AOS saat ini mendukung _host_ yang terhubung dengan Lapis-3 yang menghilangkan masalah peralihan Lapis-2 yang lama. Host Lapis-3 ini bisa berupa _server_ Linux (Debian, Ubuntu, CentOS) yang membuat hubungan tetangga BGP secara langsung dengan _top of rack switches_ (TORs). AOS mengotomatisasi kedekatan perutean dan kemudian memberikan kontrol yang halus atas _route health injections_ (RHI) yang umum dalam _deployment_ Kubernetes.

AOS memiliki banyak kumpulan endpoint REST API yang memungkinkan Kubernetes dengan cepat mengubah kebijakan jaringan berdasarkan persyaratan aplikasi. Peningkatan lebih lanjut akan mengintegrasikan model Grafik AOS yang digunakan untuk desain jaringan dengan penyediaan beban kerja, memungkinkan sistem manajemen ujung ke ujung untuk layanan cloud pribadi dan publik.

AOS mendukung penggunaan peralatan vendor umum dari produsen termasuk Cisco, Arista, Dell, Mellanox, HPE, dan sejumlah besar sistem white-box dan sistem operasi jaringan terbuka seperti Microsoft SONiC, Dell OPX, dan Cumulus Linux.

Detail tentang cara kerja sistem AOS dapat diakses di sini: http://www.apstra.com/products/how-it-works/

### AWS VPC CNI untuk Kubernetes

[AWS VPC CNI](https://github.com/aws/amazon-vpc-cni-k8s) menawarkan jaringan AWS _Virtual Private Cloud_ (VPC) terintegrasi untuk kluster Kubernetes. Plugin CNI ini menawarkan _throughput_ dan ketersediaan tinggi, latensi rendah, dan _jitter_ jaringan minimal. Selain itu, pengguna dapat menerapkan jaringan AWS VPC dan praktik keamanan terbaik untuk membangun kluster Kubernetes. Ini termasuk kemampuan untuk menggunakan catatan aliran VPC, kebijakan perutean VPC, dan grup keamanan untuk isolasi lalu lintas jaringan.

Menggunakan _plugin_ CNI ini memungkinkan Pod Kubernetes memiliki alamat IP yang sama di dalam Pod seperti yang mereka lakukan di jaringan VPC. CNI mengalokasikan AWS _Elastic Networking Interfaces_ (ENIs) ke setiap node Kubernetes dan menggunakan rentang IP sekunder dari setiap ENI untuk Pod pada Node. CNI mencakup kontrol untuk pra-alokasi ENI dan alamat IP untuk waktu mulai Pod yang cepat dan memungkinkan kluster besar hingga 2.000 Node.

Selain itu, CNI dapat dijalankan bersama [Calico untuk penegakan kebijakan jaringan](https://docs.aws.amazon.com/eks/latest/userguide/calico.html). Proyek AWS VPC CNI adalah _open source_ dengan [dokumentasi di GitHub](https://github.com/aws/amazon-vpc-cni-k8s).

### Big Cloud Fabric dari Big Switch Networks

[Big Cloud Fabric](https://www.bigswitch.com/container-network-automation) adalah arsitektur jaringan asli layanan cloud, yang dirancang untuk menjalankan Kubernetes di lingkungan cloud pribadi / lokal. Dengan menggunakan SDN fisik & _virtual_ terpadu, Big Cloud Fabric menangani masalah yang sering melekat pada jaringan kontainer seperti penyeimbangan muatan, visibilitas, pemecahan masalah, kebijakan keamanan & pemantauan lalu lintas kontainer.

Dengan bantuan arsitektur multi-penyewa Pod virtual pada Big Cloud Fabric, sistem orkestrasi kontainer seperti Kubernetes, RedHat OpenShift, Mesosphere DC/OS & Docker Swarm akan terintegrasi secara alami bersama dengan sistem orkestrasi VM seperti VMware, OpenStack & Nutanix. Pelanggan akan dapat terhubung dengan aman berapa pun jumlah klusternya dan memungkinkan komunikasi antar penyewa di antara mereka jika diperlukan.

Terbaru ini BCF diakui oleh Gartner sebagai visioner dalam [_Magic Quadrant_](http://go.bigswitch.com/17GatedDocuments-MagicQuadrantforDataCenterNetworking_Reg.html). Salah satu penyebaran BCF Kubernetes di tempat (yang mencakup Kubernetes, DC/OS & VMware yang berjalan di beberapa DC di berbagai wilayah geografis) juga dirujuk [di sini](https://portworx.com/architects-corner-kubernetes-satya-komala-nio/).

### Cilium

[Cilium](https://github.com/cilium/cilium) adalah perangkat lunak _open source_ untuk menyediakan dan secara transparan mengamankan konektivitas jaringan antar kontainer aplikasi. Cilium mengetahui L7/HTTP dan dapat memberlakukan kebijakan jaringan pada L3-L7 menggunakan model keamanan berbasis identitas yang dipisahkan dari pengalamatan jaringan.

### CNI-Genie dari Huawei

[CNI-Genie](https://github.com/Huawei-PaaS/CNI-Genie) adalah _plugin_ CNI yang memungkinkan Kubernetes [secara bersamaan memiliki akses ke berbagai implementasi](https://github.com/Huawei-PaaS /CNI-Genie/blob/master/docs/multiple-cni-plugins/README.md#what-cni-genie-feature-1-multiple-cni-plugins-enables) dari [model jaringan Kubernetes] (https://git.k8s.io/website/docs/concepts/cluster-administration/networking.md#kubernetes-model) dalam _runtime_. Ini termasuk setiap implementasi yang berjalan sebagai [_plugin_ CNI](https://github.com/containernetworking/cni#3rd-party-plugins), seperti [Flannel](https://github.com/coreos/flannel#flannel), [Calico](http://docs.projectcalico.org/), [Romana](http://romana.io), [Weave-net](https://www.weave.works/products/weave-net/).

CNI-Genie juga mendukung [menetapkan beberapa alamat IP ke sebuah Pod](https://github.com/Huawei-PaaS/CNI-Genie/blob/master/docs/multiple-ips/README.md#feature-2-extension-cni-genie-multiple-ip-address-per-pod), masing-masing dari _plugin_ CNI yang berbeda.

### cni-ipvlan-vpc-k8s

[cni-ipvlan-vpc-k8s](https://github.com/lyft/cni-ipvlan-vpc-k8s) berisi satu set _plugin_ CNI dan IPAM untuk menyediakan kemudahan, host-lokal, latensi rendah, _throughput_ tinggi , dan tumpukan jaringan yang sesuai untuk Kubernetes dalam lingkungan Amazon Virtual Private Cloud (VPC) dengan memanfaatkan Amazon Elastic Network Interfaces (ENI) dan mengikat IP yang dikelola AWS ke Pod-Pod menggunakan _driver_ IPvlan _kernel_ Linux dalam mode L2.

Plugin ini dirancang untuk secara langsung mengkonfigurasi dan _deploy_ dalam VPC. Kubelet melakukan _booting_ dan kemudian mengkonfigurasi sendiri dan memperbanyak penggunaan IP mereka sesuai kebutuhan tanpa memerlukan kompleksitas yang sering direkomendasikan untuk mengelola jaringan _overlay_, BGP, menonaktifkan pemeriksaan sumber/tujuan, atau menyesuaikan tabel rute VPC untuk memberikan _subnet_ per _instance_ ke setiap _host_ (yang terbatas hingga 50-100 masukan per VPC). Singkatnya, cni-ipvlan-vpc-k8s secara signifikan mengurangi kompleksitas jaringan yang diperlukan untuk menggunakan Kubernetes yang berskala di dalam AWS.

### Contiv

[Contiv](https://github.com/contiv/netplugin) menyediakan jaringan yang dapat dikonfigurasi (_native_ l3 menggunakan BGP, _overlay_ menggunakan vxlan, classic l2, atau Cisco-SDN / ACI) untuk berbagai kasus penggunaan. [Contiv](https://contivpp.io) semuanya open sourced.

### Contrail / Tungsten Fabric

[Contrail](http://www.juniper.net/us/en/products-services/sdn/contrail/contrail-networking/), berdasarkan [Tungsten Fabric](https://tungsten.io), adalah platform virtualisasi jaringan dan manajemen kebijakan _multi-cloud_ yang benar-benar terbuka. Contrail dan Tungsten Fabric terintegrasi dengan berbagai sistem orkestrasi seperti Kubernetes, OpenShift, OpenStack dan Mesos, dan menyediakan mode isolasi yang berbeda untuk mesin _virtual_, banyak kontainer / banyak Pod dan beban kerja _bare metal_.

### DANM

[DANM] (https://github.com/nokia/danm) adalah solusi jaringan untuk beban kerja telco yang berjalan di kluster Kubernetes. Dibangun dari komponen-komponen berikut:

   * Plugin CNI yang mampu menyediakan antarmuka IPVLAN dengan fitur-fitur canggih
   * Modul IPAM built-in dengan kemampuan mengelola dengan jumlah banyak, _cluster-wide_, _discontinous_ jaringan L3 dan menyediakan skema dinamis, statis, atau tidak ada permintaan skema IP
   * Metaplugin CNI yang mampu melampirkan beberapa antarmuka jaringan ke kontainer, baik melalui CNI sendiri, atau mendelegasikan pekerjaan ke salah satu solusi CNI populer seperti SRI-OV, atau Flannel secara paralel
   * Pengontrol Kubernetes yang mampu mengatur secara terpusat antarmuka VxLAN dan VLAN dari semua _host_ Kubernetes
   * Pengontrol Kubernetes lain yang memperluas konsep _service discovery_ berbasis servis untuk bekerja di semua antarmuka jaringan Pod

Dengan _toolset_ ini, DANM dapat memberikan beberapa antarmuka jaringan yang terpisah, kemungkinan untuk menggunakan ujung belakang jaringan yang berbeda dan fitur IPAM canggih untuk Pod.

### Flannel

[Flannel] (https://github.com/coreos/flannel#flannel) adalah jaringan overlay yang sangat sederhana yang memenuhi persyaratan Kubernetes. Banyak orang telah melaporkan kesuksesan dengan Flannel dan Kubernetes.

### Google Compute Engine (GCE)

Untuk skrip konfigurasi kluster Google Compute Engine, [perutean lanjutan](https://cloud.google.com/vpc/docs/routes) digunakan untuk menetapkan setiap VM _subnet_ (standarnya adalah `/24` - 254 IP). Setiap lalu lintas yang terikat untuk _subnet_ itu akan dialihkan langsung ke VM oleh _fabric_ jaringan GCE. Ini adalah tambahan untuk alamat IP "utama" yang ditugaskan untuk VM, yang NAT'ed untuk akses internet keluar. Sebuah linux _bridge_ (disebut `cbr0`) dikonfigurasikan untuk ada pada subnet itu, dan diteruskan ke _flag_ `-bridge` milik docker.

Docker dimulai dengan:

```shell
DOCKER_OPTS="--bridge=cbr0 --iptables=false --ip-masq=false"
```

Jembatan ini dibuat oleh Kubelet (dikontrol oleh _flag_ `--network-plugin=kubenet`) sesuai dengan `.spec.podCIDR` yang dimiliki oleh Node.

Docker sekarang akan mengalokasikan IP dari blok `cbr-cidr`. Kontainer dapat menjangkau satu sama lain dan Node di atas jembatan `cbr0`. IP-IP tersebut semuanya dapat dirutekan dalam jaringan proyek GCE.

GCE sendiri tidak tahu apa-apa tentang IP ini, jadi tidak akan NAT untuk lalu lintas internet keluar. Untuk mencapai itu aturan iptables digunakan untuk menyamar (alias SNAT - untuk membuatnya seolah-olah paket berasal dari lalu lintas `Node` itu sendiri) yang terikat untuk IP di luar jaringan proyek GCE (10.0.0.0/8).

```shell
iptables -t nat -A POSTROUTING ! -d 10.0.0.0/8 -o eth0 -j MASQUERADE
```

Terakhir IP forwarding diaktifkan di kernel (sehingga kernel akan memproses paket untuk kontainer yang dijembatani):

```shell
sysctl net.ipv4.ip_forward=1
```

Hasil dari semua ini adalah bahwa semua Pod dapat saling menjangkau dan dapat keluar lalu lintas ke internet.

### Jaguar

[Jaguar](https://gitlab.com/sdnlab/jaguar) adalah solusi open source untuk jaringan Kubernetes berdasarkan OpenDaylight. Jaguar menyediakan jaringan overlay menggunakan vxlan dan Jaguar CNIPlugin menyediakan satu alamat IP per Pod.

### Knitter

[Knitter](https://github.com/ZTE/Knitter/) adalah solusi jaringan yang mendukung banyak jaringan di Kubernetes. Solusi ini menyediakan kemampuan manajemen penyewa dan manajemen jaringan. Knitter mencakup satu set solusi jaringan kontainer NFV ujung ke ujung selain beberapa pesawat jaringan, seperti menjaga alamat IP untuk aplikasi, migrasi alamat IP, dll.

### Kube-OVN

[Kube-OVN](https://github.com/alauda/kube-ovn) adalah _fabric_ jaringan kubernetes berbasis OVN untuk _enterprises_. Dengan bantuan OVN/OVS, solusi ini menyediakan beberapa fitur jaringan _overlay_ canggih seperti _subnet_, QoS, alokasi IP statis, _mirroring traffic_, _gateway_, kebijakan jaringan berbasis _openflow_, dan proksi layanan.

### Kube-router

[Kube-router](https://github.com/cloudnativelabs/kube-router) adalah solusi jaringan yang dibuat khusus untuk Kubernetes yang bertujuan untuk memberikan kinerja tinggi dan kesederhanaan operasional. Kube-router menyediakan Linux [LVS/IPVS](http://www.linuxvirtualserver.org/software/ipvs.html) berbasis proksi layanan, solusi jaringan berbasis penerusan _pod-to-pod_ Linux _kernel_ tanpa _overlay_, dan penegak kebijakan jaringan berbasis _iptables/ipset_.

### L2 networks and linux bridging

Jika Anda memiliki jaringan L2 yang "bodoh", seperti saklar sederhana di _environment_ "bare-metal", kamu harus dapat melakukan sesuatu yang mirip dengan pengaturan GCE di atas. Perhatikan bahwa petunjuk ini hanya dicoba dengan sangat sederhana - sepertinya berhasil, tetapi belum diuji secara menyeluruh. Jika kamu menggunakan teknik ini dan telah menyempurnakan prosesnya, tolong beri tahu kami.

Ikuti bagian "With Linux Bridge devices" dari [tutorial yang sangat bagus ini](http://blog.oddbit.com/2014/08/11/four-ways-to-connect-a-docker/) dari Lars Kellogg-Stedman.

### Multus (plugin Multi-Jaringan)

[Multus](https://github.com/Intel-Corp/multus-cni) adalah plugin Multi CNI untuk mendukung fitur Banyak Jaringan di Kubernetes menggunakan objek jaringan berbasis CRD di Kubernetes.

Multus mendukung semua [plugin referensi](https://github.com/containernetworking/plugins) (mis. [Flannel](https://github.com/containernetworking/plugins/tree/master/plugins/meta/flannel), [DHCP](https://github.com/containernetworking/plugins/tree/master/plugins/ipam/dhcp), [Macvlan](https://github.com/containernetworking/plugins/tree/master/plugins/main / macvlan)) yang mengimplementasikan spesifikasi CNI dan plugin pihak ke-3 (mis. [Calico](https://github.com/projectcalico/cni-plugin), [Weave](https://github.com/weaveworks/weave ), [Cilium](https://github.com/cilium/cilium), [Contiv](https://github.com/contiv/netplugin)). Selain itu, Multus mendukung [SRIOV](https://github.com/hustcat/sriov-cni), [DPDK](https://github.com/Intel-Corp/sriov-cni), [OVS- DPDK & VPP](https://github.com/intel/vhost-user-net-plugin) beban kerja di Kubernetes dengan aplikasi cloud asli dan aplikasi berbasis NFV di Kubernetes.

### NSX-T

[VMware NSX-T](https://docs.vmware.com/en/VMware-NSX-T/index.html) adalah virtualisasi jaringan dan platform keamanan. NSX-T dapat menyediakan virtualisasi jaringan untuk lingkungan multi-cloud dan multi-hypervisor dan berfokus pada kerangka kerja dan arsitektur aplikasi yang muncul yang memiliki titik akhir dan tumpukan teknologi yang heterogen. Selain hypervisor vSphere, lingkungan ini termasuk hypervisor lainnya seperti KVM, wadah, dan bare metal.

[NSX-T Container Plug-in (NCP)](https://docs.vmware.com/en/VMware-NSX-T/2.0/nsxt_20_ncp_kubernetes.pdf) menyediakan integrasi antara NSX-T dan pembuat wadah seperti Kubernetes, serta integrasi antara NSX-T dan platform CaaS / PaaS berbasis-kontainer seperti Pivotal Container Service (PKS) dan OpenShift.

### Nuage Networks VCS (Layanan Cloud Virtual)

[Nuage](http://www.nuagenetworks.net) menyediakan platform SDN (Software-Defined Networking) berbasis kebijakan yang sangat skalabel. Nuage menggunakan Open vSwitch _open source_ untuk data _plane_ bersama dengan SDN Controller yang kaya fitur yang dibangun pada standar terbuka.

Platform Nuage menggunakan _overlay_ untuk menyediakan jaringan berbasis kebijakan yang mulus antara Kubernetes Pod-Pod dan lingkungan non-Kubernetes (VM dan server _bare metal_). Model abstraksi kebijakan Nuage dirancang dengan mempertimbangkan aplikasi dan membuatnya mudah untuk mendeklarasikan kebijakan berbutir halus untuk aplikasi. Mesin analisis _real-time_ platform memungkinkan pemantauan visibilitas dan keamanan untuk aplikasi Kubernetes.

### OVN (Open Virtual Networking)

OVN adalah solusi virtualisasi jaringan opensource yang dikembangkan oleh komunitas Open vSwitch. Ini memungkinkan seseorang membuat switch logis, router logis, ACL stateful, load-balancers dll untuk membangun berbagai topologi jaringan virtual. Proyek ini memiliki plugin dan dokumentasi Kubernetes spesifik di [ovn-kubernetes](https://github.com/openvswitch/ovn-kubernetes).

### Project Calico

[Project Calico](http://docs.projectcalico.org/) adalah penyedia jaringan wadah sumber terbuka dan mesin kebijakan jaringan.

Calico menyediakan solusi jaringan dan kebijakan kebijakan jaringan yang sangat berskala untuk menghubungkan Pod Kubernetes berdasarkan prinsip jaringan IP yang sama dengan internet, untuk Linux (open source) dan Windows (milik - tersedia dari [Tigera](https://www.tigera.io/essentials/)). Calico dapat digunakan tanpa enkapsulasi atau _overlay_ untuk menyediakan jaringan pusat data skala tinggi yang berkinerja tinggi. Calico juga menyediakan kebijakan keamanan jaringan berbutir halus, berdasarkan niat untuk Pod Kubernetes melalui _firewall_ terdistribusi.

Calico juga dapat dijalankan dalam mode penegakan kebijakan bersama dengan solusi jaringan lain seperti Flannel, alias [kanal](https://github.com/tigera/canal), atau jaringan GCE, AWS atau Azure asli.

### Romana

[Romana](http://romana.io) adalah jaringan sumber terbuka dan solusi otomasi keamanan yang memungkinkan kamu menggunakan Kubernetes tanpa jaringan hamparan. Romana mendukung Kubernetes [Kebijakan Jaringan](/id/docs/concepts/services-networking/network-policies/) untuk memberikan isolasi di seluruh ruang nama jaringan.

### Weave Net dari Weaveworks

[Weave Net](https://www.weave.works/products/weave-net/) adalah jaringan yang tangguh dan mudah digunakan untuk Kubernetes dan aplikasi yang dihostingnya. Weave Net berjalan sebagai [plug-in CNI](https://www.weave.works/docs/net/latest/cni-plugin/) atau berdiri sendiri. Di kedua versi, itu tidak memerlukan konfigurasi atau kode tambahan untuk dijalankan, dan dalam kedua kasus, jaringan menyediakan satu alamat IP per Pod - seperti standar untuk Kubernetes.



## {{% heading "whatsnext" %}}


Desain awal model jaringan dan alasannya, dan beberapa rencana masa depan dijelaskan secara lebih rinci dalam [dokumen desain jaringan](https://git.k8s.io/community/contributors/design-proposals/network/networking.md).


