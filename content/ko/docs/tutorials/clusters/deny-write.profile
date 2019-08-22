#include <tunables/global>

profile k8s-apparmor-example-deny-write flags=(attach_disconnected) {
  #include <abstractions/base>

  file,

  # 모든 파일에 저장을 금지한다.
  deny /** w,
}
