import express from 'express';
import * as adminController from '../controller/adminController';

const router = express.Router();

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

export default router;
