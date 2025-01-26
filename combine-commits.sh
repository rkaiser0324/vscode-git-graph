#!/bin/bash

# Function to print usage and exit
usage() {
  echo "Combine a number of consecutive commits in a git history, starting from a specified commit index."
  echo ""
  echo "Usage: $0 -s <start> -n <num>"
  echo "  -s <start>  : Number of commits from HEAD to start combining (integer > 0)"
  echo "  -n <num>    : Number of commits to combine (integer > 1)"
  exit 1
}

# Define color codes
red='\033[0;31m'
reset='\033[0m'

FIRSTCOMMIT=0

while getopts ":s:n:" opt; do
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
      usage
      ;;
  esac
done

# Check if required options are provided
if [[ -z "$FIRSTCOMMIT" || -z "$NUMCOMMITS" ]]; then
  echo "Error: Both -s and -n options are required."
  usage
fi

NUM_UNSTAGED_CHANGES=$(git status --porcelain=v1 --untracked-file=no 2>/dev/null | wc -l)
if [ $NUM_UNSTAGED_CHANGES -ne "0" ]
then
    echo "ERROR: Need a clean working tree first."
    exit 1
fi

CURRENT_HASH=$(git log --pretty=format:'%h' -n 1)
LINE=$(git log --pretty=format:'%h %s' -n 1)
COMMIT_MESSAGE="$(git log -n ${NUMCOMMITS} --skip=$FIRSTCOMMIT --pretty=format:'# %h %<(20)%cn %cd%n%s%n%b' --date=format:'%D %I:%M:%S %p')"

echo -e "Current commit: $LINE\n"
echo -e "Combining $NUMCOMMITS commits, starting from $FIRSTCOMMIT commits ago:\n"
echo -e "$COMMIT_MESSAGE"
echo ""

read -p "Continue? [Y]: " answer

if [[ "$answer" == "" || "$answer" == "Y" || "$answer" == "y" ]]; then

    # Suppress output via > /dev/null 2>&1
    git reset --hard HEAD~${FIRSTCOMMIT} 

    # Subtract 1 since the first commit is already included
    NUMCOMMITS="$(($NUMCOMMITS - 1))"

    git reset --soft HEAD~${NUMCOMMITS}

    # Abort via ESC, then :cq
    git commit -e -m "$(git log -n ${NUMCOMMITS} --pretty=format:'# %h %<(20)%cn %cd%n%s%n%b' --date=format:'%D %I:%M:%S %p')"

    if [ $? == 1 ]
    then
        git reset ${CURRENT_HASH} --hard

        echo -e "${red}Cancelled out - no changes made.${reset}"
        exit 1
    fi
else
    echo -e "${red}Cancelled out - no changes made.${reset}"
    exit 1
fi
