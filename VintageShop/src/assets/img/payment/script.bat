FOR %%i IN (*.jpg) DO ffmpeg -i "%%i" -compression_level 100 "E:\Code\clothes_website\public\img\%%~ni.webp"
