import express from 'express';
import surveysController from '../controller/surveysController';
import * as adminController from '../controller/adminController';
import { authMiddleware } from '../middleware/authMiddleware';
import { adminAuthMiddleware } from '../middleware/authMiddleware';



const router = express.Router();

router.post('/login', adminController.adminLogin);

router.use(authMiddleware);

router.use(adminAuthMiddleware);

router.post('/', surveysController.createSurvey);

router.post('/teams', adminController.createTeam);

router.post('/teams/:teamCode/members', adminController.addMemberToTeam);

router.put('/teams/:teamCode/survey-time-frame', adminController.setSurveyTimeFrame);

router.get('/teams/:teamCode/survey-data', adminController.getSurveyData);

router.get('/admin/all', surveysController.getAllSurveyData);

router.get('/:surveyId', surveysController.getSurveyById);

router.get('/teams/count', adminController.getTotalNumberOfTeams);

router.get('/users/count', adminController.getTotalNumberOfUsers);

router.get('/responses/count', adminController.getTotalSurveyResponses);

router.get('/teams/info', adminController.getTeamInfo);

router.get('/admin/getallsurveys', surveysController.getAllSurveys);

router.delete('/teams/:teamCode/members/:userId', adminController.removeMemberFromTeam);

export default router;
