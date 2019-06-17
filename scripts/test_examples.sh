#!/bin/bash

set -e

# List files changed in the commit to check
FILES=($( git diff "$( git merge-base --fork-point master )" --name-only ))

TEST_EXAMPLES=No

# Check if examples folders (all locales) change in this branch
if printf -- '%s\n' "${FILES[@]}" | grep -qE '^"?content/[^/]+/examples/'; then
    TEST_EXAMPLES=Yes
fi

function install() {
  if ! [[ $TEST_EXAMPLES == Yes ]]; then
    echo "PR not touching examples, skipping example tests install" 1>&2
    exit 0
  fi

  export PATH=$GOPATH/bin:$PATH
  mkdir -p $HOME/gopath/src/k8s.io
  mv $TRAVIS_BUILD_DIR $HOME/gopath/src/k8s.io/website && cd $HOME/gopath/src/k8s.io/website

  # Make sure we are testing against the correct branch
  wget https://github.com/kubernetes/kubernetes/archive/v${KUBE_VERSION}.0.tar.gz -P $GOPATH/src/k8s.io

  pushd $GOPATH/src/k8s.io
  tar xzf v${KUBE_VERSION}.0.tar.gz
  mv kubernetes-${KUBE_VERSION}.0 kubernetes
  cd kubernetes
  make generated_files
  cp -L -R vendor $GOPATH/src/
  rm -r vendor
  popd

  # Fetch additional dependencies to run the tests in examples/examples_test.go
  go get -t -v k8s.io/website/content/en/examples
}

function run_test() {
  if ! [[ $TEST_EXAMPLES == Yes ]]; then
    echo "PR not touching examples, skipping example tests execution" 1>&2
    exit 0
  fi
  go test -v k8s.io/website/content/en/examples
}

if [[ $1 == install ]]; then
  install
  exit 0
elif [[ $1 == "run" ]]; then
  run_test
fi
