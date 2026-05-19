const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { authenticate, authorizeAdmin } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { productSchema, productUpdateSchema } = require('../validations/productValidation');

/**
 * @route   GET /api/products
 * @desc    Get all products (supports ?category_id, ?search, ?page, ?limit)
 * @access  Public
 */
router.get('/', ctrl.getAll);

/**
 * @route   GET /api/products/:id
 * @desc    Get a single product by ID
 * @access  Public
 */
router.get('/:id', ctrl.getOne);

/**
 * @route   POST /api/products
 * @desc    Create a new product
 * @access  Admin
 */
router.post('/', authenticate, authorizeAdmin, validate(productSchema), ctrl.create);

/**
 * @route   PUT /api/products/:id
 * @desc    Update a product
 * @access  Admin
 */
router.put('/:id', authenticate, authorizeAdmin, validate(productUpdateSchema), ctrl.update);

/**
 * @route   DELETE /api/products/:id
 * @desc    Delete a product
 * @access  Admin
 */
router.delete('/:id', authenticate, authorizeAdmin, ctrl.remove);

module.exports = router;
