cd path/to/unzipped/hoopcast-pro
git init
git remote add origin https://github.com/Hedge1001/hoopcast-pro.git
git add .
git commit -m "Add actual HoopCast Pro source (repo previously had none)"
git branch -M main
git push -u origin main --force
