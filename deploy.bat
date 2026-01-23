@echo off
cd /d "%~dp0"
set GIT_PATH="C:\Program Files\Git\cmd\git.exe"

echo ----------------------------------------
echo PRIPREMA ZA SLANJE NA GITHUB (Popravljeno)
echo ----------------------------------------
echo.

echo 1. Postavljanje korisnickih podataka (2LMF PRO)...
%GIT_PATH% config user.email "2lmf.info@gmail.com"
%GIT_PATH% config user.name "2LMF PRO"

echo 2. Inicijalizacija...
%GIT_PATH% init

echo 3. Dodavanje datoteka...
%GIT_PATH% add .

echo 4. Spremanje promjena...
%GIT_PATH% commit -m "Refined calculator modules and updated material prices"

echo 5. Povezivanje s repozitorijem...
%GIT_PATH% remote remove origin 2>nul
%GIT_PATH% remote add origin https://github.com/2lmf/2lmf-web.git

echo 6. Slanje na GitHub...
%GIT_PATH% branch -M main
%GIT_PATH% push -u origin main

echo.
echo ----------------------------------------
echo GOTOVO!
echo ----------------------------------------
echo Ako vas pita za "Sign in with browser", odaberite tu opciju.
echo.
pause
