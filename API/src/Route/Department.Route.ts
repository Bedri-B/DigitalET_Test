const express = require('express')
const router = express.Router()

const DepartmentController = require('../Controller/Department.Controller');

router.get('/', DepartmentController.List)

router.get('/:id', DepartmentController.Get)

router.post('/', DepartmentController.Create)

router.put('/:id', DepartmentController.Update)

router.delete('/:id', DepartmentController.Delete)
router.delete('/', DepartmentController.Delete)

module.exports = router
