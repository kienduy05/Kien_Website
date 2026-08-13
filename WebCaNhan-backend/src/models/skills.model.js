'use strict';
const { getSqlPool, sql } = require('../dbs/init.sql');

class SkillsModel {
    static async getAll() {
        const pool = await getSqlPool();
        const result = await pool.request().query('SELECT * FROM skills');
        return result.recordset;
    }
    
    static async getById(id) {
        const pool = await getSqlPool();
        const result = await pool.request().input('id', sql.INT, id).query('SELECT * FROM skills WHERE id = @id');
        return result.recordset[0];
    }
    
    static async create(data) {
        const pool = await getSqlPool();
        const request = pool.request();
        const keys = Object.keys(data);
        if (keys.length === 0) throw new Error('Data cannot be empty');
        
        const columns = keys.map(k => `[${k}]`).join(', ');
        const values = keys.map(k => `@${k}`).join(', ');
        
        keys.forEach(k => request.input(k, data[k]));
        
        const query = `INSERT INTO skills (${columns}) OUTPUT INSERTED.* VALUES (${values})`;
        const result = await request.query(query);
        return result.recordset[0];
    }
    
    static async update(id, data) {
        const pool = await getSqlPool();
        const request = pool.request();
        const keys = Object.keys(data);
        if (keys.length === 0) return await this.getById(id);
        
        const setString = keys.map(k => `[${k}] = @${k}`).join(', ');
        keys.forEach(k => request.input(k, data[k]));
        request.input('id', sql.INT, id);
        
        // Handle updated_at if it exists by checking if the schema typically has it. We'll just let the generic SET handle it if provided.
        const query = `UPDATE skills SET ${setString} OUTPUT INSERTED.* WHERE id = @id`;
        const result = await request.query(query);
        return result.recordset[0];
    }
    
    static async delete(id) {
        const pool = await getSqlPool();
        const result = await pool.request().input('id', sql.INT, id).query('DELETE FROM skills WHERE id = @id');
        return result.rowsAffected[0];
    }
}
module.exports = SkillsModel;
