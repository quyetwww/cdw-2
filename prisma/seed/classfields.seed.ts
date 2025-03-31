import {
  type PrismaClient,
  type Prisma,
  CurrencyCode,
  BodyType,
  Transmission,
  FuelType,
  Colour,
  ULEZCCompliance,
  ClassifiedStatus,
} from "@prisma/client";
import { faker } from "@faker-js/faker";
import slugify from "slugify";

export async function seedClassFields(prisma: PrismaClient) {
  const makes = await prisma.make.findMany({
    include: {
      models: {
        include: {
          modelVariants: true,
        },
      },
    },
  });

  const classfieldData: Prisma.ClassifiedCreateManyInput[] = [];

  for (let i = 0; i < makes.length; i++) {
    const make = faker.helpers.arrayElement(makes);
    if (!make.models.length) {
      continue;
    }
    const model = faker.helpers.arrayElement(make.models);
    const variant = model.modelVariants.length
      ? faker.helpers.arrayElement(model.modelVariants)
      : null;

    console.log({ make, model, variant });

    const year = faker.date
      .between({
        from: new Date(2000, 0, 1),
        to: new Date(2023, 0, 1),
      })
      .getFullYear();

    const title = [year, make.name, model.name, variant?.name]
      .filter(Boolean)
      .join(" ");

    const vrm = faker.vehicle.vrm();

    const baseSlug = slugify(`${title}-${vrm}`);

    classfieldData.push({
      year,
      makeId: make.id,
      modelId: model.id,
      title,
      slug: baseSlug,
      ...(variant?.id && {
        modelVariantId: variant.id,
      }),
      vrm,
      price: faker.number.int({ min: 400000, max: 10000000 }),
      odoReading: faker.number.int({ min: 0, max: 200000 }),
      doors: faker.helpers.arrayElement([2, 3, 4, 5]),
      seats: faker.helpers.arrayElement([2, 3, 4, 5, 6, 7]),
      views: faker.number.int({ min: 0, max: 1000 }),
      description: faker.lorem.paragraphs(3),
      currency: CurrencyCode.GBP,
      bodyType: faker.helpers.arrayElement(Object.values(BodyType)),
      transmission: faker.helpers.arrayElement(Object.values(Transmission)),
      fuelType: faker.helpers.arrayElement(Object.values(FuelType)),
      colour: faker.helpers.arrayElement(Object.values(Colour)),
      ulezCompliant: faker.helpers.arrayElement(Object.values(ULEZCCompliance)),
      status: faker.helpers.arrayElement(Object.values(ClassifiedStatus)),
    });
  }

  const result = await prisma.classified.createMany({
    data: classfieldData,
    skipDuplicates: true,
  });

  console.log(
    `Created ${result.count} classfields with ${classfieldData.length} records`
  );
}
