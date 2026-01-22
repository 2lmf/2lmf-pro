@echo off
cd /d "%~dp0"
echo ----------------------------------------
echo PRIPREMA ZA SLANJE NA GITHUB (Popravljeno)
echo ----------------------------------------
echo.

echo 1. Postavljanje korisnickih podataka (2LMF PRO)...
git config user.email "2lmf.info@gmail.com"
git config user.name "2LMF PRO"

echo 2. Inicijalizacija...
git init

echo 3. Dodavanje datoteka...
git add .

echo 4. Spremanje promjena...
git commit -m "Initial commit of website"

echo 5. Povezivanje s repozitorijem...
git remote remove origin 2>nul
git remote add origin https://github.com/2lmf/2lmf-web.git

echo 6. Slanje na GitHub...
git branch -M main
git push -u origin main

echo.
echo ----------------------------------------
echo GOTOVO!
echo ----------------------------------------
echo Ako vas pita za "Sign in with browser", odaberite tu opciju.
echo.
pause
