@echo off
echo Rewriting git author to "Mose" for all commits...

set FILTER_BRANCH_SQUELCH_WARNING=1

git filter-branch --env-filter "if [ \"$GIT_AUTHOR_EMAIL\" = \"noreply@anthropic.com\" ]; then export GIT_AUTHOR_NAME=\"Mose\"; export GIT_AUTHOR_EMAIL=\"example@mail.com\"; fi; if [ \"$GIT_COMMITTER_EMAIL\" = \"noreply@anthropic.com\" ]; then export GIT_COMMITTER_NAME=\"Mose\"; export GIT_COMMITTER_EMAIL=\"example@mail.com\"; fi" --tag-name-filter cat -- --branches --tags

echo.
echo Done! Verify with: git log --format="%%H %%an ^<%%ae^> %%s" -10
echo.
echo To push: git push --force origin main
pause
