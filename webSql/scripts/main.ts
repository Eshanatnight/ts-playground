// 2. Create an web sql with email as primary key and name , age , gender as other field.
const SIZE: number = 2 * 1024 * 1024;

type Person = {
    email: string,
    name: string,
    age: number,
    gender: string,
};

// Create a database
let db: Database = window.openDatabase("mydb", "1.0", "my first database", SIZE);

db.transaction((tx: SQLTransaction) => {
    tx.executeSql("CREATE TABLE IF NOT EXISTS Person (email unique, name, age, gender)");
});

// 3. Create a function to insert data into the table.
db.transaction((tx: SQLTransaction) => {
    tx.executeSql("INSERT INTO Person (email, name, age, gender) VALUES ('abc@one.com', 'John', 30, 'M' )");
});
db.transaction((tx: SQLTransaction) => {
    tx.executeSql("INSERT INTO Person (email, name, age, gender) VALUES ('xyz@one.com', 'Jane', 25, 'F' )");
});
db.transaction((tx: SQLTransaction) => {
    tx.executeSql("INSERT INTO Person (email, name, age, gender) VALUES ('mno@one.com', 'Jake', 25, 'M' )");
});

// 4. Create a function to update data in the table.
db.transaction((tx: SQLTransaction) => {
    tx.executeSql("UPDATE Person SET age = 31 WHERE email = 'abc@one.com'");
});

// 5. Create a function to delete data from the table.
db.transaction((tx: SQLTransaction) => {
    tx.executeSql("DELETE FROM Person WHERE email = 'mno@one.com'");
});

// 6. Create a function to display all the data in the table.
db.transaction((tx: SQLTransaction) => {
tx.executeSql("SELECT * FROM Person", [], (tx: SQLTransaction, result: SQLResultSet) => {
        for (let i = 0; i < result.rows.length; i++) {
            let item: Person = result.rows.item(i);
            console.log(item);
        }
    });
});