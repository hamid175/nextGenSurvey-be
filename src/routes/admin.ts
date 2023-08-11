import express from 'express';
import surveysController from '../controller/surveysController';
import * as adminController from '../controller/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminAuthMiddleware } from '../middleware/authMiddleware';
import { submitSurveyResponse } from '../controller/surveysController';


const router = express.Router();

router.post('/login', adminController.adminLogin);
router.use(authMiddleware);

router.use(adminAuthMiddleware);
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

router.get('/admin/all', surveysController.getAllSurveyData);



router.get('/teams/count', adminController.getTotalNumberOfTeams);

router.get('/users/count', adminController.getTotalNumberOfUsers);

router.get('/responses/count', adminController.getTotalSurveyResponses);

router.get('/teams/info', adminController.getTeamInfo);

export default router;
