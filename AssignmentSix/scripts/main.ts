import { Knex, knex } from "knex";
import * as sqlite3 from "sqlite3";
import { Prettify } from "./utility";

declare module "knex/types/tables" {
	interface Person {
		email: string;
		name: string;
		age: number;
		gender: string;
	}

	interface Table {
		person: Person;
		person_composite: Prettify<
			Knex.CompositeTableType<
				Person,
				Prettify<
					Pick<Person, "name"> &
						Partial<
							Pick<Person, "age" | "gender">
						>
				>,
				Prettify<Partial<Omit<Person, "email">>>
			>
		>;
	}
}





let db: sqlite3.Database = new sqlite3.Database(
	"person.sqlite"
);

db.serialize(() => {
	let createQuery: string = knex("user")
		.schema.createTableIfNotExists(
			"person",
			(table: Knex.CreateTableBuilder) => {
				table.string("email");
				table.string("name");
				table.integer("age");
			}
		)
		.toQuery();
	db.run(createQuery);

	let insertQuery: string = knex("person")
		.table("person")
		.insert([
			{
				email: "mno@one.com",
				name: "Jake",
				age: 25,
			},
			{
				email: "abc@one.com",
				name: "John",
				age: 30,
			},
			{
				email: "xyz@one.com",
				name: "Jane",
				age: 25,
			},
		])
		.toQuery();

    db.run(insertQuery);

    let selectAllQuery: string = knex("person")
	.table("person")
	.toQuery();

    db.all(selectAllQuery, (err: Error, rows: any[]) => {
        console.log("Before ")
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
        }
    });

    let updateQuery: string = knex("person")
	.table("person")
	.where("email", "abc@one.com")
	.update({ age: 31 })
	.toQuery();

    db.run(updateQuery);

    db.all(selectAllQuery, (err: Error, rows: any[]) => {
        console.log("After ")
        if (err) {
            console.log(err);
        } else {
            console.log(rows);
        }
    });

    let deleteQuery: string = knex("person")
	.table("person")
	.where("email", "mno@one.com")
	.delete()
	.toQuery();

    db.run(deleteQuery);

    let dropQuery: string = knex("person")
    .schema.dropTableIfExists("person")
    .toQuery();

    db.run(dropQuery);
});
