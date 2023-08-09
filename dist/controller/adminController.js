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
exports.getSurveyData = exports.setSurveyTimeFrame = exports.removeMemberFromTeam = exports.addMemberToTeam = exports.createTeam = void 0;
const Team_1 = __importDefault(require("../models/Team"));
const User_1 = __importDefault(require("../models/User"));
const Survey_1 = __importDefault(require("../models/Survey"));
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
// Controller function for removing a user from a team
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
//# sourceMappingURL=adminController.js.map