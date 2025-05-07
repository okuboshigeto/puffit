/*
  Warnings:

  - You are about to drop the `ShishaFlavor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `flavors` to the `ShishaReview` table without a default value. This is not possible if the table is not empty.

*/
-- フレーバーカラムの追加
ALTER TABLE "ShishaReview" ADD COLUMN "flavors" JSONB NOT NULL DEFAULT '[]'::jsonb;

-- 既存のフレーバーデータをJSONに変換して保存
WITH flavor_data AS (
  SELECT 
    "reviewId",
    jsonb_agg(
      jsonb_build_object(
        'brand', brand,
        'flavorName', "flavorName"
      )
    ) as flavors_json
  FROM "ShishaFlavor"
  GROUP BY "reviewId"
)
UPDATE "ShishaReview"
SET flavors = COALESCE(
  (SELECT flavors_json FROM flavor_data WHERE flavor_data."reviewId" = "ShishaReview"."id"),
  '[]'::jsonb
);

-- デフォルト値の削除
ALTER TABLE "ShishaReview" ALTER COLUMN "flavors" DROP DEFAULT;

-- 外部キー制約の削除
ALTER TABLE "ShishaFlavor" DROP CONSTRAINT "ShishaFlavor_reviewId_fkey";

-- フレーバーテーブルの削除
DROP TABLE "ShishaFlavor";
