import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User, { IUser } from '../models/User';
import Team, { ITeam } from '../models/Team';
import CustomRequest from '../customRequest';
// Controller function for user registration
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, teamCode, password, confirmPassword } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Check if the password and confirm password match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user record in the database
    const newUser = new User({
      email,
      password: hashedPassword,
    });

    // Find the team based on the provided team code
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Add the user to the team
    team.members.push(newUser);
    await team.save();

    await newUser.save();

    return res.status(201).json({ message: 'User registered and added to the team successfully' });
  } catch (error) {
    next(error);
  }
};

// Controller function for user login
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token with the user's ID and other data
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Send the token as a response
    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    next(error);
  }
};

// Controller function for adding a user to a team
export const joinTeam = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.body;
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

    // Check if the user is already a member of the team
    if (team.members.includes(user._id)) {
      return res.status(400).json({ message: 'User is already a member of this team' });
    }

    // Add the user to the team
    team.members.push(user._id);
    await team.save();

    return res.status(200).json({ message: 'User added to the team successfully' });
  } catch (error) {
    next(error);
  }
};


interface TokenPayload {
    userId: string;
  }
// Controller function for user to switch teams
export const switchTeam = async (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const { teamCode } = req.body;
    const userId = req.user?.userId;

    // Find the team by team code
    const team = await Team.findOne({ teamCode });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the user is a member of the team
    const isMember = team.members.some((member) => member.equals(userId));
    if (!isMember) {
      return res.status(403).json({ message: 'User is not a member of the target team' });
    }

    // Update user's teams
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { currentTeam: team._id },
      { new: true }
    );

    return res.status(200).json({ message: 'User switched teams successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
};

  

// Export the controller functions
export default { registerUser, loginUser, joinTeam, switchTeam };
