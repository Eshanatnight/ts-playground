export const SIZE: number = 2 * 1024 * 1024;

export type QueryResult = {
    rows: SQLResultSetRowList,
    insertId: number,
    rowsAffected: number
};

export class WSql {
    private db: Database;
    constructor(dbName: string, version: string, description: string, size: number) {
        this.db = window.openDatabase(dbName, version, description, size);
    }

    public executeSql(sql: string, params: any[]): Promise<QueryResult> {
        return new Promise((resolve, reject) => {
            this.db.transaction((tx) => {
                tx.executeSql(sql, params, (_, result: SQLResultSet) => {
                    resolve({
                        rows: result.rows,
                        insertId: result.insertId,
                        rowsAffected: result.rowsAffected
                    });
                });
            });
        });
    }
}


async function test_2() {
    let db = new WSql('test', '1.0', 'test', SIZE);
    let res = await db.executeSql('CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY, name TEXT, age INTEGER)', []);
    console.log(res.rows);

}
