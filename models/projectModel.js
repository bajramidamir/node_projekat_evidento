const pg = require('pg');
require('dotenv').config();

const config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DB,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
};

const pool = new pg.Pool(config);

async function getProjectCount() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT count(*) FROM projects");
        return result.rows[0];
    } finally {
        client.release();
    };
};

async function createNewProject(projectName, projectDescription, assignedUsers, assignedProjectManager, startDate, endDate) {
    const client = await pool.connect();
    try {
        // Start a transaction
        await client.query('BEGIN');

        const projectCountResult = await getProjectCount();
        const projectId = parseInt(projectCountResult.count, 10) + 1;
        const projectManagerIdQuery = await client.query("SELECT user_id from users WHERE username = $1", [assignedProjectManager]);
        const projectManagerId = projectManagerIdQuery.rows[0].user_id;

        await client.query("INSERT INTO projects(project_id, project_name, project_description, project_manager_id, start_date, end_date) VALUES($1, $2, $3, $4, $5, $6)",
            [projectId, projectName, projectDescription, projectManagerId, startDate, endDate]);

        // Insert into project_employees table
        for (const employee of assignedUsers) {
            const userIdQuery = await client.query("SELECT user_id FROM users WHERE username = $1", [employee]);
            const userRoleQuery = await client.query("SELECT role FROM users WHERE username = $1", [employee]);
        
            const userId = userIdQuery.rows[0].user_id;
            const userRole = userRoleQuery.rows[0].role;
        
            await client.query("INSERT INTO project_employees(user_id, project_id, role) VALUES ($1, $2, $3)", [userId, projectId, userRole]);
        }
        
        // Commit the transaction
        await client.query('COMMIT');
    } catch (error) {
        // Rollback the transaction in case of an error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    };
};

async function getProjects() {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM projects");
        return result.rows;
    } finally {
        client.release();
    };
};

async function getEmployeesForProject(projectName) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT
            u.username, u.first_name, u.last_name, u.user_id
                FROM projects AS p
            INNER JOIN project_employees pe on p.project_id = pe.project_id
            INNER JOIN users u on pe.user_id = u.user_id
            WHERE project_name = $1;`, [projectName]
        );
        return result.rows;
    } finally {
        client.release();
    };
};

async function getProjectManagerForProject(projectName) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT u.first_name, u.last_name
        FROM projects p
            INNER JOIN users u on p.project_manager_id = u.user_id
        WHERE p.project_name = $1;`, [projectName]);
        return result.rows[0];
    } finally {
        client.release();
    }
}

async function getInfoForProject(projectName) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM projects WHERE project_name = $1", [projectName]);
        return result.rows[0];
    } finally {
        client.release();
    };
};

async function getProjectTasks(projectName) {
    const client = await pool.connect();
    try {
        const projectIdQuery = await client.query("SELECT project_id FROM projects WHERE project_name = $1", [projectName]);
        const projectId = projectIdQuery.rows[0].project_id;

        const result = await client.query("SELECT * FROM project_task WHERE project_id = $1", [projectId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function getProjectsForProjectManagerId(projectManagerId) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM projects WHERE project_manager_id = $1", [projectManagerId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function createTask(projectName, taskName, taskDescription, assignedUser, dueDate) {
    const client = await pool.connect();
    try {
        const projectIdQuery = await client.query("SELECT project_id FROM projects WHERE project_name = $1", [projectName]);
        const projectId = projectIdQuery.rows[0].project_id;
        const assignedUserIdQuery = await client.query("SELECT user_id FROM users WHERE username = $1", [assignedUser]);
        const assignedUserId = assignedUserIdQuery.rows[0].user_id;
        await client.query("INSERT INTO project_task(project_id, task_name, description, assigned_to, due_date) VALUES ($1, $2, $3, $4, $5)", 
        [projectId, taskName, taskDescription, assignedUserId, dueDate]);
    } finally {
        client.release();
    };
};

async function getProjectsForEmployee(employeeId) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM projects 
        INNER JOIN public.project_employees pe on projects.project_id = pe.project_id 
        WHERE user_id = $1;`, 
        [employeeId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function getTasksForEmployeeOnProject(employeeId, projectId) {
    const client = await pool.connect();
    try {
        const result = await client.query(`SELECT * FROM project_task 
        INNER JOIN public.users u on u.user_id = project_task.assigned_to 
        WHERE u.user_id = $1 AND project_id = $2;`, 
        [employeeId, projectId]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function getTaskInfoById(taskId) {
    const client = await pool.connect();
    try {
        const result = await client.query("SELECT * FROM project_task WHERE task_id = $1 ORDER BY task_id ASC", [taskId]);
        return result.rows[0];
    } finally {
        client.release();
    };
};

async function updateTask(status, hoursWorked, projectId, taskId) {
    const client = await pool.connect();
    try {
        await client.query("UPDATE project_task SET status = $1, hours_worked = hours_worked + $2 WHERE project_id = $3 AND task_id = $4",
        [status, hoursWorked, projectId, taskId]);
    } finally {
        client.release();
    };
};

async function getReportForProject(projectManagerId, projectName) {
    const client = await pool.connect();
    const query = `SELECT p.project_id, p.project_name, p.project_description, p.start_date, p.end_date, 
    CONCAT(u.first_name, ' ', u.last_name) AS employee_name, pt.task_id, pt.task_name, pt.description,
    pt.status, pt.assigned_to, pt.due_date, pt.created_at, pt.updated_at, SUM(pt.hours_worked) AS total_hours_worked
    FROM projects p 
    JOIN project_task pt ON p.project_id = pt.project_id
    LEFT JOIN users u ON pt.assigned_to = u.user_id
    WHERE p.project_manager_id = $1 AND p.project_name = $2
    GROUP BY p.project_id, u.user_id, pt.task_id
    ORDER BY p.project_id, u.user_id, pt.task_id;`;
    try {
        const result = await client.query(query, [projectManagerId, projectName]);
        return result.rows;
    } finally {
        client.release();
    };
};

async function projectManagerUpdateTask(status, projectId, taskId) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE project_task SET status = $1 WHERE project_id = $2 AND task_id = $3 ', [status, projectId, taskId]);
    } finally {
        client.release();
    };
};

async function quickInput(projectId, taskName, hoursWorked) {
    const client = await pool.connect();
    try {
        await client.query('UPDATE project_task SET hours_worked = hours_worked + $1 WHERE project_id = $2 AND task_name = $3', [hoursWorked, projectId, taskName]);
    } finally {
        client.release();
    };
};

module.exports = {
    getProjectCount,
    createNewProject,
    getProjects,
    getEmployeesForProject,
    getProjectManagerForProject,
    getInfoForProject,
    getProjectTasks,
    getProjectsForProjectManagerId,
    createTask,
    getProjectsForEmployee,
    getTasksForEmployeeOnProject,
    getTaskInfoById,
    updateTask,
    getReportForProject,
    projectManagerUpdateTask,
    quickInput
};