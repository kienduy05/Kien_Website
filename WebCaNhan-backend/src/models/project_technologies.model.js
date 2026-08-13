'use strict';
const { getSqlPool, sql } = require('../dbs/init.sql');

class ProjectTechnologiesModel {
    static async getAll() {
        const pool = await getSqlPool();
        const result = await pool.request().query('SELECT * FROM project_technologies');
        return result.recordset;
    }
    static async getById(id) {
        const pool = await getSqlPool();
        const result = await pool.request().input('id', sql.INT, id).query('SELECT * FROM project_technologies WHERE id = @id');
        return result.recordset[0];
    }
    static async delete(id) {
        const pool = await getSqlPool();
        const result = await pool.request().input('id', sql.INT, id).query('DELETE FROM project_technologies WHERE id = @id');
        return result.rowsAffected[0];
    }
}
module.exports = ProjectTechnologiesModel;
