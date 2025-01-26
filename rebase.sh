#/bin/bash

# see https://www.reddit.com/r/git/comments/2ae537/how_do_i_use_rebase_in_noninteractive_mode/

git rebase -i HEAD~3 <<<-EOF
pick 9b300666 edited this - chore: woocommerce-subscriptions v6.8.0
pick 12085156 chore: woocommerce-gateway-authorize-net-cim v3.10.8
pick de1ad6b9 fix: refactor error suppression, updating check to accommodate new PHP 8.2 error message
EOF



git rebase -i HEAD~3 <<-EOF
s 9b300666 
s 12085156 
p de1ad6b9 
EOF


# combine commits 5-3

git rebase -i HEAD~5

<<-EOF
pick fb0c793f chore: gravityforms 2.8.18
pick 07beb62d chore: woocommerce-gateway-authorize-net-cim 3.6.2
pick 09330ebc chore: woocommerce-subscriptions v6.8.0
pick 27e62878 chore: woocommerce-gateway-authorize-net-cim v3.10.8
pick 0aa96eeb fix: refactor error suppression, updating check to accommodate new PHP 8.2 error message
EOF

# change it to this

<<-EOF
pick fb0c793f chore: gravityforms 2.8.18
s 07beb62d chore: woocommerce-gateway-authorize-net-cim 3.6.2
s 09330ebc chore: woocommerce-subscriptions v6.8.0
pick 27e62878 chore: woocommerce-gateway-authorize-net-cim v3.10.8
pick 0aa96eeb fix: refactor error suppression, updating check to accommodate new PHP 8.2 error message
EOF

# then :wq, then edit message, then :wq to commit and rebase

sed -ri 's/pick 07b/s 07b/' <<-EOF
pick fb0c793f chore: gravityforms 2.8.18
pick 07beb62d chore: woocommerce-gateway-authorize-net-cim 3.6.2
pick 09330ebc chore: woocommerce-subscriptions v6.8.0
pick 27e62878 chore: woocommerce-gateway-authorize-net-cim v3.10.8
pick 0aa96eeb fix: refactor error suppression, updating check to accommodate new PHP 8.2 error message
EOF

# To combine the first N commits, do p, then s (n-1) times


# To cancel:
# Enter :cq 
# git rebase --abort

GIT_SEQUENCE_EDITOR="sed -ri 's/pick 07b/s 07b/'" git rebase -i HEAD~5



<<-EOF
mkdir -p /opt/amber
dnf install -y bc
bash <(curl -s "https://raw.githubusercontent.com/amber-lang/amber/master/setup/install.sh")
EOF

############################


# single liner from https://stackoverflow.com/questions/76794264/change-git-commit-message-without-interactive-rebase/76796919#76796919

GIT_SEQUENCE_EDITOR='sed -i "1s/^pick/reword/"' git rebase -i commit-you-want-to-amend^
# works perfectly, uses default editor

# now try to set the editor per their example
GIT_SEQUENCE_EDITOR='sed -i "1s/^pick/reword/"' GIT_EDITOR="printf \"%s\n\" \"$2\" >" git rebase -i  fb0c793f^

GIT_SEQUENCE_EDITOR='sed -i "1s/^pick/reword/"' GIT_EDITOR="printf \"%s\n\" \"my commit messgae\" >" git rebase -i  fb0c793f^v
# can set the message

# set the message on the 4th commit
COMMIT_MESSAGE="new message here" GIT_SEQUENCE_EDITOR='sed -i "1s/^pick/reword/"' GIT_EDITOR="printf \"%s\n\" \"$COMMIT_MESSAGE\" >" git rebase -i  HEAD~4
