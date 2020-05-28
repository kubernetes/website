#!/bin/bash

# set K8S_WEBSITE in your env

CONTENT_DIR=${K8S_WEBSITE}/content

# website/content/en/docs

declare -a DIRS=("concepts" "reference" "setup" "tasks" "tutorials")

# do we want objectives, cleanup headings?
declare -a EMPTY_STMTS=("body" "cleanup" "discussion" "lessoncontent" "objectives" "overview" "steps")
declare -a REPLACE_STMTS=("options" "prerequisites" "seealso" "synopsis" "whatsnext")
END_CAPTURE="{{% \/capture %}}"
CONTENT_TEMPLATE="content_template:"

# replace or remove capture statements
function replace_capture_stmts {
  echo "in replace capture"
  #echo "i:""$i"
  if [ -d "$1" ] ; then
    echo "found dir:""$1"
    for i in `ls $1`; do
    replace_capture_stmts "${1}/${i}"
    done
  else 
    if [ -f "$1" ] ; then
      echo "file:""$1"
      ls -f $1 | while read -r file; do

        for stmt in "${EMPTY_STMTS[@]}" ; do
          CAPTURE_STMT="{{% capture ""$stmt"" %}}"
          #echo "In empty replace""${CAPTURE_STMT}"
          COMMENT_REPLACE="<!-- ""$stmt"" -->"
          sed -i -e "s/${CAPTURE_STMT}/${COMMENT_REPLACE}/g" $1
        done

        for stmt in "${REPLACE_STMTS[@]}" ; do
          CAPTURE_STMT="{{% capture ""$stmt"" %}}"
          #echo "${CAPTURE_STMT}"
          HEADING_STMT="{{% ""$stmt""-heading %}}\n"
          #echo "HEADING STMT TO ADD:""$HEADING_STMT"
          sed -i -e "s/${CAPTURE_STMT}/${HEADING_STMT}/g" $1
        done
        # remove end capture
        sed -i -e "s/${END_CAPTURE}//g" $1

        # comment out concept template from front matter
        sed -i -e "s/${CONTENT_TEMPLATE}/# ${CONTENT_TEMPLATE}/g" $1
      done
    else
      exit 1
    fi
  fi
}

# change to docs content dir
cd $CONTENT_DIR

for langdir in `ls $CONTENT_DIR`; do
  echo "IN LANG:""$langdir"

  # Testing with EN only
  if [ $langdir = "en" ] ; then
  LANGDIR="$CONTENT_DIR""/""$langdir""/docs"
  echo "doc lang dir:${LANGDIR}"

  for d in "${DIRS[@]}"; do
    ROOTDIR="${LANGDIR}""/""$d"
    cd ${ROOTDIR}
    for i in `ls ${ROOTDIR}`; do
      replace_capture_stmts "${ROOTDIR}""/""$i"
    done
  done
  fi
done
