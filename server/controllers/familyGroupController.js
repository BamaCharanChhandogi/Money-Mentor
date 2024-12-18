// controllers/familyController.js
import FamilyGroup from '../models/familyGroupModel.js';
import Users from '../models/userModel.js';
import { sendInvitationEmail } from '../utils/index.js';

// Create a new family group
export const createFamily = async (req, res) => {
  try {
    const { name } = req.body;
    const family = new FamilyGroup({
      name,
      owner: req.user.id,
      members: [{ user: req.user.id, role: 'owner', status: 'active' }]
    });
    await family.save();
    
    // Populate user details
    await family.populate('members.user', 'name email');
    
    res.status(201).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all families for a user
export const getFamilies = async (req, res) => {
  try {
    const families = await FamilyGroup.find({
      'members.user': req.user.id
    }).populate('members.user', 'name email');
    
    res.status(200).json({ success: true, families });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Invite a member to family
export const inviteMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { familyId } = req.params;
    console.log(familyId, email);
    
    
    const invitedUser = await Users.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const family = await FamilyGroup.findById(familyId);
    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }

    // Check if user is already a member
    const isMember = family.members.some(member => 
      member.user.toString() === invitedUser._id.toString()
    );
    if (isMember) {
      return res.status(400).json({ success: false, message: 'User is already a member' });
    }

    family.members.push({
      user: invitedUser._id,
      role: 'member',
      status: 'pending'
    });
    await family.save();
    await family.populate('members.user', 'name email');

    // Send invitation email
    await sendInvitationEmail(email, family.name);

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Accept family invitation
export const acceptInvitation = async (req, res) => {
  try {
    const { familyId } = req.body;
    
    const family = await FamilyGroup.findOne({
      _id: familyId,
      'members.user': req.user.id,
      'members.status': 'pending'
    });

    if (!family) {
      return res.status(404).json({ success: false, message: 'Invitation not found' });
    }

    // Update member status
    const memberIndex = family.members.findIndex(
      member => member.user.toString() === req.user.id
    );
    family.members[memberIndex].status = 'active';
    
    await family.save();
    await family.populate('members.user', 'name email');

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get family details
export const getFamilyDetails = async (req, res) => {
  try {
    const { familyId } = req.params;
    
    const family = await FamilyGroup.findOne({
      _id: familyId,
      'members.user': req.user.id
    }).populate('members.user', 'name email');

    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found' });
    }

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update family settings
export const updateFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    const { name } = req.body;
    
    const family = await FamilyGroup.findOne({
      _id: familyId,
      'members.user': req.user.id,
      'members.role': { $in: ['owner', 'admin'] }
    });

    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found or unauthorized' });
    }

    family.name = name;
    await family.save();
    await family.populate('members.user', 'name email');

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Remove member from family
export const removeMember = async (req, res) => {
  try {
    const { familyId, memberId } = req.params;
    
    const family = await FamilyGroup.findOne({
      _id: familyId,
      'members.user': req.user.id,
      'members.role': { $in: ['owner', 'admin'] }
    });

    if (!family) {
      return res.status(404).json({ success: false, message: 'Family not found or unauthorized' });
    }

    // Cannot remove owner
    const memberToRemove = family.members.find(
      member => member.user.toString() === memberId
    );
    if (memberToRemove?.role === 'owner') {
      return res.status(400).json({ success: false, message: 'Cannot remove owner' });
    }

    family.members = family.members.filter(
      member => member.user.toString() !== memberId
    );
    
    await family.save();
    await family.populate('members.user', 'name email');

    res.status(200).json({ success: true, family });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};