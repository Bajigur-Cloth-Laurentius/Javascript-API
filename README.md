# Javascript-API
Coding Test made with Javascript

Bajigur App merupakan API dimana admin bisa mendaftarkan segala data toko, dari data transaksi sampai data membernya (spesifik CSV file) yang akan otomatis masuk kedalam database yang telah disediakan.

Selain itu member yang telah terdaftar (dan memiliki riwayat transaksi) dapat mendapatkan "rekomendasi" dimana data tersebut diperoleh dan diolah dari pembelian yang mereka pernah lakukan.

###### Fitur - fitur esential untuk admin maupun staff:
      -Dapat mendaftarkan diri, mengedit, maupun menghapus akun kerjanya
      -Dapat memperbarui informasi produk toko, merubah, maupun menghapus produk tersebut (hanya beberapa admin saja dengan role tertentu yang dapat menghapus data tersebut)
      -Beberapa admin memiliki kemampuan untuk menginput data secara masal menggunakan CSV file yang diupload melalui multipart/form-data
      -Terproteksi dengan berbagai autentikasi dan autorisasi

###### Fitur - fitur esential untuk member:
      -Dapat mendaftarkan diri, mengedit, maupun menghapus akun membernya
      -Dapat memperoleh rekomendasi yang terpersonalisasi berdasarkan riwayat transaksi, dan berbeda setiap user
      -Terproteksi dengan berbagai autentikasi dan autorisasi

### Teknologi yang digunakan:
    Base:
      Node.js
      Express
      JSONWebToken
      Bcryptjs

    Database-related:
      Postgres
      Sequelize ORM
      
    Testing Purposes:
      JEST
      Supertest


### Panduan untuk melakukan test:
    -Pastikan Node.js sudah terinstall di komputer
    -Setelah clone repository dari Git, jalankan `npm install` dan `npm install -D` dari command line
    -Buat database untuk testing (PostgreSQL) dengan cara `npx sequelize db:create`, dilanjutkan dengan `npx sequelize db:migrate` pada command line (pastikan berada di direktori clone tsb.)
    -Eksekusi testing dengan perintah `npm run test` pada command line, ketika berada di dalam directory git

      Bila terjadi error, mungkin dapat membantu:
        -Bila menggunakan non Windows, ubah script `test` pada `package.json` menjadi `"NODE_ENV=test npx jest --verbose --coverage --runInBand --forceExit --detectOpenHandles"` 
        -Bila terjadi error kesalahan kredensial pada Postgres, config dapat diatur pada `./config/config.json`. Pastikan script `"test"` yang terubah

### Route pada aplikasi ini:
  ##### Admin:
    /admin/login (POST)
      -Untuk mendapatkan access token

    /admin/register/history (POST)
      -Dapat mengupload CSV berisi histori transaksi

    /admin/register/members (POST)
      -Dapat mengupload CSV berisi member yang belum terdaftar

    /admin/register/admins (POST)
      -Dapat mengupload CSV berisi admin yang belum terdaftar

    /admin/register (POST)
      -Register sebagai Admin dan mendapatkan access token

    /admin/:adminId (GET)
      -Mendapatkan informasi admin berdasarkan ID

    /admin/:adminId (PUT)
      -Memperbarui data admin berdasarkan ID
    
    /admin/:adminId (DELETE)
      -Menghapus data admin berdasarkan ID

    /admin/ (GET)
      -Mendapatkan informasi seluruh admin terdaftar


  ##### Member:
    /member/login (POST)
      -Untuk mendapatkan access token
      
    /member/recommendation (GET)
      -hanya dengan access token, member dapat melihat preferensi belanjanya yg terpersonalisasi di rute ini

    /member/register (POST)
      -Register sebagai member baru untuk mendapatkan access token dan rekomendasi personal

    /member/:memberId (GET)
      -Mendapatkan informasi member berdasarkan ID

    /member/:memberId (PUT)
      -Memperbarui data member berdasarkan ID

    /member/:memberId (DELETE)
      -Menghapus data member berdasarkan ID

    /member/ (GET)
      -Mendapatkan informasi seluruh member terdaftar


  ##### Product Management:
    /product/bulk (POST)
      -Dapat mengupload CSV berisi produk yang belum terdaftar

    /product/detail/:productDetailId (GET)
      -Mendapatkan informasi detail dari suatu produk berdasarkan ID

    /product/detail/:productDetailId (PUT)
      -Memperbarui data detail dari suatu produk berdasarkan ID

    /product/detail/:productDetailId (PATCH)
      -Memperbarui stok dari suatu produk berdasarkan ID

    /product/detail/:productDetailId (DELETE)
      -Menghapus data detail dari suatu produk berdasarkan ID
    
    /product/:productId (PUT)
      -Memperbarui data general (dan sekaligus data detail) dari suatu produk berdasarkan ID

    /product/:productId (DELETE)
      -Menghapus data general (dan sekaligus data detail) dari suatu produk berdasarkan ID

    /product/:productId (GET)
      -Mendapatkan informasi produk di database berdasarkan ID

    /product/ (POST)
      -Dapat mendaftarkan produk baru beserta detilnya

    /product/ (GET)
      -Mendapatkan informasi seluruh produk di database

--
