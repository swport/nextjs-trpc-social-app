// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { faker } = require("@faker-js/faker");
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const { PrismaClient } = require("@prisma/client");

import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const count = 500;

const users: any[] = [];

for (let i = 0; i < count; i++) {
	const name = faker.person.fullName();
	users.push({
		name: name,
		email: faker.internet.email({ firstName: name }),
		emailVerified: new Date(),
		image: faker.image.avatarGitHub(),
		createdAt: new Date(),
		updatedAt: new Date(),
	});
}

const response = prisma.user.createMany({
	data: users,
});

response.then((res: any) => console.log(res)).catch((err: any) => console.error(err));
