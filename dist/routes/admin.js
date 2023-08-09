"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController = __importStar(require("../controller/adminController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const authMiddleware_2 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.post('/login', adminController.adminLogin);
router.use(authMiddleware_1.authMiddleware);
router.use(authMiddleware_2.adminAuthMiddleware);
// API endpoint for creating a new team
router.post('/teams', adminController.createTeam);
// API endpoint for adding a user to a team
router.post('/teams/:teamCode/members', adminController.addMemberToTeam);
// API endpoint for removing a user from a team
router.delete('/teams/:teamCode/members/:userId', adminController.removeMemberFromTeam);
// API endpoint for setting the survey time frame for a team
router.put('/teams/:teamCode/survey-time-frame', adminController.setSurveyTimeFrame);
// API endpoint for getting survey data for a team
router.get('/teams/:teamCode/survey-data', adminController.getSurveyData);
router.get('/teams/count', adminController.getTotalNumberOfTeams);
router.get('/users/count', adminController.getTotalNumberOfUsers);
router.get('/responses/count', adminController.getTotalSurveyResponses);
router.get('/teams/info', adminController.getTeamInfo);
exports.default = router;
//# sourceMappingURL=admin.js.map