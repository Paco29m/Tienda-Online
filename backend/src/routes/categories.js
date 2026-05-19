const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { categorySchema, categoryUpdateSchema } = require('../validations/categoryValidation');

/**
 * @route   GET /api/categories
 * @desc    Get all categories
 * @access  Public
 */
router.get('/', ctrl.getAll);

/**
 * @route   GET /api/categories/:id
 * @desc    Get a single category
 * @access  Public
 */
router.get('/:id', ctrl.getOne);

/**
 * @route   POST /api/categories
 * @desc    Create a category
 * @access  Admin
 */
router.post('/', authenticate, authorizeAdmin, validate(categorySchema), ctrl.create);

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Admin
 */
router.put('/:id', authenticate, authorizeAdmin, validate(categoryUpdateSchema), ctrl.update);

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Admin
 */
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
