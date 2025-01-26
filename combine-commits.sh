#!/bin/bash
#
# combine-commits.sh -s<num-commits-from-head> -n<num-commits-to-combine>

OPTSTRING=":s:n:"

FIRSTCOMMIT=0

while getopts ${OPTSTRING} opt; do
  case ${opt} in
    s)
      #echo "Option -s was triggered. ${OPTARG}"
      FIRSTCOMMIT=${OPTARG}
      ;;
    n)
      #echo "Option -n was triggered. ${OPTARG}"
      NUMCOMMITS=${OPTARG}
      ;;
    ?)
      echo "Invalid option: -${OPTARG}."
      exit 1
      ;;
  esac
done

NUM_UNSTAGED_CHANGES=$(git status --porcelain=v1 --untracked-file=no 2>/dev/null | wc -l)
if [ $NUM_UNSTAGED_CHANGES -ne "0" ]
then
    echo "ERROR: Need a clean working tree first."
    exit 1
fi

CURRENT_HASH=$(git log --pretty=format:'%h' -n 1)
LINE=$(git log --pretty=format:'%h %s' -n 1)

echo "Current commit: $LINE"
echo "Combining $NUMCOMMITS commits, starting from $FIRSTCOMMIT commits ago"

git reset --hard HEAD~${FIRSTCOMMIT}

# Subtract 1 since the first commit is already included
NUMCOMMITS="$(($NUMCOMMITS - 1))"

git reset --soft HEAD~${NUMCOMMITS}

git commit -e -m "$(git log -n ${NUMCOMMITS} --pretty=format:'# %h %<(20)%cn %cd%n%s%n%b' --date=format:'%D %I:%M:%S %p')"

if [ $? == 1 ]
then
    echo "Cancelled out"
    git reset ${CURRENT_HASH} --hard
    exit 1;
fi
