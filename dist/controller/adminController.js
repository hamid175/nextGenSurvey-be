"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTeamInfo = exports.getTotalSurveyResponses = exports.adminLogin = exports.getSurveyData = exports.setSurveyTimeFrame = exports.removeMemberFromTeam = exports.addMemberToTeam = exports.getTotalNumberOfUsers = exports.getTotalNumberOfTeams = exports.createTeam = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
const Survey_1 = __importDefault(require("../models/Survey"));
const adminId = 'your-admin-id';
/**
 * @swagger
 * tags:
 *   name: Teams
 *   description: APIs related to managing teams
 */
/**
 * @swagger
 * /create-team:
 *   post:
 *     summary: Create a new team
 *     tags: [Teams]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               teamCode:
 *                 type: string
 *             example:
 *               teamCode: "team-123"
 *     responses:
 *       201:
 *         description: Team created successfully
 *       400:
 *         description: Team code already exists
 */
// Controller function for creating a new team
const createTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamCode } = req.body;
        // Check if the team code is already taken
        const existingTeam = yield Team_1.default.findOne({ teamCode });
        if (existingTeam) {
            return res.status(400).json({ message: 'Team code already exists' });
        }
        // Create the new team
        const newTeam = new Team_1.default({
            teamCode,
            members: [],
        });
        yield newTeam.save();
        return res.status(201).json({ message: 'Team created successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.createTeam = createTeam;
/**
 * @swagger
 * /total-teams:
 *   get:
 *     summary: Get the total number of teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Total number of teams
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalTeams:
 *                   type: number
 *             example:
 *               totalTeams: 5
 */
const getTotalNumberOfTeams = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalTeams = yield Team_1.default.countDocuments();
        return res.status(200).json({ totalTeams });
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalNumberOfTeams = getTotalNumberOfTeams;
/**
 * @swagger
 * /total-users:
 *   get:
 *     summary: Get the total number of users
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Total number of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *             example:
 *               totalUsers: 10
 */
const getTotalNumberOfUsers = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalUsers = yield User_1.default.countDocuments();
        return res.status(200).json({ totalUsers });
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalNumberOfUsers = getTotalNumberOfUsers;
/**
 * @swagger
 * /add-member-to-team/{teamCode}:
 *   post:
 *     summary: Add a user to a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The team code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *             example:
 *               userId: "user-123"
 *     responses:
 *       200:
 *         description: User added to the team successfully
 *       400:
 *         description: User is already a member of the team or user not found
 *       404:
 *         description: Team not found
 */
// Controller function for adding a user to a team
const addMemberToTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamCode } = req.params;
        const { userId } = req.body;
        // Find the team
        const team = yield Team_1.default.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Find the user
        const user = yield User_1.default.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        //check if member is already in the team
        if (team.members.includes(user._id)) {
            return res.status(400).json({ message: 'User is already a member of the team' });
        }
        // Add the user to the team
        team.members.push(user._id);
        yield team.save();
        return res.status(200).json({ message: 'User added to the team successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.addMemberToTeam = addMemberToTeam;
/**
 * @swagger
 * /remove-member-from-team/{teamCode}/{userId}:
 *   delete:
 *     summary: Remove a user from a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The team code
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User removed from the team successfully
 *       404:
 *         description: Team not found or user not found
 */
const removeMemberFromTeam = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamCode, userId } = req.params;
        // Find the team
        const team = yield Team_1.default.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Remove the user from the team
        team.members.pull(userId);
        yield team.save();
        return res.status(200).json({ message: 'User removed from the team successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.removeMemberFromTeam = removeMemberFromTeam;
/**
 * @swagger
 * /set-survey-time-frame/{teamCode}:
 *   put:
 *     summary: Set the survey time frame for a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The team code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *             example:
 *               startTime: "2023-08-10T08:00:00Z"
 *               endTime: "2023-08-15T18:00:00Z"
 *     responses:
 *       200:
 *         description: Survey time frame set successfully
 *       404:
 *         description: Team not found
 */
// Controller function for setting the survey time frame for a team
const setSurveyTimeFrame = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamCode } = req.params;
        const { startTime, endTime } = req.body;
        // Find the team
        const team = yield Team_1.default.findOne({ teamCode });
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Update the survey time frame for the team
        team.surveyStartTime = startTime;
        team.surveyEndTime = endTime;
        yield team.save();
        return res.status(200).json({ message: 'Survey time frame set successfully' });
    }
    catch (error) {
        next(error);
    }
});
exports.setSurveyTimeFrame = setSurveyTimeFrame;
/**
 * @swagger
 * /get-survey-data/{teamCode}:
 *   get:
 *     summary: Get survey data for a team
 *     tags: [Teams]
 *     parameters:
 *       - in: path
 *         name: teamCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The team code
 *     responses:
 *       200:
 *         description: Survey data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 team:
 *                   type: object
 *                   properties:
 *                     teamCode:
 *                       type: string
 *                     members:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           email:
 *                             type: string
 *                 surveys:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       responses:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             userId:
 *                               type: string
 *                             answers:
 *                               type: array
 *                               items:
 *                                 type: object
 *                                 properties:
 *                                   questionIndex:
 *                                     type: number
 *                                   response:
 *                                     type: number
 */
// Controller function for getting survey data for a team
const getSurveyData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teamCode } = req.params;
        // Find the team and its associated survey data in the database
        const team = yield Team_1.default.findOne({ teamCode }).populate('members', 'email');
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        // Retrieve survey data for the team from the database
        const surveys = yield Survey_1.default.find({ _id: { $in: team.surveys } }, 'title responses');
        // Return the survey data to the client in the desired format
        return res.status(200).json({ team, surveys });
    }
    catch (error) {
        next(error);
    }
});
exports.getSurveyData = getSurveyData;
/**
 * @swagger
 * /admin-login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             example:
 *               email: "admin@example.com"
 *               password: "admin123"
 *     responses:
 *       200:
 *         description: Admin login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *             example:
 *               message: "Admin login successful"
 *               token: "your-jwt-token"
 *       401:
 *         description: Admin login failed
 */
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Perform admin authentication logic (e.g., check credentials)
        // Replace this with your actual authentication logic
        if (email === 'hrk3341@gmail.com' && password === '123456789') {
            // Authentication successful
            // Generate a JWT token
            const token = jsonwebtoken_1.default.sign({ userId: adminId, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: 'Admin login successful', token });
        }
        else {
            // Authentication failed
            return res.status(401).json({ message: 'Admin login failed' });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.adminLogin = adminLogin;
/**
 * @swagger
 * /total-survey-responses:
 *   get:
 *     summary: Get the total number of survey responses
 *     tags: [Surveys]
 *     responses:
 *       200:
 *         description: Total number of survey responses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalResponses:
 *                   type: number
 *             example:
 *               totalResponses: 50
 */
const getTotalSurveyResponses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Count the total number of survey responses in the Survey model
        const totalResponses = yield Survey_1.default.aggregate([
            { $project: { numResponses: { $size: "$responses" } } },
            { $group: { _id: null, totalResponses: { $sum: "$numResponses" } } }
        ]);
        return res.status(200).json({ totalResponses: totalResponses.length > 0 ? totalResponses[0].totalResponses : 0 });
    }
    catch (error) {
        next(error);
    }
});
exports.getTotalSurveyResponses = getTotalSurveyResponses;
/**
 * @swagger
 * /team-info:
 *   get:
 *     summary: Get information about all teams
 *     tags: [Teams]
 *     responses:
 *       200:
 *         description: Team information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 teamInfo:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       teamCode:
 *                         type: string
 *                       numMembers:
 *                         type: number
 *                       totalSurveySubmissions:
 *                         type: number
 *                       numPendingResponses:
 *                         type: number
 *             example:
 *               teamInfo:
 *                 - teamCode: "team-1"
 *                   numMembers: 10
 *                   totalSurveySubmissions: 30
 *                   numPendingResponses: 5
 *                 - teamCode: "team-2"
 *                   numMembers: 8
 *                   totalSurveySubmissions: 20
 *                   numPendingResponses: 2
 */
const getTeamInfo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find all teams
        const teams = yield Team_1.default.find({});
        // Create an array to hold team info
        const teamInfo = [];
        // Iterate through each team
        for (const team of teams) {
            // Populate the surveys for the team
            const populatedTeam = yield Team_1.default.findOne({ _id: team._id }).populate({
                path: 'surveys',
                populate: {
                    path: 'responses.userId',
                    model: 'User',
                },
            });
            if (!populatedTeam) {
                return res.status(404).json({ message: 'Team not found' });
            }
            const teamSurveys = populatedTeam.surveys;
            // Calculate the number of members
            const numMembers = team.members.length;
            // Calculate the total number of survey submissions
            const totalSurveySubmissions = teamSurveys.reduce((total, survey) => total + survey.responses.length, 0);
            // Calculate the number of pending responses (responses with fewer answers than questions)
            const numPendingResponses = teamSurveys
                .map((survey) => survey.responses.some((response) => response.answers.length < survey.questions.length))
                .filter((hasPendingResponse) => hasPendingResponse).length;
            // Create an object with team info
            const teamInfoItem = {
                teamCode: team.teamCode,
                numMembers,
                totalSurveySubmissions,
                numPendingResponses,
            };
            // Push the team info to the array
            teamInfo.push(teamInfoItem);
        }
        // Return the team info array
        return res.status(200).json({ teamInfo });
    }
    catch (error) {
        next(error);
    }
});
exports.getTeamInfo = getTeamInfo;
//# sourceMappingURL=adminController.js.map