const express = require('express');
const courtController = require('../controllers/courtController');
const { validateCourtData, validateAvailability } = require('../middlewares/validation');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Court:
 *       type: object
 *       required:
 *         - name
 *         - location
 *       properties:
 *         id:
 *           type: integer
 *           description: ID único da quadra
 *         name:
 *           type: string
 *           description: Nome da quadra
 *         location:
 *           type: string
 *           description: Localização/endereço da quadra
 *         available:
 *           type: boolean
 *           description: Indica se a quadra está disponível para uso
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Data e hora de criação do registro
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Data e hora da última atualização do registro
 *       example:
 *         id: 1
 *         name: Quadra Central
 *         location: Av. Principal, 123
 *         available: true
 *         created_at: 2023-06-05T10:00:00Z
 *         updated_at: 2023-06-05T10:00:00Z
 */

/**
 * @swagger
 * /courts:
 *   post:
 *     summary: Cria uma nova quadra
 *     tags: [Courts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Quadra criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/courts', validateCourtData, courtController.create);

/**
 * @swagger
 * /courts:
 *   get:
 *     summary: Retorna todas as quadras
 *     tags: [Courts]
 *     parameters:
 *       - in: query
 *         name: available
 *         schema:
 *           type: boolean
 *         description: Filtrar apenas quadras disponíveis
 *     responses:
 *       200:
 *         description: Lista de quadras
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Court'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/courts', courtController.findAll);

/**
 * @swagger
 * /courts/{id}:
 *   get:
 *     summary: Busca uma quadra pelo ID
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da quadra
 *     responses:
 *       200:
 *         description: Detalhes da quadra
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/courts/:id', courtController.findById);

/**
 * @swagger
 * /courts/{id}:
 *   put:
 *     summary: Atualiza uma quadra
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da quadra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - location
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Quadra atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/courts/:id', validateCourtData, courtController.update);

/**
 * @swagger
 * /courts/{id}/availability:
 *   patch:
 *     summary: Atualiza a disponibilidade de uma quadra
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da quadra
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - available
 *             properties:
 *               available:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Disponibilidade atualizada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Court'
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.patch('/courts/:id/availability', validateAvailability, courtController.updateAvailability);

/**
 * @swagger
 * /courts/{id}:
 *   delete:
 *     summary: Exclui uma quadra
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da quadra
 *     responses:
 *       204:
 *         description: Quadra excluída com sucesso
 *       404:
 *         description: Quadra não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/courts/:id', courtController.delete);

module.exports = router;

