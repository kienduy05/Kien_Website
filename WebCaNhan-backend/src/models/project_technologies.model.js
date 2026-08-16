'use strict';
const { getSqlPool, sql } = require('../dbs/init.sql');

class ProjectTechnologiesModel {
    static async getByProjectId(projectId) {
        const pool = await getSqlPool();
        const result = await pool.request()
            .input('project_id', sql.INT, projectId)
            .query(`
                SELECT pt.technology_id as id, t.name, t.icon_url, t.category 
                FROM project_technologies pt
                JOIN technologies t ON pt.technology_id = t.id
                WHERE pt.project_id = @project_id
            `);
        return result.recordset;
    }
    
    static async deleteByProjectId(projectId) {
        const pool = await getSqlPool();
        await pool.request()
            .input('project_id', sql.INT, projectId)
            .query('DELETE FROM project_technologies WHERE project_id = @project_id');
    }
    
    static async create(projectId, technologyId) {
        const pool = await getSqlPool();
        await pool.request()
            .input('project_id', sql.INT, projectId)
            .input('technology_id', sql.INT, technologyId)
            .query('INSERT INTO project_technologies (project_id, technology_id) VALUES (@project_id, @technology_id)');
    }
}
module.exports = ProjectTechnologiesModel;
