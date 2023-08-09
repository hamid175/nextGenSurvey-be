import { Request, Response, NextFunction } from 'express';
import Team, { ITeam } from '../models/Team'; 
import User from '../models/User';
import Survey from '../models/Survey';

// Controller function for creating a new team
export const createTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.body;

    // Check if the team code is already taken
    const existingTeam = await Team.findOne({ teamCode });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team code already exists' });
    }

    // Create the new team
    const newTeam = new Team({
      teamCode,
      members: [],
    });

    await newTeam.save();

    return res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for adding a user to a team
export const addMemberToTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;
    const { userId } = req.body;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Add the user to the team
    team.members.push(user._id);
    await team.save();

    return res.status(200).json({ message: 'User added to the team successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for removing a user from a team
export const removeMemberFromTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode, userId } = req.params;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove the user from the team
    team.members.pull(userId);
    await team.save();

    return res.status(200).json({ message: 'User removed from the team successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for setting the survey time frame for a team
export const setSurveyTimeFrame = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;
    const { startTime, endTime } = req.body;

    // Find the team
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Update the survey time frame for the team
    team.surveyStartTime = startTime;
    team.surveyEndTime = endTime;
    await team.save();

    return res.status(200).json({ message: 'Survey time frame set successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for getting survey data for a team
export const getSurveyData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.params;

    // Find the team and its associated survey data in the database
    const team = await Team.findOne({ teamCode }).populate('members', 'email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Retrieve survey data for the team from the database
    const surveys = await Survey.find({ _id: { $in: team.surveys } }, 'title responses');

    // Return the survey data to the client in the desired format
    return res.status(200).json({ team, surveys });
  } catch (error) {
    next(error);
  }
};
