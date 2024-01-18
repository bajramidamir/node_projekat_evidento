const projectModel = require('../models/projectModel');
const userModel = require('../models/userModel');
const puppeteer = require('puppeteer');
const cookie = require('cookie');

const getProjectManagerDashboard = async (req, res) => {
    try {
        const userCookie = JSON.parse(req.cookies.user);
        const projectManagerIdQuery = await userModel.getUserIdByUsername(userCookie.username);
        const projectManagerId = projectManagerIdQuery.user_id;
        const projects = await projectModel.getProjectsForProjectManagerId(projectManagerId);
        res.render("projectManagerDashboard", { user: req.user, projects });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getProjectManagerProjectsPanel = async (req, res) => {
    try {
        const employees = await userModel.getAllEmployees();
        res.render('projectManagerProjectsPanel', { user: req.user, employees });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getProjectManagerViewProject = async (req, res) => {
    try {
        const { projectName } = req.query;
        const employees = await projectModel.getEmployeesForProject(projectName);
        const project = await projectModel.getInfoForProject(projectName);
        const tasks = await projectModel.getProjectTasks(projectName);
        res.render("projectManagerProjectOverview", { user: req.user, employees, project, tasks });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const getProjectReport = async (req, res) => {
    try {
        const { projectManagerId, projectName } = req.query;
        const reports = await projectModel.getReportForProject(projectManagerId, projectName);
        res.render('projectManagerProjectReport', { user: req.user, reports, projectManagerId });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};
const downloadReportAsPdf = async (req, res) => {
    try {
        const { projectManagerId, projectName } = req.body;
        // cookie hackery
        const cookies = req.headers.cookie;
        const parsedCookies = cookie.parse(cookies);
        const cookiesArray = Object.entries(parsedCookies).map(([name, value]) => ({
            name,
            value,
            domain: 'localhost',
        }));
        

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const route = `http://localhost:3000/project_manager_dashboard/get_project_report?projectManagerId=${projectManagerId}&projectName=${projectName}`;

        await page.setCookie(...cookiesArray);
        await page.goto(route);

        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${projectName}report.pdf`);

        res.send(pdfBuffer);
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    };
};

module.exports = {
    getProjectManagerDashboard,
    getProjectManagerProjectsPanel,
    getProjectManagerViewProject,
    getProjectReport,
    downloadReportAsPdf
}