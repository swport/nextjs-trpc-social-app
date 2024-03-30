import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const count = 1000;

let lastUser;
let postsCount = 0;

const howManyPosts = () => {
	return Math.floor(Math.random() * (50 - 1) + 1);
};

const randomUserId = () => {
	return Math.floor(Math.random() * (500 - 1) + 1);
};

const posts = [];

const rWords = ["of", "the", "in", "on", "at", "to", "a", "is"];
const rWordsRe = new RegExp("\\b(" + rWords.join("|") + ")\\b", "g");

for (let i = 0; i < count; i++) {
	let user;

	if (lastUser && postsCount > 0) {
		user = lastUser;
		postsCount--;
	} else {
		user = lastUser = randomUserId();
		postsCount = howManyPosts();
	}

	const title = faker.lorem.words(10);

	const slug = title
		.toLowerCase()
		.replace(/ /g, "-")
		.replace(/[-]+/g, "-")
		.replace(/[^\w-]+/g, "")
		.replace(rWordsRe, "")
		.substring(0, 72);

	posts.push({
		file_path: faker.image.urlPicsumPhotos(),
		file_type: "image",
		content: faker.lorem.words(10),
		slug,
		userId: user,
		likesCount: 0,
		createdAt: new Date(),
		updatedAt: new Date(),
	});
}

const response = prisma.post.createMany({
	data: posts,
});

response.then((res) => console.log(res)).catch((err) => console.error(err));
