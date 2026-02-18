@echo off
echo Rewriting ALL git authors to "Alot1z" for https://github.com/Alot1z/get-shit-indexed...

set FILTER_BRANCH_SQUELCH_WARNING=1
set YOUR_NAME=Alot1z
set YOUR_EMAIL=Alot1z@users.noreply.github.com

git filter-branch --env-filter "export GIT_AUTHOR_NAME=\"%YOUR_NAME%\"; export GIT_AUTHOR_EMAIL=\"%YOUR_EMAIL%\"; export GIT_COMMITTER_NAME=\"%YOUR_NAME%\"; export GIT_COMMITTER_EMAIL=\"%YOUR_EMAIL%\"" --tag-name-filter cat -- --branches --tags

echo.
echo Done! All commits now authored by %YOUR_NAME%.
echo Verify with: git log --format="%%H %%an ^<%%ae^> %%s" -10
echo.
echo To push to GitHub: git push --force origin main
pause
