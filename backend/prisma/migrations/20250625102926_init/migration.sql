-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "lembur" TEXT NOT NULL,
    "kepuasan_kerja" INTEGER NOT NULL,
    "kepuasan_lingkungan" INTEGER NOT NULL,
    "work_life_balance" INTEGER NOT NULL,
    "pendapatan_bulanan" INTEGER NOT NULL,
    "masa_kerja" INTEGER NOT NULL,
    "terakhir_promosi" INTEGER NOT NULL,
    "jabatan" TEXT NOT NULL,
    "jumlah_pelatihan" INTEGER NOT NULL,
    "diinput_oleh_id" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prediction" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "label_prediksi" TEXT NOT NULL,
    "probabilitas" DOUBLE PRECISION NOT NULL,
    "waktu_prediksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PredictionHistory" (
    "id" SERIAL NOT NULL,
    "employeeId" INTEGER NOT NULL,
    "label_prediksi" TEXT NOT NULL,
    "probabilitas" DOUBLE PRECISION NOT NULL,
    "waktu_prediksi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PredictionHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_diinput_oleh_id_fkey" FOREIGN KEY ("diinput_oleh_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prediction" ADD CONSTRAINT "Prediction_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PredictionHistory" ADD CONSTRAINT "PredictionHistory_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
