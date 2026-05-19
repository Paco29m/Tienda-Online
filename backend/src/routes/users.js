const router = require('express').Router();
const ctrl = require('../controllers/userController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');

/**
 * @route   GET /api/users
 * @desc    Get all users
 * @access  Admin
 */
router.get('/', authenticate, authorizeAdmin, ctrl.getAll);

/**
 * @route   GET /api/users/:id
 * @desc    Get a single user
 * @access  Admin or own user
 */
router.get('/:id', authenticate, ctrl.getOne);

/**
 * @route   PUT /api/users/:id
 * @desc    Update a user (admin: any field; user: own profile only)
 * @access  Private
 */
router.put('/:id', authenticate, ctrl.update);

/**
 * @route   DELETE /api/users/:id
 * @desc    Delete a user
 * @access  Admin
 */
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
