#!/bin/bash

# set K8S_WEBSITE in your env to your docs website root
# Note: website/content/<lang>/docs

CONTENT_DIR=${K8S_WEBSITE}/content

declare -a DIRS=("concepts" "contribute" "reference" "setup" "tasks" "tutorials")
declare -a EMPTY_STMTS=("body" "discussion" "lessoncontent" "overview" "steps")
declare -a REPLACE_STMTS=("cleanup" "objectives" "options" "prerequisites" "seealso" "synopsis" "whatsnext")
END_CAPTURE="{{% \/capture %}}"
CONTENT_TEMPLATE="content_template:"

# replace or remove capture statements
function replace_capture_stmts {
  echo "i:""$i"
  if [ -d "$1" ] ; then
    for i in `ls $1`; do
    replace_capture_stmts "${1}/${i}"
    done
  else
    if [ -f "$1" ] ; then
      ls -f $1 | while read -r file; do
        for stmt in "${EMPTY_STMTS[@]}" ; do
          CAPTURE_STMT="{{% capture ""$stmt"" %}}"
          COMMENT_REPLACE="<!-- ""$stmt"" -->"
          sed -i -e "s/${CAPTURE_STMT}/${COMMENT_REPLACE}/g" $1
        done

        for stmt in "${REPLACE_STMTS[@]}" ; do
          CAPTURE_STMT="{{% capture ""$stmt"" %}}"
          HEADING_STMT="## {{% heading \"""$stmt""\" %}}\n"
          # echo "HEADING STMT TO ADD:""$HEADING_STMT"
          sed -i -e "s/${CAPTURE_STMT}/${HEADING_STMT}/g" $1
        done

        sed -i -e "s/${END_CAPTURE}//g" $1

        # comment out concept template from front matter
        sed -i -e "s/^${CONTENT_TEMPLATE}/# ${CONTENT_TEMPLATE}/g" $1
      done
    else
      exit 1
    fi
  fi
}

# change to docs content dir
cd $CONTENT_DIR

for langdir in `ls $CONTENT_DIR`; do
  # Initial testing with a couple of localizations
  if [ $langdir = "en" ] ; then
  LANGDIR="$CONTENT_DIR""/""$langdir""/docs"

  for d in "${DIRS[@]}"; do
    ROOTDIR="${LANGDIR}""/""$d"
    cd ${ROOTDIR}
    for i in `ls ${ROOTDIR}`; do
      replace_capture_stmts "${ROOTDIR}""/""$i"
    done
  done
  fi
done
