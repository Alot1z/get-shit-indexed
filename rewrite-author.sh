#!/bin/bash
# Rewrite commit authors from "Claude Opus 4.6" to "Mose"

YOUR_NAME="Mose"
YOUR_EMAIL="example@mail.com"
OLD_EMAIL="noreply@anthropic.com"

git filter-branch --env-filter "
if [ \"\$GIT_AUTHOR_EMAIL\" = \"$OLD_EMAIL\" ]
then
    export GIT_AUTHOR_NAME=\"$YOUR_NAME\"
    export GIT_AUTHOR_EMAIL=\"$YOUR_EMAIL\"
fi
if [ \"\$GIT_COMMITTER_EMAIL\" = \"$OLD_EMAIL\" ]
then
    export GIT_COMMITTER_NAME=\"$YOUR_NAME\"
    export GIT_COMMITTER_EMAIL=\"$YOUR_EMAIL\"
fi
" --tag-name-filter cat -- --branches --tags

echo "Author rewrite complete. Verify with: git log --format='%H %an <%ae> %s' -10"
